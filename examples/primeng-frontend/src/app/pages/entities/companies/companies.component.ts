import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Company } from '@prisma/client';
import { CompaniesCrudStore } from './companies.store';
import { ComponentsImports, NgImports, PrimeNgImports } from '../../../../ng.imports';

@Component({
    selector: 'app-companies',
    standalone: true,
    providers: [MessageService, ConfirmationService, CompaniesCrudStore],
    imports: [...NgImports, ...PrimeNgImports, ...ComponentsImports],
    templateUrl: './companies.component.html',
})
export class CompaniesCrud {
    readonly store = inject(CompaniesCrudStore);
    item:Partial<Company> | null = null;
    constructor() {
        effect(()=>{
            this.item = this.store.editedItem();
        })
    }

    newItem() {
        this.store.editItem({id:0,name:'new company'});
    }

    async save(form:Partial<Company>) {
        const id = this.item?.id;
        if(!!id && id>0)
            await this.store.updateItem(id, form);
        else
            await this.store.createItem(form);
    }

    onGlobalFilter(table: Table, search: string) {
        table.filterGlobal(search, 'contains');
    }
 
}
