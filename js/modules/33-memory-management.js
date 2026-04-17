window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "memory-management",
  "title": "Memory Management",
  "icon": "bi bi-layers",
  "questions": [
    {
      "id": "memory-leaks-angular",
      "title": "Memory leaks in Angular — causes and consequences",
      "explanation": `
          <p>A <strong>memory leak</strong> in an Angular application occurs when resources allocated to a component — subscriptions, event listeners, timers, or DOM references — are not cleaned up when the component is destroyed. The component is gone from the screen, but a callback or subscription still holds a reference to it in memory. The garbage collector cannot collect the component because something still points to it, so the object stays in the heap indefinitely.</p>

          <p>In a long-lived SPA where users navigate between routes without refreshing the page, leaks compound over time. Every visit to a leaking route adds more unreachable objects to the heap. Eventually, the browser's memory usage grows without bound, triggering garbage collection pauses (visible as UI jank), degraded performance, and ultimately a browser tab crash in extreme cases.</p>

          <h3>The Three Main Sources of Leaks</h3>
          <p><strong>RxJS subscriptions</strong> are the most common source. When you call <code>observable$.subscribe(callback)</code>, the observable holds a reference to the callback. If the observable is long-lived (a route event stream, a WebSocket, a polling interval, a BehaviorSubject) and you never call <code>unsubscribe()</code>, the callback — and the entire component instance it closes over — stays in memory after the component is destroyed.</p>

          <p><strong>DOM event listeners</strong> registered with <code>addEventListener</code> directly on <code>window</code>, <code>document</code>, or elements outside the component's host are not automatically removed when Angular destroys the component. Angular manages listeners registered via <code>(click)="..."</code> in templates, but manually added listeners are your responsibility.</p>

          <p><strong>Timers</strong> (<code>setInterval</code>, <code>setTimeout</code> with future execution) keep their callback in the browser's timer queue. If the callback references the component, the component stays alive until the timer fires or is cleared.</p>
        `,
      "code": "// ---- LEAKING component — all three leak sources ----\nimport { Component, OnInit } from '@angular/core';\nimport { Router } from '@angular/router';\nimport { interval } from 'rxjs';\n\n@Component({ template: '...' })\nexport class LeakingComponent implements OnInit {\n  private count = 0;\n\n  ngOnInit(): void {\n    // LEAK 1: RxJS subscription never unsubscribed\n    // interval() fires every second forever — callback holds reference to `this`\n    interval(1000).subscribe(() => {\n      this.count++;  // this component is kept alive by this callback\n    });\n\n    // LEAK 2: Router events subscription never unsubscribed\n    this.router.events.subscribe(event => {\n      console.log('Route event', event);\n    });\n\n    // LEAK 3: DOM listener on window never removed\n    window.addEventListener('resize', () => {\n      // `this` is captured — component cannot be garbage collected\n      this.handleResize();\n    });\n\n    // LEAK 4: setInterval timer never cleared\n    setInterval(() => this.poll(), 5000);\n  }\n\n  private handleResize() {}\n  private poll() {}\n  constructor(private router: Router) {}\n}",
      "language": "typescript"
    },
    {
      "id": "takeuntil-pattern",
      "title": "The takeUntil pattern — unsubscribing multiple streams at once",
      "explanation": `
          <p>The most practical and widely adopted solution for subscription management in Angular components is the <strong>takeUntil</strong> pattern. The idea is simple: create a private <code>Subject</code> called <code>destroy$</code>. Pipe every long-lived subscription through <code>takeUntil(this.destroy$)</code>. In <code>ngOnDestroy</code>, emit a value on <code>destroy$</code> and complete it. All subscriptions that were piped through <code>takeUntil</code> automatically complete at that moment.</p>

          <p>The key advantage over manually tracking a <code>Subscription</code> object is that <code>takeUntil</code> scales to any number of subscriptions without any bookkeeping. Add as many <code>observable.pipe(takeUntil(this.destroy$)).subscribe()</code> calls as you need — they all clean up with the same two lines in <code>ngOnDestroy</code>.</p>

          <h3>Angular 16+ DestroyRef and takeUntilDestroyed</h3>
          <p>Angular 16 introduced <code>DestroyRef</code> and a new <code>takeUntilDestroyed()</code> operator from <code>@angular/core/rxjs-interop</code>. This is the modern replacement for the manual <code>destroy$</code> subject pattern. It integrates with Angular's component lifecycle without requiring you to implement <code>OnDestroy</code>, and can even be called outside a component class (in a service or a utility function) by passing a <code>DestroyRef</code> explicitly.</p>
        `,
      "code": "import { Component, OnInit, OnDestroy, inject } from '@angular/core';\nimport { interval, fromEvent } from 'rxjs';\nimport { takeUntil, takeUntilDestroyed } from '@angular/core/rxjs-interop';\n// Or for older pattern: import { takeUntil } from 'rxjs/operators';\nimport { Subject } from 'rxjs';\nimport { Router } from '@angular/router';\n\n// ---- Approach 1: Manual destroy$ Subject (Angular < 16) ----\n@Component({ template: '...' })\nexport class ComponentWithManualCleanup implements OnInit, OnDestroy {\n  private destroy$ = new Subject<void>();\n\n  ngOnInit(): void {\n    // All subscriptions share the same cleanup trigger\n    interval(1000)\n      .pipe(takeUntil(this.destroy$))\n      .subscribe(n => console.log('tick', n));\n\n    this.router.events\n      .pipe(takeUntil(this.destroy$))\n      .subscribe(event => this.handleRoute(event));\n\n    fromEvent(window, 'resize')\n      .pipe(takeUntil(this.destroy$))\n      .subscribe(() => this.handleResize());\n  }\n\n  ngOnDestroy(): void {\n    // One emit, all subscriptions complete\n    this.destroy$.next();\n    this.destroy$.complete();\n  }\n\n  private handleRoute(e: unknown) {}\n  private handleResize() {}\n  constructor(private router: Router) {}\n}\n\n// ---- Approach 2: takeUntilDestroyed (Angular 16+ — preferred) ----\n@Component({ template: '...' })\nexport class ModernComponent implements OnInit {\n  // inject() approach — no constructor needed\n  private router = inject(Router);\n\n  // DestroyRef is injected automatically by takeUntilDestroyed\n  // when called in injection context (field initializer or constructor)\n  private destroyRef = inject(DestroyRef);\n\n  ngOnInit(): void {\n    interval(1000)\n      // No explicit subject needed — DestroyRef handles it\n      .pipe(takeUntilDestroyed(this.destroyRef))\n      .subscribe(n => console.log('tick', n));\n\n    // Or directly in injection context (class field):\n    // readonly ticks$ = interval(1000).pipe(takeUntilDestroyed());\n    // No ngOnDestroy needed at all!\n  }\n}",
      "language": "typescript"
    },
    {
      "id": "async-pipe-benefits",
      "title": "The async pipe — the best subscription management tool",
      "explanation": `
          <p>The <strong>async pipe</strong> is Angular's built-in answer to subscription management in templates. When you write <code>users$ | async</code> in a template, Angular subscribes to the observable when the component initializes, updates the view whenever a new value arrives, and automatically unsubscribes when the component is destroyed. You never call <code>.subscribe()</code>, never manage a <code>Subscription</code> object, and never implement <code>ngOnDestroy</code> just for cleanup.</p>

          <p>Beyond cleanup, the async pipe integrates with Angular's change detection in a way that manual subscriptions cannot match. It calls <code>markForCheck()</code> internally when it receives a new value, which is exactly what <code>ChangeDetectionStrategy.OnPush</code> components need. If you use an OnPush component and subscribe manually without calling <code>markForCheck()</code>, the template will not update until something else triggers change detection. With the async pipe, OnPush and observables work seamlessly together without any boilerplate.</p>

          <h3>Combining Multiple Streams</h3>
          <p>When a template needs values from multiple streams, use RxJS's <code>combineLatest()</code> to merge them into a single observable of a view-model object. This pattern — creating a single <code>vm$</code> observable — requires only one async pipe in the template and eliminates the awkward <code>*ngIf="a$ | async as a"</code> nesting.</p>
        `,
      "code": "import { Component, inject } from '@angular/core';\nimport { AsyncPipe, NgIf, NgFor, CurrencyPipe } from '@angular/common';\nimport { combineLatest, map } from 'rxjs';\nimport { ProductService } from './product.service';\nimport { CartService } from './cart.service';\n\ninterface ProductViewModel {\n  products: Product[];\n  cartCount: number;\n  totalValue: number;\n  loading: boolean;\n}\n\n@Component({\n  selector: 'app-product-page',\n  standalone: true,\n  imports: [AsyncPipe, NgIf, NgFor, CurrencyPipe],\n  // One async pipe, one null check, everything in sync\n  template: `\n    @if (vm$ | async; as vm) {\n      <header>\n        <span>{{ vm.cartCount }} items — {{ vm.totalValue | currency }}</span>\n      </header>\n      <ul>\n        @for (product of vm.products; track product.id) {\n          <li>{{ product.name }}</li>\n        }\n      </ul>\n    } @else {\n      <p>Loading...</p>\n    }\n  `\n})\nexport class ProductPageComponent {\n  private productService = inject(ProductService);\n  private cartService = inject(CartService);\n\n  // Single view-model observable — one async pipe handles all streams\n  // No subscriptions, no ngOnDestroy, no manual cleanup\n  readonly vm$ = combineLatest([\n    this.productService.getAll(),\n    this.cartService.items$\n  ]).pipe(\n    map(([products, cartItems]): ProductViewModel => ({\n      products,\n      cartCount: cartItems.length,\n      totalValue: cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0),\n      loading: false\n    }))\n  );\n}",
      "language": "typescript"
    },
    {
      "id": "dom-listener-cleanup",
      "title": "Cleaning up DOM event listeners and timers",
      "explanation": `
          <p>Angular's template binding system (<code>(click)</code>, <code>(keydown)</code>) automatically adds and removes DOM event listeners — you never need to clean those up manually. The problem arises when you add listeners <em>outside</em> Angular's template: directly on <code>window</code>, <code>document</code>, a parent element, or a third-party library's DOM element. These are not tracked by Angular and must be removed in <code>ngOnDestroy</code>.</p>

          <h3>Using @HostListener Instead</h3>
          <p>The simplest way to avoid manual listener cleanup is to use <code>@HostListener</code> for listeners on the component's host element, and Angular CDK's <code>fromEvent()</code> + <code>takeUntilDestroyed()</code> pattern for <code>window</code> and <code>document</code> listeners. Both are automatically cleaned up by Angular.</p>

          <h3>Renderer2 for Platform-Safe DOM Access</h3>
          <p>When you must use <code>addEventListener</code> directly (e.g., in a directive that attaches to arbitrary elements), use Angular's <code>Renderer2.listen()</code> instead of <code>element.addEventListener()</code>. <code>Renderer2.listen()</code> returns an "unlisten" function. Store it and call it in <code>ngOnDestroy</code>. This is also SSR-safe because Renderer2 abstracts platform differences.</p>

          <h3>Timers</h3>
          <p>Store the return value of <code>setInterval()</code> and <code>setTimeout()</code> in a class property and call <code>clearInterval()</code> / <code>clearTimeout()</code> in <code>ngOnDestroy</code>. Alternatively, convert timers to RxJS observables (<code>interval()</code>, <code>timer()</code>) and use <code>takeUntilDestroyed()</code> — this keeps all your cleanup in one place.</p>
        `,
      "code": "import { Component, OnInit, OnDestroy, inject,\n         Renderer2, ElementRef, DestroyRef } from '@angular/core';\nimport { takeUntilDestroyed } from '@angular/core/rxjs-interop';\nimport { fromEvent, interval } from 'rxjs';\n\n@Component({\n  selector: 'app-scroll-tracker',\n  standalone: true,\n  template: `<p>Scroll position: {{ scrollY }}px</p>`\n})\nexport class ScrollTrackerComponent implements OnInit, OnDestroy {\n  scrollY = 0;\n\n  // ---- Option A: Renderer2.listen() — returns unlisten function ----\n  private renderer = inject(Renderer2);\n  private unlisten?: () => void;\n\n  // ---- Option B: fromEvent + takeUntilDestroyed (preferred) ----\n  private destroyRef = inject(DestroyRef);\n\n  ngOnInit(): void {\n    // Option A: Renderer2 (safe for SSR, cleanup via unlisten)\n    this.unlisten = this.renderer.listen('window', 'scroll', () => {\n      this.scrollY = window.scrollY;\n    });\n\n    // Option B: RxJS fromEvent (cleaner, same cleanup as subscriptions)\n    fromEvent(window, 'scroll')\n      .pipe(takeUntilDestroyed(this.destroyRef))\n      .subscribe(() => {\n        this.scrollY = window.scrollY;\n      });\n\n    // Timers as RxJS (no clearInterval needed)\n    interval(5000)\n      .pipe(takeUntilDestroyed(this.destroyRef))\n      .subscribe(() => this.refresh());\n  }\n\n  ngOnDestroy(): void {\n    // Only needed for Option A — Option B is cleaned up automatically\n    this.unlisten?.();\n    // takeUntilDestroyed handles the rest\n  }\n\n  private refresh(): void {}\n}",
      "language": "typescript"
    },
    {
      "id": "profiling-memory",
      "title": "Profiling and detecting memory leaks with Chrome DevTools",
      "explanation": `
          <p>Theoretical knowledge about leaks is necessary but not sufficient — you need to be able to confirm whether a specific component actually leaks in production. Chrome DevTools' <strong>Memory panel</strong> provides the tools to measure heap usage over time and identify what is preventing objects from being garbage collected.</p>

          <h3>Heap Snapshot Comparison</h3>
          <p>Take a heap snapshot before navigating to a component, interact with it, navigate away, then take another snapshot. Compare the two: if the component class still appears in the second snapshot, it was not garbage collected — it is leaking. In the snapshot detail view, you can see what is still holding a reference to the component (the "retainers" view), which usually points directly to the uncleaned subscription or event listener.</p>

          <h3>The Detached DOM Test</h3>
          <p>In the Memory panel, filter the second snapshot for "Detached". Detached DOM nodes are elements that were removed from the DOM but are still referenced in JavaScript. This reveals DOM elements that were created outside Angular's template (via <code>document.createElement</code>) and never explicitly removed.</p>

          <h3>Performance Monitor</h3>
          <p>The Performance Monitor panel (accessible from DevTools More Tools) shows live heap size and DOM node count. Navigate to the suspected leaking route repeatedly while watching the heap size. If it grows monotonically and does not drop after navigation, you have a leak. Use this to confirm a leak exists before spending time in heap snapshots to find the root cause.</p>
        `,
      "code": "// ---- Manual leak verification technique ----\n// Add a WeakRef to the component in development to check if it was GC'd.\n// WeakRef does not prevent garbage collection.\n\nimport { Component, OnInit, OnDestroy, NgZone, inject } from '@angular/core';\n\n@Component({ template: '...' })\nexport class InspectedComponent implements OnDestroy {\n  ngOnDestroy(): void {\n    // ---- Dev-only leak check ----\n    if (!isDevMode()) return;\n\n    // Store a WeakRef — if the component is GC'd, the WeakRef returns undefined\n    const ref = new WeakRef(this);\n\n    // Force GC (only works in Node/Chrome with --expose-gc flag in tests)\n    // In browser: manual GC via DevTools Memory panel -> 'Collect garbage' button\n    setTimeout(() => {\n      const alive = ref.deref();\n      if (alive) {\n        console.warn('LEAK: InspectedComponent was not garbage collected after destroy!');\n      } else {\n        console.log('OK: InspectedComponent was garbage collected.');\n      }\n    }, 5000);\n  }\n}\n\n// ---- Finding the retainer in Chrome DevTools ----\n// 1. Open DevTools → Memory tab\n// 2. Take Heap Snapshot 1 (before navigating to the component)\n// 3. Navigate to the component, interact with it\n// 4. Navigate away\n// 5. Click 'Collect Garbage' (trash icon)\n// 6. Take Heap Snapshot 2\n// 7. Change view to 'Comparison' and filter snapshot 2\n// 8. Search for your component class name (e.g., 'InspectedComponent')\n// 9. If it appears with # Delta > 0, it leaked\n// 10. Click it → 'Retainers' tab → shows what is holding the reference",
      "language": "typescript"
    }
  ]
});
