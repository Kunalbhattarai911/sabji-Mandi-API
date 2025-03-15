-- CreateTable
CREATE TABLE "Storage" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "capacityKg" INTEGER NOT NULL,
    "vegetableCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Storage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vegetable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantityKg" INTEGER NOT NULL,
    "pricePerKg" DOUBLE PRECISION NOT NULL,
    "storageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vegetable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Storage_location_key" ON "Storage"("location");

-- CreateIndex
CREATE UNIQUE INDEX "Vegetable_name_key" ON "Vegetable"("name");

-- AddForeignKey
ALTER TABLE "Vegetable" ADD CONSTRAINT "Vegetable_storageId_fkey" FOREIGN KEY ("storageId") REFERENCES "Storage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
