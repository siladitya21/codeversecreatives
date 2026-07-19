window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "ssr-hydration",
  "title": "SSR & Hydration",
  "icon": "bi bi-server",
  "questions": [
    {
      id: "angular-22-standard-ssr-upgrade",
      title: "Angular 22 standard for SSR and hydration",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Choosing how a meal reaches the table. A private dashboard is <strong>cooked to order in your own kitchen</strong> (CSR) &mdash; nobody else needs it fast. A public landing page is <strong>meal-prepped in bulk the night before</strong> (prerendering) &mdash; identical for everyone, ready instantly. A personalized product page is <strong>plated fresh per customer as they sit down</strong> (SSR) &mdash; dynamic, but still served fast because the kitchen (server) does the first pass, not the diner.</p>
          </div>
        </div>
        <p>Angular 22-ready SSR is about choosing the right rendering mode per route: client-side rendering for private app screens, prerendering for static public pages, and server-side rendering with hydration for dynamic public content. Hydration should preserve server-rendered DOM and make it interactive without flicker.</p>
        <h3>Modern SSR checklist</h3>
        <ul>
          <li>Add SSR with <code>ng add @angular/ssr</code>.</li>
          <li>Use hydration providers in the client app configuration.</li>
          <li>Guard browser-only APIs like <code>window</code>, <code>document</code>, and <code>localStorage</code>.</li>
          <li>Use TransferState or the HTTP transfer cache to avoid duplicate data fetching.</li>
          <li>Choose prerendering for static content and SSR for per-request content.</li>
          <li>Test both first paint and post-hydration interactivity.</li>
        </ul>
      `,
      code: `export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient()
  ]
};

@Injectable({ providedIn: 'root' })
export class BrowserStorage {
  private readonly platformId = inject(PLATFORM_ID);

