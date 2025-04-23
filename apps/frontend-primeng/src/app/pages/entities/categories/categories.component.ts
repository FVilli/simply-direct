import { Component, computed, effect, inject, signal } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Category } from '@prisma/client';
import { NgImports, PrimeNgImports, ComponentsImports, PipesImports } from '../../../../ng.imports';
import { CategoriesCrudStore } from './categories.store';
import { Subject } from 'rxjs';

type THierarchy = Array<IHierarchyItem>;
interface IHierarchyItem { key:number, label:string, data:any, icon:string, children?:THierarchy }

@Component({
    selector: 'app-categories',
    standalone: true,
    providers: [MessageService, ConfirmationService, CategoriesCrudStore],
    imports: [...NgImports, ...PrimeNgImports, ...ComponentsImports, ...PipesImports],
    templateUrl: './categories.component.html',
})
export class CategoriesCrud {
    readonly store = inject(CategoriesCrudStore);
    item: Partial<Category> | null = null;
    parentChanged$ = new Subject<void>();
    $detectedCycle = signal(false);
    $hierarchy = computed(() => {
        const categories = this.store.categoryEntities();
        return this.buildHierarchy(categories);
    })

    constructor() {
        effect(() => {
            console.log('effect');
            this.item = this.store.editedItem();
            this.$detectedCycle.set(false);
        });

        this.parentChanged$.subscribe(() => {
            if(!this.item) {
                this.$detectedCycle.set(false);
            } else {
                console.log(this.item,this.item?.id, this.item?.parent_id);
                const categories = this.store.categoryEntities();
                const rv = this.detectCycle(categories, this.item?.id, this.item?.parent_id);
                this.$detectedCycle.set(rv);
            }
        });
    }

    newItem() {
        this.store.editItem({id: 0, name: 'new category'});
    }

    async save(form: Partial<Category>) {
        const id = this.item?.id;
        if (!!id && id > 0)
            await this.store.updateItem(id, form);
        else
            await this.store.createItem(form);
    }

    onGlobalFilter(table: Table, search: string) {
        table.filterGlobal(search, 'contains');
    }

    detectCycle(categories:Category[], categoryId: number | undefined, parentId: number | undefined | null, visited = new Set<number>()): boolean {
        if (!categoryId || categoryId===0) return false;
        if (!parentId) return false;
        if (parentId === categoryId) return true;
        if (visited.has(parentId)) return true;
        
        visited.add(parentId);
        const parent = categories.find(c => c.id === parentId);
        if (!parent || parent.parent_id === null) return false;
        
        return this.detectCycle(categories, categoryId, parent.parent_id, visited);
    };

    
    // Function to build category hierarchy
    buildHierarchy(categories: Category[]): THierarchy {
        
        const categoryMap = new Map(categories.map(c => [c.id, c]));
        const rootCategories = categories.filter(category => !category.parent_id || !categoryMap.has(category.parent_id));

        const buildTree = (cats: Category[]): THierarchy => {
            return cats.map(category => {
                const children = categories.filter(c => c.parent_id === category.id);
                const item: IHierarchyItem = { key: category.id, label: category.name, data: category, icon: 'pi pi-fw pi-tag' };
                if (children.length > 0) {
                    item.children = buildTree(children);
                    item.icon = 'pi pi-fw pi-tags';
                }
                return item;
            });
        };
        
        return buildTree(rootCategories);
    }
}