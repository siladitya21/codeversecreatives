window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "web-workers",
  "title": "Web Workers",
  "icon": "bi bi-cpu",
  "questions": [
    {
      id: "angular-22-standard-web-workers-upgrade",
      title: "Angular 22 standard for Web Workers",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A bakery that does its heavy dough-mixing in a <strong>back room</strong> instead of on the front counter where customers are being served. The counter (main thread) stays free to greet people and ring up sales while the noisy, CPU-heavy work happens out of sight. The back room has no cash register or customer view &mdash; it only receives written order slips and sends back finished trays.</p>
          </div>
        </div>
        <p>Angular 22-ready apps reach for Web Workers only when there's real main-thread pressure: CPU-heavy, DOM-independent work that would otherwise block rendering. Keep Angular components on the main thread, send plain serializable messages to the worker, and return compact results.</p>
        <h3>Modern worker checklist</h3>
        <ul>
          <li>Generate workers with the Angular CLI (<code>ng generate web-worker</code>) so bundling is configured correctly.</li>
          <li>Move pure computation to workers &mdash; never DOM access or Angular services.</li>
          <li>Use transferable objects for large binary data where possible.</li>
          <li>Wrap worker messages in a small typed service so components never talk to <code>postMessage</code> directly.</li>
          <li>Terminate long-lived workers when the feature no longer needs them.</li>
        </ul>
      `,
      code: `// CLI:
// ng generate web-worker app/workers/report

@Injectable({ providedIn: 'root' })
export class ReportWorkerService {
  run(input: ReportInput): Promise<ReportSummary> {
    const worker = new Worker(new URL('./report.worker', import.meta.url));

    return new Promise(resolve => {
      worker.onmessage = ({ data }) => {
        resolve(data as ReportSummary);
        worker.terminate();
      };
      worker.postMessage(input);
    });
  }
}`,
      language: "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Front Counter vs Back Room</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center"><p class="font-bold text-indigo-700 mb-1">Main thread</p><p class="text-slate-500">Angular components, DOM, user input &mdash; always responsive</p></div><div class="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center"><p class="font-bold text-amber-700 mb-1">Worker thread</p><p class="text-slate-500">pure computation, no DOM, message-in / message-out</p></div></div></div>`
    },
    {
      "id": "what-are-web-workers",
      "title": "What are Web Workers and why do they matter in Angular?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A shop with <strong>one cashier</strong>. If that cashier stops mid-checkout to manually recount the entire stockroom, every customer in line freezes &mdash; no one gets served until the count finishes. Hire a second employee for the stockroom (a Web Worker) and the cashier keeps ringing people up while the count happens in parallel, out of sight, communicating only via notes passed back and forth.</p>
          </div>
        </div>
        <p>JavaScript is single-threaded. Rendering, event handling, network parsing, and your application logic all run on the same main thread. When a CPU-intensive task &mdash; sorting 100,000 records, running a search algorithm, processing image data &mdash; takes more than 16 milliseconds, it blocks the main thread and the browser can't paint a new frame. The result is visible jank: the UI freezes, animations stutter, buttons stop responding.</p>
        <p><strong>Web Workers</strong> are a browser API that runs JavaScript on a true background thread, separate from the main UI thread, with its own memory and its own event loop. Offloading heavy computation to a worker keeps the main thread free for rendering and interaction &mdash; the app stays responsive while the calculation runs in parallel.</p>
        <h3>What workers cannot do</h3>
        <p>Workers are deliberately sandboxed: no access to the DOM, <code>window</code>, <code>document</code>, or Angular's component tree. The only way to exchange data is message passing &mdash; <code>postMessage()</code> sends, the <code>message</code> event receives. Data is <strong>cloned</strong> (serialized and deserialized), not shared by reference, which eliminates race conditions but makes large objects expensive to transfer as-is.</p>
        <h3>When to use workers</h3>
        <p>Use a worker when a task is CPU-bound, runs long enough to block rendering (over ~50ms is noticeable), and needs no direct DOM access: image filtering, PDF generation, complex search/filter over large datasets, cryptography, and running ML inference are classic examples.</p>
      `,
      "code": "// The problem Web Workers solve:\n// Without a worker, this blocks the main thread for ~300ms,\n// freezing the UI completely during the calculation.\n\n// MAIN THREAD (blocks UI):\nfunction findPrimes(limit: number): number[] {\n  const primes: number[] = [];\n  for (let n = 2; n <= limit; n++) {\n    let isPrime = true;\n    for (let i = 2; i <= Math.sqrt(n); i++) {\n      if (n % i === 0) { isPrime = false; break; }\n    }\n    if (isPrime) primes.push(n);\n  }\n  return primes;\n}\n\n// Called synchronously — blocks the event loop:\nconst result = findPrimes(1_000_000);  // UI frozen for ~300ms\n\n// WITH A WEB WORKER:\n// Move findPrimes() into a worker file.\n// The main thread sends a message and continues rendering.\n// The worker runs findPrimes() on its own thread.\n// When done, it posts the result back — the UI was never blocked.",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">One Thread vs Two Threads</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-rose-50 border-2 border-rose-200 rounded-xl p-3\"><p class=\"font-bold text-rose-700 text-center mb-2\">No worker</p><div class=\"flex flex-col items-center gap-1\"><div class=\"bg-white border border-rose-200 rounded px-2 py-1 w-full text-center\">render frame</div><div class=\"bg-rose-600 text-white rounded px-2 py-1 w-full text-center font-bold\">300ms heavy calc — UI frozen</div><div class=\"bg-white border border-rose-200 rounded px-2 py-1 w-full text-center\">render frame resumes</div></div></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">With worker</p><div class=\"flex flex-col items-center gap-1\"><div class=\"bg-white border border-emerald-200 rounded px-2 py-1 w-full text-center\">main thread: renders every frame</div><div class=\"bg-emerald-600 text-white rounded px-2 py-1 w-full text-center font-bold\">worker thread: 300ms calc in parallel</div><div class=\"bg-white border border-emerald-200 rounded px-2 py-1 w-full text-center\">postMessage() delivers result</div></div></div></div></div>"
    },
    {
      "id": "how-to-use-web-workers",
      "title": "How to create and use Web Workers in Angular",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Setting the stockroom employee up with a <strong>walkie-talkie</strong> that only carries voice, not eye contact. You radio in a request; they radio back a result. The Angular CLI's <code>ng generate web-worker</code> is the HR paperwork that gets the new hire's badge, desk, and radio channel configured correctly &mdash; skip it and you'll be wiring the walkie-talkie yourself.</p>
          </div>
        </div>
        <p>The Angular CLI has built-in support for generating and bundling Web Workers. Running <code>ng generate web-worker</code> creates the worker file, adds the necessary TypeScript configuration, and configures the build so the worker is bundled separately as its own chunk.</p>
        <h3>The worker file</h3>
        <p>A worker file is a plain TypeScript file that listens via <code>addEventListener('message', ...)</code> for input and calls <code>postMessage()</code> to return output. It has every standard JavaScript API available but no Angular services and no DOM &mdash; no <code>window</code>, no <code>document</code> &mdash; though you can still import plain utility functions and third-party libraries.</p>
        <h3>Creating the worker on the main thread</h3>
        <p>Instantiate the worker using the <code>new URL()</code> + <code>import.meta.url</code> pattern. This syntax tells the Angular build system exactly which file is a worker entry point so it bundles it correctly. Always guard with <code>typeof Worker !== 'undefined'</code> before instantiating &mdash; SSR environments don't support workers at all.</p>
      `,
      "code": "// ---- Step 1: Generate the worker ----\n// ng generate web-worker search\n// Creates: src/app/search.worker.ts + updates tsconfig.worker.json\n\n// ---- Step 2: search.worker.ts (worker thread) ----\n/// <reference lib=\"webworker\" />\n\nexport interface SearchRequest {\n  query: string;\n  items: Array<{ id: number; name: string; description: string }>;\n}\n\nexport interface SearchResult {\n  id: number;\n  name: string;\n  relevance: number;\n}\n\naddEventListener('message', ({ data }: MessageEvent<SearchRequest>) => {\n  const { query, items } = data;\n  const q = query.toLowerCase();\n\n  const results: SearchResult[] = items\n    .map(item => {\n      const nameMatch = item.name.toLowerCase().includes(q) ? 10 : 0;\n      const descMatch = item.description.toLowerCase().includes(q) ? 5 : 0;\n      return { id: item.id, name: item.name, relevance: nameMatch + descMatch };\n    })\n    .filter(r => r.relevance > 0)\n    .sort((a, b) => b.relevance - a.relevance);\n\n  // Send results back to the main thread\n  postMessage(results);\n});\n\n// ---- Step 3: search.component.ts (main thread) ----\nimport { Component, OnDestroy, signal } from '@angular/core';\nimport type { SearchRequest, SearchResult } from './search.worker';\n\n@Component({\n  selector: 'app-search',\n  template: `\n    <input (input)=\"search($event)\" placeholder=\"Search...\" />\n    <p *ngIf=\"searching()\">Searching...</p>\n    <ul>\n      <li *ngFor=\"let r of results()\">{{ r.name }}</li>\n    </ul>\n  `\n})\nexport class SearchComponent implements OnDestroy {\n  results = signal<SearchResult[]>([]);\n  searching = signal(false);\n  private worker?: Worker;\n\n  constructor() {\n    if (typeof Worker !== 'undefined') {\n      // The URL pattern tells the bundler this is a worker entry point\n      this.worker = new Worker(new URL('./search.worker', import.meta.url));\n      this.worker.onmessage = ({ data }: MessageEvent<SearchResult[]>) => {\n        this.results.set(data);\n        this.searching.set(false);\n      };\n    }\n  }\n\n  search(event: Event): void {\n    const query = (event.target as HTMLInputElement).value.trim();\n    if (!query || !this.worker) return;\n\n    this.searching.set(true);\n    const request: SearchRequest = { query, items: this.getAllItems() };\n    this.worker.postMessage(request);\n  }\n\n  private getAllItems() {\n    // In real code, this comes from a service\n    return [{ id: 1, name: 'Laptop', description: 'Fast 16GB RAM' }];\n  }\n\n  ngOnDestroy(): void {\n    this.worker?.terminate();\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Message Round-Trip</p><div class=\"flex flex-wrap items-center justify-center gap-2 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700\">Component</div><span class=\"text-slate-300\">postMessage() &rarr;</span><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700\">search.worker.ts</div><span class=\"text-slate-300\">&larr; postMessage()</span><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700\">onmessage handler</div></div></div>"
    },
    {
      "id": "transferable-objects",
      "title": "Transferable objects — zero-copy data transfer",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Handing someone a <strong>box of documents</strong>. The default behavior is to <em>photocopy the entire box</em> before handing it over &mdash; safe, but slow if the box is huge. A transferable object is handing over the <strong>original box</strong> itself: instant, no copying, but now you no longer have the box. Reach for it and your own copy is gone &mdash; that's the deal.</p>
          </div>
        </div>
        <p>By default, data passed via <code>postMessage()</code> is serialized using the structured clone algorithm &mdash; the entire object is copied from one thread's memory to the other. For small objects (a few kilobytes) this is fine. For large binary data &mdash; an image buffer, a large <code>Float32Array</code> for audio, a canvas pixel buffer &mdash; cloning megabytes on every message creates real latency and memory pressure.</p>
        <p><strong>Transferable objects</strong> solve this by <em>transferring ownership</em> of memory from one thread to the other in O(1) time, with no copy. The sender relinquishes access and the receiver gains exclusive ownership. Transferable types: <code>ArrayBuffer</code>, <code>MessagePort</code>, <code>ImageBitmap</code>, <code>OffscreenCanvas</code>, and <code>ReadableStream</code>/<code>WritableStream</code>.</p>
        <h3>How to transfer</h3>
        <p>The second argument to <code>postMessage()</code> is the transfer list &mdash; an array of transferable objects to move rather than clone. After a transfer, accessing the original object from the sending thread throws a <code>TypeError</code> because it no longer owns that memory.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Reading the original <code>ArrayBuffer</code> (or any typed array view over it) on the sending side right after a transfer looks like it should still work &mdash; it doesn't. The buffer's <code>byteLength</code> becomes 0 and any read throws. If you still need the data locally, clone it (regular non-transfer <code>postMessage</code>, or <code>slice()</code> it) before transferring instead of after.</p>
          </div>
        </div>
      `,
      "code": "// ---- Image processing with Transferable ArrayBuffer ----\n// Without transfer: a 10MB image buffer is cloned on postMessage — slow\n// With transfer: ownership is moved in microseconds — no copy\n\n// image-processor.worker.ts\n/// <reference lib=\"webworker\" />\n\naddEventListener('message', ({ data }: MessageEvent<ArrayBuffer>) => {\n  const pixels = new Uint8ClampedArray(data);\n\n  // Apply a grayscale filter (modifies buffer in place)\n  for (let i = 0; i < pixels.length; i += 4) {\n    const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;\n    pixels[i] = pixels[i + 1] = pixels[i + 2] = avg;\n    // pixels[i + 3] is alpha — leave unchanged\n  }\n\n  // Transfer the processed buffer back — no copy\n  postMessage(pixels.buffer, [pixels.buffer]);\n});\n\n// image.component.ts\n@Component({ /* ... */ })\nexport class ImageComponent {\n  private worker = new Worker(new URL('./image-processor.worker', import.meta.url));\n\n  async processImage(imageData: ImageData): Promise<ImageData> {\n    return new Promise((resolve) => {\n      this.worker.onmessage = ({ data }: MessageEvent<ArrayBuffer>) => {\n        resolve(new ImageData(new Uint8ClampedArray(data),\n          imageData.width, imageData.height));\n      };\n\n      // Transfer buffer to worker — imageData.data.buffer is now owned by worker\n      // Attempting to read imageData after this point would throw\n      this.worker.postMessage(imageData.data.buffer, [imageData.data.buffer]);\n    });\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Clone vs Transfer</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-rose-50 border-2 border-rose-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-rose-700 mb-1\">Structured clone</p><p class=\"text-slate-500\">10MB buffer copied &mdash; both sides now hold a full copy</p><p class=\"text-rose-600 font-semibold mt-1\">slow for large data</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-emerald-700 mb-1\">Transfer</p><p class=\"text-slate-500\">ownership moves &mdash; sender's buffer becomes empty</p><p class=\"text-emerald-600 font-semibold mt-1\">O(1), zero copy</p></div></div></div>"
    },
    {
      "id": "comlink-rpc-pattern",
      "title": "Comlink — RPC-style worker communication",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">An <strong>invisible intercom with a translator</strong> built in. Normally, talking to the back room means shouting a note through a slot and waiting for a note to come back &mdash; you have to label each note so you know which reply matches which request. Comlink installs an intercom that makes it feel like the back-room employee is standing right next to you: you just ask a question out loud and get an answer, and the wiring behind the wall handles the message-passing bookkeeping.</p>
          </div>
        </div>
        <p>Raw Web Worker message passing works but has a real ergonomics problem: it's fire-and-forget. You <code>postMessage()</code> a request and set up a separate <code>onmessage</code> handler for the response. With multiple concurrent requests in flight, you need to track request IDs and route responses manually &mdash; the worker API is essentially a callback-based protocol.</p>
        <p><strong>Comlink</strong> (from the Chrome team at Google) wraps that protocol in a proxy that makes calling worker functions look exactly like calling async methods on a local object. You <code>Comlink.expose()</code> an object in the worker, and <code>Comlink.wrap()</code> on the main thread gives you a proxy where every method returns a Promise. Comlink handles message ID tracking, response routing, and error propagation automatically.</p>
        <h3>Why this matters for Angular services</h3>
        <p>With Comlink, a worker can look like a plain TypeScript service &mdash; a class with methods. The Angular service on the main thread holds a Comlink proxy and calls worker methods with <code>await</code>, just like calling an HTTP service. Worker integration becomes a first-class part of the application instead of a hand-rolled protocol.</p>
      `,
      "code": "// npm install comlink\n\n// ---- pdf-generator.worker.ts ----\nimport * as Comlink from 'comlink';\n\nexport class PdfGeneratorWorker {\n  async generatePdf(data: {\n    title: string;\n    rows: Array<{ label: string; value: string }>;\n  }): Promise<Uint8Array> {\n    // Heavy PDF generation (e.g., using pdf-lib)\n    // This runs on the worker thread — no UI freezing\n    const bytes = await buildPdfDocument(data);  // hypothetical helper\n    return bytes;\n  }\n\n  async compressPdf(input: Uint8Array): Promise<Uint8Array> {\n    // Another CPU-intensive operation\n    return compress(input);\n  }\n}\n\n// Expose the class to Comlink\nComlink.expose(new PdfGeneratorWorker());\n\n// ---- pdf.service.ts (main thread) ----\nimport { Injectable } from '@angular/core';\nimport * as Comlink from 'comlink';\nimport type { PdfGeneratorWorker } from './pdf-generator.worker';\n\n@Injectable({ providedIn: 'root' })\nexport class PdfService {\n  // Type the proxy with the worker's class type\n  private worker = Comlink.wrap<PdfGeneratorWorker>(\n    new Worker(new URL('./pdf-generator.worker', import.meta.url))\n  );\n\n  // Call worker methods exactly like async service methods\n  async generateReport(title: string, rows: Array<{ label: string; value: string }>) {\n    // This awaits the worker — main thread is NOT blocked\n    const pdfBytes = await this.worker.generatePdf({ title, rows });\n    const blob = new Blob([pdfBytes], { type: 'application/pdf' });\n    const url = URL.createObjectURL(blob);\n    window.open(url);\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Raw postMessage vs Comlink</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-slate-50 border-2 border-slate-300 rounded-xl p-3\"><p class=\"font-bold text-slate-700 text-center mb-2\">Raw messages</p><div class=\"space-y-1.5\"><div class=\"bg-white border border-slate-200 rounded px-2 py-1 text-center\">postMessage(id + payload)</div><div class=\"bg-white border border-slate-200 rounded px-2 py-1 text-center\">onmessage — match id manually</div><div class=\"bg-white border border-slate-200 rounded px-2 py-1 text-center\">hand-rolled error handling</div></div></div><div class=\"bg-purple-50 border-2 border-purple-200 rounded-xl p-3\"><p class=\"font-bold text-purple-700 text-center mb-2\">Comlink proxy</p><div class=\"space-y-1.5\"><div class=\"bg-white border border-purple-200 rounded px-2 py-1 text-center\">await worker.generatePdf(data)</div><div class=\"bg-white border border-purple-200 rounded px-2 py-1 text-center\">looks like a local async method</div><div class=\"bg-white border border-purple-200 rounded px-2 py-1 text-center\">errors propagate as rejections</div></div></div></div></div>"
    },
    {
      "id": "worker-limitations",
      "title": "Web Worker constraints and practical considerations",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">The back-room employee has <strong>no window looking onto the shop floor</strong> &mdash; they can't see or touch the register, the shelves, or the customers, only the notes you send them. And the warehouse (Node.js / SSR) doesn't even have a back room built &mdash; if you try to send an order slip there, there's no one to receive it. Finally, hiring twenty back-room employees for a five-minute task wastes more in setup than it saves &mdash; keep a small, reusable crew instead.</p>
          </div>
        </div>
        <p>Web Workers are powerful but come with constraints you must plan around before reaching for one.</p>
        <h3>No DOM or Angular access</h3>
        <p>Workers have zero access to the DOM, Angular's DI system, component state, or any browser API that requires a browsing context (<code>window.location</code>, local storage, cookies). If a task needs to read the DOM or call an Angular service, it belongs on the main thread &mdash; workers are purely for computation.</p>
        <h3>SSR incompatibility</h3>
        <p>Node.js doesn't support the Web Worker browser API. If your app uses Server-Side Rendering (<code>@angular/ssr</code>), guard worker instantiation with <code>typeof Worker !== 'undefined'</code> and provide a synchronous fallback for the server. Skip the guard and your SSR build throws a <code>ReferenceError</code> at runtime.</p>
        <h3>Module loading in workers</h3>
        <p>Workers created with <code>{ type: 'module' }</code> support ES module imports and are the default when generated by the CLI. Workers created without that option only support the older <code>importScripts()</code> API &mdash; use the CLI generator to get the correct configuration automatically.</p>
        <h3>Cost of many workers</h3>
        <p>Each <code>Worker</code> instance creates an OS thread with its own memory. Spawning many short-lived workers is expensive. The recommended pattern is a small pool of persistent workers created at service initialization and terminated in <code>ngOnDestroy</code>.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Forgetting the SSR guard is the single most common way to break a working app the moment SSR or prerendering is added. <code>typeof Worker !== 'undefined'</code> reads as boilerplate until the day your build works fine locally but crashes on the server, because Node.js has no <code>Worker</code> global at all.</p>
          </div>
        </div>
      `,
      "code": "// ---- SSR-safe worker instantiation ----\nimport { Injectable, OnDestroy, PLATFORM_ID, inject } from '@angular/core';\nimport { isPlatformBrowser } from '@angular/common';\nimport type { SearchResult, SearchRequest } from './search.worker';\n\n@Injectable({ providedIn: 'root' })\nexport class WorkerSearchService implements OnDestroy {\n  private worker?: Worker;\n  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));\n\n  constructor() {\n    // Only create the worker in the browser — not during SSR\n    if (this.isBrowser && typeof Worker !== 'undefined') {\n      this.worker = new Worker(new URL('./search.worker', import.meta.url));\n    }\n  }\n\n  async search(request: SearchRequest): Promise<SearchResult[]> {\n    if (!this.worker) {\n      // SSR fallback: run synchronously on the server\n      return this.searchSynchronous(request);\n    }\n\n    return new Promise((resolve, reject) => {\n      this.worker!.onmessage = ({ data }) => resolve(data);\n      this.worker!.onerror = (err) => reject(err);\n      this.worker!.postMessage(request);\n    });\n  }\n\n  private searchSynchronous(request: SearchRequest): SearchResult[] {\n    // Plain synchronous version for SSR — acceptable because Node has no UI thread\n    return request.items\n      .filter(item => item.name.toLowerCase().includes(request.query.toLowerCase()))\n      .map(item => ({ id: item.id, name: item.name, relevance: 10 }));\n  }\n\n  ngOnDestroy(): void {\n    // Always terminate workers to free the OS thread\n    this.worker?.terminate();\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">What Workers Cannot Touch</p><div class=\"grid grid-cols-2 md:grid-cols-4 gap-2 text-xs\"><div class=\"bg-rose-50 border border-rose-200 rounded-lg p-2 text-center font-semibold text-rose-700\">DOM</div><div class=\"bg-rose-50 border border-rose-200 rounded-lg p-2 text-center font-semibold text-rose-700\">Angular DI</div><div class=\"bg-rose-50 border border-rose-200 rounded-lg p-2 text-center font-semibold text-rose-700\">window / document</div><div class=\"bg-rose-50 border border-rose-200 rounded-lg p-2 text-center font-semibold text-rose-700\">localStorage</div></div><p class=\"text-center text-slate-400 mt-4\">only channel in and out: postMessage() / onmessage</p></div>"
    }
  ]
});
