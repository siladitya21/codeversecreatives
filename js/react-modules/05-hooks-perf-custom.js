window.REACT_MODULES = window.REACT_MODULES || [];
window.REACT_MODULES.push({
  id: 'react-hooks-perf',
  title: 'useMemo, useCallback & Custom Hooks',
  icon: 'bi bi-speedometer2',
  questions: [
    {
      id: 'usememo',
      title: 'What is useMemo and when should you use it?',
      explanation: `
        <h3>useMemo</h3>
        <p><code>useMemo(fn, deps)</code> memoises the <em>return value</em> of a function. React only re-runs the function when the dependencies change; otherwise it returns the cached result.</p>
        <h3>When to Use It</h3>
        <ul>
          <li><strong>Expensive computations</strong> (sorting/filtering large arrays, complex maths).</li>
          <li><strong>Referential stability</strong> — to prevent a derived object/array from being a new reference every render (which would trigger downstream effects or React.memo'd children to re-render).</li>
        </ul>
        <h3>When NOT to Use It</h3>
        <ul>
          <li>Don't memoize trivially cheap operations — the memoization overhead can exceed the savings.</li>
          <li>Don't add it prematurely. Profile first, then optimise.</li>
        </ul>
        <h3>Rule of Thumb</h3>
        <p>Ask: "Is this computation noticeably slow, OR does the result need to be reference-stable?" If neither, skip useMemo.</p>
      `,
      code: `import { useMemo, useState } from 'react';

// ✅ Expensive computation — sorting a large list
function ProductList({ products, searchQuery }) {
  // Only re-filters when products or searchQuery changes
  const filtered = useMemo(() => {
    console.log('Filtering...'); // expensive operation
    return products
      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => a.price - b.price);
  }, [products, searchQuery]);

  return <ul>{filtered.map(p => <ProductItem key={p.id} product={p} />)}</ul>;
}

// ✅ Reference stability — prevent child re-render
function Parent({ userId }) {
  const [count, setCount] = useState(0);

  // Without useMemo: new object on every Parent render → Child re-renders
  const userConfig = useMemo(
    () => ({ userId, maxItems: 10 }),
    [userId] // only changes when userId changes, not when count changes
  );

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>Rerender Parent ({count})</button>
      <MemoizedChild config={userConfig} /> {/* won't re-render due to count */}
    </>
  );
}

// ❌ Overkill — no need to memoize trivial operations
const doubled = useMemo(() => count * 2, [count]); // just write: count * 2`,
      diagram: null
    },
    {
      id: 'usecallback',
      title: 'What is useCallback and how does it differ from useMemo?',
      explanation: `
        <h3>useCallback</h3>
        <p><code>useCallback(fn, deps)</code> memoises a <em>function reference</em>. It returns the same function object between renders unless the dependencies change.</p>
        <h3>useCallback vs useMemo</h3>
        <ul>
          <li><code>useMemo</code> caches the <strong>return value</strong> of a function.</li>
          <li><code>useCallback</code> caches the <strong>function itself</strong>.</li>
          <li><code>useCallback(fn, deps)</code> is equivalent to <code>useMemo(() => fn, deps)</code>.</li>
        </ul>
        <h3>When to Use useCallback</h3>
        <ul>
          <li>Passing a callback to a <code>React.memo</code>'d child — a new function reference every render defeats the memo.</li>
          <li>Using a function as a <code>useEffect</code> dependency — without memoization, a new reference triggers the effect every render.</li>
        </ul>
        <h3>Common Mistake</h3>
        <p>Don't use <code>useCallback</code> on every function — the overhead of memoization and the deps comparison can cost more than just creating a new function.</p>
      `,
      code: `import { useCallback, useState, useEffect } from 'react';

// ✅ Callback passed to memo'd child
function Parent() {
  const [count, setCount] = useState(0);
  const [text, setText]   = useState('');

  // Without useCallback: new function on every Parent render
  // → ExpensiveList re-renders even when only text changes
  const handleSelect = useCallback((id) => {
    console.log('Selected:', id);
  }, []); // no deps — function never needs to change

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <ExpensiveList onSelect={handleSelect} /> {/* won't re-render on text change */}
    </>
  );
}
const ExpensiveList = React.memo(function ExpensiveList({ onSelect }) {
  console.log('ExpensiveList rendered'); // only logs when onSelect reference changes
  return <div onClick={() => onSelect(1)}>Item</div>;
});

// ✅ Function as useEffect dependency
function useEventListener(event, handler) {
  // Stable handler reference needed to avoid effect running every render
  const stableHandler = useCallback(handler, []);
  useEffect(() => {
    window.addEventListener(event, stableHandler);
    return () => window.removeEventListener(event, stableHandler);
  }, [event, stableHandler]);
}`,
      diagram: null
    },
    {
      id: 'custom-hooks',
      title: 'How do you create and use custom hooks?',
      explanation: `
        <h3>What Are Custom Hooks?</h3>
        <p>Custom hooks are plain JavaScript functions whose names start with <code>use</code> and that call other hooks internally. They let you extract and share stateful logic between components — without changing the component hierarchy (no HOC / render props nesting).</p>
        <h3>Rules</h3>
        <ul>
          <li>Name must start with <code>use</code> (required for React's linter rules and tooling).</li>
          <li>Can call other hooks (built-in or custom).</li>
          <li>State and effects inside a custom hook are <strong>isolated per component instance</strong> that calls it — not shared.</li>
        </ul>
        <h3>When to Extract a Custom Hook</h3>
        <ul>
          <li>The same hook logic appears in multiple components.</li>
          <li>A component's hook setup is complex enough to benefit from being named and isolated.</li>
          <li>You want to make a component easier to test by separating logic from rendering.</li>
        </ul>
      `,
      code: `// Custom hook: useLocalStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? initialValue;
    } catch { return initialValue; }
  });

  const set = useCallback((newVal) => {
    setValue(newVal);
    localStorage.setItem(key, JSON.stringify(newVal));
  }, [key]);

  return [value, set];
}

// Custom hook: useDebounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// Custom hook: useWindowSize
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return size;
}

// Usage — hooks compose naturally
function SearchPage() {
  const [query, setQuery] = useLocalStorage('searchQuery', '');
  const debouncedQuery    = useDebounce(query, 300);
  const { width }         = useWindowSize();

  useEffect(() => {
    if (debouncedQuery) fetchResults(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <input value={query} onChange={e => setQuery(e.target.value)}
           placeholder={width < 768 ? 'Search...' : 'Search products...'} />
  );
}`,
      diagram: null
    },
    {
      id: 'useid-useimperativehandle',
      title: 'What are useId and useImperativeHandle?',
      explanation: `
        <h3>useId (React 18+)</h3>
        <p>Generates a stable, unique ID that is consistent between server and client renders. Use it to connect form labels to inputs (<code>htmlFor</code>/<code>id</code>) in reusable components — avoids hardcoding IDs that would clash if the component is rendered multiple times.</p>
        <h3>useImperativeHandle</h3>
        <p>Customises what is exposed when a parent uses a <code>ref</code> on a child component. Instead of exposing the raw DOM node, you expose a specific API. Used with <code>forwardRef</code>.</p>
        <h3>When to Use useImperativeHandle</h3>
        <ul>
          <li>Building reusable components with imperative APIs (focus, scroll, shake animations).</li>
          <li>You want to limit what a parent can do with the ref — expose only safe methods.</li>
        </ul>
      `,
      code: `import { useId, useRef, useImperativeHandle, forwardRef } from 'react';

// useId: consistent IDs for accessibility
function LabelledInput({ label }) {
  const id = useId(); // e.g. ':r0:', ':r1:' — unique per instance
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
}
// Safe to render twice:
// <LabelledInput label="Name" />    → id=":r0:"
// <LabelledInput label="Email" />   → id=":r1:"  (no clash)

// useImperativeHandle: expose a controlled API on a ref
const FancyInput = forwardRef(function FancyInput(props, ref) {
  const inputRef = useRef(null);

  // Parent's ref will have these methods, not the raw <input> DOM node
  useImperativeHandle(ref, () => ({
    focus() { inputRef.current.focus(); },
    shake() { inputRef.current.classList.add('shake'); },
    getValue() { return inputRef.current.value; },
  }));

  return <input ref={inputRef} {...props} />;
});

// Parent uses it
function Form() {
  const inputRef = useRef(null);
  return (
    <>
      <FancyInput ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
      <button onClick={() => inputRef.current.shake()}>Shake</button>
    </>
  );
}`,
      diagram: null
    }
  ]
});
