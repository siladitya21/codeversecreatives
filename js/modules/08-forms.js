window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: "forms",
  title: "Forms",
  icon: "bi bi-ui-checks-grid",
  questions: [
    {
      id: "angular-22-standard-forms-upgrade",
      title: "Angular 22 standard for forms",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Three ways to take notes. Template-driven forms are a <strong>napkin scribble</strong> &mdash; fast, fine for a phone number, gone the moment you need structure. Reactive forms are a <strong>form filled out in triplicate</strong> &mdash; explicit, auditable, built to survive scrutiny. Signal Forms are a <strong>live shared spreadsheet</strong> &mdash; every cell recalculates the instant you type, and as of Angular 22 that spreadsheet is no longer stamped "beta," it's on the production menu.</p>
          </div>
        </div>
        <p>Reactive forms stay the default for any form that matters &mdash; typed, testable, explicit about validation. Template-driven forms are still the right call for a 2&ndash;3 field form where reactive would be overkill. What changed in Angular 22 is Signal Forms: they graduated from experimental to <strong>stable</strong>, so they're now a legitimate third option rather than a "watch this space" curiosity.</p>
        <h3>Modern form checklist</h3>
        <ul>
          <li>Use typed <code>FormControl</code>, <code>FormGroup</code>, and <code>NonNullableFormBuilder</code> for reactive forms.</li>
          <li>Import <code>ReactiveFormsModule</code> directly in standalone components.</li>
          <li>Keep validation rules in TypeScript, not scattered across the template.</li>
          <li>Use <code>@if</code> blocks for validation messages instead of <code>*ngIf</code>.</li>
          <li>Use <code>takeUntilDestroyed()</code> for any manual <code>valueChanges</code> subscription.</li>
          <li>Reach for Signal Forms on new, signals-first features where a writable signal as the single source of truth fits the rest of the component.</li>
        </ul>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">"Stable" doesn't mean "mandatory." Reactive forms are not deprecated and are not going anywhere &mdash; a large existing codebase with a team fluent in <code>FormGroup</code> has no urgent reason to migrate. Reach for Signal Forms on new work where signals already run the rest of the component, not as a rewrite project.</p>
          </div>
        </div>
      `,
      code: "import { Component, inject } from '@angular/core';\nimport { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';\n\n@Component({\n  selector: 'app-profile-form',\n  imports: [ReactiveFormsModule],\n  template: `\n    <form [formGroup]=\"form\" (ngSubmit)=\"save()\">\n      <input formControlName=\"name\" />\n      @if (form.controls.name.invalid && form.controls.name.touched) {\n        <p>Name is required.</p>\n      }\n\n      <input formControlName=\"email\" />\n      @if (form.controls.email.hasError('email')) {\n        <p>Enter a valid email.</p>\n      }\n\n      <button type=\"submit\" [disabled]=\"form.invalid\">Save</button>\n    </form>\n  `\n})\nexport class ProfileFormComponent {\n  private readonly fb = inject(NonNullableFormBuilder);\n\n  readonly form = this.fb.group({\n    name: ['', Validators.required],\n    email: ['', [Validators.required, Validators.email]]\n  });\n\n  save(): void {\n    if (this.form.valid) {\n      console.log(this.form.getRawValue());\n    }\n  }\n}",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Three Ways to Build a Form</p><div class=\"grid grid-cols-1 md:grid-cols-3 gap-3 text-xs\"><div class=\"bg-slate-50 border border-slate-200 rounded-lg p-3\"><p class=\"font-bold text-slate-700 text-center mb-2\">Template-driven</p><p class=\"text-slate-500\">Logic lives in the HTML via <code>ngModel</code></p><p class=\"text-slate-500 mt-1\">Best for: 2&ndash;3 field forms</p></div><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-3\"><p class=\"font-bold text-indigo-700 text-center mb-2\">Reactive</p><p class=\"text-slate-500\">Model built in the class, template just binds</p><p class=\"text-slate-500 mt-1\">Best for: any non-trivial form</p></div><div class=\"bg-emerald-50 border-2 border-emerald-300 rounded-lg p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">Signal Forms</p><p class=\"text-slate-500\">Signal-backed model, stable in Angular 22</p><p class=\"text-slate-500 mt-1\">Best for: new signals-first features</p></div></div></div>"
    },
    {
      id: "types-of-forms",
      title: "Types of Forms in Angular",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>freehand doodle</strong> versus an <strong>architect's blueprint</strong>. A doodle (template-driven) is quick and gets the idea across, but if you want to reason about it precisely, run it past a structural review, or hand it to someone else to build from, you need the blueprint (reactive) &mdash; every measurement written down explicitly, nothing implied.</p>
          </div>
        </div>
        <p>Angular gives you <strong>two strategies</strong> for building forms, both riding on the same underlying forms engine. They differ in <em>where</em> the logic lives &mdash; and that single difference cascades into everything else: testability, scalability, and how much control you have.</p>
        <h3>Template-Driven Forms</h3>
        <p>You write most of the logic directly in the HTML template using directives like <code>ngModel</code>. Angular builds the form model behind the scenes, out of view.</p>
        <ul>
          <li>Quick to write, good for simple forms (a login form, a newsletter signup)</li>
          <li>Logic is scattered across the template &mdash; harder to unit test in isolation</li>
          <li>Requires importing <code>FormsModule</code></li>
        </ul>
        <h3>Reactive Forms</h3>
        <p>You build the form model explicitly in the <strong>component class</strong> using <code>FormGroup</code>, <code>FormControl</code>, and <code>FormArray</code>. The template becomes a thin binding layer over that model.</p>
        <ul>
          <li>Full control over validation and state</li>
          <li>Easy to unit test &mdash; the model is plain TypeScript, no DOM required</li>
          <li>Composes naturally with RxJS (<code>valueChanges</code> is a real Observable)</li>
          <li>The preferred approach for any non-trivial form</li>
          <li>Requires importing <code>ReactiveFormsModule</code></li>
        </ul>
        <h3>Which to use?</h3>
        <p>Use <strong>template-driven</strong> for quick, simple, 2&ndash;3 field forms. Use <strong>reactive</strong> for everything else &mdash; registration, checkout, multi-step wizards, dynamic field lists.</p>
      `,
      code: "// ─── Template-Driven ───────────────────────────────────────────\n// component.ts\nimport { FormsModule } from '@angular/forms';\n\n@Component({\n  selector: 'app-login',\n  imports: [FormsModule],\n  template: `\n    <form #loginForm=\"ngForm\" (ngSubmit)=\"onSubmit(loginForm)\">\n      <input name=\"email\" ngModel required email />\n      <input name=\"password\" ngModel required minlength=\"6\" type=\"password\" />\n      <button [disabled]=\"loginForm.invalid\">Login</button>\n    </form>\n  `\n})\nexport class LoginComponent {\n  onSubmit(form: any) { console.log(form.value); }\n}\n\n// ─── Reactive ───────────────────────────────────────────────────\n// component.ts\nimport { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';\n\n@Component({\n  selector: 'app-register',\n  imports: [ReactiveFormsModule],\n  template: `\n    <form [formGroup]=\"form\" (ngSubmit)=\"onSubmit()\">\n      <input formControlName=\"email\" />\n      <input formControlName=\"password\" type=\"password\" />\n      <button [disabled]=\"form.invalid\">Register</button>\n    </form>\n  `\n})\nexport class RegisterComponent {\n  form = new FormGroup({\n    email:    new FormControl('', [Validators.required, Validators.email]),\n    password: new FormControl('', [Validators.required, Validators.minLength(8)])\n  });\n\n  onSubmit() { console.log(this.form.value); }\n}",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Where the Logic Lives</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-slate-50 border border-slate-200 rounded-xl p-3\"><p class=\"font-bold text-slate-700 text-center mb-2\">Template-Driven</p><div class=\"bg-white border border-slate-200 rounded p-2 mb-1 text-center text-slate-500\">Component class &mdash; almost empty</div><div class=\"bg-amber-50 border border-amber-200 rounded p-2 text-center text-amber-700 font-semibold\">Template &mdash; ngModel, validators, structure all here</div></div><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3\"><p class=\"font-bold text-indigo-700 text-center mb-2\">Reactive</p><div class=\"bg-white border border-indigo-200 rounded p-2 mb-1 text-center text-indigo-700 font-semibold\">Component class &mdash; FormGroup, validators, state</div><div class=\"bg-white border border-slate-200 rounded p-2 text-center text-slate-500\">Template &mdash; just formControlName bindings</div></div></div></div>"
    },
    {
      id: "reactive-forms",
      title: "Reactive Forms (Most Important)",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">An architect's office. The <strong>component class</strong> is where the blueprint gets drawn &mdash; every room, every measurement, every load-bearing wall decided in one place. The <strong>template</strong> is the construction crew: they don't redesign anything, they just follow the plan and put a nail where the blueprint says to. Because the blueprint lives in one place, an inspector (a unit test) can review it without ever visiting the building site (the DOM).</p>
          </div>
        </div>
        <p>In <strong>reactive forms</strong>, you define the entire form structure in the component class. The template is just a binding layer &mdash; it connects HTML inputs to the model using directives. This separation is what makes the form easy to read, test, and extend as it grows.</p>
        <h3>Core building blocks</h3>
        <ul>
          <li><strong>FormControl</strong> &mdash; tracks the value and validation state of a single input</li>
          <li><strong>FormGroup</strong> &mdash; groups multiple controls; the whole group becomes valid only when every control inside it is valid</li>
          <li><strong>FormBuilder</strong> &mdash; a helper service with a shorter syntax for creating FormGroups and FormControls (no <code>new</code> keyword needed)</li>
        </ul>
        <h3>Template bindings</h3>
        <ul>
          <li><code>[formGroup]="form"</code> &mdash; connects the <code>&lt;form&gt;</code> element to the FormGroup</li>
          <li><code>formControlName="email"</code> &mdash; connects an <code>&lt;input&gt;</code> to a specific FormControl by name</li>
        </ul>
        <h3>Reading state</h3>
        <p>You can check any control's state at any time: <code>form.get('email')?.invalid</code>, <code>form.get('email')?.touched</code>, <code>form.value</code>, <code>form.valid</code>.</p>
      `,
      code: "import { Component, OnInit } from '@angular/core';\nimport { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';\nimport { CommonModule } from '@angular/common';\n\n@Component({\n  selector: 'app-register',\n  imports: [ReactiveFormsModule, CommonModule],\n  template: `\n    <form [formGroup]=\"form\" (ngSubmit)=\"onSubmit()\">\n\n      <input formControlName=\"email\" placeholder=\"Email\" />\n      <span *ngIf=\"email.invalid && email.touched\">\n        <span *ngIf=\"email.errors?.['required']\">Email is required.</span>\n        <span *ngIf=\"email.errors?.['email']\">Enter a valid email.</span>\n      </span>\n\n      <input formControlName=\"password\" type=\"password\" placeholder=\"Password\" />\n      <span *ngIf=\"password.invalid && password.touched\">\n        Password must be at least 8 characters.\n      </span>\n\n      <button type=\"submit\" [disabled]=\"form.invalid\">Create Account</button>\n\n    </form>\n  `\n})\nexport class RegisterComponent implements OnInit {\n  form!: FormGroup;\n\n  constructor(private fb: FormBuilder) {}\n\n  ngOnInit(): void {\n    this.form = this.fb.group({\n      email:    ['', [Validators.required, Validators.email]],\n      password: ['', [Validators.required, Validators.minLength(8)]]\n    });\n  }\n\n  // Convenience getters — cleaner than form.get('email') everywhere in the template\n  get email()    { return this.form.get('email')!; }\n  get password() { return this.form.get('password')!; }\n\n  onSubmit(): void {\n    if (this.form.valid) {\n      console.log('Submitting:', this.form.value);\n      // call your API service here\n    }\n  }\n}",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Reactive Form Anatomy</p><div class=\"flex flex-col items-center gap-2 text-xs font-mono\"><div class=\"bg-slate-800 text-white rounded-lg px-3 py-1.5\">FormGroup (form)</div><div class=\"w-px h-3 bg-slate-300\"></div><div class=\"flex gap-4\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5\">FormControl (email)</div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5\">FormControl (password)</div></div><div class=\"w-px h-3 bg-slate-300\"></div><div class=\"text-slate-500\">[formGroup]=\"form\" &rarr; formControlName=\"email\"</div></div></div>"
    },
    {
      id: "form-control-group-array",
      title: "FormControl vs FormGroup vs FormArray",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A filing system. A <strong>FormControl</strong> is a single index card &mdash; one fact, one state. A <strong>FormGroup</strong> is a labelled folder holding a fixed set of cards you know by name ("street," "city," "zip"). A <strong>FormArray</strong> is an accordion folder with no fixed number of dividers &mdash; you can slide a new card in or pull one out whenever the user clicks "Add another phone number," and you find things by position, not by name.</p>
          </div>
        </div>
        <p>These three classes are the building blocks of every reactive form. Understanding exactly what each one tracks is what makes complex, nested forms click.</p>
        <h3>FormControl — a single field</h3>
        <p>Tracks the value, validity, and interaction state (touched, dirty) of one input.</p>
        <h3>FormGroup — a named group of fields</h3>
        <p>Holds a fixed set of FormControls under named keys. The group itself is valid only when every child control is valid. Used for the main form and for sub-sections of a form (an "address" group inside a checkout form, for example).</p>
        <h3>FormArray — a dynamic list of fields</h3>
        <p>Holds a variable number of controls accessed by index, not by name. Perfect for "add another" patterns &mdash; multiple phone numbers, a list of work experiences on a CV, dynamic tags.</p>
        <h3>They can be nested</h3>
        <p>A FormGroup can contain other FormGroups and FormArrays, letting you model complex, deeply nested data structures with the same three building blocks all the way down.</p>
      `,
      code: "import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';\n\n// ─── FormControl — single field ────────────────────────────────\nconst emailControl = new FormControl('', [Validators.required, Validators.email]);\nconsole.log(emailControl.value);   // ''\nconsole.log(emailControl.valid);   // false (empty, required)\n\n// ─── FormGroup — fixed set of named fields ─────────────────────\nconst addressGroup = new FormGroup({\n  street: new FormControl('', Validators.required),\n  city:   new FormControl('', Validators.required),\n  zip:    new FormControl('', [Validators.required, Validators.pattern(/^\\d{5}$/)])\n});\nconsole.log(addressGroup.value);   // { street: '', city: '', zip: '' }\n\n// ─── FormArray — dynamic list of fields ───────────────────────\nconst fb = new FormBuilder();\n\nconst resumeForm = fb.group({\n  name:        ['', Validators.required],\n  // FormArray starts with one entry; more can be added at runtime\n  experiences: fb.array([\n    fb.group({\n      company:  ['Google', Validators.required],\n      role:     ['Engineer', Validators.required],\n      years:    [2, [Validators.required, Validators.min(0)]]\n    })\n  ])\n});\n\n// Access the FormArray\nconst experiences = resumeForm.get('experiences') as FormArray;\n\n// Add a new entry dynamically (e.g. user clicks \"Add Experience\")\nexperiences.push(fb.group({\n  company: ['', Validators.required],\n  role:    ['', Validators.required],\n  years:   [0]\n}));\n\n// Remove an entry by index\nexperiences.removeAt(1);\n\nconsole.log(experiences.length); // 1\nconsole.log(resumeForm.value);",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">FormControl &rarr; FormGroup &rarr; FormArray</p><div class=\"flex flex-col items-center gap-2 text-xs font-mono\"><div class=\"bg-slate-800 text-white rounded-lg px-3 py-1.5\">FormGroup (resumeForm)</div><div class=\"w-px h-3 bg-slate-300\"></div><div class=\"flex gap-4 items-start\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5\">FormControl (name)</div><div class=\"flex flex-col items-center gap-1\"><div class=\"bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5\">FormArray (experiences)</div><div class=\"flex gap-1 mt-1\"><div class=\"bg-emerald-50 border border-emerald-200 rounded px-2 py-1 text-[10px]\">group [0]</div><div class=\"bg-emerald-50 border border-emerald-200 rounded px-2 py-1 text-[10px]\">group [1]</div><div class=\"bg-slate-100 border border-dashed border-slate-300 rounded px-2 py-1 text-[10px] text-slate-400\">+ add</div></div></div></div></div></div>"
    },
    {
      id: "form-validation",
      title: "Form Validation (Real-World)",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A good bouncer doesn't yell "wrong outfit!" at someone standing across the street &mdash; they only speak up once you've actually walked up to the door. That's <code>touched</code>: Angular tracks whether the user has approached the field (focused and left it) before it's fair to flash a red error message. Judge people at the door, not from a distance.</p>
          </div>
        </div>
        <p>Angular's reactive forms provide granular access to a control's validity state. The key is showing errors <em>at the right time</em> so you don't ambush users with red text before they've had a chance to type anything.</p>
        <h3>The golden rule</h3>
        <p>Only show an error when the control is both <strong>invalid</strong> AND the user has <strong>touched</strong> it (clicked into and out of the field). This avoids showing errors on a fresh, empty form the instant it renders.</p>
        <h3>Control state flags</h3>
        <ul>
          <li><code>pristine</code> / <code>dirty</code> &mdash; has the value been changed?</li>
          <li><code>untouched</code> / <code>touched</code> &mdash; has the user focused and blurred the field?</li>
          <li><code>valid</code> / <code>invalid</code> &mdash; do all validators pass?</li>
          <li><code>pending</code> &mdash; an async validator is running</li>
        </ul>
        <h3>Custom validators</h3>
        <p>A validator is just a function: it receives the control and returns <code>null</code> if valid, or an error object if invalid. Cross-field validators (like "passwords must match") are placed on the FormGroup level, since they need to compare two sibling controls.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Cross-field validators like "passwords must match" belong on the <strong>FormGroup</strong>, not on either individual FormControl &mdash; a single control has no way to see its sibling's value. Putting the check on <code>confirmPassword</code> alone means it can never actually compare the two fields.</p>
          </div>
        </div>
      `,
      code: "import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup,\n         FormControl, Validators } from '@angular/forms';\n\n// ─── Custom validator: no whitespace allowed ───────────────────\nfunction noWhitespace(): ValidatorFn {\n  return (control: AbstractControl): ValidationErrors | null => {\n    const hasWhitespace = (control.value || '').trim().length === 0 && control.value.length > 0;\n    return hasWhitespace ? { whitespace: true } : null;\n  };\n}\n\n// ─── Cross-field validator: passwords must match ───────────────\nfunction passwordsMatch(group: AbstractControl): ValidationErrors | null {\n  const pw  = group.get('password')?.value;\n  const cpw = group.get('confirmPassword')?.value;\n  return pw === cpw ? null : { mismatch: true };\n}\n\n// ─── Form setup ────────────────────────────────────────────────\nconst signupForm = new FormGroup({\n  username:        new FormControl('', [Validators.required, noWhitespace()]),\n  password:        new FormControl('', [Validators.required, Validators.minLength(8)]),\n  confirmPassword: new FormControl('', Validators.required)\n}, { validators: passwordsMatch });   // ← group-level validator\n\n// ─── Template error display ────────────────────────────────────\n/*\n  <input formControlName=\"username\" />\n  <div *ngIf=\"signupForm.get('username')?.invalid && signupForm.get('username')?.touched\">\n    <span *ngIf=\"signupForm.get('username')?.errors?.['required']\">Username is required.</span>\n    <span *ngIf=\"signupForm.get('username')?.errors?.['whitespace']\">No whitespace allowed.</span>\n  </div>\n\n  <div *ngIf=\"signupForm.errors?.['mismatch'] && signupForm.get('confirmPassword')?.touched\">\n    Passwords do not match.\n  </div>\n*/",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">When Should an Error Show?</p><div class=\"grid grid-cols-2 gap-3 max-w-md mx-auto text-xs\"><div class=\"bg-rose-50 border-2 border-rose-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-rose-700\">invalid + untouched</p><p class=\"text-slate-500 mt-1\">Stay quiet &mdash; user hasn't gotten there yet</p></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-emerald-700\">invalid + touched</p><p class=\"text-slate-500 mt-1\">Show the error now</p></div></div><div class=\"flex justify-center mt-4\"><div class=\"bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 font-mono\">control.invalid && control.touched</div></div></div>"
    },
    {
      id: "validators",
      title: "Built-in Validators",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Airport security checkpoints. You don't get one guard who checks everything &mdash; you walk past a metal detector, then an ID checker, then a boarding-pass scanner, each one a specialist in exactly one thing. <code>Validators.required</code> is the "do you even have a bag" checkpoint; <code>Validators.pattern</code> is the "does this bag match the shape on file" checkpoint. Fail any one checkpoint and you don't board &mdash; the control is invalid.</p>
          </div>
        </div>
        <p>Angular's <code>Validators</code> class provides a set of ready-to-use validator functions. You pass them as an array to any <code>FormControl</code>, and each one runs independently against the current value.</p>
        <h3>List of built-in validators</h3>
        <ul>
          <li><code>Validators.required</code> &mdash; value must not be empty</li>
          <li><code>Validators.email</code> &mdash; value must be a valid email format</li>
          <li><code>Validators.minLength(n)</code> &mdash; string must have at least n characters</li>
          <li><code>Validators.maxLength(n)</code> &mdash; string must have at most n characters</li>
          <li><code>Validators.min(n)</code> &mdash; number must be &ge; n</li>
          <li><code>Validators.max(n)</code> &mdash; number must be &le; n</li>
          <li><code>Validators.pattern(regex)</code> &mdash; value must match the regex</li>
          <li><code>Validators.nullValidator</code> &mdash; always valid (useful as a placeholder)</li>
        </ul>
        <h3>Combining validators</h3>
        <p>Pass an array &mdash; all validators in the array must pass for the control to be valid. Angular also provides <code>Validators.compose()</code> if you need to combine them programmatically rather than as a literal array.</p>
        <h3>Checking which error triggered</h3>
        <p>Each validator adds its own key to <code>control.errors</code> when it fails. Check <code>control.errors?.['required']</code>, <code>control.errors?.['email']</code>, and so on, so the message matches the specific checkpoint that failed.</p>
      `,
      code: "import { FormControl, Validators } from '@angular/forms';\n\n// Multiple validators on one control\nconst phoneControl = new FormControl('', [\n  Validators.required,\n  Validators.pattern(/^\\+?[0-9]{10,15}$/)   // international phone format\n]);\n\nconst ageControl = new FormControl(null, [\n  Validators.required,\n  Validators.min(18),    // must be at least 18\n  Validators.max(120)\n]);\n\nconst usernameControl = new FormControl('', [\n  Validators.required,\n  Validators.minLength(3),\n  Validators.maxLength(20),\n  Validators.pattern(/^[a-z0-9_]+$/)   // lowercase, numbers, underscore only\n]);\n\n// Template: show different message for each error\n/*\n  <input formControlName=\"username\" />\n  <div *ngIf=\"username.invalid && username.touched\">\n    <p *ngIf=\"username.errors?.['required']\">Username is required.</p>\n    <p *ngIf=\"username.errors?.['minlength']\">\n      Minimum {{ username.errors?.['minlength'].requiredLength }} characters.\n    </p>\n    <p *ngIf=\"username.errors?.['maxlength']\">\n      Maximum {{ username.errors?.['maxlength'].requiredLength }} characters.\n    </p>\n    <p *ngIf=\"username.errors?.['pattern']\">\n      Only lowercase letters, numbers, and underscores.\n    </p>\n  </div>\n*/",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">One Value, Multiple Checkpoints</p><div class=\"flex items-center justify-center gap-2 flex-wrap text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg p-2 text-center font-semibold text-indigo-700\">value</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-slate-50 border border-slate-200 rounded-lg p-2 text-center\">required</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-slate-50 border border-slate-200 rounded-lg p-2 text-center\">minLength(3)</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-slate-50 border border-slate-200 rounded-lg p-2 text-center\">pattern(/.../)</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg p-2 text-center font-semibold text-emerald-700\">valid?</div></div></div>"
    },
    {
      id: "valuechanges",
      title: "valueChanges — reacting to form input in real time",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A live stock ticker feeding a trading desk. Raw ticks come in constantly &mdash; far too fast and noisy to act on every single one. So traders put filters between the raw feed and their decisions: wait for a pause (<code>debounceTime</code>), ignore repeated identical prices (<code>distinctUntilChanged</code>), and cancel any pending trade the moment newer information arrives (<code>switchMap</code>). <code>valueChanges</code> is that raw tick feed, and RxJS operators are the trading desk's filters.</p>
          </div>
        </div>
        <p><code>valueChanges</code> is an Observable available on every <code>FormControl</code>, <code>FormGroup</code>, or <code>FormArray</code>. It emits a new value every time the user changes the input &mdash; live, as they type.</p>
        <h3>Why is this powerful?</h3>
        <p>Because it's a proper RxJS Observable, you can apply any RxJS operator to it &mdash; <code>debounceTime</code> to wait before reacting, <code>distinctUntilChanged</code> to skip duplicate values, <code>switchMap</code> to trigger an API call and automatically cancel the previous one.</p>
        <h3>Common use cases</h3>
        <ul>
          <li><strong>Live search</strong> &mdash; search as the user types, debounced to avoid firing an API call on every keystroke</li>
          <li><strong>Auto-save</strong> &mdash; save a draft every time the form changes</li>
          <li><strong>Dynamic validation</strong> &mdash; enable or disable other fields based on a field's value</li>
          <li><strong>Form state tracking</strong> &mdash; watch the whole form's value change at once</li>
        </ul>
        <h3>Always clean up</h3>
        <p>Like any subscription, clean up in <code>ngOnDestroy</code> or use <code>takeUntilDestroyed()</code>, which does it for you automatically when the component is destroyed.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">A manual <code>.subscribe()</code> on <code>valueChanges</code> that's never torn down keeps running after the component is destroyed &mdash; a classic memory leak, and in a search box it also means stray API calls firing for a screen the user already left. Use <code>takeUntilDestroyed()</code> (or the async pipe where it fits) instead of a bare subscription.</p>
          </div>
        </div>
      `,
      code: "import { Component, OnInit, OnDestroy } from '@angular/core';\nimport { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';\nimport { Subject } from 'rxjs';\nimport { debounceTime, distinctUntilChanged, switchMap, takeUntil, filter } from 'rxjs/operators';\nimport { SearchService } from './search.service';\n\n@Component({\n  selector: 'app-search',\n  imports: [ReactiveFormsModule],\n  template: `\n    <input [formControl]=\"searchCtrl\" placeholder=\"Search products...\" />\n    <ul>\n      <li *ngFor=\"let result of results\">{{ result.name }}</li>\n    </ul>\n  `\n})\nexport class SearchComponent implements OnInit, OnDestroy {\n  searchCtrl = new FormControl('');\n  results: any[] = [];\n  private destroy$ = new Subject<void>();\n\n  constructor(private searchService: SearchService) {}\n\n  ngOnInit(): void {\n    this.searchCtrl.valueChanges.pipe(\n      debounceTime(400),             // wait 400ms after the user stops typing\n      distinctUntilChanged(),        // skip if value is the same as before\n      filter(term => (term ?? '').length >= 2),  // only search for 2+ characters\n      switchMap(term =>\n        this.searchService.search(term ?? '')    // cancel previous call, start new one\n      ),\n      takeUntil(this.destroy$)       // auto-unsubscribe on destroy\n    ).subscribe(results => {\n      this.results = results;\n    });\n\n    // You can also watch an entire FormGroup at once\n    // this.form.valueChanges.subscribe(value => {\n    //   console.log('Whole form changed:', value);\n    // });\n  }\n\n  ngOnDestroy(): void {\n    this.destroy$.next();\n    this.destroy$.complete();\n  }\n}",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">valueChanges Pipeline</p><div class=\"flex items-center gap-2 flex-wrap justify-center text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg p-2 text-center font-semibold text-indigo-700\">keystroke</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-slate-50 border border-slate-200 rounded-lg p-2 text-center\">debounceTime(400)</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-slate-50 border border-slate-200 rounded-lg p-2 text-center\">distinctUntilChanged()</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-2 text-center\">switchMap &rarr; API</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg p-2 text-center font-semibold text-emerald-700\">results</div></div></div>"
    },
    {
      id: "signal-forms-angular-21",
      title: "Signal Forms (stable in Angular 22)",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A spreadsheet where every formula recalculates the instant a source cell changes &mdash; no manual "refresh," no separate notification step. The form's data is a <code>signal()</code>; the field tree Angular builds from it is like a set of formula cells that always reflect the current model. Change the model, and every field, every validity check, every derived value updates itself.</p>
          </div>
        </div>
        <p><strong>Signal Forms</strong> (<code>@angular/forms/signals</code>) are Angular's signals-native forms API, and as of Angular 22 they've graduated from experimental to <strong>stable</strong> &mdash; no more warning banners, safe to ship in production. They use a writable signal as the single source of truth and build a type-safe field tree with <code>form()</code>, which fits the signals-first, zoneless direction the rest of the framework has taken.</p>
        <h3>When to use it</h3>
        <p>Signal Forms are a strong fit for new, signals-first features where the rest of the component already leans on <code>signal()</code> and <code>computed()</code>. Typed reactive forms remain fully supported and are still a completely reasonable default, especially in large existing codebases where a team is already fluent in <code>FormGroup</code>.</p>
        <h3>Core pieces</h3>
        <ul>
          <li><code>signal()</code> holds the form data model</li>
          <li><code>form(model)</code> creates fields that mirror the model shape</li>
          <li><code>FormField</code> binds fields to native inputs</li>
          <li>schema rules like <code>required()</code> and <code>email()</code> centralize validation</li>
        </ul>
      `,
      code: "import { Component, signal } from '@angular/core';\nimport { form, FormField, required, email, minLength } from '@angular/forms/signals';\n\ninterface LoginForm {\n  email: string;\n  password: string;\n}\n\n@Component({\n  selector: 'app-login',\n  imports: [FormField],\n  template: `\n    <form>\n      <label>\n        Email\n        <input type=\"email\" [formField]=\"loginForm.email\" />\n      </label>\n\n      <label>\n        Password\n        <input type=\"password\" [formField]=\"loginForm.password\" />\n      </label>\n\n      @if (loginForm.email().invalid()) {\n        <p>Email is required and must be valid.</p>\n      }\n    </form>\n  `\n})\nexport class LoginComponent {\n  loginModel = signal<LoginForm>({ email: '', password: '' });\n\n  loginForm = form(this.loginModel, path => {\n    required(path.email);\n    email(path.email);\n    required(path.password);\n    minLength(path.password, 8);\n  });\n}",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Signal Forms Data Flow</p><div class=\"flex flex-col items-center gap-2 text-xs font-mono\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-1.5 font-semibold text-indigo-700\">signal(&#123; email, password &#125;)</div><div class=\"text-slate-300\">&darr; form(model, schema)</div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-1.5 font-semibold text-emerald-700\">field tree: loginForm.email / loginForm.password</div><div class=\"text-slate-300\">&darr; [formField]</div><div class=\"bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5\">&lt;input&gt; stays in sync automatically</div></div></div>"
    },
    {
      id: "control-value-accessor",
      title: "ControlValueAccessor - custom form controls",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A universal travel plug adapter. Your custom rating widget, date picker, or rich select has its own weird "plug shape" &mdash; its own internal state and events. <code>formControlName</code> only knows how to talk to the standard Angular "socket." <strong>ControlValueAccessor</strong> is the adapter you build once so any custom device can plug into that socket and just work &mdash; validation, touched state, disabled state, all of it, no special-casing required by whoever wires up the form.</p>
          </div>
        </div>
        <p><strong>ControlValueAccessor</strong> (CVA) is the bridge between Angular forms and a custom UI component. If you build a custom date picker, rating control, rich select, file picker, or design-system input, CVA lets it work with <code>formControlName</code>, validation, touched/dirty state, and disabled state exactly like a native <code>&lt;input&gt;</code> would.</p>
        <h3>What a CVA must implement</h3>
        <ul>
          <li><code>writeValue(value)</code> &mdash; Angular writes a form value into your component</li>
          <li><code>registerOnChange(fn)</code> &mdash; your component calls this when the user changes the value</li>
          <li><code>registerOnTouched(fn)</code> &mdash; your component calls this on blur/touch</li>
          <li><code>setDisabledState(disabled)</code> &mdash; Angular enables/disables your UI</li>
        </ul>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Forgetting the <code>NG_VALUE_ACCESSOR</code> provider (or implementing <code>setDisabledState</code> as a no-op) is the classic mistake &mdash; without it Angular has no idea your component is a form control at all, so <code>formControlName</code> silently fails to sync, or a disabled form leaves your custom widget clickable.</p>
          </div>
        </div>
      `,
      code: "import { Component, forwardRef } from '@angular/core';\nimport { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';\n\n@Component({\n  selector: 'app-rating-input',\n  providers: [{\n    provide: NG_VALUE_ACCESSOR,\n    useExisting: forwardRef(() => RatingInputComponent),\n    multi: true\n  }],\n  template: `\n    @for (star of [1, 2, 3, 4, 5]; track star) {\n      <button type=\"button\" [disabled]=\"disabled\" (click)=\"select(star)\">\n        {{ star <= value ? '★' : '☆' }}\n      </button>\n    }\n  `\n})\nexport class RatingInputComponent implements ControlValueAccessor {\n  value = 0;\n  disabled = false;\n\n  private onChange = (value: number) => {};\n  private onTouched = () => {};\n\n  writeValue(value: number | null): void {\n    this.value = value ?? 0;\n  }\n\n  registerOnChange(fn: (value: number) => void): void {\n    this.onChange = fn;\n  }\n\n  registerOnTouched(fn: () => void): void {\n    this.onTouched = fn;\n  }\n\n  setDisabledState(disabled: boolean): void {\n    this.disabled = disabled;\n  }\n\n  select(value: number): void {\n    this.value = value;\n    this.onChange(value);\n    this.onTouched();\n  }\n}\n\n// Usage: <app-rating-input formControlName=\"rating\" />",
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">The CVA Adapter</p><div class=\"flex items-center justify-center gap-3 flex-wrap text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-indigo-700\">Angular Forms</p><p class=\"text-slate-500 mt-1\">formControlName</p></div><div class=\"flex flex-col items-center text-slate-400 font-mono text-[10px]\"><span>writeValue()</span><span>&harr;</span><span>registerOnChange()</span></div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg p-3 text-center\"><p class=\"font-bold text-emerald-700\">Custom Component</p><p class=\"text-slate-500 mt-1\">RatingInputComponent</p></div></div></div>"
    }
  ]
});
