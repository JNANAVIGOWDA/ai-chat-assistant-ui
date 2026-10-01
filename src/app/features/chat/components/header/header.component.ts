import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../core/models/user.model';

/**
 * HeaderComponent - Reusable Navigation Header
 * 
 * Angular Concepts:
 * - @Component: Decorator specifying template, styles, and standalone configuration.
 * - @Input(): Accepts data passed from parent component (e.g. user object).
 * - @Output() & EventEmitter: Emits events to the parent component (e.g. logout action).
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="app-header">
      <div class="header-left">
        <div class="logo-box">
          <span class="logo-icon">🤖</span>
        </div>
        <div class="brand-info">
          <h2 class="title">AI Interview Assistant</h2>
          <div class="status-pill">
            <span class="status-dot"></span>
            <span class="status-text">AI Online</span>
          </div>
        </div>
      </div>

      <div class="header-right">
        <div *ngIf="user" class="user-badge">
          <span class="user-avatar">👤</span>
          <span class="user-email">{{ user.email }}</span>
        </div>
        <button (click)="onLogoutClick()" class="btn-logout" title="Sign out of practice session">
          <span>Logout</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.85rem 1.5rem;
      background: #1e293b;
      border-bottom: 1px solid #334155;
      color: #f8fafc;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .logo-box {
      width: 40px;
      height: 40px;
      background: rgba(99, 102, 241, 0.2);
      border: 1px solid rgba(99, 102, 241, 0.4);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .brand-info {
      display: flex;
      flex-direction: column;
    }

    .title {
      font-size: 1.1rem;
      font-weight: 700;
      margin: 0;
      color: #f8fafc;
      letter-spacing: -0.01em;
    }

    .status-pill {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.75rem;
      color: #34d399;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #0f172a;
      border: 1px solid #334155;
      padding: 0.4rem 0.75rem;
      border-radius: 20px;
      font-size: 0.85rem;
      color: #cbd5e1;
    }

    .user-avatar {
      font-size: 0.9rem;
    }

    .btn-logout {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(239, 68, 68, 0.1);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
      padding: 0.45rem 0.85rem;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-logout:hover {
      background: #ef4444;
      color: #ffffff;
      border-color: #ef4444;
    }

    @media (max-width: 600px) {
      .user-email {
        display: none;
      }
      .app-header {
        padding: 0.75rem 1rem;
      }
    }
  `]
})
export class HeaderComponent {
  @Input() user: User | null = null;
  @Output() logout = new EventEmitter<void>();

  onLogoutClick(): void {
    this.logout.emit();
  }
}
