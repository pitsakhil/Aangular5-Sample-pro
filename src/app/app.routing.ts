import { AppComponent } from './app.component';
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { InquisivDashboardRouting } from './core/constants/app-routing';
import { Error500Component } from './common/shared/components';


/**
* Here defines the routes of the application
*/
export const routes: Routes = [
    { path: '', loadChildren: './modules/projects/project.module#ProjectModule' },
    { path: '**', redirectTo: '', pathMatch: 'full' },
    { path: InquisivDashboardRouting.WENT_WRONG, component: Error500Component },

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
