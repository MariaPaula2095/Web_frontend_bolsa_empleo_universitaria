import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const required = route.data['rol'] as string;
  const userRol = localStorage.getItem('rol');
  if (required && userRol !== required) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
