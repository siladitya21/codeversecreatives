window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "pwa",
  "title": "Progressive Web Apps (PWA)",
  "icon": "bi bi-phone-vibrate",
  "questions": [
    {
      id: "angular-22-standard-pwa-upgrade",
      title: "Angular 22 standard for PWAs",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Installing a <strong>spare fuel tank</strong> on a car that's already road-legal without one. Most trips don't need it. But for the trips that do &mdash; long stretches with no gas station, i.e. flaky or absent network &mdash; it's the difference between arriving and stalling out. PWA features are the same trade: real engineering weight, worth carrying only when the trip (your product) actually calls for offline reads, installability, or push notifications.</p>
          </div>
        </div>
        <p>Angular 22-ready PWA work should be deliberate: not every Angular app needs offline mode. Reach for PWA features when installability, cached shell loading, offline reads, background updates, or push notifications clearly improve the product &mdash; not by default.</p>
        <h3>Modern PWA checklist</h3>
        <ul>
          <li>Add PWA support with Angular's official schematic.</li>
          <li>Register the service worker only for production builds.</li>
          <li>Design cache strategies per asset group and data group.</li>
          <li>Show update prompts when a new service worker version is ready.</li>
          <li>Use HTTPS and valid maskable icons.</li>
          <li>Test offline behavior in a production build, not <code>ng serve</code>.</li>
        </ul>
      `,
      code: `bootstrapApplication(AppComponent, {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
});

@Injectable({ providedIn: 'root' })
export class UpdateService {
  private readonly updates = inject(SwUpdate);

  constructor() {
    if (this.updates.isEnabled) {
      this.updates.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          document.location.reload();
        }
      });
    }
  }
}`,
      language: "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">PWA — Add It On Purpose</p><div class="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto text-xs"><div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center"><p class="font-bold text-indigo-700">ng add @angular/pwa</p><p class="text-slate-500 mt-1">official schematic</p></div><div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center"><p class="font-bold text-emerald-700">Prod-only SW</p><p class="text-slate-500 mt-1">never in ng serve</p></div><div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center"><p class="font-bold text-amber-700">Per-group caching</p><p class="text-slate-500 mt-1">assets vs data</p></div><div class="bg-rose-50 border border-rose-200 rounded-lg p-3 text-center"><p class="font-bold text-rose-700">Update prompts</p><p class="text-slate-500 mt-1">VERSION_READY</p></div><div class="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center"><p class="font-bold text-purple-700">HTTPS required</p><p class="text-slate-500 mt-1">for SW registration</p></div><div class="bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-center"><p class="font-bold text-cyan-700">Test in dist/</p><p class="text-slate-500 mt-1">not dev server</p></div></div></div>`
    },
    {
      "id": "what-is-pwa",
      "title": "What is a Progressive Web App (PWA)?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Walking into a pop-up shop versus filling out paperwork to open a bank account. A native app install is the bank account &mdash; an app store visit, a multi-hundred-megabyte download, permission screens, a wait. A PWA is the pop-up shop &mdash; you're already inside via a URL, browsing in seconds, and if you like it enough to come back, one tap pins a shortcut to your home screen. Same eventual convenience, radically lower cost of entry.</p>
          </div>
        </div>
        <p>A <strong>Progressive Web App (PWA)</strong> is a web application that uses modern browser APIs to feel like a native mobile or desktop app &mdash; installable on the home screen, capable of running offline, and able to receive push notifications. "Progressive" means it enhances progressively: the base experience is still a normal website, and app-like features layer on top for browsers that support them.</p>
        <h3>The three required pillars</h3>
        <p><strong>HTTPS</strong> &mdash; PWAs require a secure origin. Service workers, the technology behind offline capability, only register over HTTPS or localhost. This is a hard security requirement, not a suggestion.</p>
        <p><strong>Web App Manifest</strong> &mdash; a JSON file describing the app: its name, icons, theme color, start URL, and display mode. The browser reads this to know how to install the app and what it should look like launched from the home screen.</p>
        <p><strong>Service Worker</strong> &mdash; a JavaScript file that runs in the background, separate from the main thread, intercepting network requests and serving cached responses. This is what makes offline mode and fast repeat loads possible.</p>
      `,
      "code": "// PWAs combine three technologies to feel native:\n\n// 1. HTTPS: required for service workers\n//    Deploy to https://myapp.com (localhost exempt for development)\n\n// 2. Web App Manifest: tells the browser how to install the app\n// manifest.webmanifest:\n{\n  \"name\": \"My Shop\",\n  \"short_name\": \"Shop\",\n  \"description\": \"The best products, delivered fast.\",\n  \"start_url\": \"/\",\n  \"display\": \"standalone\",      // hides browser chrome when installed\n  \"background_color\": \"#ffffff\",\n  \"theme_color\": \"#6366f1\",\n  \"icons\": [\n    { \"src\": \"icons/icon-192.png\", \"sizes\": \"192x192\", \"type\": \"image/png\" },\n    { \"src\": \"icons/icon-512.png\", \"sizes\": \"512x512\", \"type\": \"image/png\",\n      \"purpose\": \"maskable\" }\n  ]\n}\n\n// 3. Service Worker: intercepts network requests\n// Angular's @angular/service-worker generates and manages this for you.",
      "language": "json",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">The Three Pillars of a PWA</p><div class="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-xl mx-auto text-xs"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center"><p class="font-bold text-indigo-700">HTTPS</p><p class="text-slate-500 mt-1">secure origin required</p></div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center"><p class="font-bold text-emerald-700">Web App Manifest</p><p class="text-slate-500 mt-1">install metadata</p></div><div class="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center"><p class="font-bold text-amber-700">Service Worker</p><p class="text-slate-500 mt-1">offline + caching</p></div></div></div>`
    },
    {
      "id": "how-to-convert-angular-to-pwa",
      "title": "How to convert an Angular app to a PWA?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Hiring a contractor who shows up with a pre-approved permit, wiring diagram, and starter fixtures already in the truck, instead of you sourcing every part yourself. <code>ng add @angular/pwa</code> is that contractor: one command installs the package, wires the service worker into your bootstrap, drafts a manifest, and generates a caching config &mdash; you're customizing a working setup, not building one from a blank page.</p>
          </div>
        </div>
        <p>Angular makes PWA conversion a one-command operation via its CLI schematic. <code>ng add @angular/pwa</code> installs the necessary package and configures everything automatically &mdash; you don't hand-write a service worker or build a manifest from scratch.</p>
        <h3>What ng add @angular/pwa does</h3>
        <p>The schematic modifies your project in several ways: installs <code>@angular/service-worker</code>, enables <code>serviceWorker: true</code> in the production configuration of <code>angular.json</code>, wires in <code>provideServiceWorker()</code> for standalone apps, creates <code>src/manifest.webmanifest</code> with sensible defaults, adds a link to the manifest in <code>index.html</code>, creates <code>ngsw-config.json</code> which defines the caching strategy, and generates placeholder icons in <code>src/assets/icons/</code>.</p>
        <h3>Important: service workers only run in production builds</h3>
        <p>Angular's service worker only activates in production builds. Running <code>ng serve</code> never registers one, because dev mode reloads files constantly, which would fight with caching logic. To test PWA behavior locally, run <code>ng build</code> and serve the <code>dist/</code> folder with a plain static HTTP server.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Running <code>ng serve</code> and wondering why DevTools shows no service worker isn't a bug &mdash; it's by design. Testing offline mode requires a real production build served statically. Just as easy to miss: browsers only register service workers over HTTPS, so a plain <code>http://</code> deploy silently never activates one either (localhost is the one exception).</p>
          </div>
        </div>
      `,
      "code": "# ---- Step 1: Add PWA support ----\nng add @angular/pwa\n# Installs @angular/service-worker, creates manifest.webmanifest,\n# creates ngsw-config.json, updates angular.json and index.html\n\n# ---- Step 2: Build for production (service worker only activates here) ----\nng build --configuration production\n\n# ---- Step 3: Test locally with a static server ----\nnpx http-server dist/my-app -p 8080\n# Open http://localhost:8080 in Chrome\n# DevTools → Application → Service Workers: should show 'Activated and running'\n# DevTools → Application → Manifest: should show app details\n\n# ---- What gets added to angular.json ----\n# \"serviceWorker\": true       <- activates SW in production build\n# \"ngswConfigPath\": \"ngsw-config.json\"  <- points to caching config\n\n# ---- What gets added to main.ts (standalone) ----\n# bootstrapApplication(AppComponent, {\n#   providers: [\n#     provideServiceWorker('ngsw-worker.js', {\n#       enabled: !isDevMode(),\n#       registrationStrategy: 'registerWhenStable:30000'\n#     })\n#   ]\n# })",
      "language": "bash",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">One Command, Five Changes</p><div class="flex flex-col items-center gap-2 text-xs"><div class="bg-slate-800 text-white rounded-lg px-3 py-1.5 font-semibold">ng add @angular/pwa</div><div class="text-slate-300">&darr;</div><div class="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-lg"><div class="bg-indigo-50 border border-indigo-200 rounded px-2 py-1.5 text-center">installs SW package</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1.5 text-center">provideServiceWorker()</div><div class="bg-amber-50 border border-amber-200 rounded px-2 py-1.5 text-center">manifest.webmanifest</div><div class="bg-rose-50 border border-rose-200 rounded px-2 py-1.5 text-center">ngsw-config.json</div><div class="bg-purple-50 border border-purple-200 rounded px-2 py-1.5 text-center">index.html link tag</div><div class="bg-cyan-50 border border-cyan-200 rounded px-2 py-1.5 text-center">placeholder icons</div></div></div></div>`
    },
    {
      "id": "what-is-service-worker",
      "title": "What is a service worker?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>receptionist standing between every visitor and the archive room</strong>. Every request for a document goes through the receptionist first. If she already has a fresh copy in her desk drawer, she hands it over instantly &mdash; no trip to the archive needed. If not, she fetches it, hands it over, and quietly files a copy in the drawer for next time. The service worker plays that receptionist role for every network request your app makes.</p>
          </div>
        </div>
        <p>A <strong>service worker</strong> is a JavaScript file that runs in the browser on a separate background thread, independent from the main page thread, with no access to the DOM. In a PWA, its job is to act as a <strong>programmable network proxy</strong>: it intercepts every outgoing fetch request from the page, decides whether to serve the response from cache or fetch it from the network, and can update cached files in the background.</p>
        <h3>The service worker lifecycle</h3>
        <p>A service worker moves through three states. <strong>Installation</strong> &mdash; when the browser first registers it, the install event fires; Angular's service worker uses this to prefetch and cache every asset defined in <code>ngsw-config.json</code>. <strong>Activation</strong> &mdash; once installed, it waits for existing pages running the old version to close, then takes control; Angular's <code>SwUpdate</code> service gives you hooks to detect and handle this transition. <strong>Active</strong> &mdash; it now intercepts every fetch request from pages under its scope.</p>
        <h3>Angular's ngsw-worker.js</h3>
        <p>Angular generates the service worker file (<code>ngsw-worker.js</code>) automatically during <code>ng build</code>. You configure it entirely by editing <code>ngsw-config.json</code> &mdash; you never write the service worker script by hand. The generated worker implements Angular's caching strategy, asset versioning, and update notification protocol for you.</p>
        <h3>Caching strategies</h3>
        <p><strong>prefetch</strong> downloads all matching files the moment the service worker installs &mdash; use this for your app shell (HTML, JS, CSS), the critical files that must be available offline immediately. <strong>lazy</strong> downloads files on first request and serves from cache thereafter &mdash; use this for secondary assets that aren't critical for the initial load.</p>
      `,
      "code": "// ---- ngsw-config.json: configures what the service worker caches ----\n{\n  \"index\": \"/index.html\",\n  \"assetGroups\": [\n    {\n      \"name\": \"app-shell\",\n      \"installMode\": \"prefetch\",   // cache immediately on SW install\n      \"updateMode\": \"prefetch\",    // update immediately when new version detected\n      \"resources\": {\n        \"files\": [\n          \"/favicon.ico\",\n          \"/index.html\",\n          \"/manifest.webmanifest\",\n          \"/*.css\",\n          \"/*.js\"\n        ]\n      }\n    },\n    {\n      \"name\": \"assets\",\n      \"installMode\": \"lazy\",       // cache on first request\n      \"updateMode\": \"prefetch\",\n      \"resources\": {\n        \"files\": [\n          \"/assets/**\",\n          \"/*.(svg|cur|jpg|jpeg|png|apng|webp|avif|gif|otf|ttf|woff|woff2|ani)\"\n        ]\n      }\n    }\n  ],\n  \"dataGroups\": [\n    {\n      \"name\": \"api-freshness\",\n      \"urls\": [\"/api/products\"],\n      \"cacheConfig\": {\n        \"strategy\": \"freshness\",    // network first, cache as fallback\n        \"maxSize\": 100,\n        \"maxAge\": \"3d\",             // cache for 3 days\n        \"timeout\": \"10s\"            // fall back to cache after 10s timeout\n      }\n    },\n    {\n      \"name\": \"api-performance\",\n      \"urls\": [\"/api/categories\"],\n      \"cacheConfig\": {\n        \"strategy\": \"performance\",  // cache first, refresh in background\n        \"maxSize\": 10,\n        \"maxAge\": \"1h\"\n      }\n    }\n  ]\n}",
      "language": "json",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Service Worker as Network Proxy</p><div class="flex flex-wrap items-center justify-center gap-2 text-xs"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700">Page requests /api/products</div><span class="text-slate-300">&rarr;</span><div class="bg-slate-800 text-white rounded-lg px-3 py-2 text-center font-semibold">Service Worker intercepts</div><span class="text-slate-300">&rarr;</span><div class="flex flex-col gap-1"><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 text-center text-emerald-700">cache hit &rarr; instant reply</div><div class="bg-amber-50 border border-amber-200 rounded px-2 py-1 text-center text-amber-700">cache miss &rarr; fetch network</div></div></div></div>`
    },
    {
      "id": "what-is-manifest-json",
      "title": "What is the Web App Manifest?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>passport application form</strong>. Before the government issues you a passport (before the OS installs your app on the home screen), it needs your name (<code>name</code>), a short version for the ID card (<code>short_name</code>), your photo at specific sizes (<code>icons</code>), and how you want to be addressed (<code>display</code> mode). Skip a required field and the application gets rejected &mdash; the browser just won't offer the install prompt.</p>
          </div>
        </div>
        <p>The <strong>Web App Manifest</strong> (<code>manifest.webmanifest</code> in Angular projects) is a JSON file that tells the browser what to name your app, what icons to use, what color the title bar should be, and how it should display when launched from the home screen. The browser reads it to power the "Add to Home Screen" or "Install App" prompt.</p>
        <h3>Key fields</h3>
        <p><code>name</code> &mdash; the full application name shown during installation and on splash screens. <code>short_name</code> &mdash; the abbreviated name shown under the home screen icon where space is tight. <code>start_url</code> &mdash; the URL that opens when launched from the home screen, usually <code>/</code> but can be a specific page. <code>display</code> &mdash; how the app looks when launched: <code>standalone</code> hides the browser chrome for a native feel, <code>fullscreen</code> hides everything including the status bar, <code>browser</code> opens in a regular tab. <code>theme_color</code> &mdash; the color of the address bar and status bar. <code>background_color</code> &mdash; the splash screen background shown before the app finishes loading.</p>
        <h3>Icons and maskable icons</h3>
        <p>You must provide icons at multiple sizes &mdash; at minimum 192&times;192 and 512&times;512. The <code>purpose: "maskable"</code> flag marks an icon as safe to crop within various shape masks (circle on Android, rounded square on iOS). Maskable icons carry extra padding around the content so nothing important gets cut off when the OS applies its mask.</p>
      `,
      "code": "// src/manifest.webmanifest (generated by ng add @angular/pwa, customize from here)\n{\n  \"name\": \"My Angular Shop\",\n  \"short_name\": \"Shop\",\n  \"description\": \"Shop the best products with fast delivery.\",\n  \"start_url\": \"/\",\n  \"scope\": \"/\",\n  \"display\": \"standalone\",\n  \"orientation\": \"portrait-primary\",\n  \"background_color\": \"#ffffff\",\n  \"theme_color\": \"#6366f1\",\n  \"lang\": \"en-US\",\n  \"categories\": [\"shopping\", \"lifestyle\"],\n  \"screenshots\": [\n    { \"src\": \"screenshots/home.png\", \"sizes\": \"1280x720\", \"type\": \"image/png\" }\n  ],\n  \"icons\": [\n    { \"src\": \"assets/icons/icon-72x72.png\",   \"sizes\": \"72x72\",   \"type\": \"image/png\" },\n    { \"src\": \"assets/icons/icon-96x96.png\",   \"sizes\": \"96x96\",   \"type\": \"image/png\" },\n    { \"src\": \"assets/icons/icon-128x128.png\", \"sizes\": \"128x128\", \"type\": \"image/png\" },\n    { \"src\": \"assets/icons/icon-192x192.png\", \"sizes\": \"192x192\", \"type\": \"image/png\" },\n    { \"src\": \"assets/icons/icon-512x512.png\", \"sizes\": \"512x512\", \"type\": \"image/png\" },\n    {\n      \"src\": \"assets/icons/icon-512x512.png\",\n      \"sizes\": \"512x512\",\n      \"type\": \"image/png\",\n      \"purpose\": \"maskable\"  // safe to crop into a circle/rounded-square on Android\n    }\n  ]\n}\n\n// Linked in index.html (added automatically by ng add @angular/pwa):\n// <link rel=\"manifest\" href=\"manifest.webmanifest\" />",
      "language": "json",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Manifest Fields &rarr; What The User Sees</p><div class="space-y-2 max-w-md mx-auto text-xs"><div class="flex items-center gap-3"><span class="bg-indigo-100 text-indigo-700 font-mono font-bold rounded px-2 py-1 w-32 text-center">short_name</span><span class="text-slate-300">&rarr;</span><span class="text-slate-600">label under home screen icon</span></div><div class="flex items-center gap-3"><span class="bg-emerald-100 text-emerald-700 font-mono font-bold rounded px-2 py-1 w-32 text-center">theme_color</span><span class="text-slate-300">&rarr;</span><span class="text-slate-600">address/status bar color</span></div><div class="flex items-center gap-3"><span class="bg-amber-100 text-amber-700 font-mono font-bold rounded px-2 py-1 w-32 text-center">display</span><span class="text-slate-300">&rarr;</span><span class="text-slate-600">standalone hides browser chrome</span></div><div class="flex items-center gap-3"><span class="bg-rose-100 text-rose-700 font-mono font-bold rounded px-2 py-1 w-32 text-center">icons[maskable]</span><span class="text-slate-300">&rarr;</span><span class="text-slate-600">safe crop on any OS shape mask</span></div></div></div>`
    },
    {
      "id": "sw-update-management",
      "title": "Managing app updates with SwUpdate",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>hotel renovating one floor at a time while guests are still staying there</strong>. The new floor gets built quietly in the background while current guests carry on as normal. Only once it's fully ready does the front desk offer existing guests the option to move to the renovated rooms &mdash; nobody gets shoved into an unfinished floor mid-stay. <code>SwUpdate</code> is that front desk, letting you choose exactly when to move users onto the new version.</p>
          </div>
        </div>
        <p>One of the most important operational concerns with PWAs is <strong>update management</strong>. Because service workers cache your app shell aggressively, users can keep running an old version for days or weeks after you deploy a new one. Angular's <code>SwUpdate</code> service provides a reactive API for detecting, prompting, and applying updates.</p>
        <h3>How Angular detects updates</h3>
        <p>When a user visits the app, the service worker checks the server for a new <code>ngsw.json</code> manifest, generated at build time. If it changed, a new version is available, and the service worker downloads the new files in the background without disrupting the current session. Once everything's downloaded, it notifies the app through <code>SwUpdate.versionUpdates</code>.</p>
        <h3>Version update events</h3>
        <p>The <code>versionUpdates</code> observable emits several event types: <code>VERSION_DETECTED</code> (a new version is downloading), <code>VERSION_READY</code> (downloaded and ready to activate), <code>VERSION_INSTALLATION_FAILED</code> (download failed), and <code>NO_NEW_VERSION_DETECTED</code> (already current). Handle <code>VERSION_READY</code> to show a "New version available" banner and let the user decide when to update.</p>
        <h3>Unrecoverable state</h3>
        <p>Sometimes a service worker gets stuck unable to serve a requested resource &mdash; for example, a cached chunk is from an old version and the server no longer has the matching API format. Angular's <code>SwUpdate.unrecoverable</code> observable fires here. The correct response is to reload the page and force a fresh download.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Shipping a PWA with no update UI at all means users can be stuck on a version from weeks ago and never know it &mdash; the service worker checks for updates only when the app is opened, not continuously. Forgetting to also subscribe to <code>unrecoverable</code> is the other half of the trap: without it, a cache/API mismatch just breaks silently instead of prompting a recovering reload.</p>
          </div>
        </div>
      `,
      "code": "import { Component, inject, OnInit } from '@angular/core';\nimport { SwUpdate, VersionReadyEvent } from '@angular/service-worker';\nimport { filter } from 'rxjs/operators';\n\n@Component({\n  selector: 'app-update-notifier',\n  template: `\n    <div *ngIf=\"updateAvailable\" class=\"update-banner\">\n      <span>A new version is available!</span>\n      <button (click)=\"activateUpdate()\">Update Now</button>\n      <button (click)=\"updateAvailable = false\">Later</button>\n    </div>\n  `\n})\nexport class UpdateNotifierComponent implements OnInit {\n  private swUpdate = inject(SwUpdate);\n  updateAvailable = false;\n\n  ngOnInit(): void {\n    if (!this.swUpdate.isEnabled) {\n      console.log('Service worker disabled (dev mode)');\n      return;\n    }\n\n    // Listen for a new version that is ready to activate\n    this.swUpdate.versionUpdates\n      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))\n      .subscribe(evt => {\n        console.log(`Current version: ${evt.currentVersion.hash}`);\n        console.log(`New version: ${evt.latestVersion.hash}`);\n        this.updateAvailable = true;\n      });\n\n    // Handle unrecoverable state — reload to recover\n    this.swUpdate.unrecoverable.subscribe(event => {\n      console.error('Unrecoverable SW state:', event.reason);\n      // Must reload — the app cannot continue in this state\n      if (confirm('Application error. Reload to recover?')) {\n        window.location.reload();\n      }\n    });\n\n    // Periodically check for updates (every 6 hours)\n    setInterval(() => this.swUpdate.checkForUpdate(), 6 * 60 * 60 * 1000);\n  }\n\n  async activateUpdate(): Promise<void> {\n    await this.swUpdate.activateUpdate();\n    // Reload to apply the new version\n    document.location.reload();\n  }\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">SwUpdate Event Flow</p><div class="flex flex-wrap items-center justify-center gap-2 text-xs"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700">App opens</div><span class="text-slate-300">&rarr;</span><div class="bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700">VERSION_DETECTED</div><span class="text-slate-300">&rarr;</span><div class="bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700">VERSION_READY<br><span class="font-normal text-slate-500">show banner</span></div><span class="text-slate-300">&rarr;</span><div class="bg-rose-50 border-2 border-rose-200 rounded-lg px-3 py-2 text-center font-semibold text-rose-700">activateUpdate()<br><span class="font-normal text-slate-500">reload()</span></div></div></div>`
    }
  ]
});
