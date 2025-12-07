import {
	BadRequestException,
	Inject,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserEntity } from 'src/db/entities/user.entity';
import { AppConfigService } from 'src/modules/shared/app-config/app-config.service';
import { SuccessOnlyResponseDto } from 'src/modules/shared/dto/response/success-only-response.dto';
import { AppAccessToken, AppRefreshToken } from 'src/modules/shared/types/ids';
import { UserService } from 'src/modules/user/user.service';
import { DataSource } from 'typeorm';
import {
	adjectives,
	animals,
	colors,
	NumberDictionary,
	uniqueNamesGenerator
} from 'unique-names-generator';
import { RegisterDataDto } from '../dto/requests/register-data.dto';
import {
	AccessTokenPayload,
	JWTTokensResponse,
	RefreshTokenPayload
} from '../types/types';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,

		@Inject('JWT_ACCESS_SERVICE')
		private readonly accessTokenService: JwtService,

		@Inject('JWT_REFRESH_SERVICE')
		private readonly refreshTokenService: JwtService,

		private readonly appConfigService: AppConfigService,

		private readonly dataSource: DataSource
	) {}

	generateNickname() {
		// 245 billion possible nicknames
		return uniqueNamesGenerator({
			dictionaries: [
				adjectives,
				animals,
				colors,
				NumberDictionary.generate({ min: 1, max: 10000 })
			],
			separator: '-'
		});
	}

	async registerUser(user: RegisterDataDto): Promise<JWTTokensResponse> {
		const { email, password, nickname } = user;

		const existingEmail = await this.userService.getOne({
			email
		});
		if (existingEmail) {
			throw new BadRequestException('Email already in use');
		}

		const existingNickname = await this.userService.getOne({
			nickname
		});
		if (existingNickname) {
			throw new BadRequestException('Nickname already in use');
		}

		const newUser = await this.userService.create({
			email,
			password,
			nickname
		});

		return this.issueAppJWT(newUser);
	}

	async validateUser(email: string, password: string) {
		console.log(email, password);
		try {
			const user =
				await this.userService.getOneByEmailWithPasswordOrThrow(email);

			console.log('user validation:', user);
			const isPasswordValid = await argon2.verify(user.password, password);
			console.log('is password valid:', isPasswordValid);

			return isPasswordValid ? this.issueAppJWT(user) : null;
		} catch (error) {
			throw error;
		}
	}

	async deleteUser(userId: string) {
		await this.userService.delete(userId);

		return new SuccessOnlyResponseDto(true);
	}

	async findUserById(id: string) {
		const user = await this.userService.getOneByIdOrThrow(id);

		return user;
	}

	issueAppJWT(user: UserEntity) {
		console.log('issuing app jwt', user);
		const newAccessToken = this.accessTokenService.sign<AccessTokenPayload>({
			sub: user.id,
			email: user.email,
			nickname: user.nickname
		}) as AppAccessToken;

		const newRefreshToken = this.refreshTokenService.sign<RefreshTokenPayload>({
			sub: user.id
		}) as AppRefreshToken;

		return {
			accessToken: newAccessToken,
			refreshToken: newRefreshToken
		};
	}

	async refreshToken(refreshToken: AppRefreshToken) {
		let user: UserEntity;
		try {
			const oldPayload: RefreshTokenPayload =
				await this.refreshTokenService.verify(refreshToken, {
					secret: this.appConfigService.jwtRefreshSecret
				});

			user = await this.userService.getOneByIdOrThrow(oldPayload.sub);
		} catch (err: any) {
			console.error('refresh token');
			throw new UnauthorizedException();
		}

		return this.issueAppJWT(user);
	}
}
