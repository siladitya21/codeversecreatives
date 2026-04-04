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
    }
  ]
});