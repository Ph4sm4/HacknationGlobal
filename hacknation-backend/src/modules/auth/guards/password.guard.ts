import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { LoginUserRequestDto } from '../dto/requests/login-user-request.dto';

@Injectable()
export class PasswordAuthGuard
	extends AuthGuard('password')
	implements CanActivate
{
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: Request = context.switchToHttp().getRequest();

		const dto = plainToInstance(LoginUserRequestDto, request.body);
		const errors = await validate(dto);

		if (errors.length > 0) {
			throw new BadRequestException(errors);
		}

		return super.canActivate(context) as Promise<boolean>;
	}
}
