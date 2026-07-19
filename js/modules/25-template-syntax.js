window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "template-syntax",
  "title": "Template Syntax",
  "icon": "bi bi-code-slash",
  "questions": [
    {
      id: "angular-22-standard-template-upgrade",
      title: "Angular 22 standard for template syntax",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Switching from cursive handwriting notes stuck to elements (<code>*ngIf</code>, <code>*ngFor</code>) to a printed form with clearly labeled blocks (<code>@if</code>, <code>@for</code>). Both convey the same information, but the printed form is built into how the document is read from the start — no separate translator (<code>CommonModule</code>) needed to decode the handwriting.</p>
          </div>
        </div>
        <p>Angular 22-ready templates should be readable, signal-aware, and block-syntax-first. Use <code>@if</code>, <code>@for</code>, and <code>@switch</code> for control flow, read signals with function calls, use stable tracking for lists, and keep expensive logic out of the template.</p>
        <h3>Modern template checklist</h3>
        <ul>
          <li>Use <code>@if</code> and <code>@else</code> instead of new <code>*ngIf</code> examples.</li>
          <li>Use <code>@for (...; track item.id)</code> for lists.</li>
          <li>Read signal state as <code>state()</code>.</li>
          <li>Use property, class, style, and event bindings explicitly.</li>
          <li>Use <code>[attr.aria-*]</code> for ARIA attributes.</li>
          <li>Move heavy expressions into <code>computed()</code> or pure pipes.</li>
        </ul>
      `,
      code: `@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html'
})
export class OrderSummaryComponent {
  readonly order = signal<Order | null>(null);
  readonly total = computed(() =>
    this.order()?.items.reduce((sum, item) => sum + item.price, 0) ?? 0
  );
}

