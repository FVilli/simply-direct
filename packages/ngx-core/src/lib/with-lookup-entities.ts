import { EmptyFeatureResult, patchState, signalStoreFeature, SignalStoreFeature, type, withHooks, withMethods } from "@ngrx/signals";
import { NamedEntityProps, NamedEntityState, setAllEntities, setEntity, withEntities } from '@ngrx/signals/entities';
import { CoreService } from "./core.service";
import { inject } from "@angular/core";
import { Entity } from "@angular-architects/ngrx-toolkit";

export function withLookupEntities<E extends Entity, Collection extends string>(config: {
    entity: E;
    collection: Collection;
}): SignalStoreFeature<EmptyFeatureResult, {
    state: NamedEntityState<E, Collection>;
    props: NamedEntityProps<E, Collection>;
    methods: {};
}>;

export function withLookupEntities<E extends Entity, Collection extends string>(config: {
    entity: E;
    collection: Collection;
}) {
    const collection = config.collection.toString();
    return signalStoreFeature(
        withEntities({ entity: type<E>(), collection }),
        
        withHooks(store => {
            const core = inject(CoreService);
            const { stream, unsubscribe } = core.subscribe<E>([`prisma.${collection}.create.*.after`,`prisma.${collection}.update.*.after`]);
            stream.subscribe( user => { patchState(store, setEntity(user, { collection })); });
    
            return {
                onInit: async () => { 
                    const items = await core.prisma<E[]>(`${collection}.findMany`) || [];
                    patchState(store, setAllEntities(items, { collection }));
                 },
                onDestroy: () => { unsubscribe(); }
            }
        }),
    );
}