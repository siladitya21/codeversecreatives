window.MODULES = window.MODULES || [];

(function () {
  const scenarios = [
    {
      id: "angular-22-standard-reasoning-upgrade",
      title: "How should I reason about Angular 22 standard decisions?",
      analogy: "A carpenter doesn't reach for the newest power tool just because it's new — they pick the tool that matches the joint they're cutting. Reasoning about Angular 22 the same way (constraint first, API second) is what separates a real design decision from name-dropping the latest feature.",
      reasoning: "A modern Angular answer should not simply name the newest API. Good reasoning starts from the constraint: startup time, runtime performance, team ownership, testability, accessibility, SEO, offline support, or migration risk. Angular 22-ready thinking means choosing standalone APIs, signals, block syntax, typed forms, functional providers, and SSR only where they solve the actual problem.",
      approach: "Start with the user-facing requirement, identify the bottleneck or risk, choose the smallest modern Angular pattern that addresses it, and explain the tradeoff. For local UI state, use signals. For async streams and cancellation, use RxJS. For new templates, use @if and @for with track. For route boundaries, use lazy standalone routes and providers. For public content, consider SSR or prerendering. For old apps, migrate gradually without rewriting working code for no reason.",
      code: "function chooseAngularPattern(problem: Problem): Solution {\n  if (problem.kind === 'local-ui-state') return 'signals + computed';\n  if (problem.kind === 'async-cancellation') return 'RxJS switchMap';\n  if (problem.kind === 'large-list') return '@for track + pagination or virtual scroll';\n  if (problem.kind === 'public-seo-page') return 'SSR or prerender + hydration';\n  if (problem.kind === 'feature-boundary') return 'lazy standalone route + route providers';\n  return 'simple standalone component with typed inputs and outputs';\n}"
    },
    {
      id: "datatable-200-records",
      title: "If I have a data table with 200 records, how will I manage it?",
      analogy: "200 rows is a bookshelf, not a warehouse — you can browse it by hand. Reach for pagination and client-side filtering before reaching for server infrastructure you don't need yet.",
      reasoning: "Two hundred rows is usually not a big-data problem. The real question is row complexity, filtering needs, mobile behavior, and whether the dataset can grow later.",
      approach: "Use client-side pagination, sorting, filtering, stable row IDs, and @for track. If rows are heavy or the list can grow, move filtering/pagination to the server or use CDK virtual scroll.",
      code: "products = signal<Product[]>([]);\nsearch = signal('');\npage = signal(0);\npageSize = 20;\n\nfiltered = computed(() => {\n  const q = this.search().toLowerCase().trim();\n  return this.products().filter(p => p.name.toLowerCase().includes(q));\n});\n\npaged = computed(() => {\n  const start = this.page() * this.pageSize;\n  return this.filtered().slice(start, start + this.pageSize);\n});\n\n// Template: @for (row of paged(); track row.id) { ... }"
    },
    {
      id: "datatable-20000-records",
      title: "If the table has 20,000 records instead of 200, what changes?",
      analogy: "20,000 rows is the warehouse, and you don't walk every aisle to find one item — you look it up in an index and have someone bring it to the counter. That's server-side pagination and filtering.",
      gotcha: "The most common mistake at this scale is fetching all 20,000 rows and filtering client-side 'because it worked at 200.' It technically still works — right up until the tab uses a gigabyte of memory and the initial paint takes ten seconds.",
      reasoning: "At 20,000 rows, client-side rendering, filtering, and sorting can become slow and memory-heavy. Rendering all rows is the biggest mistake.",
      approach: "Use server-side pagination/filtering/sorting. Render only the current page or viewport. Add indexes on the backend for searchable columns.",
      code: "getProducts(query: ProductQuery) {\n  return this.http.get<Page<Product>>('/api/products', { params: { ...query } });\n}\n\nquery = signal({ page: 0, size: 50, search: '', sort: 'name,asc' });\npageResource = httpResource<Page<Product>>(() => ({\n  url: '/api/products',\n  params: this.query()\n}));"
    },
    {
      id: "autosave-200-field-form",
      title: "If I have a form with 200 fields, how can I autosave while the user fills it?",
      analogy: "Saving on every keystroke is like mailing a letter after every single word you write — debounce is waiting until the sentence is actually finished before sealing the envelope.",
      reasoning: "A 200-field form is a UX, network, validation, and state problem. Saving on every keystroke creates too many requests and bad race conditions.",
      approach: "Use nested typed reactive forms, section-level dirty tracking, debounceTime, switchMap or concatMap, PATCH only changed fields, and local draft recovery.",
      code: "this.form.valueChanges.pipe(\n  debounceTime(800),\n  filter(() => this.form.valid),\n  tap(() => this.status.set('Saving...')),\n  switchMap(value => this.api.saveDraft(value)),\n  takeUntilDestroyed(this.destroyRef)\n).subscribe({\n  next: () => this.status.set('Saved'),\n  error: () => this.status.set('Save failed')\n});"
    },
    {
      id: "autosave-offline",
      title: "How will you handle autosave if the internet goes offline?",
      analogy: "A ship's captain keeps a paper logbook even when the radio is down — you write locally first, then radio it in once the signal returns.",
      reasoning: "Autosave must not lose user input just because the network drops. Server save and local draft save are different layers.",
      approach: "Save locally first using IndexedDB/localStorage, mark the draft as pending sync, and retry server sync when the browser is online.",
      code: "window.addEventListener('online', () => this.syncPendingDrafts());\n\nsaveDraft(value: Draft) {\n  this.localDraftStore.save(value);\n  return this.api.saveDraft(value).pipe(\n    catchError(() => {\n      this.localDraftStore.markPending(value.id);\n      return EMPTY;\n    })\n  );\n}"
    },
    {
      id: "slow-api-search",
      title: "If an API search is slow and the user keeps typing, how will you handle it?",
      analogy: "If you ask a slow waiter for water, then change your mind and ask for tea, you don't want water arriving after the tea just because it was ordered first. switchMap cancels the stale order.",
      gotcha: "Using mergeMap instead of switchMap here lets every keystroke's response land whenever it finishes — so a slow response for 'lap' can overwrite a fast response for 'laptop' if it arrives later.",
      reasoning: "Older slow responses should not overwrite newer search results. The UI should represent the latest input only.",
      approach: "Use debounceTime, distinctUntilChanged, and switchMap. Keep loading and error state separate.",
      code: "search.valueChanges.pipe(\n  debounceTime(300),\n  distinctUntilChanged(),\n  filter(term => term.trim().length >= 2),\n  switchMap(term => this.api.search(term).pipe(catchError(() => of([]))))\n).subscribe(results => this.results.set(results));"
    },
    {
      id: "live-updating-large-list",
      title: "If a large list receives live updates, how will you keep the UI fast?",
      analogy: "A live scoreboard doesn't repaint the entire stadium screen for every single point scored — it batches updates and repaints once, briefly, per interval.",
      reasoning: "Frequent item updates can cause repeated sorting, repeated DOM updates, and unstable row identity.",
      approach: "Normalize data by ID, batch updates, use @for track item.id, and use virtual scroll when the list is long.",
      code: "itemsById = signal<Record<string, Item>>({});\nitems = computed(() => Object.values(this.itemsById()));\n\nupdates$.pipe(bufferTime(500), filter(Boolean)).subscribe(batch => {\n  this.itemsById.update(current => {\n    const next = { ...current };\n    for (const item of batch) next[item.id] = { ...next[item.id], ...item };\n    return next;\n  });\n});"
    },
    {
      id: "prevent-unsaved-navigation",
      title: "If a user edits a form and tries to leave, how will you prevent data loss?",
      analogy: "A good hotel checkout desk asks 'are you sure you don't want your room key back?' only if you actually still have unpaid items — it doesn't block every guest who's already settled up.",
      reasoning: "Users navigate away accidentally. A real app should protect unsaved work without blocking safe navigation.",
      approach: "Use autosave plus a CanDeactivate guard. Allow leaving if the form is clean or the latest save succeeded.",
      code: "export const unsavedGuard = (cmp: { canLeave: () => boolean }) => {\n  return cmp.canLeave() || confirm('You have unsaved changes. Leave page?');\n};\n\ncanLeave() {\n  return !this.form.dirty || this.saveStatus() === 'saved';\n}"
    },
    {
      id: "dashboard-10-api-calls",
      title: "If a dashboard needs 10 API calls, how will you load it?",
      analogy: "A restaurant doesn't make every table wait for the slowest dish in the kitchen before serving anything — the appetizer goes out the moment it's ready, and the slow-cooked main follows when it's done.",
      gotcha: "A single forkJoin() across all ten calls fails the ENTIRE dashboard the moment any one of the ten errors — even if nine of them succeeded and could have rendered fine.",
      reasoning: "The biggest mistake is sequential loading — waiting for all 10 calls before showing anything. The second mistake is treating all widgets equally: a slow analytics chart should not block the user's name or critical KPIs from appearing. Each widget also has independent error scenarios — if the revenue chart API fails, the rest of the dashboard must still function. A naive forkJoin on all 10 calls fails the entire dashboard if any single call errors.",
      approach: "Classify calls into three tiers. Tier 1 (critical, blocking): user identity and permissions — load before rendering. Tier 2 (important, parallel): KPI cards and summary data — run in parallel with forkJoin and show skeleton loaders. Tier 3 (deferrable): charts, logs, recent activity — defer until idle or when the widget scrolls into view using @defer. Cache stable lookups like permissions with shareReplay. Give each widget its own loading and error state so one failure does not break the page.",
      code: "// Tier 1: block route until user/permissions resolve (resolver)\nexport const dashboardResolver: ResolveFn<DashboardBase> = () =>\n  inject(DashboardApi).getPermissionsAndProfile();\n\n// Tier 2: parallel on component init\nngOnInit() {\n  forkJoin({\n    revenue: this.api.getRevenueSummary().pipe(catchError(() => of(null))),\n    orders:  this.api.getOrderSummary().pipe(catchError(() => of(null))),\n    alerts:  this.api.getAlerts().pipe(catchError(() => of([])))\n  }).subscribe(data => this.summary.set(data));\n}\n\n// Template — Tier 3: deferred, non-blocking\n// @defer (on idle) { <app-revenue-chart /> }\n// @defer (on viewport) { <app-activity-log /> }\n// @placeholder { <app-skeleton-chart /> }"
    },
    {
      id: "dependent-api-calls",
      title: "If one API call depends on another API response, how will you chain it?",
      analogy: "You can't book a hotel room before you know which city you're flying into — some API calls genuinely have to wait in line, not run side by side.",
      reasoning: "Parallel calls only work when requests are independent. Dependent calls must wait for required data.",
      approach: "Use switchMap for dependency chains. Use forkJoin only after all required IDs or inputs are known.",
      code: "this.userApi.getCurrentUser().pipe(\n  switchMap(user => this.orderApi.getOrders(user.id)),\n  switchMap(orders => forkJoin(orders.map(o => this.invoiceApi.getInvoice(o.id))))\n).subscribe(invoices => this.invoices.set(invoices));"
    },
    {
      id: "route-load-before-component",
      title: "If a route page needs data before opening, where will you load it?",
      analogy: "A restaurant seats you at a table that's already set, rather than sitting you down at bare wood and making you wait while they bring silverware — that's what a resolver does for a page that can't render without its data.",
      reasoning: "Some pages cannot render meaningfully without data. Loading inside the component may show a broken or empty shell.",
      approach: "Use a route resolver for required data. Load optional or secondary data inside the component.",
      code: "export const productResolver: ResolveFn<Product> = route => {\n  return inject(ProductApi).getById(route.paramMap.get('id')!);\n};\n\n{ path: 'products/:id', resolve: { product: productResolver }, loadComponent: ... }"
    },
    {
      id: "same-component-route-param-change",
      title: "If the same component opens with a different route ID, why might ngOnInit not run again?",
      analogy: "Angular reusing the component instance across a param change is like keeping the same hotel room but swapping the guest — the room (component) never checks out, so its 'guest arrived' hook (ngOnInit) only rang once, for the first guest.",
      gotcha: "This is one of the most common 'my page didn't refresh' bugs — you navigate from /orders/1 to /orders/2 via a link, expect a fresh page load, and get stale data because the same component instance is being reused.",
      reasoning: "Angular can reuse the same component instance when only route parameters change. ngOnInit runs once per instance.",
      approach: "Subscribe to paramMap or convert route params to signals. Fetch data whenever the route parameter changes.",
      code: "productId$ = this.route.paramMap.pipe(map(params => params.get('id')!));\nproduct$ = this.productId$.pipe(switchMap(id => this.api.getById(id)));\n\n// Or use toSignal(product$) for signal-based templates."
    },
    {
      id: "memory-leak-subscriptions",
      title: "How will you avoid memory leaks from many subscriptions?",
      analogy: "An unsubscribed long-lived stream is like leaving a phone line open to someone who moved out — the house (component) is gone, but the call is still technically connected, and it keeps costing you.",
      gotcha: "Subscribing inside ngOnChanges without unsubscribing is a silent leak generator — ngOnChanges can fire many times per component lifetime, and each firing stacks another live subscription.",
      reasoning: "Subscriptions to long-lived Observables — like WebSocket streams, timer intervals, or global event buses — keep a reference to the subscriber callback alive even after the component is destroyed and removed from the DOM. Angular cannot garbage-collect the component because the Observable still holds a reference to it. This silently accumulates with each navigation, eventually causing high memory usage, stale event handlers firing on destroyed components, and hard-to-reproduce state bugs.",
      approach: "The safest default is the async pipe in templates — Angular unsubscribes automatically on destroy. For imperative subscriptions inside the class, use takeUntilDestroyed(this.destroyRef) as the last operator in the pipe before subscribe. Avoid Subscription arrays (add/unsubscribe manually) — they are verbose and easy to forget. Never subscribe inside ngOnChanges without a matching unsubscribe, because it runs multiple times. Avoid interval() or timer() subscriptions without takeUntilDestroyed as they fire forever after destroy.",
      code: "// Pattern 1: async pipe (preferred for template display)\n// <div>{{ user$ | async | json }}</div>\n\n// Pattern 2: takeUntilDestroyed for imperative subscribe\nprivate destroyRef = inject(DestroyRef);\n\nngOnInit() {\n  this.websocket.messages$.pipe(\n    filter(msg => msg.type === 'ORDER_UPDATE'),\n    takeUntilDestroyed(this.destroyRef)\n  ).subscribe(msg => this.handleOrder(msg));\n\n  interval(5000).pipe(\n    switchMap(() => this.api.pollStatus()),\n    takeUntilDestroyed(this.destroyRef)\n  ).subscribe(status => this.status.set(status));\n}\n\n// Pattern 3: toSignal — auto-unsubscribes, no subscribe() needed\nuser = toSignal(this.userService.user$, { initialValue: null });"
    },
    {
      id: "global-loading-spinner",
      title: "How will you show a global loading spinner for all HTTP calls?",
      analogy: "A single on/off light switch can't represent five people currently in a room — you need a counter, not a boolean, so the light only turns off when the last person leaves.",
      reasoning: "A boolean spinner breaks when multiple requests run together. One request finishing may hide the spinner while others continue.",
      approach: "Use an interceptor and maintain an active request counter.",
      code: "export const loadingInterceptor: HttpInterceptorFn = (req, next) => {\n  const loader = inject(LoadingService);\n  loader.increment();\n  return next(req).pipe(finalize(() => loader.decrement()));\n};\n\nisLoading = computed(() => this.activeRequests() > 0);"
    },
    {
      id: "token-refresh-multiple-401",
      title: "If five API calls return 401 together, how will you refresh the token only once?",
      analogy: "If five people each independently call the DMV to renew the same expired ID, only the first call should actually go through — everyone else should just wait for that one call's result instead of triggering four more renewals that collide with each other.",
      gotcha: "Without sharing one in-flight refresh Observable, the second through fifth 401s each fire their own refresh call using an already-rotated refresh token — which fails and logs the user out even though the very first refresh succeeded.",
      reasoning: "When an access token expires, every in-flight request fails with 401 simultaneously. Without coordination, each interceptor instance independently fires a refresh call. The first refresh succeeds and returns a new token, but the second through fifth refresh calls use the old refresh token — which the backend has already rotated — so they fail, logging the user out unexpectedly. Even if the backend tolerates multiple refreshes, each one returns a different new access token, so only the last one survives and earlier retried requests carry a now-invalid token.",
      approach: "Store the refresh Observable in a shared variable so the first 401 creates it and every subsequent 401 joins the same Observable. Use shareReplay(1) so late subscribers still get the resolved token without re-triggering the request. Once the refresh settles (success or failure), null out the shared reference so future token expirations start fresh. On refresh failure, clear all tokens and redirect to login — do not retry the original requests. This pattern works at the interceptor level so every HTTP call is covered automatically without touching individual services.",
      code: "// In AuthInterceptorService:\nprivate refresh$: Observable<string> | null = null;\n\nintercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {\n  return next.handle(this.addToken(req)).pipe(\n    catchError(err => {\n      if (err.status !== 401) return throwError(() => err);\n      return this.refreshOnce().pipe(\n        switchMap(token => next.handle(this.addToken(req, token))),\n        catchError(refreshErr => {\n          this.auth.logout();\n          return throwError(() => refreshErr);\n        })\n      );\n    })\n  );\n}\n\nprivate refreshOnce(): Observable<string> {\n  if (!this.refresh$) {\n    this.refresh$ = this.auth.refreshToken().pipe(\n      shareReplay(1),\n      finalize(() => (this.refresh$ = null))\n    );\n  }\n  return this.refresh$;\n}"
    },
    {
      id: "role-based-menu",
      title: "If menu items depend on user roles, how will you manage them?",
      analogy: "Hiding a door from the building directory doesn't lock the door — the directory (menu) is discoverability, the actual lock (guard + backend check) is security, and confusing the two is how unauthorized users end up in rooms they were never supposed to see.",
      gotcha: "Relying only on a canMatch guard and skipping backend authorization means anyone with a REST client can call the API directly and bypass your entire frontend permission model.",
      reasoning: "Hiding menu items is purely UX — a determined user can still navigate to a hidden route by typing the URL or calling the API directly. This means hiding menus and protecting routes are two separate concerns. The menu drives discoverability; guards and backend APIs enforce actual access control. A common mistake is making guards the only protection and skipping backend authorization, or scattering role checks across individual components instead of centralizing them.",
      approach: "Define each menu item with its required roles in a single configuration object. Derive the visible menu list as a computed signal from the current user's roles — this automatically reacts when roles change at runtime. Register canMatch guards on lazy routes so Angular will not even download the chunk for a route the user cannot access. Always validate permissions server-side for every sensitive API call regardless of what the frontend shows.",
      code: "// menu.config.ts\nexport const MENU_ITEMS: MenuItem[] = [\n  { label: 'Dashboard', path: '/dashboard', roles: [] },\n  { label: 'Reports',   path: '/reports',   roles: ['analyst', 'admin'] },\n  { label: 'Admin',     path: '/admin',     roles: ['admin'] },\n];\n\n// nav component\nvisibleMenus = computed(() =>\n  MENU_ITEMS.filter(item =>\n    item.roles.length === 0 || this.auth.hasAnyRole(item.roles)\n  )\n);\n\n// routes\n{ path: 'admin', canMatch: [roleGuard('admin')], loadChildren: () => import('./admin/routes').then(m => m.ADMIN_ROUTES) }\n\n// guard\nexport const roleGuard = (role: string) => () =>\n  inject(AuthService).hasRole(role) || inject(Router).parseUrl('/forbidden');"
    },
    {
      id: "component-too-many-inputs",
      title: "If a component has 25 inputs, what will you do?",
      analogy: "A form with 25 separate blank fields for someone's address is a sign the form should have just asked for 'your address' as one grouped block — 25 inputs on a component is usually the same smell: too many separate knobs where one typed config object would do.",
      reasoning: "Too many inputs often means the component has too many responsibilities or lacks a clear view model.",
      approach: "Group related inputs into a typed config object, split the component, or move orchestration to a parent/container.",
      code: "interface TableConfig {\n  columns: ColumnDef[];\n  pagination: PaginationConfig;\n  permissions: TablePermissions;\n}\n\nconfig = input.required<TableConfig>();\n// Prefer [config] over 25 separate bindings."
    },
    {
      id: "expensive-template-function",
      title: "If a function in the template makes the page slow, why?",
      analogy: "A cashier who recounts the entire till after every single customer, instead of just adding or subtracting the one transaction, is doing your template method's job — expensive work in a template re-runs on every check, not just when its actual input changes.",
      gotcha: "A method call in a template like {{ getFilteredItems() }} looks harmless but silently re-runs the filter logic on every single change detection pass, even ones that have nothing to do with the list.",
      reasoning: "Template functions may run on every change detection pass. Expensive functions inside templates multiply quickly.",
      approach: "Move expensive work into computed signals, pure pipes, memoized selectors, or precomputed view models.",
      code: "filtered = computed(() => expensiveFilter(this.items(), this.search()));\n\n// Template:\n// @for (item of filtered(); track item.id) { ... }\n// Avoid: @for (item of getFilteredItems(); track item.id)"
    },
    {
      id: "onpush-not-updating",
      title: "If an OnPush component is not updating, what will you check?",
      analogy: "OnPush only notices when a NEW box arrives at the door — if you just rearrange the furniture inside the box that's already sitting there (mutate in place), nobody rings the doorbell.",
      reasoning: "OnPush relies on input reference changes, events, async pipe, signals, or manual marking.",
      approach: "Check whether you mutated an object/array in place. Create a new reference or use signals correctly.",
      code: "// Bad\nthis.items.push(newItem);\n\n// Good\nthis.items = [...this.items, newItem];\n\n// Signal\nthis.itemsSignal.update(items => [...items, newItem]);"
    },
    {
      id: "zoneless-migration",
      title: "If you migrate to zoneless and parts stop updating, what is the reason?",
      analogy: "Zone.js used to be an assistant who eavesdropped on every phone call and email to guess when something changed. Without that assistant, you have to actually tell the front desk yourself — that's the mental shift zoneless requires.",
      gotcha: "A third-party library calling your callback outside Angular's notification paths will update your data just fine — Angular just won't know to re-render, because nothing told it a signal changed or an event fired.",
      reasoning: "Zone.js used to notify Angular after many async tasks automatically. Zoneless needs explicit Angular notifications.",
      approach: "Move state to signals, use async pipe, call markForCheck for external callbacks, and wrap third-party events carefully.",
      code: "externalLibrary.onChange(value => {\n  this.ngZone.run(() => {\n    this.value.set(value);\n  });\n});\n\n// Prefer signal.set/update so Angular knows what changed."
    },
    {
      id: "third-party-widget",
      title: "How will you integrate a heavy third-party chart or editor?",
      analogy: "Letting a noisy houseguest (a third-party chart library) run wild inside your quiet house (Angular's change detection) means every footstep they take triggers your smoke alarm — running their code outside the Angular zone is putting them in a soundproofed room first.",
      reasoning: "Third-party widgets can be large, DOM-heavy, and outside Angular's change detection model.",
      approach: "Lazy-load it, initialize after view render, run noisy events outside Angular, and destroy it in cleanup.",
      code: "afterNextRender(async () => {\n  const { Chart } = await import('chart.js');\n  this.ngZone.runOutsideAngular(() => {\n    this.chart = new Chart(this.canvas.nativeElement, config);\n  });\n});\n\nngOnDestroy() { this.chart?.destroy(); }"
    },
    {
      id: "file-upload-large",
      title: "If users upload large files, how will you manage progress and failures?",
      analogy: "Mailing a large package without a tracking number means you and the recipient are both just guessing whether it arrived — HttpClient's upload progress events are the tracking number for a big file transfer.",
      reasoning: "Large uploads need progress, validation, cancellation, retry rules, and backend limits.",
      approach: "Use HttpClient events for progress, validate size/type before upload, support cancel, and consider chunked uploads for very large files.",
      code: "const req = new HttpRequest('POST', '/api/upload', formData, { reportProgress: true });\n\nthis.http.request(req).pipe(\n  filter(e => e.type === HttpEventType.UploadProgress || e.type === HttpEventType.Response),\n  map(e => e.type === HttpEventType.UploadProgress ? Math.round(100 * e.loaded / (e.total ?? e.loaded)) : 100)\n);"
    },
    {
      id: "image-heavy-page",
      title: "If a page has many images and loads slowly, what will you do?",
      analogy: "You can have the fastest highway in the world (Angular's rendering), but if every truck on it is hauling an oversized, unoptimized load (uncompressed images), traffic still crawls.",
      reasoning: "Images often dominate page weight. Angular optimization alone will not fix oversized media.",
      approach: "Use responsive images, lazy loading, proper dimensions to prevent layout shift, CDN compression, and defer below-fold sections.",
      code: "<img\n  ngSrc=\"/assets/product.webp\"\n  width=\"400\"\n  height=\"300\"\n  loading=\"lazy\"\n  alt=\"Product image\"\n/>\n\n// Use NgOptimizedImage where possible."
    },
    {
      id: "shared-state-tabs",
      title: "If multiple tabs need to share login/logout state, how will you handle it?",
      analogy: "Two browser tabs are like two people in separate rooms of the same house who can't hear each other shout — a BroadcastChannel is the intercom system that lets 'logout' announced in one room actually be heard in the other.",
      reasoning: "Local in-memory signals do not automatically sync across browser tabs.",
      approach: "Use storage events or BroadcastChannel to notify other tabs, then update the auth signal.",
      code: "const channel = new BroadcastChannel('auth');\n\nlogout() {\n  localStorage.removeItem('token');\n  channel.postMessage({ type: 'logout' });\n  this.user.set(null);\n}\n\nchannel.onmessage = event => {\n  if (event.data.type === 'logout') this.user.set(null);\n};"
    },
    {
      id: "cache-master-data",
      title: "If dropdown master data is used across many pages, how will you avoid repeated calls?",
      analogy: "Asking the same reference librarian for the same list of country names every single time a page loads is wasteful — shareReplay is handing every visitor the same photocopy instead of re-typing the list from scratch each time.",
      reasoning: "Repeated calls for stable lookup data waste network and slow navigation.",
      approach: "Cache with shareReplay, a signal store, or HTTP cache headers. Add invalidation if the data can change.",
      code: "countries$ = this.http.get<Country[]>('/api/countries').pipe(\n  shareReplay({ bufferSize: 1, refCount: false })\n);\n\n// Every subscriber reuses the same response."
    },
    {
      id: "stale-cache-after-update",
      title: "If cached data becomes stale after an update, what will you do?",
      analogy: "A photocopy is only useful until the original document changes — cached data needs an invalidation plan for the moment the underlying record is actually edited, or the copy quietly becomes a lie.",
      reasoning: "Caching improves speed but can show wrong data after mutations.",
      approach: "Invalidate affected cache keys after create/update/delete, or optimistically update the cache with the returned entity.",
      code: "updateProduct(id: string, changes: Partial<Product>) {\n  return this.http.patch<Product>(`/api/products/${id}`, changes).pipe(\n    tap(updated => this.products.update(list => list.map(p => p.id === id ? updated : p)))\n  );\n}"
    },
    {
      id: "optimistic-update",
      title: "If you want instant UI after clicking Like, how will you handle failure?",
      analogy: "A restaurant that assumes your reservation will be confirmed and sets the table immediately, only un-setting it if the booking system actually rejects it — optimistic UI updates first and rolls back only if the server disagrees.",
      reasoning: "Optimistic updates improve UX but must be reversible if the server rejects the operation.",
      approach: "Update the UI immediately, call the API, and rollback on error.",
      code: "like(post: Post) {\n  this.posts.update(posts => posts.map(p => p.id === post.id ? { ...p, liked: true } : p));\n\n  this.api.like(post.id).pipe(\n    catchError(() => {\n      this.posts.update(posts => posts.map(p => p.id === post.id ? { ...p, liked: false } : p));\n      return EMPTY;\n    })\n  ).subscribe();\n}"
    },
    {
      id: "dynamic-form-from-api",
      title: "If form fields come from an API, how will you build the form?",
      analogy: "Building furniture from an IKEA-style instruction sheet you've never seen before means you have to handle the case where a step is missing or unexpected — a form built from API metadata needs the same defensive posture toward unknown field types.",
      reasoning: "Dynamic forms need metadata, validation mapping, rendering rules, and safe defaults.",
      approach: "Convert field metadata into a FormGroup. Use a field renderer component per type. Validate unknown field types defensively.",
      code: "buildForm(fields: FieldMeta[]) {\n  const group: Record<string, FormControl> = {};\n  for (const field of fields) {\n    group[field.key] = new FormControl(field.defaultValue ?? '', mapValidators(field.validators));\n  }\n  return new FormGroup(group);\n}"
    },
    {
      id: "conditional-fields",
      title: "If fields appear based on other field values, how will you manage validation?",
      analogy: "A hidden compartment in a suitcase shouldn't count against you at airport security if it's genuinely empty and sealed off — a disabled, hidden form field shouldn't block submission with a validator that's still silently active.",
      reasoning: "Hidden fields should usually not block form submission. Validators must match visibility/enabled state.",
      approach: "Enable/disable controls based on parent values. Add/remove validators when conditions change.",
      code: "this.form.get('hasCompany')!.valueChanges.subscribe(hasCompany => {\n  const company = this.form.get('companyName')!;\n  if (hasCompany) {\n    company.enable();\n    company.addValidators(Validators.required);\n  } else {\n    company.reset();\n    company.clearValidators();\n    company.disable();\n  }\n  company.updateValueAndValidity();\n});"
    },
    {
      id: "multi-step-wizard",
      title: "How will you design a multi-step form wizard?",
      analogy: "A passport control line with several checkpoints only lets you walk to counter 3 once counter 2 has stamped your papers — a wizard's per-step validation is that same sequential gate, without losing your place if you step away.",
      reasoning: "A wizard should preserve state across steps and validate step-by-step without losing partial progress.",
      approach: "Use one parent FormGroup split into nested step groups, route or step state, autosave drafts, and guard unfinished navigation.",
      code: "wizardForm = this.fb.group({\n  personal: this.fb.group({ name: '', email: '' }),\n  address: this.fb.group({ city: '', pincode: '' }),\n  payment: this.fb.group({ method: '' })\n});\n\ncanMoveToStep(step: string) {\n  return this.wizardForm.get(step)?.valid ?? false;\n}"
    },
    {
      id: "modal-deep-linking",
      title: "If a modal should open from a URL, how will you design it?",
      analogy: "A modal that only exists in local component state is like a conversation that only happened in person — nobody else can be handed a link and dropped into the same moment. Putting the modal's open/closed state in the URL makes it shareable and bookmarkable.",
      reasoning: "Important UI state should be shareable and restorable when needed. A modal can be represented by routing state.",
      approach: "Use child routes, named outlets, or query parameters. Keep modal state in the router instead of only local component state.",
      code: "// /products?dialog=create\nthis.router.navigate([], { queryParams: { dialog: 'create' }, queryParamsHandling: 'merge' });\n\nisCreateOpen = computed(() => this.routeQuery().dialog === 'create');"
    },
    {
      id: "accessibility-custom-dropdown",
      title: "If you build a custom dropdown, what accessibility issues must you solve?",
      analogy: "A hand-built ramp that looks fine to the eye but was never actually tested with a wheelchair is exactly what a custom &lt;div&gt; dropdown is to a screen reader — it looks like a dropdown, but nothing about it announces 'dropdown' unless you wire up the roles and keyboard behavior yourself.",
      reasoning: "A div-based dropdown is not automatically keyboard or screen-reader accessible.",
      approach: "Prefer native select, Angular Material, CDK, or Angular Aria. If custom, implement roles, focus, keyboard navigation, aria-expanded, and active option state.",
      code: "// Prefer Angular Aria/Listbox patterns for custom design systems.\n// Required behavior: ArrowDown/ArrowUp, Enter, Escape, focus return,\n// role=\"listbox\", role=\"option\", aria-selected, aria-activedescendant."
    },
    {
      id: "ssr-window-error",
      title: "If SSR fails because window is undefined, how will you fix it?",
      analogy: "Asking a server in a data center for 'the current mouse position' is like asking someone over the phone what color your shirt is — the server has no browser, no window, no DOM; it's simply the wrong room to ask that question in.",
      gotcha: "Reading localStorage or window directly in a constructor or field initializer runs on the SERVER during SSR, where those globals don't exist at all — the crash happens before isPlatformBrowser even has a chance to help unless you gate the read with it.",
      reasoning: "Server-side rendering runs in Node, where browser globals like window, document, and localStorage do not exist.",
      approach: "Guard browser-only code with isPlatformBrowser or move it into afterNextRender.",
      code: "platformId = inject(PLATFORM_ID);\n\nngOnInit() {\n  if (isPlatformBrowser(this.platformId)) {\n    const token = localStorage.getItem('token');\n  }\n}\n\nafterNextRender(() => {\n  // browser-only DOM work here\n});"
    },
    {
      id: "hydration-mismatch",
      title: "If SSR hydration gives mismatch errors, what will you check?",
      analogy: "If a photographer takes two photos of the same street five seconds apart, a car that moved between shots creates a mismatch when you overlay them — server-rendered HTML and client-rendered HTML need to be the exact same 'photo,' so anything random (Math.random(), new Date()) taken at render time breaks the overlay.",
      reasoning: "Hydration expects server-rendered HTML and client-rendered HTML to match.",
      approach: "Avoid random values, dates, direct DOM mutation, browser-only conditions, and unstable IDs during initial render.",
      code: "// Bad in SSR template state\nid = Math.random().toString();\nnow = new Date().toLocaleString();\n\n// Better: generate stable IDs from data or defer browser-only values until after hydration."
    },
    {
      id: "lazy-load-admin",
      title: "If only admins use a feature, how will you keep it out of the main bundle?",
      analogy: "A private back office that only three employees ever enter shouldn't be part of the public lobby's floor plan that every visitor has to walk past — lazy-loading the admin feature keeps it out of everyone else's initial download.",
      reasoning: "Rarely used features should not increase initial load for all users.",
      approach: "Lazy-load routes with loadComponent/loadChildren and protect them with guards. Also enforce permissions on the backend.",
      code: "{\n  path: 'admin',\n  canMatch: [adminGuard],\n  loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)\n}"
    },
    {
      id: "feature-flag-rollout",
      title: "How will you implement feature flags in Angular?",
      analogy: "A feature flag is a dimmer switch, not a lock — it controls who SEES a feature in the UI, but a determined visitor can still find the light switch (call the API) directly, so the backend must enforce the real boundary.",
      reasoning: "Feature flags control rollout, but frontend flags are not security boundaries.",
      approach: "Load config at startup, expose flags through a service/signal, use canMatch for route-level flags, and keep server validation.",
      code: "flags = signal<Record<string, boolean>>({});\n\nexport const featureGuard = (flag: string) => () => {\n  return inject(FeatureFlagService).enabled(flag);\n};\n\n{ path: 'new-checkout', canMatch: [featureGuard('newCheckout')], loadComponent: ... }"
    },
    {
      id: "runtime-config",
      title: "If the same build must run in dev, staging, and production, how will you handle config?",
      analogy: "Building one shipping container that gets relabeled at each port (dev, staging, prod) instead of building a separate container for every destination — runtime config lets one build artifact move through every environment.",
      reasoning: "Build-time environment files force separate builds per environment. Runtime config allows one artifact to move through environments.",
      approach: "Load /assets/config.json before bootstrap using APP_INITIALIZER or fetch before bootstrapApplication.",
      code: "fetch('/assets/config.json')\n  .then(r => r.json())\n  .then(config => bootstrapApplication(AppComponent, {\n    providers: [{ provide: APP_CONFIG, useValue: config }]\n  }));"
    },
    {
      id: "error-boundary-route",
      title: "If a route fails to load or throws an error, how will you recover gracefully?",
      analogy: "An elevator that just stops between floors with no announcement is far scarier than one that stops and calmly says 'malfunction, please use the stairs' — a blank crashed screen erodes trust far more than a clear error page with a way forward.",
      reasoning: "Blank screens destroy trust. Users need a stable error page and retry path.",
      approach: "Use global ErrorHandler, route error pages, HTTP error states, and lazy route loading error handling.",
      code: "this.router.events.pipe(\n  filter(e => e instanceof NavigationError)\n).subscribe(() => this.router.navigate(['/error']));\n\n// Components should render error state, not just console.error."
    },
    {
      id: "websocket-reconnect",
      title: "If a WebSocket disconnects often, how will you reconnect safely?",
      analogy: "A dog that immediately barks at the door the instant it closes, over and over without pause, will exhaust itself and annoy everyone — exponential backoff is waiting a little longer each time before trying the door again.",
      reasoning: "Immediate reconnect loops can overload the server and drain the client.",
      approach: "Use exponential backoff, max retry delay, online/offline checks, and cleanup on component destroy.",
      code: "socket$.pipe(\n  retry({\n    delay: (_error, retryCount) => timer(Math.min(30000, 1000 * 2 ** retryCount))\n  }),\n  takeUntilDestroyed()\n).subscribe(message => this.messages.update(m => [...m, message]));"
    },
    {
      id: "notifications-toast-queue",
      title: "If many toast notifications arrive together, how will you avoid overwhelming the user?",
      analogy: "A wall covered edge-to-edge in sticky notes announcing every single event communicates nothing — a toast queue that groups duplicates and caps the visible count is the difference between a bulletin board and noise.",
      reasoning: "Showing every message immediately can create noisy UI and accessibility problems.",
      approach: "Queue toasts, group duplicates, limit visible count, and use aria-live politely.",
      code: "toasts = signal<Toast[]>([]);\n\nshow(toast: Toast) {\n  this.toasts.update(list => [...list.filter(t => t.key !== toast.key), toast].slice(-3));\n}\n\n// Announce important messages with LiveAnnouncer."
    },
    {
      id: "permissions-change-runtime",
      title: "If user permissions change while they are using the app, what should happen?",
      analogy: "A hotel keycard that was deactivated at the front desk should stop opening the door the next time someone tries it, not silently keep working until the guest happens to check out — permission changes need to actually propagate to a live session, not just the next login.",
      reasoning: "Permissions are not static. Admins may revoke access while a session is active.",
      approach: "Refresh permissions periodically or via events, update route/menu state, and handle 403 responses globally.",
      code: "permissions = signal<Permission[]>([]);\n\nhas(permission: Permission) {\n  return this.permissions().includes(permission);\n}\n\n// 403 interceptor: show message, refresh permissions, redirect if current route is no longer allowed."
    },
    {
      id: "duplicate-submit",
      title: "How will you prevent duplicate form submission?",
      analogy: "Pressing an elevator call button five times doesn't summon five elevators — but an unguarded 'Place Order' button clicked five times during a slow network can absolutely place five orders.",
      reasoning: "Users double-click, network is slow, and duplicate orders/payments can be serious.",
      approach: "Disable submit while pending, make backend idempotent, and ignore repeated clicks until completion.",
      code: "saving = signal(false);\n\nsubmit() {\n  if (this.saving()) return;\n  this.saving.set(true);\n  this.api.submit(this.form.value).pipe(\n    finalize(() => this.saving.set(false))\n  ).subscribe();\n}\n\n// Template: <button [disabled]=\"saving() || form.invalid\">Save</button>"
    },
    {
      id: "race-condition-save-load",
      title: "If a save request and reload request race, how will you avoid stale UI?",
      analogy: "If you mail two letters on different days but the slower one arrives after the faster, more recent one, and someone reads them in arrival order instead of send order, they'll believe the older news is the latest — a request-version counter is the postmark that lets you ignore the late-arriving stale letter.",
      reasoning: "A slower old request can overwrite newer state if responses are applied blindly.",
      approach: "Cancel outdated requests with switchMap, use version timestamps, or ignore responses older than the current state version.",
      code: "requestVersion = 0;\n\nload() {\n  const version = ++this.requestVersion;\n  this.api.load().subscribe(data => {\n    if (version === this.requestVersion) this.data.set(data);\n  });\n}"
    },
    {
      id: "deeply-nested-state-update",
      title: "How will you update deeply nested state without breaking change detection?",
      analogy: "Renovating one room and calling the whole house 'a new house' fools nobody who's watching for a new deed — mutating a nested object while keeping the outer reference the same is exactly that: the address didn't change, so nobody watching the address notices anything happened.",
      reasoning: "Mutating nested objects in place keeps references stable and can prevent OnPush/signals/selectors from noticing changes.",
      approach: "Copy only the path you change, normalize complex state, or use a helper library if needed.",
      code: "this.user.update(user => ({\n  ...user,\n  address: {\n    ...user.address,\n    city: 'Hyderabad'\n  }\n}));\n\n// For very nested data, consider normalizing by ID."
    },
    {
      id: "form-array-1000-items",
      title: "If a FormArray has 1,000 rows, how will you keep it usable?",
      analogy: "Handing someone 1,000 blank forms to fill out simultaneously guarantees most of them never get finished — editing one row at a time, like a bank teller serving one customer, is far more usable than rendering all 1,000 at once.",
      reasoning: "Rendering and validating 1,000 form rows at once can be slow and overwhelming.",
      approach: "Use pagination/virtual scrolling, edit one row at a time, validate visible/dirty rows first, and save in batches.",
      code: "// Prefer row editing over rendering 1000 controls at once.\neditingRow = signal<Row | null>(null);\n\nopenEditor(row: Row) {\n  this.editorForm.reset(row);\n  this.editingRow.set(row);\n}\n\nsaveRow() { return this.api.patchRow(this.editorForm.getRawValue()); }"
    },
    {
      id: "audit-log-infinite-scroll",
      title: "How will you build an audit log with infinite scrolling?",
      analogy: "Numbering library shelf positions ('page 4,502 of an ever-growing shelf') breaks the moment new books get added at the front — a cursor ('start after this specific book') keeps working no matter how much the shelf grows underneath you.",
      reasoning: "Audit logs can grow forever, so page-number pagination may become inefficient.",
      approach: "Use cursor-based pagination, append pages immutably, prevent duplicate loads, and show loading/end states.",
      code: "cursor = signal<string | null>(null);\nlogs = signal<AuditLog[]>([]);\nloading = signal(false);\n\nloadMore() {\n  if (this.loading()) return;\n  this.loading.set(true);\n  this.api.getLogs(this.cursor()).pipe(finalize(() => this.loading.set(false)))\n    .subscribe(page => {\n      this.logs.update(logs => [...logs, ...page.items]);\n      this.cursor.set(page.nextCursor);\n    });\n}"
    },
    {
      id: "multi-tenant-app",
      title: "If the app is multi-tenant, what frontend concerns will you handle?",
      analogy: "An apartment building with a single shared mailbox for every tenant would be chaos — multi-tenant apps need every request, cache entry, and permission check tagged with 'which apartment does this belong to' the same way mail needs a unit number.",
      reasoning: "Tenant context affects routing, API calls, branding, permissions, and caching.",
      approach: "Keep tenant ID in route/subdomain/context service, attach it in API calls, isolate caches per tenant, and reload permissions on tenant switch.",
      code: "export const tenantInterceptor: HttpInterceptorFn = (req, next) => {\n  const tenant = inject(TenantService).currentTenant();\n  return next(req.clone({ setHeaders: { 'X-Tenant-Id': tenant.id } }));\n};\n\ncacheKey = `${tenantId}:products`;"
    },
    {
      id: "micro-frontend-shared-auth",
      title: "In micro frontends, how will multiple Angular apps share auth state?",
      analogy: "Two departments in the same office building who each printed their own separate copy of the employee handbook will drift out of sync the moment one department updates a policy — sharing @angular/core and your AuthService as true singletons across micro frontends is making sure everyone reads from the same physical binder, not their own photocopy.",
      gotcha: "Without singleton sharing configured identically in every remote AND the shell, each micro frontend silently bundles its OWN copy of @angular/core and AuthService — setting a token in the shell updates a completely different object than the one the remote is reading from, and nothing throws an error to tell you.",
      reasoning: "When Module Federation loads remotes without explicit sharing rules, each remote bundles its own copy of @angular/core, @angular/common, and any services. This means the shell's AuthService and the remote's AuthService are different class instances in separate module scopes. Setting a token in the shell does not update the remote's copy. You cannot inject the shell's service into a remote component because Angular's injector trees are separate. This is the most common reason auth breaks silently in micro frontend setups.",
      approach: "Declare @angular/core, @angular/common, and @angular/router as singleton shared modules in the webpack federation config of every app — both shell and remotes. Keep AuthService in a shared library package that every app imports from the same source. The shell bootstraps Angular and owns the root injector; remotes must use the shell's module graph by setting singleton: true and strictVersion. For passing auth tokens across apps that truly cannot share a module, use a BroadcastChannel or a shared localStorage access pattern, but always re-validate on the backend.",
      code: "// webpack.config.js (shell and each remote must match)\nshared: share({\n  '@angular/core':   { singleton: true, strictVersion: true, requiredVersion: 'auto' },\n  '@angular/common': { singleton: true, strictVersion: true, requiredVersion: 'auto' },\n  '@angular/router': { singleton: true, strictVersion: true, requiredVersion: 'auto' },\n  '@myorg/auth-lib': { singleton: true, strictVersion: true, requiredVersion: 'auto' },\n})\n\n// Remote component — injects from the shared singleton\nimport { AuthService } from '@myorg/auth-lib';\n\n@Component({ ... })\nexport class RemoteDashboard {\n  auth = inject(AuthService); // same instance as shell\n  user = this.auth.currentUser; // reactive signal from shared lib\n}"
    },
    {
      id: "large-angular-build",
      title: "If Angular build time becomes very high, what will you check?",
      analogy: "Diagnosing a slow commute by guessing is far less useful than actually checking a traffic map — running a bundle analyzer before optimizing build time is looking at the map instead of guessing which road is jammed.",
      reasoning: "Build time grows from several compounding causes: large initial chunks force the compiler to type-check and tree-shake more code; importing from barrel index files (index.ts) causes TypeScript to parse entire libraries even when only one export is needed; source map generation for huge bundles is expensive; running tests in the same build step serializes work that could be parallel; and in monorepos, rebuilding unchanged projects is wasted effort. The fix depends on which of these is the actual bottleneck.",
      approach: "First measure before guessing: build with --stats-json and open the result in webpack-bundle-analyzer. Check which chunks are largest and which packages appear unexpectedly. Verify that all feature routes use lazy loading so they build as separate chunks. Replace whole-library imports with direct deep imports. Enable Angular build cache (enabled by default since v15 — confirm .angular/cache is not gitignored). In CI, cache the .angular/cache and node_modules directories between runs. For large monorepos, Nx adds affected-only rebuilds and distributed task execution so only changed projects rebuild.",
      code: "// Step 1: identify large chunks\n// ng build --configuration production --stats-json\n// npx webpack-bundle-analyzer dist/app/stats.json\n\n// Step 2: fix barrel import — before\nimport { formatDate } from 'date-fns'; // pulls in whole library\n// after\nimport formatDate from 'date-fns/formatDate';\n\n// Step 3: verify lazy loading\n{\n  path: 'reports',\n  loadChildren: () => import('./reports/routes').then(m => m.REPORT_ROUTES)\n  // each loadChildren creates a separate chunk\n}\n\n// Step 4: confirm cache is active\n// angular.json\n\"cli\": { \"cache\": { \"enabled\": true, \"path\": \".angular/cache\" } }\n\n// Step 5: Nx affected builds in CI\n// nx affected --target=build --base=origin/main"
    },
    {
      id: "slow-initial-load",
      title: "If the first load is slow, what Angular-specific things will you inspect?",
      analogy: "A restaurant that makes you wait for the entire menu to be printed before you can even see the appetizers is exactly what an app feels like when nothing is lazy-loaded or deferred.",
      reasoning: "Initial load depends on JavaScript size, critical rendering, network, images, and route strategy.",
      approach: "Lazy-load routes, defer non-critical components, optimize images, enable SSR/prerender where useful, and inspect bundle size.",
      code: "{ path: 'reports', loadChildren: () => import('./reports/routes').then(m => m.REPORT_ROUTES) }\n\n// Template:\n// @defer (on viewport) { <app-heavy-widget /> } @placeholder { <app-skeleton /> }"
    },
    {
      id: "change-api-contract",
      title: "If backend API response changes, how will you avoid breaking many components?",
      analogy: "A translator standing between two people who speak different languages means either speaker can change their own phrasing without the other having to relearn anything — a DTO-to-view-model mapping layer is that translator between your backend's shape and your components' expectations.",
      reasoning: "Components should not depend directly on unstable backend DTO shapes.",
      approach: "Map DTOs to frontend view models in services. Keep transformation logic in one place.",
      code: "getUser(): Observable<UserVm> {\n  return this.http.get<UserDto>('/api/user').pipe(\n    map(dto => ({\n      id: dto.user_id,\n      fullName: `${dto.first_name} ${dto.last_name}`,\n      isActive: dto.status === 'ACTIVE'\n    }))\n  );\n}"
    },
    {
      id: "invalid-api-data",
      title: "If API data is missing fields, how will the Angular app stay safe?",
      analogy: "A TypeScript type is a promise about the shape of data, not a guard standing at the border checking it — the compiler trusts the promise, but the actual JSON crossing the network at runtime can break that promise at any time.",
      reasoning: "TypeScript types do not validate runtime JSON. APIs can return invalid or partial data.",
      approach: "Validate at boundaries, use defensive mapping, show fallback UI, and avoid non-null assertions for API data.",
      code: "function toUserVm(dto: Partial<UserDto>): UserVm {\n  return {\n    id: String(dto.id ?? ''),\n    name: dto.name?.trim() || 'Unknown user',\n    email: dto.email ?? ''\n  };\n}\n\n// For stricter apps, use a runtime schema validator."
    },
    {
      id: "testing-autosave",
      title: "How will you test an autosave form?",
      analogy: "You can't verify a bakery's timer works correctly by standing there for the full 30 minutes on every test run — fake timers let you fast-forward the clock and check the bread came out exactly when it should have, in milliseconds of real test time.",
      reasoning: "Autosave has timing, validation, and API behavior. Manual testing misses race conditions.",
      approach: "Use fake timers, mock the API, change form values, advance debounce time, and assert only expected payloads are saved.",
      code: "it('autosaves after debounce', fakeAsync(() => {\n  component.form.patchValue({ name: 'Asha' });\n  tick(799);\n  expect(api.saveDraft).not.toHaveBeenCalled();\n  tick(1);\n  expect(api.saveDraft).toHaveBeenCalledWith(jasmine.objectContaining({ name: 'Asha' }));\n}));"
    },
    {
      id: "testing-interceptor",
      title: "How will you test an HTTP interceptor?",
      analogy: "An interceptor is like airport security scanning every single passenger regardless of flight — a bug there silently affects every request in the app, which is exactly why HttpTestingController lets you inspect the actual headers on the way out, not just trust the code looks right.",
      reasoning: "Interceptors are cross-cutting and can silently break auth, headers, and error handling.",
      approach: "Use HttpTestingController, make a request, inspect the outgoing headers, and flush responses/errors.",
      code: "service.getUsers().subscribe();\n\nconst req = httpMock.expectOne('/api/users');\nexpect(req.request.headers.get('Authorization')).toBe('Bearer token');\nreq.flush([]);"
    },
    {
      id: "secure-localstorage",
      title: "If tokens are stored in localStorage, what risk do you explain?",
      analogy: "Leaving your house key taped under the doormat is convenient right up until someone finds the doormat — localStorage is readable by any JavaScript that runs on the page, which means a single XSS hole hands an attacker the same convenient hiding spot.",
      gotcha: "\"We'll just store the token in localStorage, it's easier\" is the exact reasoning that turns a contained XSS bug into a full account takeover — an HttpOnly cookie for the refresh token is invisible to any injected script, localStorage is not.",
      reasoning: "localStorage is readable by JavaScript. If XSS happens, tokens can be stolen.",
      approach: "Prefer HttpOnly secure cookies for refresh tokens, short-lived access tokens, CSP, sanitization, and never bypass Angular sanitization casually.",
      code: "// Safer pattern:\n// Access token short-lived in memory.\n// Refresh token in HttpOnly Secure SameSite cookie.\n// Backend rotates refresh tokens and validates CSRF strategy."
    },
    {
      id: "xss-rich-html",
      title: "If users can enter rich HTML, how will you render it safely?",
      analogy: "bypassSecurityTrustHtml is Angular handing you the keys to its own safety system and saying 'you're on your own now' — appropriate for content YOU generated, reckless for anything a user typed.",
      reasoning: "Rendering user HTML can introduce XSS. Angular sanitizes, but bypassing sanitizer is dangerous.",
      approach: "Sanitize on the server, sanitize on the client, allowlist tags, and avoid bypassSecurityTrustHtml unless content is fully trusted.",
      code: "// Avoid this for user content:\n// this.sanitizer.bypassSecurityTrustHtml(userHtml)\n\n// Prefer sanitized/allowlisted content from backend or a trusted sanitizer pipeline."
    },
    {
      id: "i18n-dynamic-content",
      title: "If the app supports multiple languages and dynamic API content, what will you do?",
      analogy: "The words printed on a restaurant's menu (static UI text) and the dish descriptions a chef writes fresh each day (dynamic API content) go through completely different translation pipelines even though they end up on the same page.",
      reasoning: "Static labels and backend content have different translation lifecycles.",
      approach: "Use Angular localize for app shell/static text, request localized API content with locale, and format dates/currency with locale pipes.",
      code: "providers: [\n  { provide: LOCALE_ID, useValue: currentLocale }\n]\n\nthis.http.get('/api/products', { headers: { 'Accept-Language': currentLocale } });"
    },
    {
      id: "dark-mode-design-system",
      title: "If the app needs dark mode, how will you design it?",
      analogy: "Repainting one room at a time with whatever color happens to be on hand, instead of picking a coordinated palette up front, is what hardcoding dark-mode colors per component looks like — CSS variables are the coordinated palette that lets the whole house repaint itself in one switch flip.",
      reasoning: "Dark mode should not be hardcoded per component. It needs consistent design tokens.",
      approach: "Use CSS variables/design tokens, set theme class at root, persist preference, and respect system preference.",
      code: ":root { --bg: #ffffff; --text: #111827; }\n.dark { --bg: #111827; --text: #f9fafb; }\n\n<body [class.dark]=\"theme.isDark()\">"
    },
    {
      id: "reusable-table-design",
      title: "How will you design a reusable table used by many screens?",
      analogy: "A rental car should drive well for whoever rents it next, not be customized to only fit the previous renter's seat position and mirrors — a reusable table component should stay presentational, letting each feature that rents it bring its own data and business logic.",
      reasoning: "A reusable table can become too generic and impossible to maintain if it owns business logic.",
      approach: "Keep it presentational: columns, rows, sorting events, pagination events. Let feature containers handle data fetching and permissions.",
      code: "@Input() columns!: ColumnDef[];\n@Input() rows!: unknown[];\n@Output() sortChange = new EventEmitter<Sort>();\n@Output() pageChange = new EventEmitter<PageEvent>();\n\n// Feature component handles API and passes rows down."
    },
    {
      id: "form-error-summary",
      title: "For a huge form, how will you help users find validation errors?",
      analogy: "A form with 40 fields and 6 scattered red asterisks is like being told 'something is wrong somewhere in this building' with no room number — an error summary that jumps you to the first invalid field is the room number.",
      reasoning: "With many fields, inline errors alone are not enough. Users need navigation to errors.",
      approach: "Show an error summary, focus the first invalid field on submit, and group errors by section.",
      code: "submit() {\n  if (this.form.invalid) {\n    this.form.markAllAsTouched();\n    const firstInvalid = document.querySelector('[aria-invalid=\"true\"]') as HTMLElement;\n    firstInvalid?.focus();\n    return;\n  }\n}"
    },
    {
      id: "production-debugging",
      title: "If users report a production-only bug, how will you debug it?",
      analogy: "A doctor diagnosing a patient's symptoms only from a photograph, with no chart, no history, and no ability to ask questions, is what debugging production without structured logs and source maps feels like — you're guessing at causes you could otherwise just read directly.",
      reasoning: "Production bugs that cannot be reproduced locally usually fall into one of four categories: data-dependent (the user's specific record triggers an edge case), environment-dependent (a missing config key, different API version, or CDN caching issue), permission-dependent (the user's role hits a code path never tested), or timing-dependent (race conditions that only appear under real network latency). Minification also hides stack traces, and Angular production mode disables debugging APIs. Most of these cannot be reproduced by simply running the dev server.",
      approach: "First collect: check existing logs, error monitoring (Sentry/Datadog), and the specific user's role, browser, and region. Try to reproduce with the exact same account and data in staging. If timing is suspected, add temporary verbose logging in staging and simulate with slow network in DevTools. Use source maps — upload them to your error tracker but keep them private so minified production stacks resolve to readable lines. Once the root cause is found, write a failing unit or integration test before fixing so it never regresses. Always add structured context to error logs: route, user role, correlation ID, API error codes — never tokens or PII.",
      code: "// In GlobalErrorHandler\nhandleError(error: unknown) {\n  const ctx = {\n    route: this.router.url,\n    userId: this.auth.userId(),    // anonymized or hashed\n    role: this.auth.role(),\n    correlationId: this.tracing.currentId(),\n    message: error instanceof Error ? error.message : String(error)\n  };\n  this.errorReporter.capture(error, ctx); // e.g. Sentry.captureException\n  console.error('[App Error]', ctx);\n}\n\n// In environment-specific config\n// staging: uploadSourceMaps: true, sampleRate: 1.0\n// production: uploadSourceMaps: true (maps kept private), sampleRate: 0.1\n\n// Once cause found — write the test first:\nit('handles null product id gracefully', () => {\n  expect(() => component.loadProduct(null)).not.toThrow();\n  expect(component.error()).toBeTruthy();\n});"
    },
    {
      id: "state-management-architecture",
      title: "How will you decide between NgRx, Signals, and a plain service for state management?",
      analogy: "Bringing a shipping crane to move a single houseplant is exactly as wrong as trying to move an entire warehouse by hand — NgRx for a three-screen CRUD app and a bare signal for twenty interconnected feature modules are both the wrong tool for the job's actual size.",
      reasoning: "Choosing the wrong state layer is expensive to reverse. Using NgRx for a three-screen CRUD app adds boilerplate and maintenance overhead with no real benefit. Using a plain service signal for state that is shared across twenty feature modules with complex cross-slice dependencies leads to spaghetti updates and impossible-to-trace side effects. The right tool depends on scope, complexity, and team size — not on what the previous project used.",
      approach: "Use a signal inside the component itself for UI-only state (open/closed, selected tab, loading flag). Use an injectable service with signals for state shared across a small number of related components in the same feature. Use NgRx with the Signal Store (@ngrx/signals) for state that crosses many features, needs time-travel debugging, has complex derived data, or must be testable in complete isolation. Avoid mixing paradigms in the same feature — pick one pattern and stay consistent per slice.",
      code: "// Level 1: local component state\nclass ProductCard {\n  isExpanded = signal(false);\n  toggle() { this.isExpanded.update(v => !v); }\n}\n\n// Level 2: shared feature-level service\n@Injectable({ providedIn: 'root' })\nclass CartService {\n  private items = signal<CartItem[]>([]);\n  readonly total = computed(() => this.items().reduce((s, i) => s + i.price, 0));\n  add(item: CartItem) { this.items.update(list => [...list, item]); }\n}\n\n// Level 3: NgRx Signal Store for cross-feature / complex state\nexport const OrderStore = signalStore(\n  withState<OrderState>({ orders: [], filter: 'all', loading: false }),\n  withComputed(({ orders, filter }) => ({\n    filteredOrders: computed(() => orders().filter(o => filter() === 'all' || o.status === filter()))\n  })),\n  withMethods((store, api = inject(OrderApi)) => ({\n    load: rxMethod<void>(pipe(tap(() => patchState(store, { loading: true })),\n      switchMap(() => api.list().pipe(tapResponse({ next: orders => patchState(store, { orders, loading: false }), error: () => patchState(store, { loading: false }) }))))\n    )\n  }))\n);"
    },
    {
      id: "session-timeout-handling",
      title: "How will you handle session timeout gracefully while the user is working?",
      analogy: "A library that locks its doors at closing time without any 5-minute warning bell just to shove everyone out, papers still on the table, is exactly what an abrupt session-expiry redirect feels like to someone mid-form — the warning countdown is the bell, and the draft save is letting them grab their papers on the way out.",
      reasoning: "Session expiry while a user is actively filling a form is one of the most frustrating UX failures in enterprise apps. If the app simply redirects to login without saving work, the user loses progress and trust. But silently keeping an expired session open is a security problem. The challenge is detecting inactivity accurately, warning the user before it is too late, persisting their work, and redirecting cleanly without exposing sensitive state.",
      approach: "Track the last user interaction time (mouse, keyboard, touch) and run a timer that compares against the session expiry. At two minutes before timeout, show a modal warning with a countdown and a 'Stay logged in' button that refreshes the token. If the user does not respond, save a local draft of any active forms, then redirect to the login page with a returnUrl parameter so they can continue after re-authentication. On login, restore the draft. Implement this as a shared service initialized in the root shell, not per-component.",
      code: "@Injectable({ providedIn: 'root' })\nexport class SessionWatcherService {\n  private lastActivity = Date.now();\n  private readonly WARNING_MS = 13 * 60 * 1000;  // warn at 13 min\n  private readonly TIMEOUT_MS  = 15 * 60 * 1000;  // expire at 15 min\n\n  constructor() {\n    ['click','keydown','touchstart'].forEach(evt =>\n      window.addEventListener(evt, () => this.lastActivity = Date.now(), { passive: true })\n    );\n    interval(30_000).pipe(takeUntilDestroyed()).subscribe(() => this.check());\n  }\n\n  private check() {\n    const idle = Date.now() - this.lastActivity;\n    if (idle >= this.TIMEOUT_MS) {\n      this.draftStore.saveAll();\n      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url, reason: 'timeout' } });\n    } else if (idle >= this.WARNING_MS) {\n      this.dialog.open(SessionExpiryWarningComponent, {\n        data: { secondsLeft: Math.round((this.TIMEOUT_MS - idle) / 1000) }\n      });\n    }\n  }\n}"
    },
    {
      id: "request-deduplication",
      title: "If the same API endpoint is called by multiple components loading at once, how will you avoid duplicate requests?",
      analogy: "Five people in the same office each independently calling the same supplier to ask the exact same question, at the exact same moment, is wasted effort the supplier shouldn't have to deal with five times — sharing one in-flight request lets everyone get the same answer from a single call.",
      reasoning: "When several components initialize simultaneously — think a dashboard with independent KPI cards each injecting the same service — they all independently trigger the same HTTP call. At five components, that is five identical requests hitting the backend at the same moment. This wastes network bandwidth, hits rate limits faster, and can cause race conditions if each component independently stores the response. The problem is invisible in development because usually only one component is on screen at a time.",
      approach: "Keep a map of in-flight Observables keyed by request identity (URL + serialized params). On the first call, create the Observable and cache it with shareReplay(1). Every subsequent caller within the same tick receives the same Observable and shares the single HTTP response. Once the response arrives, the cached entry expires (refCount: true) so the next real call after the current tick goes fresh. This is different from caching — it only deduplicates concurrent calls, not repeated calls over time.",
      code: "@Injectable({ providedIn: 'root' })\nexport class DeduplicatingApiService {\n  private inflight = new Map<string, Observable<unknown>>();\n\n  get<T>(url: string, params?: Record<string, string>): Observable<T> {\n    const key = url + JSON.stringify(params ?? {});\n    if (!this.inflight.has(key)) {\n      const req$ = this.http.get<T>(url, { params }).pipe(\n        shareReplay({ bufferSize: 1, refCount: true }),\n        finalize(() => this.inflight.delete(key))\n      );\n      this.inflight.set(key, req$);\n    }\n    return this.inflight.get(key) as Observable<T>;\n  }\n}\n\n// All three widgets share ONE request:\n// widget-a: this.dedupe.get('/api/summary') → fires HTTP\n// widget-b: this.dedupe.get('/api/summary') → joins same Observable\n// widget-c: this.dedupe.get('/api/summary') → joins same Observable"
    },
    {
      id: "change-detection-debugging",
      title: "If a component re-renders too often and the page is slow, how will you find the cause?",
      analogy: "Diagnosing an engine problem by popping the hood and listening is a lot slower and less accurate than plugging in a real diagnostic scanner — Angular DevTools' Profiler is that scanner for figuring out exactly which component is being checked too often and why.",
      reasoning: "With Default change detection, Angular checks every component in the tree on every event, timer tick, or Promise resolution — even if nothing relevant changed. A single setInterval in a top-level component causes the entire tree to be checked repeatedly. With OnPush, the opposite problem appears: state changes silently have no effect if they bypass the signal/async pipe path. Angular DevTools profiles show which components checked, how long each took, and how many times per second — without this data, optimization is guesswork.",
      approach: "Open Angular DevTools in Chrome and go to the Profiler tab. Record while interacting with the slow UI. Look for components that appear in every change detection cycle with high check counts. Common causes: an Observable from a non-signal source subscribed imperatively instead of via async pipe; a getter or method in the template that triggers side effects; a third-party library using setTimeout/setInterval outside NgZone; or a mutable object being mutated in place on OnPush components. Fix by converting to signals, moving expensive computations to computed(), running noisy third-party code outside Angular with ngZone.runOutsideAngular(), and switching affected components to OnPush.",
      code: "// Step 1: identify in Angular DevTools Profiler\n// High 'Check' count on a component → check why it's dirty\n\n// Step 2: common cause — method call in template\n// BAD: Angular calls this every CD cycle\n<div>{{ getFormattedPrice(product) }}</div>\n\n// GOOD: computed runs only when product changes\nformattedPrice = computed(() => formatPrice(this.product()));\n<div>{{ formattedPrice() }}</div>\n\n// Step 3: noisy third-party timer causing CD\n// BAD: Zone.js patches setTimeout, triggers CD\nsetTimeout(() => this.ticker++, 1000);\n\n// GOOD: run outside Angular zone\nconstructor(private ngZone: NgZone) {\n  this.ngZone.runOutsideAngular(() => {\n    setInterval(() => {\n      this.ngZone.run(() => this.importantSignal.set(Date.now()));\n    }, 1000);\n  });\n}"
    },
    {
      id: "concurrent-edits-conflict",
      title: "If two users edit the same record simultaneously, how will you handle conflicts?",
      analogy: "Two editors typing into the same physical document at the same time, where whoever saves last silently erases the other's work with no warning, is the default behavior most PATCH APIs quietly ship with — a version check turns that silent overwrite into a visible, resolvable conflict.",
      reasoning: "Last-write-wins is the silent default for most PATCH APIs: whoever saves last simply overwrites the other user's changes. This is dangerous for financial records, medical data, or collaborative documents. The user who saved first sees their changes disappear with no notification. At scale, this happens constantly — two support agents editing the same customer profile, two managers approving the same budget line. The backend must be the authority; the frontend's job is to make the conflict visible and give the user a meaningful choice.",
      approach: "Include an entity version or updatedAt timestamp in every PATCH request. The backend rejects the save with 409 Conflict if the version does not match the current stored version. On 409, the frontend fetches the server's current version and shows a side-by-side diff — the user's unsaved changes alongside what was saved by the other user. Give three options: overwrite with their version, keep the server version (discard their work), or manually merge. For lower-stakes data, a simple toast warning 'This record was updated by another user. Refresh to see changes?' is acceptable.",
      code: "// Backend contract: PATCH /api/orders/:id\n// Request body includes { ...changes, version: number }\n// Response: 200 OK with updated entity, or 409 Conflict\n\nsave(changes: Partial<Order>) {\n  return this.http.patch<Order>(`/api/orders/${this.orderId}`, {\n    ...changes,\n    version: this.currentVersion()\n  }).pipe(\n    tap(updated => {\n      this.order.set(updated);\n      this.currentVersion.set(updated.version);\n    }),\n    catchError(err => {\n      if (err.status === 409) {\n        // Fetch server's latest and show conflict resolution UI\n        return this.api.getOrder(this.orderId).pipe(\n          tap(serverVersion => this.showConflictDialog(serverVersion, changes))\n        );\n      }\n      return throwError(() => err);\n    })\n  );\n}"
    },
    {
      id: "component-communication-strategy",
      title: "How will you choose the right communication pattern between components?",
      analogy: "A workplace where every message, no matter how small, has to go through the CEO's office is obviously the wrong org chart — matching the communication pattern (input/output, shared service, or root store) to the actual relationship between components is choosing the right reporting line for each conversation.",
      reasoning: "Angular offers many ways for components to talk: @Input/@Output, shared services, signals, EventEmitter, Content Projection, ViewChild, and route state. Using the wrong one creates tight coupling, makes components untestable in isolation, or creates invisible data flows that are hard to trace. The pattern should match the relationship between components — parent/child, sibling, distant, or cross-feature.",
      approach: "For direct parent-to-child data flow, use @Input (or the new input() function). For child-to-parent events, use @Output with EventEmitter or the new output() function. For sibling components with no shared ancestor, use a shared service with a signal. For deeply nested components that need the same value without prop-drilling through every level, use inject() with a service or the new linkedSignal / input signal patterns. For cross-feature state that many components need, keep it in a root-level service or NgRx store. Avoid ViewChild for inter-component communication — it creates tight structural coupling.",
      code: "// Parent → Child: @Input\n@Component({ template: '<app-card [product]=\"selectedProduct()\" />' })\nclass ListPage { selectedProduct = signal<Product | null>(null); }\n\n// Child → Parent: @Output\n@Component({ ... })\nclass ProductCard {\n  addToCart = output<Product>();\n  onAdd(p: Product) { this.addToCart.emit(p); }\n}\n\n// Siblings or distant: shared service signal\n@Injectable({ providedIn: 'root' })\nclass FilterService {\n  activeFilter = signal<string>('all');\n}\n// Both FilterPanel and ProductList inject FilterService\n\n// Avoid prop-drilling: provide service at feature level\n@Component({\n  providers: [CheckoutService]  // scoped to this component subtree\n})\nclass CheckoutShell {}\n// All children inject CheckoutService from this scope"
    },
    {
      id: "testing-strategy",
      title: "How will you decide what to unit test, what to integration test, and what to E2E test?",
      analogy: "A pyramid is wide at the base and narrow at the top for a structural reason — many fast, cheap unit tests at the foundation, fewer integration tests in the middle, and only a handful of slow, expensive E2E tests at the very top, because inverting that shape makes the whole thing slow and wobbly.",
      reasoning: "Testing everything as unit tests misses wiring bugs — a correctly implemented component can still fail because inputs are bound wrong, a service token is missing, or a resolver returns the wrong shape. Testing everything as E2E tests makes the suite slow, brittle, and expensive to maintain. A common mistake is writing no tests at all until a bug is found, then writing a test that only covers the exact line that broke, leaving all the adjacent paths untested. The pyramid model — many unit, moderate integration, few E2E — exists because each level has a distinct cost-benefit profile.",
      approach: "Unit test pure logic: validators, pipes, utility functions, computed signal derivations, and service methods that manipulate state without HTTP. Integration test components with TestBed: render the component with real child components and mock only external HTTP and services. This catches template binding errors, guard behavior, and change detection issues that unit tests miss. E2E test only the critical user journeys: login, checkout, key workflows. Run E2E in CI but do not block every PR on it. Write a failing test the moment a bug is reported — before the fix — to prove the bug exists and prevent regression.",
      code: "// Unit: pure logic — fast, no Angular overhead\ndescribe('formatCurrency pipe', () => {\n  it('formats INR correctly', () => {\n    expect(pipe.transform(1500, 'INR')).toBe('₹1,500.00');\n  });\n});\n\n// Integration: TestBed — catches template and DI issues\ndescribe('ProductCardComponent', () => {\n  it('emits addToCart when button clicked', async () => {\n    const { fixture, component } = await render(ProductCardComponent, {\n      inputs: { product: mockProduct }\n    });\n    const spy = jest.spyOn(component.addToCart, 'emit');\n    await userEvent.click(screen.getByRole('button', { name: /add to cart/i }));\n    expect(spy).toHaveBeenCalledWith(mockProduct);\n  });\n});\n\n// E2E: Playwright — critical path only\ntest('user can complete checkout', async ({ page }) => {\n  await page.goto('/products');\n  await page.click('[data-testid=add-to-cart]');\n  await page.click('[data-testid=checkout]');\n  await expect(page.locator('[data-testid=order-confirmation]')).toBeVisible();\n});"
    },
    {
      id: "offline-first-pwa",
      title: "How will you design an Angular app that works offline?",
      analogy: "A ship's crew that keeps working through a satellite outage — logging fuel readings on paper, syncing them all once the signal returns — treats connectivity as a bonus, not a requirement. That's the offline-first mindset: the app should keep functioning, and quietly catch up later.",
      reasoning: "An offline-first app treats the network as an enhancement, not a requirement. Users in areas with poor connectivity, corporate VPNs that drop intermittently, or mobile devices that switch between WiFi and 4G should not lose their work or see blank screens when the network is unavailable. Service workers can cache static assets and API responses, but they do not handle write operations — a form submission while offline must be stored and replayed when connectivity returns, which is a fundamentally different problem from read caching.",
      approach: "Use @angular/pwa for the service worker setup — it handles static asset caching and precaching the app shell automatically. For API read caching, configure the ngsw-config.json data groups with appropriate strategies: freshness for critical data, performance for stable data. For write operations (form submissions, mutations), use a background sync queue: save the pending request to IndexedDB when offline, register a Background Sync event, and replay it when the browser regains connectivity. Show the user a clear offline indicator and optimistic local state so they know their action was recorded even if not yet sent.",
      code: "// ngsw-config.json — read caching strategies\n{\n  \"dataGroups\": [\n    {\n      \"name\": \"product-catalog\",\n      \"urls\": [\"/api/products\", \"/api/categories\"],\n      \"cacheConfig\": { \"strategy\": \"performance\", \"maxAge\": \"1d\", \"maxSize\": 100 }\n    },\n    {\n      \"name\": \"user-profile\",\n      \"urls\": [\"/api/me\"],\n      \"cacheConfig\": { \"strategy\": \"freshness\", \"timeout\": \"3s\", \"maxAge\": \"1h\" }\n    }\n  ]\n}\n\n// Write queue for offline mutations\n@Injectable({ providedIn: 'root' })\nexport class OfflineQueueService {\n  private db = openDB('offline-queue', 1, { upgrade: db => db.createObjectStore('ops', { autoIncrement: true }) });\n\n  async enqueue(op: PendingOperation) {\n    await (await this.db).add('ops', { ...op, timestamp: Date.now() });\n  }\n\n  async replayAll() {\n    const db = await this.db;\n    const ops: PendingOperation[] = await db.getAll('ops');\n    for (const op of ops) {\n      await lastValueFrom(this.http.request(op.method, op.url, { body: op.body }));\n      await db.delete('ops', op.id);\n    }\n  }\n}\n\n// In app shell\nwindow.addEventListener('online', () => this.offlineQueue.replayAll());"
    }
  ];

  window.MODULES.push({
    "id": "logical-reasoning",
    "title": "Logical Reasoning Scenarios",
    "icon": "bi bi-puzzle",
    "questions": scenarios.map(function (scenario) {
      const analogyHtml = scenario.analogy ? `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">${scenario.analogy}</p>
          </div>
        </div>
      ` : '';
      const gotchaHtml = scenario.gotcha ? `
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">${scenario.gotcha}</p>
          </div>
        </div>
      ` : '';
      return {
        "id": scenario.id,
        "title": scenario.title,
        "explanation": `
          ${analogyHtml}
          <p>${scenario.reasoning}</p>
          <h3>Practical Approach</h3>
          <p>${scenario.approach}</p>
          ${gotchaHtml}
        `,
        "code": scenario.code,
        "language": "typescript"
      };
    })
  });
})();
