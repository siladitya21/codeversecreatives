window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "advanced-concepts",
  "title": "Advanced Concepts",
  "icon": "bi bi-rocket-takeoff",
  "questions": [
    {
      id: "angular-22-standard-advanced-upgrade",
      title: "Angular 22 standard for advanced concepts",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A well-equipped workshop. A beginner uses the hammer for everything; an advanced builder knows when to reach for the router, the lathe, or the clamp instead — not because those tools are fancier, but because each one is the right shape for a specific job. Advanced Angular is less about knowing exotic APIs and more about knowing which tool fits which boundary: SSR at the network edge, signals at the state edge, defer blocks at the loading edge.</p>
          </div>
        </div>
        <p>Angular 22-ready advanced work is mostly about choosing the right platform feature at the right boundary: SSR and hydration for first paint and SEO, signals for fine-grained state, standalone APIs for composition, defer blocks for loading strategy, and functional providers for framework integration.</p>
        <h3>Modern advanced checklist</h3>
        <ul>
          <li>Use Angular SSR with hydration for content-heavy or SEO-sensitive apps.</li>
          <li>Guard browser-only APIs with platform checks during SSR.</li>
          <li>Use <code>@defer</code> blocks for expensive UI that doesn't need to load immediately.</li>
          <li>Prefer functional guards, resolvers, interceptors, and providers over class-based ones.</li>
          <li>Use signals and RxJS interop deliberately rather than mixing patterns randomly — pick one as the source of truth per piece of state.</li>
        </ul>
      `,
      code: `// Advanced Angular 22-ready app shape
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideClientHydration()
  ]
});

// Browser-only work during SSR:
const platformId = inject(PLATFORM_ID);
if (isPlatformBrowser(platformId)) {
  localStorage.setItem('theme', 'dark');
}

