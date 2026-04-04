window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "accessibility",
  "title": "Accessibility (a11y)",
  "icon": "bi bi-universal-access",
  "questions": [
    {
      "id": "what-is-accessibility",
      "title": "What is accessibility in Angular?",
      "explanation": `
          <p><strong>Accessibility (a11y)</strong> is the practice of making web applications usable by as many people as possible, including those with visual, auditory, motor, or cognitive disabilities.</p>
          <p>In Angular, this means using semantic HTML, managing focus correctly, and ensuring that UI components provide enough context to assistive technologies like screen readers.</p>
        `,
      "code": "<!-- ✅ GOOD: Semantic HTML provides built-in keyboard support and roles -->\n<button (click)=\"submit()\">Submit Form</button>\n\n<!-- ❌ BAD: Non-semantic elements require manual ARIA and keyboard handling -->\n<div (click)=\"submit()\">Submit</div>",
      "language": "html",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Accessibility Pillars</p><div class="grid grid-cols-3 gap-2"><div class="bg-indigo-50 border border-indigo-200 p-2 rounded text-center text-[10px] font-bold">Semantic HTML</div><div class="bg-emerald-50 border border-emerald-200 p-2 rounded text-center text-[10px] font-bold">Focus Management</div><div class="bg-amber-50 border border-amber-200 p-2 rounded text-center text-[10px] font-bold">ARIA Support</div></div></div>`
    },
    {
      "id": "aria-attributes",
      "title": "ARIA attributes",
      "explanation": `
          <p><strong>ARIA (Accessible Rich Internet Applications)</strong> attributes are used to supplement HTML when native elements don't provide enough information to assistive technologies.</p>
          <h3>Common ARIA Attributes</h3>
          <ul>
            <li><code>aria-label</code>: Provides a label for elements that don't have visible text (like an icon button).</li>
            <li><code>aria-hidden</code>: Hides decorative elements from screen readers.</li>
            <li><code>role</code>: Defines the purpose of an element (e.g., <code>role="tablist"</code>).</li>
            <li><code>aria-expanded</code>: Indicates if a menu or accordion is open or closed.</li>
          </ul>
          <p><strong>Note:</strong> In Angular, use the <code>[attr.aria-name]</code> syntax for dynamic attributes.</p>
        `,
      "code": "<!-- Static ARIA -->\n<button aria-label=\"Close dialog\">\n  <i class=\"bi bi-x\"></i>\n</button>\n\n<!-- Dynamic ARIA: Angular requires 'attr.' prefix for standard HTML attributes -->\n<div role=\"button\" \n     [attr.aria-expanded]=\"isOpen\" \n     [attr.aria-controls]=\"contentId\" \n     (click)=\"toggle()\">\n  Toggle Details\n</div>",
      "language": "html"
    },
    {
      "id": "making-apps-accessible",
      "title": "How to make Angular apps accessible?",
      "explanation": `
          <p>Angular provides several tools and best practices to improve accessibility:</p>\n\n          <ul>\n            <li><strong>Angular CDK A11y Module:</strong> Provides utilities like <code>FocusTrap</code> (keeps focus inside a modal) and <code>LiveAnnouncer</code> (announces dynamic changes to screen readers).</li>\n            <li><strong>Title Service:</strong> Ensure every route has a unique, descriptive page title for screen reader users.</li>\n            <li><strong>Keyboard Navigation:</strong> Ensure all interactive elements are reachable via the <code>Tab</code> key and have visible focus states.</li>\n            <li><strong>Contrast Ratios:</strong> Use high-contrast colors for text to ensure readability for users with low vision.</li>\n          </ul>\n        `,
      "code": "import { LiveAnnouncer } from '@angular/cdk/a11y';\n\nconstructor(private announcer: LiveAnnouncer) {}\n\nannounceChange() {\n  // Screen readers will speak this text\n  this.announcer.announce('Data has been updated successfully!');\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><div class="max-w-md mx-auto bg-slate-800 text-white rounded-lg p-3 text-[10px] font-mono"><p class=\"text-indigo-400\">// CDK FocusTrap Example</p>&lt;div cdkTrapFocus&gt;<br/>&nbsp;&nbsp;&lt;button&gt;First&lt;/button&gt;<br/>&nbsp;&nbsp;&lt;button&gt;Last&lt;/button&gt;<br/>&lt;/div&gt;</div></div>`
    },
    {
      "id": "screen-readers-and-semantics",
      "title": "Working with screen readers",
      "explanation": `
          <p><strong>Screen readers</strong> are assistive technologies that read web content aloud to users with visual impairments. To support them effectively, use <strong>semantic HTML</strong> and provide textual alternatives for non-text content.</p>\n\n          <h3>Best Practices</h3>\n          <ul>\n            <li><strong>Use semantic HTML:</strong> <code>&lt;button&gt;</code>, <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;section&gt;</code> convey meaning to screen readers.</li>\n            <li><strong>Image alt text:</strong> Always provide descriptive <code>alt</code> attributes on images.</li>\n            <li><strong>Form labels:</strong> Use <code>&lt;label&gt;</code> elements or <code>aria-label</code> to associate text with inputs.</li>\n            <li><strong>Skip links:</strong> Provide a skip-to-content link so users can bypass repetitive navigation.</li>\n            <li><strong>Headings:</strong> Use a proper heading hierarchy (h1, h2, h3) to structure content logically.</li>\n          </ul>\n        `,
      "code": "<!-- ✅ GOOD: Semantic HTML + proper labels -->\n<nav aria-label=\"Main navigation\">\n  <ul>\n    <li><a href=\"/home\">Home</a></li>\n    <li><a href=\"/about\">About</a></li>\n  </ul>\n</nav>\n\n<form>\n  <label for=\"email\">Email:</label>\n  <input id=\"email\" type=\"email\" required />\n</form>\n\n<img src=\"profile.jpg\" alt=\"User profile photo\" />\n\n<!-- ❌ BAD: No semantic meaning or descriptors -->\n<div (click)=\"navigate()\">Menu</div>\n<div>Email</div>\n<input type=\"text\" />\n<img src=\"profile.jpg\" />",
      "language": "html",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Content Accessibility Chain</p><div class="flex flex-col items-center gap-2 max-w-md mx-auto"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 w-full text-center"><p class="text-xs font-bold text-indigo-700">Semantic HTML</p></div><div class="text-slate-300">+</div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 w-full text-center"><p class="text-xs font-bold text-emerald-700">ARIA Labels</p></div><div class="text-slate-300">+</div><div class="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 w-full text-center"><p class="text-xs font-bold text-amber-700">Alt Text</p></div><div class="text-slate-300">=</div><div class="bg-rose-100 border-2 border-rose-400 rounded-xl p-3 w-full text-center"><p class="text-xs font-bold text-rose-700\">Accessible Experience</p></div></div></div>`
    },
    {
      "id": "keyboard-and-focus-management",
      "title": "Keyboard navigation and focus management",
      "explanation": `
          <p>Many users navigate the web using only a keyboard (either by choice or due to motor disabilities). Your application must be <strong>fully keyboard-accessible</strong> and provide clear visual feedback on which element currently has focus.</p>\n\n          <h3>Key Practices</h3>\n          <ul>\n            <li><strong>Tab order:</strong> Elements should be reachable in a logical order via the <code>Tab</code> key. Use <code>tabindex</code> carefully.</li>\n            <li><strong>Focus Visible:</strong> Always provide a visible focus outline (don't remove it with <code>outline: none</code> unless you provide an alternative).</li>\n            <li><strong>Skip Links:</strong> Allow users to jump over repetitive content directly to main content.</li>\n            <li><strong>Keyboard shortcuts:</strong> Implement keyboard shortcuts for common actions, and document them.</li>\n            <li><strong>Focus Trap:</strong> In modals, trap focus so the user can't accidentally tab outside.</li>\n            <li><strong>FocusMonitor:</strong> Use Angular CDK's <code>FocusMonitor</code> to programmatically track focus changes.</li>\n          </ul>\n        `,
      "code": "import { FocusMonitor } from '@angular/cdk/a11y';\nimport { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';\n\n@Component({ /* ... */ })\nexport class MyComponent implements AfterViewInit {\n  @ViewChild('myButton') myButton!: ElementRef;\n\n  constructor(private focusMonitor: FocusMonitor) {}\n\n  ngAfterViewInit() {\n    // Monitor focus changes on this element\n    this.focusMonitor.monitor(this.myButton).subscribe(origin => {\n      if (origin === 'keyboard') {\n        console.log('Button focused via keyboard');\n      } else if (origin === 'mouse') {\n        console.log('Button focused via mouse');\n      }\n    });\n  }\n}\n\n// Template:\n// <button #myButton>Click Me</button>\n// <style>\n//   button:focus-visible {\n//     outline: 3px solid #4299e1;\n//   }\n// </style>",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Focus Management Flow</p><div class="flex items-center justify-between max-w-md mx-auto"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-indigo-700\">User Tab Key</p></div><div class="text-slate-300\">&rarr;</div><div class="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-amber-700\">FocusMonitor</p></div><div class="text-slate-300\">&rarr;</div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-emerald-700\">Visible Focus Style</p></div></div></div>`
    },
    {
      "id": "testing-accessibility",
      "title": "Testing for accessibility",
      "explanation": `
          <p><strong>Accessibility testing</strong> is crucial to ensure your app is truly usable by everyone. There are several approaches and tools available for different levels of testing.</p>\n\n          <h3>Testing Strategies</h3>\n          <ul>\n            <li><strong>Automated Tools:</strong> Use tools like Axe, Lighthouse, or WAVE to detect common accessibility violations (though they can't catch everything).</li>\n            <li><strong>Manual Testing:</strong> Navigate your app using just a keyboard and a screen reader to experience it as users with disabilities would.</li>\n            <li><strong>Unit Tests:</strong> Use Angular's testing utilities to verify ARIA attributes and semantic HTML are present.</li>\n            <li><strong>Browser Extensions:</strong> Tools like axe DevTools or WAVE browser extensions help you audit pages during development.</li>\n            <li><strong>User Testing:</strong> Include people with disabilities in your user testing to get real feedback.</li>\n          </ul>\n        `,
      "code": "// Example: Test for ARIA attributes\nimport { ComponentFixture, TestBed } from '@angular/core/testing';\nimport { DebugElement } from '@angular/core';\nimport { MyComponent } from './my.component';\n\ndescribe('MyComponent Accessibility', () => {\n  let component: MyComponent;\n  let fixture: ComponentFixture<MyComponent>;\n  let compiled: DebugElement;\n\n  beforeEach(async () => {\n    await TestBed.configureTestingModule({\n      declarations: [MyComponent]\n    }).compileComponents();\n\n    fixture = TestBed.createComponent(MyComponent);\n    component = fixture.componentInstance;\n    compiled = fixture.debugElement;\n    fixture.detectChanges();\n  });\n\n  it('should have proper ARIA labels', () => {\n    const button = compiled.query(el => el.name === 'button');\n    expect(button.nativeElement.getAttribute('aria-label')).toBeTruthy();\n  });\n\n  it('should have alt text on images', () => {\n    const img = compiled.query(el => el.name === 'img');\n    expect(img.nativeElement.getAttribute('alt')).toBeTruthy();\n  });\n\n  it('should have semantic form labels', () => {\n    const labels = compiled.queryAll(el => el.name === 'label');\n    expect(labels.length).toBeGreaterThan(0);\n  });\n});",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Accessibility Testing Pyramid</p><div class=\"flex flex-col items-center gap-2 max-w-xs mx-auto\"><div class=\"w-full bg-indigo-100 border-2 border-indigo-300 rounded px-3 py-2 text-center\"><p class=\"text-xs font-bold text-indigo-700\">Manual (Screen Reader)</p></div><div class=\"w-4/5 bg-emerald-100 border-2 border-emerald-300 rounded px-3 py-2 text-center\"><p class=\"text-xs font-bold text-emerald-700\">Keyboard Navigation</p></div><div class=\"w-3/5 bg-amber-100 border-2 border-amber-300 rounded px-3 py-2 text-center\"><p class=\"text-xs font-bold text-amber-700\">Automated Tools</p></div><div class=\"w-2/5 bg-rose-100 border-2 border-rose-300 rounded px-3 py-2 text-center\"><p class=\"text-xs font-bold text-rose-700\">Unit Tests</p></div></div></div>`
    }
  ]
});