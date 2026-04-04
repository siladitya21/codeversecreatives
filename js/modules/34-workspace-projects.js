window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "workspace-projects",
  "title": "Workspace & Projects",
  "icon": "bi bi-folder2-open",
  "questions": [
    {
      "id": "angular-workspace-structure",
      "title": "Angular workspace structure",
      "explanation": `
          <p>An <strong>Angular Workspace</strong> is a collection of projects (applications and libraries). The root folder contains workspace-wide configuration files and a <code>src</code> folder for the initial application (or a <code>projects</code> folder for multi-project setups).</p>
          <h3>Key Files</h3>
          <ul>
            <li><code>angular.json</code>: CLI configuration for all projects in the workspace.</li>
            <li><code>package.json</code>: Workspace-wide npm dependencies.</li>
            <li><code>tsconfig.json</code>: Base TypeScript configuration.</li>
            <li><code>src/</code>: Source files for the default project.</li>
          </ul>
        `,
      "code": "// Standard Single-Project Structure:\n// my-app/\n// â”œâ”€â”€ angular.json\n// â”œâ”€â”€ src/\n// â”‚   â”œâ”€â”€ app/\n// â”‚   â””â”€â”€ main.ts\n// â””â”€â”€ tsconfig.json",
      "language": "bash",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Workspace Hierarchy</p><div class="max-w-md mx-auto bg-slate-800 text-white rounded-lg p-3 text-[10px] font-mono">Workspace Root<br/>â”œâ”€â”€ angular.json<br/>â”œâ”€â”€ package.json<br/>â””â”€â”€ projects/<br/>&nbsp;&nbsp;&nbsp;&nbsp;â”œâ”€â”€ main-app/<br/>&nbsp;&nbsp;&nbsp;&nbsp;â””â”€â”€ shared-lib/</div></div>`
    },
    {
      "id": "multi-project-workspace",
      "title": "Multi-project workspace",
      "explanation": `
          <p>Angular supports <strong>Multi-project workspaces</strong> where you can house multiple applications and libraries in one repository. This is ideal for monorepos where several apps share the same shared business logic or UI components.</p>\n\n          <p>When you add a second project, the CLI moves projects into a <code>projects/</code> subfolder and updates <code>angular.json</code> to manage them independently.</p>
        `,
      "code": "// Commands to create a multi-project workspace:\n// 1. ng new my-workspace --create-application=false\n// 2. ng generate application admin-panel\n// 3. ng generate application customer-portal\n// 4. ng generate library shared-ui",
      "language": "bash"
    },
    {
      "id": "libraries-in-angular",
      "title": "Libraries in Angular",
      "explanation": `
          <p>An <strong>Angular Library</strong> is a project that cannot run on its own but is intended to be consumed by other applications. Libraries are perfect for sharing components, services, or models across multiple apps.</p>\n\n          <p>Unlike applications, libraries are compiled into a <strong>distizable package</strong> that can be published to npm or used locally via TypeScript path mapping.</p>\n        `,
      "code": "// Generate a library\n// ng generate library data-access\n\n// Usage in an app:\nimport { AuthService } from 'data-access'; ",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><div class="flex items-center justify-center gap-4"><div class="bg-amber-50 border-2 border-amber-200 p-2 rounded text-[10px]">Library (UI Kit)</div><div class="text-slate-300">&rarr;</div><div class="bg-indigo-50 border-2 border-indigo-200 p-2 rounded text-[10px]">App A</div><div class="bg-indigo-50 border-2 border-indigo-200 p-2 rounded text-[10px]">App B</div></div></div>`
    },
    {
      "id": "angular-json-configuration",
      "title": "angular.json configuration",
      "explanation": `
          <p>The <code>angular.json</code> file is the "brain" of the Angular CLI. It defines how every project in the workspace should be built, served, and tested.</p>\n\n          <h3>Key Sections</h3>\n          <ul>\n            <li><strong>projects:</strong> Configuration for each app/lib.</li>\n            <li><strong>architect:</strong> Defines "targets" like <code>build</code>, <code>serve</code>, <code>test</code>, and <code>lint</code>.</li>\n            <li><strong>options:</strong> File paths, assets, styles, and scripts.</li>\n            <li><strong>configurations:</strong> Environment-specific overrides (e.g., <code>production</code>, <code>staging</code>).</li>\n          </ul>\n        `,
      "code": "{\n  \"projects\": {\n    \"my-app\": {\n      \"architect\": {\n        \"build\": {\n          \"options\": {\n            \"styles\": [\"src/styles.scss\"],\n            \"assets\": [\"src/favicon.ico\", \"src/assets\"]\n          }\n        }\n      }\n    }\n  }\n}",
      "language": "json"
    },
    {
      "id": "path-mapping-tsconfig",
      "title": "Path mapping in tsconfig.json",
      "explanation": `
          <p><strong>Path mapping</strong> in <code>tsconfig.json</code> allows you to create aliases for import paths, making your code more maintainable and easier to refactor. This is especially useful in multi-project workspaces.</p>\n\n          <h3>Benefits</h3>\n          <ul>\n            <li><strong>Shorter imports:</strong> Instead of <code>import { UserService } from '../../services/user.service'</code>, use <code>import { UserService } from '@shared/services'</code>.</li>\n            <li><strong>Easier refactoring:</strong> Rename paths without updating all imports across the codebase.</li>\n            <li><strong>Clear intent:</strong> Aliases indicate the scope and purpose (e.g., <code>@core</code>, <code>@shared</code>, <code>@features</code>).</li>\n          </ul>\n        `,
      "code": "// tsconfig.json\n{\n  \"compilerOptions\": {\n    \"baseUrl\": \".\",\n    \"paths\": {\n      \"@core/*\": [\"src/app/core/*\"],\n      \"@shared/*\": [\"src/app/shared/*\"],\n      \"@features/*\": [\"src/app/features/*\"],\n      \"@environments/*\": [\"src/environments/*\"]\n    }\n  }\n}\n\n// Usage in components:\nimport { AuthService } from '@core/services';\nimport { ButtonComponent } from '@shared/components';\nimport { environment } from '@environments/environment';",
      "language": "json",
      "diagram": `<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Path Alias Mapping</p><div class=\"flex flex-col items-center gap-2 max-w-md mx-auto\"><div class=\"bg-indigo-50 border border-indigo-200 p-2 rounded text-xs\">@core &rarr; src/app/core</div><div class=\"bg-emerald-50 border border-emerald-200 p-2 rounded text-xs\">@shared &rarr; src/app/shared</div><div class=\"bg-amber-50 border border-amber-200 p-2 rounded text-xs\">@features &rarr; src/app/features</div><div class=\"bg-rose-50 border border-rose-200 p-2 rounded text-xs\">@environments &rarr; src/environments</div></div></div>`
    },
    {
      "id": "npm-workspaces-vs-nx",
      "title": "NPM workspaces vs Nx monorepos",
      "explanation": `
          <p>For managing multiple projects, you have different options:</p>\n\n          <h3>NPM Workspaces</h3>\n          <ul>\n            <li>Native npm feature for managing multiple packages from a single repository.</li>\n            <li>Each package has its own <code>package.json</code>.</li>\n            <li>Simpler setup but less automation compared to specialized tools.</li>\n          </ul>\n\n          <h3>Nx</h3>\n          <ul>\n            <li>A complete build system and monorepo management tool optimized for Angular.</li>\n            <li>Provides advanced features: task scheduling, distributed caching, code generation schematics.</li>\n            <li>Better for large-scale organizations with many teams and projects.</li>\n            <li>Steeper learning curve but more powerful automation.</li>\n          </ul>\n        `,
      "code": "// NPM Workspaces setup (package.json)\n{\n  \"workspaces\": [\n    \"packages/core-lib\",\n    \"packages/ui-lib\",\n    \"apps/main-app\",\n    \"apps/admin-app\"\n  ]\n}\n\n// Access shared dependencies from any workspace package\n// npm install\n\n// Nx setup (nx.json)\n// npx create-nx-workspace@latest --preset=angular\n// nx generate @nx/angular:app admin-app\n// nx serve admin-app\n// nx run-many --target=build --projects=core-lib,ui-lib",
      "language": "json",
      "diagram": `<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Monorepo Structure</p><div class=\"grid grid-cols-2 gap-4 max-w-md mx-auto\"><div class=\"bg-blue-50 border border-blue-200 p-2 rounded text-center text-xs\"><strong>NPM</strong><p class=\"text-[10px] mt-1\">Workspaces</p></div><div class=\"bg-purple-50 border border-purple-200 p-2 rounded text-center text-xs\"><strong>Nx</strong><p class=\"text-[10px] mt-1\">Monorepo</p></div></div></div>`
    },
    {
      "id": "library-publishing-to-npm",
      "title": "Publishing libraries to npm",
      "explanation": `
          <p>Once you've developed and tested a library, you can publish it to npm for others to use.</p>\n\n          <h3>Publishing Steps</h3>\n          <ol>\n            <li><strong>Build the library:</strong> <code>ng build my-lib</code> outputs to <code>dist/my-lib</code>.</li>\n            <li><strong>Configure package.json:</strong> Ensure it has proper metadata (<code>name</code>, <code>version</code>, <code>description</code>, <code>main</code>, <code>types</code>).</li>\n            <li><strong>Create npm account:</strong> Register on https://npmjs.com.</li>\n            <li><strong>Login locally:</strong> <code>npm login</code>.</li>\n            <li><strong>Publish:</strong> <code>npm publish</code> from the library's output directory.</li>\n            <li><strong>Version updates:</strong> Update the version and republish for subsequent releases.</li>\n          </ol>\n        `,
      "code": "// dist/my-lib/package.json\n{\n  \"name\": \"@myorg/data-access\",\n  \"version\": \"1.0.0\",\n  \"description\": \"Shared data access library for MyOrg\",\n  \"main\": \"index.js\",\n  \"types\": \"index.d.ts\",\n  \"repository\": \"https://github.com/myorg/my-libs\",\n  \"author\": \"My Organization\",\n  \"license\": \"MIT\",\n  \"peerDependencies\": {\n    \"@angular/core\": \"^17.0.0\"\n  }\n}\n\n// Publishing commands:\n// cd dist/my-lib\n// npm publish\n\n// Consumers install as:\n// npm install @myorg/data-access",
      "language": "json",
      "diagram": `<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">NFM Publishing Flow</p><div class=\"flex flex-col items-center gap-2\"><div class=\"bg-indigo-50 border border-indigo-200 p-2 rounded text-xs\">ng build library</div><div class=\"text-slate-300 text-xs\">↓</div><div class=\"bg-amber-50 border border-amber-200 p-2 rounded text-xs\">dist/my-lib generated</div><div class=\"text-slate-300 text-xs\">↓</div><div class=\"bg-emerald-50 border border-emerald-200 p-2 rounded text-xs\">npm publish</div><div class=\"text-slate-300 text-xs\">↓</div><div class=\"bg-rose-50 border border-rose-200 p-2 rounded text-xs\">Available on npm registry</div></div></div>`
    }
  ]
});