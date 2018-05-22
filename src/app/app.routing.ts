import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReportsComponent } from './components/reports/reports.component';
import {BlogCreateComponent} from './components/blog-create/blog-create.component';
import {BlogListComponent} from './components/blog-list/blog-list.component';
import {BlogViewComponent} from './components/blog-view/blog-view.component';

import { AuthGuard } from './services/auth-guard.service';

const route: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'reports/:type', component: ReportsComponent, canActivate: [AuthGuard] },
    { path: 'blog-create', component: BlogCreateComponent, canActivate: [AuthGuard]},
    { path: 'blog-list', component: BlogListComponent, canActivate: [AuthGuard]},
    { path: 'blog-view/:id/:type', component: BlogViewComponent, canActivate: [AuthGuard]},    
    // otherwise redirect to home
    { path: '**', redirectTo: 'dashboard' }
]

export const routing = RouterModule.forRoot(route, { useHash: true });
