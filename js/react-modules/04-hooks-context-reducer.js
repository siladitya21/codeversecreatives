window.REACT_MODULES = window.REACT_MODULES || [];
window.REACT_MODULES.push({
  id: 'react-hooks-ctx-reducer',
  title: 'useContext & useReducer',
  icon: 'bi bi-share',
  questions: [
    {
      id: 'usecontext',
      title: 'How does useContext work and when should you use it?',
      explanation: `
        <h3>The Context API</h3>
        <p>Context lets you pass data through the component tree without prop drilling — passing data explicitly through every intermediate component. It is React's built-in solution for "global" data that many components need.</p>
        <h3>Three Steps</h3>
        <ul>
          <li><strong>1. Create:</strong> <code>const ThemeCtx = createContext(defaultValue)</code></li>
          <li><strong>2. Provide:</strong> Wrap the tree in <code>&lt;ThemeCtx.Provider value={...}&gt;</code></li>
          <li><strong>3. Consume:</strong> Any descendant calls <code>useContext(ThemeCtx)</code></li>
        </ul>
        <h3>When to Use Context</h3>
        <ul>
          <li>Theme / dark mode</li>
          <li>Authenticated user / session</li>
          <li>Locale / i18n</li>
          <li>Any data that many nested components need to read</li>
        </ul>
        <h3>Performance Warning</h3>
        <p>Every component consuming a context re-renders when the <em>context value object</em> changes. If you create a new object on every render (<code>value={{ user, setUser }}</code>), all consumers re-render every time. Use <code>useMemo</code> to stabilise the value.</p>
      `,
      code: `import { createContext, useContext, useState, useMemo } from 'react';

// 1. Create context with a default value
const AuthContext = createContext(null);

// 2. Provider at the top of the tree
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Memoize so consumers don't re-render when parent re-renders
  const value = useMemo(() => ({ user, setUser }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook wraps useContext + adds safety check
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside <AuthProvider>');
  return ctx;
}

// 3. Consume anywhere in the tree
function Header() {
  const { user, setUser } = useAuth();
  return (
    <nav>
      {user ? (
        <>
          <span>Hello, {user.name}</span>
          <button onClick={() => setUser(null)}>Logout</button>
        </>
      ) : (
        <button onClick={() => setUser({ name: 'Alice' })}>Login</button>
      )}
    </nav>
  );
}`,
      diagram: `<div class="diagram-wrap">
  <div style="font-size:0.8rem;font-family:monospace">
    <div style="font-weight:700;color:#e2e8f0;margin-bottom:8px">Context vs Prop Drilling</div>
    <div style="display:flex;gap:20px;flex-wrap:wrap">
      <div style="flex:1;min-width:120px">
        <div style="color:#f87171;font-size:0.7rem;font-weight:700;margin-bottom:6px">❌ Prop Drilling</div>
        <div style="background:#1e293b;padding:8px;border-radius:6px;color:#94a3b8;font-size:0.72rem;line-height:1.8">
          App (user)<br/>
          &nbsp;└ Layout (user)<br/>
          &nbsp;&nbsp;&nbsp;└ Sidebar (user)<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└ Avatar (user) ✓
        </div>
      </div>
      <div style="flex:1;min-width:120px">
        <div style="color:#6ee7b7;font-size:0.7rem;font-weight:700;margin-bottom:6px">✅ Context</div>
        <div style="background:#1e293b;padding:8px;border-radius:6px;color:#94a3b8;font-size:0.72rem;line-height:1.8">
          AuthProvider (user)<br/>
          &nbsp;└ Layout<br/>
          &nbsp;&nbsp;&nbsp;└ Sidebar<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└ Avatar → useContext ✓
        </div>
      </div>
    </div>
  </div>
</div>`
    },
    {
      id: 'usereducer',
      title: 'How does useReducer work and when to prefer it over useState?',
      explanation: `
        <h3>useReducer</h3>
        <p><code>useReducer</code> is an alternative to <code>useState</code> for managing complex state. A <em>reducer</em> is a pure function <code>(state, action) => newState</code>.</p>
        <h3>When to Choose useReducer over useState</h3>
        <ul>
          <li>State object has multiple sub-values that change together.</li>
          <li>Next state depends on the previous state in non-trivial ways.</li>
          <li>Complex update logic that is hard to reason about with individual <code>setState</code> calls.</li>
          <li>You want to co-locate all state transitions (like Redux but local).</li>
        </ul>
        <h3>Benefits</h3>
        <ul>
          <li>All state transitions are in one place — easy to trace and test.</li>
          <li>Actions are descriptive: <code>{ type: 'INCREMENT' }</code> is self-documenting.</li>
          <li>The reducer is a pure function — trivial to unit test.</li>
        </ul>
      `,
      code: `import { useReducer } from 'react';

// Reducer: pure function, no side effects
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
        total: state.total + action.payload.price,
      };
    case 'REMOVE_ITEM':
      const item = state.items.find(i => i.id === action.payload);
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload),
        total: state.total - (item?.price ?? 0),
      };
    case 'CLEAR':
      return { items: [], total: 0 };
    default:
      throw new Error('Unknown action: ' + action.type);
  }
}

const initialState = { items: [], total: 0 };

function Cart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <div>
      <p>Total: ${state.total}</p>
      {state.items.map(item => (
        <div key={item.id}>
          {item.name}
          <button onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}>
            Remove
          </button>
        </div>
      ))}
      <button onClick={() => dispatch({ type: 'CLEAR' })}>Clear Cart</button>
    </div>
  );
}`,
      diagram: null
    },
    {
      id: 'reducer-context',
      title: 'How do you combine useReducer with Context for global state?',
      explanation: `
        <h3>The Pattern</h3>
        <p>Combining <code>useReducer</code> and <code>Context</code> is a lightweight alternative to Redux for medium-sized apps. The reducer manages state transitions; Context distributes state and dispatch to the whole tree.</p>
        <h3>Two Contexts Pattern</h3>
        <p>Split into a <em>state context</em> and a <em>dispatch context</em>. Components that only dispatch (buttons, forms) won't re-render when state changes, because they only subscribe to the dispatch context — which never changes.</p>
        <h3>Limitations vs Redux</h3>
        <ul>
          <li>No middleware (no easy async actions).</li>
          <li>No DevTools integration out of the box.</li>
          <li>Every context consumer re-renders on state change (no selector optimisation like <code>useSelector</code>).</li>
        </ul>
      `,
      code: `import { createContext, useContext, useReducer, useMemo } from 'react';

// Two separate contexts: state and dispatch
const StateCtx    = createContext(null);
const DispatchCtx = createContext(null);

function todosReducer(state, action) {
  switch (action.type) {
    case 'ADD':    return [...state, { id: Date.now(), text: action.text, done: false }];
    case 'TOGGLE': return state.map(t => t.id === action.id ? { ...t, done: !t.done } : t);
    case 'DELETE': return state.filter(t => t.id !== action.id);
    default: return state;
  }
}

export function TodosProvider({ children }) {
  const [todos, dispatch] = useReducer(todosReducer, []);
  // dispatch is stable — never changes
  return (
    <DispatchCtx.Provider value={dispatch}>
      <StateCtx.Provider value={todos}>
        {children}
      </StateCtx.Provider>
    </DispatchCtx.Provider>
  );
}

export const useTodos    = () => useContext(StateCtx);
export const useTodosDispatch = () => useContext(DispatchCtx);

// Component using state — re-renders when todos change
function TodoList() {
  const todos = useTodos();
  const dispatch = useTodosDispatch();
  return (
    <ul>
      {todos.map(t => (
        <li key={t.id}>
          <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
          <button onClick={() => dispatch({ type: 'TOGGLE', id: t.id })}>Toggle</button>
        </li>
      ))}
    </ul>
  );
}

// Component only dispatching — never re-renders due to state changes
function AddTodo() {
  const dispatch = useTodosDispatch(); // only subscribes to dispatch
  const [text, setText] = useState('');
  return (
    <form onSubmit={e => { e.preventDefault(); dispatch({ type: 'ADD', text }); setText(''); }}>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}`,
      diagram: null
    },
    {
      id: 'useref',
      title: 'What is useRef and when should you use it?',
      explanation: `
        <h3>useRef — Two Use Cases</h3>
        <p><code>useRef(initialValue)</code> returns a mutable object <code>{ current: initialValue }</code> that persists for the full lifetime of the component. Mutating <code>.current</code> does <strong>not</strong> trigger a re-render.</p>
        <h3>Use Case 1: Accessing DOM Nodes</h3>
        <p>Pass a ref to a DOM element via the <code>ref</code> prop. React sets <code>ref.current</code> to the DOM node after mounting. Use this for: focusing inputs, measuring dimensions, triggering animations, integrating with non-React libraries.</p>
        <h3>Use Case 2: Storing Mutable Values Without Re-render</h3>
        <p>Store values that need to persist across renders but whose changes should <em>not</em> cause a re-render — e.g., timer IDs, previous values, flags, or caching.</p>
        <h3>Ref vs State</h3>
        <ul>
          <li><strong>State:</strong> Change triggers re-render; value is a snapshot per render.</li>
          <li><strong>Ref:</strong> Change does NOT trigger re-render; always the latest value (not a snapshot).</li>
        </ul>
      `,
      code: `import { useRef, useEffect, useState } from 'react';

// Use Case 1: DOM access
function SearchInput() {
  const inputRef = useRef(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} placeholder="Search..." />;
}

// Use Case 2: Store timer ID without re-render
function Stopwatch() {
  const [time, setTime]    = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null); // not state — changes don't need re-render

  const start = () => {
    setRunning(true);
    intervalRef.current = setInterval(() => setTime(t => t + 1), 1000);
  };
  const stop = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
  };

  return (
    <>
      <p>{time}s</p>
      <button onClick={running ? stop : start}>{running ? 'Stop' : 'Start'}</button>
    </>
  );
}

// Use Case 3: Capture previous value
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; }); // runs after render
  return ref.current; // returns value from PREVIOUS render
}`,
      diagram: null
    }
  ]
});
