import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { ChatService } from '../../core/services/chat.service';
import { User } from '../../core/models/user.model';
import { Message } from '../../core/models/message.model';

import { HeaderComponent } from './components/header/header.component';
import { ChatWindowComponent } from './components/chat-window/chat-window.component';
import { ChatInputComponent } from './components/chat-input/chat-input.component';

/**
 * ChatComponent - Main Dashboard Container Component
 * 
 * Angular Concepts:
 * - AsyncPipe (| async): Automatically subscribes to RxJS Observables in the template
 *   and unsubscribes when the component is destroyed (prevents memory leaks).
 * - Dependency Injection: AuthService and ChatService injected via constructor.
 */
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ChatWindowComponent,
    ChatInputComponent
  ],
  template: `
    <div class="chat-dashboard-container">
      <!-- Top Header -->
      <app-header 
        [user]="currentUser$ | async" 
        (logout)="onLogout()"
      ></app-header>

      <!-- Main Message Area -->
      <app-chat-window 
        [messages]="(messages$ | async) || []"
        [isLoading]="(isLoading$ | async) || false"
        [errorMessage]="error$ | async"
        (dismissError)="onDismissError()"
      ></app-chat-window>

      <!-- Input Bar -->
      <app-chat-input 
        [disabled]="(isLoading$ | async) || false"
        (sendMessage)="onSendMessage($event)"
      ></app-chat-input>
    </div>
  `,
  styles: [`
    .chat-dashboard-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
      background: #0f172a;
      overflow: hidden;
      font-family: system-ui, -apple-system, sans-serif;
    }
  `]
})
export class ChatComponent implements OnInit {
  currentUser$: Observable<User | null>;
  messages$: Observable<Message[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private router: Router
  ) {
    // Bind template streams directly to service observables
    this.currentUser$ = this.authService.currentUser$;
    this.messages$ = this.chatService.messages$;
    this.isLoading$ = this.chatService.isLoading$;
    this.error$ = this.chatService.error$;
  }

  ngOnInit(): void {
    // Component lifecycle init
  }

  /**
   * Called when user types a message or clicks a prompt pill.
   */
  onSendMessage(prompt: string): void {
    this.chatService.sendMessage(prompt);
  }

  /**
   * Clears active error banner.
   */
  onDismissError(): void {
    this.chatService.clearError();
  }

  /**
   * Logs user out and navigates back to /login.
   */
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
