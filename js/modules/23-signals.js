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
          <p>In modern Angular (v17+), components are moving toward a <strong>Signal-based</strong> architecture. This includes using Signal Inputs, Signal Outputs, and Model Signals.</p>\n\n          <ul>\n            <li><strong>input():</strong> Creates a read-only signal input.</li>\n            <li><strong>output():</strong> Replaces EventEmitter for more consistent reactivity.</li>\n            <li><strong>model():</strong> Enables easy two-way data binding using signals.</li>\n          </ul>\n          <p>This allows Angular to eventually perform <strong>Zoneless</strong> change detection, checking only the components where a signal has changed.</p>\n        `,
      "code": "// Signal Input (v17.1+)\n@Component({ ... })\nexport class UserComponent {\n  firstName = input<string>(''); // read-only signal\n  lastName = input.required<string>();\n\n  fullName = computed(() => `${this.firstName()} ${this.lastName()}`);\n}",
      "language": "typescript"
    }
  ]
});