export const tempValidationData: DomainValidationResult = {
	domainIncludesGov: false,
	aiAnalysis: 'Cos tam cos tam',
	certificatesData: {
		host: 'www.instagram.com',
		port: 443,
		overallTimeValid: true,
		isTrusted: true,
		trustError: null,
		certificates: [
			{
				position: 0,
				subject: {
					C: 'US',
					ST: 'California',
					L: 'Menlo Park',
					O: 'Meta Platforms, Inc.',
					CN: '*.www.instagram.com'
				},
				issuer: {
					C: 'US',
					O: 'DigiCert Inc',
					CN: 'DigiCert Global G2 TLS RSA SHA256 2020 CA1'
				},
				validFrom: 'Sep 15 00:00:00 2025 GMT',
				validTo: 'Dec 14 23:59:59 2025 GMT',
				isTimeValid: true,
				subjectAltName: 'DNS:*.www.instagram.com, DNS:www.instagram.com',
				fingerprint:
					'0E:C7:A2:B3:A8:BF:80:17:FB:64:FC:40:A0:48:FF:35:E7:8A:09:95',
				isCA: false
			},
			{
				position: 1,
				subject: {
					C: 'US',
					O: 'DigiCert Inc',
					CN: 'DigiCert Global G2 TLS RSA SHA256 2020 CA1'
				},
				issuer: {
					C: 'US',
					O: 'DigiCert Inc',
					OU: 'www.digicert.com',
					CN: 'DigiCert Global Root G2'
				},
				validFrom: 'Mar 30 00:00:00 2021 GMT',
				validTo: 'Mar 29 23:59:59 2031 GMT',
				isTimeValid: true,
				fingerprint:
					'1B:51:1A:BE:AD:59:C6:CE:20:70:77:C0:BF:0E:00:43:B1:38:26:12',
				isCA: true
			},
			{
				position: 2,
				subject: {
					C: 'US',
					O: 'DigiCert Inc',
					OU: 'www.digicert.com',
					CN: 'DigiCert Global Root G2'
				},
				issuer: {
					C: 'US',
					O: 'DigiCert Inc',
					OU: 'www.digicert.com',
					CN: 'DigiCert Global Root G2'
				},
				validFrom: 'Aug  1 12:00:00 2013 GMT',
				validTo: 'Jan 15 12:00:00 2038 GMT',
				isTimeValid: true,
				fingerprint:
					'DF:3C:24:F9:BF:D6:66:76:1B:26:80:73:FE:06:D1:CC:8D:4F:82:A4',
				isCA: true
			}
		]
	},
	isInOfficialList: false
};

export interface DomainValidationResult {
	domainIncludesGov: boolean;
	isInOfficialList: boolean;
	aiAnalysis: string;
	certificatesData: ReturnCertInfoDto;
}

export interface CertificateInfo {
	position: number;
	subject: any;
	issuer: any;
	validFrom: string;
	validTo: string;
	isTimeValid: boolean;
	subjectAltName?: string;
	fingerprint?: string;
	isCA?: boolean;
}

export interface ReturnCertInfoDto {
	host: string;
	port: number;
	overallTimeValid: boolean;
	isTrusted: boolean;
	trustError?: string | null;
	certificates: CertificateInfo[];
}
