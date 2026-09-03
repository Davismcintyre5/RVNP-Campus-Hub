-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "sharedFromId" TEXT;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_sharedFromId_fkey" FOREIGN KEY ("sharedFromId") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
