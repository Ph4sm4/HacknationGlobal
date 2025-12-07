export class CertificateInfo{
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

export class ReturnCertInfoDto{
    host: string;
    port: number;
    overallTimeValid: boolean;
    isTrusted: boolean;
    trustError?: string | null;
    certificates: CertificateInfo[];
}