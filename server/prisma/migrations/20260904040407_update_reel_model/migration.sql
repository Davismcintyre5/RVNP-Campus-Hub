-- AlterTable
ALTER TABLE "reels" ADD COLUMN     "content" JSONB,
ADD COLUMN     "privacy" TEXT NOT NULL DEFAULT 'PUBLIC';
