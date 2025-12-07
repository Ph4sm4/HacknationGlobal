import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { AppConfigService } from '../shared/app-config/app-config.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JWTStrategy } from './strategies/jwt.strategy';
import { PasswordStrategy } from './strategies/password.strategy';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity]), UserModule], // here we inject the user entity
	controllers: [AuthController],
	providers: [
		{
			provide: 'JWT_ACCESS_SERVICE',
			inject: [AppConfigService],
			useFactory: (appConfigService: AppConfigService) => {
				return new JwtService({
					secret: appConfigService.jwtAccessSecret,
					signOptions: {
						expiresIn: appConfigService.jwtAccessExpiresIn
					}
				});
			}
		},
		{
			provide: 'JWT_REFRESH_SERVICE',
			inject: [AppConfigService],
			useFactory: (appConfigService: AppConfigService) => {
				return new JwtService({
					secret: appConfigService.jwtRefreshSecret,
					signOptions: {
						expiresIn: appConfigService.jwtRefreshExpiresIn
					}
				});
			}
		},
		AuthService,
		AppConfigService,
		JWTStrategy,
		PasswordStrategy
	]
})
export class AuthModule {}
