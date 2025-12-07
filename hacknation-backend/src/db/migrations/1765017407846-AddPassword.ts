import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPassword1765017407846 implements MigrationInterface {
    name = 'AddPassword1765017407846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    }

}
