import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';
import { JWTTokensResponse } from '../types/types';

@Injectable()
export class PasswordStrategy extends PassportStrategy(Strategy, 'password') {
	constructor(private readonly authService: AuthService) {
		super({ usernameField: 'email' });
	}

	async validate(email: string, password: string): Promise<JWTTokensResponse> {
		const userTokens = await this.authService.validateUser(email, password);
		console.log('password strategy');

		if (!userTokens) {
			throw new UnauthorizedException('Invalid credentials');
		}

		return userTokens;
	}
}
