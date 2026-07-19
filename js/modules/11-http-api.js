window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "http-api",
  "title": "HTTP & API",
  "icon": "bi bi-cloud-arrow-down",
  "questions": [
    {
      id: "angular-22-standard-http-upgrade",
      title: "Angular 22 standard for HTTP and APIs",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Setting up a central mail-sorting facility once for the whole company, rather than letting every department run its own ad hoc mailroom. <code>provideHttpClient()</code> builds that one facility. Interceptors are the automatic stamping machines every outgoing envelope and every incoming parcel rolls through &mdash; no clerk has to remember to attach the auth stamp by hand.</p>
          </div>
        </div>
        <p>Modern Angular HTTP setup is <strong>functional and standalone</strong>. Register HTTP once with <code>provideHttpClient()</code>, use <code>inject(HttpClient)</code> in services, prefer functional interceptors, and keep API calls typed. Components should consume clean service APIs rather than building URLs and error handling inline.</p>
        <h3>Modern HTTP checklist</h3>
        <ul>
          <li>Use <code>provideHttpClient()</code> at bootstrap.</li>
          <li>Use <code>withInterceptors()</code> for functional interceptors.</li>
          <li>Use typed DTOs and return typed Observables from services.</li>
          <li>Reach for <code>httpResource()</code>, <code>resource()</code>, or <code>rxResource()</code> where signal-based loading state fits the component better than a raw Observable &mdash; all three are stable, production-ready APIs in Angular 22.</li>
          <li>Test HTTP services with provider-based HTTP testing utilities rather than legacy module setup in new code.</li>
        </ul>
      `,
      code: "import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';\nimport { bootstrapApplication } from '@angular/platform-browser';\n\nexport const authInterceptor: HttpInterceptorFn = (req, next) => {\n  const token = inject(AuthService).token();\n  return next(\n    token\n      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })\n      : req\n  );\n};\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    provideHttpClient(withInterceptors([authInterceptor]))\n  ]\n});\n\n@Injectable({ providedIn: 'root' })\nexport class UsersApi {\n  private readonly http = inject(HttpClient);\n\n  getAll() {\n    return this.http.get<UserDto[]>('/api/users');\n  }\n}",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Angular 22 HTTP Stack</p><div class=\"flex flex-col items-center gap-2 text-xs\"><div class=\"bg-slate-800 text-white rounded-lg px-3 py-1.5 font-mono\">provideHttpClient(withInterceptors([...]))</div><div class=\"text-slate-300\">&darr;</div><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5\">inject(HttpClient) in a service</div><div class=\"text-slate-300\">&darr;</div><div class=\"flex gap-3\"><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5\">Observable-based calls</div><div class=\"bg-amber-50 border-2 border-amber-300 rounded-lg px-3 py-1.5\">httpResource() — signal-based</div></div></div></div>"
    },
    {
      "id": "what-is-httpclient",
      "title": "What is HttpClient?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Calling the hotel concierge instead of walking down to the kitchen yourself. You could fetch the raw ingredients directly (the browser's native <code>fetch</code>), but the concierge desk (<code>HttpClient</code>) already speaks your language, hands you back a typed, labelled tray (typed Observables), and lets security check every order on the way out and every delivery on the way back in (interceptors) &mdash; all without you lifting a finger.</p>
          </div>
        </div>
        <p><strong>HttpClient</strong> is Angular's built-in service for making HTTP requests to backend APIs. It wraps the browser's networking primitives and gives you a clean, Observable-based API with TypeScript support.</p>
        <h3>Why not use fetch() directly?</h3>
        <p>You could, but HttpClient gives you several things for free:</p>
        <ul>
          <li><strong>Observable-based</strong> &mdash; every request returns an Observable, which integrates naturally with RxJS operators like <code>switchMap</code>, <code>catchError</code>, <code>retry</code></li>
          <li><strong>Type safety</strong> &mdash; you can pass a generic type parameter and get a typed response</li>
          <li><strong>Interceptors</strong> &mdash; middleware to add auth headers, log requests, handle errors globally</li>
          <li><strong>Automatic JSON parsing</strong> &mdash; response bodies are parsed as JSON by default</li>
          <li><strong>Cancellable</strong> &mdash; unsubscribing cancels the pending HTTP request</li>
          <li><strong>Testable</strong> &mdash; Angular provides provider-based HTTP testing utilities to mock requests</li>
        </ul>
        <h3>Setup</h3>
        <p>Register HttpClient globally by calling <code>provideHttpClient()</code> in <code>main.ts</code>. Then inject <code>HttpClient</code> into any service with <code>inject(HttpClient)</code>.</p>
      `,
      "code": "// main.ts — register once for the whole app\nimport { bootstrapApplication } from '@angular/platform-browser';\nimport { provideHttpClient, withInterceptors } from '@angular/common/http';\nimport { AppComponent } from './app/app.component';\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    provideHttpClient()   // makes HttpClient injectable everywhere\n    // provideHttpClient(withInterceptors([authInterceptor]))  ← with interceptors\n  ]\n});\n\n// users.service.ts — inject and use\nimport { Injectable, inject } from '@angular/core';\nimport { HttpClient } from '@angular/common/http';\nimport { Observable } from 'rxjs';\n\nexport interface User { id: number; name: string; email: string; }\n\n@Injectable({ providedIn: 'root' })\nexport class UsersService {\n  private readonly http = inject(HttpClient);\n  private apiUrl = 'https://api.example.com/users';\n\n  // Generic type parameter <User[]> tells TypeScript what the response looks like\n  getAll(): Observable<User[]> {\n    return this.http.get<User[]>(this.apiUrl);\n  }\n\n  getById(id: number): Observable<User> {\n    return this.http.get<User>(`${this.apiUrl}/${id}`);\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">HttpClient vs raw fetch()</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-slate-50 border border-slate-200 rounded-xl p-3\"><p class=\"font-bold text-slate-700 text-center mb-2\">fetch()</p><ul class=\"text-slate-600 space-y-1\"><li>Promise-based</li><li>No interceptors</li><li>Manual JSON parsing</li></ul></div><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3\"><p class=\"font-bold text-indigo-700 text-center mb-2\">HttpClient</p><ul class=\"text-slate-600 space-y-1\"><li>Observable-based, cancellable</li><li>Interceptors built in</li><li>Typed, auto-parsed JSON</li></ul></div></div></div>"
    },
    {
      "id": "how-to-make-http-requests",
      "title": "How to make HTTP requests (GET, POST, PUT, DELETE)?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Ordering at a restaurant counter. <strong>GET</strong> is asking to see the menu &mdash; you're only reading, nothing changes. <strong>POST</strong> is placing a brand-new order &mdash; a new ticket enters the kitchen. <strong>PUT</strong>/<strong>PATCH</strong> is calling the waiter back to change your existing order, either replacing it entirely or just swapping one item. <strong>DELETE</strong> is cancelling the order outright.</p>
          </div>
        </div>
        <p>HttpClient exposes one method per HTTP verb. Each method returns a cold Observable &mdash; nothing happens until you call <code>.subscribe()</code> (or use the <code>async</code> pipe in a template).</p>
        <h3>GET — fetch data</h3>
        <p>Use for reading data. Pass a generic type to get a typed response. You can also pass query parameters via the <code>params</code> option.</p>
        <h3>POST — create new data</h3>
        <p>Use for creating a new resource. The second argument is the request body &mdash; Angular serializes it to JSON automatically.</p>
        <h3>PUT / PATCH — update data</h3>
        <p><code>PUT</code> replaces the entire resource. <code>PATCH</code> applies a partial update. Use whichever your API expects.</p>
        <h3>DELETE — remove data</h3>
        <p>Sends a DELETE request. Many APIs return the deleted item or just a 204 No Content &mdash; adjust the type accordingly.</p>
      `,
      "code": "import { HttpClient, HttpParams } from '@angular/common/http';\nimport { Observable } from 'rxjs';\n\n@Injectable({ providedIn: 'root' })\nexport class ProductsService {\n  private url = 'https://api.example.com/products';\n  constructor(private http: HttpClient) {}\n\n  // ─── GET with query parameters ──────────────────────────────\n  getAll(category?: string, page = 1): Observable<Product[]> {\n    let params = new HttpParams().set('page', page);\n    if (category) params = params.set('category', category);\n    return this.http.get<Product[]>(this.url, { params });\n    // Sends: GET /products?page=1&category=electronics\n  }\n\n  getById(id: number): Observable<Product> {\n    return this.http.get<Product>(`${this.url}/${id}`);\n  }\n\n  // ─── POST — create ───────────────────────────────────────────\n  create(product: Omit<Product, 'id'>): Observable<Product> {\n    return this.http.post<Product>(this.url, product);\n    // Body is automatically serialized to JSON\n    // Content-Type: application/json is set automatically\n  }\n\n  // ─── PUT — full update ───────────────────────────────────────\n  update(id: number, product: Product): Observable<Product> {\n    return this.http.put<Product>(`${this.url}/${id}`, product);\n  }\n\n  // ─── PATCH — partial update ──────────────────────────────────\n  patch(id: number, changes: Partial<Product>): Observable<Product> {\n    return this.http.patch<Product>(`${this.url}/${id}`, changes);\n  }\n\n  // ─── DELETE ──────────────────────────────────────────────────\n  delete(id: number): Observable<void> {\n    return this.http.delete<void>(`${this.url}/${id}`);\n  }\n}\n\n// Component usage:\nthis.productsService.create({ name: 'Laptop', price: 999 }).subscribe({\n  next:  (created) => console.log('Created:', created),\n  error: (err)     => console.error('Failed:', err)\n});",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">HTTP Verbs at a Glance</p><div class=\"grid grid-cols-2 md:grid-cols-4 gap-2 text-xs\"><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center\"><p class=\"font-bold text-emerald-700\">GET</p><p class=\"text-slate-500 mt-1\">read the menu</p></div><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-center\"><p class=\"font-bold text-indigo-700\">POST</p><p class=\"text-slate-500 mt-1\">place new order</p></div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-2 text-center\"><p class=\"font-bold text-amber-700\">PUT / PATCH</p><p class=\"text-slate-500 mt-1\">amend the order</p></div><div class=\"bg-rose-50 border border-rose-200 rounded-lg p-2 text-center\"><p class=\"font-bold text-rose-700\">DELETE</p><p class=\"text-slate-500 mt-1\">cancel the order</p></div></div></div>"
    },
    {
      "id": "what-is-httpclientmodule",
      "title": "How to set up HttpClient (Module vs Standalone)?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A building's water main. You connect it once at the point where the building meets the street, and every room in the building draws from that one supply. Registering <code>provideHttpClient()</code> in a feature area on top of the root one is like a plumber running a second, separate main into the basement &mdash; now you've got two independent supplies that don't know about each other, and any interceptor attached to the wrong one silently misses half the building's requests.</p>
          </div>
        </div>
        <p>How you register HttpClient depends on whether your app uses NgModules or standalone components.</p>
        <h3>Modern approach — Standalone</h3>
        <p>Call <code>provideHttpClient()</code> in the <code>providers</code> array of <code>bootstrapApplication()</code>. This is the default for new Angular apps. You can pass optional features like interceptors or XSRF protection here.</p>
        <h3>Legacy approach — NgModule</h3>
        <p>Import <code>HttpClientModule</code> in your root <code>AppModule</code>'s <code>imports</code> array. This is still valid for apps that have not migrated to standalone, and remains fully supported.</p>
        <h3>Important</h3>
        <p>Register HttpClient only <em>once</em>, at the root level. If you register it again in feature areas as well, you can end up with multiple instances, which breaks interceptors silently.</p>
      `,
      "code": "// ─── Modern standalone setup (recommended) ────────────────────\n// main.ts\nimport { bootstrapApplication } from '@angular/platform-browser';\nimport { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    provideHttpClient(\n      withFetch(),              // use native fetch() instead of XHR under the hood\n      withInterceptors([authInterceptor, loggingInterceptor])\n    )\n  ]\n});\n\n// ─── Legacy NgModule setup ─────────────────────────────────────\n// app.module.ts\nimport { NgModule } from '@angular/core';\nimport { BrowserModule } from '@angular/platform-browser';\nimport { HttpClientModule } from '@angular/common/http';\n\n@NgModule({\n  imports: [\n    BrowserModule,\n    HttpClientModule   // ← registers HttpClient for the whole app\n  ],\n  bootstrap: [AppComponent]\n})\nexport class AppModule {}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">One Water Main, Not Two</p><div class=\"flex flex-col items-center gap-2 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-1.5 font-semibold text-indigo-700\">provideHttpClient() — registered once, at the root</div><div class=\"text-slate-300\">&darr;</div><div class=\"flex gap-3\"><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1\">UsersService</div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1\">OrdersService</div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg px-2 py-1\">any feature</div></div><p class=\"text-rose-600 text-[11px] mt-1\">Registering it again in a feature area creates a second, disconnected instance</p></div></div>"
    },
    {
      "id": "how-to-handle-http-errors",
      "title": "How to handle HTTP errors?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A ship built with watertight compartments. If one compartment (a single request) takes on water, it seals itself off with <code>catchError</code> so the rest of the ship keeps sailing. Meanwhile the captain has standing orders for common emergencies that apply ship-wide &mdash; that's the interceptor, redirecting the crew to lifeboats (the login page) the instant a 401 alarm sounds, no matter which compartment triggered it.</p>
          </div>
        </div>
        <p>HTTP errors fall into two categories:</p>
        <ul>
          <li><strong>Client errors (4xx)</strong> &mdash; bad request, unauthorized, not found. The server responded but with an error status.</li>
          <li><strong>Network errors</strong> &mdash; no response at all (server down, no internet). The <code>status</code> will be 0.</li>
        </ul>
        <p>Angular delivers both as an <code>HttpErrorResponse</code> object to the <code>error</code> callback of your subscription.</p>
        <h3>Where to handle errors</h3>
        <p>There are two levels:</p>
        <ul>
          <li><strong>Per-request</strong> &mdash; use <code>catchError</code> in the service method's pipe for request-specific recovery (show a fallback, retry, etc.)</li>
          <li><strong>Global</strong> &mdash; use an interceptor to handle errors centrally (redirect to login on 401, show a toast on 500)</li>
        </ul>
        <h3>Best practice</h3>
        <p>Keep error-handling logic in the <strong>service</strong>, not the component. Components should only receive clean data or a clear error state.</p>
      `,
      "code": "import { Injectable } from '@angular/core';\nimport { HttpClient, HttpErrorResponse } from '@angular/common/http';\nimport { Observable, throwError, of } from 'rxjs';\nimport { catchError, retry } from 'rxjs/operators';\n\n@Injectable({ providedIn: 'root' })\nexport class DataService {\n  constructor(private http: HttpClient) {}\n\n  getUsers(): Observable<User[]> {\n    return this.http.get<User[]>('/api/users').pipe(\n      retry(2),   // retry up to 2 times before giving up (good for transient network errors)\n      catchError(this.handleError)\n    );\n  }\n\n  private handleError(error: HttpErrorResponse): Observable<never> {\n    let userMessage = 'Something went wrong. Please try again.';\n\n    if (error.status === 0) {\n      // Network error — no response received\n      console.error('Network error:', error.error);\n      userMessage = 'Network error. Check your connection.';\n    } else if (error.status === 401) {\n      userMessage = 'You are not authorised. Please log in.';\n    } else if (error.status === 404) {\n      userMessage = 'Resource not found.';\n    } else if (error.status >= 500) {\n      userMessage = 'Server error. Please try again later.';\n    } else {\n      // API returned an error body\n      console.error(`Backend error ${error.status}:`, error.error);\n    }\n\n    return throwError(() => new Error(userMessage));\n  }\n}\n\n// Component — clean error handling:\nthis.dataService.getUsers().subscribe({\n  next:  users => { this.users = users; this.loading = false; },\n  error: err   => { this.errorMessage = err.message; this.loading = false; }\n});",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Two Layers of Error Handling</p><div class=\"flex flex-col items-center gap-2 text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5\">Request fails</div><div class=\"text-slate-300\">&darr;</div><div class=\"bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5\">catchError in the service — per-request recovery</div><div class=\"text-slate-300\">&darr;</div><div class=\"bg-rose-50 border border-rose-200 rounded-lg px-3 py-1.5\">Error interceptor — global 401 / 500 handling</div><div class=\"text-slate-300\">&darr;</div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5\">Component gets a clean, human-readable error</div></div></div>"
    },
    {
      "id": "what-are-interceptors",
      "title": "What are interceptors?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A quality-control gate on a factory line that every single product rolls through, both leaving the factory and coming back for inspection. Nobody has to remember to stamp a batch by hand &mdash; the gate just does it automatically, every time, for every product, whether that's stamping an auth token onto an outgoing request or flagging a defective response coming back in.</p>
          </div>
        </div>
        <p><strong>Interceptors</strong> are middleware for HTTP requests and responses. Every request passes through all registered interceptors before reaching the server, and every response passes back through them before reaching your code.</p>
        <h3>What interceptors are used for</h3>
        <ul>
          <li><strong>Attaching auth tokens</strong> &mdash; add an <code>Authorization: Bearer &lt;token&gt;</code> header to every request automatically</li>
          <li><strong>Global error handling</strong> &mdash; catch 401 errors and redirect to login; show toast notifications for 500 errors</li>
          <li><strong>Logging</strong> &mdash; log request URLs and response times to the console or an analytics service</li>
          <li><strong>Loading indicators</strong> &mdash; show/hide a global spinner while any request is in progress</li>
          <li><strong>Request transformation</strong> &mdash; add a base URL prefix, set content-type headers, append correlation IDs</li>
        </ul>
        <h3>Two styles</h3>
        <p>Modern Angular uses <strong>functional interceptors</strong> &mdash; just a plain function, no class needed, registered via <code>withInterceptors()</code>. Older codebases use class-based interceptors implementing <code>HttpInterceptor</code>, which still work but are the legacy style.</p>
      `,
      "code": "// ─── Functional interceptor (modern, recommended) ─────────────\nimport { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';\nimport { inject } from '@angular/core';\nimport { AuthService } from './auth.service';\n\nexport const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {\n  const auth = inject(AuthService);\n  const token = auth.getToken();\n\n  if (!token) return next(req);  // no token — pass through unchanged\n\n  // Clone the request (requests are immutable) and add the header\n  const authReq = req.clone({\n    setHeaders: { Authorization: `Bearer ${token}` }\n  });\n\n  return next(authReq);\n};\n\n// Register in main.ts:\n// provideHttpClient(withInterceptors([authInterceptor]))\n\n// ─── Class-based interceptor (legacy) ─────────────────────────\nimport { Injectable } from '@angular/core';\nimport { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';\nimport { Observable } from 'rxjs';\n\n@Injectable()\nexport class AuthInterceptorClass implements HttpInterceptor {\n  constructor(private auth: AuthService) {}\n\n  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {\n    const token = this.auth.getToken();\n    if (!token) return next.handle(req);\n\n    const authReq = req.clone({\n      setHeaders: { Authorization: `Bearer ${token}` }\n    });\n    return next.handle(authReq);\n  }\n}\n\n// Register in AppModule:\n// { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorClass, multi: true }",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Every Request, Every Response, Same Gate</p><div class=\"flex items-center justify-center gap-2 flex-wrap text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-center\">Component calls http.get()</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-amber-50 border-2 border-amber-300 rounded-lg p-2 text-center font-semibold text-amber-700\">interceptor(s)</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-slate-50 border border-slate-200 rounded-lg p-2 text-center\">Server</div></div><div class=\"flex items-center justify-center gap-2 flex-wrap text-xs mt-2\"><div class=\"bg-slate-50 border border-slate-200 rounded-lg p-2 text-center\">Response</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-amber-50 border-2 border-amber-300 rounded-lg p-2 text-center font-semibold text-amber-700\">interceptor(s)</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center\">Component receives it</div></div></div>"
    },
    {
      "id": "how-to-implement-http-interceptors",
      "title": "Real-world interceptor examples",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A hospital's ER triage board. A running counter of "patients currently being treated" drives one light: green when empty, red the moment anyone is in a bed &mdash; that's the loading interceptor tracking active requests. Separately, standing ER protocols route specific conditions automatically: chest pain goes straight to cardiology, no doctor has to manually decide each time &mdash; that's the error interceptor routing a 401 straight to the login page every time, without any service needing to know the rule.</p>
          </div>
        </div>
        <p>Here are two interceptors you'll build in almost every production Angular app.</p>
        <h3>1. Loading interceptor</h3>
        <p>Show a spinner whenever any HTTP request is in flight. Track the count of active requests &mdash; show spinner when count > 0, hide when it drops back to 0.</p>
        <h3>2. Error interceptor</h3>
        <p>Catch specific HTTP error codes globally. Redirect to login on 401. Show a notification on server errors. This removes repeated error-handling code from every service.</p>
        <h3>Multiple interceptors</h3>
        <p>Interceptors are applied in the order they are registered. For functional interceptors, pass them as an array to <code>withInterceptors()</code>.</p>
      `,
      "code": "import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';\nimport { inject } from '@angular/core';\nimport { Router } from '@angular/router';\nimport { catchError, throwError } from 'rxjs';\nimport { finalize } from 'rxjs/operators';\nimport { LoadingService } from './loading.service';\nimport { ToastService } from './toast.service';\n\n// ─── 1. Loading spinner interceptor ───────────────────────────\nexport const loadingInterceptor: HttpInterceptorFn = (req, next) => {\n  const loading = inject(LoadingService);\n  loading.show();   // increment active request count, show spinner\n\n  return next(req).pipe(\n    finalize(() => loading.hide())  // always hide, even on error\n  );\n};\n\n// ─── 2. Global error interceptor ──────────────────────────────\nexport const errorInterceptor: HttpInterceptorFn = (req, next) => {\n  const router = inject(Router);\n  const toast  = inject(ToastService);\n\n  return next(req).pipe(\n    catchError((err: HttpErrorResponse) => {\n      if (err.status === 401) {\n        // Not authenticated — clear session and send to login\n        router.navigate(['/login']);\n      } else if (err.status === 403) {\n        toast.error('You do not have permission to do this.');\n      } else if (err.status >= 500) {\n        toast.error('A server error occurred. Please try again later.');\n      }\n      return throwError(() => err);  // still propagate to the calling service\n    })\n  );\n};\n\n// main.ts — register both interceptors\n// provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor, errorInterceptor]))\n// They run left to right on the request, right to left on the response.",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Interceptor Chain Order</p><div class=\"flex items-center justify-center gap-2 flex-wrap text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-center\">authInterceptor</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-2 text-center\">loadingInterceptor</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-rose-50 border border-rose-200 rounded-lg p-2 text-center\">errorInterceptor</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-slate-50 border border-slate-200 rounded-lg p-2 text-center\">Server</div></div><p class=\"text-center text-slate-400 text-[11px] mt-3\">Registered order on the way out — reversed automatically on the way back</p></div>"
    },
    {
      "id": "http-resource-signals",
      "title": "httpResource - signal-based data fetching",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A smart, self-refilling water cooler tied to a sensor. Point it at a signal &mdash; say, "which floor am I on" &mdash; and it automatically fetches a fresh bottle whenever that signal changes, cancelling a delivery already in transit if you switch floors again before it arrives. You never call "refill" yourself, and you always have three lights to check: <code>isLoading</code>, <code>error</code>, and <code>value</code>.</p>
          </div>
        </div>
        <p><strong>httpResource</strong> is Angular's HTTP API that wraps <code>HttpClient</code> in the signals resource pattern. Instead of manually keeping separate <code>loading</code>, <code>error</code>, and <code>data</code> fields, the resource exposes them all as signals. As of Angular 22, <code>httpResource()</code> &mdash; along with the more general <code>resource()</code> and the RxJS-flavoured <code>rxResource()</code> &mdash; is <strong>stable</strong>, no longer marked experimental.</p>
        <h3>Why it matters</h3>
        <p>Modern Angular is signals-first and zoneless by default. <code>httpResource</code> lets request state participate directly in the signal graph. When a signal used by the request changes, Angular cancels the previous request and issues a new one automatically &mdash; no manual <code>switchMap</code> required.</p>
        <h3>httpResource vs plain HttpClient</h3>
        <p>Use <code>httpResource()</code> when a component wants to <em>display</em> request state reactively (loading spinners, error banners, the value itself, all as signals). Keep plain <code>HttpClient</code> Observables in services where you're composing streams with RxJS operators, or firing one-off writes like a POST that isn't tied to a template read.</p>
      `,
      "code": "import { Component, input } from '@angular/core';\nimport { httpResource } from '@angular/common/http';\n\ninterface User {\n  id: string;\n  name: string;\n  email: string;\n}\n\n@Component({\n  selector: 'app-user-profile',\n  template: `\n    @if (user.isLoading()) {\n      <p>Loading...</p>\n    } @else if (user.error()) {\n      <p>Could not load user.</p>\n    } @else {\n      <h2>{{ user.value()?.name }}</h2>\n      <p>{{ user.value()?.email }}</p>\n    }\n  `\n})\nexport class UserProfileComponent {\n  userId = input.required<string>();\n\n  // Refetches whenever userId() changes. Pending requests are cancelled.\n  user = httpResource<User>(() => `/api/users/${this.userId()}`);\n}\n\n// Setup still uses provideHttpClient() in app.config.ts or main.ts:\n// bootstrapApplication(AppComponent, { providers: [provideHttpClient()] });",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">httpResource Signal States</p><div class=\"flex items-center justify-center gap-3 flex-wrap text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg p-2 text-center font-semibold text-indigo-700\">userId() signal changes</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg p-2 text-center font-semibold text-amber-700\">previous request cancelled, new one fired</div><span class=\"text-slate-300\">&rarr;</span><div class=\"flex flex-col gap-1\"><div class=\"bg-slate-50 border border-slate-200 rounded px-2 py-1\">isLoading()</div><div class=\"bg-slate-50 border border-slate-200 rounded px-2 py-1\">error()</div><div class=\"bg-emerald-50 border border-emerald-200 rounded px-2 py-1\">value()</div></div></div></div>"
    },
    {
      "id": "what-is-cors",
      "title": "What is CORS and how to fix it?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">An apartment building's doorman. The doorman (the browser) won't let a visitor (a JavaScript request from a web page) up to a resident's unit (a different origin) unless the resident has already left a note at the desk saying "this specific visitor is expected" (the <code>Access-Control-Allow-Origin</code> header). Crucially, the doorman works for the browser, not the building &mdash; you can't bribe him from the visitor's side. Only the resident (the server) can leave that note.</p>
          </div>
        </div>
        <p><strong>CORS (Cross-Origin Resource Sharing)</strong> is a browser security policy. A browser blocks JavaScript from making HTTP requests to a different origin (different domain, port, or protocol) unless the server explicitly allows it.</p>
        <h3>Example</h3>
        <p>Your Angular app runs at <code>http://localhost:4200</code>. It makes a request to <code>http://localhost:3000/api/users</code>. The browser detects these are different origins (different port) and sends a preflight <code>OPTIONS</code> request. If the server doesn't respond with the right CORS headers, the browser blocks the response.</p>
        <h3>CORS is a SERVER-side fix</h3>
        <p>Angular (the client) cannot fix CORS. You must configure the server to send the correct headers. Angular's dev proxy is just a workaround for local development &mdash; it bypasses the browser's same-origin check by proxying through Node.js, which isn't subject to CORS.</p>
        <h3>Production fix</h3>
        <p>Configure your backend to send <code>Access-Control-Allow-Origin</code> with the correct domain. If you serve the Angular app and the API from the same origin (same domain, different paths), CORS is not an issue at all.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">The <code>proxy.conf.json</code> trick only works while running <code>ng serve</code> locally &mdash; it has zero effect on a production build. Shipping a production app that still relies on the dev proxy to dodge CORS means it will break the moment it's deployed; the fix has to live on the server, permanently.</p>
          </div>
        </div>
      `,
      "code": "// ─── SERVER response headers (what the server must send) ───────\n// Access-Control-Allow-Origin: https://yourapp.com\n// Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS\n// Access-Control-Allow-Headers: Content-Type, Authorization\n\n// ─── Express.js example (Node backend) ────────────────────────\n// const cors = require('cors');\n// app.use(cors({ origin: 'https://yourapp.com' }));\n\n// ─── Angular proxy for LOCAL DEVELOPMENT only ─────────────────\n// proxy.conf.json — routes /api/* through a local Node proxy\n// to avoid CORS during development\n{\n  \"/api\": {\n    \"target\": \"http://localhost:3000\",\n    \"changeOrigin\": true,\n    \"secure\": false\n  }\n}\n\n// angular.json (under serve > options):\n// \"proxyConfig\": \"proxy.conf.json\"\n\n// After this, requests to /api/users in your Angular code\n// are automatically proxied to http://localhost:3000/api/users\n// — the browser never sees the different origin\n\n// The proxy ONLY works in 'ng serve' (local dev).\n// In production, fix CORS on the server.",
      "language": "json",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">CORS Preflight Sequence</p><div class=\"flex flex-col items-center gap-2 text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5\">Browser sends OPTIONS preflight to a different origin</div><div class=\"text-slate-300\">&darr;</div><div class=\"bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5\">Server responds with Access-Control-Allow-Origin (or doesn't)</div><div class=\"text-slate-300\">&darr;</div><div class=\"flex gap-3\"><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5\">Header present — real request proceeds</div><div class=\"bg-rose-50 border border-rose-200 rounded-lg px-3 py-1.5\">Header missing — browser blocks it</div></div></div></div>"
    }
  ]
});
