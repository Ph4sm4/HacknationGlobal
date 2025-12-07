import {Body, Controller, Post} from "@nestjs/common";
import {CertCheckerService} from "./cert-checker.service";
import{FetchCertInfoReqDto} from "./dto/request/fetch-cert-info-req.dto";
import {ReturnCertInfoDto} from "./dto/response/return-cert-info.dto";

@Controller('certificate')
export class CertCheckerController{
    constructor(
        private readonly certCheckerService: CertCheckerService
    ) {}

    @Post('check')
   // @UseGuards(JWTAuthGuard)
    async checkCertificates(@Body() dto: FetchCertInfoReqDto): Promise<ReturnCertInfoDto> {
        return this.certCheckerService.checkCertificates(dto.url);
    }
}