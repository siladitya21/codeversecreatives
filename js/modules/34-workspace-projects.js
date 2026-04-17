window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "workspace-projects",
  "title": "Workspace & Projects",
  "icon": "bi bi-folder2-open",
  "questions": [
    {
      "id": "angular-workspace-structure",
      "title": "Angular workspace structure and configuration files",
      "explanation": `
          <p>An <strong>Angular workspace</strong> is the root directory created by <code>ng new</code>. It contains everything the Angular CLI needs to build, test, and serve your applications: source files, configuration, and workspace-wide tooling settings. Understanding the workspace structure is essential for customizing builds, adding projects, and debugging CLI behavior.</p>

          <h3>angular.json — The Workspace Brain</h3>
          <p><code>angular.json</code> is the most important file in the workspace. It defines every project (applications and libraries) and tells the CLI how to build, serve, test, lint, and deploy each one. Each project has an <code>architect</code> section with named targets (<code>build</code>, <code>serve</code>, <code>test</code>, <code>lint</code>). Each target has a <code>builder</code> (the npm package that runs the build) and <code>options</code> (configuration passed to the builder). The <code>configurations</code> block provides environment-specific option overrides — the <code>production</code> configuration activates optimization, minification, and file replacement.</p>

          <h3>tsconfig.json Hierarchy</h3>
          <p>Angular workspaces use a tsconfig hierarchy. <code>tsconfig.json</code> at the root defines shared compiler options. <code>tsconfig.app.json</code> (in <code>src/</code>) extends it with app-specific settings (includes the <code>src</code> folder, excludes test files). <code>tsconfig.spec.json</code> extends it with test-specific settings (includes test files). Each project in a multi-project workspace has its own <code>tsconfig.app.json</code> that extends the workspace root.</p>
        `,
      "code": "// ---- Standard single-app workspace layout ----\n// my-app/\n// ├── angular.json              ← CLI configuration (projects, builders, options)\n// ├── package.json              ← npm dependencies for the whole workspace\n// ├── tsconfig.json             ← base TypeScript config\n// ├── tsconfig.app.json         ← app-specific TS config (extends tsconfig.json)\n// ├── tsconfig.spec.json        ← test-specific TS config\n// └── src/\n//     ├── main.ts               ← entry point (bootstrapApplication)\n//     ├── index.html\n//     ├── styles.scss           ← global styles\n//     └── app/\n//         ├── app.component.ts\n//         ├── app.routes.ts\n//         └── app.config.ts\n\n// ---- Key angular.json sections ----\n{\n  \"$schema\": \"./node_modules/@angular/cli/lib/config/schema.json\",\n  \"version\": 1,\n  \"projects\": {\n    \"my-app\": {\n      \"projectType\": \"application\",\n      \"root\": \"\",\n      \"sourceRoot\": \"src\",\n      \"architect\": {\n        \"build\": {\n          \"builder\": \"@angular-devkit/build-angular:application\",\n          \"options\": {\n            \"outputPath\": \"dist/my-app\",\n            \"index\": \"src/index.html\",\n            \"browser\": \"src/main.ts\",\n            \"tsConfig\": \"tsconfig.app.json\",\n            \"styles\": [\"src/styles.scss\"],\n            \"assets\": [\"src/favicon.ico\", { \"glob\": \"**/*\", \"input\": \"src/assets\" }]\n          },\n          \"configurations\": {\n            \"production\": {\n              \"optimization\": true,\n              \"sourceMap\": false,\n              \"fileReplacements\": [{\n                \"replace\": \"src/environments/environment.ts\",\n                \"with\": \"src/environments/environment.prod.ts\"\n              }]\n            }\n          }\n        }\n      }\n    }\n  }\n}",
      "language": "bash"
    },
    {
      "id": "multi-project-workspace",
      "title": "Multi-project workspace — multiple apps sharing one repository",
      "explanation": `
          <p>A single Angular workspace can host multiple applications and libraries. This is useful when you have a customer-facing app and an admin dashboard that share components, services, and models. Rather than maintaining two separate repositories with duplicated code, both apps live in one workspace under a <code>projects/</code> directory. They share one <code>node_modules</code>, one set of tooling configurations, and can directly import from shared libraries without npm publishing.</p>

          <h3>Creating the Workspace Without a Default App</h3>
          <p>To create a multi-project workspace, use <code>ng new --create-application=false</code>. This creates the workspace infrastructure (angular.json, tsconfig.json, package.json) without generating a default application. You then generate each application explicitly, which gives each project its own source folder under <code>projects/</code>.</p>

          <h3>Running Specific Projects</h3>
          <p>With multiple projects in one workspace, you specify which project to operate on using the <code>--project</code> flag: <code>ng serve --project admin-panel</code>, <code>ng build --project customer-portal --configuration production</code>. You can set a default project in <code>angular.json</code> using the <code>defaultProject</code> field to avoid specifying <code>--project</code> every time during active development on one app.</p>
        `,
      "code": "# ---- Create a multi-project workspace ----\nng new my-workspace --create-application=false\ncd my-workspace\n\n# Generate two applications\nng generate application customer-portal --routing --style scss\nng generate application admin-panel --routing --style scss\n\n# Generate a shared library (usable by both apps)\nng generate library shared-ui\nng generate library data-access\n\n# Resulting structure:\n# my-workspace/\n# ├── angular.json              ← all projects registered here\n# ├── projects/\n# │   ├── customer-portal/\n# │   │   └── src/\n# │   ├── admin-panel/\n# │   │   └── src/\n# │   ├── shared-ui/\n# │   │   └── src/\n# │   └── data-access/\n# │       └── src/\n# └── tsconfig.json\n\n# ---- Running and building specific projects ----\nng serve --project customer-portal           # start customer app on :4200\nng serve --project admin-panel --port 4201   # start admin app on :4201\nng build --project customer-portal --configuration production\nng test --project shared-ui                  # test the library in isolation\n\n# ---- Importing from a library ----\n# Libraries auto-configure tsconfig path mappings, so you can:\n# import { ButtonComponent } from 'shared-ui';\n# import { UserService } from 'data-access';",
      "language": "bash"
    },
    {
      "id": "libraries-in-angular",
      "title": "Angular libraries — building shared code the right way",
      "explanation": `
          <p>An <strong>Angular library</strong> is a project within a workspace that is designed to be imported by applications, not run directly. Libraries contain components, directives, pipes, and services that multiple applications need. They are the correct abstraction for shared UI component kits, data access layers, utility functions, and design system implementations.</p>

          <h3>How Libraries Differ from Applications</h3>
          <p>Applications are built with the <code>application</code> builder and produce a standalone deployable output. Libraries are built with the <code>ng-packagr</code> builder and produce an npm-publishable package in the <code>dist/</code> folder. The library's <code>public-api.ts</code> file defines the public surface — only things exported there are accessible to consumers. Everything else is private to the library.</p>

          <h3>Path Mapping for Local Development</h3>
          <p>When you generate a library with the CLI, it automatically adds a TypeScript path mapping in <code>tsconfig.json</code>: <code>"shared-ui": ["dist/shared-ui"]</code>. This means applications can <code>import { ButtonComponent } from 'shared-ui'</code> as if it were an npm package. However, for this to work, the library must be built first. A common workflow pain point is forgetting to rebuild the library after changing it — the application is importing the old compiled output from <code>dist/</code>. Use <code>ng build shared-ui --watch</code> in a second terminal during active library development to keep the output fresh.</p>

          <h3>Secondary Entry Points</h3>
          <p>Large libraries can be split into secondary entry points so consumers only bundle what they use. For example, <code>@angular/material/button</code> and <code>@angular/material/table</code> are secondary entry points of <code>@angular/material</code>. You import just the sub-package, and the bundler tree-shakes everything else. Define secondary entry points in the library's <code>ng-package.json</code>.</p>
        `,
      "code": "# ---- Generate a component library ----\nng generate library shared-ui\n\n# ---- Library structure ----\n# projects/shared-ui/\n# ├── src/\n# │   ├── lib/\n# │   │   ├── button/\n# │   │   ├── card/\n# │   │   └── modal/\n# │   └── public-api.ts       ← exports public surface\n# ├── ng-package.json          ← ng-packagr configuration\n# └── tsconfig.lib.json\n\n// ---- projects/shared-ui/src/public-api.ts ----\n// Everything exported here is importable by consumers\nexport { ButtonComponent } from './lib/button/button.component';\nexport { CardComponent } from './lib/card/card.component';\nexport { ModalService } from './lib/modal/modal.service';\n// Internal implementation details stay unexported\n\n// ---- projects/shared-ui/src/lib/button/button.component.ts ----\nimport { Component, Input, Output, EventEmitter } from '@angular/core';\n\n@Component({\n  selector: 'su-button',  // prefix: 'su' = shared-ui (avoid 'app' prefix in libraries)\n  standalone: true,\n  template: `\n    <button [class]=\"variant\"\n            [disabled]=\"disabled\"\n            (click)=\"clicked.emit()\">\n      <ng-content />\n    </button>\n  `\n})\nexport class ButtonComponent {\n  @Input() variant: 'primary' | 'secondary' | 'danger' = 'primary';\n  @Input() disabled = false;\n  @Output() clicked = new EventEmitter<void>();\n}\n\n# ---- Build for use in apps ----\nng build shared-ui\n# dist/shared-ui/ is now importable\n\n# ---- In consuming application ----\n# import { ButtonComponent } from 'shared-ui';  (works via tsconfig path mapping)",
      "language": "bash"
    },
    {
      "id": "path-mapping-tsconfig",
      "title": "TypeScript path aliases — clean imports with @core, @shared",
      "explanation": `
          <p>As an Angular application grows, relative import paths become increasingly unwieldy. A component five levels deep in the feature folder imports a shared service with <code>import { AuthService } from '../../../../core/auth/auth.service'</code>. When folders are reorganized, every import using that path breaks. TypeScript's <code>paths</code> configuration solves this by defining import aliases that map to actual filesystem paths.</p>

          <p>Path aliases let you write <code>import { AuthService } from '@core/auth'</code> regardless of where the importing file lives in the folder tree. The alias is resolved by the TypeScript compiler at compile time — it is purely a compile-time feature with no runtime overhead. IDEs that support TypeScript (VS Code, WebStorm) resolve the aliases automatically for autocomplete and navigation.</p>

          <h3>Standard Alias Conventions</h3>
          <p>The most common convention in Angular projects uses <code>@core</code> for singleton services (auth, HTTP interceptors, guards), <code>@shared</code> for reusable components and pipes, <code>@features</code> or <code>@pages</code> for feature modules, and <code>@env</code> for environment files. The trailing <code>/*</code> in both the alias pattern and the path is required — it makes the alias a prefix rather than an exact match, so <code>@core/auth/auth.service</code> resolves to <code>src/app/core/auth/auth.service</code>.</p>

          <h3>Aliases and Nx</h3>
          <p>If you use Nx for monorepo management, path aliases are automatically generated for each library. The alias matches the library name as defined in <code>nx.json</code>. Libraries become importable as <code>@myorg/shared-ui</code> — a pattern that exactly mirrors how npm-published packages are imported, making the transition to publishing a library seamless.</p>
        `,
      "code": "// ---- tsconfig.json — path alias configuration ----\n{\n  \"compilerOptions\": {\n    \"baseUrl\": \".\",\n    \"paths\": {\n      // Single-file aliases (exact match)\n      \"@env\":        [\"src/environments/environment.ts\"],\n\n      // Prefix aliases (wildcard — the /* is required)\n      \"@core/*\":     [\"src/app/core/*\"],\n      \"@shared/*\":   [\"src/app/shared/*\"],\n      \"@features/*\": [\"src/app/features/*\"],\n\n      // Library aliases (generated automatically by ng generate library)\n      \"shared-ui\":   [\"dist/shared-ui\"],\n      \"data-access\": [\"dist/data-access\"]\n    }\n  }\n}\n\n// ---- Before path aliases ----\nimport { AuthService }    from '../../../core/auth/auth.service';\nimport { UserCardComponent } from '../../shared/components/user-card/user-card.component';\nimport { environment }    from '../../../environments/environment';\n\n// ---- After path aliases ----\nimport { AuthService }       from '@core/auth/auth.service';\nimport { UserCardComponent } from '@shared/components/user-card/user-card.component';\nimport { environment }       from '@env';\n\n// Refactoring the folder structure only requires updating the alias\n// in one place (tsconfig.json), not every import statement\n\n// ---- Index barrel files for even cleaner imports ----\n// src/app/core/index.ts:\nexport { AuthService } from './auth/auth.service';\nexport { AuthGuard }   from './guards/auth.guard';\nexport { HttpErrorInterceptor } from './interceptors/http-error.interceptor';\n\n// Then import from the barrel:\nimport { AuthService, AuthGuard } from '@core';",
      "language": "json"
    },
    {
      "id": "npm-workspaces-vs-nx",
      "title": "Monorepo tools — Angular workspace, NPM workspaces, and Nx",
      "explanation": `
          <p>When managing multiple Angular applications and libraries, you have three distinct levels of tooling to choose from, each appropriate for different team sizes and complexity levels.</p>

          <h3>Angular Workspace (Built-in)</h3>
          <p>Angular's built-in multi-project workspace (one <code>angular.json</code>, multiple entries under <code>projects/</code>) is the simplest approach and requires no additional tooling. It works well for two to four related applications that a single small team maintains. Every application in the workspace must use the same version of Angular and the same <code>node_modules</code>. Build and test commands run sequentially — there is no parallel execution or build caching.</p>

          <h3>NPM Workspaces</h3>
          <p>NPM workspaces (supported natively in npm 7+) allow multiple <code>package.json</code> files within one repository, each representing an independent package, while sharing a single <code>node_modules</code> at the root. This gives each package version independence while avoiding duplicate installs. However, NPM workspaces provide no task orchestration — running builds in the right order and skipping unchanged packages requires custom scripts.</p>

          <h3>Nx (Recommended for Large Teams)</h3>
          <p><strong>Nx</strong> is a build system and monorepo management tool built specifically for JavaScript/TypeScript projects with first-class Angular support. It adds three critical features that the built-in workspace lacks: <strong>affected commands</strong> (run only what changed based on git diff), <strong>computation caching</strong> (never rebuild what already passed), and <strong>distributed task execution</strong> (parallelize across CI agents). For an organization with 10+ frontend developers across 5+ applications, Nx typically reduces CI build times from 30 minutes to under 5 minutes by only rebuilding affected projects and caching everything else.</p>
        `,
      "code": "# ---- Angular built-in workspace (simplest) ----\nng new my-workspace --create-application=false\nng generate application app-a\nng generate library shared-lib\nng build app-a --configuration production   # builds everything sequentially\n\n# ---- NPM Workspaces (package.json) ----\n# package.json at root:\n{\n  \"workspaces\": [\n    \"apps/*\",\n    \"packages/*\"\n  ]\n}\n# Each app/package has its own package.json with its own version\n# npm install at root hoists shared deps to root node_modules\n# npm run build --workspace=apps/app-a\n\n# ---- Nx (recommended for large teams) ----\n# Create a new Nx workspace with Angular preset:\nnpx create-nx-workspace@latest my-org --preset=angular\n\n# Or add Nx to an existing Angular workspace:\nnpx nx@latest init\n\n# Generate apps and libs\nnx generate @nx/angular:app customer-portal\nnx generate @nx/angular:lib shared-ui --publishable --importPath=@my-org/shared-ui\n\n# Nx key commands:\nnx serve customer-portal\nnx build customer-portal --configuration production\n\n# Only rebuild what is affected by the current git changes:\nnx affected:build --base=main\nnx affected:test  --base=main\n\n# Visualization — shows dependency graph between all apps and libs:\nnx graph",
      "language": "bash"
    }
  ]
});
