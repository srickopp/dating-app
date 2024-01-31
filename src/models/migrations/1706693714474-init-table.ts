import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTable1706693714474 implements MigrationInterface {
    name = 'InitTable1706693714474';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "profileId" uuid, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_b1bda35cdb9a2c1b777f5541d8" UNIQUE ("profileId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "swipes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "swiper_id" uuid NOT NULL, "swiped_id" uuid NOT NULL, "is_like" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bb38af5831e2c084a78e3622ff6" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "name" character varying NOT NULL, "age" integer NOT NULL, "daily_swipe_count" integer NOT NULL DEFAULT '0', "likes_count" integer NOT NULL DEFAULT '0', "gender" character varying NOT NULL DEFAULT 'male', "bio" character varying, "image_url" character varying, "is_verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_9e432b7df0d182f8d292902d1a" UNIQUE ("user_id"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "premium_packages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "total_purchased_user" integer NOT NULL, "price" integer NOT NULL, "description" character varying, CONSTRAINT "PK_00618dd405b18cec05ee083e244" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "user_premiums" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "profile_id" uuid NOT NULL, "package_id" uuid NOT NULL, "start_date" TIMESTAMP NOT NULL DEFAULT now(), "end_date" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5d976e08d278dc587d445aca535" PRIMARY KEY ("id"))`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_premiums"`);
        await queryRunner.query(`DROP TABLE "premium_packages"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
        await queryRunner.query(`DROP TABLE "swipes"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
