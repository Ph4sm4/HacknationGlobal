export interface CertificateInfo{
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

export interface ReturnCertInfoDto{
    host: string;
    port: number;
    overallTimeValid: boolean;
    isTrusted: boolean;
    trustError?: string | null;
    certificates: CertificateInfo[];
}

export interface DomainValidationResponseDto {
	domainIncludesGov: boolean;
	isInOfficialList: boolean;
    aiAnalysis: string,
	certificatesData: ReturnCertInfoDto;
}


export const testResponse : DomainValidationResponseDto = {
  domainIncludesGov: false,
  isInOfficialList: false,
  aiAnalysis: "aiAnalysisValue",
  certificatesData: {
    host: "example.com",
    port: 443,
    overallTimeValid: true,
    isTrusted: true,
    trustError: null,
    certificates: [
      {
        position: 0,
        subject: {
          CN: "example.com",
          O: "Example Corp",
          C: "US"
        },
        issuer: {
          CN: "Example Root CA",
          O: "Example Trust",
          C: "US"
        },
        validFrom: "2024-01-01T00:00:00Z",
        validTo: "2026-01-01T00:00:00Z",
        isTimeValid: true,
        subjectAltName: "DNS: example.com, DNS: www.example.com",
        fingerprint: "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99",
        isCA: false
      },
      {
        position: 1,
        subject: {
          CN: "Example Intermediate CA",
          O: "Example Trust",
          C: "US"
        },
        issuer: {
          CN: "Example Root CA",
          O: "Example Trust",
          C: "US"
        },
        validFrom: "2020-01-01T00:00:00Z",
        validTo: "2030-01-01T00:00:00Z",
        isTimeValid: true,
        fingerprint: "11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00",
        isCA: true
      }
    ]
  }
};
