-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "groupPostId" TEXT;

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'General',
ADD COLUMN     "coverUrl" TEXT,
ADD COLUMN     "postCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "privacy" TEXT NOT NULL DEFAULT 'PUBLIC';

-- CreateTable
CREATE TABLE "group_posts" (
    "id" TEXT NOT NULL,
    "content" JSONB,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "group_posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "group_posts_groupId_idx" ON "group_posts"("groupId");

-- CreateIndex
CREATE INDEX "group_posts_userId_idx" ON "group_posts"("userId");

-- CreateIndex
CREATE INDEX "comments_groupPostId_idx" ON "comments"("groupPostId");

-- CreateIndex
CREATE INDEX "groups_category_idx" ON "groups"("category");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_groupPostId_fkey" FOREIGN KEY ("groupPostId") REFERENCES "group_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_posts" ADD CONSTRAINT "group_posts_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_posts" ADD CONSTRAINT "group_posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
