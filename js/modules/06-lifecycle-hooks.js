window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: "lifecycle-hooks",
  title: "Lifecycle Hooks",
  icon: "bi bi-hourglass-split",
  questions: [
    {
      id: "angular-22-standard-lifecycle-upgrade",
      title: "Angular 22 standard for lifecycle hooks",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>security guard doing scheduled rounds</strong> versus a <strong>motion-sensor alarm system</strong>. The old model checked in on a fixed patrol schedule (lifecycle hooks firing on every change-detection pass, whether anything actually changed or not). Signals and <code>effect()</code> are the motion sensor: they only trigger when something they actually depend on moves. You still keep a guard on duty for the moments that genuinely need scheduled rounds &mdash; init, DOM-ready, cleanup &mdash; but you stop making them patrol constantly out of habit.</p>
          </div>
        </div>
        <p>Modern Angular still supports every lifecycle hook, but Angular 22-ready code should use hooks more selectively. Prefer <code>input()</code>, signals, <code>computed()</code>, <code>effect()</code>, and signal queries for reactive work, then use lifecycle hooks only when they match the component boundary: initialization, DOM access, projected content, view children, or cleanup.</p>
        <h3>Modern rule of thumb</h3>
        <ul>
          <li>Use <code>constructor</code> or field initializers only for dependency setup.</li>
          <li>Use <code>ngOnInit()</code> for one-time startup work that depends on injected services.</li>
          <li>Use <code>input()</code> plus <code>effect()</code> instead of <code>ngOnChanges()</code> for many input-driven reactions.</li>
          <li>Use <code>afterNextRender()</code> or view hooks for DOM-dependent work.</li>
          <li>Use <code>DestroyRef</code> and <code>takeUntilDestroyed()</code> for cleanup instead of hand-written unsubscribe fields.</li>
          <li>Remember OnPush is the default change detection strategy in Angular 22 &mdash; a component with no <code>changeDetection</code> set only re-renders on signal changes, input changes, events, or explicit triggers, which makes disciplined hook usage even more important.</li>
        </ul>
      `,
      code: `import { Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-dashboard',
  template: \`
    @if (loading()) {
      <p>Loading...</p>
    } @else {
      <h2>{{ userName() }}</h2>
    }
  \`
})
export class UserDashboardComponent {
  readonly userId = input.required<string>();
  readonly loading = signal(false);
  readonly userName = signal('');

  private readonly destroyRef = inject(DestroyRef);
  private readonly api = inject(ApiService);

  constructor() {
    effect(() => {
      this.loading.set(true);
      this.api.getUser(this.userId())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(user => {
          this.userName.set(user.name);
          this.loading.set(false);
        });
    });
  }
}`,
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Old Patrol vs New Motion Sensor</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-slate-50 border-2 border-slate-300 rounded-xl p-3\"><p class=\"font-bold text-slate-700 text-center mb-2\">ngOnChanges / ngDoCheck</p><p class=\"text-slate-500 text-center\">runs on every CD cycle, whether or not the relevant value actually changed</p></div><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3\"><p class=\"font-bold text-indigo-700 text-center mb-2\">input() + effect()</p><p class=\"text-slate-600 text-center\">runs only when the specific signal it reads actually changes</p></div></div></div>"
    },

    {
      id: "what-is-ngoninit",
      title: "What is ngOnInit?",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A new employee's <strong>first day at the office</strong>. The constructor is the moment they walk through the front door &mdash; they exist, but nobody has handed them their badge, desk assignment, or project brief yet (inputs aren't set). <code>ngOnInit()</code> is once they're sitting at their desk with everything handed over &mdash; that's when it's actually safe to start doing real work.</p>
          </div>
        </div>
        <p><strong>ngOnInit()</strong> is a lifecycle hook that runs <em>once</em>, right after Angular finishes setting up the component and binding its input properties for the first time.</p>
        <h3>Why not use the constructor?</h3>
        <p>When the constructor runs, Angular has not yet assigned any input values. So if you try to read <code>this.userId</code> (received from a parent) inside the constructor, it will be <code>undefined</code>. By the time <code>ngOnInit()</code> is called, all inputs are ready.</p>
        <h3>Typical uses</h3>
        <ul>
          <li>Fetch data from an API based on route parameters or inputs</li>
          <li>Initialise reactive forms</li>
          <li>Subscribe to state or route changes</li>
          <li>Read input values safely</li>
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
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Constructor vs ngOnInit</p><div class=\"flex items-center justify-center gap-3 text-xs\"><div class=\"bg-rose-50 border-2 border-rose-200 rounded-lg px-4 py-3 text-center\"><p class=\"font-bold text-rose-700\">constructor</p><p class=\"text-slate-500 mt-1\">userId is undefined</p></div><span class=\"text-slate-300 text-lg\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-4 py-3 text-center\"><p class=\"font-bold text-emerald-700\">ngOnInit</p><p class=\"text-slate-500 mt-1\">userId is ready — safe to use</p></div></div></div>"
    },

    {
      id: "what-is-ngonchanges",
      title: "What is ngOnChanges?",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>customs officer stamping a passport</strong> every time it crosses the border. <code>ngOnChanges</code> only stamps when the passport itself (the input reference) is swapped for a different one. If you scribble a note inside the same passport without handing over a new one, the officer never notices &mdash; the object was mutated, not replaced, so no stamp, no ngOnChanges call.</p>
          </div>
        </div>
        <p><strong>ngOnChanges()</strong> is called by Angular every time an input property value changes &mdash; including the very first time (before <code>ngOnInit</code>).</p>
        <h3>The SimpleChanges object</h3>
        <p>Angular passes a <code>SimpleChanges</code> map as the argument. Each key is the name of the changed input, and the value is a <code>SimpleChange</code> object with three properties:</p>
        <ul>
          <li><code>previousValue</code> — what the value was before</li>
          <li><code>currentValue</code> — the new value</li>
          <li><code>firstChange</code> — <code>true</code> only on the very first assignment</li>
        </ul>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">ngOnChanges only fires when the <strong>reference</strong> of the input changes. Mutating an array or object inside the parent (<code>this.filters.year = 2026</code>) does <em>not</em> trigger it — you must replace the reference (<code>this.filters = { ...this.filters, year: 2026 }</code>). This is the single most common reason "my child component isn't updating" bugs happen.</p>
          </div>
        </div>
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
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Reference Swap vs Mutation</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-rose-50 border-2 border-rose-200 rounded-xl p-3\"><p class=\"font-bold text-rose-700 text-center mb-2\">this.filters.year = 2026</p><p class=\"text-slate-500 text-center\">same object reference &rarr; ngOnChanges never fires</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">this.filters = { ...filters, year: 2026 }</p><p class=\"text-slate-500 text-center\">new reference &rarr; ngOnChanges fires correctly</p></div></div></div>"
    },

    {
      id: "what-is-ngafterviewinit",
      title: "What is ngAfterViewInit?",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">The moment a <strong>house is fully built and handed over the keys</strong>, not just when the blueprint was approved. You can't hang a picture on a wall that's still a blueprint sketch &mdash; you need the actual physical wall to exist. <code>ngAfterViewInit()</code> is the "keys handed over" moment: the real DOM exists, and now you can measure it, decorate it, or move furniture into it.</p>
          </div>
        </div>
        <p><strong>ngAfterViewInit()</strong> is called once after Angular has fully created and rendered the component's template (its "view") including all child components.</p>
        <h3>Why do we need this?</h3>
        <p>Some things simply cannot be done until the DOM exists. For example:</p>
        <ul>
          <li>Reading the size or position of an element</li>
          <li>Initialising a third-party chart, map, or editor library that needs a real DOM node</li>
          <li>Setting focus on an input element</li>
          <li>Using <code>@ViewChild</code> references (they are only available from this hook onwards)</li>
        </ul>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Do not change component data in <code>ngAfterViewInit()</code> synchronously — doing so triggers Angular's <em>ExpressionChangedAfterItHasBeenChecked</em> error, because the view was already checked this cycle before your change. Use <code>setTimeout()</code>, <code>Promise.resolve()</code>, or better, <code>afterNextRender()</code> if you must update state here.</p>
          </div>
        </div>
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
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Only Safe After the View Exists</p><div class=\"flex flex-wrap items-center justify-center gap-2 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700\">measure element size</div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700\">init 3rd-party chart/map</div><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700\">focus an input</div><div class=\"bg-rose-50 border-2 border-rose-200 rounded-lg px-3 py-2 text-center font-semibold text-rose-700\">read @ViewChild</div></div><p class=\"text-center text-slate-400 text-xs mt-3\">all require ngAfterViewInit — the real DOM must exist first</p></div>"
    },

    {
      id: "what-is-ngondestroy",
      title: "What is ngOnDestroy?",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Checking out of a <strong>hotel room</strong>. Before you leave you're supposed to turn off the lights, return the key card, and close the minibar tab. Skip that, and the hotel keeps billing you and running the AC in an empty room forever &mdash; that's a memory leak. <code>ngOnDestroy()</code> is checkout: your last guaranteed chance to settle every open tab (subscriptions, timers, sockets) before the room (component) is gone for good.</p>
          </div>
        </div>
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
        <h3>Best pattern — DestroyRef and takeUntilDestroyed</h3>
        <p>Modern Angular provides <code>DestroyRef</code> and the <code>takeUntilDestroyed()</code> RxJS operator, which automatically unsubscribes when the component (or directive, or service) is destroyed — no manual <code>Subject</code> bookkeeping required. The older <code>Subject</code>-based <code>takeUntil(destroy$)</code> pattern still works and you'll see it constantly in existing codebases.</p>
      `,
      code: `import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SocketService } from './socket.service';
import { NotificationService } from './notification.service';

@Component({ selector: 'app-live-feed', templateUrl: './live-feed.component.html' })
export class LiveFeedComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly socket = inject(SocketService);
  private readonly notifications = inject(NotificationService);

  messages: string[] = [];
  private timer!: ReturnType<typeof setInterval>;

  constructor() {
    this.socket.connect();

    // takeUntilDestroyed automatically unsubscribes when the component is destroyed
    this.socket.messages$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(msg => this.messages.push(msg));

    this.notifications.alerts$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(alert => console.log('Alert:', alert));

    this.timer = setInterval(() => this.socket.ping(), 30_000);

    // Anything that isn't an Observable still needs manual cleanup:
    this.destroyRef.onDestroy(() => {
      clearInterval(this.timer);
      this.socket.disconnect();
    });
  }
}

