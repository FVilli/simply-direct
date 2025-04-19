import { signalStore, type, withState, withComputed } from "@ngrx/signals";
import { Appliance, Site } from '@prisma/client';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { AuditInfo, withCrudEntities } from "../../../core/with-crud-entities";
import { computed } from "@angular/core";
import { withLookupEntities } from "../../../core/with-lookup-entities";

export interface AppliancesCrudState { 
    readonly busy: boolean; 
    readonly editedItem: Partial<Appliance & AuditInfo> | null; 
    readonly error: string; 
}

export const initialAppliancesCrudState: AppliancesCrudState = { 
    busy: false, 
    editedItem: null, 
    error: '', 
}

export const AppliancesCrudStore = signalStore(
    withState(initialAppliancesCrudState), 
    withLookupEntities<Site,'site'>({ entity: type<Site>(), collection: 'site' }),
    withCrudEntities<Appliance, 'appliance'>({ entity: type<Appliance>(), collection: 'appliance' }),
    withComputed(store => {
        
        
        return {
            // Hydrate appliances with site information
            hydratedAppliances: computed(() => {
                const appliances = store.applianceEntities();
                const sites = store.siteEntities();
                
                return appliances.map(appliance => {
                    const site = appliance.site_id ? sites.find(s => s.id === appliance.site_id) : null;
                    return { ...appliance, site };
                });
            }),
            
            // Create a list of sites for the dropdown
            selectSites: computed(() => {
                return store.siteEntities().map(site => ({ value: site.id, label: site.name }));
            })
        };
    }),
    withDevtools('appliancesCrud'),
);