import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QrCodeEntity } from 'src/db/entities/qr-codes.entity';
import { BaseRepository } from 'src/modules/shared/repositories/base-repository';
import { Repository } from 'typeorm';

@Injectable()
export class QrCodesRepository extends BaseRepository<QrCodeEntity> {
	constructor(
		@InjectRepository(QrCodeEntity)
		protected readonly repository: Repository<QrCodeEntity>
	) {
		super(QrCodeEntity, repository);
	}
}
