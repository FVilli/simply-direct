import { Component, signal } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        <a href="https://www.eagleprojects.it" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">EagleProjects</a>©<b>{{ year() }}</b>
    </div>`
})
export class AppFooter {
    year = signal(new Date().getFullYear());
}
