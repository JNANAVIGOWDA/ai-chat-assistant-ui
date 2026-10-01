import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

/**
 * LoginComponent - Angular Reactive Forms Implementation
 * 
 * Angular Concept Explanation:
 * - Reactive Forms (@angular/forms): Provides a model-driven approach to handling form inputs.
 * - FormGroup: Represents a group of form controls (email, password) and tracks their value & validity.
 * - FormBuilder: Helper service to easily construct FormGroups and FormControls.
 * - Validators: Built-in functions to enforce input rules (required, email format, min length).
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <!-- Brand Header -->
        <div class="brand-header">
          <div class="brand-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
              <path d="M12 12L2.1 12a10 10 0 0 0 9.9 10V12z"></path>
              <path d="M20 12A8 8 0 1 0 4 12"></path>
            </svg>
          </div>
          <h1>AI Chat Assistant UI</h1>
          <p class="subtitle">Interview Practice & Candidate Prep Platform</p>
        </div>

        <!-- Reactive Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          
          <!-- Email Field -->
          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              id="email"
              type="email"
              formControlName="email"
              placeholder="candidate@example.com"
              [class.is-invalid]="isFieldInvalid('email')"
            />
            <!-- Validation Messages -->
            <div *ngIf="isFieldInvalid('email')" class="error-msg">
              <span *ngIf="loginForm.get('email')?.errors?.['required']">Email is required.</span>
              <span *ngIf="loginForm.get('email')?.errors?.['email']">Please enter a valid email address.</span>
            </div>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password"
              type="password"
              formControlName="password"
              placeholder="••••••••"
              [class.is-invalid]="isFieldInvalid('password')"
            />
            <!-- Validation Messages -->
            <div *ngIf="isFieldInvalid('password')" class="error-msg">
              <span *ngIf="loginForm.get('password')?.errors?.['required']">Password is required.</span>
              <span *ngIf="loginForm.get('password')?.errors?.['minlength']">Password must be at least 6 characters long.</span>
            </div>
          </div>

          <!-- Quick Tip Banner for Interview Prep -->
          <div class="demo-hint">
            <small>💡 <strong>Interview Demo Tip:</strong> You can enter any valid email (e.g., candidate&#64;interview.com) &amp; 6+ character password to log in.</small>
          </div>

          <!-- Submit Button -->
          <button type="submit" [disabled]="loginForm.invalid || isSubmitting" class="btn-submit">
            <span *ngIf="!isSubmitting">Sign In &amp; Start Practice →</span>
            <span *ngIf="isSubmitting" class="spinner-text">Authenticating...</span>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
      padding: 1.5rem;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .login-card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 2.5rem;
      width: 100%;
      max-width: 440px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
      color: #f8fafc;
    }

    .brand-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .brand-icon {
      width: 56px;
      height: 56px;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: #818cf8;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem auto;
    }

    .brand-header h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #f8fafc;
      margin: 0 0 0.4rem 0;
    }

    .subtitle {
      font-size: 0.875rem;
      color: #94a3b8;
      margin: 0;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #cbd5e1;
    }

    input {
      background: #0f172a;
      border: 1px solid #475569;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      font-size: 0.95rem;
      color: #f8fafc;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
    }

    input.is-invalid {
      border-color: #ef4444;
    }

    .error-msg {
      font-size: 0.8rem;
      color: #f87171;
      margin-top: 0.2rem;
    }

    .demo-hint {
      background: rgba(99, 102, 241, 0.1);
      border-left: 3px solid #6366f1;
      padding: 0.6rem 0.8rem;
      border-radius: 4px;
      font-size: 0.8rem;
      color: #c7d2fe;
    }

    .btn-submit {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff;
      border: none;
      border-radius: 8px;
      padding: 0.85rem 1rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s ease, transform 0.1s ease;
      margin-top: 0.5rem;
    }

    .btn-submit:hover:not(:disabled) {
      opacity: 0.95;
      transform: translateY(-1px);
    }

    .btn-submit:disabled {
      background: #475569;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .spinner-text {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // If user is already logged in, redirect directly to /chat
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/chat']);
      return;
    }

    // Initialize Reactive Form with FormBuilder & Validation Rules
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Helper method to check if a form control is invalid and touched/dirty.
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  /**
   * Called when candidate submits the login form.
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const emailValue = this.loginForm.value.email;

    this.authService.login(emailValue).subscribe({
      next: () => {
        this.isSubmitting = false;
        // Navigate to /chat dashboard after successful auth
        this.router.navigate(['/chat']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Login error:', err);
      }
    });
  }
}
