import { IsNotEmpty, IsString, IsUrl, IsUUID } from 'class-validator';

export class DomainValidationRequestDto {
	@IsUUID()
	@IsNotEmpty()
	id: string;

	@IsNotEmpty()
	@IsUrl({ require_tld: false })
	domain: string;

	@IsNotEmpty()
	@IsString()
	webclientSocketId: string;
}
