window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "version-specific-features",
  "title": "Angular Version History",
  "icon": "bi bi-arrow-repeat",
  "questions": [
    {
      "id": "angular-14-15-features",
      "title": "Angular 14 & 15 — inject(), standalone components, typed forms",
      "explanation": `
          <p>Angular 14 and 15 (released mid-2022 and late-2022) introduced three changes that fundamentally shaped how modern Angular code is written.</p>

          <h3>inject() — Angular 14</h3>
          <p>The <code>inject()</code> function lets you access the DI system without a constructor. Instead of declaring all dependencies as constructor parameters, you call <code>inject(HttpClient)</code> directly in a class field initializer. This eliminates verbose constructors, works in functional contexts (guards, resolvers, interceptors), and integrates cleanly with signals because the injected value is available immediately as a class property rather than requiring assignment in the constructor body.</p>

          <h3>Standalone Components — Angular 14 (preview), 15 (stable)</h3>
          <p>Standalone components (<code>standalone: true</code>) made NgModules optional. A component declares its own template dependencies in its <code>imports</code> array, eliminating the module file entirely. Angular 15 made standalone stable and extended it to directives and pipes. The Angular CLI started generating standalone by default. This is now the universal recommended approach for new Angular code.</p>

          <h3>Strictly Typed Reactive Forms — Angular 14</h3>
          <p>Before Angular 14, all <code>FormControl</code>, <code>FormGroup</code>, and <code>FormArray</code> values were typed as <code>any</code>. Angular 14 introduced full generic typing: <code>FormControl&lt;string&gt;</code> knows its value is a <code>string</code>. <code>FormGroup</code> keys are checked against the defined shape. This catches an entire class of form bugs at compile time — accessing a form control that does not exist, or assigning a value of the wrong type.</p>
        `,
      "code": "// ---- Angular 14: inject() function ----\nimport { Component, inject, OnInit } from '@angular/core';\nimport { HttpClient } from '@angular/common/http';\nimport { Router } from '@angular/router';\n\n@Component({ selector: 'app-example', standalone: true, template: '...' })\nexport class ExampleComponent {\n  // inject() in field initializers — no constructor boilerplate\n  private http   = inject(HttpClient);\n  private router = inject(Router);\n}\n\n// ---- Angular 14: Functional guards (uses inject()) ----\nexport const authGuard = () => {\n  const auth   = inject(AuthService);\n  const router = inject(Router);\n  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);\n};\n\n// Routes use it directly:\n// { path: 'dashboard', canActivate: [authGuard] }\n\n// ---- Angular 14: Strictly typed reactive forms ----\nimport { FormControl, FormGroup, Validators } from '@angular/forms';\n\n// Every form value is now statically typed\nconst loginForm = new FormGroup({\n  email:    new FormControl('', { nonNullable: true, validators: Validators.required }),\n  password: new FormControl('', { nonNullable: true, validators: Validators.minLength(8) })\n});\n\n// TypeScript knows loginForm.value.email is string | undefined\n// loginForm.value.nonExistentField → compile error\nconst email: string | undefined = loginForm.value.email;\n\n// ---- Angular 15: Directive Composition API ----\n// Apply multiple directives to a component's host element without wrapping\n@Component({\n  selector: 'app-tooltip-button',\n  standalone: true,\n  hostDirectives: [\n    // Apply MatTooltip's behavior directly to this component\n    { directive: MatTooltip, inputs: ['matTooltip: tooltip'] }\n  ],\n  template: `<button><ng-content /></button>`\n})\nexport class TooltipButtonComponent {}\n// Usage: <app-tooltip-button tooltip=\"Save changes\">Save</app-tooltip-button>",
      "language": "typescript"
    },
    {
      "id": "angular-16-17-features",
      "title": "Angular 16 & 17 — Signals, @defer, new control flow, esbuild",
      "explanation": `
          <p>Angular 16 and 17 (May 2023 and November 2023) were the most transformative releases since Angular 2, introducing the signals reactivity model and a completely new template syntax.</p>

          <h3>Signals — Angular 16 (developer preview), 17 (stable)</h3>
          <p>Signals are a new reactive primitive: a <code>signal()</code> holds a value and tracks who reads it. <code>computed()</code> derives values from signals and recomputes only when dependencies change. <code>effect()</code> runs side effects when signals change. Unlike RxJS observables, signals are synchronous, always have a current value (no "not yet emitted" state), and do not require subscription management. Angular 16 introduced <code>toSignal()</code> and <code>toObservable()</code> for gradual adoption alongside existing RxJS code.</p>

          <h3>New Control Flow — Angular 17</h3>
          <p>The <code>@if</code>, <code>@for</code>, <code>@switch</code> block syntax replaced structural directives. The new syntax is built into the compiler — no <code>CommonModule</code> import needed, better TypeScript type narrowing inside blocks (TypeScript knows the type is non-null inside <code>@if (user)</code>), and mandatory <code>track</code> in <code>@for</code> for efficient list reconciliation.</p>

          <h3>@defer — Angular 17</h3>
          <p>Deferrable views let you lazy-load components directly in templates without route-level code splitting. A component inside <code>@defer (on viewport)</code> is not included in the initial bundle — it is downloaded only when the browser's Intersection Observer fires. Combined with <code>@placeholder</code> and <code>@loading</code> blocks, this gives you fine-grained control over what loads and when, improving Time to Interactive without architectural changes.</p>

          <h3>New Application Builder — Angular 17</h3>
          <p>Angular 17 replaced the Webpack-based builder with an esbuild-based "Application Builder" as the default. Cold build times dropped by ~70% (30-second builds become under 10 seconds). Hot reload became near-instantaneous. The new builder also enabled Vite as the dev server, giving HMR (Hot Module Replacement) with sub-100ms rebuild times during development.</p>
        `,
      "code": "// ---- Angular 16: Signals ----\nimport { Component, signal, computed, effect, input, output } from '@angular/core';\n\n@Component({\n  selector: 'app-cart-summary',\n  standalone: true,\n  template: `\n    <p>{{ itemCount() }} items — {{ total() | currency }}</p>\n  `\n})\nexport class CartSummaryComponent {\n  // Signal inputs (Angular 17.1+) — replaces @Input()\n  items = input<CartItem[]>([]);\n\n  // Computed signals — auto-update when items() changes\n  itemCount = computed(() => this.items().length);\n  total     = computed(() =>\n    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)\n  );\n}\n\n// ---- Angular 17: @for with track (required) ----\n// <ul>\n//   @for (product of products(); track product.id) {\n//     <li [class.out-of-stock]=\"product.stock === 0\">\n//       {{ product.name }} — {{ product.price | currency }}\n//       @if (product.stock === 0) {\n//         <span class=\"badge\">Out of Stock</span>\n//       }\n//     </li>\n//   } @empty {\n//     <li>No products found.</li>\n//   }\n// </ul>\n\n// ---- Angular 17: @defer ----\n// @defer (on viewport; prefetch on idle) {\n//   <!-- Only downloaded when visible in viewport -->\n//   <app-reviews-section [productId]=\"id\" />\n// } @placeholder {\n//   <div class=\"reviews-skeleton\">Loading reviews...</div>\n// } @loading (minimum 500ms) {\n//   <mat-spinner />\n// } @error {\n//   <p>Failed to load reviews.</p>\n// }\n\n// ---- angular.json: use new Application builder ----\n// \"builder\": \"@angular-devkit/build-angular:application\"  ← esbuild-based\n// Previously: \"@angular-devkit/build-angular:browser\"     ← webpack-based",
      "language": "typescript"
    },
    {
      "id": "angular-18-19-features",
      "title": "Angular 18 & 19 — zoneless, incremental hydration, resource()",
      "explanation": `
          <p>Angular 18 and 19 (May 2024 and November 2024) focused on completing the signals story and advancing server-side rendering.</p>

          <h3>Zoneless Change Detection — Angular 18 (experimental)</h3>
          <p>Angular 18 introduced <strong>experimental zoneless change detection</strong> via <code>provideZonelessChangeDetection()</code>. When enabled, Zone.js is no longer required. Angular relies entirely on signals (and explicit <code>ChangeDetectorRef</code> calls) to know when to update the DOM. Removing Zone.js reduces bundle size by ~36KB and eliminates the performance overhead of Zone.js patching every async API. Zoneless requires that your application's state changes go through signals or explicit marking — passive property mutations no longer trigger change detection.</p>

          <h3>Signal-Based Component APIs — Angular 17.1–18</h3>
          <p><code>input()</code>, <code>output()</code>, and <code>model()</code> completed the signal-based component API surface. <code>input()</code> replaces <code>@Input()</code> with a signal that reads the parent-bound value reactively. <code>output()</code> replaces <code>@Output()</code> with a cleaner emitter API. <code>model()</code> provides a two-way binding signal — equivalent to an input paired with an output named <code>valueChange</code>.</p>

          <h3>Incremental Hydration — Angular 19</h3>
          <p>Angular 19 extended <code>@defer</code> to work with SSR hydration. With incremental hydration, the server renders the full page HTML (including deferred components), but the client only hydrates (downloads JavaScript and attaches event listeners) for the parts that the user actually interacts with. Sections below the fold or behind user interaction remain as static HTML until needed. This dramatically reduces the JavaScript that must be parsed on initial load.</p>

          <h3>resource() API — Angular 19</h3>
          <p>The <code>resource()</code> API provides a signal-based abstraction for async data loading. A <code>resource</code> has <code>value()</code>, <code>isLoading()</code>, <code>error()</code>, and <code>status()</code> signals, eliminating the boilerplate of manually managing loading and error state with separate signals. When the <code>request</code> signal changes, the resource automatically re-fetches.</p>
        `,
      "code": "// ---- Angular 18: Zoneless change detection ----\nimport { bootstrapApplication, provideZonelessChangeDetection } from '@angular/platform-browser';\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    // Replaces Zone.js — requires signals for reactivity\n    provideZonelessChangeDetection()\n    // Remove 'zone.js' import from polyfills.ts as well\n  ]\n});\n\n// ---- Angular 17.1+: signal-based component APIs ----\nimport { Component, input, output, model } from '@angular/core';\n\n@Component({\n  selector: 'app-quantity-picker',\n  standalone: true,\n  template: `\n    <button (click)=\"decrement()\">-</button>\n    {{ quantity() }}\n    <button (click)=\"increment()\">+</button>\n  `\n})\nexport class QuantityPickerComponent {\n  // input() — replaces @Input()\n  min = input(1);\n  max = input(99);\n\n  // model() — two-way binding: replaces @Input() + @Output() valueChange\n  quantity = model(1);\n\n  // output() — replaces @Output() + EventEmitter\n  outOfRange = output<void>();\n\n  increment(): void {\n    const next = this.quantity() + 1;\n    if (next <= this.max()) this.quantity.set(next);\n    else this.outOfRange.emit();\n  }\n  decrement(): void {\n    const next = this.quantity() - 1;\n    if (next >= this.min()) this.quantity.set(next);\n  }\n}\n// Parent: <app-quantity-picker [(quantity)]=\"cartItem.qty\" [max]=\"stock\" />\n\n// ---- Angular 19: resource() API ----\nimport { Component, signal, resource } from '@angular/core';\nimport { inject } from '@angular/core';\n\n@Component({\n  selector: 'app-product-detail',\n  standalone: true,\n  template: `\n    @if (productResource.isLoading()) {\n      <mat-spinner />\n    } @else if (productResource.error()) {\n      <p>Error: {{ productResource.error() }}</p>\n    } @else {\n      <h1>{{ productResource.value()?.name }}</h1>\n    }\n  `\n})\nexport class ProductDetailComponent {\n  productId = signal<number | null>(null);\n\n  // resource() re-fetches whenever productId() changes\n  productResource = resource({\n    request: this.productId,\n    loader: async ({ request: id }) => {\n      if (!id) return null;\n      const res = await fetch(`/api/products/${id}`);\n      return res.json() as Promise<Product>;\n    }\n  });\n}",
      "language": "typescript"
    },
    {
      "id": "deprecated-features",
      "title": "Deprecated and discouraged patterns — what to migrate away from",
      "explanation": `
          <p>Angular's evolution toward signals and standalone components means some older patterns are now actively discouraged in new code, even though they still work. Understanding what is deprecated and why helps you write idiomatic modern Angular and plan migration work for existing codebases.</p>

          <h3>NgModules</h3>
          <p>NgModules are not deprecated and will not be removed — Angular maintains strong backwards compatibility. However, they are no longer recommended for new code. Every new feature introduced since Angular 14 is designed for standalone components. The Angular CLI generates standalone by default. The main motivation to keep NgModules in existing code is avoiding large-scale refactoring; new features should be written standalone.</p>

          <h3>@Input / @Output Decorators</h3>
          <p>The decorator-based <code>@Input()</code> and <code>@Output()</code> still work and will continue to work. The signal-based <code>input()</code> and <code>output()</code> are preferred for new code because they integrate with zoneless change detection, work naturally with <code>computed()</code>, and require no decorator metadata. Migrating existing components is low-priority unless they are being actively developed.</p>

          <h3>Zone.js Reliance</h3>
          <p>In a zoneless Angular 18+ app, Zone.js can be removed from <code>polyfills.ts</code> entirely. However, many third-party libraries still trigger change detection via Zone.js patching. Removing Zone.js may break libraries that are not yet zoneless-compatible. Check your dependencies before removing it in production.</p>

          <h3>Karma Test Runner</h3>
          <p>Karma was deprecated in Angular 16. The Angular team recommends migrating to the Web Test Runner (with <code>@web/test-runner</code>) or to Jest for unit tests. New projects generated with the CLI use the Web Test Runner by default.</p>
        `,
      "code": "// ----  Pattern comparison: old vs modern Angular ----\n\n// ❌ Old: NgModule-based component (Angular < 14 style)\n// @NgModule({ declarations: [ProductListComponent], imports: [CommonModule] })\n// export class ProductsModule {}\n//\n// @Component({ selector: 'app-product-list', templateUrl: '...' })\n// export class ProductListComponent implements OnInit {\n//   @Input() category: string = '';\n//   @Output() productSelected = new EventEmitter<Product>();\n//   constructor(private service: ProductService) {}\n//   ngOnInit() { this.service.getAll().subscribe(p => this.products = p); }\n// }\n\n// ✅ Modern: Standalone + signals + inject() (Angular 17+ style)\nimport { Component, inject, signal, input, output, computed } from '@angular/core';\nimport { takeUntilDestroyed } from '@angular/core/rxjs-interop';\nimport { AsyncPipe } from '@angular/common';\nimport { ProductService } from './product.service';\n\n@Component({\n  selector: 'app-product-list',\n  standalone: true,\n  template: `\n    @for (product of filtered(); track product.id) {\n      <app-product-card [product]=\"product\"\n        (add)=\"productSelected.emit(product)\" />\n    } @empty {\n      <p>No products in {{ category() }}</p>\n    }\n  `\n})\nexport class ProductListComponent {\n  // Signal-based input\n  category = input<string>('');\n\n  // Signal-based output\n  productSelected = output<Product>();\n\n  // inject() — no constructor\n  private service = inject(ProductService);\n\n  // Signal state\n  products = signal<Product[]>([]);\n\n  // Computed — auto-updates when category or products change\n  filtered = computed(() =>\n    this.products().filter(p => !this.category() || p.category === this.category())\n  );\n\n  constructor() {\n    // takeUntilDestroyed — no ngOnDestroy needed\n    this.service.getAll()\n      .pipe(takeUntilDestroyed())\n      .subscribe(p => this.products.set(p));\n  }\n}",
      "language": "typescript"
    },
    {
      "id": "deferrable-views-defer",
      "title": "@defer — template-level lazy loading with trigger conditions",
      "explanation": `
          <p><code>@defer</code> is one of the most practically impactful features introduced in Angular 17. Before it, the only way to lazy-load a component was through route-level code splitting (<code>loadComponent</code>). If you wanted a heavy component (a rich text editor, a data visualization, a comments section) to not be part of the initial bundle, you had to restructure your routing to put it on a separate route — often an awkward architectural compromise.</p>

          <p><code>@defer</code> solves this at the template level. Any component inside a <code>@defer</code> block is automatically split into a separate chunk by the build system. The chunk is downloaded only when the trigger condition is met. The component's module, its dependencies, and its styles all stay out of the initial bundle.</p>

          <h3>Trigger Conditions</h3>
          <p><code>on viewport</code> — uses IntersectionObserver to load when the placeholder enters the visible area. Best for below-the-fold content. <code>on interaction</code> — loads on click, hover, or focus on the placeholder. Best for expandable panels and on-demand widgets. <code>on idle</code> — loads during browser idle time, after the main content is interactive. Best for lower-priority enhancements. <code>when condition</code> — loads when a boolean expression becomes true. Best for user-triggered states (e.g., user scrolls to a section, or a feature flag is enabled).</p>

          <h3>Prefetch</h3>
          <p>Prefetch lets you separate the download trigger from the render trigger. <code>@defer (on interaction; prefetch on idle)</code> starts downloading the chunk during idle time, but renders the component only when the user interacts. This hides the download latency while still deferring the render until needed.</p>
        `,
      "code": "// ---- Full @defer example with all blocks ----\nimport { Component, signal } from '@angular/core';\n\n@Component({\n  selector: 'app-product-page',\n  standalone: true,\n  template: `\n    <!-- Always in the main bundle: fast initial paint -->\n    <app-product-header [product]=\"product()\" />\n    <app-product-gallery [images]=\"product().images\" />\n\n    <!-- Rich text editor: only needed if user clicks Edit -->\n    <!-- Prefetch during idle so it downloads without waiting for click -->\n    @defer (on interaction; prefetch on idle) {\n      <app-rich-editor [content]=\"product().description\"\n                       (saved)=\"saveDescription($event)\" />\n    } @placeholder {\n      <div class=\"description-preview\">{{ product().description }}</div>\n      <button>Edit Description</button>\n    } @loading (minimum 300ms) {\n      <mat-spinner diameter=\"24\" />\n    } @error {\n      <p class=\"text-red-500\">Editor failed to load. Please refresh.</p>\n    }\n\n    <!-- Reviews section: below fold — load when visible -->\n    @defer (on viewport) {\n      <app-reviews [productId]=\"product().id\" />\n    } @placeholder {\n      <div class=\"reviews-skeleton\" aria-hidden=\"true\">\n        <div class=\"skeleton-line\" *ngFor=\"let _ of [1,2,3]\"></div>\n      </div>\n    }\n\n    <!-- AI recommendations: low priority — load on idle -->\n    @defer (on idle) {\n      <app-ai-recommendations [productId]=\"product().id\" />\n    }\n\n    <!-- Related products: load when user reaches this section -->\n    @defer (when showRelated()) {\n      <app-related-products [category]=\"product().category\" />\n    }\n  `\n})\nexport class ProductPageComponent {\n  product = signal<Product>(null!);\n  showRelated = signal(false);\n\n  saveDescription(content: string): void {\n    // ...\n  }\n}",
      "language": "typescript"
    }
  ]
});
