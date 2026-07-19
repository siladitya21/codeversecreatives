window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "animations",
  "title": "Animations",
  "icon": "bi bi-magic",
  "questions": [
    {
      id: "angular-22-standard-animations-upgrade",
      title: "Angular 22 standard for animations",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Choosing between a stagehand and a choreographer. For a simple light dimming (hover, focus), you don't need a full choreographer — CSS transitions handle it. But when an actor needs to walk on and off stage in sync with the plot (an element entering/leaving the DOM based on app state), you need Angular's animation DSL, because CSS alone can't animate an element's removal.</p>
          </div>
        </div>
        <p>Angular 22-ready animation work should balance Angular's animation APIs with native CSS and the Web Animations API. Use Angular animations when transitions depend on Angular state, route changes, or elements entering and leaving the DOM. Use CSS transitions for simple hover, focus, and one-off visual polish.</p>
        <h3>Modern animation checklist</h3>
        <ul>
          <li>Provide animations at bootstrap with <code>provideAnimations()</code>.</li>
          <li>Use <code>provideNoopAnimations()</code> in tests.</li>
          <li>Respect reduced-motion user preferences.</li>
          <li>Prefer transforms and opacity for smoother animations.</li>
          <li>Use <code>@if</code> with enter/leave animations for conditional UI.</li>
          <li>Avoid animating layout-heavy properties in large lists.</li>
        </ul>
      `,
      code: `bootstrapApplication(AppComponent, {
  providers: [provideAnimations()]
});

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(8px)' }),
    animate('180ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('120ms ease-in', style({ opacity: 0, transform: 'translateY(8px)' }))
  ])
]);

