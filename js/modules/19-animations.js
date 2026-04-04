window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "animations",
  "title": "Animations",
  "icon": "bi bi-magic",
  "questions": [
    {
      "id": "what-is-animations-module",
      "title": "What is Angular animations module?",
      "explanation": `
          <p>Angular animations are built on top of the <strong>Web Animations API</strong>. To use them, you must import the <code>BrowserAnimationsModule</code> into your root module.</p>
          <p>Unlike standard CSS transitions, Angular animations are defined in TypeScript, allowing you to link animation logic directly to component state and data changes.</p>
          <h3>Key Benefits</h3>
          <ul>
            <li><strong>DSL (Domain Specific Language):</strong> Specialized functions like <code>trigger</code>, <code>state</code>, and <code>transition</code>.</li>
            <li><strong>State-based:</strong> Animations are triggered by changes in component properties.</li>
            <li><strong>Staggering:</strong> Easily animate lists of items one after another.</li>
          </ul>
        `,
      "code": "// app.module.ts\nimport { BrowserAnimationsModule } from '@angular/platform-browser/animations';\n\n@NgModule({\n  imports: [ BrowserAnimationsModule ],\n  ...\n})\nexport class AppModule { }",
      "language": "typescript"
    },
    {
      "id": "how-to-implement-animations",
      "title": "How to implement animations?",
      "explanation": `
          <p>Animations are implemented in three steps:</p>\n\n          <ol>\n            <li><strong>Import</strong> functions from <code>@angular/animations</code>.</li>\n            <li><strong>Define</strong> the animation metadata in the <code>@Component</code> decorator's <code>animations</code> array.</li>\n            <li><strong>Attach</strong> the trigger to an element in the HTML template using the <code>@</code> syntax.</li>\n          </ol>\n        `,
      "code": "@Component({\n  selector: 'app-fade',\n  template: '<div [@fadeInOut]=\"isVisible\">Content</div>',\n  animations: [\n    trigger('fadeInOut', [\n      // animation definitions here\n    ])\n  ]\n})\nexport class FadeComponent { isVisible = true; }",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Animation Logic Flow</p><div class="flex items-center justify-between max-w-md mx-auto"><div class="bg-indigo-50 border border-indigo-200 p-2 rounded text-[10px]">TS Property Change</div><div class="text-slate-300">&rarr;</div><div class="bg-indigo-600 text-white p-2 rounded text-xs font-bold">Trigger Metadata</div><div class="text-slate-300">&rarr;</div><div class="bg-emerald-50 border border-emerald-200 p-2 rounded text-[10px]">DOM CSS Update</div></div></div>`
    },
    {
      "id": "animation-states-transitions",
      "title": "What are animation states and transitions?",
      "explanation": `
          <ul>\n            <li><strong>State:</strong> Defines a set of CSS styles associated with a specific name (e.g., 'open', 'closed'). You use the <code>state()</code> function to declare these.</li>\n            <li><strong>Transition:</strong> Defines the animation path between two states. You use the <code>transition()</code> function to specify the duration and easing.</li>\n          </ul>\n\n          <p>Common transition shorthand includes <code>* => *</code> (any state change) or <code>:enter</code> and <code>:leave</code> (elements entering/leaving the DOM).</p>\n        `,
      "code": "trigger('openClose', [\n  state('open', style({ height: '200px', opacity: 1 })),\n  state('closed', style({ height: '100px', opacity: 0.5 })),\n  transition('open => closed', [ animate('0.5s ease-out') ]),\n  transition('closed => open', [ animate('0.3s ease-in') ])\n])",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><div class="flex items-center justify-center gap-8"><div class="border-2 border-slate-300 p-3 rounded-lg text-xs">State: A</div><div class="flex flex-col items-center"><span class="text-[10px] text-indigo-500 font-mono">transition()</span><span class="text-slate-400 font-bold">&harr;</span><span class="text-[10px] text-slate-400 font-mono">animate()</span></div><div class="border-2 border-slate-300 p-3 rounded-lg text-xs">State: B</div></div></div>`
    },
    {
      "id": "animation-triggers",
      "title": "What are animation triggers?",
      "explanation": `
          <p>A <strong>Trigger</strong> is the bridge between the component template and the animation metadata. It starts with an <code>@</code> symbol in the HTML.</p>\n\n          <p>The trigger monitors the value assigned to it. Whenever that value changes, Angular evaluates the states and transitions defined in the metadata to determine if an animation should play.</p>\n        `,
      "code": "<!-- The trigger 'myTrigger' is bound to the 'status' variable -->\n<div [@myTrigger]=\"status\"></div>\n\n<!-- Void triggers (run when element is created/destroyed) -->\n<div [@myTrigger] *ngIf=\"show\"></div>",
      "language": "html"
    },
    {
      "id": "enter-leave-animations",
      "title": "Enter and leave animations (:enter / :leave)",
      "explanation": `
          <p>The <code>:enter</code> and <code>:leave</code> aliases animate elements as they are <strong>added to or removed from the DOM</strong> — most commonly used with <code>*ngIf</code> and <code>*ngFor</code>.</p>
          <ul>
            <li><code>:enter</code> — equivalent to <code>void =&gt; *</code> — fires when the element is inserted</li>
            <li><code>:leave</code> — equivalent to <code>* =&gt; void</code> — fires when the element is removed</li>
          </ul>
          <p>The pattern is: set the <em>start</em> style using <code>style()</code>, then animate to the <em>end</em> style using <code>animate()</code>.</p>
        `,
      "code": "import { trigger, transition, style, animate } from '@angular/animations';\n\n@Component({\n  selector: 'app-notification',\n  template: '<div *ngIf=\"show\" [@fadeSlide]>Notification message</div>',\n  animations: [\n    trigger('fadeSlide', [\n      // Element enters DOM\n      transition(':enter', [\n        style({ opacity: 0, transform: 'translateY(-12px)' }),\n        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))\n      ]),\n      // Element leaves DOM\n      transition(':leave', [\n        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-12px)' }))\n      ])\n    ])\n  ]\n})\nexport class NotificationComponent { show = false; }",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">:enter / :leave Flow</p><div class="grid grid-cols-2 gap-4 max-w-md mx-auto"><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-emerald-700">:enter</p><p class="text-[10px] text-slate-500 mt-1">void =&gt; *</p><p class="text-[10px] text-slate-500">Element inserted into DOM</p></div><div class="bg-rose-50 border-2 border-rose-200 rounded-xl p-3 text-center"><p class="text-xs font-bold text-rose-700">:leave</p><p class="text-[10px] text-slate-500 mt-1">* =&gt; void</p><p class="text-[10px] text-slate-500">Element removed from DOM</p></div></div></div>`
    },
    {
      "id": "keyframes-animation",
      "title": "Keyframes — multi-step animations",
      "explanation": `
          <p><strong><code>keyframes()</code></strong> allows you to define <strong>multiple intermediate style steps</strong> within a single <code>animate()</code> call, giving fine-grained control over complex motion.</p>
          <p>Each <code>style()</code> inside <code>keyframes()</code> takes an <code>offset</code> between <code>0</code> (start) and <code>1</code> (end), which maps to a percentage of the animation duration.</p>
          <h3>Common uses</h3>
          <ul>
            <li>Bounce, shake, pulse effects</li>
            <li>Multi-phase colour or position transitions</li>
            <li>Attention-grabbing UI cues</li>
          </ul>
        `,
      "code": "import { trigger, transition, animate, keyframes, style } from '@angular/animations';\n\n@Component({\n  selector: 'app-bounce',\n  template: '<button [@bounce]=\"state\" (click)=\"bounce()\">Click me</button>',\n  animations: [\n    trigger('bounce', [\n      transition('* => active', [\n        animate('600ms ease', keyframes([\n          style({ transform: 'translateY(0)',    offset: 0   }),\n          style({ transform: 'translateY(-30px)', offset: 0.4 }),\n          style({ transform: 'translateY(0)',    offset: 0.6 }),\n          style({ transform: 'translateY(-12px)', offset: 0.8 }),\n          style({ transform: 'translateY(0)',    offset: 1   })\n        ]))\n      ])\n    ])\n  ]\n})\nexport class BounceComponent {\n  state = 'idle';\n  bounce() { this.state = this.state === 'idle' ? 'active' : 'idle'; }\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Keyframes Timeline</p><div class="max-w-md mx-auto"><div class="flex items-end gap-1 h-16 justify-between"><div class="flex flex-col items-center gap-1"><div class="bg-indigo-200 rounded" style="height:4px;width:24px"></div><p class="text-[9px] text-slate-500">0%</p></div><div class="flex flex-col items-center gap-1"><div class="bg-indigo-400 rounded" style="height:40px;width:24px"></div><p class="text-[9px] text-slate-500">40%</p></div><div class="flex flex-col items-center gap-1"><div class="bg-indigo-200 rounded" style="height:4px;width:24px"></div><p class="text-[9px] text-slate-500">60%</p></div><div class="flex flex-col items-center gap-1"><div class="bg-indigo-300 rounded" style="height:18px;width:24px"></div><p class="text-[9px] text-slate-500">80%</p></div><div class="flex flex-col items-center gap-1"><div class="bg-indigo-200 rounded" style="height:4px;width:24px"></div><p class="text-[9px] text-slate-500">100%</p></div></div><p class="text-center text-[10px] text-slate-400 mt-2">offset values control timing of each step</p></div></div>`
    },
    {
      "id": "query-and-stagger",
      "title": "query() and stagger() — animating lists",
      "explanation": `
          <p><strong><code>query()</code></strong> selects child elements inside an animated container so you can apply animations to them. <strong><code>stagger()</code></strong> adds a delay between each child's animation, creating a cascading effect.</p>
          <p>This combination is the standard Angular pattern for animating list items entering or leaving the page one after another.</p>
          <h3>Key points</h3>
          <ul>
            <li><code>query(':enter')</code> — targets all elements being added to the DOM inside the host</li>
            <li><code>stagger(delayMs, animation)</code> — staggers each matched element by the given delay</li>
            <li><code>{ optional: true }</code> — prevents an error when the query matches nothing</li>
          </ul>
        `,
      "code": "import { trigger, transition, style, animate, query, stagger } from '@angular/animations';\n\n@Component({\n  selector: 'app-user-list',\n  template: `\n    <ul [@listAnim]=\"users.length\">\n      <li *ngFor=\"let user of users\">{{ user.name }}</li>\n    </ul>\n    <button (click)=\"addUser()\">Add user</button>\n  `,\n  animations: [\n    trigger('listAnim', [\n      transition('* => *', [\n        query(':enter', [\n          style({ opacity: 0, transform: 'translateX(-20px)' }),\n          stagger(80, [\n            animate('300ms ease-out',\n              style({ opacity: 1, transform: 'translateX(0)' }))\n          ])\n        ], { optional: true }),\n\n        query(':leave', [\n          stagger(50, [\n            animate('200ms ease-in',\n              style({ opacity: 0, transform: 'translateX(20px)' }))\n          ])\n        ], { optional: true })\n      ])\n    ])\n  ]\n})\nexport class UserListComponent {\n  users = [{ name: 'Alice' }, { name: 'Bob' }];\n  addUser() { this.users = [...this.users, { name: 'New User' }]; }\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">query() + stagger() List Animation</p><div class="flex flex-col gap-2 max-w-xs mx-auto"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-2 text-xs text-indigo-700 font-semibold">Item 1 &mdash; animates at 0ms</div><div class="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-2 text-xs text-indigo-700 font-semibold opacity-80">Item 2 &mdash; animates at 80ms</div><div class="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-2 text-xs text-indigo-700 font-semibold opacity-60">Item 3 &mdash; animates at 160ms</div><div class="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-2 text-xs text-indigo-700 font-semibold opacity-40">Item 4 &mdash; animates at 240ms</div></div></div>`
    },
    {
      "id": "animation-callbacks",
      "title": "Animation callbacks (start / done events)",
      "explanation": `
          <p>Angular exposes two <strong>animation event bindings</strong> on any element with a trigger, letting you run code at the start or end of an animation.</p>
          <ul>
            <li><code>(@triggerName.start)</code> — fires when the animation begins</li>
            <li><code>(@triggerName.done)</code> — fires when the animation completes</li>
          </ul>
          <p>Both emit an <code>AnimationEvent</code> object with useful properties:</p>
          <ul>
            <li><code>fromState</code> / <code>toState</code> — the state names being transitioned between</li>
            <li><code>totalTime</code> — total animation duration in milliseconds</li>
            <li><code>triggerName</code> — name of the trigger that fired</li>
            <li><code>phaseName</code> — <code>'start'</code> or <code>'done'</code></li>
          </ul>
        `,
      "code": "import { AnimationEvent } from '@angular/animations';\n\n// Template:\n// <div [@openClose]=\"isOpen\"\n//      (@openClose.start)=\"onAnimStart($event)\"\n//      (@openClose.done)=\"onAnimDone($event)\">\n//   Content\n// </div>\n\n@Component({ selector: 'app-panel', template: '' })\nexport class PanelComponent {\n  isOpen = false;\n\n  onAnimStart(event: AnimationEvent): void {\n    console.log(\n      `Animation started: ${event.fromState} -> ${event.toState}`,\n      `trigger: ${event.triggerName}`\n    );\n  }\n\n  onAnimDone(event: AnimationEvent): void {\n    console.log(`Animation complete after ${event.totalTime}ms`);\n\n    // Common use: hide element from accessibility tree after leave animation\n    if (event.toState === 'closed') {\n      this.isHiddenFromReader = true;\n    }\n  }\n\n  isHiddenFromReader = false;\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Animation Event Lifecycle</p><div class="flex flex-col items-center gap-2 max-w-sm mx-auto"><div class="w-full bg-slate-100 border border-slate-300 rounded-lg p-2 text-center text-xs font-bold text-slate-600">State change triggers animation</div><div class="text-slate-400 text-xs">&darr;</div><div class="w-full bg-indigo-50 border-2 border-indigo-200 rounded-lg p-2 text-center text-xs font-bold text-indigo-700">(@trigger.start) fires &mdash; AnimationEvent emitted</div><div class="text-slate-400 text-xs">&darr; animation plays &darr;</div><div class="w-full bg-emerald-50 border-2 border-emerald-200 rounded-lg p-2 text-center text-xs font-bold text-emerald-700">(@trigger.done) fires &mdash; AnimationEvent emitted</div></div></div>`
    }
  ]
});