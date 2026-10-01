import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, catchError, switchMap } from 'rxjs/operators';
import { Message } from '../models/message.model';

/**
 * Interface for mock AI dataset structure
 */
interface MockResponseData {
  responses: Array<{ keywords: string[]; answer: string }>;
  defaultResponse: string;
}

/**
 * Default offline dataset fallback to ensure app NEVER crashes if assets are missing
 */
const FALLBACK_DATASET: MockResponseData = {
  responses: [
    {
      keywords: ["hello", "hi", "hey", "start", "welcome"],
      answer: "Hello! I am your AI Interview Assistant. How can I help you prepare today? You can ask me practice questions, interview techniques (like the STAR method), or core technical concepts!"
    },
    {
      keywords: ["star", "behavioral", "situation", "method"],
      answer: "The STAR method is great for answering behavioral questions:\n\n• S (Situation): Set the context for your story.\n• T (Task): Describe your responsibility.\n• A (Action): Explain the specific actions you took.\n• R (Result): Share the outcomes and measurable results achieved!"
    },
    {
      keywords: ["angular", "component", "rxjs", "routing", "framework"],
      answer: "Angular is a component-based TypeScript framework. Core concepts include:\n1. Components: UI building blocks (@Component).\n2. Services & DI: Reusable business logic injected with @Injectable.\n3. RxJS: Reactive programming with Observables (like HttpClient responses).\n4. Reactive Forms: Strong validation control over forms!"
    },
    {
      keywords: ["resume", "cv", "experience", "projects"],
      answer: "To make your resume stand out to interviewers:\n1. Quantify achievements (e.g., 'Improved load time by 30%').\n2. Highlight core technologies used (Angular, TypeScript, RxJS).\n3. Briefly describe key technical challenges solved in your projects!"
    },
    {
      keywords: ["tell me about yourself", "introduce", "intro"],
      answer: "When answering 'Tell me about yourself':\n1. Present: State your current role/degree and primary tech stack.\n2. Past: Briefly highlight 1-2 relevant projects or achievements.\n3. Future: State why you're excited about this role and how you can contribute!"
    }
  ],
  defaultResponse: "I can help with Angular, TypeScript, JavaScript, RxJS, frontend topics, coding problems, and interview prep. Try asking about Angular, dependency injection, TypeScript types, reduce, async/await, responsive design, or a coding challenge like palindrome or factorial."
};

