import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * ChatInputComponent - Reusable input bar with quick prompt suggestions.
 * 
 * Angular Concepts:
 * - FormsModule & [(ngModel)]: Two-way data binding for the input text value.
 * - @Output() & EventEmitter: Sends user prompt up to the parent ChatComponent.
 */
@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="input-section-container">
      <!-- Starter Prompt Pills -->
      <div class="starter-prompts">
        <span class="prompts-label">Quick Prompts:</span>
        <button 
          *ngFor="let prompt of starterPrompts" 
          (click)="selectPrompt(prompt)"
          [disabled]="disabled"
          class="prompt-pill"
        >
          {{ prompt }}
        </button>
      </div>

      <!-- Main Input Bar -->
      <div class="input-bar">
        <input
          type="text"
          [(ngModel)]="messageText"
          (keydown.enter)="onSend()"
          placeholder="Ask an interview practice question..."
          [disabled]="disabled"
          class="chat-text-input"
        />

        <button 
          (click)="onSend()" 
          [disabled]="disabled || !messageText.trim()"
          class="btn-send"
          title="Send message (Enter)"
        >
          <span>Send</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .input-section-container {
      background: #1e293b;
      border-top: 1px solid #334155;
      padding: 1rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .starter-prompts {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      overflow-x: auto;
      padding-bottom: 0.25rem;
    }

    .prompts-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #94a3b8;
      white-space: nowrap;
    }

    .prompt-pill {
      background: rgba(99, 102, 241, 0.1);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: #a5b4fc;
      border-radius: 16px;
      padding: 0.3rem 0.75rem;
      font-size: 0.78rem;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }

    .prompt-pill:hover:not(:disabled) {
      background: #6366f1;
      color: #ffffff;
      border-color: #6366f1;
    }

    .prompt-pill:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .input-bar {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .chat-text-input {
      flex: 1;
      background: #0f172a;
      border: 1px solid #475569;
      border-radius: 10px;
      padding: 0.8rem 1rem;
      color: #f8fafc;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .chat-text-input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    }

    .chat-text-input:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-send {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff;
      border: none;
      border-radius: 10px;
      padding: 0.8rem 1.25rem;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-send:hover:not(:disabled) {
      opacity: 0.95;
      transform: translateY(-1px);
    }

    .btn-send:disabled {
      background: #475569;
      cursor: not-allowed;
      opacity: 0.5;
    }

    @media (max-width: 600px) {
      .input-section-container {
        padding: 0.75rem 1rem;
      }
      .btn-send span {
        display: none;
      }
      .btn-send {
        padding: 0.8rem;
      }
    }
  `]
})
export class ChatInputComponent {
  @Input() disabled = false;
  @Output() sendMessage = new EventEmitter<string>();

  messageText = '';

  // Preset prompts to help interviewees jump right into practice
  starterPrompts: string[] = [
    'Explain the STAR method',
    'Tell me about yourself',
    'Core Angular concepts',
    'Resume tips'
  ];

  onSend(): void {
    if (this.disabled || !this.messageText.trim()) return;

    this.sendMessage.emit(this.messageText.trim());
    this.messageText = ''; // Clear input field
  }

  selectPrompt(promptText: string): void {
    if (this.disabled) return;
    this.sendMessage.emit(promptText);
  }
}
