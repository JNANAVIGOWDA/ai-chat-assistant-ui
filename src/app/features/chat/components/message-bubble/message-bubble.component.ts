import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Message } from '../../../../core/models/message.model';

/**
 * MessageBubbleComponent - Renders individual User and AI message bubbles.
 * 
 * Angular Concept Explanation:
 * - @Input(): Accepts a Message object from the parent ChatWindowComponent.
 * - DatePipe: Angular built-in pipe used to format message timestamps.
 */
@Component({
  selector: 'app-message-bubble',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="message-row" [class.user-row]="message.sender === 'user'" [class.ai-row]="message.sender === 'ai'">
      <!-- Avatar -->
      <div class="avatar" [class.ai-avatar]="message.sender === 'ai'">
        <span *ngIf="message.sender === 'ai'">🤖</span>
        <span *ngIf="message.sender === 'user'">👤</span>
      </div>

      <!-- Content Box -->
      <div class="bubble-wrapper">
        <div class="sender-label">
          <span>{{ message.sender === 'ai' ? 'AI Assistant' : 'You' }}</span>
          <span class="time-stamp">{{ message.timestamp | date:'shortTime' }}</span>
        </div>
        
        <div class="bubble-body">
          <p class="message-text">{{ message.content }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .message-row {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
      max-width: 85%;
    }

    .user-row {
      margin-left: auto;
      flex-direction: row-reverse;
    }

    .ai-row {
      margin-right: auto;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #334155;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      flex-shrink: 0;
    }

    .ai-avatar {
      background: rgba(99, 102, 241, 0.25);
      border: 1px solid rgba(99, 102, 241, 0.4);
    }

    .bubble-wrapper {
      display: flex;
      flex-direction: column;
    }

    .sender-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #94a3b8;
      margin-bottom: 0.25rem;
      padding: 0 0.2rem;
    }

    .user-row .sender-label {
      justify-content: flex-end;
    }

    .time-stamp {
      font-size: 0.7rem;
      color: #64748b;
    }

    .bubble-body {
      padding: 0.85rem 1.1rem;
      border-radius: 14px;
      line-height: 1.5;
      font-size: 0.95rem;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .user-row .bubble-body {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff;
      border-bottom-right-radius: 2px;
      box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2);
    }

    .ai-row .bubble-body {
      background: #1e293b;
      color: #f1f5f9;
      border: 1px solid #334155;
      border-bottom-left-radius: 2px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
    }

    .message-text {
      margin: 0;
    }

    @media (max-width: 600px) {
      .message-row {
        max-width: 92%;
      }
    }
  `]
})
export class MessageBubbleComponent {
  @Input({ required: true }) message!: Message;
}
