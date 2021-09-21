/*
  Warnings:

  - A unique constraint covering the columns `[position]` on the table `List` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `position` to the `List` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "List" ADD COLUMN     "position" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "List.position_unique" ON "List"("position");
