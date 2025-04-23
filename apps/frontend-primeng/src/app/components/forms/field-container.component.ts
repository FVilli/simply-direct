import { Component, input } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-field-container',
    template: `<div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
        <label [for]="field()" class="font-semibold w-full sm:w-40 sm:text-right">{{ label() }}</label>
        <div class="flex flex-col">
            <ng-content></ng-content>
        </div>
    </div>`
})
export class FormFieldContainer {
    readonly label = input.required<string>()
    readonly field = input.required<string>()
}
    
