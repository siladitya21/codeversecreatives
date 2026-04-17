window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: "lifecycle-hooks",
  title: "Lifecycle Hooks",
  icon: "bi bi-hourglass-split",
  questions: [

    {
      id: "what-is-ngoninit",
      title: "What is ngOnInit?",
      explanation: `
        <p><strong>ngOnInit()</strong> is a lifecycle hook that runs <em>once</em>, right after Angular finishes setting up the component and binding its <code>@Input()</code> properties for the first time.</p>

        <h3>Why not use the constructor?</h3>
        <p>When the constructor runs, Angular has not yet assigned any <code>@Input()</code> values. So if you try to read <code>this.userId</code> (received from a parent) inside the constructor, it will be <code>undefined</code>. By the time <code>ngOnInit()</code> is called, all inputs are ready.</p>

        <h3>Typical uses</h3>
        <ul>
          <li>Fetch data from an API based on route parameters or inputs</li>
          <li>Initialise reactive forms</li>
          <li>Subscribe to state or route changes</li>
          <li>Read <code>@Input()</code> values safely</li>
        </ul>

        <h3>Real-world example</h3>
        <p>A <strong>DashboardComponent</strong> receives a <code>userId</code> from the router, then loads that user's data in <code>ngOnInit()</code>.</p>
      `,
      code: `import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from './api.service';

@Component({ selector: 'app-dashboard', templateUrl: './dashboard.component.html' })
export class DashboardComponent implements OnInit {
  @Input() userId!: string;   // set by parent BEFORE ngOnInit runs
  users: any[] = [];
  loading = true;
  error = false;

  constructor(private api: ApiService) {
    // DON'T call this.api here — userId is still undefined at this point
  }

  ngOnInit(): void {
    // Safe to use this.userId now
    this.api.getUserById(this.userId).subscribe({
      next: (res) => {
        this.users = res;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}`,
      language: "typescript"
    },

    {
      id: "what-is-ngonchanges",
      title: "What is ngOnChanges?",
      explanation: `
        <p><strong>ngOnChanges()</strong> is called by Angular every time an <code>@Input()</code> property value changes — including the very first time (before <code>ngOnInit</code>).</p>

        <h3>The SimpleChanges object</h3>
        <p>Angular passes a <code>SimpleChanges</code> map as the argument. Each key is the name of the changed input, and the value is a <code>SimpleChange</code> object with three properties:</p>
        <ul>
          <li><code>previousValue</code> — what the value was before</li>
          <li><code>currentValue</code> — the new value</li>
          <li><code>firstChange</code> — <code>true</code> only on the very first assignment</li>
        </ul>

        <h3>Key gotcha</h3>
        <p>ngOnChanges only fires when the <strong>reference</strong> of the input changes. Mutating an array or object inside the parent does <em>not</em> trigger it — you must replace the reference.</p>

        <h3>Real-world example</h3>
        <p>A <strong>ChartComponent</strong> receives filter settings from a parent. Every time the parent changes the filters, the chart should reload its data — but not on the very first load (handled by <code>ngOnInit</code>).</p>
      `,
      code: `import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({ selector: 'app-chart', templateUrl: './chart.component.html' })
export class ChartComponent implements OnChanges {
  @Input() filters!: { category: string; year: number };

  chartData: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) {
      const prev = changes['filters'].previousValue;
      const curr = changes['filters'].currentValue;

      console.log('Filters changed from', prev, 'to', curr);

      // Skip the initial assignment — ngOnInit already handles that
      if (!changes['filters'].firstChange) {
        this.loadChartData(curr);
      }
    }
  }

  loadChartData(filters: any) {
    console.log('Reloading chart with:', filters);
    // call your API here
  }
}

// Parent template usage:
// <app-chart [filters]="selectedFilters"></app-chart>
// Whenever selectedFilters is replaced with a new object, ngOnChanges fires.`,
      language: "typescript"
    },

    {
      id: "what-is-ngafterviewinit",
      title: "What is ngAfterViewInit?",
      explanation: `
        <p><strong>ngAfterViewInit()</strong> is called once after Angular has fully created and rendered the component's template (its "view") including all child components.</p>

        <h3>Why do we need this?</h3>
        <p>Some things simply cannot be done until the DOM exists. For example:</p>
        <ul>
          <li>Reading the size or position of an element</li>
          <li>Initialising a third-party chart, map, or editor library that needs a real DOM node</li>
          <li>Setting focus on an input element</li>
          <li>Using <code>@ViewChild</code> references (they are only available from this hook onwards)</li>
        </ul>

        <h3>Important rule</h3>
        <p>Do <em>not</em> change component data in <code>ngAfterViewInit()</code> synchronously — doing so will trigger Angular's <em>ExpressionChangedAfterItHasBeenChecked</em> error. Use <code>setTimeout()</code> or <code>Promise.resolve()</code> if you must update state here.</p>

        <h3>Real-world example</h3>
        <p>Auto-scroll a message list to the bottom and set focus on an input field after the view loads.</p>
      `,
      code: `import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-chat',
  template: \`
    <div #messageList class="chat-messages">
      <div *ngFor="let msg of messages">{{ msg.text }}</div>
    </div>
    <input #inputBox placeholder="Type a message..." />
  \`
})
export class ChatComponent implements AfterViewInit {
  @ViewChild('messageList') messageList!: ElementRef<HTMLDivElement>;
  @ViewChild('inputBox')    inputBox!: ElementRef<HTMLInputElement>;

  messages = [{ text: 'Hello!' }, { text: 'How are you?' }];

  ngAfterViewInit(): void {
    // DOM is ready — ViewChild references are now valid
    const el = this.messageList.nativeElement;

    // Scroll to the bottom of the chat
    el.scrollTop = el.scrollHeight;

    // Auto-focus the input field
    this.inputBox.nativeElement.focus();

    // If you need to update component data, use setTimeout to avoid
    // "ExpressionChangedAfterItHasBeenChecked" error:
    // setTimeout(() => this.title = 'Chat Ready');
  }
}`,
      language: "typescript"
    },

    {
      id: "what-is-ngondestroy",
      title: "What is ngOnDestroy?",
      explanation: `
        <p><strong>ngOnDestroy()</strong> runs once just before Angular removes the component from the DOM. It is your last chance to release any resources the component was holding.</p>

        <h3>Why is cleanup important?</h3>
        <p>If you subscribe to an Observable and never unsubscribe, the subscription keeps running in the background even after the component is gone. This causes <strong>memory leaks</strong> and can produce bugs where callbacks fire on a destroyed component.</p>

        <h3>What to clean up</h3>
        <ul>
          <li>RxJS subscriptions</li>
          <li>WebSocket or Socket.IO connections</li>
          <li>Timers created with <code>setInterval</code> / <code>setTimeout</code></li>
          <li>Event listeners added to the window or document</li>
          <li>Third-party library instances (maps, editors, charts)</li>
        </ul>

        <h3>Best pattern — takeUntil</h3>
        <p>Create a <code>Subject</code> called <code>destroy$</code>. Pipe every subscription through <code>takeUntil(this.destroy$)</code>. In <code>ngOnDestroy</code>, emit one value from <code>destroy$</code> — this automatically completes all those subscriptions at once.</p>
      `,
      code: `import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SocketService } from './socket.service';
import { NotificationService } from './notification.service';

@Component({ selector: 'app-live-feed', templateUrl: './live-feed.component.html' })
export class LiveFeedComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();  // ← the "off switch"
  messages: string[] = [];
  private timer!: ReturnType<typeof setInterval>;

  constructor(
    private socket: SocketService,
    private notifications: NotificationService
  ) {}

  ngOnInit(): void {
    this.socket.connect();

    // takeUntil automatically unsubscribes when destroy$ emits
    this.socket.messages$
      .pipe(takeUntil(this.destroy$))
      .subscribe(msg => this.messages.push(msg));

    this.notifications.alerts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(alert => console.log('Alert:', alert));

    // Keep a reference to any timer
    this.timer = setInterval(() => this.socket.ping(), 30_000);
  }

  ngOnDestroy(): void {
    // One emit completes ALL takeUntil subscriptions above
    this.destroy$.next();
    this.destroy$.complete();

    // Clean up other resources
    clearInterval(this.timer);
    this.socket.disconnect();
  }
}`,
      language: "typescript"
    },

    {
      id: "what-is-ngdocheck",
      title: "What is ngDoCheck?",
      explanation: `
        <p><strong>ngDoCheck()</strong> is called on every single change detection run — it lets you implement your own change detection logic for cases Angular cannot handle automatically.</p>

        <h3>When do you need it?</h3>
        <p>Angular's default change detection compares object references. If you mutate an array (e.g., <code>this.cart.push(item)</code>) without replacing the reference, Angular will <em>not</em> detect the change through normal bindings. <code>ngDoCheck()</code> lets you catch such mutations manually.</p>

        <h3>Performance warning</h3>
        <p><code>ngDoCheck()</code> runs extremely frequently. Keep the logic inside it as cheap as possible — avoid API calls or heavy computation. Only use it when you truly cannot replace object references.</p>

        <h3>Real-world example</h3>
        <p>Tracking changes to a mutable shopping cart array and updating the total.</p>
      `,
      code: `import { Component, DoCheck, Input } from '@angular/core';

interface CartItem { name: string; price: number; }

@Component({ selector: 'app-cart-badge', template: '<span>{{ total | currency }}</span>' })
export class CartBadgeComponent implements DoCheck {
  @Input() cart: CartItem[] = [];

  total = 0;
  private previousLength = 0;

  ngDoCheck(): void {
    // Angular wouldn't notice cart.push() — we detect it manually
    if (this.cart.length !== this.previousLength) {
      console.log('Cart changed: was', this.previousLength, 'now', this.cart.length, 'items');
      this.previousLength = this.cart.length;
      this.total = this.cart.reduce((sum, item) => sum + item.price, 0);
    }
  }
}

// Better alternative: replace the array reference in the parent
// this.cart = [...this.cart, newItem];
// This lets ngOnChanges() handle it instead, which is cheaper.`,
      language: "typescript"
    },

    {
      id: "constructor-vs-ngoninit",
      title: "Difference between constructor and ngOnInit",
      explanation: `
        <p>This is a very common interview question. The short answer is: <strong>constructor is for wiring up dependencies; ngOnInit is for logic</strong>.</p>

        <h3>Constructor</h3>
        <ul>
          <li>Runs first, before any lifecycle hooks</li>
          <li>Angular's DI system injects services here</li>
          <li><code>@Input()</code> values are <strong>NOT yet available</strong></li>
          <li>The template is <strong>NOT yet rendered</strong></li>
          <li>Should only contain dependency injection — nothing else</li>
        </ul>

        <h3>ngOnInit</h3>
        <ul>
          <li>Runs after the constructor and after Angular sets all <code>@Input()</code> bindings</li>
          <li>Safe to read <code>@Input()</code> properties</li>
          <li>Ideal for API calls, form setup, and any initialisation logic</li>
        </ul>

        <h3>Why does this matter?</h3>
        <p>If you call an API inside the constructor and the component has an <code>@Input()</code> like a user ID, that ID will still be <code>undefined</code> when the API call is made. Moving the call to <code>ngOnInit()</code> fixes this.</p>
      `,
      code: `import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from './auth.service';
import { ProfileService } from './profile.service';

@Component({ selector: 'app-profile', templateUrl: './profile.component.html' })
export class ProfileComponent implements OnInit {
  @Input() userId!: string;  // comes from parent — NOT ready in constructor
  profile: any;

  constructor(
    private auth: AuthService,       // ✅ DI only in constructor
    private profileService: ProfileService
  ) {
    // ❌ DON'T do this — userId is undefined here
    // this.profileService.get(this.userId).subscribe(...);

    // ✅ It's fine to call methods that don't depend on @Input()
    console.log('Is logged in:', this.auth.isLoggedIn());
  }

  ngOnInit(): void {
    // ✅ userId is ready now — safe to use
    this.profileService.get(this.userId).subscribe(data => {
      this.profile = data;
    });
  }
}`,
      language: "typescript"
    },

    {
      id: "complete-lifecycle-order",
      title: "Complete lifecycle order",
      explanation: `
        <p>Angular calls lifecycle hooks in a strict, predictable order. Understanding the order tells you exactly which hook to use for each task.</p>

        <h3>The full order</h3>
        <ol>
          <li><strong>constructor</strong> — DI, no inputs yet</li>
          <li><strong>ngOnChanges</strong> — first call happens here if there are inputs (before ngOnInit)</li>
          <li><strong>ngOnInit</strong> — inputs are ready, run initialisation logic</li>
          <li><strong>ngDoCheck</strong> — custom change detection (every CD cycle)</li>
          <li><strong>ngAfterContentInit</strong> — projected content (<code>ng-content</code>) is ready</li>
          <li><strong>ngAfterContentChecked</strong> — after every CD check of projected content</li>
          <li><strong>ngAfterViewInit</strong> — component's own view and child views are ready</li>
          <li><strong>ngAfterViewChecked</strong> — after every CD check of the view</li>
          <li><strong>ngOnDestroy</strong> — cleanup before component is removed</li>
        </ol>

        <h3>Memory trick</h3>
        <p>Think of it as three phases: <strong>Init phase</strong> (construct → changes → init) → <strong>Content phase</strong> (content init → content checked) → <strong>View phase</strong> (view init → view checked) → <strong>Destroy</strong>.</p>

        <h3>Which hooks run once vs repeatedly?</h3>
        <ul>
          <li>Run <strong>once</strong>: ngOnInit, ngAfterContentInit, ngAfterViewInit, ngOnDestroy</li>
          <li>Run <strong>repeatedly</strong> (every change detection): ngOnChanges (on input change), ngDoCheck, ngAfterContentChecked, ngAfterViewChecked</li>
        </ul>
      `,
      code: `import { Component, OnInit, OnChanges, DoCheck, AfterContentInit,
         AfterContentChecked, AfterViewInit, AfterViewChecked,
         OnDestroy, Input, SimpleChanges } from '@angular/core';

@Component({ selector: 'app-lifecycle-demo', template: '<p>{{ title }}</p>' })
export class LifecycleDemoComponent implements
  OnChanges, OnInit, DoCheck,
  AfterContentInit, AfterContentChecked,
  AfterViewInit, AfterViewChecked,
  OnDestroy {

  @Input() title = '';

  constructor()                               { console.log('1. constructor'); }
  ngOnChanges(c: SimpleChanges)              { console.log('2. ngOnChanges', c); }
  ngOnInit()                                 { console.log('3. ngOnInit'); }
  ngDoCheck()                                { console.log('4. ngDoCheck'); }
  ngAfterContentInit()                       { console.log('5. ngAfterContentInit'); }
  ngAfterContentChecked()                    { console.log('6. ngAfterContentChecked'); }
  ngAfterViewInit()                          { console.log('7. ngAfterViewInit'); }
  ngAfterViewChecked()                       { console.log('8. ngAfterViewChecked'); }
  ngOnDestroy()                              { console.log('9. ngOnDestroy'); }
}

// Drop this component in a template and open the console.
// You will see each hook fire in the exact order listed above.`,
      language: "typescript"
    }

  ]
});