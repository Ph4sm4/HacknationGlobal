import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('qr-codes')
export class QrCodeEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	domain: string;

	@Column()
	validUntil: Date;

	@Column()
	used: boolean;

	@Column()
	webclientSocketId: string;
}
