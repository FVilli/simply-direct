import { signalStore, type, withState } from "@ngrx/signals";
import { Company } from '@prisma/client';
//import { withEntities } from '@ngrx/signals/entities';
import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { AuditInfo, withCrudEntities } from "../../../core/with-crud-entities";

export interface CompaniesCrudState { readonly busy: boolean; readonly editedItem: Partial<Company & AuditInfo> | null; readonly error: string; }
export const initialCompaniesCrudState: CompaniesCrudState = { busy: false, editedItem: null, error: '', }
export const CompaniesCrudStore = signalStore(
    withState(initialCompaniesCrudState), 
    withCrudEntities<Company,'company'>({ entity: type<Company>(), collection: 'company' }),
    //withPrismaEntity<Company,'company'>({collection:'company'}),
    withDevtools('companiesCrud'),
);

