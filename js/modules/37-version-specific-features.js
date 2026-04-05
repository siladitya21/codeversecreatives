window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "version-specific-features",
  "title": "Version-Specific Features",
  "icon": "bi bi-arrow-repeat", // Choosing an icon for change/update
  "questions": [
    {
      "id": "new-features-latest-angular",
      "title": "New features in Angular 21",
      "explanation": `
          <p>Angular 21 (released May 2025) continues to evolve with powerful features for modern web development. The framework has moved toward a <strong>signals-first, standalone-first</strong> architecture with zoneless change detection as the recommended approach.</p>
          <h3>Angular 21 Highlights</h3>
          <ul>
            <li><strong>Zoneless Change Detection:</strong> Angular now detects changes without Zone.js overhead, leading to better performance.</li>
            <li><strong>Advanced Signal APIs:</strong> Enhanced signals with <code>linkedSignal()</code>, <code>resource()</code>, and <code>outputFromObservable()</code>.</li>
            <li><strong>Signal Inputs &amp; Outputs:</strong> <code>input()</code> and <code>output()</code> replace <code>@Input/@Output</code> with signal-based reactivity.</li>
            <li><strong>Stable Control Flow:</strong> <code>@if</code>, <code>@for</code>, <code>@switch</code>, and <code>@defer</code> are now the standard template syntax.</li>
            <li><strong>Native Hydration:</strong> Built-in SSR hydration for seamless Server-Side Rendering experiences.</li>
            <li><strong>Two-way Binding with Signals:</strong> The <code>model()</code> signal for intuitive two-way data binding.</li>
            <li><strong>Standalone-First by Default:</strong> NgModules are now optional; most apps use standalone components.</li>
            <li><strong>Enhanced Testing APIs:</strong> New utilities for testing signals and zoneless components.</li>
          </ul>
        `,
      "code": "// Angular 21: Zoneless Component with Signals\nimport { Component, signal, computed, effect, input, output } from '@angular/core';\n\n@Component({\n  selector: 'app-dashboard',\n  standalone: true,\n  template: `\n    <h1>{{ title }}</h1>\n    @if (isAdmin()) {\n      <admin-panel />\n    }\n    \n    @for (item of items(); track item.id) {\n      <div>{{ item.name }}</div>\n    }\n\n    @defer (on viewport) {\n      <app-comments />\n    } @placeholder {\n      <div>Loading comments...</div>\n    }\n  `\n})\nexport class DashboardComponent {\n  // Signal inputs from parent\n  isAdmin = input<boolean>(false);\n  title = input<string>('Dashboard');\n  \n  // Local state as signal\n  count = signal(0);\n  items = signal([{ id: 1, name: 'Item 1' }]);\n  \n  // Derived state\n  doubleCount = computed(() => this.count() * 2);\n  \n  // Output signal\n  updateEvent = output<{ count: number }>();\n  \n  constructor() {\n    // Side effects with signals\n    effect(() => {\n      console.log('Count changed:', this.count());\n    });\n  }\n}",
      "language": "typescript"
    },
    {
      "id": "deprecated-features",
      "title": "Deprecated features in Angular 21",
      "explanation": `
          <p>As Angular 21 embraces signals and zoneless change detection, several patterns and APIs from earlier versions are now deprecated or discouraged. Understanding these helps you adopt modern practices.</p>
          <h3>Key Deprecations & Migrations</h3>
          <ul>
            <li><strong><code>NgModules</code> (discouraged, not removed):</strong> While still supported, NgModules are no longer the default. Use standalone components instead.</li>
            <li><strong><code>@Input/@Output</code> decorators:</strong> Consider using <code>input()</code> and <code>output()</code> signal-based APIs for new code.</li>
            <li><strong><code>Zone.js (optional):</strong> Zoneless change detection eliminates the need for Zone.js in new apps, reducing bundle size.</li>
            <li><strong><code>EventEmitter</code>:</strong> Gradually being replaced by the <code>output()</code> signal API.</li>
            <li><strong><code>ChangeDetectionStrategy.OnPush</code>:</strong> Less relevant with zoneless change detection and signals.</li>
            <li><strong><code>async pipe</code> (in favor of signals):</strong> Signal deref operator or <code>toSignal()</code> are preferred.</li>
            <li><strong><code>Karma &amp; Protractor</code>:</strong> Deprecated test runners; migrate to Jasmine with standalone test setup or Jest/Playwright.</li>
          </ul>
        `,
      "code": "// ❌ Angular 16-20 Pattern (still works, but discouraged)\n@Component({...})\nexport class OldComponent {\n  @Input() title: string = '';\n  @Output() clicked = new EventEmitter<void>();\n  \n  constructor(private cdr: ChangeDetectorRef) {}\n  \n  onAction() {\n    this.clicked.emit();\n    this.cdr.markForCheck();\n  }\n}\n\n// ✅ Angular 21 Pattern (recommended)\nimport { component, input, output } from '@angular/core';\n\nexport class ModernComponent {\n  title = input<string>('');\n  clicked = output<void>();\n  \n  onAction() {\n    this.clicked.emit();\n    // No manual change detection needed!\n  }\n}",
      "language": "typescript"
    },
    {
      "id": "standalone-apis",
      "title": "Standalone APIs (Default in Angular 21)",
      "explanation": `
          <p><strong>Standalone APIs</strong> are now the recommended default for new Angular 21 applications. They eliminate the need for NgModules in most cases, reducing boilerplate and improving tree-shaking.</p>
          <h3>Core Standalone Concepts</h3>
          <ul>
            <li><strong><code>standalone: true</code> flag:</strong> In <code>@Component</code>, <code>@Directive</code>, or <code>@Pipe</code> decorators.</li>
            <li><strong><code>imports</code> array:</strong> Directly in the decorator to declare component dependencies.</li>
            <li><strong><code>bootstrapApplication()</code>:</strong> Used in <code>main.ts</code> to bootstrap the root component with functional providers.</li>
            <li><strong>Functional providers:</strong> <code>provideRouter()</code>, <code>provideHttpClient()</code>, <code>provideAnimations()</code>, etc.</li>
            <li><strong>Zoneless setup:</strong> Use <code>provideZoneChangeDetection()</code> for optimal performance.</li>
          </ul>
        `,
      "code": "// main.ts - Angular 21 Zoneless Bootstrap\nimport { bootstrapApplication } from '@angular/platform-browser';\nimport { provideZoneChangeDetection } from '@angular/core';\nimport { provideRouter } from '@angular/router';\nimport { provideHttpClient } from '@angular/common/http';\nimport { provideAnimations } from '@angular/platform-browser/animations';\n\nimport { AppComponent } from './app/app.component';\nimport { routes } from './app/app.routes';\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    provideZoneChangeDetection({ eventCoalescing: true }),\n    provideRouter(routes),\n    provideHttpClient(),\n    provideAnimations()\n  ]\n}).catch(err => console.error(err));",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Angular 21 Standalone App Flow</p><div class="flex flex-col items-center gap-2 max-w-sm mx-auto"><div class="bg-indigo-600 text-white p-2 rounded text-xs font-bold w-full text-center">main.ts (bootstrapApplication)</div><div class="text-slate-300 text-xs">&darr;</div><div class="bg-emerald-50 border-2 border-emerald-200 p-2 rounded text-xs text-center w-full">provideZoneChangeDetection() + provideRouter() + ...</div><div class="text-slate-300 text-xs">&darr;</div><div class="bg-amber-50 border-2 border-amber-200 p-2 rounded text-xs text-center w-full font-bold">AppComponent (standalone: true)</div><div class="text-slate-300 text-xs">&darr;</div><div class="bg-sky-50 border-2 border-sky-200 p-2 rounded text-xs text-center w-full">No NgModules needed!</div></div></div>`
    },
    {
      "id": "zoneless-change-detection",
      "title": "Zoneless Change Detection (Angular 21+)",
      "explanation": `
          <p><strong>Zoneless Change Detection</strong> is a new approach in Angular 21 that eliminates the dependency on Zone.js. This reduces bundle size, improves performance, and simplifies testing.</p>\n\n          <h3>Key Benefits</h3>\n          <ul>\n            <li><strong>Smaller bundle:</strong> Removes ~36KB of Zone.js from your bundle.</li>\n            <li><strong>Faster change detection:</strong> Only updates components with changed signals (fine-grained).</li>\n            <li><strong>Better debugging:</strong> Simpler stack traces and easier to reason about execution flow.</li>\n            <li><strong>Signals-first:</strong> Works seamlessly with signal-based reactivity.</li>\n          </ul>\n        `,
      "code": "// Enable zoneless change detection in Angular 21\nimport { bootstrapApplication } from '@angular/platform-browser';\nimport { provideZoneChangeDetection } from '@angular/core';\nimport { AppComponent } from './app/app.component';\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    provideZoneChangeDetection({ \n      eventCoalescing: true  // Batch rapid events for efficiency\n    })\n  ]\n}).catch(err => console.error(err));\n\n// Component automatically tracks signal changes\n@Component({\n  standalone: true,\n  template: `\n    <div>Count: {{ count() }}</div>\n    <button (click)=\"count.set(count() + 1)\">Increment</button>\n  `\n})\nexport class CounterComponent {\n  count = signal(0);\n  // Change detection happens automatically on signal changes!\n}",
      "language": "typescript",
      "diagram": `<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Zoneless vs Zone.js</p><div class=\"grid grid-cols-2 gap-3 max-w-md mx-auto\"><div class=\"bg-red-50 border border-red-200 p-3 rounded text-center\"><p class=\"text-xs font-bold text-red-700\">Zone.js</p><p class=\"text-[10px] text-slate-500 mt-1\">Patches all async APIs<br/>Full app scan on changes<br/>36KB overhead</p></div><div class=\"bg-emerald-50 border border-emerald-200 p-3 rounded text-center\"><p class=\"text-xs font-bold text-emerald-700\">Zoneless (v21)</p><p class=\"text-[10px] text-slate-500 mt-1\">Native async support<br/>Signal-based updates only<br/>0KB overhead</p></div></div></div>`
    },
    {
      "id": "inject-function",
      "title": "Inject function",
      "explanation": `
          <p>The <strong><code>inject()</code> function</strong> provides a clean way to perform dependency injection in Angular. It allows you to inject services and other dependencies outside of a class constructor, making code more readable.</p>
          <p><strong>Constraint:</strong> It must be called during an <strong>Injection Context</strong> (e.g., during class construction or in a factory function).</p>
          <h3>Key Benefits</h3>
          <ul>
            <li><strong>Flexibility:</strong> Inject dependencies in functions and other non-class contexts.</li>
            <li><strong>Cleaner Code:</strong> Initialize properties directly, reducing constructor boilerplate.</li>
            <li><strong>Works with signals:</strong> Seamlessly integrates with signal-based components.</li>
          </ul>
        `,
      "code": "import { Component, inject, signal } from '@angular/core';\nimport { ActivatedRoute } from '@angular/router';\nimport { UserService } from './user.service';\n\n@Component({\n  selector: 'app-user',\n  standalone: true,\n  template: `<h1>{{ user()?.name }}</h1>`\n})\nexport class UserComponent {\n  private userService = inject(UserService);\n  private route = inject(ActivatedRoute);\n  \n  user = signal(null);\n  \n  constructor() {\n    const userId = this.route.snapshot.paramMap.get('id');\n    if (userId) {\n      this.userService.getUser(userId).subscribe(data => {\n        this.user.set(data);\n      });\n    }\n  }\n}",
      "language": "typescript"
    },
    {
      "id": "destroyref",
      "title": "DestroyRef",
      "explanation": `
          <p><strong><code>DestroyRef</code></strong> is an injectable service for registering cleanup logic that runs when a context (component, service, etc.) is destroyed. This eliminates the need for <code>ngOnDestroy</code> in many cases.</p>
          <p>This allows you to define cleanup logic <strong>where the resource is created</strong>, rather than at the bottom of your file.</p>
          <h3>Key Usage</h3>
          <ul>
            <li>Registering callbacks that run on destruction.</li>
            <li>Used with <code>takeUntilDestroyed()</code> to prevent memory leaks in a declarative way.</li>
          </ul>
        `,
      "code": "import { Injectable, DestroyRef, inject } from '@angular/core';\nimport { takeUntilDestroyed } from '@angular/core/rxjs-interop';\nimport { EMPTY, interval } from 'rxjs';\n\n@Injectable({ providedIn: 'root' })\nexport class DataService {\n  // Example observable, could be from HttpClient, etc.\n  data$ = interval(1000);\n\n  constructor() {\n    // Setup auto-unsubscription logic immediately\n    this.data$.pipe(\n      takeUntilDestroyed() // Scoped to this service's lifecycle\n    ).subscribe(val => console.log('Service timer:', val));\n\n    // Manually register a cleanup callback\n    inject(DestroyRef).onDestroy(() => {\n      console.log('Service destroyed, performing final cleanup...');\n    });\n  }\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><div class="max-w-md mx-auto bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center"><p class="text-xs font-bold text-emerald-700">Component/Service Destroyed &rarr; DestroyRef Callback</p><p class="text-[10px] text-slate-500 mt-2">Automatic cleanup of subscriptions and resources.</p></div></div>`
    },
    {
      "id": "new-control-flow-syntax",
      "title": "New Control Flow Syntax (@if, @for, @switch)",
      "explanation": `
          <p>Angular 17+ introduces a new declarative control flow syntax that replaces structural directives like <code>*ngIf</code>, <code>*ngFor</code>, and <code>*ngSwitchCase</code>. This new syntax is more readable, performant, and requires fewer imports.</p>\n\n          <h3>Key Improvements</h3>\n          <ul>\n            <li><strong>Cleaner templates:</strong> No asterisks or need for wrapping div containers.</li>\n            <li><strong>Better type checking:</strong> IDE can better infer types within control flow blocks.</li>\n            <li><strong>No CommonModule needed:</strong> Control flow is built-in; no need to import CommonModule.</li>\n            <li><strong><code>track</code> required:</strong> The <code>@for</code> block requires a <code>track</code> function for optimal change detection.</li>\n            <li><strong>Performance:</strong> Optimized rendering path compared to structural directives.</li>\n          </ul>\n        `,
      "code": "// New syntax: @if, @else if, @else\n@if (user) {\n  <div>Logged in as {{ user.name }}</div>\n} @else if (loading) {\n  <div>Loading...</div>\n} @else {\n  <div>Please log in</div>\n}\n\n// New syntax: @for with track\n@for (let item of items; track item.id) {\n  <div class=\"item\">{{ item.name }} - \\${{ item.price }}</div>\n}\n\n// New syntax: @switch with @case\n@switch (status) {\n  @case ('active') {\n    <span class=\"badge badge-success\">Active</span>\n  }\n  @case ('inactive') {\n    <span class=\"badge badge-danger\">Inactive</span>\n  }\n  @default {\n    <span class=\"badge badge-secondary\">Unknown</span>\n  }\n}",
      "language": "html",
      "diagram": `<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Control Flow Evolution</p><div class=\"grid grid-cols-2 gap-3 max-w-md mx-auto\"><div class=\"bg-red-50 border border-red-200 p-2 rounded text-center\"><p class=\"text-xs font-semibold\">Old (*ngIf)</p><p class=\"text-[10px] text-slate-600\">Structural Directive</p></div><div class=\"bg-emerald-50 border border-emerald-200 p-2 rounded text-center\"><p class=\"text-xs font-semibold\">New (@if)</p><p class=\"text-[10px] text-slate-600\">Built-in Syntax</p></div></div></div>`
    },
    {
      "id": "deferrable-views-defer",
      "title": "Deferrable Views with @defer",
      "explanation": `
          <p><strong>Deferrable Views (@defer)</strong> allow you to lazy-load components and their dependencies directly in templates. This reduces initial bundle size and improves Time to Interactive (TTI) for critical content.</p>\n\n          <h3>Key Features</h3>\n          <ul>\n            <li><strong>on viewport:</strong> Load when component enters the viewport (Intersection Observer).</li>\n            <li><strong>on interaction:</strong> Load on user interaction (click, hover, focus).</li>\n            <li><strong>on immediate:</strong> Load immediately after rendering parent.</li>\n            <li><strong>when condition:</strong> Load based on a component property.</li>\n            <li><strong>@placeholder:</strong> Show content while deferred component is loading.</li>\n            <li><strong>@error:</strong> Handle loading failures gracefully.</li>\n          </ul>\n        `,
      "code": "// Defer on viewport (e.g., chart below fold)\n@defer (on viewport) {\n  <app-heavy-chart [data]=\"chartData\"></app-heavy-chart>\n} @placeholder {\n  <div class=\"placeholder h-96 bg-gray-100\">Chart will load when visible...</div>\n}\n\n// Defer on interaction (e.g., click to expand)\n@defer (on interaction) {\n  <app-detailed-comments [postId]=\"postId\"></app-detailed-comments>\n} @placeholder (minimum 500ms) {\n  <button>Load Comments</button>\n} @error {\n  <div class=\"alert alert-danger\">Failed to load comments</div>\n}\n\n// Defer conditionally\n@defer (when isDetailsPanelOpen) {\n  <app-details-panel [data]=\"selectedItem\"></app-details-panel>\n}",
      "language": "html",
      "diagram": `<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Deferrable View Lifecycle</p><div class=\"flex flex-col items-center gap-2 max-w-md mx-auto\"><div class=\"bg-indigo-50 border border-indigo-200 p-2 rounded text-xs\">Trigger (viewport/interaction/condition)</div><div class=\"text-slate-300 text-xs\">↓</div><div class=\"bg-amber-50 border border-amber-200 p-2 rounded text-xs\">@placeholder shown</div><div class=\"text-slate-300 text-xs\">↓</div><div class=\"bg-blue-50 border border-blue-200 p-2 rounded text-xs\">Component dependencies loaded</div><div class=\"text-slate-300 text-xs\">↓</div><div class=\"bg-emerald-50 border border-emerald-200 p-2 rounded text-xs\">Deferred content rendered</div></div></div>`
    },
    {
      "id": "ngmodule-to-standalone-migration",
      "title": "Migrating NgModule-based apps to Standalone",
      "explanation": `
          <p>While NgModules are not deprecated, Angular encourages a <strong>standalone-first</strong> approach. Migrating existing NgModule-based apps to standalone components can reduce boilerplate and improve maintainability.</p>\n\n          <h3>Migration Strategy</h3>\n          <ol>\n            <li><strong>Bootstrap function:</strong> Replace <code>bootstrapModule(AppModule)</code> with <code>bootstrapApplication(AppComponent)</code> in <code>main.ts</code>.</li>\n            <li><strong>Component setup:</strong> Add <code>standalone: true</code> and <code>imports</code> array to component metadata.</li>\n            <li><strong>Providers:</strong> Move NgModule providers to <code>bootstrapApplication()</code> configuration or component-level providers.</li>\n            <li><strong>Gradual migration:</strong> You can migrate incrementally; standalone components can coexist with NgModule-based ones.</li>\n            <li><strong>Lazy routes:</strong> Use <code>loadComponent</code> instead of <code>loadChildren</code> for route-based code splitting.</li>\n          </ol>\n        `,
      "code": "// Old: app.module.ts (NgModule-based)\n@NgModule({\n  imports: [BrowserModule, CommonModule, HttpClientModule, AppRouting],\n  declarations: [AppComponent, UserComponent],\n  providers: [UserService, AuthGuard],\n  bootstrap: [AppComponent]\n})\nexport class AppModule { }\n\n// Old: main.ts\nimport { platformBrowserDynamic } from '@angular/platform-browser-dynamic';\nimport { AppModule } from './app/app.module';\nplatformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));\n\n// New: app.component.ts (Standalone)\n@Component({\n  selector: 'app-root',\n  standalone: true,\n  imports: [CommonModule, HttpClientModule, AppRouting, UserComponent],\n  providers: [UserService, AuthGuard],\n  template: `<router-outlet></router-outlet>`\n})\nexport class AppComponent { }\n\n// New: main.ts\nimport { bootstrapApplication } from '@angular/platform-browser';\nimport { AppComponent } from './app/app.component';\nbootstrapApplication(AppComponent).catch(err => console.error(err));"
    },
    {
      "id": "control-flow-vs-structural-directives",
      "title": "Comparing Control Flow and Structural Directives",
      "explanation": `
          <p>Understanding the differences between old structural directives and new control flow syntax helps in making informed decisions about template code and recognizing patterns in existing codebases.</p>\n\n          <h3>Key Differences</h3>\n          <ul>\n            <li><strong>Syntax:</strong> Structural directives use asterisks and attribute syntax; new control flow uses block syntax.</li>\n            <li><strong>Type safety:</strong> New control flow provides better type checking within blocks.</li>\n            <li><strong>Performance:</strong> Control flow is optimized by the framework; structural directives use directive logic.</li>\n            <li><strong>Imports:</strong> No need to import CommonModule for basic control flow.</li>\n            <li><strong>Backward compatibility:</strong> Structural directives still work; it's optional to migrate.</li>\n          </ul>\n        `,
      "code": "// Structural Directives (Angular <17)\n<div *ngIf=\"user\">{{ user.name }}</div>\n<div *ngFor=\"let item of items; trackBy: trackByFn\">{{ item }}</div>\n<div [ngSwitch]=\"status\">\n  <div *ngSwitchCase=\"'active'\">Active</div>\n  <div *ngSwitchDefault>Default</div>\n</div>\n<div *ngIf=\"loading else content\">\n  <p>Loading...</p>\n</div>\n<ng-template #content>\n  <p>Loaded</p>\n</ng-template>\n\n// New Control Flow (Angular 17+)\n@if (user) { {{ user.name }} }\n@for (let item of items; track item.id) { {{ item }} }\n@switch (status) {\n  @case ('active') { Active }\n  @default { Default }\n}\n@if (loading) {\n  <p>Loading...</p>\n} @else {\n  <p>Loaded</p>\n}"
    }
  ]
});