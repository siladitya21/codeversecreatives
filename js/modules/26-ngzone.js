window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "ngzone",
  "title": "NgZone & Change Detection",
  "icon": "bi bi-speedometer",
  "questions": [
    {
      id: "angular-22-standard-ngzone-upgrade",
      title: "Angular 22 standard for NgZone",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Keeping a <strong>fax machine</strong> in a modern office that otherwise runs on instant messaging. Most communication (state updates) now goes straight through &mdash; a signal changes, the exact component that cares re-renders. But a few old devices (third-party libraries, some browser APIs) still only "speak fax," so you keep NgZone around as a translator at the edge of the building &mdash; not as the office's main phone system anymore.</p>
          </div>
        </div>
        <p>In Angular 22, <code>NgZone</code> is an <strong>integration tool</strong>, not the engine that drives every UI update. Signals and explicit state changes do that job now. Reach for <code>NgZone</code> when you're bridging in a high-frequency browser API or a third-party library that runs its callbacks outside Angular's normal rendering flow and you need to deliberately opt a burst of work in or out of change detection.</p>
        <h3>Modern NgZone checklist</h3>
        <ul>
          <li>Use signals for component state that templates read &mdash; they notify Angular directly, with no zone required.</li>
          <li>Run expensive, UI-irrelevant work outside Angular with <code>runOutsideAngular()</code> when you're still on Zone.js.</li>
          <li>Re-enter Angular only when UI-bound state must change.</li>
          <li>New apps are zoneless by default in Angular 22 &mdash; check library compatibility before assuming you can remove Zone.js from an <em>existing</em> app.</li>
          <li>Don't use zone tricks to paper over mutation-heavy state design; fix the state shape instead.</li>
        </ul>
      `,
      code: `@Component({
  selector: 'app-pointer-tracker',
  template: '<p>{{ position().x }}, {{ position().y }}</p>'
})
export class PointerTrackerComponent {
  readonly position = signal({ x: 0, y: 0 });
  private readonly zone = inject(NgZone);

  ngOnInit(): void {
    // Still relevant on a Zone.js app: keep this high-frequency
    // listener from triggering change detection on every pixel.
    this.zone.runOutsideAngular(() => {
      window.addEventListener('pointermove', event => {
        if (event.buttons === 1) {
          this.zone.run(() => {
            this.position.set({ x: event.clientX, y: event.clientY });
          });
        }
      });
    });
  }
}`,
      language: "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Zone.js Era vs Angular 22 Default</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-slate-50 border-2 border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">Angular &lt; 18 (Zone.js only)</p><div class="space-y-1.5"><div class="bg-rose-50 border border-rose-200 rounded px-2 py-1 text-center">every async API monkey-patched</div><div class="bg-rose-50 border border-rose-200 rounded px-2 py-1 text-center">any completion &rarr; full tree check</div><div class="bg-rose-50 border border-rose-200 rounded px-2 py-1 text-center">~36KB zone.js bundle cost</div></div></div><div class="bg-slate-50 border-2 border-dashed border-indigo-300 rounded-xl p-3"><p class="font-bold text-indigo-700 text-center mb-2">Angular 22 (zoneless default)</p><div class="space-y-1.5"><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 text-center">signals track their own readers</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 text-center">only affected components re-render</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1 text-center">no zone.js polyfill needed</div></div></div></div></div>`
    },
    {
      "id": "what-is-ngzone",
      "title": "What is NgZone (Zone.js), and why is it optional in Angular 22?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>security guard assigned to eavesdrop on every phone call, doorbell, and delivery</strong> in a building, purely so management can be alerted the instant <em>anything</em> happens and go check whether something changed. That is Zone.js: it monkey-patches <code>setTimeout</code>, <code>addEventListener</code>, <code>Promise</code>, <code>fetch</code>, and friends &mdash; not because it cares what they do, but so Angular finds out the moment any of them finishes and can run change detection.</p>
          </div>
        </div>
        <p>Angular's core problem is simple to state and hard to solve: it needs to know when component data changes so it can update the DOM, but JavaScript is single-threaded and asynchronous, so nothing is watching your variables in real time. For most of Angular's history, the answer was <strong>Zone.js</strong> &mdash; a library that patches every asynchronous browser API so it can detect when async work completes, and <strong>NgZone</strong>, Angular's wrapper that turns those completions into "run change detection now" signals.</p>
        <h3>How the patched model actually works</h3>
        <p>Zone.js creates a special execution context called the "Angular zone." Code that runs inside it &mdash; including every async callback &mdash; is tracked. When an async task inside the zone finishes, Zone.js notifies NgZone, and NgZone runs change detection across the component tree to see if any bindings need updating. This is what makes "just change a property and the template updates" feel like magic: the magic is a global eavesdropper, not clairvoyance.</p>
        <h3>What that magic actually cost</h3>
        <ul>
          <li><strong>Bundle size</strong> &mdash; the zone.js polyfill adds roughly 36KB to your initial load.</li>
          <li><strong>Patching overhead</strong> &mdash; every <code>setTimeout</code>, DOM event, and promise resolution pays a small tax to route through the zone.</li>
          <li><strong>Unpredictable scope</strong> &mdash; one unrelated <code>setInterval</code> tick can trigger a change detection pass across the <em>entire</em> component tree, not just the component that actually changed.</li>
        </ul>
        <h3>The zoneless alternative</h3>
        <p>Angular 18 introduced <strong>zoneless change detection</strong> as an experimental alternative: instead of eavesdropping on every async API, Angular relies on signals (which know exactly which components read them) plus explicit notifications (event bindings, <code>markForCheck()</code>, the <code>AsyncPipe</code>) to know precisely when and where to re-render. In Angular 22, <code>provideZonelessChangeDetection()</code> is stable and is the default for apps generated by the CLI &mdash; Zone.js has flipped from "the only option" to "an opt-in integration mechanism."</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Zone.js is not deprecated and NgZone still exists in Angular 22 &mdash; it's just no longer the assumed foundation. Plenty of production apps, and some third-party libraries, still run on Zone.js by design. "Zoneless by default" describes what the CLI scaffolds for <em>new</em> apps, not a removal of the API.</p>
          </div>
        </div>
      `,
      "code": "// Zone.js patches async APIs, so Angular can detect when they complete:\n// The sequence is:\n//   1. You update component state in a setTimeout callback\n//   2. Zone.js intercepts the setTimeout completion\n//   3. Zone.js notifies NgZone\n//   4. NgZone triggers Angular's change detection\n//   5. Angular re-renders any bindings that changed — across the WHOLE tree\n\nimport { Component, NgZone } from '@angular/core';\n\n@Component({\n  selector: 'app-progress',\n  template: `\n    <div class=\"progress-bar\" [style.width.%]=\"progress\">{{ progress }}%</div>\n    <button (click)=\"startProgress()\">Start</button>\n  `\n})\nexport class ProgressComponent {\n  progress = 0;\n\n  constructor(private ngZone: NgZone) {}\n\n  startProgress(): void {\n    // setInterval runs inside Angular's zone by default (Zone.js-based apps).\n    // When the callback fires, NgZone triggers change detection\n    // and Angular updates the template with the new progress value.\n    let current = 0;\n    const interval = setInterval(() => {\n      current += 10;\n      this.progress = current;   // change detection runs after each tick\n      if (current >= 100) clearInterval(interval);\n    }, 200);\n  }\n}\n\n// Angular 22 zoneless equivalent — no patching, no global sweep:\n// readonly progress = signal(0);\n// ...\n// this.progress.set(current); // notifies only the consumers of this signal",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">How A Change Gets Noticed</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-rose-50 border-2 border-rose-200 rounded-xl p-3\"><p class=\"font-bold text-rose-700 text-center mb-2\">Zone-based (patched)</p><div class=\"flex flex-col items-center gap-1\"><div class=\"bg-white border border-rose-200 rounded px-2 py-1 w-full text-center\">async API called</div><div class=\"text-rose-300\">&darr;</div><div class=\"bg-white border border-rose-200 rounded px-2 py-1 w-full text-center\">Zone.js intercepts completion</div><div class=\"text-rose-300\">&darr;</div><div class=\"bg-white border border-rose-200 rounded px-2 py-1 w-full text-center\">NgZone notified</div><div class=\"text-rose-300\">&darr;</div><div class=\"bg-rose-600 text-white rounded px-2 py-1 w-full text-center font-bold\">whole tree checked</div></div></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">Zoneless (signals)</p><div class=\"flex flex-col items-center gap-1\"><div class=\"bg-white border border-emerald-200 rounded px-2 py-1 w-full text-center\">signal.set() called</div><div class=\"text-emerald-300\">&darr;</div><div class=\"bg-white border border-emerald-200 rounded px-2 py-1 w-full text-center\">signal knows its readers</div><div class=\"text-emerald-300\">&darr;</div><div class=\"bg-emerald-600 text-white rounded px-2 py-1 w-full text-center font-bold\">only affected views checked</div></div></div></div></div>"
    },
    {
      "id": "zoneless-change-detection-angular22",
      "title": "provideZonelessChangeDetection() — the Angular 22 default in practice",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Swapping the building's <strong>eavesdropping guard</strong> for <strong>smart sensors wired directly to each machine</strong>. Instead of one guard listening to every conversation and paging the whole facility "something happened, everyone check your area," each machine's own sensor pages exactly the technician responsible for it. Fewer pages, faster response, and you can finally decommission the guard's desk (the zone.js bundle) entirely.</p>
          </div>
        </div>
        <p>Angular 22 apps generated by the CLI call <code>provideZonelessChangeDetection()</code> in their bootstrap providers by default &mdash; no <code>zone.js</code> import, no monkey-patched globals. Change detection instead runs when: a signal read in a template changes, a native DOM event bound in a template fires, <code>ChangeDetectorRef.markForCheck()</code> is called explicitly, or an <code>AsyncPipe</code>/<code>resource()</code>/<code>rxResource()</code>/<code>httpResource()</code> emits a new value. All of those are precise: Angular knows exactly which component to re-check.</p>
        <h3>What you gain</h3>
        <ul>
          <li>Smaller initial bundle &mdash; no zone.js polyfill to download and parse.</li>
          <li>No patching overhead on <code>setTimeout</code>, <code>Promise</code>, DOM events, and friends.</li>
          <li>Predictable, localized re-renders instead of "something happened somewhere, recheck everything."</li>
          <li>Cleaner stack traces &mdash; async stacks aren't rewritten by zone patching.</li>
        </ul>
        <h3>Opting back into Zone.js</h3>
        <p>If a dependency still relies on zone patching to function, you can swap in <code>provideZoneChangeDetection({ eventCoalescing: true })</code> instead &mdash; the option still exists and is fully supported, it's just no longer what the CLI reaches for automatically.</p>
        <h3>Migrating an existing app</h3>
        <p>This is the fact that trips people up most: upgrading an existing app's <code>package.json</code> to Angular 22 does <strong>not</strong> remove Zone.js. The app keeps running on Zone.js exactly as before until a developer deliberately swaps <code>provideZoneChangeDetection()</code> for <code>provideZonelessChangeDetection()</code>, removes the <code>zone.js</code> polyfill import, and audits code that assumed a global change-detection sweep would catch a mutation it never explicitly signaled.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Tests written with <code>fakeAsync</code>/<code>tick()</code> rely on Zone.js patching timers &mdash; they don't work the same way once an app is zoneless. Also, don't assume every third-party UI library is zoneless-safe: a library that mutates component state directly and expects a zone-driven sweep to notice will silently stop updating the view until you migrate its integration to signals or explicit <code>markForCheck()</code> calls.</p>
          </div>
        </div>
      `,
      "code": "// main.ts — Angular 22 CLI-generated bootstrap (zoneless by default)\nimport { bootstrapApplication } from '@angular/platform-browser';\nimport { provideZonelessChangeDetection } from '@angular/core';\nimport { AppComponent } from './app/app.component';\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    provideZonelessChangeDetection()\n    // No zone.js import in polyfills — it simply isn't loaded.\n  ]\n});\n\n// Opting back into Zone.js for an app or a legacy dependency:\n// import { provideZoneChangeDetection } from '@angular/core';\n// providers: [ provideZoneChangeDetection({ eventCoalescing: true }) ]\n\n// ---- Migrating an EXISTING (pre-22) app ----\n// 1. Update to Angular 22 — Zone.js keeps running exactly as before.\n// 2. Swap the provider:\n//    - provideZoneChangeDetection() → provideZonelessChangeDetection()\n// 3. Remove `import 'zone.js';` from polyfills.ts (or angular.json polyfills array).\n// 4. Audit components for direct mutation that relied on a global CD sweep —\n//    convert state to signal()/computed(), or call markForCheck() explicitly.\n// 5. Re-run the test suite; replace fakeAsync/tick patterns that assumed\n//    zone-patched timers with signal-based or async/await equivalents.",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">New App vs Upgraded App in Angular 22</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">ng new (Angular 22)</p><div class=\"flex flex-col items-center gap-1\"><div class=\"bg-white border border-emerald-200 rounded px-2 py-1 w-full text-center\">provideZonelessChangeDetection()</div><div class=\"text-emerald-300\">&darr;</div><div class=\"bg-emerald-600 text-white rounded px-2 py-1 w-full text-center font-bold\">zoneless out of the box</div></div></div><div class=\"bg-amber-50 border-2 border-amber-200 rounded-xl p-3\"><p class=\"font-bold text-amber-700 text-center mb-2\">ng update to v22 (existing app)</p><div class=\"flex flex-col items-center gap-1\"><div class=\"bg-white border border-amber-200 rounded px-2 py-1 w-full text-center\">provideZoneChangeDetection() unchanged</div><div class=\"text-amber-300\">&darr;</div><div class=\"bg-amber-600 text-white rounded px-2 py-1 w-full text-center font-bold\">still on Zone.js until YOU opt out</div></div></div></div></div>"
    },
    {
      "id": "run-code-outside-angular-zone",
      "title": "Running code outside the Angular zone for performance",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Putting your phone on <strong>Do Not Disturb</strong> during a task that generates constant notifications &mdash; a 60fps animation loop firing every 16ms. You don't need a buzz for every single frame; you just want to glance at the phone once a second and update the one thing that matters (the FPS counter). <code>runOutsideAngular()</code> is the Do Not Disturb toggle for a chunk of code.</p>
          </div>
        </div>
        <p>On a Zone.js-based app, the default behavior &mdash; running change detection after every async callback &mdash; is convenient but not free. If a piece of code fires callbacks at very high frequency (an animation loop at 60fps, a mousemove listener firing hundreds of times a second), Angular runs its entire change detection tree on every single tick. Most apps never notice; components with deep trees or heavy bindings can visibly jank.</p>
        <p><code>NgZone.runOutsideAngular()</code> executes code in a context Zone.js does not track. Async callbacks that originate inside it don't trigger change detection when they complete &mdash; the DOM just doesn't update, until you explicitly re-enter the zone.</p>
        <h3>The canonical pattern</h3>
        <p>Start the high-frequency work outside the zone. Gather results there without touching Angular. Once a meaningful value is ready to display, call <code>ngZone.run()</code> to re-enter the zone and set the component property. Angular detects that one update instead of hundreds of intermediate ones.</p>
        <h3>Real-world use cases</h3>
        <p>Animation loops (<code>requestAnimationFrame</code>), WebSocket message handling, high-frequency sensor data (accelerometer, mouse tracking), and third-party charting libraries (D3, Chart.js) all benefit from running outside the zone.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">On a zoneless app, <code>runOutsideAngular()</code> isn't doing the job you think it's doing &mdash; there's no zone-triggered change detection sweep to escape from in the first place, since zoneless apps never had that global sweep. The technique still matters for apps that run on Zone.js; in a zoneless app, control what re-renders through signals and explicit notifications instead.</p>
          </div>
        </div>
      `,
      "code": "import { Component, NgZone, OnDestroy, ElementRef, ViewChild } from '@angular/core';\n\n@Component({\n  selector: 'app-realtime-chart',\n  template: `\n    <canvas #chart width=\"600\" height=\"200\"></canvas>\n    <p>FPS: {{ displayedFps }}</p>\n    <button (click)=\"startRendering()\">Start</button>\n    <button (click)=\"stopRendering()\">Stop</button>\n  `\n})\nexport class RealtimeChartComponent implements OnDestroy {\n  @ViewChild('chart') canvasRef!: ElementRef<HTMLCanvasElement>;\n  displayedFps = 0;\n  private rafId = 0;\n  private frameCount = 0;\n\n  constructor(private ngZone: NgZone) {}\n\n  startRendering(): void {\n    // Run the animation loop OUTSIDE Angular's zone.\n    // requestAnimationFrame fires 60 times/second — we don't want\n    // change detection running 60 times/second for a canvas that\n    // Angular isn't even rendering (it's drawn via Canvas API).\n    this.ngZone.runOutsideAngular(() => {\n      const ctx = this.canvasRef.nativeElement.getContext('2d')!;\n      let lastTime = performance.now();\n\n      const loop = (now: number) => {\n        const delta = now - lastTime;\n        lastTime = now;\n        this.frameCount++;\n\n        // Draw frame — pure canvas, no Angular bindings involved\n        ctx.clearRect(0, 0, 600, 200);\n        ctx.fillStyle = '#6366f1';\n        ctx.fillRect(Math.random() * 580, Math.random() * 180, 20, 20);\n\n        // Only update the Angular-bound FPS display every second\n        if (this.frameCount % 60 === 0) {\n          const fps = Math.round(1000 / delta);\n          // Re-enter the Angular zone just for this one update\n          this.ngZone.run(() => { this.displayedFps = fps; });\n        }\n\n        this.rafId = requestAnimationFrame(loop);\n      };\n\n      this.rafId = requestAnimationFrame(loop);\n    });\n  }\n\n  stopRendering(): void {\n    cancelAnimationFrame(this.rafId);\n  }\n\n  ngOnDestroy(): void {\n    this.stopRendering();\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">60 Ticks Outside, 1 Update Inside</p><div class=\"flex flex-wrap items-center justify-center gap-1 text-xs mb-4\"><div class=\"bg-slate-100 border border-slate-200 rounded px-2 py-1 text-slate-400\">tick</div><div class=\"bg-slate-100 border border-slate-200 rounded px-2 py-1 text-slate-400\">tick</div><div class=\"bg-slate-100 border border-slate-200 rounded px-2 py-1 text-slate-400\">tick</div><div class=\"bg-slate-100 border border-slate-200 rounded px-2 py-1 text-slate-400\">... x60</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-indigo-600 text-white rounded px-3 py-1 font-bold\">ngZone.run() once/sec</div></div><p class=\"text-center text-slate-400\">outside the zone: no CD triggered &nbsp;|&nbsp; inside the zone: one precise update</p></div>"
    },
    {
      "id": "ngzone-run-and-runguarded",
      "title": "ngZone.run() and runGuarded() — re-entering the zone",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Stepping out of a meeting to take a phone call, then walking back in to announce the update to the room. <code>ngZone.run()</code> is the walking-back-in part &mdash; Angular only needs to know about the result, not the whole call. <code>runGuarded()</code> is the same walk, except if you trip on the way in and drop something, there's a colleague (Angular's error handler) standing by to catch it instead of the whole meeting collapsing into confusion.</p>
          </div>
        </div>
        <p>After running code outside the Angular zone, you often need to update component state so the UI reflects a result. <code>ngZone.run()</code> re-enters the Angular zone, executes your callback, and triggers change detection when the callback completes. Property assignments inside <code>ngZone.run()</code> are picked up by change detection exactly as if they'd happened in a normal event handler.</p>
        <p><code>ngZone.runGuarded()</code> is identical to <code>run()</code> but also catches thrown errors and routes them through Angular's error handling mechanism. Use it when the code you're re-entering might throw &mdash; for example, when processing data from a WebSocket where the payload might be malformed.</p>
        <h3>WebSocket integration example</h3>
        <p>WebSocket message events are one of the most common reasons to use this pattern. The socket runs outside Angular, so its callbacks arrive outside the zone. You process raw data outside the zone, then enter the zone only when updating state that should render.</p>
      `,
      "code": "import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';\n\ninterface PriceUpdate { symbol: string; price: number; change: number; }\n\n@Component({\n  selector: 'app-price-ticker',\n  template: `\n    <div *ngFor=\"let item of prices | keyvalue\">\n      <strong>{{ item.key }}</strong>: {{ item.value.price | currency }}\n      <span [class.positive]=\"item.value.change > 0\"\n            [class.negative]=\"item.value.change < 0\">\n        {{ item.value.change > 0 ? '+' : '' }}{{ item.value.change | number:'1.2-2' }}%\n      </span>\n    </div>\n  `\n})\nexport class PriceTickerComponent implements OnInit, OnDestroy {\n  prices: Record<string, PriceUpdate> = {};\n  private socket!: WebSocket;\n\n  constructor(private ngZone: NgZone) {}\n\n  ngOnInit(): void {\n    // WebSocket callbacks arrive outside Angular's zone\n    this.ngZone.runOutsideAngular(() => {\n      this.socket = new WebSocket('wss://prices.example.com/feed');\n\n      this.socket.onmessage = (event) => {\n        const update: PriceUpdate = JSON.parse(event.data);\n\n        // Only re-enter Angular zone when updating visible state\n        // runGuarded() routes any parsing errors through Angular's ErrorHandler\n        this.ngZone.runGuarded(() => {\n          this.prices[update.symbol] = update;\n        });\n      };\n    });\n  }\n\n  ngOnDestroy(): void {\n    this.socket?.close();\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">run() vs runGuarded()</p><div class=\"grid grid-cols-2 gap-3 max-w-md mx-auto text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-indigo-700\">run()</p><p class=\"text-slate-500 mt-1\">re-enters zone, triggers CD</p><p class=\"text-slate-500\">errors bubble normally</p></div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-amber-700\">runGuarded()</p><p class=\"text-slate-500 mt-1\">re-enters zone, triggers CD</p><p class=\"text-slate-500\">errors routed to ErrorHandler</p></div></div></div>"
    },
    {
      "id": "change-detection-strategies",
      "title": "ChangeDetectionStrategy.OnPush — and why it's the Angular 22 default",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A waiter who used to <strong>walk past every table every thirty seconds</strong> just in case someone needed something, versus a waiter who only walks over when a table's <strong>buzzer goes off</strong>. The second waiter serves the same restaurant with a fraction of the footsteps. That buzzer is exactly what <code>OnPush</code> gives Angular: a component is only re-checked when something concrete says it needs to be.</p>
          </div>
        </div>
        <p>While NgZone (or signals, in a zoneless app) handles the trigger for change detection, <strong>ChangeDetectionStrategy</strong> controls how thorough that check is for a given component. Historically, Angular used the <code>Default</code> strategy everywhere unless you opted into <code>OnPush</code> &mdash; every component in the tree got checked on every cycle. <strong>Angular 22 flips that default</strong>: any component that doesn't explicitly set <code>changeDetection</code> now behaves as <code>OnPush</code>.</p>
        <p><strong>ChangeDetectionStrategy.OnPush</strong> tells Angular to only check a component when:</p>
        <ul>
          <li>One of its <code>@Input</code>/<code>input()</code> references changes (not a mutation of the same object)</li>
          <li>An event originates from within the component or one of its children</li>
          <li>An async pipe, <code>resource()</code>, or signal read in the template emits a new value</li>
          <li>You manually call <code>ChangeDetectorRef.markForCheck()</code></li>
        </ul>
        <p>With OnPush as the baseline, a change-detection pass simply skips a component unless one of those conditions is met &mdash; which is now the normal, default behavior of every component you write, not a performance opt-in you have to remember.</p>
        <h3>Using ChangeDetectorRef</h3>
        <p>When you run code outside the Angular zone (or handle an update from a non-signal source) and need to notify an OnPush component, call <code>changeDetectorRef.markForCheck()</code>. It marks the component and its ancestors for checking on the next cycle without needing <code>ngZone.run()</code>.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">A component that mutates an object in place (<code>this.user.name = 'New'</code>) instead of assigning a new reference used to get away with it under the old <code>Default</code> strategy, because the whole tree was checked regardless. Under Angular 22's OnPush-by-default behavior, that same mutation won't trigger a re-check unless you explicitly set <code>changeDetection: ChangeDetectionStrategy.Default</code>, call <code>markForCheck()</code>, or — better — switch to immutable updates or signals.</p>
          </div>
        </div>
      `,
      "code": "import { Component, ChangeDetectionStrategy, ChangeDetectorRef,\n         Input, OnDestroy } from '@angular/core';\nimport { interval, Subscription } from 'rxjs';\n\n@Component({\n  selector: 'app-stopwatch',\n  // In Angular 22 this line is redundant — OnPush is already the default —\n  // but writing it explicitly still documents intent clearly.\n  changeDetection: ChangeDetectionStrategy.OnPush,\n  template: `\n    <div class=\"stopwatch\">\n      <span>{{ elapsed }}s</span>\n      <button (click)=\"toggle()\">{{ running ? 'Pause' : 'Start' }}</button>\n      <button (click)=\"reset()\">Reset</button>\n    </div>\n  `\n})\nexport class StopwatchComponent implements OnDestroy {\n  elapsed = 0;\n  running = false;\n  private sub?: Subscription;\n\n  constructor(private cdr: ChangeDetectorRef) {}\n\n  toggle(): void {\n    if (this.running) {\n      this.sub?.unsubscribe();\n      this.running = false;\n    } else {\n      this.running = true;\n      // interval() fires outside Angular's change-detection awareness\n      this.sub = interval(1000).subscribe(() => {\n        this.elapsed++;\n        // markForCheck() schedules this component for checking\n        // on the next CD cycle — no need to enter the zone\n        this.cdr.markForCheck();\n      });\n    }\n  }\n\n  reset(): void {\n    this.elapsed = 0;\n    this.sub?.unsubscribe();\n    this.running = false;\n    // detectChanges() runs change detection synchronously on this\n    // component right now — useful when you need an immediate DOM update\n    this.cdr.detectChanges();\n  }\n\n  ngOnDestroy(): void {\n    this.sub?.unsubscribe();\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Default (old) vs OnPush (Angular 22 default)</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-slate-50 border-2 border-slate-300 rounded-xl p-3\"><p class=\"font-bold text-slate-700 text-center mb-2\">Old default: Default</p><div class=\"flex flex-col items-center gap-1\"><div class=\"bg-white border border-slate-200 rounded px-2 py-1 w-full text-center\">table A — checked</div><div class=\"bg-white border border-slate-200 rounded px-2 py-1 w-full text-center\">table B — checked</div><div class=\"bg-white border border-slate-200 rounded px-2 py-1 w-full text-center\">table C — checked</div><p class=\"text-slate-400 mt-1\">every cycle, every table</p></div></div><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3\"><p class=\"font-bold text-indigo-700 text-center mb-2\">Angular 22 default: OnPush</p><div class=\"flex flex-col items-center gap-1\"><div class=\"bg-slate-100 border border-slate-200 rounded px-2 py-1 w-full text-center text-slate-400\">table A — skipped</div><div class=\"bg-indigo-600 text-white rounded px-2 py-1 w-full text-center font-bold\">table B — buzzer rang</div><div class=\"bg-slate-100 border border-slate-200 rounded px-2 py-1 w-full text-center text-slate-400\">table C — skipped</div><p class=\"text-indigo-500 mt-1\">only the table that signaled</p></div></div></div></div>"
    },
    {
      "id": "ngzone-stability",
      "title": "Zone stability — onStable, onUnstable, isStable, and the zoneless equivalent",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">An <strong>airport control tower</strong> that won't clear the runway for a photo shoot until every plane currently in the air has landed. "Unstable" is "at least one plane is still up there"; "stable" is "the sky is clear." Angular Universal waits for that all-clear before it takes the snapshot (serializes the page) it sends to the browser.</p>
          </div>
        </div>
        <p>On a Zone.js-based app, Angular's zone has two states: <strong>stable</strong> (no pending asynchronous tasks) and <strong>unstable</strong> (one or more async tasks in progress). <code>NgZone</code> exposes observables for these transitions: <code>onStable</code> emits once all pending async work completes, and <code>onUnstable</code> emits when the first async task in a batch starts.</p>
        <h3>Where stability matters</h3>
        <p><strong>E2E test synchronization</strong> &mdash; some test tools wait for zone stability before making assertions, so they don't check the DOM mid-update. <strong>Server-side rendering</strong> &mdash; Angular Universal serializes the page only once the zone is stable, ensuring all data fetching finished first. <strong>DOM measurements</strong> &mdash; if you need layout dimensions after Angular finishes rendering, waiting for <code>onStable</code> avoids reading stale values.</p>
        <h3>The zoneless-compatible alternative</h3>
        <p><code>NgZone.isStable</code>/<code>onStable</code>/<code>onUnstable</code> are inherently tied to Zone.js — they have nothing to observe in a zoneless app. For code that needs to work whether or not Zone.js is present, use <code>ApplicationRef.isStable</code> instead: it tracks pending application work (including <code>resource()</code> requests and other tracked async tasks) through Angular's platform-level pending-tasks mechanism rather than zone patching, so it behaves correctly in both zone-based and zoneless apps.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Code that subscribes to <code>NgZone.onStable</code> today will simply never fire in a zoneless app — there's no zone to become stable. If you're writing new code meant to survive a future migration off Zone.js, prefer <code>ApplicationRef.isStable</code> from the start.</p>
          </div>
        </div>
      `,
      "code": "import { Component, NgZone, ApplicationRef, OnInit, inject } from '@angular/core';\nimport { filter, take } from 'rxjs/operators';\n\n@Component({\n  selector: 'app-shell',\n  template: `\n    <div *ngIf=\"isLoading\" class=\"global-spinner\">Loading...</div>\n    <router-outlet></router-outlet>\n  `\n})\nexport class AppShellComponent implements OnInit {\n  isLoading = true;\n\n  private ngZone = inject(NgZone);\n  private appRef = inject(ApplicationRef);\n\n  ngOnInit(): void {\n    // Zone-based: works only while the app runs on Zone.js\n    this.ngZone.onStable\n      .pipe(take(1))\n      .subscribe(() => {\n        this.isLoading = false;\n        console.log('Zone stable — Zone.js apps only');\n      });\n\n    // Zoneless-compatible: works whether or not Zone.js is present\n    this.appRef.isStable\n      .pipe(filter(stable => stable), take(1))\n      .subscribe(() => {\n        this.isLoading = false;\n        const headerHeight = document.querySelector('header')?.offsetHeight ?? 0;\n        document.documentElement.style.setProperty(\n          '--header-height', headerHeight + 'px'\n        );\n      });\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Stability Tracking: Zone-Based vs Portable</p><div class=\"grid grid-cols-2 gap-3 max-w-md mx-auto text-xs\"><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-amber-700\">NgZone.isStable</p><p class=\"text-slate-500 mt-1\">Zone.js apps only</p></div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-emerald-700\">ApplicationRef.isStable</p><p class=\"text-slate-500 mt-1\">zone-based &amp; zoneless</p></div></div></div>"
    }
  ]
});
