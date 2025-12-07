import {
	BadRequestException,
	ConflictException,
	GoneException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import * as argon2 from 'argon2';
import * as fs from 'node:fs';
import * as readline from 'node:readline';
import { GovDomainEntity } from 'src/db/entities/gov-domain.entity';
import { ILike } from 'typeorm';
import { CertCheckerService } from '../cert-checker/cert-checker.service';
import { ReturnCertInfoDto } from '../cert-checker/dto/response/return-cert-info.dto';
import { AppConfigService } from '../shared/app-config/app-config.service';
import { SuccessOnlyResponseDto } from '../shared/dto/response/success-only-response.dto';
import { DomainValidationResponseDto } from './dto/response/domain-validation-response.dto';
import { DomainValidationGateway } from './gateways/domain-validation/domain-validation.gateway';
import { WSResponse } from './gateways/domain-validation/ws-events';
import { DomainProcessorRepository } from './repositories/domain-processor.repository';
import { QrCodesRepository } from './repositories/qr-codes.repository';

@Injectable()
export class DomainProcessorService {
	constructor(
		private readonly domainProcessorRepository: DomainProcessorRepository,
		private readonly gateway: DomainValidationGateway,
		private readonly certCheckerService: CertCheckerService,
		private readonly qrCodesRepository: QrCodesRepository,
		private readonly appConfigService: AppConfigService
	) {}

	private async *lines(filePath: string): AsyncGenerator<string> {
		const stream = fs.createReadStream(filePath, { encoding: 'utf-8' });

		const rl = readline.createInterface({
			input: stream,
			crlfDelay: Infinity
		});

		for await (const line of rl) {
			const trimmed = line.trim();
			if (!trimmed) continue;
			yield trimmed;
		}
	}

	async injectToDb(filePath: string) {
		const entities: GovDomainEntity[] = [];
		for await (const line of this.lines(filePath)) {
			const entity = new GovDomainEntity();
			entity.name = line;
			entities.push(entity);
		}

		await this.domainProcessorRepository.saveMany(entities);

		return new SuccessOnlyResponseDto(true);
	}

	async getQrCodeString(domain: string, webclientSocketId: string) {
		const hashedDomain = await argon2.hash(domain);
		const x = await this.qrCodesRepository.findOne({
			webclientSocketId: webclientSocketId
		});

		if (x) {
			await this.qrCodesRepository.delete(x.id);
		}

		console.log('generating qr code', webclientSocketId);

		const validUntil: Date = new Date(new Date().getTime() + 1000 * 60 * 2); // 2 minutes to the future

		const created = await this.qrCodesRepository.save({
			domain: hashedDomain,
			validUntil: validUntil,
			used: false,
			webclientSocketId: webclientSocketId
		});

		return `${created.id};${domain};${webclientSocketId}`;
	}

	async performValidation(domain: string, clientId: string, id: string) {
		console.log('validation:', domain, clientId, id);
		const isLocalhost = /^https?:\/\/localhost(:\d+)?/i.test(domain);

		if (isLocalhost) {
			this.gateway.server
				.to(clientId)
				.emit(WSResponse.domainValidationResult, { code: 400, data: null });
			console.log('localhost wrongggg');
			throw new BadRequestException('localhost is not allowed as a domain');
		}

		const exists = await this.qrCodesRepository.findById(id);
		if (!exists) {
			console.log('does not exist');
			this.gateway.server
				.to(clientId)
				.emit(WSResponse.domainValidationResult, { code: 404, data: null });
			throw new NotFoundException('QR code not found');
		}

		if (exists.validUntil.getTime() < new Date().getTime()) {
			console.log('qr expired');
			this.gateway.server
				.to(clientId)
				.emit(WSResponse.domainValidationResult, { code: 410, data: null });
			throw new GoneException('QR code has expired');
		}

		if (exists.used) {
			console.log('qr already used');
			this.gateway.server
				.to(clientId)
				.emit(WSResponse.domainValidationResult, { code: 409, data: null });
			throw new ConflictException('QR code has already been used');
		}

		/*
			we do realize that there is a slight window for unrestricted access
			mainly, because of the fact that the api is currently public without any guards
			allowing a person to quickly copy the qr code, hard-code the value and display it on the phishing site

			this would create a situation in which on a phishing website, we would be displaying qr code
			from a different website (a valid one) -> scanning would result in a successful validation even though
			the website is invalid. BUT WE CANNOT DO NOTHING ABOUT IT AS WE ARE UNABLE TO GENERATE ACCESS TOKENS
			WITHOUT THE LOGIN FLOW
		*/

		await this.qrCodesRepository.update(id, {
			used: true
		});

		const validationData = new DomainValidationResponseDto();
		const trimmed = domain.trim();
		const withProto =
			trimmed.startsWith('http://') || trimmed.startsWith('https://')
				? trimmed
				: `https://${trimmed}`;

		domain = withProto;

		validationData.domainIncludesGov = this.checkGov(domain);

		let middleRes: ReturnCertInfoDto;
		try {
			console.log('checking certs');
			middleRes = await this.certCheckerService.checkCertificates(domain);
			console.log('checked cert good');
		} catch (err: any) {
			this.gateway.server
				.to(clientId)
				.emit(WSResponse.domainValidationResult, { code: 404, data: null });
			console.log('domain does not exist');
			throw new NotFoundException('Domain does not exist');
		}

		validationData.certificatesData = middleRes;

		validationData.isInOfficialList = await this.checkInOfficialList(domain);

		console.log('getting from ai');
		// get ai feedback from python
		validationData.aiAnalysis = await this.getAIFeedback(domain);

		this.gateway.server
			.to(clientId)
			.emit(WSResponse.domainValidationResult, { data: validationData });
		console.log('emitted returning data');

		return {
			data: validationData
		};
	}

	private async checkInOfficialList(url: string) {
		console.log(new URL(url).hostname);
		const x = await this.domainProcessorRepository.findOne({
			name: new URL(url).hostname
		});

		return Boolean(x);
	}

	private async getAIFeedback(url: string) {
		try {
			const u = new URL(url);

			console.log('fetch9ngggg', u.href);
			return await fetch(this.appConfigService.pythonApiUrl + '/check_url', {
				method: 'POST',
				body: JSON.stringify({
					url: u.href
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then((res) => res.json())
				.then((data: { url: string; prediction: string }) => {
					console.log(data);
					return data.prediction;
				});
		} catch (e) {
			throw new BadRequestException('Invalid URL format');
		}
	}

	private checkGov(domain: string): boolean {
		const hostname = new URL(domain).hostname;
		return hostname.includes('.gov');
	}

	async getDomainsCustom(name: string) {
		console.log(name);
		return await this.domainProcessorRepository.find(
			{
				name: ILike(`%${name}%`)
			},
			{},
			100
		);
	}

	async getDomains(offset: number) {
		return await this.domainProcessorRepository.find(
			undefined,
			undefined,
			100,
			offset
		);
	}
}
