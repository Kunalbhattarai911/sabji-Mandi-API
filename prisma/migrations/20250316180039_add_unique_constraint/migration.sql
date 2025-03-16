/*
  Warnings:

  - A unique constraint covering the columns `[name,storageId]` on the table `Vegetable` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Vegetable_name_storageId_key" ON "Vegetable"("name", "storageId");
