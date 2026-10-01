# AI Chat Assistant UI (Interview Practice Project)

A clean, modern, beginner-friendly **AI Chat Assistant UI** built with **Angular (TypeScript)**. This project is specifically designed as a practical codebase for junior/fresher developers to study, run, and confidently explain during technical interviews.

---

## 📌 Project Purpose

This project is an Angular frontend demonstration with a mock AI response service. The mock service uses predefined topic matching so the application can demonstrate chat UI, services, HttpClient and RxJS without requiring a backend or external API.

The purpose of this application is to demonstrate core Angular frontend engineering concepts—including **Component Architecture**, **Angular Routing**, **Reactive Forms with Validation**, **Dependency Injection**, **RxJS Observables**, and **HttpClient** API consumption—without the bloat or cost of real backend APIs or third-party UI framework dependencies.

---

## 🚀 Technologies Used

- **Framework:** Angular 19+ (Standalone Components API)
- **Language:** TypeScript 5.x
- **Reactive Extensions:** RxJS (Observables, BehaviorSubject, Operators)
- **Forms:** Angular Reactive Forms (`FormGroup`, `FormBuilder`, `Validators`)
- **HTTP Client:** Angular `@angular/common/http` (`HttpClient`)
- **Routing:** Angular Router (`Routes`, `CanActivateFn` Auth Guard)
- **Styling:** Modular Scoped CSS with CSS Grid/Flexbox and Dark Theme

---

## 📁 Project Folder Structure

```
ai-chat-assistant-ui/
├── public/
│   ├── assets/
│   │   └── mock-ai-responses.json         # Mock JSON dataset for HttpClient GET
│   └── mock-ai-responses.json
├── src/
│   ├── main.ts                            # Angular bootstrap application entry point
│   ├── index.html                         # Primary HTML host template
│   ├── styles.css                         # Global CSS reset & theme variables
│   └── app/
│       ├── app.component.ts               # Root shell component (<router-outlet>)
│       ├── app.config.ts                  # App providers (provideRouter, provideHttpClient)
│       ├── app.routes.ts                  # Route mappings (/login, /chat, redirects)
│       ├── core/                          # Core business logic, services & guards
│       │   ├── guards/
│       │   │   └── auth.guard.ts          # CanActivateFn protecting /chat
│       │   ├── models/
│       │   │   ├── user.model.ts          # User TypeScript interface
│       │   │   └── message.model.ts       # Message & ChatState interfaces
│       │   └── services/
│       │       ├── auth.service.ts        # Authentication state DI service
│       │       └── chat.service.ts        # RxJS & HttpClient chat engine service
│       └── features/                      # Feature modules / pages
│           ├── auth/
│           │   └── login.component.ts     # Login page with Reactive Forms
│           └── chat/
│               ├── chat.component.ts      # Main Chat Dashboard container
│               └── components/            # Reusable UI components
│                   ├── header/            # App Header with User Profile & Logout
│                   ├── chat-window/       # Feed container with Auto-scroll
│                   ├── message-bubble/    # Formatted User/AI message bubbles
│                   ├── chat-input/        # Input field & Quick starter pills
│                   └── loading-indicator/ # Animated 3-dot typing indicator
├── package.json                           # Dependencies and NPM scripts
└── README.md                              # Interview study guide & project manual
```

---

## ⚙️ Core Angular Concepts Explained

### 1. How Angular Components Work in This Project
Every UI section is split into focused, single-responsibility components using Angular's **Standalone Components API**:
- **`HeaderComponent`**: Accepts the current `User` via `@Input()` and emits a logout signal via `@Output() logout = new EventEmitter<void>()`.
- **`MessageBubbleComponent`**: Formats individual messages according to `sender` (`user` vs `ai`), displaying avatars and timestamps.
- **`ChatWindowComponent`**: Holds the scroll container, auto-scrolls down using `ElementRef` and `AfterViewChecked`, and renders empty/error states.
- **`ChatInputComponent`**: Captures text using `[(ngModel)]` two-way data binding, handles Enter keystrokes, and provides quick starter pills.
- **`LoadingIndicatorComponent`**: Renders bouncing CSS dots while waiting for AI responses.

### 2. How Routing Works
Routes are defined in `app.routes.ts`:
- `/login` loads `LoginComponent`.
- `/chat` loads `ChatComponent` protected by `canActivate: [authGuard]`.
- Empty (`''`) and unknown (`**`) routes automatically redirect to `/login`.

### 3. How Reactive Forms Work
In `LoginComponent`, form state is managed using `FormBuilder` and `FormGroup`:
```typescript
this.loginForm = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]]
});
```
Validation error messages appear dynamically when fields are marked `touched` or `dirty` and invalid.

### 4. How AuthGuard Works
The functional guard `authGuard` (`CanActivateFn`) inspects `AuthService.isLoggedIn()`. If `true`, navigation proceeds to `/chat`. If `false`, it returns a `UrlTree` redirecting to `/login`.

