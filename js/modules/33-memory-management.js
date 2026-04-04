window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "memory-management",
  "title": "Memory Management",
  "icon": "bi bi-layers",
  "questions": [
    {
      "id": "memory-leaks-angular",
      "title": "Memory leaks in Angular",
      "explanation": `
          <p>A <strong>memory leak</strong> occurs when an application allocates memory for objects but fails to release it when they are no longer needed. In Angular, this typically happens when a component is destroyed, but background tasks or data streams associated with it continue to run.</p>
          <h3>Common Causes</h3>
          <ul>
            <li><strong>Unfinished Subscriptions:</strong> Subscribing to an Observable in a component and not unsubscribing when the component is removed.</li>
            <li><strong>Event Listeners:</strong> Adding global event listeners (like on <code>window</code> or <code>document</code>) without removing them.</li>
            <li><strong>SetInterval/SetTimeout:</strong> Timers that keep running after the component is gone.</li>
          </ul>
        `,
      "code": "// Potential leak:\nngOnInit() {\n  this.userService.data$.subscribe(data => {\n    this.data = data; // If component is destroyed, this callback might still fire\n  });\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Subscription Leak</p><div class="flex flex-col items-center gap-2"><div class="bg-rose-100 border border-rose-300 p-2 rounded text-xs">Destroyed Component</div><div class="text-rose-400">&uarr; reference &uarr;</div><div class="bg-indigo-600 text-white p-2 rounded text-xs shadow-md">Active Subscription</div></div></div>`
    },
    {
      "id": "prevent-memory-leaks",
      "title": "How to prevent memory leaks?",
      "explanation": `
          <p>Preventing memory leaks involves ensuring that every resource \"owned\" by a component is cleaned up during its <strong>OnDestroy</strong> lifecycle phase.</p>\n\n          <h3>Best Practices</h3>\n          <ul>\n            <li>Use the <strong>async pipe</strong> whenever possible.</li>\n            <li>Unsubscribe manually in <code>ngOnDestroy</code>.</li>\n            <li>Use RxJS cleanup operators like <code>takeUntil</code> or <code>take(1)</code>.</li>\n            <li>Remove manual DOM event listeners using <code>Renderer2</code> or <code>@HostListener</code>.</li>\n          </ul>\n        `,
      "code": "ngOnDestroy() {\n  this.subscription.unsubscribe();\n  clearInterval(this.timerId);\n}",
      "language": "typescript"
    },
    {
      "id": "unsubscribing-observables",
      "title": "Unsubscribing observables",
      "explanation": `
          <p>When you subscribe to an Observable, it returns a <strong>Subscription</strong> object. To stop listening and allow memory to be reclaimed, you must call the <code>unsubscribe()</code> method on that object.</p>\n\n          <p>Note: HTTP requests in Angular generally complete and clean themselves up automatically, but long-lived streams (like Router events or custom Subjects) do not.</p>\n        `,
      "code": "private sub = new Subscription();\n\nngOnInit() {\n  this.sub = this.data$.subscribe(...);\n}\n\nngOnDestroy() {\n  this.sub.unsubscribe();\n}",
      "language": "typescript"
    },
    {
      "id": "takeuntil-pattern",
      "title": "takeUntil pattern",
      "explanation": `
          <p>The <strong>takeUntil</strong> pattern is the professional way to manage multiple subscriptions. You create a \"notifier\" Subject that emits once when the component is destroyed. All your observable streams are piped through <code>takeUntil(notifier)</code>.</p>\n\n          <p>This is much cleaner than managing an array of individual subscription objects.</p>\n        `,
      "code": "private destroy$ = new Subject<void>();\n\nngOnInit() {\n  this.data$.pipe(takeUntil(this.destroy$)).subscribe(...);\n  this.user$.pipe(takeUntil(this.destroy$)).subscribe(...);\n}\n\nngOnDestroy() {\n  this.destroy$.next();\n  this.destroy$.complete();\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">takeUntil Mechanism</p><div class="flex items-center justify-center gap-4"><div class="bg-indigo-50 border border-indigo-200 p-2 rounded text-[10px]">Data Stream</div><div class="text-slate-300">&rarr;</div><div class="bg-amber-100 border border-amber-300 p-2 rounded text-xs font-bold">takeUntil(destroy$)</div><div class="text-slate-300">&rarr;</div><div class="bg-emerald-50 border border-emerald-200 p-2 rounded text-[10px]">Auto-Closed</div></div></div>`
    },
    {
      "id": "async-pipe-benefits",
      "title": "async pipe benefits",
      "explanation": `
          <p>The <strong>async pipe</strong> is the most declarative and safe way to handle Observables in Angular templates.</p>\n\n          <h3>Why it's better:</h3>\n          <ul>\n            <li><strong>Auto-Subscription:</strong> Subscribes automatically when the component loads.</li>\n            <li><strong>Auto-Unsubscription:</strong> Unsubscribes automatically when the component is destroyed, eliminating leak risks.</li>\n            <li><strong>Change Detection:</strong> Calls <code>markForCheck()</code> internally, making it work perfectly with <code>OnPush</code>.</li>\n            <li><strong>Cleaner Code:</strong> You don't need to manually store data in class properties.</li>\n          </ul>\n        `,
      "code": "<!-- No manual TS logic needed -->\n<ul>\n  <li *ngFor=\"let user of users$ | async\">\n    {{ user.name }}\n  </li>\n</ul>",
      "language": "html"
    }
  ]
});