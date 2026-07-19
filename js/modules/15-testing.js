window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "testing",
  "title": "Testing",
  "icon": "bi bi-check2-circle",
  "questions": [
    {
      id: "angular-22-standard-testing-upgrade",
      title: "Angular 22 standard for testing",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A fire drill. You don't want the first time your evacuation plan gets tested to be during an actual fire — you run drills so the failure happens somewhere safe, cheap, and repeatable, long before real users hit the real bug. Tests are scheduled drills for your code; the fewer surprises in production, the better the drills were.</p>
          </div>
        </div>
        <p>Angular 22-ready testing focuses on fast unit tests, standalone component tests, provider-based setup, and realistic integration tests around user-visible behavior. New Angular CLI projects default to the <strong>Web Test Runner</strong> for unit tests (Karma was deprecated back in Angular 16), while Jasmine's assertion vocabulary is still common across both old and new setups.</p>
        <h3>Modern testing checklist</h3>
        <ul>
          <li>Test pure functions, services, pipes, and signal-based logic without spinning up Angular's test environment when possible — it's faster and simpler.</li>
          <li>Use <code>TestBed</code> with standalone component <code>imports</code>, not <code>declarations</code>.</li>
          <li>Use provider-based router and HTTP testing utilities (<code>provideHttpClientTesting()</code>) in new code.</li>
          <li>Test signals, computed values, effects, and rendered DOM behavior — not just method calls.</li>
          <li>Test zoneless components the same way as zone-based ones; <code>fixture.detectChanges()</code> and <code>await fixture.whenStable()</code> still drive the update cycle.</li>
          <li>Keep E2E tests for critical journeys, not every edge case — they're slow and expensive relative to unit tests.</li>
        </ul>
      `,
      code: `import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

describe('UsersApi', () => {
  let api: UsersApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UsersApi,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    api = TestBed.inject(UsersApi);
    http = TestBed.inject(HttpTestingController);
  });

  it('loads users', () => {
    api.getAll().subscribe(users => {
      expect(users.length).toBe(1);
    });

    const req = http.expectOne('/api/users');
    req.flush([{ id: 1, name: 'Asha' }]);
  });
});`,
      language: "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">The Test Pyramid</p><div class="flex flex-col items-center gap-1 text-xs"><div class="bg-rose-100 border border-rose-300 rounded px-4 py-2 text-center font-semibold text-rose-700">E2E — few, slow, whole-stack</div><div class="bg-amber-100 border border-amber-300 rounded px-8 py-2 text-center font-semibold text-amber-700 w-3/4">Integration — TestBed + real DOM</div><div class="bg-emerald-100 border border-emerald-300 rounded px-12 py-2 text-center font-semibold text-emerald-700 w-full">Unit — many, fast, isolated</div></div></div>`
    },
    {
      "id": "types-of-testing",
      "title": "Types of testing in Angular",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Testing a car before it ships. A unit test checks a single spark plug on a bench, in isolation, in milliseconds. An integration test bolts the engine into the chassis and checks that the engine, transmission, and wheels actually work together. An E2E test puts a real driver behind the wheel and drives the finished car around the block. All three matter, but you don't want to build the whole car just to check one spark plug.</p>
          </div>
        </div>
        <p>Angular applications use three layers of testing, each serving a different purpose. They're often visualized as a pyramid — many small, fast tests at the base, fewer slow end-to-end tests at the top.</p>
        <h3>Unit tests — test one thing in isolation</h3>
        <p>A unit test exercises a single function, class, or component in complete isolation from its dependencies, which are replaced with mocks or spies. These run in milliseconds, you can have thousands of them, and a failure pinpoints exactly what broke.</p>
        <h3>Integration tests — test how parts work together</h3>
        <p>Integration tests check that multiple real units interact correctly — a component and its template, or a component and a real service backed by an HTTP mock. In Angular, component tests built with <code>TestBed</code> are typically integration tests.</p>
        <h3>End-to-end (E2E) tests — test the whole app from the user's perspective</h3>
        <p>E2E tests run a real browser, navigate the actual app, click buttons, fill forms, and assert what the user sees. They're the most realistic but also the slowest and most fragile. Reserve them for critical user journeys — login, checkout, registration.</p>
      `,
      "code": "// ─── Unit test: pure function (no Angular setup needed) ────────\nfunction add(a: number, b: number): number { return a + b; }\n\ndescribe('add', () => {\n  it('returns the sum of two numbers', () => {\n    expect(add(2, 3)).toBe(5);\n    expect(add(-1, 1)).toBe(0);\n  });\n});\n\n// ─── Unit test: pipe ────────────────────────────────────────────\ndescribe('TruncatePipe', () => {\n  const pipe = new TruncatePipe();\n\n  it('truncates text longer than the limit', () => {\n    expect(pipe.transform('Hello World', 5)).toBe('Hello...');\n  });\n\n  it('returns the full text if within limit', () => {\n    expect(pipe.transform('Hi', 5)).toBe('Hi');\n  });\n});\n\n// ─── Integration test: component + template (uses TestBed) ─────\n// Covered in the component testing question below.\n\n// ─── E2E test: user clicks through the app (Playwright) ────────\n// await page.goto('/login');\n// await page.fill('[data-testid=email]', 'user@example.com');\n// await page.fill('[data-testid=password]', 'password');\n// await page.click('[data-testid=submit]');\n// await expect(page).toHaveURL(/dashboard/);",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">What Each Layer Actually Checks</p><div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs"><div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center"><p class="font-bold text-emerald-700">Unit</p><p class="text-slate-500 mt-1">one function or class, mocked deps</p></div><div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center"><p class="font-bold text-amber-700">Integration</p><p class="text-slate-500 mt-1">component + template + real service</p></div><div class="bg-rose-50 border border-rose-200 rounded-lg p-3 text-center"><p class="font-bold text-rose-700">E2E</p><p class="text-slate-500 mt-1">real browser, real user flow</p></div></div></div>`
    },
    {
      "id": "what-is-vitest",
      "title": "What is the Web Test Runner in modern Angular?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Swapping a slow, heavyweight inspection rig for a lighter one that still checks the same things, just faster and with less setup ceremony. Karma needed a full browser instance babysitting every run; the modern runner is built to spin up, run, and tear down quickly, which is exactly what you want when you're running the suite dozens of times an hour during development.</p>
          </div>
        </div>
        <p>Modern Angular CLI projects default to the <strong>Web Test Runner</strong> for unit tests, replacing Karma, which the Angular team deprecated back in Angular 16. It runs tests against real browser engines but with far less overhead than the old Karma setup, and it keeps the same assertion vocabulary developers already know: <code>describe</code>, <code>it</code>, <code>expect</code>, setup/teardown hooks, spies, and mocks.</p>
        <h3>Why this matters</h3>
        <p>Older Angular tutorials still teach Jasmine + Karma as if it were the only option. That combination is still fully supported for existing projects, but new Angular projects and new interview prep should treat Karma as legacy knowledge, not the main path.</p>
        <h3>What actually changed for you as a developer</h3>
        <p>Very little of your day-to-day test-writing syntax changes — <code>describe</code>/<code>it</code>/<code>expect</code> blocks read the same either way. What changed is the tooling underneath: how the test files get bundled, launched, and reported, and how fast the feedback loop is while you're actively writing code.</p>
      `,
      "code": "import { describe, it, expect, beforeEach } from '@angular/core/testing' /* or your configured test globals */;\n\nclass AuthService {\n  private token: string | null = null;\n  login(token: string) { this.token = token; }\n  isLoggedIn() { return !!this.token; }\n}\n\ndescribe('AuthService', () => {\n  let service: AuthService;\n\n  beforeEach(() => {\n    service = new AuthService();\n  });\n\n  it('returns false before login', () => {\n    expect(service.isLoggedIn()).toBe(false);\n  });\n\n  it('returns true after login', () => {\n    service.login('abc');\n    expect(service.isLoggedIn()).toBe(true);\n  });\n});\n\n// Run with: ng test\n// Coverage: ng test --coverage",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Test Runner Timeline</p><div class="flex items-center justify-center gap-3 text-xs"><div class="bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-center"><p class="font-bold text-slate-600">Karma (deprecated, v16)</p><p class="text-slate-500 mt-1">legacy projects only</p></div><span class="text-slate-300">&rarr;</span><div class="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-center"><p class="font-bold text-emerald-700">Web Test Runner (v22 default)</p><p class="text-slate-500 mt-1">new CLI projects</p></div></div></div>`
    },
    {
      "id": "what-is-jasmine",
      "title": "What is Jasmine?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A courtroom script. <code>describe</code> opens the case, <code>it</code> states one specific claim under examination, <code>expect(...).toBe(...)</code> is the evidence you're presenting, and <code>beforeEach</code>/<code>afterEach</code> are the bailiff resetting the room between cases so nothing from the last trial leaks into the next one.</p>
          </div>
        </div>
        <p><strong>Jasmine</strong> is the testing framework Angular has used from the start. It provides the vocabulary for describing and writing tests, and that vocabulary carries over regardless of which runner (Karma or the modern Web Test Runner) actually executes them.</p>
        <h3>Core keywords</h3>
        <ul>
          <li><code>describe('label', fn)</code> — creates a test suite, a logical group of related tests. Suites can nest.</li>
          <li><code>it('description', fn)</code> — a single test case (a "spec"). Write the description so it reads like a sentence: "it should return the user's full name".</li>
          <li><code>expect(value)</code> — creates an expectation. Chain it with a <strong>matcher</strong>.</li>
          <li><code>beforeEach(fn)</code> — runs before every <code>it()</code> in the enclosing <code>describe()</code>. Used to reset state.</li>
          <li><code>afterEach(fn)</code> — runs after every <code>it()</code>. Used for cleanup.</li>
          <li><code>beforeAll(fn)</code> / <code>afterAll(fn)</code> — run once before/after all specs in a suite.</li>
        </ul>
        <h3>Common matchers</h3>
        <ul>
          <li><code>.toBe(value)</code> — strict equality (<code>===</code>)</li>
          <li><code>.toEqual(value)</code> — deep equality (objects/arrays)</li>
          <li><code>.toBeTruthy()</code> / <code>.toBeFalsy()</code></li>
          <li><code>.toContain(item)</code> — array or string contains</li>
          <li><code>.toThrow()</code> — function throws an error</li>
          <li><code>.toHaveBeenCalled()</code> — spy was called</li>
          <li><code>.toHaveBeenCalledWith(...args)</code> — spy was called with specific arguments</li>
        </ul>
      `,
      "code": "describe('AuthService', () => {\n  let service: AuthService;\n\n  beforeEach(() => {\n    service = new AuthService();   // fresh instance before each test\n  });\n\n  // ─── Basic matchers ────────────────────────────────────────\n  it('should be created', () => {\n    expect(service).toBeTruthy();   // not null/undefined\n  });\n\n  it('should return false when not logged in', () => {\n    expect(service.isLoggedIn()).toBe(false);  // strict equality\n  });\n\n  it('should return the user after login', () => {\n    const user = { id: 1, name: 'Alice', email: 'alice@example.com' };\n    service.login(user);\n    expect(service.getUser()).toEqual(user);    // deep equality\n  });\n\n  it('should include admin in roles', () => {\n    service.login({ id: 1, name: 'Admin', roles: ['user', 'admin'] });\n    expect(service.getRoles()).toContain('admin');\n  });\n\n  it('should throw when accessing user without login', () => {\n    expect(() => service.getUser()).toThrow();\n  });\n\n  afterEach(() => {\n    service.logout();   // clean up after each test\n  });\n});",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Anatomy of a Spec</p><div class="flex flex-col items-center gap-1 text-xs font-mono max-w-sm mx-auto"><div class="bg-indigo-50 border border-indigo-200 rounded px-3 py-1.5 w-full text-center">describe('AuthService', ...)</div><div class="text-slate-300">&darr;</div><div class="bg-emerald-50 border border-emerald-200 rounded px-3 py-1.5 w-full text-center">beforeEach(() =&gt; reset state)</div><div class="text-slate-300">&darr;</div><div class="bg-amber-50 border border-amber-200 rounded px-3 py-1.5 w-full text-center">it('returns true after login', ...)</div><div class="text-slate-300">&darr;</div><div class="bg-rose-50 border border-rose-200 rounded px-3 py-1.5 w-full text-center">expect(...).toBe(true)</div></div></div>`
    },
    {
      "id": "what-is-karma",
      "title": "What is Karma? (legacy, deprecated in Angular 16)",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Jasmine writes the play, Karma is the stage crew that opens a real theater (a real browser), sets up the props, runs the performance, and reports back who forgot their lines. You could write the play without ever renting the theater — but Angular tests want to run in something that behaves like an actual browser.</p>
          </div>
        </div>
        <p><strong>Karma</strong> is the legacy Angular browser test runner used by many existing Jasmine-based Angular projects. It was deprecated starting in Angular 16, with the Web Test Runner taking over as the CLI default for new projects — but it remains common in codebases that haven't migrated yet, so recognizing it matters for reading older projects.</p>
        <h3>What Karma does</h3>
        <ol>
          <li>Compiles your Angular test files using the Angular CLI</li>
          <li>Launches a browser (Chrome by default)</li>
          <li>Loads the compiled test code in the browser</li>
          <li>Executes all the Jasmine specs</li>
          <li>Reports pass/fail results back to your terminal</li>
        </ol>
        <h3>Running legacy Karma tests</h3>
        <p>Run <code>ng test</code> in a Karma-configured project to start watch mode. Run <code>ng test --watch=false --browsers=ChromeHeadless</code> for a single CI run without opening a visible browser window.</p>
        <h3>Modern default</h3>
        <p>New Angular CLI projects use the Web Test Runner by default. Karma is still supported for existing projects, but new tutorials and new apps should teach the Web Test Runner first and Karma only as migration/legacy knowledge.</p>
      `,
      "code": "// ─── Run legacy Karma tests ────────────────────────────────────\n// ng test                                — watch mode (re-runs on save)\n// ng test --watch=false                  — single run\n// ng test --watch=false --browsers=ChromeHeadless  — CI-friendly\n// ng test --code-coverage                — generate coverage report\n\n// ─── karma.conf.js — basic setup ─────────────────────────────\nmodule.exports = function(config) {\n  config.set({\n    frameworks: ['jasmine', '@angular-devkit/build-angular'],\n    browsers: ['Chrome'],       // or 'ChromeHeadless' for CI\n    singleRun: false,           // false = watch mode\n    restartOnFileChange: true\n  });\n};\n\n// ─── Modern path ───────────────────────────────────────────────\n// New Angular CLI projects use the Web Test Runner by default.\n// Existing Karma projects can be migrated with Angular's official migration guide.",
      "language": "javascript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Jasmine (script) + Karma (crew)</p><div class="flex items-center justify-center gap-4 text-xs"><div class="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 text-center"><p class="font-bold text-indigo-700">Jasmine</p><p class="text-slate-500 mt-1">writes the specs</p></div><span class="text-slate-300">+</span><div class="bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-center"><p class="font-bold text-slate-600">Karma (deprecated)</p><p class="text-slate-500 mt-1">launches the browser</p></div><span class="text-slate-300">&rarr;</span><div class="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-center"><p class="font-bold text-emerald-700">Web Test Runner (v22)</p><p class="text-slate-500 mt-1">modern replacement</p></div></div></div>`
    },
    {
      "id": "what-is-testbed",
      "title": "What is TestBed?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A flight simulator instead of a real cockpit. You can't just drop a trainee pilot in a real plane to test one maneuver — you build a controlled rig that recreates exactly the conditions you need (fake engines, fake weather) and nothing else. <code>TestBed</code> is that rig for an Angular component: a miniature, disposable Angular environment built just for one test.</p>
          </div>
        </div>
        <p><strong>TestBed</strong> is Angular's testing utility that spins up a mini Angular application specifically for your test. It lets you configure a testing module — declaring components, providing real or mock services, importing standalone dependencies — then create component instances inside that controlled environment.</p>
        <h3>Why is it needed?</h3>
        <p>Angular components aren't plain classes you can instantiate with <code>new</code>. They have templates, dependency injection, and lifecycle hooks that all require Angular's runtime to work. TestBed provides that runtime in a controlled, test-safe way.</p>
        <h3>Key TestBed methods</h3>
        <ul>
          <li><code>TestBed.configureTestingModule({ imports, providers })</code> — sets up the testing module. Call in <code>beforeEach()</code>.</li>
          <li><code>TestBed.createComponent(MyComponent)</code> — creates an instance of the component and returns a <code>ComponentFixture</code>.</li>
          <li><code>TestBed.inject(MyService)</code> — retrieves an instance of a service from the testing module's injector.</li>
        </ul>
        <h3>ComponentFixture</h3>
        <p>The fixture gives you the component instance (<code>fixture.componentInstance</code>), its root DOM element (<code>fixture.nativeElement</code>), and Angular's debug element (<code>fixture.debugElement</code>). Call <code>fixture.detectChanges()</code> to run change detection and update the DOM — in zoneless tests, also <code>await fixture.whenStable()</code> after async work.</p>
      `,
      "code": "import { TestBed, ComponentFixture } from '@angular/core/testing';\nimport { UserCardComponent } from './user-card.component';\nimport { UserService } from './user.service';\n\ndescribe('UserCardComponent', () => {\n  let fixture: ComponentFixture<UserCardComponent>;\n  let component: UserCardComponent;\n  let mockUserService: jasmine.SpyObj<UserService>;\n\n  beforeEach(async () => {\n    mockUserService = jasmine.createSpyObj('UserService', ['getUser', 'updateUser']);\n\n    await TestBed.configureTestingModule({\n      imports: [\n        UserCardComponent   // standalone component — import, don't declare\n      ],\n      providers: [\n        // Replace the real UserService with our mock\n        { provide: UserService, useValue: mockUserService }\n      ]\n    }).compileComponents();\n\n    fixture = TestBed.createComponent(UserCardComponent);\n    component = fixture.componentInstance;\n  });\n\n  it('should create the component', () => {\n    expect(component).toBeTruthy();\n  });\n\n  it('should render the user name in the template', () => {\n    fixture.componentRef.setInput('user', { id: 1, name: 'Alice', email: 'alice@example.com' });\n    fixture.detectChanges();   // run CD to update the DOM\n\n    const h2: HTMLElement = fixture.nativeElement.querySelector('h2');\n    expect(h2.textContent).toContain('Alice');\n  });\n});",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">TestBed Flow</p><div class="flex flex-col items-center gap-1 text-xs max-w-sm mx-auto"><div class="bg-indigo-50 border border-indigo-200 rounded px-3 py-1.5 w-full text-center">configureTestingModule({ imports, providers })</div><div class="text-slate-300">&darr;</div><div class="bg-emerald-50 border border-emerald-200 rounded px-3 py-1.5 w-full text-center">createComponent(MyComponent)</div><div class="text-slate-300">&darr;</div><div class="bg-amber-50 border border-amber-200 rounded px-3 py-1.5 w-full text-center">fixture.detectChanges()</div><div class="text-slate-300">&darr;</div><div class="bg-slate-800 text-white rounded px-3 py-1.5 w-full text-center">query fixture.nativeElement</div></div></div>`
    },
    {
      "id": "how-to-test-services",
      "title": "How to test services?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Practicing a phone script with a colleague pretending to be the customer, instead of calling a real customer every rehearsal. <code>HttpTestingController</code> is that stand-in — it intercepts every "call" your service makes, lets you inspect exactly what was asked for, and hands back a scripted response, so your test never actually touches a network.</p>
          </div>
        </div>
        <p>Services that don't depend on Angular-specific features (no HTTP, no DOM, no DI) can be tested with a plain <code>new ServiceClass()</code>. For services that use <code>HttpClient</code>, Angular provides <code>provideHttpClientTesting()</code> and <code>HttpTestingController</code> to mock HTTP requests without hitting a real server.</p>
        <h3>Testing approach for services</h3>
        <ol>
          <li>Provide the service via <code>TestBed</code></li>
          <li>Provide <code>provideHttpClientTesting()</code> alongside <code>provideHttpClient()</code></li>
          <li>Inject <code>HttpTestingController</code> to control mock requests</li>
          <li>Call the service method</li>
          <li>Flush the mock request with test data</li>
          <li>Assert the result</li>
        </ol>
        <h3>Spies for dependencies</h3>
        <p>If your service depends on another service, use <code>jasmine.createSpyObj()</code> to replace the dependency with a mock that records calls and returns controlled values.</p>
      `,
      "code": "import { TestBed } from '@angular/core/testing';\nimport { provideHttpClient } from '@angular/common/http';\nimport { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';\nimport { UsersService, User } from './users.service';\n\ndescribe('UsersService', () => {\n  let service: UsersService;\n  let httpMock: HttpTestingController;\n\n  beforeEach(() => {\n    TestBed.configureTestingModule({\n      providers: [\n        UsersService,\n        provideHttpClient(),\n        provideHttpClientTesting()   // replaces real HttpClient transport with a mock\n      ]\n    });\n    service  = TestBed.inject(UsersService);\n    httpMock = TestBed.inject(HttpTestingController);\n  });\n\n  afterEach(() => {\n    httpMock.verify();  // fail if any HTTP requests were made but not flushed\n  });\n\n  it('should GET all users and return them', () => {\n    const mockUsers: User[] = [\n      { id: 1, name: 'Alice', email: 'alice@example.com' },\n      { id: 2, name: 'Bob',   email: 'bob@example.com' }\n    ];\n\n    service.getAll().subscribe(users => {\n      expect(users.length).toBe(2);\n      expect(users[0].name).toBe('Alice');\n    });\n\n    // Expect exactly one GET request to this URL\n    const req = httpMock.expectOne('/api/users');\n    expect(req.request.method).toBe('GET');\n\n    // Flush: provide the mock response — this triggers the subscribe callback above\n    req.flush(mockUsers);\n  });\n\n  it('should handle a 404 error', () => {\n    service.getById(999).subscribe({\n      next:  ()    => fail('should have errored'),\n      error: (err) => expect(err.status).toBe(404)\n    });\n\n    const req = httpMock.expectOne('/api/users/999');\n    req.flush('Not Found', { status: 404, statusText: 'Not Found' });\n  });\n\n  it('should POST a new user', () => {\n    const newUser = { name: 'Charlie', email: 'charlie@example.com' };\n    const created = { id: 3, ...newUser };\n\n    service.create(newUser).subscribe(user => {\n      expect(user.id).toBe(3);\n      expect(user.name).toBe('Charlie');\n    });\n\n    const req = httpMock.expectOne('/api/users');\n    expect(req.request.method).toBe('POST');\n    expect(req.request.body).toEqual(newUser);\n    req.flush(created);\n  });\n});",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">HttpTestingController — Request Interception</p><div class="flex items-center justify-center gap-2 text-xs flex-wrap"><div class="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 text-center">service.getAll()</div><span class="text-slate-300">&rarr;</span><div class="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-center">HttpTestingController intercepts</div><span class="text-slate-300">&rarr;</span><div class="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-center">req.flush(mockData)</div><span class="text-slate-300">&rarr;</span><div class="bg-slate-800 text-white rounded-lg px-3 py-2 text-center">subscribe callback fires</div></div></div>`
    },
    {
      "id": "how-to-test-components",
      "title": "How to test components?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A mystery shopper testing a storefront: they don't read the employee handbook, they walk in, look at what's on the shelves, click the buttons a real customer would click, and check what actually happens. Component tests should mostly behave the same way — assert on what's rendered in the DOM and what happens after a simulated interaction, not on private internals of the class.</p>
          </div>
        </div>
        <p>Component testing verifies both the <strong>component class logic</strong> and the <strong>template rendering</strong>. You use <code>TestBed</code> to create the component, interact with it via the fixture, and assert what appears in the DOM.</p>
        <h3>Key steps</h3>
        <ol>
          <li>Configure <code>TestBed</code> with the component and any mocked dependencies</li>
          <li>Create the component fixture</li>
          <li>Set input values (via <code>fixture.componentRef.setInput()</code> for signal inputs) and call <code>fixture.detectChanges()</code></li>
          <li>Query the DOM using <code>fixture.nativeElement.querySelector()</code> or <code>fixture.debugElement</code></li>
          <li>Simulate user interactions with <code>element.click()</code> or <code>element.dispatchEvent()</code></li>
          <li>Call <code>detectChanges()</code> again after interactions and assert the updated DOM</li>
        </ol>
        <h3>Spies on services</h3>
        <p>Replace real services with spies so tests don't depend on network calls. Use <code>jasmine.createSpyObj()</code> and configure each spy's return value with <code>.and.returnValue()</code>.</p>
      `,
      "code": "import { TestBed, ComponentFixture } from '@angular/core/testing';\nimport { of, throwError } from 'rxjs';\nimport { LoginComponent } from './login.component';\nimport { AuthService } from './auth.service';\nimport { Router } from '@angular/router';\nimport { ReactiveFormsModule } from '@angular/forms';\n\ndescribe('LoginComponent', () => {\n  let fixture: ComponentFixture<LoginComponent>;\n  let component: LoginComponent;\n  let authSpy: jasmine.SpyObj<AuthService>;\n  let routerSpy: jasmine.SpyObj<Router>;\n\n  beforeEach(async () => {\n    authSpy   = jasmine.createSpyObj('AuthService', ['login']);\n    routerSpy = jasmine.createSpyObj('Router', ['navigate']);\n\n    await TestBed.configureTestingModule({\n      imports: [LoginComponent, ReactiveFormsModule],\n      providers: [\n        { provide: AuthService, useValue: authSpy },\n        { provide: Router,      useValue: routerSpy }\n      ]\n    }).compileComponents();\n\n    fixture   = TestBed.createComponent(LoginComponent);\n    component = fixture.componentInstance;\n    fixture.detectChanges();   // trigger ngOnInit, render template\n  });\n\n  it('should render the login form', () => {\n    const form = fixture.nativeElement.querySelector('form');\n    expect(form).toBeTruthy();\n  });\n\n  it('should disable the submit button when form is invalid', () => {\n    const button: HTMLButtonElement = fixture.nativeElement.querySelector('[type=\"submit\"]');\n    // Form is empty — should be disabled\n    expect(button.disabled).toBe(true);\n  });\n\n  it('should call AuthService.login with form values on submit', () => {\n    authSpy.login.and.returnValue(of({ id: 1, name: 'Alice' }));  // mock success\n\n    // Fill the form\n    component.form.setValue({ email: 'alice@example.com', password: 'password123' });\n    fixture.detectChanges();\n\n    // Submit the form\n    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));\n    fixture.detectChanges();\n\n    expect(authSpy.login).toHaveBeenCalledWith('alice@example.com', 'password123');\n    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);\n  });\n\n  it('should show an error message on login failure', () => {\n    authSpy.login.and.returnValue(throwError(() => new Error('Invalid credentials')));\n\n    component.form.setValue({ email: 'wrong@example.com', password: 'bad' });\n    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));\n    fixture.detectChanges();\n\n    const error: HTMLElement = fixture.nativeElement.querySelector('.error-message');\n    expect(error.textContent).toContain('Invalid credentials');\n  });\n});",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Component Test Cycle</p><div class="flex flex-wrap items-center justify-center gap-2 text-xs"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700">Configure TestBed</div><span class="text-slate-300">&rarr;</span><div class="bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700">Set inputs</div><span class="text-slate-300">&rarr;</span><div class="bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700">detectChanges()</div><span class="text-slate-300">&rarr;</span><div class="bg-rose-50 border-2 border-rose-200 rounded-lg px-3 py-2 text-center font-semibold text-rose-700">Simulate interaction</div><span class="text-slate-300">&rarr;</span><div class="bg-purple-50 border-2 border-purple-200 rounded-lg px-3 py-2 text-center font-semibold text-purple-700">Assert DOM</div></div></div>`
    },
    {
      "id": "what-is-e2e-testing",
      "title": "What is end-to-end testing?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A full dress rehearsal with the entire cast, real costumes, real lighting, and a live audience — as opposed to one actor practicing lines alone in front of a mirror. It catches problems that only exist when everything runs together: a costume change that's too slow, a lighting cue that doesn't match blocking. Unit tests are the mirror; E2E is opening night.</p>
          </div>
        </div>
        <p><strong>End-to-end (E2E) tests</strong> run a real browser and simulate a real user interacting with your full application — frontend, routing, HTTP calls to a backend, database. They exercise the entire stack top to bottom.</p>
        <h3>What unit tests miss</h3>
        <p>Unit tests test each piece in isolation with mocks. E2E tests catch bugs that only appear when everything runs together: a CSS overlay blocking a button, a redirect loop caused by guards interacting, a race condition between two API calls, a deployment misconfiguration.</p>
        <h3>Modern E2E tools</h3>
        <ul>
          <li><strong>Playwright</strong> — cross-browser (Chromium, Firefox, WebKit), fast, headless by default, excellent for CI pipelines. The default recommendation for new Angular projects (<code>ng e2e</code> offers it as a first-party option).</li>
          <li><strong>Cypress</strong> — an interactive test runner with time-travel debugging and screenshots, popular for its developer experience.</li>
          <li><strong>Protractor</strong> — the original Angular E2E tool. Deprecated. Do not start new projects with it.</li>
        </ul>
        <h3>Best practices</h3>
        <p>Use <code>data-testid</code> attributes on elements you need to select in tests. Never use CSS classes or text content as selectors — they change as the UI evolves.</p>
      `,
      "code": "// ─── Playwright E2E test — complete login flow ─────────────────\nimport { test, expect } from '@playwright/test';\n\ntest.describe('Login Flow', () => {\n  test.beforeEach(async ({ page }) => {\n    await page.goto('/login');\n  });\n\n  test('redirects to dashboard after successful login', async ({ page }) => {\n    await page.fill('[data-testid=email-input]', 'alice@example.com');\n    await page.fill('[data-testid=password-input]', 'password123');\n    await page.click('[data-testid=login-button]');\n\n    await expect(page).toHaveURL(/dashboard/);\n    await expect(page.locator('[data-testid=welcome-message]')).toContainText('Welcome, Alice');\n  });\n\n  test('shows an error for invalid credentials', async ({ page }) => {\n    await page.fill('[data-testid=email-input]', 'wrong@example.com');\n    await page.fill('[data-testid=password-input]', 'wrongpassword');\n    await page.click('[data-testid=login-button]');\n\n    await expect(page.locator('[data-testid=error-message]')).toBeVisible();\n    await expect(page).toHaveURL(/login/);  // should NOT have navigated away\n  });\n});\n\n// Angular component template — add data-testid attributes:\n// <input data-testid=\"email-input\"    formControlName=\"email\" />\n// <input data-testid=\"password-input\" formControlName=\"password\" type=\"password\" />\n// <button data-testid=\"login-button\"  type=\"submit\">Login</button>\n// <p data-testid=\"error-message\">{{ errorMsg() }}</p>",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">What E2E Sees vs What Unit Tests See</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">Unit / integration</p><div class="text-slate-500 text-center">component in isolation, mocked HTTP, no real browser navigation</div></div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3"><p class="font-bold text-emerald-700 text-center mb-2">E2E</p><div class="text-slate-600 text-center">real browser &rarr; real router &rarr; real HTTP &rarr; real backend &rarr; real DOM</div></div></div></div>`
    },
    {
      "id": "what-is-protractor",
      "title": "Protractor (deprecated) and modern alternatives",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A discontinued car model. It still runs if you own one, parts are getting harder to find, and nobody's shipping new safety features for it. Protractor isn't dangerous to know about historically, but if you're buying (starting) a new project today, you'd pick something currently in production — Playwright or Cypress.</p>
          </div>
        </div>
        <p><strong>Protractor</strong> was Angular's original E2E testing framework, built by the Angular team on top of Selenium WebDriver. It had special Angular-aware waiting logic that knew when the framework had finished processing (waiting for Angular's zone to become stable).</p>
        <h3>Why it was deprecated</h3>
        <p>Protractor had problems modern tools solve better: slow setup, flaky tests from timing issues, a weak debugging experience, and no active development. The Angular team officially deprecated it in 2022, and its zone-stability-based waiting strategy makes even less sense now that zoneless is the Angular 22 default.</p>
        <h3>What to use instead</h3>
        <ul>
          <li><strong>Playwright</strong> — <code>npm init playwright</code>. Fast, true cross-browser support, excellent for CI. The common default recommendation today.</li>
          <li><strong>Cypress</strong> — <code>ng add @cypress/schematic</code>. Best interactive debugging experience with time-travel screenshots.</li>
          <li><strong>Nightwatch.js</strong> — officially supported by Angular, added via <code>ng add @nightwatch/schematics</code></li>
        </ul>
        <h3>Cypress vs Playwright</h3>
        <p>Choose <strong>Cypress</strong> if developer experience and interactive debugging matter most. Choose <strong>Playwright</strong> if cross-browser coverage, speed, and CI performance are the priority.</p>
      `,
      "code": "// ─── Protractor (LEGACY — do not use for new projects) ─────────\n// element(by.id('submit')).click();\n// expect(browser.getCurrentUrl()).toContain('/dashboard');\n// browser.waitForAngular();\n\n// ─── Playwright setup (common default today) ───────────────────\n// npm init playwright@latest\n// npx playwright install   (downloads browsers)\n// npx playwright test      (run all tests)\n\n// playwright.config.ts — example for an Angular app\nimport { defineConfig } from '@playwright/test';\nexport default defineConfig({\n  testDir: './e2e',\n  use: {\n    baseURL: 'http://localhost:4200',\n    trace: 'on-first-retry',     // record traces on failure for debugging\n    screenshot: 'only-on-failure'\n  },\n  webServer: {\n    command: 'ng serve',\n    url: 'http://localhost:4200',\n    reuseExistingServer: !process.env['CI']  // reuse ng serve in dev mode\n  }\n});\n\n// Playwright test example:\nimport { test, expect } from '@playwright/test';\n\ntest('user can log in', async ({ page }) => {\n  await page.goto('/login');\n  await page.fill('[data-testid=email]',    'alice@example.com');\n  await page.fill('[data-testid=password]', 'password123');\n  await page.click('[data-testid=submit]');\n  await expect(page).toHaveURL(/dashboard/);\n  await expect(page.locator('h1')).toContainText('Welcome');\n});\n\n// ─── Cypress setup (alternative) ───────────────────────────────\n// ng add @cypress/schematic\n// npx cypress open    ← interactive, time-travel screenshots\n// npx cypress run     ← headless, for CI pipelines",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">E2E Tooling Timeline</p><div class="flex items-center justify-center gap-3 text-xs flex-wrap"><div class="bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-center"><p class="font-bold text-slate-500">Protractor</p><p class="text-slate-400 mt-1">deprecated 2022</p></div><span class="text-slate-300">&rarr;</span><div class="bg-cyan-50 border border-cyan-200 rounded-lg px-3 py-2 text-center"><p class="font-bold text-cyan-700">Cypress</p><p class="text-slate-500 mt-1">interactive DX</p></div><div class="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-center"><p class="font-bold text-emerald-700">Playwright</p><p class="text-slate-500 mt-1">cross-browser, fast CI</p></div></div></div>`
    },
    {
      "id": "async-testing-and-component-harnesses",
      "title": "Async testing, fakeAsync, and component harnesses",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text"><code>fakeAsync</code> and <code>tick()</code> are a remote control for time — you can fast-forward straight past a 300ms debounce without your test actually sitting there for 300ms, the same way you'd skip commercials on a recorded show. Component harnesses, meanwhile, are like using a universal remote that knows the buttons on any TV instead of reaching behind the set to fiddle with its internal wiring directly.</p>
          </div>
        </div>
        <p>Angular tests often involve asynchronous work: timers, Promises, Observables, HTTP calls, router navigation, animations, and Material components. Interviewers commonly ask the difference between <code>fakeAsync</code>, <code>tick()</code>, <code>waitForAsync</code>, and component harnesses.</p>
        <h3>fakeAsync and tick</h3>
        <p><code>fakeAsync()</code> runs a test in a controlled fake async zone. <code>tick(ms)</code> moves virtual time forward, so you can test <code>setTimeout</code>, <code>debounceTime</code>, and delayed Observables without actually waiting.</p>
        <h3>waitForAsync</h3>
        <p><code>waitForAsync()</code> waits for real async tasks scheduled by Angular's test zone to finish. Use it for setup with <code>compileComponents()</code> or when you want Angular to wait for pending Promises. Prefer <code>fakeAsync</code> when time itself matters.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text"><code>fakeAsync</code>/<code>tick()</code> rely on Zone.js to track and flush pending async work. In a zoneless component or test environment, they don't have anything to hook into — use <code>await fixture.whenStable()</code> together with real <code>async</code>/<code>await</code> test functions instead of reaching for <code>fakeAsync</code> by habit.</p>
          </div>
        </div>
        <h3>Component Harnesses</h3>
        <p>A component harness is a testing API that interacts with a component like a user would, without depending on fragile CSS selectors or internal DOM structure. Angular Material ships harnesses such as <code>MatButtonHarness</code>, <code>MatInputHarness</code>, and <code>MatDialogHarness</code>.</p>
      `,
      "code": "import { TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';\nimport { ReactiveFormsModule, FormControl } from '@angular/forms';\nimport { debounceTime } from 'rxjs/operators';\n\n// ---- fakeAsync + tick: test time-based streams (Zone.js-backed tests) ----\ndescribe('SearchBoxComponent', () => {\n  it('debounces search input', fakeAsync(() => {\n    const control = new FormControl('');\n    const results: string[] = [];\n\n    control.valueChanges.pipe(debounceTime(300)).subscribe(value => {\n      results.push(value ?? '');\n    });\n\n    control.setValue('a');\n    tick(100);\n    control.setValue('an');\n    tick(100);\n    control.setValue('ang');\n\n    expect(results).toEqual([]); // debounce has not completed\n\n    tick(300);\n    expect(results).toEqual(['ang']);\n  }));\n});\n\n// ---- waitForAsync: let Angular wait for async setup ----\nbeforeEach(waitForAsync(() => {\n  TestBed.configureTestingModule({\n    imports: [SearchBoxComponent, ReactiveFormsModule]\n  }).compileComponents();\n}));\n\n// ---- Zoneless equivalent: real async/await + whenStable() ----\nit('debounces search input (zoneless)', async () => {\n  const fixture = TestBed.createComponent(SearchBoxComponent);\n  fixture.detectChanges();\n  fixture.componentInstance.query.setValue('ang');\n  await fixture.whenStable();\n  expect(fixture.componentInstance.results()).toEqual(['ang']);\n});\n\n// ---- Angular Material harness example ----\nimport { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';\nimport { MatButtonHarness } from '@angular/material/button/testing';\n\nit('clicks the save button through a harness', async () => {\n  const fixture = TestBed.createComponent(ProfileComponent);\n  const loader = TestbedHarnessEnvironment.loader(fixture);\n\n  const saveButton = await loader.getHarness(\n    MatButtonHarness.with({ text: /save/i })\n  );\n\n  await saveButton.click();\n  expect(fixture.componentInstance.saved()).toBe(true);\n});",
      "language": "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Zone-Based vs Zoneless Async Testing</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-slate-50 border-2 border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">Zone-based test</p><div class="space-y-1.5"><div class="bg-white border border-slate-200 rounded px-2 py-1 text-center">fakeAsync(() =&gt; ...)</div><div class="bg-white border border-slate-200 rounded px-2 py-1 text-center">tick(300)</div></div></div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3"><p class="font-bold text-emerald-700 text-center mb-2">Zoneless test</p><div class="space-y-1.5"><div class="bg-white border border-emerald-200 rounded px-2 py-1 text-center">async () =&gt; ...</div><div class="bg-white border border-emerald-200 rounded px-2 py-1 text-center">await fixture.whenStable()</div></div></div></div></div>`
    }
  ]
});
