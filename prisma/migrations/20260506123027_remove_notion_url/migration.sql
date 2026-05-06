/*
  Warnings:

  - You are about to drop the column `order` on the `Step` table. All the data in the column will be lost.
  - Added the required column `stepOrder` to the `Step` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Step" DROP COLUMN "order",
ADD COLUMN     "stepOrder" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "Step_recipeId_idx" ON "Step"("recipeId");
