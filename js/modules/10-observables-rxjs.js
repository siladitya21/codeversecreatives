window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "observables-rxjs",
  "title": "Observables & RxJS",
  "icon": "bi bi-broadcast",
  "questions": [
    {
      id: "angular-22-standard-rxjs-upgrade",
      title: "Angular 22 standard for Observables and RxJS",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Two departments in the same building. RxJS is the <strong>mailroom</strong> &mdash; it handles everything arriving over time, from unpredictable sources, that might need cancelling mid-delivery (HTTP, router events, websockets). Signals are the <strong>front desk directory</strong> &mdash; the current, always-up-to-date state of who's in the building right now. <code>toSignal()</code> and <code>toObservable()</code> are the clerks who walk documents between the two departments when one needs what the other has.</p>
          </div>
        </div>
        <p>RxJS remains essential in Angular for HTTP, router events, forms, websockets, and any cancellation-heavy async workflow. The Angular 22-ready standard is to use RxJS for asynchronous streams and signals for synchronous UI state &mdash; and convert between the two at the edge with Angular's interop helpers instead of forcing everything into one model.</p>
        <p>This split matters more than ever now that <strong>zoneless is the default for new apps</strong>. Under Zone.js, a stray subscription still triggered change detection because Zone.js patched the async APIs underneath it. Zoneless apps don't get that safety net &mdash; state changes need to flow through signals, the <code>async</code> pipe, or an explicit notification, or the view simply won't update.</p>
        <h3>Modern RxJS checklist</h3>
        <ul>
          <li>Use <code>AsyncPipe</code> or <code>takeUntilDestroyed()</code> instead of unmanaged subscriptions.</li>
          <li>Use <code>switchMap</code> for request cancellation, especially search and route-param flows.</li>
          <li>Use <code>toSignal()</code> when a template reads Observable state as a signal.</li>
          <li>Use <code>toObservable()</code> when signal state must enter an RxJS pipeline.</li>
          <li>Reach for <code>rxResource()</code> when you want an RxJS-driven fetch exposed as a signal-based resource (loading/error/value all as signals) instead of hand-rolling that with <code>toSignal()</code>.</li>
          <li>Keep services responsible for stream composition, not components.</li>
        </ul>
      `,
      code: "import { Component, inject } from '@angular/core';\nimport { toSignal } from '@angular/core/rxjs-interop';\nimport { ActivatedRoute } from '@angular/router';\nimport { switchMap } from 'rxjs';\n\n@Component({\n  selector: 'app-user-page',\n  template: `\n    @if (user(); as currentUser) {\n      <h2>{{ currentUser.name }}</h2>\n    } @else {\n      <p>Loading...</p>\n    }\n  `\n})\nexport class UserPageComponent {\n  private readonly route = inject(ActivatedRoute);\n  private readonly users = inject(UserService);\n\n  readonly user = toSignal(\n    this.route.paramMap.pipe(\n      switchMap(params => this.users.getById(params.get('id')!))\n    ),\n    { initialValue: null }\n  );\n}",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">RxJS Streams &harr; Signal State</p><div class=\"grid grid-cols-2 gap-4 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-indigo-700\">RxJS</p><p class=\"text-slate-500 mt-1\">HTTP, router events, websockets, cancellation</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-emerald-700\">Signals</p><p class=\"text-slate-500 mt-1\">Sync UI state, template reads</p></div></div><div class=\"flex items-center justify-center gap-4 mt-4 text-xs font-mono\"><div class=\"bg-slate-50 border border-slate-200 rounded px-2 py-1\">toSignal()</div><span class=\"text-slate-300\">&rarr;</span><span class=\"text-slate-400\">Observable becomes signal</span></div><div class=\"flex items-center justify-center gap-4 mt-2 text-xs font-mono\"><div class=\"bg-slate-50 border border-slate-200 rounded px-2 py-1\">toObservable()</div><span class=\"text-slate-300\">&rarr;</span><span class=\"text-slate-400\">signal becomes Observable</span></div></div>"
    },
    {
      "id": "what-are-observables",
      "title": "What are observables?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A vending machine that only starts working when someone presses the button. Nothing dispenses on its own &mdash; the machine sits idle (lazy) until a customer subscribes by pressing select, and each customer who presses gets their own independent dispensing sequence (unicast). The machine might dispense one item, several in a row, or announce "out of order" (error) instead.</p>
          </div>
        </div>
        <p>An <strong>Observable</strong> is a stream &mdash; a sequence of values delivered over time. Unlike a regular function call that returns one value immediately, an Observable can emit zero, one, or many values across any span of time, and then either complete normally or error out.</p>
        <p>Angular uses Observables everywhere: HTTP responses, form <code>valueChanges</code>, router events, <code>output()</code> emitters, and more. The RxJS library provides the Observable implementation Angular builds on.</p>
        <h3>Key concepts</h3>
        <ul>
          <li><strong>Producer</strong> &mdash; the Observable itself; defines what values to emit and when</li>
          <li><strong>Consumer</strong> &mdash; the subscriber; reacts to each emitted value</li>
          <li><strong>Lazy</strong> &mdash; nothing happens until something subscribes. Each <code>subscribe()</code> call starts a fresh execution of the Observable.</li>
          <li><strong>Unicast by default</strong> &mdash; each subscriber gets its own independent execution (cold Observable)</li>
        </ul>
        <h3>The three notification types</h3>
        <ul>
          <li><code>next(value)</code> &mdash; emits a value to the subscriber</li>
          <li><code>error(err)</code> &mdash; terminates the stream with an error</li>
          <li><code>complete()</code> &mdash; terminates the stream successfully (no more values)</li>
        </ul>
      `,
      "code": "import { Observable } from 'rxjs';\n\n// Creating an Observable manually\nconst numbers$ = new Observable<number>(observer => {\n  observer.next(1);     // emit 1\n  observer.next(2);     // emit 2\n  observer.next(3);     // emit 3\n  observer.complete();  // stream ends — no more values\n});\n\n// Subscribe to start receiving values\nnumbers$.subscribe({\n  next:     (value) => console.log('Got:', value),     // 1, 2, 3\n  error:    (err)   => console.error('Error:', err),\n  complete: ()      => console.log('Stream done!')\n});\n\n// Real-world: Angular HttpClient returns an Observable\n// this.http.get<User[]>('/api/users')  — emits once (the response), then completes\n// this.route.paramMap                 — emits every time the URL changes, never completes",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">An Observable Timeline</p><div class=\"flex items-center gap-2 justify-center text-xs\"><div class=\"bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-400\">subscribe()</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-indigo-100 border border-indigo-300 rounded-full w-8 h-8 flex items-center justify-center font-bold text-indigo-700\">1</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-indigo-100 border border-indigo-300 rounded-full w-8 h-8 flex items-center justify-center font-bold text-indigo-700\">2</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-indigo-100 border border-indigo-300 rounded-full w-8 h-8 flex items-center justify-center font-bold text-indigo-700\">3</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-100 border border-emerald-300 rounded px-2 py-1 font-bold text-emerald-700\">complete()</div></div><p class=\"text-center text-slate-400 text-[11px] mt-3\">next(1) &mdash; next(2) &mdash; next(3) &mdash; complete() — or error() instead, terminating early</p></div>"
    },
    {
      "id": "observable-vs-promise",
      "title": "Difference between Observable and Promise",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A bucket of water versus a garden hose. Fill the bucket (a Promise) and it starts filling the moment you turn the tap, delivers exactly one bucketful, and that's the end of it &mdash; you can't stop it halfway. A hose (an Observable) only runs once someone actually opens the valve (subscribes), can keep flowing for as long as you like, and you can shut it off at any point (unsubscribe) with water stopping immediately.</p>
          </div>
        </div>
        <p>Both handle async operations, but they are fundamentally different tools built for different jobs.</p>
        <h3>Promise</h3>
        <ul>
          <li>Emits exactly <strong>one value</strong> (or one error), then it is done</li>
          <li><strong>Eager</strong> &mdash; starts executing immediately when created</li>
          <li>Cannot be cancelled</li>
          <li>No built-in operators for transformation</li>
          <li>Always async (microtask queue)</li>
        </ul>
        <h3>Observable</h3>
        <ul>
          <li>Can emit <strong>zero, one, or many values</strong> over time</li>
          <li><strong>Lazy</strong> &mdash; only starts when subscribed</li>
          <li>Can be <strong>cancelled</strong> by unsubscribing</li>
          <li>Hundreds of operators for transforming, filtering, combining streams</li>
          <li>Can be synchronous or asynchronous</li>
        </ul>
        <h3>When to use which?</h3>
        <p>Use <strong>Observable</strong> for anything inside Angular (HTTP, forms, router). Use <strong>Promise</strong> only when interfacing with third-party libraries that return promises &mdash; and even then you can convert with <code>from(promise)</code>.</p>
      `,
      "code": "import { Observable, from } from 'rxjs';\n\n// ─── Promise — one value, eager ────────────────────────────────\nconst promise = fetch('/api/users').then(res => res.json());\n// Starts fetching immediately. Cannot be cancelled.\n// Resolves with one value.\n\npromise.then(users => console.log(users));\n\n// ─── Observable — lazy, cancellable, many values ───────────────\nconst users$ = this.http.get<User[]>('/api/users');\n// Does nothing yet — no HTTP request has been made.\n\nconst sub = users$.subscribe(users => console.log(users));\n// Request starts NOW.\n\n// Cancel it before it finishes (e.g. user navigated away):\nsub.unsubscribe();\n// The pending HTTP request is actually cancelled!\n\n// ─── Convert a Promise to an Observable ────────────────────────\nconst obs$ = from(fetch('/api/users').then(r => r.json()));\n// Now you can use all RxJS operators on it\n\n// ─── Key difference: multiple values ───────────────────────────\n// A WebSocket stream emits a new message every few seconds — this\n// is impossible to model with a Promise but trivial with an Observable.\nconst messages$ = new Observable<string>(observer => {\n  const ws = new WebSocket('wss://example.com');\n  ws.onmessage = e => observer.next(e.data);     // many values\n  ws.onerror   = e => observer.error(e);\n  ws.onclose   = ()  => observer.complete();\n  return () => ws.close();   // cleanup on unsubscribe\n});",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Bucket vs Hose</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-slate-50 border-2 border-slate-300 rounded-xl p-3\"><p class=\"font-bold text-slate-700 text-center mb-2\">Promise</p><ul class=\"text-slate-600 space-y-1\"><li>Eager — starts now</li><li>One value, then done</li><li>Cannot cancel</li></ul></div><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3\"><p class=\"font-bold text-indigo-700 text-center mb-2\">Observable</p><ul class=\"text-slate-600 space-y-1\"><li>Lazy — starts on subscribe</li><li>Zero, one, or many values</li><li>Cancellable via unsubscribe</li></ul></div></div></div>"
    },
    {
      "id": "what-is-rxjs",
      "title": "What is RxJS?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A fully stocked spice rack next to your stream of data. <code>of</code>, <code>from</code>, <code>interval</code>, and <code>fromEvent</code> are the different pots and pans you can start cooking with. <code>.pipe()</code> is the counter where you line up seasoning steps one after another &mdash; a dash of <code>filter</code>, a spoon of <code>map</code> &mdash; without ever touching or spoiling the original ingredients sitting in the pantry.</p>
          </div>
        </div>
        <p><strong>RxJS (Reactive Extensions for JavaScript)</strong> is the library that Angular uses to work with Observables. It provides:</p>
        <ul>
          <li>The <code>Observable</code> class itself</li>
          <li><strong>Creation functions</strong> &mdash; shortcuts for creating Observables from common sources (<code>of</code>, <code>from</code>, <code>interval</code>, <code>timer</code>, <code>fromEvent</code>)</li>
          <li><strong>Operators</strong> &mdash; pure functions that transform, filter, combine, or control a stream (<code>map</code>, <code>filter</code>, <code>switchMap</code>, <code>debounceTime</code>, etc.)</li>
          <li><strong>Subjects</strong> &mdash; special Observables that act as both producer and consumer</li>
        </ul>
        <h3>The pipe() method</h3>
        <p>Operators are applied via the <code>.pipe()</code> method. You chain operators inside <code>pipe()</code>, and the output of each becomes the input of the next. The original Observable is never mutated &mdash; each operator returns a brand new one.</p>
        <h3>Why does Angular use RxJS?</h3>
        <p>Async data in a UI app is messy &mdash; network requests can race, users can type faster than the server responds, multiple data sources need combining. RxJS gives you a composable, declarative toolkit to handle all of this cleanly instead of a tangle of manually tracked flags and callbacks.</p>
      `,
      "code": "import { of, from, interval, fromEvent } from 'rxjs';\nimport { map, filter, take, debounceTime } from 'rxjs/operators';\n\n// ─── Creation functions ────────────────────────────────────────\n\n// of() — emits the arguments as a sequence, then completes\nof(1, 2, 3).subscribe(console.log);   // 1, 2, 3\n\n// from() — converts an array, Promise, or iterable to an Observable\nfrom([10, 20, 30]).subscribe(console.log);   // 10, 20, 30\n\n// interval() — emits an incrementing number every N milliseconds\ninterval(1000).pipe(take(5)).subscribe(console.log);  // 0, 1, 2, 3, 4 (one per second)\n\n// fromEvent() — wraps a DOM event as an Observable\nconst clicks$ = fromEvent(document, 'click');\nclicks$.subscribe(e => console.log('Clicked at:', (e as MouseEvent).x));\n\n// ─── Operators via pipe() ──────────────────────────────────────\nof(1, 2, 3, 4, 5)\n  .pipe(\n    filter(n => n % 2 === 0),   // keep only even numbers\n    map(n => n * 10)            // multiply each by 10\n  )\n  .subscribe(console.log);     // 20, 40",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">RxJS Pieces</p><div class=\"flex items-center justify-center gap-2 flex-wrap text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg p-2 text-center font-semibold text-indigo-700\">of / from / interval</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg p-2 text-center font-semibold text-amber-700\">.pipe(operators)</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg p-2 text-center font-semibold text-emerald-700\">.subscribe()</div></div></div>"
    },
    {
      "id": "what-are-rxjs-operators",
      "title": "What are operators in RxJS?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A water treatment plant with successive stages. Raw water enters and passes through a sediment stage, a softening stage, a testing lab &mdash; each stage takes what the previous one produced and hands off something new, without ever reaching back to alter the source reservoir. Every RxJS operator is one of those stages: pure, one-directional, and composable in any order you need.</p>
          </div>
        </div>
        <p><strong>Operators</strong> are pure functions that take an Observable as input, apply a transformation, and return a new Observable. They never modify the original stream &mdash; they always create a new one.</p>
        <h3>Transformation operators</h3>
        <ul>
          <li><code>map(fn)</code> &mdash; transform each value (like Array.map)</li>
          <li><code>switchMap(fn)</code> &mdash; map to an inner Observable, cancel previous if a new one starts</li>
          <li><code>mergeMap(fn)</code> &mdash; map to an inner Observable, run all concurrently</li>
          <li><code>concatMap(fn)</code> &mdash; map to an inner Observable, run one at a time in order</li>
        </ul>
        <h3>Filtering operators</h3>
        <ul>
          <li><code>filter(fn)</code> &mdash; only let values through that pass the predicate</li>
          <li><code>debounceTime(ms)</code> &mdash; wait ms after the last emission before letting the value through</li>
          <li><code>distinctUntilChanged()</code> &mdash; skip if value is same as previous</li>
          <li><code>take(n)</code> &mdash; take the first n values then complete</li>
        </ul>
        <h3>Combination operators</h3>
        <ul>
          <li><code>combineLatest([a$, b$])</code> &mdash; emit latest from all streams whenever any emits</li>
          <li><code>forkJoin([a$, b$])</code> &mdash; wait for all streams to complete, emit last values (like Promise.all)</li>
          <li><code>merge(a$, b$)</code> &mdash; interleave emissions from multiple streams</li>
        </ul>
        <h3>Error handling</h3>
        <ul>
          <li><code>catchError(fn)</code> &mdash; catch an error and return a fallback Observable</li>
          <li><code>retry(n)</code> &mdash; re-subscribe up to n times on error</li>
        </ul>
      `,
      "code": "import { of, interval } from 'rxjs';\nimport { map, filter, debounceTime, distinctUntilChanged,\n         switchMap, catchError, take } from 'rxjs/operators';\n\n// ─── map: transform each value ────────────────────────────────\nof(1, 2, 3).pipe(\n  map(n => n * n)   // square each number\n).subscribe(console.log);  // 1, 4, 9\n\n// ─── filter: keep only matching values ────────────────────────\nof(1, 2, 3, 4, 5).pipe(\n  filter(n => n > 3)\n).subscribe(console.log);  // 4, 5\n\n// ─── debounceTime + distinctUntilChanged: live search ─────────\n// Classic pattern for a search input\nsearchControl.valueChanges.pipe(\n  debounceTime(400),            // wait 400ms after user stops typing\n  distinctUntilChanged(),       // ignore if same value typed twice\n  filter(term => (term ?? '').length > 1),\n  switchMap(term =>             // cancel previous HTTP call\n    this.http.get<any[]>('/api/search?q=' + term).pipe(\n      catchError(() => of([]))  // on error, return empty array\n    )\n  )\n).subscribe(results => this.results = results);\n\n// ─── take: limit how many values you receive ───────────────────\ninterval(500).pipe(\n  take(3)   // only get the first 3 values (0, 1, 2) then auto-complete\n).subscribe(console.log);",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Operators By Category</p><div class=\"grid grid-cols-2 gap-2 max-w-md mx-auto text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-2\"><p class=\"font-bold text-indigo-700 mb-1\">Transform</p><p class=\"font-mono text-slate-600\">map / switchMap / mergeMap</p></div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-2\"><p class=\"font-bold text-emerald-700 mb-1\">Filter</p><p class=\"font-mono text-slate-600\">filter / debounceTime / take</p></div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-2\"><p class=\"font-bold text-amber-700 mb-1\">Combine</p><p class=\"font-mono text-slate-600\">combineLatest / forkJoin / merge</p></div><div class=\"bg-rose-50 border border-rose-200 rounded-lg p-2\"><p class=\"font-bold text-rose-700 mb-1\">Errors</p><p class=\"font-mono text-slate-600\">catchError / retry</p></div></div></div>"
    },
    {
      "id": "what-is-subscribe-method",
      "title": "What is the subscribe() method?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Turning the ignition key in a parked car. Nothing burns fuel, nothing moves, until you turn the key &mdash; that's <code>subscribe()</code>. And the key you get back (the Subscription) is what lets you turn the engine back off whenever you're done, cutting the fuel supply immediately instead of letting it idle in the driveway forever.</p>
          </div>
        </div>
        <p>Calling <strong><code>subscribe()</code></strong> is what starts an Observable's execution. Nothing happens &mdash; no HTTP request, no timer, no computation &mdash; until you subscribe.</p>
        <p><code>subscribe()</code> accepts an observer object with up to three callback properties:</p>
        <ul>
          <li><code>next</code> &mdash; called for each emitted value</li>
          <li><code>error</code> &mdash; called if the stream encounters an error (stream terminates)</li>
          <li><code>complete</code> &mdash; called when the stream ends normally (no more values)</li>
        </ul>
        <h3>The Subscription object</h3>
        <p><code>subscribe()</code> returns a <strong>Subscription</strong>. Call <code>subscription.unsubscribe()</code> to stop listening and free resources. Forgetting to unsubscribe is the most common cause of memory leaks in Angular.</p>
        <h3>When does Angular unsubscribe for you?</h3>
        <p>The <strong>async pipe</strong> in templates handles subscribe and unsubscribe automatically. For manual subscriptions in component classes, you must unsubscribe yourself &mdash; typically with <code>takeUntilDestroyed()</code>.</p>
      `,
      "code": "import { interval, Subject } from 'rxjs';\nimport { takeUntilDestroyed } from '@angular/core/rxjs-interop';\n\n// ─── Basic subscribe ───────────────────────────────────────────\nconst sub = this.http.get<User[]>('/api/users').subscribe({\n  next:     (users)   => { this.users = users; this.loading = false; },\n  error:    (err)     => { this.error = true;  this.loading = false; },\n  complete: ()        => console.log('HTTP stream completed')\n});\n\n// ─── Unsubscribing ─────────────────────────────────────────────\nconst counter$ = interval(1000);\nconst sub2 = counter$.subscribe(n => console.log(n)); // 0, 1, 2, 3...\nsetTimeout(() => sub2.unsubscribe(), 5000);           // stops after 5 seconds\n\n// ─── Best practice in components: takeUntilDestroyed ───────────\nexport class LiveFeedComponent {\n  constructor() {\n    interval(1000)\n      .pipe(takeUntilDestroyed())  // auto-unsubscribes when the component is destroyed\n      .subscribe(n => console.log('tick', n));\n  }\n}\n\n// ─── Even better: use the async pipe in templates ──────────────\n// No manual subscribe/unsubscribe needed:\n// @for (user of users$ | async; track user.id) { <div>{{ user.name }}</div> }",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">subscribe() Lifecycle</p><div class=\"flex items-center justify-center gap-2 flex-wrap text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg p-2 text-center font-semibold text-indigo-700\">.subscribe()</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center\">next(value)&times;N</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-2 text-center\">complete() or error()</div></div><div class=\"flex justify-center mt-3\"><div class=\"bg-rose-50 border border-rose-200 rounded-lg px-3 py-1.5 text-xs font-mono text-rose-700\">subscription.unsubscribe() — stop anytime</div></div></div>"
    },
    {
      "id": "what-are-subjects",
      "title": "What are Subjects?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A walkie-talkie instead of a radio you can only listen to. A plain Observable is a one-way broadcast &mdash; you tune in and receive. A Subject can both press the talk button (<code>next()</code>, acting as producer) and listen (<code>subscribe()</code>, acting as consumer), and everyone else with a walkie-talkie on the same channel hears the same message at the same time.</p>
          </div>
        </div>
        <p>A <strong>Subject</strong> is both an Observable and an Observer at the same time. This means you can:</p>
        <ul>
          <li>Call <code>subject.next(value)</code> to <em>push</em> a new value into the stream (act as producer)</li>
          <li>Call <code>subject.subscribe()</code> to <em>listen</em> to the stream (act as consumer)</li>
          <li>Share the same stream among multiple subscribers (multicast)</li>
        </ul>
        <h3>Key difference from a plain Observable</h3>
        <p>A plain Observable is unicast &mdash; each subscriber gets its own independent execution. A Subject is multicast &mdash; all subscribers receive the same emissions. Think of a Subject as an event bus.</p>
        <h3>Common use cases in Angular</h3>
        <ul>
          <li>Service-to-component communication (a shared channel between unrelated components)</li>
          <li>Triggering a side effect (the classic <code>destroy$</code>-style teardown signal, largely superseded now by <code>takeUntilDestroyed()</code>)</li>
          <li>Manual control over when a stream emits (e.g. triggering a data refresh)</li>
        </ul>
      `,
      "code": "import { Subject } from 'rxjs';\n\n// ─── Basic Subject ─────────────────────────────────────────────\nconst events$ = new Subject<string>();\n\n// Two subscribers share the same stream\nevents$.subscribe(e => console.log('Subscriber A:', e));\nevents$.subscribe(e => console.log('Subscriber B:', e));\n\nevents$.next('login');   // both get it: 'login'\nevents$.next('logout');  // both get it: 'logout'\n\n// ─── Real-world: notification service ─────────────────────────\nimport { Injectable } from '@angular/core';\n\n@Injectable({ providedIn: 'root' })\nexport class NotificationService {\n  private _toast$ = new Subject<{ message: string; type: 'success' | 'error' }>();\n\n  // Public read-only Observable — components subscribe to this\n  readonly toast$ = this._toast$.asObservable();\n\n  show(message: string, type: 'success' | 'error' = 'success') {\n    this._toast$.next({ message, type });\n  }\n}\n\n// Component: trigger a notification\n// this.notifications.show('Saved successfully!', 'success');\n\n// Toast component: listen and display\n// this.notifications.toast$.subscribe(toast => this.toasts.push(toast));",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Subject = Producer + Consumer</p><div class=\"flex items-center justify-center gap-4 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg p-2 text-center font-semibold text-indigo-700\">Subject</div><div class=\"flex flex-col gap-1\"><span class=\"text-slate-300\">&rarr;</span><span class=\"text-slate-300\">&rarr;</span></div><div class=\"flex flex-col gap-1\"><div class=\"bg-emerald-50 border border-emerald-200 rounded px-2 py-1\">Subscriber A</div><div class=\"bg-emerald-50 border border-emerald-200 rounded px-2 py-1\">Subscriber B</div></div></div><p class=\"text-center text-slate-400 text-[11px] mt-3\">One next() call — every current subscriber receives it at once (multicast)</p></div>"
    },
    {
      "id": "types-of-subjects",
      "title": "Types of Subjects (Subject, BehaviorSubject, ReplaySubject)",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Three ways a lecture hall treats a latecomer. Plain <code>Subject</code>: "you missed the intro, we're not repeating it" &mdash; tough luck, catch up from now on. <code>BehaviorSubject</code>: an usher immediately hands you a one-page summary of exactly what's being said right now, then you follow live. <code>ReplaySubject</code>: the hall rewinds a recording of the last few minutes on a side screen so you can catch up before joining live.</p>
          </div>
        </div>
        <p>RxJS provides three commonly used Subject variants. The difference is entirely in what happens when a <em>new subscriber</em> joins after values have already been emitted.</p>
        <h3>Subject — no memory</h3>
        <p>New subscribers receive only values emitted <em>after</em> they subscribe. Missed values are gone forever. Use when you want a pure event bus and don't need late subscribers to catch up.</p>
        <h3>BehaviorSubject — remembers the last value</h3>
        <p>Requires an initial value. New subscribers immediately receive the <em>current (last emitted)</em> value, then continue receiving future emissions. This is the most common Subject in Angular apps &mdash; ideal for state (logged-in user, theme, cart count).</p>
        <h3>ReplaySubject — remembers N values</h3>
        <p>Buffers the last N values. New subscribers immediately receive those buffered values then continue live. Use when late subscribers need to catch up on recent history (the last few chat messages, the last few log entries).</p>
      `,
      "code": "import { Subject, BehaviorSubject, ReplaySubject } from 'rxjs';\n\n// ─── Subject — new subscribers miss past values ────────────────\nconst clicks$ = new Subject<string>();\nclicks$.next('click 1');   // nobody listening yet — lost\n\nclicks$.subscribe(e => console.log('A:', e));\nclicks$.next('click 2');   // A: click 2\nclicks$.next('click 3');   // A: click 3\n\n// ─── BehaviorSubject — new subscribers get current value ───────\nconst theme$ = new BehaviorSubject<'light' | 'dark'>('light');\n\n// Late subscriber immediately gets 'light'\ntheme$.subscribe(t => console.log('Theme:', t));  // Theme: light (immediately)\n\ntheme$.next('dark');   // Theme: dark\n\n// Even later subscriber gets the current value 'dark'\ntheme$.subscribe(t => console.log('Late:', t));   // Late: dark (immediately)\n\nconsole.log('Current:', theme$.value);   // 'dark'  — read synchronously\n\n// ─── ReplaySubject — last N values buffered ────────────────────\nconst log$ = new ReplaySubject<string>(3);  // remember last 3\nlog$.next('msg 1');\nlog$.next('msg 2');\nlog$.next('msg 3');\nlog$.next('msg 4');\n\n// New subscriber gets last 3: 'msg 2', 'msg 3', 'msg 4'\nlog$.subscribe(msg => console.log('Log:', msg));\n\n// ─── Real-world: BehaviorSubject for auth state ────────────────\n@Injectable({ providedIn: 'root' })\nexport class AuthService {\n  private _user$ = new BehaviorSubject<User | null>(null);\n  readonly user$ = this._user$.asObservable();\n\n  login(user: User)  { this._user$.next(user); }\n  logout()           { this._user$.next(null); }\n  get currentUser()  { return this._user$.value; }  // synchronous read\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">What a Late Subscriber Gets</p><div class=\"grid grid-cols-1 md:grid-cols-3 gap-3 text-xs\"><div class=\"bg-slate-50 border border-slate-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-slate-700\">Subject</p><p class=\"text-slate-500 mt-1\">nothing — starts from silence</p></div><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-indigo-700\">BehaviorSubject</p><p class=\"text-slate-500 mt-1\">last 1 value, immediately</p></div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-emerald-700\">ReplaySubject(n)</p><p class=\"text-slate-500 mt-1\">last N values, buffered</p></div></div></div>"
    },
    {
      "id": "hot-vs-cold-observables",
      "title": "Hot vs Cold Observables",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Streaming a movie versus tuning into live TV. Stream a cold movie file and every viewer starts from frame one, independently, no matter when they hit play. Tune into a hot live broadcast and you join whatever is happening right now &mdash; you can't rewind to catch what aired before you turned it on, and everyone watching sees the exact same frame at the exact same moment.</p>
          </div>
        </div>
        <p>This distinction affects whether each subscriber gets its own independent execution or shares a single running stream.</p>
        <h3>Cold Observable</h3>
        <p>The data source is created <em>inside</em> the Observable. Each subscriber gets its own fresh execution.</p>
        <ul>
          <li>Every <code>subscribe()</code> call triggers a new execution</li>
          <li>HTTP requests via HttpClient are cold &mdash; each subscription makes a new network request</li>
          <li>Subscribers don't share data</li>
        </ul>
        <h3>Hot Observable</h3>
        <p>The data source exists <em>outside</em> the Observable. All subscribers share the same stream.</p>
        <ul>
          <li>New subscribers join an already-running stream</li>
          <li>Mouse events, WebSocket messages, Subjects are all hot</li>
          <li>Subscribers share the same emissions; they miss anything emitted before they subscribed</li>
        </ul>
        <h3>Making a cold Observable hot — shareReplay</h3>
        <p>Use <code>shareReplay(1)</code> to turn a cold Observable hot and cache the last value. Very useful for HTTP calls you want to share across components without re-fetching.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Subscribing to the same <code>this.http.get(...)</code> Observable twice fires the request twice &mdash; HttpClient calls are cold by default, so every new subscriber replays the whole request from scratch. If two components need the same data, share the Observable itself (with <code>shareReplay(1)</code>) rather than each calling the service independently.</p>
          </div>
        </div>
      `,
      "code": "import { Observable, Subject } from 'rxjs';\nimport { shareReplay } from 'rxjs/operators';\n\n// ─── Cold Observable ───────────────────────────────────────────\nconst cold$ = this.http.get<User[]>('/api/users');\n// Each subscribe() sends a SEPARATE HTTP request:\ncold$.subscribe(u => console.log('A:', u));  // makes request 1\ncold$.subscribe(u => console.log('B:', u));  // makes request 2 (same URL!)\n\n// ─── Hot Observable ────────────────────────────────────────────\nconst hot$ = new Subject<string>();\nhot$.next('before anyone subscribes');  // lost — no subscribers yet\n\nhot$.subscribe(v => console.log('A:', v));\nhot$.next('both A and B get this');\nhot$.subscribe(v => console.log('B:', v));\nhot$.next('both get this too');        // A and B both receive it\n\n// ─── Making a cold Observable hot with shareReplay ─────────────\n// Good for: caching an API response shared across components\n\n@Injectable({ providedIn: 'root' })\nexport class ConfigService {\n  // Without shareReplay: every component that subscribes makes a NEW HTTP call\n  // With shareReplay(1): HTTP called once, result cached and shared\n  readonly config$ = this.http.get<AppConfig>('/api/config').pipe(\n    shareReplay(1)   // share among all subscribers, replay last value to late ones\n  );\n\n  constructor(private http: HttpClient) {}\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Cold vs Hot</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-slate-50 border-2 border-slate-300 rounded-xl p-3\"><p class=\"font-bold text-slate-700 text-center mb-2\">Cold (e.g. HttpClient)</p><p class=\"text-slate-500\">subscribe() A &rarr; new request A</p><p class=\"text-slate-500\">subscribe() B &rarr; new request B</p></div><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3\"><p class=\"font-bold text-indigo-700 text-center mb-2\">Hot (e.g. Subject, DOM events)</p><p class=\"text-slate-500\">subscribe() A + B &rarr; same running stream</p><p class=\"text-slate-500\">late subscribers miss earlier emissions</p></div></div></div>"
    },
    {
      "id": "what-are-higher-order-observables",
      "title": "What are higher-order observables?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A relay race where every runner hands off a fresh baton (a new inner Observable). What differs is the exchange rule: <code>switchMap</code> yanks the baton from whoever's running and sends a new runner immediately. <code>mergeMap</code> lets every runner keep going at once, all racing in parallel. <code>concatMap</code> makes each runner wait patiently for the previous one to cross the line first. <code>exhaustMap</code> refuses to start a new runner at all while one is already on the track.</p>
          </div>
        </div>
        <p>A <strong>higher-order Observable</strong> is an Observable whose values are themselves Observables &mdash; an Observable of Observables. This pattern shows up whenever you need to trigger an async operation in response to each emission of another stream.</p>
        <p>The classic example: a user types in a search box. Each keystroke emits a search term. For each term, you need to make an HTTP request. The result is an Observable (the keystrokes) that produces another Observable (the HTTP request) for each value &mdash; a higher-order Observable.</p>
        <h3>The challenge</h3>
        <p>You need a way to "flatten" the nested Observables &mdash; subscribe to each inner Observable and pass its values through to a single output stream. Different flattening strategies give you different behaviours, which is why there are four different operators for this.</p>
        <h3>The four flattening operators</h3>
        <ul>
          <li><strong>switchMap</strong> &mdash; cancels the previous inner Observable when a new one starts. Best for: search, autocomplete &mdash; you only care about the latest request.</li>
          <li><strong>mergeMap</strong> &mdash; runs all inner Observables concurrently. Best for: parallel uploads where you want all results.</li>
          <li><strong>concatMap</strong> &mdash; queues inner Observables, runs one at a time in order. Best for: sequential operations that must not overlap.</li>
          <li><strong>exhaustMap</strong> &mdash; ignores new inner Observables while one is still active. Best for: a "submit" button &mdash; ignore extra clicks while a form submission is in progress.</li>
        </ul>
      `,
      "code": "import { switchMap, mergeMap, concatMap, exhaustMap } from 'rxjs/operators';\n\n// ─── switchMap: cancel previous, use latest ────────────────────\n// Live search: if user types 'an', then 'ang', then 'angu' quickly,\n// only the last HTTP request for 'angu' matters.\nthis.searchCtrl.valueChanges.pipe(\n  debounceTime(300),\n  switchMap(term => this.http.get<any[]>('/api/search?q=' + term))\n).subscribe(results => this.results = results);\n\n// ─── mergeMap: run all concurrently ───────────────────────────\n// Upload multiple files at the same time:\nfrom(this.selectedFiles).pipe(\n  mergeMap(file => this.uploadService.upload(file))\n).subscribe(result => console.log('Uploaded:', result.name));\n\n// ─── concatMap: sequential, in order ─────────────────────────\n// Process orders one at a time, in the order they arrived:\nfrom(this.orderQueue).pipe(\n  concatMap(order => this.api.processOrder(order))\n).subscribe(result => console.log('Processed:', result.orderId));\n\n// ─── exhaustMap: ignore while busy ───────────────────────────\n// Login button: ignore extra clicks while a login request is pending\nfromEvent(loginBtn, 'click').pipe(\n  exhaustMap(() => this.authService.login(this.credentials))\n).subscribe({\n  next: user => this.router.navigate(['/dashboard']),\n  error: err => this.loginError = err.message\n});",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">The Four Flattening Strategies</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-3 text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-3\"><p class=\"font-bold text-indigo-700\">switchMap</p><p class=\"text-slate-500 mt-1\">cancels previous, keeps latest &mdash; search</p></div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-3\"><p class=\"font-bold text-emerald-700\">mergeMap</p><p class=\"text-slate-500 mt-1\">runs all concurrently &mdash; parallel uploads</p></div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-3\"><p class=\"font-bold text-amber-700\">concatMap</p><p class=\"text-slate-500 mt-1\">queues, one at a time &mdash; ordered writes</p></div><div class=\"bg-rose-50 border border-rose-200 rounded-lg p-3\"><p class=\"font-bold text-rose-700\">exhaustMap</p><p class=\"text-slate-500 mt-1\">ignores new while busy &mdash; submit button</p></div></div></div>"
    },
    {
      "id": "common-rxjs-operators",
      "title": "Common RxJS operators in Angular",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Editing raw home-video footage into a finished reel. <code>debounceTime</code> waits for the camera shake to settle before keeping a frame. <code>distinctUntilChanged</code> cuts duplicate frames that show nothing new. <code>filter</code> cuts scenes you don't want in the final reel. <code>catchError</code> swaps in a backup clip if a section of tape is corrupted. <code>tap</code> is a preview monitor showing what's being recorded without ever altering the tape itself.</p>
          </div>
        </div>
        <p>These are the operators you will encounter in almost every Angular codebase. Understanding each one makes reading and writing RxJS pipelines intuitive instead of intimidating.</p>
        <h3>debounceTime(ms)</h3>
        <p>Waits for a pause in emissions. If a new value arrives before the delay expires, the timer resets. The classic use is a search box &mdash; you don't want to fire an API call on every keystroke, only after the user pauses.</p>
        <h3>distinctUntilChanged()</h3>
        <p>Filters out consecutive duplicate values. Prevents unnecessary re-processing if the same value is emitted twice in a row.</p>
        <h3>map(fn)</h3>
        <p>Transforms each value &mdash; exactly like <code>Array.map()</code>. Use it to reshape, extract fields, or convert types.</p>
        <h3>filter(fn)</h3>
        <p>Only lets values through that satisfy the predicate &mdash; like <code>Array.filter()</code>.</p>
        <h3>switchMap(fn)</h3>
        <p>Maps to an inner Observable and cancels the previous inner Observable when a new one starts. The most important higher-order operator in Angular.</p>
        <h3>catchError(fn)</h3>
        <p>Intercepts errors in the stream. You return a fallback Observable from it &mdash; an empty array so the UI doesn't break, or a re-throw with a user-friendly message.</p>
        <h3>takeUntilDestroyed()</h3>
        <p>Completes the stream automatically when the current injection context (typically a component) is destroyed &mdash; the modern, boilerplate-free replacement for the manual <code>takeUntil(this.destroy$)</code> pattern.</p>
        <h3>tap(fn)</h3>
        <p>Performs a side effect (like logging) without changing the stream. Useful for debugging pipelines.</p>
      `,
      "code": "import { combineLatest, forkJoin, of } from 'rxjs';\nimport { map, filter, switchMap, debounceTime, distinctUntilChanged,\n         catchError, tap } from 'rxjs/operators';\nimport { takeUntilDestroyed } from '@angular/core/rxjs-interop';\n\n// ─── Full search pipeline (combines many operators) ────────────\nthis.searchCtrl.valueChanges.pipe(\n  debounceTime(400),              // wait 400ms after last keystroke\n  distinctUntilChanged(),         // skip if value hasn't changed\n  filter(term => (term ?? '').length >= 2), // only 2+ chars\n  tap(term => console.log('Searching for:', term)),  // debug log\n  switchMap(term =>\n    this.http.get<Product[]>('/api/products?q=' + term).pipe(\n      catchError(err => {\n        console.error('Search failed:', err);\n        return of([]);              // return empty array on error\n      })\n    )\n  ),\n  takeUntilDestroyed()             // auto-unsubscribe on component destroy\n).subscribe(products => this.products = products);\n\n// ─── forkJoin: like Promise.all — wait for multiple streams ────\n// Load user + their orders at the same time, render only when both are done\nforkJoin({\n  user:   this.http.get<User>('/api/users/' + this.userId),\n  orders: this.http.get<Order[]>('/api/users/' + this.userId + '/orders')\n}).subscribe(({ user, orders }) => {\n  this.user   = user;\n  this.orders = orders;\n});\n\n// ─── combineLatest: re-emit whenever any source emits ──────────\n// Filter products by both category AND search term reactively:\ncombineLatest([\n  this.categoryCtrl.valueChanges,\n  this.searchCtrl.valueChanges\n]).pipe(\n  debounceTime(200),\n  switchMap(([category, search]) =>\n    this.api.getProducts({ category, search })\n  )\n).subscribe(products => this.products = products);",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">The Everyday Operator Set</p><div class=\"grid grid-cols-2 md:grid-cols-4 gap-2 text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-center font-mono text-indigo-700\">debounceTime</div><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-center font-mono text-indigo-700\">distinctUntilChanged</div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center font-mono text-emerald-700\">map</div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center font-mono text-emerald-700\">filter</div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-2 text-center font-mono text-amber-700\">switchMap</div><div class=\"bg-rose-50 border border-rose-200 rounded-lg p-2 text-center font-mono text-rose-700\">catchError</div><div class=\"bg-slate-100 border border-slate-300 rounded-lg p-2 text-center font-mono text-slate-700\">takeUntilDestroyed</div><div class=\"bg-slate-100 border border-slate-300 rounded-lg p-2 text-center font-mono text-slate-700\">tap</div></div></div>"
    }
  ]
});
