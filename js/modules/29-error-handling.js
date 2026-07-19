window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "error-handling",
  "title": "Error Handling",
  "icon": "bi bi-bug",
  "questions": [
    {
      id: "angular-22-standard-error-handling-upgrade",
      title: "Angular 22 standard for error handling",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>hospital triage system</strong>. Not every complaint goes to the emergency room. A sprained ankle (a recoverable, request-specific error) is handled at the walk-in clinic close to the patient. A building-wide gas leak (an uncaught crash) trips the fire alarm and evacuates everyone &mdash; that's your global <code>ErrorHandler</code>, the last line of defense, not the first.</p>
          </div>
        </div>
        <p>Angular 22-ready error handling separates global crash reporting, HTTP recovery, route failures, and user-facing messages into distinct layers. A global <code>ErrorHandler</code> is the last line of defense; predictable failures should be handled close to the operation that can actually recover from them.</p>
        <h3>Modern error checklist</h3>
        <ul>
          <li>Use a custom <code>ErrorHandler</code> for uncaught errors and telemetry.</li>
          <li>Use functional HTTP interceptors for auth failures and shared API errors.</li>
          <li>Use <code>catchError()</code> inside services for request-specific fallbacks.</li>
          <li>Represent loading, data, and error states explicitly in components.</li>
          <li>Never show raw backend or stack-trace messages to users.</li>
        </ul>
      `,
      code: `export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status >= 500) {
        toast.show('Server error. Please try again later.');
      }
      return throwError(() => error);
    })
  );
};

