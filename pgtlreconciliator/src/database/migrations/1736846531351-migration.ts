import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1736846531351 implements MigrationInterface {
    name = 'Migration1736846531351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "event" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "name" character varying NOT NULL, "time" TIMESTAMP, "duration" integer, "userId" integer, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "password" character varying NOT NULL, "emailAddress" character varying NOT NULL, CONSTRAINT "UQ_eea9ba2f6e1bb8cb89c4e672f62" UNIQUE ("emailAddress"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_01cd2b829e0263917bf570cb672" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_01cd2b829e0263917bf570cb672"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "event"`);
    }

}
