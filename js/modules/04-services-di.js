window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "services-di",
  "title": "Services & Dependency Injection",
  "icon": "bi bi-tools",
  "questions": [
    {
      "id": "angular-22-standard-services-upgrade",
      "title": "Angular 22 standard for services and DI",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Ordering room service by <strong>picking up the phone and asking</strong> (<code>inject()</code>) instead of requiring the exact tray to be handed to you at the door the moment you check in (constructor parameter injection). Both get you the same tray, but <code>inject()</code> works from anywhere &mdash; field initializers, functions, guards &mdash; not just the one narrow doorway of a constructor.</p>
          </div>
        </div>
        <p>The modern Angular service pattern is <strong>injector-first and signal-aware</strong>. Use <code>providedIn: 'root'</code> for tree-shakable app singletons, <code>inject()</code> for dependencies, functional providers at bootstrap, and signals when a service owns synchronous UI state. Constructor injection is still valid, but <code>inject()</code> is now the cleaner default for examples, functions, guards, interceptors, and field initialization.</p>
        <h3>Modern DI checklist</h3>
        <ul>
          <li>App setup: <code>bootstrapApplication(..., { providers: [...] })</code>.</li>
          <li>HTTP: <code>provideHttpClient()</code>, optionally with functional interceptors.</li>
          <li>Routing: <code>provideRouter(routes)</code> and route-level <code>providers</code> for feature scope.</li>
          <li>Services: <code>@Injectable({ providedIn: 'root' })</code> for singletons.</li>
          <li>State services: private writable signals plus public readonly computed values or methods.</li>
          <li>Async data: consider <code>resource()</code> or <code>httpResource()</code> &mdash; both stable in Angular 22 &mdash; when a service's whole job is loading and exposing async data as a signal.</li>
        </ul>
      `,
      "code": `import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly itemsState = signal<CartItem[]>([]);

  readonly items = this.itemsState.asReadonly();
  readonly itemCount = computed(() =>
    this.items().reduce((total, item) => total + item.quantity, 0)
  );

  add(item: CartItem): void {
    this.itemsState.update(items => [...items, item]);
  }

  loadSavedCart() {
    return this.http.get<CartItem[]>('/api/cart');
  }
}`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Modern Service Shape</p><div class=\"grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-indigo-700\">providedIn: 'root'</p><p class=\"text-slate-500 mt-1\">tree-shakable singleton</p></div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-emerald-700\">inject()</p><p class=\"text-slate-500 mt-1\">dependency lookup</p></div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-amber-700\">private signal</p><p class=\"text-slate-500 mt-1\">owned mutable state</p></div><div class=\"bg-purple-50 border border-purple-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-purple-700\">public computed</p><p class=\"text-slate-500 mt-1\">read-only derived value</p></div></div></div>"
    },
    {
      "id": "what-is-service",
      "title": "What is a service in Angular?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A restaurant's <strong>kitchen versus its dining room</strong>. Components are the dining room &mdash; where customers (users) sit, look at menus, and interact. Services are the kitchen &mdash; where the actual work happens: sourcing ingredients (API calls), keeping a shared pantry inventory (shared state), and following recipes (business logic). Customers never walk into the kitchen; they just get served the result.</p>
          </div>
        </div>
        <p>In Angular, a <strong>service</strong> is a plain TypeScript class whose job is to hold logic, data, or utilities that do not belong in a component. Components are responsible for the view &mdash; what the user sees and interacts with. Services are responsible for everything else: talking to a server, storing shared state, performing calculations, handling authentication, or logging.</p>
        <p>Without services you would be forced to put API call logic directly inside a component class. That component becomes hard to test (you cannot call the HTTP endpoint without rendering the component), impossible to reuse (another component that needs the same data must duplicate the call), and messy to maintain. Moving that logic to a service solves all three problems at once.</p>
        <h3>A concrete example</h3>
        <p>Imagine a shopping cart. Both the header component (shows item count) and the cart page component (shows full list) need access to the same cart data. If each component fetches independently, they get out of sync. A <code>CartService</code> holds the cart state in one place, and both components inject it. Now there is one source of truth, and updating the cart in one place automatically reflects everywhere.</p>
        <h3>Services are created by Angular's DI system</h3>
        <p>You do not call <code>new CartService()</code> yourself. You declare it as a dependency via <code>inject()</code> or a constructor parameter, and Angular creates it (or reuses an existing instance) and hands it to you. This is dependency injection, which the next question covers in detail.</p>
      `,
      "code": `import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
}

// providedIn: 'root' registers one singleton instance for the whole app
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/products';

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(\`\${this.apiUrl}/\${id}\`);
  }
}

// ---- Component stays focused on the view ----
@Component({
  selector: 'app-product-list',
  imports: [AsyncPipe, NgFor],
  template: \`
    <li *ngFor="let p of products$ | async">{{ p.name }} — \${{ p.price }}</li>
  \`
})
export class ProductListComponent {
  private productService = inject(ProductService);
  products$ = this.productService.getAll();
}`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Dining Room vs Kitchen</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3\"><p class=\"font-bold text-indigo-700 text-center mb-2\">Component (dining room)</p><ul class=\"space-y-1 text-slate-600\"><li>&bull; template + view state</li><li>&bull; user interaction</li><li>&bull; delegates the real work</li></ul></div><div class=\"bg-amber-50 border-2 border-amber-200 rounded-xl p-3\"><p class=\"font-bold text-amber-700 text-center mb-2\">Service (kitchen)</p><ul class=\"space-y-1 text-slate-600\"><li>&bull; API calls</li><li>&bull; shared state</li><li>&bull; business logic, reusable</li></ul></div></div></div>"
    },
    {
      "id": "what-is-di",
      "title": "What is dependency injection (DI)?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Ordering electricity from the <strong>power grid</strong> instead of building your own generator in the backyard. You don't care how the electricity is produced, wired, or maintained &mdash; you just plug in and it's there. If the utility company switches from coal to solar tomorrow, your house doesn't need rewiring. That's DI: the class plugs into "give me a Logger" and doesn't care how or where the Logger is built.</p>
          </div>
        </div>
        <p><strong>Dependency Injection (DI)</strong> is a design pattern where a class receives the objects it depends on rather than creating them itself. Angular has a built-in DI framework that is a fundamental part of how the entire platform works &mdash; routing, HTTP, forms, and your own code all use it.</p>
        <h3>The problem it solves</h3>
        <p>Without DI, if <code>OrderComponent</code> needs an <code>OrderService</code>, it would do <code>const service = new OrderService()</code>. This creates tight coupling: the component now knows the concrete class name, must supply all of <code>OrderService</code>'s own constructor arguments, and cannot be tested without running a real <code>OrderService</code>. If <code>OrderService</code> is later replaced with a <code>CachedOrderService</code>, every component that did <code>new OrderService()</code> must be updated manually.</p>
        <h3>How Angular's DI works</h3>
        <p>You declare a dependency with <code>inject()</code> or by listing it as a constructor parameter. Modern examples usually prefer <code>inject()</code> because it works naturally in standalone APIs, functional guards, functional interceptors, and field initializers. Angular reads the type at the injection call site and asks the injector to resolve it. The injector looks up a registered provider, creates the instance if it does not already exist, and passes it in. The class never knows how or where its dependencies come from.</p>
        <h3>Why it matters for testing</h3>
        <p>DI makes testing clean. In a unit test you can provide a fake or mock service in place of the real one. The component under test receives the mock through the exact same injection point &mdash; it cannot tell the difference. You can test every code path without touching a real server.</p>
      `,
      "code": `// Without DI — tightly coupled, untestable:
class OrderComponent {
  private service = new OrderService(new HttpClient(...)); // must wire everything manually
}

// ============================================

// With Angular DI — loosely coupled, testable:
@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>('/api/orders');
  }
}

