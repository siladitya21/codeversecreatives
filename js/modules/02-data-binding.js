window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "data-binding",
  "title": "Data Binding",
  "icon": "bi bi-link-45deg",
  "questions": [
    {
      "id": "angular-22-standard-binding-upgrade",
      "title": "Angular 22 standard for binding",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">An <strong>electronic scoreboard</strong> versus a chalkboard someone has to walk out and rewrite by hand. Old-style bindings meant Angular had to sweep the whole "board" checking every square for changes. A <code>signal()</code> is the electronic scoreboard: flip the underlying number and the display panel updates itself &mdash; no walking the stadium required.</p>
          </div>
        </div>
        <p>The binding syntax you already know &mdash; <code>{{ }}</code>, <code>[ ]</code>, <code>( )</code>, <code>[( )]</code> &mdash; hasn't changed. What changed is <em>what's on the other end of the wire</em>. Angular 22-ready components tend to store state in signals, read it in templates by calling the signal as a function, and update it through explicit, traceable methods rather than free-form property assignment.</p>
        <h3>What shifts in your mental model</h3>
        <ul>
          <li>Interpolation reads signals directly: <code>{{ total() }}</code> &mdash; note the parentheses, you're calling the signal, not referencing a plain property.</li>
          <li>Property binding can read computed state: <code>[disabled]="saving()"</code>.</li>
          <li>Event binding updates state explicitly and immutably: <code>(click)="count.update(v => v + 1)"</code>.</li>
          <li>Two-way binding still exists via <code>[(ngModel)]</code>, but serious forms lean on reactive forms or <code>model()</code> for component-to-component two-way binding.</li>
          <li>Prefer <code>[class.x]</code> / <code>[style.y]</code> bindings for simple toggles instead of reaching for <code>NgClass</code>/<code>NgStyle</code> first.</li>
        </ul>
      `,
      "code": `import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: \`
    <h2>{{ label() }}</h2>
    <button type="button" (click)="decrement()" [disabled]="count() === 0">-</button>
    <span [class.empty]="count() === 0">{{ count() }}</span>
    <button type="button" (click)="increment()">+</button>
  \`
})
export class CounterComponent {
  readonly count = signal(0);
  readonly label = computed(() => \`Selected: \${this.count()}\`);

  increment(): void {
    this.count.update(value => value + 1);
  }

  decrement(): void {
    this.count.update(value => Math.max(0, value - 1));
  }
}`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">The Signal Binding Loop</p><div class=\"flex flex-wrap items-center justify-center gap-2 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700\">signal(0)</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700\">template reads count()</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700\">user clicks (click)</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-rose-50 border-2 border-rose-200 rounded-lg px-3 py-2 text-center font-semibold text-rose-700\">count.update()</div></div><div class=\"flex justify-center mt-2\"><span class=\"text-slate-300 text-lg\">&#8635;</span></div><p class=\"text-center text-slate-400 text-xs mt-1\">back to the signal &mdash; only the reading component re-renders</p></div>"
    },
    {
      "id": "what-is-data-binding",
      "title": "What is data binding? Explain its types",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>hotel front desk</strong>. A sign in the lobby (interpolation) just displays whatever the desk writes on it &mdash; guests can't edit the sign. A key card programmed with your room number (property binding) hands guests a real, usable value. A doorbell at the desk (event binding) lets a guest summon staff. And a two-way radio between the desk and housekeeping (two-way binding) lets both sides update each other continuously.</p>
          </div>
        </div>
        <p><strong>Data binding</strong> is the mechanism that keeps the component class (TypeScript) and the template (HTML) talking to each other automatically. Without it, you'd be manually querying DOM elements and pushing updates into them by hand every single time your data changes &mdash; Angular's binding syntax makes that entire chore disappear.</p>
        <h3>The four types</h3>
        <ul>
          <li><strong>Interpolation <code>{{ }}</code></strong> &mdash; embeds a component property as text in the template. One-way: class &rarr; template.</li>
          <li><strong>Property binding <code>[prop]="value"</code></strong> &mdash; sets a DOM property or component input from the class. One-way: class &rarr; template.</li>
          <li><strong>Event binding <code>(event)="handler()"</code></strong> &mdash; listens to a DOM event and calls a class method. One-way: template &rarr; class.</li>
          <li><strong>Two-way binding <code>[(ngModel)]</code></strong> &mdash; combines property + event binding. Both directions at once.</li>
        </ul>
        <h3>A memory trick that actually sticks</h3>
        <ul>
          <li><code>{{ }}</code> &mdash; curly braces, text only, class to template</li>
          <li><code>[ ]</code> &mdash; square brackets look like a box receiving something: data flows INTO the element</li>
          <li><code>( )</code> &mdash; round brackets look like a mouth: events come OUT of the element</li>
          <li><code>[( )]</code> &mdash; both together, the "banana in a box"</li>
        </ul>
      `,
      "code": `// Component class
@Component({ selector: 'app-demo', templateUrl: './demo.component.html' })
export class DemoComponent {
  title    = 'Angular Bindings';
  isActive = true;
  username = '';

  handleClick(event: MouseEvent): void {
    console.log('Clicked at:', event.clientX, event.clientY);
  }
}

// demo.component.html

// 1. Interpolation — class → template (text output)
// <h1>{{ title }}</h1>

// 2. Property binding — class → template (DOM property)
// <button [disabled]="!isActive">Submit</button>

// 3. Event binding — template → class (user action)
// <button (click)="handleClick($event)">Click Me</button>

// 4. Two-way binding — both directions simultaneously
// <input [(ngModel)]="username" />
// <p>Hello, {{ username }}</p>`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">The Four Binding Types</p><div class=\"grid grid-cols-2 gap-3 max-w-lg mx-auto text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-3\"><p class=\"font-bold text-indigo-700 font-mono\">{{ }}</p><p class=\"text-slate-500 mt-1\">Interpolation<br>class &rarr; template</p></div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-3\"><p class=\"font-bold text-emerald-700 font-mono\">[ ]</p><p class=\"text-slate-500 mt-1\">Property binding<br>class &rarr; template</p></div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-3\"><p class=\"font-bold text-amber-700 font-mono\">( )</p><p class=\"text-slate-500 mt-1\">Event binding<br>template &rarr; class</p></div><div class=\"bg-rose-50 border border-rose-200 rounded-lg p-3\"><p class=\"font-bold text-rose-700 font-mono\">[( )]</p><p class=\"text-slate-500 mt-1\">Two-way binding<br>both directions</p></div></div></div>"
    },
    {
      "id": "what-is-interpolation",
      "title": "What is interpolation?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A restaurant's <strong>daily specials board</strong>, written in chalk. The kitchen (component class) decides what today's special and price are; the board (template) just displays whatever the kitchen currently says, as plain text. You never let the board itself cook a new dish &mdash; it only shows what's already been decided.</p>
          </div>
        </div>
        <p><strong>Interpolation</strong> uses double curly braces <code>{{ expression }}</code> to embed a component value or expression as text directly into the HTML. It is one-way: data flows from the class to the template. Whenever the component property changes, Angular re-evaluates the expression and updates the displayed text automatically.</p>
        <h3>What you can put inside {{ }}</h3>
        <ul>
          <li><strong>Properties</strong>: <code>{{ title }}</code>, <code>{{ user.name }}</code>, <code>{{ product.price }}</code></li>
          <li><strong>Arithmetic expressions</strong>: <code>{{ price * quantity }}</code>, <code>{{ count + 1 }}</code></li>
          <li><strong>Method calls</strong>: <code>{{ getFullName() }}</code>, <code>{{ formatDate(createdAt) }}</code></li>
          <li><strong>Ternary operator</strong>: <code>{{ isLoggedIn ? 'Logout' : 'Login' }}</code></li>
          <li><strong>Pipe transforms</strong>: <code>{{ name | uppercase }}</code>, <code>{{ price | currency }}</code></li>
        </ul>
        <h3>What you cannot do</h3>
        <ul>
          <li>Cannot assign: <code>{{ a = 5 }}</code> &mdash; not allowed</li>
          <li>Cannot use <code>new</code>, <code>++</code>, <code>--</code></li>
          <li>Cannot access global objects like <code>window</code> or <code>document</code> directly</li>
          <li>Cannot call <code>console.log()</code></li>
        </ul>
        <h3>Important</h3>
        <p>Interpolation always produces a <strong>string</strong>. For passing booleans or objects to DOM properties, use property binding <code>[ ]</code> instead.</p>
      `,
      "code": `@Component({ selector: 'app-profile', templateUrl: './profile.component.html' })
export class ProfileComponent {
  firstName  = 'Siladitya';
  lastName   = 'Datta';
  age        = 25;
  price      = 49.99;
  quantity   = 3;
  isLoggedIn = true;
  joinDate   = new Date('2024-01-15');

  getFullName(): string {
    return \`\${this.firstName} \${this.lastName}\`;
  }
}

// profile.component.html

// Simple property
// <h1>{{ firstName }}</h1>
// → Siladitya

// Arithmetic expression
// <p>Total: {{ price * quantity | currency }}</p>
// → Total: $149.97

// Method call
// <p>Welcome, {{ getFullName() }}!</p>
// → Welcome, Siladitya Datta!

// Ternary
// <span>{{ isLoggedIn ? 'Logout' : 'Login' }}</span>
// → Logout

// Built-in pipes
// <p>{{ firstName | uppercase }}</p>           → SILADITYA
// <p>{{ joinDate | date:'mediumDate' }}</p>    → Jan 15, 2024
// <p>{{ price | currency:'INR' }}</p>          → ₹49.99

// Age calculation
// <p>Age next year: {{ age + 1 }}</p>          → Age next year: 26`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Interpolation Is One-Way, Text Only</p><div class=\"flex items-center justify-center gap-3 text-xs mb-4\"><div class=\"bg-slate-800 text-white rounded-lg px-3 py-2 font-mono\">firstName = 'Siladitya'</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 font-mono text-indigo-700\">{{ firstName }}</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 font-semibold text-emerald-700\">Siladitya (string)</div></div><div class=\"grid grid-cols-2 md:grid-cols-4 gap-2 text-xs max-w-lg mx-auto\"><div class=\"bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-center\">properties</div><div class=\"bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-center\">arithmetic</div><div class=\"bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-center\">method calls</div><div class=\"bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-center\">pipes</div></div></div>"
    },
    {
      "id": "what-is-property-binding",
      "title": "What is property binding?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Handing someone a <strong>real house key</strong> versus handing them a <strong>photo of a house key</strong>. Interpolation gives the template a picture/description of a value (always a string). Property binding hands over the actual key &mdash; the real boolean, object, or array &mdash; something that can actually turn the lock. A photo of a key never opens a door, and the string <code>"false"</code> never actually disables a button.</p>
          </div>
        </div>
        <p><strong>Property binding</strong> sets a DOM element's property (or a component/directive's input) from a component class property. The syntax uses square brackets: <code>[domProperty]="classProperty"</code>. Data flows one-way &mdash; class &rarr; template &mdash; and Angular updates the DOM property automatically whenever the class value changes.</p>
        <h3>Property binding vs interpolation</h3>
        <p>This is a favorite interview question because the difference is subtle but consequential:</p>
        <ul>
          <li>Interpolation (<code>{{ }}</code>) always produces a <strong>string</strong> and is meant for text content between tags</li>
          <li>Property binding sets the actual <strong>DOM property</strong> &mdash; it passes the real TypeScript value (boolean, number, object, array)</li>
        </ul>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text"><code>&lt;button disabled="{{ isDisabled }}"&gt;</code> passes the <em>string</em> <code>"false"</code> &mdash; the <code>disabled</code> attribute still exists on the element, so the button stays disabled no matter what <code>isDisabled</code> actually is. <code>&lt;button [disabled]="isDisabled"&gt;</code> passes the real boolean <code>false</code>, which correctly removes the attribute. This exact bug shows up constantly with boolean HTML attributes.</p>
          </div>
        </div>
        <h3>Common use cases</h3>
        <ul>
          <li>Enable/disable a button: <code>[disabled]="!form.valid"</code></li>
          <li>Set image source: <code>[src]="product.imageUrl"</code></li>
          <li>Toggle a CSS class: <code>[class.active]="isSelected"</code></li>
          <li>Set inline style: <code>[style.color]="status === 'error' ? 'red' : 'green'"</code></li>
          <li>Pass data to child component: <code>[user]="currentUser"</code></li>
        </ul>
      `,
      "code": `@Component({ selector: 'app-demo', templateUrl: './demo.component.html' })
export class DemoComponent {
  isFormValid  = false;
  imageUrl     = 'https://example.com/photo.jpg';
  isActive     = true;
  isLoading    = false;
  cardTitle    = 'Product Card';
  statusColor  = 'green';
}

// demo.component.html

// Correct: property binding passes the actual boolean
// <button [disabled]="!isFormValid">Submit</button>

// Wrong: interpolation passes the string "false" — button stays disabled!
// <button disabled="{{ isFormValid }}">Submit</button>

// Dynamic image src
// <img [src]="imageUrl" [alt]="cardTitle" />

// Toggle CSS class
// <div [class.active]="isActive">Dashboard</div>

// Multiple classes with ngClass
// <div [ngClass]="{ active: isActive, loading: isLoading }">Content</div>

// Inline style
// <p [style.color]="statusColor">Status</p>
// <p [style.font-size.px]="16">Fixed size</p>

// Pass data to a child component input
// <app-product-card [title]="cardTitle"></app-product-card>`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">String Attribute vs Real Property</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-rose-50 border-2 border-rose-200 rounded-xl p-3\"><p class=\"font-bold text-rose-700 text-center mb-2\">disabled=\"{{ isFormValid }}\"</p><div class=\"flex flex-col items-center gap-1\"><div class=\"bg-white border border-rose-200 rounded px-2 py-1 font-mono\">attribute value: \"false\"</div><div class=\"text-slate-400\">&darr;</div><div class=\"bg-rose-100 text-rose-700 rounded px-2 py-1 font-semibold\">button stays disabled</div></div></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">[disabled]=\"isFormValid\"</p><div class=\"flex flex-col items-center gap-1\"><div class=\"bg-white border border-emerald-200 rounded px-2 py-1 font-mono\">DOM property: false</div><div class=\"text-slate-400\">&darr;</div><div class=\"bg-emerald-100 text-emerald-700 rounded px-2 py-1 font-semibold\">button works correctly</div></div></div></div></div>"
    },
    {
      "id": "what-is-event-binding",
      "title": "What is event binding?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>doorbell</strong>. The button on the porch has exactly one job: ring the bell inside when pressed. It doesn't decide what happens next &mdash; that's up to whoever is inside (the component method). Press it (a click), a signal travels from the porch to the house (template &rarr; class), and the homeowner decides whether to answer, ignore it, or call the police.</p>
          </div>
        </div>
        <p><strong>Event binding</strong> listens to DOM events and calls a method in the component class when they fire. The syntax uses parentheses: <code>(eventName)="handler()"</code>. Data flows one-way &mdash; template &rarr; class.</p>
        <p>This is how the user talks back to your component: a click, a keystroke, a form submission &mdash; all of these are events you catch with event binding and respond to in your class.</p>
        <h3>The $event object</h3>
        <p>Angular provides a special variable <code>$event</code> inside event bindings. It holds the native browser event object &mdash; <code>MouseEvent</code>, <code>KeyboardEvent</code>, <code>InputEvent</code> &mdash; giving you access to coordinates, key codes, the input value, and more.</p>
        <h3>Keyboard shortcut syntax</h3>
        <p>Angular supports key combination shortcuts directly in the binding syntax: <code>(keyup.enter)</code> fires only when the Enter key is released. <code>(keyup.ctrl.s)</code> fires on Ctrl+S. No extra code needed.</p>
        <h3>Common events</h3>
        <ul>
          <li><code>(click)</code>, <code>(dblclick)</code> &mdash; mouse clicks</li>
          <li><code>(input)</code> &mdash; fires on every keystroke in an input</li>
          <li><code>(change)</code> &mdash; fires when a select or checkbox value is committed</li>
          <li><code>(submit)</code> &mdash; form submission</li>
          <li><code>(keyup)</code>, <code>(keydown)</code>, <code>(keyup.enter)</code></li>
          <li><code>(focus)</code>, <code>(blur)</code> &mdash; focus events</li>
        </ul>
      `,
      "code": `@Component({ selector: 'app-events', templateUrl: './events.component.html' })
export class EventsComponent {
  counter    = 0;
  searchTerm = '';
  lastKey    = '';

  increment(): void {
    this.counter++;
  }

  // Full mouse event object via $event
  onButtonClick(event: MouseEvent): void {
    console.log('Clicked at X:', event.clientX, 'Y:', event.clientY);
  }

  // Read the typed value from $event.target
  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }

  onKeyUp(event: KeyboardEvent): void {
    this.lastKey = event.key;
  }

  onFormSubmit(event: Event): void {
    event.preventDefault();  // prevent page reload
    console.log('Submitted with search:', this.searchTerm);
  }
}

// events.component.html

// Simple click
// <button (click)="increment()">Count: {{ counter }}</button>

// $event with mouse coordinates
// <button (click)="onButtonClick($event)">Where am I?</button>

// Input — fires on every keystroke
// <input (input)="onSearch($event)" placeholder="Search..." />
// <p>You typed: {{ searchTerm }}</p>

// Keyboard shortcut — fires ONLY on Enter key
// <input (keyup.enter)="onFormSubmit($event)" />

// Form submit
// <form (submit)="onFormSubmit($event)">
//   <button type="submit">Submit</button>
// </form>`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Event Binding Flow</p><div class=\"flex flex-wrap items-center justify-center gap-2 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700\">User clicks button</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700\">(click)=\"handler($event)\"</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700\">class method runs</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-rose-50 border-2 border-rose-200 rounded-lg px-3 py-2 text-center font-semibold text-rose-700\">state updates</div></div></div>"
    },
    {
      "id": "what-is-two-way-binding",
      "title": "What is two-way data binding?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>thermostat</strong>. The display shows the target temperature (property binding, class &rarr; template). But the moment you physically turn the dial (event binding, template &rarr; class), the target temperature updates right back to match. Two-way binding is that closed loop wired together in one clean piece of syntax, instead of you wiring the display and the dial separately.</p>
          </div>
        </div>
        <p><strong>Two-way data binding</strong> keeps a component property and a template input perfectly in sync &mdash; automatically, in both directions simultaneously. When the user types in the input, the component property updates. When the component property changes in code, the input field updates. No manual event handler needed.</p>
        <p>The syntax is <code>[(ngModel)]</code> &mdash; sometimes called the <strong>"banana in a box"</strong> because the parentheses <code>()</code> (banana) sit inside the square brackets <code>[]</code> (box).</p>
        <h3>What [(ngModel)] actually is</h3>
        <p>It is shorthand that Angular expands into:</p>
        <ul>
          <li><code>[ngModel]="name"</code> &mdash; property binding: sets the input's value from the component</li>
          <li><code>(ngModelChange)="name = $event"</code> &mdash; event binding: updates the component when the input changes</li>
        </ul>
        <p>Both lines together &mdash; that's what <code>[(ngModel)]</code> does in one clean piece of syntax.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text"><code>ngModel</code> does not work out of the box. You must import <code>FormsModule</code> and add it to the component's <code>imports</code> array (standalone) or the enclosing NgModule &mdash; otherwise Angular throws a template parse error like "Can't bind to 'ngModel' since it isn't a known property." This trips up almost every developer the first time they touch a standalone component.</p>
          </div>
        </div>
        <h3>When to use it</h3>
        <p>Template-driven forms with simple inputs. For complex, multi-field forms with validation, prefer <strong>Reactive Forms</strong> (<code>FormGroup</code> / <code>FormControl</code>) &mdash; they give you much more control, and Angular 22's stable <strong>Signal Forms</strong> (<code>@angular/forms/signals</code>) are worth reaching for when you want form state to compose naturally with signals.</p>
      `,
      "code": `// Standalone component setup
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-form',
  imports: [FormsModule],   // ← required for ngModel
  templateUrl: './profile-form.component.html'
})
export class ProfileFormComponent {
  username   = 'Siladitya';  // initial value shown in input
  email      = '';
  country    = 'IN';
  newsletter = false;

