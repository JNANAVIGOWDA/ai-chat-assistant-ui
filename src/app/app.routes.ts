import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { ChatComponent } from './features/chat/chat.component';
import { authGuard } from './core/guards/auth.guard';

/**
 * Application Routes Configuration
 * 
 * Angular Routing Concepts:
 * - path: Specifies the URL path (e.g. 'login', 'chat').
 * - component: The standalone Angular component to render when the route is active.
 * - canActivate: Array of route guards (authGuard) protecting the route.
 * - redirectTo: Default & wildcard fallbacks.
 */
export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'chat', 
    component: ChatComponent, 
    canActivate: [authGuard] // Protected route - requires authentication
  },
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];
