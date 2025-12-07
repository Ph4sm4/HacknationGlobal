export interface BogusCertificate {
  position: number;
  subject: Record<string, string>;
  issuer: Record<string, string>;
  validFrom: string;
  validTo: string;
  isTimeValid: boolean;
  subjectAltName?: string;
  fingerprint?: string;
  isCA?: boolean;
}

export interface BogusCertData {
  host: string;
  port: number;
  overallTimeValid: boolean;
  isTrusted: boolean;
  trustError?: string | null;
  certificates: BogusCertificate[];
}

export interface BogusData {
  domainIncludesGov: boolean;
  isInOfficialList: boolean;
  certificatesData: BogusCertData;
}
