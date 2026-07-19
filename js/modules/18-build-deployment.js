window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "build-deployment",
  "title": "Build & Deployment",
  "icon": "bi bi-box-seam",
  "questions": [
    {
      id: "angular-22-standard-build-upgrade",
      title: "Angular 22 standard for build and deployment",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Shipping a product overseas. You don't hand a customs officer a pile of loose parts and a promise — you crate it properly, label the weight, declare the contents, and pick the right shipping method (sea freight vs air freight) for what's actually inside. A production Angular build is that crating process: optimized, labeled with content hashes, and shipped via the delivery method (CSR, SSR, prerender) that actually fits the product.</p>
          </div>
        </div>
        <p>Angular 22-ready deployment assumes the modern application builder, production optimization, bundle budgets, lazy chunks, environment-specific configuration, and a hosting setup that understands SPAs, SSR, or prerendered output depending on the app type.</p>
        <h3>Modern build checklist</h3>
        <ul>
          <li>Use production builds for every deployment — never ship a development build.</li>
          <li>Keep bundle budgets active and fail builds when bundles grow too far.</li>
          <li>Prefer ESM dependencies and avoid CommonJS warnings.</li>
          <li>Use lazy routes to keep initial chunks small.</li>
          <li>Choose CSR, prerender, or SSR intentionally per product need — not by default habit.</li>
          <li>Configure server fallback to <code>index.html</code> for client-routed SPAs.</li>
        </ul>
      `,
      code: `# Production build
ng build --configuration production

# Analyze output before shipping a large feature
ng build --configuration production --stats-json

# Keep framework and CLI aligned
ng update @angular/core @angular/cli

# SPA hosting rule
# All unknown routes should serve /index.html:
# /products/42 -> /index.html -> Angular Router renders ProductDetailComponent

# SSR / prerender path
# ng add @angular/ssr
# ng build --configuration production`,
      language: "bash",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Pick the Delivery Method On Purpose</p><div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs"><div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center"><p class="font-bold text-indigo-700">CSR</p><p class="text-slate-500 mt-1">internal tools, dashboards</p></div><div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center"><p class="font-bold text-emerald-700">Prerender</p><p class="text-slate-500 mt-1">mostly-static marketing pages</p></div><div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center"><p class="font-bold text-amber-700">SSR</p><p class="text-slate-500 mt-1">SEO-critical, dynamic content</p></div></div></div>`
    },
    {
      "id": "angular-cli-recap",
      "title": "What is Angular CLI and what does it do?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A universal remote that already knows the button layout for your TV, sound bar, and streaming box the moment you take it out of the box — instead of you programming every device from scratch. <code>ng new</code>, <code>ng serve</code>, and <code>ng build</code> are pre-programmed buttons that already know how to talk to TypeScript, the bundler, and the test runner correctly.</p>
          </div>
        </div>
        <p>The <strong>Angular CLI</strong> is a command-line toolchain that manages the entire Angular development workflow. It abstracts away the complex configuration for esbuild, TypeScript, the test runner, ESLint, and SCSS processing behind a set of simple commands, so you can focus on writing Angular code rather than configuring build tools.</p>
        <p>The scope of what the CLI handles is significant. A bare Angular project without it would require a bundler config with loaders for TypeScript, HTML templates, SCSS, assets, and polyfills; a <code>tsconfig.json</code> tuned for Angular's compiler; a test runner config; an ESLint config; and custom scripts wiring it all together. <code>ng new</code> generates all of this in seconds, with best-practice defaults baked in.</p>
        <h3>Scaffolding — ng generate</h3>
        <p><code>ng generate</code> (aliased <code>ng g</code>) creates files that follow Angular's structural and naming conventions. It doesn't just create files — it also updates the relevant routing or barrel file to reference the new item, preventing the common mistake of creating a file but forgetting to wire it in.</p>
        <h3>The build pipeline</h3>
        <p>The CLI uses <strong>esbuild</strong> (via the Application builder) by default — significantly faster than the older Webpack pipeline. Cold builds that used to take 30+ seconds now complete in under 10 seconds on large projects. The dev server uses Vite for near-instant hot module replacement.</p>
      `,
      "code": "# ---- Full lifecycle using Angular CLI ----\n\n# Install CLI globally\nnpm install -g @angular/cli\n\n# Create new project (esbuild + standalone by default)\nng new my-shop --style=scss\n\n# Scaffold code — CLI updates relevant files automatically\nng generate component features/products/product-list\nng generate service core/services/product\nng generate guard core/guards/auth\nng generate pipe shared/pipes/truncate\n\n# Run dev server (esbuild + Vite: rebuilds in well under 100ms)\nng serve\nng serve --port 4300 --host 0.0.0.0   # custom port + expose on network\n\n# Run tests\nng test                          # unit tests (Web Test Runner)\nng e2e                           # end-to-end (Playwright/Cypress)\n\n# Lint\nng lint\n\n# Keep Angular up to date\nng update                        # shows available updates\nng update @angular/core @angular/cli  # apply update + run migrations",
      "language": "bash",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">CLI Lifecycle Commands</p><div class="flex flex-wrap items-center justify-center gap-2 text-xs"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700">ng new</div><span class="text-slate-300">&rarr;</span><div class="bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700">ng generate</div><span class="text-slate-300">&rarr;</span><div class="bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700">ng serve</div><span class="text-slate-300">&rarr;</span><div class="bg-rose-50 border-2 border-rose-200 rounded-lg px-3 py-2 text-center font-semibold text-rose-700">ng test</div><span class="text-slate-300">&rarr;</span><div class="bg-purple-50 border-2 border-purple-200 rounded-lg px-3 py-2 text-center font-semibold text-purple-700">ng build</div></div></div>`
    },
    {
      "id": "ng-build",
      "title": "What does ng build do?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A print shop turning a raw manuscript into a bound, shelf-ready book. The manuscript (your TypeScript and templates) isn't sellable as-is — <code>ng build</code> typesets it, binds it, prints a barcode unique to this exact edition (the content hash in the filename), and boxes it up ready to ship, with nothing left for the reader (the browser) to assemble.</p>
          </div>
        </div>
        <p><code>ng build</code> compiles your entire Angular application into static assets that can be served by any web server. It transforms TypeScript into JavaScript, processes HTML templates, compiles SCSS/CSS, resolves all imports, and writes the output to the <code>dist/</code> folder — everything a browser needs, no Node.js runtime required on the server (unless you're using SSR).</p>
        <h3>What gets generated</h3>
        <p>A typical <code>ng build</code> output contains: <code>index.html</code> (with script tags pointing to hashed filenames), <code>main.js</code> (your application code), <code>polyfills.js</code> (browser compatibility shims), <code>styles.css</code> (global styles), and any lazy-loaded route chunks named by their route path. Each JavaScript file has a content hash in its name (<code>main.abc123.js</code>) to enable long-term browser caching with automatic cache-busting on each deployment.</p>
        <h3>Development vs production</h3>
        <p><code>ng build</code> without flags uses the <code>development</code> configuration by default — fast but unoptimized, with source maps included, minification off, and no tree-shaking. Production builds (<code>ng build --configuration production</code>) apply full optimization: minification, tree-shaking, dead code elimination, and budget enforcement.</p>
        <h3>Build budgets</h3>
        <p>The <code>angular.json</code> <code>budgets</code> section defines maximum bundle sizes. Exceed the warning threshold and the CLI prints a warning; exceed the error threshold and the build fails outright — an automated guard against accidentally shipping a huge bundle, something easy to do when you import a large library without realizing its size.</p>
      `,
      "code": "# ---- Build commands ----\nng build                             # development build (fast, unoptimized)\nng build --configuration production  # production build (optimized)\nng build --configuration staging     # custom named configuration\n\n# ---- Output structure (dist/my-app/) ----\n# index.html\n# main.abc12345.js          <- app bundle (hashed for cache busting)\n# polyfills.78ef9012.js     <- browser compatibility\n# styles.45ab6789.css       <- global styles\n# chunk-ROUTE_NAME.js       <- lazy-loaded route chunks\n# assets/                   <- copied from src/assets/\n\n# ---- angular.json budget configuration ----\n{\n  \"budgets\": [\n    {\n      \"type\": \"initial\",           // total initial load\n      \"maximumWarning\": \"500kB\",   // warn if over 500 KB\n      \"maximumError\": \"1MB\"        // fail build if over 1 MB\n    },\n    {\n      \"type\": \"anyComponentStyle\", // per-component styles\n      \"maximumWarning\": \"2kB\",\n      \"maximumError\": \"4kB\"\n    }\n  ]\n}\n\n# ---- Analyze bundle contents ----\nng build --configuration production --stats-json\nnpx webpack-bundle-analyzer dist/my-app/stats.json",
      "language": "bash",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">ng build Output</p><div class="border-2 border-dashed border-slate-300 rounded-xl p-4"><p class="text-center text-xs font-bold text-slate-500 mb-3">dist/my-app/</p><div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono"><div class="bg-indigo-50 border border-indigo-200 rounded px-2 py-1.5 text-center">index.html</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1.5 text-center">main.[hash].js</div><div class="bg-amber-50 border border-amber-200 rounded px-2 py-1.5 text-center">polyfills.[hash].js</div><div class="bg-rose-50 border border-rose-200 rounded px-2 py-1.5 text-center">styles.[hash].css</div><div class="bg-purple-50 border border-purple-200 rounded px-2 py-1.5 text-center">chunk-*.js</div><div class="bg-cyan-50 border border-cyan-200 rounded px-2 py-1.5 text-center">assets/</div></div></div></div>`
    },
    {
      "id": "production-build",
      "title": "What is a production build and what optimizations does it apply?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Packing for a competitive backpacking trip versus a casual car camping weekend. Car camping (a dev build), you throw in whatever's convenient — full-size everything, no weighing. Competitive backpacking (a production build), you cut the toothbrush handle in half, vacuum-seal your clothes, and weigh every gram, because every ounce costs you on the trail. Minification, tree shaking, and cache-busting hashes are that same discipline applied to bytes instead of grams.</p>
          </div>
        </div>
        <p>A <strong>production build</strong> — triggered by <code>ng build --configuration production</code> — applies a series of transformations to make the application as small and fast as possible before deployment. This is the build you should always deploy to users; development builds are convenient for debugging but too large and slow for production.</p>
        <h3>Minification</h3>
        <p>All JavaScript is run through a minifier as part of the esbuild pipeline. Minification removes whitespace, shortens variable and function names to single characters, and eliminates comments. A typical Angular application can shrink by 40–60% from minification alone.</p>
        <h3>Tree shaking</h3>
        <p>The bundler analyzes the import graph of your entire application and removes any exported function, class, or variable that nothing imports. This is why named imports (<code>import { map } from 'rxjs'</code>) matter — tree shaking relies on static analysis of <code>import</code>/<code>export</code> statements, and CommonJS <code>require()</code> calls can't be tree-shaken effectively, which is why <code>ng build</code> warns when a dependency uses CommonJS.</p>
        <h3>Cache busting</h3>
        <p>Every output file gets a content hash appended to its filename — <code>main.js</code> becomes <code>main.7f3a9b2c.js</code>. This hash changes whenever the file's content changes, so CDNs and browsers can cache the files indefinitely (<code>Cache-Control: max-age=31536000, immutable</code>) and are guaranteed to fetch fresh files after a deployment because the URL itself changes.</p>
        <h3>Dead code elimination and AOT</h3>
        <p>Angular's Ahead-of-Time compiler runs at build time and compiles templates into optimized JavaScript. The Angular compiler itself is NOT shipped to the browser — it's not needed because the compilation already happened. This alone removes a significant chunk of the bundle compared to JIT.</p>
      `,
      "code": "# ---- Run production build ----\nng build --configuration production\n\n# ---- angular.json production configuration (auto-generated) ----\n{\n  \"configurations\": {\n    \"production\": {\n      \"optimization\": true,          // minification + tree-shaking\n      \"outputHashing\": \"all\",        // hash all output filenames\n      \"sourceMap\": false,            // no source maps (protect source code)\n      \"namedChunks\": false,          // use hashed names for lazy chunks\n      \"aot\": true,                   // Ahead-of-Time compilation\n      \"extractLicenses\": true,       // extract 3rd-party licenses to separate file\n      \"budgets\": [\n        { \"type\": \"initial\", \"maximumWarning\": \"500kB\", \"maximumError\": \"1MB\" }\n      ]\n    },\n    \"development\": {\n      \"optimization\": false,\n      \"outputHashing\": \"none\",\n      \"sourceMap\": true\n    }\n  }\n}\n\n// ---- Practical bundle size tips ----\n// 1. Lazy-load routes — each route becomes a separate chunk\n// 2. Avoid importing entire libraries: import { debounceTime } from 'rxjs/operators'\n//    NOT: import * as Rx from 'rxjs'\n// 3. Replace heavy libraries — date-fns instead of Moment.js, native Intl instead of i18n libs\n// 4. Use ng-packagr for libraries — ensures tree-shakeable secondary entrypoints\n// 5. Check for CommonJS warnings in ng build output and prefer ESM alternatives",
      "language": "bash",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Dev Build vs Production Build</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-slate-50 border-2 border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">Development</p><div class="space-y-1.5"><div class="bg-white border border-slate-200 rounded px-2 py-1 text-center">No minification</div><div class="bg-white border border-slate-200 rounded px-2 py-1 text-center">Source maps on</div><div class="bg-white border border-slate-200 rounded px-2 py-1 text-center">No hashing</div></div></div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3"><p class="font-bold text-emerald-700 text-center mb-2">Production</p><div class="space-y-1.5"><div class="bg-white border border-emerald-200 rounded px-2 py-1 text-center">Minified + tree-shaken</div><div class="bg-white border border-emerald-200 rounded px-2 py-1 text-center">Source maps off</div><div class="bg-white border border-emerald-200 rounded px-2 py-1 text-center">Hashed filenames</div></div></div></div></div>`
    },
    {
      "id": "environment-configuration",
      "title": "What is environment configuration in Angular?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A film crew shooting the same scene twice — once as a rehearsal on a cheap practice set, once for real on the final set with the real props. The actors read the exact same script (your component code) both times; only the environment file swaps which set they're standing on. Nobody rewrites the script for opening night — the CLI just points them at the production set automatically.</p>
          </div>
        </div>
        <p>Angular's <strong>environment configuration</strong> system lets you define different values for different build targets — typically development, staging, and production — without changing your component or service code. You write code that references <code>environment.apiUrl</code>, and the build system swaps in the correct value depending on which configuration is active.</p>
        <p>This matters because development and production are fundamentally different contexts. Development might point to a local API on <code>localhost:3000</code>, enable verbose logging, and disable analytics. Production points to the live API, disables logging, and enables analytics with real keys. Without the environment system, you'd need to remember to manually change these values before every deployment — fragile and error-prone.</p>
        <h3>How file replacement works</h3>
        <p>In <code>angular.json</code>, each build configuration lists <code>fileReplacements</code>. When you build with <code>--configuration production</code>, the CLI replaces <code>src/environments/environment.ts</code> with <code>src/environments/environment.prod.ts</code> before compiling. Your TypeScript imports always reference the base <code>environment.ts</code> file — the replacement happens transparently at build time.</p>
        <h3>Modern approach: environment values as injection tokens</h3>
        <p>A cleaner pattern in standalone Angular is to convert environment values into DI injection tokens provided at app bootstrap. This makes them injectable anywhere, easily mockable in tests, and removes the direct file import from service code.</p>
      `,
      "code": "// ---- src/environments/environment.ts (development) ----\nexport const environment = {\n  production: false,\n  apiUrl: 'http://localhost:3000/api',\n  logLevel: 'debug',\n  analyticsKey: '',           // disabled in dev\n  featureFlags: {\n    newDashboard: true,       // can test new features in dev\n    betaCheckout: false\n  }\n};\n\n// ---- src/environments/environment.prod.ts (production) ----\nexport const environment = {\n  production: true,\n  apiUrl: 'https://api.myshop.com',\n  logLevel: 'error',\n  analyticsKey: 'UA-12345-1',\n  featureFlags: {\n    newDashboard: false,\n    betaCheckout: false\n  }\n};\n\n// ---- angular.json: file replacement config ----\n// \"fileReplacements\": [\n//   {\n//     \"replace\": \"src/environments/environment.ts\",\n//     \"with\": \"src/environments/environment.prod.ts\"\n//   }\n// ]\n\n// ---- Service using environment ----\nimport { environment } from '../environments/environment';\n\n@Injectable({ providedIn: 'root' })\nexport class ApiService {\n  private http = inject(HttpClient);\n  private base = environment.apiUrl;  // resolved at build time\n\n  getProducts() {\n    return this.http.get(this.base + '/products');\n  }\n}\n\n// ---- Build commands for different environments ----\n// ng serve                              -> uses environment.ts\n// ng serve --configuration staging     -> uses environment.staging.ts\n// ng build --configuration production  -> uses environment.prod.ts",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Same Code, Swapped File</p><div class="flex flex-col items-center gap-2 text-xs max-w-md mx-auto"><div class="bg-slate-800 text-white rounded px-3 py-1.5 w-full text-center">import { environment } from './environments/environment'</div><div class="text-slate-300">&darr; file replacement at build time</div><div class="grid grid-cols-2 gap-3 w-full"><div class="bg-indigo-50 border border-indigo-200 rounded p-2 text-center"><p class="font-bold text-indigo-700">ng serve</p><p class="text-slate-500 mt-1">environment.ts</p></div><div class="bg-emerald-50 border border-emerald-200 rounded p-2 text-center"><p class="font-bold text-emerald-700">--configuration production</p><p class="text-slate-500 mt-1">environment.prod.ts</p></div></div></div></div>`
    },
    {
      "id": "jit-vs-aot",
      "title": "Difference between JIT and AOT compilation",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A translator reading a speech live, word by word, versus a translated transcript prepared and proofread days in advance. JIT is the live interpreter — functional, but slower, and mistakes surface in front of the audience. AOT is the pre-translated transcript — ready before anyone shows up, and any translation errors were caught and fixed in a quiet room beforehand, not on stage.</p>
          </div>
        </div>
        <p>Angular templates aren't HTML — they contain Angular-specific syntax like <code>@for</code>, <code>[property]</code>, <code>(event)</code>, and pipes. The browser doesn't understand these natively. Before the browser can render an Angular application, Angular's compiler must transform these templates into JavaScript. <strong>JIT and AOT differ in when that compilation happens.</strong></p>
        <h3>JIT — Just-in-Time compilation</h3>
        <p>In JIT mode, the Angular compiler ships as part of the JavaScript bundle. When the app boots, the compiler runs inside the browser, compiles all the templates on the fly, and only then does Angular start the application. This makes the initial bundle larger and startup slower — the user waits while compilation happens in their own browser before seeing anything. JIT is only used internally today during <code>ng serve</code> for fast dev rebuilds; it has no place in a production deployment.</p>
        <h3>AOT — Ahead-of-Time compilation</h3>
        <p>In AOT mode, the Angular compiler runs during your <code>ng build</code>, on your machine. By the time the user's browser receives the application, templates are already compiled into optimized JavaScript factory functions — the browser just executes them, no compilation step, no compiler shipped. This means faster first render, a smaller bundle, and template errors caught at build time rather than at runtime in front of a real user.</p>
        <h3>Why AOT also improves security</h3>
        <p>AOT eliminates the ability to evaluate arbitrary template strings at runtime — there's nothing to inject into because there's no compiler in the browser. This closes off a class of template injection vulnerabilities entirely.</p>
      `,
      "code": "// ---- JIT vs AOT summary — both produce the same runtime behavior,\n//      but the WHEN and WHERE of compilation differs ----\n\n// JIT workflow (dev-only today):\n// 1. ng serve → ships Angular compiler in bundle\n// 2. User's browser downloads bundle INCLUDING compiler (extra weight)\n// 3. Browser boots → Angular compiler runs → templates compiled → app starts\n// Downsides: slow startup, large bundle, template errors only caught at runtime\n\n// AOT workflow (default for ng build in Angular 22):\n// 1. ng build → Angular compiler runs on YOUR machine\n// 2. Templates compiled to factory functions at BUILD time\n// 3. User's browser downloads bundle WITHOUT the compiler\n// 4. Browser boots → runs pre-compiled code → app starts immediately\n// Result: faster startup, smaller bundle, template errors caught at BUILD time\n\n// ---- AOT catches template errors you would miss with JIT ----\n@Component({\n  selector: 'app-demo',\n  // AOT will catch this typo at build time:\n  // Error: \"userNme\" is not a known property of AppComponent\n  template: '<p>{{ userNme }}</p>'  // typo: should be userName\n})\nexport class DemoComponent {\n  userName = 'Siladitya';\n}\n\n// With JIT, this typo would only appear as a runtime undefined value.\n// With AOT, the build fails with a clear error message pointing to the line.\n\n// ---- Verify AOT is active (it is, by default) ----\n// angular.json: \"aot\": true  (in production configuration)\n// ng build --configuration production  ← AOT always on\n// ng serve                             ← still uses JIT internally for fast rebuilds",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Where the Compiler Runs</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-slate-50 border-2 border-slate-300 rounded-xl p-3 text-center"><p class="font-bold text-slate-700 mb-2">JIT</p><p class="text-slate-500">Compiler runs in the user's browser, at startup, every time</p></div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center"><p class="font-bold text-emerald-700 mb-2">AOT</p><p class="text-slate-500">Compiler runs once, on your machine, during ng build</p></div></div></div>`
    },
    {
      "id": "webpack-esbuild-vite",
      "title": "Webpack vs esbuild vs Vite in Angular",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Swapping a single overworked cashier who re-rings the entire cart every time you add one item (Webpack's full rebuild) for a self-checkout system that only scans the new item you just picked up (Vite's on-demand module serving), backed by a much faster stockroom robot for the final full inventory count (esbuild for production builds).</p>
          </div>
        </div>
        <p>Angular's build toolchain moved from <strong>Webpack</strong> to <strong>esbuild + Vite</strong> a few major versions back — one of the most impactful developer-experience improvements in Angular's history, and still the default today. Understanding what each tool does and why the switch happened is useful context for real interviews.</p>
        <h3>Webpack (legacy)</h3>
        <p>Webpack is a JavaScript module bundler. It takes your source files, follows every import, processes files through loaders (TypeScript, HTML, SCSS, assets), and outputs bundled JavaScript. Extremely powerful and configurable, but slow — every saved file in dev mode triggers Webpack to re-analyze and re-bundle, and on large applications incremental rebuilds could take 5–15 seconds.</p>
        <h3>esbuild (production builds)</h3>
        <p>esbuild is written in Go and uses parallelism and native code to bundle JavaScript far faster than Webpack. Angular uses it for production builds — a build that took 60 seconds with Webpack might take single-digit seconds with esbuild. The tradeoff is a smaller plugin ecosystem than Webpack's, but for Angular's standard use cases it covers everything needed.</p>
        <h3>Vite (development server)</h3>
        <p>Vite handles the dev server. In dev mode it doesn't bundle the entire application upfront — it serves files on demand using native browser ES module imports. When you save a file, only the changed module recompiles and pushes to the browser via Hot Module Replacement. This makes HMR near-instant regardless of app size, compared to a Webpack dev server's full rebuild cycle.</p>
        <h3>The Application builder</h3>
        <p>In <code>angular.json</code>, the modern builder is <code>@angular-devkit/build-angular:application</code>. If your project still uses <code>@angular-devkit/build-angular:browser</code>, it's on the legacy Webpack pipeline — migrate by running <code>ng update @angular/cli</code> and following the migration guide.</p>
      `,
      "code": "// ---- angular.json: checking which builder you are using ----\n{\n  \"architect\": {\n    \"build\": {\n      // Modern esbuild-based builder (recommended, current default):\n      \"builder\": \"@angular-devkit/build-angular:application\",\n\n      // Legacy Webpack builder (older projects or manually kept):\n      // \"builder\": \"@angular-devkit/build-angular:browser\"\n    }\n  }\n}\n\n// ---- Relative build speed comparison ----\n// Large project (500+ components):\n//\n// Webpack cold build:        ~60 seconds\n// Webpack incremental HMR:   ~5 seconds\n//\n// esbuild cold build:        single-digit seconds\n// Vite incremental HMR:      near-instant, regardless of app size\n\n// ---- Migrating from Webpack to esbuild ----\n// Automatic migration via Angular CLI:\n// ng update @angular/cli @angular/core\n// If the migration doesn't auto-switch, update angular.json manually.\n\n// ---- Custom Webpack config (if you must stay on Webpack) ----\n// Uses ngx-build-plus or @angular-builders/custom-webpack:\n// npm install @angular-builders/custom-webpack\n// In angular.json:\n// \"builder\": \"@angular-builders/custom-webpack:browser\",\n// \"options\": { \"customWebpackConfig\": { \"path\": \"./webpack.config.js\" } }",
      "language": "json",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Who Does What</p><div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs"><div class="bg-slate-50 border border-slate-300 rounded-lg p-3 text-center"><p class="font-bold text-slate-600">Webpack (legacy)</p><p class="text-slate-500 mt-1">full bundler, slower rebuilds</p></div><div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center"><p class="font-bold text-emerald-700">esbuild</p><p class="text-slate-500 mt-1">production builds, Go-fast</p></div><div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center"><p class="font-bold text-indigo-700">Vite</p><p class="text-slate-500 mt-1">dev server, instant HMR</p></div></div></div>`
    },
    {
      "id": "deploying-angular",
      "title": "How to deploy an Angular application?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A hotel concierge who, when a guest asks for a room number that doesn't officially exist on the building directory, doesn't turn them away — they check a master list, recognize it's a valid suite the directory just hasn't been updated with, and personally walk the guest there. Your web server needs the same fallback: when someone requests <code>/products/42</code> directly, don't 404 them — hand them <code>index.html</code> and let Angular's router take it from there.</p>
          </div>
        </div>
        <p>Deploying an Angular application means getting the static files produced by <code>ng build</code> onto a server that can serve them to users. Because the output is entirely static — HTML, JavaScript, CSS, and assets — you can host it on any web server or static hosting service: Nginx, Apache, AWS S3 + CloudFront, Firebase Hosting, Netlify, Vercel, or GitHub Pages.</p>
        <h3>The critical deployment issue: HTML5 routing</h3>
        <p>Angular uses the HTML5 History API for routing. When a user navigates to <code>myapp.com/products/42</code> directly (bookmark, hard refresh, shared link), the browser sends a GET request for that exact path to the server. The server looks for a file at <code>/products/42</code>, finds nothing (only <code>index.html</code> exists), and returns a 404 — Angular never even loads. The fix: configure your web server to return <code>index.html</code> for every path that doesn't match a real file. Angular's router then takes over and renders the correct component.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">A deployment that works perfectly when navigating by clicking links inside the app, but 404s on every hard refresh or bookmark, is almost always this exact missing server rewrite rule. It's easy to miss in testing because clicking through the app never triggers a real server request for the deep route — only a hard refresh or a shared URL does.</p>
          </div>
        </div>
        <h3>Caching strategy</h3>
        <p>Angular's hashed filenames allow aggressive caching. Set <code>index.html</code> to no-cache or a short cache (it must always be fresh to reference the current asset hashes). Set all other files (<code>*.js</code>, <code>*.css</code>) to immutable, long-lived caching (<code>Cache-Control: max-age=31536000, immutable</code>). Browsers never re-download a bundle until it's replaced by a new hash, which happens automatically on deployment.</p>
      `,
      "code": "# ---- Step 1: Production build ----\nng build --configuration production\n# Output in dist/my-app/\n\n# ---- Step 2a: Deploy to Nginx ----\n# Copy dist/ contents to Nginx web root, then configure for HTML5 routing:\n\n# /etc/nginx/sites-available/my-app:\nserver {\n  listen 80;\n  server_name myapp.com;\n  root /var/www/my-app;\n  index index.html;\n\n  # Aggressive caching for hashed assets\n  location ~* \\.(js|css|png|jpg|svg|woff2)$ {\n    expires 1y;\n    add_header Cache-Control \"public, max-age=31536000, immutable\";\n  }\n\n  # CRITICAL: send index.html for all routes (HTML5 History API routing)\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n}\n\n# ---- Step 2b: Deploy to Firebase Hosting (easiest option) ----\nnpm install -g firebase-tools\nfirebase login\nfirebase init hosting           # point public dir to dist/my-app\nfirebase deploy\n# firebase.json automatically configures HTML5 routing rewrites\n\n# ---- Step 2c: Deploy to Netlify ----\n# Drop dist/ folder in Netlify UI, or use CLI:\nnpm install -g netlify-cli\nnetlify deploy --prod --dir=dist/my-app\n# Add netlify.toml for routing:\n# [[redirects]]\n#   from = \"/*\"\n#   to = \"/index.html\"\n#   status = 200\n\n# ---- Step 2d: Deploy to GitHub Pages ----\nng add angular-cli-ghpages\nng deploy --base-href=/my-repo-name/",
      "language": "bash",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Deep Link Without a Rewrite Rule vs With One</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-rose-50 border-2 border-rose-200 rounded-xl p-3"><p class="font-bold text-rose-700 text-center mb-2">No rewrite rule</p><div class="flex flex-col items-center gap-1"><div class="bg-white border border-rose-200 rounded px-2 py-1 w-full text-center">GET /products/42</div><div class="text-slate-300">&darr;</div><div class="bg-white border border-rose-200 rounded px-2 py-1 w-full text-center">Server looks for that exact file</div><div class="text-slate-300">&darr;</div><div class="bg-slate-800 text-white rounded px-2 py-1 w-full text-center">404 — Angular never loads</div></div></div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3"><p class="font-bold text-emerald-700 text-center mb-2">try_files ... /index.html</p><div class="flex flex-col items-center gap-1"><div class="bg-white border border-emerald-200 rounded px-2 py-1 w-full text-center">GET /products/42</div><div class="text-slate-300">&darr;</div><div class="bg-white border border-emerald-200 rounded px-2 py-1 w-full text-center">Server falls back to index.html</div><div class="text-slate-300">&darr;</div><div class="bg-slate-800 text-white rounded px-2 py-1 w-full text-center">Angular Router renders the route</div></div></div></div></div>`
    }
  ]
});
