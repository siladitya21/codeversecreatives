window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "error-handling",
  "title": "Error Handling",
  "icon": "bi bi-bug",
  "questions": [
    {
      "id": "what-is-errorhandler",
      "title": "What is ErrorHandler?",
      "explanation": `
          <p><strong>ErrorHandler</strong> is a built-in Angular class that handles uncaught exceptions globally within your application. By default, it catches errors and logs them to the browser console.</p>
          <p>This centralized approach ensures that any runtime error, whether in a component, service, or directive, is captured in one place, preventing the app from crashing silently without any trace.</p>
        `,
      "code": "import { ErrorHandler } from '@angular/core';\n\n// Default behavior:\n// handleError(error: any): void {\n//   console.error(error);\n// }",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Global Error Flow</p><div class="flex items-center justify-between max-w-md mx-auto"><div class="bg-rose-50 border-2 border-rose-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-rose-700">App Logic Error</p></div><div class="text-slate-300">&rarr;</div><div class="bg-indigo-600 text-white p-3 rounded-lg text-xs font-bold shadow-md">ErrorHandler</div><div class="text-slate-300">&rarr;</div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-emerald-700">Log / API Reporting</p></div></div></div>`
    },
    {
      "id": "custom-error-handler",
      "title": "How to create custom error handler?",
      "explanation": `
          <p>To implement a <strong>custom error handler</strong>, you create a class that implements the <code>ErrorHandler</code> interface and provides your own logic inside the <code>handleError()</code> method.</p>\n\n          <p>Common uses for a custom handler include sending logs to a backend server (like Sentry or LogRocket) or showing a global "Something went wrong" notification to the user.</p>\n        `,
      "code": "@Injectable()\nexport class GlobalErrorHandler implements ErrorHandler {\n  handleError(error: any): void {\n    const message = error.message ? error.message : error.toString();\n    console.error('Captured Global Error:', message);\n    // logic to send log to server...\n  }\n}\n\n// Register in AppModule providers:\nproviders: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }]",
      "language": "typescript"
    },
    {
      "id": "retry-logic-http",
      "title": "Retry logic for HTTP requests",
      "explanation": `
          <p>Network requests often fail due to temporary issues (flaky Wi-Fi, server overload). Using RxJS, you can add <strong>retry logic</strong> to automatically re-attempt the request before failing.</p>\n\n          <p>The <code>retry()</code> operator is the standard way to do this. You can specify the number of attempts or use a configuration object for more complex strategies (like exponential backoff).</p>\n        `,
      "code": "import { HttpClient } from '@angular/common/http';\nimport { retry, catchError } from 'rxjs';\n\ngetData() {\n  return this.http.get('/api/data').pipe(\n    retry(3), // Attempt 3 times before throwing error\n    catchError(err => {\n      console.log('Persistent error after 3 retries');\n      throw err;\n    })\n  );\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><div class="max-w-md mx-auto bg-amber-50 border border-amber-200 rounded-xl p-4 text-center"><p class="text-xs font-bold text-amber-700 uppercase mb-2">Retry Mechanism</p><p class="text-[10px] text-slate-500">Request &rarr; Error &rarr; Retry 1 &rarr; Error &rarr; Retry 2 &rarr; Success!</p></div></div>`
    }
  ]
});