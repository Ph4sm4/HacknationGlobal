import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';

@Injectable()
export class AppConfigService {
	constructor(private readonly configService: ConfigService) {}

	// DATABASE

	get dbName() {
		return this.configService.getOrThrow<string>('DB_NAME');
	}
	get dbUserName() {
		return this.configService.getOrThrow<string>('DB_USERNAME');
	}
	get dbPassword() {
		return this.configService.getOrThrow<string>('DB_PASSWORD');
	}

	get dbHost() {
		return this.configService.getOrThrow<string>('DB_HOST');
	}
	get dbPort() {
		return this.configService.getOrThrow<number>('DB_PORT');
	}
	get dbSSLEnabled() {
		return this.configService.getOrThrow<string>('DB_SSL_ENABLED') === 'true';
	}

	// SESSION

	get sessionSecret() {
		return this.configService.getOrThrow<string>('SESSION_SECRET');
	}

	// FRONTEND

	get appFrontendUrl() {
		return this.configService.getOrThrow<string>('FRONT_APP_URL');
	}

	// JWT
	get jwtAccessSecret() {
		return this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
	}
	get jwtAccessExpiresIn() {
		return this.configService.getOrThrow<StringValue>('JWT_ACCESS_EXPIRES_IN');
	}
	get jwtRefreshSecret() {
		return this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
	}
	get jwtRefreshExpiresIn() {
		return this.configService.getOrThrow<StringValue>('JWT_REFRESH_EXPIRES_IN');
	}

	// python

	get pythonApiUrl() {
		return this.configService.getOrThrow<string>('PYTHON_API_URL');
	}
}
