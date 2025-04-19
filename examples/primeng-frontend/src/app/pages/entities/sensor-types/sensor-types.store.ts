import { signalStore, type, withState, withComputed } from "@ngrx/signals";
import { SensorType, Category } from '@prisma/client';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { AuditInfo, withCrudEntities } from "../../../core/with-crud-entities";
import { computed, inject } from "@angular/core";
import { CategoriesCrudStore } from "../categories/categories.store";
import { withLookupEntities } from "../../../core/with-lookup-entities";

export interface SensorTypesCrudState { 
    readonly busy: boolean; 
    readonly editedItem: Partial<SensorType & AuditInfo> | null; 
    readonly error: string; 
}

export const initialSensorTypesCrudState: SensorTypesCrudState = { 
    busy: false, 
    editedItem: null, 
    error: '', 
}

export const SensorTypesCrudStore = signalStore(
    withState(initialSensorTypesCrudState), 
    withLookupEntities<Category,'category'>({ entity: type<Category>(), collection: 'category' }),
    withCrudEntities<SensorType, 'sensorType'>({ entity: type<SensorType>(), collection: 'sensorType' }),
    withComputed(store => {
        return {
            // Hydrate sensor types with category information
            hydratedSensorTypes: computed(() => {
                const sensorTypes = store.sensorTypeEntities();
                const categories = store.categoryEntities();
                
                return sensorTypes.map(sensorType => {
                    const category = sensorType.category_id ? categories.find(c => c.id === sensorType.category_id) : null;
                    return { ...sensorType, category };
                });
            }),
            
            // Create a list of categories for the dropdown
            selectCategories: computed(() => {
                return store.categoryEntities().map(category => ({ value: category.id, label: category.name }));
            })
        };
    }),
    withDevtools('sensorTypesCrud'),
);