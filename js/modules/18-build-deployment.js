window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "build-deployment",
  "title": "Build & Deployment",
  "icon": "bi bi-box-seam",
  "questions": [
    {
      "id": "angular-cli-recap",
      "title": "What is Angular CLI?",
      "explanation": `
          <p>The <strong>Angular CLI</strong> is a command-line interface tool that automates the entire development workflow. It handles project initialization, scaffolding (generating components/services), testing, and bundling.</p>
          <p>It abstracts away complex configurations like Webpack, Babel, and TypeScript, allowing developers to focus on writing code rather than managing build tools.</p>
        `,
      "code": "npm install -g @angular/cli  // Install globally\nng new my-project             // Create new app\nng generate component user    // Scaffold code\nng serve                      // Run dev server",
      "language": "bash"
    },
    {
      "id": "ng-build",
      "title": "What is ng build?",
      "explanation": `
          <p>The <strong>ng build</strong> command compiles the application into an output directory. It transforms TypeScript, HTML, and SCSS files into highly optimized JavaScript and CSS bundles that a browser can understand.</p>\n\n          <p>By default, the output is generated in the <code>dist/</code> folder. This folder contains everything needed to host the application on a web server.</p>
        `,
      "code": "// Standard build\nng build\n\n// The output includes:\n// index.html, main.js, polyfills.js, styles.css, etc.",
      "language": "bash",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Build Process</p><div class="flex items-center justify-between max-w-md mx-auto"><div class="bg-indigo-50 border border-indigo-200 p-2 rounded text-[10px]">Source Code (TS/HTML)</div><div class="text-slate-300">&rarr;</div><div class="bg-indigo-600 text-white p-2 rounded text-xs font-bold shadow-md">Angular Compiler</div><div class="text-slate-300">&rarr;</div><div class="bg-emerald-50 border border-emerald-200 p-2 rounded text-[10px]">dist/ (JS/CSS)</div></div></div>`
    },
    {
      "id": "production-build",
      "title": "What is production build?",
      "explanation": `
          <p>A <strong>Production Build</strong> applies advanced optimizations to ensure the application is as small and fast as possible.</p>\n\n          <h3>Key Optimizations</h3>\n          <ul>\n            <li><strong>Minification:</strong> Removes whitespace and renames variables to reduce file size.</li>\n            <li><strong>Uglification:</strong> Obfuscates code structure.</li>\n            <li><strong>Cache Busting:</strong> Adds unique hashes to filenames (e.g., <code>main.7a2f.js</code>) so browsers download new versions after a deployment.</li>\n            <li><strong>Dead Code Elimination:</strong> Removes unreachable code.</li>\n          </ul>\n        `,
      "code": "// Create a production-ready build\nng build --configuration production",
      "language": "bash"
    },
    {
      "id": "environment-configuration",
      "title": "What is environment configuration?",
      "explanation": `
          <p>Angular uses <strong>environment files</strong> to manage different configurations for development, staging, and production. This allows you to use different API URLs or feature flags without changing your code.</p>\n\n          <p>During the build, the Angular CLI replaces the default <code>environment.ts</code> with the specific version (like <code>environment.prod.ts</code>) based on the build configuration.</p>\n        `,
      "code": "// src/environments/environment.prod.ts\nexport const environment = {\n  production: true,\n  apiUrl: 'https://api.myapp.com'\n};\n\n// Usage in service:\nimport { environment } from '../environments/environment';\nthis.http.get(environment.apiUrl + '/users');",
      "language": "typescript"
    },
    {
      "id": "jit-vs-aot",
      "title": "Difference between JIT and AOT compilation",
      "explanation": `
          <p>Angular templates must be compiled into JavaScript before the browser can render them. There are two ways to do this:</p>\n\n          <ul>\n            <li><strong>JIT (Just-in-Time):</strong> The application is compiled <strong>in the browser</strong> at runtime. This was the old default for development.</li>\n            <li><strong>AOT (Ahead-of-Time):</strong> The application is compiled <strong>during the build process</strong>. The browser receives pre-compiled code.</li>\n          </ul>\n\n          <p><strong>AOT is superior</strong> because it catches template errors during the build, reduces the bundle size (no need to ship the compiler), and provides better security by preventing injection attacks.</p>\n        `,
      "code": "// AOT is default in modern Angular (v9+).\n// It results in a faster 'First Meaningful Paint'.",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><div class="grid grid-cols-2 gap-4 text-[10px]"><div class="bg-amber-50 p-2 rounded border border-amber-200"><strong>JIT:</strong> Compile in Browser (Slow startup)</div><div class="bg-emerald-50 p-2 rounded border border-emerald-200"><strong>AOT:</strong> Compile on Machine (Fast startup)</div></div></div>`
    },
    {
      "id": "webpack-in-angular",
      "title": "What is webpack in Angular?",
      "explanation": `
          <p><strong>Webpack</strong> is the underlying module bundler used by the Angular CLI. It takes all your application's modules and their dependencies and bundles them into a small number of static assets.</p>\n\n          <p>While the CLI handles the Webpack configuration for you (hiding the <code>webpack.config.js</code>), it is doing the heavy lifting of resolving imports, loading styles, and processing assets.</p>\n\n          <p><em>Note: Starting with Angular 17, the CLI is transitioning toward <strong>esbuild</strong> and <strong>Vite</strong> for even faster build times.</em></p>
        `,
      "code": "// You usually don't touch Webpack directly in Angular.\n// Customizing it requires 'ngx-build-plus' or 'custom-webpack' builders.",
      "language": "javascript"
    }
  ]
});