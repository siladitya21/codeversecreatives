window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "micro-frontends",
  "title": "Micro Frontends",
  "icon": "bi bi-puzzle",
  "questions": [
    {
      "id": "what-are-micro-frontends",
      "title": "What are micro frontends and when do you need them?",
      "explanation": `
          <p>A <strong>micro frontend</strong> is an architectural pattern where a large web application is split into independently developed, deployed, and owned UI slices — each managed by a separate team. It is the frontend equivalent of microservices: instead of one massive Angular monolith that every team must coordinate on, each team owns a vertical slice of the UI from feature through to deployment.</p>

          <p>The compelling reason to adopt micro frontends is organizational, not technical. If you have ten frontend engineers all working in the same Angular repository, every deployment requires everyone to coordinate, merge conflicts are frequent, a bug in one feature blocks everyone's release, and onboarding new team members to the full codebase is daunting. Micro frontends give each team a smaller, faster-moving codebase where they can deploy independently without waiting for other teams.</p>

          <h3>When You Do NOT Need Micro Frontends</h3>
          <p>If your team is small (fewer than ~8 frontend developers), micro frontends will add complexity without the organizational payoff. The runtime overhead, tooling complexity, inter-app communication protocol, and shared dependency management are real costs. For small teams, an Angular monorepo with clear module boundaries gives most of the code organization benefits at a fraction of the architectural cost.</p>

          <h3>Common Approaches</h3>
          <p><strong>Webpack 5 Module Federation</strong> is the dominant technical approach for Angular micro frontends — it enables runtime code sharing between separately built applications. <strong>Single-spa</strong> is an older framework that orchestrates multiple SPA lifecycles on one page. <strong>Web Components / Angular Elements</strong> allow framework-agnostic composition where each team can use a different technology stack.</p>
        `,
      "code": "// Micro frontend landscape for a large e-commerce platform:\n//\n//  ┌────────────────────────── Shell App ─────────────────────────────┐\n//  │  Navigation, Auth, Global State, Layout                           │\n//  │                                                                   │\n//  │  ┌─── Catalog MFE ───┐  ┌─── Cart MFE ───┐  ┌── Checkout MFE ──┐│\n//  │  │  Team A           │  │  Team B         │  │  Team C           ││\n//  │  │  Angular 17       │  │  Angular 17     │  │  Angular 18       ││\n//  │  │  Deployed daily   │  │  Deployed daily │  │  Deployed weekly  ││\n//  │  └───────────────────┘  └─────────────────┘  └───────────────────┘│\n//  └───────────────────────────────────────────────────────────────────┘\n//\n// Each MFE:\n// - Has its own repository and CI/CD pipeline\n// - Can be tested and deployed without touching other MFEs\n// - Shares @angular/core via Module Federation to avoid duplication\n// - Communicates via custom events or a shared state service in the shell",
      "language": "typescript"
    },
    {
      "id": "module-federation",
      "title": "Webpack 5 Module Federation — host and remote setup",
      "explanation": `
          <p><strong>Webpack 5 Module Federation</strong> is the technology that makes Angular micro frontends practical. It introduces the concept of <strong>remotes</strong> and <strong>hosts</strong>: a remote application exposes JavaScript modules via a special <code>remoteEntry.js</code> file that is downloaded at runtime. A host application references remotes by name and can dynamically load their modules using Angular's router's <code>loadChildren</code> or <code>loadComponent</code>, as if the code were local.</p>

          <p>The critical feature that makes this efficient is <strong>shared dependencies</strong>. Without module federation, if both the shell and two micro frontends each bundle their own copy of <code>@angular/core</code>, the user downloads the Angular framework three times. Module Federation's <code>shared</code> configuration lets the host negotiate with each remote at runtime: if a compatible version of a dependency is already loaded, remotes reuse it instead of loading their own copy.</p>

          <h3>@angular-architects/module-federation</h3>
          <p>Writing Webpack Module Federation configuration manually for Angular is verbose and error-prone. The <code>@angular-architects/module-federation</code> package provides an Angular CLI schematic that generates the correct Webpack config, TypeScript declarations, and bootstrap wrappers. It is the standard community tool for Angular MFEs.</p>
        `,
      "code": "# ---- Setup with @angular-architects/module-federation ----\n# In the remote app (e.g., catalog-mfe):\nng add @angular-architects/module-federation --project catalog-mfe --port 4201 --type remote\n\n# In the host/shell app:\nng add @angular-architects/module-federation --project shell --port 4200 --type host\n\n// ---- webpack.config.js (Remote — catalog-mfe) ----\nconst { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');\n\nmodule.exports = withModuleFederationPlugin({\n  name: 'catalogMfe',\n\n  // Expose the lazy routes of this micro frontend\n  exposes: {\n    './Routes': './src/app/catalog/catalog.routes.ts',\n  },\n\n  // Share Angular and RxJS so they are not bundled twice\n  shared: {\n    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),\n  },\n});\n\n// ---- webpack.config.js (Host — shell) ----\nconst { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');\n\nmodule.exports = withModuleFederationPlugin({\n  remotes: {\n    // Map remote name to its entry point URL\n    // In production, these URLs come from environment config\n    catalogMfe: 'catalogMfe@http://localhost:4201/remoteEntry.js',\n    cartMfe:    'cartMfe@http://localhost:4202/remoteEntry.js',\n  },\n  shared: {\n    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),\n  },\n});\n\n// ---- shell/app.routes.ts — lazy load the remote ----\nimport { Routes } from '@angular/router';\nimport { loadRemoteModule } from '@angular-architects/module-federation';\n\nexport const routes: Routes = [\n  {\n    path: 'catalog',\n    // loadRemoteModule fetches remoteEntry.js and then imports the exposed routes\n    loadChildren: () => loadRemoteModule({\n      type: 'module',\n      remoteEntry: 'http://localhost:4201/remoteEntry.js',\n      exposedModule: './Routes'\n    }).then(m => m.CATALOG_ROUTES)\n  }\n];",
      "language": "javascript"
    },
    {
      "id": "cross-mfe-communication",
      "title": "Communication between micro frontends",
      "explanation": `
          <p>The hardest problem in micro frontend architecture is not the build tooling — it is deciding how independent applications share state and communicate events without creating tight coupling. If two micro frontends directly import from each other, you have recreated the monolith in disguise. The rule is: micro frontends should only communicate through contracts defined in the shell, not through direct module imports.</p>

          <h3>Custom DOM Events (Framework-agnostic)</h3>
          <p>Custom DOM events are the most decoupled approach. A micro frontend dispatches a <code>CustomEvent</code> on the <code>document</code> or a known DOM element. Any other micro frontend — regardless of framework — can listen for it with <code>addEventListener</code>. This is fully framework-agnostic and requires zero shared code. The downside is that complex payloads are serialized through the DOM event's <code>detail</code> property, and there is no type safety unless you add conventions around the event name and shape.</p>

          <h3>Shared Service in the Shell (Angular-to-Angular)</h3>
          <p>When all micro frontends are Angular and use Module Federation's shared dependencies, services provided in the shell app are available to all remotes that share <code>@angular/core</code> as a singleton. A <code>GlobalStateService</code> with a <code>BehaviorSubject</code> works across apps as if they were one. This is convenient but creates coupling to the shell's DI tree — use it for genuinely global state (current user, auth tokens, theme) rather than feature-specific state.</p>

          <h3>Shared State Library</h3>
          <p>The cleanest approach is a versioned npm package (internal or public) that defines the state contract: TypeScript interfaces, event name constants, and the shared store. All micro frontends depend on this package, and the package is shared via Module Federation. Changes to the contract require a package version bump, making breaking changes explicit.</p>
        `,
      "code": "// ---- Approach 1: Custom DOM Events (framework-agnostic) ----\n\n// In catalog-mfe: user adds item to cart\nexport function dispatchCartAdd(product: { id: number; name: string; price: number }) {\n  document.dispatchEvent(new CustomEvent('mfe:cart:add', {\n    detail: product,\n    bubbles: true\n  }));\n}\n\n// In cart-mfe (or the shell): listen for the event\ndocument.addEventListener('mfe:cart:add', (event: Event) => {\n  const product = (event as CustomEvent).detail;\n  cartService.addItem(product);\n});\n\n// ---- Approach 2: Shared service in the shell ----\n// shared-state.service.ts (in shell, shared via MF singleton)\nimport { Injectable, signal, computed } from '@angular/core';\n\nexport interface AuthUser { id: number; name: string; role: 'admin' | 'customer'; }\n\n@Injectable({ providedIn: 'root' })\nexport class ShellStateService {\n  private _user = signal<AuthUser | null>(null);\n\n  // Public read-only surface — micro frontends can read but not replace the signal\n  readonly user = this._user.asReadonly();\n  readonly isAdmin = computed(() => this._user()?.role === 'admin');\n\n  setUser(user: AuthUser | null): void {\n    this._user.set(user);\n  }\n}\n\n// In any remote MFE — works because @angular/core is a shared singleton:\nimport { Component, inject } from '@angular/core';\nimport { ShellStateService } from 'shell/StateService';  // imported via MF\n\n@Component({ template: `Hello, {{ state.user()?.name }}` })\nexport class CatalogHeaderComponent {\n  state = inject(ShellStateService);\n}",
      "language": "typescript"
    },
    {
      "id": "shared-dependencies",
      "title": "Managing shared dependencies — versioning and compatibility",
      "explanation": `
          <p>Shared dependencies are the most technically treacherous part of module federation. When a remote and the host declare <code>@angular/core</code> as a shared singleton, Webpack's module federation runtime negotiates which version to use at load time. If the versions are compatible (same major, different minor), the higher minor version wins and is used by all. If they are incompatible, the behavior depends on your <code>strictVersion</code> setting.</p>

          <h3>strictVersion: true vs false</h3>
          <p>With <code>strictVersion: true</code>, if the version negotiation fails (incompatible required versions), the remote throws an error at runtime and the MFE fails to load. This is safe but brittle — all teams must stay on compatible versions. With <code>strictVersion: false</code>, each app falls back to loading its own copy of the dependency if negotiation fails. This means two copies of Angular could be running on the same page, which causes subtle bugs (two change detection cycles, two injector trees). Only allow this for truly non-singleton libraries.</p>

          <h3>Version Alignment Strategy</h3>
          <p>The practical solution is to standardize on a shared <code>package.json</code> maintained in a separate versions repository or wiki. All micro frontend teams update their Angular version together during coordinated upgrade sprints. Use <code>requiredVersion: 'auto'</code> in the <code>shareAll</code> helper — it reads the version from your <code>package.json</code> automatically, so you never have version strings in two places.</p>
        `,
      "code": "// webpack.config.js — recommended shared dependency configuration\nconst { shareAll, share, withModuleFederationPlugin } =\n  require('@angular-architects/module-federation/webpack');\n\nmodule.exports = withModuleFederationPlugin({\n  // ... name/exposes/remotes ...\n\n  shared: {\n    // shareAll shares every dependency in package.json as singleton\n    // requiredVersion: 'auto' reads version from package.json automatically\n    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),\n\n    // Override specific packages for different strategies\n    'rxjs': {\n      singleton: true,\n      strictVersion: false,  // RxJS 7.x is largely compatible across minors\n      requiredVersion: 'auto'\n    },\n\n    // UI component libraries used only by one MFE should NOT be shared\n    // — they will be bundled into that MFE's chunk only\n    // Omitting them from shared means they are never negotiated\n  }\n});\n\n// ---- Version compatibility summary ----\n// Safe to share as singleton:   @angular/core, @angular/common, rxjs\n// Be careful:                   @angular/router (must have same instance)\n// OK to have multiple copies:   date-fns, lodash-es (pure functions, no global state)\n// Never share:                  CSS-in-JS libraries (they inject into the DOM)\n\n// ---- Diagnosing version conflicts at runtime ----\n// In Chrome DevTools console when MFE loads:\n// 'Shared module ... is not available for eager consumption'\n//  -> Add dynamic import wrapper (bootstrap.ts pattern) to the MFE main.ts",
      "language": "javascript"
    },
    {
      "id": "testing-micro-frontends",
      "title": "Testing strategy for micro frontends",
      "explanation": `
          <p>Testing micro frontends requires thinking at multiple levels. Because each MFE is a separate application, the test pyramid looks slightly different from a monolith: you have comprehensive unit and integration tests inside each MFE, lightweight contract tests to verify the inter-MFE communication interface, and a small suite of E2E tests that verify the shell correctly loads and integrates all MFEs together.</p>

          <h3>Unit Tests (Per MFE)</h3>
          <p>Each micro frontend is tested in isolation using Angular's standard testing tools. Components, services, and pipes are tested with <code>TestBed</code> exactly as in a monolith. Dependencies from the shell (shared services) are mocked. The goal is fast, comprehensive coverage without needing to run other MFEs.</p>

          <h3>Contract Tests</h3>
          <p>Contract tests verify that the communication protocol between MFEs is honored. If the catalog MFE emits a <code>mfe:cart:add</code> custom event, a contract test verifies it emits exactly that event with the correct payload shape. If the shell state service provides a <code>user</code> signal, a contract test verifies it has the expected interface. Contract tests catch breaking changes before integration.</p>

          <h3>E2E Tests (Full Integration)</h3>
          <p>E2E tests (Playwright or Cypress) start the shell and all MFEs simultaneously and test full user journeys. These are expensive to run but provide the highest confidence that everything works together. They should cover the critical user flows (login, add to cart, checkout) rather than exhaustive feature coverage — leave that to unit tests in each MFE.</p>
        `,
      "code": "// ---- Unit test inside a micro frontend (catalog-mfe) ----\nimport { ComponentFixture, TestBed } from '@angular/core/testing';\nimport { ProductListComponent } from './product-list.component';\nimport { ShellStateService } from '../shared/shell-state.service';\n\ndescribe('ProductListComponent', () => {\n  let fixture: ComponentFixture<ProductListComponent>;\n\n  beforeEach(async () => {\n    await TestBed.configureTestingModule({\n      imports: [ProductListComponent],\n      providers: [\n        // Mock the shared shell service — no need to load the shell\n        {\n          provide: ShellStateService,\n          useValue: { user: signal({ id: 1, name: 'Test', role: 'customer' }) }\n        }\n      ]\n    }).compileComponents();\n\n    fixture = TestBed.createComponent(ProductListComponent);\n  });\n\n  it('should display products', () => {\n    fixture.detectChanges();\n    expect(fixture.nativeElement.querySelectorAll('.product-card').length).toBeGreaterThan(0);\n  });\n});\n\n// ---- Contract test: verify event shape ----\ndescribe('Cart integration contract', () => {\n  it('should dispatch mfe:cart:add event with correct shape', () => {\n    const events: CustomEvent[] = [];\n    document.addEventListener('mfe:cart:add', (e) => events.push(e as CustomEvent));\n\n    dispatchCartAdd({ id: 1, name: 'Laptop', price: 999 });\n\n    expect(events).toHaveLength(1);\n    expect(events[0].detail).toEqual(\n      jasmine.objectContaining({ id: 1, name: 'Laptop', price: 999 })\n    );\n  });\n});\n\n// ---- E2E test (Playwright): full user journey ----\n// tests/checkout.spec.ts\nimport { test, expect } from '@playwright/test';\n\ntest('user can add product and proceed to checkout', async ({ page }) => {\n  await page.goto('http://localhost:4200');\n  await page.click('[data-testid=\"product-laptop\"] [data-testid=\"add-to-cart\"]');\n  await page.click('[data-testid=\"cart-icon\"]');\n  await expect(page.locator('[data-testid=\"cart-count\"]')).toHaveText('1');\n  await page.click('[data-testid=\"checkout-btn\"]');\n  await expect(page).toHaveURL(/checkout/);\n});",
      "language": "typescript"
    }
  ]
});
