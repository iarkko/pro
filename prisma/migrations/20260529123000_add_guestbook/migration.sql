CREATE TABLE "GuestbookEntry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GuestbookEntry_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "GuestbookEntry_deletedAt_createdAt_idx" ON "GuestbookEntry"("deletedAt", "createdAt");
