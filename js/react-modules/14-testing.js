window.REACT_MODULES = window.REACT_MODULES || [];
window.REACT_MODULES.push({
  id: 'react-testing',
  title: 'Testing',
  icon: 'bi bi-check2-circle',
  questions: [
    {
      id: 'rtl-philosophy',
      title: 'What is the React Testing Library philosophy?',
      explanation: `
        <h3>The Guiding Principle</h3>
        <p>"The more your tests resemble the way your software is used, the more confidence they give you." — Kent C. Dodds</p>
        <p>React Testing Library (RTL) encourages testing from a <strong>user's perspective</strong> — testing behaviour, not implementation details. You query by accessible roles, labels, and text rather than CSS classes or component internals.</p>
        <h3>What RTL Provides</h3>
        <ul>
          <li><strong>render()</strong> — renders a component into a real DOM (via jsdom).</li>
          <li><strong>screen</strong> — queries the rendered DOM.</li>
          <li><strong>userEvent</strong> — simulates realistic user interactions.</li>
          <li><strong>waitFor / findBy</strong> — async utilities for async operations.</li>
        </ul>
        <h3>Query Priority (Accessibility-First)</h3>
        <ol>
          <li><code>getByRole</code> — semantic HTML roles (button, textbox, heading).</li>
          <li><code>getByLabelText</code> — form labels.</li>
          <li><code>getByPlaceholderText</code></li>
          <li><code>getByText</code> — visible text content.</li>
          <li><code>getByTestId</code> — last resort (<code>data-testid</code>).</li>
        </ol>
      `,
      code: `import { render, screen }  from '@testing-library/react';
import userEvent             from '@testing-library/user-event';
import { Counter }           from './Counter';

describe('Counter', () => {
  it('starts at 0 and increments on click', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    // Query by role + accessible name (not by class/id)
    const button = screen.getByRole('button', { name: /increment/i });
    const count  = screen.getByText('Count: 0');

    expect(count).toBeInTheDocument();

    // Simulate real user interaction
    await user.click(button);
    expect(screen.getByText('Count: 1')).toBeInTheDocument();

    await user.click(button);
    expect(screen.getByText('Count: 2')).toBeInTheDocument();
  });
});

// ❌ Testing implementation details (fragile)
expect(wrapper.state().count).toBe(1);  // breaks on refactor
expect(component.find('.counter-value').text()).toBe('1');  // CSS dependency

// ✅ Testing user-visible behaviour (resilient)
expect(screen.getByText('Count: 1')).toBeInTheDocument();  // survives refactors`,
      diagram: null
    },
    {
      id: 'async-testing',
      title: 'How do you test async operations and API calls?',
      explanation: `
        <h3>waitFor and findBy</h3>
        <ul>
          <li><code>findBy*</code> queries are async — they poll until the element appears or timeout. Use for data that loads asynchronously.</li>
          <li><code>waitFor(fn)</code> retries an assertion until it passes or times out.</li>
        </ul>
        <h3>Mocking API Calls</h3>
        <p>There are three approaches:</p>
        <ul>
          <li><strong>Mock Service Worker (MSW):</strong> Intercepts real network requests at the service worker level. Most realistic — tests the actual fetch call, not a mocked function.</li>
          <li><strong>jest.mock / vi.mock:</strong> Mock module imports (e.g., mock the API module). Simple but tests less of the real code path.</li>
          <li><strong>fetch mock:</strong> Override <code>global.fetch</code> directly.</li>
        </ul>
        <h3>Wrapping in act()</h3>
        <p>RTL wraps interactions in <code>act()</code> automatically when using <code>userEvent</code>. Only wrap manually when triggering state updates outside RTL utilities (e.g., directly calling a callback).</p>
      `,
      code: `// MSW (Mock Service Worker) — most realistic approach
import { http, HttpResponse } from 'msw';
import { setupServer }        from 'msw/node';
import { render, screen }     from '@testing-library/react';
import { UserProfile }        from './UserProfile';

const server = setupServer(
  http.get('/api/users/1', () => {
    return HttpResponse.json({ id: 1, name: 'Alice', email: 'alice@example.com' });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers()); // reset after each test
afterAll(() => server.close());

test('displays user name after loading', async () => {
  render(<UserProfile userId={1} />);

  // Initially shows loading state
  expect(screen.getByRole('status')).toBeInTheDocument(); // spinner

  // Wait for user data to appear
  const name = await screen.findByText('Alice');  // async query
  expect(name).toBeInTheDocument();
  expect(screen.queryByRole('status')).not.toBeInTheDocument(); // spinner gone
});

test('shows error when API fails', async () => {
  // Override handler for this test
  server.use(http.get('/api/users/1', () => new HttpResponse(null, { status: 500 })));

  render(<UserProfile userId={1} />);
  expect(await screen.findByRole('alert')).toHaveTextContent(/error/i);
});

// waitFor for complex async assertions
test('form submits and shows success', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);

  await user.type(screen.getByLabelText(/email/i), 'test@test.com');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });
});`,
      diagram: null
    },
    {
      id: 'testing-hooks',
      title: 'How do you test custom hooks?',
      explanation: `
        <h3>renderHook</h3>
        <p>RTL's <code>renderHook</code> utility renders a component that simply calls your hook, letting you test hooks in isolation without building a wrapper component.</p>
        <h3>act() for State Updates</h3>
        <p>When calling functions returned by hooks (that update state), wrap them in <code>act()</code> to flush React state updates before making assertions.</p>
        <h3>Testing Hooks with Dependencies</h3>
        <p>For hooks that call APIs or use Context, wrap with the appropriate providers and mock the API, just like you would for a component.</p>
      `,
      code: `import { renderHook, act } from '@testing-library/react';
import { useCounter }        from './useCounter';
import { useAuth }           from './useAuth';
import { AuthProvider }      from './AuthProvider';

// useCounter: { count, increment, decrement, reset }
test('useCounter increments and resets', () => {
  const { result } = renderHook(() => useCounter(0));

  expect(result.current.count).toBe(0);

  act(() => { result.current.increment(); });
  expect(result.current.count).toBe(1);

  act(() => { result.current.increment(); });
  act(() => { result.current.increment(); });
  expect(result.current.count).toBe(3);

  act(() => { result.current.reset(); });
  expect(result.current.count).toBe(0);
});

// Testing a hook that requires context
test('useAuth returns current user', () => {
  const wrapper = ({ children }) => (
    <AuthProvider initialUser={{ id: '1', name: 'Alice' }}>
      {children}
    </AuthProvider>
  );

  const { result } = renderHook(() => useAuth(), { wrapper });
  expect(result.current.user.name).toBe('Alice');
});

// Testing async hooks
test('useFetch loads data', async () => {
  server.use(http.get('/api/data', () => HttpResponse.json({ value: 42 })));

  const { result } = renderHook(() => useFetch('/api/data'));

  expect(result.current.loading).toBe(true);

  await waitFor(() => {
    expect(result.current.loading).toBe(false);
  });
  expect(result.current.data.value).toBe(42);
});`,
      diagram: null
    }
  ]
});
