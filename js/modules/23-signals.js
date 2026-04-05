window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "signals",
  "title": "Signals (Angular 16+)",
  "icon": "bi bi-reception-4",
  "questions": [
    {
      "id": "what-are-signals",
      "title": "What are signals?",
      "explanation": `
          <p><strong>Signals</strong> are reactive primitives that provide a way for Angular to track state changes with fine-grained precision. A signal is a wrapper around a value that notifies interested consumers whenever that value changes.</p>
          <h3>Key Characteristics</h3>
          <ul>
            <li><strong>Synchronous:</strong> Unlike RxJS Observables, signals are always synchronous.</li>
            <li><strong>Value-based:</strong> A signal always has a value that can be read by calling it as a function.</li>
            <li><strong>Glitch-free:</strong> Signals ensure that derived state is always consistent, preventing "diamond dependency" issues.</li>
          </ul>
        `,
      "code": "import { signal } from '@angular/core';\n\n// Create a signal\nconst count = signal(0);\n\n// Read the value\nconsole.log(count());\n\n// Update the value\ncount.set(1);\n\n// Update based on previous value\ncount.update(val => val + 1);",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Signal Reactivity</p><div class="flex items-center justify-center gap-4"><div class="bg-indigo-600 text-white p-3 rounded-lg text-xs font-bold shadow-lg">Signal (Producer)</div><div class="text-indigo-400 font-bold">&rarr;</div><div class="bg-emerald-50 border-2 border-emerald-200 p-3 rounded-lg text-xs">Consumer (Template/Effect)</div></div></div>`
    },
    {
      "id": "signals-vs-observables",
      "title": "Difference between signals and observables",
      "explanation": `
          <p>While both handle reactivity, they serve different purposes:</p>\n\n          <table class="w-full text-xs mt-3 border-collapse">\n            <thead><tr class="bg-slate-100"><th>Feature</th><th>Signals</th><th>Observables</th></tr></thead>\n            <tbody>\n              <tr><td>Timing</td><td>Synchronous</td><td>Asynchronous</td></tr>\n              <tr><td>Initial Value</td><td>Required</td><td>Not required</td></tr>\n              <tr><td>Side Effects</td><td>Built-in (effect)</td><td>Manual (subscribe)</td></tr>\n              <tr><td>Best For</td><td>Local Component State</td><td>Events & HTTP</td></tr>\n            </tbody>\n          </table>
        `,
      "code": "// Signal: Always has a value\nconst s = signal(10);\nconsole.log(s()); // 10\n\n// Observable: Emits values over time\nconst o$ = new BehaviorSubject(10);\no$.subscribe(v => console.log(v));",
      "language": "typescript"
    },
    {
      "id": "computed-signals",
      "title": "Computed signals",
      "explanation": `
          <p>A <strong>computed signal</strong> is a read-only signal that derives its value from other signals. It is <strong>memoized</strong>, meaning it only re-calculates when the signals it depends on change.</p>\n\n          <p>Computed signals are lazy; they don't perform calculations until the first time they are read.</p>\n        `,
      "code": "import { signal, computed } from '@angular/core';\n\nconst count = signal(5);\nconst doubleCount = computed(() => count() * 2);\n\nconsole.log(doubleCount()); // 10\n\ncount.set(10);\nconsole.log(doubleCount()); // 20",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><div class="max-w-md mx-auto bg-amber-50 border border-amber-200 rounded-xl p-4 text-center"><p class="text-xs font-bold text-amber-700">Signal A + Signal B &rarr; Computed Signal C</p><p class="text-[10px] text-slate-500 mt-2">C automatically updates when A or B changes.</p></div></div>`
    },
    {
      "id": "effect-function",
      "title": "Effect function",
      "explanation": `
          <p>The <strong>effect</strong> function is used to run side-effect logic whenever the signals it reads change. It is commonly used for logging, syncing with local storage, or manual DOM manipulation.</p>\n\n          <p>An effect must be called within an <strong>injection context</strong> (like a constructor) or provided with an injector.</p>\n        `,
      "code": "import { signal, effect } from '@angular/core';\n\nexport class MyComponent {\n  count = signal(0);\n\n  constructor() {\n    effect(() => {\n      console.log(`The count is now: ${this.count()}`);\n    });\n  }\n}",
      "language": "typescript"
    },
    {
      "id": "signal-based-components",
      "title": "Signal-based components",
      "explanation": `
          <p>In Angular 21, components use a <strong>Signal-based</strong> architecture by default. This includes signal inputs, signal outputs, and model signals for true reactive composition.</p>\n\n          <ul>\n            <li><strong>input():</strong> Creates a read-only signal input from parent.</li>\n            <li><strong>output():</strong> Replaces EventEmitter for cleaner event emission.</li>\n            <li><strong>model():</strong> Enables intuitive two-way data binding using signals.</li>\n          </ul>\n          <p>This enables Angular to perform <strong>Zoneless</strong> change detection, updating only components with signal changes.</p>\n        `,
      "code": "// Angular 21: Signal-based Component\nimport { Component, signal, computed, input, output, model } from '@angular/core';\n\n@Component({\n  selector: 'app-user-profile',\n  standalone: true,\n  template: `\n    <div>\n      <h1>{{ firstName() }} {{ lastName() }}</h1>\n      <p>Full Name: {{ fullName() }}</p>\n      <button (click)=\"toggleAdmin()\">Toggle Admin</button>\n      <p>Is Admin: {{ isAdmin() }}</p>\n    </div>\n  `\n})\nexport class UserComponent {\n  // Signal Inputs (read-only from parent)\n  firstName = input<string>('');\n  lastName = input.required<string>();\n  \n  // Two-way binding via model signal\n  isAdmin = model<boolean>(false);\n  \n  // Signal Output (emit to parent)\n  adminChanged = output<boolean>();\n  \n  // Derived signal\n  fullName = computed(() => `${this.firstName()} ${this.lastName()}`);\n  \n  toggleAdmin(): void {\n    this.isAdmin.set(!this.isAdmin());\n    this.adminChanged.emit(this.isAdmin());\n  }\n}",
      "language": "typescript"
    },
    {
      "id": "advanced-signal-apis-angular-21",
      "title": "Advanced Signal APIs in Angular 21",
      "explanation": `
          <p>Angular 21 introduces advanced signal utilities for complex state management patterns: <code>linkedSignal()</code>, <code>toSignal()</code>, <code>toObservable()</code>, and <code>resource()</code>.</p>\n          <h3>Key Advanced APIs</h3>\n          <ul>\n            <li><strong><code>linkedSignal()</code>:</strong> Creates a derived signal with custom update logic based on a source signal changes.</li>\n            <li><strong><code>toSignal()</code>:</strong> Converts an Observable to a Signal for seamless integration.</li>\n            <li><strong><code>toObservable()</code>:</strong> Converts a Signal back to an Observable when needed.</li>\n            <li><strong><code>resource()</code>:</strong> Manages async data fetching with automatic loading/error states.</li>\n            <li><strong><code>outputFromObservable()</code>:</strong> Creates an output from an Observable for easy integration.</li>\n          </ul>\n        `,
      "code": "import { signal, linkedSignal, computed, toSignal, toObservable, effect, resource } from '@angular/core';\nimport { HttpClient } from '@angular/common/http';\n\n// linkedSignal: Derived signal with custom logic\nconst count = signal(0);\nconst doubleWithDelay = linkedSignal(() => {\n  return count() * 2;\n});\n\n// toSignal: Convert Observable to Signal\n@Component({\n  selector: 'app-data',\n  standalone: true,\n  template: `<div>{{ data()?.name }}</div>`\n})\nexport class DataComponent {\n  private http = inject(HttpClient);\n  \n  // Convert HTTP Observable to Signal\n  data = toSignal(\n    this.http.get('/api/user'),\n    { initialValue: null }\n  );\n}\n\n// resource: Async data management (Angular 21 feature)\n@Component({\n  selector: 'app-async-data',\n  standalone: true,\n  template: `\n    @if (userResource.isLoading()) {\n      <p>Loading user...</p>\n    } @else if (userResource.error()) {\n      <p>Error: {{ userResource.error() }}</p>\n    } @else {\n      <p>User: {{ userResource.value()?.name }}</p>\n    }\n  `\n})\nexport class AsyncDataComponent {\n  private http = inject(HttpClient);\n  userId = signal(1);\n  \n  // resource automatically manages loading/error states\n  userResource = resource({\n    request: () => this.userId(),\n    loader: (req) => this.http.get(`/api/users/${req.request}`)\n  });\n}",
      "language": "typescript",
      "diagram": `<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Signal Conversion & Integration</p><div class=\"grid grid-cols-3 gap-2 max-w-lg mx-auto\"><div class=\"bg-indigo-50 border border-indigo-200 p-2 rounded text-center\"><p class=\"text-xs font-bold\">Observable</p><p class=\"text-[10px] text-slate-500\">toSignal()</p></div><div class=\"text-slate-300 text-xs flex items-center justify-center\">&harr;</div><div class=\"bg-emerald-50 border border-emerald-200 p-2 rounded text-center\"><p class=\"text-xs font-bold\">Signal</p><p class=\"text-[10px] text-slate-500\">toObservable()</p></div></div></div>`
    },
    {
      "id": "signal-performance-optimization",
      "title": "Signal Performance & Optimization",
      "explanation": `
          <p>Signals enable <strong>fine-grained reactivity</strong> for superior performance. Only components with changed signals re-render, not the entire component tree.</p>\n          <h3>Performance Benefits</h3>\n          <ul>\n            <li><strong>Fine-grained updates:</strong> Only affected components are checked.</li>\n            <li><strong>Zoneless change detection:</strong> No Zone.js overhead (~36KB savings).</li>\n            <li><strong>Memoization:</strong> Computed signals cache results, avoiding redundant calculations.</li>\n            <li><strong>Memory efficient:</strong> Signals are simpler than Observables for local state.</li>\n          </ul>\n        `,
      "code": "// Performance: Computed signals are memoized\nimport { signal, computed } from '@angular/core';\n\nconst items = signal([1, 2, 3]);\nconst sum = computed(() => {\n  console.log('Computing sum...');\n  return items().reduce((a, b) => a + b, 0);\n});\n\nconsole.log(sum()); // Computes: 6\nconsole.log(sum()); // Returns cache, no log\n\nitems.set([1, 2, 3, 4]);\nconsole.log(sum()); // Computes again: 10\n\n// Component-level optimization with signals\n@Component({\n  selector: 'app-optimized',\n  standalone: true,\n  template: `\n    <div>Item Count: {{ itemCount() }}</div>\n    @for (item of displayedItems(); track item.id) {\n      <div>{{ item.name }}</div>\n    }\n  `,\n  changeDetection: ChangeDetectionStrategy.OnPush // Now truly optimized with signals\n})\nexport class OptimizedComponent {\n  items = signal([{ id: 1, name: 'A' }, { id: 2, name: 'B' }]);\n  filter = signal('');\n  \n  itemCount = computed(() => this.items().length);\n  displayedItems = computed(() => \n    this.items().filter(i => i.name.includes(this.filter()))\n  );\n  // Only re-renders when items or filter changes!\n}",
      "language": "typescript"
    },
    {
      "id": "migration-from-observable-pattern",
      "title": "Migrating from Observable to Signal Pattern",
      "explanation": `
          <p>As Angular embraces signals, understanding how to migrate from Observable-based patterns is essential. Both can coexist, but signals provide simpler, more intuitive state management for components.</p>\n        `,
      "code": "// OLD: Observable Pattern\n@Component({\n  template: `<div>{{ (items$ | async) as items }}...{{ items.length }}</div>`\n})\nexport class OldApproach {\n  items$ = this.http.get('/api/items');\n  filter$ = new BehaviorSubject('');\n  \n  filteredItems$ = combineLatest([this.items$, this.filter$]).pipe(\n    map(([items, filter]) => items.filter(i => i.includes(filter)))\n  );\n}\n\n// NEW: Signal Pattern (Angular 21)\n@Component({\n  standalone: true,\n  template: `\n    <div>\n      @for (item of filteredItems(); track item.id) {\n        {{ item.name }}\n      }\n    </div>\n  `\n})\nexport class NewApproach {\n  private http = inject(HttpClient);\n  \n  items = toSignal(\n    this.http.get('/api/items'),\n    { initialValue: [] }\n  );\n  filter = signal('');\n  \n  // Simpler! No RxJS operators needed\n  filteredItems = computed(() => \n    this.items().filter(i => i.name.includes(this.filter()))\n  );\n}"
    }
  ]
});