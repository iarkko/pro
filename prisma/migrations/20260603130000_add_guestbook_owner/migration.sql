-- Add optional owner tracking for guestbook entries.
ALTER TABLE "GuestbookEntry"
ADD COLUMN "createdById" TEXT;

CREATE INDEX "GuestbookEntry_createdById_deletedAt_idx" ON "GuestbookEntry"("createdById", "deletedAt");
