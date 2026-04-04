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
    },
    {
      "id": "http-error-interceptor",
      "title": "HTTP error interceptor",
      "explanation": `
          <p>An <strong>HTTP Interceptor</strong> is a middleware layer that can intercept all HTTP requests and responses globally. It's ideal for handling errors, logging, or adding authentication tokens to every request.</p>\n\n          <p>An interceptor can catch HTTP errors and decide whether to retry, suppress, or propagate them based on the error type (404, 500, network error, etc.).</p>\n        `,
      "code": "import { Injectable } from '@angular/core';\nimport { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';\nimport { Observable, throwError } from 'rxjs';\nimport { catchError } from 'rxjs/operators';\n\n@Injectable()\nexport class GlobalHttpErrorInterceptor implements HttpInterceptor {\n  intercept(\n    request: HttpRequest<any>,\n    next: HttpHandler\n  ): Observable<HttpEvent<any>> {\n    return next.handle(request).pipe(\n      catchError((error: HttpErrorResponse) => {\n        let errorMsg = '';\n        if (error.error instanceof ErrorEvent) {\n          // Client-side error\n          errorMsg = `Error: ${error.error.message}`;\n        } else {\n          // Server-side error\n          errorMsg = `Error Code: ${error.status}\\nMessage: ${error.message}`;\n        }\n        console.error(errorMsg);\n        // Show user-friendly error message\n        // this.notificationService.showError('Something went wrong');\n        return throwError(() => new Error(errorMsg));\n      })\n    );\n  }\n}\n\n// Register in AppModule:\n// providers: [{ provide: HTTP_INTERCEPTORS, useClass: GlobalHttpErrorInterceptor, multi: true }]",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">HTTP Interceptor Chain</p><div class="flex items-center justify-between max-w-lg mx-auto\"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center\"><p class="text-xs font-bold text-indigo-700\">HTTP Request</p></div><div class="text-slate-300\">&rarr;</div><div class="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center\"><p class="text-xs font-bold text-amber-700\">Interceptor</p></div><div class="text-slate-300\">&rarr;</div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center\"><p class="text-xs font-bold text-emerald-700\">Server</p></div><div class="text-slate-300\">&larr;</div><div class="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center\"><p class="text-xs font-bold text-amber-700\">Handle Error</p></div><div class="text-slate-300\">&larr;</div><div class="bg-rose-50 border-2 border-rose-200 rounded-xl p-3 text-center\"><p class="text-xs font-bold text-rose-700\">Error Response</p></div></div></div>`
    },
    {
      "id": "error-types-and-categories",
      "title": "Error types and categorization",
      "explanation": `
          <p>Not all errors are equal. Different types of errors require different handling strategies. Understanding error categories helps you implement appropriate recovery logic.</p>\n\n          <h3>Error Categories</h3>\n          <ul>\n            <li><strong>Client Errors (4xx):</strong> 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found. Usually permanent; retry won't help.</li>\n            <li><strong>Server Errors (5xx):</strong> 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable. Often temporary; retrying may succeed.</li>\n            <li><strong>Network Errors:</strong> Connection timeouts, DNS failures. Usually temporary; retrying with backoff is recommended.</li>\n            <li><strong>Validation Errors:</strong> User input validation failures. Need user interaction to fix.</li>\n            <li><strong>Unexpected Errors:</strong> Runtime errors, parsing errors. Requires investigation and logging.</li>\n          </ul>\n        `,
      "code": "import { HttpErrorResponse } from '@angular/common/http';\n\nhandleHttpError(error: HttpErrorResponse) {\n  if (error.status === 0) {\n    // Network error\n    console.error('Network error occurred:', error.error);\n    return 'Network error. Please check your connection.';\n  } else if (error.status === 401) {\n    // Unauthorized - redirect to login\n    console.error('Unauthorized access');\n    return 'Session expired. Please log in again.';\n  } else if (error.status === 403) {\n    // Forbidden\n    console.error('Access forbidden');\n    return 'You do not have permission to access this resource.';\n  } else if (error.status === 404) {\n    // Not found\n    console.error('Resource not found');\n    return 'The requested resource was not found.';\n  } else if (error.status >= 500) {\n    // Server errors - consider retrying\n    console.error('Server error');\n    return 'Server error. Please try again later.';\n  } else {\n    // Other http errors\n    console.error('An error occurred:', error.error);\n    return 'An unexpected error occurred.';\n  }\n}\n\n// Usage in service or interceptor\ncatchError((error: HttpErrorResponse) => {\n  const message = this.handleHttpError(error);\n  this.showNotification(message);\n  return throwError(() => new Error(message));\n})",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Error Handling Strategy</p><div class=\"flex flex-col gap-2 max-w-md mx-auto\"><div class=\"bg-rose-50 border border-rose-200 p-2 rounded text-center text-[10px]\"><strong>4xx Errors:</strong> User/client issue - Show message, don't retry</div><div class=\"bg-amber-50 border border-amber-200 p-2 rounded text-center text-[10px]\"><strong>5xx Errors:</strong> Server issue - Retry with backoff</div><div class=\"bg-slate-50 border border-slate-200 p-2 rounded text-center text-[10px]\"><strong>Network Error:</strong> Connection issue - Retry with backoff</div><div class=\"bg-indigo-50 border border-indigo-200 p-2 rounded text-center text-[10px]\"><strong>Validation Error:</strong> User input - Show validation messages</div></div></div>`
    }
  ]
});