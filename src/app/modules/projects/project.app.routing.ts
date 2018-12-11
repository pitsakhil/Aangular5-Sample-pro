import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, ModuleGuard } from '../../core/auth';
import { ProjectComponent } from './project.component';
import { ProjectDocumentListComponent, CreateProjectComponent, ProjectDetailsComponent } from './components/';
import { ScaylaProjectRouting } from './constants/project.routing';




export const routes: Routes = [
    {
        path: '', component: ProjectComponent,
        children: [
            { path: ScaylaProjectRouting.PROJECT_DOCUMENT_LIST, component: ProjectDocumentListComponent },
            { path: ScaylaProjectRouting.CREATE_PROJECT, component: CreateProjectComponent }
        ], canActivate: [AuthGuard, ModuleGuard]
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
