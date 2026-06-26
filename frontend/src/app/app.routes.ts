import { Routes } from '@angular/router';

import { authGuard, guestGuard, inicioRedirectGuard, roleGuard } from './core/auth/auth.guard';

/**
 * Baseline del router (ticket 1). Estructura y guards completos; todas las
 * pantallas apuntan al Placeholder hasta que los tickets 2-6 las implementen.
 *
 * - /login              público (guestGuard: si ya hay sesión → /inicio)
 * - /inicio             requiere sesión; reenvía a /inicio/{rol}
 * - /inicio/{rol}/...   protegido por rol (roleGuard)
 * - **                  cae a /inicio (que reenvía o manda a /login)
 */
const placeholder = () => import('./features/placeholder/placeholder').then((m) => m.Placeholder);
const adminHome = () => import('./features/admin/admin-home/admin-home').then((m) => m.AdminHomeComponent);
const serviciosAdmin = () => import('./features/admin/servicios-admin/servicios-admin').then((m) => m.ServiciosAdminComponent);
const profesionalesAdmin = () => import('./features/admin/profesionales-admin/profesionales-admin').then((m) => m.ProfesionalesAdminComponent);
const usuariosAdmin = () => import('./features/admin/usuarios-admin/usuarios-admin').then((m) => m.UsuariosAdminComponent);

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: placeholder,
  },
  {
    path: 'inicio',
    canActivate: [authGuard],
    children: [
      { path: '', canActivate: [inicioRedirectGuard], loadComponent: placeholder },
      {
        path: 'admin',
        canActivate: [roleGuard('ADMIN')],
        children: [
          { path: '', loadComponent: adminHome },
          { path: 'servicios', loadComponent: serviciosAdmin },
          { path: 'usuarios', loadComponent: usuariosAdmin },
          { path: 'profesionales', loadComponent: profesionalesAdmin },
        ],
      },
      {
        path: 'profesional',
        canActivate: [roleGuard('PROFESIONAL')],
        children: [
          { path: '', loadComponent: placeholder },
          { path: 'mis-turnos', loadComponent: placeholder },
          { path: 'crear-disponibilidad', loadComponent: placeholder },
          { path: 'mi-perfil', loadComponent: placeholder },
        ],
      },
      {
        path: 'cliente',
        canActivate: [roleGuard('CLIENTE')],
        children: [
          { path: '', loadComponent: placeholder },
          { path: 'disponibilidades', loadComponent: placeholder },
          { path: 'mis-turnos', loadComponent: placeholder },
          { path: 'mi-perfil', loadComponent: placeholder },
        ],
      },
    ],
  },
  { path: '**', redirectTo: 'inicio' },
];