// ---- Legacy Subject-based pattern (still common in existing code) ----
// private destroy$ = new Subject<void>();
// this.socket.messages$.pipe(takeUntil(this.destroy$)).subscribe(...);
// ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }`,
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Hotel Checkout Checklist</p><div class=\"grid grid-cols-2 md:grid-cols-4 gap-2 text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-center\">RxJS subscriptions</div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center\">WebSocket connections</div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-2 text-center\">setInterval / setTimeout</div><div class=\"bg-rose-50 border border-rose-200 rounded-lg p-2 text-center\">window/document listeners</div></div><p class=\"text-center text-slate-400 text-xs mt-3\">takeUntilDestroyed(destroyRef) handles the observable cases automatically</p></div>"
    },

    {
      id: "what-is-ngdocheck",
      title: "What is ngDoCheck?",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Manually recounting inventory on a shelf because the automated barcode scanner (Angular's default change detection) can only see items that were swapped for a completely different box &mdash; it can't tell if someone quietly added a can to a box that's already on the shelf. <code>ngDoCheck()</code> is you personally walking the aisle and counting cans by hand, every single time the store does a walkthrough. It works, but it's exhausting if the aisle is large.</p>
          </div>
        </div>
        <p><strong>ngDoCheck()</strong> is called on every single change detection run — it lets you implement your own change detection logic for cases Angular cannot handle automatically.</p>
        <h3>When do you need it?</h3>
        <p>Angular's default change detection compares object references. If you mutate an array (e.g., <code>this.cart.push(item)</code>) without replacing the reference, Angular will <em>not</em> detect the change through normal bindings. <code>ngDoCheck()</code> lets you catch such mutations manually.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text"><code>ngDoCheck()</code> runs on every change detection pass across the whole app, which can be extremely frequent — especially with Zone.js still in play. Putting API calls or heavy computation inside it is a reliable way to tank performance. In Angular 22, prefer replacing references and using signals over reaching for <code>ngDoCheck</code> at all; it should be a last resort, not a habit.</p>
          </div>
        </div>
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
// This lets ngOnChanges() handle it instead, which is cheaper.
// Better still: hold the cart as a signal and use computed() for the total.`,
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Why ngDoCheck Is a Last Resort</p><div class=\"flex flex-col items-center gap-2 text-xs\"><div class=\"bg-rose-50 border-2 border-rose-200 rounded-lg px-4 py-2 text-center font-semibold text-rose-700\">ngDoCheck — runs every CD cycle, everywhere</div><span class=\"text-slate-300\">preferred over by</span><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-4 py-2 text-center font-semibold text-amber-700\">ngOnChanges — runs only on reference swap</div><span class=\"text-slate-300\">preferred over by</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-4 py-2 text-center font-semibold text-emerald-700\">signal + computed() — runs only when the signal changes</div></div></div>"
    },

    {
      id: "constructor-vs-ngoninit",
      title: "Difference between constructor and ngOnInit",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A surgeon <strong>scrubbing in</strong> versus actually <strong>starting the operation</strong>. Scrubbing in (the constructor) is about gathering your instruments and making sure everything is present and correctly handed to you — it is not the moment to start cutting. The operation itself (<code>ngOnInit</code>) only begins once the patient (the component's inputs) is actually on the table and ready.</p>
          </div>
        </div>
        <p>This is a very common interview question. The short answer is: <strong>constructor is for wiring up dependencies; ngOnInit is for logic</strong>.</p>
        <h3>Constructor</h3>
        <ul>
          <li>Runs first, before any lifecycle hooks</li>
          <li>Angular's DI system injects services here (or via <code>inject()</code> in field initializers, which run at the same point)</li>
          <li>Input values are <strong>NOT yet available</strong></li>
          <li>The template is <strong>NOT yet rendered</strong></li>
          <li>Should only contain dependency injection — nothing else</li>
        </ul>
        <h3>ngOnInit</h3>
        <ul>
          <li>Runs after the constructor and after Angular sets all input bindings</li>
          <li>Safe to read input properties</li>
          <li>Ideal for API calls, form setup, and any initialisation logic</li>
        </ul>
        <h3>Why does this matter?</h3>
        <p>If you call an API inside the constructor and the component has an input like a user ID, that ID will still be <code>undefined</code> when the API call is made. Moving the call to <code>ngOnInit()</code> fixes this.</p>
      `,
      code: `import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from './auth.service';
import { ProfileService } from './profile.service';

@Component({ selector: 'app-profile', templateUrl: './profile.component.html' })
export class ProfileComponent implements OnInit {
  @Input() userId!: string;  // comes from parent — NOT ready in constructor
  profile: any;

  constructor(
    private auth: AuthService,       // DI only in constructor
    private profileService: ProfileService
  ) {
    // DON'T do this — userId is undefined here
    // this.profileService.get(this.userId).subscribe(...);

    // It's fine to call methods that don't depend on inputs
    console.log('Is logged in:', this.auth.isLoggedIn());
  }

  ngOnInit(): void {
    // userId is ready now — safe to use
    this.profileService.get(this.userId).subscribe(data => {
      this.profile = data;
    });
  }
}`,
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Scrubbing In vs Operating</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-slate-50 border-2 border-slate-300 rounded-xl p-3\"><p class=\"font-bold text-slate-700 text-center mb-2\">constructor</p><ul class=\"space-y-1 text-slate-600\"><li>&bull; DI only</li><li>&bull; no inputs yet</li><li>&bull; no template yet</li></ul></div><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3\"><p class=\"font-bold text-indigo-700 text-center mb-2\">ngOnInit</p><ul class=\"space-y-1 text-slate-600\"><li>&bull; inputs ready</li><li>&bull; safe for API calls</li><li>&bull; safe for form setup</li></ul></div></div></div>"
    },

    {
      id: "complete-lifecycle-order",
      title: "Complete lifecycle order",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>film production schedule</strong>: pre-production (constructor, inputs arrive), then the shoot itself starts (<code>ngOnInit</code>), the crew keeps re-checking continuity all day (<code>ngDoCheck</code>), then props and extras that were placed by other departments get inspected (content hooks), then the actual set the camera sees gets finalized (view hooks), and finally the wrap party where everything gets packed away (<code>ngOnDestroy</code>). Each phase has a strict order because later phases depend on earlier ones being finished.</p>
          </div>
        </div>
        <p>Angular calls lifecycle hooks in a strict, predictable order. Understanding the order tells you exactly which hook to use for each task.</p>
        <h3>The full order</h3>
        <ol style="list-style:decimal;padding-left:1.25rem;color:#475569;line-height:1.8;">
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
        <p>Think of it as three phases: <strong>Init phase</strong> (construct &rarr; changes &rarr; init) &rarr; <strong>Content phase</strong> (content init &rarr; content checked) &rarr; <strong>View phase</strong> (view init &rarr; view checked) &rarr; <strong>Destroy</strong>.</p>
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
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">The Four Phases</p><div class=\"flex flex-wrap items-center justify-center gap-2 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700\">Init<br><span class=\"font-normal text-slate-500\">ctor &rarr; changes &rarr; init</span></div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700\">Content<br><span class=\"font-normal text-slate-500\">content init &rarr; checked</span></div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700\">View<br><span class=\"font-normal text-slate-500\">view init &rarr; checked</span></div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-rose-50 border-2 border-rose-200 rounded-lg px-3 py-2 text-center font-semibold text-rose-700\">Destroy</div></div></div>"
    },
    {
      id: "after-next-render-and-after-every-render",
      title: "afterNextRender and afterEveryRender",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">The <strong>photographer at a wedding</strong> who only shows up once the guests are actually seated and the room is arranged — not during the setup chaos. <code>afterNextRender()</code> is that photographer snapping one shot right after the room is finally arranged. <code>afterEveryRender()</code> is a photographer who insists on a new shot after every single chair gets nudged — useful occasionally, exhausting if overused. Neither one shows up at all during a dress rehearsal held in an empty hall (server-side rendering), because there's no real room to photograph yet.</p>
          </div>
        </div>
        <p>Modern Angular includes render callbacks for work that must happen <strong>after Angular has rendered the DOM</strong>. These are not class lifecycle interfaces like <code>ngAfterViewInit</code>; they are functions you call in an injection context, usually the constructor.</p>
        <h3>afterNextRender</h3>
        <p><code>afterNextRender()</code> runs once after the next full application render. Use it for one-time DOM work such as measuring an element, initializing a chart library, focusing an input, or reading layout.</p>
        <h3>afterEveryRender</h3>
        <p><code>afterEveryRender()</code> runs after every render. Use it rarely, because it can become expensive. It is useful for integrating with a non-Angular library that must be told whenever Angular has updated the DOM.</p>
        <h3>Why not always ngAfterViewInit?</h3>
        <p><code>ngAfterViewInit</code> tells you the component view was initialized. Render callbacks tell you Angular has completed rendering. They also avoid common SSR problems because render callbacks do not run during server-side rendering.</p>
      `,
      code: `import { Component, ElementRef, ViewChild, afterNextRender, afterEveryRender, inject } from '@angular/core';

@Component({
  selector: 'app-chart-panel',
  template: '<canvas #chartCanvas></canvas>'
})
export class ChartPanelComponent {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  constructor() {
    afterNextRender(() => {
      const canvas = this.chartCanvas.nativeElement;
      const rect = canvas.getBoundingClientRect();
      console.log('Canvas size after render:', rect.width, rect.height);

      // Good place to initialize browser-only libraries:
      // this.chart = new Chart(canvas, this.config);
    });

    afterEveryRender(() => {
      // Keep this lightweight. It runs after every render.
      // Useful for syncing with a third-party DOM library.
    });
  }
}`,
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">afterNextRender vs afterEveryRender</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3\"><p class=\"font-bold text-indigo-700 text-center mb-2\">afterNextRender()</p><p class=\"text-slate-600 text-center\">runs once, after the next render only — for one-time DOM setup</p></div><div class=\"bg-amber-50 border-2 border-amber-200 rounded-xl p-3\"><p class=\"font-bold text-amber-700 text-center mb-2\">afterEveryRender()</p><p class=\"text-slate-600 text-center\">runs after every render — use sparingly, keep it cheap</p></div></div><p class=\"text-center text-slate-400 text-xs mt-3\">both are skipped entirely during server-side rendering</p></div>"
    }

  ]
});
