window.REACT_MODULES = window.REACT_MODULES || [];
window.REACT_MODULES.push({
  id: 'react-patterns',
  title: 'Component Patterns',
  icon: 'bi bi-boxes',
  questions: [
    {
      id: 'hoc',
      title: 'What are Higher-Order Components (HOCs)?',
      explanation: `
        <h3>Higher-Order Component</h3>
        <p>A Higher-Order Component is a function that takes a component and returns a new component with enhanced behaviour. It is a pattern derived from functional composition — not a React API.</p>
        <h3>Use Cases</h3>
        <ul>
          <li>Cross-cutting concerns: logging, auth guards, analytics.</li>
          <li>Injecting common props from context (pre-Hooks pattern).</li>
          <li>Code reuse for components with shared logic that can't easily be extracted to a hook.</li>
        </ul>
        <h3>HOCs vs Hooks (Modern Preference)</h3>
        <p>Hooks have largely replaced HOCs for logic reuse. HOCs still appear in older codebases and library APIs (Redux's <code>connect</code>, React Router's <code>withRouter</code>). Hooks are preferred because they avoid wrapper hell and make the data flow more explicit.</p>
        <h3>Rules When Writing HOCs</h3>
        <ul>
          <li>Forward all unrelated props to the wrapped component (<code>{...props}</code>).</li>
          <li>Always pass <code>displayName</code> for better DevTools debugging.</li>
          <li>Don't mutate the original component.</li>
        </ul>
      `,
      code: `// HOC: adds authentication guard
function withAuth(WrappedComponent) {
  function AuthGuard(props) {
    const { user } = useAuth();
    if (!user) return <Redirect to="/login" />;
    return <WrappedComponent {...props} />; // forward all props
  }
  AuthGuard.displayName = 'withAuth(' + (WrappedComponent.displayName || WrappedComponent.name) + ')';
  return AuthGuard;
}

// HOC: adds loading/error states
function withAsyncData(WrappedComponent, fetchFn) {
  return function AsyncWrapper(props) {
    const [data,  setData]  = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);

    useEffect(() => {
      fetchFn(props)
        .then(setData)
        .catch(setError)
        .finally(() => setLoading(false));
    }, []); // eslint-disable-line

    if (loading) return <Spinner />;
    if (error)   return <ErrorView error={error} />;
    return <WrappedComponent {...props} data={data} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);
const UserListWithData   = withAsyncData(UserList, fetchUsers);

// ⚠️  Modern preference: custom hooks
function Dashboard() {
  const { data, loading, error } = useFetchUsers(); // same logic, no wrapper
  // ...
}`,
      diagram: null
    },
    {
      id: 'render-props',
      title: 'What is the Render Props pattern?',
      explanation: `
        <h3>Render Props</h3>
        <p>A render prop is a function prop that a component calls to determine what to render. The component handles logic; the consumer controls the rendered output.</p>
        <h3>Benefits</h3>
        <ul>
          <li>Separates logic from presentation — the logic component doesn't dictate the UI.</li>
          <li>Very flexible — the consumer can render anything with the provided data.</li>
        </ul>
        <h3>Render Props vs Hooks</h3>
        <p>Like HOCs, render props have largely been superseded by custom hooks. However, the pattern is still used in libraries (React Final Form, React Table's legacy API, Downshift) and for cases where logic-components need to render real DOM (like <code>&lt;Mouse&gt;</code>).</p>
        <h3>children as a Function</h3>
        <p>A popular variant uses <code>children</code> instead of a named prop — also called "function-as-children".</p>
      `,
      code: `// Classic render prop: mouse tracker
function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const handleMouseMove = e => setPos({ x: e.clientX, y: e.clientY });

  return (
    <div onMouseMove={handleMouseMove} style={{ height: '400px' }}>
      {render(pos)}  {/* consumer controls the UI */}
    </div>
  );
}

// Usage
<MouseTracker
  render={({ x, y }) => (
    <p>Mouse is at ({x}, {y})</p>
  )}
/>

// "children as a function" variant
function Toggle({ children }) {
  const [on, setOn] = useState(false);
  return children({ on, toggle: () => setOn(o => !o) });
}

<Toggle>
  {({ on, toggle }) => (
    <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>
  )}
</Toggle>

// Modern equivalent: custom hook (preferred)
function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  return { on, toggle: () => setOn(o => !o) };
}
function MyButton() {
  const { on, toggle } = useToggle();
  return <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>;
}`,
      diagram: null
    },
    {
      id: 'compound-components',
      title: 'What is the Compound Components pattern?',
      explanation: `
        <h3>Compound Components</h3>
        <p>Compound components are a group of components that work together and share implicit state via Context. The parent manages the state; the child sub-components render and interact with it. Think <code>&lt;select&gt;</code> and <code>&lt;option&gt;</code>.</p>
        <h3>Benefits</h3>
        <ul>
          <li>Highly flexible API — consumers compose the children in any order.</li>
          <li>No prop drilling between the parent and its designated children.</li>
          <li>Clear, expressive JSX that reads like HTML (<code>&lt;Tabs.Tab&gt;</code>, <code>&lt;Accordion.Panel&gt;</code>).</li>
        </ul>
        <h3>When to Use</h3>
        <p>Complex UI components that need many configuration points: tabs, accordions, dropdowns, modals with subcomponents.</p>
      `,
      code: `import { createContext, useContext, useState } from 'react';

// Tabs: compound component implementation
const TabsCtx = createContext(null);

function Tabs({ children, defaultTab }) {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabsCtx.Provider value={{ active, setActive }}>
      <div className="tabs">{children}</div>
    </TabsCtx.Provider>
  );
}

Tabs.List = function TabList({ children }) {
  return <div className="tabs-list" role="tablist">{children}</div>;
};

Tabs.Tab = function Tab({ value, children }) {
  const { active, setActive } = useContext(TabsCtx);
  return (
    <button
      role="tab"
      aria-selected={active === value}
      className={active === value ? 'active' : ''}
      onClick={() => setActive(value)}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function Panel({ value, children }) {
  const { active } = useContext(TabsCtx);
  if (active !== value) return null;
  return <div role="tabpanel">{children}</div>;
};

// Usage — consumer controls layout and order
function App() {
  return (
    <Tabs defaultTab="overview">
      <Tabs.List>
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview"><OverviewContent /></Tabs.Panel>
      <Tabs.Panel value="settings"><SettingsContent /></Tabs.Panel>
    </Tabs>
  );
}`,
      diagram: null
    },
    {
      id: 'forward-ref',
      title: 'What is forwardRef and when do you need it?',
      explanation: `
        <h3>The Problem</h3>
        <p>By default, <code>ref</code> is not passed as a prop to function components. If a parent passes <code>ref</code> to a custom component, React ignores it. This prevents parents from accessing the inner DOM node of reusable components.</p>
        <h3>forwardRef</h3>
        <p><code>forwardRef</code> wraps a component to accept a second <code>ref</code> argument alongside <code>props</code> and forward it to an inner DOM node or another component.</p>
        <h3>Common Use Cases</h3>
        <ul>
          <li>Design system input components that need to be focusable from outside.</li>
          <li>Wrapping third-party DOM libraries.</li>
          <li>Combined with <code>useImperativeHandle</code> to expose custom imperative methods.</li>
        </ul>
        <h3>React 19 Note</h3>
        <p>In React 19, <code>ref</code> is passed as a regular prop, making <code>forwardRef</code> unnecessary for new code. But you'll still see it extensively in React 16-18 codebases.</p>
      `,
      code: `import { forwardRef, useRef } from 'react';

// Without forwardRef: ref is lost, parent can't focus the input
function Input(props) {
  return <input {...props} />; // parent's ref not passed through
}

// With forwardRef: ref flows to the inner <input>
const Input = forwardRef(function Input(props, ref) {
  return (
    <input
      ref={ref}            // forward to inner DOM node
      className="input"
      {...props}
    />
  );
});

// Parent component
function LoginForm() {
  const emailRef = useRef(null);

  function handleSubmitError() {
    emailRef.current.focus(); // works because of forwardRef
    emailRef.current.select();
  }

  return (
    <form>
      <Input ref={emailRef} type="email" placeholder="Email" />
      <button type="submit">Login</button>
    </form>
  );
}

// React 19: ref is just a prop (no forwardRef needed)
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}`,
      diagram: null
    }
  ]
});
