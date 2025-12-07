import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateQrCodesTable1765057060044 implements MigrationInterface {
    name = 'CreateQrCodesTable1765057060044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "qr-codes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "domain" character varying NOT NULL, "valid_until" TIMESTAMP NOT NULL, "used" boolean NOT NULL, CONSTRAINT "PK_509284690a370e6ee8a323e729f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "qr-codes"`);
    }

}
