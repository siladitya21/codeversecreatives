window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "web-workers",
  "title": "Web Workers",
  "icon": "bi bi-cpu",
  "questions": [
    {
      "id": "what-are-web-workers",
      "title": "What are web workers in Angular?",
      "explanation": `
          <p><strong>Web Workers</strong> are a browser feature that allows you to run scripts in a background thread, separate from the main execution thread of your web page. This means you can perform long-running, CPU-intensive computations without blocking the user interface.</p>
          <p>In Angular, Web Workers are typically used to offload heavy tasks from the main UI thread, ensuring that the application remains responsive and smooth.</p>
          <h3>Key Characteristics</h3>
          <ul>
            <li><strong>Background Thread:</strong> Runs independently of the main UI thread.</li>
            <li><strong>No DOM Access:</strong> Cannot directly access the DOM, <code>window</code>, or <code>document</code> objects.</li>
            <li><strong>Message-based Communication:</strong> Communicates with the main thread via messages (<code>postMessage()</code> and <code>onmessage</code>).</li>
            <li><strong>Performance:</strong> Prevents UI freezes during complex calculations.</li>
          </ul>
        `,
      "code": "// main.ts (main thread)\nconst worker = new Worker(new URL('./app.worker', import.meta.url));\nworker.onmessage = ({ data }) => {\n  console.log('Worker response:', data);\n};\nworker.postMessage('start calculation');\n\n// app.worker.ts (worker thread)\naddEventListener('message', ({ data }) => {\n  const result = data + ' processed';\n  postMessage(result);\n});",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Web Worker Flow</p><div class="flex items-center justify-between max-w-md mx-auto"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-indigo-700">Main UI Thread</p><p class="text-[10px] text-slate-500">postMessage()</p></div><div class="text-slate-300">&harr;</div><div class="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-amber-700">Web Worker Thread</p><p class="text-[10px] text-slate-500">onmessage / postMessage()</p></div><div class="text-slate-300">&harr;</div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-emerald-700">Heavy Computation</p></div></div></div>`
    },
    {
      "id": "how-to-use-web-workers",
      "title": "How to use web workers?",
      "explanation": `
          <p>Angular CLI provides built-in support for generating and configuring Web Workers.</p>\n\n          <h3>Steps to Implement</h3>\n          <ol>\n            <li><strong>Generate Worker:</strong> Use <code>ng generate web-worker &lt;name&gt;</code>.</li>\n            <li><strong>Main Thread:</strong> Create an instance of the worker and set up <code>onmessage</code> and <code>postMessage()</code>.</li>\n            <li><strong>Worker Thread:</strong> Implement the heavy logic and communicate back to the main thread.</li>\n          </ol>\n        `,
      "code": "// 1. Generate a worker:\n// ng generate web-worker my-calculator\n\n// 2. In your component (main thread):\nimport { Component } from '@angular/core';\n\n@Component({ /* ... */ })\nexport class MyComponent {\n  result: number | undefined;\n\n  calculateHeavyTask() {\n    const worker = new Worker(new URL('../app.worker', import.meta.url));\n    worker.onmessage = ({ data }) => {\n      this.result = data; // Update UI with result\n      worker.terminate(); // Terminate worker when done\n    };\n    worker.postMessage(1000000); // Send data to worker\n  }\n}",
      "language": "typescript"
    },
    {
      "id": "when-to-use-web-workers",
      "title": "When to use web workers?",
      "explanation": `
          <p>Web Workers are ideal for tasks that are:</p>\n          <ul>
            <li><strong>CPU-intensive:</strong> Complex calculations, data processing, image manipulation.</li>\n            <li><strong>Long-running:</strong> Operations that might take several seconds or more.</li>\n            <li><strong>Independent of the DOM:</strong> Tasks that don't need direct access to the UI.</li>\n          </ul>\n          <p><strong>Avoid using Web Workers for:</strong> Simple tasks, network requests (unless you need background sync), or anything that requires direct DOM manipulation.</p>\n        `,
      "code": "// Good candidates for Web Workers:\n// - Image filtering or resizing\n// - Large array sorting or filtering\n// - Encryption/decryption\n// - Real-time data processing (e.g., financial calculations)\n// - AI/ML model inference",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><div class="max-w-md mx-auto bg-amber-50 border border-amber-200 rounded-xl p-4 text-center"><p class="text-xs font-bold text-amber-700 uppercase mb-2">Main Thread vs Worker Thread</p><div class="grid grid-cols-2 gap-4 text-[10px]"><div class="bg-white p-2 rounded border border-slate-200"><strong>Main Thread:</strong> UI, DOM, Events</div><div class="bg-white p-2 rounded border border-slate-200"><strong>Worker Thread:</strong> Heavy Logic, No UI</div></div></div>`
    }
  ]
});