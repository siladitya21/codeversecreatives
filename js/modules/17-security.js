window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "security",
  "title": "Security",
  "icon": "bi bi-shield-lock",
  "questions": [
    {
      id: "angular-22-standard-security-upgrade",
      title: "Angular 22 standard for security",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A building with a security guard, badge readers, and locked doors on every floor by default. Angular's sanitizer, strict template checking, and HttpClient protections are the guard and the badge readers — always on, doing their job whether you think about them or not. The break-ins in real Angular apps almost never come from the guard failing; they come from someone deliberately propping a fire door open (bypassing the sanitizer) because it was inconvenient to walk around.</p>
          </div>
        </div>
        <p>Angular 22-ready security starts with Angular's defaults: template sanitization, strict template checking, typed APIs, and <code>HttpClient</code> protections. The risky parts are almost always where developers deliberately step around the framework — direct DOM writes, unsafe HTML, insecure token storage, a permissive CSP, or a hand-rolled authentication flow.</p>
        <h3>Modern security checklist</h3>
        <ul>
          <li>Never put untrusted content into <code>ElementRef.nativeElement.innerHTML</code>.</li>
          <li>Use <code>DomSanitizer</code> bypass APIs only for content you fully control.</li>
          <li>Prefer HttpOnly secure cookies for sessions when the backend supports them.</li>
          <li>Use functional HTTP interceptors for auth headers and global error handling.</li>
          <li>Enable CSRF protection for cookie-based auth.</li>
          <li>Use a Content Security Policy and avoid inline scripts.</li>
        </ul>
      `,
      code: `export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.accessToken();

  const secured = token
    ? req.clone({ setHeaders: { Authorization: 'Bearer ' + token } })
    : req;

  return next(secured);
};

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN'
      })
    )
  ]
});`,
      language: "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Angular's Guard vs Where Attacks Actually Get In</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3"><p class="font-bold text-emerald-700 text-center mb-2">On by default</p><div class="space-y-1.5"><div class="bg-white border border-emerald-200 rounded px-2 py-1">Template sanitization</div><div class="bg-white border border-emerald-200 rounded px-2 py-1">AOT (no runtime template eval)</div><div class="bg-white border border-emerald-200 rounded px-2 py-1">HttpClient XSRF header</div></div></div><div class="bg-rose-50 border-2 border-rose-200 rounded-xl p-3"><p class="font-bold text-rose-700 text-center mb-2">Real-world break-in points</p><div class="space-y-1.5"><div class="bg-white border border-rose-200 rounded px-2 py-1">nativeElement.innerHTML</div><div class="bg-white border border-rose-200 rounded px-2 py-1">Careless bypassSecurityTrust*</div><div class="bg-white border border-rose-200 rounded px-2 py-1">Tokens in localStorage</div></div></div></div></div>`
    },
    {
      "id": "what-is-xss",
      "title": "What is XSS and how does Angular prevent it?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A forged staff badge. If an attacker can slip a fake badge (malicious script) past the front desk, the building's own security system doesn't stop them from anything a real employee could do — walk into any room, open any drawer — because the system trusts anyone wearing a badge from inside the building. XSS is smuggling a fake badge onto your page so the attacker's code runs with all the trust your page has earned.</p>
          </div>
        </div>
        <p><strong>Cross-Site Scripting (XSS)</strong> is an attack where a malicious actor injects JavaScript into a page that then executes in the victim's browser under the page's trusted origin. The attacker can steal session cookies, hijack authentication tokens, redirect the user, or silently exfiltrate data. It remains one of the most exploited vulnerabilities on the web.</p>
        <p>The attack works because browsers trust scripts that originate from the same domain as the page. If an attacker gets code embedded in your HTML — through a comment field, a URL parameter, an API response — the browser runs it with full access to <code>document.cookie</code>, <code>localStorage</code>, and the DOM.</p>
        <h3>How Angular prevents XSS by default</h3>
        <p>Angular treats every value bound in a template as <strong>untrusted by default</strong>. When you use interpolation <code>{{ userInput }}</code> or property binding <code>[innerHTML]="content"</code>, Angular's sanitizer inspects the value and strips or encodes anything that could execute as code. For interpolation, Angular HTML-encodes the value so <code>&lt;script&gt;</code> becomes the literal text <code>&lt;script&gt;</code>. For <code>[innerHTML]</code>, Angular strips script tags, event handlers, and JavaScript URLs before inserting the content.</p>
        <h3>Context-aware sanitization</h3>
        <p>Angular understands five security contexts: HTML (for <code>[innerHTML]</code>), Style (for <code>[style]</code>), URL (for <code>[href]</code>), Resource URL (for <code>[src]</code> of scripts/iframes), and Script. The sanitizer applies different rules per context — a <code>javascript:</code> URL is safe as plain text but dangerous in an <code>&lt;a href&gt;</code>, and Angular sanitizes it differently in each context.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">The only way to introduce real XSS in a modern Angular app is to deliberately bypass the sanitizer — via <code>DomSanitizer.bypassSecurityTrustHtml()</code> or by directly setting <code>ElementRef.nativeElement.innerHTML</code>. Angular cannot protect you if you go around its own APIs. Treat both patterns as a signal to stop and ask "do I actually control this content?" before shipping it.</p>
          </div>
        </div>
      `,
      "code": "// ---- Angular's automatic XSS protection ----\n\n@Component({\n  selector: 'app-comment',\n  template: `\n    <!-- Safe: Angular HTML-encodes this. <script> appears as literal text -->\n    <p>{{ userComment }}</p>\n\n    <!-- Safe: Angular strips scripts and event handlers from innerHTML -->\n    <div [innerHTML]=\"sanitizedDescription\"></div>\n\n    <!-- UNSAFE: bypasses ALL sanitization — only use for truly trusted HTML -->\n    <div [innerHTML]=\"trustedHtml\"></div>\n  `\n})\nexport class CommentComponent {\n  // Attacker-supplied content — Angular encodes this safely:\n  userComment = '<script>document.cookie=\"stolen\"</script><b>Hello</b>';\n  // Rendered as the literal string — no script executes.\n\n  // HTML from a trusted CMS — Angular still sanitizes [innerHTML]:\n  sanitizedDescription = '<p>Product <strong>details</strong></p><script>alert(1)</script>';\n  // After sanitization: <p>Product <strong>details</strong></p>  (script removed)\n\n  // Only use bypassSecurityTrust* when you OWN the content source:\n  private sanitizer = inject(DomSanitizer);\n  trustedHtml = this.sanitizer.bypassSecurityTrustHtml('<p>Our own safe HTML</p>');\n}\n\n// ---- The most common UNSAFE pattern — AVOID ----\n// @ViewChild('container') container!: ElementRef;\n// this.container.nativeElement.innerHTML = userInput;  // NO sanitization whatsoever",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">The Only Way In Is Through a Bypass</p><div class="flex flex-col items-center gap-2 text-xs max-w-md mx-auto"><div class="bg-emerald-50 border border-emerald-200 rounded px-3 py-1.5 w-full text-center">{{ value }} / [innerHTML] &rarr; sanitized automatically</div><div class="bg-slate-100 border border-slate-300 rounded px-3 py-1.5 w-full text-center text-slate-500">no path to script execution</div><div class="text-slate-300 text-center">unless you explicitly...</div><div class="bg-rose-50 border border-rose-200 rounded px-3 py-1.5 w-full text-center text-rose-700">bypassSecurityTrustHtml() or nativeElement.innerHTML =</div><div class="bg-rose-100 border border-rose-300 rounded px-3 py-1.5 w-full text-center text-rose-700">sanitizer bypassed &mdash; XSS possible</div></div></div>`
    },
    {
      "id": "what-is-csrf",
      "title": "What is CSRF and how does Angular help?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Someone forging your signature on a check by tracing it off an envelope you left lying around, then mailing that check to your own bank. The bank recognizes the signature (your session cookie, sent automatically) and processes it without asking further questions. A CSRF token is like a second, freshly-drawn signature the bank requires on top of the traced one — something the forger, sitting on a completely different website, has no way to copy.</p>
          </div>
        </div>
        <p><strong>Cross-Site Request Forgery (CSRF)</strong> is an attack where a malicious website tricks a user's browser into making an authenticated request to a different site — one where the user is already logged in. Because the browser automatically sends cookies with every request to their origin, the target server sees a seemingly legitimate request and processes it.</p>
        <p>The classic example: a user is logged into their bank. They visit a malicious page containing a hidden form pointing to the bank's transfer endpoint with the attacker's account number. When the page loads, the form submits automatically, the browser attaches the bank's session cookie, and the bank processes the transfer.</p>
        <h3>The double-submit cookie pattern</h3>
        <p>The standard mitigation is a CSRF token — a random value generated by the server, stored in both a cookie and a custom request header. The browser sends the cookie automatically, but JavaScript on a different origin can't read the cookie's value to forge the header. The server checks that both match; an attacker's forged request from another origin can't include the correct header because it can't read the cookie.</p>
        <h3>Angular's built-in support</h3>
        <p>Angular's <code>HttpClient</code> automatically implements this pattern. On every outgoing HTTP request, it reads a cookie named <code>XSRF-TOKEN</code> and sets it as the <code>X-XSRF-TOKEN</code> header. Your server needs to: (1) set the <code>XSRF-TOKEN</code> cookie on login, and (2) validate the <code>X-XSRF-TOKEN</code> header on state-changing requests. The cookie name and header name are configurable if your server uses different conventions.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">This entire mechanism only works if the <code>XSRF-TOKEN</code> cookie is readable by JavaScript. If it's marked <code>httpOnly: true</code>, Angular's <code>HttpClient</code> cannot read it to echo it back as a header, and the CSRF check silently fails to attach. <code>httpOnly</code> is correct for the session cookie itself, but the CSRF token cookie specifically needs to stay script-readable.</p>
          </div>
        </div>
      `,
      "code": "// ---- Enable CSRF support in standalone Angular (modern approach) ----\n// main.ts\nbootstrapApplication(AppComponent, {\n  providers: [\n    provideHttpClient(\n      withXsrfConfiguration({\n        cookieName: 'XSRF-TOKEN',       // default — your server sets this cookie\n        headerName: 'X-XSRF-TOKEN'      // default — Angular sends this header\n      })\n    )\n  ]\n});\n\n// ---- What the server must do (Node/Express example) ----\n// On login success, set the XSRF-TOKEN cookie:\n// res.cookie('XSRF-TOKEN', crypto.randomUUID(), {\n//   httpOnly: false,  // IMPORTANT: must be readable by JavaScript\n//   sameSite: 'Strict',\n//   secure: true\n// });\n\n// On state-changing requests (POST/PUT/DELETE), validate:\n// const csrfCookie = req.cookies['XSRF-TOKEN'];\n// const csrfHeader = req.headers['x-xsrf-token'];\n// if (csrfCookie !== csrfHeader) return res.status(403).send('CSRF validation failed');\n\n// ---- What Angular does automatically ----\n// Every HttpClient request reads the 'XSRF-TOKEN' cookie and adds:\n// X-XSRF-TOKEN: <the-token-value>\n// This header is added automatically — no code needed in Angular components.\n\n// ---- Custom configuration example (if your server uses different names) ----\nprovideHttpClient(\n  withXsrfConfiguration({\n    cookieName: 'MY_APP_XSRF_COOKIE',\n    headerName: 'X-MY-APP-XSRF'\n  })\n)",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Double-Submit Cookie Pattern</p><div class="flex flex-col items-center gap-2 text-xs max-w-md mx-auto"><div class="bg-indigo-50 border border-indigo-200 rounded px-3 py-1.5 w-full text-center">Server sets XSRF-TOKEN cookie on login</div><div class="text-slate-300">&darr;</div><div class="bg-emerald-50 border border-emerald-200 rounded px-3 py-1.5 w-full text-center">HttpClient reads cookie, echoes as X-XSRF-TOKEN header</div><div class="text-slate-300">&darr;</div><div class="bg-amber-50 border border-amber-200 rounded px-3 py-1.5 w-full text-center">Server compares cookie value === header value</div><div class="text-slate-300">&darr;</div><div class="bg-slate-800 text-white rounded px-3 py-1.5 w-full text-center">Match &rarr; request accepted. Mismatch/missing &rarr; 403</div></div></div>`
    },
    {
      "id": "how-angular-sanitizes",
      "title": "How does Angular sanitize data?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Airport security checking different things depending on which door you're walking through. The same pocketknife is fine in checked baggage but confiscated at the passenger gate. Angular's sanitizer runs the same idea: the exact same string might sail through as plain text but get stripped or blocked when it's about to become a <code>src</code> attribute or an <code>innerHTML</code> — because the danger depends entirely on the door (context) it's walking through.</p>
          </div>
        </div>
        <p>Angular's sanitizer inspects values bound in templates and transforms anything potentially dangerous before it reaches the DOM. The key insight is that danger depends on <strong>context</strong> — the same string can be safe as paragraph text but dangerous as a URL or as an element's <code>innerHTML</code>.</p>
        <h3>The five security contexts</h3>
        <p><strong>HTML context</strong> — used when binding to <code>innerHTML</code>. Angular parses the HTML with a whitelist parser and removes tags like <code>&lt;script&gt;</code>, <code>&lt;iframe&gt;</code>, and attributes like <code>onclick</code> or <code>onerror</code>. Safe structural HTML (<code>&lt;p&gt;</code>, <code>&lt;strong&gt;</code>, <code>&lt;ul&gt;</code>) passes through.</p>
        <p><strong>Style context</strong> — used when binding to the <code>style</code> attribute. Angular removes CSS expressions and <code>url()</code> values referencing <code>javascript:</code> URIs.</p>
        <p><strong>URL context</strong> — used when binding to <code>href</code>, <code>src</code>, and similar attributes. Angular allows <code>http:</code>, <code>https:</code>, and relative URLs but rewrites dangerous schemes like <code>javascript:</code> and <code>data:</code> to <code>unsafe:</code>, which browsers treat as a broken link rather than executable code.</p>
        <p><strong>Resource URL context</strong> — used for script sources, iframe sources, and similar attributes that load external resources. Angular is strictest here and blocks everything by default; you must explicitly mark a URL trusted with <code>DomSanitizer.bypassSecurityTrustResourceUrl()</code>.</p>
        <p><strong>Script context</strong> — Angular never allows dynamic script execution. Binding to a <code>&lt;script src&gt;</code> is always blocked.</p>
      `,
      "code": "import { Component, inject } from '@angular/core';\nimport { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';\n\n@Component({\n  selector: 'app-content-renderer',\n  template: `\n    <!-- HTML context: scripts and event handlers stripped -->\n    <div [innerHTML]=\"richContent\"></div>\n\n    <!-- URL context: javascript: URI blocked automatically -->\n    <a [href]=\"linkUrl\">Visit</a>\n\n    <!-- Resource URL context: blocked unless marked trusted -->\n    <!-- <iframe [src]=\"videoUrl\"></iframe>  <-- BLOCKED by default -->\n    <iframe [src]=\"trustedVideoUrl\"></iframe>  <!-- Only after bypassSecurityTrustResourceUrl -->\n  `\n})\nexport class ContentRendererComponent {\n  private sanitizer = inject(DomSanitizer);\n\n  // Angular strips <script> and onclick — remaining HTML is rendered:\n  richContent = '<p>Safe <strong>text</strong></p><script>alert(1)</script>';\n  // DOM receives: <p>Safe <strong>text</strong></p>\n\n  // Angular converts javascript: to unsafe: — the link is broken but harmless:\n  linkUrl = 'javascript:stealCookies()';\n  // DOM href becomes: unsafe:javascript:stealCookies()\n\n  // Trusted resource URL for a known-safe iframe:\n  private rawVideoUrl = 'https://www.youtube.com/embed/abc123';\n  trustedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawVideoUrl);\n  // ONLY do this for URLs you completely control or have validated.\n}",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Same String, Different Door</p><div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs"><div class="bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-center"><p class="font-bold text-indigo-700">HTML</p><p class="text-slate-500 mt-1">[innerHTML] — strips scripts/handlers</p></div><div class="bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center"><p class="font-bold text-emerald-700">Style</p><p class="text-slate-500 mt-1">[style] — strips javascript: url()</p></div><div class="bg-amber-50 border border-amber-200 rounded-lg p-2 text-center"><p class="font-bold text-amber-700">URL</p><p class="text-slate-500 mt-1">[href]/[src] — unsafe: rewrite</p></div><div class="bg-rose-50 border border-rose-200 rounded-lg p-2 text-center"><p class="font-bold text-rose-700">Resource URL</p><p class="text-slate-500 mt-1">iframe/script src — blocked by default</p></div></div></div>`
    },
    {
      "id": "what-is-domsanitizer",
      "title": "What is DomSanitizer?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A VIP wristband at a security checkpoint. Everyone else gets patted down (sanitized) at the door. The person wearing the wristband walks straight through — not because the guard verified them personally, but because <em>you</em>, the event organizer, vouched for them ahead of time. If you hand a wristband to the wrong person, the guard has no way to catch it — that responsibility left the guard's hands the moment you issued the wristband.</p>
          </div>
        </div>
        <p><code>DomSanitizer</code> is an Angular service that gives you a controlled escape hatch from Angular's automatic security. When you have content you know is safe — because you generated it yourself, or your server already sanitized it — but Angular's default rules would block it, <code>DomSanitizer</code> lets you mark it as explicitly trusted.</p>
        <p>The key word is <em>you</em>. When you call <code>bypassSecurityTrust*()</code>, you're personally asserting the content is safe. Angular stops checking. If you're wrong — if the content contains a script your server failed to strip — Angular has no fallback. The vulnerability is yours.</p>
        <h3>The four bypassSecurityTrust methods</h3>
        <p><code>bypassSecurityTrustHtml(value)</code> — marks an HTML string safe for <code>[innerHTML]</code>. Use for trusted rich-text content from your own CMS.</p>
        <p><code>bypassSecurityTrustUrl(value)</code> — marks a URL safe for <code>[href]</code> or <code>[src]</code> on anchor and image tags. Use for <code>blob:</code> URLs generated by your own code.</p>
        <p><code>bypassSecurityTrustResourceUrl(value)</code> — marks a URL safe for loading external resources: <code>&lt;iframe src&gt;</code>, <code>&lt;script src&gt;</code>, <code>&lt;video src&gt;</code>. The strictest context.</p>
        <p><code>bypassSecurityTrustStyle(value)</code> — marks a CSS string safe for <code>[style]</code>. Rarely needed since Angular allows most CSS through automatically.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Never call <code>bypassSecurityTrustHtml()</code> directly on raw, unmodified user input — that's not an escape hatch, that's disabling the seatbelt. It's only safe when the content came from a source <em>you</em> already sanitized (a trusted CMS pipeline) or generated entirely in your own code (a blob URL you created). If the string traces back to user input without a sanitization step in between, don't bypass it.</p>
          </div>
        </div>
      `,
      "code": "import { Component, inject } from '@angular/core';\nimport { DomSanitizer, SafeHtml, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';\n\n@Component({\n  selector: 'app-trusted-content',\n  template: `\n    <!-- CMS-managed HTML — sanitized on the server before storage -->\n    <article [innerHTML]=\"trustedArticleHtml\"></article>\n\n    <!-- Blob URL from FileReader — created in our own code -->\n    <img [src]=\"blobImageUrl\" />\n\n    <!-- YouTube embed — known safe domain, whitelist approach -->\n    <iframe [src]=\"youtubeUrl\" width=\"560\" height=\"315\"></iframe>\n  `\n})\nexport class TrustedContentComponent {\n  private sanitizer = inject(DomSanitizer);\n\n  // ---- HTML from our own CMS (server already stripped scripts) ----\n  private cmsHtml = '<h2>Article Title</h2><p>Body text with <em>markup</em>.</p>';\n  trustedArticleHtml: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(this.cmsHtml);\n\n  // ---- Blob URL generated from a user file upload ----\n  createBlobUrl(file: File): void {\n    const objectUrl = URL.createObjectURL(file);\n    // Must trust blob: URLs explicitly\n    this.blobImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);\n  }\n  blobImageUrl: SafeUrl = this.sanitizer.bypassSecurityTrustUrl('');\n\n  // ---- Whitelist approach for resource URLs ----\n  private allowedDomains = ['https://www.youtube.com/embed/', 'https://player.vimeo.com/'];\n\n  buildVideoUrl(rawUrl: string): SafeResourceUrl | null {\n    const isSafe = this.allowedDomains.some(domain => rawUrl.startsWith(domain));\n    if (!isSafe) {\n      console.error('Blocked untrusted video URL:', rawUrl);\n      return null;\n    }\n    return this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);\n  }\n  youtubeUrl = this.buildVideoUrl('https://www.youtube.com/embed/dQw4w9WgXcQ')!;\n}",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Who's Vouching For This Content?</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center"><p class="font-bold text-emerald-700 mb-2">Safe to bypass</p><p class="text-slate-500">Your own generated HTML, server-sanitized CMS content, blob: URLs you created</p></div><div class="bg-rose-50 border-2 border-rose-200 rounded-xl p-3 text-center"><p class="font-bold text-rose-700 mb-2">Never bypass</p><p class="text-slate-500">Raw user input, unvalidated third-party HTML, unchecked query params</p></div></div></div>`
    },
    {
      "id": "security-best-practices",
      "title": "Security best practices in Angular",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Home security in layers: a lock on the front door, a deadbolt, an alarm system, and a safe for the valuables — not just one measure. Any single layer can fail, but a burglar who beats the lock still has to deal with the alarm, and one who disables the alarm still can't crack the safe. Angular's route guards, server-side checks, CSP, and sanitizer are exactly this kind of layered defense; none of them alone is "the" security feature.</p>
          </div>
        </div>
        <p>Angular's built-in protections handle the most common attack vectors automatically, but good security still requires active decisions from the developer. Here are the practices that matter most in real Angular applications.</p>
        <h3>Never set innerHTML directly</h3>
        <p>Setting <code>this.el.nativeElement.innerHTML = userContent</code> bypasses every Angular security mechanism — any XSS payload in <code>userContent</code> executes immediately. Use <code>[innerHTML]</code> property binding instead; Angular sanitizes the value before writing it to the DOM.</p>
        <h3>AOT is already the default</h3>
        <p>Ahead-of-Time compilation compiles templates at build time. Because the compiler isn't shipped to the browser, there's no way to inject a template Angular will compile and execute at runtime — this closes off template injection as an attack surface entirely, and it's the default in Angular 22.</p>
        <h3>Validate and authorize on the server</h3>
        <p>Angular's security is entirely client-side. A determined attacker uses browser DevTools to call your API directly, bypassing every Angular guard and validator. Server-side authorization must independently verify every request — never trust the client to have enforced access control.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Route guards (<code>canActivate</code>, <code>canMatch</code>) are UX, not security. They stop an unauthorized user from seeing a page inside the app, but they do nothing to stop that same user from calling your API directly with a tool like curl or DevTools. Treat guards as "show the right UI to the right user," and treat the server as the only real authorization boundary.</p>
          </div>
        </div>
        <h3>Content Security Policy (CSP)</h3>
        <p>Configure your web server to send a <code>Content-Security-Policy</code> header restricting which scripts and styles can load. A strict CSP is the most effective defense-in-depth against XSS — even if an attacker injects a script tag, the browser refuses to execute it. Angular's AOT output pairs well with a strict CSP because it generates no <code>eval()</code> calls and no inline scripts by default.</p>
        <h3>Keep dependencies updated</h3>
        <p>Run <code>ng update</code> and <code>npm audit</code> regularly. Many real-world Angular security incidents trace back to vulnerabilities in third-party libraries, not Angular itself. Staying current is the single highest-leverage maintenance habit.</p>
      `,
      "code": "// ---- 1. Use property binding instead of direct DOM manipulation ----\n\n// UNSAFE — bypasses all sanitization:\n// this.el.nativeElement.innerHTML = userInput;\n\n// SAFE — Angular sanitizes before writing:\n// <div [innerHTML]=\"userInput\"></div>\n\n// ---- 2. Route guard for UX — NOT for data security ----\n@Injectable({ providedIn: 'root' })\nexport class AdminGuard implements CanActivate {\n  private auth = inject(AuthService);\n  private router = inject(Router);\n\n  canActivate(): boolean {\n    if (this.auth.isAdmin()) return true;\n    this.router.navigate(['/unauthorized']);\n    return false;\n    // This guard controls navigation — but a user can still POST to /api/admin\n    // directly via DevTools. The server must also verify admin role.\n  }\n}\n\n// ---- 3. Validate on the server — client validation is for UX only ----\n@Injectable({ providedIn: 'root' })\nexport class ProductService {\n  private http = inject(HttpClient);\n\n  createProduct(product: Partial<Product>): Observable<Product> {\n    // Angular validates the form in the browser, but the server\n    // must independently validate price > 0, name length, category exists, etc.\n    return this.http.post<Product>('/api/products', product);\n  }\n}\n\n// ---- 4. Content Security Policy header (configured on the server) ----\n// Example Nginx config:\n// add_header Content-Security-Policy\n//   \"default-src 'self';\n//    script-src 'self';\n//    style-src 'self' https://fonts.googleapis.com;\n//    img-src 'self' data: https:;\n//    font-src 'self' https://fonts.gstatic.com;\n//    frame-ancestors 'none';\"\n//   always;",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Layered Defense</p><div class="flex flex-col items-center gap-1 text-xs max-w-sm mx-auto"><div class="bg-indigo-50 border border-indigo-200 rounded px-3 py-1.5 w-full text-center">Sanitizer + AOT (template layer)</div><div class="bg-emerald-50 border border-emerald-200 rounded px-3 py-1.5 w-full text-center">Route guards (UX layer)</div><div class="bg-amber-50 border border-amber-200 rounded px-3 py-1.5 w-full text-center">CSP header (browser enforcement layer)</div><div class="bg-slate-800 text-white rounded px-3 py-1.5 w-full text-center">Server-side authorization (the real boundary)</div></div></div>`
    }
  ]
});
