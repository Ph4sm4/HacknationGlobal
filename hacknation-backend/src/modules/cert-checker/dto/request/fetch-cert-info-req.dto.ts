import {IsNotEmpty, IsUrl} from "class-validator";

export class FetchCertInfoReqDto{
    @IsNotEmpty()
    @IsUrl({
        require_tld: false
    })
    url: string;
}