window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "micro-frontends",
  "title": "Micro Frontends",
  "icon": "bi bi-puzzle",
  "questions": [
    {
      id: "angular-22-standard-micro-frontends-upgrade",
      title: "Angular 22 standard for micro frontends",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Standardized <strong>shipping containers</strong>. Before containerization, every port had to unpack and repack cargo by hand for each ship &mdash; slow, fragile, expensive. A shipping container works with any crane, any truck, any ship, because it conforms to one standard size and locking mechanism. A micro frontend is a shipping container for UI: it doesn't matter what's <em>inside</em> (React, Angular 17, Angular 22), as long as it honors the standard interface &mdash; the routes, events, and contracts the shell expects.</p>
          </div>
        </div>
        <p>Angular 22-ready micro frontends should solve an <strong>organizational</strong> scaling problem, not a technical curiosity. Prefer a well-structured monorepo until independent team ownership and independent deployment cadence are genuinely needed. When you do split, keep contracts explicit and dependency versions aligned deliberately &mdash; don't let them drift.</p>
        <h3>Modern micro frontend checklist</h3>
        <ul>
          <li>Use micro frontends for independent ownership and release cadence &mdash; not as a default architecture.</li>
          <li>Share Angular versions deliberately to avoid duplicate runtimes shipping to the browser.</li>
          <li>Define contracts through routes, custom events, APIs, or typed shared packages &mdash; never direct file imports across MFE boundaries.</li>
          <li>Keep authentication, design tokens, telemetry, and error handling consistent across every remote.</li>
          <li>Test integration at the shell level, not only inside each remote in isolation.</li>
        </ul>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Reaching for micro frontends because the codebase "feels big" is the classic trap. Codebase size is a monorepo problem with a monorepo solution (libraries, path aliases, Nx). Micro frontends are the answer to a <strong>team coordination</strong> problem &mdash; multiple teams that can no longer deploy without stepping on each other. Adding the runtime overhead of Module Federation without that organizational pain is pure cost.</p>
          </div>
        </div>
      `,
      code: `// Shell route loading a remote feature:
export const routes: Routes = [
  {
    path: 'billing',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'https://cdn.example.com/billing/remoteEntry.js',
        exposedModule: './routes'
      }).then(m => m.billingRoutes)
  }
];

