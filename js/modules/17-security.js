window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "security",
  "title": "Security",
  "icon": "bi bi-shield-lock",
  "questions": [
    {
      "id": "what-is-xss",
      "title": "What is XSS and how to prevent it?",
      "explanation": `
          <p><strong>XSS (Cross-Site Scripting)</strong> is a vulnerability where an attacker injects malicious scripts into a web page viewed by other users.</p>
          <p>Angular prevents XSS by default by treating all values as <strong>untrusted</strong>. When you bind data using <code>{{ }}</code> or <code>[property]</code>, Angular automatically sanitizes the data before rendering it in the DOM.</p>
          <h3>Prevention in Angular</h3>
          <ul>
            <li><strong>Automatic Output Escaping:</strong> Angular converts script tags into plain text.</li>
            <li><strong>Sanitization:</strong> It cleans HTML, styles, and URLs to remove dangerous code.</li>
            <li><strong>Contextual Security:</strong> It understands different security contexts (HTML, Attribute, Style, URL).</li>
          </ul>
        `,
      "code": "// Angular will escape this automatically:\nthis.userContent = '<script>alert(\"Hacked!\")</script>';\n\n// In template:\n// <div>{{ userContent }}</div>\n// Renders as literal text, not an executing script.",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">XSS Prevention</p><div class="flex items-center justify-center gap-4"><div class="bg-rose-50 border border-rose-200 p-2 rounded text-[10px]">Untrusted Input</div><div class="text-slate-300">&rarr;</div><div class="bg-indigo-600 text-white p-2 rounded text-xs font-bold shadow-md">Angular Sanitizer</div><div class="text-slate-300">&rarr;</div><div class="bg-emerald-50 border border-emerald-200 p-2 rounded text-[10px]">Safe DOM</div></div></div>`
    },
    {
      "id": "what-is-csrf",
      "title": "What is CSRF?",
      "explanation": `
          <p><strong>CSRF (Cross-Site Request Forgery)</strong> is an attack where a malicious site tricks a user's browser into sending an unauthorized request to a different server where the user is authenticated (e.g., using stored cookies).</p>\n\n          <p>Angular has built-in support to help prevent this. Its <code>HttpClient</code> supports a common mechanism: it reads a token from a cookie (default <code>XSRF-TOKEN</code>) and adds it as an HTTP header (default <code>X-XSRF-TOKEN</code>) to every outgoing request.</p>
        `,
      "code": "// To enable CSRF support in modern Angular:\nprovideHttpClient(\n  withXsrfConfiguration({\n    cookieName: 'CUSTOM-XSRF-TOKEN',\n    headerName: 'X-CUSTOM-XSRF-TOKEN',\n  })\n)",
      "language": "typescript"
    },
    {
      "id": "how-angular-sanitizes",
      "title": "How does Angular sanitize data?",
      "explanation": `
          <p>Angular uses a <strong>Sanitizer</strong> to inspect values and determine if they are safe to use in a specific context. The context matters: a URL that is safe for a link (<code>&lt;a&gt;</code>) might be dangerous for a script source (<code>&lt;script&gt;</code>).</p>\n\n          <p>If a value is deemed dangerous, Angular modifies it (e.g., prefixing a URL with <code>unsafe:</code>) to neutralize the threat.</p>
        `,
      "code": "// Dangerous URL: javascript:alert(1)\n// Angular sanitizes to: unsafe:javascript:alert(1)\n// This prevents the browser from executing the script.",
      "language": "typescript"
    },
    {
      "id": "what-is-domsanitizer",
      "title": "What is DomSanitizer?",
      "explanation": `
          <p><strong>DomSanitizer</strong> is a service that allows you to manually bypass Angular's built-in security. You use it when you <strong>know</strong> a piece of content is safe, even if Angular's default rules flag it as suspicious.</p>\n\n          <p><strong>Warning:</strong> Bypassing security can expose your application to XSS attacks. Only use these methods for content you trust 100%.</p>\n\n          <h3>Methods</h3>\n          <ul>\n            <li><code>bypassSecurityTrustHtml()</code></li>\n            <li><code>bypassSecurityTrustUrl()</code></li>\n            <li><code>bypassSecurityTrustResourceUrl()</code></li>\n          </ul>\n        `,
      "code": "constructor(private sanitizer: DomSanitizer) {}\n\ngetSafeUrl(url: string) {\n  // Marks a URL as safe for use in an iframe or script src\n  return this.sanitizer.bypassSecurityTrustResourceUrl(url);\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><div class="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[10px]"><strong>Security Note:</strong><br/>Using DomSanitizer is like telling Angular: \"I'll take responsibility for this code's safety.\" Use with extreme caution.</div></div>`
    },
    {
      "id": "security-best-practices",
      "title": "Security best practices in Angular",
      "explanation": `
          <p>To keep your Angular application secure, follow these industry-standard best practices:</p>\n\n          <ul>\n            <li><strong>Avoid Direct DOM Manipulation:</strong> Don't use <code>ElementRef</code> to set properties like <code>innerHTML</code>. Use Angular templates or <code>Renderer2</code> instead.</li>\n            <li><strong>Use AOT Compilation:</strong> Ahead-of-Time compilation prevents many injection attacks by compiling templates at build time.</li>\n            <li><strong>Keep Dependencies Updated:</strong> Regularly run <code>ng update</code> to get the latest security patches.</li>\n            <li><strong>Don't trust user input:</strong> Always validate and sanitize data on the server side, even if Angular handles the client side.</li>\n            <li><strong>Server-Side Rendering (SSR):</strong> Be cautious with SSR (Angular Universal) as it can be more vulnerable to certain types of injection if not handled correctly.</li>\n          </ul>\n        `,
      "code": "// &check; Safe: Use property binding\n// <div [innerHTML]=\"trustedHtml\"></div>\n\n// &times; Unsafe: Direct DOM access\n// this.el.nativeElement.innerHTML = userInput;",
      "language": "typescript"
    }
  ]
});