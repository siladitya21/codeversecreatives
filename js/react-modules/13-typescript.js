window.REACT_MODULES = window.REACT_MODULES || [];
window.REACT_MODULES.push({
  id: 'react-typescript',
  title: 'TypeScript with React',
  icon: 'bi bi-filetype-tsx',
  questions: [
    {
      id: 'typing-props',
      title: 'How do you type component props in TypeScript?',
      explanation: `
        <h3>Props Typing Approaches</h3>
        <ul>
          <li><strong>Interface:</strong> Preferred for props — extendable, readable in error messages.</li>
          <li><strong>Type alias:</strong> Needed for unions, intersections, and mapped types.</li>
        </ul>
        <h3>React-Specific Prop Types</h3>
        <ul>
          <li><code>React.ReactNode</code> — anything renderable: JSX, string, number, array, null, boolean.</li>
          <li><code>React.ReactElement</code> — a JSX element (not null/string).</li>
          <li><code>React.FC&lt;Props&gt;</code> — function component type (modern preference: just type the function directly).</li>
          <li><code>React.CSSProperties</code> — inline style object.</li>
          <li><code>React.ComponentProps&lt;'button'&gt;</code> — all native button props (spreaded HTML attributes).</li>
        </ul>
        <h3>React.FC vs Plain Function</h3>
        <p>Prefer typing function components directly (<code>function Comp(props: Props)</code>) over <code>React.FC</code> — it provides better inference for return types and works better with generics.</p>
      `,
      code: `// Interface for props (preferred)
interface ButtonProps {
  label:       string;
  onClick:     () => void;
  variant?:    'primary' | 'secondary' | 'danger'; // optional union
  disabled?:   boolean;
  icon?:       React.ReactNode;                     // anything renderable
  style?:      React.CSSProperties;
  children?:   React.ReactNode;
}

// Type the function directly (preferred over React.FC)
function Button({ label, onClick, variant = 'primary', disabled, icon, children }: ButtonProps) {
  return (
    <button className={'btn btn-' + variant} onClick={onClick} disabled={disabled}>
      {icon && <span className="icon">{icon}</span>}
      {label}
      {children}
    </button>
  );
}

// Extending HTML element props — add custom props on top of native ones
interface InputProps extends React.ComponentProps<'input'> {
  label:     string;
  error?:    string;
  helpText?: string;
}

function Input({ label, error, helpText, ...inputProps }: InputProps) {
  return (
    <div>
      <label>{label}</label>
      <input {...inputProps} /> {/* all native <input> props work */}
      {error    && <p className="error">{error}</p>}
      {helpText && <p className="help">{helpText}</p>}
    </div>
  );
}

// Type alias for unions
type Status = 'idle' | 'loading' | 'success' | 'error';
type Result<T> = { status: 'success'; data: T } | { status: 'error'; message: string };`,
      diagram: null
    },
    {
      id: 'typing-hooks',
      title: 'How do you type React hooks in TypeScript?',
      explanation: `
        <h3>useState Typing</h3>
        <p>TypeScript usually infers the type from the initial value. Provide an explicit generic when the initial value doesn't reflect the full type (e.g., initial <code>null</code> but later a real object).</p>
        <h3>useRef Typing</h3>
        <p>Two forms: <code>useRef&lt;T&gt;(null)</code> for DOM refs (creates a read-only ref — React sets it); <code>useRef&lt;T&gt;(initialValue)</code> for mutable values (creates a mutable ref you set yourself).</p>
        <h3>useReducer Typing</h3>
        <p>Use a discriminated union for actions — TypeScript can narrow the action type inside each case.</p>
        <h3>Custom Hook Return Types</h3>
        <p>Add explicit return types to custom hooks for better consumer DX. Use <code>as const</code> on tuple returns to preserve the tuple type instead of getting <code>Array</code>.</p>
      `,
      code: `import { useState, useRef, useReducer, useCallback } from 'react';

// useState — explicit generic when initial value is incomplete
const [user, setUser] = useState<User | null>(null);
// Without generic: TypeScript would infer 'null' and setUser would reject User objects

// useRef — DOM element
const inputRef = useRef<HTMLInputElement>(null);
// inputRef.current is HTMLInputElement | null (TypeScript knows it could be null before mount)
useEffect(() => { inputRef.current?.focus(); }, []);

// useRef — mutable value (NOT a DOM ref)
const countRef = useRef<number>(0); // mutable, no React setting
countRef.current = 42; // TypeScript allows this

// useReducer with discriminated union actions
type Action =
  | { type: 'SET_USER';  payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_LOADING'; payload: boolean };

interface State { user: User | null; loading: boolean; }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_USER':     return { ...state, user: action.payload };  // payload: User
    case 'CLEAR_USER':   return { ...state, user: null };            // no payload
    case 'SET_LOADING':  return { ...state, loading: action.payload }; // payload: boolean
    default: return state;
  }
}

// Custom hook with typed tuple return
function useToggle(initial = false): [boolean, () => void] {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn(v => !v), []);
  return [on, toggle]; // TypeScript knows: [boolean, () => void]
}`,
      diagram: null
    },
    {
      id: 'typing-events',
      title: 'How do you type event handlers in TypeScript?',
      explanation: `
        <h3>React Event Types</h3>
        <p>React has specific event types for each event. They are generics parameterised by the element type, e.g., <code>React.ChangeEvent&lt;HTMLInputElement&gt;</code>.</p>
        <h3>Most Common Event Types</h3>
        <ul>
          <li><code>React.ChangeEvent&lt;HTMLInputElement&gt;</code> — for <code>onChange</code> on inputs.</li>
          <li><code>React.FormEvent&lt;HTMLFormElement&gt;</code> — for <code>onSubmit</code>.</li>
          <li><code>React.MouseEvent&lt;HTMLButtonElement&gt;</code> — for <code>onClick</code> on buttons.</li>
          <li><code>React.KeyboardEvent&lt;HTMLInputElement&gt;</code> — for <code>onKeyDown</code>.</li>
          <li><code>React.FocusEvent&lt;HTMLInputElement&gt;</code> — for <code>onFocus</code> / <code>onBlur</code>.</li>
        </ul>
        <h3>Handler Type Aliases</h3>
        <p>React exports handler type aliases: <code>React.ChangeEventHandler&lt;HTMLInputElement&gt;</code> is equivalent to <code>(e: React.ChangeEvent&lt;HTMLInputElement&gt;) => void</code>.</p>
      `,
      code: `// Typing inline event handlers — TypeScript infers from JSX context
function Form() {
  const [name, setName] = useState('');

  return (
    <form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(name);
      }}
    >
      <input
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setName(e.target.value); // e.target.value: string ✓
        }}
      />
    </form>
  );
}

// Typing extracted handler functions (must specify type explicitly)
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  console.log(e.target.value);
}
function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
  e.currentTarget.disabled = true;
}

// Handler type aliases (shorter)
const onInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
  setName(e.target.value);
};

// Generic input handler that works for any input/select/textarea
type ChangeHandler = React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
function handleFieldChange(field: string): ChangeHandler {
  return (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));
}`,
      diagram: null
    },
    {
      id: 'generic-components',
      title: 'How do you write generic React components in TypeScript?',
      explanation: `
        <h3>Generic Components</h3>
        <p>Generic components work with any data type while preserving type safety. Common examples: <code>&lt;List&lt;T&gt;&gt;</code>, <code>&lt;Table&lt;T&gt;&gt;</code>, <code>&lt;Select&lt;T&gt;&gt;</code>.</p>
        <h3>Syntax for TSX</h3>
        <p>In <code>.tsx</code> files, TypeScript's generic syntax <code>&lt;T&gt;</code> can conflict with JSX. Add a constraint (<code>&lt;T extends object&gt;</code>) or a trailing comma (<code>&lt;T,&gt;</code>) to disambiguate.</p>
        <h3>Generic Custom Hooks</h3>
        <p>Custom hooks can also be generic — the return type adapts to the type passed in.</p>
      `,
      code: `// Generic List component
interface ListProps<T> {
  items:      T[];
  keyField:   keyof T;
  renderItem: (item: T) => React.ReactNode;
  emptyText?: string;
}

// <T extends object> avoids TSX/generics ambiguity
function List<T extends object>({ items, keyField, renderItem, emptyText }: ListProps<T>) {
  if (items.length === 0) return <p>{emptyText ?? 'No items.'}</p>;
  return (
    <ul>
      {items.map(item => (
        <li key={String(item[keyField])}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// TypeScript infers T = User from the items prop
<List
  items={users}                        // T inferred as User
  keyField="id"                        // must be keyof User ✓
  renderItem={(user) => user.name}     // user: User ✓
/>

// Generic Select
interface SelectProps<T> {
  options:      T[];
  value:        T | null;
  onChange:     (value: T) => void;
  getLabel:     (option: T) => string;
  getValue:     (option: T) => string;
}
function Select<T>({ options, value, onChange, getLabel, getValue }: SelectProps<T>) {
  return (
    <select
      value={value ? getValue(value) : ''}
      onChange={e => {
        const selected = options.find(o => getValue(o) === e.target.value);
        if (selected) onChange(selected);
      }}
    >
      {options.map(opt => (
        <option key={getValue(opt)} value={getValue(opt)}>{getLabel(opt)}</option>
      ))}
    </select>
  );
}`,
      diagram: null
    }
  ]
});
