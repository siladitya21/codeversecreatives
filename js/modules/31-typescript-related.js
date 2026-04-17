window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "typescript-related",
  "title": "TypeScript in Angular",
  "icon": "bi bi-filetype-tsx",
  "questions": [
    {
      "id": "typescript-features-in-angular",
      "title": "TypeScript features that power Angular",
      "explanation": `
          <p>Angular is built on TypeScript, and this is not an accident — TypeScript's features are what make Angular's programming model possible. The <code>@Component</code> and <code>@Injectable</code> decorators, the dependency injection system's type-based resolution, the compiler's template type-checking, and the Angular Language Service's IDE autocomplete all depend directly on TypeScript's type system and decorator metadata.</p>

          <h3>Strict Mode</h3>
          <p>Angular 12+ enables <strong>strict mode</strong> by default in generated projects (<code>strict: true</code> in <code>tsconfig.json</code>). This activates a bundle of compiler checks: <code>strictNullChecks</code> (prevents <code>null</code>/<code>undefined</code> bugs), <code>strictPropertyInitialization</code> (catches uninitialized class properties), <code>noImplicitAny</code> (prevents accidental <code>any</code>), and Angular's own <code>strictTemplates</code> (type-checks template expressions against component types). Strict mode catches entire categories of runtime bugs at compile time.</p>

          <h3>Decorators as Metadata</h3>
          <p>TypeScript's experimental decorators let Angular attach metadata to classes without modifying them. When you write <code>@Component({ selector: 'app-hero', ... })</code>, the decorator stores that configuration on the class so Angular's compiler can read it to generate the correct change detection code and template factory.</p>

          <h3>Type Inference in Templates</h3>
          <p>With <code>strictTemplates</code>, Angular uses the component class's TypeScript types to type-check template expressions. If your component has <code>user: User | null</code> and your template says <code>{{ user.name }}</code> without a null guard, the compiler reports an error — catching a potential runtime null-dereference before it ships.</p>
        `,
      "code": "// tsconfig.json — strict mode (Angular default)\n{\n  \"compilerOptions\": {\n    \"strict\": true,               // enables all strict TS checks\n    \"strictNullChecks\": true,     // null/undefined are not assignable to other types\n    \"strictPropertyInitialization\": true  // class properties must be initialized\n  },\n  \"angularCompilerOptions\": {\n    \"strictTemplates\": true,      // type-checks template expressions\n    \"strictInjectionParameters\": true  // catches missing @Injectable providers\n  }\n}\n\n// ---- How TypeScript types flow into Angular ----\nimport { Component, inject } from '@angular/core';\nimport { AsyncPipe, NgIf } from '@angular/common';\nimport { UserService } from './user.service';\n\ninterface User { id: number; name: string; email: string; }\n\n@Component({\n  selector: 'app-profile',\n  standalone: true,\n  imports: [AsyncPipe, NgIf],\n  template: `\n    <!-- strictTemplates catches: user might be null -->\n    <div *ngIf=\"user\">\n      <!-- Now TypeScript knows user is User (not null) inside the *ngIf -->\n      {{ user.name }}\n    </div>\n  `\n})\nexport class ProfileComponent {\n  private userService = inject(UserService);\n  // TypeScript knows this is User | null — strictNullChecks enforces handling it\n  user: User | null = null;\n\n  ngOnInit(): void {\n    this.userService.getCurrent().subscribe(u => this.user = u);\n  }\n}",
      "language": "typescript"
    },
    {
      "id": "advanced-types-in-angular",
      "title": "Advanced types — union, intersection, generics, and utility types",
      "explanation": `
          <p>Angular services, HTTP responses, and component APIs frequently benefit from TypeScript's advanced type constructs. Understanding these lets you write services that are both flexible and type-safe, rather than falling back to <code>any</code>.</p>

          <h3>Union and Intersection Types</h3>
          <p>A <strong>union type</strong> (<code>A | B</code>) means a value can be one of several types — useful for API responses that return different shapes depending on a <code>type</code> discriminant field. A <strong>intersection type</strong> (<code>A & B</code>) merges types — useful for composing mixins or extending third-party types with local additions.</p>

          <h3>Generics in Services</h3>
          <p>Generic services and functions let you write reusable infrastructure without losing type information. An <code>ApiService.get<T>(url)</code> method tells the caller exactly what type the observable emits — the HTTP layer is type-safe end to end. Angular's <code>HttpClient.get<T>()</code> itself uses this pattern.</p>

          <h3>Utility Types</h3>
          <p>TypeScript ships utility types that transform existing types. <code>Partial<T></code> makes all properties optional — useful for PATCH request payloads. <code>Required<T></code> makes all properties mandatory. <code>Readonly<T></code> prevents mutation. <code>Pick<T, K></code> selects a subset of properties. <code>Omit<T, K></code> removes properties. These eliminate the need to define redundant "DTO" interfaces that are minor variations of your domain types.</p>
        `,
      "code": "// ---- Discriminated union for API responses ----\ntype ApiSuccess<T> = { status: 'ok'; data: T };\ntype ApiError     = { status: 'error'; message: string; code: number };\ntype ApiResponse<T> = ApiSuccess<T> | ApiError;\n\nfunction isSuccess<T>(r: ApiResponse<T>): r is ApiSuccess<T> {\n  return r.status === 'ok';\n}\n\n// ---- Generic HTTP service ----\nimport { Injectable, inject } from '@angular/core';\nimport { HttpClient } from '@angular/common/http';\nimport { Observable } from 'rxjs';\n\n@Injectable({ providedIn: 'root' })\nexport class ApiService {\n  private http = inject(HttpClient);\n\n  get<T>(url: string): Observable<T> {\n    return this.http.get<T>(url);\n  }\n\n  post<TBody, TResponse>(url: string, body: TBody): Observable<TResponse> {\n    return this.http.post<TResponse>(url, body);\n  }\n}\n\n// ---- Utility types for CRUD operations ----\ninterface Product {\n  id: number;\n  name: string;\n  price: number;\n  stock: number;\n  createdAt: Date;\n}\n\n// Server always provides id + createdAt; client never sends them on create\ntype CreateProductDto = Omit<Product, 'id' | 'createdAt'>;\n\n// Patch: all fields optional except id\ntype UpdateProductDto = Partial<Omit<Product, 'id'>> & { id: number };\n\n// Read-only view model\ntype ProductViewModel = Readonly<Pick<Product, 'id' | 'name' | 'price'>>;\n\n// Usage:\nconst payload: CreateProductDto = { name: 'Laptop', price: 999, stock: 10 };\nconst patch: UpdateProductDto   = { id: 1, price: 799 };",
      "language": "typescript"
    },
    {
      "id": "decorators-in-typescript",
      "title": "Decorators — how Angular metadata works",
      "explanation": `
          <p>TypeScript decorators are functions that receive a target (class, method, property, or parameter) and can attach metadata or modify behavior. Angular uses them pervasively: <code>@Component</code>, <code>@Injectable</code>, <code>@Input</code>, <code>@Output</code>, <code>@HostListener</code>, <code>@ViewChild</code> — all of these are decorators that Angular's compiler reads to understand how to wire up your application.</p>

          <p>When Angular compiles your application, it processes these decorator metadata payloads at build time (AOT compilation). The <code>@Component</code> decorator's <code>template</code> is compiled into an efficient DOM instruction set. The <code>@Injectable</code> decorator marks which classes can be injected and what their dependencies are. None of this metadata survives in the final bundle as JavaScript decorator calls — it is compiled away into direct function calls, making the output significantly smaller and faster than JIT.</p>

          <h3>The Reflect.metadata Dependency</h3>
          <p>TypeScript decorators that use parameter metadata (like the DI system's constructor injection) historically required the <code>reflect-metadata</code> polyfill and <code>emitDecoratorMetadata: true</code> in <code>tsconfig.json</code>. Angular 14+ introduced the <code>inject()</code> function which does not need decorator metadata at all, and Angular is progressively moving away from the constructor injection pattern. New Angular code should prefer <code>inject()</code> inside class fields or lifecycle hooks.</p>
        `,
      "code": "import { Component, Input, Output, EventEmitter,\n         HostListener, HostBinding } from '@angular/core';\n\n// ---- Class decorator: configures the component ----\n@Component({\n  selector: 'app-rating',\n  standalone: true,\n  template: `\n    <div class=\"stars\">\n      @for (star of stars; track star) {\n        <span (click)=\"setRating(star)\"\n              [class.filled]=\"star <= value\">\n          ★\n        </span>\n      }\n    </div>\n  `\n})\nexport class RatingComponent {\n  stars = [1, 2, 3, 4, 5];\n\n  // ---- Property decorators: communicate with parent ----\n  @Input() value = 0;\n  @Output() valueChange = new EventEmitter<number>();\n\n  // ---- Host decorators: bind to the host element ----\n  @HostBinding('attr.role') role = 'slider';\n  @HostBinding('attr.aria-valuenow') get ariaValue() { return this.value; }\n\n  @HostListener('keydown.arrowRight')\n  increment() { this.setRating(Math.min(5, this.value + 1)); }\n\n  @HostListener('keydown.arrowLeft')\n  decrement() { this.setRating(Math.max(0, this.value - 1)); }\n\n  setRating(star: number): void {\n    this.value = star;\n    this.valueChange.emit(star);\n  }\n}\n\n// ---- Modern alternative: inject() instead of constructor injection ----\nimport { Injectable, inject } from '@angular/core';\nimport { HttpClient } from '@angular/common/http';\n\n@Injectable({ providedIn: 'root' })\nexport class ProductService {\n  // No constructor, no @Inject, no reflect-metadata needed\n  private http = inject(HttpClient);\n\n  getAll() { return this.http.get<Product[]>('/api/products'); }\n}",
      "language": "typescript"
    },
    {
      "id": "interfaces-vs-types",
      "title": "Interfaces vs type aliases — when to use which",
      "explanation": `
          <p>TypeScript's <code>interface</code> and <code>type</code> keywords overlap significantly — both describe object shapes, both support generics, and both work in most places interchangeably. The practical difference comes down to three capabilities that only interfaces have: <strong>declaration merging</strong>, <strong>class implementation</strong>, and <strong>extension with <code>extends</code></strong>.</p>

          <h3>Use Interfaces for Object Shapes</h3>
          <p>Interfaces are the conventional choice for domain models, DTOs, and service contracts that might be implemented by a class or extended by another interface. Angular uses interfaces for its own lifecycle hooks (<code>OnInit</code>, <code>OnDestroy</code>) precisely because a class can <code>implement</code> them. If you might ever write <code>class Foo implements Bar</code>, use an interface for <code>Bar</code>.</p>

          <h3>Use Type Aliases for Everything Else</h3>
          <p>Type aliases are the only option for union types (<code>Status = 'active' | 'inactive'</code>), intersection types, mapped types, conditional types, template literal types, and tuples. They are also preferred for function signatures and for complex generic transformations. Most utility type operations (<code>Partial</code>, <code>Pick</code>, <code>Omit</code>) produce type aliases, not interfaces.</p>

          <h3>Declaration Merging</h3>
          <p>Interface declaration merging — declaring the same interface name twice and having TypeScript merge them — is useful when augmenting third-party library types. For example, adding a custom property to Angular's <code>Request</code> interface in an Express SSR server. Type aliases do not support this.</p>
        `,
      "code": "// ---- Use interface: domain model, implementable, extensible ----\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\ninterface AdminUser extends User {\n  permissions: string[];  // extends another interface\n  department: string;\n}\n\n// A class can implement it\nclass UserViewModel implements User {\n  constructor(\n    public id: number,\n    public name: string,\n    public email: string\n  ) {}\n}\n\n// ---- Use type alias: unions, intersections, complex types ----\ntype HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';\ntype LoadingState = 'idle' | 'loading' | 'success' | 'error';\n\n// Tuple type — only possible with type\ntype Coordinate = [x: number, y: number];\n\n// Mapped type — only possible with type\ntype FormControls<T> = { [K in keyof T]: string };\n\n// Conditional type — only possible with type\ntype NonNullable<T> = T extends null | undefined ? never : T;\n\n// ---- Declaration merging: augmenting third-party types ----\n// In Express SSR server: add userId to Request\ndeclare global {\n  namespace Express {\n    interface Request {\n      userId?: number;  // merges into Express's Request interface\n    }\n  }\n}\n\n// ---- In practice: Angular-specific patterns ----\n// Signal-based component inputs are usually typed with interfaces\ninterface ProductCardInputs {\n  product: Product;\n  showActions?: boolean;\n}\n\n// HTTP response DTOs often use type aliases (discriminated unions)\ntype SortOrder = 'asc' | 'desc';\ntype ProductFilter = { category?: string; minPrice?: number; sort?: SortOrder };",
      "language": "typescript"
    },
    {
      "id": "mapped-conditional-template-literal-types",
      "title": "Advanced TypeScript patterns for Angular services",
      "explanation": `
          <p>As Angular applications grow, service APIs become more complex. TypeScript's advanced type features — mapped types, conditional types, template literal types, and the <code>satisfies</code> operator — let you build service contracts that are both expressive and safe, eliminating entire classes of bugs that would otherwise only surface at runtime.</p>

          <h3>Template Literal Types</h3>
          <p>Template literal types (<code>\`on\${string}\`</code>) let you type event handler names, CSS class combinations, or API endpoint patterns at the type level. Angular uses them internally for things like mapping signal input names to their setter equivalents.</p>

          <h3>The satisfies Operator (TypeScript 4.9+)</h3>
          <p><code>satisfies</code> validates that a value conforms to a type without widening the inferred type. This is extremely useful for route configuration objects, Angular injection token defaults, and other configuration constants where you want type checking without losing the literal types of the values.</p>

          <h3>infer in Conditional Types</h3>
          <p>The <code>infer</code> keyword extracts type information from another type. This is how utility types like <code>ReturnType<T></code> and <code>Parameters<T></code> work. In Angular, you can use <code>infer</code> to extract the emitted value type from an Observable or the resolved value from a Promise, enabling stricter typing of generic service wrappers.</p>
        `,
      "code": "// ---- Template literal types for event names ----\ntype EventName<T extends string> = `${Lowercase<T>}Changed`;\ntype ProductEvent = EventName<'Price' | 'Stock' | 'Name'>;\n// = 'priceChanged' | 'stockChanged' | 'nameChanged'\n\n// ---- satisfies: type-check without widening ----\nimport { InjectionToken } from '@angular/core';\n\ninterface AppConfig { apiUrl: string; maxRetries: number; debug: boolean; }\nexport const APP_CONFIG = new InjectionToken<AppConfig>('APP_CONFIG');\n\n// satisfies: AppConfig is checked, but literals are preserved\nconst defaultConfig = {\n  apiUrl: 'https://api.example.com',  // type: string (not widened to unknown)\n  maxRetries: 3,                       // type: number\n  debug: false                         // type: boolean\n} satisfies AppConfig;\n\n// ---- infer: extract observable emission type ----\ntype Unwrap<T> = T extends Observable<infer U> ? U\n               : T extends Promise<infer U>    ? U\n               : T;\n\ntype UserListType = Unwrap<ReturnType<UserService['getAll']>>;\n// If getAll() returns Observable<User[]>, UserListType = User[]\n\n// ---- Mapped type for form state ----\ntype FormState<T> = {\n  [K in keyof T]: {\n    value: T[K];\n    dirty: boolean;\n    errors: string[];\n  };\n};\n\ninterface LoginForm { email: string; password: string; }\ntype LoginFormState = FormState<LoginForm>;\n// = { email: { value: string; dirty: boolean; errors: string[] };\n//     password: { value: string; dirty: boolean; errors: string[] } }\n\n// ---- Using ReturnType + Parameters for service testing ----\ntype ProductServiceMethods = keyof ProductService;\ntype GetProductsReturnType = ReturnType<ProductService['getAll']>;\n// Use in test: jest.spyOn returns correctly typed mock",
      "language": "typescript"
    }
  ]
});
