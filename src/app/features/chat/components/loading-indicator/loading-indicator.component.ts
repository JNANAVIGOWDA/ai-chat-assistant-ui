import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * LoadingIndicatorComponent - Renders typing animation when AI is processing a response.
 */
@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-row">
      <div class="avatar ai-avatar">🤖</div>
      <div class="loading-bubble">
        <span class="loading-text">AI is typing</span>
        <div class="dots">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(99, 102, 241, 0.25);
      border: 1px solid rgba(99, 102, 241, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    .loading-bubble {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 14px;
      border-bottom-left-radius: 2px;
      padding: 0.75rem 1.1rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      color: #94a3b8;
      font-size: 0.875rem;
    }

    .dots {
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .dot {
      width: 6px;
      height: 6px;
      background: #818cf8;
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out both;
    }

    .dot:nth-child(1) {
      animation-delay: -0.32s;
    }

    .dot:nth-child(2) {
      animation-delay: -0.16s;
    }

    @keyframes bounce {
      0%, 80%, 100% {
        transform: scale(0.6);
        opacity: 0.4;
      }
      40% {
        transform: scale(1.1);
        opacity: 1;
      }
    }
  `]
})
export class LoadingIndicatorComponent {}
