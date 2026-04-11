window.REACT_MODULES = window.REACT_MODULES || [];
window.REACT_MODULES.push({
  id: 'react-performance',
  title: 'Performance Optimization',
  icon: 'bi bi-graph-up-arrow',
  questions: [
    {
      id: 'react-memo',
      title: 'What is React.memo and when should you use it?',
      explanation: `
        <h3>React.memo</h3>
        <p><code>React.memo</code> is a Higher-Order Component that wraps a component to skip re-rendering when its props have not changed (shallow equality check). It is the component-level equivalent of <code>PureComponent</code> for class components.</p>
        <h3>When to Use</h3>
        <ul>
          <li>The component renders often but its props rarely change.</li>
          <li>The component is expensive to render (large list item, complex chart).</li>
          <li>A parent re-renders frequently due to its own state changes but this child's props are stable.</li>
        </ul>
        <h3>Gotchas</h3>
        <ul>
          <li>Objects and functions are new references on every render — wrap with <code>useMemo</code>/<code>useCallback</code> to stabilise them, or React.memo's optimisation is defeated.</li>
          <li>Don't wrap every component — the memoization comparison itself has a cost. Profile first.</li>
          <li>Use the custom comparator (second argument) for deep equality when needed.</li>
        </ul>
      `,
      code: `import { memo, useState, useCallback } from 'react';

// Expensive child component — skip re-render when props unchanged
const UserCard = memo(function UserCard({ user, onDelete }) {
  console.log('UserCard rendered for', user.id);
  return (
    <div>
      <p>{user.name}</p>
      <button onClick={() => onDelete(user.id)}>Delete</button>
    </div>
  );
});

// Parent
function UserList({ users }) {
  const [filter, setFilter] = useState('');

  // Without useCallback: new function reference every render
  // → UserCard re-renders even when filter changes but users don't
  const handleDelete = useCallback((id) => {
    console.log('Delete', id);
  }, []); // stable reference

  return (
    <>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      {users
        .filter(u => u.name.includes(filter))
        .map(user => (
          <UserCard key={user.id} user={user} onDelete={handleDelete} />
        ))}
    </>
  );
}

// Custom comparator for deep equality
const Chart = memo(
  function Chart({ data }) { /* expensive SVG rendering */ },
  (prevProps, nextProps) => {
    // Return true to SKIP re-render
    return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
  }
);`,
      diagram: null
    },
    {
      id: 'code-splitting',
      title: 'What is code splitting and how do you implement it?',
      explanation: `
        <h3>Code Splitting</h3>
        <p>By default, a bundler (Webpack/Vite) creates one large JS bundle. Code splitting breaks it into smaller chunks that are loaded on demand. This reduces the initial load time — users only download code for the routes they visit.</p>
        <h3>React.lazy + Suspense</h3>
        <p><code>React.lazy()</code> dynamically imports a component. <code>&lt;Suspense fallback={...}&gt;</code> shows a fallback UI while the chunk is loading.</p>
        <h3>Route-Based Splitting (Most Impactful)</h3>
        <p>Each route loads its own chunk. The most common and highest-impact form of code splitting.</p>
        <h3>Component-Based Splitting</h3>
        <p>Lazy-load heavy components that aren't needed immediately — rich text editors, PDF viewers, chart libraries, etc.</p>
      `,
      code: `import { lazy, Suspense } from 'react';

// Lazy-load heavy pages (route-based splitting)
const Dashboard  = lazy(() => import('./pages/Dashboard'));
const Analytics  = lazy(() => import('./pages/Analytics'));
const Settings   = lazy(() => import('./pages/Settings'));
// Each import() creates a separate chunk that loads on demand

function App() {
  return (
    <BrowserRouter>
      {/* Suspense fallback shows while the chunk loads */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"          element={<HomePage />} />    {/* eager */}
          <Route path="/dashboard" element={<Dashboard />} />   {/* lazy */}
          <Route path="/analytics" element={<Analytics />} />   {/* lazy */}
          <Route path="/settings"  element={<Settings />} />    {/* lazy */}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// Component-based splitting: lazy-load a heavy editor
const RichTextEditor = lazy(() => import('./components/RichTextEditor'));

function PostEditor({ post }) {
  const [showEditor, setShowEditor] = useState(false);
  return (
    <div>
      <button onClick={() => setShowEditor(true)}>Edit</button>
      {showEditor && (
        <Suspense fallback={<div>Loading editor...</div>}>
          <RichTextEditor content={post.content} />
        </Suspense>
      )}
    </div>
  );
}

// Named exports require a workaround
const { DataGrid } = lazy(() =>
  import('./DataGrid').then(module => ({ default: module.DataGrid }))
);`,
      diagram: null
    },
    {
      id: 'virtualization',
      title: 'What is list virtualization and when do you need it?',
      explanation: `
        <h3>The Problem</h3>
        <p>Rendering 10,000 list items creates 10,000 DOM nodes — even off-screen. The browser struggles to paint and layout so many nodes, causing slow renders and scrolling jank.</p>
        <h3>Virtualization</h3>
        <p>Virtualization (windowing) renders only the items currently visible in the viewport (plus a small buffer). As the user scrolls, items outside the view are unmounted and new ones are mounted.</p>
        <h3>When to Use</h3>
        <ul>
          <li>Lists with hundreds or thousands of items.</li>
          <li>When you can't paginate (e.g., infinite scroll chat history).</li>
        </ul>
        <h3>Libraries</h3>
        <ul>
          <li><strong>TanStack Virtual (react-virtual):</strong> Headless — you control the markup.</li>
          <li><strong>react-window:</strong> Simple, performant components for fixed and variable size lists/grids.</li>
          <li><strong>react-virtuoso:</strong> Flexible, handles dynamic heights, reverse scroll.</li>
        </ul>
      `,
      code: `// react-window: FixedSizeList
import { FixedSizeList } from 'react-window';

const Row = ({ index, style }) => (
  // style MUST be applied — it sets position/size for the virtual item
  <div style={style} className="row">
    Item {index}
  </div>
);

function LargeList({ items }) {
  return (
    <FixedSizeList
      height={600}         // visible area height (px)
      width="100%"
      itemCount={items.length}
      itemSize={60}        // each row height (px)
      overscanCount={5}    // extra rows above/below viewport
    >
      {Row}
    </FixedSizeList>
  );
}

// TanStack Virtual (headless, more flexible)
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef(null);
  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: rowVirtualizer.getTotalSize() + 'px', position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map(vRow => (
          <div
            key={vRow.index}
            style={{ position: 'absolute', top: vRow.start, width: '100%', height: vRow.size + 'px' }}
          >
            {items[vRow.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}`,
      diagram: null
    },
    {
      id: 'profiler',
      title: 'How do you diagnose and fix unnecessary re-renders?',
      explanation: `
        <h3>React DevTools Profiler</h3>
        <p>The React DevTools browser extension includes a Profiler tab. Record a session, then inspect which components rendered and why (which props changed). The "Highlight updates" option in DevTools visually flashes re-rendering components.</p>
        <h3>Why Why Did You Render?</h3>
        <p>The <code>@welldone-software/why-did-you-render</code> library patches React and logs to the console whenever a component re-renders with the same props/state — pinpointing unnecessary re-renders.</p>
        <h3>Common Causes of Unnecessary Re-Renders</h3>
        <ul>
          <li>Inline object/array literals in JSX props: <code>style={{ color: 'red' }}</code> — new reference every render.</li>
          <li>Inline callback definitions: <code>onClick={() => fn()}</code> — new function every render.</li>
          <li>Context value object is re-created on every Provider render.</li>
          <li>Selectors returning new arrays/objects from Zustand/Redux.</li>
        </ul>
        <h3>Fix Checklist</h3>
        <ul>
          <li>Use <code>React.memo</code> on expensive children.</li>
          <li>Stabilise functions with <code>useCallback</code>.</li>
          <li>Stabilise objects with <code>useMemo</code>.</li>
          <li>Move static data/objects outside the component.</li>
          <li>Split Context into smaller, more focused contexts.</li>
        </ul>
      `,
      code: `// ❌ Patterns that cause unnecessary re-renders

// 1. Inline style object — new reference every render
<Button style={{ color: 'red', fontWeight: 'bold' }} />
// Fix: define outside component or useMemo
const buttonStyle = { color: 'red', fontWeight: 'bold' }; // stable
<Button style={buttonStyle} />

// 2. Inline callback — new function every render
<MemoChild onClick={() => handleClick(id)} />
// Fix: useCallback
const handleClick = useCallback((id) => { /* ... */ }, []);
<MemoChild onClick={() => handleClick(id)} /> // still new arrow fn!
// Better:
const handleSpecificClick = useCallback(() => handleClick(id), [id]);
<MemoChild onClick={handleSpecificClick} />

// 3. Context value recreated on every render
function Provider({ children }) {
  const [user, setUser] = useState(null);
  // ❌ New object every render → all consumers re-render
  return <Ctx.Provider value={{ user, setUser }}>{children}</Ctx.Provider>;
  // ✅ Fix: memoize the value
  const value = useMemo(() => ({ user, setUser }), [user]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// Profiler component for measuring render performance
import { Profiler } from 'react';
<Profiler
  id="UserList"
  onRender={(id, phase, actualDuration) => {
    console.log(id, phase, actualDuration + 'ms');
  }}
>
  <UserList />
</Profiler>`,
      diagram: null
    }
  ]
});