### 5. How ChatService & HttpClient Work
`ChatService` uses Angular's `HttpClient` to fetch `assets/mock-ai-responses.json`.
```typescript
this.http.get<MockResponseData>('assets/mock-ai-responses.json').pipe(
  delay(1000),
  map((data) => this.findBestResponse(userPrompt, data)),
  catchError((err) => of(FALLBACK_DATASET))
)
```

### 6. How Observables & RxJS Work
`ChatService` stores message history in a private `BehaviorSubject<Message[]>([])`. It exposes a public `messages$: Observable<Message[]>` stream consumed directly in `ChatComponent` using Angular's `AsyncPipe` (`messages$ | async`).

---

## 🛠️ How to Run the Project Locally

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### Steps

1. **Navigate to project directory**:
   ```bash
   cd C:\Users\JNANAVI\.gemini\antigravity\scratch\ai-chat-assistant-ui
   ```

2. **Start the local development server**:
   ```bash
   npm start
   ```
   *(or `npx ng serve`)*

3. **Open in browser**:
   Navigate to `http://localhost:4200` in your web browser.

4. **Test Application Flow**:
   - On `/login`, enter an email (e.g., `candidate@interview.com`) and password (`123456`).
   - Click **Sign In** to navigate to `/chat`.
   - Send messages or click starter prompt pills (e.g. *"Explain the STAR method"*).
   - Observe the 1-second "AI is typing..." indicator and AI response.
   - Click **Logout** to verify session cleanup and redirect back to `/login`.

---

## 🎯 15 Likely Interview Questions & Short Answers

1. **Q: What is the difference between `@Component` and `@Injectable` in Angular?**  
   *A:* `@Component` marks a class as a UI component with a template, selector, and styles. `@Injectable` marks a class as a service that can be injected into other classes via Dependency Injection.

2. **Q: Why use Standalone Components over NgModules?**  
   *A:* Standalone components simplify Angular development by directly importing dependencies in the `@Component({ imports: [...] })` metadata, reducing boilerplate and eliminating the need for `AppModule`.

3. **Q: What is Dependency Injection (DI) and how is it used here?**  
   *A:* DI is a design pattern where Angular manages object creation and provides service instances (like `AuthService` and `ChatService`) directly to constructors or via `inject()`.

4. **Q: What is a `BehaviorSubject` in RxJS?**  
   *A:* A `BehaviorSubject` is a type of RxJS Subject that stores the latest value and emits it immediately to any new subscriber.

5. **Q: Why use `AsyncPipe` (`| async`) in Angular templates?**  
   *A:* `AsyncPipe` subscribes to an Observable in the HTML template and automatically unsubscribes when the component is destroyed, preventing memory leaks.

6. **Q: What is the difference between Reactive Forms and Template-Driven Forms?**  
   *A:* Reactive Forms are model-driven, synchronous, and defined in TypeScript using `FormGroup` and `FormControl`, providing stronger validation control. Template-driven forms rely on `ngModel` in HTML.

7. **Q: How does `FormGroup` handle form validation?**  
   *A:* `FormGroup` tracks the validity state (`valid`, `invalid`, `touched`, `dirty`) of all controls within it. If any single control violates a `Validator`, `form.invalid` becomes `true`.

8. **Q: What is `CanActivateFn` in Angular Routing?**  
   *A:* It is a functional route guard that runs before activating a route. It returns `true` to allow navigation or a `UrlTree` to redirect unauthorized users.

9. **Q: Why do we use `HttpClient` instead of standard `fetch()` in Angular?**  
   *A:* `HttpClient` integrates natively with RxJS Observables, handles automatic JSON parsing, supports HTTP interceptors, and integrates seamlessly with Angular test frameworks.

10. **Q: What does the RxJS `delay()` operator do?**  
    *A:* `delay()` shifts the emissions from an Observable forward by a specified time window. In our project, it simulates realistic AI response network latency.

11. **Q: What does the RxJS `catchError()` operator do?**  
    *A:* `catchError()` intercepts errors on an Observable stream, allowing fallback values (like `of(FALLBACK_DATASET)`) to be returned without breaking the stream.

12. **Q: How does `@Input()` and `@Output()` communicate between parent and child components?**  
    *A:* `@Input()` passes data down from parent to child. `@Output()` uses an `EventEmitter` to send events/signals up from child to parent.

13. **Q: Why use `trackBy` in `*ngFor` loops?**  
    *A:* `trackBy` tells Angular how to uniquely identify items in a list (e.g. by `message.id`), preventing full DOM re-renders when list items change.

14. **Q: What is `ElementRef` and `ViewChild` used for in `ChatWindowComponent`?**  
    *A:* `@ViewChild` gets a direct reference to a DOM element (`#scrollContainer`), allowing programmatically scrolling to the bottom of the chat window (`scrollTop = scrollHeight`).

15. **Q: How can this project be extended to connect to a real AI API like OpenAI?**  
    *A:* Replace the `http.get('assets/mock-ai-responses.json')` call in `ChatService` with an `http.post('https://api.openai.com/v1/chat/completions', payload, { headers })` request.
