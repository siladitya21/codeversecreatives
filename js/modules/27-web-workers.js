window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "web-workers",
  "title": "Web Workers",
  "icon": "bi bi-cpu",
  "questions": [
    {
      "id": "what-are-web-workers",
      "title": "What are Web Workers and why do they matter in Angular?",
      "explanation": `
          <p>JavaScript is single-threaded. Every operation — rendering, event handling, network parsing, and your application logic — runs on the same main thread. When a CPU-intensive task (like sorting 100,000 records, running a search algorithm, or processing image data) takes more than 16 milliseconds, it blocks the main thread and the browser cannot render a new frame. The result is visible jank: the UI freezes, animations stutter, and buttons stop responding.</p>

          <p><strong>Web Workers</strong> are a browser API that lets you run JavaScript in a true background thread, separate from the main UI thread. The worker thread has its own memory, its own event loop, and runs in parallel with the main thread. Offloading heavy computation to a worker keeps the main thread free for rendering and user interaction — the application remains fully responsive while the calculation runs.</p>

          <h3>What Workers Cannot Do</h3>
          <p>Workers are deliberately sandboxed. They have no access to the DOM, <code>window</code>, <code>document</code>, or Angular's component tree. The only way to exchange data between the main thread and a worker is via message passing: <code>postMessage()</code> sends data, and the <code>message</code> event receives it. Data passed this way is <strong>cloned</strong> (serialized and deserialized), not shared by reference, which eliminates race conditions but means large objects are expensive to transfer.</p>

          <h3>When to Use Workers</h3>
          <p>Use a Web Worker when a task is CPU-bound, runs long enough to block rendering (>50ms is noticeable), and does not need direct DOM access. Classic examples: image filtering, PDF generation, complex search/filter over large datasets, cryptographic operations, and running machine learning inference.</p>
        `,
      "code": "// The problem Web Workers solve:\n// Without a worker, this blocks the main thread for ~300ms,\n// freezing the UI completely during the calculation.\n\n// MAIN THREAD (blocks UI):\nfunction findPrimes(limit: number): number[] {\n  const primes: number[] = [];\n  for (let n = 2; n <= limit; n++) {\n    let isPrime = true;\n    for (let i = 2; i <= Math.sqrt(n); i++) {\n      if (n % i === 0) { isPrime = false; break; }\n    }\n    if (isPrime) primes.push(n);\n  }\n  return primes;\n}\n\n// Called synchronously — blocks the event loop:\nconst result = findPrimes(1_000_000);  // UI frozen for ~300ms\n\n// WITH A WEB WORKER:\n// Move findPrimes() into a worker file.\n// The main thread sends a message and continues rendering.\n// The worker runs findPrimes() on its own thread.\n// When done, it posts the result back — the UI was never blocked.",
      "language": "typescript"
    },
    {
      "id": "how-to-use-web-workers",
      "title": "How to create and use Web Workers in Angular",
      "explanation": `
          <p>The Angular CLI has built-in support for generating and bundling Web Workers. When you run <code>ng generate web-worker</code>, the CLI creates the worker file, adds the necessary TypeScript configuration, and configures the build so the worker is bundled separately as its own chunk.</p>

          <h3>The Worker File</h3>
          <p>A worker file is a plain TypeScript file that listens to <code>addEventListener('message', ...)</code> for input and calls <code>postMessage()</code> to return output. It has access to all standard JavaScript APIs but not to Angular services or the DOM. The worker runs in its own scope — no <code>window</code>, no <code>document</code>, but you can import utility functions and third-party libraries.</p>

          <h3>Creating the Worker on the Main Thread</h3>
          <p>On the component side, instantiate the worker using the <code>new URL()</code> + <code>import.meta.url</code> pattern. This syntax tells the Angular build system exactly which file is a worker entry point, so it can bundle it correctly. Always check for <code>typeof Worker !== 'undefined'</code> before instantiating — SSR environments do not support workers.</p>
        `,
      "code": "// ---- Step 1: Generate the worker ----\n// ng generate web-worker search\n// Creates: src/app/search.worker.ts + updates tsconfig.worker.json\n\n// ---- Step 2: search.worker.ts (worker thread) ----\n/// <reference lib=\"webworker\" />\n\nexport interface SearchRequest {\n  query: string;\n  items: Array<{ id: number; name: string; description: string }>;\n}\n\nexport interface SearchResult {\n  id: number;\n  name: string;\n  relevance: number;\n}\n\naddEventListener('message', ({ data }: MessageEvent<SearchRequest>) => {\n  const { query, items } = data;\n  const q = query.toLowerCase();\n\n  const results: SearchResult[] = items\n    .map(item => {\n      const nameMatch = item.name.toLowerCase().includes(q) ? 10 : 0;\n      const descMatch = item.description.toLowerCase().includes(q) ? 5 : 0;\n      return { id: item.id, name: item.name, relevance: nameMatch + descMatch };\n    })\n    .filter(r => r.relevance > 0)\n    .sort((a, b) => b.relevance - a.relevance);\n\n  // Send results back to the main thread\n  postMessage(results);\n});\n\n// ---- Step 3: search.component.ts (main thread) ----\nimport { Component, OnDestroy, signal } from '@angular/core';\nimport type { SearchRequest, SearchResult } from './search.worker';\n\n@Component({\n  selector: 'app-search',\n  standalone: true,\n  template: `\n    <input (input)=\"search($event)\" placeholder=\"Search...\" />\n    <p *ngIf=\"searching()\">Searching...</p>\n    <ul>\n      <li *ngFor=\"let r of results()\">{{ r.name }}</li>\n    </ul>\n  `\n})\nexport class SearchComponent implements OnDestroy {\n  results = signal<SearchResult[]>([]);\n  searching = signal(false);\n  private worker?: Worker;\n\n  constructor() {\n    if (typeof Worker !== 'undefined') {\n      // The URL pattern tells the bundler this is a worker entry point\n      this.worker = new Worker(new URL('./search.worker', import.meta.url));\n      this.worker.onmessage = ({ data }: MessageEvent<SearchResult[]>) => {\n        this.results.set(data);\n        this.searching.set(false);\n      };\n    }\n  }\n\n  search(event: Event): void {\n    const query = (event.target as HTMLInputElement).value.trim();\n    if (!query || !this.worker) return;\n\n    this.searching.set(true);\n    const request: SearchRequest = { query, items: this.getAllItems() };\n    this.worker.postMessage(request);\n  }\n\n  private getAllItems() {\n    // In real code, this comes from a service\n    return [{ id: 1, name: 'Laptop', description: 'Fast 16GB RAM' }];\n  }\n\n  ngOnDestroy(): void {\n    this.worker?.terminate();\n  }\n}",
      "language": "typescript"
    },
    {
      "id": "transferable-objects",
      "title": "Transferable objects — zero-copy data transfer",
      "explanation": `
          <p>By default, data passed via <code>postMessage()</code> is serialized using the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm">structured clone algorithm</a> — the entire object is copied from one thread's memory to the other. For small objects (a few kilobytes) this is fine, but for large binary data (an image buffer, a large Float32Array for audio processing, a canvas pixel buffer), cloning megabytes on every message creates serious latency and memory pressure.</p>

          <p><strong>Transferable objects</strong> solve this by <em>transferring ownership</em> of the memory from one thread to the other in O(1) time, without copying. The data is not duplicated — instead the sender relinquishes access to it and the receiver gains exclusive ownership. The types that support transfer are: <code>ArrayBuffer</code>, <code>MessagePort</code>, <code>ImageBitmap</code>, <code>OffscreenCanvas</code>, and <code>ReadableStream</code>/<code>WritableStream</code>.</p>

          <h3>How to Transfer</h3>
          <p>The second argument to <code>postMessage()</code> is the transfer list — an array of Transferable objects that should be moved rather than cloned. After a transfer, accessing the original object from the sending thread throws a <code>TypeError</code> because it no longer owns that memory.</p>
        `,
      "code": "// ---- Image processing with Transferable ArrayBuffer ----\n// Without transfer: a 10MB image buffer is cloned on postMessage — slow\n// With transfer: ownership is moved in microseconds — no copy\n\n// image-processor.worker.ts\n/// <reference lib=\"webworker\" />\n\naddEventListener('message', ({ data }: MessageEvent<ArrayBuffer>) => {\n  const pixels = new Uint8ClampedArray(data);\n\n  // Apply a grayscale filter (modifies buffer in place)\n  for (let i = 0; i < pixels.length; i += 4) {\n    const avg = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;\n    pixels[i] = pixels[i + 1] = pixels[i + 2] = avg;\n    // pixels[i + 3] is alpha — leave unchanged\n  }\n\n  // Transfer the processed buffer back — no copy\n  postMessage(pixels.buffer, [pixels.buffer]);\n});\n\n// image.component.ts\n@Component({ /* ... */ })\nexport class ImageComponent {\n  private worker = new Worker(new URL('./image-processor.worker', import.meta.url));\n\n  async processImage(imageData: ImageData): Promise<ImageData> {\n    return new Promise((resolve) => {\n      this.worker.onmessage = ({ data }: MessageEvent<ArrayBuffer>) => {\n        resolve(new ImageData(new Uint8ClampedArray(data),\n          imageData.width, imageData.height));\n      };\n\n      // Transfer buffer to worker — imageData.data.buffer is now owned by worker\n      // Attempting to read imageData after this point would throw\n      this.worker.postMessage(imageData.data.buffer, [imageData.data.buffer]);\n    });\n  }\n}",
      "language": "typescript"
    },
    {
      "id": "comlink-rpc-pattern",
      "title": "Comlink — RPC-style worker communication",
      "explanation": `
          <p>Raw Web Worker message passing works but has a significant ergonomics problem: it is fire-and-forget. You <code>postMessage()</code> a request and set up a separate <code>onmessage</code> handler for the response. If you have multiple concurrent requests in flight, you need to track request IDs and route responses manually. The worker API is essentially a callback-based protocol.</p>

          <p><strong>Comlink</strong> (by the Chrome team at Google) wraps this protocol in a proxy that makes calling worker functions look exactly like calling async methods on a local object. You <code>Comlink.expose()</code> an object in the worker, and <code>Comlink.wrap()</code> on the main thread gives you a proxy where every method returns a Promise. Comlink handles message ID tracking, response routing, and error propagation automatically.</p>

          <h3>Why This Matters for Angular Services</h3>
          <p>With Comlink, you can write a worker that looks like a plain TypeScript service — a class with methods. The Angular service on the main thread holds a Comlink proxy and calls worker methods with <code>await</code>, just like calling an HTTP service. This makes worker integration feel like a first-class part of the application rather than a manual protocol.</p>
        `,
      "code": "// npm install comlink\n\n// ---- pdf-generator.worker.ts ----\nimport * as Comlink from 'comlink';\n\nexport class PdfGeneratorWorker {\n  async generatePdf(data: {\n    title: string;\n    rows: Array<{ label: string; value: string }>;\n  }): Promise<Uint8Array> {\n    // Heavy PDF generation (e.g., using pdf-lib)\n    // This runs on the worker thread — no UI freezing\n    const bytes = await buildPdfDocument(data);  // hypothetical helper\n    return bytes;\n  }\n\n  async compressPdf(input: Uint8Array): Promise<Uint8Array> {\n    // Another CPU-intensive operation\n    return compress(input);\n  }\n}\n\n// Expose the class to Comlink\nComlink.expose(new PdfGeneratorWorker());\n\n// ---- pdf.service.ts (main thread) ----\nimport { Injectable } from '@angular/core';\nimport * as Comlink from 'comlink';\nimport type { PdfGeneratorWorker } from './pdf-generator.worker';\n\n@Injectable({ providedIn: 'root' })\nexport class PdfService {\n  // Type the proxy with the worker's class type\n  private worker = Comlink.wrap<PdfGeneratorWorker>(\n    new Worker(new URL('./pdf-generator.worker', import.meta.url))\n  );\n\n  // Call worker methods exactly like async service methods\n  async generateReport(title: string, rows: Array<{ label: string; value: string }>) {\n    // This awaits the worker — main thread is NOT blocked\n    const pdfBytes = await this.worker.generatePdf({ title, rows });\n    const blob = new Blob([pdfBytes], { type: 'application/pdf' });\n    const url = URL.createObjectURL(blob);\n    window.open(url);\n  }\n}",
      "language": "typescript"
    },
    {
      "id": "worker-limitations",
      "title": "Web Worker constraints and practical considerations",
      "explanation": `
          <p>Web Workers are powerful but come with constraints you must plan around before deciding to use them.</p>

          <h3>No DOM or Angular Access</h3>
          <p>Workers have zero access to the DOM, Angular's DI system, component state, or any browser API that requires a browsing context (<code>window.location</code>, local storage, session storage, cookies). If your task needs to read the DOM or call an Angular service, it belongs on the main thread. Workers are purely for computation.</p>

          <h3>SSR Incompatibility</h3>
          <p>Node.js does not support the Web Worker browser API. If your Angular application uses Server-Side Rendering (Angular Universal or the new <code>@angular/ssr</code>), you must guard worker instantiation with <code>typeof Worker !== 'undefined'</code> and provide a synchronous fallback for the server. Without this guard, your SSR build will throw a ReferenceError at runtime.</p>

          <h3>Module Loading in Workers</h3>
          <p>Workers created with <code>{ type: 'module' }</code> support ES module imports and are the default when you use the CLI. Workers created without this option only support the older <code>importScripts()</code> API. Always use the CLI to generate workers to get the correct configuration automatically.</p>

          <h3>Cost of Many Workers</h3>
          <p>Each Worker instance creates an OS thread with its own memory. Spawning many short-lived workers is expensive. The recommended pattern is to create a small pool of persistent workers at service initialization time and terminate them in <code>ngOnDestroy</code>.</p>
        `,
      "code": "// ---- SSR-safe worker instantiation ----\nimport { Injectable, OnDestroy, PLATFORM_ID, inject } from '@angular/core';\nimport { isPlatformBrowser } from '@angular/common';\nimport type { SearchResult, SearchRequest } from './search.worker';\n\n@Injectable({ providedIn: 'root' })\nexport class WorkerSearchService implements OnDestroy {\n  private worker?: Worker;\n  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));\n\n  constructor() {\n    // Only create the worker in the browser — not during SSR\n    if (this.isBrowser && typeof Worker !== 'undefined') {\n      this.worker = new Worker(new URL('./search.worker', import.meta.url));\n    }\n  }\n\n  async search(request: SearchRequest): Promise<SearchResult[]> {\n    if (!this.worker) {\n      // SSR fallback: run synchronously on the server\n      return this.searchSynchronous(request);\n    }\n\n    return new Promise((resolve, reject) => {\n      this.worker!.onmessage = ({ data }) => resolve(data);\n      this.worker!.onerror = (err) => reject(err);\n      this.worker!.postMessage(request);\n    });\n  }\n\n  private searchSynchronous(request: SearchRequest): SearchResult[] {\n    // Plain synchronous version for SSR — acceptable because Node has no UI thread\n    return request.items\n      .filter(item => item.name.toLowerCase().includes(request.query.toLowerCase()))\n      .map(item => ({ id: item.id, name: item.name, relevance: 10 }));\n  }\n\n  ngOnDestroy(): void {\n    // Always terminate workers to free the OS thread\n    this.worker?.terminate();\n  }\n}",
      "language": "typescript"
    }
  ]
});
