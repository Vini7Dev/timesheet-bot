/*
  Warnings:

  - You are about to drop the column `work_class` on the `markings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "markings" DROP COLUMN "work_class",
ADD COLUMN     "is_billable" BOOLEAN NOT NULL DEFAULT true;
