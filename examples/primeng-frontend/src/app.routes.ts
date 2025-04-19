import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { authGuard } from './core.service';

export const ROOT = '/wa';

export const appRoutes: Routes = [
    { path: '', component: Landing },
    {
        path: 'wa',
        canActivate: [authGuard()],
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
            { path: 'entities', loadChildren: () => import('./app/pages/entities/entities.routes') },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'documentation', component: Documentation },
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
