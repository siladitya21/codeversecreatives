window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "standalone-components",
  "title": "Standalone Components",
  "icon": "bi bi-box",
  "questions": [
    {
      id: "angular-22-standard-standalone-upgrade",
      title: "Angular 22 standard for standalone components",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Every shipping container arriving <strong>pre-labeled with its own manifest</strong>, instead of a dockworker having to check a central warehouse ledger to figure out what's inside and where it's allowed to go. Each standalone component carries its own manifest &mdash; the <code>imports</code> array &mdash; so nothing about what it needs is hidden in some separate module file you have to go hunting for.</p>
          </div>
        </div>
        <p>Angular 22-ready apps are standalone-first. Components, directives, and pipes import their own template dependencies directly, routes are provided with <code>provideRouter()</code>, HTTP with <code>provideHttpClient()</code>, and feature providers can live at route boundaries. This isn't one style among several anymore &mdash; it's the only style the CLI scaffolds for new projects.</p>
        <h3>Modern standalone checklist</h3>
        <ul>
          <li>Use standalone components as the default for new code &mdash; there's no <code>standalone: true</code> flag to remember; it's implicit now.</li>
          <li>Use component <code>imports</code> for dependencies instead of SharedModule-style buckets.</li>
          <li>Use <code>bootstrapApplication()</code> instead of a root <code>AppModule</code>.</li>
          <li>Lazy load standalone components with <code>loadComponent()</code>.</li>
          <li>Keep NgModules only for legacy compatibility or libraries that still require them &mdash; not deprecated, but no longer the default path for anything new.</li>
        </ul>
      `,
      code: `bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
});

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-card.component.html'
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
}

