window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "i18n",
  "title": "Internationalization (i18n)",
  "icon": "bi bi-translate",
  "questions": [
    {
      "id": "what-is-i18n",
      "title": "What is i18n in Angular?",
      "explanation": `
          <p><strong>Internationalization (i18n)</strong> is the process of designing and preparing your project for use in different languages and locales. Angular provides built-in support for:</p>
          <ul>
            <li>Translating text in templates and code.</li>
            <li>Formatting dates, numbers, and currencies according to local standards.</li>
            <li>Handling pluralization and gender rules.</li>
          </ul>
          <p>Angular uses <strong>Static Translation</strong> by default, meaning a separate version of the app is built for each language, which is highly efficient for the end-user.</p>
        `,
      "code": "// Angular i18n helps you handle:\n// 1. Text translations\n// 2. Locale-specific formatting (e.g., 10/05/2024 vs 05/10/2024)\n// 3. Currency symbols ($ vs € vs ₹)",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">i18n Workflow</p><div class="flex items-center justify-between max-w-md mx-auto"><div class="bg-indigo-50 border border-indigo-200 p-2 rounded text-[10px]">Source HTML</div><div class="text-slate-300">&rarr;</div><div class="bg-indigo-600 text-white p-2 rounded text-xs font-bold">Extraction Tool</div><div class="text-slate-300">&rarr;</div><div class="bg-emerald-50 border border-emerald-200 p-2 rounded text-[10px]">Translation Files (XLF)</div></div></div>`
    },
    {
      "id": "implement-multi-language",
      "title": "How to implement multi-language support?",
      "explanation": `
          <p>The standard Angular i18n workflow involves four main steps:</p>
          <ol>
            <li><strong>Mark Text:</strong> Add the <code>i18n</code> attribute to elements in your HTML templates.</li>
            <li><strong>Extract:</strong> Use the Angular CLI to extract marked text into a source translation file (XLIFF or JSON).</li>
            <li><strong>Translate:</strong> Provide the translated text in language-specific files (e.g., <code>messages.fr.xlf</code>).</li>
            <li><strong>Build:</strong> Configure the build to generate localized versions of the app.</li>
          </ol>
        `,
      "code": "<!-- 1. Mark text in template -->\n<h1 i18n=\"@@homeTitle\">Hello World</h1>\n\n<!-- 2. Extract via CLI -->\n// ng extract-i18n --output-path src/locale",
      "language": "html"
    },
    {
      "id": "angular-localize-package",
      "title": "What is Angular localize package?",
      "explanation": `
          <p>The <strong>@angular/localize</strong> package is a required dependency for internationalization in modern Angular (v9+). It provides the tools to perform "tagging" of messages in code and handles the transformation of those messages during the build.</p>
          <p>It enables the use of the <code>$localize</code> global function, which allows you to translate strings directly inside your TypeScript files (like error messages or dynamic notifications).</p>
        `,
      "code": "// 1. Install: ng add @angular/localize\n\n// 2. Use in TypeScript:\nconst message = $localize`Welcome to the dashboard`;",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><div class="max-w-md mx-auto bg-amber-50 border border-amber-200 rounded-xl p-4"><p class="text-xs font-bold text-amber-700 uppercase mb-2">Build-time Inlining</p><p class="text-[10px] text-slate-600 leading-relaxed">@angular/localize replaces '$localize' tags with translated strings during the compilation phase, ensuring no runtime translation overhead.</p></div></div>`
    },
    {
      "id": "plural-and-select-translations",
      "title": "Plural and select (ICU message format)",
      "explanation": `
          <p>Angular i18n supports <strong>ICU message expressions</strong> inside <code>i18n</code>-marked elements. These handle grammar rules that differ between languages — particularly <strong>pluralization</strong> and <strong>gender-based</strong> text.</p>
          <h3>plural</h3>
          <p>Selects a string based on a numeric value. Supports categories: <code>=0</code>, <code>=1</code>, <code>one</code>, <code>few</code>, <code>many</code>, <code>other</code>. The <code>other</code> case is required as the fallback.</p>
          <h3>select</h3>
          <p>Selects a string based on a string value (e.g., gender or status). The <code>other</code> case is required.</p>
          <p>ICU expressions are extracted alongside regular text when running <code>ng extract-i18n</code>, and translators provide locale-specific variants.</p>
        `,
      "code": "<!-- Plural: vary text based on a numeric count -->\n<p i18n>\n  {itemCount, plural,\n    =0    {No items in your cart.}\n    =1    {One item in your cart.}\n    other {{{itemCount}} items in your cart.}}\n</p>\n\n<!-- Select: vary text based on a string category -->\n<p i18n>\n  {gender, select,\n    male   {He has accepted the invitation.}\n    female {She has accepted the invitation.}\n    other  {They have accepted the invitation.}}\n</p>\n\n<!-- Combined in one element -->\n<p i18n>\n  {minutes, plural,\n    =0    {just now}\n    =1    {one minute ago}\n    other {{{minutes}} minutes ago}}\n</p>",
      "language": "html",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">ICU Expression Types</p><div class="grid grid-cols-2 gap-4 max-w-md mx-auto"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3"><p class="text-xs font-bold text-indigo-700 mb-2">plural</p><ul class="text-[10px] text-slate-600 space-y-1"><li>=0 &rarr; "No items"</li><li>=1 &rarr; "One item"</li><li>other &rarr; "N items"</li></ul></div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3"><p class="text-xs font-bold text-emerald-700 mb-2">select</p><ul class="text-[10px] text-slate-600 space-y-1"><li>male &rarr; "He..."</li><li>female &rarr; "She..."</li><li>other &rarr; "They..."</li></ul></div></div></div>`
    },
    {
      "id": "locale-formatting",
      "title": "Locale-aware date, number and currency formatting",
      "explanation": `
          <p>Angular's built-in pipes — <code>DatePipe</code>, <code>DecimalPipe</code>, <code>CurrencyPipe</code>, <code>PercentPipe</code> — are <strong>locale-aware</strong>. They automatically use the correct decimal separator, thousands separator, date order, and currency symbol for the active locale.</p>
          <h3>Setting the Active Locale</h3>
          <p>Provide <code>LOCALE_ID</code> at the application root. For build-time i18n, Angular sets this automatically per build. You also need to call <code>registerLocaleData()</code> to load locale data for any non-default locale.</p>
          <h3>Overriding Per-Pipe</h3>
          <p>Each pipe accepts an optional locale parameter as its last argument, allowing per-instance overrides without changing the app-wide locale.</p>
        `,
      "code": "// app.module.ts — register locale data and set LOCALE_ID\nimport { registerLocaleData } from '@angular/common';\nimport localeFr from '@angular/common/locales/fr';\nimport localeDe from '@angular/common/locales/de';\nimport { LOCALE_ID } from '@angular/core';\n\nregisterLocaleData(localeFr, 'fr');\nregisterLocaleData(localeDe, 'de');\n\n@NgModule({\n  providers: [{ provide: LOCALE_ID, useValue: 'fr' }]\n})\nexport class AppModule {}\n\n// --- Template examples (with LOCALE_ID = 'fr') ---\n\n// Number formatting\n// {{ 1234567.89 | number:'1.2-2' }}          -> 1 234 567,89   (French)\n// {{ 1234567.89 | number:'1.2-2':'en' }}     -> 1,234,567.89   (override to English)\n\n// Date formatting\n// {{ today | date:'fullDate' }}              -> vendredi 4 avril 2026\n// {{ today | date:'fullDate':'':'en' }}      -> Friday, April 4, 2026\n\n// Currency formatting\n// {{ 99.99 | currency:'EUR':'symbol' }}      -> 99,99 €\n// {{ 99.99 | currency:'USD':'symbol':'1.2-2':'en' }} -> $99.99\n\n// Percent\n// {{ 0.256 | percent:'1.1-2' }}             -> 25,6 %  (French spacing)",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Same Value, Different Locales</p><div class="max-w-md mx-auto space-y-2 text-xs"><div class="grid grid-cols-3 gap-2 font-bold text-slate-500 border-b pb-1"><span>Pipe</span><span class="text-center">en-US</span><span class="text-center">fr-FR</span></div><div class="grid grid-cols-3 gap-2"><span class="text-slate-600">1234.5 | number</span><span class="text-center font-mono text-indigo-700">1,234.5</span><span class="text-center font-mono text-emerald-700">1 234,5</span></div><div class="grid grid-cols-3 gap-2"><span class="text-slate-600">date:'short'</span><span class="text-center font-mono text-indigo-700">4/4/26</span><span class="text-center font-mono text-emerald-700">04/04/26</span></div><div class="grid grid-cols-3 gap-2"><span class="text-slate-600">99 | currency:'EUR'</span><span class="text-center font-mono text-indigo-700">€99.00</span><span class="text-center font-mono text-emerald-700">99,00 €</span></div></div></div>`
    },
    {
      "id": "configure-multiple-locales",
      "title": "Configuring multiple locale builds",
      "explanation": `
          <p>Angular's built-in i18n produces a <strong>separate compiled app per locale</strong> — the fastest possible runtime experience because no translation lookup happens at runtime. You configure all locales in <code>angular.json</code> and run one build that outputs every locale in parallel.</p>
          <h3>Workflow</h3>
          <ol>
            <li>Add <code>i18n</code> section to <code>angular.json</code> listing each locale and its translation file path</li>
            <li>Add a build configuration per locale (or use <code>"localize": true</code> to build all at once)</li>
            <li>Deploy each locale's output to its own path (e.g., <code>/en/</code>, <code>/fr/</code>)</li>
            <li>Configure your server to redirect users to the correct locale path based on browser preferences</li>
          </ol>
        `,
      "code": "// angular.json (relevant sections)\n{\n  \"projects\": {\n    \"my-app\": {\n      \"i18n\": {\n        \"sourceLocale\": \"en\",\n        \"locales\": {\n          \"fr\": { \"translation\": \"src/locale/messages.fr.xlf\" },\n          \"de\": { \"translation\": \"src/locale/messages.de.xlf\" },\n          \"ar\": { \"translation\": \"src/locale/messages.ar.xlf\" }\n        }\n      },\n      \"architect\": {\n        \"build\": {\n          \"configurations\": {\n            \"fr\": { \"localize\": [\"fr\"] },\n            \"de\": { \"localize\": [\"de\"] },\n            \"production\": { \"localize\": true }  // build ALL locales\n          }\n        }\n      }\n    }\n  }\n}\n\n// CLI commands:\n// ng serve --configuration=fr            (dev server in French)\n// ng build --configuration=fr            (single locale build)\n// ng build --configuration=production    (all locales in parallel)\n\n// Output structure:\n// dist/my-app/\n//   en/  index.html  main.js  ...\n//   fr/  index.html  main.js  ...\n//   de/  index.html  main.js  ...",
      "language": "json",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Build-Time i18n Output</p><div class="flex flex-col items-center gap-2 max-w-xs mx-auto"><div class="w-full bg-slate-100 border border-slate-300 rounded-lg p-2 text-center text-xs font-bold text-slate-600">ng build (production)</div><div class="text-slate-400">&darr;</div><div class="grid grid-cols-3 gap-2 w-full"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-2 text-center"><p class="text-xs font-bold text-indigo-700">dist/en/</p></div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-2 text-center"><p class="text-xs font-bold text-emerald-700">dist/fr/</p></div><div class="bg-amber-50 border-2 border-amber-200 rounded-lg p-2 text-center"><p class="text-xs font-bold text-amber-700">dist/de/</p></div></div><p class="text-[10px] text-slate-400 text-center">Each folder is a fully compiled, translated app</p></div></div>`
    },
    {
      "id": "runtime-i18n-ngx-translate",
      "title": "Runtime i18n with ngx-translate",
      "explanation": `
          <p><strong>ngx-translate</strong> is a popular community library that provides <strong>runtime</strong> language switching — users can change the language without a page reload. This is the key difference from Angular's built-in static i18n which requires a separate build per locale.</p>
          <h3>Built-in i18n vs ngx-translate</h3>
          <ul>
            <li><strong>Built-in</strong>: separate build per locale, fastest runtime, no library needed, no runtime switching</li>
            <li><strong>ngx-translate</strong>: single build, dynamic switching, JSON translation files loaded at runtime, small overhead</li>
          </ul>
          <h3>Key API</h3>
          <ul>
            <li><code>translate.use('fr')</code> — switch language at runtime</li>
            <li><code>{{ 'KEY' | translate }}</code> — pipe in templates</li>
            <li><code>translate.instant('KEY')</code> — synchronous lookup in TypeScript</li>
            <li><code>translate.get('KEY')</code> — Observable-based lookup</li>
          </ul>
        `,
      "code": "// 1. Install\n// npm install @ngx-translate/core @ngx-translate/http-loader\n\n// 2. app.module.ts\nimport { TranslateModule, TranslateLoader } from '@ngx-translate/core';\nimport { TranslateHttpLoader } from '@ngx-translate/http-loader';\nimport { HttpClient } from '@angular/common/http';\n\nexport function createTranslateLoader(http: HttpClient) {\n  return new TranslateHttpLoader(http, './assets/i18n/', '.json');\n}\n\n@NgModule({\n  imports: [\n    TranslateModule.forRoot({\n      defaultLanguage: 'en',\n      loader: {\n        provide: TranslateLoader,\n        useFactory: createTranslateLoader,\n        deps: [HttpClient]\n      }\n    })\n  ]\n})\nexport class AppModule {}\n\n// 3. assets/i18n/en.json\n// { \"HELLO\": \"Hello\", \"WELCOME\": \"Welcome, {{name}}!\", \"LOGOUT\": \"Log out\" }\n\n// assets/i18n/fr.json\n// { \"HELLO\": \"Bonjour\", \"WELCOME\": \"Bienvenue, {{name}} !\", \"LOGOUT\": \"Deconnexion\" }\n\n// 4. Component — switch language\n@Component({ selector: 'app-root', template: '' })\nexport class AppComponent {\n  constructor(private translate: TranslateService) {\n    this.translate.setDefaultLang('en');\n    this.translate.use('en');\n  }\n  switchToFrench() { this.translate.use('fr'); }\n}\n\n// 5. Template\n// <h1>{{ 'HELLO' | translate }}</h1>\n// <p [translate]=\"'WELCOME'\" [translateParams]=\"{ name: user.name }\"></p>\n// <button (click)=\"switchToFrench()\">{{ 'LOGOUT' | translate }}</button>",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Built-in i18n vs ngx-translate</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3"><p class="text-xs font-bold text-indigo-700 mb-2">Built-in Angular i18n</p><ul class="text-[10px] text-slate-600 space-y-1"><li>Separate build per locale</li><li>Fastest runtime (no lookup)</li><li>No runtime language switching</li><li>Best for SEO / SSR apps</li></ul></div><div class="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3"><p class="text-xs font-bold text-emerald-700 mb-2">ngx-translate</p><ul class="text-[10px] text-slate-600 space-y-1"><li>Single build, all languages</li><li>Runtime language switching</li><li>JSON files loaded on demand</li><li>Best for dynamic / SaaS apps</li></ul></div></div></div>`
    }
  ]
});