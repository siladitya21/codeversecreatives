window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "state-management",
  "title": "State Management",
  "icon": "bi bi-diagram-3",
  "questions": [
    {
      "id": "what-is-state-management",
      "title": "What is state management?",
      "explanation": `
          <p><strong>State Management</strong> is the process of managing the data (state) that an application needs to function. As applications grow, sharing data between many components becomes difficult.</p>
          <p>Instead of passing data through many levels of components (prop drilling), state management provides a <strong>single source of truth</strong> where data is stored and accessed predictably.</p>
        `,
      "code": "// Without State Management: Parent -> Child -> Grandchild (Prop Drilling)\n// With State Management: Store -> Any Component",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Centralized State</p><div class="flex items-center justify-center gap-4"><div class="bg-slate-100 p-2 rounded border border-slate-200 text-[10px]">Component A</div><div class="text-indigo-400 font-bold">&harr;</div><div class="bg-indigo-600 text-white p-4 rounded-full shadow-lg text-xs font-bold">STORE</div><div class="text-indigo-400 font-bold">&harr;</div><div class="bg-slate-100 p-2 rounded border border-slate-200 text-[10px]">Component B</div></div></div>`
    },
    {
      "id": "what-is-ngrx",
      "title": "What is NgRx?",
      "explanation": `
          <p><strong>NgRx</strong> is a framework for building reactive applications in Angular. It is inspired by Redux and powered by RxJS.</p>
          <p>It enforces a <strong>Unidirectional Data Flow</strong> and uses Observables to handle state changes, making the application easier to test and debug using tools like Redux DevTools.</p>
        `,
      "code": "// NgRx follows the Redux pattern:\n// 1. One global Store\n// 2. Actions describe events\n// 3. Reducers update state (pure functions)",
      "language": "typescript"
    },
    {
      "id": "actions-reducers-effects",
      "title": "What are actions, reducers, and effects?",
      "explanation": `
          <ul>
            <li><strong>Actions:</strong> Unique events that happen in the app (e.g., [User Page] Login Button Clicked). They describe <em>what</em> happened.</li>
            <li><strong>Reducers:</strong> Pure functions that take the current state and an action, then return a <em>new</em> state. They decide <em>how</em> state changes.</li>
            <li><strong>Effects:</strong> Handle side effects like API calls. They listen for actions, perform a task, and usually dispatch a new action with the result.</li>
          </ul>
        `,
      "code": "// Action\nexport const loadUsers = createAction('[User API] Load Users');\n\n// Reducer\nexport const userReducer = createReducer(initialState, \n  on(loadUsersSuccess, (state, { users }) => ({ ...state, list: users }))\n);",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">NgRx Lifecycle</p><div class="flex flex-col items-center gap-2"><div class="bg-amber-100 border border-amber-300 p-2 rounded text-xs">Action</div><div class="text-slate-300">&darr;</div><div class="flex gap-4"><div class="bg-emerald-100 border border-emerald-300 p-2 rounded text-xs">Reducer</div><div class="bg-rose-100 border border-rose-300 p-2 rounded text-xs">Effect (API)</div></div><div class="text-slate-300">&darr;</div><div class="bg-indigo-600 text-white p-2 rounded text-xs shadow-md">New State in Store</div></div></div>`
    },
    {
      "id": "what-is-the-store",
      "title": "What is the store in NgRx?",
      "explanation": `
          <p>The <strong>Store</strong> is a controlled container that holds the entire state of your application. It is an <code>Observable</code> of the state.</p>\n\n          <p>Components "select" data from the store to display it and "dispatch" actions to the store to change it.</p>
        `,
      "code": "constructor(private store: Store<AppState>) {}\n\nngOnInit() {\n  // Selecting data\n  this.users$ = this.store.select(selectUsers);\n}\n\naddUser() {\n  // Dispatching action\n  this.store.dispatch(addUser({ user: newUser }));\n}",
      "language": "typescript"
    },
    {
      "id": "what-are-selectors",
      "title": "What are selectors?",
      "explanation": `
          <p><strong>Selectors</strong> are pure functions used to slice and transform specific pieces of state from the store. They are highly performant because they are <strong>memoized</strong> (they only re-calculate if the state they depend on changes).</p>
        `,
      "code": "export const selectUserState = (state: AppState) => state.users;\n\nexport const selectAdminUsers = createSelector(\n  selectUserState,\n  (users) => users.filter(u => u.isAdmin)\n);",
      "language": "typescript"
    },
    {
      "id": "ngrx-alternatives",
      "title": "Alternatives to NgRx (Akita, NGXS)",
      "explanation": `
          <p>While NgRx is the most popular, other libraries exist to simplify state management:</p>\n\n          <ul>\n            <li><strong>NGXS:</strong> Uses decorators and classes instead of pure functions. It feels more "Angular-native" and has less boilerplate than NgRx.</li>\n            <li><strong>Akita:</strong> Based on Object-Oriented principles. It is simpler to learn and doesn't require the strict Action/Reducer boilerplate.</li>\n            <li><strong>Signals (Angular 16+):</strong> Built into Angular. For many apps, native Signals provide enough state management without needing an external library.</li>\n          </ul>\n        `,
      "code": "// NGXS uses @State and @Action decorators\n@State<string[]>({ name: 'users', defaults: [] })\nexport class UserState {\n  @Action(AddUser) add(ctx: StateContext<string[]>) { ... }\n}",
      "language": "typescript"
    },
    {
      "id": "complete-ngrx-flow",
      "title": "Complete NgRx flow: action → effect → reducer → component",
      "explanation": `
          <p>A real NgRx application connects four layers. Here is a complete end-to-end example for a users list feature.</p>
          <ol>
            <li><strong>Component</strong> dispatches <code>loadUsers()</code> on init</li>
            <li><strong>Effect</strong> intercepts the action, calls the HTTP service, then dispatches <code>loadUsersSuccess</code> or <code>loadUsersFailure</code></li>
            <li><strong>Reducer</strong> handles those result actions and returns a new immutable state</li>
            <li><strong>Component</strong> selects data from the store via a memoized selector and renders it</li>
          </ol>
        `,
      "code": "// --- users.actions.ts ---\nexport const loadUsers        = createAction('[Users Page] Load Users');\nexport const loadUsersSuccess = createAction('[Users API] Success', props<{ users: User[] }>());\nexport const loadUsersFailure = createAction('[Users API] Failure', props<{ error: string }>());\n\n// --- users.reducer.ts ---\nexport interface UsersState { users: User[]; loading: boolean; error: string | null; }\nconst initialState: UsersState = { users: [], loading: false, error: null };\n\nexport const usersReducer = createReducer(\n  initialState,\n  on(loadUsers,        state             => ({ ...state, loading: true, error: null })),\n  on(loadUsersSuccess, (state, { users }) => ({ ...state, loading: false, users })),\n  on(loadUsersFailure, (state, { error }) => ({ ...state, loading: false, error }))\n);\n\n// --- users.effects.ts ---\n@Injectable()\nexport class UsersEffects {\n  loadUsers$ = createEffect(() =>\n    this.actions$.pipe(\n      ofType(loadUsers),\n      switchMap(() =>\n        this.userService.getAll().pipe(\n          map(users => loadUsersSuccess({ users })),\n          catchError(err => of(loadUsersFailure({ error: err.message })))\n        )\n      )\n    )\n  );\n  constructor(private actions$: Actions, private userService: UserService) {}\n}\n\n// --- users.selectors.ts ---\nexport const selectUsersState = createFeatureSelector<UsersState>('users');\nexport const selectAllUsers   = createSelector(selectUsersState, s => s.users);\nexport const selectLoading    = createSelector(selectUsersState, s => s.loading);\n\n// --- users.component.ts ---\n@Component({ selector: 'app-users', template: '' })\nexport class UsersComponent implements OnInit {\n  users$   = this.store.select(selectAllUsers);\n  loading$ = this.store.select(selectLoading);\n  constructor(private store: Store) {}\n  ngOnInit() { this.store.dispatch(loadUsers()); }\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Complete NgRx Flow</p><div class="flex flex-col items-center gap-1 max-w-xs mx-auto"><div class="w-full bg-indigo-50 border-2 border-indigo-200 rounded-lg p-2 text-center"><p class="text-xs font-bold text-indigo-700">Component dispatches action</p></div><div class="text-slate-400 text-xs">&darr;</div><div class="w-full bg-purple-50 border-2 border-purple-200 rounded-lg p-2 text-center"><p class="text-xs font-bold text-purple-700">Effect intercepts &rarr; HTTP call &rarr; dispatches result action</p></div><div class="text-slate-400 text-xs">&darr;</div><div class="w-full bg-amber-50 border-2 border-amber-200 rounded-lg p-2 text-center"><p class="text-xs font-bold text-amber-700">Reducer produces new state (pure function)</p></div><div class="text-slate-400 text-xs">&darr;</div><div class="w-full bg-emerald-50 border-2 border-emerald-200 rounded-lg p-2 text-center"><p class="text-xs font-bold text-emerald-700">Store emits &rarr; Selector &rarr; Component re-renders</p></div></div></div>`
    },
    {
      "id": "ngrx-entity",
      "title": "NgRx Entity adapter",
      "explanation": `
          <p><strong>NgRx Entity</strong> provides utilities for managing <strong>collections of records</strong> in the store without writing repetitive CRUD reducer logic.</p>
          <h3>Key Concepts</h3>
          <ul>
            <li><strong>EntityState</strong> — stores records as an <code>ids</code> array plus an <code>entities</code> dictionary, giving O(1) access by id</li>
            <li><strong>EntityAdapter</strong> — provides pre-built mutation methods: <code>addOne</code>, <code>addMany</code>, <code>setAll</code>, <code>updateOne</code>, <code>removeOne</code>, <code>removeAll</code></li>
            <li><strong>getSelectors()</strong> — auto-generates <code>selectAll</code>, <code>selectEntities</code>, <code>selectIds</code>, <code>selectTotal</code></li>
          </ul>
        `,
      "code": "import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';\n\nexport interface User { id: number; name: string; }\nexport interface UsersState extends EntityState<User> { loading: boolean; }\n\nconst adapter: EntityAdapter<User> = createEntityAdapter<User>();\nconst initialState: UsersState     = adapter.getInitialState({ loading: false });\n\nexport const usersReducer = createReducer(\n  initialState,\n  on(loadUsersSuccess,  (state, { users }) => adapter.setAll(users,  { ...state, loading: false })),\n  on(addUserSuccess,    (state, { user })  => adapter.addOne(user,   state)),\n  on(updateUserSuccess, (state, { user })  => adapter.updateOne({ id: user.id, changes: user }, state)),\n  on(deleteUserSuccess, (state, { id })    => adapter.removeOne(id,  state))\n);\n\n// Auto-generated selectors\nconst { selectAll, selectEntities, selectTotal } = adapter.getSelectors();\nexport const selectUsersState    = createFeatureSelector<UsersState>('users');\nexport const selectAllUsers      = createSelector(selectUsersState, selectAll);\nexport const selectUserEntities  = createSelector(selectUsersState, selectEntities);\nexport const selectUsersCount    = createSelector(selectUsersState, selectTotal);",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">EntityState Internal Shape</p><div class="max-w-sm mx-auto bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono space-y-1"><p class="text-slate-500">// stored internally as a normalized map:</p><p class="text-indigo-700">ids: [1, 2, 3]</p><p class="text-emerald-700">entities: &#123;</p><p class="text-emerald-700 pl-4">1: &#123; id: 1, name: 'Alice' &#125;,</p><p class="text-emerald-700 pl-4">2: &#123; id: 2, name: 'Bob'   &#125;</p><p class="text-emerald-700">&#125;</p><p class="text-amber-700 mt-1">loading: false</p></div></div>`
    },
    {
      "id": "ngrx-devtools-and-testing",
      "title": "NgRx DevTools and testing",
      "explanation": `
          <p><strong>Redux DevTools</strong> integration lets you inspect every dispatched action, browse the full state history, time-travel to any previous state, and replay actions — invaluable for debugging.</p>
          <h3>Setup</h3>
          <p>Import <code>StoreDevtoolsModule.instrument()</code> in your root module. Restrict to dev mode to avoid exposing state in production.</p>
          <h3>Testing Reducers</h3>
          <p>Reducers are pure functions — call them directly with an initial state and an action, then assert the returned state. No mocks or async setup needed.</p>
          <h3>Testing Selectors</h3>
          <p>Selectors are also pure functions. Pass a mock state object and assert the output value.</p>
          <h3>Testing Effects</h3>
          <p>Use <code>provideMockActions()</code> from <code>@ngrx/effects/testing</code> to inject a controllable action stream.</p>
        `,
      "code": "// --- DevTools setup ---\nimport { StoreDevtoolsModule } from '@ngrx/store-devtools';\nimport { isDevMode } from '@angular/core';\n\n@NgModule({\n  imports: [ StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }) ]\n})\nexport class AppModule {}\n\n// --- Testing a reducer ---\ndescribe('usersReducer', () => {\n  it('sets loading:true on loadUsers', () => {\n    const state = usersReducer(initialState, loadUsers());\n    expect(state.loading).toBe(true);\n  });\n  it('populates users on loadUsersSuccess', () => {\n    const users = [{ id: 1, name: 'Alice' }];\n    const state = usersReducer(initialState, loadUsersSuccess({ users }));\n    expect(state.users).toEqual(users);\n    expect(state.loading).toBe(false);\n  });\n});\n\n// --- Testing a selector ---\ndescribe('selectAllUsers', () => {\n  it('returns all users', () => {\n    const mockState = { users: { users: [{ id: 1, name: 'Alice' }], loading: false, error: null } };\n    expect(selectAllUsers(mockState)).toEqual([{ id: 1, name: 'Alice' }]);\n  });\n});",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">NgRx DevTools + Testing</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3"><p class="text-xs font-bold text-indigo-700 mb-2">Redux DevTools</p><ul class="text-[10px] text-slate-600 space-y-1"><li>Inspect every action &amp; state snapshot</li><li>Time-travel &amp; replay actions</li><li>Import/export state history</li></ul></div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3"><p class="text-xs font-bold text-emerald-700 mb-2">Unit Testing</p><ul class="text-[10px] text-slate-600 space-y-1"><li>Reducer: pure fn &mdash; no mocks needed</li><li>Selector: call with mock state</li><li>Effect: use provideMockActions()</li></ul></div></div></div>`
    }
  ]
});