window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "directives",
  "title": "Directives",
  "icon": "bi bi-grid-3x3-gap",
  "questions": [
    {
      "id": "angular-22-standard-directives-upgrade",
      "title": "Angular 22 standard for directives and control flow",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Swapping <strong>handwritten traffic signs</strong> for a proper set of <strong>built-in road signals</strong>. <code>*ngIf</code> and <code>*ngFor</code> were signs you had to interpret through Angular's translation layer (the asterisk desugaring into <code>&lt;ng-template&gt;</code>). <code>@if</code> and <code>@for</code> are dedicated traffic lights baked directly into the road &mdash; no translation needed, and the compiler can reason about them more precisely, which is why they check types better and don't need <code>CommonModule</code> imported at all.</p>
          </div>
        </div>
        <p>For Angular 22-ready templates, teach the new block syntax first: <code>@if</code>, <code>@for</code>, and <code>@switch</code>. The older structural directives still work and are extremely common in legacy code you'll read on the job, but blocks are the default for new Angular templates &mdash; they're clearer to read, catch more mistakes at compile time, and skip the import ceremony entirely.</p>
        <h3>Upgrade rule of thumb</h3>
        <ul>
          <li><code>*ngIf</code> becomes <code>@if</code>.</li>
          <li><code>*ngFor</code> becomes <code>@for (...; track ...)</code> &mdash; note <code>track</code> is mandatory, not optional like <code>trackBy</code> was.</li>
          <li><code>[ngSwitch]</code> becomes <code>@switch</code>.</li>
          <li>Simple <code>NgClass</code> usage becomes class bindings like <code>[class.active]</code>.</li>
          <li>Simple <code>NgStyle</code> usage becomes style bindings like <code>[style.width.%]</code>.</li>
        </ul>
      `,
      "code": `import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-product-list',
  template: \`
    @if (loading()) {
      <p>Loading...</p>
    } @else {
      @for (product of products(); track product.id) {
        <article [class.out-of-stock]="!product.inStock">
          <h3>{{ product.name }}</h3>

          @switch (product.status) {
            @case ('new') { <span>New</span> }
            @case ('sale') { <span>Sale</span> }
            @default { <span>Regular</span> }
          }
        </article>
      } @empty {
        <p>No products found.</p>
      }
    }
  \`
})
export class ProductListComponent {
  readonly loading = signal(false);
  readonly products = signal([
    { id: 1, name: 'Laptop', inStock: true, status: 'sale' },
    { id: 2, name: 'Webcam', inStock: false, status: 'new' }
  ]);
}`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Structural Directives &rarr; Block Syntax</p><div class=\"grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto text-xs\"><div class=\"bg-slate-50 border border-slate-200 rounded-lg p-3 text-center\"><p class=\"font-mono font-bold text-slate-600\">*ngIf</p><p class=\"text-slate-300 my-1\">&darr;</p><p class=\"font-mono font-bold text-indigo-700\">@if / @else</p></div><div class=\"bg-slate-50 border border-slate-200 rounded-lg p-3 text-center\"><p class=\"font-mono font-bold text-slate-600\">*ngFor</p><p class=\"text-slate-300 my-1\">&darr;</p><p class=\"font-mono font-bold text-emerald-700\">@for (...; track ...)</p></div><div class=\"bg-slate-50 border border-slate-200 rounded-lg p-3 text-center\"><p class=\"font-mono font-bold text-slate-600\">[ngSwitch]</p><p class=\"text-slate-300 my-1\">&darr;</p><p class=\"font-mono font-bold text-amber-700\">@switch / @case</p></div></div></div>"
    },
    {
      "id": "what-are-directives",
      "title": "What are directives?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>sticky note attached to a filing cabinet drawer</strong> that says "keep this locked" or "duplicate this folder three times." The drawer (the DOM element) doesn't change what it fundamentally is, but the note tells the office (Angular) exactly what special handling to apply to it. Directives are those sticky notes &mdash; instructions attached to ordinary HTML that Angular reads and acts on.</p>
          </div>
        </div>
        <p>A <strong>directive</strong> is a class that adds behavior or modifies the structure of elements in the DOM. Every Angular template is processed by the Angular compiler, and directives are the mechanism through which Angular knows what to do with an element &mdash; whether to show it, repeat it, style it, or attach custom logic to it.</p>
        <p>Think of a directive as an instruction you attach to a DOM element. When Angular processes the template and encounters a directive, it runs the corresponding class logic against that element. The element itself remains an ordinary HTML node; the directive is what gives it Angular-powered behavior.</p>
        <h3>Why not just use JavaScript directly?</h3>
        <p>You could manually add and remove elements with <code>document.createElement</code> or toggle CSS classes with <code>classList</code>, but that logic would live outside Angular's change-detection cycle. Angular would have no idea those DOM changes happened, which breaks the reactive update model. Directives keep DOM manipulation inside the Angular world, so the framework can track, test, and coordinate it properly.</p>
        <h3>Three categories</h3>
        <p>Angular organizes all directives into three groups: <strong>components</strong> (directives with their own template), <strong>structural directives</strong> (directives that add or remove DOM nodes), and <strong>attribute directives</strong> (directives that modify an existing element's appearance or behavior). Legacy built-in examples include <code>*ngIf</code>, <code>*ngFor</code>, <code>ngClass</code>, and <code>ngStyle</code>. In new Angular code, prefer block syntax for control flow and direct class/style bindings for simple styling.</p>
      `,
      "code": `// All three directive types in one template
@Component({
  selector: 'app-demo',
  imports: [NgIf, NgFor, NgClass],
  template: \`
    <!-- Structural directive: conditionally renders the heading -->
    <h2 *ngIf="isLoggedIn">Welcome back!</h2>

    <!-- Structural directive: repeats a list item for each course -->
    <ul>
      <li *ngFor="let course of courses">{{ course }}</li>
    </ul>

    <!-- Attribute directive: toggles a CSS class dynamically -->
    <p [ngClass]="{ 'text-success': isActive, 'text-muted': !isActive }">
      Status indicator
    </p>
  \`
})
export class DemoComponent {
  isLoggedIn = true;
  isActive = true;
  courses = ['Components', 'Bindings', 'Directives'];
}`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Three Kinds of Directive</p><div class=\"grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-indigo-700\">Component</p><p class=\"text-slate-500 mt-1\">has its own template</p></div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-emerald-700\">Structural</p><p class=\"text-slate-500 mt-1\">adds/removes DOM nodes</p></div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-amber-700\">Attribute</p><p class=\"text-slate-500 mt-1\">changes look or behavior</p></div></div></div>"
    },
    {
      "id": "types-of-directives",
      "title": "Types of directives in Angular",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A theatre production. A <strong>component</strong> is a whole scene with its own set built (a template). A <strong>structural directive</strong> is the stage crew that wheels an entire set piece on or off between scenes &mdash; it changes what exists on stage. An <strong>attribute directive</strong> is the lighting technician who leaves every set piece exactly where it is but changes how it looks by adjusting a spotlight.</p>
          </div>
        </div>
        <p>Angular directives fall into three types, and understanding the distinction matters because the correct type determines how and where you apply a directive.</p>
        <h3>Component directives</h3>
        <p>Every Angular component is technically a directive &mdash; it just happens to have its own HTML template attached. When you write <code>&lt;app-navbar&gt;</code> in a template, Angular is processing a component directive. The <code>@Component</code> decorator extends <code>@Directive</code> with a <code>template</code> field. This is the most common directive type you write day-to-day.</p>
        <h3>Structural directives</h3>
        <p>These change the <strong>shape of the DOM</strong> &mdash; they add elements, remove them, or clone them. The asterisk prefix (<code>*ngIf</code>, <code>*ngFor</code>) is Angular shorthand that gets desugared into an <code>&lt;ng-template&gt;</code> block at compile time. The directive itself receives a <code>TemplateRef</code> and a <code>ViewContainerRef</code>, giving it full control over whether and how many times the template is stamped into the DOM. Modern code reaches for <code>@if</code>/<code>@for</code>/<code>@switch</code> blocks instead, which don't need this desugaring step at all.</p>
        <h3>Attribute directives</h3>
        <p>These leave the DOM structure unchanged but modify the element's <strong>appearance or behavior</strong>. They sit on an existing element like an HTML attribute. <code>ngClass</code>, <code>ngStyle</code>, and custom hover or permission directives are all attribute directives. They use <code>ElementRef</code> and <code>Renderer2</code> to touch the element, and <code>@HostListener</code> to respond to events on it.</p>
      `,
      "code": `// ---- Component directive (has its own template) ----
@Component({
  selector: 'app-user-card',
  template: \`
    <div class="card">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
    </div>
  \`
})
export class UserCardComponent {
  @Input() user!: { name: string; email: string };
}

// ---- Structural directive (changes DOM structure) ----
// <div *ngIf="user">...</div>
// Desugars to:
// <ng-template [ngIf]="user"><div>...</div></ng-template>

// ---- Attribute directive (changes existing element) ----
@Directive({
  selector: '[appBadge]'
})
export class BadgeDirective {
  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.renderer.addClass(this.el.nativeElement, 'badge');
  }
}
// Usage: <span appBadge>New</span>`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Component &lt; Directive Hierarchy</p><div class=\"flex flex-col items-center gap-2 text-xs font-mono\"><div class=\"bg-slate-800 text-white rounded-lg px-3 py-1.5\">@Directive (base)</div><div class=\"w-px h-3 bg-slate-300\"></div><div class=\"flex gap-6\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5\">@Component<br><span class=\"font-sans text-slate-500 text-[10px]\">adds template</span></div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5\">Structural<br><span class=\"font-sans text-slate-500 text-[10px]\">reshapes DOM</span></div><div class=\"bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5\">Attribute<br><span class=\"font-sans text-slate-500 text-[10px]\">modifies element</span></div></div></div></div>"
    },
    {
      "id": "what-are-structural-directives",
      "title": "What are structural directives?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>3D printer with a blueprint</strong> (<code>TemplateRef</code>) and a build platform (<code>ViewContainerRef</code>). Give it a condition and it either prints the object once or not at all (<code>*ngIf</code>). Give it a list and it prints one copy per item, then throws away and reprints copies as the list changes (<code>*ngFor</code>). Nothing prints until the directive says so &mdash; the blueprint alone does nothing.</p>
          </div>
        </div>
        <p>A <strong>structural directive</strong> is a directive that reshapes the DOM by adding, removing, or multiplying HTML elements. The key word is <em>structure</em> &mdash; unlike attribute directives, structural directives are allowed to create or destroy DOM nodes entirely.</p>
        <h3>The asterisk shorthand</h3>
        <p>When you write <code>*ngIf="condition"</code>, Angular transforms that into an <code>&lt;ng-template [ngIf]="condition"&gt;</code> block. The asterisk is syntactic sugar that makes structural directives easier to write. Under the hood, the directive gets a <code>TemplateRef</code> (the HTML to stamp) and a <code>ViewContainerRef</code> (the location in the DOM where it should stamp). When the condition is true, the template is embedded; when false, it is removed.</p>
        <h3>ngIf with else</h3>
        <p>A very useful pattern is pairing <code>*ngIf</code> with an <code>else</code> clause that points to a named <code>&lt;ng-template&gt;</code>. This lets you define both the truthy and falsy view in the same template without duplicating logic in the component class.</p>
        <h3>ngFor local variables</h3>
        <p><code>*ngFor</code> exposes several useful local variables: <code>index</code> (zero-based position), <code>first</code>, <code>last</code>, <code>even</code>, and <code>odd</code>. These let you add alternating row colors, number lists, or skip certain items entirely, all without extra component logic.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">You cannot put two structural directives on the same element &mdash; <code>&lt;div *ngIf="x" *ngFor="let i of items"&gt;</code> is a compile error, because both desugar into competing <code>&lt;ng-template&gt;</code> wrappers around the same element. Wrap one in an <code>&lt;ng-container&gt;</code> (which renders no extra DOM element) to nest them properly.</p>
          </div>
        </div>
        <h3>ngSwitch</h3>
        <p><code>ngSwitch</code> is slightly different &mdash; the container attribute uses square-bracket binding (<code>[ngSwitch]="value"</code>), and the individual cases use <code>*ngSwitchCase</code> and <code>*ngSwitchDefault</code>. It renders exactly one matching case and removes all others from the DOM.</p>
      `,
      "code": `@Component({
  selector: 'app-order-status',
  imports: [NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault],
  template: \`
    <!-- ngIf with else template -->
    <div *ngIf="user; else guestTpl">
      <p>Welcome, {{ user.name }}</p>
    </div>
    <ng-template #guestTpl>
      <p>Please log in to continue.</p>
    </ng-template>

    <!-- ngFor with index and trackBy for performance -->
    <ul>
      <li
        *ngFor="let item of cartItems; index as i; trackBy: trackById"
        [class.even-row]="i % 2 === 0"
      >
        {{ i + 1 }}. {{ item.name }} — \${{ item.price }}
      </li>
    </ul>

    <!-- ngSwitch: only one branch rendered in the DOM -->
    <div [ngSwitch]="orderStatus">
      <p *ngSwitchCase="'pending'">Your order is being processed.</p>
      <p *ngSwitchCase="'shipped'">Your order is on the way!</p>
      <p *ngSwitchCase="'delivered'">Your order has arrived.</p>
      <p *ngSwitchDefault>Unknown order status.</p>
    </div>
  \`
})
export class OrderStatusComponent {
  user: { name: string } | null = { name: 'Siladitya' };
  orderStatus = 'shipped';
  cartItems = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 29 },
    { id: 3, name: 'Keyboard', price: 79 }
  ];

  trackById(index: number, item: { id: number }) {
    return item.id;
  }
}`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">*ngIf Desugaring</p><div class=\"flex flex-col items-center gap-2 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-4 py-2 font-mono font-semibold text-indigo-700\">&lt;div *ngIf=\"user\"&gt;...&lt;/div&gt;</div><span class=\"text-slate-300\">compiles to</span><div class=\"bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg px-4 py-2 font-mono text-slate-600 text-center\">&lt;ng-template [ngIf]=\"user\"&gt;<br>&nbsp;&nbsp;&lt;div&gt;...&lt;/div&gt;<br>&lt;/ng-template&gt;</div></div></div>"
    },
    {
      "id": "what-are-attribute-directives",
      "title": "What are attribute directives?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Putting a <strong>costume on an actor</strong> who is already cast in the scene. The actor doesn't leave or get replaced &mdash; they're the same person, same lines, same position on stage. The costume (an attribute directive) just changes how they look or how they react to cues, without touching who's on stage or in what order.</p>
          </div>
        </div>
        <p>An <strong>attribute directive</strong> modifies the appearance or behavior of an existing element &mdash; it never adds or removes DOM nodes. You apply it like an HTML attribute, which is where the name comes from. The element stays in the DOM exactly as before; the directive just changes how it looks or what it does.</p>
        <h3>ngClass</h3>
        <p><code>ngClass</code> is the most-used attribute directive. It accepts an object where each key is a CSS class name and each value is a boolean expression. Angular adds the class when the expression is truthy and removes it when falsy, all without you touching the DOM manually. This replaces complex ternary strings in the <code>class</code> attribute and makes the logic readable and testable.</p>
        <h3>ngStyle</h3>
        <p><code>ngStyle</code> works the same way but for inline styles. You pass an object whose keys are CSS property names and whose values come from component properties. Use this when the exact style value is computed (e.g., a progress bar width as a percentage) rather than toggling between predefined CSS classes.</p>
        <h3>Custom attribute directives</h3>
        <p>Beyond the built-ins, you can write your own. A common real-world use case is a <code>[appPermission]</code> directive that disables or hides elements based on the current user's role, or an <code>[appAutoFocus]</code> directive that focuses an input on mount. These encapsulate reusable DOM behavior that would otherwise be scattered across multiple <code>ngAfterViewInit</code> hooks.</p>
      `,
      "code": `@Component({
  selector: 'app-profile',
  imports: [NgClass, NgStyle],
  template: \`
    <!-- ngClass: multiple classes based on state -->
    <div
      [ngClass]="{
        'status-active': user.isActive,
        'status-banned': user.isBanned,
        'status-pending': !user.isActive && !user.isBanned
      }"
    >
      {{ user.name }}
    </div>

    <!-- ngStyle: computed inline style (progress bar) -->
    <div class="progress-bar">
      <div
        [ngStyle]="{
          width: user.profileCompletion + '%',
          backgroundColor: user.profileCompletion >= 80 ? '#22c55e' : '#f59e0b'
        }"
      ></div>
    </div>
  \`
})
export class ProfileComponent {
  user = {
    name: 'Siladitya',
    isActive: true,
    isBanned: false,
    profileCompletion: 72
  };
}`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">ngClass vs ngStyle</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-xl p-3\"><p class=\"font-bold text-indigo-700 text-center mb-2\">[ngClass]</p><p class=\"text-slate-600 text-center\">toggle predefined CSS classes<br>on/off by boolean</p></div><div class=\"bg-emerald-50 border border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">[ngStyle]</p><p class=\"text-slate-600 text-center\">set computed inline style<br>values directly</p></div></div></div>"
    },
    {
      "id": "what-is-ngif-ngfor-ngswitch",
      "title": "What is ngIf, ngFor, ngSwitch?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>factory assembly line with an inspector</strong>. <code>ngIf</code> is the gate that only lets a product through if it passes a check &mdash; rejected products never even enter the line. <code>ngFor</code> is the stamping machine that produces one unit per item in the input batch. <code>ngSwitch</code> is the sorting conveyor that routes each product down exactly one of several branching chutes based on a label.</p>
          </div>
        </div>
        <p>These three are Angular's built-in structural directives that cover the most common template control-flow needs: conditional rendering, list rendering, and multi-branch rendering. In Angular 22 you'll mostly reach for the newer <code>@if</code>, <code>@for</code>, and <code>@switch</code> block syntax instead &mdash; it's cleaner and more performant &mdash; but the directive versions are still valid and extremely common in existing codebases you'll be asked to maintain.</p>
        <h3>ngIf — show or remove based on a condition</h3>
        <p><code>*ngIf</code> fully adds or removes an element and all its children from the DOM. This is different from hiding with CSS (<code>display: none</code>). When ngIf removes an element, Angular destroys that subtree completely &mdash; child components are destroyed, subscriptions can be cleaned up, and no DOM memory is held. When the condition becomes true again, Angular recreates the entire subtree. For frequently toggled UI, a CSS-based hide may be more performant; for content that is rarely shown, ngIf is better because it avoids rendering cost up front.</p>
        <h3>ngFor — repeat for each item in a collection</h3>
        <p><code>*ngFor</code> stamps the template once per item in an array. Angular uses an identity-tracking algorithm to decide which items to add, remove, or move when the array changes.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Without a <code>trackBy</code> function, <code>*ngFor</code> falls back to object reference identity, which destroys and recreates <em>every</em> item whenever the array reference changes &mdash; even if only one item actually changed. This silently kills performance on API-backed or interactive lists (lost input focus, re-triggered animations, wasted renders). Always provide <code>trackBy</code> for old-style <code>*ngFor</code>. The modern <code>@for</code> block makes this a non-issue by requiring a <code>track</code> expression up front &mdash; you cannot forget it, because it won't compile without one.</p>
          </div>
        </div>
        <h3>ngSwitch — one branch from many</h3>
        <p><code>[ngSwitch]</code> is an attribute binding on the container, not a structural directive itself. The structural part is <code>*ngSwitchCase</code> and <code>*ngSwitchDefault</code>. Only the matching case's DOM is present; all others are removed. This is semantically cleaner than chaining multiple <code>*ngIf</code> checks on the same value.</p>
      `,
      "code": `@Component({
  selector: 'app-product-list',
  imports: [NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault],
  template: \`
    <!-- ngIf: show loading spinner vs actual content -->
    <div *ngIf="isLoading; else contentTpl" class="spinner">Loading...</div>

    <ng-template #contentTpl>
      <!-- ngFor: render each product with trackBy to avoid DOM churn -->
      <div *ngFor="let product of products; trackBy: trackById" class="product-card">
        <h3>{{ product.name }}</h3>
        <p>\${{ product.price }}</p>

        <!-- ngSwitch: render a badge based on stock status -->
        <span [ngSwitch]="product.stock">
          <span *ngSwitchCase="'in_stock'" class="badge-green">In Stock</span>
          <span *ngSwitchCase="'low_stock'" class="badge-yellow">Low Stock</span>
          <span *ngSwitchCase="'out_of_stock'" class="badge-red">Out of Stock</span>
          <span *ngSwitchDefault class="badge-gray">Unknown</span>
        </span>
      </div>
    </ng-template>
  \`
})
export class ProductListComponent {
  isLoading = false;
  products = [
    { id: 1, name: 'Laptop', price: 999, stock: 'in_stock' },
    { id: 2, name: 'Headphones', price: 149, stock: 'low_stock' },
    { id: 3, name: 'Webcam', price: 89, stock: 'out_of_stock' }
  ];

  trackById(index: number, product: { id: number }) {
    return product.id;
  }
}`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Assembly Line: ngIf &rarr; ngFor &rarr; ngSwitch</p><div class=\"flex flex-wrap items-center justify-center gap-2 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700\">ngIf<br><span class=\"font-normal text-slate-500\">gate check</span></div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700\">ngFor<br><span class=\"font-normal text-slate-500\">stamp per item</span></div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700\">ngSwitch<br><span class=\"font-normal text-slate-500\">route to 1 branch</span></div></div></div>"
    },
    {
      "id": "how-to-create-custom-directives",
      "title": "How to create custom directives?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Designing a <strong>reusable stencil</strong> instead of hand-painting the same pattern on every wall. Copy-pasting "focus this input" or "highlight on hover" logic into every component's <code>ngAfterViewInit</code> is hand-painting each wall from scratch. A custom directive is the stencil: design the pattern once, then just hold it up to any element (<code>&lt;p appHighlight&gt;</code>) and the behavior appears instantly.</p>
          </div>
        </div>
        <p>You create a custom directive when you have reusable DOM behavior that does not belong in a single component. For example, automatically focusing an input field, adding a tooltip, enforcing a permission check, or highlighting text on hover &mdash; these behaviors might be needed across dozens of components, and copy-pasting the logic into each component is not maintainable. A custom directive packages that logic once and applies it with a simple attribute.</p>
        <h3>The @Directive decorator</h3>
        <p>Like <code>@Component</code>, the <code>@Directive</code> decorator takes a <code>selector</code>. Attribute directive selectors are written in square brackets: <code>[appHighlight]</code>. This matches any element that has the <code>appHighlight</code> attribute. The class is then instantiated for each matching element, with Angular injecting whatever the constructor (or <code>inject()</code>) asks for.</p>
        <h3>ElementRef and Renderer2</h3>
        <p><code>ElementRef</code> gives you a reference to the host DOM element. You should prefer <code>Renderer2</code> over direct <code>nativeElement</code> manipulation because Renderer2 is platform-agnostic (works in server-side rendering and web workers) and is sanitized. Use <code>renderer.setStyle()</code>, <code>renderer.addClass()</code>, and <code>renderer.removeStyle()</code> rather than writing <code>el.nativeElement.style.color = ...</code> directly.</p>
        <h3>@HostListener</h3>
        <p><code>@HostListener</code> subscribes to DOM events on the host element without requiring <code>addEventListener</code> calls. Angular manages the subscription and cleans it up when the directive is destroyed. This is the recommended way to react to user interaction inside a directive.</p>
        <h3>@Input for configuration</h3>
        <p>You can make the directive configurable by naming an <code>@Input()</code> property the same as the selector. Then <code>&lt;p appHighlight="lightblue"&gt;</code> passes the color directly through the attribute value.</p>
      `,
      "code": `import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

// A reusable highlight directive that works on any element
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  // Input name matches the selector so the attribute value is the color
  @Input() appHighlight = 'lightyellow';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.renderer.setStyle(
      this.el.nativeElement,
      'backgroundColor',
      this.appHighlight
    );
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.renderer.removeStyle(this.el.nativeElement, 'backgroundColor');
  }
}

// ---- Usage in any component ----
@Component({
  selector: 'app-docs',
  imports: [HighlightDirective],
  template: \`
    <p appHighlight>Hover me (default yellow)</p>
    <p appHighlight="lightblue">Hover me (light blue)</p>
    <p appHighlight="#fce7f3">Hover me (pink)</p>
  \`
})
export class DocsComponent {}`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Custom Directive Anatomy</p><div class=\"grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-indigo-700 font-mono\">selector</p><p class=\"text-slate-500 mt-1\">[appHighlight]</p></div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-emerald-700 font-mono\">@HostListener</p><p class=\"text-slate-500 mt-1\">reacts to DOM events</p></div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-amber-700 font-mono\">Renderer2</p><p class=\"text-slate-500 mt-1\">safely touches the element</p></div></div></div>"
    },
    {
      "id": "component-vs-directive",
      "title": "Difference between component and directive",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Every <strong>square is a rectangle, but not every rectangle is a square</strong>. In Angular terms: every component is a directive (it inherits all directive powers), but most directives are not components (they don't come with their own template). A directive says "do something to this element"; a component says "replace this selector with an entire new view."</p>
          </div>
        </div>
        <p>In Angular's type hierarchy, a <strong>component is a directive</strong>. The <code>@Component</code> decorator is literally a subtype of <code>@Directive</code> with extra metadata fields &mdash; primarily <code>template</code> and <code>styles</code>. Every component is a directive under the hood, but most directives are not components.</p>
        <h3>What makes a component unique</h3>
        <p>A component owns a template. When Angular renders <code>&lt;app-product-card&gt;</code>, it creates an instance of that class and renders the template defined in <code>@Component.template</code> into the DOM. The component's selector acts like a new HTML tag. A plain directive has no template &mdash; it only modifies the element it is placed on.</p>
        <h3>When to use each</h3>
        <p>Use a <strong>component</strong> when you are creating a reusable piece of UI &mdash; a card, a modal, a sidebar, a form. It has its own view, its own layout, its own styles. Use a <strong>directive</strong> when you want to add behavior to elements that already exist &mdash; focus management, tooltip display, scroll tracking, permission enforcement. The directive does not render anything itself; it only augments what is already there.</p>
        <h3>Interview framing</h3>
        <p>A useful one-liner: a directive says "do something to this element," while a component says "replace this selector with this entire view." Both use Angular's DI system, both participate in change detection, and both can be standalone in modern Angular.</p>
      `,
      "code": `// ---- Component: owns its own template and view ----
@Component({
  selector: 'app-alert',
  template: \`
    <div [class]="'alert alert-' + type">
      <strong>{{ title }}</strong>
      <p>{{ message }}</p>
    </div>
  \`
})
export class AlertComponent {
  @Input() type: 'success' | 'error' | 'info' = 'info';
  @Input() title = '';
  @Input() message = '';
}

// ---- Directive: modifies the element it is applied to ----
@Directive({
  selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    // Focus the host input element as soon as the view is ready
    this.el.nativeElement.focus();
  }
}

// Usage:
// <app-alert type="success" title="Saved!" message="Your changes were saved."></app-alert>
// <input appAutofocus placeholder="Search...">  <!-- auto-focused on load -->`,
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Component vs Plain Directive</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3\"><p class=\"font-bold text-indigo-700 text-center mb-2\">@Component</p><ul class=\"space-y-1 text-slate-600\"><li>&bull; has its own template</li><li>&bull; renders as a new tag</li><li>&bull; \"replace me with a view\"</li></ul></div><div class=\"bg-amber-50 border-2 border-amber-200 rounded-xl p-3\"><p class=\"font-bold text-amber-700 text-center mb-2\">@Directive</p><ul class=\"space-y-1 text-slate-600\"><li>&bull; no template of its own</li><li>&bull; attaches to existing elements</li><li>&bull; \"do something to me\"</li></ul></div></div></div>"
    }
  ]
});
