import { Component, effect, inject } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { DeviceType } from '@prisma/client';
import { NgImports, PrimeNgImports, ComponentsImports, PipesImports } from '../../../../ng.imports';
import { DeviceTypesCrudStore } from './device-types.store';

@Component({
    selector: 'app-device-types',
    standalone: true,
    providers: [MessageService, ConfirmationService, DeviceTypesCrudStore],
    imports: [...NgImports, ...PrimeNgImports, ...ComponentsImports, ...PipesImports],
    templateUrl: './device-types.component.html',
})
export class DeviceTypesCrud {
    readonly store = inject(DeviceTypesCrudStore);
    item: Partial<DeviceType> | null = null;
    mappings:{ channel:string, sensor_type_ids:number[] }[] = [];

    st:any[] = [];
    
    constructor() {
        effect(() => {
            this.item = this.store.editedItem();
        });
    }

    newItem() {
        this.store.editItem({id: 0, name: 'new device type'});
    }

    async save(form: Partial<DeviceType>) {
        const id = this.item?.id;
        if (!!id && id > 0)
            await this.store.updateItem(id, form);
        else
            await this.store.createItem(form);
    }

    onGlobalFilter(table: Table, search: string) {
        table.filterGlobal(search, 'contains');
    }

    addMapping() {
        this.mappings.push({channel:'', sensor_type_ids:[]})
    }
}