window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "testing",
  "title": "Testing",
  "icon": "bi bi-check2-circle",
  "questions": [
    {
      "id": "types-of-testing",
      "title": "Types of testing in Angular",
      "explanation": `
          <p>Angular applications typically use three layers of testing to ensure code quality:</p>
          <ul>
            <li><strong>Unit Testing:</strong> Testing small, isolated pieces of code (like a single function, pipe, or service) without their dependencies.</li>
            <li><strong>Integration Testing:</strong> Testing how different parts of the application (like a component and its template) work together.</li>
            <li><strong>End-to-End (E2E) Testing:</strong> Testing the entire application flow from the user's perspective in a real browser.</li>
          </ul>
        `,
      "code": "// Unit: Testing a pure function\n// Integration: Testing a Component + Service\n// E2E: Testing the Login -> Dashboard flow",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Testing Pyramid</p><div class="flex flex-col items-center gap-1"><div class="bg-rose-100 border border-rose-300 px-8 py-2 text-xs rounded">E2E</div><div class="bg-amber-100 border border-amber-300 px-12 py-2 text-xs rounded">Integration</div><div class="bg-emerald-100 border border-emerald-300 px-20 py-2 text-xs rounded">Unit Tests</div></div></div>`
    },
    {
      "id": "what-is-jasmine",
      "title": "What is Jasmine?",
      "explanation": `
          <p><strong>Jasmine</strong> is a Behavior-Driven Development (BDD) framework for testing JavaScript code. It provides the syntax we use to write the tests themselves.</p>
          <h3>Core Keywords</h3>
          <ul>
            <li><code>describe()</code>: A suite of tests (a group).</li>
            <li><code>it()</code>: An individual test case (a spec).</li>
            <li><code>expect()</code>: An assertion (checks if a condition is met).</li>
            <li><code>beforeEach()</code>: Logic to run before every test case.</li>
          </ul>
        `,
      "code": "describe('AuthService', () => {\n  it('should return true when user is logged in', () => {\n    const service = new AuthService();\n    expect(service.isLoggedIn()).toBe(true);\n  });\n});",
      "language": "typescript"
    },
    {
      "id": "what-is-karma",
      "title": "What is Karma?",
      "explanation": `
          <p><strong>Karma</strong> is a <strong>test runner</strong>. While Jasmine provides the "what" (the tests), Karma provides the "where" (the environment).</p>\n\n          <p>Karma opens a browser (like Chrome), executes the tests written in Jasmine, and reports the results back to your terminal or IDE.</p>\n\n          <p><em>Note: In recent Angular versions (v16+), Karma is being deprecated in favor of more modern runners like Web Test Runner or Jest.</em></p>
        `,
      "code": "// Command to run tests using Karma:\n// ng test",
      "language": "bash"
    },
    {
      "id": "what-is-testbed",
      "title": "What is TestBed?",
      "explanation": `
          <p><strong>TestBed</strong> is the most important Angular utility for testing. It creates an <strong>Angular testing module</strong> (an @NgModule specifically for tests) that allows you to mock dependencies and provide components/services in a controlled environment.</p>
        `,
      "code": "beforeEach(async () => {\n  await TestBed.configureTestingModule({\n    declarations: [ UserComponent ],\n    providers: [ { provide: UserService, useValue: mockService } ]\n  }).compileComponents();\n});",
      "language": "typescript"
    },
    {
      "id": "how-to-test-services",
      "title": "How to test services?",
      "explanation": `
          <p>Services are tested by injecting them into the test suite using <code>TestBed.inject()</code>. Since services often depend on <code>HttpClient</code>, we use <code>HttpClientTestingModule</code> to mock backend responses.</p>
        `,
      "code": "it('should fetch users', () => {\n  const service = TestBed.inject(DataService);\n  service.getUsers().subscribe(users => {\n    expect(users.length).toBe(2);\n  });\n});",
      "language": "typescript"
    },
    {
      "id": "how-to-test-components",
      "title": "How to test components?",
      "explanation": `
          <p>Component testing involves checking both the <strong>Class logic</strong> and the <strong>DOM template</strong>. We use the <code>ComponentFixture</code> to access the component instance and its HTML element.</p>\n\n          <p>We use <code>fixture.detectChanges()</code> to trigger Angular's change detection inside the test.</p>
        `,
      "code": "it('should display the title', () => {\n  const fixture = TestBed.createComponent(HeaderComponent);\n  fixture.componentInstance.title = 'Hello';\n  fixture.detectChanges(); // Update the DOM\n\n  const compiled = fixture.nativeElement;\n  expect(compiled.querySelector('h1').textContent).toContain('Hello');\n});",
      "language": "typescript"
    },
    {
      "id": "what-is-e2e-testing",
      "title": "What is end-to-end testing?",
      "explanation": `
          <p><strong>End-to-End (E2E) testing</strong> verifies the entire application stack. It simulates a real user performing actions like clicking buttons, filling out forms, and navigating pages.</p>\n\n          <p>E2E tests catch bugs that unit tests miss, such as broken database connections or CSS overlays blocking buttons.</p>
        `,
      "code": "// E2E Logic:\n// 1. Open Browser at localhost:4200\n// 2. Find input with id='user' and type 'admin'\n// 3. Click 'Login'\n// 4. Expect URL to contain '/dashboard'",
      "language": "typescript"
    },
    {
      "id": "what-is-protractor",
      "title": "What is Protractor?",
      "explanation": `
          <p><strong>Protractor</strong> was the original E2E testing framework designed by the Angular team. It was built on top of WebDriverJS.</p>\n\n          <p><strong>Important:</strong> Protractor is now <strong>deprecated</strong>. The Angular team currently recommends using modern alternatives like <strong>Cypress</strong>, <strong>Playwright</strong>, or <strong>Puppeteer</strong> for E2E testing.</p>
        `,
      "code": "// Protractor Example (Legacy):\n// element(by.id('submit')).click();\n// expect(browser.getCurrentUrl()).toContain('/home');",
      "language": "javascript"
    }
  ]
});