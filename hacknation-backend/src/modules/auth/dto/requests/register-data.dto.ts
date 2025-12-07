import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class RegisterDataDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@Length(5, 30)
	password: string;

	@IsNotEmpty()
	@Matches(
		/^(?=.{3,32}$)[A-Za-z0-9](?:[A-Za-z0-9]|[_-](?=[A-Za-z0-9]))*[A-Za-z0-9]$/
	)
	nickname: string;
}
