window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "standalone-components",
  "title": "Standalone Components (Angular 14+)",
  "icon": "bi bi-box",
  "questions": [
    {
      "id": "what-are-standalone-components",
      "title": "What are standalone components?",
      "explanation": `
          <p><strong>Standalone components</strong> provide a simplified way to build Angular applications by making <code>NgModule</code> optional. They allow components, directives, and pipes to manage their own dependencies directly in their metadata.</p>
          <h3>Key Characteristics</h3>
          <ul>
            <li><strong>Self-contained:</strong> You specify dependencies in an <code>imports</code> array directly in the component.</li>
            <li><strong>Independent:</strong> They don't need to be declared in any <code>NgModule</code>.</li>
            <li><strong>Lightweight:</strong> Reduces the mental overhead of the Angular module system.</li>
          </ul>
        `,
      "code": "@Component({\n  selector: 'app-user',\n  standalone: true, // Key flag\n  imports: [CommonModule], // Direct dependencies\n  template: `<h1>Hello, {{ name }}</h1>`\n})\nexport class UserComponent {\n  name = 'Angular Expert';\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Architecture Shift</p><div class="grid grid-cols-2 gap-4 text-[10px] text-center"><div class="bg-rose-50 border border-rose-200 p-2 rounded"><strong>Legacy:</strong> Component &rarr; Module &rarr; Root</div><div class="bg-emerald-50 border border-emerald-200 p-2 rounded"><strong>Standalone:</strong> Component &rarr; Root</div></div></div>`
    },
    {
      "id": "how-to-create-standalone",
      "title": "How to create standalone components?",
      "explanation": `
          <p>To create a standalone component, set <code>standalone: true</code> in the <code>@Component</code> decorator. You must then import any other components, directives, or modules your template requires.</p>
        `,
      "code": "// CLI command:\n// ng generate component profile --standalone\n\n@Component({\n  selector: 'app-root',\n  standalone: true,\n  imports: [CommonModule, ProfileComponent, RouterOutlet],\n  template: `<app-profile></app-profile>`\n})\nexport class AppComponent { }",
      "language": "typescript"
    },
    {
      "id": "advantages-standalone",
      "title": "Advantages of standalone components",
      "explanation": `
          <ul>\n            <li><strong>Less Boilerplate:</strong> No more managing massive declaration arrays in <code>AppModule</code>.</li>\n            <li><strong>Simpler Lazy Loading:</strong> You can lazy load a single component directly in the router config using <code>loadComponent</code>.</li>\n            <li><strong>Easier Testing:</strong> <code>TestBed</code> setup becomes much simpler as dependencies are explicit to the component.</li>\n            <li><strong>Tree Shaking:</strong> Build tools can remove unused components more effectively.</li>\n          </ul>\n        `,
      "code": "// Lazy loading a standalone component in the router:\n{\n  path: 'dashboard',\n  loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent)\n}",
      "language": "typescript"
    },
    {
      "id": "bootstrapping-standalone",
      "title": "Bootstrapping standalone components",
      "explanation": `
          <p>In a fully standalone application, you bootstrap the application with the root component directly using <code>bootstrapApplication()</code> in the <code>main.ts</code> file, bypassing the need for a root <code>AppModule</code>.</p>\n        `,
      "code": "// main.ts\nimport { bootstrapApplication } from '@angular/platform-browser';\nimport { AppComponent } from './app/app.component';\nimport { provideRouter } from '@angular/router';\nimport { routes } from './app/app.routes';\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    provideRouter(routes),\n    provideHttpClient()\n  ]\n}).catch(err => console.error(err));",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><div class="max-w-md mx-auto bg-indigo-600 text-white p-3 rounded-lg text-xs font-bold text-center shadow-md">bootstrapApplication(RootComponent)</div></div>`
    }
  ]
});