-- AlterTable
ALTER TABLE "Appliance" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "deleted_by" INTEGER,
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "deleted_by" INTEGER,
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "deleted_by" INTEGER,
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "deleted_by" INTEGER,
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "DefaultValueTypeAggregate" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "deleted_by" INTEGER,
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "DefaultValueTypeAggregateAccessor" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "deleted_by" INTEGER,
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "deleted_by" INTEGER,
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "DeviceType" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "deleted_by" INTEGER,
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "MeasureType" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "deleted_by" INTEGER,
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "MeasureTypeAggregate" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "deleted_by" INTEGER,
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "MeasureTypeAggregateAccessor" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "deleted_by" INTEGER,
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "Sensor" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "deleted_by" INTEGER,
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "SensorType" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "deleted_by" INTEGER,
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "SettingsHistory" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "deleted_by" INTEGER,
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "deleted_by" INTEGER,
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "deleted_by" INTEGER,
ADD COLUMN     "updated_by" INTEGER;

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "deleted_by" INTEGER,
ADD COLUMN     "updated_by" INTEGER;
