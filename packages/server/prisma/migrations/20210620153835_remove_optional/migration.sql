/*
  Warnings:

  - Made the column `userId` on table `List` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Todo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "List" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Todo" ALTER COLUMN "userId" SET NOT NULL;
