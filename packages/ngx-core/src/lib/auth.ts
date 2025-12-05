import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CoreService } from './core.service';
export function authGuard(): CanActivateFn {
  return () => {
    const router = inject(Router);
    const core = inject(CoreService);
    if (core.$loggedIn()) return true;
    router.navigate(['/']);
    return false;
  };
}