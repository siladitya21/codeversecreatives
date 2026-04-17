window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "ssr-hydration",
  "title": "SSR & Hydration",
  "icon": "bi bi-server",
  "questions": [
    {
      "id": "ssr-deep-dive",
      "title": "Server-Side Rendering — why it matters and how Angular does it",
      "explanation": `
          <p>A standard Angular application is a <strong>Client-Side Rendered (CSR)</strong> SPA: the browser downloads a mostly-empty <code>index.html</code>, then downloads and executes JavaScript, then Angular renders the DOM. The user sees a blank screen until all of that completes. For a fast connection and a small app, this is imperceptible. For a slow connection, a large app, or a first-time visitor with an empty cache, it can mean several seconds of a blank or loading screen before any content appears.</p>

          <p><strong>Server-Side Rendering (SSR)</strong> moves the initial render to a Node.js server. When a user requests a URL, the server runs the Angular application, renders the full DOM to an HTML string, and sends that HTML to the browser. The browser can paint real content immediately — no JavaScript needed for the initial visual render. Angular's JavaScript then loads in the background and <em>hydrates</em> the page (attaches event listeners and takes over reactivity) without discarding the server-rendered content.</p>

          <h3>The Three Rendering Modes</h3>
          <p><strong>CSR</strong> (Client-Side Rendering): browser downloads empty HTML + JS, Angular renders in browser. Simplest to deploy, slowest first paint, bad for SEO without additional tooling.</p>
          <p><strong>SSR</strong> (Server-Side Rendering): Node.js server renders HTML per request. Fast first paint, good SEO, requires a running Node.js server.</p>
          <p><strong>SSG / Prerendering</strong> (Static Site Generation): HTML files are generated at build time for specific routes. Fastest possible load time, deployable to a CDN with no server, only suitable for routes with content that does not change per-user or per-request.</p>

          <h3>Angular SSR Setup</h3>
          <p>Angular 17+ ships SSR support natively via <code>@angular/ssr</code>, removing the need to separately install <code>@angular/universal</code>. The CLI command <code>ng add @angular/ssr</code> adds an Express server (<code>server.ts</code>), a server-specific entry point, and configures the build to produce both browser and server bundles.</p>
        `,
      "code": "# ---- Add SSR to an existing Angular project ----\nng add @angular/ssr\n# Adds: server.ts, app.config.server.ts, and updates angular.json\n\n# ---- Build and run SSR locally ----\nnpm run build          # produces dist/browser/ and dist/server/\nnpm run serve:ssr      # starts the Node/Express server\n\n# ---- Generated server.ts (Express entry point) ----\nimport 'zone.js/node';\nimport { APP_BASE_HREF } from '@angular/common';\nimport { CommonEngine } from '@angular/ssr';\nimport express from 'express';\nimport { dirname, join, resolve } from 'node:path';\nimport { fileURLToPath } from 'node:url';\nimport bootstrap from './src/main.server';\n\nconst serverDistFolder = dirname(fileURLToPath(import.meta.url));\nconst browserDistFolder = resolve(serverDistFolder, '../browser');\n\nconst app = express();\nconst commonEngine = new CommonEngine();\n\n// Serve static files from the browser build\napp.get('*.*', express.static(browserDistFolder, { maxAge: '1y' }));\n\n// All other requests: render with Angular\napp.get('*', (req, res, next) => {\n  const { protocol, originalUrl, baseUrl, headers } = req;\n  commonEngine\n    .render({\n      bootstrap,\n      documentFilePath: join(browserDistFolder, 'index.html'),\n      url: `${protocol}://${headers.host}${originalUrl}`,\n      publicPath: browserDistFolder,\n      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }]\n    })\n    .then(html => res.send(html))\n    .catch(next);\n});\n\napp.listen(4000, () => console.log('Server running on http://localhost:4000'));",
      "language": "bash"
    },
    {
      "id": "platform-guards",
      "title": "isPlatformBrowser and isPlatformServer — writing SSR-safe code",
      "explanation": `
          <p>When Angular runs on the server, the Node.js environment does not have a browser. There is no <code>window</code>, no <code>document</code>, no <code>localStorage</code>, no <code>navigator</code>, no <code>requestAnimationFrame</code>. Code that references these APIs will throw a <code>ReferenceError</code> during server rendering, causing the SSR request to fail with a 500 error.</p>

          <p>The solution is to guard browser-specific code with Angular's platform detection utilities. <code>isPlatformBrowser(platformId)</code> and <code>isPlatformServer(platformId)</code> let you branch on whether code is running in the browser or on the server. The <code>PLATFORM_ID</code> injection token gives you the current platform identifier.</p>

          <h3>The afterNextRender Hook</h3>
          <p>Angular 16.1+ provides <code>afterNextRender()</code> and <code>afterRender()</code> hooks that only execute in the browser — they are never called during server rendering. These are perfect for initializing third-party JavaScript libraries that manipulate the DOM (charting libraries, sliders, rich text editors), because you can defer their initialization until the browser has the DOM available, without writing an <code>isPlatformBrowser</code> check manually.</p>

          <h3>DOCUMENT Token</h3>
          <p>Instead of using the global <code>document</code> directly (which works in browsers but is undefined in some server contexts), inject Angular's <code>DOCUMENT</code> token. Angular provides the correct document object whether running in a browser or in a server context.</p>
        `,
      "code": "import { Component, OnInit, inject, PLATFORM_ID, afterNextRender } from '@angular/core';\nimport { isPlatformBrowser, isPlatformServer, DOCUMENT } from '@angular/common';\n\n@Component({\n  selector: 'app-analytics',\n  standalone: true,\n  template: `<canvas #chart></canvas>`\n})\nexport class AnalyticsComponent implements OnInit {\n  private platformId = inject(PLATFORM_ID);\n  private document = inject(DOCUMENT);\n\n  constructor() {\n    // afterNextRender: only runs in the browser, after the first render\n    // Perfect for DOM-dependent library initialization\n    afterNextRender(() => {\n      // Safe: this code never runs on the server\n      this.initChartLibrary();\n    });\n  }\n\n  ngOnInit(): void {\n    if (isPlatformServer(this.platformId)) {\n      // Server-specific logic: pre-fetch data, set meta tags, etc.\n      console.log('Running on server — no DOM available');\n      return;\n    }\n\n    if (isPlatformBrowser(this.platformId)) {\n      // Browser-only APIs\n      const theme = localStorage.getItem('theme') ?? 'light';\n      this.document.documentElement.setAttribute('data-theme', theme);\n\n      // Track page views (client-side analytics)\n      this.trackPageView(window.location.pathname);\n    }\n  }\n\n  private initChartLibrary(): void {\n    // Third-party chart init that requires DOM\n  }\n\n  private trackPageView(path: string): void {\n    // Google Analytics / Segment call\n  }\n}",
      "language": "typescript"
    },
    {
      "id": "what-is-hydration",
      "title": "Non-destructive hydration — fast, flicker-free SSR",
      "explanation": `
          <p>Before Angular 16, the SSR story had a painful limitation: even though the server sent a fully rendered HTML page, when the Angular JavaScript bundle loaded in the browser, it <em>discarded</em> all that server-rendered HTML and re-rendered the entire application from scratch. This caused a visible "flicker" — the server-rendered content disappeared briefly while Angular rebuilt the DOM. The performance benefit of SSR was partially undermined by this re-render.</p>

          <p><strong>Non-destructive hydration</strong>, introduced in Angular 16 and made stable in Angular 17, solves this. Instead of destroying the server-rendered DOM and rebuilding it, Angular <em>adopts</em> the existing DOM nodes. It walks the server-rendered HTML, matches it to the component tree, and attaches event listeners and internal state to the already-present DOM elements. No flicker, no extra paint, no layout recalculation.</p>

          <h3>Enabling Hydration</h3>
          <p>Add <code>provideClientHydration()</code> to the <code>bootstrapApplication()</code> providers. That is all that is required. Angular handles the rest automatically.</p>

          <h3>HTTP Transfer Cache</h3>
          <p><code>withHttpTransferCache()</code> extends hydration with a key optimization: HTTP requests made during server rendering are serialized into the HTML. When the browser loads, Angular intercepts the same HTTP calls and serves the cached responses instead of making real network requests. Data that was fetched on the server is reused on the client — no duplicate API calls, no loading flicker for initial data.</p>
        `,
      "code": "// ---- main.ts: enable hydration with HTTP transfer cache ----\nimport { bootstrapApplication } from '@angular/platform-browser';\nimport { provideClientHydration, withHttpTransferCache } from '@angular/platform-browser';\nimport { provideHttpClient, withFetch } from '@angular/common/http';\nimport { provideRouter } from '@angular/router';\nimport { AppComponent } from './app/app.component';\nimport { routes } from './app/app.routes';\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    provideRouter(routes),\n    // withFetch() uses the Fetch API instead of XMLHttpRequest\n    // Required for HTTP transfer cache to work correctly in SSR\n    provideHttpClient(withFetch()),\n\n    // provideClientHydration() enables non-destructive DOM reuse\n    // withHttpTransferCache() serializes server HTTP responses into HTML\n    // and replays them on the client — no duplicate API calls\n    provideClientHydration(\n      withHttpTransferCache()\n    )\n  ]\n});\n\n// ---- Effect of withHttpTransferCache ----\n// 1. Server renders page for /products\n// 2. Server calls GET /api/products → gets data → renders HTML\n// 3. Server serializes the /api/products response into a <script> tag in HTML\n// 4. Browser receives the HTML with embedded response data\n// 5. Browser Angular bootstraps — ProductListComponent calls GET /api/products\n// 6. HttpClient detects the transfer cache entry → returns cached data immediately\n// 7. No actual HTTP request is made in the browser for the initial data\n// Result: products appear instantly, no loading spinner on first visit",
      "language": "typescript"
    },
    {
      "id": "prerendering",
      "title": "Static pre-rendering — SSG for content routes",
      "explanation": `
          <p><strong>Pre-rendering</strong> (also called Static Site Generation or SSG in other frameworks) renders specific routes to HTML files at <strong>build time</strong>, not at request time. The output is static HTML files that can be deployed to a CDN or any static hosting service — no Node.js server required at runtime. When a user requests a pre-rendered route, the CDN serves the HTML file instantly.</p>

          <p>Pre-rendering is the right choice for routes whose content does not change based on who is requesting them or when: a company's About page, blog posts, product detail pages (if updated only on deployment), documentation pages. It is inappropriate for routes that show user-specific data (a logged-in user's dashboard), routes that depend on query parameters, or routes with real-time data.</p>

          <h3>Configuring Pre-rendering in angular.json</h3>
          <p>The Angular CLI's SSR build supports pre-rendering via the <code>prerender</code> option in <code>angular.json</code>. You can either let Angular discover routes automatically (it crawls your router configuration) or specify a list of routes explicitly. Dynamic routes (e.g., <code>/products/:id</code>) require you to provide the full list of concrete URLs so the build knows which pages to generate.</p>

          <h3>Route-Level Render Mode (Angular 19+)</h3>
          <p>Angular 19 introduced per-route render mode configuration. You can declare in <code>app.routes.server.ts</code> which rendering strategy applies to each route: <code>RenderMode.Prerender</code>, <code>RenderMode.Server</code>, or <code>RenderMode.Client</code>. This means one application can use SSG for public content pages, SSR for personalized pages, and CSR for complex interactive dashboards — without splitting into separate applications.</p>
        `,
      "code": "// ---- angular.json: configure pre-rendering ----\n// Under the build architect target:\n// \"prerender\": {\n//   \"routesFile\": \"routes.txt\"  ← list of routes to pre-render\n// }\n\n// routes.txt\n/\n/about\n/pricing\n/blog/angular-signals-guide\n/blog/getting-started-with-ssr\n/products/1\n/products/2\n/products/3\n\n// ---- Build pre-rendered output ----\n// ng build    → generates dist/browser/index.html, dist/browser/about/index.html, etc.\n\n// ---- Angular 19+: per-route render mode ----\n// app.routes.server.ts\nimport { RenderMode, ServerRoute } from '@angular/ssr';\n\nexport const serverRoutes: ServerRoute[] = [\n  {\n    // Home and marketing pages: pre-render at build time\n    path: '',\n    renderMode: RenderMode.Prerender\n  },\n  {\n    path: 'about',\n    renderMode: RenderMode.Prerender\n  },\n  {\n    // Blog posts: pre-render; provide the concrete URLs\n    path: 'blog/:slug',\n    renderMode: RenderMode.Prerender,\n    async getPrerenderParams() {\n      // Fetch list of published slugs at build time\n      const posts = await fetch('https://api.myblog.com/posts').then(r => r.json());\n      return posts.map((p: { slug: string }) => ({ slug: p.slug }));\n    }\n  },\n  {\n    // Dashboard: user-specific — server-render per request\n    path: 'dashboard',\n    renderMode: RenderMode.Server\n  },\n  {\n    // Rich editor: runs entirely client-side\n    path: 'editor',\n    renderMode: RenderMode.Client\n  },\n  {\n    // Default: SSR for everything else\n    path: '**',\n    renderMode: RenderMode.Server\n  }\n];",
      "language": "typescript"
    },
    {
      "id": "transferstate",
      "title": "TransferState — sharing data between server and client",
      "explanation": `
          <p><code>TransferState</code> is Angular's mechanism for passing arbitrary data from the server render to the browser without an additional HTTP request. While <code>withHttpTransferCache()</code> automatically handles HTTP calls made through <code>HttpClient</code>, <code>TransferState</code> is the lower-level API for data that comes from other sources: database queries made directly in the server process, environment variables, feature flags, or any computation that is expensive to repeat on the client.</p>

          <p>The server stores values under typed keys using <code>transferState.set(KEY, value)</code>. Angular serializes these into a <code>&lt;script&gt;</code> tag embedded in the server-rendered HTML. When the browser bootstraps, it reads this inline script and populates the client-side <code>TransferState</code> store. Your code then checks <code>transferState.hasKey(KEY)</code> and retrieves the value with <code>transferState.get(KEY, defaultValue)</code> — skipping any expensive work that was already done on the server.</p>

          <h3>makeStateKey</h3>
          <p><code>makeStateKey<T>(key)</code> creates a typed key. The generic parameter <code>T</code> ensures that what you store and retrieve are the same type — type safety across the server/client boundary.</p>

          <h3>When to Use TransferState vs withHttpTransferCache</h3>
          <p>Use <code>withHttpTransferCache()</code> for any data fetched via <code>HttpClient</code> — it is zero-configuration. Use <code>TransferState</code> directly for non-HTTP data sources: Node.js file system reads, database connections in SSR, environment configuration injected at the server level, or computation results that are expensive (e.g., markdown-to-HTML rendering).</p>
        `,
      "code": "import { Injectable, inject, PLATFORM_ID } from '@angular/core';\nimport { isPlatformBrowser, isPlatformServer } from '@angular/common';\nimport { TransferState, makeStateKey } from '@angular/core';\nimport { HttpClient } from '@angular/common/http';\nimport { Observable, of } from 'rxjs';\nimport { tap } from 'rxjs/operators';\n\nexport interface Category { id: number; name: string; slug: string; }\n\nconst CATEGORIES_KEY = makeStateKey<Category[]>('categories');\n\n@Injectable({ providedIn: 'root' })\nexport class CategoryService {\n  private transferState = inject(TransferState);\n  private http = inject(HttpClient);\n  private platformId = inject(PLATFORM_ID);\n\n  getCategories(): Observable<Category[]> {\n    // On the client: check if server already fetched this\n    if (isPlatformBrowser(this.platformId)) {\n      if (this.transferState.hasKey(CATEGORIES_KEY)) {\n        const cached = this.transferState.get(CATEGORIES_KEY, []);\n        // Remove from transfer state — we've consumed it\n        this.transferState.remove(CATEGORIES_KEY);\n        return of(cached);\n      }\n    }\n\n    // Fetch from API (runs on server during SSR, or on client if cache missed)\n    return this.http.get<Category[]>('/api/categories').pipe(\n      tap(categories => {\n        // On the server: store in TransferState for the client to consume\n        if (isPlatformServer(this.platformId)) {\n          this.transferState.set(CATEGORIES_KEY, categories);\n        }\n      })\n    );\n  }\n}",
      "language": "typescript"
    }
  ]
});
