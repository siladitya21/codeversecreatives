window.REACT_MODULES = window.REACT_MODULES || [];
window.REACT_MODULES.push({
  id: 'react-data-fetching',
  title: 'Data Fetching',
  icon: 'bi bi-cloud-download',
  questions: [
    {
      id: 'fetch-useeffect',
      title: 'How do you fetch data in React with useEffect?',
      explanation: `
        <h3>The Basic Pattern</h3>
        <p>Fetch inside <code>useEffect</code> with state for data, loading, and error. This is correct but has limitations — use it for simple cases and reach for a library for production apps.</p>
        <h3>Race Condition</h3>
        <p>If a prop changes quickly (e.g., user types a search term), multiple fetches can be in-flight simultaneously. A slow earlier response can arrive after a faster later one — showing stale data. Use a cancellation flag or <code>AbortController</code>.</p>
        <h3>Limitations of Manual Fetching</h3>
        <ul>
          <li>No caching — fetches on every mount even for the same data.</li>
          <li>No background refresh.</li>
          <li>No deduplication — multiple components mounting simultaneously send duplicate requests.</li>
          <li>No retry logic.</li>
        </ul>
        <p>For anything beyond a quick prototype, use TanStack Query or SWR.</p>
      `,
      code: `function useFetch(url) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;             // race condition guard
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(data => { if (!cancelled) setData(data); })
      .catch(err => {
        if (err.name === 'AbortError') return; // ignore abort
        if (!cancelled) setError(err.message);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => {
      cancelled = true;
      controller.abort();  // cancel in-flight request on cleanup
    };
  }, [url]);

  return { data, loading, error };
}

// Usage
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch('/api/users/' + userId);

  if (loading) return <Spinner />;
  if (error)   return <p>Error: {error}</p>;
  return <div>{user.name}</div>;
}`,
      diagram: null
    },
    {
      id: 'tanstack-query',
      title: 'How does TanStack Query (React Query) work?',
      explanation: `
        <h3>TanStack Query</h3>
        <p>TanStack Query is the standard solution for <em>server state</em> — data that lives on the server and needs to be fetched, cached, synchronized, and updated in the client.</p>
        <h3>Core Concepts</h3>
        <ul>
          <li><strong>Query Key:</strong> Unique identifier for each query — used for caching and invalidation.</li>
          <li><strong>QueryFn:</strong> The async function that fetches data.</li>
          <li><strong>Stale Time:</strong> How long data is considered fresh (no refetch).</li>
          <li><strong>Cache Time:</strong> How long unused data stays in cache.</li>
        </ul>
        <h3>What It Solves Automatically</h3>
        <ul>
          <li>Caching — same query key = same cached data.</li>
          <li>Background refetching on window focus.</li>
          <li>Request deduplication.</li>
          <li>Stale-while-revalidate pattern.</li>
          <li>Retry on error with exponential backoff.</li>
          <li>Optimistic updates and rollback.</li>
          <li>Infinite scrolling / pagination.</li>
        </ul>
      `,
      code: `import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000 }, // data fresh for 5 min
  },
});

// Provider in App root
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

// Fetching with useQuery
function UserList() {
  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ['users'],                        // cache key
    queryFn:  () => fetch('/api/users').then(r => r.json()),
    staleTime: 60_000,                          // don't refetch for 1 min
  });

  if (isLoading) return <Spinner />;
  if (isError)   return <p>Error: {error.message}</p>;
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// Mutations with cache invalidation
function AddUser() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newUser) =>
      fetch('/api/users', { method: 'POST', body: JSON.stringify(newUser) }).then(r => r.json()),
    onSuccess: () => {
      // Invalidate users list → triggers background refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate({ name: 'Alice' })}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? 'Adding...' : 'Add User'}
    </button>
  );
}

// Dependent query (fetch only when userId is known)
const { data: orders } = useQuery({
  queryKey: ['orders', userId],
  queryFn:  () => fetchOrders(userId),
  enabled:  !!userId,  // only runs when userId is truthy
});`,
      diagram: null
    },
    {
      id: 'optimistic-updates',
      title: 'How do you implement optimistic updates?',
      explanation: `
        <h3>Optimistic Updates</h3>
        <p>An optimistic update immediately shows the result of an action in the UI <em>before</em> the server confirms it. If the server returns an error, the UI rolls back to the previous state. This makes apps feel fast and responsive.</p>
        <h3>TanStack Query Approach</h3>
        <p>Use <code>onMutate</code> to update the cache optimistically, <code>onError</code> to roll back, and <code>onSettled</code> to always refetch the real data afterward.</p>
        <h3>React 19 useOptimistic</h3>
        <p>React 19 introduces <code>useOptimistic</code> — a hook specifically designed for this pattern, even simpler to use than the TanStack Query approach for server actions.</p>
      `,
      code: `// Optimistic update with TanStack Query
function TodoItem({ todo }) {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: (id) => fetch('/api/todos/' + id + '/toggle', { method: 'PATCH' }),

    // 1. Optimistically update the cache
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['todos'] }); // cancel in-flight fetches
      const previousTodos = queryClient.getQueryData(['todos']); // snapshot

      queryClient.setQueryData(['todos'], old =>
        old.map(t => t.id === id ? { ...t, done: !t.done } : t)
      );
      return { previousTodos }; // return snapshot for rollback
    },

    // 2. On error, roll back
    onError: (err, id, context) => {
      queryClient.setQueryData(['todos'], context.previousTodos);
    },

    // 3. Always refetch to sync with server truth
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  return (
    <div
      style={{ opacity: toggleMutation.isPending ? 0.6 : 1, cursor: 'pointer' }}
      onClick={() => toggleMutation.mutate(todo.id)}
    >
      <input type="checkbox" checked={todo.done} readOnly />
      {todo.text}
    </div>
  );
}

// React 19: useOptimistic hook
import { useOptimistic } from 'react';
function Likes({ post }) {
  const [optimisticPost, addOptimisticLike] = useOptimistic(
    post,
    (current, increment) => ({ ...current, likes: current.likes + increment })
  );
  async function handleLike() {
    addOptimisticLike(1);          // immediately show +1
    await likePost(post.id);       // real request
    // if error: optimistic state reverts to real post
  }
  return <button onClick={handleLike}>❤️ {optimisticPost.likes}</button>;
}`,
      diagram: null
    }
  ]
});
