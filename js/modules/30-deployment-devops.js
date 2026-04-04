window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "deployment-devops",
  "title": "Deployment & DevOps",
  "icon": "bi bi-cloud-upload",
  "questions": [
    {
      "id": "deployment-strategies",
      "title": "Deployment strategies",
      "explanation": `
          <p>Deploying an Angular application involves serving the compiled static assets (HTML, CSS, JS) to a web server. Common strategies include:</p>
          <ul>
            <li><strong>Static Hosting:</strong> Deploying to services like Netlify, Vercel, GitHub Pages, or AWS S3. Simple and cost-effective for SPAs.</li>
            <li><strong>Node.js Server:</strong> Serving the Angular app from a Node.js server (e.g., Express) which can also handle API routes or SSR.</li>
            <li><strong>Containerization (Docker):</strong> Packaging the app and its dependencies into a Docker image for consistent deployment across environments.</li>
            <li><strong>CDN (Content Delivery Network):</strong> Distributing static assets globally for faster load times for users worldwide.</li>
          </ul>
        `,
      "code": "// Example: Deploying to a static web server (Nginx)\n// server {\n//   listen 80;\n//   server_name yourdomain.com;\n//   root /usr/share/nginx/html; // Path to your 'dist' folder\n//   index index.html;\n//   location / {\n//     try_files $uri $uri/ /index.html;\n//   }\n// }",
      "language": "nginx",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Deployment Options</p><div class="grid grid-cols-2 gap-4"><div class="bg-indigo-50 border border-indigo-200 p-2 rounded text-center text-[10px] font-bold">Static Host</div><div class="bg-emerald-50 border border-emerald-200 p-2 rounded text-center text-[10px] font-bold">Node.js Server</div><div class="bg-amber-50 border border-amber-200 p-2 rounded text-center text-[10px] font-bold">Docker Container</div><div class="bg-rose-50 border border-rose-200 p-2 rounded text-center text-[10px] font-bold">CDN</div></div></div>`
    },
    {
      "id": "environment-variables",
      "title": "Environment variables",
      "explanation": `
          <p>Angular uses <strong>environment files</strong> (<code>environment.ts</code>, <code>environment.prod.ts</code>, etc.) to manage configuration settings that vary between different deployment environments (development, staging, production).</p>
          <p>During the build process, the Angular CLI replaces the default <code>environment.ts</code> with the appropriate environment-specific file based on the <code>--configuration</code> flag.</p>
          <p>For sensitive data (like API keys), it's best practice to inject them at runtime (e.g., via server-side environment variables or a build process that replaces placeholders) rather than embedding them directly in the client-side bundle.</p>
        `,
      "code": "// src/environments/environment.prod.ts\nexport const environment = {\n  production: true,\n  apiUrl: 'https://api.yourdomain.com/prod',\n  // sensitive data should ideally not be here\n};\n\n// Usage in component/service:\nimport { environment } from '../environments/environment';\n\nthis.http.get(environment.apiUrl + '/data');",
      "language": "typescript"
    },
    {
      "id": "docker-with-angular",
      "title": "Docker with Angular",
      "explanation": `
          <p><strong>Docker</strong> allows you to package your Angular application and its runtime environment into a portable container. This ensures consistency across development, testing, and production environments.</p>
          <p>A typical setup involves a multi-stage Dockerfile: one stage to build the Angular application (using Node.js) and another, smaller stage to serve the static assets (e.g., using Nginx or Caddy).</p>
        `,
      "code": "# Dockerfile (Multi-stage build)\n\n# Stage 1: Build the Angular app\nFROM node:20-alpine as builder\nWORKDIR /app\nCOPY package.json package-lock.json ./ \nRUN npm install\nCOPY . .\nRUN npm run build -- --configuration production\n\n# Stage 2: Serve the app with Nginx\nFROM nginx:alpine\nCOPY --from=builder /app/dist/your-app-name /usr/share/nginx/html\nEXPOSE 80\nCMD [\"nginx\", \"-g\", \"daemon off;\"]",
      "language": "dockerfile",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Docker Multi-Stage Build</p><div class="flex items-center justify-between max-w-md mx-auto"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-indigo-700">Node.js (Build)</p></div><div class="text-slate-300">&rarr;</div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-emerald-700">Nginx (Serve)</p></div></div></div>`
    },
    {
      "id": "ci-cd-for-angular-apps",
      "title": "CI/CD for Angular apps",
      "explanation": `
          <p><strong>CI/CD (Continuous Integration/Continuous Deployment)</strong> automates the process of building, testing, and deploying your Angular application.</p>
          <ul>
            <li><strong>Continuous Integration (CI):</strong> Developers frequently merge code changes into a central repository. Automated builds and tests run to detect integration issues early.</li>
            <li><strong>Continuous Deployment (CD):</strong> After successful CI, changes are automatically deployed to production (or a staging environment).</li>
          </ul>
          <p>Popular CI/CD tools include GitHub Actions, GitLab CI, Jenkins, CircleCI, and Azure DevOps.</p>
        `,
      "code": "# .github/workflows/main.yml (GitHub Actions example)\nname: Angular CI/CD\non:\n  push:\n    branches: [ main ]\njobs:\n  build-and-deploy:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v3\n    - uses: actions/setup-node@v3\n      with:\n        node-version: 20\n    - run: npm ci\n    - run: npm run build -- --configuration production\n    - uses: peaceiris/actions-gh-pages@v3\n      with:\n        github_token: ${{ secrets.GITHUB_TOKEN }}\n        publish_dir: ./dist/your-app-name",
      "language": "yaml",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">CI/CD Pipeline</p><div class="flex items-center justify-between max-w-md mx-auto"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-indigo-700">Code Commit</p></div><div class="text-slate-300">&rarr;</div><div class="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-amber-700">Build & Test (CI)</p></div><div class="text-slate-300">&rarr;</div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-emerald-700">Deploy (CD)</p></div></div></div>`
    },
    {
      "id": "base-href-configuration",
      "title": "Base href configuration",
      "explanation": `
          <p>The <code>&lt;base href="/"&gt;</code> tag in your <code>index.html</code> specifies the base URL for all relative URLs in your application. It's crucial for routing to work correctly when your application is deployed to a subpath.</p>
          <p>If your Angular app is served from a subfolder (e.g., <code>https://yourdomain.com/my-app/</code>), you must configure <code>base href</code> accordingly (e.g., <code>&lt;base href="/my-app/"&gt;</code>).</p>
          <p>You can set this during the build process using the <code>--base-href</code> CLI flag.</p>
        `,
      "code": "<!-- index.html -->\n<head>\n  <base href=\"/\">\n  ...\n</head>\n\n// Build command for subpath deployment:\n// ng build --configuration production --base-href /my-app/",
      "language": "html"
    }
  ]
});