// order-summary.component.html
// @if (order(); as currentOrder) {
//   @for (item of currentOrder.items; track item.id) {
//     <p [class.expensive]="item.price > 1000">{{ item.name }}</p>
//   } @empty {
//     <p>No items.</p>
//   }
//   <strong>{{ total() | currency }}</strong>
// }`,
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Legacy Directives vs Block Syntax</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-slate-50 border-2 border-slate-300 rounded-xl p-3\"><p class=\"font-bold text-slate-700 text-center mb-2\">*ngIf / *ngFor</p><p class=\"text-slate-600 text-center\">Needs CommonModule imported, attribute-based microsyntax</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">@if / @for (v22 default)</p><p class=\"text-slate-600 text-center\">Built into the compiler, better type narrowing, mandatory track</p></div></div></div>"
    },
    {
      "id": "template-expression-operators",
      "title": "Template expression operators",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A hotel minibar contract you sign at check-in: you may consume the small approved list of items (arithmetic, ternaries, optional chaining), but you may not raid the kitchen, redecorate the room, or call room service to install new furniture (assignment, <code>new</code>, global objects). The restrictions exist because the template runs on every check — anything destructive or expensive there is a liability.</p>
          </div>
        </div>
        <p><strong>Template expressions</strong> are TypeScript-like snippets evaluated by Angular inside interpolation (<code>{{ }}</code>) and binding attributes (<code>[property]="expression"</code>). Angular evaluates them against the component instance, so any property or method of the component class is available directly by name.</p>
        <h3>What You Can Use</h3>
        <p>Standard TypeScript operators work: arithmetic (<code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>%</code>), comparison (<code>===</code>, <code>!==</code>, <code>&gt;</code>, <code>&lt;</code>), logical (<code>&&</code>, <code>||</code>, <code>!</code>), ternary (<code>condition ? a : b</code>), nullish coalescing (<code>??</code>), optional chaining (<code>?.</code>), property access, array indexing, and method calls. Angular also supports pipes in expressions via the <code>|</code> pipe operator.</p>
        <h3>What You Cannot Use</h3>
        <p>Template expressions are sandboxed for security and performance reasons. You cannot use assignment operators (<code>=</code>, <code>+=</code>), the <code>new</code> keyword, <code>typeof</code>, <code>instanceof</code>, increment/decrement (<code>++</code>, <code>--</code>), or bitwise operators. You also cannot directly reference global objects like <code>window</code>, <code>document</code>, <code>console</code>, or <code>Math</code>. If you need Math functions, expose them through the component: <code>protected Math = Math</code>.</p>
        <h3>Keep Expressions Simple</h3>
        <p>Angular runs template expressions on every change detection cycle. Heavy computations in expressions — sorting a large array, doing string transformations in loops — run repeatedly and hurt performance. Move complex logic into <code>computed()</code>, getter methods, or Angular pipes (which can be memoized).</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Calling <code>{{ getStatusLabel(status) }}</code> where <code>getStatusLabel</code> builds a brand new object or does a heavy lookup every call is invisible in a code review but expensive in practice — it re-runs on every single change detection pass, not just when <code>status</code> changes. Prefer a <code>computed()</code> signal so the work only reruns when its actual input changes.</p>
          </div>
        </div>
      `,
      "code": "@Component({\n  selector: 'app-product-display',\n  imports: [CurrencyPipe, UpperCasePipe],\n  template: `\n    <!-- Arithmetic + pipe -->\n    <p>Total: {{ quantity * price | currency }}</p>\n\n    <!-- Ternary -->\n    <span [class]=\"stock > 0 ? 'in-stock' : 'out-of-stock'\">\n      {{ stock > 0 ? 'In Stock' : 'Out of Stock' }}\n    </span>\n\n    <!-- Nullish coalescing -->\n    <p>{{ user?.displayName ?? 'Anonymous' }}</p>\n\n    <!-- Optional chaining -->\n    <p>{{ order?.shippingAddress?.city }}</p>\n\n    <!-- Logical AND for conditional rendering -->\n    @if (isAdmin && !isReadOnly) {\n      <p>Admin Controls</p>\n    }\n\n    <!-- Method call (keep it cheap — runs every CD cycle) -->\n    <p>{{ getStatusLabel(status) }}</p>\n\n    <!-- Pipe chaining -->\n    <p>{{ lastName | uppercase | slice:0:10 }}</p>\n\n    <!-- Math via component property -->\n    <p>{{ Math.abs(difference) }}</p>\n  `\n})\nexport class ProductDisplayComponent {\n  quantity = 3;\n  price = 29.99;\n  stock = 5;\n  user: { displayName?: string } | null = null;\n  order: { shippingAddress?: { city: string } } | null = null;\n  isAdmin = true;\n  isReadOnly = false;\n  status = 'pending';\n  lastName = 'CHAKRABORTY';\n  difference = -42;\n\n  // Expose Math for template use\n  protected Math = Math;\n\n  // Keep template methods simple and idempotent\n  getStatusLabel(status: string): string {\n    const labels: Record<string, string> = {\n      pending: 'Order Received',\n      processing: 'Being Prepared',\n      shipped: 'On the Way'\n    };\n    return labels[status] ?? 'Unknown';\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Allowed vs Forbidden in Template Expressions</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">Allowed</p><p class=\"text-slate-600 text-center\">+ - * / %, ===, &&, ||, ?:, ??, ?., pipes</p></div><div class=\"bg-rose-50 border-2 border-rose-200 rounded-xl p-3\"><p class=\"font-bold text-rose-700 text-center mb-2\">Forbidden</p><p class=\"text-slate-600 text-center\">=, new, typeof, ++/--, window/document/console</p></div></div></div>"
    },
    {
      "id": "new-control-flow-syntax",
      "title": "New control flow: @if, @for, @switch (Angular 17+)",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Signposted road forks versus verbal directions passed between drivers. <code>*ngFor</code> with optional <code>trackBy</code> was like "turn left, I think, unless someone told you otherwise" — a driver could forget to specify how to recognize a returning car. <code>@for (...; track item.id)</code> makes the sign mandatory: you cannot build the fork without stating how to recognize each car, closing off an entire category of "list re-renders everything from scratch" bugs before they happen.</p>
          </div>
        </div>
        <p>Angular 17 introduced a new built-in control flow syntax using <code>@if</code>, <code>@for</code>, and <code>@switch</code> blocks. These replace <code>*ngIf</code>, <code>*ngFor</code>, and <code>*ngSwitch</code> respectively, and are the default style in Angular 22. The new syntax is built into the Angular compiler — you do not need to import <code>NgIf</code>, <code>NgFor</code>, or <code>NgSwitch</code> in your component, reducing boilerplate significantly.</p>
        <h3>@if — Replacing *ngIf</h3>
        <p><code>@if</code> supports <code>@else if</code> and <code>@else</code> branches inline, without needing a named <code>&lt;ng-template&gt;</code>. The <code>as</code> keyword assigns the truthy value to a local variable — useful when the condition is a method call or a complex expression that you want to read without recalculating.</p>
        <h3>@for — Replacing *ngFor</h3>
        <p><code>@for</code> requires a <code>track</code> expression — this is mandatory, not optional like <code>trackBy</code> was with <code>*ngFor</code>. Making tracking mandatory was intentional: it prevents the accidental performance problem of tracking by identity. The <code>@empty</code> block renders when the collection is empty, replacing the <code>*ngIf="items.length === 0"</code> pattern. Local variables include <code>$index</code>, <code>$first</code>, <code>$last</code>, <code>$even</code>, <code>$odd</code>.</p>
        <h3>@switch — Replacing ngSwitch</h3>
        <p><code>@switch</code> is cleaner than the attribute-based <code>[ngSwitch]</code> + <code>*ngSwitchCase</code> combination. No need for three separate directives. <code>@default</code> is optional.</p>
      `,
      "code": "@Component({\n  selector: 'app-order-tracker',\n  // No NgIf, NgFor, or NgSwitch needed — @if/@for/@switch are built-in\n  template: `\n    <!-- @if with @else if and @else -->\n    @if (isLoading) {\n      <p class=\"loading\">Fetching order...</p>\n    } @else if (error) {\n      <p class=\"error\">{{ error }}</p>\n    } @else if (order) {\n      <h2>Order #{{ order.id }}</h2>\n\n      <!-- @switch: cleaner multi-branch logic -->\n      @switch (order.status) {\n        @case ('pending') {\n          <span class=\"badge-yellow\">Processing</span>\n        }\n        @case ('shipped') {\n          <span class=\"badge-blue\">Shipped — Track your package</span>\n        }\n        @case ('delivered') {\n          <span class=\"badge-green\">Delivered!</span>\n        }\n        @default {\n          <span class=\"badge-gray\">{{ order.status }}</span>\n        }\n      }\n\n      <!-- @for with mandatory track, @empty block, and local variables -->\n      <ul>\n        @for (item of order.items; track item.id; let i = $index, last = $last) {\n          <li [class.border-b]=\"!last\">\n            {{ i + 1 }}. {{ item.name }} × {{ item.quantity }} — ${{ item.price }}\n          </li>\n        } @empty {\n          <li>No items in this order.</li>\n        }\n      </ul>\n\n    } @else {\n      <p>Order not found.</p>\n    }\n  `\n})\nexport class OrderTrackerComponent {\n  isLoading = false;\n  error = '';\n  order: {\n    id: number;\n    status: string;\n    items: { id: number; name: string; quantity: number; price: number }[];\n  } | null = {\n    id: 1042,\n    status: 'shipped',\n    items: [\n      { id: 1, name: 'Laptop', quantity: 1, price: 999 },\n      { id: 2, name: 'Mouse', quantity: 2, price: 29 }\n    ]\n  };\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">@if / @for / @switch at a Glance</p><div class=\"grid grid-cols-1 md:grid-cols-3 gap-3 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-indigo-700 mb-1\">@if / @else if / @else</p><p class=\"text-slate-500\">conditional branches</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-emerald-700 mb-1\">@for ... track ... @empty</p><p class=\"text-slate-500\">list rendering, track mandatory</p></div><div class=\"bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-amber-700 mb-1\">@switch / @case / @default</p><p class=\"text-slate-500\">multi-branch logic</p></div></div></div>"
    },
    {
      "id": "safe-navigation-operator",
      "title": "Safe navigation operator (?.) and nullish coalescing (??)",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text"><code>?.</code> is politely knocking and asking "is anyone home?" before walking further into a house — if nobody answers, you turn around quietly instead of breaking down a door that isn't there. <code>??</code> is a fallback plan: "if there's truly no answer, use the backup key" — but it knows the difference between "nobody's home" and "the door was just left slightly open" (falsy-but-present values like <code>0</code>), so it only uses the backup when the house is genuinely empty.</p>
          </div>
        </div>
        <p>Template expressions often deal with data that arrives asynchronously — an API response that starts as <code>null</code> before loading, a user object that may not be logged in, a nested property that may not exist. Two operators handle this gracefully.</p>
        <h3>Safe Navigation Operator (?.)</h3>
        <p>The safe navigation operator short-circuits property access when the left side is <code>null</code> or <code>undefined</code>, returning <code>undefined</code> instead of throwing a <code>TypeError</code>. <code>{{ user?.address?.street }}</code> renders nothing if <code>user</code> is null, rather than crashing the template with "Cannot read property 'address' of null." This is particularly useful before async data has loaded — it keeps the template clean without wrapping everything in <code>@if</code>.</p>
        <h3>Nullish Coalescing (??)</h3>
        <p>The <code>??</code> operator returns the right side when the left side is <code>null</code> or <code>undefined</code>, but passes through <code>0</code>, <code>false</code>, and empty string — which the <code>||</code> operator would incorrectly treat as falsy. Use <code>??</code> for default values: <code>{{ score ?? 'Not yet rated' }}</code> shows 0 correctly while showing the default only for truly absent values.</p>
        <h3>Combining Both</h3>
        <p>The two operators combine naturally: <code>{{ user?.profile?.bio ?? 'No bio provided.' }}</code> reads the bio if the full path exists, and falls back to the default string if any part of the chain is null/undefined.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text"><code>{{ score || 'Not rated' }}</code> looks equivalent to <code>??</code> but is not — if <code>score</code> is legitimately <code>0</code>, <code>||</code> treats that falsy 0 as "missing" and shows "Not rated" instead of the real score. Always use <code>??</code> when 0, false, or empty string are valid values you want to display as-is.</p>
          </div>
        </div>
      `,
      "code": "@Component({\n  selector: 'app-user-profile',\n  imports: [DatePipe, AsyncPipe],\n  template: `\n    <!-- Safe navigation: renders nothing if user is null -->\n    <h1>{{ user?.displayName }}</h1>\n\n    <!-- Chain: renders nothing if user OR address OR city is null -->\n    <p>{{ user?.address?.city }}, {{ user?.address?.country }}</p>\n\n    <!-- Nullish coalescing: shows 0 score correctly (|| would fail here) -->\n    <p>Score: {{ user?.score ?? 'Not rated' }}</p>\n    <!--       if score is 0, shows '0' not 'Not rated' -->\n\n    <!-- Combined: full path + fallback -->\n    <p>Bio: {{ user?.profile?.bio ?? 'This user has not added a bio.' }}</p>\n\n    <!-- With pipe: safe access before piping -->\n    <p>Member since: {{ user?.createdAt | date:'mediumDate' }}</p>\n\n    <!-- Using async pipe: user$ starts as null, safe navigation prevents errors -->\n    @if (user$ | async; as user) {\n      <!-- Inside this block, 'user' is guaranteed non-null -->\n      <img [src]=\"user.avatarUrl\" [alt]=\"user.displayName + ' avatar'\" />\n    }\n  `\n})\nexport class UserProfileComponent {\n  // Before data loads, these are null — safe navigation prevents template errors\n  user: {\n    displayName: string;\n    score: number;\n    createdAt: Date;\n    address?: { city: string; country: string };\n    profile?: { bio?: string };\n    avatarUrl: string;\n  } | null = null;\n\n  user$ = inject(UserService).getCurrentUser();\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">?. vs ?? vs ||</p><div class=\"grid grid-cols-1 md:grid-cols-3 gap-3 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-indigo-700 mb-1\">?.</p><p class=\"text-slate-500\">stop walking if null/undefined</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-emerald-700 mb-1\">??</p><p class=\"text-slate-500\">fallback only for null/undefined</p></div><div class=\"bg-rose-50 border-2 border-rose-200 rounded-xl p-3 text-center\"><p class=\"font-bold text-rose-700 mb-1\">||</p><p class=\"text-slate-500\">fallback for ANY falsy value (0, '', false too)</p></div></div></div>"
    },
    {
      "id": "non-null-assertion-operator",
      "title": "Non-null assertion operator (!)",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Signing a waiver at a rock climbing gym. The staff (TypeScript) would normally stop you at the safety-check gate because you haven't clipped in yet, but the waiver (<code>!</code>) tells them "I promise this is safe, let me through." Nothing about the wall actually changed — you've just turned off a real safety check, and if you were wrong, you fall.</p>
          </div>
        </div>
        <p>The <strong>non-null assertion operator</strong> (<code>!</code>) is a TypeScript compiler instruction that tells the type checker: "I know this value is not null or undefined, even though you cannot prove it statically." It suppresses the TypeScript error but does not add any runtime check — if you are wrong, you will get a runtime <code>TypeError</code>.</p>
        <p>In Angular, the most common legitimate use is with <code>@ViewChild</code> and <code>@ContentChild</code> queries. TypeScript sees these properties as potentially <code>undefined</code> (before Angular sets them) and complains when you access them. Since you know Angular will have set them by <code>ngAfterViewInit</code>, the <code>!</code> tells the compiler to trust you.</p>
        <h3>Definite Assignment Assertion</h3>
        <p>The same operator is used on property declarations: <code>@Input() product!: Product</code>. This tells TypeScript "this property will be assigned before it is read." Without it, TypeScript would require you to either provide an initializer or make the type <code>Product | undefined</code>. With <code>!</code>, you assert the parent will always provide it — <code>input.required&lt;Product&gt;()</code> is the modern, compiler-enforced alternative that removes the need to assert anything at all.</p>
        <h3>Use Sparingly</h3>
        <p>Every <code>!</code> is a suppressed safety check. If the code around it changes (a <code>@ViewChild</code> element gets wrapped in an <code>@if</code> that makes it conditionally present), TypeScript can no longer warn you. Prefer optional chaining (<code>?.</code>) and null checks where possible. Use <code>!</code> only when you are certain, and when the certainty comes from Angular's lifecycle guarantees.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Wrapping a <code>@ViewChild</code>-targeted element in <code>@if</code> is a classic way to turn a working <code>!</code> assertion into a runtime crash — the element (and thus the query result) can now legitimately be undefined at times your code doesn't expect, but the <code>!</code> silenced the compiler warning that would have caught it.</p>
          </div>
        </div>
      `,
      "code": "import { Component, ViewChild, ElementRef, AfterViewInit, input } from '@angular/core';\n\n@Component({\n  selector: 'app-video-player',\n  template: `\n    <video #videoEl [src]=\"src()\" controls></video>\n    <button (click)=\"play()\">Play</button>\n    <button (click)=\"pause()\">Pause</button>\n  `\n})\nexport class VideoPlayerComponent implements AfterViewInit {\n  // Modern alternative to '!' — enforced by the compiler, no assertion needed\n  src = input.required<string>();\n\n  // @ViewChild: TypeScript would flag this as 'ElementRef | undefined',\n  // but we know it exists after ngAfterViewInit\n  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;\n\n  ngAfterViewInit(): void {\n    // Safe to access videoEl here — Angular has set it by this point\n    console.log('Video duration:', this.videoEl.nativeElement.duration);\n  }\n\n  play(): void {\n    this.videoEl.nativeElement.play();\n  }\n\n  pause(): void {\n    this.videoEl.nativeElement.pause();\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">! Assertion vs input.required()</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-rose-50 border-2 border-rose-200 rounded-xl p-3\"><p class=\"font-bold text-rose-700 text-center mb-2\">@Input() title!: string</p><p class=\"text-slate-600 text-center\">You silence the compiler; no enforcement at runtime</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">title = input.required&lt;string&gt;()</p><p class=\"text-slate-600 text-center\">Compiler enforces it's actually provided — no assertion needed</p></div></div></div>"
    },
    {
      "id": "ng-container-ng-template",
      "title": "ng-container and ng-template",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text"><code>ng-container</code> is invisible tape holding a group of items together for handling, without becoming part of the display itself — like a rubber band around a stack of papers that never shows up in the photocopy. <code>ng-template</code> is a stencil sitting in a drawer: it produces nothing on its own until someone actually presses it onto a surface.</p>
          </div>
        </div>
        <p><code>&lt;ng-container&gt;</code> and <code>&lt;ng-template&gt;</code> are Angular template elements that render no DOM output themselves — they are used as logical grouping or placeholder elements for Angular template features.</p>
        <h3>ng-container — Grouping Without a DOM Element</h3>
        <p><code>&lt;ng-container&gt;</code> is an invisible wrapper you use when you need to apply structural logic but do not want to add an extra DOM element. It lets you apply <code>@if</code> around multiple sibling elements, or wrap content that needs an <code>ngTemplateOutlet</code>, without introducing a wrapper <code>&lt;div&gt;</code> that might break your CSS layout.</p>
        <h3>ng-template — Defining Reusable Template Fragments</h3>
        <p><code>&lt;ng-template&gt;</code> defines a template fragment that is not rendered by default. It is only rendered when explicitly instantiated — by <code>ngTemplateOutlet</code>, by an <code>@else</code>/<code>@empty</code> block target, or by <code>ViewContainerRef.createEmbeddedView()</code>. It is the building block of reusable slots and custom structural directives. Template reference variables on <code>&lt;ng-template&gt;</code> give you a <code>TemplateRef</code> handle for programmatic rendering.</p>
      `,
      "code": "@Component({\n  selector: 'app-data-table',\n  imports: [NgTemplateOutlet],\n  template: `\n    <!-- Block syntax handles most *ngIf/*ngFor cases without ng-container now -->\n    @if (isLoaded) {\n      @for (row of rows; track row.id) {\n        <tr>\n          <td>\n            <!-- ng-container: apply ngTemplateOutlet without adding a wrapper element -->\n            <ng-container\n              *ngTemplateOutlet=\"rowTemplate || defaultCellTpl; context: { $implicit: row }\"\n            ></ng-container>\n          </td>\n        </tr>\n      }\n    } @else {\n      <p class=\"loading\">Loading data...</p>\n    }\n\n    <!-- ng-template: only rendered when referenced -->\n    <ng-template #defaultCellTpl let-row>\n      {{ row.name }} — {{ row.value }}\n    </ng-template>\n  `\n})\nexport class DataTableComponent {\n  rows = input<{ id: number; name: string; value: string }[]>([]);\n  rowTemplate = input<TemplateRef<any> | undefined>();\n  isLoaded = true;\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">ng-container vs ng-template</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3\"><p class=\"font-bold text-indigo-700 text-center mb-2\">ng-container</p><p class=\"text-slate-600 text-center\">Renders its content, adds NO extra DOM element itself</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">ng-template</p><p class=\"text-slate-600 text-center\">Renders NOTHING until explicitly instantiated</p></div></div></div>"
    },
    {
      "id": "template-statements",
      "title": "Template statements and $event",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A doorbell button versus a home automation hub. The button itself should only do one simple thing — ring a chime. If you find yourself wanting the button to also unlock the door, turn on the porch light, and text the owner, that logic belongs in the hub (a component method), not soldered directly onto the button.</p>
          </div>
        </div>
        <p><strong>Template statements</strong> are actions that respond to events in the template. They appear in event bindings: <code>(event)="statement"</code>. Unlike template expressions (which produce values), statements perform actions — calling a method, assigning a property, or a combination of both.</p>
        <h3>The $event Object</h3>
        <p>In any event binding, <code>$event</code> is a special template variable that holds the event payload. For native DOM events (<code>(click)</code>, <code>(keydown)</code>, <code>(input)</code>), <code>$event</code> is the native DOM event object. For custom <code>output()</code> events, <code>$event</code> is whatever value was passed to <code>.emit()</code>. Type-safe access requires casting: <code>($event as MouseEvent)</code> or <code>($event.target as HTMLInputElement).value</code>.</p>
        <h3>What Template Statements Can Do</h3>
        <p>Template statements support method calls, property assignments, and chaining with <code>;</code> (though chaining multiple statements is a code smell — move the logic to the component). They can use template reference variables, <code>$event</code>, local template variables, and component properties. They cannot use <code>new</code>, bitwise operators, or declare variables.</p>
        <h3>Keep Statements Thin</h3>
        <p>Template statements should delegate to component methods for anything beyond the simplest toggle. <code>(click)="isOpen = !isOpen"</code> is fine. <code>(click)="items = items.filter(i => i.id !== selectedId); selectedId = null; analytics.track('delete')"</code> belongs in a method.</p>
      `,
      "code": "@Component({\n  selector: 'app-search-form',\n  imports: [FormsModule],\n  template: `\n    <!-- Simple property assignment in template -->\n    <button (click)=\"isExpanded = !isExpanded\">Toggle</button>\n\n    <!-- Method call with $event -->\n    <input\n      type=\"text\"\n      [(ngModel)]=\"query\"\n      (keydown.enter)=\"search(query)\"\n      (input)=\"onInput($event)\"\n    />\n\n    <!-- Passing $event from a custom output -->\n    <app-tag-selector\n      (tagSelected)=\"handleTagSelect($event)\"\n    ></app-tag-selector>\n\n    <!-- Method call with template reference variable -->\n    <input #amountInput type=\"number\" />\n    <button (click)=\"setAmount(amountInput.value)\">Apply</button>\n\n    <!-- Keyboard event with key modifier shorthand -->\n    <div\n      tabindex=\"0\"\n      (keydown.escape)=\"closePanel()\"\n      (keydown.arrowdown)=\"focusNextItem()\"\n      (keydown.arrowup)=\"focusPrevItem()\"\n    >\n      @for (item of results; track item.value) {\n        <p (click)=\"selectResult(item)\" (mouseenter)=\"previewResult(item)\">\n          {{ item.label }}\n        </p>\n      }\n    </div>\n  `\n})\nexport class SearchFormComponent {\n  query = '';\n  isExpanded = false;\n  results: { label: string; value: string }[] = [];\n\n  search(q: string): void { /* ... fetch results ... */ }\n\n  onInput(event: Event): void {\n    const value = (event.target as HTMLInputElement).value;\n    if (!value.trim()) this.results = [];\n  }\n\n  handleTagSelect(tag: string): void {\n    this.query += ` tag:${tag}`;\n  }\n\n  setAmount(rawValue: string): void {\n    const amount = parseFloat(rawValue);\n    if (!isNaN(amount)) { /* apply */ }\n  }\n\n  selectResult(item: any): void { /* ... */ }\n  previewResult(item: any): void { /* ... */ }\n  closePanel(): void { this.isExpanded = false; }\n  focusNextItem(): void { /* ... */ }\n  focusPrevItem(): void { /* ... */ }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Thin Statement vs Fat Statement</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">Good: thin</p><p class=\"font-mono text-slate-600 text-center\">(click)=\"isOpen = !isOpen\"</p></div><div class=\"bg-rose-50 border-2 border-rose-200 rounded-xl p-3\"><p class=\"font-bold text-rose-700 text-center mb-2\">Bad: fat, chained</p><p class=\"font-mono text-slate-600 text-center text-[10px]\">(click)=\"items = items.filter(...); selectedId = null; track()\"</p></div></div></div>"
    }
  ]
});
