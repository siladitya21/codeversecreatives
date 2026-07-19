window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "change-detection",
  "title": "Change Detection",
  "icon": "bi bi-lightning-charge",
  "questions": [
    {
      id: "angular-22-standard-change-detection-upgrade",
      title: "Angular 22 standard for change detection",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A restaurant kitchen that used to send a runner to check on <em>every single table</em> after any order came in, just in case. Angular 22's default is a kitchen with a bell wired to each table: the runner (change detection) only walks to the table (component) whose bell (signal) actually rang. <code>OnPush</code> used to be the special upgrade you had to install; now it's how the kitchen is built by default.</p>
          </div>
        </div>
        <p>Angular 22-ready change detection is centered on <strong>signals, immutable state, and smaller update scopes</strong>. As of Angular 22 (stable since June 3, 2026, currently patch 22.0.7), <strong><code>OnPush</code> is the default change detection strategy</strong> for any component that doesn't explicitly set <code>changeDetection</code> — this flipped from the old "check everything" default. Signals reduce the need to manually think in full-tree checks because Angular can track which template reads which reactive value.</p>
        <h3>Modern change detection checklist</h3>
        <ul>
          <li>Use signals for local component state — Angular already knows what depends on them.</li>
          <li>Use <code>computed()</code> for derived state instead of recalculating in template methods.</li>
          <li>Use immutable updates for objects and arrays — OnPush needs a new reference to notice a change.</li>
          <li>Use <code>@for (...; track ...)</code> for stable list rendering.</li>
          <li>Zoneless change detection is the default for new CLI-generated apps in v22 — existing apps keep Zone.js until you explicitly remove it.</li>
          <li>Avoid template methods that do expensive work on every check.</li>
        </ul>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Upgrading a project's <code>package.json</code> to Angular 22 does not retroactively make every existing component behave as OnPush cleaner or remove Zone.js. The OnPush-by-default flip only applies to components that never set <code>changeDetection</code> explicitly; an old component that relied on mutating objects in place with the historical Default strategy can start silently missing updates once it's treated as OnPush by default — audit mutation-heavy components before upgrading.</p>
          </div>
        </div>
      `,
      code: `import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-cart-summary',
  // changeDetection: ChangeDetectionStrategy.OnPush  ← no longer needed, it's the v22 default
  template: \`
    @for (item of items(); track item.id) {
      <p>{{ item.name }} x {{ item.quantity }}</p>
    }

    <strong>Total: {{ total() }}</strong>
  \`
})
export class CartSummaryComponent {
  readonly items = signal<CartItem[]>([]);
  readonly total = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  add(item: CartItem): void {
    this.items.update(items => [...items, item]);
  }
}`,
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Old Default vs Angular 22 Default</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-slate-50 border-2 border-slate-300 rounded-xl p-3\"><p class=\"font-bold text-slate-700 text-center mb-2\">Pre-22: Default strategy</p><p class=\"text-slate-600 text-center\">Every component checked on every cycle, whether it needs it or not</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">Angular 22: OnPush default</p><p class=\"text-slate-600 text-center\">Only checked when a signal it reads changes, an input reference changes, or an event fires inside it</p></div></div></div>"
    },
    {
      "id": "what-is-change-detection",
      "title": "What is change detection?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A live scoreboard operator at a stadium. The players (your data) change constantly, but the scoreboard (the DOM) doesn't update itself just because a player scored — someone has to notice the score changed and physically flip the numbers. Change detection is that operator: it watches for "something might have happened" moments and updates the board to match reality.</p>
          </div>
        </div>
        <p><strong>Change detection</strong> is Angular's process of keeping the DOM in sync with your component's data. Whenever data in a component changes, Angular needs to find out what changed and update the relevant parts of the HTML.</p>
        <h3>The problem it solves</h3>
        <p>In plain JavaScript, if you do <code>this.userName = 'Alice'</code>, the browser has no idea you changed a variable — you'd have to manually find the DOM element and update it. Angular's change detection does this automatically: you change the data, Angular figures out what the DOM should now look like, and updates it.</p>
        <h3>How Angular triggers it</h3>
        <p>Angular doesn't continuously watch your data (that would be too slow). Instead, it runs change detection at specific moments — whenever something asynchronous happens that <em>might</em> have changed state:</p>
        <ul>
          <li>A browser event fires (click, input, scroll, keypress)</li>
          <li>An HTTP response arrives</li>
          <li>A timer (<code>setTimeout</code> / <code>setInterval</code>) fires</li>
          <li>A Promise or Observable resolves</li>
          <li>In modern Angular: a signal read by a template changes value</li>
        </ul>
        <p>Zone.js (covered next) is the historical mechanism that detects all of these and tells Angular to run a check. Signals give Angular a more precise, Zone.js-free way to know the same thing.</p>
      `,
      "code": "// When you update a property:\nthis.userName = 'Alice';\n\n// Angular detects this change (triggered by an event or async op)\n// and updates any template binding that uses userName:\n// <h1>{{ userName }}</h1>  ← Angular updates this DOM node\n\n// ─── Angular also checks object/array bindings ─────────────────\nthis.user = { ...this.user, name: 'Alice' };   // ✅ NEW reference — CD detects it\nthis.user.name = 'Alice';                       // ✅ CD detects mutations for Default strategy\n                                                // ❌ OnPush strategy misses this (same reference)\n\n// ─── Strings, numbers, booleans — always detected ─────────────\nthis.count = 42;      // ✅\nthis.loading = true;  // ✅\nthis.title = 'New';   // ✅",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Data Change &rarr; DOM Update</p><div class=\"flex flex-wrap items-center justify-center gap-2 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 font-semibold text-indigo-700\">Data changes</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 font-semibold text-amber-700\">Angular notices (event/signal)</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 font-semibold text-emerald-700\">Bindings re-checked</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-rose-50 border-2 border-rose-200 rounded-lg px-3 py-2 font-semibold text-rose-700\">DOM patched</div></div></div>"
    },
    {
      "id": "how-does-cd-work",
      "title": "How does change detection work?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A fire drill inspector walking floor by floor, top to bottom, checking every room on every floor whether or not that floor reported a problem. That's the classic sweep. It's thorough and never misses anything, but on a 200-room building, one alarm on floor 2 still means walking all 200 rooms.</p>
          </div>
        </div>
        <p>Angular maintains a <strong>component tree</strong>. Change detection always starts at the root component and travels downward through every child component, in order — this is called a change detection <strong>cycle</strong>.</p>
        <h3>What happens in each cycle</h3>
        <p>For each component, Angular compares the current value of every template expression (e.g. <code>{{ user.name }}</code>, <code>[disabled]="form.invalid"</code>) against the value it recorded in the previous cycle. If they differ, Angular updates that DOM node. This comparison is called <strong>dirty checking</strong>.</p>
        <h3>When does a cycle run?</h3>
        <p>Historically, a cycle ran after every asynchronous event that Zone.js intercepted. In zoneless Angular, a cycle runs after a more precise set of notifications: a template-read signal changes, an event handler runs, <code>AsyncPipe</code> receives a new value, or <code>markForCheck()</code> is called.</p>
        <h3>Unidirectional data flow</h3>
        <p>Angular enforces a top-down flow: parent components pass data down to children. This means Angular only needs to walk the tree in one direction (top to bottom) per cycle, which is fast and predictable. Angular will throw an error in dev mode (<em>ExpressionChangedAfterItHasBeenChecked</em>) if a child component tries to change a parent's binding during the same cycle.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Setting a template-bound property inside <code>ngAfterViewInit()</code> synchronously will throw <code>ExpressionChangedAfterItHasBeenChecked</code> in dev mode, because Angular already finished checking that value for this cycle. Push the change to the next cycle with <code>setTimeout()</code>, or better, model the value as a signal that the view reads independently.</p>
          </div>
        </div>
      `,
      "code": "// Conceptual mental model of one change detection cycle:\n\n// 1. AppComponent  — check bindings, update DOM if needed\n//    ↓\n// 2. NavbarComponent  — check bindings, update DOM if needed\n//    ↓\n// 3. DashboardComponent  — check bindings, update DOM if needed\n//    ↓\n// 4. UserCardComponent  — check bindings, update DOM if needed\n//    ↓\n// 5. LeafComponent  — check bindings, update DOM if needed\n\n// Angular walks ALL components each cycle by default (pre-22 Default strategy).\n// In a large app with 200 components, this runs 200 checks per click.\n// This is why OnPush strategy exists — to skip unchanged subtrees.\n\n// ─── The ExpressionChangedAfterItHasBeenChecked error ──────────\n// This error means something is changing data AFTER Angular already\n// checked and rendered it in the same cycle:\n\nngAfterViewInit() {\n  // ❌ This changes a template-bound property after the view was rendered\n  // this.title = 'Changed';  ← causes the error in dev mode\n\n  // ✅ Use setTimeout to push the change to the NEXT cycle\n  setTimeout(() => this.title = 'Changed');\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">One Cycle — Top-Down Sweep</p><div class=\"flex flex-col items-center gap-2 text-xs font-mono\"><div class=\"bg-slate-800 text-white rounded-lg px-3 py-1.5\">AppComponent</div><div class=\"w-px h-3 bg-slate-300\"></div><div class=\"bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5\">NavbarComponent</div><div class=\"w-px h-3 bg-slate-300\"></div><div class=\"bg-slate-100 border border-slate-300 rounded-lg px-3 py-1.5\">DashboardComponent</div><div class=\"w-px h-3 bg-slate-300\"></div><div class=\"bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5\">UserCardComponent</div></div></div>"
    },
    {
      "id": "what-is-zone-js",
      "title": "What is Zone.js?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A security guard who quietly follows every delivery truck, every phone call, and every visitor in a building, and radios the front desk the instant any of them finishes their business — even if nobody asked to be told. Zone.js wraps <code>setTimeout</code>, <code>addEventListener</code>, <code>fetch</code>, and Promise callbacks so it can radio Angular "something async just finished" without you ever calling an update function yourself.</p>
          </div>
        </div>
        <p><strong>Zone.js</strong> is a library that <em>monkey-patches</em> (wraps) all asynchronous browser APIs — <code>setTimeout</code>, <code>setInterval</code>, <code>addEventListener</code>, <code>fetch</code>, Promise callbacks, and more.</p>
        <h3>What monkey-patching means</h3>
        <p>When Zone.js loads, it replaces the native <code>setTimeout</code> with its own version. Your code calls <code>setTimeout</code>, but you're actually calling Zone.js's wrapper. The wrapper does two things: calls the real <code>setTimeout</code>, and also hooks in to know when the callback fires.</p>
        <h3>Why Angular used this</h3>
        <p>Angular has no way of knowing when your data changes inside a <code>setTimeout</code> or an event listener on its own. Zone.js solved this: when any async callback finished executing, Zone.js notified Angular's root zone, which triggered a change detection cycle. This is how classic Angular "just worked" — you never called an update function; Zone.js did it for you.</p>
        <h3>The zoneless present</h3>
        <p>Angular Signals (introduced in v16, stable since v20) let Angular know exactly which component needs re-rendering, without needing Zone.js to guess. Zoneless change detection became stable in v20.2 and is the <strong>default for new apps generated by the CLI in Angular 22</strong> — Zone.js is now the opt-in, not the given.</p>
      `,
      "code": "// ─── Zone.js intercepts all async operations (classic Angular) ─\n\n// setTimeout — Zone.js wraps this\nsetTimeout(() => {\n  this.message = 'Timer fired!';  // Zone.js detects this callback finished\n                                  // → triggers Angular change detection\n                                  // → DOM updates to show new message\n}, 2000);\n\n// Event listener — also intercepted\ndocument.querySelector('button')?.addEventListener('click', () => {\n  this.count++;  // Zone.js intercepts this event → triggers CD\n});\n\n// ─── Running outside NgZone (classic performance optimization) ─\n// If you have a high-frequency operation (mouse move, requestAnimationFrame)\n// that does NOT change Angular bindings, running it inside Angular's zone\n// triggers needless CD on every event. Run it OUTSIDE the zone:\n\nimport { NgZone } from '@angular/core';\n\nconstructor(private ngZone: NgZone) {}\n\nsetupChart() {\n  this.ngZone.runOutsideAngular(() => {\n    requestAnimationFrame(this.drawFrame.bind(this));\n  });\n}\n\n// ─── Angular 22: zoneless by default — no Zone.js patching at all ──\n// bootstrapApplication(AppComponent, { providers: [] });\n// Reactivity now comes entirely from signals, AsyncPipe, event\n// handlers, and explicit markForCheck() — nothing is monkey-patched.",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Zone.js Era vs Zoneless Era</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-slate-50 border-2 border-slate-300 rounded-xl p-3\"><p class=\"font-bold text-slate-700 text-center mb-2\">With Zone.js</p><ul class=\"text-slate-600 space-y-1\"><li>Patches setTimeout, fetch, events</li><li>Notifies Angular on ANY async completion</li><li>~36KB extra, patching overhead</li></ul></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">Zoneless (v22 default)</p><ul class=\"text-slate-600 space-y-1\"><li>No monkey-patching</li><li>Signals notify Angular precisely</li><li>Smaller bundle, predictable updates</li></ul></div></div></div>"
    },
    {
      "id": "cd-strategies",
      "title": "Change detection strategies (Default vs OnPush)",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Two different mail carriers. Default is the one who knocks on every door on the street every single day, just to check if anyone has mail — reliable, but wasteful. OnPush is the one who only knocks when a "new mail" flag has actually been raised on that specific mailbox (a new input reference, an event, an async pipe emission). Same job, radically less walking.</p>
          </div>
        </div>
        <p>Angular provides two strategies that control how frequently a component is checked during change detection cycles.</p>
        <h3>Default (CheckAlways)</h3>
        <p>Angular checks the component on <em>every</em> change detection cycle, regardless of what triggered it. Safe and simple, but in a large app with hundreds of components, every user click runs hundreds of checks — most of them unnecessary. This used to be the implicit behavior when you wrote nothing; in Angular 22, <code>OnPush</code> is implicit instead, so you'd now write <code>changeDetection: ChangeDetectionStrategy.Default</code> explicitly if you actually want the old always-check behavior.</p>
        <h3>OnPush</h3>
        <p>Angular checks the component <em>only</em> when specific conditions are met — essentially only when its data might actually have changed. Angular skips the entire component subtree otherwise. This can dramatically reduce the number of checks per cycle.</p>
        <h3>OnPush triggers a check when</h3>
        <ol style="list-style:decimal;padding-left:1.25rem;color:#475569;line-height:1.8;">
          <li>An <code>@Input()</code>/<code>input()</code> property receives a <strong>new object reference</strong></li>
          <li>An <strong>event handler</strong> inside the component fires (click, input, etc.)</li>
          <li>An Observable bound with the <strong>async pipe</strong> emits a new value</li>
          <li>A <strong>signal</strong> read by the template changes value</li>
          <li>You call <code>markForCheck()</code> or <code>detectChanges()</code> manually on <code>ChangeDetectorRef</code></li>
        </ol>
        <h3>OnPush and immutability</h3>
        <p>OnPush only detects <em>reference changes</em>. Mutating an object (<code>this.user.name = 'x'</code>) while keeping the same reference will <em>not</em> trigger a check. You must replace the reference: <code>this.user = { ...this.user, name: 'x' }</code>.</p>
      `,
      "code": "import { Component, Input, ChangeDetectionStrategy } from '@angular/core';\n\n// ─── Explicit Default strategy (opt-out of the v22 OnPush default) ──\n@Component({\n  selector: 'app-header',\n  template: `<h1>{{ title }}</h1>`,\n  changeDetection: ChangeDetectionStrategy.Default   // now must be explicit to get old behavior\n})\nexport class HeaderComponent {\n  title = 'Dashboard';\n}\n\n// ─── OnPush strategy — the Angular 22 default, no annotation needed ──\n@Component({\n  selector: 'app-user-card',\n  template: `\n    <div>{{ user.name }}</div>\n    <div>{{ user.email }}</div>\n    <button (click)=\"onSelect()\">Select</button>\n  `\n  // changeDetection: ChangeDetectionStrategy.OnPush  ← implicit in v22\n})\nexport class UserCardComponent {\n  @Input() user!: User;   // CD runs only when a NEW User object is passed\n\n  onSelect() {\n    // Events inside OnPush components DO trigger CD for this component\n    console.log('Selected:', this.user.name);\n  }\n}\n\n// ─── Parent must replace the reference for OnPush to detect the change ──\n// ❌ This mutates in place — OnPush child won't re-render\n// this.currentUser.name = 'Alice';\n\n// ✅ Replace the reference — OnPush child WILL re-render\n// this.currentUser = { ...this.currentUser, name: 'Alice' };",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">What Wakes Up an OnPush Component</p><div class=\"grid grid-cols-2 md:grid-cols-3 gap-2 text-xs max-w-lg mx-auto\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-center font-semibold text-indigo-700\">New @Input() reference</div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center font-semibold text-emerald-700\">Event fired inside it</div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-2 text-center font-semibold text-amber-700\">Async pipe emission</div><div class=\"bg-rose-50 border border-rose-200 rounded-lg p-2 text-center font-semibold text-rose-700\">Signal read changes</div><div class=\"bg-purple-50 border border-purple-200 rounded-lg p-2 text-center font-semibold text-purple-700\">markForCheck()</div><div class=\"bg-cyan-50 border border-cyan-200 rounded-lg p-2 text-center font-semibold text-cyan-700\">detectChanges()</div></div></div>"
    },
    {
      "id": "default-strategy",
      "title": "When to use Default strategy?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Keeping the porch light on all night instead of wiring a motion sensor. It costs more electricity, but it's zero setup and it never misses a visitor who walks up in a way the sensor wasn't calibrated for — like a third-party library mutating your data in ways you don't control.</p>
          </div>
        </div>
        <p>The <strong>Default</strong> strategy (also called <code>CheckAlways</code>) checks the component on every change detection cycle, no matter what. Angular always walks through it.</p>
        <h3>When to use it</h3>
        <ul>
          <li><strong>Small applications</strong> where performance isn't a concern yet</li>
          <li>Components that <strong>mutate objects in place</strong> and can't easily switch to immutable patterns</li>
          <li>Components that <strong>receive data from imperative code</strong> (third-party libraries, WebSockets that push mutations) where you don't control how state is updated</li>
          <li>During prototyping — use Default to get things working, then optimize with OnPush later</li>
        </ul>
        <h3>The trade-off</h3>
        <p>Default is convenient but scales poorly. In an app with 300 components and Default everywhere, a single click triggers 300 template checks. Most checks find nothing has changed — they're wasted. This is why large, production Angular apps lean on OnPush (now the v22 default) for most components, and reach for Default only as a deliberate, named exception.</p>
      `,
      "code": "import { Component, ChangeDetectionStrategy } from '@angular/core';\n\n// In Angular 22, Default must be requested explicitly — it's no longer implicit\n@Component({\n  selector: 'app-notification-banner',\n  template: `<div *ngIf=\"show\">{{ message }}</div>`,\n  changeDetection: ChangeDetectionStrategy.Default\n})\nexport class NotificationBannerComponent {\n  show = false;\n  message = '';\n\n  // Even mutations are picked up:\n  push(msg: string) {\n    this.message = msg;   // Angular will detect this on the next cycle\n    this.show = true;\n  }\n}\n\n// ─── Real-world: component fed by a third-party WebSocket library\n@Component({\n  selector: 'app-stock-ticker',\n  template: `<p>{{ price }}</p>`,\n  changeDetection: ChangeDetectionStrategy.Default\n})\nexport class StockTickerComponent implements OnInit {\n  price = 0;\n\n  ngOnInit() {\n    // A third-party lib calls a callback with new data.\n    // We have no control over reference replacement here.\n    thirdPartyStockFeed.onUpdate((newPrice: number) => {\n      this.price = newPrice;   // Default strategy picks this up automatically\n    });\n    // With OnPush, we'd need markForCheck() here — Default just works.\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Reach for Default When</p><div class=\"grid grid-cols-1 md:grid-cols-3 gap-2 text-xs\"><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-2 text-center\">Third-party library mutates your data</div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-2 text-center\">Rapid prototyping</div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-2 text-center\">Tiny app, perf isn't the bottleneck</div></div></div>"
    },
    {
      "id": "onpush-strategy",
      "title": "OnPush strategy — real-world usage",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A hotel that only cleans a room when the guest has actually checked out and a new one checks in — not every single day whether the room needs it or not. For a hotel with 300 rooms, that's the difference between 300 cleanings and maybe 20 a day.</p>
          </div>
        </div>
        <p><strong>OnPush</strong> is the performance-critical strategy, and the Angular 22 default. Angular skips the component and all its children unless one of the trigger conditions is met. In a large app, this can cut the number of template checks by 80–90% per cycle.</p>
        <h3>Best for</h3>
        <ul>
          <li><strong>Pure presentational (dumb) components</strong> — components that only display data they receive via <code>@Input()</code>/<code>input()</code> and don't manage their own state</li>
          <li><strong>List items</strong> — e.g. <code>@for</code> renders 100 UserCardComponents; with OnPush, Angular only re-checks the cards whose input reference changed</li>
          <li><strong>Components that use the async pipe</strong> — the async pipe calls <code>markForCheck()</code> automatically when the Observable emits</li>
          <li><strong>Components built on signals</strong> — signals notify OnPush components automatically when a read value changes, no manual wiring needed</li>
        </ul>
        <h3>Using OnPush with services</h3>
        <p>When an OnPush component needs to react to data from a service (not via <code>@Input()</code>), use a signal or an Observable with the async pipe — this is the cleanest pattern. Alternatively, inject <code>ChangeDetectorRef</code> and call <code>markForCheck()</code> after updating data from an uncontrolled callback.</p>
      `,
      "code": "import { Component, Input, ChangeDetectorRef, OnInit } from '@angular/core';\nimport { Observable } from 'rxjs';\nimport { NotificationService } from './notification.service';\n\n// ─── Pattern 1: Pure presentational component with @Input (OnPush is implicit) ─\n@Component({\n  selector: 'app-user-card',\n  template: `<p>{{ user.name }} — {{ user.role }}</p>`\n})\nexport class UserCardComponent {\n  @Input() user!: User;\n  // Angular re-checks ONLY when a new User object reference is passed.\n  // Perfect for large @for lists.\n}\n\n// ─── Pattern 2: OnPush + async pipe (self-managing) ─────────────\n@Component({\n  selector: 'app-notification-panel',\n  template: `\n    @for (n of notifications$ | async; track n.id) {\n      <div>{{ n.text }}</div>\n    }\n  `\n})\nexport class NotificationPanelComponent {\n  notifications$: Observable<Notification[]>;\n\n  constructor(private notifService: NotificationService) {\n    this.notifications$ = notifService.getAll();  // async pipe handles subscribe + markForCheck\n  }\n}\n\n// ─── Pattern 3: OnPush + manual markForCheck for uncontrolled callbacks ─\n@Component({\n  selector: 'app-clock',\n  template: `<p>{{ time }}</p>`\n})\nexport class ClockComponent implements OnInit {\n  time = '';\n  constructor(private cdr: ChangeDetectorRef) {}\n\n  ngOnInit() {\n    setInterval(() => {\n      this.time = new Date().toLocaleTimeString();\n      this.cdr.markForCheck();  // tell Angular: this OnPush component has new data\n    }, 1000);\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Where OnPush Pays Off Most</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-3 text-xs\"><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">Great fit</p><ul class=\"text-slate-600 space-y-1\"><li>Presentational list-item components</li><li>Signal-driven components</li><li>Components fed by async pipe</li></ul></div><div class=\"bg-rose-50 border-2 border-rose-200 rounded-xl p-3\"><p class=\"font-bold text-rose-700 text-center mb-2\">Needs care</p><ul class=\"text-slate-600 space-y-1\"><li>Third-party callback data</li><li>Code that mutates objects in place</li><li>Legacy components relying on Default</li></ul></div></div></div>"
    },
    {
      "id": "manual-cd-trigger",
      "title": "How to trigger change detection manually (ChangeDetectorRef)?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text"><code>markForCheck()</code> is ringing a doorbell — "please come check this room next round." <code>detectChanges()</code> is knocking and walking in right now, immediately. <code>detach()</code> is taking the room off the cleaning schedule entirely until you manually put it back with <code>reattach()</code>.</p>
          </div>
        </div>
        <p>Sometimes you need to take direct control of change detection. Angular provides <code>ChangeDetectorRef</code> for this purpose — inject it into any component to control when and how it is checked.</p>
        <h3>markForCheck()</h3>
        <p>Marks the component (and all its ancestors) as dirty — to be checked in the <em>next</em> change detection cycle. Use this inside OnPush components when you update data that Angular wouldn't otherwise detect (e.g. data from a service callback, a setTimeout, or a third-party library).</p>
        <h3>detectChanges()</h3>
        <p>Forces an <em>immediate</em> synchronous check of this component and its children. Useful when you need the DOM to update right now (e.g. after programmatic focus changes, or inside a non-Angular callback).</p>
        <h3>detach() / reattach()</h3>
        <p>Completely removes a component from the change detection tree (<code>detach()</code>) or adds it back (<code>reattach()</code>). Advanced pattern for components that update very infrequently — you manage entirely when they are checked.</p>
        <h3>detach + manual poll</h3>
        <p>A powerful pattern for dashboards: detach the component from automatic CD, and only call <code>detectChanges()</code> when fresh data arrives from the API.</p>
      `,
      "code": "import { Component, OnInit, ChangeDetectorRef } from '@angular/core';\nimport { ExternalWidgetService } from './external-widget.service';\n\n@Component({\n  selector: 'app-live-price',\n  template: `<span>{{ price | currency }}</span>`\n})\nexport class LivePriceComponent implements OnInit {\n  price = 0;\n\n  constructor(\n    private widgetService: ExternalWidgetService,\n    private cdr: ChangeDetectorRef\n  ) {}\n\n  ngOnInit() {\n    // This callback is from a third-party library — outside Angular's\n    // normal notification paths, so Angular might not know the value changed.\n    this.widgetService.onPriceChange((newPrice: number) => {\n      this.price = newPrice;\n      this.cdr.markForCheck();   // schedule a check on this OnPush component\n    });\n  }\n}\n\n// ─── detach / detectChanges pattern for high-performance panels ─\n@Component({\n  selector: 'app-metrics-panel',\n  template: `\n    @for (m of metrics; track m.label) {\n      <div>{{ m.label }}: {{ m.value }}</div>\n    }\n  `\n})\nexport class MetricsPanelComponent implements OnInit {\n  metrics: Metric[] = [];\n\n  constructor(private cdr: ChangeDetectorRef, private api: MetricsService) {}\n\n  ngOnInit() {\n    this.cdr.detach();   // completely remove from automatic CD tree\n\n    // Poll every 5 seconds manually\n    setInterval(() => {\n      this.api.getMetrics().subscribe(data => {\n        this.metrics = data;\n        this.cdr.detectChanges();   // only update when new data actually arrives\n      });\n    }, 5000);\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">ChangeDetectorRef — Escalation Ladder</p><div class=\"flex flex-col items-center gap-2 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-4 py-2 font-semibold text-indigo-700 w-full max-w-xs text-center\">markForCheck() — queue for next cycle</div><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-4 py-2 font-semibold text-amber-700 w-full max-w-xs text-center\">detectChanges() — check right now</div><div class=\"bg-rose-50 border-2 border-rose-200 rounded-lg px-4 py-2 font-semibold text-rose-700 w-full max-w-xs text-center\">detach() — stop checking until reattach()</div></div></div>"
    }
  ]
});
