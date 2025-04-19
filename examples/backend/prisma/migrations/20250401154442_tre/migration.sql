/*
  Warnings:

  - You are about to drop the column `idx` on the `DeviceSensorMapping` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[channel,device_type_id,sensor_type_id]` on the table `DeviceSensorMapping` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "DeviceSensorMapping_idx_device_type_id_sensor_type_id_key";

-- AlterTable
ALTER TABLE "DeviceSensorMapping" DROP COLUMN "idx",
ADD COLUMN     "channel" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "DeviceSensorMapping_channel_device_type_id_sensor_type_id_key" ON "DeviceSensorMapping"("channel", "device_type_id", "sensor_type_id");
