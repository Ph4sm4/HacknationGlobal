import { ReturnCertInfoDto } from 'src/modules/cert-checker/dto/response/return-cert-info.dto';

export class DomainValidationResponseDto {
	domainIncludesGov: boolean;
	isInOfficialList: boolean;
	aiAnalysis: string;
	certificatesData: ReturnCertInfoDto;
}
