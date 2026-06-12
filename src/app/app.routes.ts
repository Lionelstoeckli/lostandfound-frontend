import {Routes} from '@angular/router';
import {appCanActivate} from './guard/app.auth.guard';
import {AppRoles} from '../app.roles';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },

  {
    path: 'items', canActivate: [appCanActivate], data: {roles: [AppRoles.User]},
    loadComponent: () => import('./pages/item-list/item-list.component').then(m => m.ItemListComponent)
  },
  {
    path: 'item', canActivate: [appCanActivate], pathMatch: 'full', data: {roles: [AppRoles.User]},
    loadComponent: () => import('./pages/item-detail/item-detail.component').then(m => m.ItemDetailComponent)
  },
  {
    path: 'item/:id', canActivate: [appCanActivate], pathMatch: 'full', data: {roles: [AppRoles.User]},
    loadComponent: () => import('./pages/item-detail/item-detail.component').then(m => m.ItemDetailComponent)
  },

  {
    path: 'reports', canActivate: [appCanActivate], data: {roles: [AppRoles.User]},
    loadComponent: () => import('./pages/report-list/report-list.component').then(m => m.ReportListComponent)
  },
  {
    path: 'report', canActivate: [appCanActivate], pathMatch: 'full', data: {roles: [AppRoles.User]},
    loadComponent: () => import('./pages/report-detail/report-detail.component').then(m => m.ReportDetailComponent)
  },
  {
    path: 'report/:id', canActivate: [appCanActivate], pathMatch: 'full', data: {roles: [AppRoles.User]},
    loadComponent: () => import('./pages/report-detail/report-detail.component').then(m => m.ReportDetailComponent)
  },

  {
    path: 'claims', canActivate: [appCanActivate], data: {roles: [AppRoles.User]},
    loadComponent: () => import('./pages/claim-list/claim-list.component').then(m => m.ClaimListComponent)
  },
  {
    path: 'claim', canActivate: [appCanActivate], pathMatch: 'full', data: {roles: [AppRoles.User]},
    loadComponent: () => import('./pages/claim-detail/claim-detail.component').then(m => m.ClaimDetailComponent)
  },
  {
    path: 'claim/:id', canActivate: [appCanActivate], pathMatch: 'full', data: {roles: [AppRoles.User]},
    loadComponent: () => import('./pages/claim-detail/claim-detail.component').then(m => m.ClaimDetailComponent)
  },

  {
    path: 'users', canActivate: [appCanActivate], data: {roles: [AppRoles.Admin]},
    loadComponent: () => import('./pages/user-list/user-list.component').then(m => m.UserListComponent)
  },
  {
    path: 'user', canActivate: [appCanActivate], pathMatch: 'full', data: {roles: [AppRoles.Admin]},
    loadComponent: () => import('./pages/user-detail/user-detail.component').then(m => m.UserDetailComponent)
  },
  {
    path: 'user/:id', canActivate: [appCanActivate], pathMatch: 'full', data: {roles: [AppRoles.Admin]},
    loadComponent: () => import('./pages/user-detail/user-detail.component').then(m => m.UserDetailComponent)
  },

  {
    path: 'noaccess',
    loadComponent: () => import('./pages/no-access/no-access.component').then(m => m.NoAccessComponent)
  },
];
