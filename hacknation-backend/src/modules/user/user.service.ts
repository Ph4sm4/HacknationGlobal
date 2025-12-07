import {
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { UserEntity } from 'src/db/entities/user.entity';
import { EntityManager, FindOptionsOrder, FindOptionsWhere } from 'typeorm';
import { CreateUserReqDto } from './dto/request/create-user-req.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async getOneByIdOrThrow(id: string): Promise<UserEntity> {
		const user = await this.userRepository.findById(id);

		if (!user)
			throw new NotFoundException(`User with id: ${id} does not exist`);

		return user;
	}

	async getOneOrThrow(where?: FindOptionsWhere<UserEntity>) {
		const u = await this.userRepository.findOne({
			...where
		});

		if (!u)
			throw new NotFoundException(`User with data: ${where} does not exist`);

		return u;
	}

	public readonly nicknameValidationReg =
		/^(?=.{3,32}$)[A-Za-z0-9](?:[A-Za-z0-9]|[_-](?=[A-Za-z0-9]))*[A-Za-z0-9]$/;

	async isNicknameAvailable(nickname: string) {
		if (!this.nicknameValidationReg.test(nickname)) return false;

		const u = await this.getOne({
			nickname: nickname
		});
		console.log(u);

		return !u;
	}

	async getOne(where?: FindOptionsWhere<UserEntity>) {
		const u = await this.userRepository.findOne({
			...where
		});

		return u;
	}

	async getOneByEmailWithPasswordOrThrow(email: string): Promise<UserEntity> {
		const user = await this.userRepository.findByEmail(email, null, {
			id: true,
			email: true,
			password: true,
			nickname: true
		});

		if (!user) {
			throw new UnauthorizedException(
				`User with given email: ${email} not found`
			);
		}

		return user;
	}

	async getMany(
		where?: FindOptionsWhere<UserEntity>,
		order?: FindOptionsOrder<UserEntity>,
		limit?: number
	) {
		const users = await this.userRepository.find(
			{
				...where
			},
			order,
			limit
		);

		return users;
	}

	async create(
		dto: CreateUserReqDto,
		entityManager?: EntityManager
	): Promise<UserEntity> {
		const user = new UserEntity();

		user.email = dto.email;
		user.nickname = dto.nickname;
		user.password = dto.password ? await argon2.hash(dto.password) : null;

		return this.userRepository.save(user, entityManager);
	}

	async delete(id: string, manager?: EntityManager) {
		return await this.userRepository.delete(id, manager);
	}

	async update(
		id: string,
		data: Partial<UserEntity>,
		manager?: EntityManager
	): Promise<UserEntity> {
		const user = await this.getOneByIdOrThrow(id);

		if (data.email) {
			user.email = data.email;
		}

		if (data.nickname) {
			user.nickname = data.nickname;
		}

		return this.userRepository.update(id, data, manager);
	}
}
