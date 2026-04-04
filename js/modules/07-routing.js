window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "routing",
  "title": "Routing",
  "icon": "bi bi-signpost-split",
  "questions": [
    {
      "id": "what-is-angular-router",
      "title": "What is Angular Router?",
      "explanation": "\n          <p><strong>Angular Router</strong> is the official Angular module used for navigation between views in a Single Page Application.</p>\n\n          <p>Instead of reloading the entire page, Angular Router updates the visible component based on the URL. This gives Angular applications fast client-side navigation.</p>\n\n          <h3>Why It Is Used</h3>\n          <ul>\n            <li>To move between pages/views without full page reload</li>\n            <li>To map URLs to components</li>\n            <li>To support route parameters, guards, lazy loading, and nested routes</li>\n          </ul>\n        ",
      "code": "import { RouterModule, Routes } from '@angular/router';\n\nconst routes: Routes = [\n  { path: '', component: HomeComponent },\n  { path: 'about', component: AboutComponent }\n];\n\n@NgModule({\n  imports: [RouterModule.forRoot(routes)],\n  exports: [RouterModule]\n})\nexport class AppRoutingModule { }",
      "language": "typescript",
      "diagram": "\n<div class=\"diagram-wrap\">\n  <p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Angular Router</p>\n  <div class=\"flex items-center justify-center gap-4\">\n    <div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 text-center\">\n      <p class=\"font-bold text-indigo-700\">URL</p>\n      <p class=\"text-xs text-slate-500 mt-2\">/about</p>\n    </div>\n    <div class=\"text-slate-300\">&rarr;</div>\n    <div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 text-center\">\n      <p class=\"font-bold text-emerald-700\">Router</p>\n      <p class=\"text-xs text-slate-500 mt-2\">matches route</p>\n    </div>\n    <div class=\"text-slate-300\">&rarr;</div>\n    <div class=\"bg-amber-50 border-2 border-amber-200 rounded-xl p-4 text-center\">\n      <p class=\"font-bold text-amber-700\">Component</p>\n      <p class=\"text-xs text-slate-500 mt-2\">AboutComponent</p>\n    </div>\n  </div>\n</div>"
    },
    {
      "id": "how-to-configure-routes",
      "title": "How to configure routes?",
      "explanation": "\n          <p>In Angular, routes are configured by creating a <code>Routes</code> array and registering it with <code>RouterModule</code>.</p>\n\n          <p>Each route object usually contains a <code>path</code> and the <code>component</code> to load for that path.</p>\n\n          <h3>Basic Steps</h3>\n          <ul>\n            <li>Create components for the pages</li>\n            <li>Define route objects in a <code>Routes</code> array</li>\n            <li>Import them using <code>RouterModule.forRoot(routes)</code></li>\n            <li>Place <code>&lt;router-outlet&gt;&lt;/router-outlet&gt;</code> in a template</li>\n          </ul>\n        ",
      "code": "import { Routes, RouterModule } from '@angular/router';\n\nconst routes: Routes = [\n  { path: '', component: HomeComponent },\n  { path: 'products', component: ProductsComponent },\n  { path: 'contact', component: ContactComponent }\n];\n\n@NgModule({\n  imports: [RouterModule.forRoot(routes)],\n  exports: [RouterModule]\n})\nexport class AppRoutingModule { }",
      "language": "typescript",
      "diagram": "\n<div class=\"diagram-wrap\">\n  <p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Route Configuration</p>\n  <div class=\"space-y-3 max-w-lg mx-auto\">\n    <div class=\"bg-white border border-slate-200 rounded-xl p-3 text-center\">1. Create routes array</div>\n    <div class=\"text-slate-300 text-center\">&darr;</div>\n    <div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center\">2. forRoot(routes)</div>\n    <div class=\"text-slate-300 text-center\">&darr;</div>\n    <div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center\">3. Render with router-outlet</div>\n  </div>\n</div>"
    },
    {
      "id": "what-are-route-parameters",
      "title": "What are route parameters?",
      "explanation": "\n          <p><strong>Route parameters</strong> are dynamic values included directly in the route path. They are used to identify a specific resource, such as a user ID or product ID.</p>\n\n          <p>In Angular, route parameters are defined using a colon syntax like <code>:id</code>.</p>\n        ",
      "code": "const routes: Routes = [\n  { path: 'products/:id', component: ProductDetailsComponent }\n];\n\nexport class ProductDetailsComponent implements OnInit {\n  productId = '';\n  constructor(private route: ActivatedRoute) {}\n\n  ngOnInit(): void {\n    this.productId = this.route.snapshot.paramMap.get('id') || '';\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Route Parameters</p><div class=\"grid grid-cols-1 md:grid-cols-3 gap-3\"><div class=\"bg-white border border-slate-200 rounded-xl p-4 text-center\"><p class=\"font-mono text-slate-700\">products/:id</p></div><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 text-center\"><p class=\"font-mono text-indigo-700\">/products/101</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 text-center\"><p class=\"font-mono text-emerald-700\">id = 101</p></div></div></div>"
    },
    {
      "id": "what-are-query-parameters",
      "title": "What are query parameters?",
      "explanation": "\n          <p><strong>Query parameters</strong> are optional key-value pairs added after a question mark in the URL.</p>\n\n          <p>They are commonly used for filtering, sorting, pagination, or search values.</p>\n        ",
      "code": "export class ProductsComponent implements OnInit {\n  category = '';\n  constructor(private route: ActivatedRoute) {}\n\n  ngOnInit(): void {\n    this.category = this.route.snapshot.queryParamMap.get('category') || '';\n  }\n}\n\n// this.router.navigate(['/products'], { queryParams: { category: 'mobile', page: 2 } });",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Query Parameters</p><div class=\"max-w-lg mx-auto bg-white border border-slate-200 rounded-xl p-4 text-center\"><p class=\"font-mono text-slate-700\">/products?category=mobile&page=2</p><p class=\"text-xs text-slate-500 mt-2\">Optional URL data for filters and search</p></div></div>"
    },
    {
      "id": "what-is-child-routing",
      "title": "What is child routing?",
      "explanation": "\n          <p><strong>Child routing</strong> in Angular means defining nested routes inside a parent route.</p>\n\n          <p>This is useful when a parent page has multiple sub-pages, such as an admin panel with dashboard, users, and settings sections.</p>\n        ",
      "code": "const routes: Routes = [\n  {\n    path: 'admin',\n    component: AdminComponent,\n    children: [\n      { path: 'users', component: AdminUsersComponent },\n      { path: 'settings', component: AdminSettingsComponent }\n    ]\n  }\n];\n\n// admin.component.html\n// <router-outlet></router-outlet>",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Child Routing</p><div class=\"flex flex-col items-center gap-3 max-w-md mx-auto\"><div class=\"w-full bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-indigo-700\">/admin</p></div><div class=\"text-slate-300\">&darr;</div><div class=\"w-full bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-emerald-700\">AdminComponent</p></div><div class=\"text-slate-300\">&darr;</div><div class=\"w-full bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-amber-700\">Nested router-outlet</p></div></div></div>"
    },
    {
      "id": "what-is-lazy-loading",
      "title": "What is lazy loading?",
      "explanation": "\n          <p><strong>Lazy loading</strong> in Angular means loading a feature module only when the user navigates to its route, instead of loading it at application startup.</p>\n\n          <p>This improves initial load performance because Angular downloads less code at first.</p>\n        ",
      "code": "const routes: Routes = [\n  {\n    path: 'admin',\n    loadChildren: () =>\n      import('./admin/admin.module').then(m => m.AdminModule)\n  }\n];",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Lazy Loading</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 text-center\"><p class=\"font-bold text-indigo-700\">App Start</p><p class=\"text-xs text-slate-500 mt-2\">Feature not loaded yet</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 text-center\"><p class=\"font-bold text-emerald-700\">Visit route</p><p class=\"text-xs text-slate-500 mt-2\">Module loads on demand</p></div></div></div>"
    },
    {
      "id": "what-are-route-guards",
      "title": "What are route guards?",
      "explanation": "\n          <p><strong>Route guards</strong> are Angular features used to control whether navigation to or from a route should be allowed.</p>\n\n          <p>They are often used for authentication, authorization, unsaved changes checks, or data preparation before a route loads.</p>\n        ",
      "code": "const routes: Routes = [\n  {\n    path: 'dashboard',\n    component: DashboardComponent,\n    canActivate: [AuthGuard]\n  }\n];",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Route Guards</p><div class=\"flex items-center justify-center gap-4\"><div class=\"bg-white border border-slate-200 rounded-xl p-4 text-center\"><p class=\"font-bold text-slate-700\">User tries to navigate</p></div><div class=\"text-slate-300\">&rarr;</div><div class=\"bg-amber-50 border-2 border-amber-200 rounded-xl p-4 text-center\"><p class=\"font-bold text-amber-700\">Guard checks rules</p></div><div class=\"text-slate-300\">&rarr;</div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4 text-center\"><p class=\"font-bold text-emerald-700\">Allow or block</p></div></div></div>"
    },
    {
      "id": "types-of-route-guards",
      "title": "Types of route guards (CanActivate, CanDeactivate, Resolve, CanLoad)",
      "explanation": "\n          <p>Angular provides multiple types of route guards, each for a specific routing use case.</p>\n\n          <ul>\n            <li><strong>CanActivate:</strong> decides whether a route can be entered.</li>\n            <li><strong>CanDeactivate:</strong> decides whether the user can leave a route.</li>\n            <li><strong>Resolve:</strong> fetches data before the route is activated.</li>\n            <li><strong>CanLoad:</strong> decides whether a lazy-loaded module can be loaded.</li>\n          </ul>\n        ",
      "code": "const routes: Routes = [\n  {\n    path: 'profile',\n    component: ProfileComponent,\n    canActivate: [AuthGuard],\n    canDeactivate: [UnsavedChangesGuard],\n    resolve: { user: UserResolver }\n  },\n  {\n    path: 'admin',\n    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),\n    canLoad: [AdminLoadGuard]\n  }\n];",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Types Of Route Guards</p><div class=\"grid grid-cols-2 md:grid-cols-4 gap-3\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-xl p-3 text-center text-xs font-mono text-indigo-700\">CanActivate</div><div class=\"bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center text-xs font-mono text-emerald-700\">CanDeactivate</div><div class=\"bg-amber-50 border border-amber-200 rounded-xl p-3 text-center text-xs font-mono text-amber-700\">Resolve</div><div class=\"bg-rose-50 border border-rose-200 rounded-xl p-3 text-center text-xs font-mono text-rose-700\">CanLoad</div></div></div>"
    },
    {
      "id": "what-is-wildcard-route",
      "title": "What is wildcard route?",
      "explanation": "\n          <p>A <strong>wildcard route</strong> in Angular is used to catch all unmatched URLs. It is defined using <code>**</code>.</p>\n\n          <p>It is commonly used to show a 404 page or redirect unknown routes.</p>\n        ",
      "code": "const routes: Routes = [\n  { path: '', component: HomeComponent },\n  { path: 'about', component: AboutComponent },\n  { path: '**', component: NotFoundComponent }\n];",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Wildcard Route</p><div class=\"max-w-lg mx-auto bg-white border border-slate-200 rounded-xl p-4 text-center\"><p class=\"font-mono text-rose-600\">path: '**'</p><p class=\"text-xs text-slate-500 mt-2\">Handles unmatched URLs / 404 pages</p></div></div>"
    },
    {
      "id": "what-is-router-outlet",
      "title": "What is router outlet?",
      "explanation": "\n          <p><strong><code>router-outlet</code></strong> is an Angular directive that acts as a placeholder where the router loads the matched component.</p>\n\n          <p>Without <code>router-outlet</code>, Angular can match routes but has no place to render the routed component in the template.</p>\n        ",
      "code": "@Component({\n  selector: 'app-root',\n  template:     <nav>\n      <a routerLink=\"/\">Home</a>\n      <a routerLink=\"/about\">About</a>\n    </nav>\n\n    <router-outlet></router-outlet>\n  })\nexport class AppComponent {}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">router-outlet</p><div class=\"flex flex-col items-center gap-3 max-w-md mx-auto\"><div class=\"w-full bg-white border border-slate-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-slate-700\">Template</p></div><div class=\"w-full bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center\"><p class=\"font-mono text-indigo-700\">&lt;router-outlet&gt;&lt;/router-outlet&gt;</p></div><div class=\"w-full bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-emerald-700\">Matched component renders here</p></div></div></div>"
    }
  ]
});
