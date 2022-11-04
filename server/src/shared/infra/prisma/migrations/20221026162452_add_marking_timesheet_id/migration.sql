/*
  Warnings:

  - The values [ERROR] on the enum `OnTimesheetStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OnTimesheetStatus_new" AS ENUM ('NOT_SENT', 'SENDING', 'SENT');
ALTER TABLE "markings" ALTER COLUMN "on_timesheet_status" DROP DEFAULT;
ALTER TABLE "markings" ALTER COLUMN "on_timesheet_status" TYPE "OnTimesheetStatus_new" USING ("on_timesheet_status"::text::"OnTimesheetStatus_new");
ALTER TYPE "OnTimesheetStatus" RENAME TO "OnTimesheetStatus_old";
ALTER TYPE "OnTimesheetStatus_new" RENAME TO "OnTimesheetStatus";
DROP TYPE "OnTimesheetStatus_old";
ALTER TABLE "markings" ALTER COLUMN "on_timesheet_status" SET DEFAULT 'NOT_SENT';
COMMIT;

-- AlterTable
ALTER TABLE "markings" ADD COLUMN     "on_timesheet_id" TEXT;