bootstrapApplication(AppComponent, {
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideHttpClient(withInterceptors([apiErrorInterceptor]))
  ]
});`,
      language: "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Triage Layers</p><div class="flex flex-col gap-2 text-xs max-w-sm mx-auto"><div class="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2"><span class="font-bold text-emerald-700">Walk-in clinic</span> <span class="text-slate-500">— catchError() at the call site</span></div><div class="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2"><span class="font-bold text-amber-700">Urgent care</span> <span class="text-slate-500">— HTTP interceptor, cross-cutting</span></div><div class="bg-rose-50 border border-rose-200 rounded-lg px-3 py-2"><span class="font-bold text-rose-700">Emergency room</span> <span class="text-slate-500">— global ErrorHandler, last resort</span></div></div></div>`
    },
    {
      "id": "what-is-errorhandler",
      "title": "What is ErrorHandler and when does it fire?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">The <strong>safety net under a trapeze act</strong>. Performers aren't supposed to fall into it &mdash; every trick is designed to land on the platform. But if someone does slip, the net is there so the show doesn't end in disaster. Angular's default <code>ErrorHandler</code> is a net that just yells "someone fell!" into the void (<code>console.error</code>); a production app needs a net that actually catches the performer, logs the fall, and gets them back on stage.</p>
          </div>
        </div>
        <p>Every Angular application has a single global <strong>ErrorHandler</strong>, the last line of defense for uncaught exceptions. When an error propagates up through the component tree, a service call stack, or an RxJS pipeline without being caught, Angular routes it here. The default implementation does exactly one thing: <code>console.error(error)</code>, logging it while the app keeps running.</p>
        <p>That's fine in development and completely inadequate in production. A real production app needs to capture errors with full stack traces, send them to an error tracking service (Sentry, Datadog, Rollbar), show a user-friendly message, and potentially redirect to a safe state &mdash; all done by providing a custom <code>ErrorHandler</code>.</p>
        <h3>What ErrorHandler does not catch</h3>
        <p>It catches synchronous errors thrown inside Angular's execution context, errors in lifecycle hooks, and errors thrown in event handlers within templates. It does <em>not</em> automatically catch HTTP errors (those arrive as RxJS observable errors your code must handle) or errors in code that never re-enters Angular's tracked execution.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">On a Zone.js-based app, Angular calls your <code>handleError()</code> outside the Angular zone, precisely so the error handler itself doesn't trigger another change-detection cycle. If you update component state inside <code>handleError()</code> (say, to show a toast), you need <code>NgZone.run()</code> to re-enter the zone and get it rendered. On a zoneless app this distinction doesn't exist &mdash; a signal write from inside the handler notifies its consumers directly.</p>
          </div>
        </div>
      `,
      "code": "// ---- How ErrorHandler fits in the application ----\n// Normal flow:\n//   Component throws → Angular catches → ErrorHandler.handleError()\n\n// ---- Default ErrorHandler (what Angular provides out of the box) ----\nclass DefaultErrorHandler implements ErrorHandler {\n  handleError(error: unknown): void {\n    console.error(error);  // that's it\n  }\n}\n\n// ---- Production ErrorHandler with Sentry integration ----\nimport { ErrorHandler, Injectable, NgZone, inject } from '@angular/core';\nimport * as Sentry from '@sentry/angular';\n\n@Injectable()\nexport class GlobalErrorHandler implements ErrorHandler {\n  private ngZone = inject(NgZone);\n\n  handleError(error: unknown): void {\n    // Log to browser console for developer visibility\n    console.error('[GlobalErrorHandler]', error);\n\n    // Normalize error object — Angular sometimes wraps errors\n    const unwrapped = (error as { ngOriginalError?: Error }).ngOriginalError ?? error;\n\n    // Send to Sentry (or any error tracking service)\n    Sentry.captureException(unwrapped);\n\n    // Re-enter the zone to update UI (e.g., show an error toast) —\n    // only required on a Zone.js-based app; harmless no-op if zoneless.\n    this.ngZone.run(() => {\n      // inject NotificationService here and show a snackbar\n    });\n  }\n}\n\n// Register in bootstrapApplication (standalone) or AppModule:\n// providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }]",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">What Reaches ErrorHandler</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">Caught automatically</p><div class=\"space-y-1\"><div class=\"bg-white border border-emerald-200 rounded px-2 py-1 text-center\">template event handler throws</div><div class=\"bg-white border border-emerald-200 rounded px-2 py-1 text-center\">lifecycle hook throws</div></div></div><div class=\"bg-rose-50 border-2 border-rose-200 rounded-xl p-3\"><p class=\"font-bold text-rose-700 text-center mb-2\">NOT caught automatically</p><div class=\"space-y-1\"><div class=\"bg-white border border-rose-200 rounded px-2 py-1 text-center\">HTTP observable errors</div><div class=\"bg-white border border-rose-200 rounded px-2 py-1 text-center\">unhandled promise rejections you swallow</div></div></div></div></div>"
    },
    {
      "id": "http-error-interceptor",
      "title": "HTTP error interceptor — centralized HTTP error handling",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">An <strong>airport customs checkpoint</strong> that every single flight passes through, regardless of destination. Instead of each gate agent inventing their own rules for what to do with a flagged passenger, one checkpoint enforces one consistent policy for the whole airport. An HTTP interceptor is that checkpoint &mdash; every request and response flows through it, so error handling doesn't get reinvented (or forgotten) at each call site.</p>
          </div>
        </div>
        <p>HTTP errors are different from runtime exceptions &mdash; they arrive as RxJS observable errors from <code>HttpClient</code>. <code>ErrorHandler</code> doesn't catch them automatically; they propagate as <code>HttpErrorResponse</code> objects through the RxJS pipe. If a component subscribes without an error callback, the unhandled error eventually reaches <code>ErrorHandler</code> anyway &mdash; just later and with less context.</p>
        <p>The right place to handle HTTP errors centrally is an <strong>HTTP interceptor</strong>. A functional interceptor (the modern Angular approach) is a plain function wrapping <code>next(request)</code> in a <code>catchError</code> pipe. Every HTTP call in the app flows through it &mdash; one place to map error codes to messages, redirect on 401, log 5xx errors, and decide whether to rethrow or swallow.</p>
        <h3>Functional interceptors</h3>
        <p>The functional interceptor approach replaced the older class-based <code>HttpInterceptor</code> interface. A functional interceptor is a function taking <code>(req, next)</code> and returning an observable, registered via <code>provideHttpClient(withInterceptors([myInterceptor]))</code>, with any injected services accessed via <code>inject()</code> inside the function body.</p>
      `,
      "code": "// ---- error.interceptor.ts (functional interceptor) ----\nimport { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';\nimport { inject } from '@angular/core';\nimport { Router } from '@angular/router';\nimport { catchError, throwError } from 'rxjs';\nimport { NotificationService } from './notification.service';\n\nexport const errorInterceptor: HttpInterceptorFn = (req, next) => {\n  const router = inject(Router);\n  const notify = inject(NotificationService);\n\n  return next(req).pipe(\n    catchError((error: HttpErrorResponse) => {\n      // Network error (no HTTP status — failed before reaching server)\n      if (error.status === 0) {\n        notify.error('No internet connection. Please check your network.');\n        return throwError(() => error);\n      }\n\n      switch (error.status) {\n        case 400:\n          // Validation error — server returned field-level errors\n          // Return the error so the component can display them\n          break;\n\n        case 401:\n          // Session expired — redirect to login\n          notify.warn('Your session has expired. Please sign in again.');\n          router.navigate(['/login'], {\n            queryParams: { returnUrl: router.url }\n          });\n          break;\n\n        case 403:\n          notify.error('You do not have permission to perform this action.');\n          router.navigate(['/unauthorized']);\n          break;\n\n        case 404:\n          // 404s are often expected (e.g., checking if a resource exists)\n          // Don't show a notification — let the component decide\n          break;\n\n        case 429:\n          notify.warn('Too many requests. Please wait a moment and try again.');\n          break;\n\n        default:\n          if (error.status >= 500) {\n            notify.error('A server error occurred. Our team has been notified.');\n            // Log server errors to monitoring\n            console.error('[HTTP 5xx]', req.url, error.status, error.message);\n          }\n      }\n\n      // Rethrow so components that need the error can still access it\n      return throwError(() => error);\n    })\n  );\n};\n\n// Register in main.ts:\n// bootstrapApplication(AppComponent, {\n//   providers: [\n//     provideHttpClient(withInterceptors([errorInterceptor]))\n//   ]\n// });",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">One Checkpoint, Every Request</p><div class=\"flex flex-wrap items-center justify-center gap-2 text-xs mb-3\"><div class=\"bg-slate-100 border border-slate-200 rounded px-2 py-1\">GET /products</div><div class=\"bg-slate-100 border border-slate-200 rounded px-2 py-1\">POST /orders</div><div class=\"bg-slate-100 border border-slate-200 rounded px-2 py-1\">PATCH /profile</div></div><div class=\"flex justify-center\"><span class=\"text-slate-300\">&darr; all pass through &darr;</span></div><div class=\"flex justify-center mt-2\"><div class=\"bg-indigo-600 text-white rounded-lg px-4 py-2 font-semibold\">errorInterceptor</div></div></div>"
    },
    {
      "id": "retry-logic-http",
      "title": "Retry strategies — retry(), retryWhen(), and exponential backoff",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Redialing a phone call that dropped because of bad signal versus redialing a wrong number over and over. A dropped call is worth retrying &mdash; wait a beat, try again, the person is still there. A wrong number will never connect no matter how many times you redial; you dialed the wrong digits, and retrying just wastes everyone's time. Transient failures (5xx, network drops) are the dropped call; client errors (4xx) are the wrong number.</p>
          </div>
        </div>
        <p>Transient network failures are a production reality &mdash; a mobile user briefly loses signal, a server reboots, a load balancer times out under peak load. These are temporary: retry a moment later and it succeeds. Automatic retry logic keeps a transient failure from surfacing as a user-visible error at all.</p>
        <p>RxJS's <code>retry()</code> handles the simple case: it resubscribes to the source (re-sends the HTTP request) up to <code>count</code> times. If all retries fail, the error propagates to the subscriber. This basic form retries immediately and only suits failures that are truly momentary, like a single dropped packet.</p>
        <h3>Exponential backoff</h3>
        <p>For most real retry scenarios, immediate retries make things worse &mdash; if the server is overloaded, hammering it with rapid retries piles on. <strong>Exponential backoff</strong> waits progressively longer between attempts (1s, 2s, 4s, 8s...) and can add random jitter to avoid the "thundering herd" problem where every client retries at once. RxJS's <code>retry({ delay })</code> configuration makes this clean to express.</p>
        <h3>Which errors to retry</h3>
        <p>Only retry transient errors: network failures (<code>status === 0</code>) and server errors (<code>status >= 500</code>). Never retry client errors (4xx) &mdash; they indicate a permanent problem with the request that a retry won't fix.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Blindly retrying a non-idempotent request &mdash; a <code>POST</code> that charges a card or creates an order &mdash; can duplicate the side effect if the first attempt actually succeeded but the response was lost in transit. Restrict automatic retry to idempotent methods (<code>GET</code>, <code>PUT</code> with a full resource replace, <code>DELETE</code>) or require the backend to support idempotency keys before retrying a <code>POST</code>.</p>
          </div>
        </div>
      `,
      "code": "import { HttpClient, HttpErrorResponse } from '@angular/common/http';\nimport { Injectable, inject } from '@angular/core';\nimport { Observable, throwError, timer } from 'rxjs';\nimport { retry, catchError } from 'rxjs/operators';\n\n@Injectable({ providedIn: 'root' })\nexport class ProductApiService {\n  private http = inject(HttpClient);\n\n  getProducts(): Observable<Product[]> {\n    return this.http.get<Product[]>('/api/products').pipe(\n      // Retry with exponential backoff — only for transient errors\n      retry({\n        count: 3,\n        delay: (error: HttpErrorResponse, retryCount: number) => {\n          // Only retry network errors and 5xx server errors\n          if (error.status === 0 || error.status >= 500) {\n            const delayMs = Math.pow(2, retryCount) * 1000;  // 2s, 4s, 8s\n            // Add jitter (±500ms) to prevent thundering herd\n            const jitter = Math.random() * 1000 - 500;\n            console.log(`Retry ${retryCount} in ${delayMs + jitter}ms`);\n            return timer(delayMs + jitter);\n          }\n          // For 4xx and other errors, do not retry — throw immediately\n          return throwError(() => error);\n        }\n      }),\n      catchError((error: HttpErrorResponse) => {\n        // All retries exhausted — transform to a user-facing error\n        if (error.status === 0) {\n          return throwError(() =>\n            new Error('Could not reach the server. Check your connection.')\n          );\n        }\n        return throwError(() =>\n          new Error(`Failed to load products (${error.status})`)\n        );\n      })\n    );\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Backoff Timeline</p><div class=\"flex flex-wrap items-center justify-center gap-2 text-xs\"><div class=\"bg-rose-50 border border-rose-200 rounded px-2 py-1\">attempt 1 fails</div><span class=\"text-slate-300\">&rarr; wait 2s &rarr;</span><div class=\"bg-amber-50 border border-amber-200 rounded px-2 py-1\">attempt 2 fails</div><span class=\"text-slate-300\">&rarr; wait 4s &rarr;</span><div class=\"bg-amber-50 border border-amber-200 rounded px-2 py-1\">attempt 3 fails</div><span class=\"text-slate-300\">&rarr; wait 8s &rarr;</span><div class=\"bg-emerald-50 border border-emerald-200 rounded px-2 py-1\">attempt 4 succeeds</div></div></div>"
    },
    {
      "id": "error-boundaries-in-angular",
      "title": "Route-level error pages and error boundaries",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>detour sign on a highway when a bridge is out</strong>. The GPS (Angular's router) doesn't let the car drive off the missing bridge &mdash; it reroutes to a marked detour (an error or 404 page) before the driver ever reaches the gap. Angular has no React-style "error boundary" component that catches a broken subtree in place, but the router gives you an equivalent safety net at the navigation level.</p>
          </div>
        </div>
        <p>Angular doesn't have React-style error boundary components, but you get similar isolation through <strong>route-level error handling</strong>. When a route fails &mdash; a lazy-loaded chunk fails to download, a guard throws, a resolver rejects &mdash; the router emits a <code>NavigationError</code> event. Listening for it in your app shell lets you redirect to a friendly error page instead of leaving the user staring at a half-loaded screen.</p>
        <h3>Route error pages</h3>
        <p>Define a wildcard <code>**</code> route rendering a 404 component, and a dedicated <code>/error</code> route for unexpected runtime errors. When your <code>GlobalErrorHandler</code> catches something critical, it can navigate to <code>/error</code> with state describing the problem, rather than leaving the user on a broken page.</p>
        <h3>Resolver errors</h3>
        <p>Route resolvers that fetch data before navigating should handle HTTP errors gracefully. If a resolver throws, the navigation is cancelled and the user stays put &mdash; often a confusing outcome. The better pattern is catching the error inside the resolver, returning a default or empty result, and letting the route component render an empty state instead of blocking navigation entirely.</p>
      `,
      "code": "// ---- app.routes.ts ----\nimport { Routes } from '@angular/router';\n\nexport const routes: Routes = [\n  { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },\n  { path: 'products', loadComponent: () => import('./products/product-list.component').then(m => m.ProductListComponent) },\n  { path: 'error', loadComponent: () => import('./error/error-page.component').then(m => m.ErrorPageComponent) },\n  { path: '404', loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent) },\n  { path: '**', redirectTo: '404' }  // Catch-all for unknown routes\n];\n\n// ---- app.component.ts — listen for router NavigationError ----\nimport { Component, OnInit, inject } from '@angular/core';\nimport { Router, NavigationError, Event } from '@angular/router';\nimport { filter } from 'rxjs/operators';\n\n@Component({\n  selector: 'app-root',\n  template: '<router-outlet />'\n})\nexport class AppComponent implements OnInit {\n  private router = inject(Router);\n\n  ngOnInit(): void {\n    // Intercept router-level errors (failed lazy loads, guard errors)\n    this.router.events\n      .pipe(filter((e): e is NavigationError => e instanceof NavigationError))\n      .subscribe(event => {\n        console.error('Navigation error:', event.error);\n        this.router.navigate(['/error'], {\n          state: { message: 'Failed to load the requested page.' }\n        });\n      });\n  }\n}\n\n// ---- product.resolver.ts — graceful resolver error handling ----\nimport { inject } from '@angular/core';\nimport { ResolveFn } from '@angular/router';\nimport { catchError, of } from 'rxjs';\nimport { ProductService } from './product.service';\nimport type { Product } from './product.model';\n\nexport const productListResolver: ResolveFn<Product[]> =\n  (route, state) => {\n    return inject(ProductService).getAll().pipe(\n      catchError(err => {\n        // Don't block navigation — return empty array and let component show empty state\n        console.error('Failed to preload products:', err);\n        return of([]);\n      })\n    );\n  };",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Navigation Failure Detour</p><div class=\"flex flex-wrap items-center justify-center gap-2 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700\">navigate to /products</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-rose-50 border-2 border-rose-200 rounded-lg px-3 py-2 text-center font-semibold text-rose-700\">lazy chunk fails to load</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700\">NavigationError event</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700\">redirect to /error</div></div></div>"
    },
    {
      "id": "rxjs-error-handling",
      "title": "RxJS error handling — catchError, finalize, and EMPTY",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>factory conveyor belt</strong> that jams and stops the whole line the instant it hits a defective part &mdash; that's an unhandled observable error, terminating the stream completely. <code>catchError()</code> is the "damaged goods" bin beside the belt: the defective item gets pulled aside and the belt keeps moving with a substitute. <code>finalize()</code> is the foreman who checks the line at the end of every shift no matter what happened during it &mdash; success, jam, or early shutdown.</p>
          </div>
        </div>
        <p>Angular applications lean heavily on RxJS, so understanding how errors propagate in observable pipelines matters. When an observable emits an error, the stream <strong>terminates</strong> &mdash; no more values, downstream operators are skipped. That's different from a promise: with a promise you <code>.catch()</code> and move on; with an observable, the stream itself ends unless something intercepts the error.</p>
        <h3>catchError</h3>
        <p><code>catchError()</code> intercepts the error and returns a new observable to continue with. Return <code>of(defaultValue)</code> and the stream continues with that fallback, then completes normally. Return <code>EMPTY</code> and the stream completes without emitting anything. Return <code>throwError(() => newError)</code> and you re-throw, possibly transformed. Which one you pick depends on whether the component should receive a fallback value or nothing at all.</p>
        <h3>finalize</h3>
        <p><code>finalize()</code> is the observable equivalent of a <code>finally</code> block. It runs when the observable completes, errors, or is unsubscribed &mdash; regardless of outcome. This is the right place to hide loading spinners: <code>finalize(() => this.loading.set(false))</code> runs whether the HTTP request succeeds or fails.</p>
        <h3>Error recovery vs error propagation</h3>
        <p>Not every error should be caught at the service level. Validation errors (<code>400</code> responses) should generally propagate to the component, since the component knows how to render field-level feedback. The interceptor handles cross-cutting concerns (401 redirect, 5xx notification); per-request domain errors belong at the call site.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Returning <code>EMPTY</code> from <code>catchError</code> silently completes the stream with zero emissions &mdash; if the subscriber was expecting at least one value (say, to hide a spinner via a <code>tap</code> before completion), it may never get the signal it was waiting for. Pairing <code>catchError</code> with <code>finalize</code> is the safe habit precisely because <code>finalize</code> runs regardless of which branch the stream took.</p>
          </div>
        </div>
      `,
      "code": "import { Component, OnInit, signal, inject } from '@angular/core';\nimport { HttpClient } from '@angular/common/http';\nimport { EMPTY, catchError, finalize, tap } from 'rxjs';\n\ninterface UserProfile { id: number; name: string; email: string; }\n\n@Component({\n  selector: 'app-profile',\n  template: `\n    <div *ngIf=\"loading()\">Loading...</div>\n    <div *ngIf=\"error()\" class=\"error-banner\">{{ error() }}</div>\n    <div *ngIf=\"profile()\">\n      <h2>{{ profile()!.name }}</h2>\n      <p>{{ profile()!.email }}</p>\n    </div>\n  `\n})\nexport class ProfileComponent implements OnInit {\n  profile = signal<UserProfile | null>(null);\n  loading = signal(false);\n  error = signal<string | null>(null);\n\n  private http = inject(HttpClient);\n\n  ngOnInit(): void {\n    this.loading.set(true);\n    this.error.set(null);\n\n    this.http.get<UserProfile>('/api/me').pipe(\n      tap(user => this.profile.set(user)),\n\n      catchError(err => {\n        // Handle the error locally — this component needs to show specific feedback\n        if (err.status === 404) {\n          this.error.set('Profile not found. Please contact support.');\n        } else {\n          this.error.set('Could not load your profile. Please try again.');\n        }\n        // Return EMPTY to complete the stream gracefully without emitting a value\n        return EMPTY;\n      }),\n\n      // finalize always runs — perfect for hiding the loading indicator\n      finalize(() => this.loading.set(false))\n    ).subscribe();\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">catchError Branches, finalize Always Runs</p><div class=\"flex flex-col items-center gap-2 text-xs\"><div class=\"bg-slate-800 text-white rounded-lg px-4 py-2 font-semibold\">http.get(...)</div><div class=\"text-slate-300\">&darr;</div><div class=\"flex gap-4\"><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-center\">success &rarr; tap sets profile</div><div class=\"bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 text-center\">error &rarr; catchError sets message</div></div><div class=\"text-slate-300\">&darr; both paths &darr;</div><div class=\"bg-indigo-600 text-white rounded-lg px-4 py-2 font-semibold\">finalize() — hide spinner</div></div></div>"
    }
  ]
});
