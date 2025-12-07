import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import helmet from 'helmet';
import * as passport from 'passport';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api');
	app.use(
		session({
			secret: process.env.SESSION_SECRET,
			saveUninitialized: false,
			resave: false,
			cookie: {
				maxAge: 1000 * 60
			}
		})
	);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true
			}
		})
	);

	app.use(passport.initialize());
	app.use(passport.session());

	app.use(helmet());

	app.enableCors({
		origin: '*' //TODO: in prod change that to the desired allowed domains
	});

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
