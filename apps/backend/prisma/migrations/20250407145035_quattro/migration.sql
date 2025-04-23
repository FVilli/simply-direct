/*
  Warnings:

  - A unique constraint covering the columns `[idx,device_type_id,sensor_type_id]` on the table `DeviceSensorMapping` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idx` to the `DeviceSensorMapping` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "DeviceSensorMapping_channel_device_type_id_sensor_type_id_key";

-- AlterTable
ALTER TABLE "DeviceSensorMapping" ADD COLUMN     "idx" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DeviceSensorMapping_idx_device_type_id_sensor_type_id_key" ON "DeviceSensorMapping"("idx", "device_type_id", "sensor_type_id");
