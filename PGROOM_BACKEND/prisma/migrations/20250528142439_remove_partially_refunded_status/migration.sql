/*
  Warnings:

  - You are about to drop the column `city` on the `UserProperties` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `UserProperties` table. All the data in the column will be lost.
  - You are about to drop the `ElectricityBill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Rent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rent` to the `Rooms` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalBed` to the `Rooms` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `roomImage` on the `Rooms` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `status` to the `Tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cityId` to the `UserProperties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stateId` to the `UserProperties` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Pending', 'Authorized', 'Captured', 'Failed', 'Refunded');

-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('Active', 'Deleted');

-- AlterEnum
ALTER TYPE "RoomStatus" ADD VALUE 'Deleted';

-- DropForeignKey
ALTER TABLE "ElectricityBill" DROP CONSTRAINT "ElectricityBill_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Rent" DROP CONSTRAINT "Rent_roomId_fkey";

-- AlterTable
ALTER TABLE "Rooms" ADD COLUMN     "rent" VARCHAR NOT NULL,
ADD COLUMN     "totalBed" INTEGER NOT NULL,
DROP COLUMN "roomImage",
ADD COLUMN     "roomImage" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "status" "TenantStatus" NOT NULL;

-- AlterTable
ALTER TABLE "UserProperties" DROP COLUMN "city",
DROP COLUMN "state",
ADD COLUMN     "cityId" INTEGER NOT NULL,
ADD COLUMN     "stateId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ElectricityBill";

-- DropTable
DROP TABLE "Rent";

-- DropEnum
DROP TYPE "BillStatus";

-- DropEnum
DROP TYPE "RentStatus";

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "tenantId" INTEGER NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "status" "PaymentStatus" NOT NULL,
    "paymentMethod" "PaymentMethod",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "paymentMethodDetails" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_razorpayOrderId_key" ON "Payment"("razorpayOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_razorpayPaymentId_key" ON "Payment"("razorpayPaymentId");

-- AddForeignKey
ALTER TABLE "UserProperties" ADD CONSTRAINT "UserProperties_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProperties" ADD CONSTRAINT "UserProperties_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "UserProperties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
