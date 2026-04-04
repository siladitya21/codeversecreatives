window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "angular-material",
  "title": "Angular Material",
  "icon": "bi bi-palette",
  "questions": [
    {
      "id": "what-is-angular-material",
      "title": "What is Angular Material?",
      "explanation": `
          <p><strong>Angular Material</strong> is a UI component library that implements Google's Material Design specification. It provides a set of high-quality, pre-built UI components (like buttons, cards, forms, navigation) that are ready to use in your Angular applications.</p>
          <h3>Key Features</h3>
          <ul>
            <li><strong>Material Design:</strong> Adheres to Google's visual, motion, and interaction design guidelines.</li>
            <li><strong>Accessible:</strong> Built with accessibility (a11y) in mind, including ARIA support.</li>
            <li><strong>Theming:</strong> Easily customizable with a robust theming system.</li>
            <li><strong>Cross-browser:</strong> Works consistently across all modern browsers.</li>
            <li><strong>CDK (Component Dev Kit):</strong> Provides low-level primitives for building custom components.</li>
          </ul>
        `,
      "code": "// To add Angular Material to your project:\n// ng add @angular/material",
      "language": "bash",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Angular Material Stack</p><div class="flex flex-col items-center gap-2"><div class="bg-indigo-600 text-white p-3 rounded-lg text-xs font-bold shadow-lg">Angular Material Components</div><div class="text-slate-300">&darr;</div><div class="bg-emerald-50 border-2 border-emerald-200 p-3 rounded-lg text-xs">Angular CDK</div><div class="text-slate-300">&darr;</div><div class="bg-amber-50 border-2 border-amber-200 p-3 rounded-lg text-xs">Web Platform (HTML/CSS/JS)</div></div></div>`
    },
    {
      "id": "commonly-used-material-components",
      "title": "Commonly used Material components",
      "explanation": `
          <p>Angular Material offers a wide range of components for various UI needs. Here are some of the most frequently used:</p>
          <ul>
            <li><strong>Buttons:</strong> <code>&lt;button mat-button&gt;</code>, <code>&lt;button mat-raised-button&gt;</code></li>
            <li><strong>Form Controls:</strong> <code>&lt;mat-form-field&gt;</code>, <code>&lt;input matInput&gt;</code>, <code>&lt;mat-select&gt;</code>, <code>&lt;mat-checkbox&gt;</code></li>
            <li><strong>Navigation:</strong> <code>&lt;mat-toolbar&gt;</code>, <code>&lt;mat-sidenav&gt;</code>, <code>&lt;mat-tab-group&gt;</code></li>
            <li><strong>Layout:</strong> <code>&lt;mat-card&gt;</code>, <code>&lt;mat-divider&gt;</code>, <code>&lt;mat-grid-list&gt;</code></li>
            <li><strong>Popups & Modals:</strong> <code>&lt;mat-dialog&gt;</code>, <code>&lt;mat-menu&gt;</code>, <code>&lt;mat-tooltip&gt;</code></li>
            <li><strong>Data Display:</strong> <code>&lt;mat-table&gt;</code>, <code>&lt;mat-list&gt;</code>, <code>&lt;mat-icon&gt;</code></li>
          </ul>
        `,
      "code": "import { MatButtonModule } from '@angular/material/button';\nimport { MatInputModule } from '@angular/material/input';\n\n@NgModule({\n  imports: [MatButtonModule, MatInputModule],\n  // ...\n})\nexport class AppModule { }\n\n// Usage in template:\n// <button mat-raised-button color=\"primary\">Click Me</button>\n// <mat-form-field><input matInput placeholder=\"Name\"></mat-form-field>",
      "language": "typescript"
    },
    {
      "id": "theming-in-angular-material",
      "title": "Theming in Angular Material",
      "explanation": `
          <p>Angular Material provides a powerful theming system that allows you to customize the colors, typography, and density of your components to match your brand or application's aesthetic.</p>
          <p>Themes are defined using Sass (SCSS) and consist of color palettes (primary, accent, warn), typography configurations, and density settings.</p>
          <h3>Steps for Theming</h3>
          <ol>
            <li><strong>Define Palettes:</strong> Create primary, accent, and warn color palettes using <code>mat.define-palette()</code>.</li>
            <li><strong>Create Theme:</strong> Combine palettes into a light or dark theme using <code>mat.define-light-theme()</code> or <code>mat.define-dark-theme()</code>.</li>
            <li><strong>Include Theme:</strong> Include the theme in your global styles (e.g., <code>styles.scss</code>).</li>
          </ol>
        `,
      "code": "// styles.scss\n@use '@angular/material' as mat;\n\n@include mat.core();\n\n$my-primary: mat.define-palette(mat.$indigo-palette);\n$my-accent: mat.define-palette(mat.$pink-palette, A200, A100, A400);\n$my-warn: mat.define-palette(mat.$red-palette);\n\n$my-theme: mat.define-light-theme((\n  color: (\n    primary: $my-primary,\n    accent: $my-accent,\n    warn: $my-warn,\n  ),\n  typography: mat.define-typography-config(),\n  density: 0,\n));\n\n@include mat.all-component-themes($my-theme);",
      "language": "scss",
      "diagram": `<div class="diagram-wrap"><div class="max-w-md mx-auto bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center"><p class="text-xs font-bold text-indigo-700 uppercase mb-2">Theming Hierarchy</p><div class="flex flex-col items-center gap-2"><div class="bg-white p-2 rounded text-[10px]">Palettes (Primary, Accent, Warn)</div><div class="text-slate-300">&darr;</div><div class="bg-white p-2 rounded text-[10px]">Theme (Light/Dark)</div><div class="text-slate-300">&darr;</div><div class="bg-white p-2 rounded text-[10px]">Component Styles</div></div></div>`
    },
    {
      "id": "cdk-component-dev-kit",
      "title": "What is CDK (Component Dev Kit)?",
      "explanation": `
          <p>The <strong>Angular CDK (Component Dev Kit)</strong> is a set of tools that provide high-quality, tested behaviors for building UI components without imposing any Material Design styles.</p>
          <p>It's the foundation upon which Angular Material itself is built. If you need to create custom UI components with complex interactions (like drag-and-drop, overlays, virtual scrolling, or accessibility features) but don't want the Material Design look and feel, the CDK is your go-to.</p>
          <h3>Common CDK Modules</h3>
          <ul>
            <li><code>@angular/cdk/a11y</code>: Accessibility utilities (FocusTrap, LiveAnnouncer).</li>
            <li><code>@angular/cdk/overlay</code>: Tools for creating floating panels (dialogs, tooltips).</li>
            <li><code>@angular/cdk/drag-drop</code>: Drag and drop functionality.</li>
            <li><code>@angular/cdk/table</code>: Data table primitives without UI.</li>
            <li><code>@angular/cdk/portal</code>: Renders dynamic content into an arbitrary DOM location.</li>
          </ul>
        `,
      "code": "import { DragDropModule } from '@angular/cdk/drag-drop';\n\n@NgModule({\n  imports: [DragDropModule],\n  // ...\n})\nexport class AppModule { }\n\n// Usage in template:\n// <div cdkDrag>Drag me!</div>",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><div class="max-w-md mx-auto bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center"><p class="text-xs font-bold text-emerald-700 uppercase mb-2">CDK: Building Blocks</p><p class="text-[10px] text-slate-500">Provides behaviors (e.g., drag-drop, overlay) without styling.</p><p class="text-[10px] text-slate-500 mt-2">Angular Material uses CDK. You can too!</p></div></div>`
    }
  ]
});