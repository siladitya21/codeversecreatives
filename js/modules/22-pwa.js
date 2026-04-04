window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "pwa",
  "title": "Progressive Web Apps (PWA)",
  "icon": "bi bi-phone-vibrate",
  "questions": [
    {
      "id": "what-is-pwa",
      "title": "What is PWA?",
      "explanation": `
          <p>A <strong>Progressive Web App (PWA)</strong> is a type of application software delivered through the web, built using common web technologies including HTML, CSS, and JavaScript. It is intended to work on any platform that uses a standards-compliant browser.</p>
          <h3>Core Characteristics</h3>
          <ul>
            <li><strong>Reliable:</strong> Loads instantly even in uncertain network conditions (Offline first).</li>
            <li><strong>Fast:</strong> Responds quickly to user interactions with silky smooth animations.</li>
            <li><strong>Engaging:</strong> Feels like a natural app on the device, with an immersive user experience and push notifications.</li>
            <li><strong>Installable:</strong> Can be added to the user's home screen without an app store.</li>
          </ul>
        `,
      "code": "// PWAs combine the best of web and native apps.\n// Key components: Service Worker, Web App Manifest, and HTTPS.",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">PWA Architecture</p><div class="flex items-center justify-between max-w-md mx-auto"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-indigo-700">Web App</p></div><div class="text-slate-300">&harr;</div><div class="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-amber-700">Service Worker</p></div><div class="text-slate-300">&harr;</div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-emerald-700">Cache / Network</p></div></div></div>`
    },
    {
      "id": "how-to-convert-angular-to-pwa",
      "title": "How to convert Angular app to PWA?",
      "explanation": `
          <p>Angular makes converting an existing app into a PWA extremely easy using the Angular CLI. The process is automated through a single command.</p>\n\n          <p>Running the <code>ng add</code> command does the following:</p>\n          <ul>\n            <li>Adds the <code>@angular/service-worker</code> package.</li>\n            <li>Enables service worker build support in <code>angular.json</code>.</li>\n            <li>Imports <code>ServiceWorkerModule</code> in your app.</li>\n            <li>Creates <code>manifest.webmanifest</code> and <code>ngsw-config.json</code>.</li>\n            <li>Adds icons to the <code>src/assets</code> folder.</li>\n          </ul>
        `,
      "code": "// Run this command in your project terminal:\nng add @angular/pwa",
      "language": "bash"
    },
    {
      "id": "what-is-service-worker",
      "title": "What is service worker?",
      "explanation": `
          <p>A <strong>Service Worker</strong> is a script that your browser runs in the background, separate from a web page, opening the door to features that don't need a web page or user interaction.</p>\n\n          <p>In Angular, the service worker acts as a <strong>network proxy</strong>. It intercepts network requests and can serve cached responses, allowing the app to work offline or on slow networks.</p>\n\n          <h3>Key Functions</h3>\n          <ul>\n            <li>Caching assets (JS, CSS, HTML, Images).</li>\n            <li>Background data synchronization.</li>\n            <li>Handling Push Notifications.</li>\n          </ul>
        `,
      "code": "// Angular provides the SwUpdate service to manage updates\nconstructor(private swUpdate: SwUpdate) {\n  if (this.swUpdate.isEnabled) {\n    this.swUpdate.versionUpdates.subscribe(evt => {\n      if (confirm('New version available. Update now?')) {\n        window.location.reload();\n      }\n    });\n  }\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><div class="max-w-md mx-auto bg-rose-50 border border-rose-200 rounded-xl p-4 text-center text-[10px] text-rose-700"><strong>Note:</strong> Service Workers only function over <strong>HTTPS</strong> (except for localhost).</div></div>`
    },
    {
      "id": "what-is-manifest-json",
      "title": "What is manifest.json?",
      "explanation": `
          <p>The <strong>Web App Manifest</strong> (usually named <code>manifest.webmanifest</code> in Angular projects) is a simple JSON file that tells the browser about your web application and how it should behave when 'installed' on the user's mobile device or desktop.</p>\n\n          <p>It includes information such as the app name, icons, theme colors, and the start URL.</p>
        `,
      "code": "{\n  \"name\": \"Angular Tutorial\",\n  \"short_name\": \"ATutorial\",\n  \"theme_color\": \"#1976d2\",\n  \"background_color\": \"#fafafa\",\n  \"display\": \"standalone\",\n  \"scope\": \"/\",\n  \"start_url\": \"/\",\n  \"icons\": [...]\n}",
      "language": "json"
    },
    {
      "id": "what-is-angular-pwa-package",
      "title": "What is @angular/pwa?",
      "explanation": `
          <p><strong>@angular/pwa</strong> is an Angular CLI schematic that automates the setup for making your Angular application a Progressive Web App.</p>\n\n          <p>Rather than manually configuring service workers, creating manifest files, and resizing icons, this package provides a standard, "Angular-way" configuration out of the box that works seamlessly with the Angular build pipeline.</p>\n        `,
      "code": "// It configures ngsw-config.json which defines which files\n// should be cached by the service worker.\n{\n  \"index\": \"/index.html\",\n  \"assetGroups\": [\n    { \"name\": \"app\", \"installMode\": \"prefetch\", \"resources\": { \"files\": [\"/favicon.ico\", \"/*.js\", \"/*.css\"] } }\n  ]\n}",
      "language": "json"
    }
  ]
});