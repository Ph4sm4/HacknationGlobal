import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginUserRequestDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(5)
	password: string;
}
