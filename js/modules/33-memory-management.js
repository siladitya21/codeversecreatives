window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "memory-management",
  "title": "Memory Management",
  "icon": "bi bi-layers",
  "questions": [
    {
      id: "angular-22-standard-memory-upgrade",
      title: "Angular 22 standard for memory management",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Hotel housekeeping versus expecting guests to strip their own beds. In the old model, every guest (component) had to remember to unmake the bed, empty the trash, and turn off the lights before checkout (<code>ngOnDestroy</code>) &mdash; forget once and the room stays "occupied" forever. Angular 22's tools are housekeeping built into checkout itself: <code>AsyncPipe</code>, signals, and <code>takeUntilDestroyed()</code> clean the room automatically the moment the guest leaves, no memory required.</p>
          </div>
        </div>
        <p>Angular 22-ready memory management uses framework-owned cleanup wherever possible. Template bindings, <code>AsyncPipe</code>, signals, and <code>takeUntilDestroyed()</code> should replace manual subscription arrays and fragile <code>ngOnDestroy()</code> bookkeeping.</p>
        <h3>Modern memory checklist</h3>
        <ul>
          <li>Prefer <code>AsyncPipe</code> or signals over manual subscriptions in components.</li>
          <li>Use <code>takeUntilDestroyed()</code> for subscriptions you must start manually.</li>
          <li>Use <code>DestroyRef.onDestroy()</code> to clean timers, workers, and event listeners.</li>
          <li>Clear intervals and terminate workers explicitly &mdash; nothing does this for you.</li>
          <li>Profile long-lived routes with browser memory tools after repeated navigation.</li>
        </ul>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text"><code>takeUntilDestroyed()</code> only cleans up the RxJS subscription itself. It does not clear a <code>setInterval</code>, close a WebSocket, or terminate a Web Worker started inside the same callback. Those still need an explicit <code>destroyRef.onDestroy(() => ...)</code> or they leak regardless of how tidy your subscriptions look.</p>
          </div>
        </div>
      `,
      code: `@Component({
  selector: 'app-search-box',
  template: '<input [formControl]="search" />'
})
export class SearchBoxComponent {
  readonly search = new FormControl('');
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.search.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => console.log(value));

    const intervalId = setInterval(() => console.log('tick'), 1000);
    this.destroyRef.onDestroy(() => clearInterval(intervalId));
  }
}`,
      language: "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Manual Cleanup vs Framework-Owned Cleanup</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-slate-50 border-2 border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">Legacy — you remember everything</p><div class="flex flex-col items-center gap-1"><div class="bg-rose-50 border border-rose-200 rounded px-2 py-1 w-full text-center">Subscription array + ngOnDestroy</div><div class="bg-rose-50 border border-rose-200 rounded px-2 py-1 w-full text-center">clearInterval by hand</div><div class="bg-rose-50 border border-rose-200 rounded px-2 py-1 w-full text-center">removeEventListener by hand</div></div></div><div class="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">Angular 22 — framework owns it</p><div class="flex flex-col items-center gap-1"><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center">AsyncPipe / signals in templates</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center">takeUntilDestroyed()</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center">DestroyRef.onDestroy() for the rest</div></div></div></div></div>`
    },
    {
      "id": "memory-leaks-angular",
      "title": "Memory leaks in Angular — causes and consequences",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A phone tree that never removed your number. You cancelled the subscription years ago and never open the mail, but the mailing list still has your address, so the flyers keep arriving and someone still has to print and mail them. A leaked component is exactly that: gone from the screen, but a subscription, timer, or listener still has its "address" and keeps calling it &mdash; so the garbage collector is not allowed to throw the mailbox away.</p>
          </div>
        </div>
        <p>A <strong>memory leak</strong> in an Angular application occurs when resources allocated to a component &mdash; subscriptions, event listeners, timers, or DOM references &mdash; are not cleaned up when the component is destroyed. The component is gone from the screen, but a callback or subscription still holds a reference to it in memory. The garbage collector cannot collect the component because something still points to it, so the object stays in the heap indefinitely.</p>
        <p>In a long-lived SPA where users navigate between routes without refreshing the page, leaks compound over time. Every visit to a leaking route adds more unreachable objects to the heap. Eventually, the browser's memory usage grows without bound, triggering garbage collection pauses (visible as UI jank), degraded performance, and ultimately a browser tab crash in extreme cases.</p>
        <h3>The three main sources of leaks</h3>
        <p><strong>RxJS subscriptions</strong> are the most common source. When you call <code>observable$.subscribe(callback)</code>, the observable holds a reference to the callback. If the observable is long-lived (a route event stream, a WebSocket, a polling interval, a BehaviorSubject) and you never call <code>unsubscribe()</code>, the callback &mdash; and the entire component instance it closes over &mdash; stays in memory after the component is destroyed.</p>
        <p><strong>DOM event listeners</strong> registered with <code>addEventListener</code> directly on <code>window</code>, <code>document</code>, or elements outside the component's host are not automatically removed when Angular destroys the component. Angular manages listeners registered via <code>(click)="..."</code> in templates, but manually added listeners are your responsibility.</p>
        <p><strong>Timers</strong> (<code>setInterval</code>, <code>setTimeout</code> with future execution) keep their callback in the browser's timer queue. If the callback references the component, the component stays alive until the timer fires or is cleared.</p>
      `,
      "code": "// ---- LEAKING component — all three leak sources ----\nimport { Component, OnInit } from '@angular/core';\nimport { Router } from '@angular/router';\nimport { interval } from 'rxjs';\n\n@Component({ template: '...' })\nexport class LeakingComponent implements OnInit {\n  private count = 0;\n\n  ngOnInit(): void {\n    // LEAK 1: RxJS subscription never unsubscribed\n    // interval() fires every second forever — callback holds reference to `this`\n    interval(1000).subscribe(() => {\n      this.count++;  // this component is kept alive by this callback\n    });\n\n    // LEAK 2: Router events subscription never unsubscribed\n    this.router.events.subscribe(event => {\n      console.log('Route event', event);\n    });\n\n    // LEAK 3: DOM listener on window never removed\n    window.addEventListener('resize', () => {\n      // `this` is captured — component cannot be garbage collected\n      this.handleResize();\n    });\n\n    // LEAK 4: setInterval timer never cleared\n    setInterval(() => this.poll(), 5000);\n  }\n\n  private handleResize() {}\n  private poll() {}\n  constructor(private router: Router) {}\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Why the Garbage Collector Can't Help</p><div class="flex flex-wrap items-center justify-center gap-2 text-xs"><div class="bg-slate-800 text-white rounded-lg px-3 py-2 text-center font-semibold">Component destroyed</div><span class="text-slate-300">&rarr;</span><div class="bg-rose-50 border-2 border-rose-200 rounded-lg px-3 py-2 text-center font-semibold text-rose-700">Subscription still references it</div><span class="text-slate-300">&rarr;</span><div class="bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700">GC sees a live reference</div><span class="text-slate-300">&rarr;</span><div class="bg-slate-100 border-2 border-slate-300 rounded-lg px-3 py-2 text-center font-semibold text-slate-600">Object stays on heap forever</div></div></div>`
    },
    {
      "id": "takeuntil-pattern",
      "title": "The takeUntil pattern — unsubscribing multiple streams at once",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A building's <strong>master fire alarm</strong> instead of individually notifying every tenant. Instead of walking to each apartment to tell them to evacuate, one alarm signal (<code>destroy$.next()</code>) reaches every unit wired to the same system at once. Doesn't matter if the building has three tenants or three hundred &mdash; one signal, everyone reacts simultaneously.</p>
          </div>
        </div>
        <p>The most practical and widely adopted solution for subscription management in Angular components is the <strong>takeUntil</strong> pattern. The idea is simple: create a private <code>Subject</code> called <code>destroy$</code>. Pipe every long-lived subscription through <code>takeUntil(this.destroy$)</code>. In <code>ngOnDestroy</code>, emit a value on <code>destroy$</code> and complete it. All subscriptions that were piped through <code>takeUntil</code> automatically complete at that moment.</p>
        <p>The key advantage over manually tracking a <code>Subscription</code> object is that <code>takeUntil</code> scales to any number of subscriptions without any bookkeeping. Add as many <code>observable.pipe(takeUntil(this.destroy$)).subscribe()</code> calls as you need &mdash; they all clean up with the same two lines in <code>ngOnDestroy</code>.</p>
        <h3>DestroyRef and takeUntilDestroyed</h3>
        <p>Angular 16 introduced <code>DestroyRef</code> and a <code>takeUntilDestroyed()</code> operator from <code>@angular/core/rxjs-interop</code>. This is the modern replacement for the manual <code>destroy$</code> subject pattern, and by Angular 22 it's the default way to write this. It integrates with Angular's component lifecycle without requiring you to implement <code>OnDestroy</code>, and can even be called outside a component class (in a service or a utility function) by passing a <code>DestroyRef</code> explicitly.</p>
      `,
      "code": "import { Component, OnInit, OnDestroy, inject } from '@angular/core';\nimport { interval, fromEvent } from 'rxjs';\nimport { takeUntil, takeUntilDestroyed } from '@angular/core/rxjs-interop';\n// Or for older pattern: import { takeUntil } from 'rxjs/operators';\nimport { Subject } from 'rxjs';\nimport { Router } from '@angular/router';\n\n// ---- Approach 1: Manual destroy$ Subject (Angular < 16) ----\n@Component({ template: '...' })\nexport class ComponentWithManualCleanup implements OnInit, OnDestroy {\n  private destroy$ = new Subject<void>();\n\n  ngOnInit(): void {\n    // All subscriptions share the same cleanup trigger\n    interval(1000)\n      .pipe(takeUntil(this.destroy$))\n      .subscribe(n => console.log('tick', n));\n\n    this.router.events\n      .pipe(takeUntil(this.destroy$))\n      .subscribe(event => this.handleRoute(event));\n\n    fromEvent(window, 'resize')\n      .pipe(takeUntil(this.destroy$))\n      .subscribe(() => this.handleResize());\n  }\n\n  ngOnDestroy(): void {\n    // One emit, all subscriptions complete\n    this.destroy$.next();\n    this.destroy$.complete();\n  }\n\n  private handleRoute(e: unknown) {}\n  private handleResize() {}\n  constructor(private router: Router) {}\n}\n\n// ---- Approach 2: takeUntilDestroyed (Angular 22 style — preferred) ----\n@Component({ template: '...' })\nexport class ModernComponent implements OnInit {\n  // inject() approach — no constructor needed\n  private router = inject(Router);\n\n  // DestroyRef is injected automatically by takeUntilDestroyed\n  // when called in injection context (field initializer or constructor)\n  private destroyRef = inject(DestroyRef);\n\n  ngOnInit(): void {\n    interval(1000)\n      // No explicit subject needed — DestroyRef handles it\n      .pipe(takeUntilDestroyed(this.destroyRef))\n      .subscribe(n => console.log('tick', n));\n\n    // Or directly in injection context (class field):\n    // readonly ticks$ = interval(1000).pipe(takeUntilDestroyed());\n    // No ngOnDestroy needed at all!\n  }\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">One Signal, Every Subscription Cleans Up</p><div class="flex flex-col items-center gap-2 text-xs"><div class="bg-slate-800 text-white rounded-lg px-3 py-1.5">destroy$.next() / component destroyed</div><div class="w-px h-3 bg-slate-300"></div><div class="flex flex-wrap justify-center gap-2"><div class="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5">interval() subscription</div><div class="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">router.events subscription</div><div class="bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">fromEvent(resize) subscription</div></div><p class="text-slate-400 mt-1">all three complete in the same tick</p></div></div>`
    },
    {
      "id": "async-pipe-benefits",
      "title": "The async pipe — the best subscription management tool",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A hotel room with an <strong>automatic key card system</strong> instead of a physical key. You never have to remember to lock the door on your way out &mdash; the moment you leave, the card deactivates and the door secures itself. The async pipe subscribes when the template needs it and unsubscribes the instant the component is destroyed. You never hold the "key" (the <code>Subscription</code> object) at all, so you can't forget to turn it in.</p>
          </div>
        </div>
        <p>The <strong>async pipe</strong> is Angular's built-in answer to subscription management in templates. When you write <code>users$ | async</code> in a template, Angular subscribes to the observable when the component initializes, updates the view whenever a new value arrives, and automatically unsubscribes when the component is destroyed. You never call <code>.subscribe()</code>, never manage a <code>Subscription</code> object, and never implement <code>ngOnDestroy</code> just for cleanup.</p>
        <p>Beyond cleanup, the async pipe integrates with Angular's change detection in a way that manual subscriptions cannot match. It calls <code>markForCheck()</code> internally when it receives a new value, which is exactly what <code>ChangeDetectionStrategy.OnPush</code> components need &mdash; and remember, OnPush is the default in Angular 22. If you subscribe manually without calling <code>markForCheck()</code>, the template will not update until something else triggers change detection. With the async pipe, OnPush and observables work seamlessly together without any boilerplate.</p>
        <h3>Combining multiple streams</h3>
        <p>When a template needs values from multiple streams, use RxJS's <code>combineLatest()</code> to merge them into a single observable of a view-model object. This pattern &mdash; creating a single <code>vm$</code> observable &mdash; requires only one async pipe in the template and eliminates awkward nested null checks.</p>
      `,
      "code": "import { Component, inject } from '@angular/core';\nimport { AsyncPipe, CurrencyPipe } from '@angular/common';\nimport { combineLatest, map } from 'rxjs';\nimport { ProductService } from './product.service';\nimport { CartService } from './cart.service';\n\ninterface ProductViewModel {\n  products: Product[];\n  cartCount: number;\n  totalValue: number;\n  loading: boolean;\n}\n\n@Component({\n  selector: 'app-product-page',\n  imports: [AsyncPipe, CurrencyPipe],\n  // One async pipe, one null check, everything in sync\n  template: `\n    @if (vm$ | async; as vm) {\n      <header>\n        <span>{{ vm.cartCount }} items — {{ vm.totalValue | currency }}</span>\n      </header>\n      <ul>\n        @for (product of vm.products; track product.id) {\n          <li>{{ product.name }}</li>\n        }\n      </ul>\n    } @else {\n      <p>Loading...</p>\n    }\n  `\n})\nexport class ProductPageComponent {\n  private productService = inject(ProductService);\n  private cartService = inject(CartService);\n\n  // Single view-model observable — one async pipe handles all streams\n  // No subscriptions, no ngOnDestroy, no manual cleanup\n  readonly vm$ = combineLatest([\n    this.productService.getAll(),\n    this.cartService.items$\n  ]).pipe(\n    map(([products, cartItems]): ProductViewModel => ({\n      products,\n      cartCount: cartItems.length,\n      totalValue: cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),\n      loading: false\n    }))\n  );\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Manual Subscribe vs Async Pipe</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-slate-50 border-2 border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">Manual .subscribe()</p><div class="flex flex-col items-center gap-1"><div class="bg-rose-50 border border-rose-200 rounded px-2 py-1 w-full text-center">Track the Subscription object</div><div class="bg-rose-50 border border-rose-200 rounded px-2 py-1 w-full text-center">Call markForCheck() on OnPush</div><div class="bg-rose-50 border border-rose-200 rounded px-2 py-1 w-full text-center">Unsubscribe in ngOnDestroy</div></div></div><div class="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">vm$ | async</p><div class="flex flex-col items-center gap-1"><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center">Angular owns the subscription</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center">markForCheck() called automatically</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center">Unsubscribes on destroy, no code needed</div></div></div></div></div>`
    },
    {
      "id": "dom-listener-cleanup",
      "title": "Cleaning up DOM event listeners and timers",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Borrowing a library book versus taking one off a friend's private shelf. Books borrowed through the library system (Angular template bindings like <code>(click)</code>) get auto-tracked and the library reminds you when it's due back &mdash; you never really have to think about it. A book you grabbed off <code>window</code> or <code>document</code> directly isn't on the library's radar at all; if you don't personally remember to return it, it just sits on your shelf forever.</p>
          </div>
        </div>
        <p>Angular's template binding system (<code>(click)</code>, <code>(keydown)</code>) automatically adds and removes DOM event listeners &mdash; you never need to clean those up manually. The problem arises when you add listeners <em>outside</em> Angular's template: directly on <code>window</code>, <code>document</code>, a parent element, or a third-party library's DOM element. These are not tracked by Angular and must be removed yourself.</p>
        <h3>Using @HostListener instead</h3>
        <p>The simplest way to avoid manual listener cleanup is to use <code>@HostListener</code> for listeners on the component's host element, and Angular CDK's <code>fromEvent()</code> + <code>takeUntilDestroyed()</code> pattern for <code>window</code> and <code>document</code> listeners. Both are automatically cleaned up by Angular.</p>
        <h3>Renderer2 for platform-safe DOM access</h3>
        <p>When you must use <code>addEventListener</code> directly (e.g., in a directive that attaches to arbitrary elements), use Angular's <code>Renderer2.listen()</code> instead of <code>element.addEventListener()</code>. <code>Renderer2.listen()</code> returns an "unlisten" function. Store it and call it via <code>DestroyRef.onDestroy()</code>. This is also SSR-safe because Renderer2 abstracts platform differences.</p>
        <h3>Timers</h3>
        <p>Store the return value of <code>setInterval()</code> and <code>setTimeout()</code> in a class property and call <code>clearInterval()</code> / <code>clearTimeout()</code> via <code>DestroyRef.onDestroy()</code>. Alternatively, convert timers to RxJS observables (<code>interval()</code>, <code>timer()</code>) and use <code>takeUntilDestroyed()</code> &mdash; this keeps all your cleanup in one place.</p>
      `,
      "code": "import { Component, OnInit, inject,\n         Renderer2, DestroyRef } from '@angular/core';\nimport { takeUntilDestroyed } from '@angular/core/rxjs-interop';\nimport { fromEvent, interval } from 'rxjs';\n\n@Component({\n  selector: 'app-scroll-tracker',\n  template: `<p>Scroll position: {{ scrollY }}px</p>`\n})\nexport class ScrollTrackerComponent implements OnInit {\n  scrollY = 0;\n\n  // ---- Option A: Renderer2.listen() — returns unlisten function ----\n  private renderer = inject(Renderer2);\n\n  // ---- Option B: fromEvent + takeUntilDestroyed (preferred) ----\n  private destroyRef = inject(DestroyRef);\n\n  ngOnInit(): void {\n    // Option A: Renderer2 (safe for SSR, cleanup via DestroyRef)\n    const unlisten = this.renderer.listen('window', 'scroll', () => {\n      this.scrollY = window.scrollY;\n    });\n    this.destroyRef.onDestroy(unlisten);\n\n    // Option B: RxJS fromEvent (cleaner, same cleanup as subscriptions)\n    fromEvent(window, 'scroll')\n      .pipe(takeUntilDestroyed(this.destroyRef))\n      .subscribe(() => {\n        this.scrollY = window.scrollY;\n      });\n\n    // Timers as RxJS (no clearInterval needed)\n    interval(5000)\n      .pipe(takeUntilDestroyed(this.destroyRef))\n      .subscribe(() => this.refresh());\n  }\n\n  private refresh(): void {}\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Who Tracks the Listener?</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3"><p class="font-bold text-emerald-700 text-center mb-2">Angular-tracked</p><div class="flex flex-col items-center gap-1"><div class="bg-white border border-emerald-200 rounded px-2 py-1 w-full text-center">(click) template bindings</div><div class="bg-white border border-emerald-200 rounded px-2 py-1 w-full text-center">@HostListener</div><p class="text-slate-400 mt-1">auto-removed on destroy</p></div></div><div class="bg-rose-50 border-2 border-rose-200 rounded-xl p-3"><p class="font-bold text-rose-700 text-center mb-2">Your responsibility</p><div class="flex flex-col items-center gap-1"><div class="bg-white border border-rose-200 rounded px-2 py-1 w-full text-center">window / document listeners</div><div class="bg-white border border-rose-200 rounded px-2 py-1 w-full text-center">setInterval / setTimeout</div><p class="text-slate-400 mt-1">must clean up via DestroyRef</p></div></div></div></div>`
    },
    {
      "id": "profiling-memory",
      "title": "Profiling and detecting memory leaks with Chrome DevTools",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A detective comparing two photographs of the same room, taken minutes apart, to spot what's still there that shouldn't be. Chrome's heap snapshot comparison does exactly that for memory: photograph the heap before, interact with the suspect component, photograph again, and anything that's still sitting in the second photo that should have left is your culprit &mdash; and the "retainers" view is the detective's evidence board showing exactly who's still holding onto it.</p>
          </div>
        </div>
        <p>Theoretical knowledge about leaks is necessary but not sufficient &mdash; you need to be able to confirm whether a specific component actually leaks in production. Chrome DevTools' <strong>Memory panel</strong> provides the tools to measure heap usage over time and identify what is preventing objects from being garbage collected.</p>
        <h3>Heap snapshot comparison</h3>
        <p>Take a heap snapshot before navigating to a component, interact with it, navigate away, then take another snapshot. Compare the two: if the component class still appears in the second snapshot, it was not garbage collected &mdash; it's leaking. In the snapshot detail view, the "retainers" view shows what is still holding a reference to the component, which usually points directly to the uncleaned subscription or event listener.</p>
        <h3>The detached DOM test</h3>
        <p>In the Memory panel, filter the second snapshot for "Detached". Detached DOM nodes are elements that were removed from the DOM but are still referenced in JavaScript. This reveals DOM elements that were created outside Angular's template (via <code>document.createElement</code>) and never explicitly removed.</p>
        <h3>Performance Monitor</h3>
        <p>The Performance Monitor panel (accessible from DevTools More Tools) shows live heap size and DOM node count. Navigate to the suspected leaking route repeatedly while watching the heap size. If it grows monotonically and does not drop after navigation, you have a leak. Use this to confirm a leak exists before spending time in heap snapshots to find the root cause.</p>
      `,
      "code": "// ---- Manual leak verification technique ----\n// Add a WeakRef to the component in development to check if it was GC'd.\n// WeakRef does not prevent garbage collection.\n\nimport { Component, OnDestroy, isDevMode } from '@angular/core';\n\n@Component({ template: '...' })\nexport class InspectedComponent implements OnDestroy {\n  ngOnDestroy(): void {\n    // ---- Dev-only leak check ----\n    if (!isDevMode()) return;\n\n    // Store a WeakRef — if the component is GC'd, the WeakRef returns undefined\n    const ref = new WeakRef(this);\n\n    // Force GC (only works in Node/Chrome with --expose-gc flag in tests)\n    // In browser: manual GC via DevTools Memory panel -> 'Collect garbage' button\n    setTimeout(() => {\n      const alive = ref.deref();\n      if (alive) {\n        console.warn('LEAK: InspectedComponent was not garbage collected after destroy!');\n      } else {\n        console.log('OK: InspectedComponent was garbage collected.');\n      }\n    }, 5000);\n  }\n}\n\n// ---- Finding the retainer in Chrome DevTools ----\n// 1. Open DevTools → Memory tab\n// 2. Take Heap Snapshot 1 (before navigating to the component)\n// 3. Navigate to the component, interact with it\n// 4. Navigate away\n// 5. Click 'Collect Garbage' (trash icon)\n// 6. Take Heap Snapshot 2\n// 7. Change view to 'Comparison' and filter snapshot 2\n// 8. Search for your component class name (e.g., 'InspectedComponent')\n// 9. If it appears with # Delta > 0, it leaked\n// 10. Click it → 'Retainers' tab → shows what is holding the reference",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Heap Snapshot Workflow</p><div class="flex flex-wrap items-center justify-center gap-2 text-xs"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700">1. Snapshot A</div><span class="text-slate-300">&rarr;</span><div class="bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700">2. Visit &amp; leave route</div><span class="text-slate-300">&rarr;</span><div class="bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700">3. Collect garbage</div><span class="text-slate-300">&rarr;</span><div class="bg-rose-50 border-2 border-rose-200 rounded-lg px-3 py-2 text-center font-semibold text-rose-700">4. Snapshot B</div><span class="text-slate-300">&rarr;</span><div class="bg-purple-50 border-2 border-purple-200 rounded-lg px-3 py-2 text-center font-semibold text-purple-700">5. Compare &amp; check Retainers</div></div></div>`
    }
  ]
});