@Component({
  selector: 'app-orders',
  imports: [AsyncPipe, NgFor],
  template: '<li *ngFor="let o of orders$ | async">{{ o.id }}</li>'
})
export class OrdersComponent {
  // Angular creates and provides OrderService automatically
  orders$ = inject(OrderService).getOrders();
}

// ---- In a unit test, swap the real service for a fake ----
TestBed.configureTestingModule({
  providers: [
    { provide: OrderService, useValue: { getOrders: () => of([]) } }
  ]
});`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Without DI vs With DI</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-rose-50 border-2 border-rose-200 rounded-xl p-3\"><p class=\"font-bold text-rose-700 text-center mb-2\">new OrderService()</p><p class=\"text-slate-600 text-center\">component builds its own dependency &mdash; tightly coupled, hard to mock</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">inject(OrderService)</p><p class=\"text-slate-600 text-center\">injector supplies it &mdash; loosely coupled, trivially mockable in tests</p></div></div></div>"
    },
    {
      "id": "what-is-injector",
      "title": "What is the Injector in Angular?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>librarian with a card catalog</strong>. You don't wander the shelves yourself &mdash; you hand the librarian a request ("I need <em>UserService</em>"), and she checks the catalog (the token-to-provider map), finds the book, and if it's the reference copy that never leaves the desk (a singleton), she just hands you the same copy everyone else uses.</p>
          </div>
        </div>
        <p>The <strong>injector</strong> is the object that Angular uses to resolve dependencies at runtime. When Angular creates a component, directive, or service that declares dependencies, it delegates to the injector to look up and supply those dependencies. You rarely interact with the injector directly &mdash; Angular calls it for you &mdash; but understanding it explains many DI behaviors.</p>
        <h3>How the injector resolves a dependency</h3>
        <p>The injector holds a map from <strong>tokens</strong> to <strong>providers</strong>. A token is usually a class reference (like <code>UserService</code>), but can also be an <code>InjectionToken</code> for non-class values like configuration objects. When a class asks for <code>UserService</code>, the injector looks up the token, finds the registered factory or class, creates an instance if one does not already exist, caches it, and returns it.</p>
        <h3>The injector tree</h3>
        <p>Angular does not have one global injector. It has a <strong>tree of injectors</strong> that mirrors the component tree. If a dependency is not found in the component's own injector, Angular walks up to the parent component's injector, then to the route injector, and finally to the root injector. This is called the injector hierarchy and it is what makes scoped services possible.</p>
        <h3>Programmatic access</h3>
        <p>You can access the injector programmatically by injecting <code>Injector</code> itself, or by using the standalone <code>inject()</code> function at class construction time. The <code>inject()</code> function is the modern preferred approach because it works without constructor parameter decorators and integrates cleanly with standalone components, route providers, guards, interceptors, and signal-based state.</p>
      `,
      "code": `import { inject, InjectionToken, Injector } from '@angular/core';

// ---- InjectionToken for a non-class value ----
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

// ---- Providing the token in bootstrapApplication ----
// bootstrapApplication(AppComponent, {
//   providers: [{ provide: API_BASE_URL, useValue: 'https://api.example.com' }]
// });

@Injectable({ providedIn: 'root' })
export class DataService {
  // inject() reads the token from the current injector context
  private readonly baseUrl = inject(API_BASE_URL);

  constructor(private http: HttpClient) {}

  fetchUsers(): Observable<any[]> {
    return this.http.get<any[]>(\`\${this.baseUrl}/users\`);
  }
}

// ---- Using Injector programmatically (less common, for dynamic scenarios) ----
@Component({ selector: 'app-dynamic', template: '' })
export class DynamicComponent {
  private injector = inject(Injector);

  loadService(): void {
    const ds = this.injector.get(DataService);
    ds.fetchUsers().subscribe(console.log);
  }
}`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Token &rarr; Provider &rarr; Instance</p><div class=\"flex flex-wrap items-center justify-center gap-2 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700\">inject(UserService)</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700\">injector looks up token</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700\">found in cache? reuse</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-rose-50 border-2 border-rose-200 rounded-lg px-3 py-2 text-center font-semibold text-rose-700\">else create &amp; cache</div></div></div>"
    },
    {
      "id": "what-are-providers",
      "title": "What are providers?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>vending machine's restocking instructions</strong>. "Slot A dispenses a fresh Coke" (<code>useClass</code>) versus "Slot B always dispenses this exact can I already opened" (<code>useValue</code>) versus "Slot C calls the warehouse and decides what to send based on the time of day" (<code>useFactory</code>) versus "Slot D is secretly wired to the same output as Slot A" (<code>useExisting</code>). Different recipes, same vending mechanism.</p>
          </div>
        </div>
        <p>A <strong>provider</strong> is a recipe that tells Angular's injector how to create or supply a value when a particular token is requested. Without a provider, the injector does not know what to create &mdash; and Angular will throw a "NullInjectorError" at runtime.</p>
        <h3>useClass — provide a different class</h3>
        <p>The most common form. <code>{ provide: LoggerService, useClass: ConsoleLoggerService }</code> tells Angular to use <code>ConsoleLoggerService</code> whenever something asks for <code>LoggerService</code>. This is the backbone of the strategy pattern in Angular &mdash; swap implementations without changing the consumer.</p>
        <h3>useValue — provide a static value</h3>
        <p>For configuration constants, feature flags, or environment objects. <code>{ provide: APP_CONFIG, useValue: { apiUrl: '/api', timeout: 5000 } }</code>. The value is returned as-is, no instantiation. You pair this with an <code>InjectionToken</code> to keep type safety.</p>
        <h3>useFactory — provide a computed value</h3>
        <p>When the value to inject depends on runtime conditions or must be constructed from other services. You provide a function that returns the value, and you list any dependencies in the <code>deps</code> array. Angular calls your factory with those dependencies injected.</p>
        <h3>useExisting — alias one token to another</h3>
        <p>Creates an alias so two tokens resolve to the same instance. If you have both <code>OldService</code> and <code>NewService</code> and want code that asks for <code>OldService</code> to silently get the <code>NewService</code> instance, use <code>{ provide: OldService, useExisting: NewService }</code>. Unlike <code>useClass</code>, this reuses the exact same instance rather than creating a second one.</p>
      `,
      "code": `import { InjectionToken } from '@angular/core';

// ---- useClass: swap implementations ----
abstract class Logger { abstract log(msg: string): void; }

@Injectable()
class ConsoleLogger extends Logger {
  log(msg: string) { console.log('[Console]', msg); }
}

@Injectable()
class RemoteLogger extends Logger {
  log(msg: string) { /* send to logging server */ }
}

// In production, swap to RemoteLogger without changing any component:
// { provide: Logger, useClass: RemoteLogger }

// ---- useValue: static configuration ----
export const APP_CONFIG = new InjectionToken<{ apiUrl: string; timeout: number }>('APP_CONFIG');

const appConfig = { apiUrl: 'https://api.example.com', timeout: 5000 };
// { provide: APP_CONFIG, useValue: appConfig }

// ---- useFactory: computed at runtime ----
// { provide: Logger,
//   useFactory: (env: EnvironmentService) => env.isProd ? new RemoteLogger() : new ConsoleLogger(),
//   deps: [EnvironmentService] }

// ---- useExisting: alias ----
// { provide: OldAuthService, useExisting: NewAuthService }
// Both tokens now resolve to the same NewAuthService singleton

// ---- Providing everything at bootstrapApplication ----
bootstrapApplication(AppComponent, {
  providers: [
    { provide: Logger, useClass: ConsoleLogger },
    { provide: APP_CONFIG, useValue: appConfig },
    provideHttpClient(),
    provideRouter(routes)
  ]
});`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Four Provider Recipes</p><div class=\"grid grid-cols-2 gap-3 max-w-lg mx-auto text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-3\"><p class=\"font-bold text-indigo-700 font-mono\">useClass</p><p class=\"text-slate-500 mt-1\">swap implementation</p></div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-3\"><p class=\"font-bold text-emerald-700 font-mono\">useValue</p><p class=\"text-slate-500 mt-1\">static config</p></div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-3\"><p class=\"font-bold text-amber-700 font-mono\">useFactory</p><p class=\"text-slate-500 mt-1\">computed at runtime</p></div><div class=\"bg-rose-50 border border-rose-200 rounded-lg p-3\"><p class=\"font-bold text-rose-700 font-mono\">useExisting</p><p class=\"text-slate-500 mt-1\">alias to another token</p></div></div></div>"
    },
    {
      "id": "what-is-hierarchical-di",
      "title": "What is hierarchical dependency injection?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Asking a question in a <strong>large family household</strong>. You ask your roommate first; if they don't know, you ask your floor; if the floor doesn't know, you ask the building manager. Most questions get answered locally. But if your specific room has its own rule that overrides the building-wide rule (a component's own <code>providers</code>), that local rule wins for you and everyone who shares your room &mdash; without ever touching the building-wide rule for other rooms.</p>
          </div>
        </div>
        <p><strong>Hierarchical DI</strong> means Angular maintains not one global injector but a <em>tree</em> of injectors that mirrors the application structure. Each component can have its own injector, and that injector is a child of its parent component's injector, going all the way up to the root injector created when the application bootstraps.</p>
        <h3>How resolution works</h3>
        <p>When a component asks for a service, Angular's injector first checks its own providers array. If it finds a registration there, it uses it. If not, it moves to the parent component's injector, then the grandparent, and so on up to root. The first injector that has the provider wins. This means a service registered at root is available everywhere, but a component can override that registration for itself and all its descendants by providing it in its own <code>providers</code> array.</p>
        <h3>Practical example: isolated form state</h3>
        <p>Imagine a <code>FormStateService</code> that tracks the dirty/pristine state of a form. If you provide it at root with <code>providedIn: 'root'</code>, every form in the app shares one instance &mdash; opening form A would mark form B as dirty. Instead, provide it in the <code>providers</code> array of each form component. Each form component gets its own isolated instance, with independent state, and Angular destroys that instance when the component is destroyed.</p>
        <h3>Root vs route vs component scope</h3>
        <p>In modern standalone Angular, the three main scopes are: the <strong>root injector</strong> (for app-wide singletons), <strong>route-level providers</strong> (for services scoped to a lazy-loaded route subtree), and <strong>component-level providers</strong> (for per-component instances). Lazy-loaded routes get their own child injector, so a service provided inside a lazy route is not available outside it.</p>
      `,
      "code": `// ---- Root-scoped singleton: one instance for the whole app ----
@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser: User | null = null;
}

// ---- Component-scoped instance: isolated per component subtree ----
@Injectable() // no providedIn — must be listed in providers
export class FormStateService {
  isDirty = false;
  markDirty() { this.isDirty = true; }
  reset() { this.isDirty = false; }
}

@Component({
  selector: 'app-user-form',
  // Each instance of app-user-form gets its own FormStateService
  providers: [FormStateService],
  template: \`
    <form (ngSubmit)="submit()">
      <input (input)="formState.markDirty()" />
      <button type="submit">Save</button>
      <p *ngIf="formState.isDirty">You have unsaved changes.</p>
    </form>
  \`
})
export class UserFormComponent {
  formState = inject(FormStateService);

  submit() {
    // save logic...
    this.formState.reset();
  }
}

// Two <app-user-form> instances on screen each have their own
// FormStateService — marking one dirty does not affect the other.`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Injector Tree Lookup</p><div class=\"flex flex-col items-center gap-2 text-xs font-mono\"><div class=\"bg-slate-800 text-white rounded-lg px-3 py-1.5\">Root Injector</div><div class=\"w-px h-3 bg-slate-300\"></div><div class=\"bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5\">Route Injector</div><div class=\"w-px h-3 bg-slate-300\"></div><div class=\"bg-indigo-50 border-2 border-indigo-300 rounded-lg px-3 py-1.5 text-indigo-700\">UserFormComponent Injector<br><span class=\"font-sans text-[10px] text-slate-500\">own FormStateService</span></div></div><p class=\"text-center text-slate-400 text-xs mt-3\">lookup starts local, walks upward until a provider is found</p></div>"
    },
    {
      "id": "what-is-injectable",
      "title": "What is the @Injectable decorator?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Registering a business with the <strong>chamber of commerce</strong>. Without registration, the town directory has no idea your shop exists and can't send customers your way. <code>@Injectable({ providedIn: 'root' })</code> is the registration form that tells Angular's directory "I exist, here's my catalog listing, and don't bother listing me if nobody ever visits" &mdash; that last part is tree-shaking.</p>
          </div>
        </div>
        <p>The <code>@Injectable()</code> decorator tells Angular two things: first, that this class is eligible to participate in Angular's DI system (it can be injected and can declare its own dependencies), and second &mdash; through the <code>providedIn</code> option &mdash; where it should be registered.</p>
        <h3>Why it is needed</h3>
        <p>Angular's compiler needs a decorator on the class to generate the metadata that describes how to construct it and what it depends on. <code>@Injectable()</code> is that decorator for service classes. Without it, Angular cannot reliably resolve constructor dependencies. If you write a service that has no constructor dependencies itself, Angular may not strictly require <code>@Injectable()</code>, but the convention is to always add it for consistency and future safety.</p>
        <h3>providedIn options</h3>
        <p><code>providedIn: 'root'</code> registers the service in the application root injector, creating an app-wide singleton. This is the recommended default. <code>providedIn: 'any'</code> creates a separate instance per lazy-loaded chunk. You can also pass a specific component class, though component-level scoping via the component's <code>providers</code> array is more common in standalone Angular.</p>
        <h3>Tree-shakability</h3>
        <p>A key benefit of <code>providedIn: 'root'</code> is that Angular's build tooling can tree-shake the service out of the bundle if nothing in the application ever injects it. This is not possible with NgModule-based <code>providers</code> arrays because the module eagerly registers everything listed there regardless of usage.</p>
      `,
      "code": `import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenKey = 'auth_token';

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>('/api/auth/login', { email, password })
      .pipe(
        catchError(err => throwError(() => new Error(err.error?.message ?? 'Login failed')))
      );
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}

