-- AlterEnum
ALTER TYPE "ReactionType" ADD VALUE 'CARE';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "privacySettings" JSONB;
