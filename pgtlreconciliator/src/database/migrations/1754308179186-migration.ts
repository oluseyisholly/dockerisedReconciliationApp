import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1754308179186 implements MigrationInterface {
    name = 'Migration1754308179186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reconciliation_files" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "fileName" character varying NOT NULL, "path" character varying NOT NULL, "uploadedAt" TIMESTAMP NOT NULL DEFAULT now(), "reconciliationJobId" integer, CONSTRAINT "PK_68a758e3f3688e6abfe62a9ef83" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reconciliation_jobs" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "name" character varying NOT NULL, "jobId" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "reportPath" character varying, "errorMessage" text, CONSTRAINT "PK_bfaf38b9876b3eb9191ffb77179" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reconciliation_files" ADD CONSTRAINT "FK_289bac6bfe4df4d5557beb57c03" FOREIGN KEY ("reconciliationJobId") REFERENCES "reconciliation_jobs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reconciliation_files" DROP CONSTRAINT "FK_289bac6bfe4df4d5557beb57c03"`);
        await queryRunner.query(`DROP TABLE "reconciliation_jobs"`);
        await queryRunner.query(`DROP TABLE "reconciliation_files"`);
    }

}
