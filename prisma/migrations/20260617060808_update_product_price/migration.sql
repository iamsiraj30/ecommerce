/*
  Warnings:

  - You are about to drop the column `couponId` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "couponId";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "price" SET DEFAULT 0;
