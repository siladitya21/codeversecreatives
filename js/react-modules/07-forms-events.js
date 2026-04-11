window.REACT_MODULES = window.REACT_MODULES || [];
window.REACT_MODULES.push({
  id: 'react-forms-events',
  title: 'Forms & Events',
  icon: 'bi bi-input-cursor-text',
  questions: [
    {
      id: 'controlled-components',
      title: 'What are controlled vs uncontrolled components?',
      explanation: `
        <h3>Controlled Components</h3>
        <p>A controlled component's value is driven by React state. The input value is set by a state variable, and every change updates state via an <code>onChange</code> handler. React is the "single source of truth" for the input's value.</p>
        <h3>Uncontrolled Components</h3>
        <p>An uncontrolled component stores its own state in the DOM. You access the value via a <code>ref</code> when you need it (e.g., on form submit). You can set a default with <code>defaultValue</code>.</p>
        <h3>When to Use Which</h3>
        <ul>
          <li><strong>Controlled:</strong> Real-time validation, instant feedback, dynamic field values, conditional fields. Preferred for most forms.</li>
          <li><strong>Uncontrolled:</strong> Simple forms (e.g., a single-field search), file inputs (always uncontrolled), integrating with non-React DOM libraries.</li>
        </ul>
        <h3>File Input</h3>
        <p><code>&lt;input type="file"&gt;</code> is always uncontrolled — you cannot set its value programmatically for security reasons.</p>
      `,
      code: `// Controlled component — React owns the value
function ControlledForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function validate(val) {
    return val.includes('@') ? '' : 'Invalid email';
  }

  return (
    <form>
      <input
        type="email"
        value={email}                              // driven by state
        onChange={e => {
          setEmail(e.target.value);                // every keystroke updates state
          setError(validate(e.target.value));      // instant validation
        }}
      />
      {error && <p className="error">{error}</p>}
    </form>
  );
}

// Uncontrolled component — DOM owns the value
function UncontrolledForm() {
  const emailRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const email = emailRef.current.value;  // read on submit only
    console.log('Submitted:', email);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={emailRef}
        type="email"
        defaultValue="user@example.com"   // initial value only
      />
      <button type="submit">Submit</button>
    </form>
  );
}

// File input — always uncontrolled
function FileUpload() {
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState('');

  return (
    <input
      type="file"
      ref={fileRef}
      onChange={e => setFileName(e.target.files[0]?.name)}
    />
  );
}`,
      diagram: null
    },
    {
      id: 'synthetic-events',
      title: 'How do synthetic events work in React?',
      explanation: `
        <h3>Synthetic Events</h3>
        <p>React wraps native browser events in its own <em>SyntheticEvent</em> object. Synthetic events have the same interface as native events (<code>stopPropagation</code>, <code>preventDefault</code>, etc.) but work consistently across browsers.</p>
        <h3>React 17: Event Delegation Changed</h3>
        <p>In React 16 and earlier, all events were delegated to <code>document</code>. In React 17+, they are delegated to the root DOM container (<code>#root</code>). This matters when mixing React 16 and 17 apps, or when using portals.</p>
        <h3>Key Points</h3>
        <ul>
          <li>Use <code>e.preventDefault()</code> to prevent default browser behaviour (form submission, link navigation).</li>
          <li>Use <code>e.stopPropagation()</code> to prevent bubbling up the React tree.</li>
          <li>In React 17+, synthetic events are no longer pooled — you can safely use them asynchronously.</li>
        </ul>
      `,
      code: `function EventDemo() {
  // All handlers receive a SyntheticEvent 'e'
  function handleClick(e) {
    e.stopPropagation();     // stop bubbling
    console.log(e.type);     // 'click'
    console.log(e.target);   // actual DOM node clicked
  }

  function handleSubmit(e) {
    e.preventDefault();      // don't reload the page
    const data = new FormData(e.currentTarget);
    console.log(data.get('email'));
  }

  // Passing parameters to event handlers
  function handleItemClick(id, e) {
    e.stopPropagation();
    console.log('Clicked item:', id);
  }

  return (
    <div onClick={() => console.log('div clicked')}>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" />
        <button type="submit">Submit</button>
      </form>

      {/* Arrow function to pass extra args */}
      <button onClick={(e) => handleItemClick(42, e)}>Item 42</button>

      {/* Don't call handler immediately — wrong! */}
      {/* onClick={handleClick()}  ← immediately calls on render */}
      {/* onClick={handleClick}    ← correct, passes function reference */}
    </div>
  );
}`,
      diagram: null
    },
    {
      id: 'complex-form',
      title: 'How do you manage complex forms in React?',
      explanation: `
        <h3>Approaches</h3>
        <ul>
          <li><strong>useState per field:</strong> Simple; verbose for many fields.</li>
          <li><strong>Single object state:</strong> One object for all fields with <code>name</code>-based handler.</li>
          <li><strong>useReducer:</strong> Good for forms with complex state transitions.</li>
          <li><strong>React Hook Form:</strong> Library that uses uncontrolled inputs under the hood for maximum performance; minimal re-renders.</li>
        </ul>
        <h3>Validation Strategies</h3>
        <ul>
          <li><strong>On change:</strong> Real-time feedback; can be noisy on first input.</li>
          <li><strong>On blur:</strong> Validate when user leaves a field — common best practice.</li>
          <li><strong>On submit:</strong> Validate everything before submission.</li>
        </ul>
        <h3>React Hook Form</h3>
        <p>The most popular form library. Uses uncontrolled inputs (native DOM) to avoid re-renders on every keystroke. Supports schema validation via Zod or Yup via a resolver.</p>
      `,
      code: `// Approach 1: single object state
function ProfileForm() {
  const [form, setForm] = useState({ name: '', email: '', age: '' });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name)  errs.name  = 'Name is required';
    if (!form.email.includes('@')) errs.email = 'Invalid email';
    return errs;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    console.log('Submit:', form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name"  value={form.name}  onChange={handleChange} />
      {errors.name  && <span>{errors.name}</span>}
      <input name="email" value={form.email} onChange={handleChange} />
      {errors.email && <span>{errors.email}</span>}
      <button type="submit">Save</button>
    </form>
  );
}

// Approach 2: React Hook Form (zero re-renders on typing)
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name:  z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
});

function RHFForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const onSubmit = data => console.log(data);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit">Save</button>
    </form>
  );
}`,
      diagram: null
    }
  ]
});
