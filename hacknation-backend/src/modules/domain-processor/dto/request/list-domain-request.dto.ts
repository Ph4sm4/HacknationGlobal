import { IsNotEmpty, IsNumber } from 'class-validator';

export class ListDomainRequestDto {
	@IsNumber()
	@IsNotEmpty()
	offset: number;
}