/**
 * ChatService - Handles chat conversation state and AI interaction using HttpClient & RxJS.
 * 
 * Angular & RxJS Concepts:
 * - @Injectable({ providedIn: 'root' }): Application-wide Singleton service.
 * - HttpClient: Angular module for HTTP GET/POST requests.
 * - BehaviorSubject: Holds and emits real-time message stream to subscribers.
 * - RxJS Operators: delay (latency), map (transform payload), catchError (error handling).
 */
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly PRIMARY_API_URL = 'assets/mock-ai-responses.json';
  private readonly SECONDARY_API_URL = 'mock-ai-responses.json';

  // State Subjects
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  // Observable streams for UI consumption
  public messages$: Observable<Message[]> = this.messagesSubject.asObservable();
  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  public error$: Observable<string | null> = this.errorSubject.asObservable();

  constructor(private http: HttpClient) {
    this.addWelcomeMessage();
  }

  private addWelcomeMessage(): void {
    const welcomeMsg: Message = {
      id: 'msg_welcome',
      sender: 'ai',
      content: 'Welcome to AI Interview Assistant! I am here to help you practice interview questions, technical concepts, and HR scenarios. Try asking a question or click one of the quick starter prompts below!',
      timestamp: new Date()
    };
    this.messagesSubject.next([welcomeMsg]);
  }

  /**
   * Main method to send user message and trigger mock AI response using HttpClient.
   */
  sendMessage(userPrompt: string): void {
    if (!userPrompt || !userPrompt.trim()) return;

    const trimmedPrompt = userPrompt.trim();

    // 1. Instantly display user message
    const userMessage: Message = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      content: trimmedPrompt,
      timestamp: new Date()
    };

    this.messagesSubject.next([...this.messagesSubject.value, userMessage]);

    // 2. Set loading state to true
    this.isLoadingSubject.next(true);
    this.errorSubject.next(null);

    // 3. Fetch mock JSON dataset using Angular HttpClient
    this.http.get<MockResponseData>(this.PRIMARY_API_URL).pipe(
      catchError(() => this.http.get<MockResponseData>(this.SECONDARY_API_URL)),
      catchError((err) => {
        console.warn('HttpClient fallback engaged:', err);
        return of(FALLBACK_DATASET);
      }),
      delay(1000), // Simulate 1s realistic AI response latency
      map((data: MockResponseData) => this.findBestResponse(trimmedPrompt, data))
    ).subscribe({
      next: (aiReplyText: string) => {
        const aiMessage: Message = {
          id: 'msg_ai_' + Date.now(),
          sender: 'ai',
          content: aiReplyText,
          timestamp: new Date()
        };

        this.messagesSubject.next([...this.messagesSubject.value, aiMessage]);
        this.isLoadingSubject.next(false);
      },
      error: () => {
        this.isLoadingSubject.next(false);
        this.errorSubject.next('An unexpected error occurred while generating AI response.');
      }
    });
  }

  private findBestResponse(userPrompt: string, data: MockResponseData): string {
    const lower = userPrompt.toLowerCase();

    if (this.isGreeting(lower)) {
      return "Hello! I'm ready to help you with Angular, TypeScript, JavaScript, RxJS, frontend development, coding, and interview preparation.";
    }

    if (this.isAdditionQuestion(lower)) {
      return "This adds two numbers together using the + operator.\n\n```js\nconst a = 10;\nconst b = 20;\nconst sum = a + b;\n\nconsole.log(sum);\n```\n\nThe code combines both values and logs the result.";
    }

    const topicAnswer = this.getTopicAnswer(lower);
    if (topicAnswer) {
      return topicAnswer;
    }

    for (const item of data.responses) {
      if (item.keywords.some((keyword) => lower.includes(keyword))) {
        return item.answer;
      }
    }

    if (this.isCodingQuestion(lower)) {
      return this.buildCodingAnswer(lower);
    }

    return this.buildSupportedTopicsResponse(data.defaultResponse);
  }

  private getTopicAnswer(lower: string): string | null {
    const topicResponses: Array<{ keywords: string[]; answer: string }> = [
      {
        keywords: ["what is angular", "angular framework", "what is angular framework"],
        answer: "Angular is a TypeScript-based frontend framework for building single-page applications and large web apps. It gives you components, routing, dependency injection, forms, and a structured way to manage UI state with reusable building blocks."
      },
      {
        keywords: ["what is a component", "component in angular", "what is component"],
        answer: "A component is a reusable UI building block in Angular. It usually has a TypeScript class, an HTML template, and optional CSS. Components are the main way Angular organizes the UI into smaller, maintainable pieces."
      },
      {
        keywords: ["what is a service", "service in angular", "what is service"],
        answer: "A service is a class used to share logic across the app, such as API calls, authentication, or data transformations. In Angular, services are often injected into components or other services using dependency injection."
      },
      {
        keywords: ["what is dependency injection", "dependency injection", "di in angular"],
        answer: "Dependency injection is a design pattern where Angular creates and provides dependencies for you. Instead of manually creating objects, a component requests a service and Angular injects the correct instance, which makes code easier to test and reuse."
      },
      {
        keywords: ["what is routing", "routing in angular", "router"],
        answer: "Routing in Angular lets you navigate between different views or pages in a single-page app. It uses the Router to map URLs to components so users can move between screens without a full browser reload."
      },
      {
        keywords: ["what are lifecycle hooks", "lifecycle hooks", "ngoninit", "ngondestroy"],
        answer: "Lifecycle hooks are methods Angular calls at specific points in a component's life, such as when it is created, updated, or destroyed. Common examples are ngOnInit, ngOnChanges, and ngOnDestroy."
      },
      {
        keywords: ["what are reactive forms", "reactive forms", "formgroup", "formcontrol"],
        answer: "Reactive forms are Angular forms that are defined in TypeScript using FormGroup and FormControl. They are useful for validation, dynamic form logic, and managing form state in a predictable way."
      },
      {
        keywords: ["what is httpclient", "httpclient in angular", "http client"],
        answer: "HttpClient is Angular's built-in service for making HTTP requests to APIs. It works well with RxJS Observables and is commonly used to fetch or send JSON data in front-end apps."
      },
      {
        keywords: ["what is angular cli", "angular cli", "cli"],
        answer: "Angular CLI is the command-line tool that helps you create, build, test, and serve Angular apps. It makes common tasks faster, such as generating components, services, and routes."
      },
      {
        keywords: ["what are standalone components", "standalone components", "standalone"],
        answer: "Standalone components are Angular components that do not require an NgModule to be declared. They can be imported directly where needed, which keeps the app simpler and reduces boilerplate in smaller projects."
      },
      {
        keywords: ["what is typescript", "typescript"],
        answer: "TypeScript is a superset of JavaScript that adds static typing and better tooling. It helps catch errors earlier, improves editor support, and makes large applications easier to maintain."
      },
      {
        keywords: ["interface vs type", "type vs interface", "interface and type", "difference between interface and type"],
        answer: "An interface is mainly for describing object shapes and contracts, while a type can describe more than just objects, including unions, primitives, and computed values. In practice, interfaces are often used for object structure, and types are more flexible."
      },
      {
        keywords: ["generics", "generic"],
        answer: "Generics let you write reusable code that works with different data types while keeping type safety. A common example is an array or a function that accepts a type parameter, like Array<string> or function identity<T>(value: T): T."
      },
      {
        keywords: ["decorators", "what is decorator"],
        answer: "Decorators are special TypeScript features used to add metadata or behavior to classes, methods, or properties. Angular uses decorators like @Component and @Injectable heavily to define metadata for its framework features."
      },
      {
        keywords: ["class", "classes", "what is a class"],
        answer: "A class is a blueprint for creating objects. It can define properties and methods, and it supports inheritance, encapsulation, and object-oriented programming patterns in TypeScript and JavaScript."
      },
      {
        keywords: ["what are types", "typescript types", "types in typescript"],
        answer: "Types in TypeScript describe the kind of data a variable, function parameter, or return value can hold. Common examples include string, number, boolean, object, array, and custom interfaces or types."
      },
      {
        keywords: ["let vs const", "let and const", "difference between let and const"],
        answer: "let allows reassignment, while const creates a block-scoped variable that cannot be reassigned after initialization. Use const for values that should stay constant and let when the variable needs to change."
      },
      {
        keywords: ["javascript map", "map method", "what is map"],
        answer: "Array.map() creates a new array by transforming each element. It is useful when you want to convert a list of items into another list without mutating the original array."
      },
      {
        keywords: ["filter", "javascript filter", "array filter"],
        answer: "Array.filter() creates a new array with only the elements that pass a condition. It is ideal when you want to remove items that do not match a rule."
      },
      {
        keywords: ["reduce", "javascript reduce", "array reduce"],
        answer: "Array.reduce() combines array items into one value by repeatedly applying a function. It is often used for totals, counts, or building an object from a list."
      },
      {
        keywords: ["promises", "what is a promise"],
        answer: "A Promise represents a value that may be available now, later, or never. It is used to handle asynchronous work in JavaScript and lets you write code with .then() and .catch() instead of nested callbacks."
      },
      {
        keywords: ["async await", "async/await", "what is async await"],
        answer: "async/await is a cleaner syntax for working with Promises. An async function always returns a Promise, and await pauses execution until the Promise resolves, making asynchronous code easier to read."
      },
      {
        keywords: ["javascript arrays", "arrays", "what is an array"],
        answer: "An array is a list-like object used to store multiple values in one variable. JavaScript arrays support methods like map, filter, reduce, push, and sort for working with collections."
      },
      {
        keywords: ["javascript functions", "functions", "what is a function"],
        answer: "A function is a reusable block of code that performs a task. Functions can accept inputs, return values, and help keep code organized and easier to test."
      },
      {
        keywords: ["observable", "what is observable", "rxjs observable"],
        answer: "An Observable is a stream of values that may emit over time. In RxJS, Observables are used for HTTP responses, user events, and asynchronous streams, and they allow you to react when data arrives."
      },
      {
        keywords: ["subscribe", "what is subscribe"],
        answer: "subscribe() starts listening to an Observable and runs the provided logic when the stream emits values or errors. It is how you consume data from an Observable in RxJS."
      },
      {
        keywords: ["pipe", "rxjs pipe"],
        answer: "pipe() lets you chain RxJS operators together to transform, filter, or handle data in a stream. It helps create readable data-processing pipelines from Observables."
      },
      {
        keywords: ["rxjs map", "map operator"],
        answer: "The RxJS map operator transforms each value emitted by an Observable into a new value. It is similar to the array map method but works with streams of data."
      },
      {
        keywords: ["catcherror", "catch error", "error handling"],
        answer: "catchError intercepts errors in an Observable stream and lets you return a fallback value or recover gracefully. It is useful when an HTTP request fails and you want to keep the app running."
      },
      {
        keywords: ["behaviorsubject", "behavior subject"],
        answer: "BehaviorSubject is an RxJS Subject that stores the latest value and immediately emits it to new subscribers. It is often used for app state and shared values, such as the current user or selected tab."
      },
      {
        keywords: ["switchmap", "switch map"],
        answer: "switchMap cancels the previous inner subscription when a new value arrives and subscribes to the newest one. It is commonly used when a user types into a search box and only the latest request should be processed."
      },
      {
        keywords: ["html", "what is html"],
        answer: "HTML is the structure of a webpage. It defines elements like headings, paragraphs, buttons, and forms that create the content and layout of a web page."
      },
      {
        keywords: ["css", "what is css"],
        answer: "CSS is used to style webpages by controlling layout, colors, fonts, spacing, and responsive behavior. It helps separate content from presentation in front-end development."
      },
      {
        keywords: ["flexbox", "css flexbox"],
        answer: "Flexbox is a CSS layout model that makes it easier to arrange items in rows or columns with alignment and spacing control. It is often used for navbars, cards, and responsive layouts."
      },
      {
        keywords: ["responsive design", "responsive web design"],
        answer: "Responsive design means the UI adapts to different screen sizes, from mobile to tablet to desktop. Common techniques include flexible layouts, media queries, and scalable components."
      },
      {
        keywords: ["rest api", "api", "rest"],
        answer: "A REST API is an interface that lets frontend apps request and send data using standard HTTP methods like GET, POST, PUT, and DELETE. It is a common pattern when the UI needs data from a backend service."
      },
      {
        keywords: ["accessibility", "a11y"],
        answer: "Accessibility means designing software so people with disabilities can use it. In frontend development, this includes labels, keyboard support, readable contrast, and semantic HTML."
      }
    ];

    for (const item of topicResponses) {
      if (item.keywords.some((keyword) => lower.includes(keyword))) {
        return item.answer;
      }
    }

    return null;
  }

  private isGreeting(lower: string): boolean {
    const greetingPatterns = [
      "hi",
      "hello",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
      "good noon"
    ];

    return greetingPatterns.some((pattern) => lower.includes(pattern));
  }

  private isAdditionQuestion(lower: string): boolean {
    const additionPatterns = [
      "sum code",
      "addition code",
      "add two numbers",
      "sum of two numbers",
      "code to add two numbers",
      "addition program"
    ];

    return additionPatterns.some((pattern) => lower.includes(pattern));
  }

  private isCodingQuestion(lower: string): boolean {
    const patterns = [
      "add two numbers",
      "sum two numbers",
      "add numbers",
      "reverse a string",
      "palindrome",
      "largest number in an array",
      "largest number",
      "remove duplicates",
      "factorial",
      "fibonacci"
    ];

    return patterns.some((pattern) => lower.includes(pattern));
  }

  private buildCodingAnswer(lower: string): string {
    if (lower.includes("add two numbers") || lower.includes("sum two numbers") || lower.includes("add numbers")) {
      return "Adding two numbers is just simple arithmetic. Use the + operator to combine the values.\n\n```js\nconst a = 5;\nconst b = 7;\nconst total = a + b;\nconsole.log(total); // 12\n```";
    }

    if (lower.includes("reverse a string")) {
      return "To reverse a string, split it into characters, reverse the array, and join it back together.\n\n```js\nconst text = 'hello';\nconst reversed = text.split('').reverse().join('');\nconsole.log(reversed); // 'olleh'\n```";
    }

    if (lower.includes("palindrome")) {
      return "A palindrome reads the same forwards and backwards. A common approach is to compare the string to its reverse.\n\n```js\nconst word = 'racecar';\nconst isPalindrome = word === word.split('').reverse().join('');\nconsole.log(isPalindrome); // true\n```";
    }

    if (lower.includes("largest number in an array") || lower.includes("largest number")) {
      return "To find the largest number in an array, reduce the list to the highest value seen so far.\n\n```js\nconst numbers = [3, 9, 1, 7];\nconst largest = Math.max(...numbers);\nconsole.log(largest); // 9\n```";
    }

    if (lower.includes("remove duplicates")) {
      return "To remove duplicates, keep only the unique values using a Set. This is a clean and efficient approach.\n\n```js\nconst numbers = [1, 2, 2, 3, 3, 4];\nconst unique = [...new Set(numbers)];\nconsole.log(unique); // [1, 2, 3, 4]\n```";
    }

    if (lower.includes("factorial")) {
      return "A factorial multiplies a number by each lower positive integer until 1. A loop or recursion can solve it.\n\n```js\nfunction factorial(n) {\n  let result = 1;\n  for (let i = 2; i <= n; i++) {\n    result *= i;\n  }\n  return result;\n}\n\nconsole.log(factorial(5)); // 120\n```";
    }

    if (lower.includes("fibonacci")) {
      return "The Fibonacci sequence builds each number by adding the previous two values. A simple loop can generate the sequence.\n\n```js\nfunction fibonacci(n) {\n  const sequence = [0, 1];\n  for (let i = 2; i <= n; i++) {\n    sequence.push(sequence[i - 1] + sequence[i - 2]);\n  }\n  return sequence;\n}\n\nconsole.log(fibonacci(6)); // [0, 1, 1, 2, 3, 5, 8]\n```";
    }

    return "A simple way to solve a coding problem is to break it into small steps, write a clear function, and test with a few inputs.\n\n```js\nfunction solve(input) {\n  return input;\n}\n```";
  }

  private buildSupportedTopicsResponse(defaultResponse: string): string {
    if (defaultResponse.toLowerCase().includes('i can help with')) {
      return defaultResponse;
    }

    return `${defaultResponse} I can help with Angular, TypeScript, JavaScript, RxJS, frontend topics, coding problems, and interview prep. Try asking about Angular, dependency injection, TypeScript types, reduce, async/await, responsive design, or coding challenges like palindrome or factorial.`;
  }

  clearChat(): void {
    this.messagesSubject.next([]);
    this.addWelcomeMessage();
    this.errorSubject.next(null);
  }

  clearError(): void {
    this.errorSubject.next(null);
  }
}
