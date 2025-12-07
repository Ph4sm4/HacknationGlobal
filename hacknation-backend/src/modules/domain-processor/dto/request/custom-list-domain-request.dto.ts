import { IsNotEmpty, IsString } from 'class-validator';

export class CustomListDomainRequestDto {
	@IsNotEmpty()
	@IsString()
	name: string;
}
