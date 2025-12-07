import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GovDomainEntity } from 'src/db/entities/gov-domain.entity';
import { BaseRepository } from 'src/modules/shared/repositories/base-repository';
import { Repository } from 'typeorm';

@Injectable()
export class DomainProcessorRepository extends BaseRepository<GovDomainEntity> {
	constructor(
		@InjectRepository(GovDomainEntity)
		protected readonly repository: Repository<GovDomainEntity>
	) {
		super(GovDomainEntity, repository);
	}
}
