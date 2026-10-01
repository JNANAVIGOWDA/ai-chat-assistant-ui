import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

/**
 * AuthService - Angular Dependency Injection Service
 * 
 * Concept Explanation:
 * - @Injectable({ providedIn: 'root' }): Tells Angular that this class can be injected
 *   into components/guards across the entire application as a Singleton instance.
 * - BehaviorSubject: An RxJS subject that holds the current value (e.g. current user)
 *   and emits it immediately to any new subscribers.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'ai_chat_user';

  // BehaviorSubject initialized with user from localStorage or null
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  
  // Observable stream exposed to components (read-only)
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor() {}

  /**
   * Simulates user login with mock credentials.
   * Returns an RxJS Observable to simulate async authentication request.
   */
  login(email: string): Observable<User> {
    const mockUser: User = {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0].toUpperCase(),
      email: email,
      role: 'Candidate Interviewee',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=candidate'
    };

    // Simulate 800ms network delay using RxJS 'of' and 'delay'
    return of(mockUser).pipe(
      delay(800),
      tap((user) => {
        // Save state in local storage and notify subscribers
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  /**
   * Logs out the current user and clears session state.
   */
  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUserSubject.next(null);
  }

  /**
   * Synchronously checks if a user is currently logged in.
   */
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Returns current user snapshot.
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Helper to retrieve persisted user from browser localStorage.
   */
  private getStoredUser(): User | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  }
}
