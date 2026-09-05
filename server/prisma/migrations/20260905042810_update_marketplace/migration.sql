-- AlterTable
ALTER TABLE "marketplace_listings" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "offers" JSONB;

-- CreateIndex
CREATE INDEX "marketplace_listings_category_idx" ON "marketplace_listings"("category");
