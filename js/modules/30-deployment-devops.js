window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "deployment-devops",
  "title": "Deployment & DevOps",
  "icon": "bi bi-cloud-upload",
  "questions": [
    {
      "id": "deployment-strategies",
      "title": "Angular deployment strategies — choosing the right approach",
      "explanation": `
          <p>An Angular production build (<code>ng build</code>) produces a folder of static files: one <code>index.html</code>, several hashed JavaScript chunks, CSS, and assets. Because Angular is a Single Page Application, these static files can be served from virtually any infrastructure — from a simple S3 bucket to a containerized Nginx instance. The choice of deployment target depends on your performance requirements, infrastructure constraints, and whether you need SSR.</p>

          <h3>Static Hosting (Recommended for Most SPAs)</h3>
          <p>Services like <strong>Netlify</strong>, <strong>Vercel</strong>, <strong>GitHub Pages</strong>, <strong>Firebase Hosting</strong>, and <strong>AWS S3 + CloudFront</strong> serve static files from globally distributed CDN nodes. Deploying is typically one command. These platforms handle HTTPS, HTTP/2, cache headers, compression, and global distribution automatically. Firebase Hosting and Netlify also handle the Angular router's HTML5 URL requirement — they redirect all 404s to <code>index.html</code> with a single configuration line.</p>

          <h3>Nginx or Node.js Server</h3>
          <p>When you need more control — custom headers, API proxying, rate limiting, or Server-Side Rendering — you serve the Angular app from a web server you manage. Nginx is the most common choice for pure static serving; an Express.js server is used when you need SSR or server-side API routes alongside the Angular app.</p>

          <h3>Containerization with Docker</h3>
          <p>Docker eliminates environment inconsistency. A multi-stage Dockerfile builds the Angular app in a Node image, then copies the compiled <code>dist/</code> output into a minimal Nginx image. The resulting container is portable across any Docker-compatible infrastructure: Kubernetes, AWS ECS, Google Cloud Run, or a single VPS.</p>
        `,
      "code": "# ---- Build for production ----\nng build --configuration production\n# Output: dist/my-app/ with hashed filenames for cache-busting\n# ├── index.html\n# ├── main.abc123.js\n# ├── styles.xyz789.css\n# └── assets/\n\n# ---- Firebase Hosting (one command deploy) ----\nnpm install -g firebase-tools\nfirebase login\nfirebase init hosting\n# -> public directory: dist/my-app/browser\n# -> rewrite all URLs to index.html: yes (handles Angular routing)\nfirebase deploy --only hosting\n\n# ---- Netlify (drag-drop or CLI) ----\nnpm install -g netlify-cli\nnetlify deploy --prod --dir=dist/my-app/browser\n# Or: add _redirects file to src/ with:  /* /index.html 200\n\n# ---- GitHub Pages ----\nng add angular-cli-ghpages\nng deploy --base-href=/repository-name/\n# Or build manually:\nng build --configuration production --base-href /repository-name/\nnpx angular-cli-ghpages --dir=dist/my-app/browser",
      "language": "bash"
    },
    {
      "id": "docker-with-angular",
      "title": "Docker multi-stage build for Angular",
      "explanation": `
          <p>Docker's <strong>multi-stage build</strong> pattern is the production-grade way to containerize an Angular application. The idea is to separate the build environment from the runtime environment into two distinct Docker stages. The first stage uses a full Node.js image to install dependencies and compile TypeScript. The second stage uses a minimal web server image (Nginx Alpine — roughly 22MB) and copies only the compiled output from the first stage. The final image contains no Node.js, no <code>node_modules</code>, no TypeScript — only static files and Nginx, keeping the image small and the attack surface minimal.</p>

          <h3>Nginx Configuration for Angular</h3>
          <p>Angular is a Single Page Application. When a user navigates directly to <code>/products/123</code>, Nginx tries to find a file at that path, fails, and returns a 404. The fix is <code>try_files $uri $uri/ /index.html</code> in the Nginx location block — this tells Nginx to serve the requested file if it exists, or fall back to <code>index.html</code> and let Angular's router handle the URL. Without this, all deep links and page refreshes return 404.</p>

          <h3>Cache Headers Strategy</h3>
          <p>Angular's build output uses content-hashed filenames (<code>main.abc123.js</code>). Because the hash changes whenever the content changes, these files can be cached aggressively with a one-year max-age. Only <code>index.html</code> should be served with <code>no-cache</code> — it must always return fresh content so the browser picks up new hashed file references after a deployment.</p>
        `,
      "code": "# ---- Dockerfile ----\n\n# Stage 1: Build\nFROM node:20-alpine AS builder\nWORKDIR /app\n\n# Copy package files first for layer caching\n# (npm install only re-runs if package.json changes)\nCOPY package.json package-lock.json ./\nRUN npm ci --prefer-offline\n\n# Copy source and build\nCOPY . .\nRUN npm run build -- --configuration production\n\n# Stage 2: Serve\nFROM nginx:1.25-alpine\n\n# Copy compiled app from build stage\nCOPY --from=builder /app/dist/my-app/browser /usr/share/nginx/html\n\n# Custom Nginx config with Angular routing support\nCOPY nginx.conf /etc/nginx/conf.d/default.conf\n\nEXPOSE 80\nCMD [\"nginx\", \"-g\", \"daemon off;\"]\n\n# ---- nginx.conf ----\nserver {\n  listen 80;\n  root /usr/share/nginx/html;\n  index index.html;\n\n  # Angular routing: serve index.html for all unknown paths\n  location / {\n    try_files $uri $uri/ /index.html;\n  }\n\n  # Aggressive caching for hashed assets (safe — filename changes with content)\n  location ~* \\.(js|css|woff2?|ttf|otf|eot|svg|png|jpg|jpeg|gif|ico|webp)$ {\n    expires 1y;\n    add_header Cache-Control \"public, immutable\";\n  }\n\n  # Never cache index.html — must always be fresh\n  location = /index.html {\n    add_header Cache-Control \"no-cache, no-store, must-revalidate\";\n  }\n\n  # Enable gzip compression\n  gzip on;\n  gzip_types text/plain text/css application/json application/javascript;\n  gzip_min_length 1000;\n}\n\n# ---- Build and run ----\n# docker build -t my-angular-app .\n# docker run -p 8080:80 my-angular-app",
      "language": "dockerfile"
    },
    {
      "id": "ci-cd-for-angular-apps",
      "title": "CI/CD pipeline with GitHub Actions",
      "explanation": `
          <p><strong>Continuous Integration</strong> means that every code push triggers an automated build and test suite. Problems are caught immediately — before they reach production — by the same environment that will eventually deploy the code. <strong>Continuous Deployment</strong> extends this by automatically deploying the verified build to the target environment without manual intervention.</p>

          <p>For Angular, a CI pipeline typically runs: <code>npm ci</code> (reproducible installs), <code>ng lint</code> (code quality), <code>ng test --watch=false</code> (unit tests with coverage), and <code>ng build --configuration production</code> (production build). If any step fails, the pipeline stops and the deployment does not proceed.</p>

          <h3>Environment-Specific Deployments</h3>
          <p>A mature CD setup deploys to different environments based on the branch: pushes to <code>develop</code> deploy to staging, merges to <code>main</code> deploy to production. Each environment has its own Angular build configuration with environment-specific API URLs and feature flags. GitHub Actions makes this straightforward with conditional steps and branch filters.</p>

          <h3>Build Artifacts and Caching</h3>
          <p>Uploading the compiled <code>dist/</code> folder as a build artifact lets the deploy job consume it directly without rebuilding. Caching <code>node_modules</code> via the <code>cache</code> key in <code>actions/setup-node</code> typically saves 2-3 minutes on every pipeline run.</p>
        `,
      "code": "# .github/workflows/ci-cd.yml\nname: Angular CI/CD\n\non:\n  push:\n    branches: [main, develop]\n  pull_request:\n    branches: [main]\n\njobs:\n  # ---- CI: Build and test ----\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '20'\n          cache: 'npm'  # Cache node_modules for faster runs\n\n      - name: Install dependencies\n        run: npm ci\n\n      - name: Lint\n        run: npx ng lint\n\n      - name: Unit tests\n        run: npx ng test --watch=false --browsers=ChromeHeadless --code-coverage\n\n      - name: Build (staging)\n        if: github.ref == 'refs/heads/develop'\n        run: npx ng build --configuration staging\n\n      - name: Build (production)\n        if: github.ref == 'refs/heads/main'\n        run: npx ng build --configuration production\n\n      - name: Upload build artifact\n        uses: actions/upload-artifact@v4\n        with:\n          name: dist\n          path: dist/\n          retention-days: 7\n\n  # ---- CD: Deploy to staging ----\n  deploy-staging:\n    needs: build\n    runs-on: ubuntu-latest\n    if: github.ref == 'refs/heads/develop'\n    environment: staging\n    steps:\n      - uses: actions/download-artifact@v4\n        with: { name: dist, path: dist/ }\n\n      - name: Deploy to Firebase staging\n        uses: FirebaseExtended/action-hosting-deploy@v0\n        with:\n          repoToken: ${{ secrets.GITHUB_TOKEN }}\n          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}\n          channelId: staging\n          projectId: my-app-staging\n\n  # ---- CD: Deploy to production ----\n  deploy-production:\n    needs: build\n    runs-on: ubuntu-latest\n    if: github.ref == 'refs/heads/main'\n    environment: production  # Requires manual approval in GitHub settings\n    steps:\n      - uses: actions/download-artifact@v4\n        with: { name: dist, path: dist/ }\n\n      - name: Deploy to production\n        uses: FirebaseExtended/action-hosting-deploy@v0\n        with:\n          repoToken: ${{ secrets.GITHUB_TOKEN }}\n          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_PROD }}\n          channelId: live\n          projectId: my-app-prod",
      "language": "yaml"
    },
    {
      "id": "environment-variables",
      "title": "Environment configuration and runtime config injection",
      "explanation": `
          <p>Angular applications often need different configuration values depending on where they run: a development API URL differs from production, feature flags may be toggled differently per environment, and logging verbosity changes. Angular provides two distinct approaches to this problem, each with different trade-offs.</p>

          <h3>Build-Time File Replacement (angular.json)</h3>
          <p>The traditional approach uses the <code>fileReplacements</code> configuration in <code>angular.json</code>. During build, Angular replaces <code>src/environments/environment.ts</code> with <code>src/environments/environment.prod.ts</code> (or a staging variant). This is completely static — the values are compiled into the JavaScript bundle. It is simple and type-safe, but changing a value requires a new build.</p>

          <h3>Runtime Configuration (Modern Approach)</h3>
          <p>For configuration that changes without a rebuild — feature flags, A/B test variants, API gateway URLs that are environment-specific at the infrastructure level — a <strong>runtime configuration</strong> approach is better. The app loads a JSON file (<code>assets/config.json</code>) at startup via <code>APP_INITIALIZER</code>, parses it, and makes it available through a typed injection token. The JSON file is served fresh from the CDN without being bundled into JavaScript, so different environments can have different <code>config.json</code> files without rebuilding the app at all.</p>

          <h3>Never Embed Secrets in the Bundle</h3>
          <p>Both approaches put values into the client-side bundle or into a publicly accessible JSON file. <em>Never</em> put secret API keys, private tokens, or credentials in Angular environment files or runtime config — anyone can read them from the browser's network panel. Secrets belong on the server and should be accessed via authenticated API calls.</p>
        `,
      "code": "// ---- Build-time file replacement ----\n// angular.json (relevant excerpt):\n// \"configurations\": {\n//   \"production\": {\n//     \"fileReplacements\": [\n//       { \"replace\": \"src/environments/environment.ts\",\n//         \"with\": \"src/environments/environment.prod.ts\" }\n//     ]\n//   }\n// }\n\n// src/environments/environment.ts\nexport const environment = {\n  production: false,\n  apiUrl: 'http://localhost:3000/api',\n  featureFlags: { darkMode: true, betaFeatures: false }\n};\n\n// src/environments/environment.prod.ts\nexport const environment = {\n  production: true,\n  apiUrl: 'https://api.myapp.com',\n  featureFlags: { darkMode: true, betaFeatures: false }\n};\n\n// ---- Runtime configuration (no rebuild needed) ----\n// src/assets/config.json (different per environment, swapped at deploy time):\n// { \"apiUrl\": \"https://api.myapp.com\", \"analyticsKey\": \"UA-XXXXX\" }\n\n// config.service.ts\nimport { Injectable } from '@angular/core';\nimport { HttpClient } from '@angular/common/http';\nimport { firstValueFrom } from 'rxjs';\n\nexport interface AppConfig { apiUrl: string; analyticsKey: string; }\n\n@Injectable({ providedIn: 'root' })\nexport class ConfigService {\n  private config?: AppConfig;\n\n  constructor(private http: HttpClient) {}\n\n  async load(): Promise<void> {\n    this.config = await firstValueFrom(\n      this.http.get<AppConfig>('/assets/config.json')\n    );\n  }\n\n  get<K extends keyof AppConfig>(key: K): AppConfig[K] {\n    if (!this.config) throw new Error('Config not loaded');\n    return this.config[key];\n  }\n}\n\n// main.ts — load config before bootstrapping\nimport { bootstrapApplication } from '@angular/platform-browser';\nimport { provideHttpClient } from '@angular/common/http';\nimport { APP_INITIALIZER } from '@angular/core';\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    provideHttpClient(),\n    {\n      provide: APP_INITIALIZER,\n      useFactory: (config: ConfigService) => () => config.load(),\n      deps: [ConfigService],\n      multi: true\n    }\n  ]\n});",
      "language": "typescript"
    },
    {
      "id": "base-href-and-subpath-deployment",
      "title": "Base href, subpath deployment, and APP_BASE_HREF",
      "explanation": `
          <p>When an Angular application is served from a subpath rather than the domain root — for example, <code>https://company.com/team-a/my-app/</code> instead of <code>https://company.com/</code> — the browser's base URL resolution for lazy-loaded chunks, assets, and links breaks if you deploy with the default <code>&lt;base href="/"&gt;</code>. The fix is setting <code>base href</code> to match the deployment subpath.</p>

          <h3>Setting Base Href at Build Time</h3>
          <p>The <code>--base-href</code> flag on <code>ng build</code> rewrites the <code>&lt;base href&gt;</code> tag in <code>index.html</code>. When Angular bootstraps, it reads this tag to know the root URL for resolving asset paths and lazy-loaded route chunks. You can also set it permanently in the <code>angular.json</code> build configuration so you don't need to remember the flag every time.</p>

          <h3>APP_BASE_HREF for Server-Side Rendering</h3>
          <p>In SSR applications, there is no <code>index.html</code> to read the <code>&lt;base href&gt;</code> tag from during the server render. Instead, provide <code>APP_BASE_HREF</code> as an injection token in your server bootstrap so Angular's router knows the base URL on the server side.</p>

          <h3>Hash-based Routing Alternative</h3>
          <p>If you are deploying to an environment where you cannot configure the server to redirect all paths to <code>index.html</code> (for example, plain Amazon S3 without CloudFront), switch to hash-based routing: <code>provideRouter(routes, withHashLocation())</code>. The app URL becomes <code>https://company.com/#/products/123</code>. The hash fragment is never sent to the server, so S3 always serves <code>index.html</code> and Angular handles the URL. The trade-off is uglier URLs and incompatibility with server-side rendering.</p>
        `,
      "code": "# ---- Build with custom base href ----\nng build --configuration production --base-href /my-app/\n# index.html will contain: <base href=\"/my-app/\">\n\n# ---- Set base-href in angular.json (permanent) ----\n# \"configurations\": {\n#   \"production\": {\n#     \"baseHref\": \"/my-app/\"\n#   }\n# }\n\n# ---- Hash routing (when server redirect is impossible) ----\n# app.config.ts\nimport { ApplicationConfig } from '@angular/core';\nimport { provideRouter, withHashLocation } from '@angular/router';\nimport { routes } from './app.routes';\n\nexport const appConfig: ApplicationConfig = {\n  providers: [\n    // URLs become: /#/products/123 instead of /products/123\n    provideRouter(routes, withHashLocation())\n  ]\n};\n\n// ---- APP_BASE_HREF for SSR ----\n// server.ts (Express SSR)\nimport { APP_BASE_HREF } from '@angular/common';\n\nserver.get('*', (req, res, next) => {\n  const { protocol, originalUrl, baseUrl, headers } = req;\n\n  commonEngine\n    .render({\n      bootstrap: AppServerModule,\n      documentFilePath: indexHtml,\n      url: `${protocol}://${headers.host}${originalUrl}`,\n      publicPath: distFolder,\n      providers: [\n        { provide: APP_BASE_HREF, useValue: baseUrl }\n      ]\n    })\n    .then(html => res.send(html))\n    .catch(next);\n});",
      "language": "bash"
    }
  ]
});
