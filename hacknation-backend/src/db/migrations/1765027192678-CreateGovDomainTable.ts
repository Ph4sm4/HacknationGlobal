import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateGovDomainTable1765027192678 implements MigrationInterface {
    name = 'CreateGovDomainTable1765027192678'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "gov_domains" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_6f64e74d68859afdb7aa17a1335" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "gov_domains"`);
    }

}