  resetForm(): void {
    this.username   = '';     // ← clearing the property also clears the input
    this.email      = '';
    this.newsletter = false;
  }
}

// profile-form.component.html

// Two-way: typing in input updates username; changing username in code updates input
// <input [(ngModel)]="username" placeholder="Username" />
// <p>Preview: {{ username }}</p>

// Equivalent long form:
// <input [ngModel]="username" (ngModelChange)="username = $event" />

// Select dropdown
// <select [(ngModel)]="country">
//   <option value="IN">India</option>
//   <option value="US">United States</option>
// </select>
// <p>Selected: {{ country }}</p>

// Checkbox
// <input type="checkbox" [(ngModel)]="newsletter" />
// <span>{{ newsletter ? 'Subscribed' : 'Not subscribed' }}</span>

// Reset button clears ALL inputs instantly
// <button (click)="resetForm()">Reset</button>`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">[(ngModel)] Unpacked</p><div class=\"flex flex-col items-center gap-3 text-xs\"><div class=\"bg-purple-50 border-2 border-purple-200 rounded-lg px-4 py-2 font-mono font-bold text-purple-700\">[(ngModel)]=\"username\"</div><span class=\"text-slate-300\">expands to</span><div class=\"flex flex-col md:flex-row gap-3\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 text-center\"><p class=\"font-mono font-semibold text-indigo-700\">[ngModel]=\"username\"</p><p class=\"text-slate-500 mt-1\">class &rarr; input</p></div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-center\"><p class=\"font-mono font-semibold text-emerald-700\">(ngModelChange)=\"username = $event\"</p><p class=\"text-slate-500 mt-1\">input &rarr; class</p></div></div></div></div>"
    },
    {
      "id": "one-way-vs-two-way",
      "title": "Difference between one-way and two-way binding",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>one-way mirror versus a video call</strong>. One-way binding is the mirror: the class can broadcast a value out to the template, or the template can send an event back in, but each channel only ever moves in one direction at a time. Two-way binding is the video call: both sides see and react to each other continuously through a single connection.</p>
          </div>
        </div>
        <p>The core difference is the <strong>direction data can flow</strong>.</p>
        <h3>One-way binding</h3>
        <p>Data moves in a single direction per binding. There are two flavors:</p>
        <ul>
          <li><strong>Class &rarr; Template</strong>: interpolation <code>{{ }}</code> and property binding <code>[ ]</code>. Changing the class property updates the UI; changing the UI does <em>not</em> update the class.</li>
          <li><strong>Template &rarr; Class</strong>: event binding <code>( )</code>. User actions call class methods; class properties are not automatically set.</li>
        </ul>
        <p>One-way binding is <strong>explicit</strong>. You always know exactly where data comes from and where it goes, which makes the flow easy to trace and debug &mdash; especially in a large app where "who changed this value?" is the question you ask fifty times a day.</p>
        <h3>Two-way binding</h3>
        <p>Data flows in both directions simultaneously via <code>[(ngModel)]</code>. Typing in the input updates the class property. Changing the class property (e.g. from a button click) updates the input value. Both sync automatically, with zero glue code.</p>
        <h3>When to use which</h3>
        <ul>
          <li>Use <strong>one-way binding</strong> for the vast majority of your app &mdash; displaying data, passing inputs to child components, and handling events separately</li>
          <li>Use <strong>two-way binding</strong> for simple form inputs where you want zero boilerplate (template-driven forms)</li>
          <li>For anything complex &mdash; multi-field forms with validation, async data, dynamic fields &mdash; use <strong>Reactive Forms</strong> or <strong>Signal Forms</strong> instead</li>
        </ul>
      `,
      "code": `// ─── ONE-WAY: three separate bindings ─────────────────────────
@Component({
  selector: 'app-one-way',
  template: \`
    <!-- Class → Template: displays message, does not update on user input -->
    <p>{{ message }}</p>
    <button [disabled]="isLoading">Save</button>

    <!-- Template → Class: user input calls method, but does not auto-update 'message' -->
    <input (input)="onInput($event)" />
  \`
})
export class OneWayComponent {
  message   = 'Hello World';
  isLoading = false;

  onInput(e: Event): void {
    // Must manually update message to show what the user typed
    this.message = (e.target as HTMLInputElement).value;
  }
}

// ─── TWO-WAY: one [(ngModel)] does both ───────────────────────
@Component({
  selector: 'app-two-way',
  imports: [FormsModule],
  template: \`
    <!-- ngModel syncs BOTH ways automatically -->
    <input [(ngModel)]="message" />
    <p>Live preview: {{ message }}</p>

    <!-- If you programmatically change message, the input updates too -->
    <button (click)="message = 'Reset!'">Reset</button>
  \`
})
export class TwoWayComponent {
  message = 'Hello World';
  // No onInput() handler needed — ngModel handles it
}

// ─── Quick comparison ─────────────────────────────────────────
// Feature         One-way              Two-way
// Syntax          {{ }} / [] / ()      [(ngModel)]
// Direction       Single               Both
// FormsModule     Not needed           Required
// Best for        Display & events     Form inputs
// Traceability    Easy to follow       Can be harder in large forms`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">One-Way vs Two-Way</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-slate-50 border-2 border-slate-300 rounded-xl p-3\"><p class=\"font-bold text-slate-700 text-center mb-2\">One-way</p><div class=\"flex flex-col items-center gap-1\"><div class=\"bg-indigo-50 border border-indigo-200 rounded px-2 py-1 w-full text-center\">class &rarr; template ({{ }} / [ ])</div><div class=\"bg-emerald-50 border border-emerald-200 rounded px-2 py-1 w-full text-center\">template &rarr; class ( ( ) )</div><p class=\"text-slate-400 mt-1\">two separate, explicit channels</p></div></div><div class=\"bg-purple-50 border-2 border-dashed border-purple-300 rounded-xl p-3\"><p class=\"font-bold text-purple-700 text-center mb-2\">Two-way [( )]</p><div class=\"flex flex-col items-center gap-1\"><div class=\"bg-white border border-purple-200 rounded px-3 py-2 font-mono text-purple-700\">class &harr; template</div><p class=\"text-slate-400 mt-1\">one channel, both directions, always in sync</p></div></div></div></div>"
    }
  ]
});
