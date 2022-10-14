-- CreateEnum
CREATE TYPE "WorkClass" AS ENUM ('PRODUCTION', 'ABSENCE');

-- CreateTable
CREATE TABLE "markings" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "finish_time" TEXT NOT NULL,
    "start_interval_time" TEXT,
    "finish_interval_time" TEXT,
    "work_class" "WorkClass" NOT NULL DEFAULT 'PRODUCTION',
    "user_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "markings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "markings" ADD CONSTRAINT "markings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "markings" ADD CONSTRAINT "markings_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
