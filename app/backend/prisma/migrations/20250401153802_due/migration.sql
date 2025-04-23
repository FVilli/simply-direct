-- AlterTable
ALTER TABLE "Appliance" ADD COLUMN     "owned_by" INTEGER;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "owned_by" INTEGER;

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "owned_by" INTEGER;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "owned_by" INTEGER;

-- AlterTable
ALTER TABLE "DefaultValueTypeAggregate" ADD COLUMN     "owned_by" INTEGER;

-- AlterTable
ALTER TABLE "DefaultValueTypeAggregateAccessor" ADD COLUMN     "owned_by" INTEGER;

-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "owned_by" INTEGER;

-- AlterTable
ALTER TABLE "DeviceType" ADD COLUMN     "owned_by" INTEGER;

-- AlterTable
ALTER TABLE "MeasureType" ADD COLUMN     "owned_by" INTEGER;

-- AlterTable
ALTER TABLE "MeasureTypeAggregate" ADD COLUMN     "owned_by" INTEGER;

-- AlterTable
ALTER TABLE "MeasureTypeAggregateAccessor" ADD COLUMN     "owned_by" INTEGER;

-- AlterTable
ALTER TABLE "Sensor" ADD COLUMN     "owned_by" INTEGER;

-- AlterTable
ALTER TABLE "SensorType" ADD COLUMN     "owned_by" INTEGER;

-- AlterTable
ALTER TABLE "SettingsHistory" ADD COLUMN     "owned_by" INTEGER;

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "owned_by" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "owned_by" INTEGER;

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "owned_by" INTEGER;
