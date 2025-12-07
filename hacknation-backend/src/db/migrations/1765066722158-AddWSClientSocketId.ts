import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWSClientSocketId1765066722158 implements MigrationInterface {
    name = 'AddWSClientSocketId1765066722158'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qr-codes" ADD "webclient_socket_id" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "qr-codes" DROP COLUMN "webclient_socket_id"`);
    }

}
