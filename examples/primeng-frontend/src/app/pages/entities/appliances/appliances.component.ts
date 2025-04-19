import { Component, effect, inject } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Appliance } from '@prisma/client';
import { NgImports, PrimeNgImports, ComponentsImports, PipesImports } from '../../../../ng.imports';
import { AppliancesCrudStore } from './appliances.store';


@Component({
    selector: 'app-appliances',
    standalone: true,
    providers: [MessageService, ConfirmationService, AppliancesCrudStore],
    imports: [...NgImports, ...PrimeNgImports, ...ComponentsImports, ...PipesImports],
    templateUrl: './appliances.component.html',
})
export class AppliancesCrud {
    readonly store = inject(AppliancesCrudStore);
    item: Partial<Appliance> | null = null;
    
    constructor() {
        effect(() => {
            this.item = this.store.editedItem();
        });
    }

    newItem() {
        this.store.editItem({id: 0, name: 'new appliance'});
    }

    async save(form: Partial<Appliance>) {
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