/*
  Warnings:

  - Added the required column `imgUrl` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "imgUrl" TEXT NOT NULL,
ADD COLUMN     "like" INTEGER NOT NULL DEFAULT 0;
