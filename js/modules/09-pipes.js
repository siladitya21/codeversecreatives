window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "pipes",
  "title": "Pipes",
  "icon": "bi bi-funnel",
  "questions": [
    {
      id: "angular-22-standard-pipes-upgrade",
      title: "Angular 22 standard for pipes",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">The garnish station right before a dish goes out to the table &mdash; not the kitchen where the actual cooking happens. A pipe is a great place to plate a value for display (format a date, add a currency symbol). It's a terrible place to do the actual cooking (filtering a 10,000-row list, aggregating totals). That heavy lifting belongs in <code>computed()</code>, where Angular can cache the result properly instead of re-plating the same dish on every change detection pass.</p>
          </div>
        </div>
        <p>Angular 22-ready pipe usage is <strong>standalone, pure by default, and import-explicit</strong>. Pipes remain great for display formatting, but they should not double as a state-management or filtering engine for large mutable lists. With signals and <code>computed()</code> available everywhere, expensive derived-state logic belongs there, not in a pipe re-run from the template.</p>
        <h3>Modern pipe checklist</h3>
        <ul>
          <li>Make custom pipes standalone and import them directly where used.</li>
          <li>Keep pipes pure unless there is a very strong reason not to.</li>
          <li>Use built-in pipes in standalone component <code>imports</code>, such as <code>DatePipe</code> or <code>CurrencyPipe</code>.</li>
          <li>Use <code>computed()</code> for expensive, app-specific derived state instead of an impure pipe.</li>
          <li>Use <code>AsyncPipe</code> for Observable display, but reach for signals directly when the state is already signal-based.</li>
        </ul>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">A pipe that filters or sorts a large array looks harmless until the array's reference changes on every parent render, forcing the "pure" pipe to re-run its expensive logic anyway. If the transformation is genuinely expensive, model it as <code>computed()</code> next to the signal it depends on &mdash; Angular then only recomputes it when the actual dependency changes, not on every template check.</p>
          </div>
        </div>
      `,
      code: "import { Component, Pipe, PipeTransform, computed, signal } from '@angular/core';\nimport { CurrencyPipe } from '@angular/common';\n\n@Pipe({\n  name: 'initials'\n})\nexport class InitialsPipe implements PipeTransform {\n  transform(name: string): string {\n    return name.split(' ').map(part => part[0]).join('').toUpperCase();\n  }\n}\n\n@Component({\n  selector: 'app-user-card',\n  imports: [CurrencyPipe, InitialsPipe],\n  template: `\n    <span>{{ user().name | initials }}</span>\n    <strong>{{ total() | currency }}</strong>\n  `\n})\nexport class UserCardComponent {\n  readonly user = signal({ name: 'Asha Sharma' });\n  readonly items = signal([{ price: 10 }, { price: 20 }]);\n  readonly total = computed(() => this.items().reduce((sum, item) => sum + item.price, 0));\n}",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Pipe vs computed() — Who Does What</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3\"><p class=\"font-bold text-indigo-700 text-center mb-2\">Pipe</p><ul class=\"text-slate-600 space-y-1\"><li>Format a value for display</li><li>Cheap, per-value transforms</li><li>date, currency, initials</li></ul></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">computed()</p><ul class=\"text-slate-600 space-y-1\"><li>Derive state from other state</li><li>Cached, dependency-tracked</li><li>totals, filtered lists, aggregates</li></ul></div></div></div>"
    },
    {
      "id": "what-are-pipes",
      "title": "What are pipes?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A literal pipe with filter attachments screwed on. Water (your raw data) flows in one end; each attachment &mdash; a sediment filter, then a softener, then a carbon filter &mdash; changes what comes out, without ever touching the source tank. <code>{{ value | uppercase }}</code> is exactly that: the attachment named <code>uppercase</code> filters the value on its way to the screen, and the original data sitting in your component is never touched.</p>
          </div>
        </div>
        <p>In Angular, <strong>pipes</strong> are template functions that transform a value before displaying it. They keep transformation logic out of the component class and make templates read almost like plain English.</p>
        <h3>Syntax</h3>
        <ul>
          <li>Basic: <code>{{ value | pipeName }}</code></li>
          <li>With parameters: <code>{{ value | pipeName:param1:param2 }}</code></li>
          <li>Chained: <code>{{ value | pipe1 | pipe2 }}</code></li>
        </ul>
        <h3>Key facts</h3>
        <ul>
          <li>Pipes are <strong>pure by default</strong> &mdash; Angular only re-runs them when the input reference changes (not on mutations)</li>
          <li>Angular ships many built-in pipes; you can also write your own</li>
          <li>Pipes can be used inside component classes too, via <code>inject(DatePipe)</code> or constructor injection</li>
          <li>They are standalone and can be imported directly into standalone components</li>
        </ul>
      `,
      "code": "<!-- Basic pipe -->\n{{ 'hello world' | uppercase }}     <!-- HELLO WORLD -->\n\n<!-- Pipe with parameters -->\n{{ today | date:'dd/MM/yyyy' }}     <!-- 04/04/2026 -->\n{{ 3.14159 | number:'1.2-2' }}      <!-- 3.14 -->\n\n<!-- Chained pipes -->\n{{ 'hello world' | titlecase | slice:0:5 }}  <!-- Hello -->\n\n<!-- In component class -->\n// constructor(private datePipe: DatePipe) {}\n// this.datePipe.transform(new Date(), 'shortDate');",
      "language": "html",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">How a Pipe Works</p><div class=\"flex items-center justify-center gap-3 flex-wrap\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center\"><p class=\"text-xs font-bold text-indigo-700\">Raw Value</p><p class=\"font-mono text-[10px] text-slate-500 mt-1\">'hello'</p></div><div class=\"text-slate-300 font-bold\">| uppercase |</div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center\"><p class=\"text-xs font-bold text-emerald-700\">Transformed Value</p><p class=\"font-mono text-[10px] text-slate-500 mt-1\">'HELLO'</p></div></div></div>"
    },
    {
      "id": "built-in-pipes",
      "title": "Built-in pipes and their parameters",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Walking into a well-stocked hardware store instead of machining every tool from scratch. Need to format a date a certain way? There's an aisle for that. Need currency symbols in three different locales? Already on the shelf. Angular's built-in pipes cover the transformations almost every app needs, so you only reach for a custom pipe when the store genuinely doesn't carry what you need.</p>
          </div>
        </div>
        <p>Angular ships with a comprehensive set of built-in pipes covering text formatting, date and number formatting, collections, and async data.</p>
        <h3>Text Pipes</h3>
        <ul><li><code>uppercase</code> / <code>lowercase</code> / <code>titlecase</code> &mdash; case transforms</li></ul>
        <h3>Number &amp; Currency</h3>
        <ul>
          <li><code>number:'minInt.minFrac-maxFrac'</code> &mdash; e.g., <code>'1.2-2'</code> means 1 integer digit minimum, 2 fraction digits</li>
          <li><code>currency:'USD':'symbol':'1.2-2'</code> &mdash; currency code, display format, digit info</li>
          <li><code>percent:'1.0-2'</code> &mdash; multiplies by 100 and adds %</li>
        </ul>
        <h3>Date</h3>
        <ul><li><code>date:'format'</code> &mdash; supports Angular format strings (<code>'short'</code>, <code>'fullDate'</code>, <code>'dd/MM/yyyy HH:mm'</code>, etc.)</li></ul>
        <h3>Collections</h3>
        <ul>
          <li><code>slice:start:end</code> &mdash; works on arrays and strings</li>
          <li><code>keyvalue</code> &mdash; converts an object or Map to an array of <code>{key, value}</code> pairs for iteration</li>
        </ul>
        <h3>Other</h3>
        <ul>
          <li><code>json</code> &mdash; serializes a value to JSON (great for debugging)</li>
          <li><code>async</code> &mdash; subscribes to an Observable or Promise</li>
          <li><code>i18nSelect</code> / <code>i18nPlural</code> &mdash; internationalisation helpers</li>
        </ul>
      `,
      "code": "// --- Text ---\n{{ 'hello world' | uppercase }}        // HELLO WORLD\n{{ 'HELLO WORLD' | lowercase }}        // hello world\n{{ 'hello world' | titlecase }}        // Hello World\n\n// --- Numbers ---\n{{ 3.14159 | number:'1.2-2' }}         // 3.14\n{{ 1234567 | number }}                 // 1,234,567\n\n// --- Currency ---\n{{ 99.9 | currency }}                  // $99.90\n{{ 99.9 | currency:'EUR':'symbol' }}   // €99.90\n{{ 99.9 | currency:'GBP':'code':'1.0-0' }} // GBP 100\n\n// --- Percent ---\n{{ 0.25 | percent }}                   // 25%\n{{ 0.256 | percent:'1.1-2' }}          // 25.6%\n\n// --- Date ---\n{{ today | date }}                     // Jul 19, 2026\n{{ today | date:'fullDate' }}          // Sunday, July 19, 2026\n{{ today | date:'dd/MM/yyyy HH:mm' }}  // 19/07/2026 09:30\n{{ today | date:'shortTime' }}         // 9:30 AM\n\n// --- Slice ---\n{{ [1,2,3,4,5] | slice:1:4 }}         // [2,3,4]\n{{ 'Hello World' | slice:0:5 }}       // Hello\n\n// --- Keyvalue ---\n// <div *ngFor=\"let item of config | keyvalue\">\n//   {{ item.key }}: {{ item.value }}\n// </div>\n\n// --- JSON (debug) ---\n{{ user | json }}                       // { \"id\": 1, \"name\": \"Alice\" }",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Built-In Pipes By Category</p><div class=\"grid grid-cols-2 gap-2 max-w-md mx-auto text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-2\"><p class=\"font-bold text-indigo-700 mb-1\">Text</p><p class=\"font-mono text-slate-600\">uppercase / lowercase / titlecase</p></div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-2\"><p class=\"font-bold text-emerald-700 mb-1\">Numbers</p><p class=\"font-mono text-slate-600\">number / currency / percent</p></div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-2\"><p class=\"font-bold text-amber-700 mb-1\">Date</p><p class=\"font-mono text-slate-600\">date:'format'</p></div><div class=\"bg-purple-50 border border-purple-200 rounded-lg p-2\"><p class=\"font-bold text-purple-700 mb-1\">Collections</p><p class=\"font-mono text-slate-600\">slice / keyvalue</p></div><div class=\"bg-rose-50 border border-rose-200 rounded-lg p-2\"><p class=\"font-bold text-rose-700 mb-1\">Async</p><p class=\"font-mono text-slate-600\">async</p></div><div class=\"bg-slate-50 border border-slate-200 rounded-lg p-2\"><p class=\"font-bold text-slate-700 mb-1\">Debug</p><p class=\"font-mono text-slate-600\">json</p></div></div></div>"
    },
    {
      "id": "pure-vs-impure-pipe",
      "title": "Pure vs impure pipe",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A smoke detector versus a security guard doing constant rounds. A <strong>pure</strong> pipe is the smoke detector &mdash; it stays silent and costs nothing until an actual event (a new reference) triggers it. An <strong>impure</strong> pipe is the guard who walks the entire building every few seconds whether anything happened or not &mdash; more thorough about catching sneaky changes, but far more expensive to keep running.</p>
          </div>
        </div>
        <p>Angular pipes can be <strong>pure</strong> (default) or <strong>impure</strong>, and this distinction has real performance implications the moment your app has more than a handful of components.</p>
        <h3>Pure Pipe (default)</h3>
        <ul>
          <li>Angular only re-executes the <code>transform()</code> method when the <strong>input reference changes</strong> (primitive value changes, or a new object/array reference)</li>
          <li>Cached &mdash; same input always produces the same output without re-running</li>
          <li>Very performant. Use for most cases.</li>
        </ul>
        <h3>Impure Pipe (<code>pure: false</code>)</h3>
        <ul>
          <li>Angular re-executes <code>transform()</code> on <strong>every change detection cycle</strong></li>
          <li>Detects mutations inside arrays and objects (e.g., pushing to an array)</li>
          <li>Can hurt performance if used carelessly &mdash; only use when necessary</li>
          <li>The built-in <code>async</code> pipe is impure (it needs to react to each emission, not just reference changes)</li>
        </ul>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Pushing to an array with <code>items.push(newItem)</code> and expecting a pure pipe to notice is the single most common pipe bug. The array reference never changed, so the pure pipe's cache stays valid and the view doesn't update. Replace the reference instead: <code>this.items = [...this.items, newItem]</code>.</p>
          </div>
        </div>
      `,
      "code": "// Pure pipe (default) — only re-runs when input reference changes\n@Pipe({ name: 'filterActive' })\nexport class FilterActivePipe implements PipeTransform {\n  transform(items: Item[]): Item[] {\n    return items.filter(i => i.active);\n  }\n  // Won't update if you mutate the array (e.g., items.push(...))\n  // Replace the array reference to trigger: this.items = [...this.items, newItem]\n}\n\n// Impure pipe — re-runs every CD cycle\n@Pipe({ name: 'filterActiveImpure', pure: false })\nexport class FilterActiveImpurePipe implements PipeTransform {\n  transform(items: Item[]): Item[] {\n    return items.filter(i => i.active);\n  }\n  // Updates on every push/mutation — but runs very frequently!\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Pure vs Impure</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\"><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4\"><p class=\"font-bold text-emerald-700 text-center mb-2\">Pure (default)</p><ul class=\"text-xs text-slate-600 space-y-1\"><li>Runs when input reference changes</li><li>Cached result &mdash; fast</li><li>Use for most cases</li></ul></div><div class=\"bg-rose-50 border-2 border-rose-200 rounded-xl p-4\"><p class=\"font-bold text-rose-700 text-center mb-2\">Impure (pure: false)</p><ul class=\"text-xs text-slate-600 space-y-1\"><li>Runs every CD cycle</li><li>Detects mutations in objects/arrays</li><li>Use sparingly &mdash; performance cost</li></ul></div></div></div>"
    },
    {
      "id": "pipe-chaining",
      "title": "Pipe chaining and parameters",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A factory conveyor belt with a station for each specific job. Raw material enters at one end; station one uppercases it, station two trims it to length, and the finished part comes out the other side. Each station does exactly one thing and hands off to the next &mdash; that's <code>{{ value | uppercase | slice:0:5 }}</code>, two stations chained on one belt.</p>
          </div>
        </div>
        <p>Pipes can be <strong>chained</strong> and can accept <strong>parameters</strong>, making them composable and flexible.</p>
        <h3>Chaining</h3>
        <p>Apply multiple pipes left-to-right by adding more <code>| pipeName</code> segments. The output of each pipe becomes the input to the next.</p>
        <h3>Parameters</h3>
        <p>Pass arguments after the pipe name separated by colons: <code>{{ value | pipe:arg1:arg2 }}</code>. In the custom pipe class, these map to additional arguments of the <code>transform()</code> method.</p>
      `,
      "code": "<!-- Chaining pipes -->\n{{ 'hello world' | uppercase | slice:0:5 }}          <!-- HELLO -->\n{{ today | date:'fullDate' | uppercase }}             <!-- SUNDAY, JULY 19, 2026 -->\n{{ description | slice:0:100 | lowercase }}           <!-- first 100 chars, lowercased -->\n\n<!-- Pipe with multiple parameters -->\n{{ today | date:'dd/MM/yyyy':'UTC' }}                <!-- 19/07/2026 in UTC -->\n{{ 99.999 | number:'1.1-2' }}                        <!-- 100.0 -->\n\n<!-- Custom pipe with parameters -->\n// @Pipe({ name: 'truncate' })\n// transform(value: string, limit = 50, ellipsis = '...'): string {\n//   return value.length > limit ? value.substring(0, limit) + ellipsis : value;\n// }\n{{ longText | truncate:80:'…' }}    <!-- first 80 chars + ellipsis -->\n{{ longText | truncate }}           <!-- first 50 chars (default) -->",
      "language": "html",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Pipe Chaining</p><div class=\"flex items-center gap-2 justify-center flex-wrap\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg p-2 text-center\"><p class=\"text-xs font-bold text-indigo-700\">'hello world'</p></div><div class=\"text-slate-400 text-xs font-bold\">| uppercase</div><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg p-2 text-center\"><p class=\"text-xs font-bold text-amber-700\">'HELLO WORLD'</p></div><div class=\"text-slate-400 text-xs font-bold\">| slice:0:5</div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg p-2 text-center\"><p class=\"text-xs font-bold text-emerald-700\">'HELLO'</p></div></div></div>"
    },
    {
      "id": "how-to-create-custom-pipes",
      "title": "How to create custom pipes",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Designing a custom cookie cutter. You cut the shape once (write the <code>transform()</code> method), and from then on, any dough you feed it &mdash; any string, any article body &mdash; comes out stamped into the same consistent shape. Nobody baking with your cutter needs to know how the metal was bent; they just press it into the dough and get the shape they expect.</p>
          </div>
        </div>
        <p>A <strong>custom pipe</strong> is a class decorated with <code>@Pipe</code> that implements <code>PipeTransform</code>. The <code>transform(value, ...args)</code> method contains the transformation logic.</p>
        <h3>Steps</h3>
        <ol style="list-style:decimal;padding-left:1.25rem;color:#475569;line-height:1.8;">
          <li>Create a class implementing <code>PipeTransform</code></li>
          <li>Decorate it with <code>@Pipe({ name: 'myPipe' })</code></li>
          <li>Implement the <code>transform()</code> method &mdash; the first argument is the input value, subsequent arguments are pipe parameters</li>
          <li>Import the pipe directly wherever it's used (standalone pipes don't need a module)</li>
        </ol>
      `,
      "code": "import { Pipe, PipeTransform } from '@angular/core';\n\n// Simple custom pipe — no parameters\n@Pipe({ name: 'reverseText' })\nexport class ReverseTextPipe implements PipeTransform {\n  transform(value: string): string {\n    return value.split('').reverse().join('');\n  }\n}\n// {{ 'Angular' | reverseText }}  -->  'ralugnA'\n\n// Custom pipe with parameters\n@Pipe({ name: 'truncate' })\nexport class TruncatePipe implements PipeTransform {\n  transform(value: string, limit: number = 50, ellipsis: string = '...'): string {\n    if (!value) return '';\n    return value.length > limit\n      ? value.substring(0, limit) + ellipsis\n      : value;\n  }\n}\n// {{ article.body | truncate:100 }}       --> first 100 chars + '...'\n// {{ article.body | truncate:80:'\\u2026' }}  --> first 80 chars + '…'",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Custom Pipe Anatomy</p><div class=\"max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono space-y-1\"><p class=\"text-indigo-600\">@Pipe(&#123; name: 'myPipe' &#125;)</p><p class=\"text-slate-700\">export class MyPipe implements PipeTransform &#123;</p><p class=\"text-emerald-600 pl-4\">transform(value: T, param1: P): R &#123;</p><p class=\"text-slate-500 pl-8\">// transform logic</p><p class=\"text-slate-500 pl-8\">return result;</p><p class=\"text-emerald-600 pl-4\">&#125;</p><p class=\"text-slate-700\">&#125;</p></div></div>"
    },
    {
      "id": "what-is-async-pipe",
      "title": "What is the async pipe?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A valet at a restaurant. You hand over your Observable's keys, and the valet subscribes for you, brings the latest value around whenever it's ready, and &mdash; critically &mdash; parks it back and walks away the moment you leave (the component is destroyed). You never have to remember where you left your subscription or worry about it idling forever in the lot.</p>
          </div>
        </div>
        <p>The <strong><code>async</code> pipe</strong> subscribes to an <code>Observable</code> or <code>Promise</code> in the template and displays the latest emitted value. When the component is destroyed, it automatically unsubscribes, preventing memory leaks.</p>
        <h3>Key benefits</h3>
        <ul>
          <li><strong>Auto-unsubscribes</strong> &mdash; no need to manually manage the subscription lifecycle</li>
          <li><strong>Triggers change detection</strong> &mdash; when the Observable emits, Angular marks the view for update</li>
          <li><strong>Works with OnPush</strong> &mdash; triggers change detection even in OnPush components, which is most components by default in Angular 22</li>
        </ul>
        <h3>async + @if Pattern</h3>
        <p>The <code>@if (data$ | async; as data)</code> pattern subscribes once, unwraps the value into a local variable, and only renders the block when the value is truthy.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Using <code>{{ users$ | async }}</code> more than once in the same template subscribes multiple times, which can trigger multiple HTTP requests for a cold Observable. Subscribe once with <code>@if (users$ | async; as users)</code> and reuse the unwrapped <code>users</code> variable everywhere in that block.</p>
          </div>
        </div>
      `,
      "code": "// component.ts\n@Component({ selector: 'app-users', templateUrl: './users.component.html' })\nexport class UsersComponent {\n  users$  = this.http.get<User[]>('/api/users');   // Observable\n  message$: Observable<string> = of('Hello').pipe(delay(1000));\n\n  constructor(private http: HttpClient) {}\n\n  // No ngOnDestroy needed — async pipe handles unsubscription\n}\n\n// users.component.html\n// Simple usage:\n// <p>{{ message$ | async }}</p>\n//\n// List rendering:\n// @for (user of users$ | async; track user.id) {\n//   <div>{{ user.name }}</div>\n// }\n//\n// Subscribe once, guard against null, get a typed local reference:\n// @if (users$ | async; as users) {\n//   <p>{{ users.length }} users loaded</p>\n//   @for (user of users; track user.id) {\n//     <div>{{ user.name }}</div>\n//   }\n// } @else {\n//   <p>Loading...</p>\n// }",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">async Pipe Benefits</p><div class=\"flex flex-col items-center gap-2 max-w-sm mx-auto\"><div class=\"w-full bg-indigo-50 border-2 border-indigo-200 rounded-xl p-2 text-center text-xs font-bold text-indigo-700\">Observable / Promise in component</div><div class=\"text-slate-300\">&darr; | async &darr;</div><div class=\"w-full bg-emerald-50 border-2 border-emerald-200 rounded-xl p-2 text-center text-xs font-bold text-emerald-700\">Latest value rendered in template</div></div><div class=\"grid grid-cols-3 gap-2 max-w-sm mx-auto mt-4 text-xs\"><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-2 text-center text-amber-700 font-semibold\">Auto-subscribe</div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-2 text-center text-amber-700 font-semibold\">Auto-unsubscribe</div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-2 text-center text-amber-700 font-semibold\">CD trigger</div></div></div>"
    },
    {
      "id": "what-is-pipe-transform-method",
      "title": "The pipe transform method",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A professional translator who receives a document plus a short brief: "translate this, keep it under 20 words, use formal tone." The document is the piped value; the brief's individual instructions are the extra arguments after the colons. The translator (your <code>transform()</code> method) reads all of it and hands back exactly one finished result.</p>
          </div>
        </div>
        <p>The <code>transform()</code> method is the sole required method of the <code>PipeTransform</code> interface. Angular calls it whenever the pipe needs to produce a new output.</p>
        <h3>Signature</h3>
        <p><code>transform(value: any, ...args: any[]): any</code></p>
        <ul>
          <li>The <strong>first argument</strong> is always the input value from the template</li>
          <li><strong>Additional arguments</strong> map to pipe parameters separated by colons in the template</li>
          <li>The <strong>return value</strong> is what Angular renders</li>
        </ul>
        <h3>Type safety</h3>
        <p>Use TypeScript generics and explicit types to make your pipe self-documenting and type-safe. Provide default values for optional parameters so the pipe behaves sensibly even when called with no extra arguments.</p>
      `,
      "code": "import { Pipe, PipeTransform } from '@angular/core';\n\n// transform() with multiple typed parameters and defaults\n@Pipe({ name: 'excerpt' })\nexport class ExcerptPipe implements PipeTransform {\n\n  // value     <- the piped value\n  // maxWords  <- first pipe param  ({{ text | excerpt:20 }})\n  // suffix    <- second pipe param ({{ text | excerpt:20:'...' }})\n  transform(value: string, maxWords: number = 30, suffix: string = '...'): string {\n    if (!value) return '';\n    const words = value.trim().split(/\\s+/);\n    if (words.length <= maxWords) return value;\n    return words.slice(0, maxWords).join(' ') + suffix;\n  }\n}\n\n// Template usage:\n// {{ article.body | excerpt }}          uses defaults (30 words, '...')\n// {{ article.body | excerpt:15 }}       15 words, '...'\n// {{ article.body | excerpt:10:'\\u2026' }} 10 words, '\\u2026'",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">transform() Argument Mapping</p><div class=\"max-w-md mx-auto\"><p class=\"font-mono text-xs text-center text-slate-600 mb-4\">{{ text | excerpt:15:'\\u2026' }}</p><div class=\"grid grid-cols-3 gap-2 text-xs text-center\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg p-2\"><p class=\"font-bold text-indigo-700\">text</p><p class=\"text-slate-500 mt-1\">value (1st arg)</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg p-2\"><p class=\"font-bold text-emerald-700\">15</p><p class=\"text-slate-500 mt-1\">maxWords (2nd)</p></div><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg p-2\"><p class=\"font-bold text-amber-700\">'\\u2026'</p><p class=\"text-slate-500 mt-1\">suffix (3rd)</p></div></div></div></div>"
    }
  ]
});
