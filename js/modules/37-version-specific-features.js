window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "version-specific-features",
  "title": "Version-Specific Features",
  "icon": "bi bi-arrow-repeat", // Choosing an icon for change/update
  "questions": [
    {
      "id": "new-features-latest-angular",
      "title": "New features in latest Angular versions",
      "explanation": `
          <p>Angular is continuously evolving, with each major version bringing new features, performance improvements, and developer experience enhancements. Recent versions (Angular 16, 17, etc.) have introduced significant changes.</p>
          <h3>Highlights from Recent Versions</h3>
          <ul>
            <li><strong>Signals:</strong> A new reactivity primitive for fine-grained change detection and state management.</li>
            <li><strong>Standalone APIs:</strong> Making NgModules optional for components, directives, and pipes.</li>
            <li><strong>New Control Flow:</strong> Built-in template syntax for <code>@if</code>, <code>@for</code>, <code>@switch</code>, replacing structural directives.</li>
            <li><strong>Deferrable Views (@defer):</strong> A powerful declarative syntax to lazy-load components and their dependencies directly from the template.</li>
            <li><strong>Hydration:</strong> Enhancements to Server-Side Rendering (SSR) for faster startup and better Core Web Vitals.</li>
            <li><strong><code>inject()</code> function:</strong> Allows dependency injection outside of constructors.</li>
            <li><strong><code>DestroyRef</code>:</strong> A new injectable for managing cleanup logic.</li>
            <li><strong><code>provideHttpClient()</code> &amp; <code>provideRouter()</code>:</strong> Functional APIs for configuring HTTP and routing in standalone apps.</li>
          </ul>
        `,
      "code": "// Angular 17+ Control Flow & Defer\n@Component({\n  standalone: true,\n  template: `\n    @if (isAdmin) {\n      <admin-panel />\n    }\n\n    <!-- Lazy load component when it enters the viewport -->\n    @defer (on viewport) {\n      <app-comments />\n    } @placeholder {\n      <div>Loading comments...</div>\n    }\n  ` \n})\nexport class DashboardComponent {\n  isAdmin = true;\n}",
      "language": "typescript"
    },
    {
      "id": "deprecated-features",
      "title": "Deprecated features",
      "explanation": `
          <p>As Angular evolves, some features are deprecated in favor of newer, more efficient, or more aligned approaches. Staying aware of these helps in migrating applications and adopting modern practices.</p>
          <h3>Key Deprecations</h3>
          <ul>
            <li><strong><code>NgModules</code> (optional):</strong> While not fully deprecated, standalone components, directives, and pipes make NgModules optional for many use cases.</li>
            <li><strong><code>Karma</code> and <code>Protractor</code>:</strong> The default test runners have been deprecated in favor of more modern alternatives like Jest, Web Test Runner, Cypress, or Playwright.</li>
            <li><strong><code>CanLoad</code> guard:</strong> Replaced by the more flexible <code>CanMatch</code> guard for lazy-loaded routes.</li>
            <li><strong><code>Router.url</code> property:</strong> Deprecated in favor of using <code>Router.events</code> or <code>ActivatedRoute</code> for more reactive URL access.</li>
          </ul>
        `,
      "code": "// Old: CanLoad guard\n// { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canLoad: [AdminGuard] }\n\n// New: CanMatch guard (for standalone or NgModule routes)\n// { path: 'admin', loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent), canMatch: [AdminGuard] }",
      "language": "typescript"
    },
    {
      "id": "standalone-apis",
      "title": "Standalone APIs",
      "explanation": `
          <p><strong>Standalone APIs</strong> allow you to build Angular applications without the need for NgModules. This simplifies the application structure, reduces boilerplate, and improves tree-shaking.</p>
          <h3>Key Standalone APIs</h3>
          <ul>
            <li><strong><code>standalone: true</code> flag:</strong> In <code>@Component</code>, <code>@Directive</code>, or <code>@Pipe</code> decorators.</li>
            <li><strong><code>imports</code> array:</strong> Directly in the component's metadata to declare its dependencies.</li>
            <li><strong><code>bootstrapApplication()</code>:</strong> Used in <code>main.ts</code> to bootstrap the root standalone component.</li>
            <li><strong>Functional providers:</strong> <code>provideRouter()</code>, <code>provideHttpClient()</code>, etc., for configuring services at the application root without NgModules.</li>
          </ul>
        `,
      "code": "// main.ts for a standalone app\nimport { bootstrapApplication } from '@angular/platform-browser';\nimport { AppComponent } from './app/app.component';\nimport { provideRouter } from '@angular/router';\nimport { routes } from './app/app.routes';\nimport { provideHttpClient } from '@angular/common/http';\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    provideRouter(routes),\n    provideHttpClient()\n  ]\n}).catch(err => console.error(err));",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Standalone App Bootstrap</p><div class="flex flex-col items-center gap-2"><div class="bg-indigo-600 text-white p-2 rounded text-xs">main.ts</div><div class="text-slate-300">&darr;</div><div class="bg-emerald-50 border-2 border-emerald-200 p-2 rounded text-xs">bootstrapApplication(AppComponent)</div><div class="text-slate-300">&darr;</div><div class="bg-amber-50 border-2 border-amber-200 p-2 rounded text-xs">AppComponent (standalone)</div></div></div>`
    },
    {
      "id": "inject-function",
      "title": "Inject function",
      "explanation": `
          <p>The <strong><code>inject()</code> function</strong> (introduced in Angular 14) provides a new way to perform dependency injection in Angular. It allows you to inject services and other dependencies outside of a class constructor.</p>
          <p><strong>Constraint:</strong> It must be called during an <strong>Injection Context</strong> (e.g., during class construction or in a factory function). You cannot call it inside a standard click handler or an asynchronous <code>setTimeout</code>.</p>
          <h3>Key Benefits</h3>
          <ul>
            <li><strong>Flexibility:</strong> Inject dependencies in functions and other non-class contexts.</li>
            <li><strong>Cleaner Code:</strong> Initialize properties directly, reducing constructor boilerplate.</li>
          </ul>
        `,
      "code": "import { Component, inject } from '@angular/core';\nimport { ActivatedRoute } from '@angular/router';\nimport { UserService } from './user.service'; // Assuming a UserService exists\n\n// Property Initialization (Clean approach)\n@Component({\n  standalone: true,\n  template: `<h1>User Profile</h1>`\n})\nexport class UserProfile {\n  private userService = inject(UserService);\n  private route = inject(ActivatedRoute);\n\n  // Functional Route Guard example\n  // const authGuard = () => inject(AuthService).isLoggedIn();\n}",
      "language": "typescript"
    },
    {
      "id": "destroyref",
      "title": "DestroyRef",
      "explanation": `
          <p><strong><code>DestroyRef</code></strong> (introduced in Angular 16) is a new injectable service that provides a convenient and reliable way to register cleanup logic that runs when a particular context (like a component, directive, service, or even an <code>effect()</code> function) is destroyed.</p>
          <p>This allows you to define cleanup logic <strong>where the resource is created</strong>, rather than having to jump to the <code>ngOnDestroy</code> method at the bottom of your file.</p>
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