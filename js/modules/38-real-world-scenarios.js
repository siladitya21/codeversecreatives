window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "real-world-scenarios",
  "title": "Real-world Scenarios",
  "icon": "bi bi-globe",
  "questions": [
    {
      "id": "how-to-structure-large-applications",
      "title": "How to structure large applications?",
      "explanation": `
          <p>Structuring large Angular applications effectively is crucial for maintainability, scalability, and team collaboration. Common approaches involve breaking down the application into logical, cohesive units.</p>
          <h3>Key Principles</h3>
          <ul>
            <li><strong>Feature Modules:</strong> Grouping components, services, and routes related to a specific feature (e.g., <code>AuthModule</code>, <code>ProductsModule</code>).</li>
            <li><strong>Shared Module:</strong> For components, directives, and pipes that are used across multiple feature modules.</li>
            <li><strong>Core Module:</strong> For singleton services (e.g., authentication, logging) and components that are loaded once for the entire application (e.g., header, footer).</li>
            <li><strong>Data Access Layer:</strong> Separating API interaction logic into dedicated services.</li>
            <li><strong>Monorepo vs. Multi-repo:</strong> Deciding whether to keep all projects in one repository or separate them.</li>
          </ul>
        `,
      "code": "// Example of a modular structure:\n// src/\n// ├── app/\n// │   ├── core/           (AuthService, ErrorHandler, Interceptors)\n// │   ├── shared/         (Reusable components, pipes, directives)\n// │   ├── features/       (Lazy-loaded feature modules)\n// │   │   ├── auth/       (Login, Register, Forgot Password)\n// │   │   ├── products/   (ProductList, ProductDetail)\n// │   │   └── users/      (UserList, UserProfile)\n// │   └── app-routing.module.ts\n// └── main.ts",
      "language": "bash",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Large App Structure</p><div class="flex flex-col items-center gap-2"><div class="bg-indigo-600 text-white p-2 rounded text-xs">AppModule</div><div class="text-slate-300">&darr;</div><div class="flex gap-4"><div class="bg-emerald-50 border border-emerald-200 p-2 rounded text-xs">CoreModule</div><div class="bg-amber-50 border border-amber-200 p-2 rounded text-xs">SharedModule</div></div><div class="text-slate-300">&darr;</div><div class="flex gap-4"><div class="bg-rose-50 border border-rose-200 p-2 rounded text-xs">AuthFeature</div><div class="bg-purple-50 border border-purple-200 p-2 rounded text-xs">ProductFeature</div></div></div></div>`
    },
    {
      "id": "folder-structure-best-practices",
      "title": "Folder structure best practices",
      "explanation": `
          <p>A consistent and logical folder structure improves code discoverability and maintainability. The <strong>LIFT principle</strong> (Locate, Identify, Flat, T-DRY) is a good guideline:</p>
          <ul>
            <li><strong>L</strong>ocate: Code is easy to find.</li>
            <li><strong>I</strong>dentify: Code is easy to identify by its name.</li>
            <li><strong>F</strong>lat: Keep folder structure as flat as possible.</li>
            <li><strong>T-DRY:</strong> Don't Repeat Yourself (within reason).</li>
          </ul>
          <p>Organize by feature (e.g., <code>products/</code>, <code>users/</code>) rather than by type (e.g., <code>components/</code>, <code>services/</code>).</p>
        `,
      "code": "// Good: Group by feature\n// products/\n// ├── product-list/\n// │   ├── product-list.component.ts\n// │   └── product-list.component.html\n// ├── product-detail/\n// │   ├── product-detail.component.ts\n// │   └── product-detail.component.html\n// └── product.service.ts\n\n// Bad: Group by type\n// components/\n// ├── product-list.component.ts\n// └── product-detail.component.ts\n// services/\n// └── product.service.ts",
      "language": "bash"
    },
    {
      "id": "code-splitting-strategies",
      "title": "Code splitting strategies",
      "explanation": `
          <p><strong>Code splitting</strong> is a technique to divide your application's code into smaller chunks that can be loaded on demand. This reduces the initial bundle size and improves application startup time.</p>
          <h3>Common Strategies</h3>
          <ul>
            <li><strong>Lazy Loading:</strong> Loading feature modules only when their routes are activated. This is the most common and effective strategy in Angular.</li>
            <li><strong>Preloading:</strong> Loading lazy-loaded modules in the background after the initial application has loaded, anticipating user navigation.</li>
            <li><strong>Webpack Configuration:</strong> Advanced Webpack configurations can be used to split code based on vendor libraries or other criteria.</li>
          </ul>
        `,
      "code": "// Lazy loading a feature module via router:\nconst routes: Routes = [\n  {\n    path: 'admin',\n    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)\n  }\n];\n\n// Preloading strategy:\nRouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules });",
      "language": "typescript"
    },
    {
      "id": "handling-authentication",
      "title": "Handling authentication",
      "explanation": `
          <p>Authentication in Angular typically involves managing user login, session, and token handling. Common patterns include:</p>
          <ul>
            <li><strong>Token-based Authentication (JWT):</strong> The server issues a JWT upon successful login, which the client stores (e.g., in <code>localStorage</code>) and sends with subsequent requests via an HTTP Interceptor.</li>
            <li><strong>OAuth 2.0 / OpenID Connect:</strong> For integrating with third-party identity providers.</li>
            <li><strong>Auth Guards:</strong> To protect routes and ensure only authenticated users can access certain parts of the application.</li>
            <li><strong>Auth Service:</strong> A dedicated service to encapsulate login, logout, and token management logic.</li>
          </ul>
        `,
      "code": "import { Injectable } from '@angular/core';\nimport { CanActivate, Router, UrlTree } from '@angular/router';\nimport { Observable } from 'rxjs';\n\n@Injectable({ providedIn: 'root' })\nexport class AuthGuard implements CanActivate {\n  constructor(private authService: AuthService, private router: Router) {}\n\n  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {\n    if (this.authService.isLoggedIn()) {\n      return true;\n    } else {\n      return this.router.createUrlTree(['/login']);\n    }\n  }\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Auth Flow (JWT)</p><div class="flex flex-col items-center gap-2"><div class="bg-indigo-50 border border-indigo-200 p-2 rounded text-xs">Login Request</div><div class="text-slate-300">&darr;</div><div class="bg-emerald-50 border border-emerald-200 p-2 rounded text-xs">Server issues JWT</div><div class="text-slate-300">&darr;</div><div class="bg-amber-50 border border-amber-200 p-2 rounded text-xs">Client stores JWT</div><div class="text-slate-300">&darr;</div><div class="bg-rose-50 border border-rose-200 p-2 rounded text-xs">Interceptor adds JWT to requests</div></div></div>`
    },
    {
      "id": "role-based-access-control",
      "title": "Role-based access control",
      "explanation": `
          <p><strong>Role-Based Access Control (RBAC)</strong> restricts system access to authorized users based on their assigned roles (e.g., 'admin', 'editor', 'viewer').</p>
          <h3>Implementation in Angular</h3>
          <ul>
            <li><strong>Backend:</strong> The server is the ultimate source of truth for user roles and permissions.</li>
            <li><strong>Auth Service:</strong> Stores the user's role after login.</li>
            <li><strong>Route Guards:</strong> Use <code>CanActivate</code> guards to check if a user's role allows access to a specific route.</li>
            <li><strong>Custom Directives:</strong> To hide or show UI elements based on the user's role (e.g., an 'Edit' button only for 'admin').</li>
          </ul>
        `,
      "code": "import { Injectable } from '@angular/core';\nimport { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';\nimport { Observable } from 'rxjs';\n\n@Injectable({ providedIn: 'root' })\nexport class RoleGuard implements CanActivate {\n  constructor(private authService: AuthService, private router: Router) {}\n\n  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {\n    const requiredRole = route.data['role'];\n    if (this.authService.hasRole(requiredRole)) {\n      return true;\n    } else {\n      return this.router.createUrlTree(['/unauthorized']);\n    }\n  }\n}\n\n// In router config:\n// { path: 'admin', component: AdminPanelComponent, canActivate: [RoleGuard], data: { role: 'admin' } }",
      "language": "typescript"
    },
    {
      "id": "file-upload-download",
      "title": "File upload/download",
      "explanation": `
          <p>Handling file operations in Angular typically involves using <code>HttpClient</code> for uploads and downloads, often with progress tracking.</p>
          <h3>File Upload</h3>
          <ul>
            <li>Use <code>FormData</code> to package the file(s) and any additional data.</li>
            <li>Send a <code>POST</code> request with <code>HttpClient</code>, setting <code>reportProgress: true</code> to track upload progress.</li>
          </ul>
          <h3>File Download</h3>
          <ul>
            <li>Send a <code>GET</code> request, setting <code>responseType: 'blob'</code>.</li>
            <li>Create a URL for the blob and trigger a download.</li>
          </ul>
        `,
      "code": "import { HttpClient, HttpEventType } from '@angular/common/http';\n\nconstructor(private http: HttpClient) {}\n\nuploadFile(file: File) {\n  const formData = new FormData();\n  formData.append('file', file, file.name);\n  formData.append('description', 'My file');\n\n  this.http.post('/api/upload', formData, { reportProgress: true, observe: 'events' })\n    .subscribe(event => {\n      if (event.type === HttpEventType.UploadProgress) {\n        console.log('Upload Progress:', Math.round(100 * event.loaded / (event.total || 1)));\n      } else if (event.type === HttpEventType.Response) {\n        console.log('Upload complete!', event.body);\n      }\n    });\n}\n\ndownloadFile(filename: string) {\n  this.http.get(`/api/download/${filename}`, { responseType: 'blob' })\n    .subscribe(blob => {\n      const url = window.URL.createObjectURL(blob);\n      const a = document.createElement('a');\n      a.href = url;\n      a.download = filename;\n      document.body.appendChild(a);\n      a.click();\n      window.URL.revokeObjectURL(url);\n      a.remove();\n    });\n}",
      "language": "typescript"
    },
    {
      "id": "caching-strategies",
      "title": "Caching strategies",
      "explanation": `
          <p>Caching is essential for improving application performance and reducing server load. Various strategies can be employed in Angular:</p>
          <ul>
            <li><strong>HTTP Caching Headers:</strong> Leveraging standard HTTP headers (<code>Cache-Control</code>, <code>ETag</code>, <code>Last-Modified</code>) configured on the server.</li>
            <li><strong>Service Workers:</strong> For aggressive caching of static assets and API responses, enabling offline capabilities (PWA).</li>
            <li><strong>RxJS Operators:</strong> Using operators like <code>shareReplay()</code> to cache Observable results and prevent multiple subscriptions from triggering redundant HTTP requests.</li>
            <li><strong>In-memory Caching:</strong> Implementing a simple cache service to store frequently accessed data for a short period.</li>
          </ul>
        `,
      "code": "import { HttpClient } from '@angular/common/http';\nimport { shareReplay } from 'rxjs/operators';\n\n@Injectable({ providedIn: 'root' })\nexport class ProductService {\n  private products$ = this.http.get<Product[]>('/api/products').pipe(\n    shareReplay(1) // Cache the last emitted value and replay to new subscribers\n  );\n\n  constructor(private http: HttpClient) {}\n\n  getProducts() {\n    return this.products$;\n  }\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><div class="max-w-md mx-auto bg-amber-50 border border-amber-200 rounded-xl p-4 text-center"><p class="text-xs font-bold text-amber-700">First Subscriber &rarr; HTTP Request &rarr; Data Cached</p><p class="text-xs font-bold text-emerald-700 mt-2">Subsequent Subscribers &rarr; Cached Data (No HTTP)</p></div></div>`
    },
    {
      "id": "websocket-integration",
      "title": "WebSocket integration",
      "explanation": `
          <p><strong>WebSockets</strong> provide full-duplex communication channels over a single TCP connection, enabling real-time features like chat, live notifications, and collaborative editing.</p>
          <p>In Angular, RxJS provides the <code>WebSocketSubject</code> (from <code>rxjs/webSocket</code>) to easily integrate with WebSocket APIs, treating the WebSocket connection as an Observable stream.</p>
        `,
      "code": "import { Injectable } from '@angular/core';\nimport { webSocket, WebSocketSubject } from 'rxjs/webSocket';\n\ninterface Message { text: string; }\n\n@Injectable({ providedIn: 'root' })\nexport class WebSocketService {\n  private socket$: WebSocketSubject<Message>;\n\n  constructor() {\n    this.socket$ = webSocket<Message>('ws://localhost:8080/ws');\n  }\n\n  connect() {\n    this.socket$.subscribe(\n      msg => console.log('Message from server:', msg),\n      err => console.error('WebSocket error:', err),\n      () => console.warn('WebSocket connection closed')\n    );\n  }\n\n  sendMessage(message: Message) {\n    this.socket$.next(message);\n  }\n\n  close() {\n    this.socket$.complete();\n  }\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">WebSocket Flow</p><div class="flex items-center justify-between max-w-md mx-auto"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-indigo-700">Angular App</p><p class="text-[10px] text-slate-500">WebSocketSubject</p></div><div class="text-slate-300">&harr;</div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-emerald-700">WebSocket Server</p></div></div></div>`
    }
  ]
});