// Keep shared contracts small:
// @company/contracts -> UserSummary, AuthClaims, NavigationItem`,
      language: "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Shell + Remotes, Each a Sealed Container</p><div class="border-2 border-dashed border-slate-300 rounded-xl p-4"><p class="text-center text-xs font-bold text-slate-500 mb-3">Shell App &mdash; nav, auth, layout, shared contracts</p><div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs"><div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center"><p class="font-bold text-indigo-700">Catalog MFE</p><p class="text-slate-500 mt-1">Team A &middot; deployed daily</p></div><div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center"><p class="font-bold text-emerald-700">Cart MFE</p><p class="text-slate-500 mt-1">Team B &middot; deployed daily</p></div><div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center"><p class="font-bold text-amber-700">Checkout MFE</p><p class="text-slate-500 mt-1">Team C &middot; deployed weekly</p></div></div></div></div>`
    },
    {
      "id": "what-are-micro-frontends",
      "title": "What are micro frontends and when do you need them?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>food court</strong> versus a single restaurant kitchen. In one restaurant, every dish comes from the same kitchen, the same head chef signs off on every plate, and if the fryer breaks, the whole menu is affected. In a food court, each stall has its own kitchen, its own staff, its own menu and release schedule &mdash; but they all share the same building, the same seating, the same restrooms (the shell). You can renovate the taco stall without asking the noodle stall for permission.</p>
          </div>
        </div>
        <p>A <strong>micro frontend</strong> is an architectural pattern where a large web application is split into independently developed, deployed, and owned UI slices &mdash; each managed by a separate team. It's the frontend equivalent of microservices: instead of one massive Angular monolith that every team must coordinate on, each team owns a vertical slice of the UI from feature through to deployment.</p>
        <p>The compelling reason to adopt micro frontends is <strong>organizational</strong>, not technical. If you have ten frontend engineers all working in the same Angular repository, every deployment requires everyone to coordinate, merge conflicts are frequent, a bug in one feature blocks everyone's release, and onboarding new team members to the full codebase is daunting. Micro frontends give each team a smaller, faster-moving codebase they can deploy independently without waiting for other teams.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">If your team has fewer than roughly eight frontend developers, micro frontends add real complexity &mdash; runtime overhead, tooling, inter-app communication protocols, shared dependency management &mdash; without the organizational payoff they're meant to solve. A well-structured Angular monorepo with clear module boundaries gets you most of the code-organization benefit at a fraction of the architectural cost.</p>
          </div>
        </div>
        <h3>Common approaches</h3>
        <p><strong>Webpack 5 Module Federation</strong> is the dominant technical approach for Angular micro frontends &mdash; it enables runtime code sharing between separately built applications. <strong>Single-spa</strong> is an older framework that orchestrates multiple SPA lifecycles on one page. <strong>Web Components / Angular Elements</strong> allow framework-agnostic composition where each team can use a different technology stack.</p>
      `,
      "code": "// Micro frontend landscape for a large e-commerce platform:\n//\n//  ┌────────────────────────── Shell App ─────────────────────────────┐\n//  │  Navigation, Auth, Global State, Layout                           │\n//  │                                                                   │\n//  │  ┌─── Catalog MFE ───┐  ┌─── Cart MFE ───┐  ┌── Checkout MFE ──┐│\n//  │  │  Team A           │  │  Team B         │  │  Team C           ││\n//  │  │  Angular 22       │  │  Angular 22     │  │  Angular 21       ││\n//  │  │  Deployed daily   │  │  Deployed daily │  │  Deployed weekly  ││\n//  │  └───────────────────┘  └─────────────────┘  └───────────────────┘│\n//  └───────────────────────────────────────────────────────────────────┘\n//\n// Each MFE:\n// - Has its own repository and CI/CD pipeline\n// - Can be tested and deployed without touching other MFEs\n// - Shares @angular/core via Module Federation to avoid duplication\n// - Communicates via custom events or a shared state service in the shell",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Monolith Kitchen vs Food Court</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-slate-50 border-2 border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">One repo, one deploy</p><div class="flex flex-col items-center gap-1"><div class="bg-rose-50 border border-rose-200 rounded px-2 py-1 w-full text-center">Every team merges to one branch</div><div class="bg-rose-50 border border-rose-200 rounded px-2 py-1 w-full text-center">One release blocks all teams</div><div class="bg-rose-50 border border-rose-200 rounded px-2 py-1 w-full text-center">One bug can freeze every deploy</div></div></div><div class="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">Food court (micro frontends)</p><div class="flex flex-col items-center gap-1"><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center">Each stall owns its kitchen</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center">Independent release cadence</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center">Shared seating = the shell</div></div></div></div></div>`
    },
    {
      "id": "module-federation",
      "title": "Webpack 5 Module Federation — host and remote setup",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">An apartment building's <strong>shared electrical riser</strong>. Each unit (a remote) doesn't install its own generator &mdash; it taps into one shared power line running up the building. Module Federation's <code>shared</code> config is the building super deciding, in real time, whether a unit's wiring is compatible with the shared line or needs its own separate supply. When it works, every unit runs on one power source; when it doesn't, someone ends up running a noisy generator on the balcony.</p>
          </div>
        </div>
        <p><strong>Webpack 5 Module Federation</strong> is the technology that makes Angular micro frontends practical. It introduces the concept of <strong>remotes</strong> and <strong>hosts</strong>: a remote application exposes JavaScript modules via a special <code>remoteEntry.js</code> file that is downloaded at runtime. A host application references remotes by name and can dynamically load their modules using Angular's router <code>loadChildren</code> or <code>loadComponent</code>, as if the code were local.</p>
        <p>The critical feature that makes this efficient is <strong>shared dependencies</strong>. Without module federation, if both the shell and two micro frontends each bundle their own copy of <code>@angular/core</code>, the user downloads the Angular framework three times. Module Federation's <code>shared</code> configuration lets the host negotiate with each remote at runtime: if a compatible version of a dependency is already loaded, remotes reuse it instead of loading their own copy.</p>
        <h3>@angular-architects/module-federation</h3>
        <p>Writing Webpack Module Federation configuration manually for Angular is verbose and error-prone. The <code>@angular-architects/module-federation</code> package provides an Angular CLI schematic that generates the correct Webpack config, TypeScript declarations, and bootstrap wrappers. It's the standard community tool for Angular MFEs.</p>
      `,
      "code": "# ---- Setup with @angular-architects/module-federation ----\n# In the remote app (e.g., catalog-mfe):\nng add @angular-architects/module-federation --project catalog-mfe --port 4201 --type remote\n\n# In the host/shell app:\nng add @angular-architects/module-federation --project shell --port 4200 --type host\n\n// ---- webpack.config.js (Remote — catalog-mfe) ----\nconst { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');\n\nmodule.exports = withModuleFederationPlugin({\n  name: 'catalogMfe',\n\n  // Expose the lazy routes of this micro frontend\n  exposes: {\n    './Routes': './src/app/catalog/catalog.routes.ts',\n  },\n\n  // Share Angular and RxJS so they are not bundled twice\n  shared: {\n    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),\n  },\n});\n\n// ---- webpack.config.js (Host — shell) ----\nconst { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');\n\nmodule.exports = withModuleFederationPlugin({\n  remotes: {\n    // Map remote name to its entry point URL\n    // In production, these URLs come from environment config\n    catalogMfe: 'catalogMfe@http://localhost:4201/remoteEntry.js',\n    cartMfe:    'cartMfe@http://localhost:4202/remoteEntry.js',\n  },\n  shared: {\n    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),\n  },\n});\n\n// ---- shell/app.routes.ts — lazy load the remote ----\nimport { Routes } from '@angular/router';\nimport { loadRemoteModule } from '@angular-architects/module-federation';\n\nexport const routes: Routes = [\n  {\n    path: 'catalog',\n    // loadRemoteModule fetches remoteEntry.js and then imports the exposed routes\n    loadChildren: () => loadRemoteModule({\n      type: 'module',\n      remoteEntry: 'http://localhost:4201/remoteEntry.js',\n      exposedModule: './Routes'\n    }).then(m => m.CATALOG_ROUTES)\n  }\n];",
      "language": "javascript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Host Loads a Remote at Runtime</p><div class="flex flex-wrap items-center justify-center gap-2 text-xs"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700">1. Host navigates to /catalog</div><span class="text-slate-300">&rarr;</span><div class="bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700">2. Fetch remoteEntry.js</div><span class="text-slate-300">&rarr;</span><div class="bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700">3. Negotiate shared deps</div><span class="text-slate-300">&rarr;</span><div class="bg-purple-50 border-2 border-purple-200 rounded-lg px-3 py-2 text-center font-semibold text-purple-700">4. Import exposed routes</div><span class="text-slate-300">&rarr;</span><div class="bg-cyan-50 border-2 border-cyan-200 rounded-lg px-3 py-2 text-center font-semibold text-cyan-700">5. Render as if local</div></div></div>`
    },
    {
      "id": "cross-mfe-communication",
      "title": "Communication between micro frontends",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Independent crews on a <strong>construction site</strong> talking over a shared radio channel instead of shouting through each other's trailer walls. The electrician doesn't walk into the plumber's trailer and start rewiring their tools directly &mdash; that's how you get someone electrocuted. Everyone broadcasts on the shared channel (<code>document.dispatchEvent</code>) or checks in with the site foreman (a shared shell service), and anyone who cares can tune in.</p>
          </div>
        </div>
        <p>The hardest problem in micro frontend architecture is not the build tooling &mdash; it's deciding how independent applications share state and communicate events without creating tight coupling.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">If two micro frontends directly import from each other's source, you have quietly recreated the monolith &mdash; just with extra build steps. The rule is: micro frontends should only communicate through contracts defined in the shell, never through direct module imports between remotes.</p>
          </div>
        </div>
        <h3>Custom DOM events (framework-agnostic)</h3>
        <p>Custom DOM events are the most decoupled approach. A micro frontend dispatches a <code>CustomEvent</code> on the <code>document</code> or a known DOM element. Any other micro frontend &mdash; regardless of framework &mdash; can listen for it with <code>addEventListener</code>. This is fully framework-agnostic and requires zero shared code. The downside is that complex payloads are serialized through the DOM event's <code>detail</code> property, and there's no type safety unless you add conventions around the event name and shape.</p>
        <h3>Shared service in the shell (Angular-to-Angular)</h3>
        <p>When all micro frontends are Angular and use Module Federation's shared dependencies, services provided in the shell app are available to all remotes that share <code>@angular/core</code> as a singleton. A <code>GlobalStateService</code> with a signal works across apps as if they were one. This is convenient but creates coupling to the shell's DI tree &mdash; use it for genuinely global state (current user, auth tokens, theme) rather than feature-specific state.</p>
        <h3>Shared state library</h3>
        <p>The cleanest approach is a versioned npm package (internal or public) that defines the state contract: TypeScript interfaces, event name constants, and the shared store. All micro frontends depend on this package, and the package is shared via Module Federation. Changes to the contract require a package version bump, making breaking changes explicit.</p>
      `,
      "code": "// ---- Approach 1: Custom DOM Events (framework-agnostic) ----\n\n// In catalog-mfe: user adds item to cart\nexport function dispatchCartAdd(product: { id: number; name: string; price: number }) {\n  document.dispatchEvent(new CustomEvent('mfe:cart:add', {\n    detail: product,\n    bubbles: true\n  }));\n}\n\n// In cart-mfe (or the shell): listen for the event\ndocument.addEventListener('mfe:cart:add', (event: Event) => {\n  const product = (event as CustomEvent).detail;\n  cartService.addItem(product);\n});\n\n// ---- Approach 2: Shared service in the shell ----\n// shared-state.service.ts (in shell, shared via MF singleton)\nimport { Injectable, signal, computed } from '@angular/core';\n\nexport interface AuthUser { id: number; name: string; role: 'admin' | 'customer'; }\n\n@Injectable({ providedIn: 'root' })\nexport class ShellStateService {\n  private _user = signal<AuthUser | null>(null);\n\n  // Public read-only surface — micro frontends can read but not replace the signal\n  readonly user = this._user.asReadonly();\n  readonly isAdmin = computed(() => this._user()?.role === 'admin');\n\n  setUser(user: AuthUser | null): void {\n    this._user.set(user);\n  }\n}\n\n// In any remote MFE — works because @angular/core is a shared singleton:\nimport { Component, inject } from '@angular/core';\nimport { ShellStateService } from 'shell/StateService';  // imported via MF\n\n@Component({ template: `Hello, {{ state.user()?.name }}` })\nexport class CatalogHeaderComponent {\n  state = inject(ShellStateService);\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Three Ways to Talk Across MFEs</p><div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs"><div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3"><p class="font-bold text-indigo-700 text-center">Custom DOM events</p><p class="text-slate-500 mt-1 text-center">framework-agnostic, no shared code, no type safety</p></div><div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3"><p class="font-bold text-emerald-700 text-center">Shared shell service</p><p class="text-slate-500 mt-1 text-center">Angular-to-Angular, typed, couples to shell DI</p></div><div class="bg-amber-50 border border-amber-200 rounded-lg p-3"><p class="font-bold text-amber-700 text-center">Shared state package</p><p class="text-slate-500 mt-1 text-center">versioned contract, explicit breaking changes</p></div></div></div>`
    },
    {
      "id": "shared-dependencies",
      "title": "Managing shared dependencies — versioning and compatibility",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A shared <strong>water main</strong> for a row of houses. If every house's plumbing is built for the same pressure standard, they all safely tap the same main. If one house was renovated to an incompatible standard, you have two choices: refuse to connect it (<code>strictVersion: true</code> &mdash; the tap fails loudly), or let it install its own private pump (<code>strictVersion: false</code>) &mdash; which works, but now you have two water systems running side by side under one roof, and leaks are much harder to trace.</p>
          </div>
        </div>
        <p>Shared dependencies are the most technically treacherous part of module federation. When a remote and the host declare <code>@angular/core</code> as a shared singleton, Webpack's module federation runtime negotiates which version to use at load time. If the versions are compatible (same major, different minor), the higher minor version wins and is used by all. If they're incompatible, the behavior depends on your <code>strictVersion</code> setting.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">With <code>strictVersion: false</code>, an incompatible remote silently falls back to loading its own copy of <code>@angular/core</code> instead of failing. That means two copies of Angular can end up running on the same page &mdash; two change detection cycles, two injector trees &mdash; causing subtle bugs that only show up in production traffic. Only allow this fallback for genuinely stateless, non-singleton libraries.</p>
          </div>
        </div>
        <h3>Version alignment strategy</h3>
        <p>The practical solution is to standardize on a shared <code>package.json</code> maintained in a separate versions repository or wiki. All micro frontend teams update their Angular version together during coordinated upgrade sprints. Use <code>requiredVersion: 'auto'</code> in the <code>shareAll</code> helper &mdash; it reads the version from your <code>package.json</code> automatically, so you never have version strings in two places.</p>
      `,
      "code": "// webpack.config.js — recommended shared dependency configuration\nconst { shareAll, share, withModuleFederationPlugin } =\n  require('@angular-architects/module-federation/webpack');\n\nmodule.exports = withModuleFederationPlugin({\n  // ... name/exposes/remotes ...\n\n  shared: {\n    // shareAll shares every dependency in package.json as singleton\n    // requiredVersion: 'auto' reads version from package.json automatically\n    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),\n\n    // Override specific packages for different strategies\n    'rxjs': {\n      singleton: true,\n      strictVersion: false,  // RxJS 7.x is largely compatible across minors\n      requiredVersion: 'auto'\n    },\n\n    // UI component libraries used only by one MFE should NOT be shared\n    // — they will be bundled into that MFE's chunk only\n    // Omitting them from shared means they are never negotiated\n  }\n});\n\n// ---- Version compatibility summary ----\n// Safe to share as singleton:   @angular/core, @angular/common, rxjs\n// Be careful:                   @angular/router (must have same instance)\n// OK to have multiple copies:   date-fns, lodash-es (pure functions, no global state)\n// Never share:                  CSS-in-JS libraries (they inject into the DOM)\n\n// ---- Diagnosing version conflicts at runtime ----\n// In Chrome DevTools console when MFE loads:\n// 'Shared module ... is not available for eager consumption'\n//  -> Add dynamic import wrapper (bootstrap.ts pattern) to the MFE main.ts",
      "language": "javascript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Sharing Strategy by Dependency Type</p><div class="grid grid-cols-2 gap-3 text-xs"><div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center"><p class="font-bold text-emerald-700">Safe as singleton</p><p class="text-slate-500 mt-1">@angular/core, @angular/common, rxjs</p></div><div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center"><p class="font-bold text-amber-700">Be careful</p><p class="text-slate-500 mt-1">@angular/router — must be same instance</p></div><div class="bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-center"><p class="font-bold text-cyan-700">OK to duplicate</p><p class="text-slate-500 mt-1">date-fns, lodash-es (pure functions)</p></div><div class="bg-rose-50 border border-rose-200 rounded-lg p-3 text-center"><p class="font-bold text-rose-700">Never share</p><p class="text-slate-500 mt-1">CSS-in-JS libs (inject into DOM globally)</p></div></div></div>`
    },
    {
      "id": "testing-micro-frontends",
      "title": "Testing strategy for micro frontends",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">An orchestra's rehearsal schedule. Musicians practice their own part alone at home first (<strong>unit tests</strong>), then the string section rehearses together to make sure their parts actually fit (<strong>contract tests</strong>), and only at the end does the full orchestra run a dress rehearsal on stage (<strong>E2E tests</strong>). You wouldn't skip straight to the dress rehearsal &mdash; it's too expensive to diagnose a wrong note when eighty musicians are playing at once.</p>
          </div>
        </div>
        <p>Testing micro frontends requires thinking at multiple levels. Because each MFE is a separate application, the test pyramid looks slightly different from a monolith: comprehensive unit and integration tests inside each MFE, lightweight contract tests to verify the inter-MFE communication interface, and a small suite of E2E tests that verify the shell correctly loads and integrates all MFEs together.</p>
        <h3>Unit tests (per MFE)</h3>
        <p>Each micro frontend is tested in isolation using Angular's standard testing tools. Components, services, and pipes are tested with <code>TestBed</code> exactly as in a monolith. Dependencies from the shell (shared services) are mocked. The goal is fast, comprehensive coverage without needing to run other MFEs.</p>
        <h3>Contract tests</h3>
        <p>Contract tests verify that the communication protocol between MFEs is honored. If the catalog MFE emits a <code>mfe:cart:add</code> custom event, a contract test verifies it emits exactly that event with the correct payload shape. If the shell state service provides a <code>user</code> signal, a contract test verifies it has the expected interface. Contract tests catch breaking changes before integration.</p>
        <h3>E2E tests (full integration)</h3>
        <p>E2E tests (Playwright or Cypress) start the shell and all MFEs simultaneously and test full user journeys. These are expensive to run but provide the highest confidence that everything works together. They should cover the critical user flows (login, add to cart, checkout) rather than exhaustive feature coverage &mdash; leave that to unit tests in each MFE.</p>
      `,
      "code": "// ---- Unit test inside a micro frontend (catalog-mfe) ----\nimport { ComponentFixture, TestBed } from '@angular/core/testing';\nimport { ProductListComponent } from './product-list.component';\nimport { ShellStateService } from '../shared/shell-state.service';\n\ndescribe('ProductListComponent', () => {\n  let fixture: ComponentFixture<ProductListComponent>;\n\n  beforeEach(async () => {\n    await TestBed.configureTestingModule({\n      imports: [ProductListComponent],\n      providers: [\n        // Mock the shared shell service — no need to load the shell\n        {\n          provide: ShellStateService,\n          useValue: { user: signal({ id: 1, name: 'Test', role: 'customer' }) }\n        }\n      ]\n    }).compileComponents();\n\n    fixture = TestBed.createComponent(ProductListComponent);\n  });\n\n  it('should display products', () => {\n    fixture.detectChanges();\n    expect(fixture.nativeElement.querySelectorAll('.product-card').length).toBeGreaterThan(0);\n  });\n});\n\n// ---- Contract test: verify event shape ----\ndescribe('Cart integration contract', () => {\n  it('should dispatch mfe:cart:add event with correct shape', () => {\n    const events: CustomEvent[] = [];\n    document.addEventListener('mfe:cart:add', (e) => events.push(e as CustomEvent));\n\n    dispatchCartAdd({ id: 1, name: 'Laptop', price: 999 });\n\n    expect(events).toHaveLength(1);\n    expect(events[0].detail).toEqual(\n      jasmine.objectContaining({ id: 1, name: 'Laptop', price: 999 })\n    );\n  });\n});\n\n// ---- E2E test (Playwright): full user journey ----\n// tests/checkout.spec.ts\nimport { test, expect } from '@playwright/test';\n\ntest('user can add product and proceed to checkout', async ({ page }) => {\n  await page.goto('http://localhost:4200');\n  await page.click('[data-testid=\"product-laptop\"] [data-testid=\"add-to-cart\"]');\n  await page.click('[data-testid=\"cart-icon\"]');\n  await expect(page.locator('[data-testid=\"cart-count\"]')).toHaveText('1');\n  await page.click('[data-testid=\"checkout-btn\"]');\n  await expect(page).toHaveURL(/checkout/);\n});",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">The MFE Test Pyramid</p><div class="flex flex-col items-center gap-2 text-xs"><div class="bg-rose-50 border border-rose-200 rounded-lg px-4 py-2 text-center font-semibold text-rose-700 w-40">E2E — full journeys</div><div class="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-center font-semibold text-amber-700 w-64">Contract tests — event &amp; interface shapes</div><div class="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2 text-center font-semibold text-emerald-700 w-96">Unit tests — every MFE, in isolation, fast</div></div></div>`
    }
  ]
});
