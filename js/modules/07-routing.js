window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: "routing",
  title: "Routing",
  icon: "bi bi-signpost-split",
  questions: [

    {
      id: "what-is-angular-router",
      title: "What is Angular Router?",
      explanation: `
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

        <h3>Real-world example</h3>
        <p>A typical app with a public landing page, a login page, and a protected dashboard.</p>
      `,
      code: `import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent }   from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Public pages
  { path: '',      component: LandingComponent },
  { path: 'login', component: LoginComponent },

  // Protected page — authGuard redirects to /login if not authenticated
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  // Catch-all: show 404 for any unknown URL
  { path: '**', redirectTo: '/not-found' }
];

// main.ts
// bootstrapApplication(AppComponent, { providers: [provideRouter(routes)] });`,
      language: "typescript"
    },

    {
      id: "how-to-configure-routes",
      title: "How to configure routes (Angular 17+)?",
      explanation: `
        <p>Modern Angular uses <strong>standalone components</strong> and the <code>provideRouter()</code> function instead of <code>RouterModule.forRoot()</code>. This makes the setup lighter and more explicit.</p>

        <h3>Two files to know</h3>
        <ul>
          <li><code>app.routes.ts</code> — where you define all routes</li>
          <li><code>main.ts</code> — where you bootstrap the app and register the router</li>
        </ul>

        <h3>loadComponent vs component</h3>
        <p>Using <code>loadComponent</code> (lazy) instead of <code>component</code> (eager) means the JavaScript for that component is only downloaded when the user actually navigates to it — making the initial bundle smaller and the app faster.</p>
      `,
      code: `// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Eagerly loaded — always in the initial bundle
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Lazily loaded — JS downloaded only when user visits /home
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./products/products.component').then(m => m.ProductsComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  }
];

// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes)
    // Optional extras:
    // withPreloading(PreloadAllModules),
    // withDebugTracing()  ← logs every navigation event, useful in dev
  ]
});`,
      language: "typescript"
    },

    {
      id: "what-are-route-parameters",
      title: "What are route parameters?",
      explanation: `
        <p><strong>Route parameters</strong> are variable segments in a URL path, prefixed with <code>:</code>. They let you reuse one route definition for multiple items — for example, showing any product's detail page with a single route.</p>

        <h3>How to read them</h3>
        <p>Inject <code>ActivatedRoute</code> into your component. The <code>paramMap</code> is an Observable, so using <code>switchMap</code> to combine it with an API call means your component automatically reloads if the parameter changes (e.g., user navigates from product 1 to product 2) <em>without</em> the component being destroyed and recreated.</p>

        <h3>snapshot vs observable</h3>
        <ul>
          <li><code>this.route.snapshot.paramMap.get('id')</code> — reads the parameter once at load time. Simple, but won't update if the route changes while the component is active.</li>
          <li><code>this.route.paramMap.pipe(switchMap(...))</code> — reactive; updates automatically when the URL changes.</li>
        </ul>
      `,
      code: `// 1. Define the route with a :orderId parameter
// { path: 'orders/:orderId', component: OrderDetailComponent }

// 2. Component — reads the parameter reactively
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiService, Order } from './api.service';

@Component({
  selector: 'app-order-detail',
  template: \`
    <ng-container *ngIf="order$ | async as order">
      <h2>Order #{{ order.id }}</h2>
      <p>Status: {{ order.status }}</p>
    </ng-container>
  \`
})
export class OrderDetailComponent implements OnInit {
  order$!: Observable<Order>;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit(): void {
    this.order$ = this.route.paramMap.pipe(
      // switchMap cancels the previous API call if the param changes fast
      switchMap(params => this.api.getOrder(params.get('orderId')!))
    );
  }
}

// Navigate programmatically:
// this.router.navigate(['/orders', order.id]);
// Or in template:
// <a [routerLink]="['/orders', order.id]">View Order</a>`,
      language: "typescript"
    },

    {
      id: "what-are-query-parameters",
      title: "What are query parameters?",
      explanation: `
        <p><strong>Query parameters</strong> appear after the <code>?</code> in a URL, e.g. <code>/products?search=laptop&page=2&sort=price</code>. Unlike route parameters, they are optional and do not change the route — making them ideal for search filters, sorting, and pagination.</p>

        <h3>queryParamsHandling</h3>
        <p>When navigating, you often want to <em>add</em> one filter without losing the others already in the URL. That's what <code>queryParamsHandling: 'merge'</code> does — it merges the new params into the existing ones instead of replacing them all.</p>

        <h3>Reading query params reactively</h3>
        <p>Subscribe to <code>route.queryParamMap</code> so the component automatically reacts when the user changes a filter without navigating away from the page.</p>
      `,
      code: `import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  products: any[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // React to URL changes (back/forward button, links, etc.)
    this.route.queryParamMap.subscribe(params => {
      const search = params.get('search') ?? '';
      const page   = Number(params.get('page') ?? 1);
      const sort   = params.get('sort') ?? 'name';
      this.loadProducts(search, page, sort);
    });
  }

  // Called when user types in the search box
  onSearchChange(term: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: term, page: 1 },  // reset to page 1 on new search
      queryParamsHandling: 'merge'              // keep other params (sort, etc.)
    });
  }

  onPageChange(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge'
    });
  }

  loadProducts(search: string, page: number, sort: string) {
    console.log('Loading:', { search, page, sort });
    // call your API here
  }
}`,
      language: "typescript"
    },

    {
      id: "what-is-child-routing",
      title: "What is child routing?",
      explanation: `
        <p><strong>Child routes</strong> are routes nested inside another route. They are used to build layout-based navigation — for example a dashboard with a persistent sidebar and a changing main area, or an admin panel where all sub-pages share the same header and menu.</p>

        <h3>How it works</h3>
        <p>The parent route's component template has its own <code>&lt;router-outlet&gt;</code>. When a child route is activated, its component is rendered inside <em>that</em> outlet — not the root outlet. The parent layout stays on screen while only the inner area changes.</p>

        <h3>Real-world example</h3>
        <p>An admin panel where <code>/admin</code> shows the layout (sidebar + header), and <code>/admin/users</code>, <code>/admin/reports</code>, etc. render different content inside it.</p>
      `,
      code: `// app.routes.ts
export const routes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,   // Persistent shell with sidebar & header
    canActivate: [adminGuard],
    children: [
      { path: '',        redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: OverviewComponent },
      { path: 'users',    component: UsersComponent },
      { path: 'reports',  component: ReportsComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  }
];

// admin-layout.component.html — note the INNER <router-outlet>
/*
  <div class="admin-shell">
    <app-sidebar></app-sidebar>

    <main class="admin-content">
      <app-admin-header></app-admin-header>

      <!-- Child components render here, sidebar/header stay put -->
      <router-outlet></router-outlet>
    </main>
  </div>
*/

// Navigation example:
// <a routerLink="overview" routerLinkActive="active">Overview</a>
// <a routerLink="users"    routerLinkActive="active">Users</a>
// These are relative links — they resolve to /admin/overview, /admin/users, etc.`,
      language: "typescript"
    },

    {
      id: "what-is-lazy-loading",
      title: "What is lazy loading?",
      explanation: `
        <p><strong>Lazy loading</strong> means the JavaScript code for a component (or a group of related components) is <em>not included</em> in the initial bundle. Instead, it is downloaded on demand — only when the user first navigates to that route.</p>

        <h3>Why does this matter?</h3>
        <p>A large Angular app can have hundreds of components. If all of them were bundled together, the initial download would be huge and the app would feel slow to start. Lazy loading keeps the initial bundle small and fast, then loads the rest in the background or on demand.</p>

        <h3>loadComponent vs loadChildren</h3>
        <ul>
          <li><code>loadComponent</code> — lazily loads a single standalone component</li>
          <li><code>loadChildren</code> — lazily loads an entire routes file (a feature module's routes), allowing you to group many related routes together</li>
        </ul>

        <h3>canMatch guard</h3>
        <p>Using <code>canMatch</code> prevents the lazy chunk from even being <em>downloaded</em> if the user doesn't have access — unlike <code>canActivate</code> which downloads the code first and then redirects.</p>
      `,
      code: `// app.routes.ts

export const routes: Routes = [
  // Lazy-load a single standalone component
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin.component').then(m => m.AdminComponent),
    canMatch: [adminGuard]   // don't even download the chunk if not admin
  },

  // Lazy-load an entire feature's routes (many components together)
  {
    path: 'store',
    loadChildren: () =>
      import('./store/store.routes').then(m => m.storeRoutes)
    // store.routes.ts can define /store/products, /store/cart, /store/checkout, etc.
  }
];

// store/store.routes.ts  — a self-contained group of routes
export const storeRoutes: Routes = [
  { path: '',         loadComponent: () => import('./store-home.component').then(m => m.StoreHomeComponent) },
  { path: 'products', loadComponent: () => import('./products.component').then(m => m.ProductsComponent) },
  { path: 'cart',     loadComponent: () => import('./cart.component').then(m => m.CartComponent) }
];`,
      language: "typescript"
    },

    {
      id: "what-are-route-guards",
      title: "What are route guards?",
      explanation: `
        <p><strong>Route guards</strong> are functions that Angular runs before (or during) a navigation to decide whether to allow it, redirect the user, or cancel it. They are the standard way to protect routes.</p>

        <h3>The most important guards</h3>
        <ul>
          <li><strong>canActivate</strong> — can the user enter this route? Used for authentication.</li>
          <li><strong>canDeactivate</strong> — can the user leave this route? Used to warn about unsaved changes.</li>
          <li><strong>resolve</strong> — fetch data before the route activates so the component starts with data ready.</li>
          <li><strong>canMatch</strong> — like canActivate, but also prevents lazy-loading the code if access is denied.</li>
        </ul>

        <h3>Modern functional guards (Angular 15+)</h3>
        <p>Guards are now plain functions using <code>inject()</code> instead of classes. This is shorter, easier to test, and the recommended style.</p>

        <h3>Return values</h3>
        <p>A guard can return <code>true</code> (allow), <code>false</code> (block), a <code>UrlTree</code> (redirect), or an Observable/Promise of any of those.</p>
      `,
      code: `import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// ✅ Functional guard — recommended modern style
export const authGuard: CanActivateFn = (route, state) => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;                          // Allow navigation
  }

  // Redirect to login, and pass the attempted URL so we can return after login
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

// Route configuration
export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./login.component').then(m => m.LoginComponent) },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  }
];`,
      language: "typescript"
    },

    {
      id: "types-of-route-guards",
      title: "Types of route guards",
      explanation: `
        <p>Angular provides several guard types, each covering a different point in the navigation lifecycle.</p>

        <h3>canDeactivate — prevent leaving with unsaved changes</h3>
        <p>This guard runs when the user tries to <em>leave</em> a route. Perfect for form pages where unsaved work could be lost.</p>

        <h3>resolve — preload data before rendering</h3>
        <p>A resolver runs before the component is created and fetches the data it needs. The component receives the data via <code>this.route.snapshot.data['product']</code>. This eliminates the loading spinner pattern for critical data.</p>

        <h3>canMatch — prevent even loading the lazy chunk</h3>
        <p>Runs before the lazy JavaScript is downloaded. Use it for role-based access to entire feature areas — if the user is not an admin, their browser never downloads the admin code at all.</p>
      `,
      code: `import { inject } from '@angular/core';
import { CanDeactivateFn, ResolveFn, CanMatchFn, Router } from '@angular/router';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

// --- canDeactivate: warn before leaving a dirty form ---
export const unsavedChangesGuard: CanDeactivateFn<{ hasUnsavedChanges: () => boolean }> =
  (component) => {
    if (component.hasUnsavedChanges()) {
      return window.confirm('You have unsaved changes. Leave anyway?');
    }
    return true;
  };

// --- resolve: fetch product data before the component loads ---
export const productResolver: ResolveFn<any> = (route) => {
  return inject(ApiService).getProduct(route.paramMap.get('id')!);
  // Component reads it: this.route.snapshot.data['product']
};

// --- canMatch: block access AND prevent downloading the lazy chunk ---
export const adminOnlyGuard: CanMatchFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);
  return auth.hasRole('admin') || router.createUrlTree(['/forbidden']);
};

// Route configuration using all three
export const routes: Routes = [
  {
    path: 'edit/:id',
    loadComponent: () => import('./edit-product.component').then(m => m.EditProductComponent),
    canDeactivate: [unsavedChangesGuard],
    resolve: { product: productResolver }
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes),
    canMatch: [adminOnlyGuard]   // code never downloaded unless user is admin
  }
];`,
      language: "typescript"
    },

    {
      id: "what-is-wildcard-route",
      title: "What is wildcard route?",
      explanation: `
        <p>The <strong>wildcard route</strong> (<code>path: '**'</code>) matches any URL that no other route in the list has matched. It is always placed <strong>last</strong> in the routes array — Angular tries routes in order, so putting wildcard first would match everything.</p>

        <h3>Common uses</h3>
        <ul>
          <li>Show a custom 404 "Page Not Found" component</li>
          <li>Redirect all unknown URLs to the home page or a safe default</li>
        </ul>

        <h3>pathMatch: 'full'</h3>
        <p>The empty path <code>''</code> route uses <code>pathMatch: 'full'</code> to ensure it only matches exactly the empty string — otherwise it would match the beginning of every URL.</p>
      `,
      code: `import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '',        redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',    loadComponent: () => import('./home.component').then(m => m.HomeComponent) },
  { path: 'products', loadComponent: () => import('./products.component').then(m => m.ProductsComponent) },
  { path: 'login',   loadComponent: () => import('./login.component').then(m => m.LoginComponent) },

  // ← ALWAYS put wildcard LAST
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent)
    // Or simply: redirectTo: 'home'
  }
];

// not-found.component.ts — a helpful 404 page
@Component({
  selector: 'app-not-found',
  template: \`
    <h1>404 — Page Not Found</h1>
    <p>The page you're looking for doesn't exist.</p>
    <a routerLink="/home">Go back home</a>
  \`
})
export class NotFoundComponent {}`,
      language: "typescript"
    },

    {
      id: "what-is-router-outlet",
      title: "What is router outlet?",
      explanation: `
        <p><code>&lt;router-outlet&gt;</code> is a placeholder directive in your template that tells Angular <em>where</em> to render the component that matches the current URL. When the user navigates to a route, Angular replaces the content of the nearest <code>&lt;router-outlet&gt;</code> with that route's component.</p>

        <h3>Multiple outlets</h3>
        <p>An app can have more than one router outlet. The primary outlet (unnamed) handles main navigation. Named outlets handle secondary areas like a sidebar or a modal — they can be activated independently by a route's <code>outlets</code> property.</p>

        <h3>routerLinkActive</h3>
        <p>Use the <code>routerLinkActive</code> directive on navigation links to automatically add a CSS class when that link's route is active.</p>
      `,
      code: `// app.component.ts
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NavbarComponent],
  template: \`
    <app-navbar></app-navbar>

    <nav>
      <!-- routerLinkActive adds class "active" when route matches -->
      <a routerLink="/home"     routerLinkActive="active">Home</a>
      <a routerLink="/products" routerLinkActive="active">Products</a>
    </nav>

    <!-- Angular renders the matched component here -->
    <router-outlet></router-outlet>

    <!-- Named outlet for a chat panel — activated via:
         router.navigate([{ outlets: { chat: ['support'] } }]) -->
    <router-outlet name="chat"></router-outlet>
  \`
})
export class AppComponent {}

// The shell stays on screen — only the content inside <router-outlet> swaps.
// This is what makes Angular a Single Page Application.`,
      language: "typescript"
    }

  ]
});