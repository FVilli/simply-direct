import { signalStore, type, withState, withComputed, withMethods, patchState } from "@ngrx/signals";
import { DeviceType, Category, Vendor, SensorType } from '@prisma/client';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { AuditInfo, withCrudEntities } from "../../../core/with-crud-entities";
import { computed, inject } from "@angular/core";
import { withLookupEntities } from "../../../core/with-lookup-entities";
import { CoreService } from "../../../../core.service";

export interface DeviceTypesCrudState { 
    readonly busy: boolean; 
    readonly editedItem: Partial<DeviceType & AuditInfo> | null; 
    readonly error: string; 
    readonly sensorsMap:boolean;
}

export const initialDeviceTypesCrudState: DeviceTypesCrudState = { 
    busy: false, 
    editedItem: null, 
    error: '', 
    sensorsMap:false,
}

export const DeviceTypesCrudStore = signalStore(
    withState(initialDeviceTypesCrudState), 
    withLookupEntities<Vendor,'vendor'>({ entity: type<Vendor>(), collection: 'vendor' }),
    withLookupEntities<Category,'category'>({ entity: type<Category>(), collection: 'category' }),
    withLookupEntities<SensorType,'sensorType'>({ entity: type<SensorType>(), collection: 'sensorType' }),
    withCrudEntities<DeviceType, 'deviceType'>({ entity: type<DeviceType>(), collection: 'deviceType' }),
    withComputed(store => {        
        return {
            // Hydrate device types with category and vendor information
            hydratedDeviceTypes: computed(() => {
                const deviceTypes = store.deviceTypeEntities();
                const categories = store.categoryEntities();
                const vendors = store.vendorEntities();
                
                return deviceTypes.map(deviceType => {
                    const category = deviceType.category_id ? categories.find(c => c.id === deviceType.category_id) : null;
                    const vendor = deviceType.vendor_id ? vendors.find(v => v.id === deviceType.vendor_id) : null;
                    return { ...deviceType, category, vendor };
                });
            }),
            
            // Create a list of categories for the dropdown
            selectCategories: computed(() => {
                return store.categoryEntities().map(category => ({ value: category.id, label: category.name }));
            }),
            
            // Create a list of vendors for the dropdown
            selectVendors: computed(() => {
                return store.vendorEntities().map(vendor => ({ value: vendor.id, label: vendor.name }));
            }),

            selectSensorTypes: computed(() => {
                return store.sensorTypeEntities().map(st => ({ value: st.id, label: st.name }));
            })
        };
    }),
    withMethods(store => {

        const core = inject(CoreService);

        return {
         
            openSensorsMap(dt:DeviceType) {
                console.log("openSensorsMap",dt);
                patchState(store,(state) => ({ sensorsMap:true }));
            },
            closeSensorsMap() {
                console.log("closeSensorsMap");
                patchState(store,(state) => ({ sensorsMap:false }));
            },
            removeMapping(idx:number) {
                console.log("removeMapping");
            }

        }
    }),
    withDevtools('deviceTypesCrud'),
);