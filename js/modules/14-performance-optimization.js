window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "performance-optimization",
  "title": "Performance Optimization",
  "icon": "bi bi-speedometer2",
  "questions": [
    {
      "id": "how-to-optimize-angular",
      "title": "How to optimize Angular applications?",
      "explanation": `
          <p>Optimizing an Angular application involves improving both <strong>Load Time</strong> (how fast the app starts) and <strong>Runtime Performance</strong> (how smooth the app feels while running).</p>
          <h3>Key Strategies</h3>
          <ul>
            <li><strong>Lazy Loading:</strong> Load feature modules only when needed.</li>
            <li><strong>AOT Compilation:</strong> Compile templates during the build process.</li>
            <li><strong>OnPush Strategy:</strong> Reduce the frequency of change detection checks.</li>
            <li><strong>trackBy:</strong> Optimize DOM updates in long lists.</li>
            <li><strong>Tree Shaking:</strong> Remove unused code from the final bundle.</li>
          </ul>
        `,
      "code": "// Optimization is a multi-layered approach involving:\n// 1. Better Build (AOT, Tree Shaking)\n// 2. Faster Loading (Lazy Loading, Preloading)\n// 3. Efficient Execution (OnPush, trackBy)",
      "language": "typescript"
    },
    {
      "id": "what-is-lazy-loading",
      "title": "What is lazy loading?",
      "explanation": `
          <p><strong>Lazy Loading</strong> is a technique where feature modules are loaded on demand when the user navigates to a specific route, rather than downloading everything at startup.</p>\n\n          <p>This significantly reduces the initial bundle size and speeds up the "Time to Interactive" for users.</p>
        `,
      "code": "const routes: Routes = [\n  {\n    path: 'admin',\n    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)\n  }\n];",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Lazy Loading Flow</p><div class="flex items-center justify-center gap-4"><div class="bg-indigo-600 text-white p-2 rounded text-xs shadow-md">Main Bundle</div><div class="text-slate-300">&rarr;</div><div class="border-2 border-dashed border-slate-300 p-2 rounded text-xs text-slate-400">Admin Module (Waiting...)</div></div></div>`
    },
    {
      "id": "what-is-aot",
      "title": "What is ahead-of-time (AOT) compilation?",
      "explanation": `
          <p>Angular provides two ways to compile templates: <strong>JIT</strong> (Just-in-Time) and <strong>AOT</strong> (Ahead-of-Time).</p>\n\n          <p>With <strong>AOT</strong>, the compiler runs once at <strong>build time</strong>. This means the browser downloads pre-compiled code, leading to faster rendering and smaller downloads (since the compiler itself isn't shipped to the browser).</p>\n\n          <p><em>Modern Angular versions use AOT by default for production builds.</em></p>
        `,
      "code": "// Command to build with AOT:\n// ng build --configuration production",
      "language": "bash"
    },
    {
      "id": "what-is-tree-shaking",
      "title": "What is tree shaking?",
      "explanation": `
          <p><strong>Tree Shaking</strong> is a step in the build process that removes unused code from your final JavaScript bundles. It "shakes" the dependency tree and drops any functions or classes that are imported but never actually called.</p>\n\n          <p>This is made possible by the static nature of ES6 <code>import</code> and <code>export</code> statements.</p>
        `,
      "code": "// If you import a library but only use one function:\nimport { map } from 'rxjs'; // Only 'map' is included, other operators are 'shaken' out.",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><div class="max-w-md mx-auto bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center"><p class="text-xs font-bold text-emerald-700">Code Source &rarr; Tree Shaker &rarr; Lean Bundle</p></div></div>`
    },
    {
      "id": "what-is-trackby",
      "title": "What is trackBy in ngFor?",
      "explanation": `
          <p>When an array changes, <code>*ngFor</code> normally destroys and recreates all DOM elements in the list. This is expensive for large lists.</p>\n\n          <p>The <strong>trackBy</strong> function tells Angular how to track the identity of items (e.g., using a unique ID). This allows Angular to <strong>reuse</strong> existing DOM elements and only update the ones that actually changed.</p>
        `,
      "code": "<!-- Template -->\n<li *ngFor=\"let item of items; trackBy: trackById\">{{ item.name }}</li>\n\n// Component\ntrackById(index: number, item: any) {\n  return item.id; // Unique identifier\n}",
      "language": "typescript"
    },
    {
      "id": "what-is-onpush",
      "title": "What is OnPush change detection strategy?",
      "explanation": `
          <p>By default, Angular checks every component on every change detection cycle. The <strong>OnPush</strong> strategy tells Angular to skip a component's check unless its <code>@Input</code> references change or an event is fired within it.</p>\n\n          <p>This significantly reduces the work Angular has to do, especially in complex component trees.</p>
        `,
      "code": "@Component({\n  selector: 'app-user-list',\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  template: `...`\n})\nexport class UserListComponent { }",
      "language": "typescript"
    },
    {
      "id": "how-to-reduce-bundle-size",
      "title": "How to reduce bundle size?",
      "explanation": `
          <p>Reducing bundle size is critical for mobile users and slow connections.</p>\n\n          <ul>\n            <li>Use <strong>Lazy Loading</strong> for feature modules.</li>\n            <li>Analyze the bundle using <code>webpack-bundle-analyzer</code>.</li>\n            <li>Avoid importing entire libraries (like <code>lodash</code>) if you only need a few functions.</li>\n            <li>Use <strong>Production Mode</strong> (<code>--configuration production</code>) to enable minification and dead code removal.</li>\n            <li>Check <code>package.json</code> for heavy or redundant dependencies.</li>\n          </ul>\n        `,
      "code": "// Analyze command:\n// ng build --stats-json\n// npx webpack-bundle-analyzer dist/stats.json",
      "language": "bash"
    },
    {
      "id": "what-is-preloading",
      "title": "What is preloading strategy?",
      "explanation": `
          <p>Lazy loading is great, but it causes a delay when the user clicks a route for the first time. <strong>Preloading</strong> solves this by downloading lazy modules in the background <strong>after</strong> the initial app has loaded.</p>\n\n          <p>The <code>PreloadAllModules</code> strategy is commonly used to ensure all lazy routes are ready when the user needs them, without slowing down the initial startup.</p>\n        `,
      "code": "import { PreloadAllModules, RouterModule } from '@angular/router';\n\nRouterModule.forRoot(routes, {\n  preloadingStrategy: PreloadAllModules\n})",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Preloading Behavior</p><div class="flex flex-col items-center gap-2"><div class="bg-indigo-600 text-white p-2 rounded text-xs">1. Load Main App</div><div class="text-slate-300">&darr;</div><div class="bg-emerald-500 text-white p-2 rounded text-xs">2. Background: Fetch Lazy Modules</div></div></div>`
    }
  ]
});