window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "advanced-concepts",
  "title": "Advanced Concepts",
  "icon": "bi bi-rocket-takeoff",
  "questions": [
    {
      "id": "angular-universal-ssr",
      "title": "What is Angular Universal (SSR)?",
      "explanation": `
          <p><strong>Angular Universal</strong> (now referred to simply as <strong>Angular SSR</strong>) is a technology that renders Angular applications on the <strong>server</strong> instead of the client browser.</p>
          <h3>Benefits</h3>
          <ul>
            <li><strong>SEO:</strong> Search engines can easily crawl the page because the content is already in the HTML.</li>
            <li><strong>Performance:</strong> Faster "First Contentful Paint" as the user sees a rendered page immediately.</li>
            <li><strong>Social Sharing:</strong> Social media crawlers can see titles and images in the meta tags.</li>
          </ul>
        `,
      "code": "// To add SSR to a project:\n// ng add @angular/ssr",
      "language": "bash",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">SSR vs CSR</p><div class="grid grid-cols-2 gap-4 text-[10px]"><div class="bg-indigo-50 p-2 rounded"><strong>Server:</strong> Generates HTML &rarr; Sent to Browser</div><div class="bg-emerald-50 p-2 rounded"><strong>Client:</strong> Downloads JS &rarr; Renders in Browser</div></div></div>`
    },
    {
      "id": "angular-cli",
      "title": "What is Angular CLI?",
      "explanation": `
          <p>The <strong>Angular CLI</strong> (Command Line Interface) is the official tool used to initialize, develop, scaffold, and maintain Angular applications directly from a terminal.</p>\n\n          <p>It automates tasks like creating components, running tests, building for production, and performing updates.</p>
        `,
      "code": "ng new my-app      // Create project\nng generate c user // Create component\nng build --prod    // Build for production",
      "language": "bash"
    },
    {
      "id": "what-are-schematics",
      "title": "What are schematics?",
      "explanation": `
          <p><strong>Schematics</strong> are a workflow tool that allows for modern web automation. They are used by the Angular CLI to perform code transformations, such as generating a new component or updating your project's dependencies during <code>ng update</code>.</p>
        `,
      "code": "// Schematics power the 'ng generate' commands.\n// You can also create custom schematics to enforce team standards.",
      "language": "typescript"
    },
    {
      "id": "angular-elements",
      "title": "What is Angular Elements?",
      "explanation": `
          <p><strong>Angular Elements</strong> is a package that allows you to package Angular components as <strong>Custom Elements</strong> (Web Components). These can be used in non-Angular environments (like a plain HTML page or a React app).</p>
        `,
      "code": "const el = createCustomElement(MyComponent, { injector });\ncustomElements.define('my-popup', el);",
      "language": "typescript"
    },
    {
      "id": "view-encapsulation",
      "title": "What is ViewEncapsulation?",
      "explanation": `
          <p><strong>ViewEncapsulation</strong> determines whether a component's styles are scoped to that component or if they "leak" into the rest of the application.</p>\n\n          <ul>\n            <li><strong>Emulated (Default):</strong> Angular modifies CSS selectors to scope styles (using attributes like <code>_ngcontent-c1</code>).</li>\n            <li><strong>ShadowDom:</strong> Uses the browser's native Shadow DOM.</li>\n            <li><strong>None:</strong> Styles are global and affect the entire page.</li>\n          </ul>\n        `,
      "code": "@Component({\n  selector: 'app-card',\n  encapsulation: ViewEncapsulation.Emulated // or None, ShadowDom\n})",
      "language": "typescript"
    },
    {
      "id": "shadow-dom",
      "title": "What is Shadow DOM?",
      "explanation": `
          <p><strong>Shadow DOM</strong> is a web standard that provides encapsulation for JavaScript, CSS, and HTML. It allows a component to have its own "hidden" DOM tree that cannot be accidentally accessed or styled by the main document.</p>
        `,
      "code": "// This is a browser-level feature used by Angular\n// when using ViewEncapsulation.ShadowDom",
      "language": "javascript",
      "diagram": `<div class="diagram-wrap"><div class="max-w-md mx-auto bg-slate-800 text-white rounded-lg p-3 text-[10px] font-mono">#shadow-root (open)<br/>&nbsp;&nbsp;&lt;style&gt;...&lt;/style&gt;<br/>&nbsp;&nbsp;&lt;div&gt;Internal Content&lt;/div&gt;</div></div>`
    },
    {
      "id": "content-projection",
      "title": "What is Content Projection (ng-content)?",
      "explanation": `
          <p><strong>Content Projection</strong> is a pattern in which you insert (project) external HTML content into a specific place inside a component's template using the <code>&lt;ng-content&gt;</code> tag.</p>
        `,
      "code": "<!-- Child Template -->\n<div class=\"card\">\n  <ng-content></ng-content>\n</div>\n\n<!-- Parent Usage -->\n<app-card> <p>This text is projected!</p> </app-card>",
      "language": "html",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Projection Slot</p><div class="flex items-center justify-center gap-3"><div class="bg-indigo-100 p-2 rounded text-[10px]">Parent HTML</div><div class="text-indigo-400 font-bold">&rarr;</div><div class="bg-indigo-600 text-white p-2 rounded font-mono text-[10px]">&lt;ng-content&gt;</div></div></div>`
    },
    {
      "id": "dynamic-components",
      "title": "What are dynamic components?",
      "explanation": `
          <p><strong>Dynamic Components</strong> are components that are not hardcoded into a template but are instead instantiated at <strong>runtime</strong> using the <code>ViewContainerRef</code>.</p>
        `,
      "code": "constructor(private vcr: ViewContainerRef) {}\n\nload() {\n  this.vcr.clear();\n  this.vcr.createComponent(AdComponent);\n}",
      "language": "typescript"
    },
    {
      "id": "renderer2",
      "title": "What is renderer2?",
      "explanation": `
          <p><strong>Renderer2</strong> is an abstraction provided by Angular to manipulate the DOM safely. It is preferred over direct DOM access (like <code>document.querySelector</code>) because it works even in non-browser environments like <strong>SSR</strong> or Web Workers.</p>\n        `,
      "code": "constructor(private renderer: Renderer2, private el: ElementRef) {}\n\naddClass() {\n  this.renderer.addClass(this.el.nativeElement, 'active');\n}",
      "language": "typescript"
    },
    {
      "id": "hostlistener-hostbinding",
      "title": "What is HostListener and HostBinding?",
      "explanation": `
          <ul>\n            <li><strong>@HostBinding:</strong> Binds a component/directive property to a property of the host element (e.g., binding a class or style).</li>\n            <li><strong>@HostListener:</strong> Listens to events triggered by the host element (e.g., clicks, mouse hovers).</li>\n          </ul>\n        `,
      "code": "@HostBinding('class.active') isActive = true;\n\n@HostListener('mouseenter') \nonHover() { this.isActive = true; }",
      "language": "typescript"
    },
    {
      "id": "template-reference-variables",
      "title": "What are template reference variables?",
      "explanation": `
          <p><strong>Template reference variables</strong> (defined with <code>#varName</code>) allow you to reference a DOM element or an Angular component/directive within the same template.</p>\n        `,
      "code": "<input #userPhone placeholder=\"phone\" />\n<button (click)=\"call(userPhone.value)\">Call</button>",
      "language": "html"
    },
    {
      "id": "ngtemplateoutlet",
      "title": "What is ngTemplateOutlet?",
      "explanation": `
          <p><strong>ngTemplateOutlet</strong> is a structural directive used to insert an <code>&lt;ng-template&gt;</code> into a specific part of the view. It is very useful for creating highly reusable and customizable components.</p>\n        `,
      "code": "<ng-container *ngTemplateOutlet=\"myTemplate; context: myData\"></ng-container>\n\n<ng-template #myTemplate let-name=\"name\">\n  <p>Hello {{ name }}!</p>\n</ng-template>",
      "language": "html"
    }
  ]
});