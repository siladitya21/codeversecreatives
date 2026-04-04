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
    }
  ]
});