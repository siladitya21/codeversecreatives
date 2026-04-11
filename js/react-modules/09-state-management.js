window.REACT_MODULES = window.REACT_MODULES || [];
window.REACT_MODULES.push({
  id: 'react-state-mgmt',
  title: 'State Management',
  icon: 'bi bi-database',
  questions: [
    {
      id: 'when-global-state',
      title: 'When do you need global state management?',
      explanation: `
        <h3>Local State First</h3>
        <p>Start with local <code>useState</code> or <code>useReducer</code>. Only reach for global state management when you genuinely need it — premature abstraction adds complexity.</p>
        <h3>Signs You Need Global State</h3>
        <ul>
          <li>Prop drilling more than 2-3 levels deep.</li>
          <li>Multiple unrelated components need the same data.</li>
          <li>Data changes need to propagate across distant parts of the tree.</li>
          <li>User session, auth, theme — genuinely app-wide data.</li>
        </ul>
        <h3>Choosing a Solution</h3>
        <ul>
          <li><strong>Context + useReducer:</strong> Small-medium apps, low-frequency updates (theme, auth).</li>
          <li><strong>Zustand:</strong> Simple, small API, great for medium apps.</li>
          <li><strong>Redux Toolkit:</strong> Large apps with complex state, teams needing strict conventions and DevTools.</li>
          <li><strong>Jotai / Recoil:</strong> Atomic state model, fine-grained subscriptions.</li>
          <li><strong>TanStack Query:</strong> Server state (caching, sync, background refetch) — not client state.</li>
        </ul>
        <h3>Client State vs Server State</h3>
        <p>These are different problems. Client state (UI, selected items, form values) belongs in Zustand/Redux. Server state (API responses, caches) belongs in TanStack Query or SWR.</p>
      `,
      code: `// Decision tree:

// 1. Is the state only used in one component?
//    → useState / useReducer (local)

// 2. Is the state shared between a few nearby components?
//    → Lift state up to common ancestor + pass via props

// 3. Is it data from an API that needs caching/refetching?
//    → TanStack Query / SWR (server state)

// 4. Is it app-wide, low-frequency data (theme, auth)?
//    → Context API

// 5. Is it complex, frequently updated, shared widely?
//    → Zustand (simple) or Redux Toolkit (large teams)

// A common pattern: use both
function App() {
  return (
    <QueryClientProvider client={queryClient}>  {/* server state */}
      <AuthProvider>                             {/* auth context */}
        <ThemeProvider>                          {/* theme context */}
          <Router>
            <Routes />
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}`,
      diagram: null
    },
    {
      id: 'redux-toolkit',
      title: 'How does Redux Toolkit work?',
      explanation: `
        <h3>Redux Toolkit (RTK)</h3>
        <p>RTK is the official, opinionated way to write Redux. It eliminates boilerplate with <code>createSlice</code> (actions + reducer in one), <code>configureStore</code>, and <code>createAsyncThunk</code> for async logic.</p>
        <h3>Core Concepts</h3>
        <ul>
          <li><strong>Store:</strong> Single source of truth for the entire app state.</li>
          <li><strong>Slice:</strong> A piece of state with its reducers and actions defined together.</li>
          <li><strong>Action:</strong> A plain object describing what happened <code>{ type, payload }</code>.</li>
          <li><strong>Reducer:</strong> Pure function that returns new state given current state + action.</li>
          <li><strong>Selector:</strong> Function that reads derived data from the store.</li>
          <li><strong>Thunk:</strong> Middleware for async actions (API calls).</li>
        </ul>
        <h3>Immer Under the Hood</h3>
        <p>RTK uses Immer internally, so you can write "mutating" code inside reducers — it produces a new immutable state for you.</p>
      `,
      code: `// store.js
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
  },
});
export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCart = createAsyncThunk('cart/fetch', async (userId) => {
  const res = await fetch('/api/cart/' + userId);
  return res.json();
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    // Immer: "mutate" directly inside reducers
    addItem(state, action) { state.items.push(action.payload); },
    removeItem(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    clearCart(state) { state.items = []; },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCart.pending,  s => { s.loading = true; })
      .addCase(fetchCart.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchCart.rejected, (s, a) => { s.loading = false; s.error = a.error.message; });
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

// Component
import { useSelector, useDispatch } from 'react-redux';
function CartButton({ product }) {
  const dispatch  = useDispatch();
  const itemCount = useSelector(s => s.cart.items.length);
  return (
    <button onClick={() => dispatch(addItem(product))}>
      Add to cart ({itemCount})
    </button>
  );
}`,
      diagram: null
    },
    {
      id: 'zustand',
      title: 'How does Zustand work?',
      explanation: `
        <h3>Zustand</h3>
        <p>Zustand is a minimal, un-opinionated state management library. A store is just a hook created with <code>create()</code>. No providers, no boilerplate, no context wrappers needed.</p>
        <h3>Why Zustand?</h3>
        <ul>
          <li>~1KB gzipped.</li>
          <li>No Provider wrapping needed — just import and use.</li>
          <li>Selectors prevent unnecessary re-renders (subscribe to only what you need).</li>
          <li>Works outside React (vanilla JS) — great for utility functions.</li>
          <li>Trivial to test and mock.</li>
        </ul>
        <h3>Async Actions</h3>
        <p>No middleware needed — just <code>async</code> functions in the store.</p>
      `,
      code: `import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the store
const useCartStore = create(
  persist(                       // automatically persists to localStorage
    (set, get) => ({
      items: [],
      addItem:    (item) => set(s => ({ items: [...s.items, item] })),
      removeItem: (id)   => set(s => ({ items: s.items.filter(i => i.id !== id) })),
      clearCart:  ()     => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price, 0),

      // Async action — no thunk middleware needed
      fetchCart: async (userId) => {
        const items = await fetch('/api/cart/' + userId).then(r => r.json());
        set({ items });
      },
    }),
    { name: 'cart-storage' }     // localStorage key
  )
);

// Component — subscribe to only what you need
function CartSummary() {
  // Only re-renders when items.length changes, not on every item change
  const count = useCartStore(state => state.items.length);
  const clear = useCartStore(state => state.clearCart);
  return (
    <div>
      {count} items <button onClick={clear}>Clear</button>
    </div>
  );
}

// Use store outside React (e.g., in an API helper)
function onOrderComplete() {
  useCartStore.getState().clearCart();
}`,
      diagram: null
    }
  ]
});
