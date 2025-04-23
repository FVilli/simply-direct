import { Component, effect, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Product, ProductService } from '../../service/product.service';
import { UsersCrudStore, UserWithPassword } from './users.store';
import { ComponentsImports, NgImports, PrimeNgImports } from '../../../../ng.imports';
interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}
interface ExportColumn {
    title: string;
    dataKey: string;
}
@Component({
    selector: 'app-users',
    standalone: true,
    providers: [MessageService, ProductService, ConfirmationService, UsersCrudStore],
    imports: [...NgImports,...PrimeNgImports, ...ComponentsImports],
    templateUrl: './users.component.html',
})
export class UsersCrud {
    readonly store = inject(UsersCrudStore);
    readonly userRoles:{value:string,label:string}[] = [{value:'ADMIN',label:'Admin'},{value:'USER',label:'User'}]
    //@ViewChild('dt') dt!: Table;
    user:Partial<UserWithPassword> | null = null;
    constructor() {
        effect(()=>{
            this.user = this.store.editedItem();
        })
    }
    newUser() {
        this.store.editItem({id:0,name:'new user',role:'USER',email:null,disabled:false});
    }
    async save(form:Partial<UserWithPassword>) {
        const id = this.user?.id;
        if(!!id && id>0)
            await this.store.updateUser(id, form);
        else
            await this.store.createUser(form);
    }
    onGlobalFilter(table: Table, search: string) {
        table.filterGlobal(search, 'contains');
    }
    isPasswordValid(password: string | undefined): boolean {
        if (!password) return true; // not required
        const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{4,}$/;
        return regex.test(password);
    }
    doPasswordsMatch(model:Partial<UserWithPassword>): boolean {
        return !!model.password1 && !!model.password2 && model.password1 === model.password2;
    }
    isPasswordValidOrEmpty(model:Partial<UserWithPassword>): boolean {
        if(!model.password1 && !model.password2) return true;
        const passwordValid = this.isPasswordValid(model.password1);
        const passwordsMatch = this.doPasswordsMatch(model);
        const confirmPasswordValid = model.password2 ? passwordValid : true;
        return passwordValid && passwordsMatch && confirmPasswordValid;
    }
}