// In tests:
// providers: [provideNoopAnimations()]`,
      language: "typescript",
      diagram: "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">CSS Transition vs Angular Animation</p><div class=\"grid grid-cols-1 md:grid-cols-2 gap-4 text-xs\"><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3\"><p class=\"font-bold text-emerald-700 text-center mb-2\">Plain CSS</p><ul class=\"text-slate-600 space-y-1\"><li>Hover / focus states</li><li>Simple, always-present elements</li><li>Zero JS cost</li></ul></div><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3\"><p class=\"font-bold text-indigo-700 text-center mb-2\">Angular Animations</p><ul class=\"text-slate-600 space-y-1\"><li>Enter/leave (DOM add/remove)</li><li>State-driven by app data</li><li>Route transitions, stagger, keyframes</li></ul></div></div></div>"
    },
    {
      "id": "what-is-animations-module",
      "title": "What is the Angular animations module?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A traffic light system wired to real intersections, not a decoration. You define named signal states (<code>'stop'</code>, <code>'go'</code>) and the physical path between them, and the light itself changes automatically the moment the underlying condition (component state) changes — you never manually flip the bulb.</p>
          </div>
        </div>
        <p>Angular's animation system is a TypeScript DSL (Domain Specific Language) built on top of the <strong>Web Animations API</strong>. Rather than writing CSS keyframes or transitions in a stylesheet and hoping they coordinate with your component state, you define animations in TypeScript alongside the component — Angular automatically triggers them when the relevant state changes.</p>
        <p>The key advantage over pure CSS transitions is that Angular animations are <strong>state-driven</strong>. You define named states (like <code>'open'</code> and <code>'closed'</code>) with their associated styles, and Angular figures out which transition to play whenever your component property changes from one state to another.</p>
        <h3>Setup: provideAnimations()</h3>
        <p>To use Angular animations, you must provide the animations infrastructure at the application root. In standalone Angular you call <code>provideAnimations()</code> in the <code>bootstrapApplication</code> providers array. If you want to disable animations (useful in tests or for accessibility), use <code>provideNoopAnimations()</code> instead — it respects the same API but skips all timing.</p>
        <h3>Core Building Blocks</h3>
        <p>The animation DSL consists of a small set of functions imported from <code>@angular/animations</code>: <code>trigger()</code> names and groups an animation, <code>state()</code> defines styles for a named state, <code>transition()</code> defines the path between two states, <code>animate()</code> specifies duration and easing, <code>style()</code> defines a set of CSS styles at a moment in time, and <code>keyframes()</code> defines multiple style stops within a single animate call.</p>
      `,
      "code": "// ---- Setup ----\n// main.ts\nimport { bootstrapApplication } from '@angular/platform-browser';\nimport { provideAnimations } from '@angular/platform-browser/animations';\nimport { AppComponent } from './app/app.component';\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    provideAnimations()  // enables Angular animations everywhere\n    // Use provideNoopAnimations() in tests or for reduced-motion accessibility\n  ]\n});\n\n// ---- Minimal animation example ----\nimport { Component } from '@angular/core';\nimport { trigger, state, style, transition, animate } from '@angular/animations';\n\n@Component({\n  selector: 'app-panel',\n  template: `\n    <div [@panelState]=\"isOpen ? 'open' : 'closed'\">\n      Panel content here\n    </div>\n    <button (click)=\"isOpen = !isOpen\">Toggle</button>\n  `,\n  animations: [\n    trigger('panelState', [\n      state('open',   style({ height: '200px', opacity: 1 })),\n      state('closed', style({ height: '0px',   opacity: 0 })),\n      transition('open <=> closed', animate('300ms ease-in-out'))\n    ])\n  ]\n})\nexport class PanelComponent {\n  isOpen = true;\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">The Animation DSL Building Blocks</p><div class=\"grid grid-cols-2 md:grid-cols-5 gap-2 text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-center font-semibold text-indigo-700\">trigger()</div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center font-semibold text-emerald-700\">state()</div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-2 text-center font-semibold text-amber-700\">transition()</div><div class=\"bg-rose-50 border border-rose-200 rounded-lg p-2 text-center font-semibold text-rose-700\">animate()</div><div class=\"bg-purple-50 border border-purple-200 rounded-lg p-2 text-center font-semibold text-purple-700\">style()</div></div></div>"
    },
    {
      "id": "how-to-implement-animations",
      "title": "How to implement animations in Angular?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Wiring a thermostat. First you write down what "cold" and "warm" mean and how fast the system should ramp between them (the animation metadata). Then you stick the thermostat's dial on the wall where anyone can turn it (the template binding). After that, you never touch the heater directly — you just turn the dial (change the state property), and the system handles the ramping.</p>
          </div>
        </div>
        <p>Every Angular animation follows a three-step pattern: define states and transitions inside the <code>animations</code> array of your <code>@Component</code> decorator, attach the trigger to an element in the template using the <code>[@triggerName]</code> binding syntax, and change the bound value in your component class to drive the animation.</p>
        <h3>Step 1 — Define the Animation Metadata</h3>
        <p>Inside the <code>animations: []</code> array you call <code>trigger('name', [...])</code>. The array contains <code>state()</code> calls (what the element looks like when it is in that state) and <code>transition()</code> calls (how to animate between states). The transition expression is a string describing the direction: <code>'open => closed'</code> fires only going from open to closed, <code>'open &lt;=&gt; closed'</code> fires in both directions, and <code>'* => *'</code> fires on any state change.</p>
        <h3>Step 2 — Attach the Trigger in the Template</h3>
        <p>Add <code>[@triggerName]="expression"</code> to any element. The expression evaluates to a state name string. Angular watches this expression; when the value changes, it looks up the matching transition in the trigger metadata and plays the animation.</p>
        <h3>Step 3 — Change State in the Component Class</h3>
        <p>You drive the animation purely by changing a property in the component class. Angular's change detection picks up the change, evaluates the new state name, finds the matching transition, and runs the animation. No imperative animation calls are needed — the animation is fully declarative.</p>
      `,
      "code": "import { Component } from '@angular/core';\nimport { trigger, state, style, transition, animate } from '@angular/animations';\n\n@Component({\n  selector: 'app-sidebar',\n  template: `\n    <!-- Step 2: attach trigger, bind to isExpanded -->\n    <nav [@sidebarExpand]=\"isExpanded ? 'expanded' : 'collapsed'\">\n      <ul>\n        <li>Dashboard</li>\n        @if (isExpanded) {\n          <li>Products</li>\n          <li>Orders</li>\n          <li>Settings</li>\n        }\n      </ul>\n    </nav>\n    <button (click)=\"toggle()\">{{ isExpanded ? 'Collapse' : 'Expand' }}</button>\n  `,\n  // Step 1: define states and transitions\n  animations: [\n    trigger('sidebarExpand', [\n      state('expanded', style({\n        width: '240px',\n        opacity: 1,\n        overflow: 'hidden'\n      })),\n      state('collapsed', style({\n        width: '64px',\n        opacity: 0.8,\n        overflow: 'hidden'\n      })),\n      // Animate in both directions with the same timing\n      transition('expanded <=> collapsed',\n        animate('250ms cubic-bezier(0.4, 0, 0.2, 1)')\n      )\n    ])\n  ]\n})\nexport class SidebarComponent {\n  isExpanded = true;\n\n  // Step 3: change state — Angular handles the rest\n  toggle(): void {\n    this.isExpanded = !this.isExpanded;\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Three-Step Animation Pattern</p><div class=\"flex flex-wrap items-center justify-center gap-2 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 font-semibold text-indigo-700\">1. Define states/transitions</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 font-semibold text-emerald-700\">2. Bind [@trigger] in template</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 font-semibold text-amber-700\">3. Change state property</div></div></div>"
    },
    {
      "id": "animation-states-transitions",
      "title": "What are animation states and transitions?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A traffic light's bulb colors versus the road markings that guide the turn. States are the colors themselves — "this is what red looks like, this is what green looks like." Transitions are the rule for which color can follow which — "you may go from red to green, but the path in between (yellow) takes exactly 3 seconds."</p>
          </div>
        </div>
        <p>In Angular animations, <strong>states</strong> and <strong>transitions</strong> are the two core concepts. A state describes what an element looks like when it is resting in a particular condition. A transition describes how to animate from one state to another.</p>
        <h3>States</h3>
        <p>A state is declared with <code>state('name', style({...}))</code>. The styles defined in a state are the <em>final, resting styles</em> when the element is in that state. Angular applies these styles immediately when the animation completes, and they persist until the state changes again. Use descriptive names that match your business logic — <code>'loading'</code>, <code>'loaded'</code>, <code>'error'</code>, <code>'open'</code>, <code>'closed'</code>.</p>
        <h3>Transitions</h3>
        <p>A transition is declared with <code>transition('from => to', animate(...))</code>. The string expression supports several operators: <code>=></code> (unidirectional), <code>&lt;=&gt;</code> (bidirectional), <code>* => *</code> (any-to-any), <code>:enter</code> (void to any), and <code>:leave</code> (any to void). You can chain multiple conditions with commas: <code>transition('loading => loaded, loading => error', ...)</code>.</p>
        <h3>The void State</h3>
        <p>Angular treats an element that is not present in the DOM as being in the <code>void</code> state. When an element enters the DOM (via <code>@if</code> becoming true), it transitions from <code>void =&gt; *</code>. When it leaves, it transitions from <code>* =&gt; void</code>. The aliases <code>:enter</code> and <code>:leave</code> are shorthand for these patterns.</p>
      `,
      "code": "import { trigger, state, style, transition, animate } from '@angular/animations';\n\n// ---- Real-world example: status badge with distinct states ----\nexport const statusAnimation = trigger('statusBadge', [\n  // Define how the element looks in each state\n  state('loading', style({\n    backgroundColor: '#f59e0b',\n    transform: 'scale(1)',\n    opacity: 0.8\n  })),\n  state('success', style({\n    backgroundColor: '#22c55e',\n    transform: 'scale(1)',\n    opacity: 1\n  })),\n  state('error', style({\n    backgroundColor: '#ef4444',\n    transform: 'scale(1)',\n    opacity: 1\n  })),\n\n  // Transitions between states\n  transition('loading => success', animate('400ms ease-out')),\n  transition('loading => error', animate('400ms ease-out')),\n\n  // Any transition back to loading (retry)\n  transition('* => loading', animate('200ms ease-in')),\n\n  // Enter: badge slides in from top\n  transition(':enter', [\n    style({ opacity: 0, transform: 'translateY(-8px) scale(0.9)' }),\n    animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))\n  ]),\n\n  // Leave: badge fades out\n  transition(':leave', [\n    animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))\n  ])\n]);\n\n@Component({\n  selector: 'app-status-badge',\n  template: `<span [@statusBadge]=\"status\">{{ status }}</span>`,\n  animations: [statusAnimation]\n})\nexport class StatusBadgeComponent {\n  status: 'loading' | 'success' | 'error' = 'loading';\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">States vs Transitions</p><div class=\"flex flex-col items-center gap-2 text-xs\"><div class=\"flex gap-3\"><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 font-semibold text-amber-700\">loading</div><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 font-semibold text-emerald-700\">success</div><div class=\"bg-rose-50 border-2 border-rose-200 rounded-lg px-3 py-2 font-semibold text-rose-700\">error</div></div><p class=\"text-slate-400 text-[11px] mt-1\">states = the resting look &middot; transitions = the path (and duration) between them</p></div></div>"
    },
    {
      "id": "enter-leave-animations",
      "title": "Enter and leave animations (:enter / :leave)",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A stage curtain that doesn't just vanish — it visibly closes over a couple of seconds before the crew removes the set behind it. CSS alone can only style what exists; it can't hold an element in place after it's told to disappear. Angular's <code>:leave</code> is what makes the curtain close smoothly instead of the set just blinking out of existence.</p>
          </div>
        </div>
        <p><code>:enter</code> and <code>:leave</code> are the most commonly used Angular animation aliases. They animate elements as they are <strong>added to or removed from the DOM</strong> — something that is impossible with pure CSS transitions alone (CSS cannot animate removal because the element disappears instantly).</p>
        <p><code>:enter</code> is shorthand for the transition <code>void =&gt; *</code>. It fires when an element is added to the DOM — for example when <code>@if</code> becomes true, or when <code>@for</code> stamps a new item. You use it to define how the element should appear: where it starts (in the <code>style()</code> call) and where it ends up (in the <code>animate()</code> call).</p>
        <p><code>:leave</code> is shorthand for <code>* =&gt; void</code>. It fires when an element is removed from the DOM — when <code>@if</code> becomes false. Angular holds the element in place, plays the leave animation, and only removes the element from the DOM once the animation completes. Without this, the element would simply disappear instantly.</p>
        <h3>Practical Pattern</h3>
        <p>The standard enter/leave pattern is: <strong>start the enter animation from an invisible/offset state and animate to the natural state</strong>. For the leave, <strong>start from the natural state and animate to invisible/offset</strong>. Keep enter and leave animations asymmetric — enters are typically slightly slower than leaves to avoid feeling heavy.</p>
      `,
      "code": "import { Component } from '@angular/core';\nimport { trigger, transition, style, animate } from '@angular/animations';\n\n@Component({\n  selector: 'app-notification-banner',\n  template: `\n    <!-- @fadeSlide trigger fires on element add/remove via @if -->\n    @if (show) {\n      <div [@fadeSlide] class=\"notification-banner\">\n        <span>{{ message }}</span>\n        <button (click)=\"dismiss()\">×</button>\n      </div>\n    }\n  `,\n  animations: [\n    trigger('fadeSlide', [\n      // Element enters: starts invisible + shifted up, animates to natural position\n      transition(':enter', [\n        style({ opacity: 0, transform: 'translateY(-16px)' }),\n        animate('280ms ease-out',\n          style({ opacity: 1, transform: 'translateY(0)' })\n        )\n      ]),\n      // Element leaves: starts from natural position, slides + fades out\n      // Angular holds the element until this animation finishes, THEN removes it\n      transition(':leave', [\n        animate('200ms ease-in',\n          style({ opacity: 0, transform: 'translateY(-8px)' })\n        )\n      ])\n    ])\n  ]\n})\nexport class NotificationBannerComponent {\n  show = false;\n  message = '';\n\n  display(msg: string): void {\n    this.message = msg;\n    this.show = true;\n    setTimeout(() => this.dismiss(), 5000);\n  }\n\n  dismiss(): void {\n    // Angular plays the :leave animation before removing from DOM\n    this.show = false;\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">:enter / :leave — void State Aliases</p><div class=\"flex items-center justify-center gap-3 text-xs\"><div class=\"bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 font-semibold text-slate-500\">void</div><span class=\"text-emerald-500 font-bold\">:enter &rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 font-semibold text-emerald-700\">in DOM</div><span class=\"text-rose-500 font-bold\">:leave &rarr;</span><div class=\"bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 font-semibold text-slate-500\">void</div></div></div>"
    },
    {
      "id": "keyframes-animation",
      "title": "Keyframes — multi-step animations",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A flipbook animation versus a single dissolve. A plain <code>animate()</code> call is like cross-fading from photo A to photo B — smooth, but a straight line between two points. <code>keyframes()</code> is a full flipbook: draw the frame at 0%, 30%, 60%, and 100%, and Angular flips through them in order — necessary for a bounce that overshoots and settles, or a shake that reverses direction mid-animation.</p>
          </div>
        </div>
        <p><code>keyframes()</code> lets you define <strong>multiple intermediate style steps</strong> within a single <code>animate()</code> call. Instead of animating smoothly from A to B, you can animate through A → B → C → D → B, giving you complete control over complex motion like bounces, pulses, and shakes.</p>
        <p>Each <code>style()</code> inside <code>keyframes()</code> takes an <code>offset</code> property between <code>0</code> and <code>1</code> that maps to a percentage of the total animation duration. An offset of <code>0.4</code> means the element should be at that style position 40% of the way through the animation. Angular interpolates smoothly between keyframe stops, just like CSS <code>@keyframes</code>.</p>
        <h3>When to Use Keyframes</h3>
        <p>Use keyframes when the motion needs to overshoot or reverse direction — a bounce that goes past the target and returns, a shake that goes left–right–left–right, a pulse that grows and shrinks. These motions cannot be expressed as a simple A-to-B transition. For straightforward fades and slides, a regular <code>animate()</code> call with a good easing curve (like <code>cubic-bezier</code>) is usually enough.</p>
        <h3>Easing Curves vs Keyframes</h3>
        <p>A common misconception is that you need keyframes for any non-linear motion. Easing functions handle most cases — <code>ease-out</code> for things that decelerate, <code>ease-in</code> for things that accelerate, <code>cubic-bezier</code> for custom curves. Reserve keyframes for multi-directional or multi-phase motion.</p>
      `,
      "code": "import { Component } from '@angular/core';\nimport { trigger, transition, animate, keyframes, style, state } from '@angular/animations';\n\n@Component({\n  selector: 'app-feedback-button',\n  template: `\n    <button\n      [@buttonFeedback]=\"state\"\n      (click)=\"handleClick()\"\n    >\n      {{ state === 'success' ? '✓ Saved!' : state === 'error' ? '✗ Failed' : 'Save' }}\n    </button>\n  `,\n  animations: [\n    trigger('buttonFeedback', [\n      state('idle',    style({ transform: 'scale(1)' })),\n      state('success', style({ transform: 'scale(1)', backgroundColor: '#22c55e' })),\n      state('error',   style({ transform: 'scale(1)', backgroundColor: '#ef4444' })),\n\n      // Success: pulse up then settle\n      transition('idle => success', [\n        animate('500ms', keyframes([\n          style({ transform: 'scale(1)',    offset: 0   }),\n          style({ transform: 'scale(1.15)', offset: 0.3 }),\n          style({ transform: 'scale(0.95)', offset: 0.6 }),\n          style({ transform: 'scale(1)',    offset: 1   })\n        ]))\n      ]),\n\n      // Error: shake left and right\n      transition('idle => error', [\n        animate('500ms', keyframes([\n          style({ transform: 'translateX(0)',    offset: 0    }),\n          style({ transform: 'translateX(-8px)', offset: 0.2  }),\n          style({ transform: 'translateX(8px)',  offset: 0.4  }),\n          style({ transform: 'translateX(-8px)', offset: 0.6  }),\n          style({ transform: 'translateX(4px)',  offset: 0.8  }),\n          style({ transform: 'translateX(0)',    offset: 1    })\n        ]))\n      ]),\n\n      // Reset back to idle\n      transition('* => idle', animate('200ms ease-in'))\n    ])\n  ]\n})\nexport class FeedbackButtonComponent {\n  state: 'idle' | 'success' | 'error' = 'idle';\n\n  handleClick(): void {\n    const success = Math.random() > 0.3;\n    this.state = success ? 'success' : 'error';\n    setTimeout(() => (this.state = 'idle'), 2000);\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Keyframe Offsets — Success Pulse</p><div class=\"flex items-end justify-center gap-3 text-xs\"><div class=\"text-center\"><div class=\"bg-indigo-50 border border-indigo-200 rounded px-2 py-1 font-mono\">scale(1)</div><p class=\"text-slate-400 mt-1\">0%</p></div><div class=\"text-center\"><div class=\"bg-emerald-50 border border-emerald-200 rounded px-2 py-1 font-mono\">scale(1.15)</div><p class=\"text-slate-400 mt-1\">30%</p></div><div class=\"text-center\"><div class=\"bg-amber-50 border border-amber-200 rounded px-2 py-1 font-mono\">scale(0.95)</div><p class=\"text-slate-400 mt-1\">60%</p></div><div class=\"text-center\"><div class=\"bg-indigo-50 border border-indigo-200 rounded px-2 py-1 font-mono\">scale(1)</div><p class=\"text-slate-400 mt-1\">100%</p></div></div></div>"
    },
    {
      "id": "query-and-stagger",
      "title": "query() and stagger() — animating lists",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A marching band peeling onto the field one row at a time instead of the whole band appearing at once. <code>query()</code> finds "all the rows that just walked on" inside the container, and <code>stagger()</code> gives each row a slightly later starting cue than the one before it — the classic cascading reveal.</p>
          </div>
        </div>
        <p><code>query()</code> and <code>stagger()</code> work together to animate multiple child elements in a sequence — the classic "cascade" or "stagger" effect where list items appear one after another with a small delay between each.</p>
        <h3>query()</h3>
        <p><code>query(selector, animation, options)</code> selects child elements inside the animated host element and applies the given animation to all of them simultaneously. The selector can be any CSS selector, or one of Angular's animation-specific aliases: <code>':enter'</code> (elements being added), <code>':leave'</code> (elements being removed), or <code>':animating'</code> (elements currently mid-animation). The <code>{ optional: true }</code> option prevents Angular from throwing an error if the query matches zero elements.</p>
        <h3>stagger()</h3>
        <p><code>stagger(delay, animation)</code> wraps an animation and adds a cumulative delay to each matched element. If delay is <code>80</code>, the first element starts at 0ms, the second at 80ms, the third at 160ms, and so on. Negative stagger values start from the last element and work backwards — useful for leave animations on ordered lists.</p>
        <h3>Trigger Technique</h3>
        <p>The trick that makes this work is binding the trigger not to an individual item but to the container, using a value that changes whenever the list content changes — typically <code>[@listAnim]="items.length"</code>. Every time the length changes, the <code>* => *</code> transition fires, and <code>query(':enter')</code> finds the newly added items to animate in.</p>
      `,
      "code": "import { Component } from '@angular/core';\nimport { trigger, transition, style, animate, query, stagger } from '@angular/animations';\n\ninterface Notification {\n  id: number;\n  message: string;\n  type: 'info' | 'success' | 'warning';\n}\n\n@Component({\n  selector: 'app-notification-list',\n  template: `\n    <!-- Trigger on the container, bound to list length -->\n    <ul [@notifList]=\"notifications.length\">\n      @for (n of notifications; track n.id) {\n        <li [class]=\"'notif notif-' + n.type\">\n          {{ n.message }}\n          <button (click)=\"dismiss(n.id)\">×</button>\n        </li>\n      }\n    </ul>\n  `,\n  animations: [\n    trigger('notifList', [\n      transition('* => *', [\n        // Animate NEW items entering the list\n        query(':enter', [\n          style({ opacity: 0, transform: 'translateX(40px)' }),\n          stagger(80, [\n            animate('300ms ease-out',\n              style({ opacity: 1, transform: 'translateX(0)' })\n            )\n          ])\n        ], { optional: true }),\n\n        // Animate items being removed from the list\n        query(':leave', [\n          stagger(-50, [  // negative = last item leaves first\n            animate('200ms ease-in',\n              style({ opacity: 0, transform: 'translateX(40px)' })\n            )\n          ])\n        ], { optional: true })\n      ])\n    ])\n  ]\n})\nexport class NotificationListComponent {\n  private nextId = 1;\n  notifications: Notification[] = [];\n\n  add(message: string, type: Notification['type'] = 'info'): void {\n    this.notifications = [\n      ...this.notifications,\n      { id: this.nextId++, message, type }\n    ];\n  }\n\n  dismiss(id: number): void {\n    this.notifications = this.notifications.filter(n => n.id !== id);\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Stagger — Cascading Entry Delay</p><div class=\"flex items-end justify-center gap-2 text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded px-2 py-4 font-mono text-indigo-700\">0ms</div><div class=\"bg-emerald-50 border border-emerald-200 rounded px-2 py-4 font-mono text-emerald-700\">80ms</div><div class=\"bg-amber-50 border border-amber-200 rounded px-2 py-4 font-mono text-amber-700\">160ms</div><div class=\"bg-rose-50 border border-rose-200 rounded px-2 py-4 font-mono text-rose-700\">240ms</div></div><p class=\"text-center text-slate-400 text-[11px] mt-2\">each :enter item starts stagger(80) ms after the previous one</p></div>"
    },
    {
      "id": "animation-callbacks",
      "title": "Animation callbacks (start / done events)",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A theater's fire curtain that must fully lower before the crew is allowed to touch the set. You wait for the "curtain fully down" signal (<code>.done</code>) before doing cleanup work like hiding the element from screen readers — doing it earlier would mean yanking the set out from under a still-descending curtain.</p>
          </div>
        </div>
        <p>Angular exposes two event bindings on any element with an animation trigger: <code>(@triggerName.start)</code> fires when the animation begins, and <code>(@triggerName.done)</code> fires when it completes. Both emit an <code>AnimationEvent</code> object containing metadata about what just happened.</p>
        <h3>The AnimationEvent Object</h3>
        <p><code>triggerName</code> — which trigger fired. <code>fromState</code> — the state being animated away from. <code>toState</code> — the state being animated to. <code>totalTime</code> — the animation duration in milliseconds. <code>phaseName</code> — either <code>'start'</code> or <code>'done'</code>. <code>disabled</code> — <code>true</code> if animations are disabled (e.g. with <code>provideNoopAnimations()</code>).</p>
        <h3>Practical Uses for the done Callback</h3>
        <p>The most common use case is acting after a <em>leave</em> animation completes. For example, a modal component might show itself with a fade-in, but it cannot be fully removed from the accessibility tree (with <code>aria-hidden</code> or removed from the DOM) until the fade-out finishes. The <code>.done</code> callback is the correct place to apply post-animation DOM or state cleanup.</p>
        <p>Another use is triggering chained animations — playing animation B only after animation A has fully completed. While Angular's <code>sequence()</code> and <code>group()</code> functions handle most chaining within one trigger, cross-component animation coordination often relies on <code>.done</code> callbacks.</p>
      `,
      "code": "import { Component } from '@angular/core';\nimport { trigger, state, style, transition, animate, AnimationEvent } from '@angular/animations';\n\n@Component({\n  selector: 'app-modal',\n  template: `\n    @if (!isFullyHidden) {\n      <div\n        [@modalAnim]=\"isVisible ? 'visible' : 'hidden'\"\n        (@modalAnim.start)=\"onAnimStart($event)\"\n        (@modalAnim.done)=\"onAnimDone($event)\"\n        [attr.aria-hidden]=\"!isVisible || null\"\n        role=\"dialog\"\n      >\n        <div class=\"modal-content\">\n          <ng-content></ng-content>\n          <button (click)=\"close()\">Close</button>\n        </div>\n      </div>\n    }\n  `,\n  animations: [\n    trigger('modalAnim', [\n      state('visible', style({ opacity: 1, transform: 'scale(1)' })),\n      state('hidden',  style({ opacity: 0, transform: 'scale(0.95)' })),\n      transition('hidden => visible', animate('250ms ease-out')),\n      transition('visible => hidden', animate('200ms ease-in'))\n    ])\n  ]\n})\nexport class ModalComponent {\n  isVisible = false;\n  isFullyHidden = true; // controls @if — keeps element in DOM during leave animation\n\n  open(): void {\n    this.isFullyHidden = false;  // insert into DOM\n    setTimeout(() => (this.isVisible = true), 0);\n  }\n\n  close(): void {\n    this.isVisible = false;  // triggers leave animation\n    // isFullyHidden set to true only after animation completes (in onAnimDone)\n  }\n\n  onAnimStart(event: AnimationEvent): void {\n    console.log(`Modal animation started: ${event.fromState} -> ${event.toState}`);\n  }\n\n  onAnimDone(event: AnimationEvent): void {\n    console.log(`Modal animation done after ${event.totalTime}ms`);\n\n    if (event.toState === 'hidden') {\n      // NOW safe to remove from DOM and accessibility tree\n      this.isFullyHidden = true;\n    }\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">start / done Callback Timing</p><div class=\"flex items-center justify-center gap-3 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 font-semibold text-indigo-700\">state change</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 font-semibold text-amber-700\">.start fires</div><span class=\"text-slate-300\">animating&hellip;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 font-semibold text-emerald-700\">.done fires</div></div></div>"
    }
  ]
});
