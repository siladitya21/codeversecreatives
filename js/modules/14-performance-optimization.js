window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "performance-optimization",
  "title": "Performance Optimization",
  "icon": "bi bi-speedometer2",
  "questions": [
    {
      id: "angular-22-standard-performance-upgrade",
      title: "Angular 22 standard for performance",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Tuning a race car. You don't bolt on every part in the catalog before the first lap — you strap on a data logger, drive the lap, and find out you're losing time in the corners, not the straights. Angular performance work is identical: profile first (DevTools Performance tab, Lighthouse), find whether the actual pain is <strong>load time</strong> or <strong>runtime jank</strong>, then apply the smallest change that removes that specific bottleneck.</p>
          </div>
        </div>
        <p>Angular 22-ready performance isn't one trick — it's a combination of lazy routes, signals, tight list tracking, deferred views, and disciplined bundle budgets. What's changed since older tutorials: two of the biggest "remember to do this" performance tips are now things Angular does for you by default.</p>
        <h3>What's automatic now</h3>
        <ul>
          <li><strong>OnPush is the default change detection strategy</strong> for any component that doesn't explicitly set <code>changeDetection</code>. The manual opt-in step this section used to open with is gone — see the dedicated OnPush question below for what that changes.</li>
          <li><strong>Zoneless is the default for new CLI-generated apps.</strong> No Zone.js patching every <code>setTimeout</code>, <code>Promise</code>, and DOM event means less overhead and a smaller bundle (~36KB) out of the box. Existing apps upgraded to 22 keep Zone.js until you deliberately remove it.</li>
        </ul>
        <h3>What still requires a deliberate decision</h3>
        <ul>
          <li>Lazy load feature routes with <code>loadComponent()</code> or <code>loadChildren()</code>.</li>
          <li>Use <code>signal()</code> and <code>computed()</code> so templates only recompute what actually depends on changed data.</li>
          <li>Use <code>@for (...; track ...)</code> for lists — tracking is mandatory in the new control-flow syntax, not optional like <code>trackBy</code> used to be.</li>
          <li>Use <code>@defer</code> blocks for heavy below-the-fold UI.</li>
          <li>Keep dependencies tree-shakable and avoid barrel-style "import everything" packages.</li>
          <li>Set bundle budgets in <code>angular.json</code> and actually look at production builds, not just trust them.</li>
        </ul>
      `,
      code: `@Component({
  selector: 'app-dashboard',
  template: \`
    <app-summary />

    @defer (on viewport) {
      <app-heavy-chart [data]="chartData()" />
    } @placeholder {
      <p>Chart loading...</p>
    }

    @for (row of rows(); track row.id) {
      <app-row [row]="row" />
    }
  \`
  // changeDetection: ChangeDetectionStrategy.OnPush  <- default in Angular 22, no need to set it
})
export class DashboardComponent {
  readonly rows = signal<Row[]>([]);
  readonly chartData = computed(() => buildChartData(this.rows()));
}

// app.routes.ts
export const routes: Routes = [
  {
    path: 'reports',
    loadComponent: () => import('./reports/reports.component').then(m => m.ReportsComponent)
  }
];`,
      language: "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Automatic vs Still-Your-Job in Angular 22</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3"><p class="font-bold text-emerald-700 text-center mb-2">Angular does this for you</p><div class="space-y-1.5"><div class="bg-white border border-emerald-200 rounded px-2 py-1">OnPush change detection (default)</div><div class="bg-white border border-emerald-200 rounded px-2 py-1">Zoneless CD (new CLI apps)</div><div class="bg-white border border-emerald-200 rounded px-2 py-1">Mandatory track in @for</div></div></div><div class="bg-amber-50 border-2 border-amber-200 rounded-xl p-3"><p class="font-bold text-amber-700 text-center mb-2">You still decide this</p><div class="space-y-1.5"><div class="bg-white border border-amber-200 rounded px-2 py-1">Which routes are lazy</div><div class="bg-white border border-amber-200 rounded px-2 py-1">What goes behind @defer</div><div class="bg-white border border-amber-200 rounded px-2 py-1">Bundle budgets &amp; dependency choices</div></div></div></div></div>`
    },
    {
      "id": "how-to-optimize-angular",
      "title": "How to optimize Angular applications?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Running a restaurant kitchen. <strong>Load performance</strong> is how long the doors are locked before the kitchen opens for the day — prep, stocking, staffing. <strong>Runtime performance</strong> is how fast a ticket gets from the printer to the pass once service has started. A kitchen can open fast and still be slow under a dinner rush, or open slowly but run like clockwork once it's going — they're different problems with different fixes.</p>
          </div>
        </div>
        <p>Angular performance splits into two genuinely different problems: how fast the app starts (load performance), and how smooth it feels once it's running (runtime performance). Fixing one rarely fixes the other.</p>
        <h3>Load performance strategies</h3>
        <ul>
          <li><strong>Lazy loading</strong> — only download code for the current route; other routes load on demand</li>
          <li><strong>AOT compilation</strong> — compile templates at build time, not at runtime in the browser (this is the default)</li>
          <li><strong>Tree shaking</strong> — the build process removes unused code from the bundle automatically</li>
          <li><strong>Bundle analysis</strong> — find out what's actually in your bundle and cut what doesn't need to be there</li>
          <li><strong>Preloading strategy</strong> — after the initial load, silently prefetch other routes in the background</li>
        </ul>
        <h3>Runtime performance strategies</h3>
        <ul>
          <li><strong>OnPush change detection</strong> — the Angular 22 default; skip components whose inputs haven't changed</li>
          <li><strong><code>track</code> in <code>@for</code></strong> — prevent DOM recreation for unchanged list items</li>
          <li><strong>Signals over manual subscriptions</strong> — fine-grained updates instead of broad change detection sweeps</li>
          <li><strong>Zoneless change detection</strong> — remove the overhead of patching every async browser API</li>
        </ul>
      `,
      "code": "// ─── Quick checklist for optimizing a production Angular app ───\n\n// LOAD TIME\n// ✅ ng build --configuration production  (AOT + minification + tree shaking)\n// ✅ Lazy load every feature route with loadComponent() or loadChildren()\n// ✅ Analyze bundle: ng build --stats-json && npx webpack-bundle-analyzer\n// ✅ Avoid importing full libraries — import specific functions\n//    ❌  import * as _ from 'lodash';\n//    ✅  import { debounce } from 'lodash-es';\n\n// RUNTIME\n// ✅ OnPush is already the default in Angular 22 — verify nothing opts back to Default\n// ✅ track on every @for with dynamic data\n// ✅ Prefer signals + computed() over manual subscribe() where state is local\n// ✅ Zoneless by default for new apps — remove Zone.js from existing apps deliberately\n// ✅ Use virtual scrolling (CDK) for lists > 100 items",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Two Different Problems</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3"><p class="font-bold text-indigo-700 text-center mb-2">Load Performance</p><p class="text-slate-500 text-center mb-2">"how fast does it start?"</p><div class="space-y-1.5"><div class="bg-white border border-indigo-200 rounded px-2 py-1">Lazy loading</div><div class="bg-white border border-indigo-200 rounded px-2 py-1">AOT compilation</div><div class="bg-white border border-indigo-200 rounded px-2 py-1">Tree shaking</div></div></div><div class="bg-rose-50 border-2 border-rose-200 rounded-xl p-3"><p class="font-bold text-rose-700 text-center mb-2">Runtime Performance</p><p class="text-slate-500 text-center mb-2">"how smooth does it feel?"</p><div class="space-y-1.5"><div class="bg-white border border-rose-200 rounded px-2 py-1">OnPush (default)</div><div class="bg-white border border-rose-200 rounded px-2 py-1">track in @for</div><div class="bg-white border border-rose-200 rounded px-2 py-1">Zoneless CD</div></div></div></div></div>`
    },
    {
      "id": "what-is-lazy-loading",
      "title": "What is lazy loading?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Packing for a trip versus renting furniture only when you get there. Without lazy loading, you cram the admin panel, the checkout flow, and the user profile screens into your suitcase before you've even left home — even though most visitors never open them. With lazy loading, each "room" of the app is furnished only when someone actually walks into it.</p>
          </div>
        </div>
        <p><strong>Lazy loading</strong> means Angular only downloads the JavaScript for a route when the user actually navigates to it, instead of bundling every feature together and shipping it all at startup.</p>
        <h3>Why it matters</h3>
        <p>Picture an e-commerce app with a product list, product detail, checkout, an admin panel, and a user profile. Without lazy loading, a customer just browsing products still downloads the entire admin panel's code — bytes they'll never use. With lazy loading, that admin bundle only downloads if someone actually visits <code>/admin</code>.</p>
        <h3>loadComponent vs loadChildren</h3>
        <ul>
          <li><code>loadComponent</code> — lazily load a single standalone component (the common case today)</li>
          <li><code>loadChildren</code> — lazily load an entire feature's routes file as a group. Better when a feature has many sub-routes that should all arrive together.</li>
        </ul>
        <h3>How to measure the improvement</h3>
        <p>Run <code>ng build --stats-json</code> before and after adding lazy loading. Watch the initial chunk size — it should drop noticeably.</p>
      `,
      "code": "// app.routes.ts\nimport { Routes } from '@angular/router';\n\nexport const routes: Routes = [\n  // ─── Eagerly loaded (always in the main bundle) ────────────\n  { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },\n\n  // ─── Lazily loaded — downloaded only when user visits /products ─\n  {\n    path: 'products',\n    loadComponent: () =>\n      import('./products/products.component').then(m => m.ProductsComponent)\n  },\n\n  // ─── Lazy feature group — entire /admin section with sub-routes ─\n  {\n    path: 'admin',\n    canMatch: [adminGuard],   // don't even download the chunk if not admin\n    loadChildren: () =>\n      import('./admin/admin.routes').then(m => m.adminRoutes)\n    // admin.routes.ts defines /admin/users, /admin/reports, etc.\n  },\n\n  { path: '**', loadComponent: () => import('./not-found.component').then(m => m.NotFoundComponent) }\n];\n\n// ─── The result in Chrome DevTools Network tab ─────────────────\n// Initial load: main.js (small — only home + shell code)\n// When user visits /products: products-chunk.js downloads automatically\n// When user visits /admin (if they're admin): admin-chunk.js downloads",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Eager Bundle vs Lazy Chunks</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-rose-50 border-2 border-rose-200 rounded-xl p-3"><p class="font-bold text-rose-700 text-center mb-2">Without lazy loading</p><div class="bg-white border border-rose-200 rounded-lg p-2 text-center"><p class="font-semibold text-rose-600">main.js</p><p class="text-slate-500 mt-1">home + products + admin + profile + checkout, all downloaded on first visit</p></div></div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3"><p class="font-bold text-emerald-700 text-center mb-2">With lazy loading</p><div class="space-y-1.5"><div class="bg-white border border-emerald-200 rounded px-2 py-1 text-center font-semibold text-emerald-700">main.js (home only)</div><div class="text-slate-300 text-center">&darr; on navigation</div><div class="bg-white border border-emerald-200 rounded px-2 py-1 text-center">products-chunk.js</div><div class="bg-white border border-emerald-200 rounded px-2 py-1 text-center">admin-chunk.js</div></div></div></div></div>`
    },
    {
      "id": "what-is-aot",
      "title": "What is ahead-of-time (AOT) compilation?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Ordering furniture pre-assembled versus flat-packed with an Allen key. JIT ships the customer (the browser) the raw parts and the assembly instructions, and they build it themselves on your living room floor — slower, and if a piece is missing you find out at 11pm on move-in night. AOT assembles the furniture in the factory; the truck delivers it ready to use, and any missing screws were caught on the factory floor, not in your living room.</p>
          </div>
        </div>
        <p>Angular templates — <code>{{ name }}</code>, <code>@for</code>, <code>[class.active]</code> — aren't plain HTML. They need to be compiled into JavaScript that can actually manipulate the DOM. That compilation can happen at two different times.</p>
        <h3>JIT (Just-in-Time) — compile in the browser at runtime</h3>
        <p>The Angular compiler ships as part of the bundle and runs in the user's browser when the app starts. This only happens internally during <code>ng serve</code> for fast dev rebuilds. Downsides: the compiler itself is large, startup is slower, and template errors only surface at runtime, in front of a real user.</p>
        <h3>AOT (Ahead-of-Time) — compile at build time</h3>
        <p>The Angular compiler runs during <code>ng build</code>, on your machine. The browser receives pre-compiled JavaScript — no compiler shipped, no compilation step at startup.</p>
        <h3>Benefits of AOT</h3>
        <ul>
          <li><strong>Faster startup</strong> — no compilation in the browser</li>
          <li><strong>Smaller bundle</strong> — the compiler itself is not shipped</li>
          <li><strong>Catch errors early</strong> — template typos and type errors are caught at build time</li>
          <li><strong>More secure</strong> — no dynamic template evaluation at runtime, which closes off a class of template-injection attacks</li>
        </ul>
        <p>AOT is on by default for <code>ng build</code> in Angular 22. JIT is only used internally by <code>ng serve</code> for fast rebuilds during development.</p>
      `,
      "code": "// ─── Build commands ────────────────────────────────────────────\n// Development (JIT, with source maps for debugging):\n// ng serve\n\n// Production (AOT + minification + tree shaking + source map removal):\n// ng build --configuration production\n\n// ─── What AOT catches that JIT misses ─────────────────────────\n\n// Template type error — caught by AOT at build time:\n@Component({\n  template: `<p>{{ user.nonExistentProperty }}</p>`  // ❌ Build error with AOT\n})\nexport class ExampleComponent {\n  user: { name: string } = { name: 'Alice' };\n  // 'nonExistentProperty' doesn't exist on the type — AOT flags this\n}\n\n// Angular.json — production configuration (AOT is on by default):\n// \"configurations\": {\n//   \"production\": {\n//     \"budgets\": [\n//       { \"type\": \"initial\", \"maximumWarning\": \"500kB\", \"maximumError\": \"1MB\" }\n//     ],\n//     \"outputHashing\": \"all\"\n//   }\n// }\n\n// The 'budgets' section warns you if your bundle exceeds a size limit.",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">JIT vs AOT — Who Compiles, and When</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-slate-50 border-2 border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">JIT (dev only)</p><div class="flex flex-col items-center gap-1"><div class="bg-white border border-slate-200 rounded px-2 py-1 w-full text-center">Ship compiler + templates</div><div class="text-slate-300">&darr;</div><div class="bg-white border border-slate-200 rounded px-2 py-1 w-full text-center">Browser compiles at startup</div><div class="text-slate-300">&darr;</div><div class="bg-slate-800 text-white rounded px-2 py-1 w-full text-center">App renders (slower)</div></div></div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3"><p class="font-bold text-emerald-700 text-center mb-2">AOT (production default)</p><div class="flex flex-col items-center gap-1"><div class="bg-white border border-emerald-200 rounded px-2 py-1 w-full text-center">Compile at ng build time</div><div class="text-slate-300">&darr;</div><div class="bg-white border border-emerald-200 rounded px-2 py-1 w-full text-center">Ship compiled JS only</div><div class="text-slate-300">&darr;</div><div class="bg-slate-800 text-white rounded px-2 py-1 w-full text-center">App renders (faster)</div></div></div></div></div>`
    },
    {
      "id": "what-is-tree-shaking",
      "title": "What is tree shaking?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Literally shaking a tree to knock loose the dead leaves while the living ones stay attached. Your bundler walks the <code>import</code>/<code>export</code> graph like branches, finds every function that's actually referenced somewhere, and lets everything else — the dead leaves nobody imports — fall off before the bundle ships.</p>
          </div>
        </div>
        <p><strong>Tree shaking</strong> is an automated build step that removes code you import but never actually use.</p>
        <h3>How it works</h3>
        <p>Modern JavaScript (ES Modules) uses static <code>import</code>/<code>export</code> statements. Because these are static — not computed at runtime — a bundler like esbuild can analyze the whole import graph and figure out exactly which exported functions are actually called anywhere in your code, then drop the rest.</p>
        <h3>Example</h3>
        <p>You import <code>map</code> from RxJS. Tree shaking makes sure only <code>map</code>'s code lands in your bundle — not the 200-plus other operators you never touched.</p>
        <h3>What breaks tree shaking</h3>
        <ul>
          <li>Side-effectful modules that run code just by being imported — packages mark themselves with <code>"sideEffects": false</code> in <code>package.json</code> to reassure the bundler it's safe to drop unused parts</li>
          <li>Dynamic patterns like <code>require()</code> — the bundler can't statically analyze these</li>
          <li>Importing entire namespaces: <code>import * as _ from 'lodash'</code> — the bundler can't tell which parts you actually use</li>
        </ul>
      `,
      "code": "// ─── Tree shaking in practice ──────────────────────────────────\n\n// ❌ Imports the ENTIRE lodash library (~70KB)\nimport * as _ from 'lodash';\nconst result = _.debounce(fn, 300);\n\n// ✅ Imports ONLY the debounce function — everything else is shaken out\nimport { debounce } from 'lodash-es';   // ES module version supports tree shaking\nconst result = debounce(fn, 300);\n\n// ─── RxJS — automatically tree-shaken ─────────────────────────\nimport { map, filter } from 'rxjs';\n// Only 'map' and 'filter' code is included in the bundle.\n// The 200+ other RxJS operators are shaken out automatically.\n\n// ─── Angular itself is fully tree-shakeable ────────────────────\n// If you never use FormBuilder, its code is not in your bundle.\n// If you never use the DatePipe, it's not in your bundle.\n// This is one reason standalone components help bundle size —\n// each component imports exactly what it needs, nothing implied.\n\n// ─── Check what's in your bundle ──────────────────────────────\n// 1. ng build --stats-json\n// 2. npx webpack-bundle-analyzer dist/<app-name>/stats.json\n// This opens a visual treemap showing every dependency by size.",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Import Graph &rarr; What Survives the Shake</p><div class="flex flex-col items-center gap-2 text-xs"><div class="bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5 font-mono">import { map, filter } from 'rxjs'</div><div class="text-slate-300">&darr; bundler walks the graph</div><div class="grid grid-cols-2 gap-3 w-full max-w-sm"><div class="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center"><p class="font-bold text-emerald-700">Kept</p><p class="text-slate-500 mt-1">map, filter</p></div><div class="bg-rose-50 border border-rose-200 rounded-lg p-2 text-center"><p class="font-bold text-rose-700">Shaken out</p><p class="text-slate-500 mt-1">~200 unused operators</p></div></div></div></div>`
    },
    {
      "id": "what-is-trackby",
      "title": "What is track in @for (formerly trackBy)?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A coat check that uses claim tickets instead of just re-issuing every coat from scratch each time someone walks in. Without a ticket system, every time the room's coat list changes even slightly, the attendant throws out all 100 coats and re-hangs them from zero. With ticket numbers (item IDs), the attendant instantly sees which coats are already hanging, and only touches the ones that actually arrived or left.</p>
          </div>
        </div>
        <p>By default, when the array bound to Angular's <code>@for</code> block changes, Angular can't tell which items are new and which already existed — so without help it <strong>destroys and recreates every DOM element</strong> in the list. For a list of 100 items, that's 100 DOM operations just to update one item's name.</p>
        <h3>How track fixes this</h3>
        <p>The <code>track</code> expression in <code>@for (item of items(); track item.id)</code> gives Angular a way to identify each item uniquely. When the array changes, Angular compares identities: items with the same key are reused in place, and only genuinely new or removed items trigger DOM creation or deletion. This is the modern successor to the old <code>*ngFor; trackBy: fn</code> pattern — except now <code>track</code> is a required part of the <code>@for</code> syntax, not an opt-in you can forget.</p>
        <h3>When it matters most</h3>
        <ul>
          <li>You refresh the list from an API call — the new array holds the same conceptual items but brand-new object references</li>
          <li>The list is long (50+ items)</li>
          <li>List items contain complex child components or heavy DOM</li>
        </ul>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Tracking by array index (<code>track $index</code>) defeats the entire purpose — if the array is reordered, every item still "matches" its old position, so Angular reuses the wrong DOM node for the wrong data. Track by a stable identity field like <code>item.id</code> whenever items can be reordered, filtered, or refreshed.</p>
          </div>
        </div>
      `,
      "code": "// ─── Angular 22: @for requires track — you cannot forget it ─────\n@Component({\n  selector: 'app-users-list',\n  template: `\n    <ul>\n      @for (user of users(); track user.id) {\n        <li [class.highlighted]=\"user.id === selectedId()\">\n          {{ user.name }} — {{ user.email }}\n        </li>\n      }\n    </ul>\n  `\n})\nexport class UsersListComponent {\n  users = signal<User[]>([]);\n  selectedId = signal<number | undefined>(undefined);\n}\n\n// ─── Practical example — refreshing a list from an API ─────────\n// Without a stable track key: refreshing users returns the same users\n// with new object references → Angular would destroy ALL 100 <li> elements\n//\n// With track user.id: same refresh → Angular sees the same IDs →\n// only items whose data actually changed get their text updated in place.\n// For a list of 100 items, this is roughly 100x less DOM work.\n\n// ─── Legacy syntax, still functionally equivalent ──────────────\n// <li *ngFor=\"let user of users; trackBy: trackByUserId\">{{ user.name }}</li>\n// trackByUserId(index: number, user: User): number { return user.id; }",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">List Refresh — No track vs track item.id</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-rose-50 border-2 border-rose-200 rounded-xl p-3"><p class="font-bold text-rose-700 text-center mb-2">No stable identity</p><div class="flex justify-center gap-1 mb-2">${Array(6).fill(0).map(()=>'<div class=\"w-6 h-6 bg-rose-200 rounded\"></div>').join('')}</div><p class="text-center text-slate-500">Array refresh &rarr; all 6 destroyed &amp; recreated</p></div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3"><p class="font-bold text-emerald-700 text-center mb-2">track item.id</p><div class="flex justify-center gap-1 mb-2">${Array(6).fill(0).map(()=>'<div class=\"w-6 h-6 bg-emerald-300 rounded\"></div>').join('')}</div><p class="text-center text-slate-500">Array refresh &rarr; only changed items touched</p></div></div></div>`
    },
    {
      "id": "what-is-onpush",
      "title": "OnPush change detection strategy",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A hotel that only sends housekeeping to a room when the guest actually presses the "make up my room" button, an event happens in that room, or the front desk hands them a fresh key card (new input reference) — instead of the old policy of knocking on <em>every single door in the building</em> every time anything happens anywhere in the hotel.</p>
          </div>
        </div>
        <p>The <strong>OnPush</strong> strategy tells Angular: "don't check this component on every change detection cycle — only check it when its data could plausibly have changed." It's the single most impactful runtime performance lever in Angular, which is exactly why Angular 22 flipped it to be the default for any component that doesn't explicitly opt back into <code>Default</code>.</p>
        <h3>Default vs OnPush</h3>
        <p>With the old <code>Default</code> strategy, one click anywhere in the app triggers Angular to check <em>every component in the tree</em>. With OnPush, Angular skips entire subtrees whose inputs haven't changed — cutting the number of checks dramatically in a large app. Because OnPush is now the baseline, most components get this for free; understanding it is still essential for reading legacy code, for the rare component that needs <code>Default</code>, and for debugging "why didn't my view update."</p>
        <h3>The four OnPush triggers</h3>
        <ol>
          <li>An input signal or <code>@Input()</code> receives a new reference</li>
          <li>An event originating inside the component fires (click, input, etc.)</li>
          <li>A signal read in the template changes</li>
          <li><code>cdr.markForCheck()</code> is called manually</li>
        </ol>
        <h3>The golden rule for OnPush</h3>
        <p>Never mutate objects in place. Always return new references: <code>this.user.set({ ...this.user(), name: 'x' })</code> instead of mutating a property directly. This is called <strong>immutability</strong>, and it's what makes OnPush — and now the whole app by default — behave correctly.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Since OnPush is now the silent default, mutating state in place is a much easier mistake to make without noticing — code that "worked" under the old Default strategy will quietly stop updating the view once it inherits OnPush. If a component's view stops reacting to data changes in Angular 22, immutability is the first thing to check.</p>
          </div>
        </div>
      `,
      "code": "import { Component, input, signal } from '@angular/core';\n\n// ─── Angular 22: OnPush is the default — no annotation needed ──\n@Component({\n  selector: 'app-product-card',\n  template: `\n    <div class=\"card\">\n      <h3>{{ product().name }}</h3>\n      <p>{{ product().price | currency }}</p>\n      <button (click)=\"onAddToCart()\">Add to Cart</button>\n    </div>\n  `\n  // changeDetection: ChangeDetectionStrategy.OnPush  <- implied, this is the default\n})\nexport class ProductCardComponent {\n  product = input.required<Product>();\n  // ✅ Angular skips this component unless the 'product' reference changes\n  // ✅ Click event on the button still triggers CD for this component\n\n  onAddToCart() {\n    console.log('Added:', this.product().name);\n  }\n}\n\n// ─── Parent updates state the OnPush-safe way ───────────────────\nexport class ProductListComponent {\n  products = signal<Product[]>([]);\n\n  updatePrice(id: number, newPrice: number) {\n    // ❌ WRONG — mutates in place, child won't see a new reference\n    // this.products().find(p => p.id === id)!.price = newPrice;\n\n    // ✅ CORRECT — replace the changed item with a new reference\n    this.products.update(list =>\n      list.map(p => p.id === id ? { ...p, price: newPrice } : p)\n    );\n  }\n}",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Default (legacy) vs OnPush (Angular 22 default)</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-rose-50 border-2 border-rose-200 rounded-xl p-3"><p class="font-bold text-rose-700 text-center mb-2">Default strategy</p><div class="flex flex-col items-center gap-1"><div class="bg-slate-800 text-white rounded px-2 py-1 w-full text-center">1 click anywhere</div><div class="text-slate-300">&darr;</div><div class="bg-white border border-rose-200 rounded px-2 py-1 w-full text-center">Every component checked</div></div></div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3"><p class="font-bold text-emerald-700 text-center mb-2">OnPush (default in v22)</p><div class="flex flex-col items-center gap-1"><div class="bg-slate-800 text-white rounded px-2 py-1 w-full text-center">1 click anywhere</div><div class="text-slate-300">&darr;</div><div class="bg-white border border-emerald-200 rounded px-2 py-1 w-full text-center">Only changed-input subtrees checked</div></div></div></div></div>`
    },
    {
      "id": "how-to-reduce-bundle-size",
      "title": "How to reduce bundle size?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Packing a suitcase for a flight with a strict weight limit. You don't guess what's heavy — you put the suitcase on a scale first (bundle analyzer), then you take out the things you packed "just in case" (unused dependencies), swap the heavy winter coat for a packable jacket (lighter library alternatives), and split what's left across two bags that don't both need to be carried at once (lazy loading).</p>
          </div>
        </div>
        <p>Bundle size directly affects load time, especially on mobile networks. Here's a systematic approach to shrinking it.</p>
        <h3>Step 1: Analyze what's in your bundle</h3>
        <p>You can't optimize what you can't see. <code>webpack-bundle-analyzer</code> gives you a visual treemap of every package in your bundle, sorted by size — you'll immediately spot which dependencies are largest and whether anything got included more than once.</p>
        <h3>Step 2: Lazy load features</h3>
        <p>The single biggest win. Move every feature route to <code>loadComponent()</code> or <code>loadChildren()</code> so the bundle splits into chunks that download on demand instead of all at once.</p>
        <h3>Step 3: Audit your dependencies</h3>
        <p>Common culprits: <code>moment.js</code> (~300KB), importing all of <code>lodash</code> instead of specific functions, icon libraries with thousands of icons when you use ten. Replace Moment with the built-in <code>DatePipe</code> or <code>date-fns</code>. Use named imports from <code>lodash-es</code>. Import only the specific icons you use.</p>
        <h3>Step 4: Remove Zone.js if you don't need it</h3>
        <p>New Angular 22 apps skip Zone.js entirely by default, saving roughly 36KB and the runtime overhead of patching every async browser API. If you're maintaining an existing app that doesn't rely on Zone.js-dependent third-party libraries, migrating off it is a legitimate bundle-size and performance win — but do it deliberately, since upgrading Angular itself does not remove Zone.js for you.</p>
        <h3>Step 5: Use a production build</h3>
        <p><code>ng build</code> (production config) enables AOT compilation, minification, dead code elimination, and file hashing for optimal caching.</p>
      `,
      "code": "// ─── Step 1: Analyze the bundle ───────────────────────────────\n// ng build --stats-json\n// npx webpack-bundle-analyzer dist/<app-name>/stats.json\n// This opens a visual page showing every module by size.\n\n// ─── Step 2: Check Angular's built-in budget warnings ─────────\n// angular.json — set budgets to get warnings/errors if you exceed limits\n// \"budgets\": [\n//   { \"type\": \"initial\",    \"maximumWarning\": \"500kB\", \"maximumError\": \"1MB\" },\n//   { \"type\": \"anyComponentStyle\", \"maximumWarning\": \"4kB\" }\n// ]\n\n// ─── Step 3: Replace heavy packages ──────────────────────────\n// ❌ moment.js — 300KB, affects every app that uses it\nimport * as moment from 'moment';\nconst formatted = moment().format('DD/MM/YYYY');\n\n// ✅ Angular's built-in DatePipe — zero extra bytes\n// {{ today | date:'dd/MM/yyyy' }}\n\n// ─── Step 4: Named imports from lodash-es (tree-shakeable) ─────\n// ❌ Pulls in the entire lodash library\nimport * as _ from 'lodash';\n\n// ✅ Only the specific function is bundled\nimport { debounce } from 'lodash-es';\n\n// ─── Step 5: Skip Zone.js for new apps (~36KB saved) ────────────\n// ng new my-app  — zoneless is the CLI default in Angular 22\n// For an existing app, remove it deliberately after auditing dependencies:\n// bootstrapApplication(AppComponent, {\n//   providers: [provideZonelessChangeDetection()]\n// });",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Bundle Reduction Checklist</p><div class="flex flex-wrap items-center justify-center gap-2 text-xs"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700">1. Analyze</div><span class="text-slate-300">&rarr;</span><div class="bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700">2. Lazy load</div><span class="text-slate-300">&rarr;</span><div class="bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700">3. Audit deps</div><span class="text-slate-300">&rarr;</span><div class="bg-purple-50 border-2 border-purple-200 rounded-lg px-3 py-2 text-center font-semibold text-purple-700">4. Drop Zone.js</div><span class="text-slate-300">&rarr;</span><div class="bg-cyan-50 border-2 border-cyan-200 rounded-lg px-3 py-2 text-center font-semibold text-cyan-700">5. Prod build</div></div></div>`
    },
    {
      "id": "what-is-preloading",
      "title": "What is preloading strategy?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A waiter who, once your table has its appetizers and is settled in, quietly starts prepping the main course in the kitchen before you've ordered it — so when you do ask, it arrives almost instantly. They're not making you wait for the appetizer <em>and</em> not overwhelming you by bringing every dish on the menu unasked.</p>
          </div>
        </div>
        <p><strong>Preloading</strong> bridges the gap between eager loading (everything downloaded upfront, slow start) and lazy loading (instant start, but a noticeable pause the first time you visit a route).</p>
        <h3>How it works</h3>
        <p>Once the initial bundle loads and the app is interactive, Angular can silently download the other lazy chunks in the background while the user reads the first page. By the time they click a navigation link, the code is already cached — navigation feels instant.</p>
        <h3>Built-in strategies</h3>
        <ul>
          <li><strong>NoPreloading</strong> (default) — no background prefetching; each lazy chunk downloads on first navigation</li>
          <li><strong>PreloadAllModules</strong> — prefetch all lazy chunks after initial load. Simple, works well for small-to-medium apps.</li>
        </ul>
        <h3>Custom preloading strategy</h3>
        <p>For large apps with many features, preloading everything wastes bandwidth — especially on mobile. A custom strategy lets you annotate specific routes with <code>data: { preload: true }</code> and only preload those.</p>
      `,
      "code": "import { Routes, PreloadAllModules, PreloadingStrategy, Route } from '@angular/router';\nimport { Injectable } from '@angular/core';\nimport { Observable, of } from 'rxjs';\n\n// ─── Option 1: PreloadAllModules — prefetch everything ─────────\n// main.ts (standalone app)\nbootstrapApplication(AppComponent, {\n  providers: [\n    provideRouter(routes, withPreloading(PreloadAllModules))\n  ]\n});\n\n// ─── Option 2: Custom strategy — preload only flagged routes ───\n// Mark specific routes in app.routes.ts:\nconst routes: Routes = [\n  {\n    path: 'products',\n    data: { preload: true },   // ← flag this route for preloading\n    loadComponent: () => import('./products.component').then(m => m.ProductsComponent)\n  },\n  {\n    path: 'admin',\n    data: { preload: false },  // ← don't preload admin (most users won't visit)\n    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)\n  }\n];\n\n// Custom preloading strategy service:\n@Injectable({ providedIn: 'root' })\nexport class SelectivePreloadingStrategy implements PreloadingStrategy {\n  preload(route: Route, load: () => Observable<any>): Observable<any> {\n    // Only preload routes marked with data.preload === true\n    return route.data?.['preload'] ? load() : of(null);\n  }\n}\n\n// Register:\n// provideRouter(routes, withPreloading(SelectivePreloadingStrategy))",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Eager vs Lazy vs Preloaded</p><div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs"><div class="bg-rose-50 border border-rose-200 rounded-lg p-3 text-center"><p class="font-bold text-rose-700">Eager</p><p class="text-slate-500 mt-1">everything upfront, slow start</p></div><div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center"><p class="font-bold text-amber-700">Lazy, no preload</p><p class="text-slate-500 mt-1">fast start, pause on first visit</p></div><div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center"><p class="font-bold text-emerald-700">Lazy + preload</p><p class="text-slate-500 mt-1">fast start, instant navigation</p></div></div></div>`
    }
  ]
});
