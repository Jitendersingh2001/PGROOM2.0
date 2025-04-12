/*
  Warnings:

  - Added the required column `propertyAddress` to the `UserProperties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyContact` to the `UserProperties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserProperties" ADD COLUMN     "propertyAddress" VARCHAR NOT NULL,
ADD COLUMN     "propertyContact" VARCHAR NOT NULL;
