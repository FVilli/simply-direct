import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { ROOT } from '../../../app.routes';

@Component({
    selector: `app-menu`,
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                //label: `Home`,
                items: [
                    { label: `Home`, icon: `pi pi-fw pi-home`, routerLink: [ROOT] },
                    {
                        label: `Entities`,
                        icon: `pi pi-fw pi-box`,
                        items: [
                            {
                                label: `Users`,
                                icon: `pi pi-fw pi-users`,
                                routerLink: [`${ROOT}/entities/users`]
                            },
                            {
                                label: `Companies`,
                                icon: `pi pi-fw pi-building`,
                                routerLink: [`${ROOT}/entities/companies`]
                            },
                            {
                                label: `Sites`,
                                icon: `pi pi-fw pi-map-marker`,
                                routerLink: [`${ROOT}/entities/sites`]
                            },
                            {
                                label: `Vendors`,
                                icon: `pi pi-fw pi-shopping-bag`,
                                routerLink: [`${ROOT}/entities/vendors`]
                            },
                            {
                                label: `Categories`,
                                icon: `pi pi-fw pi-tags`,
                                routerLink: [`${ROOT}/entities/categories`]
                            },
                            {
                                label: `Appliances`,
                                icon: `pi pi-fw pi-server`,
                                routerLink: [`${ROOT}/entities/appliances`]
                            },
                            {
                                label: `Sensor Types`,
                                icon: `pi pi-fw pi-chart-line`,
                                routerLink: [`${ROOT}/entities/sensor-types`]
                            },
                            {
                                label: `Device Types`,
                                icon: `pi pi-fw pi-microchip`,
                                routerLink: [`${ROOT}/entities/device-types`]
                            },
                        ],
                    },
                    {
                        label: `Crud`,
                        icon: `pi pi-fw pi-pencil`,
                        routerLink: [`${ROOT}/pages/crud`]
                    },
                    {
                        label: `Not Found`,
                        icon: `pi pi-fw pi-exclamation-circle`,
                        routerLink: [`${ROOT}/pages/notfound`]
                    },
                    {
                        label: `Empty`,
                        icon: `pi pi-fw pi-circle-off`,
                        routerLink: [`${ROOT}/pages/empty`]
                    }
                ]
            },
            {
                label: `Public`,
                icon: `pi pi-fw pi-briefcase`,
                routerLink: [`/pages`],
                items: [
                    {
                        label: `Landing`,
                        icon: `pi pi-fw pi-globe`,
                        routerLink: [`/`]
                    },
                    {
                        label: `Auth`,
                        icon: `pi pi-fw pi-user`,
                        items: [
                            {
                                label: `Login`,
                                icon: `pi pi-fw pi-sign-in`,
                                routerLink: [`/auth/login`]
                            },
                            {
                                label: `Error`,
                                icon: `pi pi-fw pi-times-circle`,
                                routerLink: [`/auth/error`]
                            },
                            {
                                label: `Access Denied`,
                                icon: `pi pi-fw pi-lock`,
                                routerLink: [`/auth/access`]
                            }
                        ]
                    },
                    {
                        label: `UI Components`,
                        icon: `pi pi-fw pi-box`,
                        items: [
                            
                            { label: `Form Layout`, icon: `pi pi-fw pi-id-card`, routerLink: [`${ROOT}/uikit/formlayout`] },
                            { label: `Input`, icon: `pi pi-fw pi-check-square`, routerLink: [`${ROOT}/uikit/input`] },
                            { label: `Button`, icon: `pi pi-fw pi-mobile`, class: `rotated-icon`, routerLink: [`${ROOT}/uikit/button`] },
                            { label: `Table`, icon: `pi pi-fw pi-table`, routerLink: [`${ROOT}/uikit/table`] },
                            { label: `List`, icon: `pi pi-fw pi-list`, routerLink: [`${ROOT}/uikit/list`] },
                            { label: `Tree`, icon: `pi pi-fw pi-share-alt`, routerLink: [`${ROOT}/uikit/tree`] },
                            { label: `Panel`, icon: `pi pi-fw pi-tablet`, routerLink: [`${ROOT}/uikit/panel`] },
                            { label: `Overlay`, icon: `pi pi-fw pi-clone`, routerLink: [`${ROOT}/uikit/overlay`] },
                            { label: `Media`, icon: `pi pi-fw pi-image`, routerLink: [`${ROOT}/uikit/media`] },
                            { label: `Menu`, icon: `pi pi-fw pi-bars`, routerLink: [`${ROOT}/uikit/menu`] },
                            { label: `Message`, icon: `pi pi-fw pi-comment`, routerLink: [`${ROOT}/uikit/message`] },
                            { label: `File`, icon: `pi pi-fw pi-file`, routerLink: [`${ROOT}/uikit/file`] },
                            { label: `Chart`, icon: `pi pi-fw pi-chart-bar`, routerLink: [`${ROOT}/uikit/charts`] },
                            { label: `Timeline`, icon: `pi pi-fw pi-calendar`, routerLink: [`${ROOT}/uikit/timeline`] },
                            { label: `Misc`, icon: `pi pi-fw pi-circle`, routerLink: [`${ROOT}/uikit/misc`] }
                        ]
                    },
                ]
            },
            // {
            //     label: `Hierarchy`,
            //     items: [
            //         {
            //             label: `Submenu 1`,
            //             icon: `pi pi-fw pi-bookmark`,
            //             items: [
            //                 {
            //                     label: `Submenu 1.1`,
            //                     icon: `pi pi-fw pi-bookmark`,
            //                     items: [
            //                         { label: `Submenu 1.1.1`, icon: `pi pi-fw pi-bookmark` },
            //                         { label: `Submenu 1.1.2`, icon: `pi pi-fw pi-bookmark` },
            //                         { label: `Submenu 1.1.3`, icon: `pi pi-fw pi-bookmark` }
            //                     ]
            //                 },
            //                 {
            //                     label: `Submenu 1.2`,
            //                     icon: `pi pi-fw pi-bookmark`,
            //                     items: [{ label: `Submenu 1.2.1`, icon: `pi pi-fw pi-bookmark` }]
            //                 }
            //             ]
            //         },
            //         {
            //             label: `Submenu 2`,
            //             icon: `pi pi-fw pi-bookmark`,
            //             items: [
            //                 {
            //                     label: `Submenu 2.1`,
            //                     icon: `pi pi-fw pi-bookmark`,
            //                     items: [
            //                         { label: `Submenu 2.1.1`, icon: `pi pi-fw pi-bookmark` },
            //                         { label: `Submenu 2.1.2`, icon: `pi pi-fw pi-bookmark` }
            //                     ]
            //                 },
            //                 {
            //                     label: `Submenu 2.2`,
            //                     icon: `pi pi-fw pi-bookmark`,
            //                     items: [{ label: `Submenu 2.2.1`, icon: `pi pi-fw pi-bookmark` }]
            //                 }
            //             ]
            //         }
            //     ]
            // },
            {
                label: `About`,
                items: [
                    {
                        label: `Documentation`,
                        icon: `pi pi-fw pi-book`,
                        url: `/docs`,
                        target: `_blank`
                    },
                    {
                        label: `View Source`,
                        icon: `pi pi-fw pi-github`,
                        url: `https://github.com/primefaces/sakai-ng`,
                        target: `_blank`
                    }
                ]
            }
        ];
    }
}
