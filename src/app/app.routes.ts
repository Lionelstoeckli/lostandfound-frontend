import {Routes} from '@angular/router';
import {appCanActivate} from './guard/app.auth.guard';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {NoAccessComponent} from './pages/no-access/no-access.component';
import {AppRoles} from '../app.roles';
import {UserListComponent} from './pages/user-list/user-list.component';
import {UserDetailComponent} from './pages/user-detail/user-detail.component';
import {ItemListComponent} from './pages/item-list/item-list.component';
import {ItemDetailComponent} from './pages/item-detail/item-detail.component';
import {ReportListComponent} from './pages/report-list/report-list.component';
import {ReportDetailComponent} from './pages/report-detail/report-detail.component';
import {ClaimListComponent} from './pages/claim-list/claim-list.component';
import {ClaimDetailComponent} from './pages/claim-detail/claim-detail.component';

export const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'dashboard', component: DashboardComponent},

  {path: 'items', component: ItemListComponent, canActivate: [appCanActivate], data: {roles: [AppRoles.User]}},
  {
    path: 'item', canActivate: [appCanActivate], component: ItemDetailComponent, pathMatch: 'full',
    data: {roles: [AppRoles.User]}
  },
  {
    path: 'item/:id', canActivate: [appCanActivate], component: ItemDetailComponent, pathMatch: 'full',
    data: {roles: [AppRoles.User]}
  },

  {path: 'reports', component: ReportListComponent, canActivate: [appCanActivate], data: {roles: [AppRoles.User]}},
  {
    path: 'report', canActivate: [appCanActivate], component: ReportDetailComponent, pathMatch: 'full',
    data: {roles: [AppRoles.User]}
  },
  {
    path: 'report/:id', canActivate: [appCanActivate], component: ReportDetailComponent, pathMatch: 'full',
    data: {roles: [AppRoles.User]}
  },

  {path: 'claims', component: ClaimListComponent, canActivate: [appCanActivate], data: {roles: [AppRoles.User]}},
  {
    path: 'claim', canActivate: [appCanActivate], component: ClaimDetailComponent, pathMatch: 'full',
    data: {roles: [AppRoles.User]}
  },
  {
    path: 'claim/:id', canActivate: [appCanActivate], component: ClaimDetailComponent, pathMatch: 'full',
    data: {roles: [AppRoles.User]}
  },

  {path: 'users', component: UserListComponent, canActivate: [appCanActivate], data: {roles: [AppRoles.Admin]}},
  {
    path: 'user', canActivate: [appCanActivate], component: UserDetailComponent, pathMatch: 'full',
    data: {roles: [AppRoles.Admin]}
  },
  {
    path: 'user/:id', canActivate: [appCanActivate], component: UserDetailComponent, pathMatch: 'full',
    data: {roles: [AppRoles.Admin]}
  },

  {path: 'noaccess', component: NoAccessComponent},
];
