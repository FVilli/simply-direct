import { Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-field-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="field mb-4">
        <label [for]="field()" class="block mb-2 font-medium">{{ label() }}</label>
        <div class="p-inputgroup">
            <ng-content></ng-content>
        </div>
    </div>`,
})
export class FieldContainerComponent {
  readonly label = input.required<string>()
  readonly field = input.required<string>()
}