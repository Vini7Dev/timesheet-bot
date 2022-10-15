-- CreateEnum
CREATE TYPE "OnTimesheetStatus" AS ENUM ('NOT_SENT', 'SENDING', 'SENT', 'ERROR');

-- AlterTable
ALTER TABLE "markings" ADD COLUMN     "on_timesheet_status" "OnTimesheetStatus" NOT NULL DEFAULT 'NOT_SENT',
ADD COLUMN     "timesheet_error" TEXT;
