import { Component, effect, inject } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Vendor } from '@prisma/client';
import { NgImports, PrimeNgImports, ComponentsImports, PipesImports } from '../../../../ng.imports'
import { VendorsCrudStore } from './vendors.store';


@Component({
    selector: 'app-vendors',
    standalone: true,
    providers: [MessageService, ConfirmationService, VendorsCrudStore],
    imports: [...NgImports, ...PrimeNgImports, ...ComponentsImports, ...PipesImports],
    templateUrl: './vendors.component.html',
})
export class VendorsCrud {
    readonly store = inject(VendorsCrudStore);
    item: Partial<Vendor> | null = null;
    
    constructor() {
        effect(() => {
            this.item = this.store.editedItem();
        })
    }

    newItem() {
        this.store.editItem({id: 0, name: 'new vendor'});
    }

    async save(form: Partial<Vendor>) {
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