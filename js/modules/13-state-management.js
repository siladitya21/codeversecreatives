window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "state-management",
  "title": "State Management",
  "icon": "bi bi-diagram-3",
  "questions": [
    {
      id: "angular-22-standard-state-upgrade",
      title: "Angular 22 standard for state management",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Choosing a wallet for your money. A coin purse (a signal in a service) is perfect for a few coins you check often. A bank with tellers, forms, and an audit trail (NgRx) is overkill for lunch money — but exactly right when many people need to see the same balance, want a paper trail of every transaction, and need to reverse a mistake. Pick the wallet that matches how much money and how many hands are involved, not the fanciest one available.</p>
          </div>
        </div>
        <p>Angular 22-ready state management starts with the simplest correct store: signals in a service for local or feature state, RxJS for async stream orchestration, and NgRx or another store library when you need strict event history, entity management, devtools, effects, or large-team conventions.</p>
        <h3>Modern state checklist</h3>
        <ul>
          <li>Use private writable signals and expose readonly signals or computed values.</li>
          <li>Keep writes behind methods such as <code>addItem()</code> or <code>loadUser()</code>.</li>
          <li>Use immutable updates so change detection and debugging stay predictable.</li>
          <li>Scope feature state with route-level providers when it should reset per feature.</li>
          <li>Use NgRx when state transitions, effects, and debugging need stronger structure.</li>
        </ul>
      `,
      code: `import { Injectable, computed, signal } from '@angular/core';

@Injectable()
export class CartState {
  private readonly itemsState = signal<CartItem[]>([]);

  readonly items = this.itemsState.asReadonly();
  readonly count = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );
  readonly total = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  add(item: CartItem): void {
    this.itemsState.update(items => [...items, item]);
  }

  remove(id: number): void {
    this.itemsState.update(items => items.filter(item => item.id !== id));
  }
}

// Route-scoped state:
// { path: 'checkout', providers: [CartState], loadComponent: ... }`,
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Which State Tool Fits</p><div class=\"grid grid-cols-1 md:grid-cols-3 gap-3 text-xs\"><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-emerald-700\">Component-local</p><p class=\"text-slate-500 mt-1\">signal() directly in the component</p></div><div class=\"bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-amber-700\">Feature-shared</p><p class=\"text-slate-500 mt-1\">signal-based service, route-provided</p></div><div class=\"bg-rose-50 border-2 border-rose-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-rose-700\">App-wide, complex</p><p class=\"text-slate-500 mt-1\">NgRx: actions, effects, devtools</p></div></div></div>"
    },
    {
      "id": "what-is-state-management",
      "title": "What is state management?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A family group chat versus five separate one-on-one texts about the same dinner plan. With five separate conversations, everyone ends up with a slightly different idea of what time dinner is. A group chat (a single source of truth) means everyone sees the same message and the same updates, at the same time.</p>
          </div>
        </div>
        <p><strong>State</strong> is any data your application needs to remember and display — the logged-in user, a shopping cart, a list of products, whether a sidebar is open. <strong>State management</strong> is how you store, update, and share that data across components.</p>
        <h3>Why it becomes hard</h3>
        <p>In a small app with 3–4 components, you can pass data around with <code>@Input()</code> and <code>@Output()</code>. But as an app grows to 50 components across many routes, this becomes unmanageable:</p>
        <ul>
          <li><strong>Prop drilling</strong> — passing data through 4–5 levels of components just to reach the one that needs it</li>
          <li><strong>Out-of-sync views</strong> — two unrelated components both display the cart count, but they each maintain their own copy</li>
          <li><strong>Unpredictable mutations</strong> — multiple components modify the same data in different ways, making bugs hard to trace</li>
        </ul>
        <h3>The solution: a single source of truth</h3>
        <p>Store shared state in one central place (a service, a store library, or Signals). Components read from this central state and dispatch updates through it. Any component that subscribes to the state automatically re-renders when it changes.</p>
      `,
      "code": "// ─── Problem: prop drilling ────────────────────────────────────\n// AppComponent → LayoutComponent → SidebarComponent → CartBadgeComponent\n// CartBadgeComponent needs the cart count — it travels through 3 parents.\n// If any intermediate component doesn't use it, it still has to pass it down.\n\n// ─── Solution: signal-based service (single source of truth) ───\n@Injectable({ providedIn: 'root' })\nexport class CartService {\n  private readonly itemsState = signal<CartItem[]>([]);\n  readonly items = this.itemsState.asReadonly();\n  readonly count = computed(() => this.items().length);\n\n  add(item: CartItem) {\n    this.itemsState.update(items => [...items, item]);\n  }\n\n  remove(id: string) {\n    this.itemsState.update(items => items.filter(i => i.id !== id));\n  }\n}\n\n// ANY component anywhere in the tree can inject CartService and:\n// — read: cartService.count()\n// — update: cartService.add(item)\n// No prop drilling needed.",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Prop Drilling vs Single Source of Truth</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-rose-50 border-2 border-rose-200 rounded-xl p-3\"><p class=\"font-bold text-rose-700 text-center mb-2\">Prop drilling</p><div class=\"flex flex-col items-center gap-1 font-mono text-[11px]\"><div>AppComponent</div><div class=\"text-slate-300\">&darr;</div><div>LayoutComponent</div><div class=\"text-slate-300\">&darr;</div><div>SidebarComponent</div><div class=\"text-slate-300\">&darr;</div><div>CartBadgeComponent</div></div></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">Shared service</p><div class=\"flex flex-col items-center gap-2\"><div class=\"bg-emerald-600 text-white rounded px-2 py-1 font-mono text-[11px]\">CartService</div><div class=\"text-slate-300\">&#8593; &#8595; inject() from anywhere</div><div class=\"font-mono text-[11px]\">Any component, any depth</div></div></div></div></div>"
    },
    {
      "id": "shallow-copy-deep-copy-immutability",
      "title": "Shallow copy vs deep copy - why immutability matters in Angular",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Photocopying a folder of documents. A shallow copy photocopies the folder cover but hands you the exact same paper documents inside — scribble on one and the "original" folder's papers change too, because they're the same sheets. A deep copy runs every single page through the photocopier as well, so nothing you do to your copy ever touches the original.</p>
          </div>
        </div>
        <p>A lot of Angular bugs come from misunderstanding object references. Arrays and objects in JavaScript are reference values. If two variables point to the same nested object, changing one changes what the other sees. This matters in Angular because signals, NgRx selectors, <code>OnPush</code>, and zoneless change detection all work best when state updates create clear new references.</p>
        <h3>Shallow copy</h3>
        <p>A shallow copy creates a new outer object or array, but nested objects are still shared. Spread syntax (<code>{ ...obj }</code>, <code>[...arr]</code>), <code>Object.assign()</code>, <code>Array.slice()</code>, and <code>Array.from()</code> are shallow. This is perfect when you only change top-level fields, but it is not enough when you mutate nested fields.</p>
        <h3>Deep copy</h3>
        <p>A deep copy creates new copies of nested objects too. Use <code>structuredClone()</code> for plain serializable data like API DTOs, arrays, maps, sets, dates, and nested objects. Avoid <code>JSON.parse(JSON.stringify(value))</code> as a default because it loses dates, undefined values, functions, maps, sets, and many special types.</p>
        <h3>Angular rule of thumb</h3>
        <p>For state updates, do not deep-clone everything by habit. It is usually better to copy only the path you change. That keeps updates predictable and avoids unnecessary work. In signals, call <code>set()</code> or <code>update()</code> with a new reference. In NgRx reducers, return new state from pure functions and never mutate the existing state.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text"><code>const copy = { ...original }</code> feels safe because it "made a copy," but any nested object inside <code>copy</code> is still the exact same object as in <code>original</code>. Mutating <code>copy.address.city</code> silently mutates <code>original.address.city</code> too — a classic source of "I didn't touch that state, why did it change?" bugs.</p>
          </div>
        </div>
      `,
      "code": "interface Address { city: string; pincode: string; }\ninterface User { id: number; name: string; address: Address; }\n\nconst user: User = {\n  id: 1,\n  name: 'Asha',\n  address: { city: 'Pune', pincode: '411001' }\n};\n\n// ---- Shallow copy: only the outer object is new ----\nconst shallow = { ...user };\nshallow.name = 'Asha Sharma';      // OK: top-level field is separate\nshallow.address.city = 'Mumbai';   // Problem: user.address is also changed\n\nconsole.log(user.address.city);    // 'Mumbai'\n\n// ---- Deep copy: nested objects are also copied ----\nconst deep = structuredClone(user);\ndeep.address.city = 'Bengaluru';\nconsole.log(user.address.city);    // still 'Mumbai'\n\n// ---- Best Angular pattern: copy only the changed path ----\nconst movedUser: User = {\n  ...user,\n  address: {\n    ...user.address,\n    city: 'Hyderabad'\n  }\n};\n\n// ---- Signals: update with a new reference ----\nimport { signal } from '@angular/core';\n\nconst users = signal<User[]>([user]);\n\nfunction renameUser(id: number, name: string): void {\n  users.update(current =>\n    current.map(u => u.id === id ? { ...u, name } : u)\n  );\n}\n\nfunction updateCity(id: number, city: string): void {\n  users.update(current =>\n    current.map(u =>\n      u.id === id\n        ? { ...u, address: { ...u.address, city } }\n        : u\n    )\n  );\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Shallow vs Deep Copy</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-rose-50 border-2 border-rose-200 rounded-xl p-3\"><p class=\"font-bold text-rose-700 text-center mb-2\">{ ...user } — shallow</p><p class=\"text-slate-600 text-center\">New outer object, but <code>address</code> is still the SAME shared object</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">structuredClone(user) — deep</p><p class=\"text-slate-600 text-center\">New outer object AND a new, independent <code>address</code> object</p></div></div></div>"
    },
    {
      "id": "what-is-ngrx",
      "title": "What is NgRx?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A courtroom with strict procedure. Nobody is allowed to just walk up and change the official record (the Store) directly. You have to formally file a request (dispatch an Action), a judge applies the rules to decide the new official record (a Reducer, which never bends the rules mid-case), and any real-world consequences — subpoenas, notifications — happen through a separate bailiff process (Effects). It's slower than shouting across the room, but every decision is on the record and can be replayed.</p>
          </div>
        </div>
        <p><strong>NgRx</strong> is the most widely used state management library for Angular. It implements the <strong>Redux pattern</strong> using RxJS Observables.</p>
        <h3>Core idea</h3>
        <p>All application state lives in a single immutable object called the <strong>Store</strong>. State can only be changed by dispatching an <strong>Action</strong>. A <strong>Reducer</strong> is a pure function that receives the current state and an action, and returns a new state. This makes state changes predictable, traceable, and testable.</p>
        <h3>The four building blocks</h3>
        <ul>
          <li><strong>Store</strong> — the single object holding all state; an Observable you can subscribe to</li>
          <li><strong>Actions</strong> — plain objects describing what happened: <code>{ type: '[Cart] Add Item', item: {...} }</code></li>
          <li><strong>Reducers</strong> — pure functions: <code>(currentState, action) => newState</code></li>
          <li><strong>Effects</strong> — handle side effects (API calls, localStorage, routing) triggered by actions</li>
        </ul>
        <h3>When to use NgRx</h3>
        <p>NgRx adds boilerplate. Use it when your app has complex shared state that is accessed by many unrelated components, has many async operations that interact with each other, or when your team needs strong debugging tools (time-travel with Redux DevTools). For simpler apps, a signal-based service is often enough.</p>
      `,
      "code": "// NgRx in 30 seconds — a mental model\n\n// 1. State lives in one place — the Store:\n//    { users: [], loading: false, error: null }\n\n// 2. To change state, you dispatch an Action (just a plain event):\n//    store.dispatch(loadUsers());\n\n// 3. A Reducer responds to the action and returns NEW state (never mutates):\n//    on(loadUsers, state => ({ ...state, loading: true }))\n\n// 4. An Effect handles the API call and dispatches a result action:\n//    loadUsers$ → http.get('/api/users') → dispatch(loadUsersSuccess({ users }))\n\n// 5. Components SELECT data from the store (read-only):\n//    this.users$ = store.select(selectAllUsers);\n\n// Everything flows in ONE direction:\n// Component → Action → Reducer → Store → Selector → Component",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">The One-Way NgRx Loop</p><div class=\"flex flex-wrap items-center justify-center gap-2 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 font-semibold text-indigo-700\">Component</div><span class=\"text-slate-300\">dispatch &rarr;</span><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 font-semibold text-amber-700\">Action</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 font-semibold text-emerald-700\">Reducer</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-rose-50 border-2 border-rose-200 rounded-lg px-3 py-2 font-semibold text-rose-700\">Store</div><span class=\"text-slate-300\">select &rarr;</span><div class=\"bg-purple-50 border-2 border-purple-200 rounded-lg px-3 py-2 font-semibold text-purple-700\">Component</div></div></div>"
    },
    {
      "id": "actions-reducers-effects",
      "title": "What are actions, reducers, and effects?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A restaurant order ticket system. The action is the ticket a waiter clips to the wheel: "Table 5 wants a burger" — a plain fact, no cooking happens yet. The reducer is the pure recipe card: given the current kitchen inventory and this ticket, here's the new inventory — no phone calls, no waiting, just a calculation. The effect is the actual cook walking to the fridge, actually retrieving the ingredient, and clipping a new ticket ("Burger is ready") when it's done — the only place where real-world, time-taking things happen.</p>
          </div>
        </div>
        <h3>Actions — what happened</h3>
        <p>An action is a plain object with a <code>type</code> string and optional data (<code>props</code>). It describes an event that occurred in the app. Actions are like notifications: "Hey, the user clicked Load Users", or "The API returned these results." They never contain logic — they just report facts.</p>
        <h3>Reducers — how state changes</h3>
        <p>A reducer is a pure function that takes the current state and an action, and returns the next state. It must never mutate the existing state — always return a new object. Reducers contain no async code, no API calls, no side effects — only plain data transformations.</p>
        <h3>Effects — side effects triggered by actions</h3>
        <p>Effects are where async work happens. An Effect listens for a specific action (e.g. <code>loadUsers</code>), calls an API, and then dispatches a new action with the result (<code>loadUsersSuccess</code> or <code>loadUsersFailure</code>). Effects are the only place in NgRx where you should put HTTP calls, routing, localStorage, etc.</p>
      `,
      "code": "import { createAction, createReducer, on, props, createEffect, Actions, ofType } from '@ngrx/store';\nimport { switchMap, map, catchError } from 'rxjs/operators';\nimport { of } from 'rxjs';\nimport { UserService } from './user.service';\n\n// ─── Actions ────────────────────────────────────────────────────\n// Naming convention: '[Feature/Source] Event Description'\nexport const loadUsers        = createAction('[Users Page] Load Users');\nexport const loadUsersSuccess = createAction('[Users API] Load Users Success', props<{ users: User[] }>());\nexport const loadUsersFailure = createAction('[Users API] Load Users Failure', props<{ error: string }>());\nexport const deleteUser       = createAction('[Users Page] Delete User', props<{ id: number }>());\n\n// ─── Reducer ────────────────────────────────────────────────────\nexport interface UsersState { users: User[]; loading: boolean; error: string | null; }\nconst initialState: UsersState = { users: [], loading: false, error: null };\n\nexport const usersReducer = createReducer(\n  initialState,\n  // Each 'on' handles one action — returns a new state object (never mutates)\n  on(loadUsers,        state              => ({ ...state, loading: true,  error: null })),\n  on(loadUsersSuccess, (state, { users }) => ({ ...state, loading: false, users })),\n  on(loadUsersFailure, (state, { error }) => ({ ...state, loading: false, error })),\n  on(deleteUser,       (state, { id })    => ({ ...state, users: state.users.filter(u => u.id !== id) }))\n);\n\n// ─── Effect ─────────────────────────────────────────────────────\nimport { Injectable } from '@angular/core';\n@Injectable()\nexport class UsersEffects {\n  loadUsers$ = createEffect(() =>\n    this.actions$.pipe(\n      ofType(loadUsers),        // listen only for this action\n      switchMap(() =>           // cancel prev request if new one arrives\n        this.userService.getAll().pipe(\n          map(users  => loadUsersSuccess({ users })),     // on success\n          catchError(err => of(loadUsersFailure({ error: err.message })))  // on failure\n        )\n      )\n    )\n  );\n\n  constructor(private actions$: Actions, private userService: UserService) {}\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Who's Allowed to Do What</p><div class=\"grid grid-cols-1 md:grid-cols-3 gap-3 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-indigo-700 mb-1\">Action</p><p class=\"text-slate-500\">just a fact, no logic</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-emerald-700 mb-1\">Reducer</p><p class=\"text-slate-500\">pure, sync, no side effects</p></div><div class=\"bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-amber-700 mb-1\">Effect</p><p class=\"text-slate-500\">async, calls the outside world</p></div></div></div>"
    },
    {
      "id": "what-is-the-store",
      "title": "What is the store in NgRx?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A single shared ledger for a whole company, instead of every department keeping its own spreadsheet. Anyone can ask for a read-only report of just their department's numbers (<code>select()</code>), and the only way to change the ledger is to submit a formal entry (<code>dispatch()</code>) — never to walk in and cross out a number by hand.</p>
          </div>
        </div>
        <p>The <strong>Store</strong> is the central state container. It is a single object (a plain JavaScript object) that holds <em>all</em> shared application state. In Angular, it is an Observable — meaning you can subscribe to it (or use <code>select()</code> to subscribe to a slice of it) and automatically receive updates whenever the state changes.</p>
        <h3>Two operations</h3>
        <ul>
          <li><strong>dispatch(action)</strong> — tell the store something happened; the store passes the action to the reducer to produce new state</li>
          <li><strong>select(selector)</strong> — subscribe to a slice of state; returns an Observable that emits the selected value whenever it changes</li>
        </ul>
        <h3>Immutability</h3>
        <p>The store's state is never mutated directly. Every time state changes, the reducer returns a <em>completely new object</em>. This is what makes time-travel debugging possible — NgRx keeps a snapshot of every state in history.</p>
        <h3>Feature states</h3>
        <p>Large apps split state into feature slices (e.g. <code>state.users</code>, <code>state.products</code>, <code>state.cart</code>). Each feature registers its own reducer. <code>createFeatureSelector</code> makes it easy to select a feature slice.</p>
      `,
      "code": "import { Store } from '@ngrx/store';\nimport { Component, OnInit } from '@angular/core';\nimport { Observable } from 'rxjs';\nimport { loadUsers, deleteUser } from './users.actions';\nimport { selectAllUsers, selectLoading, selectError } from './users.selectors';\n\n@Component({\n  selector: 'app-users',\n  template: `\n    @if (loading$ | async) { <p>Loading...</p> }\n    @if (error$ | async; as error) { <p class=\"error\">{{ error }}</p> }\n    @for (user of users$ | async; track user.id) {\n      <li>\n        {{ user.name }}\n        <button (click)=\"onDelete(user.id)\">Delete</button>\n      </li>\n    }\n  `\n})\nexport class UsersComponent implements OnInit {\n  // Select slices of state as Observables\n  users$:   Observable<User[]>         = this.store.select(selectAllUsers);\n  loading$: Observable<boolean>        = this.store.select(selectLoading);\n  error$:   Observable<string | null>  = this.store.select(selectError);\n\n  constructor(private store: Store) {}\n\n  ngOnInit(): void {\n    // Dispatch an action — triggers the effect which calls the API\n    this.store.dispatch(loadUsers());\n  }\n\n  onDelete(id: number): void {\n    // Dispatch with payload\n    this.store.dispatch(deleteUser({ id }));\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">One Store, Many Feature Slices</p><div class=\"border-2 border-dashed border-slate-300 rounded-xl p-4\"><p class=\"text-center text-xs font-bold text-slate-500 mb-3\">Store</p><div class=\"grid grid-cols-3 gap-2 text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-center font-semibold text-indigo-700\">state.users</div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center font-semibold text-emerald-700\">state.products</div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-2 text-center font-semibold text-amber-700\">state.cart</div></div></div></div>"
    },
    {
      "id": "what-are-selectors",
      "title": "What are selectors?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A pre-saved database query versus writing raw SQL from scratch every time. A selector is the saved query "give me all admin users" — you name it once, reuse it everywhere, and if the underlying tables haven't changed since last time, the database just hands you last time's answer instead of re-running the whole query (memoization).</p>
          </div>
        </div>
        <p><strong>Selectors</strong> are pure functions that extract and transform specific pieces of data from the store. They are NgRx's query layer — instead of every component knowing the exact shape of the store, components use selectors to ask for the data they need.</p>
        <h3>Why use selectors instead of reading state directly?</h3>
        <ul>
          <li><strong>Memoized</strong> — a selector only recomputes its result when its input state actually changes. If the same state is passed again, it returns the cached result. This prevents unnecessary re-renders.</li>
          <li><strong>Reusable</strong> — define the transformation once, use it in any component</li>
          <li><strong>Composable</strong> — build complex selectors by composing simpler ones using <code>createSelector()</code></li>
          <li><strong>Easy to test</strong> — selectors are pure functions; pass a mock state and assert the result</li>
        </ul>
        <h3>createFeatureSelector vs createSelector</h3>
        <p><code>createFeatureSelector('users')</code> selects the top-level <code>state.users</code> slice. <code>createSelector()</code> composes that with a transformation to select specific data within that slice.</p>
      `,
      "code": "import { createFeatureSelector, createSelector } from '@ngrx/store';\nimport { UsersState } from './users.reducer';\n\n// ─── Base selector — select the feature slice ──────────────────\nexport const selectUsersState = createFeatureSelector<UsersState>('users');\n\n// ─── Derived selectors — composed from the base ────────────────\nexport const selectAllUsers = createSelector(\n  selectUsersState,\n  (state) => state.users\n);\n\nexport const selectLoading = createSelector(\n  selectUsersState,\n  (state) => state.loading\n);\n\nexport const selectError = createSelector(\n  selectUsersState,\n  (state) => state.error\n);\n\n// ─── Computed selectors — expensive logic, run only when inputs change ─\nexport const selectAdminUsers = createSelector(\n  selectAllUsers,\n  (users) => users.filter(u => u.role === 'admin')   // memoized\n);\n\nexport const selectUserCount = createSelector(\n  selectAllUsers,\n  (users) => users.length   // recomputes only when users array changes\n);\n\n// ─── Selector with props (parameterised) ──────────────────────\nexport const selectUserById = (id: number) => createSelector(\n  selectAllUsers,\n  (users) => users.find(u => u.id === id)\n);\n\n// Component usage:\n// this.user$ = this.store.select(selectUserById(42));",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Selectors Compose Like Pipes</p><div class=\"flex flex-wrap items-center justify-center gap-2 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 font-semibold text-indigo-700\">selectUsersState</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 font-semibold text-emerald-700\">selectAllUsers</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 font-semibold text-amber-700\">selectAdminUsers</div></div></div>"
    },
    {
      "id": "ngrx-alternatives",
      "title": "Alternatives to NgRx",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Choosing a vehicle for a trip. A bicycle (BehaviorSubject service) is perfect for a trip across town. Signals are a nimble scooter — Angular-native, no extra luggage. NGXS is a car with an automatic transmission — same destination as a stick-shift, less manual effort. NgRx with full Effects and DevTools is a freight train — enormous capacity and a black-box flight recorder, but you don't take a freight train to the corner store.</p>
          </div>
        </div>
        <p>NgRx is powerful but adds significant boilerplate. Several alternatives exist depending on how much complexity your app actually needs.</p>
        <h3>1. Service + Signals (built-in, the default first choice)</h3>
        <p>A private writable signal wrapped in a service with a readonly public signal and <code>computed()</code> derived values covers most app state cleanly, with zero extra dependencies and full OnPush/zoneless compatibility out of the box.</p>
        <h3>2. Service + BehaviorSubject (RxJS-first apps)</h3>
        <p>For apps already deep in RxJS stream composition, a shared service using <code>BehaviorSubject</code> is a simple, dependency-free option. Works great for apps with 5–20 shared state values.</p>
        <h3>3. NGXS</h3>
        <p>NGXS uses decorators and classes instead of pure functions. It feels more Angular-like, has less boilerplate than NgRx, but follows the same Action → State flow. Good choice if you like the Redux pattern but find NgRx too verbose.</p>
        <h3>4. Akita</h3>
        <p>Entity-store based, similar to a repository pattern. Very intuitive for CRUD-heavy apps. Less opinionated than NgRx — no strict action/reducer split required.</p>
        <h3>How to choose</h3>
        <p>Small-to-medium app → signal-based service. Large app with complex async flows and a team that needs time-travel debugging and a strict event history → NgRx.</p>
      `,
      "code": "// ─── Option 1: Signals (Angular-native, first choice) ─────────\nimport { signal, computed } from '@angular/core';\n\nexport class CartStore {\n  private readonly itemsState = signal<CartItem[]>([]);\n  readonly items = this.itemsState.asReadonly();\n\n  total = computed(() => this.items().reduce((sum, i) => sum + i.price, 0));\n  count = computed(() => this.items().length);\n\n  add(item: CartItem)  { this.itemsState.update(prev => [...prev, item]); }\n  remove(id: string)   { this.itemsState.update(prev => prev.filter(i => i.id !== id)); }\n  clear()              { this.itemsState.set([]); }\n}\n\n// ─── Option 2: Service + BehaviorSubject ──────────────────────\n@Injectable({ providedIn: 'root' })\nexport class UserStore {\n  private _users$ = new BehaviorSubject<User[]>([]);\n  users$ = this._users$.asObservable();\n\n  setUsers(users: User[]) { this._users$.next(users); }\n  addUser(user: User)     { this._users$.next([...this._users$.getValue(), user]); }\n}\n\n// ─── Option 3: NGXS ────────────────────────────────────────────\nimport { State, Action, StateContext, Selector } from '@ngxs/store';\n\nexport class LoadUsers { static readonly type = '[Users] Load'; }\n\n@State<User[]>({ name: 'users', defaults: [] })\n@Injectable()\nexport class UsersState {\n  @Selector() static allUsers(state: User[]) { return state; }\n\n  @Action(LoadUsers)\n  load(ctx: StateContext<User[]>) {\n    // call API and set state\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Complexity vs Structure Trade-off</p><div class=\"flex items-center justify-between gap-2 text-xs max-w-lg mx-auto\"><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-2 py-2 text-center font-semibold text-emerald-700 flex-1\">Signals</div><div class=\"bg-cyan-50 border-2 border-cyan-200 rounded-lg px-2 py-2 text-center font-semibold text-cyan-700 flex-1\">BehaviorSubject</div><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-2 py-2 text-center font-semibold text-amber-700 flex-1\">NGXS</div><div class=\"bg-rose-50 border-2 border-rose-200 rounded-lg px-2 py-2 text-center font-semibold text-rose-700 flex-1\">NgRx</div></div><p class=\"text-center text-slate-400 mt-2 text-[11px]\">less boilerplate &larr;&rarr; more structure &amp; tooling</p></div>"
    },
    {
      "id": "complete-ngrx-flow",
      "title": "Complete NgRx flow: action → effect → reducer → component",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A relay race where every runner only ever hands off a baton — they never sprint to the finish line themselves. The component hands off "load users" and waits. The effect runs its leg (the API call) and hands off "here are the users." The reducer runs its leg (updates the record) and hands off the new state. Nobody skips a leg or crosses lanes.</p>
          </div>
        </div>
        <p>Here is a complete, real-world NgRx feature for loading and displaying a list of users. All four layers are shown together so you can see how they connect.</p>
        <ol style="list-style:decimal;padding-left:1.25rem;color:#475569;line-height:1.8;">
          <li>The <strong>component</strong> dispatches <code>loadUsers()</code> on init</li>
          <li>The <strong>effect</strong> intercepts the action, calls the HTTP API, and dispatches <code>loadUsersSuccess</code> or <code>loadUsersFailure</code></li>
          <li>The <strong>reducer</strong> handles those result actions and returns a new immutable state</li>
          <li>The <strong>selectors</strong> extract the data from state</li>
          <li>The <strong>component</strong> subscribes via selectors and renders the data</li>
        </ol>
        <p>The key insight is that the component never calls the API directly and never mutates state — it only dispatches actions and reads from selectors. All the complexity is handled in the NgRx layer.</p>
      `,
      "code": "// ─── 1. users.actions.ts ──────────────────────────────────────\nexport const loadUsers        = createAction('[Users Page] Load Users');\nexport const loadUsersSuccess = createAction('[Users API] Success', props<{ users: User[] }>());\nexport const loadUsersFailure = createAction('[Users API] Failure', props<{ error: string }>());\n\n// ─── 2. users.reducer.ts ──────────────────────────────────────\nexport interface UsersState { users: User[]; loading: boolean; error: string | null; }\nconst initialState: UsersState = { users: [], loading: false, error: null };\n\nexport const usersReducer = createReducer(\n  initialState,\n  on(loadUsers,        state              => ({ ...state, loading: true,  error: null })),\n  on(loadUsersSuccess, (state, { users }) => ({ ...state, loading: false, users })),\n  on(loadUsersFailure, (state, { error }) => ({ ...state, loading: false, error }))\n);\n\n// ─── 3. users.effects.ts ──────────────────────────────────────\n@Injectable()\nexport class UsersEffects {\n  loadUsers$ = createEffect(() =>\n    this.actions$.pipe(\n      ofType(loadUsers),\n      switchMap(() =>\n        this.api.getAll().pipe(\n          map(users  => loadUsersSuccess({ users })),\n          catchError(err => of(loadUsersFailure({ error: err.message })))\n        )\n      )\n    )\n  );\n  constructor(private actions$: Actions, private api: UserService) {}\n}\n\n// ─── 4. users.selectors.ts ────────────────────────────────────\nexport const selectUsersState = createFeatureSelector<UsersState>('users');\nexport const selectAllUsers   = createSelector(selectUsersState, s => s.users);\nexport const selectLoading    = createSelector(selectUsersState, s => s.loading);\nexport const selectError      = createSelector(selectUsersState, s => s.error);\n\n// ─── 5. users.component.ts ────────────────────────────────────\n@Component({\n  template: `\n    @if (loading$ | async) { <p>Loading...</p> }\n    @if (error$ | async; as e) { <p class=\"error\">{{ e }}</p> }\n    @for (u of users$ | async; track u.id) { <li>{{ u.name }}</li> }\n  `\n})\nexport class UsersComponent implements OnInit {\n  users$   = this.store.select(selectAllUsers);\n  loading$ = this.store.select(selectLoading);\n  error$   = this.store.select(selectError);\n  constructor(private store: Store) {}\n  ngOnInit() { this.store.dispatch(loadUsers()); }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">The Relay: Component &rarr; Effect &rarr; Reducer &rarr; Component</p><div class=\"flex flex-wrap items-center justify-center gap-2 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 font-semibold text-indigo-700\">1. dispatch()</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 font-semibold text-amber-700\">2. Effect calls API</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 font-semibold text-emerald-700\">3. Reducer updates state</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-rose-50 border-2 border-rose-200 rounded-lg px-3 py-2 font-semibold text-rose-700\">4. Selector reads it</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-purple-50 border-2 border-purple-200 rounded-lg px-3 py-2 font-semibold text-purple-700\">5. Template renders</div></div></div>"
    },
    {
      "id": "ngrx-entity",
      "title": "NgRx Entity adapter",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A phone book versus a pile of index cards. Search a pile of 10,000 loose index cards for "Priya Sharma" and you flip through them one by one — O(n). A phone book organized by name lookup (an <code>entities</code> dictionary keyed by ID, plus an <code>ids</code> array for ordering) lets you jump straight to the right page — O(1).</p>
          </div>
        </div>
        <p><strong>NgRx Entity</strong> eliminates boilerplate for managing collections (arrays of records) in the store. Without it, every CRUD operation requires you to manually write array filter/map logic inside reducers. With it, you get pre-built, optimised mutation methods.</p>
        <h3>EntityState — normalized storage</h3>
        <p>Instead of storing records as a plain array (which requires O(n) lookup by id), EntityState stores them as two things: an <code>ids</code> array (ordered list of IDs) and an <code>entities</code> dictionary (object keyed by ID). This gives O(1) access to any record by ID.</p>
        <h3>EntityAdapter — pre-built methods</h3>
        <ul>
          <li><code>addOne(entity, state)</code> — add a single record</li>
          <li><code>addMany(entities, state)</code> — add multiple records</li>
          <li><code>setAll(entities, state)</code> — replace all records</li>
          <li><code>updateOne({ id, changes }, state)</code> — partial update</li>
          <li><code>removeOne(id, state)</code> — delete by id</li>
          <li><code>removeAll(state)</code> — clear the collection</li>
        </ul>
        <h3>getSelectors() — auto-generated selectors</h3>
        <p>Returns <code>selectAll</code> (as array), <code>selectEntities</code> (as dict), <code>selectIds</code>, and <code>selectTotal</code>.</p>
      `,
      "code": "import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';\nimport { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';\n\nexport interface User { id: number; name: string; role: string; }\n\n// EntityState adds 'ids' and 'entities' to your own extra fields\nexport interface UsersState extends EntityState<User> {\n  loading: boolean;\n  selectedId: number | null;\n}\n\n// The adapter handles all collection mutations for you\nconst adapter: EntityAdapter<User> = createEntityAdapter<User>();\n\nconst initialState: UsersState = adapter.getInitialState({\n  loading: false,\n  selectedId: null\n});\n\nexport const usersReducer = createReducer(\n  initialState,\n  on(loadUsersSuccess,  (state, { users }) => adapter.setAll(users,  { ...state, loading: false })),\n  on(addUserSuccess,    (state, { user  }) => adapter.addOne(user,   state)),\n  on(updateUserSuccess, (state, { user  }) => adapter.updateOne({ id: user.id, changes: user }, state)),\n  on(deleteUserSuccess, (state, { id    }) => adapter.removeOne(id,  state))\n);\n\n// ─── Auto-generated selectors ─────────────────────────────────\nconst { selectAll, selectEntities, selectTotal, selectIds } = adapter.getSelectors();\n\nexport const selectUsersState   = createFeatureSelector<UsersState>('users');\nexport const selectAllUsers     = createSelector(selectUsersState, selectAll);       // User[]\nexport const selectUserEntities = createSelector(selectUsersState, selectEntities);  // { [id]: User }\nexport const selectUsersTotal   = createSelector(selectUsersState, selectTotal);     // number\n\nexport const selectUserById = (id: number) => createSelector(\n  selectUserEntities,\n  entities => entities[id]   // O(1) lookup\n);",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Array vs Normalized EntityState</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-rose-50 border-2 border-rose-200 rounded-xl p-3\"><p class=\"font-bold text-rose-700 text-center mb-2\">Plain array — O(n) lookup</p><p class=\"font-mono text-slate-600 text-center\">[user1, user2, user3, ...]</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">EntityState — O(1) lookup</p><p class=\"font-mono text-slate-600 text-center\">ids: [1,2,3]<br/>entities: {1: user1, 2: user2}</p></div></div></div>"
    },
    {
      "id": "ngrx-devtools-and-testing",
      "title": "NgRx DevTools and testing",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A flight data recorder for your app's state. Every "event" (dispatched action) is logged with a timestamp and the exact before/after readings. When something goes wrong, you don't guess — you scrub the recording back to the exact moment and see precisely which event caused the deviation.</p>
          </div>
        </div>
        <p><strong>Redux DevTools</strong> is a browser extension (Chrome/Firefox) that gives you a live inspector for your NgRx store. Every dispatched action is listed in a timeline. Click any action to see the exact state before and after. You can jump back in time to any previous state, replay actions from any point, and even export and import state snapshots.</p>
        <h3>Setup</h3>
        <p>Install <code>@ngrx/store-devtools</code> and add <code>provideStoreDevtools()</code> to the standalone providers. Limit to dev mode so state isn't exposed in production.</p>
        <h3>Testing NgRx — the good news</h3>
        <p>Because NgRx enforces pure functions, testing each layer is straightforward:</p>
        <ul>
          <li><strong>Reducers</strong> — call the function directly with initial state + action, assert returned state</li>
          <li><strong>Selectors</strong> — call with a mock state object, assert the selected value</li>
          <li><strong>Effects</strong> — use <code>provideMockActions()</code> from <code>@ngrx/effects/testing</code> to control the action stream</li>
        </ul>
      `,
      "code": "// ─── DevTools setup (standalone) ──────────────────────────────\nimport { provideStoreDevtools } from '@ngrx/store-devtools';\nimport { isDevMode } from '@angular/core';\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    provideStore({ users: usersReducer }),\n    provideEffects(UsersEffects),\n    provideStoreDevtools({\n      maxAge: 25,           // keep last 25 state snapshots\n      logOnly: !isDevMode() // disable time-travel in production\n    })\n  ]\n});\n\n// ─── Testing a reducer — pure function, no setup needed ────────\ndescribe('usersReducer', () => {\n  it('sets loading:true on loadUsers', () => {\n    const state = usersReducer(initialState, loadUsers());\n    expect(state.loading).toBe(true);\n    expect(state.error).toBeNull();\n  });\n\n  it('sets users and clears loading on success', () => {\n    const users = [{ id: 1, name: 'Alice', role: 'user' }];\n    const state = usersReducer(initialState, loadUsersSuccess({ users }));\n    expect(state.users).toEqual(users);\n    expect(state.loading).toBe(false);\n  });\n});\n\n// ─── Testing a selector — pure function, pass mock state ───────\ndescribe('selectAllUsers', () => {\n  it('returns all users from state', () => {\n    const mockState = {\n      users: { users: [{ id: 1, name: 'Alice', role: 'admin' }], loading: false, error: null }\n    };\n    expect(selectAllUsers(mockState)).toEqual([{ id: 1, name: 'Alice', role: 'admin' }]);\n  });\n});",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">What Each Layer's Test Checks</p><div class=\"grid grid-cols-1 md:grid-cols-3 gap-3 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-indigo-700\">Reducer test</p><p class=\"text-slate-500 mt-1\">state + action in &rarr; new state out</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-emerald-700\">Selector test</p><p class=\"text-slate-500 mt-1\">mock state in &rarr; selected value out</p></div><div class=\"bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-amber-700\">Effect test</p><p class=\"text-slate-500 mt-1\">mock action stream &rarr; dispatched result action</p></div></div></div>"
    }
  ]
});
