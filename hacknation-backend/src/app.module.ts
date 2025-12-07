import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from './modules/auth/auth.module';
import { DomainProcessorModule } from './modules/domain-processor/domain-processor.module';
import { AppConfigModule } from './modules/shared/app-config/app-config.module';
import { AppConfigService } from './modules/shared/app-config/app-config.service';
import {CertCheckerModule} from "./modules/cert-checker/cert-checker.module";

@Module({
	imports: [
		AuthModule,
		AppConfigModule,
		TypeOrmModule.forRootAsync({
			imports: [AppConfigModule],
			inject: [AppConfigService],
			useFactory: (appConfigService: AppConfigService) => {
				return {
					type: 'postgres',
					host: appConfigService.dbHost,
					port: appConfigService.dbPort,
					database: appConfigService.dbName,
					username: appConfigService.dbUserName,
					password: appConfigService.dbPassword,
					autoLoadEntities: true,
					synchronize: false,
					ssl: appConfigService.dbSSLEnabled
						? { rejectUnauthorized: false }
						: false,
					namingStrategy: new SnakeNamingStrategy()
				};
			}
		}),
		PassportModule.register({
			session: true
		}),
		DomainProcessorModule,
		CertCheckerModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
