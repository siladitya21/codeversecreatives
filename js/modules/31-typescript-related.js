window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "typescript-related",
  "title": "TypeScript Related",
  "icon": "bi bi-filetype-tsx",
  "questions": [
    {
      "id": "typescript-features-in-angular",
      "title": "TypeScript features used in Angular",
      "explanation": `
          <p>Angular leverages many powerful features of TypeScript to provide a robust and scalable development experience. These features enhance code quality, maintainability, and developer productivity.</p>
          <h3>Key TypeScript Features</h3>
          <ul>
            <li><strong>Static Typing:</strong> Allows defining types for variables, function parameters, and return values, catching errors at compile-time.</li>
            <li><strong>Classes & Interfaces:</strong> Used extensively for defining components, services, models, and contracts.</li>
            <li><strong>Decorators:</strong> Used for metadata annotation (e.g., <code>@Component</code>, <code>@Injectable</code>).</li>
            <li><strong>Generics:</strong> Enables writing reusable code that works with various types while maintaining type safety (e.g., <code>Observable&lt;User&gt;</code>).</li>
            <li><strong>Access Modifiers:</strong> <code>public</code>, <code>private</code>, <code>protected</code> control visibility of class members.</li>
            <li><strong>Modules:</strong> ES Modules (<code>import</code>/<code>export</code>) for organizing code.</li>
          </ul>
        `,
      "code": "interface User {\n  id: number;\n  name: string;\n}\n\n@Injectable({ providedIn: 'root' })\nexport class UserService {\n  private users: User[] = [];\n\n  getUsers(): Observable<User[]> {\n    // ... fetch users\n    return of(this.users);\n  }\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">TypeScript in Angular</p><div class="flex items-center justify-between max-w-md mx-auto"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-indigo-700">Static Typing</p></div><div class="text-slate-300">&harr;</div><div class="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-amber-700">Decorators</p></div><div class="text-slate-300">&harr;</div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-emerald-700">Generics</p></div></div></div>`
    },
    {
      "id": "decorators-in-typescript",
      "title": "Decorators in TypeScript",
      "explanation": `
          <p><strong>Decorators</strong> are a special kind of declaration that can be attached to classes, methods, accessors, properties, or parameters. They are functions that provide a way to add annotations and a meta-programming syntax for class declarations and members.</p>
          <p>In Angular, decorators are heavily used to configure classes (e.g., <code>@Component</code>, <code>@Injectable</code>) and class members (e.g., <code>@Input</code>, <code>@Output</code>, <code>@HostListener</code>).</p>
        `,
      "code": "import { Component, Input, Output, EventEmitter } from '@angular/core';\n\n@Component({\n  selector: 'app-button',\n  template: '<button (click)=\"onClick()\">{{ label }}</button>'\n})\nexport class ButtonComponent {\n  @Input() label: string = 'Click Me';\n  @Output() buttonClick = new EventEmitter<void>();\n\n  onClick() {\n    this.buttonClick.emit();\n  }\n}",
      "language": "typescript"
    },
    {
      "id": "generics",
      "title": "Generics",
      "explanation": `
          <p><strong>Generics</strong> allow you to write flexible, reusable functions and classes that work with a variety of types while still providing type safety. They enable you to define type parameters that can be used in place of actual types.</p>
          <p>This is particularly useful in Angular for services that handle different data types (e.g., a generic HTTP service) or for RxJS Observables that emit specific types of data (e.g., <code>Observable&lt;User[]&gt;</code>).</p>
        `,
      "code": "function identity<T>(arg: T): T {\n  return arg;\n}\n\nlet output1 = identity<string>(\"myString\"); // type of output1 is string\nlet output2 = identity<number>(100);     // type of output2 is number\n\n// In Angular, often seen with Observables:\n// Observable<User[]>\n// BehaviorSubject<boolean>",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><div class="max-w-md mx-auto bg-amber-50 border border-amber-200 rounded-xl p-4 text-center"><p class="text-xs font-bold text-amber-700">Generic Function: identity&lt;T&gt;(arg: T): T</p><p class="text-[10px] text-slate-500 mt-2">Works with any type (T) while preserving type safety.</p></div></div>`
    },
    {
      "id": "interfaces-vs-types",
      "title": "Interfaces vs Types",
      "explanation": `
          <p>Both <strong>interfaces</strong> and <strong>type aliases</strong> are used to define the shape of objects in TypeScript, and they are often interchangeable. However, there are some key differences:</p>
          <h3>Interface</h3>
          <ul>
            <li>Can be <strong>extended</strong> by other interfaces and implemented by classes.</li>
            <li>Can be <strong>merged</strong> (declaration merging) if declared multiple times with the same name.</li>
            <li>Generally preferred for defining object shapes.</li>
          </ul>
          <h3>Type Alias</h3>
          <ul>
            <li>Can define primitive types, union types, tuple types, and more complex types.</li>
            <li>Cannot be implemented by classes.</li>
            <li>Cannot be merged.</li>
            <li>More versatile for defining non-object types.</li>
          </ul>
        `,
      "code": "// Interface\ninterface Person {\n  name: string;\n  age: number;\n}\n\ninterface Employee extends Person {\n  employeeId: string;\n}\n\n// Type Alias\ntype ID = string | number;\ntype Point = { x: number; y: number; };\ntype Status = 'active' | 'inactive';\n\n// Both can be used for object types:\nconst user: Person = { name: 'Alice', age: 30 };\nconst coord: Point = { x: 10, y: 20 };",
      "language": "typescript"
    },
    {
      "id": "access-modifiers",
      "title": "Access modifiers",
      "explanation": `
          <p>TypeScript provides <strong>access modifiers</strong> (<code>public</code>, <code>private</code>, <code>protected</code>) to control the visibility and accessibility of class members (properties and methods).</p>
          <ul>
            <li><strong><code>public</code> (default):</strong> Accessible from anywhere.</li>
            <li><strong><code>private</code>:</strong> Accessible only from within the class where it's defined.</li>
            <li><strong><code>protected</code>:</strong> Accessible from within the class and by instances of derived classes.</li>
          </ul>
          <p>In Angular, it's common to declare injected services as <code>private</code> in the constructor to prevent accidental direct access from the template, promoting better encapsulation.</p>
        `,
      "code": "class UserProfile {\n  public name: string;\n  private _age: number;\n  protected email: string;\n\n  constructor(name: string, age: number, email: string) {\n    this.name = name;\n    this._age = age;\n    this.email = email;\n  }\n\n  public getAge(): number {\n    return this._age;\n  }\n\n  // Common in Angular for injected services:\n  // constructor(private http: HttpClient) { }\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><div class="max-w-md mx-auto bg-slate-800 text-white rounded-lg p-3 text-[10px] font-mono"><p class=\"text-indigo-400\">class MyClass {</p>&nbsp;&nbsp;<span class=\"text-emerald-400\">public</span>Property: string;<br/>&nbsp;&nbsp;<span class=\"text-rose-400\">private</span>_secret: string;<br/>&nbsp;&nbsp;<span class=\"text-amber-400\">protected</span>_config: any;<br/><p class=\"text-indigo-400\">}</p></div></div>`
    }
  ]
});