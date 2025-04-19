import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { ROOT } from '../../../app.routes';

@Component({
    selector: 'app-error',
    imports: [ButtonModule, RippleModule, RouterModule, AppFloatingConfigurator, ButtonModule],
    standalone: true,
    template: ` <app-floating-configurator />
    
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">

                <div class="font-medium text-xl" >
                    <b>IOT</b> 
                    <i class="pi pi-spin pi-microchip mx-2 text-primary" style="font-size: 1.8rem"></i>
                    <span>Appliance</span>
                </div>

                <div style="padding: 0.3rem;">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 flex flex-col items-center rounded-xl" >
                        <div class="gap-4 flex flex-col items-center">
                            <div class="flex justify-center items-center border-2 border-pink-500 rounded-full" style="height: 3.2rem; width: 3.2rem">
                                <i class="pi pi-fw pi-exclamation-circle !text-2xl text-pink-500"></i>
                            </div>
                            <h1 class="text-surface-900 dark:text-surface-0 font-bold text-5xl mb-2">Error Occured</h1>
                            <span class="text-muted-color mb-8">Requested resource is not available.</span>
                            <img src="https://primefaces.org/cdn/templates/sakai/auth/asset-error.svg" alt="Error" class="mb-8" width="80%" />
                            <div class="col-span-12 mt-8 text-center">
                                <p-button label="Go to Home" [routerLink]="root" severity="danger" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
})
export class Error {
    root = ROOT;
}
