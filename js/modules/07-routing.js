window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: "routing",
  title: "Routing",
  icon: "bi bi-signpost-split",
  questions: [
    {
      id: "angular-22-standard-routing-upgrade",
      title: "Angular 22 standard for routing",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">An airport that only prints a boarding pass and opens a gate once security (a guard function) has cleared you, and only powers on the jet bridge (downloads the lazy chunk) for gates that are actually in use. Nothing is loaded, powered, or unlocked speculatively — everything happens on demand, driven by a flat list of routes rather than a maze of terminal-specific modules.</p>
          </div>
        </div>
        <p>Angular 22-ready routing is <strong>standalone, lazy, functional, and provider-driven</strong>. New apps configure routing with <code>provideRouter(routes)</code>, use standalone route components, lazy load with <code>loadComponent</code> or route files, and write guards/resolvers as functions using <code>inject()</code>.</p>
        <h3>Modern routing checklist</h3>
        <ul>
          <li>Register routes with <code>provideRouter(routes)</code> in <code>bootstrapApplication()</code>.</li>
          <li>Use <code>loadComponent()</code> for single-screen lazy routes.</li>
          <li>Use <code>loadChildren()</code> for feature route groups.</li>
          <li>Use functional guards such as <code>CanMatchFn</code> and <code>CanActivateFn</code>.</li>
          <li>Use route-level <code>providers</code> for feature-scoped services.</li>
          <li>Prefer typed route data and clear fallback routes.</li>
        </ul>
      `,
      code: "import { inject } from '@angular/core';\nimport { CanMatchFn, Routes, Router } from '@angular/router';\n\nexport const authGuard: CanMatchFn = () => {\n  const auth = inject(AuthService);\n  const router = inject(Router);\n  return auth.isLoggedIn() || router.createUrlTree(['/login']);\n};\n\nexport const routes: Routes = [\n  {\n    path: '',\n    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)\n  },\n  {\n    path: 'admin',\n    canMatch: [authGuard],\n    providers: [AdminState],\n    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)\n  },\n  {\n    path: '**',\n    loadComponent: () => import('./not-found.component').then(m => m.NotFoundComponent)\n  }\n];",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Angular 22 Routing Building Blocks</p><div class=\"grid grid-cols-2 md:grid-cols-3 gap-2 text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-center font-semibold text-indigo-700\">provideRouter()</div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center font-semibold text-emerald-700\">loadComponent()</div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-2 text-center font-semibold text-amber-700\">loadChildren()</div><div class=\"bg-rose-50 border border-rose-200 rounded-lg p-2 text-center font-semibold text-rose-700\">CanMatchFn / CanActivateFn</div><div class=\"bg-purple-50 border border-purple-200 rounded-lg p-2 text-center font-semibold text-purple-700\">route-level providers</div><div class=\"bg-cyan-50 border border-cyan-200 rounded-lg p-2 text-center font-semibold text-cyan-700\">typed route data</div></div></div>"
    },

    {
      id: "what-is-angular-router",
      title: "What is Angular Router?",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A hotel concierge who swaps out what's showing on a single lobby display screen instead of demolishing and rebuilding the lobby every time a guest asks for different information. The building (the page) never reloads — only the content on that one screen (the <code>router-outlet</code>) changes to match what the guest asked for (the URL).</p>
          </div>
        </div>
        <p><strong>Angular Router</strong> is a built-in library that handles navigation inside a Single Page Application (SPA). It changes what is displayed on screen by mapping a URL to a component — without ever doing a full browser page reload.</p>
        <h3>How it works</h3>
        <p>You define a list of <strong>routes</strong>, each being a mapping: "when the URL is <code>/products</code>, render <code>ProductsComponent</code>". The router watches the browser URL and renders the matching component inside a <code>&lt;router-outlet&gt;</code> placeholder in your template.</p>
        <h3>What it supports</h3>
        <ul>
          <li>Static and dynamic (parameterised) URLs</li>
          <li>Nested / child routes for layout-based navigation</li>
          <li>Lazy loading — only download a component's code when the user navigates to it</li>
          <li>Route guards — block access, redirect, or preload data before rendering</li>
          <li>Query parameters and fragments</li>
        </ul>
      `,
      code: "import { Routes } from '@angular/router';\nimport { LandingComponent } from './landing/landing.component';\nimport { LoginComponent }   from './login/login.component';\nimport { DashboardComponent } from './dashboard/dashboard.component';\nimport { authGuard } from './guards/auth.guard';\n\nexport const routes: Routes = [\n  // Public pages\n  { path: '',      component: LandingComponent },\n  { path: 'login', component: LoginComponent },\n\n  // Protected page — authGuard redirects to /login if not authenticated\n  {\n    path: 'dashboard',\n    component: DashboardComponent,\n    canActivate: [authGuard]\n  },\n\n  // Catch-all: show 404 for any unknown URL\n  { path: '**', redirectTo: '/not-found' }\n];\n\n// main.ts\n// bootstrapApplication(AppComponent, { providers: [provideRouter(routes)] });",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">URL &rarr; Route &rarr; Component</p><div class=\"flex flex-wrap items-center justify-center gap-2 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 font-mono font-semibold text-indigo-700\">/dashboard</div><span class=\"text-slate-300\">matches &rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 font-semibold text-emerald-700\">route config</div><span class=\"text-slate-300\">renders into &rarr;</span><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 font-semibold text-amber-700\">&lt;router-outlet&gt;</div></div></div>"
    },

    {
      id: "how-to-configure-routes",
      title: "How to configure routes (Angular 22)",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text"><code>component</code> is stocking every item in the store's front window before opening day, whether or not anyone will buy it today. <code>loadComponent</code> is a just-in-time supplier: the item only gets shipped to the shelf the moment a customer actually asks for it — the storefront (initial bundle) stays light and fast to walk into.</p>
          </div>
        </div>
        <p>Modern Angular uses <strong>standalone components</strong> and the <code>provideRouter()</code> function instead of <code>RouterModule.forRoot()</code>. This makes the setup lighter and more explicit.</p>
        <h3>Two files to know</h3>
        <ul>
          <li><code>app.routes.ts</code> — where you define all routes</li>
          <li><code>main.ts</code> — where you bootstrap the app and register the router</li>
        </ul>
        <h3>loadComponent vs component</h3>
        <p>Using <code>loadComponent</code> (lazy) instead of <code>component</code> (eager) means the JavaScript for that component is only downloaded when the user actually navigates to it — making the initial bundle smaller and the app faster.</p>
      `,
      code: "// app.routes.ts\nimport { Routes } from '@angular/router';\n\nexport const routes: Routes = [\n  // Eagerly loaded — always in the initial bundle\n  { path: '', redirectTo: 'home', pathMatch: 'full' },\n\n  // Lazily loaded — JS downloaded only when user visits /home\n  {\n    path: 'home',\n    loadComponent: () =>\n      import('./home/home.component').then(m => m.HomeComponent)\n  },\n  {\n    path: 'products',\n    loadComponent: () =>\n      import('./products/products.component').then(m => m.ProductsComponent)\n  },\n  {\n    path: 'products/:id',\n    loadComponent: () =>\n      import('./product-detail/product-detail.component').then(m => m.ProductDetailComponent)\n  }\n];\n\n// main.ts\nimport { bootstrapApplication } from '@angular/platform-browser';\nimport { provideRouter } from '@angular/router';\nimport { AppComponent } from './app/app.component';\nimport { routes } from './app/app.routes';\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    provideRouter(routes)\n    // Optional extras:\n    // withPreloading(PreloadAllModules),\n    // withDebugTracing()  ← logs every navigation event, useful in dev\n  ]\n});",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Eager vs Lazy Route</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-slate-50 border-2 border-slate-300 rounded-xl p-3\"><p class=\"font-bold text-slate-700 text-center mb-2\">component: HomeComponent</p><p class=\"text-slate-600 text-center\">in the initial bundle, downloaded immediately</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">loadComponent: () =&gt; import(...)</p><p class=\"text-slate-600 text-center\">separate chunk, downloaded on first visit</p></div></div></div>"
    },

    {
      id: "what-are-route-parameters",
      title: "What are route parameters?",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A hotel room-number template on a keycard machine: <code>room/:number</code> is one machine that produces a working key for room 101, 204, or 350 without needing a separate machine per room. <code>:orderId</code> in a route is the same idea — one route definition, infinite specific pages.</p>
          </div>
        </div>
        <p><strong>Route parameters</strong> are variable segments in a URL path, prefixed with <code>:</code>. They let you reuse one route definition for multiple items — for example, showing any product's detail page with a single route.</p>
        <h3>How to read them</h3>
        <p>Inject <code>ActivatedRoute</code> into your component. The <code>paramMap</code> is an Observable, so using <code>switchMap</code> to combine it with an API call means your component automatically reloads if the parameter changes (e.g., user navigates from product 1 to product 2) <em>without</em> the component being destroyed and recreated.</p>
        <h3>snapshot vs observable</h3>
        <ul>
          <li><code>this.route.snapshot.paramMap.get('id')</code> — reads the parameter once at load time. Simple, but won't update if the route changes while the component is active.</li>
          <li><code>this.route.paramMap.pipe(switchMap(...))</code> — reactive; updates automatically when the URL changes.</li>
        </ul>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Reading the parameter with <code>snapshot.paramMap.get('id')</code> in <code>ngOnInit()</code> and stopping there is a classic bug: if a user navigates from <code>/orders/1</code> directly to <code>/orders/2</code> via an in-page link, Angular reuses the same component instance — <code>ngOnInit()</code> never runs again, and the page silently keeps showing order 1's data.</p>
          </div>
        </div>
      `,
      code: "// 1. Define the route with a :orderId parameter\n// { path: 'orders/:orderId', loadComponent: () => import('./order-detail.component').then(m => m.OrderDetailComponent) }\n\n// 2. Component — reads the parameter reactively\nimport { Component } from '@angular/core';\nimport { ActivatedRoute } from '@angular/router';\nimport { switchMap } from 'rxjs/operators';\nimport { toSignal } from '@angular/core/rxjs-interop';\nimport { inject } from '@angular/core';\nimport { ApiService } from './api.service';\n\n@Component({\n  selector: 'app-order-detail',\n  template: `\n    @if (order(); as order) {\n      <h2>Order #{{ order.id }}</h2>\n      <p>Status: {{ order.status }}</p>\n    }\n  `\n})\nexport class OrderDetailComponent {\n  private route = inject(ActivatedRoute);\n  private api = inject(ApiService);\n\n  // switchMap cancels the previous API call if the param changes fast;\n  // toSignal exposes the resulting stream as a signal for the template.\n  order = toSignal(\n    this.route.paramMap.pipe(\n      switchMap(params => this.api.getOrder(params.get('orderId')!))\n    )\n  );\n}\n\n// Navigate programmatically:\n// this.router.navigate(['/orders', order.id]);\n// Or in template:\n// <a [routerLink]=\"['/orders', order.id]\">View Order</a>",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">One Route, Many URLs</p><div class=\"flex flex-col items-center gap-2 text-xs font-mono\"><div class=\"bg-slate-800 text-white rounded-lg px-3 py-1.5\">path: 'orders/:orderId'</div><div class=\"flex gap-3 mt-2\"><div class=\"bg-indigo-50 border border-indigo-200 rounded px-2 py-1 text-indigo-700\">/orders/101</div><div class=\"bg-emerald-50 border border-emerald-200 rounded px-2 py-1 text-emerald-700\">/orders/204</div><div class=\"bg-amber-50 border border-amber-200 rounded px-2 py-1 text-amber-700\">/orders/350</div></div></div></div>"
    },

    {
      id: "what-are-query-parameters",
      title: "What are query parameters?",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A restaurant table order slip. The table number (route parameter) determines which physical table you're at — that's fixed for the visit. The list of modifications you scribble on the slip (no onions, extra spice, well done) are query parameters — optional, changeable mid-meal, and don't change which table you're sitting at.</p>
          </div>
        </div>
        <p><strong>Query parameters</strong> appear after the <code>?</code> in a URL, e.g. <code>/products?search=laptop&page=2&sort=price</code>. Unlike route parameters, they are optional and do not change the route — making them ideal for search filters, sorting, and pagination.</p>
        <h3>queryParamsHandling</h3>
        <p>When navigating, you often want to <em>add</em> one filter without losing the others already in the URL. That's what <code>queryParamsHandling: 'merge'</code> does — it merges the new params into the existing ones instead of replacing them all.</p>
        <h3>Reading query params reactively</h3>
        <p>Subscribe to <code>route.queryParamMap</code> so the component automatically reacts when the user changes a filter without navigating away from the page.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Forgetting <code>queryParamsHandling: 'merge'</code> when updating just one filter (say, page number) silently wipes out every other query param the user had set (search term, sort order) — the URL jumps to only <code>?page=2</code> instead of keeping <code>search</code> and <code>sort</code> intact.</p>
          </div>
        </div>
      `,
      code: "import { Component, inject } from '@angular/core';\nimport { Router, ActivatedRoute } from '@angular/router';\n\n@Component({\n  selector: 'app-products',\n  templateUrl: './products.component.html'\n})\nexport class ProductsComponent {\n  private router = inject(Router);\n  private route = inject(ActivatedRoute);\n  products: any[] = [];\n\n  constructor() {\n    // React to URL changes (back/forward button, links, etc.)\n    this.route.queryParamMap.subscribe(params => {\n      const search = params.get('search') ?? '';\n      const page   = Number(params.get('page') ?? 1);\n      const sort   = params.get('sort') ?? 'name';\n      this.loadProducts(search, page, sort);\n    });\n  }\n\n  // Called when user types in the search box\n  onSearchChange(term: string): void {\n    this.router.navigate([], {\n      relativeTo: this.route,\n      queryParams: { search: term, page: 1 },  // reset to page 1 on new search\n      queryParamsHandling: 'merge'              // keep other params (sort, etc.)\n    });\n  }\n\n  onPageChange(page: number): void {\n    this.router.navigate([], {\n      relativeTo: this.route,\n      queryParams: { page },\n      queryParamsHandling: 'merge'\n    });\n  }\n\n  loadProducts(search: string, page: number, sort: string) {\n    console.log('Loading:', { search, page, sort });\n  }\n}",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Route Param vs Query Param</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3\"><p class=\"font-bold text-indigo-700 text-center mb-2\">/orders/:id</p><p class=\"text-slate-600 text-center\">defines WHICH route/resource</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">?search=laptop&amp;page=2</p><p class=\"text-slate-600 text-center\">optional modifiers on the SAME route</p></div></div></div>"
    },

    {
      id: "what-is-child-routing",
      title: "What is child routing?",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A museum with one main entrance and a fixed floor plan (the parent layout: sidebar, header) — only the artwork inside a specific gallery room changes as you walk from room to room. You never re-enter through the front doors or rebuild the coat check between rooms; the frame stays, only the content inside the frame's own inner opening changes.</p>
          </div>
        </div>
        <p><strong>Child routes</strong> are routes nested inside another route. They are used to build layout-based navigation — for example a dashboard with a persistent sidebar and a changing main area, or an admin panel where all sub-pages share the same header and menu.</p>
        <h3>How it works</h3>
        <p>The parent route's component template has its own <code>&lt;router-outlet&gt;</code>. When a child route is activated, its component is rendered inside <em>that</em> outlet — not the root outlet. The parent layout stays on screen while only the inner area changes.</p>
        <h3>Real-world example</h3>
        <p>An admin panel where <code>/admin</code> shows the layout (sidebar + header), and <code>/admin/users</code>, <code>/admin/reports</code>, etc. render different content inside it.</p>
      `,
      code: "// app.routes.ts\nexport const routes: Routes = [\n  {\n    path: 'admin',\n    component: AdminLayoutComponent,   // Persistent shell with sidebar & header\n    canActivate: [adminGuard],\n    children: [\n      { path: '',        redirectTo: 'overview', pathMatch: 'full' },\n      { path: 'overview', component: OverviewComponent },\n      { path: 'users',    component: UsersComponent },\n      { path: 'reports',  component: ReportsComponent },\n      { path: 'settings', component: SettingsComponent }\n    ]\n  }\n];\n\n// admin-layout.component.html — note the INNER <router-outlet>\n/*\n  <div class=\"admin-shell\">\n    <app-sidebar></app-sidebar>\n\n    <main class=\"admin-content\">\n      <app-admin-header></app-admin-header>\n\n      <!-- Child components render here, sidebar/header stay put -->\n      <router-outlet></router-outlet>\n    </main>\n  </div>\n*/\n\n// Navigation example:\n// <a routerLink=\"overview\" routerLinkActive=\"active\">Overview</a>\n// <a routerLink=\"users\"    routerLinkActive=\"active\">Users</a>\n// These are relative links — they resolve to /admin/overview, /admin/users, etc.",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Nested Outlets</p><div class=\"border-2 border-dashed border-slate-300 rounded-xl p-3\"><p class=\"text-center text-xs font-bold text-slate-500 mb-2\">AdminLayoutComponent (sidebar + header stay put)</p><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg p-3 text-center text-xs font-semibold text-indigo-700\">inner &lt;router-outlet&gt;</div><div class=\"flex gap-2 justify-center mt-2 text-xs\"><div class=\"bg-emerald-50 border border-emerald-200 rounded px-2 py-1\">/admin/overview</div><div class=\"bg-amber-50 border border-amber-200 rounded px-2 py-1\">/admin/users</div><div class=\"bg-rose-50 border border-rose-200 rounded px-2 py-1\">/admin/reports</div></div></div></div>"
    },

    {
      id: "what-is-lazy-loading",
      title: "What is lazy loading?",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Packing for a trip by only bringing what you need for day one, with the rest shipped to your hotel to arrive exactly when you need it. Everyone's suitcase (initial bundle) is lighter and clears the airport (first paint) faster, even though the total amount of stuff you'll eventually use is the same.</p>
          </div>
        </div>
        <p><strong>Lazy loading</strong> means the JavaScript code for a component (or a group of related components) is <em>not included</em> in the initial bundle. Instead, it is downloaded on demand — only when the user first navigates to that route.</p>
        <h3>Why does this matter?</h3>
        <p>A large Angular app can have hundreds of components. If all of them were bundled together, the initial download would be huge and the app would feel slow to start. Lazy loading keeps the initial bundle small and fast, then loads the rest in the background or on demand.</p>
        <h3>loadComponent vs loadChildren</h3>
        <ul>
          <li><code>loadComponent</code> — lazily loads a single standalone component</li>
          <li><code>loadChildren</code> — lazily loads an entire routes file (a feature's routes), allowing you to group many related routes together</li>
        </ul>
        <h3>canMatch guard</h3>
        <p>Using <code>canMatch</code> prevents the lazy chunk from even being <em>downloaded</em> if the user doesn't have access — unlike <code>canActivate</code> which downloads the code first and then redirects.</p>
      `,
      code: "// app.routes.ts\n\nexport const routes: Routes = [\n  // Lazy-load a single standalone component\n  {\n    path: 'admin',\n    loadComponent: () =>\n      import('./admin/admin.component').then(m => m.AdminComponent),\n    canMatch: [adminGuard]   // don't even download the chunk if not admin\n  },\n\n  // Lazy-load an entire feature's routes (many components together)\n  {\n    path: 'store',\n    loadChildren: () =>\n      import('./store/store.routes').then(m => m.storeRoutes)\n  }\n];\n\n// store/store.routes.ts  — a self-contained group of routes\nexport const storeRoutes: Routes = [\n  { path: '',         loadComponent: () => import('./store-home.component').then(m => m.StoreHomeComponent) },\n  { path: 'products', loadComponent: () => import('./products.component').then(m => m.ProductsComponent) },\n  { path: 'cart',     loadComponent: () => import('./cart.component').then(m => m.CartComponent) }\n];",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">canActivate vs canMatch Timing</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-amber-50 border-2 border-amber-200 rounded-xl p-3\"><p class=\"font-bold text-amber-700 text-center mb-2\">canActivate</p><p class=\"text-slate-600 text-center\">chunk DOWNLOADED first, then guard may redirect</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">canMatch</p><p class=\"text-slate-600 text-center\">guard runs BEFORE download — denied users never fetch the code</p></div></div></div>"
    },

    {
      id: "what-are-route-guards",
      title: "What are route guards?",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A bouncer checking IDs at a club entrance before letting anyone in. The bouncer doesn't rebuild the club — they just make a yes/no/redirect decision at the door: let them in (<code>true</code>), turn them away (<code>false</code>), or point them to the correct queue instead (a <code>UrlTree</code> redirect).</p>
          </div>
        </div>
        <p><strong>Route guards</strong> are functions that Angular runs before (or during) a navigation to decide whether to allow it, redirect the user, or cancel it. They are the standard way to protect routes.</p>
        <h3>The most important guards</h3>
        <ul>
          <li><strong>canActivate</strong> — can the user enter this route? Used for authentication.</li>
          <li><strong>canDeactivate</strong> — can the user leave this route? Used to warn about unsaved changes.</li>
          <li><strong>resolve</strong> — fetch data before the route activates so the component starts with data ready.</li>
          <li><strong>canMatch</strong> — like canActivate, but also prevents lazy-loading the code if access is denied.</li>
        </ul>
        <h3>Modern functional guards</h3>
        <p>Guards are plain functions using <code>inject()</code> instead of classes. This is shorter, easier to test, and the recommended style in Angular 22.</p>
        <h3>Return values</h3>
        <p>A guard can return <code>true</code> (allow), <code>false</code> (block), a <code>UrlTree</code> (redirect), or an Observable/Promise of any of those.</p>
      `,
      code: "import { inject } from '@angular/core';\nimport { CanActivateFn, Router } from '@angular/router';\nimport { AuthService } from './auth.service';\n\n// ✅ Functional guard — recommended modern style\nexport const authGuard: CanActivateFn = (route, state) => {\n  const auth   = inject(AuthService);\n  const router = inject(Router);\n\n  if (auth.isLoggedIn()) {\n    return true;                          // Allow navigation\n  }\n\n  // Redirect to login, and pass the attempted URL so we can return after login\n  return router.createUrlTree(['/login'], {\n    queryParams: { returnUrl: state.url }\n  });\n};\n\n// Route configuration\nexport const routes: Routes = [\n  { path: 'login', loadComponent: () => import('./login.component').then(m => m.LoginComponent) },\n  {\n    path: 'dashboard',\n    loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent),\n    canActivate: [authGuard]\n  }\n];",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">A Guard's Three Possible Answers</p><div class=\"grid grid-cols-1 md:grid-cols-3 gap-3 text-xs\"><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-emerald-700\">true</p><p class=\"text-slate-500 mt-1\">let them in</p></div><div class=\"bg-rose-50 border-2 border-rose-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-rose-700\">false</p><p class=\"text-slate-500 mt-1\">block navigation</p></div><div class=\"bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-amber-700\">UrlTree</p><p class=\"text-slate-500 mt-1\">redirect elsewhere</p></div></div></div>"
    },

    {
      id: "types-of-route-guards",
      title: "Types of route guards",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Three different checkpoints on the same journey. <code>canDeactivate</code> is airport security asking "are you sure you want to leave the country without your passport?" before you walk out. <code>resolve</code> is having your hotel room key and welcome basket ready and waiting the moment you arrive, instead of making you stand in the lobby while they get organized. <code>canMatch</code> is a visa check that happens before the plane even takes off — if you're denied, the flight never leaves the ground.</p>
          </div>
        </div>
        <p>Angular provides several guard types, each covering a different point in the navigation lifecycle.</p>
        <h3>canDeactivate — prevent leaving with unsaved changes</h3>
        <p>This guard runs when the user tries to <em>leave</em> a route. Perfect for form pages where unsaved work could be lost.</p>
        <h3>resolve — preload data before rendering</h3>
        <p>A resolver runs before the component is created and fetches the data it needs. The component receives the data via <code>this.route.snapshot.data['product']</code>. This eliminates the loading spinner pattern for critical data.</p>
        <h3>canMatch — prevent even loading the lazy chunk</h3>
        <p>Runs before the lazy JavaScript is downloaded. Use it for role-based access to entire feature areas — if the user is not an admin, their browser never downloads the admin code at all.</p>
      `,
      code: "import { inject } from '@angular/core';\nimport { CanDeactivateFn, ResolveFn, CanMatchFn, Router } from '@angular/router';\nimport { ApiService } from './api.service';\nimport { AuthService } from './auth.service';\n\n// --- canDeactivate: warn before leaving a dirty form ---\nexport const unsavedChangesGuard: CanDeactivateFn<{ hasUnsavedChanges: () => boolean }> =\n  (component) => {\n    if (component.hasUnsavedChanges()) {\n      return window.confirm('You have unsaved changes. Leave anyway?');\n    }\n    return true;\n  };\n\n// --- resolve: fetch product data before the component loads ---\nexport const productResolver: ResolveFn<any> = (route) => {\n  return inject(ApiService).getProduct(route.paramMap.get('id')!);\n  // Component reads it: this.route.snapshot.data['product']\n};\n\n// --- canMatch: block access AND prevent downloading the lazy chunk ---\nexport const adminOnlyGuard: CanMatchFn = () => {\n  const auth   = inject(AuthService);\n  const router = inject(Router);\n  return auth.hasRole('admin') || router.createUrlTree(['/forbidden']);\n};\n\n// Route configuration using all three\nexport const routes: Routes = [\n  {\n    path: 'edit/:id',\n    loadComponent: () => import('./edit-product.component').then(m => m.EditProductComponent),\n    canDeactivate: [unsavedChangesGuard],\n    resolve: { product: productResolver }\n  },\n  {\n    path: 'admin',\n    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes),\n    canMatch: [adminOnlyGuard]   // code never downloaded unless user is admin\n  }\n];",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Guard Types Along the Navigation Timeline</p><div class=\"flex flex-wrap items-center justify-center gap-2 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 font-semibold text-indigo-700\">canMatch (before download)</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 font-semibold text-emerald-700\">canActivate (before render)</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 font-semibold text-amber-700\">resolve (data ready)</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-rose-50 border-2 border-rose-200 rounded-lg px-3 py-2 font-semibold text-rose-700\">canDeactivate (before leaving)</div></div></div>"
    },

    {
      id: "what-is-wildcard-route",
      title: "What is wildcard route?",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">The "lost and found" desk at the very end of a building directory — you only end up there if none of the labeled offices matched what you were looking for. It has to be the LAST stop on the directory, because if it were listed first, every visitor would be sent there regardless of which office they actually wanted.</p>
          </div>
        </div>
        <p>The <strong>wildcard route</strong> (<code>path: '**'</code>) matches any URL that no other route in the list has matched. It is always placed <strong>last</strong> in the routes array — Angular tries routes in order, so putting wildcard first would match everything.</p>
        <h3>Common uses</h3>
        <ul>
          <li>Show a custom 404 "Page Not Found" component</li>
          <li>Redirect all unknown URLs to the home page or a safe default</li>
        </ul>
        <h3>pathMatch: 'full'</h3>
        <p>The empty path <code>''</code> route uses <code>pathMatch: 'full'</code> to ensure it only matches exactly the empty string — otherwise it would match the beginning of every URL.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Placing <code>{ path: '**', ... }</code> anywhere but the very last entry silently swallows every route defined after it — Angular matches routes top to bottom and stops at the first match, so a wildcard placed early makes every later route unreachable dead code.</p>
          </div>
        </div>
      `,
      code: "import { Routes } from '@angular/router';\n\nexport const routes: Routes = [\n  { path: '',        redirectTo: 'home', pathMatch: 'full' },\n  { path: 'home',    loadComponent: () => import('./home.component').then(m => m.HomeComponent) },\n  { path: 'products', loadComponent: () => import('./products.component').then(m => m.ProductsComponent) },\n  { path: 'login',   loadComponent: () => import('./login.component').then(m => m.LoginComponent) },\n\n  // ← ALWAYS put wildcard LAST\n  {\n    path: '**',\n    loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent)\n    // Or simply: redirectTo: 'home'\n  }\n];\n\n// not-found.component.ts — a helpful 404 page\n@Component({\n  selector: 'app-not-found',\n  template: `\n    <h1>404 — Page Not Found</h1>\n    <p>The page you're looking for doesn't exist.</p>\n    <a routerLink=\"/home\">Go back home</a>\n  `\n})\nexport class NotFoundComponent {}",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Route Order Matters</p><div class=\"flex flex-col items-center gap-1 text-xs font-mono\"><div class=\"bg-indigo-50 border border-indigo-200 rounded px-3 py-1 w-full max-w-xs text-center\">'' &rarr; redirectTo: 'home'</div><div class=\"bg-emerald-50 border border-emerald-200 rounded px-3 py-1 w-full max-w-xs text-center\">'home'</div><div class=\"bg-amber-50 border border-amber-200 rounded px-3 py-1 w-full max-w-xs text-center\">'products'</div><div class=\"bg-rose-50 border-2 border-rose-300 rounded px-3 py-1 w-full max-w-xs text-center font-bold\">'**' ← must be LAST</div></div></div>"
    },

    {
      id: "what-is-router-outlet",
      title: "What is router outlet?",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A picture frame mounted permanently on a wall. The frame itself (the surrounding layout) never moves, but whichever photo you slot into it (the routed component) is what visitors currently see. A second, smaller frame elsewhere on the wall (a named outlet) can hold a completely different, independently-changing photo — like a chat panel that updates on its own.</p>
          </div>
        </div>
        <p><code>&lt;router-outlet&gt;</code> is a placeholder directive in your template that tells Angular <em>where</em> to render the component that matches the current URL. When the user navigates to a route, Angular replaces the content of the nearest <code>&lt;router-outlet&gt;</code> with that route's component.</p>
        <h3>Multiple outlets</h3>
        <p>An app can have more than one router outlet. The primary outlet (unnamed) handles main navigation. Named outlets handle secondary areas like a sidebar or a modal — they can be activated independently by a route's <code>outlets</code> property.</p>
        <h3>routerLinkActive</h3>
        <p>Use the <code>routerLinkActive</code> directive on navigation links to automatically add a CSS class when that link's route is active.</p>
      `,
      code: "// app.component.ts\n@Component({\n  selector: 'app-root',\n  imports: [RouterOutlet, RouterLink, RouterLinkActive, NavbarComponent],\n  template: `\n    <app-navbar></app-navbar>\n\n    <nav>\n      <!-- routerLinkActive adds class \"active\" when route matches -->\n      <a routerLink=\"/home\"     routerLinkActive=\"active\">Home</a>\n      <a routerLink=\"/products\" routerLinkActive=\"active\">Products</a>\n    </nav>\n\n    <!-- Angular renders the matched component here -->\n    <router-outlet></router-outlet>\n\n    <!-- Named outlet for a chat panel — activated via:\n         router.navigate([{ outlets: { chat: ['support'] } }]) -->\n    <router-outlet name=\"chat\"></router-outlet>\n  `\n})\nexport class AppComponent {}\n\n// The shell stays on screen — only the content inside <router-outlet> swaps.\n// This is what makes Angular a Single Page Application.",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Primary vs Named Outlet</p><div class=\"border-2 border-dashed border-slate-300 rounded-xl p-3\"><p class=\"text-center text-xs font-bold text-slate-500 mb-2\">AppComponent shell (navbar always visible)</p><div class=\"grid grid-cols-2 gap-2 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg p-2 text-center font-semibold text-indigo-700\">&lt;router-outlet&gt;</div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg p-2 text-center font-semibold text-emerald-700\">&lt;router-outlet name=\"chat\"&gt;</div></div></div></div>"
    },
    {
      id: "route-resolvers-and-data",
      title: "Route resolvers and route data",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A restaurant that has your reserved table already set with water and bread before you sit down, versus one that seats you first and then makes you wait, empty-handed, while they figure out where your order stands. A resolver is the pre-set table; skipping it means your component renders and immediately shows a loading spinner while everyone waits.</p>
          </div>
        </div>
        <p><strong>Route data</strong> is static metadata attached to a route, such as permissions, breadcrumbs, page titles, or layout settings. <strong>Resolvers</strong> load required data before a route activates, so the component can render with its required data already available.</p>
        <h3>When to use resolvers</h3>
        <p>Use a resolver when a route cannot meaningfully render without the data: product detail, edit user, invoice preview. For optional data or dashboard widgets, load inside the component so the page can render progressively.</p>
        <h3>Modern Angular style</h3>
        <p>Use functional resolvers with <code>ResolveFn</code> and <code>inject()</code>. This matches modern functional guards and keeps routing code concise.</p>
      `,
      code: "import { Routes, ResolveFn, ActivatedRoute } from '@angular/router';\nimport { inject, Component } from '@angular/core';\n\ninterface Product { id: string; name: string; price: number; }\n\nexport const productResolver: ResolveFn<Product> = (route) => {\n  const productService = inject(ProductService);\n  return productService.getById(route.paramMap.get('id')!);\n};\n\nexport const routes: Routes = [\n  {\n    path: 'products/:id',\n    title: 'Product Details',\n    resolve: { product: productResolver },\n    data: {\n      breadcrumb: 'Product',\n      requiredRole: 'customer'\n    },\n    loadComponent: () =>\n      import('./product-detail.component').then(m => m.ProductDetailComponent)\n  }\n];\n\n@Component({\n  template: `\n    <h1>{{ product.name }}</h1>\n    <p>{{ product.price | currency }}</p>\n  `\n})\nexport class ProductDetailComponent {\n  private route = inject(ActivatedRoute);\n\n  // Resolver data is available when the component is created.\n  product = this.route.snapshot.data['product'] as Product;\n}",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">With vs Without a Resolver</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-rose-50 border-2 border-rose-200 rounded-xl p-3\"><p class=\"font-bold text-rose-700 text-center mb-2\">No resolver</p><p class=\"text-slate-600 text-center\">navigate &rarr; render empty shell &rarr; spinner &rarr; data arrives &rarr; re-render</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">With resolver</p><p class=\"text-slate-600 text-center\">navigate &rarr; data fetched &rarr; render already-populated component</p></div></div></div>"
    }

  ]
});