// Injected anywhere in the app:
// private auth = inject(AuthService);`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">providedIn Options</p><div class=\"grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-indigo-700 font-mono\">'root'</p><p class=\"text-slate-500 mt-1\">one app-wide singleton, tree-shakable</p></div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-emerald-700 font-mono\">'any'</p><p class=\"text-slate-500 mt-1\">separate instance per lazy chunk</p></div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-amber-700 font-mono\">component providers</p><p class=\"text-slate-500 mt-1\">per-component instance</p></div></div></div>"
    },
    {
      "id": "singleton-vs-instance-services",
      "title": "Singleton vs instance services",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>shared office printer versus a personal notebook</strong>. One printer at root scope serves the entire floor &mdash; everyone prints to the same machine and sees the same queue. A personal notebook provided per desk (per component) is private: writing in your notebook never appears in your neighbor's. Same class, same design of "object that holds state" &mdash; the difference is purely where it's registered.</p>
          </div>
        </div>
        <p>In Angular, whether a service is a <strong>singleton</strong> (one instance shared across the whole app) or an <strong>instance service</strong> (a separate instance per consumer) depends entirely on <em>where it is provided</em>. The service class itself is the same in both cases &mdash; only the provider location differs.</p>
        <h3>Singleton services</h3>
        <p>A service provided at the root level (<code>providedIn: 'root'</code> or listed in <code>bootstrapApplication</code>'s providers array) is created once when first injected and then reused for the entire application lifetime. Every component that injects it gets the same object. This is ideal for things like authentication state, notification queues, or a shopping cart &mdash; state that genuinely belongs to the application as a whole, not to any one component.</p>
        <h3>Instance services</h3>
        <p>When you list a service in a component's <code>providers</code> array, Angular creates a new instance of that service for that component's injector. All descendants of that component share the instance, but it is isolated from instances in sibling subtrees. When the component is destroyed, Angular destroys the service instance too, which cleans up any subscriptions or timers the service was holding. This is ideal for form state, per-dialog data, or any service whose state should not leak between independent UI panels.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">If you add a service to both <code>providedIn: 'root'</code> and a component's <code>providers</code> array, the component and its children get a <strong>separate instance</strong> from the root singleton &mdash; the component's local injector shadows the root one for its subtree. This trips up many developers who expect the root singleton to always win.</p>
          </div>
        </div>
      `,
      "code": `// ---- Singleton: shared app-wide ----
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private messages: string[] = [];

  add(msg: string) { this.messages.push(msg); }
  getAll() { return this.messages; }
}

// Both components below get the SAME NotificationService instance.
// Adding a notification in HeaderComponent shows up in FooterComponent.

@Component({ selector: 'app-header', template: '...' })
export class HeaderComponent {
  private ns = inject(NotificationService);
  notify() { this.ns.add('Header says hi'); }
}

@Component({ selector: 'app-footer', template: '...' })
export class FooterComponent {
  private ns = inject(NotificationService);
  count = this.ns.getAll().length; // sees messages added by HeaderComponent
}

// ================================================================

// ---- Instance: isolated per component ----
@Injectable() // no providedIn — must be listed in providers
export class PaginationService {
  page = 1;
  nextPage() { this.page++; }
}

@Component({
  selector: 'app-user-table',
  providers: [PaginationService], // own instance
  template: '...'
})
export class UserTableComponent {
  pagination = inject(PaginationService);
}

@Component({
  selector: 'app-product-table',
  providers: [PaginationService], // completely separate instance
  template: '...'
})
export class ProductTableComponent {
  pagination = inject(PaginationService);
  // Navigating to page 3 here does NOT affect UserTableComponent's pagination
}`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Shared Printer vs Personal Notebook</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3\"><p class=\"font-bold text-indigo-700 text-center mb-2\">Singleton (root)</p><div class=\"flex justify-center gap-2\"><div class=\"bg-white border border-indigo-200 rounded px-2 py-1\">Header</div><div class=\"bg-white border border-indigo-200 rounded px-2 py-1\">Footer</div></div><p class=\"text-center text-slate-500 mt-2\">both point to the SAME instance</p></div><div class=\"bg-amber-50 border-2 border-amber-200 rounded-xl p-3\"><p class=\"font-bold text-amber-700 text-center mb-2\">Instance (component providers)</p><div class=\"flex justify-center gap-2\"><div class=\"bg-white border border-amber-200 rounded px-2 py-1\">UserTable &rarr; own copy</div><div class=\"bg-white border border-amber-200 rounded px-2 py-1\">ProductTable &rarr; own copy</div></div><p class=\"text-center text-slate-500 mt-2\">isolated, independent state</p></div></div></div>"
    },
    {
      "id": "di-resolution-modifiers-and-multi-providers",
      "title": "DI resolution modifiers and multi providers",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>suggestion box that multiple departments drop notes into</strong>. A normal provider is one person leaving one note that overwrites the last. A <strong>multi provider</strong> is the actual suggestion box design &mdash; every department's note gets added to the pile, and whoever opens the box at the end of the day (Angular) receives the whole array, not just the last note dropped in.</p>
          </div>
        </div>
        <p>Interviewers often ask how Angular decides <em>which</em> provider to use when the same token exists in multiple places. DI resolution modifiers let you control that lookup. In modern Angular you can pass options to <code>inject()</code> instead of using constructor decorators.</p>
        <h3>Resolution modifiers</h3>
        <ul>
          <li><code>optional: true</code> returns <code>null</code> instead of throwing when a provider is missing.</li>
          <li><code>self: true</code> checks only the current injector.</li>
          <li><code>skipSelf: true</code> starts lookup at the parent injector.</li>
          <li><code>host: true</code> stops lookup at the host boundary.</li>
        </ul>
        <h3>Multi providers</h3>
        <p>A normal provider gives one value for a token. A <strong>multi provider</strong> lets many providers contribute values to the same token, and Angular injects them all as an array. Angular uses this pattern internally for HTTP interceptors and form validators. Use it yourself for plugin-style extension points such as dashboard widgets, menu items, or logging sinks.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">If one provider for a token uses <code>multi: true</code>, <strong>every</strong> provider for that same token must also be multi. Mixing a normal provider and a multi provider on the same token is invalid and will produce confusing runtime behavior or errors &mdash; decide up front whether a token is "one value" or "a contributed list" and stay consistent.</p>
          </div>
        </div>
      `,
      "code": `import { InjectionToken, inject } from '@angular/core';

export interface MenuContribution {
  label: string;
  route: string;
  order: number;
}

export const MENU_ITEMS = new InjectionToken<MenuContribution[]>('MENU_ITEMS');

// Feature A contributes menu items.
export const adminMenuProvider = {
  provide: MENU_ITEMS,
  multi: true,
  useValue: { label: 'Admin', route: '/admin', order: 20 }
};

// Feature B contributes another item to the same token.
export const reportsMenuProvider = {
  provide: MENU_ITEMS,
  multi: true,
  useValue: { label: 'Reports', route: '/reports', order: 10 }
};

@Injectable({ providedIn: 'root' })
export class MenuService {
  // Optional because some apps may not register any contributions.
  private readonly items = inject(MENU_ITEMS, { optional: true }) ?? [];

  readonly visibleItems = [...this.items].sort((a, b) => a.order - b.order);
}

// Resolution modifier examples:
const localCache = inject(CacheService, { self: true, optional: true });
const parentTheme = inject(ThemeService, { skipSelf: true });

// Bootstrap or route-level providers:
bootstrapApplication(AppComponent, {
  providers: [adminMenuProvider, reportsMenuProvider]
});`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Multi Provider: One Token, Many Contributions</p><div class=\"flex flex-col items-center gap-2 text-xs\"><div class=\"flex gap-3\"><div class=\"bg-indigo-50 border border-indigo-200 rounded px-3 py-1.5\">Admin menu item</div><div class=\"bg-emerald-50 border border-emerald-200 rounded px-3 py-1.5\">Reports menu item</div></div><span class=\"text-slate-300\">&darr; both feed MENU_ITEMS</span><div class=\"bg-slate-800 text-white rounded-lg px-4 py-2 font-mono\">inject(MENU_ITEMS) === [ Admin, Reports ]</div></div></div>"
    }
  ]
});
