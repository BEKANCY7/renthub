/*
  Warnings:

  - You are about to drop the column `notes` on the `Payment` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "PaymentNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    CONSTRAINT "PaymentNote_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PaymentNote_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT NOT NULL DEFAULT 'CARD',
    "paymentDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "bookingId" TEXT NOT NULL,
    "payerId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "referenceCode" TEXT,
    "transactionId" TEXT,
    "metadata" TEXT,
    "verifiedBy" TEXT,
    "verifiedAt" DATETIME,
    "flagged" BOOLEAN NOT NULL DEFAULT false,
    "flagReason" TEXT,
    CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payment_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Payment_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("amount", "bookingId", "createdAt", "flagReason", "flagged", "id", "metadata", "payerId", "paymentDate", "paymentMethod", "receiverId", "referenceCode", "status", "transactionId", "updatedAt", "verifiedAt", "verifiedBy") SELECT "amount", "bookingId", "createdAt", "flagReason", "flagged", "id", "metadata", "payerId", "paymentDate", "paymentMethod", "receiverId", "referenceCode", "status", "transactionId", "updatedAt", "verifiedAt", "verifiedBy" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
CREATE INDEX "Payment_status_idx" ON "Payment"("status");
CREATE INDEX "Payment_paymentMethod_idx" ON "Payment"("paymentMethod");
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");
CREATE INDEX "Payment_paymentDate_idx" ON "Payment"("paymentDate");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
