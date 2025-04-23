-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "uid" TEXT,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "email" TEXT,
    "phash" TEXT,
    "role" TEXT,
    "disabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "uid" TEXT,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "agent" TEXT NOT NULL,
    "token" TEXT,
    "sessions" INTEGER NOT NULL DEFAULT 0,
    "user_id" INTEGER,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "uid" TEXT,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "legal_name" TEXT,
    "vat_number" TEXT,
    "registration_number" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Site" (
    "id" SERIAL NOT NULL,
    "uid" TEXT,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "address" TEXT,
    "city" TEXT,
    "postal_code" TEXT,
    "state" TEXT,
    "country" TEXT,
    "phone" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "company_id" INTEGER,

    CONSTRAINT "Site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appliance" (
    "id" SERIAL NOT NULL,
    "uid" TEXT,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "description" TEXT,
    "serial_number" TEXT,
    "mac_address" TEXT,
    "ip_address" TEXT,
    "settings_version" INTEGER,
    "settings" JSONB,
    "site_id" INTEGER,

    CONSTRAINT "Appliance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettingsHistory" (
    "id" SERIAL NOT NULL,
    "uid" TEXT,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "settings_version" INTEGER,
    "settings" JSONB,

    CONSTRAINT "SettingsHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" SERIAL NOT NULL,
    "uid" TEXT,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "description" TEXT,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "uid" TEXT,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "description" TEXT,
    "parent_id" INTEGER,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceType" (
    "id" SERIAL NOT NULL,
    "uid" TEXT,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "description" TEXT,
    "settings_version" INTEGER,
    "settings" JSONB,
    "category_id" INTEGER,
    "vendor_id" INTEGER,

    CONSTRAINT "DeviceType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SensorType" (
    "id" SERIAL NOT NULL,
    "uid" TEXT,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "description" TEXT,
    "settings_version" INTEGER,
    "settings" JSONB,
    "category_id" INTEGER,

    CONSTRAINT "SensorType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceSensorMapping" (
    "id" SERIAL NOT NULL,
    "idx" INTEGER NOT NULL,
    "device_type_id" INTEGER NOT NULL,
    "sensor_type_id" INTEGER NOT NULL,

    CONSTRAINT "DeviceSensorMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" SERIAL NOT NULL,
    "uid" TEXT,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "description" TEXT,
    "serial_number" TEXT,
    "mac_address" TEXT,
    "ip_address" TEXT,
    "settings_version" INTEGER,
    "settings" JSONB,
    "additional_info" JSONB,
    "parent_id" INTEGER,
    "device_type_id" INTEGER NOT NULL,
    "appliance_id" INTEGER NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sensor" (
    "id" SERIAL NOT NULL,
    "uid" TEXT,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "description" TEXT,
    "serial_number" TEXT,
    "mac_address" TEXT,
    "ip_address" TEXT,
    "settings_version" INTEGER,
    "settings" JSONB,
    "additional_info" JSONB,
    "parent_id" INTEGER,
    "device_id" INTEGER NOT NULL,
    "mapping_id" INTEGER NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeasureType" (
    "id" SERIAL NOT NULL,
    "uid" TEXT,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "description" TEXT,
    "unit" TEXT,
    "value_type" TEXT NOT NULL,

    CONSTRAINT "MeasureType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeasureTypeAggregate" (
    "id" SERIAL NOT NULL,
    "uid" TEXT,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "description" TEXT,
    "measure_type_id" INTEGER NOT NULL,
    "aggregate_function" TEXT NOT NULL,
    "aggregate_function_parameters" JSONB NOT NULL,
    "rollup_function" TEXT,
    "rollup_function_parameters" JSONB,

    CONSTRAINT "MeasureTypeAggregate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeasureTypeAggregateAccessor" (
    "id" SERIAL NOT NULL,
    "uid" TEXT,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "description" TEXT,
    "unit" TEXT,
    "value_type" TEXT NOT NULL,
    "measure_type_aggregate_id" INTEGER NOT NULL,
    "accessor_function" TEXT NOT NULL,
    "accessor_function_parameters" JSONB NOT NULL,

    CONSTRAINT "MeasureTypeAggregateAccessor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DefaultValueTypeAggregate" (
    "id" SERIAL NOT NULL,
    "uid" TEXT,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "value_type" TEXT NOT NULL,
    "aggregate_function" TEXT NOT NULL,
    "aggregate_function_parameters" JSONB NOT NULL,
    "rollup_function" TEXT,
    "rollup_function_parameters" JSONB,

    CONSTRAINT "DefaultValueTypeAggregate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DefaultValueTypeAggregateAccessor" (
    "id" SERIAL NOT NULL,
    "uid" TEXT,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(3),
    "default_value_type_aggregate_id" INTEGER NOT NULL,
    "accessor_function" TEXT NOT NULL,
    "accessor_function_parameters" JSONB NOT NULL,

    CONSTRAINT "DefaultValueTypeAggregateAccessor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SensorMeasureMapping" (
    "id" SERIAL NOT NULL,
    "is_index" BOOLEAN NOT NULL,
    "sensor_type_id" INTEGER NOT NULL,
    "measure_type_id" INTEGER NOT NULL,

    CONSTRAINT "SensorMeasureMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Measure" (
    "timestamp" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sensor_id" INTEGER NOT NULL,
    "measure_type_id" INTEGER NOT NULL,
    "int_value" INTEGER,
    "float_value" DOUBLE PRECISION,
    "bool_value" BOOLEAN,

    CONSTRAINT "Measure_pkey" PRIMARY KEY ("timestamp","sensor_id","measure_type_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_uid_key" ON "Client"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Client_name_key" ON "Client"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_uid_key" ON "Company"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_legal_name_key" ON "Company"("legal_name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_vat_number_key" ON "Company"("vat_number");

-- CreateIndex
CREATE UNIQUE INDEX "Company_registration_number_key" ON "Company"("registration_number");

-- CreateIndex
CREATE UNIQUE INDEX "Site_uid_key" ON "Site"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Site_name_key" ON "Site"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Appliance_uid_key" ON "Appliance"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Appliance_name_key" ON "Appliance"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SettingsHistory_uid_key" ON "SettingsHistory"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "SettingsHistory_name_key" ON "SettingsHistory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_uid_key" ON "Vendor"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_name_key" ON "Vendor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_uid_key" ON "Category"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceType_uid_key" ON "DeviceType"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceType_name_key" ON "DeviceType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SensorType_uid_key" ON "SensorType"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "SensorType_name_key" ON "SensorType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceSensorMapping_idx_device_type_id_sensor_type_id_key" ON "DeviceSensorMapping"("idx", "device_type_id", "sensor_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "Device_uid_key" ON "Device"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Device_name_key" ON "Device"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_uid_key" ON "Sensor"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_name_key" ON "Sensor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MeasureType_uid_key" ON "MeasureType"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "MeasureType_name_key" ON "MeasureType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MeasureTypeAggregate_uid_key" ON "MeasureTypeAggregate"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "MeasureTypeAggregate_name_key" ON "MeasureTypeAggregate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MeasureTypeAggregateAccessor_uid_key" ON "MeasureTypeAggregateAccessor"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "MeasureTypeAggregateAccessor_name_key" ON "MeasureTypeAggregateAccessor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DefaultValueTypeAggregate_uid_key" ON "DefaultValueTypeAggregate"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "DefaultValueTypeAggregate_name_key" ON "DefaultValueTypeAggregate"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DefaultValueTypeAggregateAccessor_uid_key" ON "DefaultValueTypeAggregateAccessor"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "DefaultValueTypeAggregateAccessor_name_key" ON "DefaultValueTypeAggregateAccessor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SensorMeasureMapping_sensor_type_id_measure_type_id_key" ON "SensorMeasureMapping"("sensor_type_id", "measure_type_id");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appliance" ADD CONSTRAINT "Appliance_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "Site"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceType" ADD CONSTRAINT "DeviceType_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceType" ADD CONSTRAINT "DeviceType_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorType" ADD CONSTRAINT "SensorType_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceSensorMapping" ADD CONSTRAINT "DeviceSensorMapping_device_type_id_fkey" FOREIGN KEY ("device_type_id") REFERENCES "DeviceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceSensorMapping" ADD CONSTRAINT "DeviceSensorMapping_sensor_type_id_fkey" FOREIGN KEY ("sensor_type_id") REFERENCES "SensorType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_device_type_id_fkey" FOREIGN KEY ("device_type_id") REFERENCES "DeviceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_appliance_id_fkey" FOREIGN KEY ("appliance_id") REFERENCES "Appliance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Sensor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_mapping_id_fkey" FOREIGN KEY ("mapping_id") REFERENCES "DeviceSensorMapping"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeasureTypeAggregate" ADD CONSTRAINT "MeasureTypeAggregate_measure_type_id_fkey" FOREIGN KEY ("measure_type_id") REFERENCES "MeasureType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeasureTypeAggregateAccessor" ADD CONSTRAINT "MeasureTypeAggregateAccessor_measure_type_aggregate_id_fkey" FOREIGN KEY ("measure_type_aggregate_id") REFERENCES "MeasureTypeAggregate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefaultValueTypeAggregateAccessor" ADD CONSTRAINT "DefaultValueTypeAggregateAccessor_default_value_type_aggre_fkey" FOREIGN KEY ("default_value_type_aggregate_id") REFERENCES "DefaultValueTypeAggregate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorMeasureMapping" ADD CONSTRAINT "SensorMeasureMapping_sensor_type_id_fkey" FOREIGN KEY ("sensor_type_id") REFERENCES "SensorType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SensorMeasureMapping" ADD CONSTRAINT "SensorMeasureMapping_measure_type_id_fkey" FOREIGN KEY ("measure_type_id") REFERENCES "MeasureType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