export const routes: Routes = [
  {
    path: 'products/:id',
    loadComponent: () => import('./product-page.component').then(m => m.ProductPageComponent)
  }
];`,
      language: "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Standalone — The Only Style The CLI Scaffolds</p><div class="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto text-xs"><div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center"><p class="font-bold text-indigo-700">imports on @Component</p><p class="text-slate-500 mt-1">not standalone: true</p></div><div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center"><p class="font-bold text-emerald-700">bootstrapApplication()</p><p class="text-slate-500 mt-1">no AppModule</p></div><div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center"><p class="font-bold text-amber-700">provideRouter()</p><p class="text-slate-500 mt-1">no RouterModule</p></div><div class="bg-rose-50 border border-rose-200 rounded-lg p-3 text-center"><p class="font-bold text-rose-700">loadComponent()</p><p class="text-slate-500 mt-1">lazy load, no module</p></div><div class="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center"><p class="font-bold text-purple-700">NgModules = legacy</p><p class="text-slate-500 mt-1">not deprecated, not default</p></div></div></div>`
    },
    {
      "id": "what-are-standalone-components",
      "title": "What are standalone components?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Moving apartments from a <strong>shared house with communal supplies</strong> into your own <strong>fully stocked studio</strong>. In the shared house (NgModules), you keep a shared pantry (declarations/imports) that the whole household draws from, and figuring out what's actually stocked means walking down to check the pantry. In your own studio (standalone), every ingredient you need is on your own shelf, in your own kitchen &mdash; nobody else's inventory changes affect what you have on hand.</p>
          </div>
        </div>
        <p>A <strong>standalone component</strong> is a component, directive, or pipe that doesn't need to be declared inside an <code>NgModule</code>. It manages its own dependencies directly in its <code>@Component</code> decorator's <code>imports</code> array. Introduced in Angular 14 as opt-in, it became the recommended default in Angular 17, and by Angular 22 it's simply how the CLI generates every new component &mdash; the <code>standalone: true</code> flag itself is no longer needed in code because it's the implicit default.</p>
        <p>Before standalone components, every component had to be declared in an <code>NgModule</code>. If it needed another component, directive, or pipe, those had to be declared or imported into the very same module. For large applications this produced sprawling module files and the classic confusing error: "Component 'X' is not declared in any module."</p>
        <h3>The key difference</h3>
        <p>In a standalone component, the <code>imports</code> array in <code>@Component</code> does exactly what the <code>imports</code> array in <code>@NgModule</code> used to do &mdash; makes other components, directives, pipes, and modules available to the template. The difference is scope: these imports apply to <em>this component only</em>, not to every component that happened to live in the same module. That makes dependencies explicit, local, and much easier to tree-shake.</p>
      `,
      "code": "// ---- Without standalone (NgModule-based — legacy) ----\n// You need a module to declare the component and import its dependencies:\n// @NgModule({\n//   declarations: [ProductCardComponent],  // must declare here\n//   imports: [CommonModule, RouterModule],  // shared with everything in module\n//   exports: [ProductCardComponent]\n// })\n// export class ProductCardModule {}\n\n// ---- With standalone (Angular 22 default — no flag needed) ----\nimport { Component, Input } from '@angular/core';\nimport { CurrencyPipe, NgClass } from '@angular/common';\nimport { RouterLink } from '@angular/router';\n\n@Component({\n  selector: 'app-product-card',\n  imports: [\n    CurrencyPipe,     // built-in pipe imported directly\n    NgClass,          // built-in directive imported directly\n    RouterLink        // router directive imported directly\n  ],\n  template: `\n    <a [routerLink]=\"['/products', product.id]\" class=\"card\"\n       [ngClass]=\"{ 'card-out-of-stock': !product.inStock }\">\n      <h3>{{ product.name }}</h3>\n      <p>{{ product.price | currency }}</p>\n      <span *ngIf=\"!product.inStock\" class=\"badge\">Out of Stock</span>\n    </a>\n  `\n})\nexport class ProductCardComponent {\n  @Input({ required: true }) product!: {\n    id: number; name: string; price: number; inStock: boolean;\n  };\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Shared Pantry vs Own Kitchen</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-slate-50 border-2 border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">NgModule — shared pantry</p><div class="flex flex-col items-center gap-1"><div class="bg-indigo-50 border border-indigo-200 rounded px-2 py-1 w-full text-center">Module declares 5 components</div><div class="bg-indigo-50 border border-indigo-200 rounded px-2 py-1 w-full text-center">All share one imports list</div></div></div><div class="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">Standalone — own kitchen</p><div class="flex flex-col items-center gap-1"><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center">Each component: own imports</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center">Nothing shared implicitly</div></div></div></div></div>`
    },
    {
      "id": "how-to-create-standalone",
      "title": "How to create standalone components?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Writing a <strong>packing list before a trip</strong> instead of assuming the hotel will have everything you need. The <code>imports</code> array is that list &mdash; anything your template uses that isn't a native HTML element goes on it explicitly: other standalone components, directives, pipes, or an occasional legacy NgModule for library compatibility. Forget to pack it, the template compiler tells you immediately, before you're stranded at the airport with a runtime error.</p>
          </div>
        </div>
        <p>Creating a standalone component is straightforward: list every template dependency in the <code>imports</code> array on <code>@Component</code>. The Angular CLI generates standalone components by default &mdash; there's no flag to remember anymore, since standalone is the only mode the generator produces.</p>
        <h3>What goes in the imports array</h3>
        <p>Anything your template uses that isn't a native HTML element must be imported: other standalone components, standalone directives, standalone pipes, and NgModules (for compatibility with library code that hasn't migrated to standalone). Common ones include <code>NgIf</code>, <code>NgFor</code>, <code>AsyncPipe</code>, <code>RouterLink</code>, <code>ReactiveFormsModule</code>, and <code>FormsModule</code>. With the built-in control flow syntax (<code>@if</code>, <code>@for</code>), you no longer need <code>NgIf</code> and <code>NgFor</code> in most templates at all.</p>
        <h3>Importing another standalone component</h3>
        <p>To use another standalone component in your template, import its class directly in the <code>imports</code> array &mdash; no module wrapping required. This direct import is exactly what lets the bundler tree-shake unused components: if nothing imports <code>ProductCardComponent</code>, it never makes it into the bundle.</p>
      `,
      "code": "# ---- Generate standalone component with CLI ----\nng generate component features/checkout/order-summary\n# Angular 22 generates a standalone component by default — it's the only kind\n\n# ---- What the CLI generates ----\n\n// order-summary.component.ts\nimport { Component } from '@angular/core';\nimport { CurrencyPipe, NgFor, NgIf } from '@angular/common';\nimport { CartItemComponent } from '../cart-item/cart-item.component';\n\n@Component({\n  selector: 'app-order-summary',\n  imports: [\n    CurrencyPipe,\n    NgFor,\n    NgIf,\n    CartItemComponent      // another standalone component — import directly\n  ],\n  templateUrl: './order-summary.component.html',\n  styleUrls: ['./order-summary.component.scss']\n})\nexport class OrderSummaryComponent {\n  items = [\n    { id: 1, name: 'Laptop', price: 999, quantity: 1 },\n    { id: 2, name: 'Mouse', price: 29, quantity: 2 }\n  ];\n\n  get total(): number {\n    return this.items.reduce((sum, i) => sum + i.price * i.quantity, 0);\n  }\n}\n\n// order-summary.component.html\n// <div class=\"summary\">\n//   <app-cart-item *ngFor=\"let item of items\" [item]=\"item\"></app-cart-item>\n//   <p><strong>Total: {{ total | currency }}</strong></p>\n// </div>",
      "language": "bash",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">imports Array = Template Dependency List</p><div class="flex flex-col items-center gap-2 text-xs max-w-sm mx-auto"><div class="bg-slate-800 text-white rounded-lg px-3 py-1.5 w-full text-center font-mono">@Component({ imports: [...] })</div><div class="text-slate-300">&darr;</div><div class="grid grid-cols-2 gap-2 w-full"><div class="bg-indigo-50 border border-indigo-200 rounded px-2 py-1 text-center">CurrencyPipe</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 text-center">NgFor / NgIf</div><div class="bg-amber-50 border border-amber-200 rounded px-2 py-1 text-center">CartItemComponent</div><div class="bg-rose-50 border border-rose-200 rounded px-2 py-1 text-center">ReactiveFormsModule</div></div></div></div>`
    },
    {
      "id": "advantages-standalone",
      "title": "Advantages of standalone components",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Ordering <strong>a la carte instead of a fixed banquet menu</strong>. The banquet (NgModule import) hands you everything on the menu whether you're hungry for it or not, and the kitchen has to prep all of it. Ordering a la carte (standalone imports) means the kitchen only fires the exact dishes you asked for &mdash; less waste, and you can tell at a glance from the receipt (your imports array) exactly what you're paying for.</p>
          </div>
        </div>
        <p>Standalone components improve the Angular developer experience in several concrete ways that compound as applications grow.</p>
        <h3>Explicit, local dependencies</h3>
        <p>With NgModules, a component's dependencies were scattered across module files &mdash; reading a component meant hunting down its module to know what it could use, and missing-import errors were often hard to trace. With standalone components, every dependency is visible in the component's own <code>imports</code> array. Read one file, know exactly what it uses.</p>
        <h3>Better tree shaking</h3>
        <p>NgModule declarations were opaque to the bundler &mdash; a module importing <code>CommonModule</code> pulled in the whole module regardless of which directives were actually used. Standalone imports are precise: <code>imports: [NgIf, CurrencyPipe]</code> pulls in only those two. This can meaningfully shrink bundle sizes, especially for apps that previously leaned on large shared modules.</p>
        <h3>Simpler lazy loading</h3>
        <p>With NgModules, lazy loading required a separate routing module and its own module file. With standalone components, you lazy-load a single component directly in the router: <code>loadComponent: () => import('./dashboard').then(m => m.DashboardComponent)</code>. No extra module file, no indirection.</p>
        <h3>Simpler testing</h3>
        <p>TestBed setup becomes dramatically cleaner. Instead of importing a feature module (which drags in all its transitive dependencies), you import just the component under test and stub only the dependencies you actually care about. Tests become self-contained and compile faster.</p>
      `,
      "code": "// ---- 1. Simpler lazy loading — no module file needed ----\nimport { Routes } from '@angular/router';\n\nexport const routes: Routes = [\n  { path: '', redirectTo: 'home', pathMatch: 'full' },\n\n  // Each route lazy-loads a single standalone component\n  {\n    path: 'home',\n    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),\n    title: 'Home'\n  },\n  {\n    path: 'products',\n    loadComponent: () => import('./features/products/product-list.component')\n      .then(m => m.ProductListComponent),\n    title: 'Products'\n  },\n  {\n    path: 'checkout',\n    loadComponent: () => import('./features/checkout/checkout.component')\n      .then(m => m.CheckoutComponent),\n    canActivate: [() => inject(AuthService).isLoggedIn()],\n    title: 'Checkout'\n  },\n  {\n    // Lazy-load a group of routes (children) without a module\n    path: 'admin',\n    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),\n    canMatch: [() => inject(AuthService).isAdmin()]\n  }\n];\n\n// ---- 2. Simpler testing ----\n// BEFORE (NgModule-based):\n// TestBed.configureTestingModule({\n//   imports: [ProductModule]  // brings in everything in the module\n// });\n\n// AFTER (standalone):\nimport { ComponentFixture, TestBed } from '@angular/core/testing';\nimport { ProductCardComponent } from './product-card.component';\nimport { provideRouter } from '@angular/router';\n\ndescribe('ProductCardComponent', () => {\n  let fixture: ComponentFixture<ProductCardComponent>;\n\n  beforeEach(async () => {\n    await TestBed.configureTestingModule({\n      // Import only the component itself — all its dependencies come with it\n      imports: [ProductCardComponent],\n      providers: [provideRouter([])]\n    }).compileComponents();\n\n    fixture = TestBed.createComponent(ProductCardComponent);\n    fixture.componentInstance.product = { id: 1, name: 'Laptop', price: 999, inStock: true };\n    fixture.detectChanges();\n  });\n\n  it('should display the product name', () => {\n    expect(fixture.nativeElement.textContent).toContain('Laptop');\n  });\n});",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Four Compounding Advantages</p><div class="grid grid-cols-2 gap-3 max-w-md mx-auto text-xs"><div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center"><p class="font-bold text-indigo-700">Explicit deps</p><p class="text-slate-500 mt-1">read one file, know it all</p></div><div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center"><p class="font-bold text-emerald-700">Better tree-shaking</p><p class="text-slate-500 mt-1">smaller bundles</p></div><div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center"><p class="font-bold text-amber-700">Simpler lazy load</p><p class="text-slate-500 mt-1">loadComponent()</p></div><div class="bg-rose-50 border border-rose-200 rounded-lg p-3 text-center"><p class="font-bold text-rose-700">Simpler testing</p><p class="text-slate-500 mt-1">import just the component</p></div></div></div>`
    },
    {
      "id": "bootstrapping-standalone",
      "title": "Bootstrapping a standalone application",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Setting up a market stall directly on the street corner instead of first renting an entire building to put the stall inside. <code>bootstrapApplication()</code> starts the app right where it needs to run, handing it a flat list of what it needs (<code>providers</code>) &mdash; no building (<code>AppModule</code>) to construct first just so the stall has somewhere to sit.</p>
          </div>
        </div>
        <p>A fully standalone Angular application uses <code>bootstrapApplication()</code> in <code>main.ts</code> instead of the traditional <code>platformBrowserDynamic().bootstrapModule(AppModule)</code>. This removes the last NgModule from the application entirely &mdash; the root <code>AppModule</code> that used to be required just to bootstrap is gone.</p>
        <h3>providers in bootstrapApplication</h3>
        <p>App-wide services and configuration that used to live in <code>AppModule.providers</code> or <code>AppModule.imports</code> now go in the <code>providers</code> array of <code>bootstrapApplication()</code>. Angular ships a provider function for every major subsystem: <code>provideRouter()</code>, <code>provideHttpClient()</code>, <code>provideAnimations()</code>, <code>provideStore()</code> (NgRx), and so on &mdash; each replaces the corresponding module import cleanly.</p>
        <h3>Route-level providers</h3>
        <p>Standalone routing supports route-level providers via the <code>providers</code> array on a <code>Route</code> object. Services listed there are scoped to that route and its children &mdash; created when the route activates, destroyed when it deactivates, behaving like a lazy-loaded module's providers used to. This is how you get isolated service instances per feature area without a single module in sight.</p>
      `,
      "code": "// ---- main.ts: bootstrapping a standalone app ----\nimport { bootstrapApplication } from '@angular/platform-browser';\nimport { AppComponent } from './app/app.component';\nimport { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';\nimport { provideHttpClient, withInterceptors } from '@angular/common/http';\nimport { provideAnimations } from '@angular/platform-browser/animations';\nimport { provideStore } from '@ngrx/store';\nimport { routes } from './app/app.routes';\nimport { authInterceptor } from './app/core/interceptors/auth.interceptor';\nimport { reducers } from './app/store/reducers';\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    // Router with preloading strategy\n    provideRouter(routes, withPreloading(PreloadAllModules)),\n\n    // HttpClient with functional interceptors\n    provideHttpClient(\n      withInterceptors([authInterceptor])\n    ),\n\n    // Animations\n    provideAnimations(),\n\n    // NgRx store\n    provideStore(reducers),\n\n    // Custom app-wide providers\n    { provide: 'API_BASE_URL', useValue: 'https://api.myshop.com' }\n  ]\n}).catch(err => console.error(err));\n\n// ---- Route-level providers: scoped service instances ----\nexport const routes: Routes = [\n  {\n    path: 'checkout',\n    loadComponent: () => import('./checkout.component').then(m => m.CheckoutComponent),\n    providers: [\n      // CheckoutStateService only exists while on a /checkout route\n      CheckoutStateService,\n      PaymentService\n    ]\n  }\n];\n\n// ---- app.component.ts: the root standalone component ----\n@Component({\n  selector: 'app-root',\n  imports: [RouterOutlet, NavbarComponent, FooterComponent],\n  template: `\n    <app-navbar></app-navbar>\n    <router-outlet></router-outlet>\n    <app-footer></app-footer>\n  `\n})\nexport class AppComponent {}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">bootstrapApplication() Replaces AppModule</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-slate-50 border-2 border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">Legacy</p><div class="flex flex-col items-center gap-1"><div class="bg-indigo-50 border border-indigo-200 rounded px-2 py-1 w-full text-center">AppModule (imports, providers)</div><div class="text-slate-300">&darr;</div><div class="bg-slate-800 text-white rounded px-2 py-1 w-full text-center">bootstrapModule(AppModule)</div></div></div><div class="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">Angular 22</p><div class="flex flex-col items-center gap-1"><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center">providers: [provideRouter(), ...]</div><div class="text-slate-300">&darr;</div><div class="bg-slate-800 text-white rounded px-2 py-1 w-full text-center">bootstrapApplication(AppComponent)</div></div></div></div></div>`
    },
    {
      "id": "migrating-to-standalone",
      "title": "Migrating from NgModules to standalone",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Demolishing a building in the correct order: first clear out and relabel every room (convert declarables to standalone), then knock down walls that no longer support anything (remove empty NgModules), and only once the building is otherwise empty do you disconnect it from the old main power line (switch the bootstrap). Do it out of order &mdash; say, cut the power before rooms are cleared &mdash; and the whole thing collapses instead of coming down cleanly.</p>
          </div>
        </div>
        <p>Angular provides an automated migration schematic that converts NgModule-based components to standalone. You don't need to manually strip declarations from modules and add <code>standalone: true</code> to each file &mdash; the CLI does it for you.</p>
        <h3>The automated migration</h3>
        <p>Running <code>ng generate @angular/core:standalone</code> offers three migration modes. <strong>Convert components, directives and pipes to standalone</strong> processes every declarable in your project, moves the necessary imports into each component, and removes declarations from NgModules. <strong>Remove unnecessary NgModules</strong> deletes modules that now exist only to wrap already-standalone components. <strong>Bootstrap the application using standalone APIs</strong> converts the root <code>AppModule</code> bootstrap to <code>bootstrapApplication()</code>. Run these three steps in that order, testing after each one.</p>
        <h3>What the migration doesn't handle</h3>
        <p>The schematic covers the mechanical changes. A few things need manual attention: shared modules that bundle multiple declarations may need splitting into individual component imports; <code>forRoot()</code> module patterns (like <code>RouterModule.forRoot()</code>) should be replaced with their provider function equivalents (<code>provideRouter()</code>); and dynamic module loading in tests needs updating by hand.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Running the three migration steps out of order, or skipping straight to "remove unnecessary NgModules" before converting declarables, leaves you with dangling references to modules that no longer declare anything &mdash; a build that fails in ways that look unrelated to the migration itself. Run all three schematic modes in sequence, and run your test suite after each one, not just at the end.</p>
          </div>
        </div>
      `,
      "code": "# ---- Automated migration — run these three commands in order ----\n\n# Step 1: Convert all components, directives, pipes to standalone\nng generate @angular/core:standalone\n# Choose: \"Convert all components, directives and pipes\"\n# The CLI modifies every declarable: moves imports, drops the old flag\n\n# Step 2: Remove NgModules that are now empty wrappers\nng generate @angular/core:standalone\n# Choose: \"Remove unnecessary NgModules\"\n# Deletes modules whose only purpose was declaring now-standalone components\n\n# Step 3: Switch to bootstrapApplication()\nng generate @angular/core:standalone\n# Choose: \"Bootstrap the application using standalone APIs\"\n# Converts AppModule + platformBrowserDynamic to bootstrapApplication()\n\n# Run tests after each step:\nng test\n\n# ---- Manual migration example (if doing it by hand) ----\n\n// BEFORE: component declared in module\n// @NgModule({ declarations: [SearchBarComponent], imports: [ReactiveFormsModule] })\n// export class SearchModule {}\n\n// @Component({ selector: 'app-search-bar', templateUrl: './search-bar.component.html' })\n// export class SearchBarComponent { /* ... */ }\n\n// AFTER: standalone component\n@Component({\n  selector: 'app-search-bar',\n  imports: [ReactiveFormsModule],   // moved from module imports\n  templateUrl: './search-bar.component.html'\n})\nexport class SearchBarComponent { /* ... */ }\n// SearchModule can now be deleted entirely.",
      "language": "bash",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Migration — Run In This Order</p><div class="flex flex-wrap items-center justify-center gap-2 text-xs"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700">1. Convert declarables</div><span class="text-slate-300">&rarr;</span><div class="bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700">2. Remove empty NgModules</div><span class="text-slate-300">&rarr;</span><div class="bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700">3. bootstrapApplication()</div></div><p class="text-center text-slate-400 mt-3">ng test after every step</p></div>`
    }
  ]
});
