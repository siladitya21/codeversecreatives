window.REACT_MODULES = window.REACT_MODULES || [];
window.REACT_MODULES.push({
  id: 'react-jsx',
  title: 'JSX & Rendering',
  icon: 'bi bi-code-slash',
  questions: [
    {
      id: 'jsx-what-is',
      title: 'What is JSX and how does it work under the hood?',
      explanation: `
        <h3>JSX — JavaScript XML</h3>
        <p>JSX is a <em>syntax extension</em> for JavaScript that lets you write HTML-like markup inside JS. It is <strong>not HTML</strong> — it compiles to regular JavaScript function calls (specifically <code>React.createElement()</code> or the newer JSX transform's <code>_jsx()</code>).</p>
        <h3>JSX Transform (React 17+)</h3>
        <p>Before React 17 you had to <code>import React from 'react'</code> in every file using JSX — it was needed because JSX compiled to <code>React.createElement()</code>. The new automatic JSX transform imports the runtime automatically, so that import is no longer required.</p>
        <h3>Key JSX Rules</h3>
        <ul>
          <li>Return a single root element (or use a Fragment).</li>
          <li>All tags must be closed — <code>&lt;img /&gt;</code>, <code>&lt;input /&gt;</code>.</li>
          <li>Use <code>className</code> not <code>class</code>; <code>htmlFor</code> not <code>for</code>.</li>
          <li>JavaScript expressions go inside <code>{ curly braces }</code>.</li>
          <li>Inline styles are objects: <code>style={{ color: 'red' }}</code>.</li>
        </ul>
      `,
      code: `// JSX looks like HTML but it's JavaScript
function Profile({ user }) {
  const isAdmin = user.role === 'admin';

  return (
    <div className="profile">            {/* className not class */}
      <img src={user.avatar} alt={user.name} />  {/* self-closing */}
      <h2 style={{ color: isAdmin ? 'gold' : 'black' }}>
        {user.name}                              {/* JS expression */}
      </h2>
      {isAdmin && <span>Admin</span>}            {/* conditional */}
    </div>
  );
}

// Compiles to (new JSX transform, React 17+):
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
function Profile({ user }) {
  const isAdmin = user.role === 'admin';
  return _jsxs('div', {
    className: 'profile',
    children: [
      _jsx('img', { src: user.avatar, alt: user.name }),
      _jsx('h2', { style: { color: isAdmin ? 'gold' : 'black' }, children: user.name }),
      isAdmin && _jsx('span', { children: 'Admin' })
    ]
  });
}`,
      diagram: null
    },
    {
      id: 'fragments',
      title: 'What are React Fragments and when to use them?',
      explanation: `
        <h3>The Problem</h3>
        <p>A component can only return one root element. Wrapping siblings in an unnecessary <code>&lt;div&gt;</code> adds a DOM node that can break CSS layouts (especially Flexbox/Grid) and pollutes the DOM.</p>
        <h3>Fragments to the Rescue</h3>
        <p>React Fragments (<code>&lt;React.Fragment&gt;</code> or the shorthand <code>&lt;&gt;&lt;/&gt;</code>) let you group multiple elements without adding a DOM node.</p>
        <h3>Keyed Fragments</h3>
        <p>The shorthand <code>&lt;&gt;</code> cannot accept props. When you need a <code>key</code> on a fragment (e.g., when mapping), use the long form <code>&lt;React.Fragment key={...}&gt;</code>.</p>
      `,
      code: `import { Fragment } from 'react';

// ❌ Adds an unnecessary <div> to the DOM
function Cols() {
  return (
    <div>          {/* breaks table layout! */}
      <td>Name</td>
      <td>Age</td>
    </div>
  );
}

// ✅ Fragment — no extra DOM node
function Cols() {
  return (
    <>
      <td>Name</td>
      <td>Age</td>
    </>
  );
}

// ✅ Keyed fragment (must use long form)
function DefinitionList({ items }) {
  return (
    <dl>
      {items.map(item => (
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}`,
      diagram: null
    },
    {
      id: 'conditional-rendering',
      title: 'What are the patterns for conditional rendering?',
      explanation: `
        <h3>Five Common Patterns</h3>
        <ul>
          <li><strong>Ternary (<code>? :</code>):</strong> Best for rendering one of two options.</li>
          <li><strong>Logical AND (<code>&amp;&amp;</code>):</strong> Best for "show or nothing". Beware: if the left side is <code>0</code>, React renders <code>0</code> in the DOM — always use a boolean.</li>
          <li><strong>Early return:</strong> Return <code>null</code> early if a condition is unmet.</li>
          <li><strong>Variable:</strong> Assign JSX to a variable and use it in the return.</li>
          <li><strong>Separate components:</strong> Extract complex conditional logic into dedicated components.</li>
        </ul>
        <h3>Returning null</h3>
        <p>Returning <code>null</code> from a component renders nothing but does not unmount the component — it just produces no DOM output.</p>
      `,
      code: `function UserCard({ user, isLoading, error }) {
  // Pattern 1: early return
  if (isLoading) return <Spinner />;
  if (error)     return <ErrorMessage message={error} />;

  // Pattern 2: variable
  let badge = null;
  if (user.isPremium) badge = <PremiumBadge />;

  return (
    <div>
      {badge}

      {/* Pattern 3: ternary */}
      {user.isOnline
        ? <span className="online">Online</span>
        : <span className="offline">Offline</span>}

      {/* Pattern 4: logical AND */}
      {user.notifications.length > 0 && (
        <NotificationBell count={user.notifications.length} />
      )}

      {/* ⚠️  Pitfall: 0 renders as "0" in the DOM */}
      {user.count && <Badge />}       // BAD if count can be 0
      {user.count > 0 && <Badge />}   // GOOD — explicit boolean
    </div>
  );
}`,
      diagram: null
    },
    {
      id: 'portals',
      title: 'What are React Portals?',
      explanation: `
        <h3>What Are Portals?</h3>
        <p>Portals let you render a child component into a DOM node that is <strong>outside the parent component's DOM hierarchy</strong>, while still keeping it within the React component tree (preserving context, event bubbling, etc.).</p>
        <h3>When to Use Them</h3>
        <ul>
          <li>Modals and dialogs (must be above all other z-index stacking contexts)</li>
          <li>Tooltips and popovers</li>
          <li>Floating menus</li>
          <li>Any UI that needs to "escape" overflow:hidden or z-index trapping</li>
        </ul>
        <h3>Event Bubbling</h3>
        <p>Events in a portal still bubble through the <em>React tree</em>, not the DOM tree. A click inside the modal bubbles up to parent components even though the DOM node is a sibling of <code>#root</code>.</p>
      `,
      code: `import { createPortal } from 'react-dom';

// Modal rendered into document.body, outside #root
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()} // prevent close on content click
      >
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body  // target DOM node (outside #root)
  );
}

// Usage
function App() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <h2>I am rendered in document.body</h2>
      </Modal>
    </>
  );
}`,
      diagram: null
    },
    {
      id: 'strictmode',
      title: 'What is React StrictMode?',
      explanation: `
        <h3>StrictMode</h3>
        <p><code>&lt;React.StrictMode&gt;</code> is a development-only wrapper that activates extra checks and warnings. It has <strong>no effect in production</strong>.</p>
        <h3>What It Does (React 18+)</h3>
        <ul>
          <li><strong>Double-invokes component functions:</strong> Components are rendered twice in development to surface side effects caused by impure render functions.</li>
          <li><strong>Double-invokes effects:</strong> <code>useEffect</code> runs setup → cleanup → setup on mount to ensure effects clean up properly.</li>
          <li><strong>Warns about deprecated APIs:</strong> e.g., old string refs, legacy context.</li>
          <li><strong>Detects unexpected side effects:</strong> Helps you find state mutations, missing cleanup, etc.</li>
        </ul>
        <h3>Why the Double Render?</h3>
        <p>Concurrent Mode can interrupt and resume renders. If a component has side effects in the render phase, they could fire multiple times. StrictMode simulates this to surface the bug early.</p>
      `,
      code: `import { StrictMode } from 'react';
import { createRoot }   from 'react-dom/client';

// Wrap the app (or part of it) in StrictMode
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// What this detects:
function BadComponent() {
  // ❌ Side effect in render body — runs twice in StrictMode!
  localStorage.setItem('renders', Date.now()); // PROBLEM
  return <div>Hello</div>;
}

// ✅ Side effects belong in useEffect, not render
function GoodComponent() {
  useEffect(() => {
    localStorage.setItem('mounted', Date.now());
    return () => localStorage.removeItem('mounted'); // cleanup required
  }, []);
  return <div>Hello</div>;
}

// StrictMode double-fires useEffect to ensure cleanup works:
// mount → setup() → cleanup() → setup()
// If cleanup is missing, you'll see it clearly in dev`,
      diagram: null
    }
  ]
});
