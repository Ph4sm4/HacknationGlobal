import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EnvValidationSchema {
	// Database
	@IsString()
	@IsNotEmpty()
	DB_NAME: string;

	@IsString()
	@IsNotEmpty()
	DB_USERNAME: string;

	@IsString()
	@IsNotEmpty()
	DB_PASSWORD: string;

	@IsString()
	@IsNotEmpty()
	DB_HOST: string;

	@IsNumber()
	@IsNotEmpty()
	DB_PORT: number;

	@IsBoolean()
	@IsNotEmpty()
	DB_SSL_ENABLED: boolean;

	// SESSION
	@IsString()
	@IsNotEmpty()
	SESSION_SECRET: string;

	@IsString()
	@IsNotEmpty()
	PYTHON_API_URL: string;
}
