import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then(m => m.RegisterPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'content',
    loadComponent: () => import('./content/content.page').then(m => m.ContentPage)
  },
  {
    path: 'coba',
    loadComponent: () => import('./coba/coba.page').then(m => m.CobaPage)
  },

  {
    path: 'hasil-voting',
    loadComponent: () => import('./hasil-voting/hasil-voting.page').then(m => m.HasilVotingPage)
  },

  {
    path: 'data-calon',
    loadComponent: () => import('./data-calon/data-calon.page').then(m => m.DataCalonPage)
  },
  {
    path: 'data-calon-terdaftar',
    loadComponent: () => import('./data-calon-terdaftar/data-calon-terdaftar.page').then(m => m.DataCalonTerdaftarPage)
  },
  {
    path: 'login-admin',
    loadComponent: () => import('./login-admin/login-admin.page').then(m => m.LoginAdminPage)
  },
];
