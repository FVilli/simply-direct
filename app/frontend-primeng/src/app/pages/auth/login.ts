import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ILoginMsg } from '@common/interfaces';
import { CoreService } from '../../../core.service';
import { ComponentsImports, NgImports, PrimeNgImports } from '../../../ng.imports';
import { ROOT } from '../../../app.routes';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [...NgImports, ...PrimeNgImports, ...ComponentsImports],
    providers: [MessageService],
    template: `
        <app-floating-configurator />
        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
            <div class="flex flex-col items-center justify-center">
                <div style="padding: 0.3rem;">
                    <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 rounded-xl">
                        <div class="text-center mb-8">
                        
                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4 gap-4">
                                <b>IOT</b> 
                                <i class="pi pi-spin pi-microchip mx-2 text-primary" style="font-size: 1.8rem"></i>
                                <span>Appliance</span>
                            </div>
                            <span class="text-muted-color font-medium">Sign in to continue</span>
                        </div>

                        <div>
                            <form [formGroup]="myForm" (ngSubmit)="onSubmit()">
                                <label for="username" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Username</label>
                                <input pInputText id="username" type="text" placeholder="Username" class="w-full md:w-[30rem] mb-8" formControlName="username" (focus)="onFocus()" />

                                <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                                <p-password id="password" placeholder="Password" formControlName="password" [toggleMask]="true" styleClass="mb-4" [fluid]="true" [feedback]="false" (focus)="onFocus()"></p-password>

                                <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                                    <div class="flex items-center">
                                        <p-checkbox  id="rememberme" formControlName="rememberme" binary class="mr-2"></p-checkbox>
                                        <label for="rememberme">Remember me</label>
                                    </div>
                                    <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                                </div>
                                <p-button type="submit" label="Sign In" styleClass="w-full" [disabled]="myForm.invalid"></p-button>
                            </form>

                            @if($issue()) {
                                <div class="mt-6">
                                    <p-message severity="error">Access denied</p-message>
                                </div>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Login implements OnInit {

    root = ROOT;
    email: string = '';

    password: string = '';

    checked: boolean = false;

    readonly core = inject(CoreService);
    readonly formBuilder = inject(FormBuilder);
    readonly router = inject(Router);
    myForm!: FormGroup;

    $issue =  signal('');

    ngOnInit(): void {
        this.myForm = this.formBuilder.group({
            username: ['', [Validators.required, Validators.minLength(4)]],
            password: ['', [Validators.required, Validators.minLength(4)]],
            rememberme: [true],
          }); 
      }
    
      async onSubmit() {
        if (this.myForm.valid) {
            this.$issue.set('');
            const loginForm = <ILoginMsg>this.myForm.getRawValue();
            console.log('Form Submitted', loginForm);
            const rv = await this.core.login(loginForm.username, loginForm.password);
            console.log('Login response', rv);
            if(!!rv) 
                this.router.navigate([ROOT]);
            else
                this.$issue.set('Access denied');
        }
      }

      onFocus() {
        this.$issue.set('');
      }
}
