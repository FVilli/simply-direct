import { Component, effect, inject } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { SensorType } from '@prisma/client';
import { NgImports, PrimeNgImports, ComponentsImports, PipesImports } from '../../../../ng.imports';
import { SensorTypesCrudStore } from './sensor-types.store';

@Component({
    selector: 'app-sensor-types',
    standalone: true,
    providers: [MessageService, ConfirmationService, SensorTypesCrudStore],
    imports: [...NgImports, ...PrimeNgImports, ...ComponentsImports, ...PipesImports],
    templateUrl: './sensor-types.component.html',
})
export class SensorTypesCrud {
    readonly store = inject(SensorTypesCrudStore);
    item: Partial<SensorType> | null = null;
    
    constructor() {
        effect(() => {
            this.item = this.store.editedItem();
        });
    }

    newItem() {
        this.store.editItem({id: 0, name: 'new sensor type'});
    }

    async save(form: Partial<SensorType>) {
        const id = this.item?.id;
        if (!!id && id > 0)
            await this.store.updateItem(id, form);
        else
            await this.store.createItem(form);
    }

    onGlobalFilter(table: Table, search: string) {
        table.filterGlobal(search, 'contains');
    }
}