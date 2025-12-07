import {
	Body,
	Controller,
	Get,
	Post,
	Query,
	ValidationPipe
} from '@nestjs/common';
import * as path from 'node:path';
import { DomainProcessorService } from './domain-processor.service';
import { CustomListDomainRequestDto } from './dto/request/custom-list-domain-request.dto';
import { DomainValidationRequestDto } from './dto/request/domain-validation-request.dto';
import { ListDomainRequestDto } from './dto/request/list-domain-request.dto';
import { QrCodeStringRequestDto } from './dto/request/qr-code-string-request.dto';

@Controller('domains')
export class DomainProcessorController {
	constructor(
		private readonly domainProcessorService: DomainProcessorService
	) {}

	@Post('insert')
	// @UseGuards(JWTAuthGuard)
	async insertGovDomanins() {
		const filePath = path.join('data', 'lista_gov_pl_z_www.csv');
		return this.domainProcessorService.injectToDb(filePath);
	}

	@Get('qr-code-string')
	// @UseGuards(JWTAuthGuard)
	async getQrCodeString(
		@Query(new ValidationPipe({ transform: true }))
		query: QrCodeStringRequestDto
	) {
		return await this.domainProcessorService.getQrCodeString(
			query.domain,
			query.webclientSocketId
		);
	}

	@Post('validate')
	//TODO: UNCOMMENT
	// @UseGuards(JWTAuthGuard)
	async validateDomain(@Body() body: DomainValidationRequestDto) {
		return this.domainProcessorService.performValidation(
			body.domain,
			body.webclientSocketId,
			body.id
		);
	}

	@Get('list/custom')
	async getCustomDomains(@Query() query: CustomListDomainRequestDto) {
		console.log(query.name);
		return await this.domainProcessorService.getDomainsCustom(query.name);
	}

	@Get('list')
	async getDomains(@Query() query: ListDomainRequestDto) {
		return await this.domainProcessorService.getDomains(query.offset);
	}
}
