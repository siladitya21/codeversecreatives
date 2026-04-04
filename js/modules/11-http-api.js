window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "http-api",
  "title": "HTTP & API",
  "icon": "bi bi-cloud-arrow-down",
  "questions": [
    {
      "id": "what-is-httpclient",
      "title": "What is HttpClient?",
      "explanation": `
          <p>The <strong>HttpClient</strong> is a built-in Angular service that allows applications to communicate with backend services over the HTTP protocol. It is based on the <code>XMLHttpRequest</code> interface but provides a much more powerful and streamlined API.</p>
          <h3>Key Features</h3>
          <ul>
            <li><strong>Observable-based:</strong> All requests return RxJS Observables.</li>
            <li><strong>Typed Requests:</strong> Supports TypeScript generics for response types.</li>
            <li><strong>Interception:</strong> Middleware support for headers and errors.</li>
          </ul>
        `,
      "code": "import { HttpClient } from '@angular/common/http';\n\n@Injectable({ providedIn: 'root' })\nexport class DataService {\n  constructor(private http: HttpClient) {}\n\n  getUsers() {\n    return this.http.get<User[]>('https://api.example.com/users');\n  }\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">HttpClient Flow</p><div class="flex items-center justify-between max-w-md mx-auto"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-indigo-700">Angular App</p></div><div class="flex-1 flex flex-col items-center"><span class="text-[10px] text-slate-400 font-mono">Observable</span><div class="h-0.5 w-full bg-slate-200 relative"><div class="absolute right-0 -top-1 text-slate-400">&rarr;</div><div class="absolute left-0 -top-1 text-slate-400">&larr;</div></div></div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-emerald-700">Backend API</p></div></div></div>`
    },
    {
      "id": "how-to-make-http-requests",
      "title": "How to make HTTP requests?",
      "explanation": `
          <p>To make a request, you inject <code>HttpClient</code> into your service and call methods like <code>.get()</code>, <code>.post()</code>, <code>.put()</code>, or <code>.delete()</code>.</p>
        `,
      "code": "// GET Request\nthis.http.get<User>('/api/user/1').subscribe(user => this.user = user);\n\n// POST Request with body\nconst newUser = { name: 'John' };\nthis.http.post('/api/users', newUser).subscribe();",
      "language": "typescript"
    },
    {
      "id": "what-is-httpclientmodule",
      "title": "What is HttpClientModule?",
      "explanation": `
          <p><code>HttpClientModule</code> provides the <code>HttpClient</code> service. It must be imported into your <strong>AppModule</strong> (or use <code>provideHttpClient()</code> in standalone apps).</p>
        `,
      "code": "@NgModule({\n  imports: [BrowserModule, HttpClientModule],\n  bootstrap: [AppComponent]\n})\nexport class AppModule { }",
      "language": "typescript"
    },
    {
      "id": "how-to-handle-http-errors",
      "title": "How to handle HTTP errors?",
      "explanation": `
          <p>HTTP errors are handled using the RxJS <code>catchError</code> operator and the <code>HttpErrorResponse</code> class.</p>
        `,
      "code": "import { catchError, throwError } from 'rxjs';\n\nthis.http.get('/api/data').pipe(\n  catchError((error: HttpErrorResponse) => {\n    return throwError(() => new Error('Something went wrong!'));\n  })\n).subscribe();",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><div class="max-w-md mx-auto bg-rose-50 border border-rose-200 rounded-xl p-4"><p class="text-xs font-bold text-rose-700 uppercase mb-2">Error Handling Pipeline</p><div class="flex items-center gap-2 text-xs font-mono"><span class="bg-white px-2 py-1 rounded">Request</span><span class="text-slate-400">&rarr;</span><span class="bg-rose-100 text-rose-700 px-2 py-1 rounded">Error</span><span class="text-slate-400">&rarr;</span><span class="bg-amber-100 text-amber-700 px-2 py-1 rounded">catchError()</span></div></div></div>`
    },
    {
      "id": "what-are-interceptors",
      "title": "What are interceptors?",
      "explanation": `
          <p><strong>Interceptors</strong> act as middleware for HTTP requests and responses, allowing you to globally modify headers (like Auth tokens) or log activities.</p>
        `,
      "code": "intercept(req: HttpRequest<any>, next: HttpHandler) {\n  const authReq = req.clone({ setHeaders: { Authorization: 'Bearer token' } });\n  return next.handle(authReq);\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Interception Logic</p><div class="flex items-center justify-center gap-3"><div class="bg-slate-100 p-2 rounded text-[10px]">App</div><div class="text-slate-300">&rarr;</div><div class="bg-indigo-600 text-white p-3 rounded-lg text-xs font-bold">INTERCEPTOR</div><div class="text-slate-300">&rarr;</div><div class="bg-slate-100 p-2 rounded text-[10px]">Server</div></div></div>`
    },
    {
      "id": "how-to-implement-http-interceptors",
      "title": "How to implement HTTP interceptors?",
      "explanation": `
          <p>Implement the <code>HttpInterceptor</code> interface and register it using the <code>HTTP_INTERCEPTORS</code> multi-provider token.</p>
        `,
      "code": "{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }",
      "language": "typescript"
    },
    {
      "id": "what-is-cors",
      "title": "What is CORS?",
      "explanation": `
          <p><strong>CORS</strong> is a security feature. In Angular, CORS errors occur when the API hasn't authorized the origin (e.g., localhost:4200). It must be fixed on the <strong>Server side</strong>.</p>
        `,
      "code": "// Server Header:\n// Access-Control-Allow-Origin: http://localhost:4200",
      "language": "javascript",
      "diagram": `<div class="diagram-wrap"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="bg-rose-50 border-2 border-rose-200 rounded-xl p-4 text-center text-xs font-bold text-rose-700">Blocked</div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 text-center text-xs font-bold text-emerald-700">Allowed</div></div></div>`
    }
  ]
});