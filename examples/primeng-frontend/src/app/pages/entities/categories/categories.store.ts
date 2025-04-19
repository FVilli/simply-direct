import { signalStore, type, withState, withComputed } from "@ngrx/signals";
import { Category } from '@prisma/client';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { AuditInfo, withCrudEntities } from "../../../core/with-crud-entities";
import { computed, inject } from "@angular/core";

export interface CategoriesCrudState { 
    readonly busy: boolean; 
    readonly editedItem: Partial<Category & AuditInfo> | null; 
    readonly error: string; 
}

export const initialCategoriesCrudState: CategoriesCrudState = { 
    busy: false, 
    editedItem: null, 
    error: '', 
}

export const CategoriesCrudStore = signalStore(
    withState(initialCategoriesCrudState), 
    withCrudEntities<Category, 'category'>({ entity: type<Category>(), collection: 'category' }),
    withComputed(store => ({

            // Hydrate categories with parent information
            hydratedCategories: computed(() => {
                const categories = store.categoryEntities();
                return categories.map(category => {
                    const parent = category.parent_id ? categories.find(c => c.id === category.parent_id) : null;
                    return { ...category, parent };
                });
            }),
            
            // Create a list of categories for the dropdown
            selectCategories: computed(() => {
                const editedItemId = store.editedItem()?.id || 0;
                return store.categoryEntities()
                        .filter(category => category.id !== editedItemId) // Prevent selecting self as parent
                        .map(category => ({ value: category.id, label: category.name }));
            }),
    })),
    withDevtools('categoriesCrud'),
);

