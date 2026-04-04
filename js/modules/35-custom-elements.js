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
            <li><strong>CMS Systems:</strong> Integrate into content management systems.</li>
          </ul>
          <p>This allows for highly reusable UI widgets that can be developed and maintained within the Angular ecosystem but consumed universally.</p>
        `,
      "code": "<!-- In a non-Angular HTML file -->\n<!DOCTYPE html>\n<html>\n<head>\n  <title>External App</title>\n  <script src=\"./my-angular-element.js\"></script> <!-- Bundled Angular Element -->\n</head>\n<body>\n  <h1>Welcome to my external app!</h1>\n  <my-custom-element name=\"World\"></my-custom-element>\n</body>\n</html>",
      "language": "html",
      "diagram": `<div class="diagram-wrap"><div class="max-w-md mx-auto bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center"><p class="text-xs font-bold text-emerald-700">Angular Component &rarr; Web Component</p><p class="text-[10px] text-slate-500 mt-2">Use in React, Vue, plain HTML, etc.</p></div></div>`
    }
  ]
});