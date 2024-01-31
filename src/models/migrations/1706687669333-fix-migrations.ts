import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixMigrations1706687669333 implements MigrationInterface {
    name = 'FixMigrations1706687669333';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user_premiums" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_premiums" DROP CONSTRAINT "PK_f9564798dffc6f1ee63ba6e962a"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_premiums" ADD CONSTRAINT "PK_9698f64561bef31d2ac9c0b176e" PRIMARY KEY ("profile_id", "id")`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_premiums" DROP CONSTRAINT "PK_9698f64561bef31d2ac9c0b176e"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_premiums" ADD CONSTRAINT "PK_5d976e08d278dc587d445aca535" PRIMARY KEY ("id")`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_premiums" DROP COLUMN "profile_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_premiums" ADD "profile_id" character varying NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "user_premiums" DROP COLUMN "profile_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_premiums" ADD "profile_id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_premiums" DROP CONSTRAINT "PK_5d976e08d278dc587d445aca535"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_premiums" ADD CONSTRAINT "PK_9698f64561bef31d2ac9c0b176e" PRIMARY KEY ("profile_id", "id")`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_premiums" DROP CONSTRAINT "PK_9698f64561bef31d2ac9c0b176e"`,
        );
        await queryRunner.query(
            `ALTER TABLE "user_premiums" ADD CONSTRAINT "PK_f9564798dffc6f1ee63ba6e962a" PRIMARY KEY ("profile_id")`,
        );
        await queryRunner.query(`ALTER TABLE "user_premiums" DROP COLUMN "id"`);
    }
}
