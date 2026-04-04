window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "custom-elements",
  "title": "Custom Elements",
  "icon": "bi bi-puzzle-fill",
  "questions": [
    {
      "id": "how-to-create-custom-elements",
      "title": "How to create custom elements?",
      "explanation": `
          <p><strong>Custom Elements</strong> are a Web Standard that allows you to define your own HTML tags (e.g., <code>&lt;my-button&gt;</code>). They are framework-agnostic and can be used in any web environment.</p>
          <p>Angular provides the <code>@angular/elements</code> package to easily convert an Angular component into a Custom Element.</p>
          <h3>Steps</h3>
          <ol>
            <li>Create an Angular component.</li>
            <li>Use <code>createCustomElement()</code> to convert it.</li>
            <li>Register it with the browser using <code>customElements.define()</code>.</li>
          </ol>
        `,
      "code": "import { createCustomElement } from '@angular/elements';\nimport { Injector } from '@angular/core';\n\n// In your AppModule or main.ts\nconstructor(injector: Injector) {\n  const MyCustomElement = createCustomElement(MyComponent, { injector });\n  customElements.define('my-custom-element', MyCustomElement);\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Angular Component to Custom Element</p><div class="flex items-center justify-between max-w-md mx-auto"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-indigo-700">Angular Component</p></div><div class="text-slate-300">&rarr;</div><div class="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-amber-700">createCustomElement()</p></div><div class="text-slate-300">&rarr;</div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-emerald-700">Web Component</p></div></div></div>`
    },
    {
      "id": "angular-elements-package",
      "title": "What is @angular/elements package?",
      "explanation": `
          <p>The <strong><code>@angular/elements</code></strong> package provides the necessary utilities to transform Angular components into Web Components (Custom Elements).</p>\n\n          <p>It acts as a bridge, wrapping an Angular component and its change detection mechanism within a browser-native Custom Element, allowing it to function correctly even when embedded in non-Angular applications.</p>\n        `,
      "code": "// Add to your project:\n// ng add @angular/elements\n\n// Key function:\nimport { createCustomElement } from '@angular/elements';",
      "language": "bash"
    },
    {
      "id": "using-angular-components-outside-angular",
      "title": "Using Angular components outside Angular",
      "explanation": `
          <p>Once an Angular component is converted into a Custom Element, it can be used like any other HTML tag in various environments:</p>
          <ul>
            <li><strong>Plain HTML/JavaScript:</strong> Directly in an <code>index.html</code> file.</li>
            <li><strong>Other Frameworks:</strong> Embed in React, Vue, or jQuery applications.</li>
            <li><strong>CMS Systems:</strong> Integrate into content management systems.</li>\
          </ul>
          <p>This allows for highly reusable UI widgets that can be developed and maintained within the Angular ecosystem but consumed universally.</p>\
        `,
      "code": "<!-- In a non-Angular HTML file -->\n<!DOCTYPE html>\n<html>\n<head>\n  <title>External App</title>\n  <script src=\"./my-angular-element.js\"></script> <!-- Bundled Angular Element -->\n</head>\n<body>\n  <h1>Welcome to my external app!</h1>\n  <my-custom-element name=\"World\"></my-custom-element>\n</body>\n</html>",
      "language": "html",
      "diagram": `<div class="diagram-wrap"><div class="max-w-md mx-auto bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center"><p class="text-xs font-bold text-emerald-700">Angular Component &rarr; Web Component</p><p class="text-[10px] text-slate-500 mt-2">Use in React, Vue, plain HTML, etc.</p></div></div>`
    },
    {
      "id": "input-output-custom-elements",
      "title": "@Input and @Output in custom elements",
      "explanation": `
          <p>Custom Elements (Web Components) created from Angular components inherit the <code>@Input</code> and <code>@Output</code> properties, but they work differently:</p>\n\n          <h3>@Input in Custom Elements</h3>\n          <ul>\n            <li>Become <strong>properties</strong> on the custom element.</li>\n            <li>Can be set via attributes (<code>&lt;my-element name=\"John\"&gt;</code>) or properties (<code>element.name = 'John'</code>).</li>\n            <li>String attributes are automatically bound to properties.</li>\n          </ul>\n\n          <h3>@Output in Custom Elements</h3>\n          <ul>\n            <li>Become <strong>custom DOM events</strong>.</li>\n            <li>Can be listened to using standard <code>addEventListener()</code> in plain JavaScript.</li>\n          </ul>\n        `,
      "code": "// Angular Component\n@Component({\n  selector: 'app-greeting',\n  template: `<button (click)=\"greet()\">Say {{ greeting }}</button>`\n})\nexport class GreetingComponent {\n  @Input() greeting = 'Hello';\n  @Output() greeted = new EventEmitter<string>();\n\n  greet() {\n    this.greeted.emit(this.greeting);\n  }\n}\n\n// Convert to custom element:\ncustomElements.define('app-greeting', createCustomElement(GreetingComponent, { injector }));\n\n// Use in plain HTML\nconst element = document.querySelector('app-greeting');\nelement.greeting = 'Hi'; // Set @Input via property\nelement.addEventListener('greeted', (e) => {\n  console.log('Greeted event:', e.detail); // @Output event\n});",
      "language": "typescript",
      "diagram": `<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Custom Element Properties & Events</p><div class=\"grid grid-cols-2 gap-4 max-w-md mx-auto\"><div class=\"bg-indigo-50 border border-indigo-200 p-2 rounded text-center\"><p class=\"text-xs font-bold text-indigo-700\">@Input &rarr; Property</p><p class=\"text-[10px] text-slate-500 mt-1\">element.property = value</p></div><div class=\"bg-emerald-50 border border-emerald-200 p-2 rounded text-center\"><p class=\"text-xs font-bold text-emerald-700\">@Output &rarr; Event</p><p class=\"text-[10px] text-slate-500 mt-1\">addEventListener()</p></div></div></div>`
    },
    {
      "id": "bundling-custom-elements",
      "title": "Bundling and distributing custom elements",
      "explanation": `
          <p>When converting Angular components to custom elements, you often want to package them as standalone scripts for distribution (e.g., npm packages or CDN links).</p>\n\n          <h3>Bundling Strategy</h3>\n          <ul>\n            <li><strong>Single Bundle:</strong> Bundle the component, Angular core, and all dependencies into a single JavaScript file.</li>\n            <li><strong>Lazy Chunks:</strong> Split large applications into separate bundles that load on demand.</li>\n            <li><strong>Minification & Tree-shaking:</strong> Optimize the bundle size for production.</li>\n            <li><strong>NPM Package:</strong> Publish the bundled custom elements to npm for easy reuse.</li>\n          </ul>\n        `,
      "code": "// Building custom elements for distribution:\n// 1. Build with Ivy engine (default in modern Angular)\n// ng build --prod --output-hashing=none\n\n// 2. Concatenate bundles for single-file distribution\n// cat dist/my-elements/runtime.js dist/my-elements/main.js > custom-elements.min.js\n\n// 3. Package for npm\n// {\n//   \"name\": \"@myorg/custom-elements\",\n//   \"main\": \"dist/custom-elements.min.js\",\n//   \"types\": \"dist/index.d.ts\"\n// }\n\n// Usage in consumer apps:\n// <script src=\"https://cdn.example.com/custom-elements.min.js\"></script>\n// <my-custom-element></my-custom-element>",
      "language": "bash",
      "diagram": `<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Custom Elements Distribution</p><div class=\"flex flex-col items-center gap-2\"><div class=\"bg-indigo-50 border border-indigo-200 p-2 rounded text-xs\">Angular Components</div><div class=\"text-slate-300\">↓</div><div class=\"bg-amber-50 border border-amber-200 p-2 rounded text-xs\">createCustomElement()</div><div class=\"text-slate-300\">↓</div><div class=\"bg-emerald-50 border border-emerald-200 p-2 rounded text-xs\">Bundle & Minify</div><div class=\"text-slate-300\">↓</div><div class=\"bg-rose-50 border border-rose-200 p-2 rounded text-xs\">Publish to CDN/NPM</div></div></div>`
    },
    {
      "id": "custom-elements-best-practices",
      "title": "Custom elements best practices",
      "explanation": `
          <p>When creating and deploying custom elements, follow these best practices to ensure reliability, maintainability, and compatibility:</p>\n\n          <ul>\n            <li><strong>Semantic Naming:</strong> Prefix your custom element name (e.g., <code>my-org-button</code>) to avoid conflicts with other libraries.</li>\n            <li><strong>Encapsulation:</strong> Use Shadow DOM for style encapsulation to prevent external styles from affecting the component.</li>\n            <li><strong>Documentation:</strong> Document all properties, events, and usage examples clearly.</li>\n            <li><strong>Attribute Binding:</strong> Support both attribute and property binding for maximum flexibility.</li>\n            <li><strong>Error Handling:</strong> Implement robust error handling for edge cases and invalid inputs.</li>\n            <li><strong>Versioning:</strong> Use semantic versioning when releasing updates and document breaking changes.</li>\n            <li><strong>Bundle Size:</strong> Monitor and optimize bundle size, especially if distributing via CDN.</li>\n          </ul>\n        `,
      "code": "// Best practices example:\n@Component({\n  selector: 'my-org-button',\n  template: `\n    <button \n      [attr.aria-label]=\"ariaLabel\"\n      [disabled]=\"disabled\"\n      (click)=\"onClick()\">\n      <ng-content></ng-content>\n    </button>\n  `,\n  encapsulation: ViewEncapsulation.ShadowDom, // Encapsulate styles\n  styleUrls: ['./button.component.css']\n})\nexport class MyOrgButtonComponent {\n  @Input() disabled = false;\n  @Input() ariaLabel = 'Button';\n  @Output() clicked = new EventEmitter<void>();\n\n  onClick() {\n    if (!this.disabled) {\n      this.clicked.emit();\n    }\n  }\n}\n\n// Usage:\n// <my-org-button ariaLabel=\"Submit\" (clicked)=\"onSubmit()\">Submit Form</my-org-button>",
      "language": "typescript",
      "diagram": `<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Custom Element Checklist</p><div class=\"flex flex-col gap-2 max-w-md mx-auto\"><div class=\"flex items-center gap-2 text-xs\"><span class=\"text-emerald-600 font-bold\">✓</span> <span>Semantic naming with prefix</span></div><div class=\"flex items-center gap-2 text-xs\"><span class=\"text-emerald-600 font-bold\">✓</span> <span>Shadow DOM for encapsulation</span></div><div class=\"flex items-center gap-2 text-xs\"><span class=\"text-emerald-600 font-bold\">✓</span> <span>Documented API & events</span></div><div class=\"flex items-center gap-2 text-xs\"><span class=\"text-emerald-600 font-bold\">✓</span> <span>Optimized bundle size</span></div><div class=\"flex items-center gap-2 text-xs\"><span class=\"text-emerald-600 font-bold\">✓</span> <span>Semantic versioning</span></div></div></div>`
    }
  ]
});