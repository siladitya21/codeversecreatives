window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "custom-elements",
  "title": "Custom Elements (Angular Elements)",
  "icon": "bi bi-puzzle-fill",
  "questions": [
    {
      id: "angular-22-standard-custom-elements-upgrade",
      title: "Angular 22 standard for custom elements",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A universal travel power adapter. You don't need a whole matching electrical system in every country you visit &mdash; you just need one adapter (the Custom Element wrapper) that fits any outlet (any host page: React, WordPress, plain HTML) and lets your appliance (the Angular component) work exactly as designed, wherever it's plugged in.</p>
          </div>
        </div>
        <p>Angular 22-ready custom elements are best used for interoperability: embedding Angular-built widgets into non-Angular hosts or distributing a component suite across platforms. For normal Angular-to-Angular reuse, standalone components and libraries are lighter and simpler &mdash; don't reach for Angular Elements just to share code between two Angular apps.</p>
        <h3>Modern custom element checklist</h3>
        <ul>
          <li>Use Angular Elements only when the consumer is not an Angular app.</li>
          <li>Keep the element API small: attributes/properties in, DOM events out.</li>
          <li>Bundle shared runtime carefully if publishing many elements.</li>
          <li>Document event names, attribute names, and supported browser targets.</li>
          <li>Avoid relying on global app services unless the element bootstraps them.</li>
        </ul>
      `,
      code: `@Component({
  selector: 'app-rating-widget',
  template: '<button (click)="rated.emit(5)">Rate 5</button>'
})
export class RatingWidgetComponent {
  readonly productId = input.required<string>();
  readonly rated = output<number>();
}

createApplication().then(appRef => {
  const injector = appRef.injector;
  const element = createCustomElement(RatingWidgetComponent, { injector });
  customElements.define('rating-widget', element);
});

// Host page:
// <rating-widget product-id="sku-1"></rating-widget>`,
      language: "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Angular Component &rarr; Custom Element &rarr; Any Host</p><div class="flex flex-wrap items-center justify-center gap-2 text-xs"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700">Angular component</div><span class="text-slate-300">&rarr;</span><div class="bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700">createCustomElement()</div><span class="text-slate-300">&rarr;</span><div class="bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700">customElements.define()</div><span class="text-slate-300">&rarr;</span><div class="bg-purple-50 border-2 border-purple-200 rounded-lg px-3 py-2 text-center font-semibold text-purple-700">works in React, WordPress, plain HTML</div></div></div>`
    },
    {
      "id": "what-are-custom-elements",
      "title": "What are Custom Elements and why use Angular Elements?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A shipping-container coffee stand you can drop into any parking lot, mall, or festival. It doesn't matter what's built around it &mdash; brick building, gravel lot, another vendor's food truck next door &mdash; the stand runs its own equipment, serves its own menu, and just needs power and a spot to sit. Angular Elements packages an Angular component the same way: a self-contained unit any HTML page can drop in without adopting Angular for everything else.</p>
          </div>
        </div>
        <p><strong>Custom Elements</strong> are part of the Web Components standard &mdash; a set of browser APIs that let you define your own HTML tags (<code>&lt;my-button&gt;</code>, <code>&lt;user-card&gt;</code>) that behave like built-in elements. The browser registers them via <code>customElements.define('my-tag', MyClass)</code>, and from that point any HTML that contains <code>&lt;my-tag&gt;</code> automatically instantiates and renders the component &mdash; no framework needed to consume it.</p>
        <p><strong>Angular Elements</strong> (<code>@angular/elements</code>) is the bridge between Angular's component model and the browser's Custom Elements API. It wraps an Angular component in a Custom Element shell, translating Angular's inputs to HTML attributes and DOM properties, and Angular's outputs to DOM Custom Events that any JavaScript &mdash; or no JavaScript &mdash; can listen to.</p>
        <h3>Why would you use this?</h3>
        <p>The primary use case is <strong>incremental adoption and interoperability</strong>. If you have an existing application built in React, Vue, plain JavaScript, or a server-rendered system (Drupal, Joomla, Django), you can build new UI widgets in Angular and drop them into the existing app as Web Components without rewriting anything. The Angular component renders and functions exactly as it would in a full Angular application &mdash; change detection, DI, animations, Material &mdash; but the host application only needs to include the bundled script and use the tag.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Angular Elements carry the full Angular runtime in their bundle (roughly 80&ndash;100KB gzipped minimum). Dropping a single small widget onto an otherwise lightweight page for that cost is usually not worth it. Angular Elements earn their keep when you're distributing a <em>suite</em> of related components &mdash; a design system, a rich editor, a reporting widget library &mdash; where the runtime cost is amortized across many components sharing one bundle.</p>
          </div>
        </div>
      `,
      "code": "// The value proposition in one sentence:\n// Build a component once in Angular → deploy it everywhere\n\n// Consumers can use the element in any context:\n\n// ---- In a React application ----\nfunction App() {\n  return (\n    <div>\n      <h1>React App</h1>\n      {/* Angular Element — no React wrappers needed */}\n      <my-rating-widget value=\"4\" />\n    </div>\n  );\n}\n\n// ---- In a Django/Jinja2 template ----\n// {% extends 'base.html' %}\n// {% block content %}\n// <my-rating-widget value=\"{{ product.rating }}\"></my-rating-widget>\n// {% endblock %}\n\n// ---- In a plain HTML file ----\n// <script src=\"my-angular-elements.js\"></script>\n// <my-rating-widget value=\"3\"></my-rating-widget>\n// <script>\n//   document.querySelector('my-rating-widget')\n//     .addEventListener('ratingChange', e => console.log(e.detail));\n// </script>",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">One Bundle, Many Hosts</p><div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs"><div class="bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-center font-semibold text-indigo-700">React app</div><div class="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center font-semibold text-emerald-700">Django template</div><div class="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center font-semibold text-amber-700">Plain HTML page</div><div class="bg-purple-50 border border-purple-200 rounded-lg p-2 text-center font-semibold text-purple-700">Another framework</div></div><p class="text-center text-slate-400 mt-3">all loading the same &lt;my-rating-widget&gt; script</p></div>`
    },
    {
      "id": "how-to-create-custom-elements",
      "title": "Creating Angular Elements — step by step",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Getting a passport for a component. <code>createCustomElement(MyComponent, { injector })</code> is the passport office: it takes something that only made sense inside Angular's borders (its DI-aware component class) and issues it official travel documents (an <code>HTMLElement</code> subclass) recognized by any browser, anywhere &mdash; no Angular visa required at customs.</p>
          </div>
        </div>
        <p>Converting an Angular component into a Custom Element requires three steps: install <code>@angular/elements</code>, call <code>createCustomElement()</code> with the component class and an injector, and register the result with the browser via <code>customElements.define()</code>. In a standalone Angular application, the most natural place to do this is in <code>main.ts</code>.</p>
        <h3>The createCustomElement() function</h3>
        <p><code>createCustomElement(MyComponent, { injector })</code> returns a class that extends <code>HTMLElement</code>. Angular uses the component's metadata (inputs, outputs, selector) to automatically generate the Web Component's attribute-to-property mapping and event dispatch logic. The <code>injector</code> argument is what gives the element access to Angular's DI system &mdash; services, HTTP client, router, and everything else in the DI tree are available inside the element just as in a normal component.</p>
        <h3>Bootstrap strategy</h3>
        <p>When you're building an app that <em>is</em> a collection of Angular Elements (with no app shell of its own), use <code>createApplication()</code> from <code>@angular/platform-browser</code>, which creates an application context and DI tree without rendering a root component &mdash; the cleanest option for element-only bundles.</p>
      `,
      "code": "// ---- Step 1: Install ----\n// ng add @angular/elements\n\n// ---- Step 2: Define the Angular component ----\nimport { Component, output } from '@angular/core';\n\n@Component({\n  selector: 'my-rating-widget',\n  template: `\n    <div class=\"stars\" [attr.aria-label]=\"'Rating: ' + value + ' out of 5'\">\n      @for (star of stars; track star) {\n        <button\n          class=\"star\"\n          [class.filled]=\"star <= value\"\n          [attr.aria-label]=\"'Rate ' + star\"\n          (click)=\"setRating(star)\">\n          ★\n        </button>\n      }\n    </div>\n  `,\n  styles: [`:host { display: inline-flex; gap: 4px; }\n            .star { font-size: 24px; cursor: pointer; border: none; background: none; }\n            .filled { color: gold; }`]\n})\nexport class RatingWidgetComponent {\n  stars = [1, 2, 3, 4, 5];\n\n  value = 0;\n  ratingChange = output<number>();\n\n  setRating(star: number): void {\n    this.value = star;\n    this.ratingChange.emit(star);\n  }\n}\n\n// ---- Step 3: Register as a Custom Element in main.ts ----\nimport { createApplication } from '@angular/platform-browser';\nimport { createCustomElement } from '@angular/elements';\n\n// createApplication() creates a DI context without a root component\ncreateApplication().then(appRef => {\n  const injector = appRef.injector;\n\n  const RatingElement = createCustomElement(RatingWidgetComponent, { injector });\n  customElements.define('my-rating-widget', RatingElement);\n\n  // Register multiple elements from one bundle:\n  // customElements.define('my-badge', createCustomElement(BadgeComponent, { injector }));\n  // customElements.define('my-tooltip', createCustomElement(TooltipComponent, { injector }));\n});",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Three Steps to a Registered Element</p><div class="flex flex-wrap items-center justify-center gap-2 text-xs"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700">1. Write the @Component</div><span class="text-slate-300">&rarr;</span><div class="bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700">2. createCustomElement()</div><span class="text-slate-300">&rarr;</span><div class="bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700">3. customElements.define()</div></div></div>`
    },
    {
      "id": "input-output-custom-elements",
      "title": "@Input and @Output in Custom Elements — the translation layer",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A vending machine's control panel. What you can put in (an attribute like <code>value="4"</code>, or a coin slot) is limited to simple, flat inputs &mdash; you can't post a full sandwich through the coin slot, only through the "stocking door" around back (the DOM property, for objects). And what comes out is always a standard signal &mdash; a light blinking, a bell dinging (a <code>CustomEvent</code>) &mdash; that any observer can notice, no matter who built the vending machine.</p>
          </div>
        </div>
        <p>When Angular wraps a component as a Custom Element, it automatically translates between Angular's component model and the Web Component API. Understanding this translation is essential for consumers of your element who may not be using Angular.</p>
        <h3>@Input → HTML attribute + DOM property</h3>
        <p>Each input on the Angular component becomes both an HTML attribute and a JavaScript DOM property on the Custom Element. Setting the attribute (<code>&lt;my-widget value="4"&gt;</code>) works for string values. For complex values (objects, arrays), use the DOM property (<code>element.data = { items: [...] }</code>) because HTML attributes can only carry strings. Angular Elements handles the synchronization between attribute and property automatically for primitive types.</p>
        <h3>@Output → CustomEvent</h3>
        <p>Each output becomes a DOM <code>CustomEvent</code>. When the Angular component calls <code>this.ratingChange.emit(4)</code>, the Custom Element dispatches a <code>CustomEvent</code> with the name <code>'ratingChange'</code> and the emitted value in <code>event.detail</code>. Consumers listen with <code>element.addEventListener('ratingChange', handler)</code>.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Setting <code>element.setAttribute('config', JSON.stringify(obj))</code> and expecting Angular to parse it back into an object does not happen automatically &mdash; attributes are always strings. Consumers must set object-shaped inputs as a DOM property (<code>element.config = {...}</code>), not an HTML attribute, or the component receives a raw string it wasn't expecting.</p>
          </div>
        </div>
        <h3>Signal inputs work the same way</h3>
        <p>Signal-based inputs (<code>input()</code>, <code>input.required()</code>) are also supported by Angular Elements. They map to attributes and DOM properties the same way as the older <code>@Input()</code> decorator. The component internally uses signals, but the Custom Element API surface is identical from the consumer's perspective.</p>
      `,
      "code": "// ---- Component with various input/output types ----\nimport { Component, input, output } from '@angular/core';\n\ninterface ProductConfig { id: number; currency: string; }\n\n@Component({\n  selector: 'my-price-display',\n  template: `\n    <div class=\"price\">\n      {{ config()?.currency || '$' }}{{ amount() }}\n      <button (click)=\"addToCart()\">Add to Cart</button>\n    </div>\n  `\n})\nexport class PriceDisplayComponent {\n  // Primitive input — works as HTML attribute (string) or DOM property\n  amount = input(0);\n\n  // Object input — must be set as DOM property, not HTML attribute\n  config = input<ProductConfig>();\n\n  // output — becomes CustomEvent named 'cartAdd'\n  cartAdd = output<{ amount: number; currency: string }>();\n\n  addToCart(): void {\n    this.cartAdd.emit({ amount: this.amount(), currency: this.config()?.currency ?? 'USD' });\n  }\n}\n\n// ---- Consumer in plain JavaScript ----\nconst priceEl = document.querySelector('my-price-display');\n\n// Primitive: set via attribute OR property\npriceEl.setAttribute('amount', '29.99');  // attribute (string only)\npriceEl.amount = 29.99;                   // property (number — preferred)\n\n// Object: must use property (not attribute)\npriceEl.config = { id: 42, currency: 'EUR' };\n\n// Listen to output events\npriceEl.addEventListener('cartAdd', (event) => {\n  const { amount, currency } = event.detail;\n  console.log(`Added ${currency}${amount} to cart`);\n});\n\n// ---- In React (property binding with ref) ----\n// function ProductCard({ product }) {\n//   const ref = useRef(null);\n//   useEffect(() => {\n//     ref.current.config = product.config; // object property\n//     ref.current.addEventListener('cartAdd', handleAdd);\n//     return () => ref.current.removeEventListener('cartAdd', handleAdd);\n//   }, []);\n//   return <my-price-display ref={ref} amount={product.price} />;\n// }",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Input/Output Translation Layer</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3"><p class="font-bold text-indigo-700 text-center mb-2">Angular input()</p><div class="flex flex-col items-center gap-1"><div class="bg-white border border-indigo-200 rounded px-2 py-1 w-full text-center">HTML attribute (strings)</div><div class="bg-white border border-indigo-200 rounded px-2 py-1 w-full text-center">DOM property (any type)</div></div></div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3"><p class="font-bold text-emerald-700 text-center mb-2">Angular output()</p><div class="flex flex-col items-center gap-1"><div class="bg-white border border-emerald-200 rounded px-2 py-1 w-full text-center">CustomEvent, name = output name</div><div class="bg-white border border-emerald-200 rounded px-2 py-1 w-full text-center">payload in event.detail</div></div></div></div></div>`
    },
    {
      "id": "bundling-custom-elements",
      "title": "Building a distributable Custom Elements bundle",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Shipping IKEA furniture as one flat-pack box instead of a truckload of loose parts. A normal Angular build hands consumers several separate chunks with hashed, ever-changing names &mdash; fine for an app you fully control, chaotic for a <code>&lt;script&gt;</code> tag someone else pastes into their page. Flattening to one predictably-named file (<code>outputHashing: 'none'</code> plus concatenation) is the flat-pack: one box, one part number, assemble anywhere.</p>
          </div>
        </div>
        <p>An Angular Elements project is built like any Angular application with <code>ng build</code>, but the output strategy differs from a typical SPA. Instead of an app that loads in a browser tab, you want a single JavaScript file that can be included via a <code>&lt;script&gt;</code> tag in any page.</p>
        <h3>Disabling output hashing</h3>
        <p>Normal Angular builds use content hashing in filenames (<code>main.abc123.js</code>) for cache busting. For a distributable element bundle, you want predictable filenames so consumers can reference a stable URL. Use <code>outputHashing: 'none'</code> in the <code>angular.json</code> build configuration, or pass <code>--output-hashing=none</code> on the command line.</p>
        <h3>Single-file concatenation</h3>
        <p>Angular's build produces multiple chunks. For distribution, it's more convenient to concatenate them into a single file with a post-build script. The single-file approach simplifies the consumer's integration: one <code>&lt;script&gt;</code> tag and the element is ready.</p>
        <h3>Bundle size</h3>
        <p>Every Angular Elements bundle includes the full Angular runtime. For an element with no large dependencies, a compressed bundle is typically 80&ndash;120KB gzipped. If you distribute multiple elements, consider whether they should share the Angular runtime (one bundle for all elements, registered at load time) or be fully independent. Sharing one bundle is almost always preferable for production.</p>
      `,
      "code": "# ---- angular.json build configuration for elements distribution ----\n# Under \"projects\" → \"my-elements\" → \"architect\" → \"build\" → \"configurations\":\n{\n  \"production\": {\n    \"outputHashing\": \"none\",    // predictable filenames for CDN references\n    \"optimization\": true,\n    \"sourceMap\": false,\n    \"namedChunks\": false,\n    \"budgets\": [\n      { \"type\": \"initial\", \"maximumWarning\": \"500kb\", \"maximumError\": \"1mb\" }\n    ]\n  }\n}\n\n# ---- Build ----\nng build --configuration production\n# Output: dist/my-elements/\n# ├── main.js      ← the bundle (Angular runtime + all elements)\n# ├── polyfills.js ← web components polyfill for older browsers\n# └── styles.css   ← if the elements use stylesheets\n\n# ---- Post-build: concatenate into one distributable file ----\n# package.json scripts:\n# \"build:elements\": \"ng build --configuration production && node concat-bundles.js\"\n\n# concat-bundles.js:\nconst fs = require('fs');\nconst dist = 'dist/my-elements';\nconst files = ['polyfills.js', 'main.js'];\nconst output = files.map(f => fs.readFileSync(`${dist}/${f}`, 'utf-8')).join('\\n');\nfs.writeFileSync(`${dist}/elements.min.js`, output);\nconsole.log('Bundle created: elements.min.js');\n\n# ---- Consumer integration ----\n# CDN:\n# <script src=\"https://cdn.myorg.com/elements/1.2.0/elements.min.js\"></script>\n# <my-rating-widget value=\"4\"></my-rating-widget>\n\n# npm package:\n# npm install @myorg/angular-elements\n# import '@myorg/angular-elements';  // registers the custom elements\n# // Then use in templates or HTML",
      "language": "bash",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Multi-Chunk Build vs Distributable Bundle</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-slate-50 border-2 border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">Default ng build</p><div class="flex flex-col items-center gap-1"><div class="bg-rose-50 border border-rose-200 rounded px-2 py-1 w-full text-center">main.abc123.js</div><div class="bg-rose-50 border border-rose-200 rounded px-2 py-1 w-full text-center">polyfills.def456.js</div><div class="bg-rose-50 border border-rose-200 rounded px-2 py-1 w-full text-center">hash changes every build</div></div></div><div class="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">Elements distribution</p><div class="flex flex-col items-center gap-1"><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center">outputHashing: none</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center">elements.min.js</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center">stable CDN URL</div></div></div></div></div>`
    },
    {
      "id": "custom-elements-best-practices",
      "title": "Angular Elements best practices and gotchas",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Moving into a foreign apartment building where you don't control the walls. Emulated view encapsulation is thin drywall &mdash; the neighbor's noise (host page CSS) can still bleed through. Shadow DOM is soundproofing built into your own unit: nothing gets in, nothing gets out, but you also can't hear the building's fire alarm (global fonts and resets) unless you wire your own smoke detector inside.</p>
          </div>
        </div>
        <p>Angular Elements work well but come with specific constraints that arise from bridging two different component models. Being aware of these before you start saves painful debugging later.</p>
        <h3>Use a vendor prefix</h3>
        <p>Custom Element tag names must contain a hyphen (required by the spec to avoid conflicts with future built-in HTML elements). Always use a vendor or project prefix: <code>myorg-button</code>, <code>ds-card</code>, <code>acme-search</code>. Do not use single-word names like <code>button</code> (not valid) or unprefixed names that might clash with another library or future HTML spec.</p>
        <h3>Shadow DOM for style isolation</h3>
        <p>Angular's default <code>ViewEncapsulation.Emulated</code> adds scoped attribute selectors to the component's styles so they only apply within the component. For Custom Elements distributed to external environments, this usually isn't strong enough &mdash; host page styles can still bleed in. Use <code>ViewEncapsulation.ShadowDom</code> to get true CSS isolation via the browser's Shadow DOM. The downside is that global styles (fonts, CSS resets) are not inherited, so you need to define all base styles within the element itself.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">When the element runs zoneless (Angular 22's default for new apps), setting a DOM property on the element from outside Angular's own event handling won't automatically trigger change detection the way Zone.js used to paper over. In a zoneless element, prefer signal inputs and Angular's own update paths; if a non-Angular host mutates properties directly and nothing re-renders, that's the first thing to check.</p>
          </div>
        </div>
        <h3>Zone.js in external pages</h3>
        <p>If your element bundle still relies on Zone.js for change detection (rather than being built zoneless), it must be loaded before <code>main.js</code>. If the host page already loads Zone.js for another purpose, duplicate loading can cause conflicts &mdash; check for this before shipping.</p>
      `,
      "code": "// ---- Complete production-ready Angular Element ----\nimport { Component, input, output,\n         ViewEncapsulation } from '@angular/core';\n\n@Component({\n  // vendor prefix — no conflicts with HTML spec or other libraries\n  selector: 'myorg-search-box',\n\n  // ShadowDom: true CSS isolation for external page embedding\n  encapsulation: ViewEncapsulation.ShadowDom,\n\n  template: `\n    <div class=\"search-container\">\n      <input\n        type=\"search\"\n        [value]=\"query()\"\n        [placeholder]=\"placeholder()\"\n        [attr.aria-label]=\"placeholder()\"\n        (input)=\"onInput($event)\"\n        (keydown.enter)=\"onSubmit()\"\n      />\n      <button (click)=\"onSubmit()\" [disabled]=\"!query().trim()\">\n        Search\n      </button>\n    </div>\n  `,\n  styles: [`\n    /* All styles self-contained — Shadow DOM isolates them */\n    :host { display: block; font-family: system-ui, sans-serif; }\n    .search-container { display: flex; gap: 8px; }\n    input { padding: 8px 12px; border: 1px solid #ccc; border-radius: 4px; flex: 1; }\n    button { padding: 8px 16px; background: #6366f1; color: white;\n             border: none; border-radius: 4px; cursor: pointer; }\n    button:disabled { opacity: 0.5; cursor: not-allowed; }\n  `]\n})\nexport class SearchBoxComponent {\n  query = input('');\n  placeholder = input('Search...');\n\n  // Events use camelCase — consumers listen as: element.addEventListener('querySubmit', ...)\n  querySubmit = output<string>();\n  queryChange = output<string>();\n\n  onInput(event: Event): void {\n    const value = (event.target as HTMLInputElement).value;\n    this.queryChange.emit(value);\n  }\n\n  onSubmit(): void {\n    const value = this.query().trim();\n    if (value) {\n      this.querySubmit.emit(value);\n    }\n  }\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Emulated vs Shadow DOM Isolation</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-slate-50 border-2 border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">ViewEncapsulation.Emulated</p><div class="flex flex-col items-center gap-1"><div class="bg-amber-50 border border-amber-200 rounded px-2 py-1 w-full text-center">host CSS can still leak in</div><div class="bg-amber-50 border border-amber-200 rounded px-2 py-1 w-full text-center">good enough inside your own app</div></div></div><div class="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">ViewEncapsulation.ShadowDom</p><div class="flex flex-col items-center gap-1"><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center">true CSS isolation, no leaks</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center">must self-supply fonts/resets</div></div></div></div></div>`
    }
  ]
});
