import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from '../../../../core/models/message.model';
import { MessageBubbleComponent } from '../message-bubble/message-bubble.component';
import { LoadingIndicatorComponent } from '../loading-indicator/loading-indicator.component';

/**
 * ChatWindowComponent - Container component for the message feed.
 * 
 * Angular Concepts:
 * - @ViewChild: Accesses a DOM element reference (#scrollContainer) inside the template.
 * - AfterViewChecked: Angular lifecycle hook triggered after Angular checks component view changes.
 *   Used here to auto-scroll chat to the latest message.
 */
@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, MessageBubbleComponent, LoadingIndicatorComponent],
  template: `
    <div class="chat-window-container" #scrollContainer>
      <!-- Error Alert Banner -->
      <div *ngIf="errorMessage" class="error-banner">
        <span>⚠️ {{ errorMessage }}</span>
        <button (click)="onDismissError()" class="btn-dismiss">✕</button>
      </div>

      <!-- Empty State UI -->
      <div *ngIf="messages.length === 0" class="empty-state">
        <div class="empty-icon">💬</div>
        <h3>No Messages Yet</h3>
        <p>Start your interview practice session by selecting a prompt below or typing your own question!</p>
      </div>

      <!-- Message List -->
      <div *ngFor="let msg of messages; trackBy: trackByFn" class="message-item">
        <app-message-bubble [message]="msg"></app-message-bubble>
      </div>

      <!-- Typing Indicator -->
      <app-loading-indicator *ngIf="isLoading"></app-loading-indicator>
    </div>
  `,
  styles: [`
    .chat-window-container {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      background: #0f172a;
      scroll-behavior: smooth;
    }

    .error-banner {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.875rem;
    }

    .btn-dismiss {
      background: none;
      border: none;
      color: #fca5a5;
      cursor: pointer;
      font-weight: bold;
      font-size: 1rem;
    }

    .empty-state {
      margin: auto;
      text-align: center;
      max-width: 360px;
      padding: 2rem 1rem;
      color: #94a3b8;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.25rem;
      color: #f8fafc;
      margin: 0 0 0.5rem 0;
    }

    .empty-state p {
      font-size: 0.9rem;
      line-height: 1.5;
      margin: 0;
    }

    .message-item {
      width: 100%;
    }
  `]
})
export class ChatWindowComponent implements AfterViewChecked {
  @Input() messages: Message[] = [];
  @Input() isLoading = false;
  @Input() errorMessage: string | null = null;

  @Output() dismissError = new EventEmitter<void>();

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  private shouldScrollToBottom = true;

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
    }
  }

  /**
   * Auto-scrolls the container to the latest message.
   */
  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      // Ignore scroll error during initial view load
    }
  }

  /**
   * TrackBy function optimizes ngFor performance by tracking message IDs.
   */
  trackByFn(index: number, item: Message): string {
    return item.id;
  }

  onDismissError(): void {
    this.dismissError.emit();
  }
}
