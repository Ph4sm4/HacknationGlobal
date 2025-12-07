import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
	name: 'users'
})
export class UserEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	email: string;

	@Column({ unique: true })
	nickname: string;

	@Column()
	password: string;
}
