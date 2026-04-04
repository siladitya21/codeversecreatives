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
    }
  ]
});