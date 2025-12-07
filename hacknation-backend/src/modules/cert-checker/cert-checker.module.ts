import { Module } from '@nestjs/common';
import { CertCheckerController } from './cert-checker.controller';
import { CertCheckerService } from './cert-checker.service';

@Module({
	providers: [CertCheckerService],
	controllers: [CertCheckerController],
	exports: [CertCheckerService]
})
export class CertCheckerModule {}
