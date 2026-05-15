window.MODULES = window.MODULES || [];

(function () {
  const scenarios = [
    {
      id: "datatable-200-records",
      title: "If I have a data table with 200 records, how will I manage it?",
      reasoning: "Two hundred rows is usually not a big-data problem. The real question is row complexity, filtering needs, mobile behavior, and whether the dataset can grow later.",
      approach: "Use client-side pagination, sorting, filtering, stable row IDs, and @for track. If rows are heavy or the list can grow, move filtering/pagination to the server or use CDK virtual scroll.",
      code: "products = signal<Product[]>([]);\nsearch = signal('');\npage = signal(0);\npageSize = 20;\n\nfiltered = computed(() => {\n  const q = this.search().toLowerCase().trim();\n  return this.products().filter(p => p.name.toLowerCase().includes(q));\n});\n\npaged = computed(() => {\n  const start = this.page() * this.pageSize;\n  return this.filtered().slice(start, start + this.pageSize);\n});\n\n// Template: @for (row of paged(); track row.id) { ... }"
    },
    {
      id: "datatable-20000-records",
      title: "If the table has 20,000 records instead of 200, what changes?",
      reasoning: "At 20,000 rows, client-side rendering, filtering, and sorting can become slow and memory-heavy. Rendering all rows is the biggest mistake.",
      approach: "Use server-side pagination/filtering/sorting. Render only the current page or viewport. Add indexes on the backend for searchable columns.",
      code: "getProducts(query: ProductQuery) {\n  return this.http.get<Page<Product>>('/api/products', { params: { ...query } });\n}\n\nquery = signal({ page: 0, size: 50, search: '', sort: 'name,asc' });\npageResource = httpResource<Page<Product>>(() => ({\n  url: '/api/products',\n  params: this.query()\n}));"
    },
    {
      id: "autosave-200-field-form",
      title: "If I have a form with 200 fields, how can I autosave while the user fills it?",
      reasoning: "A 200-field form is a UX, network, validation, and state problem. Saving on every keystroke creates too many requests and bad race conditions.",
      approach: "Use nested typed reactive forms, section-level dirty tracking, debounceTime, switchMap or concatMap, PATCH only changed fields, and local draft recovery.",
      code: "this.form.valueChanges.pipe(\n  debounceTime(800),\n  filter(() => this.form.valid),\n  tap(() => this.status.set('Saving...')),\n  switchMap(value => this.api.saveDraft(value)),\n  takeUntilDestroyed(this.destroyRef)\n).subscribe({\n  next: () => this.status.set('Saved'),\n  error: () => this.status.set('Save failed')\n});"
    },
    {
      id: "autosave-offline",
      title: "How will you handle autosave if the internet goes offline?",
      reasoning: "Autosave must not lose user input just because the network drops. Server save and local draft save are different layers.",
      approach: "Save locally first using IndexedDB/localStorage, mark the draft as pending sync, and retry server sync when the browser is online.",
      code: "window.addEventListener('online', () => this.syncPendingDrafts());\n\nsaveDraft(value: Draft) {\n  this.localDraftStore.save(value);\n  return this.api.saveDraft(value).pipe(\n    catchError(() => {\n      this.localDraftStore.markPending(value.id);\n      return EMPTY;\n    })\n  );\n}"
    },
    {
      id: "slow-api-search",
      title: "If an API search is slow and the user keeps typing, how will you handle it?",
      reasoning: "Older slow responses should not overwrite newer search results. The UI should represent the latest input only.",
      approach: "Use debounceTime, distinctUntilChanged, and switchMap. Keep loading and error state separate.",
      code: "search.valueChanges.pipe(\n  debounceTime(300),\n  distinctUntilChanged(),\n  filter(term => term.trim().length >= 2),\n  switchMap(term => this.api.search(term).pipe(catchError(() => of([]))))\n).subscribe(results => this.results.set(results));"
    },
    {
      id: "live-updating-large-list",
      title: "If a large list receives live updates, how will you keep the UI fast?",
      reasoning: "Frequent item updates can cause repeated sorting, repeated DOM updates, and unstable row identity.",
      approach: "Normalize data by ID, batch updates, use @for track item.id, and use virtual scroll when the list is long.",
      code: "itemsById = signal<Record<string, Item>>({});\nitems = computed(() => Object.values(this.itemsById()));\n\nupdates$.pipe(bufferTime(500), filter(Boolean)).subscribe(batch => {\n  this.itemsById.update(current => {\n    const next = { ...current };\n    for (const item of batch) next[item.id] = { ...next[item.id], ...item };\n    return next;\n  });\n});"
    },
    {
      id: "prevent-unsaved-navigation",
      title: "If a user edits a form and tries to leave, how will you prevent data loss?",
      reasoning: "Users navigate away accidentally. A real app should protect unsaved work without blocking safe navigation.",
      approach: "Use autosave plus a CanDeactivate guard. Allow leaving if the form is clean or the latest save succeeded.",
      code: "export const unsavedGuard = (cmp: { canLeave: () => boolean }) => {\n  return cmp.canLeave() || confirm('You have unsaved changes. Leave page?');\n};\n\ncanLeave() {\n  return !this.form.dirty || this.saveStatus() === 'saved';\n}"
    },
    {
      id: "dashboard-10-api-calls",
      title: "If a dashboard needs 10 API calls, how will you load it?",
      reasoning: "Not every widget has the same priority. One slow widget should not block the whole dashboard unless it is critical.",
      approach: "Load critical calls first, run independent calls in parallel, defer low-priority widgets, and cache stable lookups.",
      code: "critical$ = forkJoin({\n  profile: this.api.profile(),\n  summary: this.api.summary(),\n  permissions: this.api.permissions()\n});\n\n// Template: render shell, then @defer charts and logs on idle/viewport."
    },
    {
      id: "dependent-api-calls",
      title: "If one API call depends on another API response, how will you chain it?",
      reasoning: "Parallel calls only work when requests are independent. Dependent calls must wait for required data.",
      approach: "Use switchMap for dependency chains. Use forkJoin only after all required IDs or inputs are known.",
      code: "this.userApi.getCurrentUser().pipe(\n  switchMap(user => this.orderApi.getOrders(user.id)),\n  switchMap(orders => forkJoin(orders.map(o => this.invoiceApi.getInvoice(o.id))))\n).subscribe(invoices => this.invoices.set(invoices));"
    },
    {
      id: "route-load-before-component",
      title: "If a route page needs data before opening, where will you load it?",
      reasoning: "Some pages cannot render meaningfully without data. Loading inside the component may show a broken or empty shell.",
      approach: "Use a route resolver for required data. Load optional or secondary data inside the component.",
      code: "export const productResolver: ResolveFn<Product> = route => {\n  return inject(ProductApi).getById(route.paramMap.get('id')!);\n};\n\n{ path: 'products/:id', resolve: { product: productResolver }, loadComponent: ... }"
    },
    {
      id: "same-component-route-param-change",
      title: "If the same component opens with a different route ID, why might ngOnInit not run again?",
      reasoning: "Angular can reuse the same component instance when only route parameters change. ngOnInit runs once per instance.",
      approach: "Subscribe to paramMap or convert route params to signals. Fetch data whenever the route parameter changes.",
      code: "productId$ = this.route.paramMap.pipe(map(params => params.get('id')!));\nproduct$ = this.productId$.pipe(switchMap(id => this.api.getById(id)));\n\n// Or use toSignal(product$) for signal-based templates."
    },
    {
      id: "memory-leak-subscriptions",
      title: "How will you avoid memory leaks from many subscriptions?",
      reasoning: "Subscriptions to long-lived streams can keep components alive after navigation.",
      approach: "Prefer async pipe. For imperative subscriptions, use takeUntilDestroyed. Avoid manual arrays of subscriptions.",
      code: "this.events$.pipe(\n  takeUntilDestroyed(this.destroyRef)\n).subscribe(event => this.handle(event));\n\n// Template streams: {{ user$ | async }} auto-unsubscribes."
    },
    {
      id: "global-loading-spinner",
      title: "How will you show a global loading spinner for all HTTP calls?",
      reasoning: "A boolean spinner breaks when multiple requests run together. One request finishing may hide the spinner while others continue.",
      approach: "Use an interceptor and maintain an active request counter.",
      code: "export const loadingInterceptor: HttpInterceptorFn = (req, next) => {\n  const loader = inject(LoadingService);\n  loader.increment();\n  return next(req).pipe(finalize(() => loader.decrement()));\n};\n\nisLoading = computed(() => this.activeRequests() > 0);"
    },
    {
      id: "token-refresh-multiple-401",
      title: "If five API calls return 401 together, how will you refresh the token only once?",
      reasoning: "Without coordination, each failed request may trigger its own refresh call, causing races and invalid tokens.",
      approach: "Queue failed requests behind one refresh Observable using shareReplay or a refresh-in-progress signal.",
      code: "if (!this.refresh$) {\n  this.refresh$ = this.auth.refreshToken().pipe(\n    shareReplay(1),\n    finalize(() => this.refresh$ = null)\n  );\n}\n\nreturn this.refresh$.pipe(switchMap(() => next(addToken(req))));"
    },
    {
      id: "role-based-menu",
      title: "If menu items depend on user roles, how will you manage them?",
      reasoning: "Hiding menu items is UX, not security. Backend APIs must still enforce permissions.",
      approach: "Keep route/menu metadata declarative, derive visible menus from current user role, and protect routes with guards.",
      code: "menus = computed(() =>\n  MENU_ITEMS.filter(item => this.auth.hasAnyRole(item.roles))\n);\n\nexport const roleGuard = (role: Role) => () => inject(AuthService).hasRole(role);"
    },
    {
      id: "component-too-many-inputs",
      title: "If a component has 25 inputs, what will you do?",
      reasoning: "Too many inputs often means the component has too many responsibilities or lacks a clear view model.",
      approach: "Group related inputs into a typed config object, split the component, or move orchestration to a parent/container.",
      code: "interface TableConfig {\n  columns: ColumnDef[];\n  pagination: PaginationConfig;\n  permissions: TablePermissions;\n}\n\nconfig = input.required<TableConfig>();\n// Prefer [config] over 25 separate bindings."
    },
    {
      id: "expensive-template-function",
      title: "If a function in the template makes the page slow, why?",
      reasoning: "Template functions may run on every change detection pass. Expensive functions inside templates multiply quickly.",
      approach: "Move expensive work into computed signals, pure pipes, memoized selectors, or precomputed view models.",
      code: "filtered = computed(() => expensiveFilter(this.items(), this.search()));\n\n// Template:\n// @for (item of filtered(); track item.id) { ... }\n// Avoid: @for (item of getFilteredItems(); track item.id)"
    },
    {
      id: "onpush-not-updating",
      title: "If an OnPush component is not updating, what will you check?",
      reasoning: "OnPush relies on input reference changes, events, async pipe, signals, or manual marking.",
      approach: "Check whether you mutated an object/array in place. Create a new reference or use signals correctly.",
      code: "// Bad\nthis.items.push(newItem);\n\n// Good\nthis.items = [...this.items, newItem];\n\n// Signal\nthis.itemsSignal.update(items => [...items, newItem]);"
    },
    {
      id: "zoneless-migration",
      title: "If you migrate to zoneless and parts stop updating, what is the reason?",
      reasoning: "Zone.js used to notify Angular after many async tasks automatically. Zoneless needs explicit Angular notifications.",
      approach: "Move state to signals, use async pipe, call markForCheck for external callbacks, and wrap third-party events carefully.",
      code: "externalLibrary.onChange(value => {\n  this.ngZone.run(() => {\n    this.value.set(value);\n  });\n});\n\n// Prefer signal.set/update so Angular knows what changed."
    },
    {
      id: "third-party-widget",
      title: "How will you integrate a heavy third-party chart or editor?",
      reasoning: "Third-party widgets can be large, DOM-heavy, and outside Angular's change detection model.",
      approach: "Lazy-load it, initialize after view render, run noisy events outside Angular, and destroy it in cleanup.",
      code: "afterNextRender(async () => {\n  const { Chart } = await import('chart.js');\n  this.ngZone.runOutsideAngular(() => {\n    this.chart = new Chart(this.canvas.nativeElement, config);\n  });\n});\n\nngOnDestroy() { this.chart?.destroy(); }"
    },
    {
      id: "file-upload-large",
      title: "If users upload large files, how will you manage progress and failures?",
      reasoning: "Large uploads need progress, validation, cancellation, retry rules, and backend limits.",
      approach: "Use HttpClient events for progress, validate size/type before upload, support cancel, and consider chunked uploads for very large files.",
      code: "const req = new HttpRequest('POST', '/api/upload', formData, { reportProgress: true });\n\nthis.http.request(req).pipe(\n  filter(e => e.type === HttpEventType.UploadProgress || e.type === HttpEventType.Response),\n  map(e => e.type === HttpEventType.UploadProgress ? Math.round(100 * e.loaded / (e.total ?? e.loaded)) : 100)\n);"
    },
    {
      id: "image-heavy-page",
      title: "If a page has many images and loads slowly, what will you do?",
      reasoning: "Images often dominate page weight. Angular optimization alone will not fix oversized media.",
      approach: "Use responsive images, lazy loading, proper dimensions to prevent layout shift, CDN compression, and defer below-fold sections.",
      code: "<img\n  ngSrc=\"/assets/product.webp\"\n  width=\"400\"\n  height=\"300\"\n  loading=\"lazy\"\n  alt=\"Product image\"\n/>\n\n// Use NgOptimizedImage where possible."
    },
    {
      id: "shared-state-tabs",
      title: "If multiple tabs need to share login/logout state, how will you handle it?",
      reasoning: "Local in-memory signals do not automatically sync across browser tabs.",
      approach: "Use storage events or BroadcastChannel to notify other tabs, then update the auth signal.",
      code: "const channel = new BroadcastChannel('auth');\n\nlogout() {\n  localStorage.removeItem('token');\n  channel.postMessage({ type: 'logout' });\n  this.user.set(null);\n}\n\nchannel.onmessage = event => {\n  if (event.data.type === 'logout') this.user.set(null);\n};"
    },
    {
      id: "cache-master-data",
      title: "If dropdown master data is used across many pages, how will you avoid repeated calls?",
      reasoning: "Repeated calls for stable lookup data waste network and slow navigation.",
      approach: "Cache with shareReplay, a signal store, or HTTP cache headers. Add invalidation if the data can change.",
      code: "countries$ = this.http.get<Country[]>('/api/countries').pipe(\n  shareReplay({ bufferSize: 1, refCount: false })\n);\n\n// Every subscriber reuses the same response."
    },
    {
      id: "stale-cache-after-update",
      title: "If cached data becomes stale after an update, what will you do?",
      reasoning: "Caching improves speed but can show wrong data after mutations.",
      approach: "Invalidate affected cache keys after create/update/delete, or optimistically update the cache with the returned entity.",
      code: "updateProduct(id: string, changes: Partial<Product>) {\n  return this.http.patch<Product>(`/api/products/${id}`, changes).pipe(\n    tap(updated => this.products.update(list => list.map(p => p.id === id ? updated : p)))\n  );\n}"
    },
    {
      id: "optimistic-update",
      title: "If you want instant UI after clicking Like, how will you handle failure?",
      reasoning: "Optimistic updates improve UX but must be reversible if the server rejects the operation.",
      approach: "Update the UI immediately, call the API, and rollback on error.",
      code: "like(post: Post) {\n  this.posts.update(posts => posts.map(p => p.id === post.id ? { ...p, liked: true } : p));\n\n  this.api.like(post.id).pipe(\n    catchError(() => {\n      this.posts.update(posts => posts.map(p => p.id === post.id ? { ...p, liked: false } : p));\n      return EMPTY;\n    })\n  ).subscribe();\n}"
    },
    {
      id: "dynamic-form-from-api",
      title: "If form fields come from an API, how will you build the form?",
      reasoning: "Dynamic forms need metadata, validation mapping, rendering rules, and safe defaults.",
      approach: "Convert field metadata into a FormGroup. Use a field renderer component per type. Validate unknown field types defensively.",
      code: "buildForm(fields: FieldMeta[]) {\n  const group: Record<string, FormControl> = {};\n  for (const field of fields) {\n    group[field.key] = new FormControl(field.defaultValue ?? '', mapValidators(field.validators));\n  }\n  return new FormGroup(group);\n}"
    },
    {
      id: "conditional-fields",
      title: "If fields appear based on other field values, how will you manage validation?",
      reasoning: "Hidden fields should usually not block form submission. Validators must match visibility/enabled state.",
      approach: "Enable/disable controls based on parent values. Add/remove validators when conditions change.",
      code: "this.form.get('hasCompany')!.valueChanges.subscribe(hasCompany => {\n  const company = this.form.get('companyName')!;\n  if (hasCompany) {\n    company.enable();\n    company.addValidators(Validators.required);\n  } else {\n    company.reset();\n    company.clearValidators();\n    company.disable();\n  }\n  company.updateValueAndValidity();\n});"
    },
    {
      id: "multi-step-wizard",
      title: "How will you design a multi-step form wizard?",
      reasoning: "A wizard should preserve state across steps and validate step-by-step without losing partial progress.",
      approach: "Use one parent FormGroup split into nested step groups, route or step state, autosave drafts, and guard unfinished navigation.",
      code: "wizardForm = this.fb.group({\n  personal: this.fb.group({ name: '', email: '' }),\n  address: this.fb.group({ city: '', pincode: '' }),\n  payment: this.fb.group({ method: '' })\n});\n\ncanMoveToStep(step: string) {\n  return this.wizardForm.get(step)?.valid ?? false;\n}"
    },
    {
      id: "modal-deep-linking",
      title: "If a modal should open from a URL, how will you design it?",
      reasoning: "Important UI state should be shareable and restorable when needed. A modal can be represented by routing state.",
      approach: "Use child routes, named outlets, or query parameters. Keep modal state in the router instead of only local component state.",
      code: "// /products?dialog=create\nthis.router.navigate([], { queryParams: { dialog: 'create' }, queryParamsHandling: 'merge' });\n\nisCreateOpen = computed(() => this.routeQuery().dialog === 'create');"
    },
    {
      id: "accessibility-custom-dropdown",
      title: "If you build a custom dropdown, what accessibility issues must you solve?",
      reasoning: "A div-based dropdown is not automatically keyboard or screen-reader accessible.",
      approach: "Prefer native select, Angular Material, CDK, or Angular Aria. If custom, implement roles, focus, keyboard navigation, aria-expanded, and active option state.",
      code: "// Prefer Angular Aria/Listbox patterns for custom design systems.\n// Required behavior: ArrowDown/ArrowUp, Enter, Escape, focus return,\n// role=\"listbox\", role=\"option\", aria-selected, aria-activedescendant."
    },
    {
      id: "ssr-window-error",
      title: "If SSR fails because window is undefined, how will you fix it?",
      reasoning: "Server-side rendering runs in Node, where browser globals like window, document, and localStorage do not exist.",
      approach: "Guard browser-only code with isPlatformBrowser or move it into afterNextRender.",
      code: "platformId = inject(PLATFORM_ID);\n\nngOnInit() {\n  if (isPlatformBrowser(this.platformId)) {\n    const token = localStorage.getItem('token');\n  }\n}\n\nafterNextRender(() => {\n  // browser-only DOM work here\n});"
    },
    {
      id: "hydration-mismatch",
      title: "If SSR hydration gives mismatch errors, what will you check?",
      reasoning: "Hydration expects server-rendered HTML and client-rendered HTML to match.",
      approach: "Avoid random values, dates, direct DOM mutation, browser-only conditions, and unstable IDs during initial render.",
      code: "// Bad in SSR template state\nid = Math.random().toString();\nnow = new Date().toLocaleString();\n\n// Better: generate stable IDs from data or defer browser-only values until after hydration."
    },
    {
      id: "lazy-load-admin",
      title: "If only admins use a feature, how will you keep it out of the main bundle?",
      reasoning: "Rarely used features should not increase initial load for all users.",
      approach: "Lazy-load routes with loadComponent/loadChildren and protect them with guards. Also enforce permissions on the backend.",
      code: "{\n  path: 'admin',\n  canMatch: [adminGuard],\n  loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)\n}"
    },
    {
      id: "feature-flag-rollout",
      title: "How will you implement feature flags in Angular?",
      reasoning: "Feature flags control rollout, but frontend flags are not security boundaries.",
      approach: "Load config at startup, expose flags through a service/signal, use canMatch for route-level flags, and keep server validation.",
      code: "flags = signal<Record<string, boolean>>({});\n\nexport const featureGuard = (flag: string) => () => {\n  return inject(FeatureFlagService).enabled(flag);\n};\n\n{ path: 'new-checkout', canMatch: [featureGuard('newCheckout')], loadComponent: ... }"
    },
    {
      id: "runtime-config",
      title: "If the same build must run in dev, staging, and production, how will you handle config?",
      reasoning: "Build-time environment files force separate builds per environment. Runtime config allows one artifact to move through environments.",
      approach: "Load /assets/config.json before bootstrap using APP_INITIALIZER or fetch before bootstrapApplication.",
      code: "fetch('/assets/config.json')\n  .then(r => r.json())\n  .then(config => bootstrapApplication(AppComponent, {\n    providers: [{ provide: APP_CONFIG, useValue: config }]\n  }));"
    },
    {
      id: "error-boundary-route",
      title: "If a route fails to load or throws an error, how will you recover gracefully?",
      reasoning: "Blank screens destroy trust. Users need a stable error page and retry path.",
      approach: "Use global ErrorHandler, route error pages, HTTP error states, and lazy route loading error handling.",
      code: "this.router.events.pipe(\n  filter(e => e instanceof NavigationError)\n).subscribe(() => this.router.navigate(['/error']));\n\n// Components should render error state, not just console.error."
    },
    {
      id: "websocket-reconnect",
      title: "If a WebSocket disconnects often, how will you reconnect safely?",
      reasoning: "Immediate reconnect loops can overload the server and drain the client.",
      approach: "Use exponential backoff, max retry delay, online/offline checks, and cleanup on component destroy.",
      code: "socket$.pipe(\n  retry({\n    delay: (_error, retryCount) => timer(Math.min(30000, 1000 * 2 ** retryCount))\n  }),\n  takeUntilDestroyed()\n).subscribe(message => this.messages.update(m => [...m, message]));"
    },
    {
      id: "notifications-toast-queue",
      title: "If many toast notifications arrive together, how will you avoid overwhelming the user?",
      reasoning: "Showing every message immediately can create noisy UI and accessibility problems.",
      approach: "Queue toasts, group duplicates, limit visible count, and use aria-live politely.",
      code: "toasts = signal<Toast[]>([]);\n\nshow(toast: Toast) {\n  this.toasts.update(list => [...list.filter(t => t.key !== toast.key), toast].slice(-3));\n}\n\n// Announce important messages with LiveAnnouncer."
    },
    {
      id: "permissions-change-runtime",
      title: "If user permissions change while they are using the app, what should happen?",
      reasoning: "Permissions are not static. Admins may revoke access while a session is active.",
      approach: "Refresh permissions periodically or via events, update route/menu state, and handle 403 responses globally.",
      code: "permissions = signal<Permission[]>([]);\n\nhas(permission: Permission) {\n  return this.permissions().includes(permission);\n}\n\n// 403 interceptor: show message, refresh permissions, redirect if current route is no longer allowed."
    },
    {
      id: "duplicate-submit",
      title: "How will you prevent duplicate form submission?",
      reasoning: "Users double-click, network is slow, and duplicate orders/payments can be serious.",
      approach: "Disable submit while pending, make backend idempotent, and ignore repeated clicks until completion.",
      code: "saving = signal(false);\n\nsubmit() {\n  if (this.saving()) return;\n  this.saving.set(true);\n  this.api.submit(this.form.value).pipe(\n    finalize(() => this.saving.set(false))\n  ).subscribe();\n}\n\n// Template: <button [disabled]=\"saving() || form.invalid\">Save</button>"
    },
    {
      id: "race-condition-save-load",
      title: "If a save request and reload request race, how will you avoid stale UI?",
      reasoning: "A slower old request can overwrite newer state if responses are applied blindly.",
      approach: "Cancel outdated requests with switchMap, use version timestamps, or ignore responses older than the current state version.",
      code: "requestVersion = 0;\n\nload() {\n  const version = ++this.requestVersion;\n  this.api.load().subscribe(data => {\n    if (version === this.requestVersion) this.data.set(data);\n  });\n}"
    },
    {
      id: "deeply-nested-state-update",
      title: "How will you update deeply nested state without breaking change detection?",
      reasoning: "Mutating nested objects in place keeps references stable and can prevent OnPush/signals/selectors from noticing changes.",
      approach: "Copy only the path you change, normalize complex state, or use a helper library if needed.",
      code: "this.user.update(user => ({\n  ...user,\n  address: {\n    ...user.address,\n    city: 'Hyderabad'\n  }\n}));\n\n// For very nested data, consider normalizing by ID."
    },
    {
      id: "form-array-1000-items",
      title: "If a FormArray has 1,000 rows, how will you keep it usable?",
      reasoning: "Rendering and validating 1,000 form rows at once can be slow and overwhelming.",
      approach: "Use pagination/virtual scrolling, edit one row at a time, validate visible/dirty rows first, and save in batches.",
      code: "// Prefer row editing over rendering 1000 controls at once.\neditingRow = signal<Row | null>(null);\n\nopenEditor(row: Row) {\n  this.editorForm.reset(row);\n  this.editingRow.set(row);\n}\n\nsaveRow() { return this.api.patchRow(this.editorForm.getRawValue()); }"
    },
    {
      id: "audit-log-infinite-scroll",
      title: "How will you build an audit log with infinite scrolling?",
      reasoning: "Audit logs can grow forever, so page-number pagination may become inefficient.",
      approach: "Use cursor-based pagination, append pages immutably, prevent duplicate loads, and show loading/end states.",
      code: "cursor = signal<string | null>(null);\nlogs = signal<AuditLog[]>([]);\nloading = signal(false);\n\nloadMore() {\n  if (this.loading()) return;\n  this.loading.set(true);\n  this.api.getLogs(this.cursor()).pipe(finalize(() => this.loading.set(false)))\n    .subscribe(page => {\n      this.logs.update(logs => [...logs, ...page.items]);\n      this.cursor.set(page.nextCursor);\n    });\n}"
    },
    {
      id: "multi-tenant-app",
      title: "If the app is multi-tenant, what frontend concerns will you handle?",
      reasoning: "Tenant context affects routing, API calls, branding, permissions, and caching.",
      approach: "Keep tenant ID in route/subdomain/context service, attach it in API calls, isolate caches per tenant, and reload permissions on tenant switch.",
      code: "export const tenantInterceptor: HttpInterceptorFn = (req, next) => {\n  const tenant = inject(TenantService).currentTenant();\n  return next(req.clone({ setHeaders: { 'X-Tenant-Id': tenant.id } }));\n};\n\ncacheKey = `${tenantId}:products`;"
    },
    {
      id: "micro-frontend-shared-auth",
      title: "In micro frontends, how will multiple Angular apps share auth state?",
      reasoning: "Each remote can accidentally bundle its own Angular/auth instance, causing inconsistent state.",
      approach: "Share Angular as singleton, keep auth in shell or shared library, communicate through events or shared service contracts.",
      code: "// Module federation: share @angular/core as singleton.\n// Shell exposes AuthService contract.\n// Remotes read auth from shell, but backend still validates every request."
    },
    {
      id: "large-angular-build",
      title: "If Angular build time becomes very high, what will you check?",
      reasoning: "Slow builds can come from huge bundles, many dependencies, source maps, tests, or monorepo structure.",
      approach: "Analyze bundle stats, lazy-load features, remove unused libraries, use caching, split projects, and use CI cache/Nx if needed.",
      code: "// Commands to investigate:\n// ng build --configuration production --stats-json\n// npx source-map-explorer dist/**/*.js\n// Check heavy imports like importing all lodash instead of one function."
    },
    {
      id: "slow-initial-load",
      title: "If the first load is slow, what Angular-specific things will you inspect?",
      reasoning: "Initial load depends on JavaScript size, critical rendering, network, images, and route strategy.",
      approach: "Lazy-load routes, defer non-critical components, optimize images, enable SSR/prerender where useful, and inspect bundle size.",
      code: "{ path: 'reports', loadChildren: () => import('./reports/routes').then(m => m.REPORT_ROUTES) }\n\n// Template:\n// @defer (on viewport) { <app-heavy-widget /> } @placeholder { <app-skeleton /> }"
    },
    {
      id: "change-api-contract",
      title: "If backend API response changes, how will you avoid breaking many components?",
      reasoning: "Components should not depend directly on unstable backend DTO shapes.",
      approach: "Map DTOs to frontend view models in services. Keep transformation logic in one place.",
      code: "getUser(): Observable<UserVm> {\n  return this.http.get<UserDto>('/api/user').pipe(\n    map(dto => ({\n      id: dto.user_id,\n      fullName: `${dto.first_name} ${dto.last_name}`,\n      isActive: dto.status === 'ACTIVE'\n    }))\n  );\n}"
    },
    {
      id: "invalid-api-data",
      title: "If API data is missing fields, how will the Angular app stay safe?",
      reasoning: "TypeScript types do not validate runtime JSON. APIs can return invalid or partial data.",
      approach: "Validate at boundaries, use defensive mapping, show fallback UI, and avoid non-null assertions for API data.",
      code: "function toUserVm(dto: Partial<UserDto>): UserVm {\n  return {\n    id: String(dto.id ?? ''),\n    name: dto.name?.trim() || 'Unknown user',\n    email: dto.email ?? ''\n  };\n}\n\n// For stricter apps, use a runtime schema validator."
    },
    {
      id: "testing-autosave",
      title: "How will you test an autosave form?",
      reasoning: "Autosave has timing, validation, and API behavior. Manual testing misses race conditions.",
      approach: "Use fake timers, mock the API, change form values, advance debounce time, and assert only expected payloads are saved.",
      code: "it('autosaves after debounce', fakeAsync(() => {\n  component.form.patchValue({ name: 'Asha' });\n  tick(799);\n  expect(api.saveDraft).not.toHaveBeenCalled();\n  tick(1);\n  expect(api.saveDraft).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'Asha' }));\n}));"
    },
    {
      id: "testing-interceptor",
      title: "How will you test an HTTP interceptor?",
      reasoning: "Interceptors are cross-cutting and can silently break auth, headers, and error handling.",
      approach: "Use HttpTestingController, make a request, inspect the outgoing headers, and flush responses/errors.",
      code: "service.getUsers().subscribe();\n\nconst req = httpMock.expectOne('/api/users');\nexpect(req.request.headers.get('Authorization')).toBe('Bearer token');\nreq.flush([]);"
    },
    {
      id: "secure-localstorage",
      title: "If tokens are stored in localStorage, what risk do you explain?",
      reasoning: "localStorage is readable by JavaScript. If XSS happens, tokens can be stolen.",
      approach: "Prefer HttpOnly secure cookies for refresh tokens, short-lived access tokens, CSP, sanitization, and never bypass Angular sanitization casually.",
      code: "// Safer pattern:\n// Access token short-lived in memory.\n// Refresh token in HttpOnly Secure SameSite cookie.\n// Backend rotates refresh tokens and validates CSRF strategy."
    },
    {
      id: "xss-rich-html",
      title: "If users can enter rich HTML, how will you render it safely?",
      reasoning: "Rendering user HTML can introduce XSS. Angular sanitizes, but bypassing sanitizer is dangerous.",
      approach: "Sanitize on the server, sanitize on the client, allowlist tags, and avoid bypassSecurityTrustHtml unless content is fully trusted.",
      code: "// Avoid this for user content:\n// this.sanitizer.bypassSecurityTrustHtml(userHtml)\n\n// Prefer sanitized/allowlisted content from backend or a trusted sanitizer pipeline."
    },
    {
      id: "i18n-dynamic-content",
      title: "If the app supports multiple languages and dynamic API content, what will you do?",
      reasoning: "Static labels and backend content have different translation lifecycles.",
      approach: "Use Angular localize for app shell/static text, request localized API content with locale, and format dates/currency with locale pipes.",
      code: "providers: [\n  { provide: LOCALE_ID, useValue: currentLocale }\n]\n\nthis.http.get('/api/products', { headers: { 'Accept-Language': currentLocale } });"
    },
    {
      id: "dark-mode-design-system",
      title: "If the app needs dark mode, how will you design it?",
      reasoning: "Dark mode should not be hardcoded per component. It needs consistent design tokens.",
      approach: "Use CSS variables/design tokens, set theme class at root, persist preference, and respect system preference.",
      code: ":root { --bg: #ffffff; --text: #111827; }\n.dark { --bg: #111827; --text: #f9fafb; }\n\n<body [class.dark]=\"theme.isDark()\">"
    },
    {
      id: "reusable-table-design",
      title: "How will you design a reusable table used by many screens?",
      reasoning: "A reusable table can become too generic and impossible to maintain if it owns business logic.",
      approach: "Keep it presentational: columns, rows, sorting events, pagination events. Let feature containers handle data fetching and permissions.",
      code: "@Input() columns!: ColumnDef[];\n@Input() rows!: unknown[];\n@Output() sortChange = new EventEmitter<Sort>();\n@Output() pageChange = new EventEmitter<PageEvent>();\n\n// Feature component handles API and passes rows down."
    },
    {
      id: "form-error-summary",
      title: "For a huge form, how will you help users find validation errors?",
      reasoning: "With many fields, inline errors alone are not enough. Users need navigation to errors.",
      approach: "Show an error summary, focus the first invalid field on submit, and group errors by section.",
      code: "submit() {\n  if (this.form.invalid) {\n    this.form.markAllAsTouched();\n    const firstInvalid = document.querySelector('[aria-invalid=\"true\"]') as HTMLElement;\n    firstInvalid?.focus();\n    return;\n  }\n}"
    },
    {
      id: "production-debugging",
      title: "If users report a production-only bug, how will you debug it?",
      reasoning: "Production bugs often depend on data, environment config, timing, minification, or permissions.",
      approach: "Check logs, reproduce with same role/data/config, use source maps safely, add telemetry, and create a failing test once found.",
      code: "// Add structured client logging around critical flows.\nthis.logger.error('Checkout failed', {\n  orderId,\n  route: this.router.url,\n  errorCode: error.code\n});\n\n// Never log tokens, passwords, or PII."
    }
  ];

  window.MODULES.push({
    "id": "logical-reasoning",
    "title": "Logical Reasoning Scenarios",
    "icon": "bi bi-puzzle",
    "questions": scenarios.map(function (scenario) {
      return {
        "id": scenario.id,
        "title": scenario.title,
        "explanation": `
          <p>${scenario.reasoning}</p>
          <h3>Practical Approach</h3>
          <p>${scenario.approach}</p>
        `,
        "code": scenario.code,
        "language": "typescript"
      };
    })
  });
})();
