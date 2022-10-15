-- DropForeignKey
ALTER TABLE "markings" DROP CONSTRAINT "markings_project_id_fkey";

-- DropForeignKey
ALTER TABLE "markings" DROP CONSTRAINT "markings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_customer_id_fkey";

-- AlterTable
ALTER TABLE "markings" ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "project_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "projects" ALTER COLUMN "customer_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "markings" ADD CONSTRAINT "markings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "markings" ADD CONSTRAINT "markings_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
