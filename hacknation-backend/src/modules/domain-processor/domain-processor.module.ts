import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GovDomainEntity } from 'src/db/entities/gov-domain.entity';
import { QrCodeEntity } from 'src/db/entities/qr-codes.entity';
import { CertCheckerModule } from '../cert-checker/cert-checker.module';
import { DomainProcessorController } from './domain-processor.controller';
import { DomainProcessorService } from './domain-processor.service';
import { DomainValidationGateway } from './gateways/domain-validation/domain-validation.gateway';
import { DomainProcessorRepository } from './repositories/domain-processor.repository';
import { QrCodesRepository } from './repositories/qr-codes.repository';

@Module({
	providers: [
		DomainProcessorRepository,
		DomainProcessorService,
		DomainValidationGateway,
		QrCodesRepository
	],
	imports: [
		TypeOrmModule.forFeature([GovDomainEntity, QrCodeEntity]),
		CertCheckerModule
	],
	controllers: [DomainProcessorController],
	exports: []
})
export class DomainProcessorModule {}
