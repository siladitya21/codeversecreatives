window.MODULES = window.MODULES || [];
window.MODULES.push({
  id: "forms",
  title: "Forms",
  icon: "bi bi-ui-checks-grid",
  questions: [
    {
      id: "types-of-forms",
      title: "Types of Forms in Angular",
      explanation: `
        <p>Angular gives you <strong>two strategies</strong> for building forms. Both use the same underlying Angular forms API, but they differ in <em>where</em> the logic lives.</p>

        <h3>Template-Driven Forms</h3>
        <p>You write most of the logic directly in the HTML template using directives like <code>ngModel</code>. Angular creates the form model behind the scenes.</p>
        <ul>
          <li>Quick to write, good for simple forms (e.g. a login form, a newsletter signup)</li>
          <li>Logic scattered in the template — harder to unit test</li>
          <li>Requires importing <code>FormsModule</code></li>
        </ul>

        <h3>Reactive Forms</h3>
        <p>You build the form model explicitly in the <strong>component class</strong> using <code>FormGroup</code>, <code>FormControl</code>, and <code>FormArray</code>. The template then just binds to that model.</p>
        <ul>
          <li>Full control over validation and state</li>
          <li>Easy to unit test — the model is plain TypeScript</li>
          <li>Works naturally with RxJS (e.g. <code>valueChanges</code>)</li>
          <li>The preferred approach for any non-trivial form</li>
          <li>Requires importing <code>ReactiveFormsModule</code></li>
        </ul>

        <h3>Which to use?</h3>
        <p>Use <strong>template-driven</strong> for quick, simple, 2–3 field forms. Use <strong>reactive</strong> for everything else — registration, checkout, multi-step wizards, dynamic field lists.</p>
      `,
      code: `// ─── Template-Driven ───────────────────────────────────────────
// component.ts
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: \`
    <form #loginForm="ngForm" (ngSubmit)="onSubmit(loginForm)">
      <input name="email" ngModel required email />
      <input name="password" ngModel required minlength="6" type="password" />
      <button [disabled]="loginForm.invalid">Login</button>
    </form>
  \`
})
export class LoginComponent {
  onSubmit(form: any) { console.log(form.value); }
}

// ─── Reactive ───────────────────────────────────────────────────
// component.ts
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="email" />
      <input formControlName="password" type="password" />
      <button [disabled]="form.invalid">Register</button>
    </form>
  \`
})
export class RegisterComponent {
  form = new FormGroup({
    email:    new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  onSubmit() { console.log(this.form.value); }
}`,
      language: "typescript"
    },

    {
      id: "reactive-forms",
      title: "Reactive Forms (Most Important)",
      explanation: `
        <p>In <strong>reactive forms</strong>, you define the entire form structure in the component class. The template is just a binding layer — it connects HTML inputs to the model using directives. This separation makes the form easy to read, test, and extend.</p>

        <h3>Core building blocks</h3>
        <ul>
          <li><strong>FormControl</strong> — tracks the value and validation state of a single input</li>
          <li><strong>FormGroup</strong> — groups multiple controls; the whole group becomes valid only when all controls inside are valid</li>
          <li><strong>FormBuilder</strong> — a helper service with a shorter syntax for creating FormGroups and FormControls (no <code>new</code> keyword needed)</li>
        </ul>

        <h3>Template bindings</h3>
        <ul>
          <li><code>[formGroup]="form"</code> — connects the <code>&lt;form&gt;</code> element to the FormGroup</li>
          <li><code>formControlName="email"</code> — connects an <code>&lt;input&gt;</code> to a specific FormControl by name</li>
        </ul>

        <h3>Reading state</h3>
        <p>You can check any control's state at any time: <code>form.get('email')?.invalid</code>, <code>form.get('email')?.touched</code>, <code>form.value</code>, <code>form.valid</code>.</p>
      `,
      code: `import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="onSubmit()">

      <input formControlName="email" placeholder="Email" />
      <span *ngIf="email.invalid && email.touched">
        <span *ngIf="email.errors?.['required']">Email is required.</span>
        <span *ngIf="email.errors?.['email']">Enter a valid email.</span>
      </span>

      <input formControlName="password" type="password" placeholder="Password" />
      <span *ngIf="password.invalid && password.touched">
        Password must be at least 8 characters.
      </span>

      <button type="submit" [disabled]="form.invalid">Create Account</button>

    </form>
  \`
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  // Convenience getters — cleaner than form.get('email') everywhere in the template
  get email()    { return this.form.get('email')!; }
  get password() { return this.form.get('password')!; }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Submitting:', this.form.value);
      // call your API service here
    }
  }
}`,
      language: "typescript"
    },

    {
      id: "form-control-group-array",
      title: "FormControl vs FormGroup vs FormArray",
      explanation: `
        <p>These three classes are the building blocks of every reactive form. Understanding what each one does is essential.</p>

        <h3>FormControl — a single field</h3>
        <p>Tracks the value, validity, and interaction state (touched, dirty) of one input. Think of it as a single cell in a spreadsheet.</p>

        <h3>FormGroup — a named group of fields</h3>
        <p>Holds a fixed set of FormControls under named keys. The group itself is valid only when every child control is valid. Used for the main form and for sub-sections of a form (e.g. an "address" group inside a checkout form).</p>

        <h3>FormArray — a dynamic list of fields</h3>
        <p>Holds a variable number of controls accessed by index (not by name). Perfect for "add another" patterns — e.g. multiple phone numbers, a list of work experiences on a CV, dynamic tags.</p>

        <h3>They can be nested</h3>
        <p>A FormGroup can contain other FormGroups and FormArrays, letting you model complex, deeply nested data structures.</p>
      `,
      code: `import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';

// ─── FormControl — single field ────────────────────────────────
const emailControl = new FormControl('', [Validators.required, Validators.email]);
console.log(emailControl.value);   // ''
console.log(emailControl.valid);   // false (empty, required)

// ─── FormGroup — fixed set of named fields ─────────────────────
const addressGroup = new FormGroup({
  street: new FormControl('', Validators.required),
  city:   new FormControl('', Validators.required),
  zip:    new FormControl('', [Validators.required, Validators.pattern(/^\\d{5}$/)])
});
console.log(addressGroup.value);   // { street: '', city: '', zip: '' }

// ─── FormArray — dynamic list of fields ───────────────────────
const fb = new FormBuilder();

const resumeForm = fb.group({
  name:        ['', Validators.required],
  // FormArray starts with one entry; more can be added at runtime
  experiences: fb.array([
    fb.group({
      company:  ['Google', Validators.required],
      role:     ['Engineer', Validators.required],
      years:    [2, [Validators.required, Validators.min(0)]]
    })
  ])
});

// Access the FormArray
const experiences = resumeForm.get('experiences') as FormArray;

// Add a new entry dynamically (e.g. user clicks "Add Experience")
experiences.push(fb.group({
  company: ['', Validators.required],
  role:    ['', Validators.required],
  years:   [0]
}));

// Remove an entry by index
experiences.removeAt(1);

console.log(experiences.length); // 1
console.log(resumeForm.value);`,
      language: "typescript"
    },

    {
      id: "form-validation",
      title: "Form Validation (Real-World)",
      explanation: `
        <p>Angular's reactive forms provide granular access to a control's validity state. The key is showing errors <em>at the right time</em> so you don't annoy users with red error messages before they've had a chance to type anything.</p>

        <h3>The golden rule</h3>
        <p>Only show an error when the control is both <strong>invalid</strong> AND the user has <strong>touched</strong> it (clicked into and out of the field). This avoids showing errors on a fresh, empty form.</p>

        <h3>Control state flags</h3>
        <ul>
          <li><code>pristine</code> / <code>dirty</code> — has the value been changed?</li>
          <li><code>untouched</code> / <code>touched</code> — has the user focused and blurred the field?</li>
          <li><code>valid</code> / <code>invalid</code> — do all validators pass?</li>
          <li><code>pending</code> — an async validator is running</li>
        </ul>

        <h3>Custom validators</h3>
        <p>A validator is just a function: it receives the control and returns <code>null</code> if valid, or an error object if invalid. Cross-field validators (e.g. "passwords must match") are placed on the FormGroup level.</p>
      `,
      code: `import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup,
         FormControl, Validators } from '@angular/forms';

// ─── Custom validator: no whitespace allowed ───────────────────
function noWhitespace(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasWhitespace = (control.value || '').trim().length === 0 && control.value.length > 0;
    return hasWhitespace ? { whitespace: true } : null;
  };
}

// ─── Cross-field validator: passwords must match ───────────────
function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const pw  = group.get('password')?.value;
  const cpw = group.get('confirmPassword')?.value;
  return pw === cpw ? null : { mismatch: true };
}

// ─── Form setup ────────────────────────────────────────────────
const signupForm = new FormGroup({
  username:        new FormControl('', [Validators.required, noWhitespace()]),
  password:        new FormControl('', [Validators.required, Validators.minLength(8)]),
  confirmPassword: new FormControl('', Validators.required)
}, { validators: passwordsMatch });   // ← group-level validator

// ─── Template error display ────────────────────────────────────
/*
  <input formControlName="username" />
  <div *ngIf="signupForm.get('username')?.invalid && signupForm.get('username')?.touched">
    <span *ngIf="signupForm.get('username')?.errors?.['required']">Username is required.</span>
    <span *ngIf="signupForm.get('username')?.errors?.['whitespace']">No whitespace allowed.</span>
  </div>

  <div *ngIf="signupForm.errors?.['mismatch'] && signupForm.get('confirmPassword')?.touched">
    Passwords do not match.
  </div>
*/`,
      language: "typescript"
    },

    {
      id: "validators",
      title: "Built-in Validators",
      explanation: `
        <p>Angular's <code>Validators</code> class provides a set of ready-to-use validator functions. You pass them as an array to any <code>FormControl</code>.</p>

        <h3>List of built-in validators</h3>
        <ul>
          <li><code>Validators.required</code> — value must not be empty</li>
          <li><code>Validators.email</code> — value must be a valid email format</li>
          <li><code>Validators.minLength(n)</code> — string must have at least n characters</li>
          <li><code>Validators.maxLength(n)</code> — string must have at most n characters</li>
          <li><code>Validators.min(n)</code> — number must be ≥ n</li>
          <li><code>Validators.max(n)</code> — number must be ≤ n</li>
          <li><code>Validators.pattern(regex)</code> — value must match the regex</li>
          <li><code>Validators.nullValidator</code> — always valid (useful as a placeholder)</li>
        </ul>

        <h3>Combining validators</h3>
        <p>Pass an array — all validators in the array must pass for the control to be valid. Angular also provides <code>Validators.compose()</code> if you need to combine them programmatically.</p>

        <h3>Checking which error triggered</h3>
        <p>Each validator adds a key to <code>control.errors</code> when it fails. Check <code>control.errors?.['required']</code>, <code>control.errors?.['email']</code>, etc. to show the right message.</p>
      `,
      code: `import { FormControl, Validators } from '@angular/forms';

// Multiple validators on one control
const phoneControl = new FormControl('', [
  Validators.required,
  Validators.pattern(/^\\+?[0-9]{10,15}$/)   // international phone format
]);

const ageControl = new FormControl(null, [
  Validators.required,
  Validators.min(18),    // must be at least 18
  Validators.max(120)
]);

const usernameControl = new FormControl('', [
  Validators.required,
  Validators.minLength(3),
  Validators.maxLength(20),
  Validators.pattern(/^[a-z0-9_]+$/)   // lowercase, numbers, underscore only
]);

// Template: show different message for each error
/*
  <input formControlName="username" />
  <div *ngIf="username.invalid && username.touched">
    <p *ngIf="username.errors?.['required']">Username is required.</p>
    <p *ngIf="username.errors?.['minlength']">
      Minimum {{ username.errors?.['minlength'].requiredLength }} characters.
    </p>
    <p *ngIf="username.errors?.['maxlength']">
      Maximum {{ username.errors?.['maxlength'].requiredLength }} characters.
    </p>
    <p *ngIf="username.errors?.['pattern']">
      Only lowercase letters, numbers, and underscores.
    </p>
  </div>
*/`,
      language: "typescript"
    },

    {
      id: "valuechanges",
      title: "valueChanges — reacting to form input in real time",
      explanation: `
        <p><code>valueChanges</code> is an Observable available on every <code>FormControl</code>, <code>FormGroup</code>, or <code>FormArray</code>. It emits a new value every time the user changes the input.</p>

        <h3>Why is this powerful?</h3>
        <p>Because it's a proper RxJS Observable, you can apply any RxJS operator to it — <code>debounceTime</code> to wait before reacting, <code>distinctUntilChanged</code> to skip duplicate values, <code>switchMap</code> to trigger an API call and automatically cancel the previous one.</p>

        <h3>Common use cases</h3>
        <ul>
          <li><strong>Live search</strong> — search as the user types, debounced to avoid too many API calls</li>
          <li><strong>Auto-save</strong> — save a draft every time the form changes</li>
          <li><strong>Dynamic validation</strong> — enable or disable other fields based on a field's value</li>
          <li><strong>Form state tracking</strong> — watch the whole form's value change at once</li>
        </ul>

        <h3>Always unsubscribe</h3>
        <p>Like any subscription, clean up in <code>ngOnDestroy</code> or use <code>takeUntilDestroyed()</code> (Angular 16+).</p>
      `,
      code: `import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, filter } from 'rxjs/operators';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule],
  template: \`
    <input [formControl]="searchCtrl" placeholder="Search products..." />
    <ul>
      <li *ngFor="let result of results">{{ result.name }}</li>
    </ul>
  \`
})
export class SearchComponent implements OnInit, OnDestroy {
  searchCtrl = new FormControl('');
  results: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.searchCtrl.valueChanges.pipe(
      debounceTime(400),             // wait 400ms after the user stops typing
      distinctUntilChanged(),        // skip if value is the same as before
      filter(term => (term ?? '').length >= 2),  // only search for 2+ characters
      switchMap(term =>
        this.searchService.search(term ?? '')    // cancel previous call, start new one
      ),
      takeUntil(this.destroy$)       // auto-unsubscribe on destroy
    ).subscribe(results => {
      this.results = results;
    });

    // You can also watch an entire FormGroup at once
    // this.form.valueChanges.subscribe(value => {
    //   console.log('Whole form changed:', value);
    // });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}`,
      language: "typescript"
    }
  ]
});