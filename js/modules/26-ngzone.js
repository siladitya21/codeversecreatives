window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "ngzone",
  "title": "NgZone & Change Detection",
  "icon": "bi bi-speedometer",
  "questions": [
    {
      "id": "what-is-ngzone",
      "title": "What is NgZone and why does Angular need it?",
      "explanation": `
          <p>To understand NgZone, you first need to understand Angular's change detection challenge. Angular needs to know when component data changes so it can update the DOM — but JavaScript is single-threaded and asynchronous, which means Angular cannot watch every variable for changes in real time. Instead, Angular relies on <strong>Zone.js</strong>, a library that monkey-patches all asynchronous browser APIs (<code>setTimeout</code>, <code>setInterval</code>, DOM events, <code>fetch</code>, <code>XMLHttpRequest</code>, <code>Promise</code>, etc.) to detect when asynchronous work completes.</p>

          <p><strong>NgZone</strong> is Angular's wrapper around Zone.js. It creates a special execution context called the "Angular zone." Any code that runs inside this zone — including all async callbacks — is tracked. When an async task inside the Angular zone completes, Zone.js notifies Angular, which then runs change detection to check whether any bindings need to be updated in the DOM.</p>

          <h3>Why This Matters</h3>
          <p>Without Zone.js, Angular would have no way to know that your <code>setTimeout</code> callback just ran and updated a component property. Zone.js makes the "detect changes automatically" magic work. <code>NgZone.onMicrotaskEmpty</code> is the specific event Angular listens to in order to trigger its change detection cycle.</p>

          <h3>Zone-less Angular (Angular 18+)</h3>
          <p>Angular 18 introduced experimental <strong>zoneless change detection</strong> as an alternative to Zone.js. In zoneless mode, Angular relies on signals and explicit change marking instead of Zone.js patching. This improves performance and reduces bundle size but requires components to explicitly signal state changes.</p>
        `,
      "code": "// Zone.js patches async APIs, so Angular can detect when they complete:\n// The sequence is:\n//   1. You update component state in a setTimeout callback\n//   2. Zone.js intercepts the setTimeout completion\n//   3. Zone.js notifies NgZone\n//   4. NgZone triggers Angular's change detection\n//   5. Angular re-renders any bindings that changed\n\nimport { Component, NgZone, OnInit } from '@angular/core';\n\n@Component({\n  selector: 'app-progress',\n  standalone: true,\n  template: `\n    <div class=\"progress-bar\" [style.width.%]=\"progress\">{{ progress }}%</div>\n    <button (click)=\"startProgress()\">Start</button>\n  `\n})\nexport class ProgressComponent {\n  progress = 0;\n\n  constructor(private ngZone: NgZone) {}\n\n  startProgress(): void {\n    // setTimeout runs inside Angular zone by default\n    // When the callback fires, NgZone triggers change detection\n    // and Angular updates the template with the new progress value\n    let current = 0;\n    const interval = setInterval(() => {\n      current += 10;\n      this.progress = current;   // change detection runs after each tick\n      if (current >= 100) clearInterval(interval);\n    }, 200);\n  }\n}",
      "language": "typescript"
    },
    {
      "id": "run-code-outside-angular-zone",
      "title": "Running code outside the Angular zone for performance",
      "explanation": `
          <p>The default behavior — running change detection after every async callback — is convenient, but it comes with a cost. If a piece of code fires callbacks at very high frequency (60 times per second for an animation loop, or hundreds of times for a mousemove listener), Angular runs its entire change detection tree on every tick. For most applications this is imperceptible, but for components with deep trees or complex bindings, it can cause visible jank.</p>

          <p><code>NgZone.runOutsideAngular()</code> solves this by executing code in a context that Zone.js does not track. Async callbacks that originate from within <code>runOutsideAngular()</code> do not trigger Angular's change detection when they complete. The component's DOM simply does not update — until you explicitly choose to re-enter the Angular zone and trigger detection.</p>

          <h3>The Canonical Pattern</h3>
          <p>Start the high-frequency work outside the zone. Gather results there without touching Angular. Once a meaningful value is ready to display, call <code>ngZone.run()</code> to re-enter the zone and set the component property. Angular detects that one update instead of hundreds of intermediate updates.</p>

          <h3>Real-World Use Cases</h3>
          <p>Animation loops (requestAnimationFrame), WebSocket message handling, high-frequency sensor data (accelerometer, mouse position tracking), third-party charting libraries (D3, Chart.js), and game loops all benefit from running outside the Angular zone.</p>
        `,
      "code": "import { Component, NgZone, OnDestroy, ElementRef, ViewChild } from '@angular/core';\n\n@Component({\n  selector: 'app-realtime-chart',\n  standalone: true,\n  template: `\n    <canvas #chart width=\"600\" height=\"200\"></canvas>\n    <p>FPS: {{ displayedFps }}</p>\n    <button (click)=\"startRendering()\">Start</button>\n    <button (click)=\"stopRendering()\">Stop</button>\n  `\n})\nexport class RealtimeChartComponent implements OnDestroy {\n  @ViewChild('chart') canvasRef!: ElementRef<HTMLCanvasElement>;\n  displayedFps = 0;\n  private rafId = 0;\n  private frameCount = 0;\n\n  constructor(private ngZone: NgZone) {}\n\n  startRendering(): void {\n    // Run the animation loop OUTSIDE Angular's zone.\n    // requestAnimationFrame fires 60 times/second — we don't want\n    // change detection running 60 times/second for a canvas that\n    // Angular isn't even rendering (it's drawn via Canvas API).\n    this.ngZone.runOutsideAngular(() => {\n      const ctx = this.canvasRef.nativeElement.getContext('2d')!;\n      let lastTime = performance.now();\n\n      const loop = (now: number) => {\n        const delta = now - lastTime;\n        lastTime = now;\n        this.frameCount++;\n\n        // Draw frame — pure canvas, no Angular bindings involved\n        ctx.clearRect(0, 0, 600, 200);\n        ctx.fillStyle = '#6366f1';\n        ctx.fillRect(Math.random() * 580, Math.random() * 180, 20, 20);\n\n        // Only update the Angular-bound FPS display every second\n        if (this.frameCount % 60 === 0) {\n          const fps = Math.round(1000 / delta);\n          // Re-enter the Angular zone just for this one update\n          this.ngZone.run(() => { this.displayedFps = fps; });\n        }\n\n        this.rafId = requestAnimationFrame(loop);\n      };\n\n      this.rafId = requestAnimationFrame(loop);\n    });\n  }\n\n  stopRendering(): void {\n    cancelAnimationFrame(this.rafId);\n  }\n\n  ngOnDestroy(): void {\n    this.stopRendering();\n  }\n}",
      "language": "typescript"
    },
    {
      "id": "ngzone-run-and-runguarded",
      "title": "ngZone.run() and runGuarded() — re-entering the zone",
      "explanation": `
          <p>After running code outside the Angular zone, you often need to update the component's state so the UI reflects a result. <code>ngZone.run()</code> re-enters the Angular zone, executes your callback, and triggers change detection when the callback completes. Any property assignments inside <code>ngZone.run()</code> are picked up by Angular's change detection exactly as if they had happened in a normal event handler.</p>

          <p><code>ngZone.runGuarded()</code> is identical to <code>run()</code> but also catches thrown errors and routes them through Angular's error handling mechanism. Use it when the code you are re-entering might throw — for example, when processing data from a WebSocket where the payload might be malformed.</p>

          <h3>WebSocket Integration Example</h3>
          <p>WebSocket message events are one of the most common reasons to use this pattern. The socket library runs outside Angular (or is registered before Angular starts), so its callbacks arrive outside the Angular zone. You handle the raw data processing outside the zone, then enter the zone only when updating component state that should be rendered.</p>
        `,
      "code": "import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';\n\ninterface PriceUpdate { symbol: string; price: number; change: number; }\n\n@Component({\n  selector: 'app-price-ticker',\n  standalone: true,\n  template: `\n    <div *ngFor=\"let item of prices | keyvalue\">\n      <strong>{{ item.key }}</strong>: {{ item.value.price | currency }}\n      <span [class.positive]=\"item.value.change > 0\"\n            [class.negative]=\"item.value.change < 0\">\n        {{ item.value.change > 0 ? '+' : '' }}{{ item.value.change | number:'1.2-2' }}%\n      </span>\n    </div>\n  `\n})\nexport class PriceTickerComponent implements OnInit, OnDestroy {\n  prices: Record<string, PriceUpdate> = {};\n  private socket!: WebSocket;\n\n  constructor(private ngZone: NgZone) {}\n\n  ngOnInit(): void {\n    // WebSocket callbacks arrive outside Angular's zone\n    this.ngZone.runOutsideAngular(() => {\n      this.socket = new WebSocket('wss://prices.example.com/feed');\n\n      this.socket.onmessage = (event) => {\n        const update: PriceUpdate = JSON.parse(event.data);\n\n        // Only re-enter Angular zone when updating visible state\n        // runGuarded() routes any parsing errors through Angular's ErrorHandler\n        this.ngZone.runGuarded(() => {\n          this.prices[update.symbol] = update;\n        });\n      };\n    });\n  }\n\n  ngOnDestroy(): void {\n    this.socket?.close();\n  }\n}",
      "language": "typescript"
    },
    {
      "id": "change-detection-strategies",
      "title": "ChangeDetectionStrategy.OnPush — manual change detection",
      "explanation": `
          <p>While NgZone handles the trigger for change detection, Angular's <strong>ChangeDetectionStrategy</strong> controls how thorough that check is for a given component. By default, Angular uses <code>Default</code> strategy, which checks every component in the tree on every change detection cycle. For large applications with many components, this can be slow.</p>

          <p><strong>ChangeDetectionStrategy.OnPush</strong> tells Angular to only check a component when:</p>
          <ul>
            <li>One of its <code>@Input</code> references changes (not just a mutation of the same object)</li>
            <li>An event originates from within the component or one of its children</li>
            <li>An async pipe in the template emits a new value</li>
            <li>You manually call <code>ChangeDetectorRef.markForCheck()</code></li>
          </ul>

          <p>With OnPush, an NgZone-triggered change detection cycle simply skips the component unless one of those conditions is met. This is the key performance technique for large Angular applications.</p>

          <h3>Using ChangeDetectorRef</h3>
          <p>When you run code outside the Angular zone and want to update an OnPush component, instead of <code>ngZone.run()</code> you can call <code>changeDetectorRef.markForCheck()</code>. This marks the component and all its ancestors for checking on the next change detection cycle without running anything inside the zone.</p>
        `,
      "code": "import { Component, ChangeDetectionStrategy, ChangeDetectorRef,\n         Input, OnInit, OnDestroy } from '@angular/core';\nimport { interval, Subscription } from 'rxjs';\n\n@Component({\n  selector: 'app-stopwatch',\n  standalone: true,\n  changeDetection: ChangeDetectionStrategy.OnPush,  // only check when needed\n  template: `\n    <div class=\"stopwatch\">\n      <span>{{ elapsed }}s</span>\n      <button (click)=\"toggle()\">{{ running ? 'Pause' : 'Start' }}</button>\n      <button (click)=\"reset()\">Reset</button>\n    </div>\n  `\n})\nexport class StopwatchComponent implements OnDestroy {\n  elapsed = 0;\n  running = false;\n  private sub?: Subscription;\n\n  constructor(private cdr: ChangeDetectorRef) {}\n\n  toggle(): void {\n    if (this.running) {\n      this.sub?.unsubscribe();\n      this.running = false;\n    } else {\n      this.running = true;\n      // interval() fires outside Angular's change detection awareness\n      // With OnPush, the view won't update automatically\n      this.sub = interval(1000).subscribe(() => {\n        this.elapsed++;\n        // markForCheck() schedules this component for checking\n        // on the next CD cycle — no need to enter the zone\n        this.cdr.markForCheck();\n      });\n    }\n  }\n\n  reset(): void {\n    this.elapsed = 0;\n    this.sub?.unsubscribe();\n    this.running = false;\n    // detectChanges() runs change detection synchronously on this\n    // component right now — useful when you need immediate DOM update\n    this.cdr.detectChanges();\n  }\n\n  ngOnDestroy(): void {\n    this.sub?.unsubscribe();\n  }\n}",
      "language": "typescript"
    },
    {
      "id": "ngzone-stability",
      "title": "Zone stability — onStable, onUnstable, and isStable",
      "explanation": `
          <p>Angular's zone has two states: <strong>stable</strong> (no pending asynchronous tasks) and <strong>unstable</strong> (one or more async tasks are in progress). NgZone exposes observables for these transitions: <code>onStable</code> emits once when all pending async work completes, and <code>onUnstable</code> emits when the first async task in a batch starts.</p>

          <p>Zone stability is important in several practical scenarios. <strong>E2E test synchronization</strong>: Protractor (and some alternatives) use zone stability to know when Angular has finished processing before making assertions. <strong>Server-Side Rendering</strong>: Angular Universal serializes the page only when the zone becomes stable, ensuring all data fetching is complete. <strong>DOM measurements</strong>: If you need to measure layout after Angular finishes rendering, waiting for <code>onStable</code> ensures the DOM is fully updated before you read dimensions.</p>

          <h3>isStable Observable</h3>
          <p><code>ngZone.isStable</code> is a boolean observable that emits <code>true</code> or <code>false</code> as stability changes. This is useful for showing a global loading indicator that tracks whether Angular is doing any async work at all.</p>
        `,
      "code": "import { Component, NgZone, OnInit } from '@angular/core';\nimport { filter, take } from 'rxjs/operators';\n\n@Component({\n  selector: 'app-shell',\n  standalone: true,\n  template: `\n    <div *ngIf=\"isLoading\" class=\"global-spinner\">Loading...</div>\n    <router-outlet></router-outlet>\n  `\n})\nexport class AppShellComponent implements OnInit {\n  isLoading = true;\n\n  constructor(private ngZone: NgZone) {}\n\n  ngOnInit(): void {\n    // Show spinner while Angular is processing async work\n    // Hide it once the zone becomes stable (no pending async tasks)\n    this.ngZone.onStable\n      .pipe(\n        take(1)  // only react to the first stabilization after init\n      )\n      .subscribe(() => {\n        this.isLoading = false;\n        console.log('App fully initialized — zone is stable');\n      });\n\n    // Optionally: measure DOM after Angular finishes rendering\n    this.ngZone.onStable\n      .pipe(take(1))\n      .subscribe(() => {\n        // Safe to read layout properties here\n        const headerHeight = document.querySelector('header')?.offsetHeight ?? 0;\n        document.documentElement.style.setProperty(\n          '--header-height', `${headerHeight}px`\n        );\n      });\n  }\n}",
      "language": "typescript"
    }
  ]
});
