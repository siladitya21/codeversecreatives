window.REACT_MODULES = window.REACT_MODULES || [];
window.REACT_MODULES.push({
  id: 'react-error-suspense',
  title: 'Error Boundaries & Suspense',
  icon: 'bi bi-shield-exclamation',
  questions: [
    {
      id: 'error-boundaries',
      title: 'What are Error Boundaries?',
      explanation: `
        <h3>Error Boundaries</h3>
        <p>An Error Boundary is a class component that catches JavaScript errors in its child component tree during rendering, lifecycle methods, and constructors. It displays a fallback UI instead of crashing the whole app.</p>
        <h3>What They Catch</h3>
        <ul>
          <li>Errors thrown during rendering.</li>
          <li>Errors in lifecycle methods.</li>
          <li>Errors in constructors of child components.</li>
        </ul>
        <h3>What They Do NOT Catch</h3>
        <ul>
          <li>Errors in event handlers (use regular try/catch).</li>
          <li>Async errors (<code>setTimeout</code>, <code>fetch</code>) — handle in <code>useEffect</code> catch blocks.</li>
          <li>Server-side rendering errors.</li>
          <li>Errors in the Error Boundary itself.</li>
        </ul>
        <h3>Why Class Components?</h3>
        <p>Error Boundaries require <code>getDerivedStateFromError</code> and <code>componentDidCatch</code> lifecycle methods that have no hook equivalents yet. In practice, you write the class component once and wrap it everywhere, or use the <code>react-error-boundary</code> library.</p>
      `,
      code: `// Error Boundary class component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    // Update state to render fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log error to monitoring service
    errorMonitor.log(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div>
          <h2>Something went wrong.</h2>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Usage: granular error boundaries
function App() {
  return (
    <ErrorBoundary fallback={<AppCrashed />}>
      <Header />
      <ErrorBoundary fallback={<p>Sidebar failed to load.</p>}>
        <Sidebar />       {/* sidebar errors don't crash the app */}
      </ErrorBoundary>
      <ErrorBoundary fallback={<p>Content failed to load.</p>}>
        <MainContent />
      </ErrorBoundary>
    </ErrorBoundary>
  );
}

// react-error-boundary library (recommended over manual class)
import { ErrorBoundary } from 'react-error-boundary';
function FallbackUI({ error, resetErrorBoundary }) {
  return (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  );
}
<ErrorBoundary FallbackComponent={FallbackUI} onReset={() => { /* reset state */ }}>
  <MyComponent />
</ErrorBoundary>`,
      diagram: null
    },
    {
      id: 'suspense',
      title: 'What is React Suspense and how does it work?',
      explanation: `
        <h3>Suspense</h3>
        <p><code>&lt;Suspense fallback={...}&gt;</code> lets you declare a loading state for a part of the component tree. When a child component "suspends" (signals that it's waiting for something asynchronous), Suspense renders the fallback until it's ready.</p>
        <h3>What Can Trigger Suspense?</h3>
        <ul>
          <li><code>React.lazy()</code> — waits for a lazy-loaded component chunk to download.</li>
          <li>Data fetching libraries that integrate with Suspense (TanStack Query, SWR, Relay, React's own <code>use()</code> hook in React 19).</li>
          <li>Any component that throws a Promise (the Suspense protocol).</li>
        </ul>
        <h3>Nested Suspense Boundaries</h3>
        <p>Nest Suspense at different levels of the tree to show different loading states at different granularities. A component only affects the nearest parent Suspense boundary.</p>
      `,
      code: `import { Suspense, lazy } from 'react';

// Code splitting with Suspense
const HeavyChart = lazy(() => import('./HeavyChart'));
const Settings   = lazy(() => import('./pages/Settings'));

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>

      {/* Shows spinner while the chart chunk loads */}
      <Suspense fallback={<ChartSkeleton />}>
        <HeavyChart data={data} />
      </Suspense>
    </div>
  );
}

// Nested Suspense boundaries — different loading granularity
function App() {
  return (
    <Suspense fallback={<AppSkeleton />}>          {/* outermost */}
      <Navbar />
      <Suspense fallback={<SidebarSkeleton />}>    {/* sidebar only */}
        <Sidebar />
      </Suspense>
      <Suspense fallback={<ContentSkeleton />}>    {/* content only */}
        <MainContent />
      </Suspense>
    </Suspense>
  );
}

// With TanStack Query's Suspense mode (React 18+)
import { useSuspenseQuery } from '@tanstack/react-query';
function UserProfile({ userId }) {
  // Throws Promise internally → triggers nearest Suspense boundary
  const { data: user } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
  return <div>{user.name}</div>; // guaranteed to be defined (no loading check)
}

// Usage
<Suspense fallback={<Skeleton />}>
  <UserProfile userId="123" />
</Suspense>`,
      diagram: null
    },
    {
      id: 'error-suspense-together',
      title: 'How do you use Error Boundaries and Suspense together?',
      explanation: `
        <h3>The Pattern</h3>
        <p>Error Boundaries and Suspense complement each other. Suspense handles the loading state; Error Boundaries handle errors. Wrap a Suspense boundary inside (or alongside) an Error Boundary for a complete async UI pattern.</p>
        <h3>SuspenseWithBoundary Component</h3>
        <p>It's common to create a utility component that combines both, reducing boilerplate.</p>
        <h3>Streaming SSR</h3>
        <p>In React 18 with server-side rendering (<code>renderToPipeableStream</code>), Suspense boundaries also control streaming — sections of the HTML stream to the client as they complete on the server, improving Time to First Byte.</p>
      `,
      code: `import { Suspense }      from 'react';
import { ErrorBoundary }  from 'react-error-boundary';

// Utility: combines Error Boundary + Suspense
function AsyncBoundary({ fallback, errorFallback, children }) {
  return (
    <ErrorBoundary FallbackComponent={errorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

// Usage
function UserSection({ userId }) {
  return (
    <AsyncBoundary
      fallback={<UserSkeleton />}
      errorFallback={({ error, resetErrorBoundary }) => (
        <div>
          <p>Failed to load user: {error.message}</p>
          <button onClick={resetErrorBoundary}>Retry</button>
        </div>
      )}
    >
      <UserProfile userId={userId} />
    </AsyncBoundary>
  );
}

// Complete page pattern
function ProductPage({ productId }) {
  return (
    <ErrorBoundary FallbackComponent={PageError}>
      {/* header loads instantly */}
      <PageHeader />

      {/* each section fails/loads independently */}
      <AsyncBoundary fallback={<ProductSkeleton />} errorFallback={SectionError}>
        <ProductDetails productId={productId} />
      </AsyncBoundary>

      <AsyncBoundary fallback={<ReviewsSkeleton />} errorFallback={SectionError}>
        <ReviewsList productId={productId} />
      </AsyncBoundary>
    </ErrorBoundary>
  );
}`,
      diagram: null
    }
  ]
});
