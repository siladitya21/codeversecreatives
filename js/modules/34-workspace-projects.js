window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "workspace-projects",
  "title": "Workspace & Projects",
  "icon": "bi bi-folder2-open",
  "questions": [
    {
      id: "angular-22-standard-workspace-upgrade",
      title: "Angular 22 standard for workspaces and projects",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A well-organized workshop. <code>angular.json</code> is the pegboard that says exactly where every tool lives and which tool does which job (build, serve, test). A single-app workspace is a workshop with one bench. A multi-project workspace is the same shop with several benches sharing one toolbox (libraries) instead of each bench buying duplicate hammers.</p>
          </div>
        </div>
        <p>Angular 22-ready workspaces should keep project boundaries clear, build targets predictable, and shared code intentional. Single-app workspaces should stay simple. Multi-project workspaces should use libraries for shared UI, data access, and contracts rather than cross-importing random app internals.</p>
        <h3>Modern workspace checklist</h3>
        <ul>
          <li>Understand <code>angular.json</code> targets: build, serve, test, lint, and extract-i18n.</li>
          <li>Use standalone app structure with <code>app.config.ts</code> and <code>app.routes.ts</code>.</li>
          <li>Create libraries for reusable code with stable public APIs.</li>
          <li>Use path aliases carefully and avoid circular dependencies.</li>
          <li>Keep environment and deployment configuration separate from secrets.</li>
        </ul>
      `,
      code: `// Modern app entry structure:
// src/main.ts
bootstrapApplication(AppComponent, appConfig);

// src/app/app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
};

// src/app/app.routes.ts
export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) }
];`,
      language: "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">The Angular 22 App Entry Chain</p><div class="flex flex-wrap items-center justify-center gap-2 text-xs"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700">main.ts</div><span class="text-slate-300">&rarr;</span><div class="bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700">app.config.ts (providers)</div><span class="text-slate-300">&rarr;</span><div class="bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700">app.routes.ts (lazy routes)</div><span class="text-slate-300">&rarr;</span><div class="bg-purple-50 border-2 border-purple-200 rounded-lg px-3 py-2 text-center font-semibold text-purple-700">AppComponent renders</div></div></div>`
    },
    {
      "id": "angular-workspace-structure",
      "title": "Angular workspace structure and configuration files",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A restaurant's operations manual sitting behind the counter. <code>angular.json</code> is the master binder that lists every station (project), what each station is allowed to cook (build target), and which recipe card to use for the lunch rush versus the dinner service (<code>configurations</code>). Nobody improvises the fire-safety procedure &mdash; they follow what's written, and so does the Angular CLI.</p>
          </div>
        </div>
        <p>An <strong>Angular workspace</strong> is the root directory created by <code>ng new</code>. It contains everything the Angular CLI needs to build, test, and serve your applications: source files, configuration, and workspace-wide tooling settings. Understanding the workspace structure is essential for customizing builds, adding projects, and debugging CLI behavior.</p>
        <h3>angular.json — the workspace brain</h3>
        <p><code>angular.json</code> is the most important file in the workspace. It defines every project (applications and libraries) and tells the CLI how to build, serve, test, lint, and deploy each one. Each project has an <code>architect</code> section with named targets (<code>build</code>, <code>serve</code>, <code>test</code>, <code>lint</code>). Each target has a <code>builder</code> (the npm package that runs the build) and <code>options</code> (configuration passed to the builder). The <code>configurations</code> block provides environment-specific option overrides &mdash; the <code>production</code> configuration activates optimization, minification, and file replacement.</p>
        <h3>tsconfig.json hierarchy</h3>
        <p>Angular workspaces use a tsconfig hierarchy. <code>tsconfig.json</code> at the root defines shared compiler options. <code>tsconfig.app.json</code> (in <code>src/</code>) extends it with app-specific settings (includes the <code>src</code> folder, excludes test files). <code>tsconfig.spec.json</code> extends it with test-specific settings (includes test files). Each project in a multi-project workspace has its own <code>tsconfig.app.json</code> that extends the workspace root.</p>
      `,
      "code": "// ---- Standard single-app workspace layout ----\n// my-app/\n// ├── angular.json              ← CLI configuration (projects, builders, options)\n// ├── package.json              ← npm dependencies for the whole workspace\n// ├── tsconfig.json             ← base TypeScript config\n// ├── tsconfig.app.json         ← app-specific TS config (extends tsconfig.json)\n// ├── tsconfig.spec.json        ← test-specific TS config\n// └── src/\n//     ├── main.ts               ← entry point (bootstrapApplication)\n//     ├── index.html\n//     ├── styles.scss           ← global styles\n//     └── app/\n//         ├── app.component.ts\n//         ├── app.routes.ts\n//         └── app.config.ts\n\n// ---- Key angular.json sections ----\n{\n  \"$schema\": \"./node_modules/@angular/cli/lib/config/schema.json\",\n  \"version\": 1,\n  \"projects\": {\n    \"my-app\": {\n      \"projectType\": \"application\",\n      \"root\": \"\",\n      \"sourceRoot\": \"src\",\n      \"architect\": {\n        \"build\": {\n          \"builder\": \"@angular-devkit/build-angular:application\",\n          \"options\": {\n            \"outputPath\": \"dist/my-app\",\n            \"index\": \"src/index.html\",\n            \"browser\": \"src/main.ts\",\n            \"tsConfig\": \"tsconfig.app.json\",\n            \"styles\": [\"src/styles.scss\"],\n            \"assets\": [\"src/favicon.ico\", { \"glob\": \"**/*\", \"input\": \"src/assets\" }]\n          },\n          \"configurations\": {\n            \"production\": {\n              \"optimization\": true,\n              \"sourceMap\": false,\n              \"fileReplacements\": [{\n                \"replace\": \"src/environments/environment.ts\",\n                \"with\": \"src/environments/environment.prod.ts\"\n              }]\n            }\n          }\n        }\n      }\n    }\n  }\n}",
      "language": "bash",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">tsconfig Hierarchy</p><div class="flex flex-col items-center gap-2 text-xs"><div class="bg-slate-800 text-white rounded-lg px-3 py-1.5">tsconfig.json — shared compiler options</div><div class="w-px h-3 bg-slate-300"></div><div class="flex gap-6"><div class="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5">tsconfig.app.json — includes src/</div><div class="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">tsconfig.spec.json — includes tests</div></div></div></div>`
    },
    {
      "id": "multi-project-workspace",
      "title": "Multi-project workspace — multiple apps sharing one repository",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A duplex house with a shared basement. The customer portal and the admin panel are two separate living units with their own front doors (each is independently servable and buildable), but they share one foundation, one set of pipes, and one utility room (<code>node_modules</code>, tsconfig, tooling) instead of each digging its own basement.</p>
          </div>
        </div>
        <p>A single Angular workspace can host multiple applications and libraries. This is useful when you have a customer-facing app and an admin dashboard that share components, services, and models. Rather than maintaining two separate repositories with duplicated code, both apps live in one workspace under a <code>projects/</code> directory. They share one <code>node_modules</code>, one set of tooling configurations, and can directly import from shared libraries without npm publishing.</p>
        <h3>Creating the workspace without a default app</h3>
        <p>To create a multi-project workspace, use <code>ng new --create-application=false</code>. This creates the workspace infrastructure (angular.json, tsconfig.json, package.json) without generating a default application. You then generate each application explicitly, which gives each project its own source folder under <code>projects/</code>.</p>
        <h3>Running specific projects</h3>
        <p>With multiple projects in one workspace, you specify which project to operate on using the <code>--project</code> flag: <code>ng serve --project admin-panel</code>, <code>ng build --project customer-portal --configuration production</code>. You can set a default project in <code>angular.json</code> using the <code>defaultProject</code> field to avoid specifying <code>--project</code> every time during active development on one app.</p>
      `,
      "code": "# ---- Create a multi-project workspace ----\nng new my-workspace --create-application=false\ncd my-workspace\n\n# Generate two applications\nng generate application customer-portal --routing --style scss\nng generate application admin-panel --routing --style scss\n\n# Generate a shared library (usable by both apps)\nng generate library shared-ui\nng generate library data-access\n\n# Resulting structure:\n# my-workspace/\n# ├── angular.json              ← all projects registered here\n# ├── projects/\n# │   ├── customer-portal/\n# │   │   └── src/\n# │   ├── admin-panel/\n# │   │   └── src/\n# │   ├── shared-ui/\n# │   │   └── src/\n# │   └── data-access/\n# │       └── src/\n# └── tsconfig.json\n\n# ---- Running and building specific projects ----\nng serve --project customer-portal           # start customer app on :4200\nng serve --project admin-panel --port 4201   # start admin app on :4201\nng build --project customer-portal --configuration production\nng test --project shared-ui                  # test the library in isolation\n\n# ---- Importing from a library ----\n# Libraries auto-configure tsconfig path mappings, so you can:\n# import { ButtonComponent } from 'shared-ui';\n# import { UserService } from 'data-access';",
      "language": "bash",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">One Workspace, Multiple Projects</p><div class="border-2 border-dashed border-slate-300 rounded-xl p-4"><p class="text-center text-xs font-bold text-slate-500 mb-3">my-workspace/ (one node_modules, one angular.json)</p><div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs"><div class="bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-center font-semibold text-indigo-700">customer-portal (app)</div><div class="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center font-semibold text-emerald-700">admin-panel (app)</div><div class="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center font-semibold text-amber-700">shared-ui (lib)</div><div class="bg-purple-50 border border-purple-200 rounded-lg p-2 text-center font-semibold text-purple-700">data-access (lib)</div></div></div></div>`
    },
    {
      "id": "libraries-in-angular",
      "title": "Angular libraries — building shared code the right way",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A hardware store's storefront versus its back warehouse. Customers only ever see what's on the shelves out front (<code>public-api.ts</code>) &mdash; the storage racks in the back (internal implementation files) are invisible and can be rearranged freely without anyone outside noticing, as long as what's on the shelf doesn't change shape.</p>
          </div>
        </div>
        <p>An <strong>Angular library</strong> is a project within a workspace that is designed to be imported by applications, not run directly. Libraries contain components, directives, pipes, and services that multiple applications need. They are the correct abstraction for shared UI component kits, data access layers, utility functions, and design system implementations.</p>
        <h3>How libraries differ from applications</h3>
        <p>Applications are built with the <code>application</code> builder and produce a standalone deployable output. Libraries are built with the <code>ng-packagr</code> builder and produce an npm-publishable package in the <code>dist/</code> folder. The library's <code>public-api.ts</code> file defines the public surface &mdash; only things exported there are accessible to consumers. Everything else is private to the library.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">A library's path mapping (<code>"shared-ui": ["dist/shared-ui"]</code>) points at compiled output, not source. If you edit a component inside a library and don't rebuild it, your app keeps importing the stale <code>dist/</code> output &mdash; the change silently doesn't appear anywhere. Run <code>ng build shared-ui --watch</code> in a second terminal during active library development.</p>
          </div>
        </div>
        <h3>Secondary entry points</h3>
        <p>Large libraries can be split into secondary entry points so consumers only bundle what they use. For example, <code>@angular/material/button</code> and <code>@angular/material/table</code> are secondary entry points of <code>@angular/material</code>. You import just the sub-package, and the bundler tree-shakes everything else. Define secondary entry points in the library's <code>ng-package.json</code>.</p>
      `,
      "code": "# ---- Generate a component library ----\nng generate library shared-ui\n\n# ---- Library structure ----\n# projects/shared-ui/\n# ├── src/\n# │   ├── lib/\n# │   │   ├── button/\n# │   │   ├── card/\n# │   │   └── modal/\n# │   └── public-api.ts       ← exports public surface\n# ├── ng-package.json          ← ng-packagr configuration\n# └── tsconfig.lib.json\n\n// ---- projects/shared-ui/src/public-api.ts ----\n// Everything exported here is importable by consumers\nexport { ButtonComponent } from './lib/button/button.component';\nexport { CardComponent } from './lib/card/card.component';\nexport { ModalService } from './lib/modal/modal.service';\n// Internal implementation details stay unexported\n\n// ---- projects/shared-ui/src/lib/button/button.component.ts ----\nimport { Component, input, output } from '@angular/core';\n\n@Component({\n  selector: 'su-button',  // prefix: 'su' = shared-ui (avoid 'app' prefix in libraries)\n  template: `\n    <button [class]=\"variant()\"\n            [disabled]=\"disabled()\"\n            (click)=\"clicked.emit()\">\n      <ng-content />\n    </button>\n  `\n})\nexport class ButtonComponent {\n  variant = input<'primary' | 'secondary' | 'danger'>('primary');\n  disabled = input(false);\n  clicked = output<void>();\n}\n\n# ---- Build for use in apps ----\nng build shared-ui\n# dist/shared-ui/ is now importable\n\n# ---- In consuming application ----\n# import { ButtonComponent } from 'shared-ui';  (works via tsconfig path mapping)",
      "language": "bash",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">public-api.ts as the Storefront Window</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">Back warehouse (private)</p><div class="flex flex-col items-center gap-1"><div class="bg-slate-100 border border-slate-200 rounded px-2 py-1 w-full text-center">button/button.component.ts</div><div class="bg-slate-100 border border-slate-200 rounded px-2 py-1 w-full text-center">modal/modal.service.internal.ts</div></div></div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3"><p class="font-bold text-emerald-700 text-center mb-2">Storefront (public-api.ts)</p><div class="flex flex-col items-center gap-1"><div class="bg-white border border-emerald-200 rounded px-2 py-1 w-full text-center">ButtonComponent</div><div class="bg-white border border-emerald-200 rounded px-2 py-1 w-full text-center">ModalService</div></div></div></div></div>`
    },
    {
      "id": "relative-vs-non-relative-imports",
      "title": "Relative and non-relative imports",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Giving someone directions. "Turn left at the fridge, it's the drawer next to the stove" only works if you're already standing in that kitchen &mdash; that's a relative import, fine for neighbors in the same feature folder. "123 Main Street, Springfield" works from anywhere in the world regardless of where you're currently standing &mdash; that's a non-relative import via a package name or alias, and it's what you want once two things aren't next-door neighbors.</p>
          </div>
        </div>
        <p>Angular projects use two broad import styles. A <strong>relative import</strong> starts with <code>./</code> or <code>../</code> and points to a file based on the current file location. A <strong>non-relative import</strong> does not start with dots. It points to an npm package, an Angular package, a workspace library, or a TypeScript path alias.</p>
        <h3>Relative imports</h3>
        <p>Use relative imports for files that are close together and belong to the same feature. For example, a component importing its own service from the same folder should use <code>./user.service</code>. Relative imports make local ownership obvious.</p>
        <h3>Non-relative imports</h3>
        <p>Use non-relative imports for framework packages (<code>@angular/core</code>), third-party packages (<code>rxjs</code>), workspace libraries (<code>shared-ui</code>), and configured aliases such as <code>@core/*</code> or <code>@shared/*</code>. They keep deeply nested files readable and reduce fragile paths like <code>../../../../core/auth.service</code>.</p>
        <h3>Practical rule</h3>
        <p>Inside a feature folder, relative imports are fine. Across major boundaries like <code>core</code>, <code>shared</code>, <code>features</code>, or libraries, prefer aliases or library imports. Avoid importing another feature's private files directly because it creates hidden coupling.</p>
      `,
      "code": "// ---- Relative imports: start with ./ or ../ ----\n// product-card.component.ts and product-card.types.ts are neighbors.\nimport { ProductCardViewModel } from './product-card.types';\n\n// Move up one folder, then into another local folder.\nimport { ProductService } from '../data-access/product.service';\n\n// Lazy route relative to the current routes file.\nexport const routes = [\n  {\n    path: 'details/:id',\n    loadComponent: () =>\n      import('./product-details/product-details.component')\n        .then(m => m.ProductDetailsComponent)\n  }\n];\n\n// ---- Non-relative imports: packages, libraries, aliases ----\nimport { Component, inject } from '@angular/core';       // Angular package\nimport { Observable, map } from 'rxjs';                  // npm package\nimport { ButtonComponent } from 'shared-ui';             // workspace library\nimport { AuthService } from '@core/auth/auth.service';   // path alias\nimport { PricePipe } from '@shared/pipes/price.pipe';    // path alias\n\n// ---- Import hygiene ----\n// Good: feature owns its local implementation.\nimport { ProductApi } from './data-access/product-api.service';\n\n// Risky: one feature reaches into another feature's private files.\n// import { AdminUserService } from '../../admin/internal/admin-user.service';\n\n// Better: expose shared contracts through a library or public barrel.\nimport { UserSummary } from '@shared/models/user-summary.model';",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Relative vs Non-Relative at a Glance</p><div class="grid grid-cols-2 gap-3 text-xs"><div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center"><p class="font-bold text-indigo-700">./product.types</p><p class="text-slate-500 mt-1">same folder, relative</p></div><div class="bg-rose-50 border border-rose-200 rounded-lg p-3 text-center"><p class="font-bold text-rose-700">../../../../core/auth</p><p class="text-slate-500 mt-1">fragile, breaks on reorg</p></div><div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center"><p class="font-bold text-emerald-700">@core/auth/auth.service</p><p class="text-slate-500 mt-1">alias, stable regardless of depth</p></div><div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center"><p class="font-bold text-amber-700">shared-ui</p><p class="text-slate-500 mt-1">workspace library, package-style</p></div></div></div>`
    },
    {
      "id": "path-mapping-tsconfig",
      "title": "TypeScript path aliases — clean imports with @core, @shared",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A speed-dial contact versus memorizing someone's full phone number with area code. Once <code>@core</code> is set up, you just dial "@core/auth" from anywhere in the app, and if the underlying number ever changes (the folder gets moved), you update the speed-dial entry once in <code>tsconfig.json</code> instead of correcting every phone in the building that had the old number written on a sticky note.</p>
          </div>
        </div>
        <p>As an Angular application grows, relative import paths become increasingly unwieldy. A component five levels deep in the feature folder imports a shared service with <code>import { AuthService } from '../../../../core/auth/auth.service'</code>. When folders are reorganized, every import using that path breaks. TypeScript's <code>paths</code> configuration solves this by defining import aliases that map to actual filesystem paths.</p>
        <p>Path aliases let you write <code>import { AuthService } from '@core/auth'</code> regardless of where the importing file lives in the folder tree. The alias is resolved by the TypeScript compiler at compile time &mdash; it's purely a compile-time feature with no runtime overhead. IDEs that support TypeScript (VS Code, WebStorm) resolve the aliases automatically for autocomplete and navigation.</p>
        <h3>Standard alias conventions</h3>
        <p>The most common convention in Angular projects uses <code>@core</code> for singleton services (auth, HTTP interceptors, guards), <code>@shared</code> for reusable components and pipes, <code>@features</code> or <code>@pages</code> for feature modules, and <code>@env</code> for environment files. The trailing <code>/*</code> in both the alias pattern and the path is required &mdash; it makes the alias a prefix rather than an exact match, so <code>@core/auth/auth.service</code> resolves to <code>src/app/core/auth/auth.service</code>.</p>
        <h3>Aliases and Nx</h3>
        <p>If you use Nx for monorepo management, path aliases are automatically generated for each library. The alias matches the library name as defined in <code>nx.json</code>. Libraries become importable as <code>@myorg/shared-ui</code> &mdash; a pattern that exactly mirrors how npm-published packages are imported, making the transition to publishing a library seamless.</p>
      `,
      "code": "// ---- tsconfig.json — path alias configuration ----\n{\n  \"compilerOptions\": {\n    \"baseUrl\": \".\",\n    \"paths\": {\n      // Single-file aliases (exact match)\n      \"@env\":        [\"src/environments/environment.ts\"],\n\n      // Prefix aliases (wildcard — the /* is required)\n      \"@core/*\":     [\"src/app/core/*\"],\n      \"@shared/*\":   [\"src/app/shared/*\"],\n      \"@features/*\": [\"src/app/features/*\"],\n\n      // Library aliases (generated automatically by ng generate library)\n      \"shared-ui\":   [\"dist/shared-ui\"],\n      \"data-access\": [\"dist/data-access\"]\n    }\n  }\n}\n\n// ---- Before path aliases ----\nimport { AuthService }    from '../../../core/auth/auth.service';\nimport { UserCardComponent } from '../../shared/components/user-card/user-card.component';\nimport { environment }    from '../../../environments/environment';\n\n// ---- After path aliases ----\nimport { AuthService }       from '@core/auth/auth.service';\nimport { UserCardComponent } from '@shared/components/user-card/user-card.component';\nimport { environment }       from '@env';\n\n// Refactoring the folder structure only requires updating the alias\n// in one place (tsconfig.json), not every import statement\n\n// ---- Index barrel files for even cleaner imports ----\n// src/app/core/index.ts:\nexport { AuthService } from './auth/auth.service';\nexport { AuthGuard }   from './guards/auth.guard';\nexport { HttpErrorInterceptor } from './interceptors/http-error.interceptor';\n\n// Then import from the barrel:\nimport { AuthService, AuthGuard } from '@core';",
      "language": "json",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Before / After Path Aliases</p><div class="grid grid-cols-1 gap-2 text-xs font-mono max-w-lg mx-auto"><div class="bg-rose-50 border border-rose-200 rounded px-3 py-2">'../../../core/auth/auth.service'</div><div class="text-center text-slate-300">&darr;</div><div class="bg-emerald-50 border border-emerald-200 rounded px-3 py-2">'@core/auth/auth.service'</div></div></div>`
    },
    {
      "id": "npm-workspaces-vs-nx",
      "title": "Monorepo tools — Angular workspace, NPM workspaces, and Nx",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Three sizes of kitchen. The built-in Angular workspace is a home kitchen &mdash; fine for a family of four, everyone cooks in sequence, nobody's timing it. NPM workspaces is a shared commercial kitchen where each chef has their own station and ingredients but there's no head chef coordinating who cooks when. Nx is a full restaurant kitchen with a expediter calling out "only remake what changed" and running multiple stations in parallel &mdash; built for feeding a packed dining room every night.</p>
          </div>
        </div>
        <p>When managing multiple Angular applications and libraries, you have three distinct levels of tooling to choose from, each appropriate for different team sizes and complexity levels.</p>
        <h3>Angular workspace (built-in)</h3>
        <p>Angular's built-in multi-project workspace (one <code>angular.json</code>, multiple entries under <code>projects/</code>) is the simplest approach and requires no additional tooling. It works well for two to four related applications that a single small team maintains. Every application in the workspace must use the same version of Angular and the same <code>node_modules</code>. Build and test commands run sequentially &mdash; there's no parallel execution or build caching.</p>
        <h3>NPM workspaces</h3>
        <p>NPM workspaces (supported natively in npm 7+) allow multiple <code>package.json</code> files within one repository, each representing an independent package, while sharing a single <code>node_modules</code> at the root. This gives each package version independence while avoiding duplicate installs. However, NPM workspaces provide no task orchestration &mdash; running builds in the right order and skipping unchanged packages requires custom scripts.</p>
        <h3>Nx (recommended for large teams)</h3>
        <p><strong>Nx</strong> is a build system and monorepo management tool built specifically for JavaScript/TypeScript projects with first-class Angular support. It adds three critical features that the built-in workspace lacks: <strong>affected commands</strong> (run only what changed based on git diff), <strong>computation caching</strong> (never rebuild what already passed), and <strong>distributed task execution</strong> (parallelize across CI agents). For an organization with 10+ frontend developers across 5+ applications, Nx typically reduces CI build times from 30 minutes to under 5 minutes by only rebuilding affected projects and caching everything else.</p>
      `,
      "code": "# ---- Angular built-in workspace (simplest) ----\nng new my-workspace --create-application=false\nng generate application app-a\nng generate library shared-lib\nng build app-a --configuration production   # builds everything sequentially\n\n# ---- NPM Workspaces (package.json) ----\n# package.json at root:\n{\n  \"workspaces\": [\n    \"apps/*\",\n    \"packages/*\"\n  ]\n}\n# Each app/package has its own package.json with its own version\n# npm install at root hoists shared deps to root node_modules\n# npm run build --workspace=apps/app-a\n\n# ---- Nx (recommended for large teams) ----\n# Create a new Nx workspace with Angular preset:\nnpx create-nx-workspace@latest my-org --preset=angular\n\n# Or add Nx to an existing Angular workspace:\nnpx nx@latest init\n\n# Generate apps and libs\nnx generate @nx/angular:app customer-portal\nnx generate @nx/angular:lib shared-ui --publishable --importPath=@my-org/shared-ui\n\n# Nx key commands:\nnx serve customer-portal\nnx build customer-portal --configuration production\n\n# Only rebuild what is affected by the current git changes:\nnx affected:build --base=main\nnx affected:test  --base=main\n\n# Visualization — shows dependency graph between all apps and libs:\nnx graph",
      "language": "bash",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Three Monorepo Tiers</p><div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs"><div class="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center"><p class="font-bold text-slate-700">Angular workspace</p><p class="text-slate-500 mt-1">2&ndash;4 apps, sequential builds, no caching</p></div><div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center"><p class="font-bold text-amber-700">NPM workspaces</p><p class="text-slate-500 mt-1">independent versions, no orchestration</p></div><div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center"><p class="font-bold text-emerald-700">Nx</p><p class="text-slate-500 mt-1">affected builds, caching, parallel CI</p></div></div></div>`
    }
  ]
});