// Template idea:
// @defer (on viewport) {
//   <app-heavy-analytics-panel />
// } @placeholder {
//   <app-panel-skeleton />
// }`,
      language: "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Right Tool, Right Boundary</p><div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs"><div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center"><p class="font-bold text-indigo-700">SSR + hydration</p><p class="text-slate-500 mt-1">first paint / SEO</p></div><div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center"><p class="font-bold text-emerald-700">Signals</p><p class="text-slate-500 mt-1">fine-grained state</p></div><div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center"><p class="font-bold text-amber-700">@defer</p><p class="text-slate-500 mt-1">loading strategy</p></div><div class="bg-rose-50 border border-rose-200 rounded-lg p-3 text-center"><p class="font-bold text-rose-700">Functional DI</p><p class="text-slate-500 mt-1">guards / interceptors</p></div><div class="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center"><p class="font-bold text-purple-700">Web Components</p><p class="text-slate-500 mt-1">Angular Elements</p></div><div class="bg-cyan-50 border border-cyan-200 rounded-lg p-3 text-center"><p class="font-bold text-cyan-700">Shadow DOM</p><p class="text-slate-500 mt-1">style isolation</p></div></div></div>`
    },
    {
      "id": "angular-universal-ssr",
      "title": "What is Angular Universal (SSR)?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Ordering food delivery. Client-side rendering is being handed a bag of raw groceries and a recipe card at your door — you still have to go cook the meal yourself before you can eat. SSR is the same order arriving already cooked and plated; you can start eating (viewing content) immediately, even while the kitchen (Angular's JavaScript) is still washing up in the background to make the table interactive.</p>
          </div>
        </div>
        <p><strong>Angular Universal</strong> — now simply called <strong>Angular SSR</strong> — renders your Angular application on the <strong>server</strong> and sends finished HTML to the browser, instead of sending a blank page and making the browser do all the rendering work.</p>
        <p>In a standard client-side Angular app, the server sends a nearly empty <code>index.html</code> plus a JavaScript bundle. The browser downloads the JS, boots Angular, and only then renders the UI — a delay during which the user stares at a blank screen. SSR eliminates that gap by sending a fully populated HTML page immediately.</p>
        <h3>Why use SSR?</h3>
        <p><strong>SEO</strong> is the most common reason. Search engine crawlers get real HTML content right away instead of an empty shell requiring JavaScript execution. Social link previews benefit the same way — crawlers read the raw HTML for title and OG image tags.</p>
        <p><strong>Perceived performance</strong> is the second reason. First Contentful Paint and Largest Contentful Paint — Core Web Vitals that factor into search ranking — both improve dramatically when the server sends pre-rendered HTML.</p>
        <h3>Hydration</h3>
        <p>After the server-rendered HTML arrives, Angular still needs to download and boot its JavaScript to make the page interactive — attaching event listeners and change detection to the already-visible DOM. This is <strong>hydration</strong>. Angular's non-destructive hydration reuses the server-rendered DOM instead of tearing it down and rebuilding it, eliminating the flicker older SSR implementations suffered.</p>
        <h3>Platform-specific gotchas</h3>
        <p>Server-side code runs in Node.js, not a browser — <code>window</code>, <code>document</code>, and <code>localStorage</code> don't exist there. Use <code>isPlatformBrowser()</code> or the <code>PLATFORM_ID</code> injection token to conditionally skip browser-only code on the server.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Calling <code>localStorage</code> or <code>document</code> directly inside a constructor or field initializer runs during the server render too, and will throw because those globals don't exist in Node.js. Guard with <code>isPlatformBrowser()</code>, or better, defer the access to <code>ngOnInit</code>/an effect where it's easier to gate.</p>
          </div>
        </div>
      `,
      "code": "// Add SSR to an existing Angular project:\n// ng add @angular/ssr\n\n// ---- Guarding browser-only APIs ----\nimport { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';\nimport { isPlatformBrowser } from '@angular/common';\n\n@Component({\n  selector: 'app-analytics',\n  template: '<p>Analytics ready</p>'\n})\nexport class AnalyticsComponent implements OnInit {\n  private platformId = inject(PLATFORM_ID);\n\n  ngOnInit(): void {\n    if (isPlatformBrowser(this.platformId)) {\n      // Safe: only runs in the browser, not during SSR\n      const savedTheme = localStorage.getItem('theme');\n      console.log('Saved theme:', savedTheme);\n    }\n  }\n}\n\n// ---- main.server.ts / bootstrap (generated by ng add @angular/ssr) ----\n// bootstrapApplication(AppComponent, {\n//   providers: [provideClientHydration()]\n// });\n//\n// The Node server renders each request's HTML and sends it pre-populated;\n// the browser then hydrates it non-destructively.",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">CSR vs SSR — Time to First Content</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-rose-50 border-2 border-rose-200 rounded-xl p-3"><p class="font-bold text-rose-700 text-center mb-2">Client-side rendering</p><div class="flex flex-col items-center gap-1"><div class="bg-white border border-rose-200 rounded px-2 py-1 w-full text-center">Blank index.html</div><div class="text-slate-300">&darr;</div><div class="bg-white border border-rose-200 rounded px-2 py-1 w-full text-center">Download + boot JS</div><div class="text-slate-300">&darr;</div><div class="bg-slate-800 text-white rounded px-2 py-1 w-full text-center">First content visible</div></div></div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3"><p class="font-bold text-emerald-700 text-center mb-2">Server-side rendering</p><div class="flex flex-col items-center gap-1"><div class="bg-slate-800 text-white rounded px-2 py-1 w-full text-center">First content visible</div><div class="text-slate-300">&darr;</div><div class="bg-white border border-emerald-200 rounded px-2 py-1 w-full text-center">Hydration (non-destructive)</div><div class="text-slate-300">&darr;</div><div class="bg-white border border-emerald-200 rounded px-2 py-1 w-full text-center">Fully interactive</div></div></div></div></div>`
    },
    {
      "id": "angular-cli",
      "title": "What is Angular CLI?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A general contractor for your project. You could hire the electrician, the plumber, and the framer separately and coordinate them all yourself — or you call one contractor who already knows how to wire everything together, pulls permits automatically, and hands you a finished, code-compliant room with one phone call. The CLI is that contractor for Angular's build tooling.</p>
          </div>
        </div>
        <p>The <strong>Angular CLI</strong> is a command-line tool that manages the entire lifecycle of an Angular project, from initial creation to production deployment. It hides the complexity of esbuild, TypeScript configuration, test runner setup, and linting behind simple commands so you can focus on application code.</p>
        <p>Without the CLI, setting up a project from scratch would mean manually configuring a bundler with loaders for TypeScript, HTML templates, SCSS, and assets; tuning <code>tsconfig.json</code> for Angular's compiler; wiring a test runner; and writing scripts for every workflow. <code>ng new</code> generates all of that in seconds with sane defaults baked in.</p>
        <h3>Scaffolding — ng generate</h3>
        <p><code>ng generate</code> (aliased <code>ng g</code>) creates files that follow Angular's structural and naming conventions, and updates any relevant barrel or routing file to reference the new piece — <code>ng g component user-profile</code> creates the component and spec file and wires it in, preventing the common mistake of creating a file but forgetting to register it.</p>
        <h3>The build pipeline</h3>
        <p>The CLI's default builder uses <strong>esbuild</strong> (via the Application builder), replacing the older Webpack-based pipeline. esbuild is dramatically faster — cold builds that once took 30+ seconds now complete in a few seconds on large projects. The dev server uses Vite for near-instant hot module replacement.</p>
      `,
      "code": "# ---- Project lifecycle commands ----\nnpm install -g @angular/cli      # Install CLI globally\nng new my-shop                    # Create new project (standalone-first by default)\nng serve                          # Start dev server at localhost:4200\nng build --configuration production  # Production build to dist/\n\n# ---- Scaffolding commands ----\nng generate component features/product-card   # Component\nng generate service core/services/cart        # Service\nng generate guard core/guards/auth            # Route guard\nng generate pipe shared/pipes/truncate        # Pipe\nng generate directive shared/directives/highlight  # Directive\nng generate interface models/product          # TypeScript interface\n\n# ---- Maintenance ----\nng update                         # See available Angular updates\nng update @angular/core @angular/cli  # Update framework + CLI\nng lint                           # Run ESLint across the project\nng test                           # Run unit tests",
      "language": "bash",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">One Command, Several Tools Coordinated</p><div class="flex flex-col items-center gap-2 text-xs"><div class="bg-slate-800 text-white rounded-lg px-4 py-2 text-center font-mono">ng new my-shop</div><div class="text-slate-300">&darr;</div><div class="grid grid-cols-2 md:grid-cols-4 gap-2 w-full max-w-lg"><div class="bg-indigo-50 border border-indigo-200 rounded px-2 py-1.5 text-center">esbuild config</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1.5 text-center">tsconfig.json</div><div class="bg-amber-50 border border-amber-200 rounded px-2 py-1.5 text-center">Test runner</div><div class="bg-rose-50 border border-rose-200 rounded px-2 py-1.5 text-center">ESLint</div></div></div></div>`
    },
    {
      "id": "what-are-schematics",
      "title": "What are schematics?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A CNC machine cutting a piece from a digital blueprint instead of a craftsperson eyeballing it by hand. You feed the machine a program (the schematic), it cuts precisely and identically every time, and if the machine jams partway through, the piece just gets scrapped and started over — no half-cut, ruined material left behind. That's why schematics operate on a virtual filesystem tree instead of your real files directly: a failure rolls back cleanly.</p>
          </div>
        </div>
        <p><strong>Schematics</strong> are code transformation scripts the Angular CLI runs when you execute <code>ng generate</code>, <code>ng add</code>, or <code>ng update</code>. Every time <code>ng generate component</code> creates files and updates a reference to them, a schematic is what actually did that work.</p>
        <p>A schematic is a TypeScript function that receives a virtual filesystem tree representing your project and returns a modified version of that tree. The CLI then applies the diff to the real filesystem. Because schematics work on a virtual tree, they're transactional — if any step fails, the entire change rolls back with no partial files left behind.</p>
        <h3>ng add — library schematics</h3>
        <p>When you run <code>ng add @angular/material</code>, Angular Material ships its own schematic that installs the npm package, wires up animations, sets a theme, and adds font links to <code>index.html</code> — all automatically. Any library that publishes an <code>ng-add</code> schematic can offer this same zero-friction setup.</p>
        <h3>Custom schematics for team standards</h3>
        <p>Large teams write custom schematics to enforce architectural standards. Instead of hoping developers remember to add a proper <code>track</code> expression to every list, a custom <code>ng generate list-page</code> schematic can generate the component with tracking, the service call, and the loading state already wired in — making the right pattern the default pattern.</p>
      `,
      "code": "# ---- Using built-in schematics ----\nng generate component           # runs @schematics/angular:component\nng add @angular/material        # runs @angular/material:ng-add\nng update @angular/core         # runs @angular/core:migration-*\n\n# ---- Creating a custom schematic ----\nnpm install -g @angular-devkit/schematics-cli\nschematics blank --name my-schematics\n\n// src/my-component/index.ts — the schematic factory:\nimport { Rule, SchematicContext, Tree, apply, mergeWith, template, url } from '@angular-devkit/schematics';\n\nexport function myComponent(options: any): Rule {\n  return (tree: Tree, context: SchematicContext) => {\n    const sourceTemplates = url('./files');  // template files in ./files/\n    const sourceParametrized = apply(sourceTemplates, [\n      template({ ...options, classify: (s: string) => s })\n    ]);\n    return mergeWith(sourceParametrized);\n  };\n}\n\n// Run the custom schematic:\n// schematics .:my-component --name=dashboard",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Schematic = Transactional File Diff</p><div class="flex flex-col items-center gap-1 text-xs max-w-sm mx-auto"><div class="bg-indigo-50 border border-indigo-200 rounded px-3 py-1.5 w-full text-center">ng generate component user-profile</div><div class="text-slate-300">&darr;</div><div class="bg-amber-50 border border-amber-200 rounded px-3 py-1.5 w-full text-center">Schematic builds virtual tree diff</div><div class="text-slate-300">&darr;</div><div class="bg-emerald-50 border border-emerald-200 rounded px-3 py-1.5 w-full text-center">Applied to disk (all-or-nothing)</div></div></div>`
    },
    {
      "id": "angular-elements",
      "title": "What is Angular Elements?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A shipping container. It doesn't matter whether the ship, the truck, or the train that carries it runs on diesel or electricity — the container has a standard shape every vehicle knows how to load. Angular Elements packages a component into that standard shape (a Web Component), so it can be loaded into a React app, a plain static page, or a legacy jQuery site without any of them needing to speak "Angular" natively.</p>
          </div>
        </div>
        <p><strong>Angular Elements</strong> lets you package any Angular component as a standard <strong>Web Component</strong> (Custom Element). The resulting element can be embedded in any HTML page — a static site, a React or Vue app, a server-rendered page — without the host needing Angular present at all.</p>
        <p>The motivation is usually micro-frontend architecture or gradual migration. If a legacy application can't be rewritten in Angular all at once, you can build new features as Angular Elements and embed them as <code>&lt;my-new-widget&gt;</code> in the old codebase. Angular's runtime is bundled into the element itself — the host has no idea Angular is involved.</p>
        <h3>How it works</h3>
        <p><code>createCustomElement()</code> wraps an Angular component in a class that extends <code>HTMLElement</code>, mapping Angular inputs to HTML attributes and outputs to DOM CustomEvents. <code>customElements.define()</code> then registers it under a chosen tag name with the browser's custom element registry.</p>
        <h3>Limitation to know</h3>
        <p>Each Angular Element bundles the Angular runtime, so embedding many independent elements on one page ships that runtime multiple times. The usual fix is building a single Angular app that registers multiple elements from one shared bundle.</p>
      `,
      "code": "import { createCustomElement } from '@angular/elements';\nimport { Component, input, output, inject, Injector } from '@angular/core';\n\n@Component({\n  selector: 'app-rating',\n  template: `\n    <div class=\"stars\">\n      @for (s of [1,2,3,4,5]; track s) {\n        <span (click)=\"rate(s)\">{{ s <= value() ? '★' : '☆' }}</span>\n      }\n    </div>\n  `\n})\nexport class RatingComponent {\n  value = input(0);\n  rated = output<number>();\n\n  rate(star: number): void {\n    this.rated.emit(star);\n  }\n}\n\n// Register as a Web Component in main.ts or app bootstrapping:\nconst injector = inject(Injector);\nconst RatingElement = createCustomElement(RatingComponent, { injector });\ncustomElements.define('app-rating', RatingElement);\n\n// Now usable in ANY HTML — no Angular required in host:\n// <app-rating value=\"3\"></app-rating>\n// <script>\n//   document.querySelector('app-rating').addEventListener('rated', e => {\n//     console.log('User rated:', e.detail);\n//   });\n// </script>",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Angular Element Inside Any Host</p><div class="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center"><p class="text-xs font-bold text-slate-500 mb-3">Any host page (React, static HTML, legacy jQuery)</p><div class="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-3 inline-block text-xs font-mono text-indigo-700">&lt;app-rating value="3"&gt;&lt;/app-rating&gt;</div><p class="text-slate-400 mt-2">Angular runtime bundled inside — host doesn't know</p></div></div>`
    },
    {
      "id": "view-encapsulation",
      "title": "What is ViewEncapsulation?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Apartment soundproofing. <strong>Emulated</strong> is decent soundproofing built into the walls — your neighbor's music mostly doesn't leak through, but it's an approximation, not a physical barrier. <strong>ShadowDom</strong> is a genuinely separate, sealed room with its own walls — nothing gets through in either direction. <strong>None</strong> is an open-plan loft with no walls at all — everyone hears everything, which is sometimes exactly what you want for shared decor (a global theme).</p>
          </div>
        </div>
        <p><strong>ViewEncapsulation</strong> controls whether a component's CSS styles affect only that component or leak into the rest of the application. Angular provides three modes, and choosing the wrong one is a common source of styling bugs in large projects.</p>
        <h3>Emulated (default)</h3>
        <p>Angular emulates Shadow DOM style scoping by rewriting CSS selectors at build time — it adds a unique attribute like <code>_ngcontent-abc-c1</code> to every host element and appends that attribute to every CSS rule. So <code>p { color: red }</code> becomes <code>p[_ngcontent-abc-c1] { color: red }</code>. Only elements rendered by that specific component carry the attribute. This works in every browser with zero native Shadow DOM support required.</p>
        <h3>ShadowDom</h3>
        <p>Uses the browser's native Shadow DOM API — the component's HTML and CSS live inside a shadow root, a truly isolated DOM subtree. Global styles can't penetrate the boundary and the component's styles can't leak out. Strongest isolation, but global resets and typography rules won't apply inside the shadow root unless you use CSS custom properties or <code>::part()</code> selectors.</p>
        <h3>None</h3>
        <p>No encapsulation at all — the component's styles are injected as global stylesheets, affecting every matching element anywhere on the page. Use this only for components that intentionally provide global styles, like a theme component, and be specific with selectors to avoid unintended overrides.</p>
      `,
      "code": "import { Component, ViewEncapsulation } from '@angular/core';\n\n// ---- Emulated (default) — styles scoped via attribute selectors ----\n@Component({\n  selector: 'app-card',\n  encapsulation: ViewEncapsulation.Emulated, // this is the default\n  template: '<div class=\"card\"><ng-content></ng-content></div>',\n  styles: [`.card { border: 1px solid #ddd; padding: 16px; }`]\n  // Compiled to: .card[_ngcontent-xyz] { border: 1px solid #ddd; }\n  // Only affects this component's elements.\n})\nexport class CardComponent {}\n\n// ---- ShadowDom — native browser isolation ----\n@Component({\n  selector: 'app-isolated-widget',\n  encapsulation: ViewEncapsulation.ShadowDom,\n  template: '<p class=\"msg\">Native shadow root</p>',\n  styles: [`.msg { color: purple; }`]\n  // Global CSS cannot touch .msg inside this component's shadow root.\n})\nexport class IsolatedWidgetComponent {}\n\n// ---- None — global styles (use sparingly) ----\n@Component({\n  selector: 'app-global-theme',\n  encapsulation: ViewEncapsulation.None,\n  template: '',\n  styles: [`\n    :root {\n      --primary: #6366f1;\n      --surface: #f8fafc;\n    }\n  `]\n  // These CSS variables are available everywhere.\n})\nexport class GlobalThemeComponent {}",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Three Encapsulation Modes</p><div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs"><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center"><p class="font-bold text-emerald-700">Emulated (default)</p><p class="text-slate-500 mt-1">attribute-scoped, all browsers</p></div><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center"><p class="font-bold text-indigo-700">ShadowDom</p><p class="text-slate-500 mt-1">native, fully sealed</p></div><div class="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center"><p class="font-bold text-amber-700">None</p><p class="text-slate-500 mt-1">global, no boundary</p></div></div></div>`
    },
    {
      "id": "shadow-dom",
      "title": "What is Shadow DOM?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A hotel room versus an open-plan office. In the open office (regular DOM), anyone's stray paperwork (a stray CSS rule) can drift onto your desk. A hotel room (a shadow root) has its own door — outside noise doesn't get in, and what happens in your room stays in your room. <code>mode: 'open'</code> is a room the front desk (JavaScript) can still peek into with a master key; <code>mode: 'closed'</code> bars even that.</p>
          </div>
        </div>
        <p><strong>Shadow DOM</strong> is a web platform feature — not Angular-specific — that provides true encapsulation for a component's HTML and CSS. Every element in a Shadow DOM lives in a separate, private DOM tree called the <em>shadow root</em>. Styles from the outer document can't reach inside it, and styles defined inside can't leak outside. It's the foundation of proper Web Component isolation.</p>
        <h3>Open vs closed</h3>
        <p>Shadow DOM can be created in <code>open</code> or <code>closed</code> mode. In <code>open</code> mode, JavaScript outside the shadow can still access the shadow root via <code>element.shadowRoot</code>. In <code>closed</code> mode, <code>element.shadowRoot</code> returns <code>null</code>, making internals truly inaccessible from outside. Angular's <code>ViewEncapsulation.ShadowDom</code> uses <code>open</code> mode.</p>
        <h3>Styling Shadow DOM from outside</h3>
        <p>Because styles can't cross the shadow boundary, the standard style hook is <strong>CSS custom properties</strong> — they do cross the boundary. A component declares variables like <code>--button-background</code> that the host page can set. The <code>::part()</code> pseudo-element is another mechanism that lets authors explicitly expose named parts of their shadow DOM for external styling.</p>
        <h3>Relation to Angular</h3>
        <p>Angular uses Shadow DOM only when you opt in with <code>ViewEncapsulation.ShadowDom</code>. The default <code>Emulated</code> mode gives you scoped styles without native Shadow DOM, which is why Angular styles work in every browser without a polyfill. Understanding Shadow DOM also explains why styles sometimes don't apply to Angular Material components from outside — they use their own encapsulation.</p>
      `,
      "code": "// ---- Shadow DOM is a browser-level feature ----\n// Angular accesses it through ViewEncapsulation.ShadowDom\n\n// Plain JavaScript example to understand the concept:\nconst host = document.querySelector('#my-widget');\nconst shadowRoot = host.attachShadow({ mode: 'open' });\nshadowRoot.innerHTML = `\n  <style>\n    p { color: crimson; }   /* Only affects elements inside the shadow root */\n  </style>\n  <p>I am inside Shadow DOM</p>\n`;\n// The <p> outside the shadow root is NOT crimson.\n\n// ---- Exposing style hooks with CSS custom properties ----\n@Component({\n  selector: 'app-themed-button',\n  encapsulation: ViewEncapsulation.ShadowDom,\n  template: '<button class=\"btn\"><ng-content></ng-content></button>',\n  styles: [`\n    .btn {\n      background: var(--btn-bg, #6366f1);   /* fallback if not set */\n      color: var(--btn-color, white);\n      padding: 8px 16px;\n      border: none;\n      border-radius: 6px;\n    }\n  `]\n})\nexport class ThemedButtonComponent {}\n\n// Host page can customize without penetrating the shadow root:\n// app-themed-button {\n//   --btn-bg: #dc2626;\n//   --btn-color: #fff;\n// }",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Shadow Boundary — What Crosses, What Doesn't</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-rose-50 border-2 border-rose-200 rounded-xl p-3 text-center"><p class="font-bold text-rose-700 mb-2">Blocked by the boundary</p><p class="text-slate-500">CSS class rules, element selectors, global stylesheets</p></div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center"><p class="font-bold text-emerald-700 mb-2">Crosses the boundary</p><p class="text-slate-500">CSS custom properties (variables), ::part() styling</p></div></div></div>`
    },
    {
      "id": "content-projection",
      "title": "What is Content Projection (ng-content)?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A picture frame you buy at a store. The frame (the component) doesn't know or care what photo you put in it — it just provides a designated opening (<code>&lt;ng-content&gt;</code>) sized and styled to hold whatever you slide in. A frame with a mat that has separate openings for a main photo and a caption is the multi-slot version — each opening only accepts what belongs there.</p>
          </div>
        </div>
        <p><strong>Content projection</strong> is the mechanism by which a component accepts and renders HTML provided by its consumer. You mark the insertion point inside the component's template with <code>&lt;ng-content&gt;</code>, and whatever the parent places between the component's opening and closing tags gets rendered there — Angular's equivalent of the native <code>&lt;slot&gt;</code> element.</p>
        <p>Without content projection, a component can only render its own hard-coded HTML. With it, a <code>CardComponent</code> can render any content the parent provides — a product description, a user profile, a form — without knowing what that content is, which is what makes the component genuinely reusable.</p>
        <h3>Multi-slot projection with select</h3>
        <p>A component can have multiple <code>&lt;ng-content&gt;</code> slots, each with a <code>select</code> attribute that acts like a CSS selector. The parent's content distributes to the matching slot. This is how layout components like a modal (header slot, body slot, footer slot) or a data table (toolbar slot, row-action slot) work.</p>
        <h3>ngProjectAs</h3>
        <p>When a wrapper element doesn't match the expected selector, <code>ngProjectAs</code> lets you project it into a slot it wouldn't normally match — useful when you need an intermediate wrapper for structural reasons but still want the content to land in a specific slot.</p>
      `,
      "code": "// ---- Multi-slot content projection ----\n@Component({\n  selector: 'app-modal',\n  template: `\n    <div class=\"modal-overlay\">\n      <div class=\"modal\">\n        <header class=\"modal-header\">\n          <!-- receives elements with [modal-header] attribute -->\n          <ng-content select=\"[modal-header]\"></ng-content>\n        </header>\n        <main class=\"modal-body\">\n          <!-- receives all other projected content -->\n          <ng-content></ng-content>\n        </main>\n        <footer class=\"modal-footer\">\n          <!-- receives elements with [modal-footer] attribute -->\n          <ng-content select=\"[modal-footer]\"></ng-content>\n        </footer>\n      </div>\n    </div>\n  `\n})\nexport class ModalComponent {}\n\n// ---- Consumer: distributes content to specific slots ----\n@Component({\n  selector: 'app-confirm-dialog',\n  imports: [ModalComponent],\n  template: `\n    <app-modal>\n      <!-- Goes into [modal-header] slot -->\n      <h2 modal-header>Confirm Delete</h2>\n\n      <!-- Goes into the default (catch-all) slot -->\n      <p>Are you sure you want to delete this item? This cannot be undone.</p>\n\n      <!-- Goes into [modal-footer] slot -->\n      <div modal-footer>\n        <button (click)=\"cancel()\">Cancel</button>\n        <button (click)=\"confirm()\" class=\"btn-danger\">Delete</button>\n      </div>\n    </app-modal>\n  `\n})\nexport class ConfirmDialogComponent {\n  cancel() { /* close */ }\n  confirm() { /* delete and close */ }\n}",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Modal — Three Projected Slots</p><div class="border-2 border-dashed border-slate-300 rounded-xl overflow-hidden max-w-xs mx-auto text-xs"><div class="bg-indigo-50 border-b border-slate-200 px-3 py-2 text-center font-semibold text-indigo-700">[modal-header] &rarr; "Confirm Delete"</div><div class="bg-white px-3 py-3 text-center text-slate-500">default slot &rarr; body paragraph</div><div class="bg-amber-50 border-t border-slate-200 px-3 py-2 text-center font-semibold text-amber-700">[modal-footer] &rarr; Cancel / Delete buttons</div></div></div>`
    },
    {
      "id": "dynamic-components",
      "title": "What are dynamic components?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A food truck versus a fixed restaurant menu. A static template is a printed menu — every dish is decided in advance. Dynamic components are a food truck that shows up wherever and whenever it's needed, serves one specific thing (a toast notification), then drives away and is gone — without the main restaurant ever having to print a new menu line for it.</p>
          </div>
        </div>
        <p><strong>Dynamic components</strong> are components not declared in any template. They're created programmatically at runtime using <code>ViewContainerRef.createComponent()</code>. The decision of which component to render — and when — comes from code logic rather than the static template.</p>
        <p>The classic use case is a <strong>toast notification system</strong> or a <strong>modal service</strong>. When the user triggers an action, a service creates a notification component and appends it to a container in the DOM, then removes it after a delay. Writing this as static conditionally-shown elements in the main template couples the template to every possible notification type; dynamic creation keeps the main template clean and lets you add new notification types without touching any template.</p>
        <h3>ViewContainerRef</h3>
        <p><code>ViewContainerRef</code> is Angular's handle on a location in the view tree where you can insert and remove views. Every component and directive has access to its own; you can also grab a reference to a specific template location via a template reference variable on <code>&lt;ng-container&gt;</code> or <code>&lt;ng-template&gt;</code>.</p>
        <h3>Passing data to dynamic components</h3>
        <p><code>createComponent()</code> returns a <code>ComponentRef</code>. You can set input properties directly on <code>componentRef.instance</code> and call <code>componentRef.changeDetectorRef.detectChanges()</code> to trigger rendering with the new values.</p>
      `,
      "code": "import { Component, ViewContainerRef, inject, ComponentRef } from '@angular/core';\n\n// ---- Toast component to render dynamically ----\n@Component({\n  selector: 'app-toast',\n  template: `\n    <div class=\"toast\" [class]=\"'toast-' + type\">\n      {{ message }}\n    </div>\n  `\n})\nexport class ToastComponent {\n  message = '';\n  type: 'success' | 'error' | 'info' = 'info';\n}\n\n// ---- Toast service: creates and destroys toast components ----\nimport { Injectable, ApplicationRef } from '@angular/core';\n\n@Injectable({ providedIn: 'root' })\nexport class ToastService {\n  private appRef = inject(ApplicationRef);\n\n  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration = 3000): void {\n    const rootVcr = this.appRef.components[0].injector.get(ViewContainerRef);\n\n    // Dynamically create the toast\n    const ref: ComponentRef<ToastComponent> = rootVcr.createComponent(ToastComponent);\n    ref.instance.message = message;\n    ref.instance.type = type;\n    ref.changeDetectorRef.detectChanges();\n\n    // Auto-remove after duration\n    setTimeout(() => {\n      ref.destroy();\n    }, duration);\n  }\n}\n\n// ---- Any component can use the service ----\n@Component({\n  selector: 'app-save-button',\n  template: '<button (click)=\"save()\">Save</button>'\n})\nexport class SaveButtonComponent {\n  private toast = inject(ToastService);\n\n  save(): void {\n    // ... save logic ...\n    this.toast.show('Saved successfully!', 'success');\n  }\n}",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Dynamic Component Lifecycle</p><div class="flex flex-wrap items-center justify-center gap-2 text-xs"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700">createComponent()</div><span class="text-slate-300">&rarr;</span><div class="bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700">set instance inputs</div><span class="text-slate-300">&rarr;</span><div class="bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700">detectChanges()</div><span class="text-slate-300">&rarr;</span><div class="bg-rose-50 border-2 border-rose-200 rounded-lg px-3 py-2 text-center font-semibold text-rose-700">destroy() later</div></div></div>`
    },
    {
      "id": "renderer2",
      "title": "What is Renderer2?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Calling the front desk to have something delivered to your hotel room instead of climbing in through the window yourself. The front desk (Renderer2) knows how to reach the room no matter which building you're in — a normal hotel, a cruise ship cabin (SSR), a submarine (Web Worker) — while climbing through the window (<code>nativeElement</code> directly) only works if you happen to be at a building that has a window at all.</p>
          </div>
        </div>
        <p><strong>Renderer2</strong> is an Angular service that provides a safe, platform-agnostic API for manipulating the DOM. Instead of calling <code>element.style.color = 'red'</code> or <code>element.classList.add('active')</code> directly on a native DOM element, you call <code>renderer.setStyle(element, 'color', 'red')</code> or <code>renderer.addClass(element, 'active')</code> through the Renderer2 abstraction.</p>
        <h3>Why not just use nativeElement directly?</h3>
        <p>Direct DOM manipulation via <code>ElementRef.nativeElement</code> works fine in the browser, but Angular is designed to run in environments where there's no browser DOM at all — SSR runs in Node.js, and Web Workers and native mobile platforms have no <code>window</code> or <code>document</code> either. Renderer2 abstracts the rendering layer so Angular can swap in a different implementation per platform. Code using Renderer2 works everywhere; code that touches <code>nativeElement</code> directly breaks under SSR.</p>
        <h3>Security</h3>
        <p>Renderer2 also provides a layer of security — Angular's <code>DomSanitizer</code> and security policies are integrated with the Renderer. Setting <code>nativeElement.innerHTML</code> directly bypasses those protections entirely. Renderer2 methods route the change through Angular's security pipeline instead.</p>
        <h3>Common Renderer2 methods</h3>
        <p><code>createElement</code>, <code>createText</code>, <code>appendChild</code>, <code>removeChild</code>, <code>setAttribute</code>, <code>removeAttribute</code>, <code>addClass</code>, <code>removeClass</code>, <code>setStyle</code>, <code>removeStyle</code>, <code>setProperty</code>, <code>listen</code>.</p>
      `,
      "code": "import { Directive, ElementRef, Renderer2, HostListener, input, inject } from '@angular/core';\n\n// Directive that uses Renderer2 — SSR-safe DOM manipulation\n@Directive({\n  selector: '[appRipple]'\n})\nexport class RippleDirective {\n  appRipple = input('#ffffff33'); // ripple color\n\n  private el = inject(ElementRef);\n  private renderer = inject(Renderer2);\n\n  @HostListener('click', ['$event'])\n  onClick(event: MouseEvent): void {\n    const host = this.el.nativeElement;\n\n    // Create ripple element using Renderer2 (works in SSR too)\n    const ripple = this.renderer.createElement('span');\n    this.renderer.addClass(ripple, 'ripple');\n    this.renderer.setStyle(ripple, 'background', this.appRipple());\n\n    // Position the ripple at the click location\n    const rect = host.getBoundingClientRect();\n    const size = Math.max(rect.width, rect.height);\n    this.renderer.setStyle(ripple, 'width', size + 'px');\n    this.renderer.setStyle(ripple, 'height', size + 'px');\n    this.renderer.setStyle(ripple, 'left', (event.clientX - rect.left - size / 2) + 'px');\n    this.renderer.setStyle(ripple, 'top', (event.clientY - rect.top - size / 2) + 'px');\n\n    this.renderer.appendChild(host, ripple);\n\n    // Remove after animation completes\n    setTimeout(() => this.renderer.removeChild(host, ripple), 600);\n  }\n}\n\n// Usage: <button appRipple appRipple=\"#00000022\">Click me</button>",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">nativeElement vs Renderer2 Across Platforms</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-rose-50 border-2 border-rose-200 rounded-xl p-3 text-center"><p class="font-bold text-rose-700 mb-2">nativeElement direct</p><p class="text-slate-500">Browser: works. SSR / Worker: throws (no window/document)</p></div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center"><p class="font-bold text-emerald-700 mb-2">Renderer2</p><p class="text-slate-500">Browser, SSR, Worker: all safe — abstraction swaps per platform</p></div></div></div>`
    },
    {
      "id": "hostlistener-hostbinding",
      "title": "What is @HostListener and @HostBinding?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A smart doorbell you can attach to any existing front door without rewiring the house. <code>@HostListener</code> is the sensor that notices when someone rings or knocks (an event on the host element); <code>@HostBinding</code> is the porch light that turns on automatically based on the doorbell's internal state (a class property) — both bolt onto whatever door (host element) the directive happens to be attached to.</p>
          </div>
        </div>
        <p><code>@HostListener</code> and <code>@HostBinding</code> are decorators used inside directives and components to interact with the <strong>host element</strong> — the DOM element the directive or component is applied to.</p>
        <h3>@HostListener — listen to host element events</h3>
        <p><code>@HostListener('eventName')</code> decorates a method and subscribes it to the specified event on the host element. Angular manages the subscription and automatically removes the listener when the directive is destroyed, preventing memory leaks. You can listen to any DOM event — <code>click</code>, <code>mouseenter</code>, <code>keydown</code>, <code>focus</code> — and to <code>window</code> or <code>document</code> events by prefixing the event name: <code>@HostListener('window:scroll')</code>.</p>
        <h3>@HostBinding — bind to host element properties</h3>
        <p><code>@HostBinding('property')</code> binds a class property to a property of the host element. When the class property changes, Angular updates the host element — you can bind to <code>class.active</code>, <code>style.backgroundColor</code>, <code>attr.disabled</code>, <code>tabIndex</code>, and more. This is cleaner than manipulating the element via Renderer2 when the binding is reactive and driven by component state.</p>
        <h3>When to use each</h3>
        <p>Use <code>@HostBinding</code> when a DOM property is driven by a class property that changes reactively. Use <code>@HostListener</code> to react to user interaction on the host element. Together they're the standard way to build attribute directives that are self-contained and don't require the consumer to write extra event bindings.</p>
      `,
      "code": "import { Directive, HostBinding, HostListener, input } from '@angular/core';\n\n// An interactive card directive that manages its own hover and focus state\n@Directive({\n  selector: '[appInteractiveCard]'\n})\nexport class InteractiveCardDirective {\n  disableInteraction = input(false);\n\n  // Bind the 'active' CSS class to the host element\n  @HostBinding('class.card-hovered') isHovered = false;\n\n  // Bind the 'focused' CSS class\n  @HostBinding('class.card-focused') isFocused = false;\n\n  // Bind inline style for elevation effect\n  @HostBinding('style.boxShadow')\n  get shadow(): string {\n    if (this.isHovered) return '0 8px 24px rgba(0,0,0,0.15)';\n    if (this.isFocused) return '0 0 0 3px #6366f1';\n    return '0 1px 3px rgba(0,0,0,0.1)';\n  }\n\n  // Bind tabIndex so the card is keyboard-accessible\n  @HostBinding('attr.tabindex') tabIndex = 0;\n\n  @HostListener('mouseenter')\n  onMouseEnter(): void {\n    if (!this.disableInteraction()) this.isHovered = true;\n  }\n\n  @HostListener('mouseleave')\n  onMouseLeave(): void {\n    this.isHovered = false;\n  }\n\n  @HostListener('focus')\n  onFocus(): void { this.isFocused = true; }\n\n  @HostListener('blur')\n  onBlur(): void { this.isFocused = false; }\n\n  // Listen to keyboard 'Enter' on the host element\n  @HostListener('keydown.enter', ['$event'])\n  onEnter(event: KeyboardEvent): void {\n    (event.target as HTMLElement).click();\n  }\n}\n\n// Usage: <div appInteractiveCard (click)=\"selectCard()\">...</div>",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Two Directions on the Host Element</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center"><p class="font-bold text-indigo-700 mb-2">@HostListener</p><p class="text-slate-500">host element &rarr; directive class (events in)</p></div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center"><p class="font-bold text-emerald-700 mb-2">@HostBinding</p><p class="text-slate-500">directive class &rarr; host element (properties out)</p></div></div></div>`
    },
    {
      "id": "template-reference-variables",
      "title": "What are template reference variables?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Sticking a name tag on someone at a party so you can point them out to a friend later without walking over and asking who they are again. <code>#searchInput</code> tags that specific input box; anywhere else in the same template you can just say "that one" (<code>searchInput.value</code>) instead of re-querying the DOM for it.</p>
          </div>
        </div>
        <p>A <strong>template reference variable</strong> is a local variable declared in a template with the <code>#name</code> syntax. It holds a reference to an element, component, or directive in that template, usable elsewhere in the same template — to read an input's value, call a component method, or pass the element to an event handler.</p>
        <p>What the variable holds depends on what it's declared on. On a plain HTML element (<code>&lt;input #email&gt;</code>), it holds the <code>HTMLElement</code>. On a component (<code>&lt;app-form #form&gt;</code>), it holds the component instance. On a directive (<code>&lt;input #ctrl="ngModel"&gt;</code>), it holds the directive instance — the right-hand side of <code>=</code> specifies which directive to export.</p>
        <h3>Reading input values without two-way binding</h3>
        <p>A very common pattern: reading an input's value only on submit or button click, without setting up full reactive forms. Declare <code>#searchInput</code> on the <code>&lt;input&gt;</code>, then pass <code>searchInput.value</code> to the click handler — the component class receives a plain string, no form infrastructure needed.</p>
        <h3>Accessing directives via exportAs</h3>
        <p>Angular directives can declare an <code>exportAs</code> name in their metadata. Template reference variables can then be assigned to that directive instance — this is how you access <code>NgForm</code> (<code>#f="ngForm"</code>) or <code>NgModel</code> (<code>#ctrl="ngModel"</code>) in template-driven forms, getting the form/model object rather than the raw <code>HTMLElement</code>.</p>
      `,
      "code": "@Component({\n  selector: 'app-search',\n  imports: [FormsModule],\n  template: `\n    <!-- #searchInput holds the HTMLInputElement -->\n    <input\n      #searchInput\n      type=\"text\"\n      placeholder=\"Search products...\"\n      (keydown.enter)=\"search(searchInput.value)\"\n    />\n    <button (click)=\"search(searchInput.value)\">Go</button>\n    <button (click)=\"searchInput.value = ''; results = []\">Clear</button>\n\n    <!-- #f holds the NgForm directive instance (not the HTMLFormElement) -->\n    <form #f=\"ngForm\" (ngSubmit)=\"submitForm(f)\">\n      <input name=\"username\" ngModel required minlength=\"3\" />\n      <!-- f.valid reads the form's validity from the NgForm directive -->\n      <button [disabled]=\"f.invalid\">Submit</button>\n      <!-- Show error message using the input's ngModel state -->\n      @if (f.submitted && f.controls['username']?.invalid) {\n        <p>Username is required (min 3 chars)</p>\n      }\n    </form>\n\n    <!-- #dataTable holds the ChildComponent instance -->\n    <app-data-table #dataTable></app-data-table>\n    <button (click)=\"dataTable.refresh()\">Refresh Table</button>\n  `\n})\nexport class SearchComponent {\n  results: string[] = [];\n\n  search(query: string): void {\n    if (query.trim()) {\n      // ... fetch results\n      console.log('Searching for:', query);\n    }\n  }\n\n  submitForm(form: NgForm): void {\n    if (form.valid) console.log(form.value);\n  }\n}",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">What #name Resolves To</p><div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs"><div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center"><p class="font-bold text-indigo-700 font-mono">&lt;input #x&gt;</p><p class="text-slate-500 mt-1">HTMLElement</p></div><div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center"><p class="font-bold text-emerald-700 font-mono">&lt;app-form #x&gt;</p><p class="text-slate-500 mt-1">component instance</p></div><div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center"><p class="font-bold text-amber-700 font-mono">#x="ngModel"</p><p class="text-slate-500 mt-1">directive instance</p></div></div></div>`
    },
    {
      "id": "ngtemplateoutlet",
      "title": "What is ngTemplateOutlet?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A slide projector versus a fixed poster. A poster (hard-coded template) always shows the same image. A slide projector (<code>ngTemplateOutlet</code>) is a fixed piece of equipment that projects whatever slide (template) you hand it, with the room number and audience name (the context object) filled in on the slide itself for that particular showing.</p>
          </div>
        </div>
        <p><code>ngTemplateOutlet</code> is a structural directive that <strong>renders an <code>&lt;ng-template&gt;</code> at a specified location</strong> in the view, optionally passing a context object so the template can receive data as local variables. It's the primary tool for building highly reusable, consumer-customizable components.</p>
        <p>Think of it as a "render this template here" instruction. The template is defined with <code>&lt;ng-template #myTpl let-item&gt;</code>, and rendered wherever <code>*ngTemplateOutlet="myTpl; context: { $implicit: someData }"</code> appears. The <code>let-item</code> creates a local variable <code>item</code> that receives the <code>$implicit</code> value from the context.</p>
        <h3>The power: consumer-provided templates</h3>
        <p>The real use case is letting the <em>consumer</em> of a component decide how certain parts render. A <code>DataTableComponent</code> can accept a <code>rowTemplate: TemplateRef&lt;any&gt;</code> input. The consumer passes a custom template, and the table renders it for each row — the table handles sorting, pagination, and layout; the consumer provides the cell content. This is how Angular Material's table works with its <code>*matCellDef</code> approach.</p>
        <h3>ngTemplateOutlet vs ngComponentOutlet</h3>
        <p><code>ngTemplateOutlet</code> renders a template defined in the same (or a parent) component. <code>ngComponentOutlet</code> renders a component class dynamically. Use templates when the customization is structural (custom HTML), and dynamic components when you need a fully independent component with its own lifecycle.</p>
      `,
      "code": "@Component({\n  selector: 'app-list',\n  imports: [NgTemplateOutlet],\n  template: `\n    <!-- The list manages structure; the consumer provides item content -->\n    <ul class=\"list\">\n      @for (item of items(); track item) {\n        <li>\n          <!-- Render the consumer's template, passing item as $implicit -->\n          <ng-container\n            *ngTemplateOutlet=\"itemTemplate() || defaultTemplate; context: { $implicit: item }\"\n          ></ng-container>\n        </li>\n      }\n    </ul>\n\n    <!-- Fallback template if consumer provides none -->\n    <ng-template #defaultTemplate let-item>\n      <span>{{ item }}</span>\n    </ng-template>\n  `\n})\nexport class ListComponent<T> {\n  items = input<T[]>([]);\n  itemTemplate = input<TemplateRef<{ $implicit: T }>>();\n}\n\n// ---- Consumer provides a custom template ----\n@Component({\n  selector: 'app-product-page',\n  imports: [ListComponent],\n  template: `\n    <app-list [items]=\"products\" [itemTemplate]=\"productTpl\"></app-list>\n\n    <!-- Consumer's custom template — rendered by the list for each item -->\n    <ng-template #productTpl let-product>\n      <div class=\"product-row\">\n        <img [src]=\"product.image\" />\n        <strong>{{ product.name }}</strong>\n        <span>{{ product.price }}</span>\n        <button (click)=\"addToCart(product)\">Add</button>\n      </div>\n    </ng-template>\n  `\n})\nexport class ProductPageComponent {\n  products = [\n    { name: 'Laptop', price: 999, image: '/laptop.jpg' },\n    { name: 'Mouse', price: 29, image: '/mouse.jpg' }\n  ];\n  addToCart(p: any) { /* ... */ }\n}",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Consumer Template Rendered by a Generic List</p><div class="flex flex-col items-center gap-2 text-xs max-w-sm mx-auto"><div class="bg-indigo-50 border border-indigo-200 rounded px-3 py-1.5 w-full text-center">ListComponent (owns structure)</div><div class="text-slate-300">&darr; itemTemplate input</div><div class="bg-emerald-50 border border-emerald-200 rounded px-3 py-1.5 w-full text-center">#productTpl (consumer's markup)</div><div class="text-slate-300">&darr; rendered per item via ngTemplateOutlet</div><div class="bg-slate-800 text-white rounded px-3 py-1.5 w-full text-center">Final rendered row</div></div></div>`
    }
  ]
});
