import { BadRequestException, Injectable } from '@nestjs/common';
import * as tls from 'tls';
import {
	CertificateInfo,
	ReturnCertInfoDto
} from './dto/response/return-cert-info.dto';

@Injectable()
export class CertCheckerService {
	normalizeHost(input: string): { host: string; port: number } {
		if (!input || typeof input !== 'string') {
			throw new BadRequestException('Invalid URL address.');
		}

		const trimmed = input.trim();
		const withProto =
			trimmed.startsWith('http://') || trimmed.startsWith('https://')
				? trimmed
				: `https://${trimmed}`;
		let url: URL;
		try {
			url = new URL(withProto);
		} catch (e) {
			throw new BadRequestException('Invalid URL address.');
		}
		if (!url.hostname) {
			throw new BadRequestException('Invalid URL address.');
		}
		const port = url.port ? Number(url.port) : 443;
		return { host: url.hostname, port };
	}

	async checkCertificates(url: string): Promise<ReturnCertInfoDto> {
		const { host, port } = this.normalizeHost(url);
		console.log('check certs:', host, port);

		return new Promise<ReturnCertInfoDto>((resolve) => {
			const socket = tls.connect(
				{
					host,
					port,
					servername: host,
					rejectUnauthorized: false,
					timeout: 5000
				},
				() => {
					const peer = socket.getPeerCertificate(true);

					if (!peer || Object.keys(peer).length === 0) {
						socket.end();
						return resolve({
							host,
							port,
							overallTimeValid: false,
							isTrusted: false,
							trustError: 'NO_CERTIFICATE',
							certificates: []
						});
					}

					const chain: any[] = [];
					let current: any = peer;

					while (current && current.fingerprint) {
						chain.push(current);
						if (
							!current.issuerCertificate ||
							current.issuerCertificate === current
						) {
							break;
						}
						current = current.issuerCertificate;
					}

					const now = new Date();

					const certificates: CertificateInfo[] = chain.map((c, idx) => {
						const from = new Date(c.valid_from);
						const to = new Date(c.valid_to);

						return {
							position: idx,
							subject: c.subject,
							issuer: c.issuer,
							validFrom: c.valid_from,
							validTo: c.valid_to,
							isTimeValid: now >= from && now <= to,
							subjectAltName: c.subjectaltname,
							fingerprint: c.fingerprint,
							isCA: c.ca
						};
					});

					const overallTimeValid = certificates.every((c) => c.isTimeValid);
					const isTrusted = socket.authorized;
					let trustError: string | null = null;
					if (socket.authorizationError) {
						trustError =
							typeof socket.authorizationError === 'string'
								? socket.authorizationError
								: socket.authorizationError.message;
					}

					socket.end();

					resolve({
						host,
						port,
						overallTimeValid,
						isTrusted,
						trustError,
						certificates
					});
				}
			);

			socket.on('error', () => {
				resolve({
					host,
					port,
					overallTimeValid: false,
					isTrusted: false,
					trustError: 'TLS_CONNECTION_FAILED',
					certificates: []
				});
			});

			socket.on('timeout', () => {
				socket.destroy();
				resolve({
					host,
					port,
					overallTimeValid: false,
					isTrusted: false,
					trustError: 'TLS_TIMEOUT',
					certificates: []
				});
			});
		});
	}
}
