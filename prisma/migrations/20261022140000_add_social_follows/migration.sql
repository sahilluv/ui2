-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: Unique compound constraint to prevent duplicate follows
CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "Follow"("followerId", "followingId");

-- CreateIndex: Keyset pagination index for followers
CREATE INDEX "Follow_followingId_createdAt_id_idx" ON "Follow"("followingId", "createdAt" DESC, "id" DESC);

-- CreateIndex: Keyset pagination index for following
CREATE INDEX "Follow_followerId_createdAt_id_idx" ON "Follow"("followerId", "createdAt" DESC, "id" DESC);

-- AddForeignKey: Cascading deletion when follower user account is deleted
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: Cascading deletion when followed user account is deleted
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddCheckConstraint: Database-level self-follow prevention
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_prevent_self_follow" CHECK ("followerId" <> "followingId");
