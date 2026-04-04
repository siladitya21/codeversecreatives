window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "change-detection",
  "title": "Change Detection",
  "icon": "bi bi-lightning-charge",
  "questions": [
    {
      "id": "what-is-change-detection",
      "title": "What is change detection?",
      "explanation": `
          <p><strong>Change Detection</strong> is the mechanism by which Angular synchronizes the state of the application (TypeScript variables) with the user interface (DOM). When data changes, Angular detects the change and re-renders the necessary parts of the view.</p>
          <h3>Key Responsibilities</h3>
          <ul>
            <li>Developer updates the <strong>Model</strong> (data).</li>
            <li>Angular identifies which parts of the <strong>View</strong> need updating.</li>
            <li>Angular updates the <strong>DOM</strong> to reflect the new state.</li>
          </ul>
        `,
      "code": "// Data change\nthis.userName = 'New Name';\n\n// Angular automatically detects this and updates:\n// <h1>{{ userName }}</h1>",
      "language": "typescript"
    },
    {
      "id": "how-does-cd-work",
      "title": "How does change detection work?",
      "explanation": `
          <p>Angular Change Detection works by traversing the <strong>Component Tree</strong> from top to bottom (root to leaf). For each component, it compares the current values in the template with the previous values stored in a special "data structure".</p>\n\n          <p>If values are different, the DOM is updated. By default, this check happens for <strong>every component</strong> whenever an event (like a click or HTTP response) occurs.</p>
        `,
      "code": "// Internal flow:\n// 1. Root Component Check\n// 2. Child Component Check\n// 3. Leaf Component Check",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Unidirectional Data Flow</p><div class="flex flex-col items-center gap-2"><div class="bg-indigo-600 text-white p-2 rounded text-xs">Root</div><div class="text-slate-300">&darr;</div><div class="flex gap-4"><div class="bg-indigo-400 text-white p-2 rounded text-xs">Child A</div><div class="bg-indigo-400 text-white p-2 rounded text-xs">Child B</div></div><div class="text-slate-300">&darr;</div><div class="bg-indigo-200 text-indigo-700 p-2 rounded text-xs">Check for changes...</div></div></div>`
    },
    {
      "id": "what-is-zone-js",
      "title": "What is Zone.js?",
      "explanation": `
          <p><strong>Zone.js</strong> is a library used by Angular to "monkey-patch" asynchronous browser APIs (like <code>setTimeout</code>, <code>addEventListener</code>, and <code>fetch</code>).</p>\n\n          <p>Its role is to notify Angular when an asynchronous task starts and finishes. When a task finishes, Zone.js tells Angular: <em>"Something might have changed, run change detection now."</em></p>
        `,
      "code": "// Zone.js intercepts:\nsetTimeout(() => {\n  this.data = 'updated';\n  // Zone.js triggers Angular CD here\n}, 1000);",
      "language": "javascript"
    },
    {
      "id": "cd-strategies",
      "title": "Change detection strategies",
      "explanation": `
          <p>Angular provides two strategies to control how change detection behaves for a component:</p>\n\n          <ul>\n            <li><strong>Default:</strong> The component is always checked when anything in the app changes.</li>\n            <li><strong>OnPush:</strong> The component is only checked when specific conditions are met, improving performance.</li>\n          </ul>
        `,
      "code": "@Component({\n  selector: 'app-item',\n  template: '...',\n  changeDetection: ChangeDetectionStrategy.OnPush // or Default\n})\nexport class ItemComponent { }",
      "language": "typescript"
    },
    {
      "id": "default-strategy",
      "title": "What is Default strategy?",
      "explanation": `
          <p>The <strong>Default</strong> strategy (also known as <code>CheckAlways</code>) is the standard behavior. Angular will check the component during every change detection cycle, regardless of whether its specific inputs changed.</p>\n\n          <p>This is safe but can be slow in very large applications with complex UI trees.</p>\n        `,
      "code": "// Default is the implicit setting if not specified.\n@Component({\n  changeDetection: ChangeDetectionStrategy.Default\n})",
      "language": "typescript"
    },
    {
      "id": "onpush-strategy",
      "title": "What is OnPush strategy?",
      "explanation": `
          <p>The <strong>OnPush</strong> strategy optimizes performance by skipping the check for a component unless:</p>\n\n          <ul>\n            <li>An <code>@Input()</code> property receives a <strong>new object reference</strong>.</li>\n            <li>An event handler inside the component is triggered (e.g., a click).</li>\n            <li>An Observable bound in the template with the <code>async</code> pipe emits a new value.</li>\n            <li>Change detection is manually triggered.</li>\n          </ul>\n        `,
      "code": "@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush\n})\nexport class UserCardComponent {\n  @Input() user: User; // CD only runs if 'user' reference changes\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><div class="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs"><strong>OnPush Logic:</strong><br/>If (Input Reference Unchanged) { <br/>&nbsp;&nbsp; Skip this component and its children; <br/>}</div></div>`
    },
    {
      "id": "manual-cd-trigger",
      "title": "How to trigger change detection manually?",
      "explanation": `
          <p>You can manually control change detection by injecting <strong>ChangeDetectorRef</strong> into your component.</p>\n\n          <h3>Core Methods</h3>\n          <ul>\n            <li><code>markForCheck()</code>: Marks the component and its ancestors to be checked in the <em>next</em> cycle (essential for OnPush).</li>\n            <li><code>detectChanges()</code>: Forces an immediate check of the component and its children.</li>\n            <li><code>detach()</code>: Stops Angular from automatically checking the component.</li>\n            <li><code>reattach()</code>: Restores automatic checking.</li>\n          </ul>\n        `,
      "code": "constructor(private cdr: ChangeDetectorRef) {}\n\nupdateData() {\n  this.data = 'manual update';\n  this.cdr.markForCheck(); // Tell Angular to check this OnPush component\n}",
      "language": "typescript"
    }
  ]
});