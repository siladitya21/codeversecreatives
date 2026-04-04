window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "micro-frontends",
  "title": "Micro Frontends",
  "icon": "bi bi-puzzle",
  "questions": [
    {
      "id": "what-are-micro-frontends",
      "title": "What are micro frontends?",
      "explanation": `
          <p><strong>Micro Frontends</strong> is an architectural style where independently deliverable frontend applications are composed into a greater whole. It's essentially "Microservices for the Frontend."</p>
          <h3>Key Benefits</h3>
          <ul>
            <li><strong>Independent Deployments:</strong> Teams can deploy their part of the UI without waiting for others.</li>
            <li><strong>Team Autonomy:</strong> Different teams can use different versions of Angular (or even different frameworks).</li>
            <li><strong>Scalability:</strong> Large applications are broken down into smaller, more manageable pieces.</li>
          </ul>
        `,
      "code": "// Micro Frontends logic:\n// 1. App Shell (Container) loads the main UI.\n// 2. Micro Apps (Remote) are loaded dynamically based on the route.",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Micro Frontend Architecture</p><div class="grid grid-cols-3 gap-2"><div class="bg-indigo-600 text-white p-2 rounded text-center text-[10px] font-bold col-span-3 mb-2">Host / Shell Application</div><div class="bg-emerald-50 border border-emerald-200 p-2 rounded text-center text-[10px]">Auth App</div><div class="bg-amber-50 border border-amber-200 p-2 rounded text-center text-[10px]">Cart App</div><div class="bg-rose-50 border border-rose-200 p-2 rounded text-center text-[10px]">Catalog App</div></div></div>`
    },
    {
      "id": "module-federation",
      "title": "Module Federation",
      "explanation": `
          <p><strong>Webpack 5 Module Federation</strong> is the most common technology used to implement Micro Frontends in Angular. It allows a JavaScript application to dynamically load code from another application at runtime.</p>
          <h3>Core Concepts</h3>
          <ul>
            <li><strong>Host:</strong> The main application that "consumes" code from others.</li>
            <li><strong>Remote:</strong> The micro-app that "exposes" code (like a module or component).</li>
            <li><strong>Shared:</strong> Shared libraries (like <code>@angular/core</code>) that are downloaded only once to save bandwidth.</li>
          </ul>
        `,
      "code": "// webpack.config.js (Remote App)\nnew ModuleFederationPlugin({\n  name: 'mfe1',\n  filename: 'remoteEntry.js',\n  exposes: {\n    './Module': './src/app/features/user.module.ts',\n  },\n  shared: ['@angular/core', '@angular/common']\n});",
      "language": "javascript",
      "diagram": `<div class="diagram-wrap"><div class="max-w-md mx-auto bg-slate-800 text-white rounded-lg p-3 text-[10px] font-mono"><p class=\"text-indigo-400\">// Host Route Configuration</p>{\n  path: 'user',\n  loadChildren: () => import('mfe1/Module').then(m => m.UserModule)\n}</div></div>`
    },
    {
      "id": "single-spa-angular",
      "title": "Single-spa with Angular",
      "explanation": `
          <p><strong>single-spa</strong> is a framework for bringing together multiple different frontend frameworks (Angular, React, Vue) into one page. It manages the lifecycles of these applications.</p>\n\n          <p>In an Angular context, you use <code>@single-spa/angular</code> to wrap your app. single-spa then triggers the <strong>bootstrap</strong>, <strong>mount</strong>, and <strong>unmount</strong> lifecycles as the user navigates between apps.</p>\n        `,
      "code": "// main.single-spa.ts\nconst lifecycles = singleSpaAngular({\n  bootstrapFunction: props => platformBrowserDynamic().bootstrapModule(AppModule),\n  template: '<app-root />',\n  Router,\n  NgZone,\n});\n\nexport const { bootstrap, mount, unmount } = lifecycles;",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">single-spa Lifecycle</p><div class="flex items-center justify-center gap-4"><div class="bg-indigo-50 border border-indigo-200 p-2 rounded text-[10px]">Bootstrap</div><div class="text-slate-300">&rarr;</div><div class="bg-emerald-50 border border-emerald-200 p-2 rounded text-[10px]">Mount</div><div class="text-slate-300">&rarr;</div><div class="bg-rose-50 border border-rose-200 p-2 rounded text-[10px]">Unmount</div></div></div>`
    },
    {
      "id": "shared-dependencies",
      "title": "Shared dependencies in micro frontends",
      "explanation": `
          <p>One of the biggest challenges in micro frontends is avoiding duplication of shared libraries. If each micro-app bundles its own copy of Angular, you'll have multiple copies of the framework in memory.</p>\n\n          <h3>Solution: Shared Libraries</h3>\n          <ul>\n            <li><strong>Webpack 5 Module Federation:</strong> Specify shared libraries in the configuration so they're downloaded only once and shared across all micro-apps.</li>\n            <li><strong>Version Management:</strong> Define singleton patterns to ensure only one version of a shared library is used.</li>\n            <li><strong>Common Dependencies:</strong> Typically Angular, RxJS, and application-specific utilities are shared.</li>\n          </ul>\n        `,
      "code": "// webpack.config.js (Host App)\nnew ModuleFederationPlugin({\n  name: 'host',\n  remotes: {\n    mfe1: 'mfe1@http://localhost:4201/remoteEntry.js',\n    mfe2: 'mfe2@http://localhost:4202/remoteEntry.js'\n  },\n  shared: {\n    '@angular/core': { singleton: true, requiredVersion: '^17.0.0' },\n    '@angular/common': { singleton: true, requiredVersion: '^17.0.0' },\n    'rxjs': { singleton: true, requiredVersion: '^7.0.0' }\n  }\n});",
      "language": "javascript",
      "diagram": `<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Shared Dependencies</p><div class=\"flex flex-col items-center gap-3 max-w-md mx-auto\"><div class=\"bg-slate-800 text-white p-2 rounded text-xs text-center\">@angular/core (v17) - Shared Singleton</div><div class=\"text-slate-300 text-xs\">↑ used by ↓</div><div class=\"flex gap-2\"><div class=\"bg-indigo-50 border border-indigo-200 p-2 rounded text-xs\">MFE1</div><div class=\"bg-emerald-50 border border-emerald-200 p-2 rounded text-xs\">MFE2</div><div class=\"bg-amber-50 border border-amber-200 p-2 rounded text-xs\">Host</div></div></div></div>`
    },
    {
      "id": "state-management-across-mfes",
      "title": "State management across micro frontends",
      "explanation": `
          <p>Managing global state across independently deployed micro frontends can be tricky. Common approaches include:</p>\n\n          <ul>\n            <li><strong>Shared Service with Signals/RxJS:</strong> Use a service running in the host app that emits state updates. Micro-apps subscribe and react to changes.</li>\n            <li><strong>Pub/Sub Pattern:</strong> Implement a global event bus that micro-apps communicate through.</li>\n            <li><strong>URL Query Parameters:</strong> Store state in the URL so it's preserved across micro-app transitions.</li>\n            <li><strong>localStorage/sessionStorage:</strong> For non-sensitive state that needs to persist across browser refreshes.</li>\n            <li><strong>Centralized Store (Ngrx, Akita):</strong> If using a shared store library, ensure version alignment across all micro-apps.</li>\n          </ul>\n        `,
      "code": "// Shared Service in Host App\n@Injectable({ providedIn: 'root' })\nexport class GlobalStateService {\n  private stateSubject = new BehaviorSubject<AppState>({\n    user: null,\n    theme: 'light'\n  });\n\n  state$ = this.stateSubject.asObservable();\n\n  updateUser(user: User) {\n    const current = this.stateSubject.value;\n    this.stateSubject.next({ ...current, user });\n  }\n}\n\n// In Micro-Frontend\nconstructor(private globalState: GlobalStateService) {\n  this.globalState.state$.subscribe(state => {\n    console.log('Global state updated:', state);\n  });\n}",
      "language": "typescript",
      "diagram": `<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">State Management Pattern</p><div class=\"flex flex-col items-center gap-2\"><div class=\"bg-indigo-600 text-white p-2 rounded text-xs font-bold\">Host App (Global State)</div><div class=\"text-slate-300 text-xs\">↓ broadcasts ↑ updates</div><div class=\"flex gap-2\"><div class=\"bg-emerald-50 border border-emerald-200 p-2 rounded text-xs\">MFE1 (Subscribe)</div><div class=\"bg-amber-50 border border-amber-200 p-2 rounded text-xs\">MFE2 (Subscribe)</div></div></div></div>`
    },
    {
      "id": "testing-micro-frontends",
      "title": "Testing micro frontends",
      "explanation": `
          <p>Testing micro frontend applications presents unique challenges:</p>\n\n          <ul>\n            <li><strong>Isolated Unit Tests:</strong> Test each micro-app in isolation with mocked dependencies.</li>\n            <li><strong>Integration Tests:</strong> Test that the host correctly loads and initializes micro-apps.</li>\n            <li><strong>E2E Tests:</strong> Use tools like Cypress or Playwright to test the entire system including all micro-apps working together.</li>\n            <li><strong>Network Mocking:</strong> Mock remote entry points to test different scenarios without requiring all services to be running.</li>\n          </ul>\n        `,
      "code": "// E2E test with Cypress\ndescribe('Micro Frontend Integration', () => {\n  it('should load host and all micro-apps', () => {\n    cy.visit('http://localhost:4200');\n    cy.get('app-root').should('be.visible');\n    \n    // Navigate to MFE1\n    cy.get('[routerLink=\"/mfe1\"]').click();\n    cy.get('mfe1-root').should('be.visible');\n    \n    // Navigate to MFE2\n    cy.get('[routerLink=\"/mfe2\"]').click();\n    cy.get('mfe2-root').should('be.visible');\n  });\n\n  it('should handle shared state changes', () => {\n    cy.visit('http://localhost:4200');\n    // Simulate state change in MFE1\n    // Verify MFE2 reflects the update\n  });\n});",
      "language": "typescript",
      "diagram": `<div class=\"diagram-wrap\"><div class=\"max-w-md mx-auto bg-slate-800 text-white rounded-lg p-3 text-[10px] font-mono\"><p class=\"text-indigo-400\">Test Strategy:</p><br/>1. Unit Tests (Isolated)<br/>2. Integration Tests (Host + MFEs)<br/>3. E2E Tests (Full workflow)<br/>4. Stress Tests (Network latency)</div></div>`
    }
  ]
});