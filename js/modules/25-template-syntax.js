window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "template-syntax",
  "title": "Template Syntax",
  "icon": "bi bi-code-slash",
  "questions": [
    {
      "id": "template-expression-operators",
      "title": "Template expression operators",
      "explanation": `
          <p><strong>Template expressions</strong> are the pieces of code you put inside the double curly braces <code>{{ }}</code> or in property bindings <code>[property]="expression"</code>. Angular executes these expressions to produce a value that is then rendered or used.</p>
          <h3>Common Operators</h3>
          <ul>
            <li><strong>Arithmetic:</strong> <code>{{ a + b }}</code>, <code>{{ price * quantity }}</code></li>
            <li><strong>Logical:</strong> <code>{{ isActive && isValid }}</code>, <code>{{ !isLoggedIn }}</code></li>
            <li><strong>Ternary:</strong> <code>{{ isLoggedIn ? 'Logout' : 'Login' }}</code></li>
            <li><strong>Pipe:</strong> <code>{{ date | date:'short' }}</code></li>
            <li><strong>Property access:</strong> <code>{{ user.name }}</code></li>
            <li><strong>Method calls:</strong> <code>{{ getGreeting() }}</code></li>
          </ul>
          <p><strong>Limitations:</strong> You cannot use assignment operators (<code>=</code>, <code>+=</code>), <code>new</code>, <code>typeof</code>, <code>instanceof</code>, or operators like <code>++</code>, <code>--</code>. Also, direct access to global objects like <code>window</code> or <code>document</code> is not allowed.</p>
        `,
      "code": "<!-- Interpolation -->\n<p>Total: {{ price * quantity | currency }}</p>\n<p>Status: {{ user.isActive ? 'Active' : 'Inactive' }}</p>\n\n<!-- Property Binding -->\n<button [disabled]=\"!formValid\">Submit</button>",
      "language": "html",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Expression Flow</p><div class="flex items-center justify-center gap-4"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-indigo-700">Component Property</p></div><div class="text-slate-300">&rarr;</div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-emerald-700">Template Expression</p></div><div class="text-slate-300">&rarr;</div><div class="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-amber-700">Rendered Value</p></div></div></div>`
    },
    {
      "id": "safe-navigation-operator",
      "title": "Safe navigation operator (?.)",
      "explanation": `
          <p>The <strong>safe navigation operator (<code>?.</code>)</strong> helps prevent runtime errors when trying to access properties of an object that might be <code>null</code> or <code>undefined</code>.</p>
          <p>Instead of throwing a <code>TypeError</code>, the expression simply returns <code>undefined</code> if any part of the path is <code>null</code> or <code>undefined</code>.</p>
        `,
      "code": "// Component:\nuser: { name: string, address?: { street: string } } | null = null;\n\n// Template (without safe navigation - potential error):\n// <p>{{ user.address.street }}</p> // Error if user or user.address is null\n\n// Template (with safe navigation):\n<p>{{ user?.address?.street }}</p> // Renders nothing if user or address is null",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><div class="max-w-md mx-auto bg-amber-50 border border-amber-200 rounded-xl p-4 text-center"><p class="text-xs font-bold text-amber-700">user?.address?.street</p><p class="text-[10px] text-slate-500 mt-2">Prevents 'Cannot read property of undefined' errors.</p></div></div>`
    },
    {
      "id": "non-null-assertion-operator",
      "title": "Non-null assertion operator (!)",
      "explanation": `
          <p>The <strong>non-null assertion operator (<code>!</code>)</strong> tells the TypeScript compiler that a value is definitely not <code>null</code> or <code>undefined</code>, even if TypeScript's static analysis can't prove it.</p>
          <p>It's a way to bypass TypeScript's strict null checks when you, as the developer, are certain about the value's presence at runtime. <strong>Use with caution</strong>, as incorrect usage can lead to runtime errors.</p>
        `,
      "code": "// Component:\n@ViewChild('myInput') myInput!: ElementRef<HTMLInputElement>;\n\nngAfterViewInit() {\n  // TypeScript would normally complain that myInput might be undefined.\n  // The '!' tells it we are sure it will be there after view init.\n  this.myInput.nativeElement.focus();\n}\n\n// Another example:\nfunction processValue(value: string | undefined) {\n  // If you are certain 'value' is defined here:\n  const length = value!.length; // '!' asserts value is not undefined\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><div class="max-w-md mx-auto bg-rose-50 border border-rose-200 rounded-xl p-4 text-center"><p class="text-xs font-bold text-rose-700">myInput!.nativeElement.focus()</p><p class="text-[10px] text-slate-500 mt-2">Tells TypeScript: "Trust me, this won't be null/undefined."</p></div></div>`
    },
    {
      "id": "template-statements",
      "title": "Template statements",
      "explanation": `
          <p><strong>Template statements</strong> are actions that respond to events triggered by the user (e.g., clicks, input changes) or by Angular itself. They appear in event bindings like <code>(event)="statement()"</code>.</p>
          <p>Unlike expressions, statements perform an action rather than producing a value. They can call component methods, assign values to properties, or use the <code>$event</code> object.</p>
        `,
      "code": "// Component:\ncount = 0;\nmessage = '';\n\nincrement() {\n  this.count++;\n}\n\nonInput(event: Event) {\n  this.message = (event.target as HTMLInputElement).value;\n}\n\n// Template:\n<button (click)=\"increment()\">Increment</button>\n<input (input)=\"onInput($event)\" />\n<button (click)=\"message = 'Reset!'\">Reset Message</button>",
      "language": "html",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Statement Flow</p><div class="flex items-center justify-center gap-4"><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-emerald-700">DOM Event</p></div><div class="text-slate-300">&rarr;</div><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-indigo-700">Template Statement</p></div><div class="text-slate-300">&rarr;</div><div class="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-amber-700">Component Action</p></div></div></div>`
    },
    {
      "id": "expression-context",
      "title": "Expression context",
      "explanation": `
          <p>The <strong>expression context</strong> refers to the scope in which Angular evaluates template expressions and statements. This context is primarily the component instance associated with the template.</p>
          <p>This means you can directly access properties and methods of the component class. Additionally, structural directives like <code>*ngFor</code> introduce their own local context variables (e.g., <code>let item</code>, <code>index as i</code>).</p>
          <p><strong>Important:</strong> You cannot directly reference global JavaScript objects like <code>window</code>, <code>document</code>, or <code>console</code> from within template expressions or statements for security and separation of concerns. If you need to interact with them, do so within your component's TypeScript code.</p>
        `,
      "code": "// Component:\nuserName = 'Alice';\nitems = ['Apple', 'Banana'];\n\nlogMessage(msg: string) {\n  console.log(msg);\n}\n\n// Template:\n<p>{{ userName }}</p> <!-- Accesses component property -->\n\n<li *ngFor=\"let item of items; index as i\">\n  {{ i + 1 }}: {{ item }}\n</li> <!-- Accesses local context variables -->\n\n<button (click)=\"logMessage('Button clicked!')\">Log</button> <!-- Calls component method -->",
      "language": "html",
      "diagram": `<div class="diagram-wrap"><div class="max-w-md mx-auto bg-slate-800 text-white rounded-lg p-3 text-[10px] font-mono"><p class=\"text-indigo-400\">// Template Context</p>&lt;p&gt;{{ <span class=\"text-emerald-400\">componentProperty</span> }}&lt;/p&gt;<br/>&lt;li *ngFor=\"let <span class=\"text-emerald-400\">item</span> of items\"&gt;...&lt;/li&gt;</div></div>`
    }
  ]
});