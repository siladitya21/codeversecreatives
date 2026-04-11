window.REACT_MODULES = window.REACT_MODULES || [];
window.REACT_MODULES.push({
  id: 'react-router',
  title: 'React Router v6',
  icon: 'bi bi-signpost-split',
  questions: [
    {
      id: 'router-overview',
      title: 'How does React Router v6 work?',
      explanation: `
        <h3>React Router v6 Overview</h3>
        <p>React Router is the standard client-side routing library for React. v6 introduced a major redesign: nested routes work declaratively via <code>&lt;Outlet&gt;</code>, relative paths are simpler, and the <code>element</code> prop replaces <code>component</code>.</p>
        <h3>Core Components</h3>
        <ul>
          <li><code>&lt;BrowserRouter&gt;</code> — wraps the app; uses the HTML5 History API.</li>
          <li><code>&lt;Routes&gt;</code> — renders the first child <code>&lt;Route&gt;</code> that matches the current URL.</li>
          <li><code>&lt;Route path="..." element={...}&gt;</code> — maps a path to a component.</li>
          <li><code>&lt;Link to="..."&gt;</code> — renders an anchor that navigates without reload.</li>
          <li><code>&lt;NavLink&gt;</code> — like Link but adds an active class automatically.</li>
          <li><code>&lt;Outlet&gt;</code> — renders matched child routes inside a parent layout.</li>
          <li><code>&lt;Navigate to="..."&gt;</code> — programmatic redirect.</li>
        </ul>
      `,
      code: `import {
  BrowserRouter, Routes, Route, Link, NavLink, Outlet, Navigate
} from 'react-router-dom';

// App entry point
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout route — Outlet renders matched child */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />

          {/* Nested under /dashboard */}
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="users" element={<UserList />} />
            <Route path="users/:id" element={<UserDetail />} />
          </Route>

          {/* Protected routes */}
          <Route path="settings" element={<RequireAuth><Settings /></RequireAuth>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// Root Layout: renders nav + matched child via Outlet
function RootLayout() {
  return (
    <>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
      </nav>
      <main><Outlet /></main>  {/* matched child renders here */}
    </>
  );
}`,
      diagram: null
    },
    {
      id: 'router-hooks',
      title: 'What are the key React Router hooks?',
      explanation: `
        <h3>Essential Routing Hooks</h3>
        <ul>
          <li><code>useNavigate()</code> — returns a function to navigate imperatively. Replaces v5's <code>useHistory</code>.</li>
          <li><code>useParams()</code> — returns URL parameters from the current route (<code>:id</code>, <code>:slug</code>).</li>
          <li><code>useLocation()</code> — returns the current location object (pathname, search, hash, state).</li>
          <li><code>useSearchParams()</code> — reads and writes URL query string parameters.</li>
          <li><code>useMatch(pattern)</code> — checks if the current URL matches a pattern.</li>
        </ul>
        <h3>Navigation Options</h3>
        <p><code>navigate(-1)</code> goes back; <code>navigate(1)</code> goes forward (like browser back/forward). <code>navigate('/path', { replace: true })</code> replaces the history entry instead of pushing.</p>
      `,
      code: `import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';

// useNavigate: programmatic navigation
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // Redirect to where the user came from, or home
  const from = location.state?.from?.pathname || '/';

  async function handleLogin(credentials) {
    await auth.login(credentials);
    navigate(from, { replace: true }); // replace: don't push login to history
  }
  return <LoginForm onSubmit={handleLogin} />;
}

// useParams: route parameters
// Route: <Route path="users/:userId/posts/:postId" element={<Post />} />
function Post() {
  const { userId, postId } = useParams();
  // userId and postId are always strings
  return <div>User {userId}, Post {postId}</div>;
}

// useSearchParams: query string (?tab=settings&page=2)
function DataTable() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab  = searchParams.get('tab')  || 'all';
  const page = Number(searchParams.get('page') || 1);

  function goToPage(n) {
    setSearchParams(prev => {
      prev.set('page', String(n));
      return prev;
    });
  }
  return (
    <>
      <TabBar active={tab} onChange={t => setSearchParams({ tab: t, page: '1' })} />
      <Table page={page} />
      <Pagination current={page} onPageChange={goToPage} />
    </>
  );
}`,
      diagram: null
    },
    {
      id: 'protected-routes',
      title: 'How do you implement protected routes?',
      explanation: `
        <h3>Protected Routes Pattern</h3>
        <p>A protected route renders its children only when the user is authenticated. If not, it redirects to the login page — passing the attempted URL in state so login can redirect back.</p>
        <h3>Two Implementation Options</h3>
        <ul>
          <li><strong>Wrapper component:</strong> <code>&lt;RequireAuth&gt;</code> wraps individual routes.</li>
          <li><strong>Layout route:</strong> A parent route that acts as a guard for all nested children — cleaner for many protected routes.</li>
        </ul>
        <h3>Role-Based Access</h3>
        <p>Extend the pattern to check roles: if <code>user.role !== 'admin'</code>, redirect to <code>/unauthorized</code> instead of <code>/login</code>.</p>
      `,
      code: `import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Option 1: Wrapper component
function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login, but remember where they were going
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

// Usage:
<Route path="dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />

// Option 2: Layout route guard (cleaner for many protected routes)
function ProtectedLayout() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />; // render child routes if authenticated
}

// In App:
<Route element={<ProtectedLayout />}>
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="profile"   element={<Profile />} />
  <Route path="settings"  element={<Settings />} />
</Route>

// Role-based guard
function RequireRole({ role, children }) {
  const { user } = useAuth();
  if (!user)            return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/unauthorized" replace />;
  return children;
}`,
      diagram: null
    },
    {
      id: 'router-loaders',
      title: 'What are loaders and actions in React Router v6.4+?',
      explanation: `
        <h3>Data Router (v6.4+)</h3>
        <p>React Router v6.4 introduced a data layer inspired by Remix. Routes can define <em>loaders</em> (for fetching data) and <em>actions</em> (for mutations). This co-locates data fetching with routes.</p>
        <h3>Loaders</h3>
        <p>A <code>loader</code> is an async function that runs <em>before</em> a route renders. It fetches the data the route needs. The component reads it with <code>useLoaderData()</code>. React Router handles loading and error states.</p>
        <h3>Actions</h3>
        <p>An <code>action</code> is an async function that handles form submissions (<code>method="post/put/delete"</code>). On success, React Router automatically revalidates all loaders.</p>
        <h3>Benefits</h3>
        <ul>
          <li>Eliminates the need for <code>useEffect</code> data fetching in many components.</li>
          <li>Parallel data loading — all route loaders in a nested route tree run simultaneously.</li>
          <li>Built-in pending/error UI via <code>&lt;Await&gt;</code> and <code>&lt;Suspense&gt;</code>.</li>
        </ul>
      `,
      code: `import { createBrowserRouter, RouterProvider, useLoaderData, Form } from 'react-router-dom';

// Define loader — runs before component renders
async function userLoader({ params }) {
  const res = await fetch('/api/users/' + params.id);
  if (!res.ok) throw new Response('Not Found', { status: 404 });
  return res.json(); // returned value is available via useLoaderData()
}

// Define action — handles form POST
async function updateUserAction({ request, params }) {
  const formData = await request.formData();
  await fetch('/api/users/' + params.id, {
    method: 'PUT',
    body: JSON.stringify(Object.fromEntries(formData)),
    headers: { 'Content-Type': 'application/json' },
  });
  return { success: true };
}

// Component
function UserDetail() {
  const user = useLoaderData(); // typed data from loader
  return (
    <Form method="put"> {/* React Router's <Form> triggers the action */}
      <input name="name"  defaultValue={user.name} />
      <input name="email" defaultValue={user.email} />
      <button type="submit">Save</button>
    </Form>
  );
}

// Router definition
const router = createBrowserRouter([
  {
    path: '/users/:id',
    element: <UserDetail />,
    loader: userLoader,
    action: updateUserAction,
    errorElement: <ErrorPage />,
  },
]);

function App() { return <RouterProvider router={router} />; }`,
      diagram: null
    }
  ]
});
