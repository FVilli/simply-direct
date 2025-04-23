import { signalStore, type, withComputed, withState } from "@ngrx/signals";
import { Site, Company } from '@prisma/client';
import { withEntities } from '@ngrx/signals/entities';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { AuditInfo, withCrudEntities } from "../../../core/with-crud-entities";
import { withLookupEntities } from "../../../core/with-lookup-entities";
import { computed } from "@angular/core";

export interface SitesCrudState { readonly busy: boolean; readonly editedItem: Partial<Site & AuditInfo> | null; readonly error: string; }
export const initialSitesCrudState: SitesCrudState = { busy: false, editedItem: null, error: '', }
export const SitesCrudStore = signalStore(
    withState(initialSitesCrudState), 
    withLookupEntities<Company,'company'>({ entity: type<Company>(), collection: 'company' }),
    withCrudEntities<Site,'site'>({ entity: type<Site>(), collection: 'site' }),
    withComputed(store => ({
        selectCompanies: computed(() => {
            return store.companyEntities().map(c => ({ label: c.name, value: c.id}));    
        }),
        hydratedSites: computed(() => {
            return store.siteEntities().map(s => ({ ...s, company: store.companyEntities().find(c => c.id === s.company_id) })); 
        }),
    })),
    withDevtools('sitesCrud'),
);

