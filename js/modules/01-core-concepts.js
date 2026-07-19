window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "core-concepts",
  "title": "Core Concepts",
  "icon": "bi bi-building",
  "questions": [
    {
      "id": "angular-22-standard-core-upgrade",
      "title": "Angular 22 standard upgrade checklist",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Renovating an old house to meet the current building code. The old wiring (NgModules, decorator inputs, <code>*ngIf</code>) still <em>works</em> and the house won't fall down &mdash; but if you're building a new room today, the inspector (your interviewer, your tech lead) expects it wired to <strong>current code</strong>: signals, standalone components, and zoneless change detection.</p>
          </div>
        </div>
        <p>Angular 22 shipped as stable on <strong>June 3, 2026</strong> (currently on patch <strong>22.0.7</strong>), so it's no longer "coming soon" &mdash; it's the baseline you should assume in interviews and new projects. Three things graduated from experimental to stable in this release, and one default flipped:</p>
        <h3>What changed in Angular 22 itself</h3>
        <ul>
          <li><strong>OnPush is now the default</strong> change detection strategy for any component that doesn't explicitly set <code>changeDetection</code>. You used to have to opt in; now you opt out.</li>
          <li><strong>Signal Forms</strong> (<code>@angular/forms/signals</code>) are stable &mdash; no more experimental warnings.</li>
          <li><strong><code>resource()</code>, <code>rxResource()</code>, and <code>httpResource()</code></strong> are stable, production-ready ways to load async data as a signal.</li>
          <li><strong>Zoneless is the default</strong> for new apps created with the CLI &mdash; Zone.js is opt-in now, not the other way around.</li>
        </ul>
        <h3>The standing "modern style" defaults</h3>
        <ul>
          <li>Bootstrap with <code>bootstrapApplication()</code> and app-level functional providers &mdash; no root <code>AppModule</code>.</li>
          <li>Standalone components with direct <code>imports</code> &mdash; NgModules are legacy-only for new code.</li>
          <li><code>signal()</code>, <code>computed()</code>, and <code>effect()</code> for local reactive state.</li>
          <li><code>input()</code>, <code>output()</code>, and signal-based queries for component APIs.</li>
          <li><code>@if</code>, <code>@for</code>, and <code>@switch</code> block syntax over <code>*ngIf</code>, <code>*ngFor</code>, <code>ngSwitch</code>.</li>
          <li><code>inject()</code> and functional providers such as <code>provideHttpClient()</code>, <code>provideRouter()</code>, and functional interceptors.</li>
        </ul>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">"Zoneless by default" applies to <strong>new</strong> apps generated after this default flipped. An existing app upgraded to Angular 22 keeps Zone.js unless you deliberately remove it &mdash; upgrading the package version does not silently make your app zoneless.</p>
          </div>
        </div>
      `,
      "code": "// main.ts — Angular 22 stable, zoneless-by-default bootstrap\nimport { bootstrapApplication } from '@angular/platform-browser';\nimport { provideHttpClient, withInterceptors } from '@angular/common/http';\nimport { provideRouter } from '@angular/router';\nimport { AppComponent } from './app/app.component';\nimport { routes } from './app/app.routes';\nimport { authInterceptor } from './app/core/auth.interceptor';\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    provideRouter(routes),\n    provideHttpClient(withInterceptors([authInterceptor]))\n    // No provideZonelessChangeDetection() call needed —\n    // CLI-generated Angular 22 apps are zoneless by default.\n    // Opt BACK into Zone.js only if a legacy dependency needs it:\n    // provideZoneChangeDetection({ eventCoalescing: true })\n  ]\n});\n\n// app.component.ts\nimport { Component, computed, signal } from '@angular/core';\nimport { RouterOutlet } from '@angular/router';\n\n@Component({\n  selector: 'app-root',\n  imports: [RouterOutlet],\n  // changeDetection: ChangeDetectionStrategy.OnPush  ← no longer needed, it's the default\n  template: `\n    <h1>{{ title() }}</h1>\n    <router-outlet />\n  `\n})\nexport class AppComponent {\n  private readonly appName = signal('CodeVerse');\n  readonly title = computed(() => `${this.appName()} learning app`);\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Angular 22 Stable — Six Pillars</p><div class=\"grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-indigo-700\">Standalone-first</p><p class=\"text-slate-500 mt-1\">no NgModules needed</p></div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-emerald-700\">Signals-first</p><p class=\"text-slate-500 mt-1\">signal / computed / effect</p></div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-amber-700\">Zoneless default</p><p class=\"text-slate-500 mt-1\">new apps skip Zone.js</p></div><div class=\"bg-rose-50 border border-rose-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-rose-700\">OnPush default</p><p class=\"text-slate-500 mt-1\">flipped in v22</p></div><div class=\"bg-purple-50 border border-purple-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-purple-700\">resource() stable</p><p class=\"text-slate-500 mt-1\">resource / rxResource / httpResource</p></div><div class=\"bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-cyan-700\">Signal Forms stable</p><p class=\"text-slate-500 mt-1\">@angular/forms/signals</p></div></div></div>"
    },
    {
      "id": "what-is-angular",
      "title": "What is Angular and its architecture?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Moving into a <strong>fully furnished apartment</strong> versus an empty lot. A UI library (React, Vue) hands you an empty lot with great tools &mdash; you still shop for and plumb in your own router, form system, and HTTP client. Angular hands you the furnished apartment: routing, forms, an HTTP client, animations, DI, and testing utilities are already installed and wired to code together.</p>
          </div>
        </div>
        <p>Angular is a <strong>TypeScript-based, open-source front-end framework</strong> developed and maintained by Google. It lets you build fast, scalable <em>Single Page Applications (SPAs)</em> &mdash; web apps that load once and update the page dynamically without full reloads.</p>
        <h3>Core building blocks</h3>
        <ul>
          <li><strong>Components</strong> &mdash; self-contained UI blocks (each has a TypeScript class + HTML template + scoped CSS)</li>
          <li><strong>Services</strong> &mdash; classes holding business logic, API calls, and shared data; injected via DI</li>
          <li><strong>Directives</strong> &mdash; add behavior to elements (<code>*ngIf</code>, <code>*ngFor</code>, custom ones)</li>
          <li><strong>Pipes</strong> &mdash; transform displayed values in templates (<code>date</code>, <code>currency</code>, custom)</li>
          <li><strong>Router</strong> &mdash; maps URLs to components without page reloads</li>
          <li><strong>Modules (NgModules)</strong> &mdash; group related pieces together (legacy, still widely used)</li>
          <li><strong>Standalone components</strong> &mdash; self-contained components that don't need NgModules (current default)</li>
        </ul>
        <h3>Angular 22 (current)</h3>
        <p>New projects use standalone components by default, <code>provideRouter()</code> instead of <code>RouterModule</code>, zoneless change detection out of the box, and Angular Signals for fine-grained reactivity. NgModules are still supported but no longer required &mdash; and no longer the style the CLI generates.</p>
      `,
      "code": "// main.ts — entry point for a modern standalone Angular app\nimport { bootstrapApplication } from '@angular/platform-browser';\nimport { provideRouter }        from '@angular/router';\nimport { provideHttpClient }    from '@angular/common/http';\nimport { AppComponent }         from './app/app.component';\nimport { routes }               from './app/app.routes';\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    provideRouter(routes),\n    provideHttpClient()\n  ]\n});\n\n// app.component.ts — root component\nimport { Component } from '@angular/core';\nimport { RouterOutlet } from '@angular/router';\nimport { NavbarComponent } from './navbar/navbar.component';\n\n@Component({\n  selector: 'app-root',\n  imports: [RouterOutlet, NavbarComponent],\n  template: `\n    <app-navbar></app-navbar>\n    <router-outlet></router-outlet>\n  `\n})\nexport class AppComponent {}\n\n// Each feature is its own standalone component:\n// ng generate component features/products",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Batteries Included — What Ships Inside Angular</p><div class=\"border-2 border-dashed border-slate-300 rounded-xl p-4\"><p class=\"text-center text-xs font-bold text-slate-500 mb-3\">Angular Framework</p><div class=\"grid grid-cols-2 md:grid-cols-4 gap-2 text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-center font-semibold text-indigo-700\">Components</div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center font-semibold text-emerald-700\">Router</div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-2 text-center font-semibold text-amber-700\">Forms</div><div class=\"bg-rose-50 border border-rose-200 rounded-lg p-2 text-center font-semibold text-rose-700\">HTTP Client</div><div class=\"bg-purple-50 border border-purple-200 rounded-lg p-2 text-center font-semibold text-purple-700\">Dependency Injection</div><div class=\"bg-cyan-50 border border-cyan-200 rounded-lg p-2 text-center font-semibold text-cyan-700\">Animations</div><div class=\"bg-slate-100 border border-slate-300 rounded-lg p-2 text-center font-semibold text-slate-600\">Testing Utils</div><div class=\"bg-slate-100 border border-slate-300 rounded-lg p-2 text-center font-semibold text-slate-600\">CLI &amp; Build</div></div></div></div>"
    },
    {
      "id": "what-are-components",
      "title": "What are components in Angular?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>LEGO brick</strong>. Each brick is self-contained &mdash; it has a shape (template), the plastic it's molded from (the class and its logic), and a color that never bleeds onto the brick next to it (scoped styles). You snap bricks together to build anything from a login form to an entire dashboard, and you can pull one brick out and swap in another without rebuilding the model.</p>
          </div>
        </div>
        <p>A <strong>component</strong> is the fundamental building block of Angular UI. Every visible piece of a page &mdash; a header, a product card, a login form, a modal &mdash; is a component.</p>
        <h3>A component has three parts</h3>
        <ul>
          <li><strong>TypeScript class</strong> &mdash; holds the component's state (data) and methods (behaviour)</li>
          <li><strong>HTML template</strong> &mdash; defines the structure using Angular's binding syntax and directives</li>
          <li><strong>CSS styles</strong> &mdash; scoped <em>only</em> to this component via View Encapsulation, so they never leak out</li>
        </ul>
        <h3>The @Component decorator</h3>
        <p>The <code>@Component</code> decorator connects the three parts and provides metadata: <code>selector</code> (the HTML tag to use), <code>template</code> or <code>templateUrl</code>, and <code>styles</code> or <code>styleUrls</code>.</p>
        <h3>Component tree</h3>
        <p>Every Angular app has one <strong>root component</strong> (<code>AppComponent</code>). All other components are children or grandchildren of it, forming a tree. Data flows down via inputs, events bubble up via outputs, and shared data travels sideways through services.</p>
      `,
      "code": "import { Component, input, output } from '@angular/core';\nimport { CurrencyPipe } from '@angular/common';\n\n// A reusable product card component\n@Component({\n  selector: 'app-product-card',\n  imports: [CurrencyPipe],\n  template: `\n    <div class=\"card\" [class.featured]=\"product().isFeatured\">\n      <img [src]=\"product().imageUrl\" [alt]=\"product().name\" />\n      <h3>{{ product().name }}</h3>\n      <p>{{ product().price | currency }}</p>\n      <button (click)=\"onAddToCart()\"\n              [disabled]=\"product().stock === 0\">\n        {{ product().stock > 0 ? 'Add to Cart' : 'Out of Stock' }}\n      </button>\n    </div>\n  `,\n  styleUrl: './product-card.component.css'  // scoped — only affects this component\n})\nexport class ProductCardComponent {\n  product     = input.required<Product>();       // receives data from parent\n  addedToCart = output<Product>();                // sends event to parent\n\n  onAddToCart(): void {\n    this.addedToCart.emit(this.product());\n  }\n}\n\n// Parent uses it like this:\n// @for (p of products(); track p.id) {\n//   <app-product-card [product]=\"p\" (addedToCart)=\"onAddedToCart($event)\" />\n// }",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Anatomy of a Component</p><div class=\"grid grid-cols-1 md:grid-cols-3 gap-3 max-w-xl mx-auto text-xs mb-6\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-indigo-700\">TS Class</p><p class=\"text-slate-500 mt-1\">state + methods</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-emerald-700\">HTML Template</p><p class=\"text-slate-500 mt-1\">structure the user sees</p></div><div class=\"bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-amber-700\">Scoped CSS</p><p class=\"text-slate-500 mt-1\">never leaks out</p></div></div><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-3\">Component Tree</p><div class=\"flex flex-col items-center gap-2 text-xs font-mono\"><div class=\"bg-slate-800 text-white rounded-lg px-3 py-1.5\">AppComponent</div><div class=\"w-px h-3 bg-slate-300\"></div><div class=\"flex gap-6\"><div class=\"bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5\">NavbarComponent</div><div class=\"bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5\">ProductListComponent</div></div><div class=\"w-px h-3 bg-slate-300\"></div><div class=\"bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5\">ProductCardComponent</div></div></div>"
    },
    {
      "id": "what-is-ngmodule",
      "title": "What is a module (NgModule)?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>filing cabinet drawer</strong>. Everything about the "Users" feature &mdash; the folders (components), the label maker (directives), the stamp (pipes) &mdash; lives in one drawer. The drawer's front label (<code>exports</code>) tells other drawers what they're allowed to borrow. Standalone components remove the cabinet entirely: every folder just carries its own label of what it needs.</p>
          </div>
        </div>
        <p>An <strong>NgModule</strong> is a container that groups related Angular pieces &mdash; components, directives, pipes, and services &mdash; into a cohesive, reusable block.</p>
        <h3>Why NgModules exist</h3>
        <p>Before standalone components (pre-Angular 14), every component had to be declared in a module before Angular knew about it. Modules controlled what was visible where.</p>
        <h3>The five key properties</h3>
        <ul>
          <li><strong>declarations</strong> &mdash; components, directives, and pipes that <em>belong to</em> this module</li>
          <li><strong>imports</strong> &mdash; other modules whose exported pieces this module needs</li>
          <li><strong>exports</strong> &mdash; what this module makes available to other modules that import it</li>
          <li><strong>providers</strong> &mdash; services to register with the DI system at module scope</li>
          <li><strong>bootstrap</strong> &mdash; (root module only) the component to render first</li>
        </ul>
        <h3>Angular 22 reality</h3>
        <p>Standalone components remove the need for NgModules in new code. Modern apps use <code>imports: []</code> directly on each component and register app services through functional providers. NgModules remain fully supported for existing apps and libraries, but the CLI has not scaffolded them by default since Angular 17 &mdash; expect to read legacy NgModule code, but write standalone.</p>
      `,
      "code": "// ─── Legacy NgModule style (still common in existing codebases) ─\nimport { NgModule } from '@angular/core';\nimport { CommonModule } from '@angular/common';\nimport { RouterModule } from '@angular/router';\n\nimport { UserListComponent }   from './user-list/user-list.component';\nimport { UserDetailComponent } from './user-detail/user-detail.component';\nimport { UserCardComponent }   from './user-card/user-card.component';\nimport { UserRoutingModule }   from './user-routing.module';\n\n@NgModule({\n  declarations: [\n    UserListComponent,    // owns these — they can only be declared in ONE module\n    UserDetailComponent,\n    UserCardComponent\n  ],\n  imports: [\n    CommonModule,         // provides *ngIf, *ngFor, async pipe, etc.\n    RouterModule,\n    UserRoutingModule\n  ],\n  exports: [\n    UserCardComponent     // other modules that import UserModule can use <app-user-card>\n  ]\n})\nexport class UserModule {}\n\n// ─── Angular 22 standalone style (default for new code) ─────\n// No NgModule needed — the component declares its own dependencies:\n@Component({\n  selector: 'app-user-list',\n  imports: [CommonModule, RouterModule, UserCardComponent],  // ← direct imports\n  template: `...`\n})\nexport class UserListComponent {}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">NgModule Drawer vs Standalone</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\"><div class=\"bg-slate-50 border-2 border-slate-300 rounded-xl p-3\"><p class=\"font-bold text-slate-700 text-center text-xs mb-2\">UserModule (legacy)</p><div class=\"space-y-1.5 text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded px-2 py-1\">declarations: UserList, UserCard</div><div class=\"bg-emerald-50 border border-emerald-200 rounded px-2 py-1\">imports: CommonModule, RouterModule</div><div class=\"bg-amber-50 border border-amber-200 rounded px-2 py-1\">exports: UserCard</div></div></div><div class=\"bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-3\"><p class=\"font-bold text-slate-700 text-center text-xs mb-2\">Standalone (Angular 22 default)</p><div class=\"space-y-1.5 text-xs\"><div class=\"bg-purple-50 border border-purple-200 rounded px-2 py-1\">@Component imports: [...]</div><div class=\"bg-purple-50 border border-purple-200 rounded px-2 py-1\">no wrapping module file</div><div class=\"bg-purple-50 border border-purple-200 rounded px-2 py-1\">each component is self-describing</div></div></div></div></div>"
    },
    {
      "id": "what-are-decorators",
      "title": "What are decorators in Angular?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>name badge at a conference</strong>. A plain class is just a person in the crowd; Angular doesn't know what to do with it. Pin on a <code>@Component</code> badge and everyone treats it as "has a template, put it on screen." Pin on <code>@Injectable</code> and everyone treats it as "you can hand this to anyone who asks." The badge doesn't change the person &mdash; it changes how the room (Angular) treats them.</p>
          </div>
        </div>
        <p>A <strong>decorator</strong> is a TypeScript syntax prefixed with <code>@</code> that attaches <em>metadata</em> to a class, method, property, or parameter. Angular reads this metadata to understand the role of each class.</p>
        <h3>How they work technically</h3>
        <p>Decorators are functions that receive the class (or property/method) as an argument, store metadata via Angular's <code>Reflect</code> API, and may return a modified version. The Angular compiler reads this metadata at build time to generate optimised JavaScript.</p>
        <h3>Class decorators</h3>
        <ul>
          <li><code>@Component</code> &mdash; marks a class as a component (has a template)</li>
          <li><code>@Injectable</code> &mdash; marks a class as injectable via DI</li>
          <li><code>@NgModule</code> &mdash; marks a class as a module (legacy architecture)</li>
          <li><code>@Directive</code> &mdash; marks a class as a custom directive</li>
          <li><code>@Pipe</code> &mdash; marks a class as a pipe</li>
        </ul>
        <h3>Property decorators</h3>
        <ul>
          <li><code>@Input()</code> / <code>@Output()</code> &mdash; the decorator-based predecessor of <code>input()</code> / <code>output()</code></li>
          <li><code>@ViewChild()</code> / <code>@ViewChildren()</code> &mdash; access template elements/components</li>
          <li><code>@HostListener()</code> &mdash; listen to events on the host DOM element</li>
          <li><code>@HostBinding()</code> &mdash; bind a host element property</li>
        </ul>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text"><code>@Input()</code>/<code>@Output()</code> still work fully in Angular 22 &mdash; they are not deprecated. But new code should prefer signal-based <code>input()</code>/<code>output()</code> since they compose with <code>computed()</code> and zoneless change detection without extra wiring.</p>
          </div>
        </div>
      `,
      "code": "import { Component, Directive, Injectable, Pipe, PipeTransform,\n         input, output, HostListener, HostBinding } from '@angular/core';\n\n// ─── Class decorators ──────────────────────────\nexport class DataService {\n  getData() { return []; }\n}\n\n// The class above becomes an injectable service ONLY once decorated:\n@Injectable({ providedIn: 'root' })\nexport class DataServiceReal {\n  getData() { return []; }\n}\n\n@Directive({ selector: '[appTooltip]' })\nexport class TooltipDirective {}\n\n@Pipe({ name: 'truncate' })\nexport class TruncatePipe implements PipeTransform {\n  transform(value: string, limit = 50) {\n    return value.length > limit ? value.slice(0, limit) + '...' : value;\n  }\n}\n\n// ─── Property-level metadata, Angular 22 style ──────────\n@Component({ selector: 'app-user-card', template: `<p>{{ name() }}</p>` })\nexport class UserCardComponent {\n  name     = input('');                     // receives data from parent\n  selected = output<string>();              // emits event to parent\n\n  // HostBinding — adds/removes a CSS class on the host element\n  @HostBinding('class.highlighted') isHighlighted = false;\n\n  // HostListener — responds to an event on the host element\n  @HostListener('click')\n  onClick() {\n    this.isHighlighted = !this.isHighlighted;\n    this.selected.emit(this.name());\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Decorator = Badge → Angular's Reaction</p><div class=\"space-y-2 max-w-md mx-auto text-xs\"><div class=\"flex items-center gap-3\"><span class=\"bg-indigo-100 text-indigo-700 font-mono font-bold rounded px-2 py-1 w-32 text-center\">@Component</span><span class=\"text-slate-300\">&rarr;</span><span class=\"text-slate-600\">\"I have a template, render me\"</span></div><div class=\"flex items-center gap-3\"><span class=\"bg-emerald-100 text-emerald-700 font-mono font-bold rounded px-2 py-1 w-32 text-center\">@Injectable</span><span class=\"text-slate-300\">&rarr;</span><span class=\"text-slate-600\">\"Anyone can ask the injector for me\"</span></div><div class=\"flex items-center gap-3\"><span class=\"bg-amber-100 text-amber-700 font-mono font-bold rounded px-2 py-1 w-32 text-center\">@Directive</span><span class=\"text-slate-300\">&rarr;</span><span class=\"text-slate-600\">\"I add behavior to an element\"</span></div><div class=\"flex items-center gap-3\"><span class=\"bg-rose-100 text-rose-700 font-mono font-bold rounded px-2 py-1 w-32 text-center\">@Pipe</span><span class=\"text-slate-300\">&rarr;</span><span class=\"text-slate-600\">\"I transform a displayed value\"</span></div></div></div>"
    },
    {
      "id": "role-of-app-module",
      "title": "What is the role of app.module.ts?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A building's <strong>utility control room</strong> before opening day &mdash; the room where electricity (services), plumbing (HTTP), and security badges (interceptors) all get connected before anyone is allowed inside. In legacy Angular, <code>app.module.ts</code> was that room. In Angular 22, there is no separate control room; <code>main.ts</code> wires everything directly at the front door.</p>
          </div>
        </div>
        <p><code>app.module.ts</code> defines the <strong>Root Module</strong> in legacy (NgModule-based) Angular apps &mdash; the entry point that holds the entire app together.</p>
        <h3>What it does (legacy apps)</h3>
        <ul>
          <li><strong>Bootstraps the root component</strong> &mdash; tells Angular to render <code>AppComponent</code> inside <code>&lt;app-root&gt;</code> in <code>index.html</code></li>
          <li><strong>Declares root-level components</strong> &mdash; any component not in a feature module lives here</li>
          <li><strong>Imports platform modules</strong> &mdash; <code>BrowserModule</code>, <code>HttpClientModule</code>, <code>FormsModule</code>, etc.</li>
          <li><strong>Registers app-wide services</strong> &mdash; interceptors, guards, and singletons</li>
          <li><strong>Imports eager feature modules</strong> &mdash; modules that should load at startup</li>
        </ul>
        <h3>Angular 22 equivalent</h3>
        <p>Standalone apps have no <code>app.module.ts</code> at all. Instead, <code>bootstrapApplication(AppComponent, { providers: [...] })</code> in <code>main.ts</code> replaces it, and application-wide setup moves to functional providers such as <code>provideRouter()</code> and <code>provideHttpClient()</code> &mdash; a flat list of providers instead of a nested tree of modules.</p>
      `,
      "code": "// ─── Legacy: app.module.ts ─────────────────────\nimport { NgModule }           from '@angular/core';\nimport { BrowserModule }      from '@angular/platform-browser';\nimport { HttpClientModule }   from '@angular/common/http';\nimport { FormsModule, ReactiveFormsModule } from '@angular/forms';\nimport { HTTP_INTERCEPTORS }  from '@angular/common/http';\n\nimport { AppRoutingModule }   from './app-routing.module';\nimport { AppComponent }       from './app.component';\nimport { NavbarComponent }    from './shared/navbar/navbar.component';\nimport { AuthInterceptor }    from './core/auth.interceptor';\nimport { UserModule }         from './user/user.module';\n\n@NgModule({\n  declarations: [AppComponent, NavbarComponent],\n  imports: [\n    BrowserModule,       // ← ONLY here, never in feature modules\n    HttpClientModule,\n    FormsModule,\n    ReactiveFormsModule,\n    AppRoutingModule,\n    UserModule\n  ],\n  providers: [\n    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }\n  ],\n  bootstrap: [AppComponent]\n})\nexport class AppModule {}\n\n// ─── Angular 22: main.ts (replaces app.module.ts entirely) ──\nimport { bootstrapApplication } from '@angular/platform-browser';\nimport { provideRouter } from '@angular/router';\nimport { provideHttpClient, withInterceptors } from '@angular/common/http';\nimport { AppComponent } from './app/app.component';\nimport { routes } from './app/app.routes';\nimport { authInterceptor } from './app/core/auth.interceptor';\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    provideRouter(routes),\n    provideHttpClient(withInterceptors([authInterceptor]))\n  ]\n});",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Legacy Control Room vs Angular 22 Front Door</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-slate-50 border-2 border-slate-300 rounded-xl p-3\"><p class=\"font-bold text-slate-700 text-center mb-2\">app.module.ts</p><div class=\"flex flex-col items-center gap-1\"><div class=\"bg-indigo-50 border border-indigo-200 rounded px-2 py-1 w-full text-center\">BrowserModule</div><div class=\"bg-indigo-50 border border-indigo-200 rounded px-2 py-1 w-full text-center\">HttpClientModule</div><div class=\"bg-indigo-50 border border-indigo-200 rounded px-2 py-1 w-full text-center\">AppRoutingModule</div><div class=\"text-slate-300\">&darr;</div><div class=\"bg-slate-800 text-white rounded px-2 py-1 w-full text-center\">bootstrap: [AppComponent]</div></div></div><div class=\"bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-3\"><p class=\"font-bold text-slate-700 text-center mb-2\">main.ts</p><div class=\"flex flex-col items-center gap-1\"><div class=\"bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center\">provideRouter(routes)</div><div class=\"bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center\">provideHttpClient()</div><div class=\"text-slate-300\">&darr;</div><div class=\"bg-slate-800 text-white rounded px-2 py-1 w-full text-center\">bootstrapApplication(AppComponent)</div></div></div></div></div>"
    },
    {
      "id": "what-is-bootstrapping",
      "title": "What is bootstrapping in Angular?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>theatre before curtain-up</strong>. <code>index.html</code> is the empty stage with a single marked spot (<code>&lt;app-root&gt;</code>). <code>main.ts</code> is the stage manager who reads the script (<code>bootstrapApplication</code>), finds the actor whose costume matches the marked spot's label (the component whose <code>selector</code> is <code>app-root</code>), and walks them into position. Only then does the curtain rise and the audience sees anything.</p>
          </div>
        </div>
        <p><strong>Bootstrapping</strong> is the startup sequence Angular follows to launch your application &mdash; from serving <code>index.html</code> to rendering the first visible screen in the browser.</p>
        <h3>The bootstrap flow (Angular 22 standalone)</h3>
        <ol style="list-style:decimal;padding-left:1.25rem;color:#475569;line-height:1.8;">
          <li><strong>Browser loads index.html</strong> &mdash; it contains <code>&lt;app-root&gt;&lt;/app-root&gt;</code>, initially empty</li>
          <li><strong>main.ts executes</strong> &mdash; Angular's true entry point, calling <code>bootstrapApplication(AppComponent, providers)</code></li>
          <li><strong>Providers are registered</strong> &mdash; router, HTTP client, interceptors, and any app-wide services become available to <code>inject()</code></li>
          <li><strong>Selector is matched</strong> &mdash; Angular finds <code>&lt;app-root&gt;</code> in index.html and matches it to <code>AppComponent</code>'s <code>selector: 'app-root'</code></li>
          <li><strong>Template is compiled and rendered</strong> &mdash; Angular replaces the empty tag with the compiled component HTML</li>
          <li><strong>Change detection engages</strong> &mdash; zoneless by default in Angular 22, driven by signal reads, events, and explicit notifications</li>
        </ol>
        <h3>JIT vs AOT</h3>
        <p><strong>JIT</strong> (development): templates are compiled in the browser at startup &mdash; slower initial load, faster rebuild cycles during <code>ng serve</code>. <strong>AOT</strong> (production, default for <code>ng build</code>): templates are pre-compiled at build time &mdash; faster startup, smaller bundle, catches template errors early.</p>
      `,
      "code": "// ─── index.html — the HTML shell ─────────────────\n// <!DOCTYPE html>\n// <html>\n//   <body>\n//     <app-root></app-root>  ← placeholder; Angular fills this\n//   </body>\n// </html>\n\n// ─── Angular 22: standalone bootstrap ────────────\n// main.ts\nimport { bootstrapApplication } from '@angular/platform-browser';\nimport { provideRouter }        from '@angular/router';\nimport { provideHttpClient }    from '@angular/common/http';\nimport { AppComponent }         from './app/app.component';\nimport { routes }               from './app/app.routes';\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    provideRouter(routes),\n    provideHttpClient()\n  ]\n}).catch(err => console.error(err));\n\n// app.component.ts — selector must match <app-root> in index.html\n@Component({\n  selector: 'app-root',     // ← matched against index.html\n  imports: [RouterOutlet],\n  template: `<router-outlet></router-outlet>`\n})\nexport class AppComponent {}\n\n// ─── Legacy: NgModule bootstrap (still valid, older apps) ──\n// main.ts\n// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';\n// import { AppModule } from './app/app.module';\n// platformBrowserDynamic()\n//   .bootstrapModule(AppModule)\n//   .catch(err => console.error(err));",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Bootstrap Sequence</p><div class=\"flex flex-wrap items-center justify-center gap-2 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700\">1. Load index.html</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700\">2. Run main.ts</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700\">3. Register providers</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-rose-50 border-2 border-rose-200 rounded-lg px-3 py-2 text-center font-semibold text-rose-700\">4. Match &lt;app-root&gt;</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-purple-50 border-2 border-purple-200 rounded-lg px-3 py-2 text-center font-semibold text-purple-700\">5. Render template</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-cyan-50 border-2 border-cyan-200 rounded-lg px-3 py-2 text-center font-semibold text-cyan-700\">6. Change detection live</div></div><div class=\"grid grid-cols-2 gap-3 max-w-sm mx-auto mt-5 text-xs\"><div class=\"bg-slate-50 border border-slate-200 rounded-lg p-2 text-center\"><p class=\"font-bold text-slate-700\">JIT (dev)</p><p class=\"text-slate-500 mt-1\">compiled in-browser</p></div><div class=\"bg-slate-800 text-white rounded-lg p-2 text-center\"><p class=\"font-bold\">AOT (prod default)</p><p class=\"text-slate-300 mt-1\">compiled at build time</p></div></div></div>"
    }
  ]
});
