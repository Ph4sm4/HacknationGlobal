import {
	Body,
	Controller,
	Delete,
	Get,
	Post,
	Req,
	UseGuards
} from '@nestjs/common';
import { Request } from 'express';
import { AppConfigService } from 'src/modules/shared/app-config/app-config.service';
import { AppAccessToken, AppRefreshToken } from 'src/modules/shared/types/ids';
import { LoginUserRequestDto } from '../dto/requests/login-user-request.dto';
import { RefreshTokenRequestDto } from '../dto/requests/refresh-token-request-dto';
import { RegisterDataDto } from '../dto/requests/register-data.dto';
import { JWTAuthGuard } from '../guards/jwt.guard';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly appConfigService: AppConfigService
	) {}

	@Post('refresh-token')
	handleRefreshToken(@Body() body: RefreshTokenRequestDto): Promise<{
		accessToken: AppAccessToken;
		refreshToken: AppRefreshToken;
	}> {
		return this.authService.refreshToken(body.refreshToken);
	}

	@Post('register')
	async handleRegisterUser(@Body() body: RegisterDataDto) {
		return this.authService.registerUser(body);
	}

	@Post('login')
	async handleLoginUser(@Body() body: LoginUserRequestDto) {
		console.log('login triggered');
		return this.authService.validateUser(body.email, body.password);
	}

	@Delete('me')
	@UseGuards(JWTAuthGuard)
	async handleUserDelete(@Req() req: Request) {
		const reqU = req.user;

		return this.authService.deleteUser(reqU.id);
	}

	@Get('me')
	me(@Req() request: Request) {
		console.log(request.user);

		return request.user ?? { msg: 'Not authorized' };
	}
}
