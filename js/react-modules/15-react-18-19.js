window.REACT_MODULES = window.REACT_MODULES || [];
window.REACT_MODULES.push({
  id: 'react-18-19',
  title: 'React 18 & 19 Features',
  icon: 'bi bi-stars',
  questions: [
    {
      id: 'react-18-concurrent',
      title: 'What are the key React 18 concurrent features?',
      explanation: `
        <h3>React 18 Highlights</h3>
        <p>React 18 made Concurrent Mode stable and introduced new hooks to take advantage of it. The key change: upgrade from <code>ReactDOM.render</code> to <code>createRoot</code> to opt in.</p>
        <h3>Automatic Batching</h3>
        <p>React 17 only batched state updates inside React event handlers. React 18 automatically batches all updates — inside <code>setTimeout</code>, native event listeners, Promises, and anywhere else — into a single re-render.</p>
        <h3>useTransition</h3>
        <p>Marks a state update as non-urgent (a "transition"). React can interrupt the transition render to handle urgent updates (like typing). The <code>isPending</code> flag lets you show a loading indicator.</p>
        <h3>useDeferredValue</h3>
        <p>Defers updating a value until the browser has free time. Useful when a value drives an expensive render — the UI stays responsive while the heavy render happens in the background.</p>
      `,
      code: `import {
  createRoot, useTransition, useDeferredValue, useState
} from 'react';

// --- Opt in to React 18 concurrent features ---
const root = createRoot(document.getElementById('root'));
root.render(<App />);

// --- Automatic Batching (React 18) ---
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React 18: ONE re-render for both updates
  // React 17: TWO re-renders
}, 1000);

// --- useTransition: responsive search with heavy result list ---
function SearchPage() {
  const [query,   setQuery]   = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const val = e.target.value;
    setQuery(val);                     // urgent: update input immediately

    startTransition(() => {
      setResults(heavyFilter(val));    // non-urgent: can be interrupted
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending
        ? <p style={{ opacity: 0.5 }}>Updating results...</p>
        : <ResultList items={results} />}
    </>
  );
}

// --- useDeferredValue: defer expensive child re-render ---
function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text); // lags behind text

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      {/* SlowList uses deferredText — stays behind but input stays snappy */}
      <SlowList query={deferredText} />
    </>
  );
}`,
      diagram: `<div class="diagram-wrap">
  <div style="font-size:0.8rem;font-family:monospace">
    <div style="font-weight:700;color:#e2e8f0;margin-bottom:8px">Urgent vs Transition Updates</div>
    <div style="display:flex;flex-direction:column;gap:6px">
      <div style="padding:8px 12px;background:#1e3a5f;border-radius:6px;color:#93c5fd;border:1px solid #1d4ed8">
        <strong>Urgent</strong> (setQuery): paint immediately — user sees every keystroke
      </div>
      <div style="padding:8px 12px;background:#1e293b;border-radius:6px;color:#94a3b8;border:1px solid #334155">
        <strong>Transition</strong> (setResults): interruptible — yields to urgent updates
      </div>
      <div style="padding:8px 12px;background:#064e3b;border-radius:6px;color:#6ee7b7;border:1px solid #065f46">
        Result: input never lags, results update as fast as the browser allows
      </div>
    </div>
  </div>
</div>`
    },
    {
      id: 'server-components',
      title: 'What are React Server Components?',
      explanation: `
        <h3>React Server Components (RSC)</h3>
        <p>Server Components run <strong>exclusively on the server</strong> (or at build time). They render to a special wire format, not HTML. They can access databases, file system, and secrets directly — without sending that code to the client.</p>
        <h3>Client vs Server Components</h3>
        <ul>
          <li><strong>Server Components (default in Next.js 13+):</strong> No state, no effects, no browser APIs. Can <code>async/await</code> directly. Not re-rendered on client.</li>
          <li><strong>Client Components (<code>'use client'</code> directive):</strong> Use state, effects, browser APIs, event handlers. Sent to and run on the client.</li>
        </ul>
        <h3>Benefits</h3>
        <ul>
          <li>Zero client-side JS for server components — smaller bundles.</li>
          <li>Direct database/backend access without API layer.</li>
          <li>Secrets (API keys, tokens) never reach the client.</li>
          <li>Streaming rendering — server streams UI as it's ready.</li>
        </ul>
        <h3>Key Rule</h3>
        <p>Server components can import and render client components, but client components cannot import server components (they can receive them as <code>children</code> props).</p>
      `,
      code: `// app/users/page.tsx (Next.js 14 App Router)
// Server Component — runs only on server, no 'use client' directive
// Can fetch data directly, access DB, read environment secrets

import { db } from '@/lib/db'; // direct DB access — never sent to client!

async function UsersPage() {
  // async/await directly in the component — no useEffect needed
  const users = await db.query('SELECT * FROM users');

  return (
    <main>
      <h1>Users ({users.length})</h1>
      {users.map(user => (
        // UserCard is also a Server Component
        <UserCard key={user.id} user={user} />
      ))}
      {/* LikeButton needs interactivity → must be a Client Component */}
      <AddUserButton />
    </main>
  );
}

// app/components/AddUserButton.tsx
'use client'; // marks this as a Client Component
import { useState } from 'react';

function AddUserButton() {
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    setLoading(true);
    await fetch('/api/users', { method: 'POST' });
    setLoading(false);
  }

  return (
    <button onClick={handleAdd} disabled={loading}>
      {loading ? 'Adding...' : 'Add User'}
    </button>
  );
}

// Server Component passing children (pattern for mixing)
// Server wraps Client, Client receives server-rendered children
function ServerLayout({ children }) { // Server Component
  return <section className="layout">{children}</section>;
}
// <ServerLayout><ClientSidebar /></ServerLayout> ✅`,
      diagram: null
    },
    {
      id: 'react-19',
      title: 'What are the key React 19 features?',
      explanation: `
        <h3>React 19 (Stable 2024)</h3>
        <p>React 19 shipped several new hooks and patterns focused on form handling, async operations, and simplifying common patterns.</p>
        <h3>use() Hook</h3>
        <p><code>use(promise)</code> reads the resolved value of a Promise inside a component (like await, but works in render). Can be used conditionally — unlike other hooks. Triggers the nearest Suspense boundary while pending.</p>
        <h3>useActionState</h3>
        <p>Manages the state of a form action — combines loading, error, and result state for form submissions (especially Server Actions).</p>
        <h3>useFormStatus</h3>
        <p>Returns the pending state of the parent <code>&lt;form&gt;</code> submission — accessible from any child, enabling submit buttons that disable themselves automatically.</p>
        <h3>useOptimistic</h3>
        <p>Provides an optimistic version of state that applies a temporary UI update while an async operation is in progress, then reverts to real state when done.</p>
        <h3>React Compiler</h3>
        <p>An experimental compiler that automatically memoizes components and hooks — making <code>React.memo</code>, <code>useMemo</code>, and <code>useCallback</code> largely unnecessary by applying them automatically at compile time.</p>
      `,
      code: `// use() hook — read a promise in render (React 19)
import { use, Suspense } from 'react';

function UserProfile({ userPromise }) {
  const user = use(userPromise); // suspends if pending, unwraps when resolved
  return <div>{user.name}</div>;
}
// Usage
const promise = fetch('/api/user/1').then(r => r.json());
<Suspense fallback={<Skeleton />}>
  <UserProfile userPromise={promise} />
</Suspense>

// useActionState — form with server action
import { useActionState } from 'react';
async function createUser(prevState, formData) {
  const name = formData.get('name');
  try {
    await db.createUser({ name });
    return { success: true, message: 'User created!' };
  } catch (e) {
    return { success: false, message: e.message };
  }
}
function NewUserForm() {
  const [state, formAction, isPending] = useActionState(createUser, null);
  return (
    <form action={formAction}>
      <input name="name" required />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create'}
      </button>
      {state?.message && <p className={state.success ? 'ok' : 'err'}>{state.message}</p>}
    </form>
  );
}

// useFormStatus — read parent form pending state
import { useFormStatus } from 'react-dom';
function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? 'Saving...' : 'Save'}</button>;
}

// useOptimistic — instant UI feedback
import { useOptimistic } from 'react';
function Messages({ messages, sendMessage }) {
  const [optimisticMessages, addOptimistic] = useOptimistic(
    messages,
    (prev, newText) => [...prev, { text: newText, sending: true }]
  );
  async function send(formData) {
    const text = formData.get('message');
    addOptimistic(text);            // show immediately
    await sendMessage(text);        // real request
  }
  return (
    <form action={send}>
      <ul>
        {optimisticMessages.map((m, i) => (
          <li key={i} style={{ opacity: m.sending ? 0.6 : 1 }}>{m.text}</li>
        ))}
      </ul>
      <input name="message" /><button type="submit">Send</button>
    </form>
  );
}`,
      diagram: null
    },
    {
      id: 'react-compiler',
      title: 'What is the React Compiler?',
      explanation: `
        <h3>React Compiler (formerly React Forget)</h3>
        <p>The React Compiler is a build-time optimisation tool that automatically applies memoization to your React code. Instead of manually writing <code>useMemo</code>, <code>useCallback</code>, and <code>React.memo</code>, the compiler analyses your code and adds them where beneficial.</p>
        <h3>What It Does</h3>
        <ul>
          <li>Automatically memoizes expensive calculations.</li>
          <li>Stabilises function references.</li>
          <li>Wraps components in <code>React.memo</code> equivalents.</li>
          <li>Result: the entire codebase runs as if you had perfectly applied all memoization patterns.</li>
        </ul>
        <h3>Requirements</h3>
        <ul>
          <li>Components must follow React's rules (pure render, no direct mutations).</li>
          <li>Works with Babel, Vite, and Next.js via a plugin.</li>
          <li>Opt-out with <code>'use no memo'</code> directive if needed.</li>
        </ul>
        <h3>Impact on Development</h3>
        <p>With the compiler enabled, you largely stop needing to write <code>useMemo</code>/<code>useCallback</code> for performance reasons (you still use them for their semantic meaning, like stable refs for external libraries).</p>
      `,
      code: `// WITHOUT React Compiler — manual memoization required
function ProductList({ products, onSelect }) {
  // Must memoize or child re-renders on every parent render
  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.price - b.price),
    [products]
  );
  const handleSelect = useCallback((id) => {
    onSelect(id);
  }, [onSelect]);

  return sortedProducts.map(p => (
    <ProductCard key={p.id} product={p} onSelect={handleSelect} />
  ));
}
const ProductCard = React.memo(function ProductCard({ product, onSelect }) {
  return <div onClick={() => onSelect(product.id)}>{product.name}</div>;
});

// WITH React Compiler — write natural code, compiler handles it
function ProductList({ products, onSelect }) {
  // Compiler automatically memoizes this sort
  const sortedProducts = [...products].sort((a, b) => a.price - b.price);

  // Compiler automatically stabilises this function
  const handleSelect = (id) => onSelect(id);

  // No React.memo needed — compiler wraps ProductCard automatically
  return sortedProducts.map(p => (
    <ProductCard key={p.id} product={p} onSelect={handleSelect} />
  ));
}
function ProductCard({ product, onSelect }) {
  return <div onClick={() => onSelect(product.id)}>{product.name}</div>;
}

// Enable in vite.config.ts:
// import ReactCompilerPlugin from 'babel-plugin-react-compiler';
// plugins: [react({ babel: { plugins: [ReactCompilerPlugin] } })]`,
      diagram: null
    }
  ]
});
