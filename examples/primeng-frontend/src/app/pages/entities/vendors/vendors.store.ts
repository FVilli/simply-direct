import { signalStore, type, withState } from "@ngrx/signals";
import { Vendor } from '@prisma/client';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { AuditInfo, withCrudEntities } from "../../../core/with-crud-entities";

export interface VendorsCrudState { 
    readonly busy: boolean; 
    readonly editedItem: Partial<Vendor & AuditInfo> | null; 
    readonly error: string; 
}

export const initialVendorsCrudState: VendorsCrudState = { 
    busy: false, 
    editedItem: null, 
    error: '', 
}

export const VendorsCrudStore = signalStore(
    withState(initialVendorsCrudState), 
    withCrudEntities<Vendor, 'vendor'>({ entity: type<Vendor>(), collection: 'vendor' }),
    withDevtools('vendorsCrud'),
);