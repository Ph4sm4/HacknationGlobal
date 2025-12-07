import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from 'src/db/entities/user.entity';
import { AppConfigService } from 'src/modules/shared/app-config/app-config.service';
import { UserService } from 'src/modules/user/user.service';
import { JWTPayload, UserDetails } from '../types/types';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private readonly appConfigService: AppConfigService,
		private readonly userService: UserService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: appConfigService.jwtAccessSecret
		});
	}

	async validate(payload: JWTPayload): Promise<UserDetails> {
		let user: UserEntity;

		try {
			user = await this.userService.getOneByIdOrThrow(payload.sub);

			return {
				id: user.id,
				email: user.email,
				nickname: user.nickname
			};
		} catch (err: any) {
			console.log('errored jwt strategy:', err);
			throw new UnauthorizedException('Invalid token');
		}
	}
}
