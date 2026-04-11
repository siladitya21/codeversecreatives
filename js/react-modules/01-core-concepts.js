window.REACT_MODULES = window.REACT_MODULES || [];
window.REACT_MODULES.push({
  id: 'react-core',
  title: 'Core Concepts',
  icon: 'bi bi-lightning-charge-fill',
  questions: [
    {
      id: 'react-what-is',
      title: 'What is React and what problem does it solve?',
      explanation: `
        <p>React is an open-source JavaScript <strong>library</strong> (not a framework) built by Meta for constructing user interfaces. It uses a declarative, component-based model where you describe <em>what</em> the UI should look like and React handles <em>how</em> to update the DOM efficiently.</p>
        <h3>Problems React Solves</h3>
        <ul>
          <li><strong>DOM performance:</strong> Direct DOM manipulation is slow. React batches updates through a Virtual DOM layer.</li>
          <li><strong>State synchronisation:</strong> Keeping the UI in sync with changing data is hard imperatively. React makes data flow explicit and one-directional.</li>
          <li><strong>Reusability:</strong> Components are self-contained, composable units that can be shared across an app.</li>
          <li><strong>Predictability:</strong> Given the same props and state, a component always renders the same output.</li>
        </ul>
        <h3>Core Principles</h3>
        <ul>
          <li><strong>Declarative:</strong> Describe the desired UI; React reconciles with the real DOM.</li>
          <li><strong>Component-based:</strong> UIs are composed from isolated, reusable pieces.</li>
          <li><strong>Unidirectional data flow:</strong> Data flows down (props), events bubble up (callbacks).</li>
        </ul>
      `,
      code: `// React: describe WHAT to render, not HOW to update
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  // React automatically figures out the minimal DOM change
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}

// Compare: imperative DOM manipulation (no React)
const btn = document.querySelector('button');
let n = 0;
btn.addEventListener('click', () => {
  n++;
  document.querySelector('p').textContent = 'Count: ' + n;
  // You must manually keep DOM in sync — error-prone at scale
});`,
      diagram: `<div class="diagram-wrap">
  <div style="font-size:0.8rem;font-family:monospace">
    <div style="font-weight:700;color:#e2e8f0;margin-bottom:10px">React Update Pipeline</div>
    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
      <div style="padding:8px 14px;background:#1e293b;color:#94a3b8;border-radius:8px;border:1px solid #334155;text-align:center">
        <div style="font-weight:700;color:#e2e8f0">State/Props</div><div style="font-size:0.7rem">changes</div>
      </div>
      <div style="color:#6366f1">→</div>
      <div style="padding:8px 14px;background:#1e293b;color:#94a3b8;border-radius:8px;border:1px solid #334155;text-align:center">
        <div style="font-weight:700;color:#e2e8f0">Re-render</div><div style="font-size:0.7rem">new VDOM tree</div>
      </div>
      <div style="color:#6366f1">→</div>
      <div style="padding:8px 14px;background:#1e293b;color:#94a3b8;border-radius:8px;border:1px solid #334155;text-align:center">
        <div style="font-weight:700;color:#e2e8f0">Diffing</div><div style="font-size:0.7rem">old vs new VDOM</div>
      </div>
      <div style="color:#6366f1">→</div>
      <div style="padding:8px 14px;background:#064e3b;color:#6ee7b7;border-radius:8px;border:1px solid #065f46;text-align:center">
        <div style="font-weight:700">Patch DOM</div><div style="font-size:0.7rem">minimal updates only</div>
      </div>
    </div>
  </div>
</div>`
    },
    {
      id: 'virtual-dom',
      title: 'How does the Virtual DOM work?',
      explanation: `
        <h3>Virtual DOM (VDOM)</h3>
        <p>The VDOM is a lightweight, in-memory representation of the real DOM — a plain JavaScript object tree. React keeps a copy of the current UI state as a VDOM tree and creates a new one on each render.</p>
        <h3>The Three-Step Process</h3>
        <ul>
          <li><strong>1. Render:</strong> When state/props change, React calls the component function again and builds a new VDOM tree (pure JS objects — very fast).</li>
          <li><strong>2. Diff:</strong> React compares the new VDOM against the previous one (reconciliation) to find what changed.</li>
          <li><strong>3. Commit:</strong> React applies only the necessary DOM mutations — in a single batch.</li>
        </ul>
        <h3>Common Interview Clarification</h3>
        <p>The VDOM is not always "faster than the real DOM". For tiny UIs, direct DOM updates can be faster. React's value is <strong>developer ergonomics + consistent performance</strong> at scale through batching and predictable updates.</p>
      `,
      code: `// JSX compiles to React.createElement() calls
const element = (
  <div className="card">
    <h1>Hello</h1>
    <p>World</p>
  </div>
);

// Babel transforms this to:
const element = React.createElement(
  'div',
  { className: 'card' },
  React.createElement('h1', null, 'Hello'),
  React.createElement('p',  null, 'World')
);

// Which produces a plain JS object (the "virtual" DOM node):
// {
//   type: 'div',
//   props: {
//     className: 'card',
//     children: [
//       { type: 'h1', props: { children: 'Hello' } },
//       { type: 'p',  props: { children: 'World' } }
//     ]
//   }
// }
//
// This object is cheap to create and compare.
// React diffs these objects, then does minimal real DOM work.`,
      diagram: null
    },
    {
      id: 'reconciliation',
      title: 'What is reconciliation and the diffing algorithm?',
      explanation: `
        <h3>Reconciliation</h3>
        <p>Reconciliation is React's algorithm for updating the DOM. After a render, React compares the new element tree to the previous one and computes the minimal set of DOM operations needed.</p>
        <h3>Naive vs React's Diffing</h3>
        <p>A general tree diffing algorithm is O(n³). React uses two heuristics to achieve O(n):</p>
        <ul>
          <li><strong>Different element types → full subtree rebuild:</strong> If a <code>&lt;div&gt;</code> changes to a <code>&lt;span&gt;</code>, React tears down the old tree and mounts a fresh one. All state in that subtree is lost.</li>
          <li><strong>Keys for lists:</strong> React uses <code>key</code> props to match list items across renders. Without keys, React compares by position, causing incorrect reuse and state bugs.</li>
        </ul>
        <h3>Same Type Rules</h3>
        <ul>
          <li>DOM elements of the same type → only update changed attributes</li>
          <li>Component instances of the same type → update props, keep state</li>
        </ul>
      `,
      code: `// ✅ Stable unique keys — React tracks items correctly
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}

// ❌ Index as key — breaks on reorder or deletion
{todos.map((todo, i) => (
  <TodoItem key={i} todo={todo} />  // DON'T do this for dynamic lists
))}

// Type change → full remount (all child state is lost)
// Before: <Counter />  ← internal count = 5
// After:  <Timer />    ← completely new instance, fresh state

// Same type, changed props → efficient update
// Before: <Avatar size={40} color="blue" />
// After:  <Avatar size={40} color="red" />
// → Only the color attribute is updated in the real DOM

// Key change forces a remount (useful for resetting state)
<ProfileForm key={userId} userId={userId} />
// Changing userId resets all form state`,
      diagram: null
    },
    {
      id: 'fiber',
      title: 'What is React Fiber?',
      explanation: `
        <h3>Why Fiber?</h3>
        <p>React 16 replaced the old "stack" reconciler with Fiber — a complete rewrite. The old reconciler was synchronous and non-interruptible. Large component trees would block the main thread and cause dropped frames.</p>
        <h3>What Fiber Is</h3>
        <p>A <em>fiber</em> is a JavaScript object representing a unit of work (one component). React maintains a fiber tree and processes units of work one at a time, yielding back to the browser between units when needed.</p>
        <h3>What Fiber Enables</h3>
        <ul>
          <li><strong>Interruptible rendering:</strong> React can pause work and resume later.</li>
          <li><strong>Priority scheduling:</strong> User interactions (typing, clicking) get higher priority than background data updates.</li>
          <li><strong>Concurrent Mode (React 18):</strong> Multiple versions of the UI can be prepared in the background simultaneously.</li>
          <li><strong>Suspense &amp; lazy loading:</strong> React can "pause" rendering to wait for async data.</li>
          <li><strong>Error Boundaries:</strong> Errors are caught per subtree without crashing the whole app.</li>
        </ul>
        <h3>Two Phases</h3>
        <ul>
          <li><strong>Render phase:</strong> Interruptible — builds the work-in-progress fiber tree.</li>
          <li><strong>Commit phase:</strong> Synchronous — applies DOM mutations all at once.</li>
        </ul>
      `,
      code: `// Fiber powers React 18 Concurrent Features:
import { createRoot } from 'react-dom/client';
import { useTransition, useDeferredValue, Suspense, lazy } from 'react';

// createRoot enables concurrent rendering (Fiber-based)
const root = createRoot(document.getElementById('root'));
root.render(<App />);

// useTransition: mark a state update as non-urgent
function SearchPage() {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    setQuery(e.target.value); // urgent — update input immediately

    startTransition(() => {
      // non-urgent — React can interrupt this if user keeps typing
      setResults(heavySearch(e.target.value));
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <ResultsList data={results} />
    </>
  );
}

// Lazy loading (Fiber suspends render while chunk loads)
const Settings = lazy(() => import('./Settings'));
<Suspense fallback={<Spinner />}>
  <Settings />
</Suspense>`,
      diagram: `<div class="diagram-wrap">
  <div style="font-size:0.8rem;font-family:monospace">
    <div style="font-weight:700;color:#e2e8f0;margin-bottom:8px">Fiber Two-Tree Architecture</div>
    <div style="display:flex;gap:16px;flex-wrap:wrap">
      <div style="flex:1;min-width:130px;padding:10px;background:#1e293b;border-radius:8px;border:1px solid #334155">
        <div style="font-weight:600;color:#94a3b8;font-size:0.7rem;text-transform:uppercase;margin-bottom:6px">Current Tree</div>
        <div style="color:#e2e8f0">Committed to DOM</div>
        <div style="color:#64748b;font-size:0.7rem">What you see on screen</div>
      </div>
      <div style="display:flex;align-items:center;color:#6366f1;font-size:1.4rem">⇄</div>
      <div style="flex:1;min-width:130px;padding:10px;background:#1e293b;border-radius:8px;border:1px solid #6366f1">
        <div style="font-weight:600;color:#818cf8;font-size:0.7rem;text-transform:uppercase;margin-bottom:6px">Work-in-Progress</div>
        <div style="color:#e2e8f0">Being rendered</div>
        <div style="color:#64748b;font-size:0.7rem">Interruptible / pauseable</div>
      </div>
    </div>
    <div style="margin-top:8px;padding:8px;background:#0f172a;border-radius:6px;color:#64748b;font-size:0.72rem">
      When WIP is complete → swap becomes new Current (commit phase)
    </div>
  </div>
</div>`
    },
    {
      id: 'class-vs-function',
      title: 'Class components vs function components — key differences',
      explanation: `
        <h3>Function Components Are the Standard</h3>
        <p>Since React 16.8 introduced Hooks, function components can do everything class components can — with less boilerplate. All modern React code is written as functions.</p>
        <h3>Key Differences</h3>
        <ul>
          <li><strong>Syntax:</strong> Functions are just JS functions; classes extend <code>React.Component</code>.</li>
          <li><strong>State:</strong> Functions use <code>useState</code>; classes use <code>this.state</code> and <code>this.setState()</code>.</li>
          <li><strong>Side effects:</strong> Functions use <code>useEffect</code>; classes use lifecycle methods like <code>componentDidMount</code>.</li>
          <li><strong>Closures:</strong> Function components capture props/state at render time. Each render is a snapshot. Classes read from <code>this</code>, which is mutable — a common source of stale-value bugs.</li>
          <li><strong>this binding:</strong> Classes require careful binding; functions have no <code>this</code> issues.</li>
          <li><strong>Error Boundaries:</strong> Still require class components (no hook equivalent yet).</li>
        </ul>
      `,
      code: `// ---- Class Component (legacy) -------------------------
class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { seconds: 0 };
  }
  componentDidMount() {
    this.id = setInterval(
      () => this.setState(s => ({ seconds: s.seconds + 1 })),
      1000
    );
  }
  componentWillUnmount() { clearInterval(this.id); }
  render() { return <p>Seconds: {this.state.seconds}</p>; }
}

// ---- Equivalent Function Component (modern) -----------
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setSeconds(s => s + 1),
      1000
    );
    return () => clearInterval(id); // cleanup on unmount
  }, []); // [] = run once on mount

  return <p>Seconds: {seconds}</p>;
}

// Stale closure pitfall (class avoids this via this.props):
function Delayed({ message }) {
  const showAfter3s = () => {
    setTimeout(() => alert(message), 3000); // captures current message
  };
  // If parent changes message before 3s, alert shows the OLD message
  // (This is a feature, not a bug — predictable snapshot semantics)
  return <button onClick={showAfter3s}>Show</button>;
}`,
      diagram: null
    },
    {
      id: 'keys',
      title: 'What are keys and why are they critical in lists?',
      explanation: `
        <h3>Keys in React</h3>
        <p>A <code>key</code> is a special string (or number) prop that tells React how to identify a specific element across renders. React uses keys during reconciliation to match list items.</p>
        <h3>Why It Matters</h3>
        <ul>
          <li>Without keys, React matches items by array position. Prepending or removing an item causes every subsequent item to appear "changed" — React re-renders and re-creates them unnecessarily.</li>
          <li>With stable keys, React tracks items individually even when they reorder.</li>
          <li>Component state is tied to the key. If a key changes, React <strong>unmounts the old instance and mounts a fresh one</strong> — all state resets.</li>
        </ul>
        <h3>Key Rules</h3>
        <ul>
          <li>Must be unique among <em>siblings</em> (not globally unique).</li>
          <li>Must be stable across renders — avoid <code>Math.random()</code> or index for dynamic lists.</li>
          <li>Index as key is only safe for static, non-reorderable lists.</li>
        </ul>
      `,
      code: `// ✅ Use stable IDs from data
function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <ListItem key={item.id} data={item} />
      ))}
    </ul>
  );
}

// ❌ Index as key — causes bugs when items are added/removed/sorted
{items.map((item, index) => (
  <ListItem key={index} data={item} />
))}

// ✅ Index is fine for truly static lists
const TABS = ['Overview', 'Settings', 'Billing'];
{TABS.map((tab, i) => <Tab key={i} label={tab} />)}

// 🔄 Key trick: force reset of component state
// When userId changes, <ProfileForm> is fully remounted
// and all its internal state (form fields, etc.) resets to defaults
function App({ userId }) {
  return <ProfileForm key={userId} userId={userId} />;
}`,
      diagram: null
    }
  ]
});
