window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "deployment-devops",
  "title": "Deployment & DevOps",
  "icon": "bi bi-cloud-upload",
  "questions": [
    {
      id: "angular-22-standard-devops-upgrade",
      title: "Angular 22 standard for deployment and DevOps",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A pilot's <strong>pre-flight checklist</strong>. Every single flight runs through the same fixed steps &mdash; flaps, fuel, instruments &mdash; not because the pilot forgot how to fly, but because skipping a step under time pressure is exactly how planes crash. A deployment pipeline is that checklist for shipping code: lint, test, build, budget check, deploy &mdash; run identically every time, with no step skipped because "it'll probably be fine."</p>
          </div>
        </div>
        <p>Angular 22-ready DevOps focuses on repeatable builds, environment-safe configuration, CDN caching, route fallback, bundle budgets, automated tests, and observability. The exact deployment shape depends on whether the app is CSR, prerendered, SSR, or containerized &mdash; but the checklist stays the same.</p>
        <h3>Modern DevOps checklist</h3>
        <ul>
          <li>Run lint, test, and production build in CI.</li>
          <li>Fail CI on budget errors and critical test failures.</li>
          <li>Cache hashed assets aggressively but never cache <code>index.html</code> forever.</li>
          <li>Configure SPA fallback for client-side routes.</li>
          <li>Inject environment config safely and avoid committing secrets.</li>
          <li>Track runtime errors and Core Web Vitals after deployment.</li>
        </ul>
      `,
      code: `# Typical CI flow
npm ci
npm run lint
npm test -- --watch=false
ng build --configuration production

# Cache rule idea
# index.html: no-cache
# *.js, *.css with content hashes: max-age=31536000, immutable

# SPA fallback idea
# /dashboard/settings -> serve /index.html
# Angular Router then renders the route.`,
      language: "bash",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">The Pre-Flight Checklist</p><div class="flex flex-wrap items-center justify-center gap-2 text-xs"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700">npm ci</div><span class="text-slate-300">&rarr;</span><div class="bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700">lint</div><span class="text-slate-300">&rarr;</span><div class="bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700">test</div><span class="text-slate-300">&rarr;</span><div class="bg-rose-50 border-2 border-rose-200 rounded-lg px-3 py-2 text-center font-semibold text-rose-700">build production</div><span class="text-slate-300">&rarr;</span><div class="bg-purple-50 border-2 border-purple-200 rounded-lg px-3 py-2 text-center font-semibold text-purple-700">deploy</div></div></div>`
    },
    {
      "id": "deployment-strategies",
      "title": "Angular deployment strategies — choosing the right approach",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Choosing housing after a move. A <strong>serviced apartment</strong> (static CDN hosting) means someone else handles the utilities, security, and maintenance &mdash; you just move your boxes in. A <strong>bare rental</strong> you configure yourself (Nginx/Node) gives you full control over the wiring but you're the one who has to set it up. A <strong>modular shipping-container home</strong> (Docker) is fully self-contained and identical wherever you place it &mdash; on any lot, in any city.</p>
          </div>
        </div>
        <p>An Angular production build (<code>ng build</code>) produces a folder of static files: one <code>index.html</code>, several hashed JavaScript chunks, CSS, and assets. Because Angular is a Single Page Application, these static files can be served from virtually any infrastructure &mdash; from a simple S3 bucket to a containerized Nginx instance. The right target depends on performance requirements, infrastructure constraints, and whether you need SSR.</p>
        <h3>Static hosting (recommended for most SPAs)</h3>
        <p>Services like <strong>Netlify</strong>, <strong>Vercel</strong>, <strong>GitHub Pages</strong>, <strong>Firebase Hosting</strong>, and <strong>AWS S3 + CloudFront</strong> serve static files from globally distributed CDN nodes. Deploying is typically one command; these platforms handle HTTPS, HTTP/2, cache headers, compression, and global distribution automatically. Firebase Hosting and Netlify also handle the Angular router's HTML5 URL requirement with a single configuration line that redirects 404s to <code>index.html</code>.</p>
        <h3>Nginx or Node.js server</h3>
        <p>When you need more control &mdash; custom headers, API proxying, rate limiting, or Server-Side Rendering &mdash; you serve the Angular app from a web server you manage. Nginx is the common choice for pure static serving; Express.js shows up when you need SSR or server-side API routes alongside the Angular app.</p>
        <h3>Containerization with Docker</h3>
        <p>Docker eliminates environment inconsistency. A multi-stage Dockerfile builds the Angular app in a Node image, then copies the compiled <code>dist/</code> output into a minimal Nginx image. The resulting container is portable across any Docker-compatible infrastructure: Kubernetes, AWS ECS, Google Cloud Run, or a single VPS.</p>
      `,
      "code": "# ---- Build for production ----\nng build --configuration production\n# Output: dist/my-app/ with hashed filenames for cache-busting\n# ├── index.html\n# ├── main.abc123.js\n# ├── styles.xyz789.css\n# └── assets/\n\n# ---- Firebase Hosting (one command deploy) ----\nnpm install -g firebase-tools\nfirebase login\nfirebase init hosting\n# -> public directory: dist/my-app/browser\n# -> rewrite all URLs to index.html: yes (handles Angular routing)\nfirebase deploy --only hosting\n\n# ---- Netlify (drag-drop or CLI) ----\nnpm install -g netlify-cli\nnetlify deploy --prod --dir=dist/my-app/browser\n# Or: add _redirects file to src/ with:  /* /index.html 200\n\n# ---- GitHub Pages ----\nng add angular-cli-ghpages\nng deploy --base-href=/repository-name/\n# Or build manually:\nng build --configuration production --base-href /repository-name/\nnpx angular-cli-ghpages --dir=dist/my-app/browser",
      "language": "bash",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Three Ways to Move In</p><div class=\"grid grid-cols-1 md:grid-cols-3 gap-3 text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-indigo-700\">Serviced apartment</p><p class=\"text-slate-500 mt-1\">Netlify, Vercel, Firebase</p><p class=\"text-slate-400 mt-1\">zero infra to manage</p></div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-emerald-700\">Bare rental</p><p class=\"text-slate-500 mt-1\">Nginx or Node server</p><p class=\"text-slate-400 mt-1\">full control, more setup</p></div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-amber-700\">Shipping container</p><p class=\"text-slate-500 mt-1\">Docker container</p><p class=\"text-slate-400 mt-1\">identical everywhere</p></div></div></div>"
    },
    {
      "id": "docker-with-angular",
      "title": "Docker multi-stage build for Angular",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A restaurant that <strong>cooks the meal in a professional kitchen</strong> (the Node build stage), then hands the finished, plated dish to a delivery driver's insulated bag (the Nginx runtime stage). The customer receiving the delivery never sees the ovens, the raw ingredients, or the dirty dishes &mdash; they get exactly the finished plate, in a container built to carry food, not cook it.</p>
          </div>
        </div>
        <p>Docker's <strong>multi-stage build</strong> pattern is the production-grade way to containerize an Angular app. The idea: separate the build environment from the runtime environment into two distinct stages. The first stage uses a full Node.js image to install dependencies and compile TypeScript. The second stage uses a minimal web server image (Nginx Alpine, roughly 22MB) and copies only the compiled output from the first. The final image has no Node.js, no <code>node_modules</code>, no TypeScript &mdash; only static files and Nginx, keeping the image small and the attack surface minimal.</p>
        <h3>Nginx configuration for Angular</h3>
        <p>Angular is a Single Page Application. When a user navigates directly to <code>/products/123</code>, Nginx tries to find a file at that path, fails, and returns a 404. The fix is <code>try_files $uri $uri/ /index.html</code> in the location block &mdash; serve the requested file if it exists, or fall back to <code>index.html</code> and let Angular's router handle the URL. Without this, every deep link and page refresh returns 404.</p>
        <h3>Cache headers strategy</h3>
        <p>Angular's build output uses content-hashed filenames (<code>main.abc123.js</code>). Because the hash changes whenever the content changes, these files can be cached aggressively with a one-year max-age. Only <code>index.html</code> should be served with <code>no-cache</code> &mdash; it must always return fresh content so the browser picks up new hashed file references after a deployment.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Forgetting <code>try_files ... /index.html</code> is the single most common way an Angular Docker deploy "works" in local testing (where you always start from <code>/</code>) but breaks the moment a real user refreshes on a deep link or shares a direct URL, returning a bare 404 straight from Nginx before Angular's router ever gets a chance to run.</p>
          </div>
        </div>
      `,
      "code": "# ---- Dockerfile ----\n\n# Stage 1: Build\nFROM node:20-alpine AS builder\nWORKDIR /app\n\n# Copy package files first for layer caching\n# (npm install only re-runs if package.json changes)\nCOPY package.json package-lock.json ./\nRUN npm ci --prefer-offline\n\n# Copy source and build\nCOPY . .\nRUN npm run build -- --configuration production\n\n# Stage 2: Serve\nFROM nginx:1.25-alpine\n\n# Copy compiled app from build stage\nCOPY --from=builder /app/dist/my-app/browser /usr/share/nginx/html\n\n# Custom Nginx config with Angular routing support\nCOPY nginx.conf /etc/nginx/conf.d/default.conf\n\nEXPOSE 80\nCMD [\"nginx\", \"-g\", \"daemon off;\"]\n\n# ---- nginx.conf ----\nserver {\n  listen 80;\n  root /usr/share/nginx/html;\n  index index.html;\n\n  # Angular routing: serve index.html for all unknown paths\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n\n  # Aggressive caching for hashed assets (safe — filename changes with content)\n  location ~* \\.(js|css|woff2?|ttf|otf|eot|svg|png|jpg|jpeg|gif|ico|webp)$ {\n    expires 1y;\n    add_header Cache-Control \"public, immutable\";\n  }\n\n  # Never cache index.html — must always be fresh\n  location = /index.html {\n    add_header Cache-Control \"no-cache, no-store, must-revalidate\";\n  }\n\n  # Enable gzip compression\n  gzip on;\n  gzip_types text/plain text/css application/json application/javascript;\n  gzip_min_length 1000;\n}\n\n# ---- Build and run ----\n# docker build -t my-angular-app .\n# docker run -p 8080:80 my-angular-app",
      "language": "dockerfile",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Kitchen Stage vs Delivery Stage</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-amber-50 border-2 border-amber-200 rounded-xl p-3\"><p class=\"font-bold text-amber-700 text-center mb-2\">Stage 1: node:20-alpine</p><div class=\"space-y-1\"><div class=\"bg-white border border-amber-200 rounded px-2 py-1 text-center\">npm ci</div><div class=\"bg-white border border-amber-200 rounded px-2 py-1 text-center\">ng build --configuration production</div></div></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">Stage 2: nginx:alpine</p><div class=\"space-y-1\"><div class=\"bg-white border border-emerald-200 rounded px-2 py-1 text-center\">COPY --from=builder dist/</div><div class=\"bg-white border border-emerald-200 rounded px-2 py-1 text-center\">~22MB, no Node.js inside</div></div></div></div></div>"
    },
    {
      "id": "ci-cd-for-angular-apps",
      "title": "CI/CD pipeline with GitHub Actions",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A car <strong>assembly line's quality control station</strong> that every vehicle passes through before it's allowed to leave the factory. No car skips the station because the line is busy that day &mdash; if it fails inspection, it doesn't ship, full stop. GitHub Actions running lint, tests, and a production build on every push is that same non-negotiable checkpoint for code.</p>
          </div>
        </div>
        <p><strong>Continuous Integration</strong> means every code push triggers an automated build and test suite, catching problems immediately in the same environment that will eventually deploy the code. <strong>Continuous Deployment</strong> extends this by automatically deploying the verified build to the target environment without manual intervention.</p>
        <p>For Angular, a CI pipeline typically runs: <code>npm ci</code> (reproducible installs), <code>ng lint</code> (code quality), <code>ng test --watch=false</code> (unit tests with coverage), and <code>ng build --configuration production</code> (production build). Any failing step stops the pipeline and blocks deployment.</p>
        <h3>Environment-specific deployments</h3>
        <p>A mature CD setup deploys to different environments based on branch: pushes to <code>develop</code> go to staging, merges to <code>main</code> go to production. Each environment has its own build configuration with environment-specific API URLs and feature flags. GitHub Actions makes this straightforward with conditional steps and branch filters.</p>
        <h3>Build artifacts and caching</h3>
        <p>Uploading the compiled <code>dist/</code> folder as a build artifact lets the deploy job consume it directly without rebuilding. Caching <code>node_modules</code> via the <code>cache</code> key in <code>actions/setup-node</code> typically saves two to three minutes on every pipeline run.</p>
      `,
      "code": "# .github/workflows/ci-cd.yml\nname: Angular CI/CD\n\non:\n  push:\n    branches: [main, develop]\n  pull_request:\n    branches: [main]\n\njobs:\n  # ---- CI: Build and test ----\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n          cache: 'npm'  # Cache node_modules for faster runs\n\n      - name: Install dependencies\n        run: npm ci\n\n      - name: Lint\n        run: npx ng lint\n\n      - name: Unit tests\n        run: npx ng test --watch=false --browsers=ChromeHeadless --code-coverage\n\n      - name: Build (staging)\n        if: github.ref == 'refs/heads/develop'\n        run: npx ng build --configuration staging\n\n      - name: Build (production)\n        if: github.ref == 'refs/heads/main'\n        run: npx ng build --configuration production\n\n      - name: Upload build artifact\n        uses: actions/upload-artifact@v4\n        with:\n          name: dist\n          path: dist/\n          retention-days: 7\n\n  # ---- CD: Deploy to staging ----\n  deploy-staging:\n    needs: build\n    runs-on: ubuntu-latest\n    if: github.ref == 'refs/heads/develop'\n    environment: staging\n    steps:\n      - uses: actions/download-artifact@v4\n        with: { name: dist, path: dist/ }\n\n      - name: Deploy to Firebase staging\n        uses: FirebaseExtended/action-hosting-deploy@v0\n        with:\n          repoToken: ${{ secrets.GITHUB_TOKEN }}\n          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}\n          channelId: staging\n          projectId: my-app-staging\n\n  # ---- CD: Deploy to production ----\n  deploy-production:\n    needs: build\n    runs-on: ubuntu-latest\n    if: github.ref == 'refs/heads/main'\n    environment: production  # Requires manual approval in GitHub settings\n    steps:\n      - uses: actions/download-artifact@v4\n        with: { name: dist, path: dist/ }\n\n      - name: Deploy to production\n        uses: FirebaseExtended/action-hosting-deploy@v0\n        with:\n          repoToken: ${{ secrets.GITHUB_TOKEN }}\n          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_PROD }}\n          channelId: live\n          projectId: my-app-prod",
      "language": "yaml",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Branch-Driven Deployment</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-amber-700\">push to develop</p><p class=\"text-slate-300 my-1\">&darr;</p><p class=\"text-slate-500\">deploy-staging</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-emerald-700\">merge to main</p><p class=\"text-slate-300 my-1\">&darr;</p><p class=\"text-slate-500\">deploy-production (manual approval)</p></div></div></div>"
    },
    {
      "id": "environment-variables",
      "title": "Environment configuration and runtime config injection",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">The difference between <strong>printing a phone number directly on a brochure</strong> versus putting a <strong>removable sticker</strong> with the local branch's number over a blank spot. The printed number is baked in &mdash; change it and you reprint the whole run (a new build). The sticker can be swapped per city without touching the printing press at all (a runtime config file swapped per environment).</p>
          </div>
        </div>
        <p>Angular apps often need different configuration per environment: a dev API URL differs from production, feature flags may toggle differently, logging verbosity changes. Angular offers two distinct approaches, each with different trade-offs.</p>
        <h3>Build-time file replacement (angular.json)</h3>
        <p>The traditional approach uses <code>fileReplacements</code> in <code>angular.json</code>. During build, Angular swaps <code>src/environments/environment.ts</code> for <code>src/environments/environment.prod.ts</code> (or a staging variant). This is completely static &mdash; values are compiled into the JavaScript bundle. Simple and type-safe, but changing a value requires a new build.</p>
        <h3>Runtime configuration (modern approach)</h3>
        <p>For configuration that changes without a rebuild &mdash; feature flags, A/B test variants, environment-specific API gateway URLs &mdash; a <strong>runtime configuration</strong> approach works better. The app loads a JSON file (<code>assets/config.json</code>) at startup via an initializer, parses it, and exposes it through a typed injection token. The JSON is served fresh from the CDN without being bundled into JavaScript, so different environments can ship different <code>config.json</code> files with zero rebuild.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Both approaches put values into either the client-side bundle or a publicly accessible JSON file. <strong>Never</strong> put secret API keys, private tokens, or credentials in Angular environment files or runtime config &mdash; anyone can read them from the browser's network panel or view-source. Secrets belong on the server, accessed via authenticated API calls, not shipped to the browser under any circumstance.</p>
          </div>
        </div>
      `,
      "code": "// ---- Build-time file replacement ----\n// angular.json (relevant excerpt):\n// \"configurations\": {\n//   \"production\": {\n//     \"fileReplacements\": [\n//       { \"replace\": \"src/environments/environment.ts\",\n//         \"with\": \"src/environments/environment.prod.ts\" }\n//     ]\n//   }\n// }\n\n// src/environments/environment.ts\nexport const environment = {\n  production: false,\n  apiUrl: 'http://localhost:3000/api',\n  featureFlags: { darkMode: true, betaFeatures: false }\n};\n\n// src/environments/environment.prod.ts\nexport const environment = {\n  production: true,\n  apiUrl: 'https://api.myapp.com',\n  featureFlags: { darkMode: true, betaFeatures: false }\n};\n\n// ---- Runtime configuration (no rebuild needed) ----\n// src/assets/config.json (different per environment, swapped at deploy time):\n// { \"apiUrl\": \"https://api.myapp.com\", \"analyticsKey\": \"UA-XXXXX\" }\n// NEVER put secret keys or tokens here — this file is publicly readable.\n\n// config.service.ts\nimport { Injectable } from '@angular/core';\nimport { HttpClient } from '@angular/common/http';\nimport { firstValueFrom } from 'rxjs';\n\nexport interface AppConfig { apiUrl: string; analyticsKey: string; }\n\n@Injectable({ providedIn: 'root' })\nexport class ConfigService {\n  private config?: AppConfig;\n\n  constructor(private http: HttpClient) {}\n\n  async load(): Promise<void> {\n    this.config = await firstValueFrom(\n      this.http.get<AppConfig>('/assets/config.json')\n    );\n  }\n\n  get<K extends keyof AppConfig>(key: K): AppConfig[K] {\n    if (!this.config) throw new Error('Config not loaded');\n    return this.config[key];\n  }\n}\n\n// main.ts — load config before bootstrapping\nimport { bootstrapApplication } from '@angular/platform-browser';\nimport { provideHttpClient } from '@angular/common/http';\nimport { APP_INITIALIZER } from '@angular/core';\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    provideHttpClient(),\n    {\n      provide: APP_INITIALIZER,\n      useFactory: (config: ConfigService) => () => config.load(),\n      deps: [ConfigService],\n      multi: true\n    }\n  ]\n});",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Printed Label vs Removable Sticker</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-slate-50 border-2 border-slate-300 rounded-xl p-3 text-center\"><p class=\"font-bold text-slate-700\">Build-time (fileReplacements)</p><p class=\"text-slate-500 mt-1\">baked into the JS bundle</p><p class=\"text-slate-400 mt-1\">change = new build</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-emerald-700\">Runtime (config.json)</p><p class=\"text-slate-500 mt-1\">fetched fresh on startup</p><p class=\"text-emerald-600 mt-1\">change = swap a file, no rebuild</p></div></div></div>"
    },
    {
      "id": "base-href-and-subpath-deployment",
      "title": "Base href, subpath deployment, and APP_BASE_HREF",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A building's <strong>"you are here" directory sign</strong>. If the building moves its main entrance to a different floor but nobody updates the sign, every direction printed on it &mdash; "elevators this way," "restrooms that way" &mdash; is now wrong, even though the rooms themselves didn't move. <code>&lt;base href&gt;</code> is that sign: it tells Angular where the app's own front door is, so every relative asset and lazy-loaded chunk resolves correctly from there.</p>
          </div>
        </div>
        <p>When an Angular app is served from a subpath rather than the domain root &mdash; <code>https://company.com/team-a/my-app/</code> instead of <code>https://company.com/</code> &mdash; the browser's base URL resolution for lazy-loaded chunks, assets, and links breaks if you deploy with the default <code>&lt;base href="/"&gt;</code>. The fix is setting <code>base href</code> to match the deployment subpath.</p>
        <h3>Setting base href at build time</h3>
        <p>The <code>--base-href</code> flag on <code>ng build</code> rewrites the <code>&lt;base href&gt;</code> tag in <code>index.html</code>. When Angular bootstraps, it reads this tag to know the root URL for resolving asset paths and lazy-loaded route chunks. You can also set it permanently in the <code>angular.json</code> build configuration.</p>
        <h3>APP_BASE_HREF for Server-Side Rendering</h3>
        <p>In SSR apps, there's no <code>index.html</code> to read the <code>&lt;base href&gt;</code> tag from during the server render. Provide <code>APP_BASE_HREF</code> as an injection token in your server bootstrap so the router knows the base URL server-side too.</p>
        <h3>Hash-based routing alternative</h3>
        <p>If you can't configure the server to redirect all paths to <code>index.html</code> (plain Amazon S3 without CloudFront, for example), switch to hash-based routing: <code>provideRouter(routes, withHashLocation())</code>. URLs become <code>https://company.com/#/products/123</code>. The hash fragment never reaches the server, so S3 always serves <code>index.html</code> and Angular handles the URL &mdash; at the cost of uglier URLs and incompatibility with SSR.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Deploying under a subpath without updating <code>--base-href</code> doesn't fail loudly &mdash; the initial page often still loads, because <code>index.html</code> itself was found. What breaks silently is every lazy-loaded chunk and relative asset, since they resolve against the wrong root. You end up debugging mysterious 404s in the network tab for JS chunks instead of an obvious startup error.</p>
          </div>
        </div>
      `,
      "code": "# ---- Build with custom base href ----\nng build --configuration production --base-href /my-app/\n# index.html will contain: <base href=\"/my-app/\">\n\n# ---- Set base-href in angular.json (permanent) ----\n# \"configurations\": {\n#   \"production\": {\n#     \"baseHref\": \"/my-app/\"\n#   }\n# }\n\n# ---- Hash routing (when server redirect is impossible) ----\n# app.config.ts\nimport { ApplicationConfig } from '@angular/core';\nimport { provideRouter, withHashLocation } from '@angular/router';\nimport { routes } from './app.routes';\n\nexport const appConfig: ApplicationConfig = {\n  providers: [\n    // URLs become: /#/products/123 instead of /products/123\n    provideRouter(routes, withHashLocation())\n  ]\n};\n\n// ---- APP_BASE_HREF for SSR ----\n// server.ts (Express SSR)\nimport { APP_BASE_HREF } from '@angular/common';\n\nserver.get('*', (req, res, next) => {\n  const { protocol, originalUrl, baseUrl, headers } = req;\n\n  commonEngine\n    .render({\n      bootstrap: AppServerModule,\n      documentFilePath: indexHtml,\n      url: `${protocol}://${headers.host}${originalUrl}`,\n      publicPath: distFolder,\n      providers: [\n        { provide: APP_BASE_HREF, useValue: baseUrl }\n      ]\n    })\n    .then(html => res.send(html))\n    .catch(next);\n});",
      "language": "bash",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Base Href Points the Way</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-rose-50 border-2 border-rose-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-rose-700\">base href=\"/\" (wrong)</p><p class=\"text-slate-500 mt-1\">deployed at /team-a/my-app/</p><p class=\"text-rose-600 mt-1\">chunks resolve to wrong root &rarr; 404</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-emerald-700\">base href=\"/team-a/my-app/\" (correct)</p><p class=\"text-slate-500 mt-1\">matches deployment subpath</p><p class=\"text-emerald-600 mt-1\">chunks resolve correctly</p></div></div></div>"
    }
  ]
});
