window.REACT_MODULES = window.REACT_MODULES || [];
window.REACT_MODULES.push({
  id: 'react-hooks-state-effect',
  title: 'useState & useEffect',
  icon: 'bi bi-arrow-repeat',
  questions: [
    {
      id: 'usestate',
      title: 'How does useState work internally?',
      explanation: `
        <h3>useState Basics</h3>
        <p><code>useState</code> declares a state variable that persists across renders. When you call the setter, React schedules a re-render and the component function runs again — but the state value returned by <code>useState</code> reflects the new value.</p>
        <h3>How React Stores State</h3>
        <p>React stores state in a linked list of "hooks slots" tied to the component's fiber node. The order in which you call hooks must be stable — that is why you cannot call hooks inside conditions or loops.</p>
        <h3>State Updates are Asynchronous Batches</h3>
        <p>In React 18, all state updates are automatically batched — even inside <code>setTimeout</code>, <code>Promise</code> handlers, and native event listeners. Multiple <code>setX()</code> calls in one handler trigger only one re-render.</p>
        <h3>Functional Updates</h3>
        <p>When the next state depends on the previous state, always use the <em>updater function</em> form <code>setState(prev => ...)</code> to avoid stale closures.</p>
      `,
      code: `import { useState } from 'react';

// Basic usage
function Counter() {
  const [count, setCount] = useState(0); // initial value: 0

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}

// ✅ Functional update (safe when next value depends on previous)
function SafeCounter() {
  const [count, setCount] = useState(0);
  // Each click correctly increments — no stale closure risk
  const add3 = () => {
    setCount(c => c + 1);
    setCount(c => c + 1);
    setCount(c => c + 1); // final count: prev + 3
  };
  return <button onClick={add3}>+3</button>;
}

// Object state — must spread to preserve other fields
function Form() {
  const [form, setForm] = useState({ name: '', email: '' });

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <>
      <input name="name"  value={form.name}  onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
    </>
  );
}

// Lazy initialization (expensive initial value)
const [data, setData] = useState(() => parseHeavyData()); // called once`,
      diagram: null
    },
    {
      id: 'rules-of-hooks',
      title: 'What are the Rules of Hooks?',
      explanation: `
        <h3>Rule 1: Only Call Hooks at the Top Level</h3>
        <p>Never call hooks inside loops, conditions, or nested functions. React relies on the <strong>call order</strong> to map hook calls to their stored state. Breaking order corrupts the state map.</p>
        <h3>Rule 2: Only Call Hooks from React Functions</h3>
        <p>Hooks can only be called from function components or custom hooks — not from regular JavaScript functions, class methods, or event listeners.</p>
        <h3>Why These Rules Exist</h3>
        <p>React stores each component's hook state as an ordered list. On every render, the N-th <code>useState</code> call maps to the N-th slot. If you call hooks conditionally, the order can change and React reads the wrong slot.</p>
        <h3>Enforcement</h3>
        <p>The <code>eslint-plugin-react-hooks</code> package (included in CRA and Vite) enforces both rules at lint time.</p>
      `,
      code: `// ❌ WRONG — hook inside condition
function Bad({ showName }) {
  if (showName) {
    const [name, setName] = useState(''); // breaks hook order!
  }
  // ...
}

// ❌ WRONG — hook inside loop
function BadList({ items }) {
  return items.map(item => {
    const [selected, setSelected] = useState(false); // ILLEGAL
    return <div key={item.id}>{item.name}</div>;
  });
}

// ✅ CORRECT — hooks always at top level
function Good({ showName }) {
  const [name, setName] = useState(''); // always called, same order

  if (!showName) return null; // conditional return is fine
  return <p>{name}</p>;
}

// ✅ CORRECT — move state into child component
function GoodList({ items }) {
  return items.map(item => <SelectableItem key={item.id} item={item} />);
}
function SelectableItem({ item }) {
  const [selected, setSelected] = useState(false); // fine inside its own component
  return <div onClick={() => setSelected(s => !s)}>{item.name}</div>;
}`,
      diagram: null
    },
    {
      id: 'useeffect',
      title: 'How does useEffect work and what are its dependencies?',
      explanation: `
        <h3>useEffect Overview</h3>
        <p><code>useEffect</code> lets you synchronise a component with an external system (DOM, timers, subscriptions, network, etc.) after rendering.</p>
        <h3>Three Dependency Array Modes</h3>
        <ul>
          <li><strong>No array:</strong> Runs after every render.</li>
          <li><strong>Empty array <code>[]</code>:</strong> Runs once on mount (equivalent to <code>componentDidMount</code>).</li>
          <li><strong>With values <code>[a, b]</code>:</strong> Runs on mount and whenever <code>a</code> or <code>b</code> changes.</li>
        </ul>
        <h3>Cleanup Function</h3>
        <p>Return a function from <code>useEffect</code> to run cleanup before the component unmounts or before the effect re-runs. This is critical for timers, subscriptions, and event listeners — otherwise you get memory leaks.</p>
        <h3>Golden Rule</h3>
        <p>Every reactive value (props, state, variables) used inside the effect <strong>must be listed</strong> in the dependency array — or you'll get stale data bugs.</p>
      `,
      code: `import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  // Runs whenever userId changes
  useEffect(() => {
    let cancelled = false; // handle race conditions

    fetch('/api/user/' + userId)
      .then(r => r.json())
      .then(data => {
        if (!cancelled) setUser(data);
      });

    // Cleanup: if userId changes before fetch resolves,
    // ignore the stale response
    return () => { cancelled = true; };
  }, [userId]); // ← userId is a dependency

  return user ? <div>{user.name}</div> : <Spinner />;
}

// Timer with cleanup (prevents memory leak on unmount)
function Stopwatch() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(id); // cleanup on unmount
  }, []); // [] = set up once

  return <p>{time}s</p>;
}

// ❌ Missing dependency — stale closure bug
useEffect(() => {
  document.title = 'User: ' + userId; // userId is used...
}, []); // ...but not listed — will always show initial userId`,
      diagram: `<div class="diagram-wrap">
  <div style="font-size:0.8rem;font-family:monospace">
    <div style="font-weight:700;color:#e2e8f0;margin-bottom:8px">useEffect Lifecycle</div>
    <div style="display:flex;flex-direction:column;gap:6px">
      <div style="padding:8px 12px;background:#1e3a5f;border-radius:6px;color:#93c5fd;border:1px solid #1d4ed8">1. Component renders (paint to screen)</div>
      <div style="padding:8px 12px;background:#1e293b;border-radius:6px;color:#94a3b8;border:1px solid #334155">2. useEffect runs (after paint)</div>
      <div style="padding:8px 12px;background:#1e293b;border-radius:6px;color:#94a3b8;border:1px solid #334155">3. Dependency changes → cleanup runs first</div>
      <div style="padding:8px 12px;background:#1e293b;border-radius:6px;color:#94a3b8;border:1px solid #334155">4. Effect runs again with new values</div>
      <div style="padding:8px 12px;background:#3b1a1a;border-radius:6px;color:#fca5a5;border:1px solid #b91c1c">5. Component unmounts → cleanup runs</div>
    </div>
  </div>
</div>`
    },
    {
      id: 'uselayouteffect',
      title: 'useLayoutEffect vs useEffect — what is the difference?',
      explanation: `
        <h3>The Timing Difference</h3>
        <ul>
          <li><code>useEffect</code> fires <strong>after</strong> the browser has painted. It is async and does not block the visual update.</li>
          <li><code>useLayoutEffect</code> fires <strong>synchronously after DOM mutations but before the browser paints</strong>. It blocks the paint.</li>
        </ul>
        <h3>When to Use useLayoutEffect</h3>
        <ul>
          <li>Reading DOM measurements (element width/height, scroll position) that affect layout.</li>
          <li>Preventing a visible flicker — if <code>useEffect</code> causes a visual jump (e.g., a tooltip positioning itself), switch to <code>useLayoutEffect</code>.</li>
        </ul>
        <h3>Default: useEffect</h3>
        <p>Use <code>useEffect</code> for 95%+ of cases. Only reach for <code>useLayoutEffect</code> when you experience or want to prevent visible layout jitter.</p>
        <h3>SSR Warning</h3>
        <p><code>useLayoutEffect</code> does not run during server-side rendering and React will warn. Use <code>useEffect</code> for SSR-compatible code, or check <code>typeof window !== 'undefined'</code>.</p>
      `,
      code: `import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// useLayoutEffect: measure DOM before paint (no flicker)
function Tooltip({ target, text }) {
  const tooltipRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    // DOM is updated, but browser hasn't painted yet
    // Perfect for measuring and repositioning
    const rect = target.current.getBoundingClientRect();
    const tip  = tooltipRef.current.getBoundingClientRect();
    setPos({
      top:  rect.bottom + window.scrollY,
      left: rect.left + (rect.width - tip.width) / 2,
    });
  }); // no deps — run after every render that touches the DOM

  return (
    <div
      ref={tooltipRef}
      style={{ position: 'absolute', top: pos.top, left: pos.left }}
    >
      {text}
    </div>
  );
}

// useEffect is fine for non-visual side effects
useEffect(() => {
  analytics.track('page_view', { path: location.pathname });
}, [location.pathname]);`,
      diagram: null
    },
    {
      id: 'effect-pitfalls',
      title: 'What are common useEffect pitfalls?',
      explanation: `
        <h3>1. Missing Dependencies</h3>
        <p>Using a reactive value inside an effect without listing it in the dependency array causes stale closure bugs — the effect "sees" an old value. Always include all reactive values or extract non-reactive ones outside the component.</p>
        <h3>2. Infinite Loops</h3>
        <p>Setting state inside an effect that lists that state as a dependency causes an infinite loop. Use functional updates or restructure the logic.</p>
        <h3>3. Object/Array as Dependency</h3>
        <p>Objects created inline are new references every render. Listing them as deps causes the effect to re-run on every render. Use <code>useMemo</code>, move the object outside the component, or destructure primitives.</p>
        <h3>4. No Cleanup for Subscriptions/Timers</h3>
        <p>Without cleanup, timers and subscriptions continue running after the component unmounts, causing memory leaks and errors on unmounted components.</p>
        <h3>5. Race Conditions in Data Fetching</h3>
        <p>If a fast response arrives after a slow one, you'll display stale data. Always use a cancellation flag or <code>AbortController</code>.</p>
      `,
      code: `// ❌ Pitfall 1: Infinite loop
useEffect(() => {
  setCount(count + 1); // triggers re-render → effect runs again → ...
}, [count]);

// ✅ Fix: functional update, empty deps
useEffect(() => {
  setCount(c => c + 1); // still need to think about deps!
}, []);

// ❌ Pitfall 2: Object reference causes infinite loop
function SearchBox({ filters }) {
  // 'filters' is a new object every render if created inline
  useEffect(() => {
    fetchResults(filters);
  }, [filters]); // new reference every render = infinite fetch!
}
// ✅ Fix: destructure primitive values
useEffect(() => {
  fetchResults(filters);
}, [filters.category, filters.sort]); // primitives are stable

// ✅ Race condition fix with AbortController
useEffect(() => {
  const controller = new AbortController();
  fetch('/api/data', { signal: controller.signal })
    .then(r => r.json())
    .then(setData)
    .catch(e => { if (e.name !== 'AbortError') setError(e); });
  return () => controller.abort();
}, []);`,
      diagram: null
    }
  ]
});
