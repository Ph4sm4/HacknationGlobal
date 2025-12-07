import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/db/entities/user.entity';
import { EntityManager, FindOptionsSelect, Repository } from 'typeorm';
import { BaseRepository } from '../shared/repositories/base-repository';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
	constructor(
		@InjectRepository(UserEntity)
		protected readonly repository: Repository<UserEntity>
	) {
		super(UserEntity, repository);
	}

	async findByEmail(
		email: string,
		manager?: EntityManager,
		select?: FindOptionsSelect<UserEntity>
	): Promise<UserEntity | null> {
		const repo = this.getRepo(manager);

		return repo.findOne({ where: { email }, select });
	}
}
