window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "angular-material",
  "title": "Angular Material",
  "icon": "bi bi-palette",
  "questions": [
    {
      id: "angular-22-standard-material-upgrade",
      title: "Angular 22 standard for Angular Material",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>flat-pack furniture catalog</strong> (Angular Material) sitting on top of a hardware supplier's raw parts bin (the CDK). Most days you order the pre-built dresser: styled, tested, ready to assemble. Some days you need custom furniture with the same reliable hinges and sliding rails but your own design &mdash; that's when you go straight to the hardware bin instead of the catalog.</p>
          </div>
        </div>
        <p>Angular 22-ready Material usage is standalone, tree-shakeable, accessible, and token-themed. Import only the Material components a standalone component actually needs, reach for CDK primitives when you want behavior without Material's visual styling, and treat theming as design tokens rather than scattered CSS overrides.</p>
        <h3>Modern Material checklist</h3>
        <ul>
          <li>Install with <code>ng add @angular/material</code>.</li>
          <li>Import Material modules directly in standalone components.</li>
          <li>Use Material 3 theming and CSS custom properties where supported.</li>
          <li>Use CDK overlay, a11y, drag-drop, and virtual scroll for custom design systems.</li>
          <li>Use <code>provideNoopAnimations()</code> in tests.</li>
        </ul>
      `,
      code: `@Component({
  selector: 'app-user-editor',
  imports: [MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  template: '<button mat-raised-button (click)="open()">Edit user</button>'
})
export class UserEditorComponent {
  private readonly dialog = inject(MatDialog);

  open(): void {
    this.dialog.open(UserDialogComponent, {
      width: '480px',
      autoFocus: 'first-tabbable'
    });
  }
}`,
      language: "typescript",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Material Catalog on Top of CDK Hardware</p><div class="flex flex-col items-center gap-2 text-xs"><div class="bg-indigo-600 text-white rounded-lg px-4 py-2 font-semibold">Angular Material (MatButton, MatDialog, MatTable...)</div><div class="text-slate-300">&darr; built on</div><div class="bg-amber-50 border-2 border-amber-200 rounded-lg px-4 py-2 font-semibold text-amber-700">Angular CDK (overlay, a11y, drag-drop, virtual scroll)</div></div></div>`
    },
    {
      "id": "what-is-angular-material",
      "title": "What is Angular Material and the CDK?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Adopting a <strong>hotel chain's design manual</strong> instead of decorating every branch from scratch. Every lobby, room, and elevator across the chain follows the same visual language and interaction rules (Material Design 3), so guests instantly know how things work. Underneath that manual is the actual engineering &mdash; the door hinges, the elevator mechanism &mdash; that's the CDK: the load-bearing behavior with none of the branded decor.</p>
          </div>
        </div>
        <p><strong>Angular Material</strong> is Google's official UI component library for Angular. It implements the <a href="https://m3.material.io/">Material Design 3</a> specification &mdash; a comprehensive design system covering visual language, motion, and interaction patterns. Angular Material gives you production-quality, accessible, cross-browser-tested components (buttons, dialogs, tables, form controls, navigation) out of the box.</p>
        <p>Install it with one command: <code>ng add @angular/material</code>. The schematic installs the package, prompts for a prebuilt theme, configures animations, and adds the necessary global styles. From there, every component is imported individually &mdash; you only import what you use, so the bundle carries no dead code from the library.</p>
        <h3>The Component Dev Kit (CDK)</h3>
        <p>Underneath Angular Material sits the <strong>Angular CDK</strong> (<code>@angular/cdk</code>) &mdash; framework-level primitives that require careful cross-browser work, shipped without any imposed visual styling. Material's dialog, overlay, virtual scroll, drag-and-drop, and accessibility utilities are all built on CDK primitives. You can use the CDK directly when you want the behavior (focus trapping, overlay positioning, virtual scrolling) but want to supply your own design system's look.</p>
        <h3>Material 3 (M3) theming</h3>
        <p>Angular Material 17+ ships full Material 3 support: a token-based theming system using CSS custom properties that replaced the older SCSS palette approach. Themes are defined once and cascade automatically to every Material component through CSS variables.</p>
      `,
      "code": "# Install Angular Material (adds package, configures theme, animations, global styles)\nng add @angular/material\n# Prompts: choose theme (Indigo/Pink, Deep Purple/Amber, or custom),\n# enable animations, include typography styles\n\n# ---- app.component.ts — standalone import pattern ----\nimport { Component } from '@angular/core';\nimport { MatButtonModule } from '@angular/material/button';\nimport { MatCardModule } from '@angular/material/card';\nimport { MatInputModule } from '@angular/material/input';\nimport { MatFormFieldModule } from '@angular/material/form-field';\nimport { MatIconModule } from '@angular/material/icon';\n\n@Component({\n  selector: 'app-root',\n  // Import only the Material modules this component actually uses\n  imports: [MatButtonModule, MatCardModule, MatInputModule,\n            MatFormFieldModule, MatIconModule],\n  template: `\n    <mat-card>\n      <mat-card-header>\n        <mat-card-title>Sign In</mat-card-title>\n      </mat-card-header>\n      <mat-card-content>\n        <mat-form-field appearance=\"outline\" class=\"full-width\">\n          <mat-label>Email</mat-label>\n          <input matInput type=\"email\" placeholder=\"you@example.com\" />\n          <mat-icon matSuffix>email</mat-icon>\n        </mat-form-field>\n      </mat-card-content>\n      <mat-card-actions>\n        <button mat-raised-button color=\"primary\">Sign In</button>\n        <button mat-button>Cancel</button>\n      </mat-card-actions>\n    </mat-card>\n  `\n})\nexport class AppComponent {}",
      "language": "bash",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Import Only What You Use</p><div class=\"grid grid-cols-2 md:grid-cols-3 gap-2 text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-center font-semibold text-indigo-700\">MatButtonModule</div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center font-semibold text-emerald-700\">MatCardModule</div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-2 text-center font-semibold text-amber-700\">MatInputModule</div><div class=\"bg-rose-50 border border-rose-200 rounded-lg p-2 text-center font-semibold text-rose-700\">MatFormFieldModule</div><div class=\"bg-purple-50 border border-purple-200 rounded-lg p-2 text-center font-semibold text-purple-700\">MatIconModule</div><div class=\"bg-slate-100 border border-slate-300 rounded-lg p-2 text-center font-semibold text-slate-500\">...unused modules never bundled</div></div></div>"
    },
    {
      "id": "commonly-used-material-components",
      "title": "Core Material components and their use cases",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>hardware store with labeled aisles</strong>. You don't need to know every SKU on the shelf &mdash; you need to know which aisle to walk down. Need a fastener for user input? Form controls aisle. Need something for getting around the store? Navigation aisle. Need a way to display a big list of inventory? Data display aisle. Knowing the aisle map is more valuable than memorizing every product.</p>
          </div>
        </div>
        <p>Angular Material's component catalog covers virtually every UI primitive a business application needs. Rather than trying to use them all, the useful skill is knowing which module to reach for so you can compose your UI from focused, purpose-specific pieces.</p>
        <h3>Form controls</h3>
        <p>The form control family centers on <code>MatFormField</code> &mdash; a wrapper providing the floating label, prefix/suffix icon slots, hint text, and error message display. Inside it goes an <code>input</code> with <code>matInput</code>, a <code>mat-select</code>, a <code>mat-datepicker-input</code>, or a <code>mat-chip-grid</code>. Reactive forms integrate naturally: bind <code>[formControl]</code> to a Material input and <code>MatFormField</code> automatically reflects validation state.</p>
        <h3>Navigation</h3>
        <p><code>MatToolbar</code> provides the top application bar. <code>MatSidenav</code>/<code>MatDrawer</code> implement collapsible side panels with configurable open/close animations. <code>MatTabGroup</code> renders a tabbed interface. All navigation components are keyboard-accessible with ARIA attributes wired in automatically.</p>
        <h3>Data display</h3>
        <p><code>MatTable</code> is a flexible data table working with any <code>DataSource</code>-compatible source &mdash; RxJS observables, HTTP responses, or static arrays. Pair it with <code>MatSort</code> for column sorting and <code>MatPaginator</code> for pagination. <code>MatList</code> covers simpler item lists and menus.</p>
        <h3>Overlays and feedback</h3>
        <p><code>MatDialog</code> opens accessible modal dialogs with focus trapping. <code>MatSnackBar</code> shows brief informational toasts. <code>MatTooltip</code> adds accessible hover tooltips. <code>MatMenu</code> and <code>MatSelect</code> both use the CDK overlay system for correct positioning relative to their trigger element.</p>
      `,
      "code": "// ---- Reactive form with MatFormField error display ----\nimport { Component, inject } from '@angular/core';\nimport { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';\nimport { MatFormFieldModule } from '@angular/material/form-field';\nimport { MatInputModule } from '@angular/material/input';\nimport { MatButtonModule } from '@angular/material/button';\nimport { MatSelectModule } from '@angular/material/select';\n\n@Component({\n  selector: 'app-registration',\n  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule,\n            MatButtonModule, MatSelectModule],\n  template: `\n    <form [formGroup]=\"form\" (ngSubmit)=\"submit()\">\n      <mat-form-field appearance=\"outline\">\n        <mat-label>Full Name</mat-label>\n        <input matInput formControlName=\"name\" />\n        <!-- MatFormField reads the formControl's validity and shows this automatically -->\n        <mat-error *ngIf=\"form.get('name')?.hasError('required')\">\n          Name is required\n        </mat-error>\n        <mat-error *ngIf=\"form.get('name')?.hasError('minlength')\">\n          Name must be at least 2 characters\n        </mat-error>\n      </mat-form-field>\n\n      <mat-form-field appearance=\"outline\">\n        <mat-label>Role</mat-label>\n        <mat-select formControlName=\"role\">\n          <mat-option value=\"admin\">Administrator</mat-option>\n          <mat-option value=\"editor\">Editor</mat-option>\n          <mat-option value=\"viewer\">Viewer</mat-option>\n        </mat-select>\n      </mat-form-field>\n\n      <button mat-raised-button color=\"primary\"\n              type=\"submit\" [disabled]=\"form.invalid\">\n        Register\n      </button>\n    </form>\n  `\n})\nexport class RegistrationComponent {\n  form = inject(FormBuilder).group({\n    name: ['', [Validators.required, Validators.minLength(2)]],\n    role: ['viewer', Validators.required]\n  });\n\n  submit(): void {\n    if (this.form.valid) {\n      console.log(this.form.value);\n    }\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">The Aisle Map</p><div class=\"grid grid-cols-2 md:grid-cols-4 gap-2 text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded-lg p-2 text-center\"><p class=\"font-bold text-indigo-700\">Form Controls</p><p class=\"text-slate-500 mt-1\">FormField, Select, Input</p></div><div class=\"bg-emerald-50 border border-emerald-200 rounded-lg p-2 text-center\"><p class=\"font-bold text-emerald-700\">Navigation</p><p class=\"text-slate-500 mt-1\">Toolbar, Sidenav, Tabs</p></div><div class=\"bg-amber-50 border border-amber-200 rounded-lg p-2 text-center\"><p class=\"font-bold text-amber-700\">Data Display</p><p class=\"text-slate-500 mt-1\">Table, List, Sort</p></div><div class=\"bg-rose-50 border border-rose-200 rounded-lg p-2 text-center\"><p class=\"font-bold text-rose-700\">Overlays &amp; Feedback</p><p class=\"text-slate-500 mt-1\">Dialog, SnackBar, Tooltip</p></div></div></div>"
    },
    {
      "id": "theming-in-angular-material",
      "title": "Theming Angular Material with Material 3",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>paint-by-numbers system for an entire house</strong>. Instead of walking into every room with a brush and matching colors by eye, you declare once "number 3 is Sunset Orange" and every wall, door, and trim labeled 3 repaints itself automatically. M3's design tokens (CSS custom properties like <code>--mat-filled-button-container-color</code>) are those numbered labels &mdash; you never touch a wall directly, you update the palette.</p>
          </div>
        </div>
        <p>Angular Material's theming system lets you customize every component's colors, typography, and density from a single configuration. In Angular Material 17+, the recommended approach is <strong>Material 3 (M3)</strong> theming via SCSS, which generates a comprehensive set of CSS custom properties that every Material component reads automatically.</p>
        <h3>How M3 theming works</h3>
        <p>You define a theme by specifying color palettes (primary, secondary, tertiary, error) with the provided SCSS functions. The <code>mat.theme()</code> mixin outputs hundreds of tokens consumed by component styles. You never target component internals directly in your own CSS &mdash; you override the published tokens instead.</p>
        <h3>Light and dark mode</h3>
        <p>Material 3 natively supports system-level dark mode. Define both a light and dark theme, scope the dark theme to <code>.dark-theme</code> (or a media query), and every Material component switches colors automatically when the class is applied or <code>prefers-color-scheme: dark</code> matches.</p>
        <h3>Component-level density</h3>
        <p>Material 3 supports a density scale (-1, -2, -3) per component. Reducing density makes components more compact, useful for data-dense UIs like admin dashboards where smaller form fields and buttons matter.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Overriding a Material component's internal CSS class directly (e.g. targeting <code>.mdc-button</code> selectors by hand) instead of overriding its published token breaks the moment Material's internal markup changes in a minor release. Tokens are the public, stable API; internal class names are not &mdash; treat them as implementation detail you don't touch.</p>
          </div>
        </div>
      `,
      "code": "// styles.scss — Material 3 theming\n@use '@angular/material' as mat;\n\n// Include Material's base styles once\n@include mat.core();\n\n// Define your color scheme using M3 palettes\n// You can use any of Material's predefined palettes, or define custom tones\n$light-theme: mat.define-theme((\n  color: (\n    theme-type: light,\n    primary: mat.$violet-palette,      // primary color\n    tertiary: mat.$rose-palette,       // tertiary/accent color\n  ),\n  typography: (\n    brand-family: 'Inter, sans-serif',\n    bold-weight: 600,\n  ),\n  density: (\n    scale: 0,  // default density\n  ),\n));\n\n$dark-theme: mat.define-theme((\n  color: (\n    theme-type: dark,\n    primary: mat.$violet-palette,\n    tertiary: mat.$rose-palette,\n  ),\n));\n\n// Apply light theme to the whole app\n:root {\n  @include mat.all-component-themes($light-theme);\n}\n\n// Apply dark theme when .dark-theme class is set on body\n.dark-theme {\n  @include mat.all-component-color-themes($dark-theme);\n}\n\n// Respect system preference automatically\n@media (prefers-color-scheme: dark) {\n  :root:not(.light-theme) {\n    @include mat.all-component-color-themes($dark-theme);\n  }\n}\n\n// Override specific component density in a feature area\n.compact-form {\n  @include mat.form-field-density(-2);\n  @include mat.button-density(-1);\n}",
      "language": "scss",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Token Flows to Every Component</p><div class=\"flex flex-col items-center gap-2 text-xs\"><div class=\"bg-indigo-600 text-white rounded-lg px-4 py-2 font-semibold\">mat.theme() — one definition</div><div class=\"text-slate-300\">&darr;</div><div class=\"grid grid-cols-3 gap-2 w-full max-w-sm\"><div class=\"bg-indigo-50 border border-indigo-200 rounded px-2 py-1 text-center\">MatButton</div><div class=\"bg-indigo-50 border border-indigo-200 rounded px-2 py-1 text-center\">MatCard</div><div class=\"bg-indigo-50 border border-indigo-200 rounded px-2 py-1 text-center\">MatInput</div></div></div></div>"
    },
    {
      "id": "mat-dialog",
      "title": "MatDialog — opening and communicating with dialogs",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>hotel front desk that manages a private meeting room</strong>. It hands the guest a folder of context on the way in (<code>MAT_DIALOG_DATA</code>), keeps the door locked so no one wanders off mid-meeting (focus trapping), and walks the guest right back to the exact chair they were sitting in when they leave (focus restoration). When the meeting ends, the desk hands you a summary slip on the way out (<code>afterClosed()</code>'s result) &mdash; even if the guest just walked out without saying anything (<code>undefined</code>).</p>
          </div>
        </div>
        <p><code>MatDialog</code> is Angular Material's modal dialog service. Unlike a plain overlay, it manages the full dialog lifecycle: rendering the component inside an overlay, trapping keyboard focus within it, restoring focus to the trigger element on close, and offering a clean API for passing data in and getting results out.</p>
        <h3>Dialog data flow</h3>
        <p>Open a dialog with <code>this.dialog.open(MyDialogComponent, { data: { ... } })</code>. The dialog component injects <code>MAT_DIALOG_DATA</code> to read the passed data. When the user confirms or cancels, it calls <code>this.dialogRef.close(result)</code>. Back at the call site, <code>dialogRef.afterClosed()</code> emits the result once &mdash; including <code>undefined</code> if the dialog was dismissed via Escape or a backdrop click.</p>
        <h3>Accessibility</h3>
        <p>MatDialog automatically sets <code>role="dialog"</code>, <code>aria-modal="true"</code>, and manages focus. The CDK's <code>cdkFocusInitial</code> directive lets you designate which element receives focus when the dialog opens &mdash; useful for pre-focusing the "Confirm" button or the first input, depending on the interaction.</p>
      `,
      "code": "import { Component, inject } from '@angular/core';\nimport { MatDialog, MatDialogModule, MatDialogRef,\n         MAT_DIALOG_DATA } from '@angular/material/dialog';\nimport { MatButtonModule } from '@angular/material/button';\n\n// ---- Delete confirmation dialog ----\nexport interface DeleteDialogData { itemName: string; }\nexport interface DeleteDialogResult { confirmed: boolean; }\n\n@Component({\n  selector: 'app-delete-dialog',\n  imports: [MatDialogModule, MatButtonModule],\n  template: `\n    <h2 mat-dialog-title>Delete \"{{ data.itemName }}\"?</h2>\n    <mat-dialog-content>\n      <p>This action cannot be undone.</p>\n    </mat-dialog-content>\n    <mat-dialog-actions align=\"end\">\n      <button mat-button (click)=\"cancel()\">Cancel</button>\n      <!-- cdkFocusInitial puts initial focus on the destructive action -->\n      <button mat-raised-button color=\"warn\"\n              cdkFocusInitial (click)=\"confirm()\">Delete</button>\n    </mat-dialog-actions>\n  `\n})\nexport class DeleteDialogComponent {\n  data = inject<DeleteDialogData>(MAT_DIALOG_DATA);\n  private dialogRef = inject<MatDialogRef<DeleteDialogComponent, DeleteDialogResult>>(\n    MatDialogRef\n  );\n\n  confirm(): void { this.dialogRef.close({ confirmed: true }); }\n  cancel(): void  { this.dialogRef.close({ confirmed: false }); }\n}\n\n// ---- Component that opens the dialog ----\n@Component({\n  selector: 'app-product-list',\n  imports: [MatButtonModule],\n  template: `\n    <button mat-icon-button (click)=\"deleteProduct('Laptop')\">\n      Delete\n    </button>\n  `\n})\nexport class ProductListComponent {\n  private dialog = inject(MatDialog);\n\n  deleteProduct(name: string): void {\n    const ref = this.dialog.open(DeleteDialogComponent, {\n      width: '400px',\n      data: { itemName: name } satisfies DeleteDialogData,\n      disableClose: true  // prevent accidental dismissal by clicking backdrop\n    });\n\n    ref.afterClosed().subscribe((result?: DeleteDialogResult) => {\n      if (result?.confirmed) {\n        console.log(`Deleting: ${name}`);\n        // call delete service\n      }\n    });\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Dialog Data Round-Trip</p><div class=\"flex flex-wrap items-center justify-center gap-2 text-xs\"><div class=\"bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700\">dialog.open(data)</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700\">MAT_DIALOG_DATA injected</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-rose-50 border-2 border-rose-200 rounded-lg px-3 py-2 text-center font-semibold text-rose-700\">dialogRef.close(result)</div><span class=\"text-slate-300\">&rarr;</span><div class=\"bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700\">afterClosed() emits</div></div></div>"
    },
    {
      "id": "mat-table",
      "title": "MatTable with sorting and pagination",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>printing press with interchangeable plates</strong>. Each column (name, price, stock) is its own plate you can slot in or pull out without touching the press frame that holds the rows together. Want to drop the "Category" column for mobile? Pull that one plate. The <code>displayedColumns</code> array is simply the order you load the plates into the press before printing a row.</p>
          </div>
        </div>
        <p><code>MatTable</code> is a powerful, flexible data table built on the CDK table infrastructure. Unlike a plain <code>&lt;table&gt;</code> with <code>*ngFor</code>, MatTable uses a <strong>DataSource</strong> pattern that decouples data retrieval from rendering &mdash; the data source handles fetching, sorting, filtering, and pagination, while MatTable handles rendering rows efficiently.</p>
        <h3>Column definition pattern</h3>
        <p>MatTable uses a declarative column system. For each column, define a <code>matColumnDef</code> with a header cell (<code>*matHeaderCellDef</code>) and a data cell (<code>*matCellDef</code>). Specify which columns to display and in what order via the <code>displayedColumns</code> array bound to the table &mdash; showing/hiding columns dynamically is then trivial.</p>
        <h3>MatTableDataSource</h3>
        <p>For client-side tables, <code>MatTableDataSource</code> is a convenience class that wraps an array and automatically wires up <code>MatSort</code> and <code>MatPaginator</code>. Assigning to <code>dataSource.data</code> triggers a re-render. For server-side tables (sorting and pagination making API calls), implement a custom <code>DataSource</code> that manages its own HTTP requests.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Assigning <code>dataSource.sort</code> and <code>dataSource.paginator</code> inside <code>ngOnInit()</code> instead of <code>ngAfterViewInit()</code> silently fails, because <code>@ViewChild</code> references for <code>MatSort</code>/<code>MatPaginator</code> aren't populated until after the view initializes. The table will render but sorting and pagination just won't do anything &mdash; a quiet bug with no console error.</p>
          </div>
        </div>
      `,
      "code": "import { Component, OnInit, ViewChild, signal } from '@angular/core';\nimport { MatTableModule, MatTableDataSource } from '@angular/material/table';\nimport { MatSortModule, MatSort } from '@angular/material/sort';\nimport { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';\nimport { MatInputModule } from '@angular/material/input';\nimport { MatFormFieldModule } from '@angular/material/form-field';\n\ninterface Product {\n  id: number;\n  name: string;\n  category: string;\n  price: number;\n  stock: number;\n}\n\n@Component({\n  selector: 'app-product-table',\n  imports: [MatTableModule, MatSortModule, MatPaginatorModule,\n            MatInputModule, MatFormFieldModule],\n  template: `\n    <mat-form-field appearance=\"outline\">\n      <mat-label>Filter</mat-label>\n      <input matInput (input)=\"applyFilter($event)\" placeholder=\"Search products...\" />\n    </mat-form-field>\n\n    <table mat-table [dataSource]=\"dataSource\" matSort>\n      <!-- Define each column -->\n      <ng-container matColumnDef=\"name\">\n        <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>\n        <td mat-cell *matCellDef=\"let row\">{{ row.name }}</td>\n      </ng-container>\n\n      <ng-container matColumnDef=\"category\">\n        <th mat-header-cell *matHeaderCellDef mat-sort-header>Category</th>\n        <td mat-cell *matCellDef=\"let row\">{{ row.category }}</td>\n      </ng-container>\n\n      <ng-container matColumnDef=\"price\">\n        <th mat-header-cell *matHeaderCellDef mat-sort-header>Price</th>\n        <td mat-cell *matCellDef=\"let row\">{{ row.price | currency }}</td>\n      </ng-container>\n\n      <ng-container matColumnDef=\"stock\">\n        <th mat-header-cell *matHeaderCellDef mat-sort-header>Stock</th>\n        <td mat-cell *matCellDef=\"let row\"\n            [class.low-stock]=\"row.stock < 10\">{{ row.stock }}</td>\n      </ng-container>\n\n      <!-- Render header and data rows -->\n      <tr mat-header-row *matHeaderRowDef=\"displayedColumns\"></tr>\n      <tr mat-row *matRowDef=\"let row; columns: displayedColumns;\"></tr>\n\n      <!-- No data row -->\n      <tr class=\"mat-mdc-row\" *matNoDataRow>\n        <td [attr.colspan]=\"displayedColumns.length\" class=\"no-data\">\n          No products match \"{{ filterValue() }}\"\n        </td>\n      </tr>\n    </table>\n\n    <mat-paginator [pageSizeOptions]=\"[10, 25, 50]\"\n                   showFirstLastButtons>\n    </mat-paginator>\n  `\n})\nexport class ProductTableComponent implements OnInit {\n  @ViewChild(MatSort) sort!: MatSort;\n  @ViewChild(MatPaginator) paginator!: MatPaginator;\n\n  displayedColumns = ['name', 'category', 'price', 'stock'];\n  dataSource = new MatTableDataSource<Product>();\n  filterValue = signal('');\n\n  ngOnInit(): void {\n    this.dataSource.data = this.getProducts();\n  }\n\n  ngAfterViewInit(): void {\n    // Wire up sort and pagination — must happen AFTER the view initializes,\n    // otherwise @ViewChild(MatSort)/@ViewChild(MatPaginator) are still undefined\n    this.dataSource.sort = this.sort;\n    this.dataSource.paginator = this.paginator;\n  }\n\n  applyFilter(event: Event): void {\n    const value = (event.target as HTMLInputElement).value.trim().toLowerCase();\n    this.filterValue.set(value);\n    this.dataSource.filter = value;\n    // Reset to first page after filter changes\n    this.dataSource.paginator?.firstPage();\n  }\n\n  private getProducts(): Product[] {\n    return [\n      { id: 1, name: 'Laptop Pro', category: 'Electronics', price: 1299, stock: 5 },\n      { id: 2, name: 'Wireless Mouse', category: 'Accessories', price: 49, stock: 120 },\n      { id: 3, name: 'USB-C Hub', category: 'Accessories', price: 79, stock: 8 },\n    ];\n  }\n}",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Column Plates Slot Into the Press</p><div class=\"flex flex-wrap items-center justify-center gap-2 text-xs\"><div class=\"bg-indigo-50 border border-indigo-200 rounded px-2 py-1 font-semibold text-indigo-700\">name</div><div class=\"bg-emerald-50 border border-emerald-200 rounded px-2 py-1 font-semibold text-emerald-700\">category</div><div class=\"bg-amber-50 border border-amber-200 rounded px-2 py-1 font-semibold text-amber-700\">price</div><div class=\"bg-rose-50 border border-rose-200 rounded px-2 py-1 font-semibold text-rose-700\">stock</div></div><p class=\"text-center text-slate-400 mt-3\">displayedColumns = [name, category, price, stock] &mdash; order controls render order</p></div>"
    }
  ]
});
