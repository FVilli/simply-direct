import { Component, inject, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { CoreService } from '../../../core.service';
import { ComponentsImports, NgImports, PrimeNgImports } from '../../../ng.imports';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [...NgImports,...PrimeNgImports, ...ComponentsImports],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <b>IOT</b> 
                <i [ngClass]="{ 'pi ': true, 'pi-spin': core.$connected(), 'pi-microchip': true, 'text-primary': true  }" style="font-size: 1.8rem"></i>
                <span>Appliance</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                    <button type="button" class="layout-topbar-action" (click)="toggleLogoutConfirm()">
                        <i class="pi pi-sign-out"></i>
                        <span>Logout</span>
                    </button>
                    
                </div>
            </div>
        </div>
    </div>
    <p-dialog header="Logout" [visible]="$showLogoutConfirm()" (visibleChange)="close()" [style]="{ width: '350px' }" [modal]="true">
        <div class="flex items-center justify-center">
            <!-- <i class="pi pi-sign-out mr-4" style="font-size: 2rem"> </i> -->
            <span>Are you sure you want to proceed?</span>
        </div>
        <ng-template #footer>
            <p-button label="No" icon="pi pi-times" (click)="close()" text severity="secondary" />
            <p-button label="Yes" icon="pi pi-check" (click)="logout()" severity="danger" outlined autofocus />
        </ng-template>
    </p-dialog>`
})
export class AppTopbar {
    items!: MenuItem[];

    readonly layoutService = inject(LayoutService);
    readonly core = inject(CoreService);
    readonly router = inject(Router);
    $showLogoutConfirm = signal(false);

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    toggleLogoutConfirm() {
        this.$showLogoutConfirm.update((state) => !state);
    }

    close() {
        this.$showLogoutConfirm.set(false);
    }

    async logout() {
        await this.core.logout();
        this.router.navigate(['/']);
    }
}
