window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "custom-elements",
  "title": "Custom Elements (Angular Elements)",
  "icon": "bi bi-puzzle-fill",
  "questions": [
    {
      "id": "what-are-custom-elements",
      "title": "What are Custom Elements and why use Angular Elements?",
      "explanation": `
          <p><strong>Custom Elements</strong> are part of the Web Components standard — a set of browser APIs that let you define your own HTML tags (<code>&lt;my-button&gt;</code>, <code>&lt;user-card&gt;</code>) that behave like built-in elements. The browser registers them via <code>customElements.define('my-tag', MyClass)</code>, and from that point any HTML that contains <code>&lt;my-tag&gt;</code> automatically instantiates and renders the component — no framework needed to consume it.</p>

          <p><strong>Angular Elements</strong> (<code>@angular/elements</code>) is the bridge between Angular's component model and the browser's Custom Elements API. It wraps an Angular component in a Custom Element shell, translating Angular's <code>@Input()</code> properties to HTML attributes and DOM properties, and Angular's <code>@Output()</code> event emitters to DOM Custom Events that any JavaScript — or no JavaScript — can listen to.</p>

          <h3>Why Would You Use This?</h3>
          <p>The primary use case is <strong>incremental adoption and interoperability</strong>. If you have an existing application built in React, Vue, plain JavaScript, or a server-rendered system (Drupal, Joomla, Django), you can build new UI widgets in Angular and drop them into the existing app as Web Components without rewriting anything. The Angular component renders and functions exactly as it would in a full Angular application — change detection, DI, animations, Material — but the host application only needs to include the bundled script and use the tag.</p>

          <h3>When Not to Use Angular Elements</h3>
          <p>Angular Elements carry the full Angular runtime in their bundle (~100KB gzipped minimum). If you are embedding a single simple widget, this overhead may be excessive. Angular Elements are best justified when you are distributing a suite of related components (a design system, a rich editor, a reporting widget library) where the runtime cost is amortized across many components.</p>
        `,
      "code": "// The value proposition in one sentence:\n// Build a component once in Angular → deploy it everywhere\n\n// Consumers can use the element in any context:\n\n// ---- In a React application ----\nfunction App() {\n  return (\n    <div>\n      <h1>React App</h1>\n      {/* Angular Element — no React wrappers needed */}\n      <my-rating-widget value=\"4\" />\n    </div>\n  );\n}\n\n// ---- In a Django/Jinja2 template ----\n// {% extends 'base.html' %}\n// {% block content %}\n// <my-rating-widget value=\"{{ product.rating }}\"></my-rating-widget>\n// {% endblock %}\n\n// ---- In a plain HTML file ----\n// <script src=\"my-angular-elements.js\"></script>\n// <my-rating-widget value=\"3\"></my-rating-widget>\n// <script>\n//   document.querySelector('my-rating-widget')\n//     .addEventListener('ratingChange', e => console.log(e.detail));\n// </script>",
      "language": "typescript"
    },
    {
      "id": "how-to-create-custom-elements",
      "title": "Creating Angular Elements — step by step",
      "explanation": `
          <p>Converting an Angular component into a Custom Element requires three steps: install <code>@angular/elements</code>, call <code>createCustomElement()</code> with the component class and an injector, and register the result with the browser via <code>customElements.define()</code>. In a standalone Angular application, the most natural place to do this is in <code>main.ts</code> right after <code>bootstrapApplication()</code> resolves.</p>

          <h3>The createCustomElement() Function</h3>
          <p><code>createCustomElement(MyComponent, { injector })</code> returns a class that extends <code>HTMLElement</code>. Angular uses the component's metadata (inputs, outputs, selector) to automatically generate the Web Component's attribute-to-property mapping and event dispatch logic. The <code>injector</code> argument is what gives the element access to Angular's DI system — services, HTTP client, router, and everything else in the DI tree are available inside the element just as in a normal component.</p>

          <h3>Bootstrap Strategy</h3>
          <p>When you are building an app that <em>is</em> a collection of Angular Elements (with no app shell of its own), the standalone bootstrap may need to use an invisible root component just to create the Angular platform and DI context before registering the elements. Alternatively, use <code>createApplication()</code> from <code>@angular/platform-browser</code> (Angular 14+) which creates an application context without rendering a root component — cleaner for element-only bundles.</p>
        `,
      "code": "// ---- Step 1: Install ----\n// ng add @angular/elements\n\n// ---- Step 2: Define the Angular component ----\nimport { Component, Input, Output, EventEmitter } from '@angular/core';\nimport { NgFor, NgClass } from '@angular/common';\n\n@Component({\n  selector: 'my-rating-widget',\n  standalone: true,\n  imports: [NgFor, NgClass],\n  template: `\n    <div class=\"stars\" [attr.aria-label]=\"'Rating: ' + value + ' out of 5'\">\n      @for (star of stars; track star) {\n        <button\n          class=\"star\"\n          [class.filled]=\"star <= value\"\n          [attr.aria-label]=\"'Rate ' + star\"\n          (click)=\"setRating(star)\">\n          ★\n        </button>\n      }\n    </div>\n  `,\n  styles: [`:host { display: inline-flex; gap: 4px; }\n            .star { font-size: 24px; cursor: pointer; border: none; background: none; }\n            .filled { color: gold; }`]\n})\nexport class RatingWidgetComponent {\n  stars = [1, 2, 3, 4, 5];\n\n  @Input() value = 0;\n  @Output() ratingChange = new EventEmitter<number>();\n\n  setRating(star: number): void {\n    this.value = star;\n    this.ratingChange.emit(star);\n  }\n}\n\n// ---- Step 3: Register as a Custom Element in main.ts ----\nimport { createApplication } from '@angular/platform-browser';\nimport { createCustomElement } from '@angular/elements';\n\n// createApplication() creates a DI context without a root component\ncreateApplication().then(appRef => {\n  const injector = appRef.injector;\n\n  const RatingElement = createCustomElement(RatingWidgetComponent, { injector });\n  customElements.define('my-rating-widget', RatingElement);\n\n  // Register multiple elements from one bundle:\n  // customElements.define('my-badge', createCustomElement(BadgeComponent, { injector }));\n  // customElements.define('my-tooltip', createCustomElement(TooltipComponent, { injector }));\n});",
      "language": "typescript"
    },
    {
      "id": "input-output-custom-elements",
      "title": "@Input and @Output in Custom Elements — the translation layer",
      "explanation": `
          <p>When Angular wraps a component as a Custom Element, it automatically translates between Angular's component model and the Web Component API. Understanding this translation is essential for consumers of your element who may not be using Angular.</p>

          <h3>@Input → HTML Attribute + DOM Property</h3>
          <p>Each <code>@Input()</code> on the Angular component becomes both an HTML attribute and a JavaScript DOM property on the Custom Element. Setting the attribute (<code>&lt;my-widget value="4"&gt;</code>) works for string values. For complex values (objects, arrays), use the DOM property (<code>element.data = { items: [...] }</code>) because HTML attributes can only carry strings. Angular Elements handles the synchronization between attribute and property automatically for primitive types.</p>

          <h3>@Output → CustomEvent</h3>
          <p>Each <code>@Output()</code> EventEmitter becomes a DOM <code>CustomEvent</code>. When the Angular component calls <code>this.ratingChange.emit(4)</code>, the Custom Element dispatches a <code>CustomEvent</code> with the name <code>'ratingChange'</code> and the emitted value in <code>event.detail</code>. Consumers listen with <code>element.addEventListener('ratingChange', handler)</code> or, in HTML, <code>onratingChange="..."</code>. Note the camelCase-to-lowercase mapping: Angular's event name is used as-is for the DOM event name.</p>

          <h3>Angular 16+ Signal Inputs</h3>
          <p>Signal-based inputs (<code>input()</code>, <code>input.required()</code>) are also supported by Angular Elements. They map to attributes and DOM properties the same way as decorator-based <code>@Input()</code>. The component internally uses signals, but the Custom Element API surface is identical from the consumer's perspective.</p>
        `,
      "code": "// ---- Component with various input/output types ----\nimport { Component, Input, Output, EventEmitter, input, output } from '@angular/core';\n\ninterface ProductConfig { id: number; currency: string; }\n\n@Component({\n  selector: 'my-price-display',\n  standalone: true,\n  template: `\n    <div class=\"price\">\n      {{ config?.currency || '$' }}{{ amount }}\n      <button (click)=\"addToCart()\">Add to Cart</button>\n    </div>\n  `\n})\nexport class PriceDisplayComponent {\n  // Primitive @Input — works as HTML attribute (string) or DOM property\n  @Input() amount = 0;\n\n  // Object @Input — must be set as DOM property, not HTML attribute\n  @Input() config?: ProductConfig;\n\n  // @Output — becomes CustomEvent named 'cartAdd'\n  @Output() cartAdd = new EventEmitter<{ amount: number; currency: string }>();\n\n  addToCart(): void {\n    this.cartAdd.emit({ amount: this.amount, currency: this.config?.currency ?? 'USD' });\n  }\n}\n\n// ---- Consumer in plain JavaScript ----\nconst priceEl = document.querySelector('my-price-display');\n\n// Primitive: set via attribute OR property\npriceEl.setAttribute('amount', '29.99');  // attribute (string only)\npriceEl.amount = 29.99;                   // property (number — preferred)\n\n// Object: must use property (not attribute)\npriceEl.config = { id: 42, currency: 'EUR' };\n\n// Listen to @Output events\npriceEl.addEventListener('cartAdd', (event) => {\n  const { amount, currency } = event.detail;\n  console.log(`Added ${currency}${amount} to cart`);\n});\n\n// ---- In React (property binding with ref) ----\n// function ProductCard({ product }) {\n//   const ref = useRef(null);\n//   useEffect(() => {\n//     ref.current.config = product.config; // object property\n//     ref.current.addEventListener('cartAdd', handleAdd);\n//     return () => ref.current.removeEventListener('cartAdd', handleAdd);\n//   }, []);\n//   return <my-price-display ref={ref} amount={product.price} />;\n// }",
      "language": "typescript"
    },
    {
      "id": "bundling-custom-elements",
      "title": "Building a distributable Custom Elements bundle",
      "explanation": `
          <p>An Angular Elements project is built like any Angular application with <code>ng build</code>, but the output strategy differs from a typical SPA. Instead of an app that loads in a browser tab, you want a single JavaScript file that can be included via a <code>&lt;script&gt;</code> tag in any page. Several considerations apply.</p>

          <h3>Disabling Output Hashing</h3>
          <p>Normal Angular builds use content hashing in filenames (<code>main.abc123.js</code>) for cache busting. For a distributable element bundle, you want predictable filenames so consumers can reference a stable URL. Use <code>outputHashing: 'none'</code> in the <code>angular.json</code> build configuration, or pass <code>--output-hashing=none</code> on the command line.</p>

          <h3>Single-File Concatenation</h3>
          <p>Angular's build produces multiple chunks. For distribution, it is more convenient to concatenate them into a single file. You can do this with a post-build script or, in Angular 17+ with the Application Builder (esbuild), configure a single output bundle. The single-file approach simplifies the consumer's integration: one <code>&lt;script&gt;</code> tag and the element is ready.</p>

          <h3>Bundle Size</h3>
          <p>Every Angular Elements bundle includes the full Angular runtime. For an element with no large dependencies, a compressed bundle is typically 80–120KB gzipped. If you distribute multiple elements, consider whether they should share the Angular runtime (one bundle for all elements, registered at load time) or be fully independent (each element is self-contained, runtime duplicated). Sharing one bundle is almost always preferable for production.</p>
        `,
      "code": "# ---- angular.json build configuration for elements distribution ----\n# Under \"projects\" → \"my-elements\" → \"architect\" → \"build\" → \"configurations\":\n{\n  \"production\": {\n    \"outputHashing\": \"none\",    // predictable filenames for CDN references\n    \"optimization\": true,\n    \"sourceMap\": false,\n    \"namedChunks\": false,\n    \"budgets\": [\n      { \"type\": \"initial\", \"maximumWarning\": \"500kb\", \"maximumError\": \"1mb\" }\n    ]\n  }\n}\n\n# ---- Build ----\nng build --configuration production\n# Output: dist/my-elements/\n# ├── main.js      ← the bundle (Angular runtime + all elements)\n# ├── polyfills.js ← web components polyfill for older browsers\n# └── styles.css   ← if the elements use stylesheets\n\n# ---- Post-build: concatenate into one distributable file ----\n# package.json scripts:\n# \"build:elements\": \"ng build --configuration production && node concat-bundles.js\"\n\n# concat-bundles.js:\nconst fs = require('fs');\nconst dist = 'dist/my-elements';\nconst files = ['polyfills.js', 'main.js'];\nconst output = files.map(f => fs.readFileSync(`${dist}/${f}`, 'utf-8')).join('\\n');\nfs.writeFileSync(`${dist}/elements.min.js`, output);\nconsole.log('Bundle created: elements.min.js');\n\n# ---- Consumer integration ----\n# CDN:\n# <script src=\"https://cdn.myorg.com/elements/1.2.0/elements.min.js\"></script>\n# <my-rating-widget value=\"4\"></my-rating-widget>\n\n# npm package:\n# npm install @myorg/angular-elements\n# import '@myorg/angular-elements';  // registers the custom elements\n# // Then use in templates or HTML",
      "language": "bash"
    },
    {
      "id": "custom-elements-best-practices",
      "title": "Angular Elements best practices and gotchas",
      "explanation": `
          <p>Angular Elements work well but come with specific constraints that arise from bridging two different component models. Being aware of these before you start saves painful debugging later.</p>

          <h3>Use a Vendor Prefix</h3>
          <p>Custom Element tag names must contain a hyphen (this is required by the spec to avoid conflicts with future built-in HTML elements). Always use a vendor or project prefix: <code>myorg-button</code>, <code>ds-card</code>, <code>acme-search</code>. Do not use single-word names like <code>button</code> (not valid) or unprefixed names that might clash with another library or future HTML spec.</p>

          <h3>Shadow DOM for Style Isolation</h3>
          <p>Angular's default <code>ViewEncapsulation.Emulated</code> adds scoped attribute selectors to the component's styles so they only apply within the component. For Custom Elements distributed to external environments, this is usually not strong enough — host page styles can still bleed in. Use <code>ViewEncapsulation.ShadowDom</code> to get true CSS isolation via the browser's Shadow DOM. The downside is that global styles (fonts, CSS resets) are not inherited, so you need to define all base styles within the element itself.</p>

          <h3>Zone.js in External Pages</h3>
          <p>Angular requires Zone.js to be loaded for change detection to work. When embedding an Angular Element in a non-Angular page, you must include Zone.js in your bundle or the host page must load it. The Angular Elements bundle from <code>ng build</code> includes Zone.js in the <code>polyfills.js</code> chunk — make sure this is loaded before <code>main.js</code>. If the host page already loads Zone.js (e.g., it hosts another Angular app), duplicate loading can cause conflicts.</p>

          <h3>Change Detection Timing</h3>
          <p>Setting a DOM property on a Custom Element does not automatically trigger Angular's change detection unless Zone.js is running. If you use the element in a context that modifies properties programmatically outside Zone.js (which is common in non-Angular frameworks), wrap the property assignment in <code>zone.run()</code>, or use Angular's <code>ChangeDetectorRef.detectChanges()</code> inside the component if needed.</p>
        `,
      "code": "// ---- Complete production-ready Angular Element ----\nimport { Component, Input, Output, EventEmitter,\n         ViewEncapsulation } from '@angular/core';\n\n@Component({\n  // vendor prefix — no conflicts with HTML spec or other libraries\n  selector: 'myorg-search-box',\n  standalone: true,\n\n  // ShadowDom: true CSS isolation for external page embedding\n  encapsulation: ViewEncapsulation.ShadowDom,\n\n  template: `\n    <div class=\"search-container\">\n      <input\n        type=\"search\"\n        [value]=\"query\"\n        [placeholder]=\"placeholder\"\n        [attr.aria-label]=\"placeholder\"\n        (input)=\"onInput($event)\"\n        (keydown.enter)=\"onSubmit()\"\n      />\n      <button (click)=\"onSubmit()\" [disabled]=\"!query.trim()\">\n        Search\n      </button>\n    </div>\n  `,\n  styles: [`\n    /* All styles self-contained — Shadow DOM isolates them */\n    :host { display: block; font-family: system-ui, sans-serif; }\n    .search-container { display: flex; gap: 8px; }\n    input { padding: 8px 12px; border: 1px solid #ccc; border-radius: 4px; flex: 1; }\n    button { padding: 8px 16px; background: #6366f1; color: white;\n             border: none; border-radius: 4px; cursor: pointer; }\n    button:disabled { opacity: 0.5; cursor: not-allowed; }\n  `]\n})\nexport class SearchBoxComponent {\n  @Input() query = '';\n  @Input() placeholder = 'Search...';\n\n  // Events use camelCase — consumers listen as: element.addEventListener('querySubmit', ...)\n  @Output() querySubmit = new EventEmitter<string>();\n  @Output() queryChange = new EventEmitter<string>();\n\n  onInput(event: Event): void {\n    this.query = (event.target as HTMLInputElement).value;\n    this.queryChange.emit(this.query);\n  }\n\n  onSubmit(): void {\n    if (this.query.trim()) {\n      this.querySubmit.emit(this.query.trim());\n    }\n  }\n}",
      "language": "typescript"
    }
  ]
});
