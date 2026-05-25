import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registro-estudiante',
    loadComponent: () => import('./pages/auth/registro-estudiante/registro-estudiante.component').then(m => m.RegistroEstudianteComponent)
  },
  {
    path: 'registro-empresa',
    loadComponent: () => import('./pages/auth/registro-empresa/registro-empresa.component').then(m => m.RegistroEmpresaComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard, roleGuard],
    data: { rol: 'ADMIN' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'usuarios', loadComponent: () => import('./pages/admin/usuarios/usuarios.component').then(m => m.UsuariosComponent) },
      { path: 'empresas', loadComponent: () => import('./pages/admin/empresas/empresas.component').then(m => m.EmpresasComponent) },
      { path: 'empresas-pendientes', loadComponent: () => import('./pages/admin/empresas-pendientes/empresas-pendientes.component').then(m => m.EmpresasPendientesComponent) },
      { path: 'ofertas', loadComponent: () => import('./pages/admin/ofertas/ofertas.component').then(m => m.OfertasComponent) },
    ]
  },
  {
    path: 'estudiante',
    loadComponent: () => import('./pages/estudiante/estudiante-layout/estudiante-layout.component').then(m => m.EstudianteLayoutComponent),
    canActivate: [authGuard, roleGuard],
    data: { rol: 'ESTUDIANTE' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/estudiante/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'perfil', loadComponent: () => import('./pages/estudiante/perfil/perfil.component').then(m => m.PerfilComponent) },
      { path: 'ofertas', loadComponent: () => import('./pages/estudiante/ofertas/ofertas.component').then(m => m.OfertasComponent) },
      { path: 'postulaciones', loadComponent: () => import('./pages/estudiante/postulaciones/postulaciones.component').then(m => m.PostulacionesComponent) },
    ]
  },
  {
    path: 'empresa',
    loadComponent: () => import('./pages/empresa/empresa-layout/empresa-layout.component').then(m => m.EmpresaLayoutComponent),
    canActivate: [authGuard, roleGuard],
    data: { rol: 'EMPRESA' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./pages/empresa/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'ofertas', loadComponent: () => import('./pages/empresa/ofertas/ofertas.component').then(m => m.OfertasComponent) },
      { path: 'postulantes', loadComponent: () => import('./pages/empresa/postulantes/postulantes.component').then(m => m.PostulantesComponent) },
      { path: 'perfil', loadComponent: () => import('./pages/empresa/perfil/perfil.component').then(m => m.PerfilComponent) },
    ]
  },
  { path: '**', redirectTo: '' }
];
