window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "ngzone",
  "title": "NgZone",
  "icon": "bi bi-speedometer",
  "questions": [
    {
      "id": "what-is-ngzone",
      "title": "What is NgZone?",
      "explanation": `
          <p><strong>NgZone</strong> is Angular's wrapper around <strong>Zone.js</strong>. Its primary role is to detect when asynchronous operations (like <code>setTimeout</code>, <code>setInterval</code>, <code>XMLHttpRequest</code>, DOM event listeners) complete and then trigger Angular's change detection mechanism.</p>
          <p>Essentially, NgZone tells Angular: <em>"An asynchronous task just finished, so something in the application state might have changed. It's time to check for updates and re-render the UI if necessary."</em></p>
          <h3>Key Points</h3>
          <ul>
            <li>Angular runs all application code inside a special zone called the "Angular Zone".</li>
            <li>Any asynchronous task initiated within this zone is "patched" by Zone.js.</li>
            <li>When a patched async task completes, Zone.js notifies Angular, which then runs change detection.</li>
          </ul>
        `,
      "code": "import { Component, NgZone } from '@angular/core';\n\n@Component({ /* ... */ })\nexport class MyComponent {\n  progress = 0;\n\n  constructor(private ngZone: NgZone) {\n    // This setTimeout runs inside Angular's zone\n    setTimeout(() => {\n      this.progress = 100; // Change detection will run\n    }, 1000);\n  }\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">NgZone Flow</p><div class="flex items-center justify-between max-w-md mx-auto"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-indigo-700">Async Task (e.g., setTimeout)</p></div><div class="text-slate-300">&rarr;</div><div class="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-amber-700">Zone.js / NgZone</p></div><div class="text-slate-300">&rarr;</div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-emerald-700">Angular Change Detection</p></div></div></div>`
    },
    {
      "id": "run-code-outside-angular-zone",
      "title": "How to run code outside Angular zone?",
      "explanation": `
          <p>You can run code outside Angular's zone using the <code>NgZone.runOutsideAngular()</code> method. Code executed within this method will <strong>not</strong> trigger Angular's change detection automatically when its asynchronous tasks complete.</p>
          <p>This is particularly useful for performance-critical operations that frequently update, but whose updates don't necessarily need to trigger a full Angular change detection cycle every time.</p>
        `,
      "code": "import { Component, NgZone } from '@angular/core';\n\n@Component({ /* ... */ })\nexport class MyComponent {\n  count = 0;\n\n  constructor(private ngZone: NgZone) {\n    this.ngZone.runOutsideAngular(() => {\n      setInterval(() => {\n        this.count++;\n        // This increment will NOT trigger change detection\n        // unless explicitly told to (e.g., via ngZone.run() or markForCheck())\n      }, 100);\n    });\n  }\n\n  // To update the view after running outside Angular's zone, you might:\n  // 1. Re-enter the zone: this.ngZone.run(() => { this.value = newValue; });\n  // 2. Manually trigger CD: this.cdr.detectChanges();\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Running Outside NgZone</p><div class="flex items-center justify-center gap-4"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-indigo-700">Code Execution</p></div><div class="text-slate-300">&rarr;</div><div class="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-amber-700">NgZone.runOutsideAngular()</p></div><div class="text-slate-300">&rarr;</div><div class="bg-rose-50 border-2 border-rose-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-rose-700">NO Automatic Change Detection</p></div></div></div>`
    },
    {
      "id": "when-to-use-runoutsideangular",
      "title": "When to use runOutsideAngular?",
      "explanation": `
          <p>You should use <code>runOutsideAngular()</code> when you have code that:</p>
          <ul>
            <li><strong>Triggers frequently:</strong> Such as animations, WebSockets, or high-frequency event listeners (e.g., mouse move).</li>
            <li><strong>Doesn't directly affect the UI state:</strong> Or only affects a small, isolated part of the UI that can be updated manually.</li>
            <li><strong>Integrates with third-party libraries:</strong> Especially those that perform their own DOM manipulations or have their own change detection mechanisms.</li>
          </ul>
          <p>By running these operations outside the Angular zone, you prevent unnecessary change detection cycles, which can significantly improve application performance and responsiveness.</p>
        `,
      "code": "// Common use cases:\n// - High-frequency canvas drawing\n// - WebGL rendering loops\n// - Drag-and-drop libraries\n// - Custom animations that don't use Angular's animation module\n// - Performance monitoring tools",
      "language": "typescript"
    },
    {
      "id": "run-callback-inside-zone",
      "title": "How to re-enter the Angular zone?",
      "explanation": `
          <p>After running code outside Angular's zone with <code>runOutsideAngular()</code>, you may need to <strong>re-enter the Angular zone</strong> to trigger change detection and update the UI.</p>\n\n          <p>Use <code>ngZone.run()</code> to execute code back inside the Angular zone. This is useful when you've completed a heavy operation outside the zone and now need to update the component state.</p>\n        `,
      "code": "import { Component, NgZone } from '@angular/core';\n\n@Component({ /* ... */ })\nexport class MyComponent {\n  value = 0;\n\n  constructor(private ngZone: NgZone) {}\n\n  performHeavyTask() {\n    // Run expensive operation outside Angular's zone\n    this.ngZone.runOutsideAngular(() => {\n      for (let i = 0; i < 1000000; i++) {\n        this.expensiveCalculation();\n      }\n      \n      // Once done, re-enter the zone to update the view\n      this.ngZone.run(() => {\n        this.value = this.result; // This triggers change detection\n      });\n    });\n  }\n\n  private expensiveCalculation() {\n    // Heavy computation that doesn't need CD\n  }\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Zone Re-entry Flow</p><div class="flex items-center justify-between max-w-md mx-auto"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-indigo-700">Outside Angular</p></div><div class="text-slate-300">&rarr;</div><div class="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-amber-700">Heavy Task</p></div><div class="text-slate-300">&rarr;</div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-emerald-700">Back in Angular</p></div><div class="text-slate-300">&rarr;</div><div class="bg-rose-50 border-2 border-rose-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-rose-700">Change Detection</p></div></div></div>`
    },
    {
      "id": "checking-zone-status",
      "title": "Checking if code is running in Angular zone",
      "explanation": `
          <p>Sometimes you need to know whether code is currently running <strong>inside</strong> or <strong>outside</strong> Angular's zone. The <code>NgZone.isStable</code> property and event emitters help with this.</p>\n\n          <h3>Key Properties</h3>\n          <ul>\n            <li><code>ngZone.isStable</code>: An Observable that emits when Angular's zone becomes stable (no pending async tasks).</li>\n            <li><code>ngZone.onStable</code>: Observable that emits when the zone stabilizes.</li>\n            <li><code>ngZone.onUnstable</code>: Observable that emits when async tasks start.</li>\n          </ul>\n        `,
      "code": "import { Component, NgZone } from '@angular/core';\n\n@Component({ /* ... */ })\nexport class MyComponent {\n  constructor(private ngZone: NgZone) {\n    // Wait for the zone to become stable before performing an action\n    this.ngZone.onStable.subscribe(() => {\n      console.log('All async operations completed. Safe to measure DOM.');\n      this.measureLayout();\n    });\n\n    this.ngZone.onUnstable.subscribe(() => {\n      console.log('Async operation started. Zone is now busy.');\n    });\n  }\n\n  measureLayout() {\n    // Safe to access DOM measurements here without triggering additional CD cycles\n    const height = document.body.offsetHeight;\n    console.log('Layout height:', height);\n  }\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Zone Stability States</p><div class="flex flex-col items-center gap-3 max-w-md mx-auto"><div class="w-full bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-indigo-700">Stable</p><p class="text-[10px] text-slate-500">No pending async tasks</p></div><div class="text-slate-400 text-sm">&darr; async task starts &uarr;</p><div class="w-full bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-amber-700">Unstable</p><p class="text-[10px] text-slate-500">Pending async tasks</p></div></div></div>`
    }
  ]
});