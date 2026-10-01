import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * AuthGuard - Functional Route Guard (CanActivateFn)
 * 
 * Angular Concept Explanation:
 * - CanActivateFn: Protects routes from unauthorized access.
 * - inject(): Injects dependencies (AuthService, Router) without requiring a class constructor.
 * - Returns boolean 'true' if allowed, or a UrlTree to redirect unauthenticated users to '/login'.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // Navigation allowed
  }

  // Redirect unauthorized access to /login
  return router.createUrlTree(['/login']);
};
