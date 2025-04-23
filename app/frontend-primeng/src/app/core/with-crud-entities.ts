import { EmptyFeatureResult, PartialStateUpdater, patchState, signalStoreFeature, SignalStoreFeature, type, withComputed, withHooks, withMethods } from "@ngrx/signals";
import { NamedEntityProps, NamedEntityState, setAllEntities, setEntity, withEntities } from '@ngrx/signals/entities';
import { CoreService, CoreStore } from "../../core.service";
import { inject, Signal } from "@angular/core";
import { Entity } from "@angular-architects/ngrx-toolkit";
import { clone } from "@common/functions";

export interface AuditInfo {
    created_by_user?: string;
    updated_by_user?: string;
  }

export function withCrudEntities<E extends Entity, Collection extends string>(config: {
    entity: E;
    collection: Collection;
}): SignalStoreFeature<EmptyFeatureResult, {
    state: NamedEntityState<E, Collection>;
    props: NamedEntityProps<E, Collection>;
    methods: {
        loadData(): Promise<void>,
        editItem(item: Partial<E>):void,
        cancelEditing():void,
        createItem(item: Partial<E>): Promise<void>,
        updateItem(id:number, item: Partial<E>): Promise<void>,
    };
}>;

export function withCrudEntities<E extends Entity, Collection extends string>(config: {
    entity: E;
    collection: Collection;
}) {
    const collection = config.collection.toString();
    return signalStoreFeature(
        withEntities({ entity: type<E>(), collection }),
        withMethods(store => { 
        
            const core = inject(CoreService);
            const coreStore = inject(CoreStore);
    
            const _loadRawData = async () => {
                patchState(store, setBusy(true),setError());
                try {
                    const items = await core.prisma<E[]>(`${collection}.findMany`) || [];
                    patchState(store, setAllEntities(items, { collection }));
                } catch (err:any) {
                    patchState(store, setError(err.message));
                }
                patchState(store, setBusy(false));
            };
    
            const _editItem = (item: Partial<E & AuditInfo> | null = null) => {
                const itemToEdit = item ? clone<any>(item) : null;
                if(!!itemToEdit) {
                    const users = coreStore.userEntities();
                    if(itemToEdit.hasOwnProperty('created_by')) itemToEdit.created_by_user = users.find(u => u.id === itemToEdit.created_by)?.name;
                    if(itemToEdit.hasOwnProperty('updated_by')) itemToEdit.updated_by_user = users.find(u => u.id === itemToEdit.updated_by)?.name;
                }
                patchState(store, setEditItem(itemToEdit),setError());
            };
    
            const _createItem = async (item: Partial<E>)=>{
                patchState(store, setBusy(true),setError());
                try {
                    await core.prisma<E>(`${collection}.create`, { data:item });
                    patchState(store, setEditItem(null));
                } catch (err:any) {
                    patchState(store, setError(err.message));
                }
                patchState(store, setBusy(false));
            }
    
            const _updateItem = async (id:number, item: Partial<E>)=>{
                patchState(store, setBusy(true),setError());
                try {
                    checkCollision(store,collection);
                    await core.prisma<E>(`${collection}.update`, { where:{id}, data:item});
                    patchState(store, setEditItem(null));
                } catch (err:any) {
                    patchState(store,setError(err.message));
                }
                patchState(store, setBusy(false));
            }
    
            return {
                loadData: async () => await _loadRawData(),
                editItem: (item: Partial<E>) => _editItem(item),
                cancelEditing: () => _editItem(),
                createItem: async (item: Partial<E>) => { await _createItem(item);},
                updateItem: async (id:number, item: Partial<E>) => { await _updateItem(id,item); },
            }
        }), 
        withHooks(store => {
            const core = inject(CoreService);
            const { stream, unsubscribe } = core.subscribe<E>([`prisma.${collection}.create.*.after`,`prisma.${collection}.update.*.after`]);
            stream.subscribe( user => { patchState(store, setEntity(user, { collection })); });
    
            return {
                onInit: async () => { await store.loadData(); },
                onDestroy: () => { unsubscribe(); }
            }
        }),
    );
}

function checkCollision<E extends Entity>(store: any,collection:string) {
    const entities:E[] = store[`${collection}Entities`]() as E[];
    const editedItem = (<any>store)['editedItem']() as any;
    const current:any = entities.find(e => e.id === editedItem.id);
    if(editedItem.updated_at !== current.updated_at) throw new Error('Data has been changed by another user. Please [Cancel] and try again.');
}

export function setEditItem<T>(editedItem: Partial<T> | null): PartialStateUpdater<any> { return _ => ({ editedItem }); }
export function setBusy(busy: boolean): PartialStateUpdater<any> { return _ => ({ busy }); }
export function setError(error?: string): PartialStateUpdater<any> { return _ => ({ error }); }