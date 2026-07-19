window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "component-communication",
  "title": "Component Communication",
  "icon": "bi bi-chat-dots",
  "questions": [
    {
      "id": "angular-22-standard-communication-upgrade",
      "title": "Angular 22 standard for component communication",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Swapping a <strong>paper inbox tray</strong> for a live shared spreadsheet. Decorator-based <code>@Input()</code>/<code>@Output()</code> work fine but sit slightly outside the reactive flow &mdash; you often need <code>ngOnChanges</code> to notice a change. Function-based <code>input()</code>/<code>output()</code>/<code>model()</code> are cells in a live spreadsheet: read one, and anything downstream that reads it (a <code>computed()</code>, an <code>effect()</code>) reacts automatically, no polling or extra lifecycle hook required.</p>
          </div>
        </div>
        <p>For new Angular code, prefer the function-based component API: <code>input()</code> for parent-to-child data, <code>output()</code> for child-to-parent events, <code>model()</code> for deliberate two-way component bindings, and signal queries for child references. Decorator APIs such as <code>@Input()</code>, <code>@Output()</code>, <code>@ViewChild()</code>, and <code>@ContentChild()</code> still matter for existing projects, but the modern standard is signal-friendly end to end.</p>
        <h3>Upgrade map</h3>
        <ul>
          <li><code>@Input({ required: true }) item!: Item</code> &rarr; <code>item = input.required&lt;Item&gt;()</code>.</li>
          <li><code>@Output() saved = new EventEmitter&lt;Item&gt;()</code> &rarr; <code>saved = output&lt;Item&gt;()</code>.</li>
          <li>Manual two-way input/output pairs &rarr; <code>model()</code> when the child owns an editable value.</li>
          <li><code>@ViewChild()</code> &rarr; <code>viewChild()</code> where signal queries fit.</li>
          <li>Shared service streams can be RxJS for async workflows or signals for synchronous UI state.</li>
        </ul>
      `,
      "code": `import { Component, input, output } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'app-product-card',
  template: \`
    <article>
      <h3>{{ product().name }}</h3>
      <p>{{ product().price | currency }}</p>
      <button type="button" (click)="cartAdd.emit(product())">Add</button>
      <button type="button" (click)="removed.emit(product().id)">Remove</button>
    </article>
  \`
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly cartAdd = output<Product>();
  readonly removed = output<number>();
}`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Decorator API &rarr; Function API</p><div class=\"grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto text-xs\"><div class=\"bg-slate-50 border border-slate-200 rounded-lg p-3 text-center\"><p class=\"font-mono font-bold text-slate-600\">@Input()</p><p class=\"text-slate-300 my-1\">&darr;</p><p class=\"font-mono font-bold text-indigo-700\">input()</p></div><div class=\"bg-slate-50 border border-slate-200 rounded-lg p-3 text-center\"><p class=\"font-mono font-bold text-slate-600\">@Output()</p><p class=\"text-slate-300 my-1\">&darr;</p><p class=\"font-mono font-bold text-emerald-700\">output()</p></div><div class=\"bg-slate-50 border border-slate-200 rounded-lg p-3 text-center\"><p class=\"font-mono font-bold text-slate-600\">@ViewChild()</p><p class=\"text-slate-300 my-1\">&darr;</p><p class=\"font-mono font-bold text-amber-700\">viewChild()</p></div></div></div>"
    },
    {
      "id": "parent-to-child-data",
      "title": "How to pass data from parent to child component?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>parent packing a school lunchbox</strong> for their kid every morning. The parent decides what goes in (the data), the kid (child component) just receives whatever is packed and displays it. If the parent swaps yesterday's sandwich for today's, the lunchbox automatically reflects the new contents &mdash; the kid never reaches back into the kitchen to grab their own food.</p>
          </div>
        </div>
        <p>The standard Angular mechanism for passing data from a <strong>parent to a child</strong> is <strong>property binding</strong> on the parent's template combined with an input declared by the child. In modern Angular, prefer <code>input()</code> and <code>input.required()</code>; <code>@Input()</code> remains valid for legacy and decorator-style code. The parent owns the data; the child declares which properties it accepts; Angular keeps those properties in sync whenever the parent's value changes.</p>
        <h3>How it works</h3>
        <p>The child declares an input &mdash; either the modern <code>input()</code> function or the legacy <code>@Input()</code> decorator. This registers the property as something the parent is allowed to bind to. The parent then binds using square-bracket syntax: <code>[propertyName]="expression"</code>. Every time Angular re-evaluates that expression and finds a new value, it updates the child's input, and (for decorator-based inputs) fires <code>ngOnChanges</code> before the next render.</p>
        <h3>Input aliasing</h3>
        <p>You can alias an input to give it a different public name than its internal property name: <code>@Input('label') buttonLabel = ''</code> or <code>buttonLabel = input('', { alias: 'label' })</code>. The template uses <code>[label]="text"</code> while the class uses <code>this.buttonLabel</code> internally. This is useful when the public API name conflicts with a TypeScript keyword or needs to follow a naming convention different from the class internals.</p>
        <h3>Required inputs</h3>
        <p><code>input.required&lt;T&gt;()</code> (or the older <code>@Input({ required: true })</code>) makes the compiler enforce that every usage of the component supplies the input. If a parent uses the child without providing a required input, Angular throws a compile-time error &mdash; far better than discovering a missing input at runtime with an undefined value.</p>
      `,
      "code": `// ---- child: product-card.component.ts ----
import { Component, input } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

@Component({
  selector: 'app-product-card',
  imports: [NgClass, CurrencyPipe],
  template: \`
    <div class="card" [ngClass]="{ 'card-dimmed': !product().inStock }">
      <h3>{{ product().name }}</h3>
      <p>{{ product().price | currency }}</p>
      @if (!product().inStock) {
        <span class="badge-red">Out of Stock</span>
      }
    </div>
  \`
})
export class ProductCardComponent {
  // required — compile error if parent forgets to bind this
  readonly product = input.required<Product>();
}

// ---- parent: product-list.component.ts ----
@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent],
  template: \`
    @for (p of products; track p.id) {
      <app-product-card [product]="p" />
    }
  \`
})
export class ProductListComponent {
  products: Product[] = [
    { id: 1, name: 'Laptop', price: 999, inStock: true },
    { id: 2, name: 'Webcam', price: 89, inStock: false },
    { id: 3, name: 'Mouse', price: 29, inStock: true }
  ];
}`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Parent &rarr; Child, One Direction</p><div class=\"flex items-center justify-center gap-3 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-4 py-2 text-center font-semibold text-indigo-700\">ProductListComponent<br><span class=\"font-normal text-slate-500\">owns products[]</span></div><span class=\"text-slate-300 text-lg\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-4 py-2 font-mono text-emerald-700\">[product]=\"p\"</div><span class=\"text-slate-300 text-lg\">&rarr;</span><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-4 py-2 text-center font-semibold text-amber-700\">ProductCardComponent<br><span class=\"font-normal text-slate-500\">input.required()</span></div></div></div>"
    },
    {
      "id": "child-to-parent-data",
      "title": "How to pass data from child to parent component?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>waiter taking an order</strong> back to the kitchen. The waiter (child component) doesn't cook the food themselves or barge into the kitchen &mdash; they just announce "table 5 wants the salmon" (<code>emit()</code>) and let the kitchen (parent) decide what to actually do with that information. The child stays a reusable, dumb messenger; all real decisions live with the parent.</p>
          </div>
        </div>
        <p>Data flows <strong>up</strong> from child to parent through <strong>custom events</strong>. In modern Angular, the child declares an <code>output()</code> emitter; older code commonly uses an <code>@Output()</code> property typed as <code>EventEmitter</code>. Either way, the child emits a value when something interesting happens, and the parent listens to that event in its template using event binding syntax.</p>
        <h3>Why events instead of direct access?</h3>
        <p>Angular's component model is deliberately one-directional for data flow. The child does not hold a reference to the parent and should not modify the parent's state directly &mdash; that would create hidden dependencies and make the child impossible to reuse in other contexts. Instead, the child announces that something happened (a button was clicked, a form was submitted, an item was selected) and lets the parent decide what to do with that information. This keeps the child a dumb, reusable piece of UI.</p>
        <h3>The $event variable</h3>
        <p>In the parent's template, <code>$event</code> is a special Angular template variable that holds the value passed to <code>emit()</code>. If the child calls <code>this.itemSelected.emit(product)</code>, then in the parent's handler binding <code>(itemSelected)="onSelect($event)"</code>, <code>$event</code> is the <code>product</code> object. The type of <code>$event</code> matches the generic type parameter of the output.</p>
      `,
      "code": `// ---- child: product-card.component.ts ----
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-product-card',
  template: \`
    <div class="card">
      <h3>{{ product().name }}</h3>
      <button type="button" (click)="addToCart()">Add to Cart</button>
      <button type="button" (click)="remove()">Remove</button>
    </div>
  \`
})
export class ProductCardComponent {
  readonly product = input.required<Product>();

  // Emits the full product when user adds to cart
  readonly cartAdd = output<Product>();

  // Emits only the ID when user removes an item
  readonly productRemove = output<number>();

  addToCart(): void {
    this.cartAdd.emit(this.product());
  }

  remove(): void {
    this.productRemove.emit(this.product().id);
  }
}

// ---- parent: product-list.component.ts ----
@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent],
  template: \`
    @for (p of products; track p.id) {
      <app-product-card
        [product]="p"
        (cartAdd)="handleCartAdd($event)"
        (productRemove)="handleRemove($event)"
      />
    }
    <p>Cart has {{ cartCount }} item(s).</p>
  \`
})
export class ProductListComponent {
  products: Product[] = [ /* ... */ ];
  cartCount = 0;

  handleCartAdd(product: Product): void {
    this.cartCount++;
    console.log('Added to cart:', product.name);
  }

  handleRemove(id: number): void {
    this.products = this.products.filter(p => p.id !== id);
  }
}`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Child &rarr; Parent via emit()</p><div class=\"flex items-center justify-center gap-3 text-xs\"><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-4 py-2 text-center font-semibold text-amber-700\">ProductCardComponent<br><span class=\"font-normal text-slate-500\">cartAdd.emit(product)</span></div><span class=\"text-slate-300 text-lg\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-4 py-2 font-mono text-emerald-700\">(cartAdd)=\"handle($event)\"</div><span class=\"text-slate-300 text-lg\">&rarr;</span><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-4 py-2 text-center font-semibold text-indigo-700\">ProductListComponent<br><span class=\"font-normal text-slate-500\">decides what happens next</span></div></div></div>"
    },
    {
      "id": "what-is-input-decorator",
      "title": "What is @Input decorator?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>mail slot cut into a front door</strong>. Without the slot, mail piled outside just sits there &mdash; nobody inside knows it exists. Cutting the slot (declaring <code>input()</code> / <code>@Input()</code>) is what lets outside mail (the parent's data) actually reach the inside of the house (the component's private state) in a controlled way.</p>
          </div>
        </div>
        <p><code>input()</code> is the modern signal-based way to declare a <strong>public input binding</strong>. <code>@Input()</code> marks a decorator-based input and is still fully valid in existing code &mdash; it tells Angular that the parent is allowed to set this property from the template using property binding syntax. Without it, a property is private to the component class; Angular will not allow the parent to bind to it, and the template compiler will report an error.</p>
        <h3>Reacting to changes</h3>
        <p>With <code>input()</code>, the value is a signal &mdash; read it inside a <code>computed()</code> or <code>effect()</code> and your logic re-runs automatically whenever the input changes, no separate lifecycle hook required. With decorator-based <code>@Input()</code>, Angular calls <code>ngOnChanges</code> (if implemented) and passes a <code>SimpleChanges</code> object every time the value changes, giving you a place to react &mdash; for example, to refetch data when an ID input changes.</p>
        <h3>Input transform</h3>
        <p>You can define a transform function on an input to coerce incoming values: <code>id = input(0, { transform: numberAttribute })</code> (or the decorator equivalent <code>@Input({ transform: numberAttribute })</code>). The transform runs automatically whenever Angular sets the input, converting the raw bound value (often a string from a static attribute in tests or SSR) into the target type. Angular ships helper transforms like <code>numberAttribute</code> and <code>booleanAttribute</code> for the common cases.</p>
      `,
      "code": `import { Component, input, computed, effect, inject } from '@angular/core';
import { numberAttribute } from '@angular/core';
import { UserService } from './user.service';

interface UserProfile {
  name: string;
  avatar: string;
  bio: string;
}

@Component({
  selector: 'app-user-profile',
  template: \`
    @if (profile()) {
      <img [src]="profile()!.avatar" />
      <h2>{{ profile()!.name }}</h2>
      @if (showBio()) { <p>{{ profile()!.bio }}</p> }
    }
  \`
})
export class UserProfileComponent {
  // Required input — missing it causes a compile-time error
  readonly userId = input.required<number>();

  // Optional input with a default
  readonly showBio = input(true);

  // transform: coerces '42' (string from HTML attribute) to 42 (number)
  readonly maxBioLength = input(200, { transform: numberAttribute });

  private userService = inject(UserService);
  readonly profile = signal<UserProfile | null>(null);

  constructor() {
    effect(() => {
      // Re-fetch automatically whenever userId() changes — no ngOnChanges needed
      this.userService.getUser(this.userId()).subscribe(u => this.profile.set(u));
    });
  }
}

// Parent usage:
// <app-user-profile [userId]="selectedUserId" [showBio]="true"></app-user-profile>`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">input() Is a Signal</p><div class=\"flex flex-wrap items-center justify-center gap-2 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700\">parent sets [userId]</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700\">userId() signal updates</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700\">effect() re-runs automatically</div></div></div>"
    },
    {
      "id": "what-is-output-decorator",
      "title": "What is @Output decorator?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>car horn</strong>. The driver (child component) presses it to announce something to the outside world &mdash; they don't know or care who's listening, or what those people will do about it. From outside, hearing a horn (<code>(searched)="..."</code>) is exactly like hearing any other alert; you don't need to know it came from this particular car versus a native <code>(click)</code> event.</p>
          </div>
        </div>
        <p><code>output()</code> is the modern function-based way to declare a <strong>custom event</strong> the component can emit. <code>@Output()</code> marks a decorator-based output and remains common in existing code. From the parent's perspective it looks exactly like a native DOM event &mdash; the parent uses the same <code>(eventName)="handler"</code> syntax that it uses for <code>(click)</code> or <code>(keydown)</code>. From inside the child, the event is fired by calling <code>.emit()</code>.</p>
        <h3>Naming convention</h3>
        <p>Angular style guide recommends naming output events as verb phrases &mdash; <code>itemSelected</code>, <code>formSubmitted</code>, <code>pageChanged</code> &mdash; because they describe actions that have just happened. Avoid the <code>on</code> prefix on the output itself (save that for the handler method in the parent: <code>onItemSelected</code>).</p>
        <h3>Output aliasing</h3>
        <p>Like inputs, you can alias an output: <code>@Output('select') itemSelect = new EventEmitter()</code> or <code>itemSelect = output({ alias: 'select' })</code>. The parent template uses <code>(select)="..."</code> while the class uses <code>this.itemSelect.emit()</code>. This is useful when the internal name differs from the desired public API name.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Emitting on every keystroke without debouncing is a classic performance mistake. The parent re-runs its handler on every single character typed, potentially triggering expensive operations like an API call per keystroke. Pair frequent outputs with <code>debounceTime</code> on the underlying stream, or throttle the emit calls for scroll/resize-driven events.</p>
          </div>
        </div>
      `,
      "code": `import { Component, output } from '@angular/core';

export interface SearchEvent {
  query: string;
  category: string;
}

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  template: \`
    <div class="search-bar">
      <input [(ngModel)]="query" placeholder="Search..." />
      <select [(ngModel)]="category">
        <option value="all">All</option>
        <option value="books">Books</option>
        <option value="electronics">Electronics</option>
      </select>
      <button type="button" (click)="emitSearch()">Search</button>
      <button type="button" (click)="emitClear()">Clear</button>
    </div>
  \`
})
export class SearchBarComponent {
  query = '';
  category = 'all';

  // Emits a structured search event
  readonly searched = output<SearchEvent>();

  // Emits void — just signals that clear was clicked
  readonly cleared = output<void>();

  emitSearch(): void {
    if (this.query.trim()) {
      this.searched.emit({ query: this.query, category: this.category });
    }
  }

  emitClear(): void {
    this.query = '';
    this.category = 'all';
    this.cleared.emit();
  }
}

// Parent usage:
// <app-search-bar
//   (searched)="loadResults($event)"
//   (cleared)="resetResults()"
// ></app-search-bar>`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Output Naming: Verb, Past Tense</p><div class=\"grid grid-cols-2 gap-3 max-w-md mx-auto text-xs\"><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center\"><p class=\"font-mono font-bold text-emerald-700\">itemSelected</p><p class=\"text-slate-500 mt-1\">good</p></div><div class=\"bg-rose-50 border border-rose-200 rounded-lg p-3 text-center\"><p class=\"font-mono font-bold text-rose-700\">onItemSelect</p><p class=\"text-slate-500 mt-1\">avoid the on- prefix here</p></div></div></div>"
    },
    {
      "id": "what-is-event-emitter",
      "title": "What is EventEmitter?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>radio broadcast tower</strong> built on top of a general-purpose transmitter (RxJS's <code>Subject</code>). <code>EventEmitter</code> is that tower configured specifically for one-way announcements to whoever's tuned in via <code>(eventName)</code>. You technically could plug a receiver straight into the transmitter and <code>.subscribe()</code> to it manually &mdash; and Angular does exactly that under the hood &mdash; but the tower's whole purpose is the template binding, not manual subscription.</p>
          </div>
        </div>
        <p><code>EventEmitter</code> is an Angular class that enables a component to broadcast a custom event. It lives in <code>@angular/core</code> and is used together with <code>@Output()</code> (the modern <code>output()</code> function returns a similar emitter object under the hood). When you call <code>.emit(value)</code>, Angular propagates the event up to the parent template and invokes the bound handler, passing the emitted value as <code>$event</code>.</p>
        <h3>EventEmitter extends Subject</h3>
        <p>Internally, <code>EventEmitter</code> extends RxJS <code>Subject</code>, which means it is also an Observable. You can call <code>.subscribe()</code> on it programmatically, though this is rarely the right approach for template event bindings &mdash; it is mainly useful in tests. For regular component output, always use the <code>(eventName)="handler"</code> template binding rather than subscribing to the EventEmitter directly in component code.</p>
        <h3>Typed EventEmitter</h3>
        <p>Always provide the generic type parameter: <code>new EventEmitter&lt;Product&gt;()</code>. This gives the parent template type-safe access to <code>$event</code> &mdash; the template compiler knows <code>$event</code> is a <code>Product</code> and can catch type errors. An untyped <code>new EventEmitter()</code> makes <code>$event</code> implicitly <code>any</code>.</p>
        <h3>The async parameter</h3>
        <p><code>new EventEmitter(true)</code> makes the emitter asynchronous &mdash; emitted values are dispatched in a microtask rather than synchronously. This is rarely needed but can prevent <code>ExpressionChangedAfterItHasBeenCheckedError</code> when an emission would otherwise cause a change during the same change detection run that triggered the event.</p>
      `,
      "code": `import { Component, Output, EventEmitter, Input } from '@angular/core';

export interface QuantityChange {
  productId: number;
  newQuantity: number;
}

@Component({
  selector: 'app-quantity-picker',
  template: \`
    <div class="qty-picker">
      <button type="button" (click)="decrement()" [disabled]="quantity <= 1">−</button>
      <span>{{ quantity }}</span>
      <button type="button" (click)="increment()" [disabled]="quantity >= maxQty">+</button>
    </div>
  \`
})
export class QuantityPickerComponent {
  @Input({ required: true }) productId!: number;
  @Input() maxQty = 99;

  // Strongly typed — $event in the parent template is QuantityChange
  @Output() quantityChanged = new EventEmitter<QuantityChange>();

  quantity = 1;

  increment(): void {
    this.quantity++;
    this.quantityChanged.emit({ productId: this.productId, newQuantity: this.quantity });
  }

  decrement(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.quantityChanged.emit({ productId: this.productId, newQuantity: this.quantity });
    }
  }
}

// Parent:
// <app-quantity-picker
//   [productId]="item.id"
//   [maxQty]="item.stock"
//   (quantityChanged)="updateCart($event)"
// ></app-quantity-picker>`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">EventEmitter Extends Subject</p><div class=\"flex flex-col items-center gap-2 text-xs font-mono\"><div class=\"bg-slate-800 text-white rounded-lg px-3 py-1.5\">RxJS Subject</div><div class=\"w-px h-3 bg-slate-300\"></div><div class=\"bg-indigo-50 border-2 border-indigo-300 rounded-lg px-3 py-1.5 text-indigo-700\">EventEmitter&lt;T&gt;</div><div class=\"w-px h-3 bg-slate-300\"></div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5 text-emerald-700\">(eventName)=\"handler($event)\"</div></div></div>"
    },
    {
      "id": "what-is-viewchild-viewchildren",
      "title": "What is ViewChild and ViewChildren?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>stage director with a direct earpiece to each actor</strong> in their own show. The director (parent component) doesn't need to shout instructions across the theatre &mdash; they can speak directly to a specific actor's earpiece (call a method on the child directly) whenever they choose. But the earpiece only connects once the actor is actually on stage and ready &mdash; not before the curtain rises.</p>
          </div>
        </div>
        <p><code>@ViewChild()</code> / <code>@ViewChildren()</code> (or the modern <code>viewChild()</code> / <code>viewChildren()</code> signal queries) give a component direct access to child components, directives, or template reference variables that are declared inside its own template. This is for the component's <strong>own view</strong> &mdash; the HTML in its <code>template</code> field.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Decorator-based <code>@ViewChild</code> references are only populated after Angular completes the component's view &mdash; that is, after <code>ngAfterViewInit()</code> runs. Trying to read them in <code>ngOnInit</code> gives you <code>undefined</code>, a very common source of confusing bugs. The modern <code>viewChild()</code> signal query sidesteps this entirely: it returns a signal you can safely read anywhere, and it simply reports <code>undefined</code> until the view exists &mdash; no crash, no timing puzzle.</p>
          </div>
        </div>
        <h3>Practical use: calling a child's method</h3>
        <p>A common real-world use case is calling a method on a child component &mdash; for example, resetting a form, focusing an input, or scrolling a list. The parent holds a reference and calls the method directly. This is appropriate when the interaction is driven by the parent's logic (e.g., an "open modal" button in the parent calls <code>this.modal().open()</code>).</p>
        <h3>QueryList</h3>
        <p><code>@ViewChildren()</code> returns a <code>QueryList&lt;T&gt;</code>, which is a live collection. When child components are added or removed (e.g., via <code>@for</code>), the QueryList updates and fires its <code>changes</code> observable. You can subscribe to <code>this.items.changes</code> to react whenever the set of children changes. The signal-based <code>viewChildren()</code> gives you a plain readonly signal of an array instead, which composes more naturally with <code>computed()</code>.</p>
      `,
      "code": `import { Component, viewChildren, afterRenderEffect } from '@angular/core';

@Component({
  selector: 'app-slide',
  template: '<div class="slide"><ng-content></ng-content></div>'
})
export class SlideComponent {
  activate() { /* add active class */ }
  deactivate() { /* remove active class */ }
}

@Component({
  selector: 'app-slideshow',
  imports: [SlideComponent],
  template: \`
    @for (s of slides; track s) { <app-slide>{{ s }}</app-slide> }
    <button type="button" (click)="prev()">Prev</button>
    <button type="button" (click)="next()">Next</button>
  \`
})
export class SlideshowComponent {
  slides = ['Slide 1', 'Slide 2', 'Slide 3'];
  currentIndex = 0;

  // A live, readonly signal of all app-slide instances in this view
  readonly slideRefs = viewChildren(SlideComponent);

  constructor() {
    // Re-run whenever the set of slides changes after a render
    afterRenderEffect(() => this.activateCurrent());
  }

  next(): void {
    if (this.currentIndex < this.slides.length - 1) {
      this.currentIndex++;
      this.activateCurrent();
    }
  }

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.activateCurrent();
    }
  }

  private activateCurrent(): void {
    this.slideRefs().forEach((s, i) =>
      i === this.currentIndex ? s.activate() : s.deactivate()
    );
  }
}`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">ViewChild Timing</p><div class=\"flex flex-wrap items-center justify-center gap-2 text-xs\"><div class=\"bg-rose-50 border-2 border-rose-200 rounded-lg px-3 py-2 text-center font-semibold text-rose-700\">ngOnInit<br><span class=\"font-normal text-slate-500\">@ViewChild is undefined</span></div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700\">ngAfterViewInit<br><span class=\"font-normal text-slate-500\">@ViewChild is ready</span></div></div><p class=\"text-center text-slate-400 text-xs mt-3\">viewChild() signal avoids this trap — it's just undefined-safe to read anywhere</p></div>"
    },
    {
      "id": "what-is-contentchild-contentchildren",
      "title": "What is ContentChild and ContentChildren?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>picture frame you sell empty</strong>. You don't know or control what photo the customer will put inside &mdash; that's <code>&lt;ng-content&gt;</code>, the empty slot. But you might still want to peek at the photo they inserted (to auto-crop it, say). <code>@ContentChild</code> is that peek: it lets the frame (the host component) inspect whatever the customer (the consumer) chose to project into it.</p>
          </div>
        </div>
        <p><code>@ContentChild()</code> and <code>@ContentChildren()</code> (or their signal equivalents <code>contentChild()</code> / <code>contentChildren()</code>) access elements that are <strong>projected into the component</strong> via <code>&lt;ng-content&gt;</code>, rather than elements defined in the component's own template. This is the distinction: <code>@ViewChild</code> queries the component's own template; <code>@ContentChild</code> queries content that comes from the outside world.</p>
        <h3>ng-content and content projection</h3>
        <p>Content projection is Angular's equivalent of the web component slot mechanism. When you write <code>&lt;app-card&gt;&lt;p&gt;Hello&lt;/p&gt;&lt;/app-card&gt;</code>, the <code>&lt;p&gt;</code> is the projected content. Inside <code>CardComponent</code>, <code>&lt;ng-content&gt;</code> marks where the projected content is rendered. The component does not know what content will be projected &mdash; it just provides a slot. <code>@ContentChild</code> lets the host component inspect or interact with what was projected into that slot.</p>
        <h3>Lifecycle: ngAfterContentInit</h3>
        <p>Projected content is available after <code>ngAfterContentInit()</code> runs &mdash; one hook earlier than <code>ngAfterViewInit</code>. The ordering is: constructor &rarr; ngOnChanges &rarr; ngOnInit &rarr; ngDoCheck &rarr; ngAfterContentInit &rarr; ngAfterContentChecked &rarr; ngAfterViewInit. Access <code>@ContentChild</code> references in <code>ngAfterContentInit</code> or later &mdash; the signal-based <code>contentChild()</code> avoids the timing puzzle the same way <code>viewChild()</code> does.</p>
        <h3>Real-world example: tab component</h3>
        <p>A classic use case is a tab container that expects <code>&lt;app-tab&gt;</code> children to be projected into it. The container uses <code>@ContentChildren(TabComponent)</code> to get the list of all tabs, reads their labels to render the tab bar, and activates the correct one. The tabs are defined by the consumer; the container just manages them.</p>
      `,
      "code": `import { Component, contentChildren, input, afterRenderEffect } from '@angular/core';

// ---- Tab component: a projected child ----
@Component({
  selector: 'app-tab',
  template: \`@if (active) { <div><ng-content></ng-content></div> }\`
})
export class TabComponent {
  readonly label = input.required<string>();
  active = false;
}

// ---- Tabs container: queries its projected content ----
@Component({
  selector: 'app-tabs',
  imports: [NgClass],
  template: \`
    <!-- Tab bar built from projected TabComponents -->
    <div class="tab-bar">
      @for (tab of tabs(); track tab) {
        <button type="button" [ngClass]="{ active: tab.active }" (click)="selectTab(tab)">
          {{ tab.label() }}
        </button>
      }
    </div>
    <!-- Projected tabs render here -->
    <ng-content></ng-content>
  \`
})
export class TabsComponent {
  readonly tabs = contentChildren(TabComponent);

  constructor() {
    afterRenderEffect(() => {
      // Activate the first tab by default, once tabs exist
      const all = this.tabs();
      if (all.length && !all.some(t => t.active)) {
        all[0].active = true;
      }
    });
  }

  selectTab(selected: TabComponent): void {
    this.tabs().forEach(t => (t.active = t === selected));
  }
}

// ---- Consumer: projects TabComponents into the container ----
// <app-tabs>
//   <app-tab label="Overview">Overview content here</app-tab>
//   <app-tab label="Details">Detailed info here</app-tab>
//   <app-tab label="Reviews">Customer reviews here</app-tab>
// </app-tabs>`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">ViewChild vs ContentChild</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-indigo-700 mb-1\">@ViewChild</p><p class=\"text-slate-600\">queries the component's<br><strong>own template</strong> HTML</p></div><div class=\"bg-purple-50 border-2 border-purple-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-purple-700 mb-1\">@ContentChild</p><p class=\"text-slate-600\">queries content <strong>projected in</strong><br>via &lt;ng-content&gt;</p></div></div></div>"
    },
    {
      "id": "service-based-communication",
      "title": "How to communicate between unrelated components using a service?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>shared office bulletin board</strong> instead of passing notes hand-to-hand through every desk in between. Two colleagues on opposite sides of the building (unrelated components) don't need to relay a message through everyone sitting in the rows between them (prop drilling). They both just walk up to the same board (an injected service), read the current pin, or post a new one &mdash; everyone watching the board sees the update instantly.</p>
          </div>
        </div>
        <p><code>@Input()</code>/<code>@Output()</code> (and their function-based equivalents) only work between direct parent-child pairs. When two components have no parent-child relationship &mdash; for example, a sidebar and a main content panel, or a header and a nested route component &mdash; passing data through the component tree via input/output chains becomes unmanageable. This is called <strong>prop drilling</strong>, and the solution is a shared service holding reactive state.</p>
        <h3>Signal-based shared state</h3>
        <p>The simplest modern pattern is a private writable signal in a root-provided service, exposed as a read-only signal (<code>.asReadonly()</code>) plus methods to mutate it. Any component that injects the service and reads the signal automatically re-renders when it changes &mdash; no subscription management needed.</p>
        <h3>BehaviorSubject as shared state</h3>
        <p>For state that's driven by async streams (WebSocket messages, polling, combined HTTP calls), RxJS's <code>BehaviorSubject</code> is still the right tool. A <code>BehaviorSubject</code> remembers the last value it emitted, so any component that subscribes immediately receives the current value &mdash; it does not have to wait for the next emission. The service exposes the subject's data as a public read-only <code>Observable</code> (via <code>.asObservable()</code>) so components can subscribe to changes, but only the service can push new values.</p>
        <h3>The pattern</h3>
        <p>Whichever primitive you choose, the shape is the same: the service holds private mutable state and exposes two things &mdash; a public read channel and a method for writing. Components read using the <code>async</code> pipe (for observables) or by calling the signal (for signals). When any component calls the write method, all other components watching the read channel see the update on the next render.</p>
      `,
      "code": `import { Injectable, computed, signal } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

// ---- CartService: single source of truth for cart state ----
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsState = signal<CartItem[]>([]);

  // Public read-only signal — components read this directly
  readonly items = this.itemsState.asReadonly();
  readonly itemCount = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  addItem(newItem: CartItem): void {
    this.itemsState.update(current => {
      const existing = current.find(i => i.id === newItem.id);
      if (existing) {
        return current.map(i => i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...current, { ...newItem, quantity: 1 }];
    });
  }

  removeItem(id: number): void {
    this.itemsState.update(current => current.filter(i => i.id !== id));
  }

  clear(): void {
    this.itemsState.set([]);
  }
}

// ---- HeaderComponent: shows cart count — no parent/child relationship with ProductPage ----
@Component({
  selector: 'app-header',
  template: \`<nav><span>Cart ({{ cart.itemCount() }} items)</span></nav>\`
})
export class HeaderComponent {
  cart = inject(CartService);
}

// ---- ProductPageComponent: adds items — completely unrelated to HeaderComponent ----
@Component({
  selector: 'app-product-page',
  template: \`<button type="button" (click)="addLaptop()">Add Laptop to Cart</button>\`
})
export class ProductPageComponent {
  private cart = inject(CartService);

  addLaptop(): void {
    this.cart.addItem({ id: 1, name: 'Laptop', quantity: 1, price: 999 });
    // HeaderComponent's count updates automatically — no @Output needed
  }
}`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Prop Drilling vs Shared Service</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-rose-50 border-2 border-rose-200 rounded-xl p-3\"><p class=\"font-bold text-rose-700 text-center mb-2\">Prop drilling</p><div class=\"flex flex-col items-center gap-1 font-mono text-slate-600\"><div>Header</div><div class=\"text-slate-300\">&darr; input/output chain</div><div>Layout</div><div class=\"text-slate-300\">&darr;</div><div>ProductPage</div></div></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">Shared service</p><div class=\"flex flex-col items-center gap-2\"><div class=\"bg-white border border-emerald-200 rounded px-3 py-1\">CartService (root)</div><div class=\"flex gap-4 text-slate-500\"><span>&uarr; Header reads</span><span>&uarr; ProductPage writes</span></div></div></div></div></div>"
    }
  ]
});
