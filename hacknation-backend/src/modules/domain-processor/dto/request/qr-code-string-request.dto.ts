import { IsString, MaxLength, MinLength } from 'class-validator';

export class QrCodeStringRequestDto {
	@IsString()
	@MinLength(3)
	domain: string;

	@IsString()
	@MinLength(3)
	@MaxLength(100)
	webclientSocketId: string;
}
