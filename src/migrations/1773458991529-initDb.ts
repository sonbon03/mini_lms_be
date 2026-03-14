import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1773458991529 implements MigrationInterface {
    name = 'InitDb1773458991529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "parents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_07b4151ae2a983823d922d5cf03" UNIQUE ("email"), CONSTRAINT "PK_9a4dc67c7b8e6a9cb918938d353" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."classes_day_of_week_enum" AS ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun')`);
        await queryRunner.query(`CREATE TABLE "classes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "subject" character varying NOT NULL, "day_of_week" "public"."classes_day_of_week_enum" NOT NULL, "time_slot" character varying NOT NULL, "teacher_name" character varying NOT NULL, "max_students" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e207aa15404e9b2ce35910f9f7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "class_registrations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "class_id" uuid NOT NULL, "student_id" uuid NOT NULL, "registered_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_76180e734b05c6b71dce6c94317" UNIQUE ("class_id", "student_id"), CONSTRAINT "PK_4de4990d6c8a968fa129c33f0ec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "student_id" uuid NOT NULL, "package_name" character varying NOT NULL, "total_sessions" integer NOT NULL, "used_sessions" integer NOT NULL DEFAULT '0', "expiry_date" date NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."students_gender_enum" AS ENUM('male', 'female', 'other')`);
        await queryRunner.query(`CREATE TABLE "students" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "dob" date NOT NULL, "gender" "public"."students_gender_enum" NOT NULL, "current_grade" character varying NOT NULL, "parent_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "class_registrations" ADD CONSTRAINT "FK_cd8ae82d50bd0c70302c73ac24a" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "class_registrations" ADD CONSTRAINT "FK_bdc678a309f861bcfd50916209f" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_dee89f47ca621f441b655c282b4" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "students" ADD CONSTRAINT "FK_209313beb8d3f51f7ad69214d90" FOREIGN KEY ("parent_id") REFERENCES "parents"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_209313beb8d3f51f7ad69214d90"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_dee89f47ca621f441b655c282b4"`);
        await queryRunner.query(`ALTER TABLE "class_registrations" DROP CONSTRAINT "FK_bdc678a309f861bcfd50916209f"`);
        await queryRunner.query(`ALTER TABLE "class_registrations" DROP CONSTRAINT "FK_cd8ae82d50bd0c70302c73ac24a"`);
        await queryRunner.query(`DROP TABLE "students"`);
        await queryRunner.query(`DROP TYPE "public"."students_gender_enum"`);
        await queryRunner.query(`DROP TABLE "subscriptions"`);
        await queryRunner.query(`DROP TABLE "class_registrations"`);
        await queryRunner.query(`DROP TABLE "classes"`);
        await queryRunner.query(`DROP TYPE "public"."classes_day_of_week_enum"`);
        await queryRunner.query(`DROP TABLE "parents"`);
    }

}