  getTheme(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    return localStorage.getItem('theme');
  }
}`,
      language: "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Choosing a Rendering Mode per Route</p><div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs"><div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center"><p class="font-bold text-indigo-700">CSR</p><p class="text-slate-500 mt-1">private dashboards, no SEO need</p></div><div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center"><p class="font-bold text-emerald-700">Prerender (SSG)</p><p class="text-slate-500 mt-1">static public pages, CDN-served</p></div><div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center"><p class="font-bold text-amber-700">SSR + hydration</p><p class="text-slate-500 mt-1">dynamic public content, per request</p></div></div></div>`
    },
    {
      "id": "ssr-deep-dive",
      "title": "Server-Side Rendering — why it matters and how Angular does it",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Ordering furniture flat-packed versus pre-assembled. CSR ships you a flat box of parts (an empty <code>index.html</code> plus JS) and you build the whole thing in your living room before you can sit on it &mdash; the box arrives fast, but you wait to actually use it. SSR ships the assembled chair straight to your door: you can sit down the moment it arrives, while the instructions (Angular's JS) quietly finish tightening the last few screws in the background (hydration).</p>
          </div>
        </div>
        <p>A standard Angular application is a <strong>Client-Side Rendered (CSR)</strong> SPA: the browser downloads a mostly-empty <code>index.html</code>, then downloads and executes JavaScript, then Angular renders the DOM. The user sees a blank screen until all of that completes. For a fast connection and a small app, this is imperceptible. For a slow connection, a large app, or a first-time visitor with an empty cache, it can mean several seconds of a blank or loading screen before any content appears.</p>
        <p><strong>Server-Side Rendering (SSR)</strong> moves the initial render to a Node.js server. When a user requests a URL, the server runs the Angular application, renders the full DOM to an HTML string, and sends that HTML to the browser. The browser can paint real content immediately &mdash; no JavaScript needed for the initial visual render. Angular's JavaScript then loads in the background and <em>hydrates</em> the page (attaches event listeners and takes over reactivity) without discarding the server-rendered content.</p>
        <h3>The three rendering modes</h3>
        <p><strong>CSR</strong> (Client-Side Rendering): browser downloads empty HTML + JS, Angular renders in browser. Simplest to deploy, slowest first paint, bad for SEO without additional tooling.</p>
        <p><strong>SSR</strong> (Server-Side Rendering): Node.js server renders HTML per request. Fast first paint, good SEO, requires a running Node.js server.</p>
        <p><strong>SSG / Prerendering</strong> (Static Site Generation): HTML files are generated at build time for specific routes. Fastest possible load time, deployable to a CDN with no server, only suitable for routes with content that does not change per-user or per-request.</p>
        <h3>Angular SSR setup</h3>
        <p>Angular ships SSR support natively via <code>@angular/ssr</code>, no separate <code>@angular/universal</code> install needed. The CLI command <code>ng add @angular/ssr</code> adds an Express server (<code>server.ts</code>), a server-specific entry point, and configures the build to produce both browser and server bundles.</p>
      `,
      "code": "# ---- Add SSR to an existing Angular project ----\nng add @angular/ssr\n# Adds: server.ts, app.config.server.ts, and updates angular.json\n\n# ---- Build and run SSR locally ----\nnpm run build          # produces dist/browser/ and dist/server/\nnpm run serve:ssr      # starts the Node/Express server\n\n# ---- Generated server.ts (Express entry point) ----\nimport 'zone.js/node';\nimport { APP_BASE_HREF } from '@angular/common';\nimport { CommonEngine } from '@angular/ssr';\nimport express from 'express';\nimport { dirname, join, resolve } from 'node:path';\nimport { fileURLToPath } from 'node:url';\nimport bootstrap from './src/main.server';\n\nconst serverDistFolder = dirname(fileURLToPath(import.meta.url));\nconst browserDistFolder = resolve(serverDistFolder, '../browser');\n\nconst app = express();\nconst commonEngine = new CommonEngine();\n\n// Serve static files from the browser build\napp.get('*.*', express.static(browserDistFolder, { maxAge: '1y' }));\n\n// All other requests: render with Angular\napp.get('*', (req, res, next) => {\n  const { protocol, originalUrl, baseUrl, headers } = req;\n  commonEngine\n    .render({\n      bootstrap,\n      documentFilePath: join(browserDistFolder, 'index.html'),\n      url: `${protocol}://${headers.host}${originalUrl}`,\n      publicPath: browserDistFolder,\n      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }]\n    })\n    .then(html => res.send(html))\n    .catch(next);\n});\n\napp.listen(4000, () => console.log('Server running on http://localhost:4000'));",
      "language": "bash",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Request Flow — SSR vs CSR</p><div class="flex flex-wrap items-center justify-center gap-2 text-xs"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700">Browser requests /product/1</div><span class="text-slate-300">&rarr;</span><div class="bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700">Node server renders full HTML</div><span class="text-slate-300">&rarr;</span><div class="bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700">Browser paints real content</div><span class="text-slate-300">&rarr;</span><div class="bg-purple-50 border-2 border-purple-200 rounded-lg px-3 py-2 text-center font-semibold text-purple-700">JS loads, hydrates in background</div></div></div>`
    },
    {
      "id": "platform-guards",
      "title": "isPlatformBrowser and isPlatformServer — writing SSR-safe code",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Filming a play versus performing it live. The server is filming a rehearsal in an empty theatre &mdash; there's no audience yet, so anything that only makes sense with a live audience present (<code>window</code>, <code>localStorage</code>, a round of applause) simply isn't there to reference. Reach for it during the recording and you get a <code>ReferenceError</code>, not a crowd. <code>isPlatformBrowser()</code> is the director asking "are we filming, or is this the real live show?" before cueing audience-dependent bits.</p>
          </div>
        </div>
        <p>When Angular runs on the server, the Node.js environment does not have a browser. There is no <code>window</code>, no <code>document</code>, no <code>localStorage</code>, no <code>navigator</code>, no <code>requestAnimationFrame</code>. Code that references these APIs will throw a <code>ReferenceError</code> during server rendering, causing the SSR request to fail with a 500 error.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Referencing <code>window</code> or <code>localStorage</code> directly in a component's <strong>constructor</strong> or a field initializer is the single most common way to break SSR &mdash; it runs before you get a chance to check the platform, and it crashes the entire server render, not just that component. Push browser-only reads into <code>ngOnInit()</code> (guarded with <code>isPlatformBrowser</code>) or into <code>afterNextRender()</code>, never the constructor.</p>
          </div>
        </div>
        <p>The solution is to guard browser-specific code with Angular's platform detection utilities. <code>isPlatformBrowser(platformId)</code> and <code>isPlatformServer(platformId)</code> let you branch on whether code is running in the browser or on the server. The <code>PLATFORM_ID</code> injection token gives you the current platform identifier.</p>
        <h3>The afterNextRender hook</h3>
        <p><code>afterNextRender()</code> and <code>afterRender()</code> only execute in the browser &mdash; they are never called during server rendering. These are perfect for initializing third-party JavaScript libraries that manipulate the DOM (charting libraries, sliders, rich text editors), because you can defer their initialization until the browser has the DOM available, without writing an <code>isPlatformBrowser</code> check manually.</p>
        <h3>DOCUMENT token</h3>
        <p>Instead of using the global <code>document</code> directly (which works in browsers but is undefined in some server contexts), inject Angular's <code>DOCUMENT</code> token. Angular provides the correct document object whether running in a browser or in a server context.</p>
      `,
      "code": "import { Component, OnInit, inject, PLATFORM_ID, afterNextRender } from '@angular/core';\nimport { isPlatformBrowser, isPlatformServer, DOCUMENT } from '@angular/common';\n\n@Component({\n  selector: 'app-analytics',\n  template: `<canvas #chart></canvas>`\n})\nexport class AnalyticsComponent implements OnInit {\n  private platformId = inject(PLATFORM_ID);\n  private document = inject(DOCUMENT);\n\n  constructor() {\n    // afterNextRender: only runs in the browser, after the first render\n    // Perfect for DOM-dependent library initialization\n    afterNextRender(() => {\n      // Safe: this code never runs on the server\n      this.initChartLibrary();\n    });\n  }\n\n  ngOnInit(): void {\n    if (isPlatformServer(this.platformId)) {\n      // Server-specific logic: pre-fetch data, set meta tags, etc.\n      console.log('Running on server — no DOM available');\n      return;\n    }\n\n    if (isPlatformBrowser(this.platformId)) {\n      // Browser-only APIs\n      const theme = localStorage.getItem('theme') ?? 'light';\n      this.document.documentElement.setAttribute('data-theme', theme);\n\n      // Track page views (client-side analytics)\n      this.trackPageView(window.location.pathname);\n    }\n  }\n\n  private initChartLibrary(): void {\n    // Third-party chart init that requires DOM\n  }\n\n  private trackPageView(path: string): void {\n    // Google Analytics / Segment call\n  }\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Server vs Browser — What's Available</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-rose-50 border-2 border-rose-200 rounded-xl p-3"><p class="font-bold text-rose-700 text-center mb-2">Server (Node.js)</p><div class="flex flex-col items-center gap-1"><div class="bg-white border border-rose-200 rounded px-2 py-1 w-full text-center line-through text-slate-400">window, document, localStorage</div><div class="bg-white border border-rose-200 rounded px-2 py-1 w-full text-center">DOCUMENT token (safe substitute)</div></div></div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3"><p class="font-bold text-emerald-700 text-center mb-2">Browser</p><div class="flex flex-col items-center gap-1"><div class="bg-white border border-emerald-200 rounded px-2 py-1 w-full text-center">window, document, localStorage — all safe</div><div class="bg-white border border-emerald-200 rounded px-2 py-1 w-full text-center">afterNextRender() runs here only</div></div></div></div></div>`
    },
    {
      "id": "what-is-hydration",
      "title": "Non-destructive hydration — fast, flicker-free SSR",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A stagehand quietly wiring up a fully-built set while the audience is already seated, instead of tearing the set down and rebuilding it in front of everyone. Old Angular SSR would strike the whole set and reconstruct it from scratch the moment the crew (JavaScript) arrived &mdash; a visible flicker mid-show. Non-destructive hydration has the crew crawl through the existing set, quietly connecting wires (event listeners) to props that are already exactly where they need to be.</p>
          </div>
        </div>
        <p>Before Angular 16, the SSR story had a painful limitation: even though the server sent a fully rendered HTML page, when the Angular JavaScript bundle loaded in the browser, it <em>discarded</em> all that server-rendered HTML and re-rendered the entire application from scratch. This caused a visible "flicker" &mdash; the server-rendered content disappeared briefly while Angular rebuilt the DOM.</p>
        <p><strong>Non-destructive hydration</strong>, introduced in Angular 16 and stable since Angular 17, solves this. Instead of destroying the server-rendered DOM and rebuilding it, Angular <em>adopts</em> the existing DOM nodes. It walks the server-rendered HTML, matches it to the component tree, and attaches event listeners and internal state to the already-present DOM elements. No flicker, no extra paint, no layout recalculation.</p>
        <h3>Enabling hydration</h3>
        <p>Add <code>provideClientHydration()</code> to the <code>bootstrapApplication()</code> providers. That's all that's required. Angular handles the rest automatically.</p>
        <h3>HTTP transfer cache</h3>
        <p><code>withHttpTransferCache()</code> extends hydration with a key optimization: HTTP requests made during server rendering are serialized into the HTML. When the browser loads, Angular intercepts the same HTTP calls and serves the cached responses instead of making real network requests. Data that was fetched on the server is reused on the client &mdash; no duplicate API calls, no loading flicker for initial data.</p>
        <h3>Incremental hydration</h3>
        <p>Incremental hydration graduated to stable in Angular 20. Combined with <code>@defer</code>, it lets the server render the full page (including deferred sections), while the client only hydrates the parts the user actually reaches or interacts with &mdash; sections below the fold stay as inert, fast-to-parse static HTML until they're needed.</p>
      `,
      "code": "// ---- main.ts: enable hydration with HTTP transfer cache ----\nimport { bootstrapApplication } from '@angular/platform-browser';\nimport { provideClientHydration, withHttpTransferCache } from '@angular/platform-browser';\nimport { provideHttpClient, withFetch } from '@angular/common/http';\nimport { provideRouter } from '@angular/router';\nimport { AppComponent } from './app/app.component';\nimport { routes } from './app/app.routes';\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    provideRouter(routes),\n    // withFetch() uses the Fetch API instead of XMLHttpRequest\n    // Required for HTTP transfer cache to work correctly in SSR\n    provideHttpClient(withFetch()),\n\n    // provideClientHydration() enables non-destructive DOM reuse\n    // withHttpTransferCache() serializes server HTTP responses into HTML\n    // and replays them on the client — no duplicate API calls\n    provideClientHydration(\n      withHttpTransferCache()\n    )\n  ]\n});\n\n// ---- Effect of withHttpTransferCache ----\n// 1. Server renders page for /products\n// 2. Server calls GET /api/products → gets data → renders HTML\n// 3. Server serializes the /api/products response into a <script> tag in HTML\n// 4. Browser receives the HTML with embedded response data\n// 5. Browser Angular bootstraps — ProductListComponent calls GET /api/products\n// 6. HttpClient detects the transfer cache entry → returns cached data immediately\n// 7. No actual HTTP request is made in the browser for the initial data\n// Result: products appear instantly, no loading spinner on first visit",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Destructive vs Non-Destructive Hydration</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-slate-50 border-2 border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">Before Angular 16</p><div class="flex flex-col items-center gap-1"><div class="bg-rose-50 border border-rose-200 rounded px-2 py-1 w-full text-center">Server HTML painted</div><div class="bg-rose-50 border border-rose-200 rounded px-2 py-1 w-full text-center">JS loads, DOM torn down</div><div class="bg-rose-50 border border-rose-200 rounded px-2 py-1 w-full text-center">Full re-render — visible flicker</div></div></div><div class="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">Angular 17+ hydration</p><div class="flex flex-col items-center gap-1"><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center">Server HTML painted</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center">JS loads, DOM adopted as-is</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center">Listeners attached — no flicker</div></div></div></div></div>`
    },
    {
      "id": "prerendering",
      "title": "Static pre-rendering — SSG for content routes",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A vending machine versus a barista. Pre-rendering stocks the machine once, the night before &mdash; every customer gets the same identical snack instantly, no one waits, and there's no staff needed at 2am. A barista (SSR) makes each drink to order &mdash; necessary when the order is personalized, but it means someone has to be on shift, and the customer waits while it's made.</p>
          </div>
        </div>
        <p><strong>Pre-rendering</strong> (also called Static Site Generation or SSG in other frameworks) renders specific routes to HTML files at <strong>build time</strong>, not at request time. The output is static HTML files that can be deployed to a CDN or any static hosting service &mdash; no Node.js server required at runtime. When a user requests a pre-rendered route, the CDN serves the HTML file instantly.</p>
        <p>Pre-rendering is the right choice for routes whose content does not change based on who is requesting them or when: a company's About page, blog posts, product detail pages (if updated only on deployment), documentation pages. It's inappropriate for routes that show user-specific data (a logged-in user's dashboard), routes that depend on query parameters, or routes with real-time data.</p>
        <h3>Configuring pre-rendering in angular.json</h3>
        <p>The Angular CLI's SSR build supports pre-rendering via the <code>prerender</code> option in <code>angular.json</code>. You can either let Angular discover routes automatically (it crawls your router configuration) or specify a list of routes explicitly. Dynamic routes (e.g., <code>/products/:id</code>) require you to provide the full list of concrete URLs so the build knows which pages to generate.</p>
        <h3>Route-level render mode</h3>
        <p>Angular's per-route render mode configuration lets you declare in <code>app.routes.server.ts</code> which rendering strategy applies to each route: <code>RenderMode.Prerender</code>, <code>RenderMode.Server</code>, or <code>RenderMode.Client</code>. This means one application can use SSG for public content pages, SSR for personalized pages, and CSR for complex interactive dashboards &mdash; without splitting into separate applications.</p>
      `,
      "code": "// ---- angular.json: configure pre-rendering ----\n// Under the build architect target:\n// \"prerender\": {\n//   \"routesFile\": \"routes.txt\"  ← list of routes to pre-render\n// }\n\n// routes.txt\n/\n/about\n/pricing\n/blog/angular-signals-guide\n/blog/getting-started-with-ssr\n/products/1\n/products/2\n/products/3\n\n// ---- Build pre-rendered output ----\n// ng build    → generates dist/browser/index.html, dist/browser/about/index.html, etc.\n\n// ---- Per-route render mode ----\n// app.routes.server.ts\nimport { RenderMode, ServerRoute } from '@angular/ssr';\n\nexport const serverRoutes: ServerRoute[] = [\n  {\n    // Home and marketing pages: pre-render at build time\n    path: '',\n    renderMode: RenderMode.Prerender\n  },\n  {\n    path: 'about',\n    renderMode: RenderMode.Prerender\n  },\n  {\n    // Blog posts: pre-render; provide the concrete URLs\n    path: 'blog/:slug',\n    renderMode: RenderMode.Prerender,\n    async getPrerenderParams() {\n      // Fetch list of published slugs at build time\n      const posts = await fetch('https://api.myblog.com/posts').then(r => r.json());\n      return posts.map((p: { slug: string }) => ({ slug: p.slug }));\n    }\n  },\n  {\n    // Dashboard: user-specific — server-render per request\n    path: 'dashboard',\n    renderMode: RenderMode.Server\n  },\n  {\n    // Rich editor: runs entirely client-side\n    path: 'editor',\n    renderMode: RenderMode.Client\n  },\n  {\n    // Default: SSR for everything else\n    path: '**',\n    renderMode: RenderMode.Server\n  }\n];",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">One App, Per-Route Render Modes</p><div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs"><div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center"><p class="font-bold text-emerald-700">/ and /about</p><p class="text-slate-500 mt-1">RenderMode.Prerender</p></div><div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center"><p class="font-bold text-amber-700">/dashboard</p><p class="text-slate-500 mt-1">RenderMode.Server</p></div><div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center"><p class="font-bold text-indigo-700">/editor</p><p class="text-slate-500 mt-1">RenderMode.Client</p></div></div></div>`
    },
    {
      "id": "transferstate",
      "title": "TransferState — sharing data between server and client",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A relay race baton handoff. The server runner (Node.js) has already done the hard sprint &mdash; fetched data, queried the database, computed a result. Instead of the client runner starting the same sprint over from the starting line, the server hands off the baton (<code>transferState.set(KEY, value)</code>) mid-race, and the client just picks it up and keeps running from where the server left off.</p>
          </div>
        </div>
        <p><code>TransferState</code> is Angular's mechanism for passing arbitrary data from the server render to the browser without an additional HTTP request. While <code>withHttpTransferCache()</code> automatically handles HTTP calls made through <code>HttpClient</code>, <code>TransferState</code> is the lower-level API for data that comes from other sources: database queries made directly in the server process, environment variables, feature flags, or any computation that is expensive to repeat on the client.</p>
        <p>The server stores values under typed keys using <code>transferState.set(KEY, value)</code>. Angular serializes these into a <code>&lt;script&gt;</code> tag embedded in the server-rendered HTML. When the browser bootstraps, it reads this inline script and populates the client-side <code>TransferState</code> store. Your code then checks <code>transferState.hasKey(KEY)</code> and retrieves the value with <code>transferState.get(KEY, defaultValue)</code> &mdash; skipping any expensive work that was already done on the server.</p>
        <h3>makeStateKey</h3>
        <p><code>makeStateKey&lt;T&gt;(key)</code> creates a typed key. The generic parameter <code>T</code> ensures that what you store and retrieve are the same type &mdash; type safety across the server/client boundary.</p>
        <h3>When to use TransferState vs withHttpTransferCache</h3>
        <p>Use <code>withHttpTransferCache()</code> for any data fetched via <code>HttpClient</code> &mdash; it's zero-configuration. Use <code>TransferState</code> directly for non-HTTP data sources: Node.js file system reads, database connections in SSR, environment configuration injected at the server level, or expensive computation results (e.g., markdown-to-HTML rendering).</p>
      `,
      "code": "import { Injectable, inject, PLATFORM_ID } from '@angular/core';\nimport { isPlatformBrowser, isPlatformServer } from '@angular/common';\nimport { TransferState, makeStateKey } from '@angular/core';\nimport { HttpClient } from '@angular/common/http';\nimport { Observable, of } from 'rxjs';\nimport { tap } from 'rxjs/operators';\n\nexport interface Category { id: number; name: string; slug: string; }\n\nconst CATEGORIES_KEY = makeStateKey<Category[]>('categories');\n\n@Injectable({ providedIn: 'root' })\nexport class CategoryService {\n  private transferState = inject(TransferState);\n  private http = inject(HttpClient);\n  private platformId = inject(PLATFORM_ID);\n\n  getCategories(): Observable<Category[]> {\n    // On the client: check if server already fetched this\n    if (isPlatformBrowser(this.platformId)) {\n      if (this.transferState.hasKey(CATEGORIES_KEY)) {\n        const cached = this.transferState.get(CATEGORIES_KEY, []);\n        // Remove from transfer state — we've consumed it\n        this.transferState.remove(CATEGORIES_KEY);\n        return of(cached);\n      }\n    }\n\n    // Fetch from API (runs on server during SSR, or on client if cache missed)\n    return this.http.get<Category[]>('/api/categories').pipe(\n      tap(categories => {\n        // On the server: store in TransferState for the client to consume\n        if (isPlatformServer(this.platformId)) {\n          this.transferState.set(CATEGORIES_KEY, categories);\n        }\n      })\n    );\n  }\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Server-to-Client Baton Handoff</p><div class="flex flex-wrap items-center justify-center gap-2 text-xs"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700">Server fetches categories</div><span class="text-slate-300">&rarr;</span><div class="bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700">transferState.set(KEY, data)</div><span class="text-slate-300">&rarr;</span><div class="bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700">Serialized into &lt;script&gt; tag</div><span class="text-slate-300">&rarr;</span><div class="bg-purple-50 border-2 border-purple-200 rounded-lg px-3 py-2 text-center font-semibold text-purple-700">Client reads, skips refetch</div></div></div>`
    }
  ]
});
