import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Product, ProductService } from '../../service/product.service';
import { Site } from '@prisma/client';
import { SitesCrudStore } from './sites.store';
import { ComponentsImports, NgImports, PrimeNgImports } from '../../../../ng.imports';
import { CoreStore } from '../../../../core.service';

@Component({
    selector: 'app-sites',
    standalone: true,
    providers: [MessageService, ProductService, ConfirmationService, SitesCrudStore, CoreStore],
    imports: [...NgImports,...PrimeNgImports,...ComponentsImports],
    templateUrl: './sites.component.html',
})
export class SitesCrud {
    readonly store = inject(SitesCrudStore);
    item:Partial<Site> | null = null;
    constructor() {
        effect(()=>{
            this.item = this.store.editedItem();
        })
    }

    newItem() {
        this.store.editItem({id:0,name:'new site'});
    }

    async save(form:Partial<Site>) {
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
