window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "i18n",
  "title": "Internationalization (i18n)",
  "icon": "bi bi-translate",
  "questions": [
    {
      id: "angular-22-standard-i18n-upgrade",
      title: "Angular 22 standard for i18n",
      explanation: `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>chocolate bar factory</strong> that runs one recipe but ships different wrappers to different countries &mdash; the ingredients list is in the local language, the weight is in grams or ounces depending on the market, and the price tag matches the local currency. The factory line (your component logic) never changes; only what gets printed on the packaging (text, dates, numbers, currency) adapts per country.</p>
          </div>
        </div>
        <p>Angular 22-ready internationalization means planning translations, locale-aware formatting, plural rules, URLs, and SEO metadata together, not bolting them on at the end. Angular's built-in i18n is still the strongest choice for build-time translated apps; runtime libraries like <code>ngx-translate</code> fit products that need instant language switching without a reload.</p>
        <h3>Modern i18n checklist</h3>
        <ul>
          <li>Use stable custom message IDs for every important translated string.</li>
          <li>Use ICU messages for plural and select/gender cases &mdash; never string concatenation.</li>
          <li>Use Angular's built-in pipes with the correct <code>LOCALE_ID</code> for dates, numbers, and currencies.</li>
          <li>Build and deploy locale-specific routes when using Angular's built-in i18n.</li>
          <li>Translate ARIA labels, page titles, meta descriptions, and validation errors too &mdash; not just visible body text.</li>
        </ul>
      `,
      code: `<!-- Stable custom ID for translators -->
<h1 i18n="Homepage hero title@@homeHeroTitle">
  Fast delivery for every order
</h1>

<!-- ICU plural message -->
<p i18n="Cart item count@@cartItemCount">
  {itemCount, plural,
    =0 {No items}
    =1 {One item}
    other {{{ itemCount }} items}}
</p>

<!-- Locale-aware formatting -->
<p>{{ total | currency:currencyCode }}</p>
<p>{{ today | date:'fullDate' }}</p>`,
      language: "html",
      diagram: `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">i18n — Five Things To Get Right</p><div class="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto text-xs"><div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center"><p class="font-bold text-indigo-700">Stable IDs</p><p class="text-slate-500 mt-1">@@customId per string</p></div><div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center"><p class="font-bold text-emerald-700">ICU messages</p><p class="text-slate-500 mt-1">plural / select</p></div><div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center"><p class="font-bold text-amber-700">LOCALE_ID pipes</p><p class="text-slate-500 mt-1">date / number / currency</p></div><div class="bg-rose-50 border border-rose-200 rounded-lg p-3 text-center"><p class="font-bold text-rose-700">Per-locale build</p><p class="text-slate-500 mt-1">dist/en, dist/fr...</p></div><div class="bg-purple-50 border border-purple-200 rounded-lg p-3 text-center"><p class="font-bold text-purple-700">Translated a11y</p><p class="text-slate-500 mt-1">ARIA, titles, errors</p></div></div></div>`
    },
    {
      "id": "what-is-i18n",
      "title": "What is i18n in Angular?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>print shop versus a live interpreter</strong>. Angular's built-in i18n is the print shop: it runs a separate press for each language before the store even opens, so a French customer picks up a book that was already printed in French &mdash; no waiting, no live translation happening. A runtime library like <code>ngx-translate</code> is the live interpreter: it follows the reader around and translates on the spot, which is more flexible but a little slower for every single sentence.</p>
          </div>
        </div>
        <p><strong>Internationalization (i18n)</strong> is designing your app so it can be adapted for different languages and regions without touching the source code. The name is a numeronym &mdash; 18 letters sit between the "i" and the "n" in "internationalization." <strong>Localization (l10n)</strong> is the follow-up step: actually supplying the translated content for a specific region.</p>
        <h3>Three distinct concerns, one system</h3>
        <p>Angular's built-in i18n bundles three separate problems into one workflow. <strong>Text translation</strong> swaps English strings for equivalents in other languages. <strong>Locale-aware formatting</strong> handles the fact that the US writes <code>1,234.56</code> while Germany writes <code>1.234,56</code>, and the EU writes dates as <code>DD/MM/YYYY</code> while the US uses <code>MM/DD/YYYY</code>. <strong>Grammar rules</strong> cover pluralization and grammatical gender, which vary wildly &mdash; Russian has four plural forms where English has two.</p>
        <h3>Build-time vs runtime translation</h3>
        <p>Angular's built-in i18n takes a <strong>build-time</strong> approach: you run one build per locale, and the CLI produces separate, fully compiled bundles &mdash; one for English, one for French, one for German &mdash; each with translations already baked in. There is no runtime lookup cost, but you cannot switch languages without navigating to a different locale-specific URL. The alternative is <strong>runtime</strong> translation via libraries like <code>ngx-translate</code>, which load JSON translation files on demand and let users flip languages instantly, at the cost of a small lookup overhead on every translated string.</p>
      `,
      "code": "// Angular i18n handles three concerns:\n\n// 1. Text translation: mark strings in templates\n// <h1 i18n>Welcome to our store</h1>\n// After build with 'fr' locale: <h1>Bienvenue dans notre boutique</h1>\n\n// 2. Locale-aware formatting via built-in pipes\n// With LOCALE_ID = 'de' (German):\n// {{ 1234567.89 | number }}    -> '1.234.567,89'   (German decimal/thousands)\n// {{ today | date:'short' }}   -> '19.07.26'        (German date format)\n// {{ 99.99 | currency:'EUR' }} -> '99,99 €'         (Euro with German formatting)\n\n// 3. Pluralization and gender via ICU expressions\n// <p i18n>\n//   {itemCount, plural,\n//     =0    {No items in cart}\n//     =1    {One item in cart}\n//     other {{{itemCount}} items in cart}}\n// </p>",
      "language": "typescript"
    },
    {
      "id": "implement-multi-language",
      "title": "How to implement multi-language support?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">Sending a legal contract out for professional translation. First you <strong>highlight</strong> every clause that needs translating and jot a note on tricky ones. Then you <strong>bundle the whole document</strong> and send it to the translation agency. The agency's linguists <strong>fill in each language version</strong> without touching your original structure. Finally, you <strong>print a distinct final contract</strong> per country &mdash; you never hand a French client a document with English clauses mixed in.</p>
          </div>
        </div>
        <p>Angular's built-in i18n workflow has four well-defined stages: mark, extract, translate, build. Each stage uses a different tool, and understanding all four is what separates "I added <code>i18n</code> to a few tags" from a working multi-language pipeline.</p>
        <h3>Stage 1 — mark text in templates</h3>
        <p>Add the <code>i18n</code> attribute to any element whose text content should be translated. A description goes after a pipe (<code>i18n="Purpose of this text"</code>) and a custom ID goes after a double at-sign (<code>i18n="@@uniqueId"</code>). Custom IDs matter: without one, Angular generates an ID from a content hash, and that hash changes the moment you tweak the source text &mdash; silently breaking the link to an already-translated string.</p>
        <h3>Stage 2 — extract the translation source file</h3>
        <p><code>ng extract-i18n</code> scans your entire application's templates, finds every <code>i18n</code> attribute, and writes a source translation file (XLIFF 2.0 by default, also supports XLIFF 1.2 and JSON). This file is the handoff document you give to translators.</p>
        <h3>Stage 3 — translators fill in the target file</h3>
        <p>Translators populate the <code>&lt;target&gt;</code> element for each translation unit in the locale-specific file, typically inside a dedicated tool like Phrase, Lokalise, or Crowdin &mdash; all of which import and export XLIFF. You version-control the translation files alongside your source code.</p>
        <h3>Stage 4 — build per locale</h3>
        <p>Configure <code>angular.json</code> with your locale definitions and run <code>ng build --configuration production</code>, which builds every configured locale in parallel, each into its own output folder under <code>dist/</code>.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Skipping custom <code>@@ids</code> feels fine at first because auto-generated IDs work. The trap springs later: fix a typo in the English source, and the content-hash ID changes, so the translation your agency delivered no longer matches anything &mdash; the string silently falls back to untranslated English in production. Stable custom IDs are cheap insurance against this.</p>
          </div>
        </div>
      `,
      "code": "<!-- ---- Stage 1: Mark text in templates ---- -->\n\n<!-- Simple text: no custom ID (Angular generates one from content hash) -->\n<p i18n>Loading your order...</p>\n\n<!-- With description (helps translators understand context) -->\n<button i18n=\"Submit button on checkout form\">Place Order</button>\n\n<!-- With custom stable ID (recommended — won't break when source text is edited) -->\n<h1 i18n=\"@@homeHeroTitle\">The best products, delivered fast.</h1>\n\n<!-- Attribute translation (translate an attribute value, not element text) -->\n<img [src]=\"logoUrl\" i18n-alt=\"@@logoAltText\" alt=\"Company logo\" />\n\n<!-- Dynamic content: only the surrounding text is translated -->\n<p i18n=\"@@welcomeMessage\">Welcome, {{ userName }}!</p>",
      "language": "html",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">The Four-Stage i18n Pipeline</p><div class="flex flex-wrap items-center justify-center gap-2 text-xs"><div class="bg-indigo-50 border-2 border-indigo-200 rounded-lg px-3 py-2 text-center font-semibold text-indigo-700">1. Mark<br><span class="font-normal text-slate-500">i18n attr</span></div><span class="text-slate-300">&rarr;</span><div class="bg-emerald-50 border-2 border-emerald-200 rounded-lg px-3 py-2 text-center font-semibold text-emerald-700">2. Extract<br><span class="font-normal text-slate-500">ng extract-i18n</span></div><span class="text-slate-300">&rarr;</span><div class="bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2 text-center font-semibold text-amber-700">3. Translate<br><span class="font-normal text-slate-500">XLIFF file</span></div><span class="text-slate-300">&rarr;</span><div class="bg-rose-50 border-2 border-rose-200 rounded-lg px-3 py-2 text-center font-semibold text-rose-700">4. Build<br><span class="font-normal text-slate-500">per locale</span></div></div></div>`
    },
    {
      "id": "angular-localize-package",
      "title": "What is the @angular/localize package?",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>customs stamp on an export crate</strong>. The <code>i18n</code> attribute stamps HTML content for the extraction pipeline; <code>$localize</code> stamps a TypeScript string the same way. Both stamps get read by the same customs officer (<code>ng extract-i18n</code>), which doesn't care whether the crate came from the template warehouse or the TypeScript warehouse &mdash; it just needs the stamp to know the cargo should be processed for translation.</p>
          </div>
        </div>
        <p><code>@angular/localize</code> is the package that powers Angular's entire i18n system. It supplies the build-time tooling that extracts messages and inlines translations, and it also supplies the <code>$localize</code> tagged template literal for translating strings that live in TypeScript code rather than HTML templates.</p>
        <p>You need <code>@angular/localize</code> installed and imported before running any i18n commands. Without it, <code>ng extract-i18n</code> finds nothing, and build-time translation inlining does not happen.</p>
        <h3>$localize — translating TypeScript strings</h3>
        <p>The <code>i18n</code> attribute only works inside HTML templates. For strings that exist purely in TypeScript &mdash; error messages, toast text, dynamic page titles, accessibility labels built at runtime &mdash; you use the <code>$localize</code> tagged template literal. It reads like a normal template literal but marks the string for extraction, and at build time Angular replaces the <code>$localize</code> call with the translated string inlined as a constant.</p>
        <h3>Why build-time inlining matters</h3>
        <p>Because translations are inlined at build time, there is no runtime dictionary lookup, no lazy-loaded JSON file, and no translation pipe re-running on every change detection cycle. The translated string is compiled directly into the JavaScript bundle. For high-traffic apps, that is a real, measurable rendering performance win over runtime translation systems.</p>
      `,
      "code": "# ---- Step 1: Add @angular/localize to the project ----\nng add @angular/localize\n# This installs the package and adds the import to polyfills or main.ts\n\n# ---- Step 2: Ensure it's imported (auto-done by ng add) ----\n// In main.ts or polyfills.ts:\nimport '@angular/localize/init';\n\n// ---- Step 3: Use $localize in TypeScript code ----\nimport { Component, inject } from '@angular/core';\n\n@Injectable({ providedIn: 'root' })\nexport class NotificationService {\n  private messages = {\n    // These strings are extracted by ng extract-i18n just like i18n attributes\n    saveSuccess: $localize`:@@notifSaveSuccess:Your changes have been saved.`,\n    saveError:   $localize`:@@notifSaveError:Failed to save. Please try again.`,\n    sessionExp:  $localize`:@@notifSessionExpired:Your session has expired. Please log in again.`\n  };\n\n  getSaveSuccessMessage(): string {\n    return this.messages.saveSuccess;\n  }\n\n  // With interpolation — the variable is substituted after translation\n  getWelcomeMessage(name: string): string {\n    return $localize`:@@notifWelcome:Welcome back, ${name}:name:!`;\n    // In French: 'Bienvenue, ${name}:name:!'\n  }\n}\n\n// ---- Extract all messages (templates + $localize calls) ----\n// ng extract-i18n --output-path src/locale --format xliff2\n// Output: src/locale/messages.xlf (source file for translators)",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Two Sources, One Extraction Pipeline</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4"><div class="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center"><p class="font-bold text-indigo-700">HTML template</p><p class="text-slate-500 mt-1 font-mono">i18n="@@id"</p></div><div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center"><p class="font-bold text-emerald-700">TypeScript code</p><p class="text-slate-500 mt-1 font-mono">$localize\`:@@id:...\`</p></div></div><div class="flex justify-center text-slate-300 mb-2">&darr;&nbsp;&darr;</div><div class="bg-slate-800 text-white rounded-lg px-3 py-2 text-center text-xs font-semibold max-w-xs mx-auto">ng extract-i18n &rarr; messages.xlf</div></div>`
    },
    {
      "id": "plural-and-select-translations",
      "title": "Plural and select (ICU message format)",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>tailor who works from patterns, not one-size-fits-all shirts</strong>. English only needs two patterns &mdash; singular and plural. Russian needs four, Arabic needs six. ICU expressions are the pattern book: you hand the tailor (the translator) a set of labeled slots, and they cut the right pattern for their language's grammar &mdash; without you touching the shirt's overall design.</p>
          </div>
        </div>
        <p>Angular i18n supports <strong>ICU (International Components for Unicode) message expressions</strong> inside <code>i18n</code>-marked elements. They exist because grammar rules for pluralization and gender differ dramatically between languages in ways plain string concatenation cannot express.</p>
        <h3>Why you cannot just concatenate strings</h3>
        <p>In English you might build <code>"You have " + count + " items"</code>. In Russian, the word for "item" changes in four different ways depending on whether the count is 1, 2&ndash;4, 5&ndash;20, or ends in certain digits. Arabic has six plural forms. Concatenation cannot represent that. ICU expressions give translators a declarative syntax they can expand for their language's rules without you ever touching component code.</p>
        <h3>plural — number-based selection</h3>
        <p>The <code>plural</code> keyword selects text based on a numeric value. Standard categories are <code>=0</code>, <code>=1</code>, <code>one</code>, <code>few</code>, <code>many</code>, and the required fallback <code>other</code>. English typically only needs <code>=0</code>, <code>=1</code>, and <code>other</code>; translators add the extra cases their language requires directly in the XLIFF file.</p>
        <h3>select — string-based selection</h3>
        <p>The <code>select</code> keyword picks text based on a string value &mdash; typically grammatical gender or a status category. <code>other</code> is required here too. Use it whenever different nouns or verb forms are needed for different categories.</p>
      `,
      "code": "<!-- ---- plural: item count in a shopping cart ---- -->\n<p i18n=\"@@cartItemCount\">\n  {cartItems.length, plural,\n    =0    {Your cart is empty.}\n    =1    {You have 1 item in your cart.}\n    other {You have {{cartItems.length}} items in your cart.}}\n</p>\n\n<!-- ---- plural: time since last login ---- -->\n<p i18n=\"@@lastLoginAgo\">\n  Last login:\n  {minutesAgo, plural,\n    =0    {just now}\n    =1    {1 minute ago}\n    other {{{minutesAgo}} minutes ago}}\n</p>\n\n<!-- ---- select: notification addressed to a user by gender ---- -->\n<p i18n=\"@@inviteAccepted\">\n  {contact.gender, select,\n    male   {He has accepted your invitation.}\n    female {She has accepted your invitation.}\n    other  {They have accepted your invitation.}}\n</p>\n\n<!-- ---- Nested ICU: gender + plural combined ---- -->\n<p i18n=\"@@friendsOnline\">\n  {gender, select,\n    male   {{count, plural, =1 {He is online.} other {They are {{count}} online.}}}\n    female {{count, plural, =1 {She is online.} other {They are {{count}} online.}}}\n    other  {{count, plural, =1 {1 person online.} other {{{count}} people online.}}}}\n</p>",
      "language": "html",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">plural Selection — English vs Russian</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-slate-50 border border-slate-200 rounded-lg p-3"><p class="font-bold text-slate-700 text-center mb-2">English — 3 forms</p><div class="space-y-1"><div class="bg-indigo-50 border border-indigo-200 rounded px-2 py-1">=0 &rarr; "No items"</div><div class="bg-indigo-50 border border-indigo-200 rounded px-2 py-1">=1 &rarr; "One item"</div><div class="bg-indigo-50 border border-indigo-200 rounded px-2 py-1">other &rarr; "N items"</div></div></div><div class="bg-slate-50 border border-slate-200 rounded-lg p-3"><p class="font-bold text-slate-700 text-center mb-2">Russian — 4 forms</p><div class="space-y-1"><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1">one &rarr; 1, 21, 31...</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1">few &rarr; 2-4, 22-24...</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1">many &rarr; 5-20, 25-30...</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1">other &rarr; fractions</div></div></div></div></div>`
    },
    {
      "id": "locale-formatting",
      "title": "Locale-aware date, number and currency formatting",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>country calling code on a phone system</strong>. Dial with a <code>+33</code> prefix and the rest of the call automatically routes and formats the French way; dial with <code>+1</code> and everything follows US conventions. <code>LOCALE_ID</code> is that prefix for your whole app &mdash; set it once, and every date, number, and currency pipe downstream formats itself the local way without you writing a single if/else.</p>
          </div>
        </div>
        <p>Angular's built-in pipes &mdash; <code>DatePipe</code>, <code>DecimalPipe</code>, <code>CurrencyPipe</code>, and <code>PercentPipe</code> &mdash; are all <strong>locale-aware</strong>. They automatically apply the correct decimal and thousands separators, date component order, currency symbol position, and decimal-place count for the active locale.</p>
        <h3>Setting the active locale</h3>
        <p>Provide the <code>LOCALE_ID</code> token at the application root. Angular's build-time i18n sets this automatically per locale build; for manual configuration you provide it in <code>bootstrapApplication</code>. You must also call <code>registerLocaleData()</code> for any non-English locale &mdash; Angular ships locale data for every language, but only the default locale's data is included in the initial bundle by default, so you import and register just the ones you need to avoid shipping unused locale data.</p>
        <h3>Per-instance locale override</h3>
        <p>Every formatting pipe accepts an optional locale parameter as its last argument, letting you force a specific locale for one binding without changing the app-wide <code>LOCALE_ID</code> &mdash; useful when, say, prices should always render in USD English format regardless of the user's locale while dates follow the user's locale.</p>
        <h3>Formatting outside templates</h3>
        <p>For TypeScript code, use Angular's <code>formatDate()</code>, <code>formatNumber()</code>, and <code>formatCurrency()</code> helpers from <code>@angular/common</code>. They read the same locale data as the pipes and accept the same format strings.</p>
        <div class="gotcha-box">
          <svg class="gotcha-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          <div class="gotcha-body">
            <p class="gotcha-label">Common trap</p>
            <p class="gotcha-text">Setting <code>LOCALE_ID</code> to <code>'fr'</code> without calling <code>registerLocaleData(localeFr, 'fr')</code> first throws <code>Missing locale data for the locale "fr"</code> at runtime, not build time. It is easy to forget because English needs no registration &mdash; its data ships by default &mdash; so the bug only shows up the moment you add your first real second language.</p>
          </div>
        </div>
      `,
      "code": "// ---- Register locale data and set LOCALE_ID ----\nimport { registerLocaleData } from '@angular/common';\nimport localeFr from '@angular/common/locales/fr';\nimport localeDe from '@angular/common/locales/de';\nimport localeJa from '@angular/common/locales/ja';\nimport { LOCALE_ID } from '@angular/core';\n\nregisterLocaleData(localeFr, 'fr');\nregisterLocaleData(localeDe, 'de');\nregisterLocaleData(localeJa, 'ja');\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    { provide: LOCALE_ID, useValue: 'fr' }  // French locale for the whole app\n  ]\n});\n\n// ---- Template pipe examples (LOCALE_ID = 'fr') ----\n\n// DecimalPipe: format '1.minDigits-maxDigits'\n// {{ 1234567.891 | number:'1.2-2' }}\n//   -> '1 234 567,89'    (French: space thousands separator, comma decimal)\n// {{ 1234567.891 | number:'1.2-2':'en' }}  // override to English\n//   -> '1,234,567.89'\n\n// DatePipe: named formats\n// {{ today | date:'fullDate' }}\n//   -> 'dimanche 19 juillet 2026'     (French full date)\n// {{ today | date:'shortDate':'':'en' }}   // override to English\n//   -> '7/19/26'\n\n// CurrencyPipe: code, display, digitsInfo\n// {{ 1299.99 | currency:'EUR':'symbol':'1.2-2' }}\n//   -> '1 299,99 €'      (French euro formatting)\n// {{ 1299.99 | currency:'USD':'symbol':'1.2-2':'en' }}\n//   -> '$1,299.99'        (US dollar formatting)\n\n// PercentPipe:\n// {{ 0.1756 | percent:'1.1-2' }}\n//   -> '17,56 %'          (French: comma decimal, space before %)\n\n// ---- formatDate in TypeScript service ----\nimport { formatDate, formatCurrency } from '@angular/common';\n\n@Injectable({ providedIn: 'root' })\nexport class ReportService {\n  private locale = inject(LOCALE_ID);\n\n  formatOrderDate(date: Date): string {\n    return formatDate(date, 'mediumDate', this.locale);\n  }\n\n  formatPrice(amount: number, currency: string): string {\n    return formatCurrency(amount, this.locale, currency);\n  }\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Same Data, Different Locale</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-slate-50 border-2 border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">LOCALE_ID = 'en'</p><div class="space-y-1.5 font-mono"><div class="bg-indigo-50 border border-indigo-200 rounded px-2 py-1">1,234,567.89</div><div class="bg-indigo-50 border border-indigo-200 rounded px-2 py-1">7/19/26</div><div class="bg-indigo-50 border border-indigo-200 rounded px-2 py-1">$1,299.99</div></div></div><div class="bg-slate-50 border-2 border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">LOCALE_ID = 'fr'</p><div class="space-y-1.5 font-mono"><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1">1 234 567,89</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1">19/07/2026</div><div class="bg-emerald-50 border border-emerald-200 rounded px-2 py-1">1 299,99 &euro;</div></div></div></div></div>`
    },
    {
      "id": "configure-multiple-locales",
      "title": "Configuring multiple locale builds",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>publishing house running distinct print jobs</strong> for each regional edition of a magazine, then boxing each edition separately and shipping it to its own regional warehouse. Nobody grabs a French box and finds English pages inside &mdash; the sorting happened at the printer, not at the newsstand. That is exactly what <code>angular.json</code>'s <code>i18n</code> config does: one <code>ng build</code>, several clean, self-contained locale bundles.</p>
          </div>
        </div>
        <p>Angular's built-in i18n produces a <strong>separate compiled application per locale</strong> &mdash; not one app that loads translations at runtime, but distinct builds where translations are inlined at compile time. This is the fastest possible production setup: zero translation overhead at runtime, fully tree-shakeable, and each locale bundle is as small as it can be.</p>
        <h3>The angular.json configuration</h3>
        <p>You configure every locale in <code>angular.json</code> under the project's <code>i18n</code> section: the source locale (your development language) plus each translation locale with its file path. Each locale can then be referenced in build configurations, and setting <code>"localize": true</code> in the production configuration builds all of them in parallel in one command.</p>
        <h3>URL structure and server routing</h3>
        <p>The CLI outputs each locale's build to its own subfolder: <code>dist/my-app/en/</code>, <code>dist/my-app/fr/</code>, <code>dist/my-app/de/</code>. You deploy all of them and configure your web server to route users to the right locale path &mdash; based on the <code>Accept-Language</code> header, a URL prefix like <code>/fr/products</code>, a cookie, or a manual language picker that redirects.</p>
        <h3>Keeping translations in sync</h3>
        <p>Every time a marked string changes, run <code>ng extract-i18n</code> to refresh the source file, then use a tool like <code>xliffmerge</code> or your translation platform's CLI to merge new source messages into existing translated files without clobbering strings that are already translated. This ongoing sync is the main operational cost of Angular's built-in i18n.</p>
      `,
      "code": "// ---- angular.json: full multi-locale configuration ----\n{\n  \"projects\": {\n    \"my-shop\": {\n      \"i18n\": {\n        \"sourceLocale\": \"en\",\n        \"locales\": {\n          \"fr\": {\n            \"translation\": \"src/locale/messages.fr.xlf\",\n            \"baseHref\": \"/fr/\"     // optional: sets <base href> per locale\n          },\n          \"de\": {\n            \"translation\": \"src/locale/messages.de.xlf\",\n            \"baseHref\": \"/de/\"\n          },\n          \"ar\": {\n            \"translation\": \"src/locale/messages.ar.xlf\",\n            \"baseHref\": \"/ar/\"\n          }\n        }\n      },\n      \"architect\": {\n        \"build\": {\n          \"configurations\": {\n            \"production\": {\n              \"localize\": true     // build ALL locales in parallel\n            },\n            \"fr\": {\n              \"localize\": [\"fr\"]   // build only French (useful for testing)\n            },\n            \"de\": {\n              \"localize\": [\"de\"]\n            }\n          }\n        },\n        \"serve\": {\n          \"configurations\": {\n            \"fr\": {\n              \"buildTarget\": \"my-shop:build:fr\"\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\n// ---- CLI workflow ----\n// 1. Extract messages from source code:\n// ng extract-i18n --output-path src/locale --format xliff2\n// Creates: src/locale/messages.xlf\n\n// 2. Send messages.xlf to translators → get back messages.fr.xlf, messages.de.xlf\n\n// 3. Test a specific locale during development:\n// ng serve --configuration=fr\n\n// 4. Build all locales for production:\n// ng build --configuration=production\n// Output:\n// dist/my-shop/en/    <- English build\n// dist/my-shop/fr/    <- French build\n// dist/my-shop/de/    <- German build\n\n// ---- Nginx server routing users to their locale ----\n// server {\n//   location / {\n//     # Read Accept-Language header and redirect to locale subfolder\n//     set $lang 'en';\n//     if ($http_accept_language ~* '^fr') { set $lang 'fr'; }\n//     if ($http_accept_language ~* '^de') { set $lang 'de'; }\n//     return 302 /$lang/;\n//   }\n//   location ~* ^/(en|fr|de)/ {\n//     try_files $uri $uri/ /$1/index.html;\n//   }\n// }",
      "language": "json",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">One Build, Three Locale Bundles</p><div class="flex flex-col items-center gap-2 text-xs"><div class="bg-slate-800 text-white rounded-lg px-3 py-1.5 font-semibold">ng build --configuration=production</div><div class="text-slate-300">&darr;</div><div class="flex gap-3"><div class="bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2 text-center"><p class="font-bold text-indigo-700">dist/en/</p></div><div class="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-center"><p class="font-bold text-emerald-700">dist/fr/</p></div><div class="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-center"><p class="font-bold text-amber-700">dist/de/</p></div></div><div class="text-slate-300">&darr;</div><div class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600">Server routes by Accept-Language / URL prefix</div></div></div>`
    },
    {
      "id": "runtime-i18n-ngx-translate",
      "title": "Runtime i18n with ngx-translate",
      "explanation": `
        <div class="analogy-box">
          <svg class="analogy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
          <div class="analogy-body">
            <p class="analogy-label">Think of it like</p>
            <p class="analogy-text">A <strong>food truck versus a chain of fixed restaurants</strong>. A food truck (<code>ngx-translate</code>) can swap its entire menu the instant it parks in a new neighborhood &mdash; one truck, many menus, loaded on demand. A restaurant chain (Angular's built-in i18n) instead pre-prints a distinct menu per location and ships the right one to each address ahead of time &mdash; slightly less flexible, but each location's menu is ready the instant the doors open, with nothing to fetch.</p>
          </div>
        </div>
        <p><code>ngx-translate</code> is the most popular community library for Angular internationalization. Its defining trait is that it operates at <strong>runtime</strong> &mdash; translation JSON files load on demand, and users can switch languages without a page reload or navigating to a different URL. That flexibility costs a small runtime lookup on every translated string.</p>
        <h3>Built-in vs ngx-translate — which to choose?</h3>
        <p>Reach for <strong>Angular's built-in i18n</strong> when SEO matters and you want separate, indexable URLs per locale; when you need maximum runtime performance; when you're already using SSR; or when a large translation team relies on professional tooling that speaks XLIFF.</p>
        <p>Reach for <strong>ngx-translate</strong> when users need to switch languages without a reload (SaaS dashboards, admin panels); when you want a single build artifact; when JSON translation files are simpler for your team to manage than XLIFF; or when translations need to load from a database or API.</p>
        <h3>Key API</h3>
        <p><code>translate.use('fr')</code> switches the active language and returns an Observable that completes once the file is loaded. <code>{{ 'KEY' | translate }}</code> is the template pipe. <code>translate.instant('KEY')</code> is a synchronous lookup, only safe after the language has finished loading. <code>translate.get('KEY', { param: value })</code> is the Observable-based lookup with parameter interpolation.</p>
        <h3>Parameter interpolation</h3>
        <p>ngx-translate supports parameter interpolation using double curly braces inside translation strings: <code>"WELCOME": "Welcome, {{name}}!"</code>. Pass parameters as an object to the pipe or service: <code>{{ 'WELCOME' | translate:{ name: user.name } }}</code>.</p>
      `,
      "code": "// ---- 1. Install ----\n// npm install @ngx-translate/core @ngx-translate/http-loader\n\n// ---- 2. Configure in bootstrapApplication (standalone) ----\nimport { importProvidersFrom } from '@angular/core';\nimport { TranslateModule, TranslateLoader } from '@ngx-translate/core';\nimport { TranslateHttpLoader } from '@ngx-translate/http-loader';\nimport { HttpClient, provideHttpClient } from '@angular/common/http';\n\nexport function createTranslateLoader(http: HttpClient) {\n  // Loads /assets/i18n/en.json, /assets/i18n/fr.json, etc.\n  return new TranslateHttpLoader(http, './assets/i18n/', '.json');\n}\n\nbootstrapApplication(AppComponent, {\n  providers: [\n    provideHttpClient(),\n    importProvidersFrom(\n      TranslateModule.forRoot({\n        defaultLanguage: 'en',\n        loader: {\n          provide: TranslateLoader,\n          useFactory: createTranslateLoader,\n          deps: [HttpClient]\n        }\n      })\n    )\n  ]\n});\n\n// ---- 3. Translation JSON files ----\n// assets/i18n/en.json\n// {\n//   \"NAV\": { \"HOME\": \"Home\", \"PRODUCTS\": \"Products\", \"CART\": \"Cart\" },\n//   \"PRODUCT\": {\n//     \"ADD_TO_CART\": \"Add to Cart\",\n//     \"IN_STOCK\": \"In Stock\",\n//     \"OUT_OF_STOCK\": \"Out of Stock\"\n//   },\n//   \"WELCOME\": \"Welcome, {{name}}!\"\n// }\n//\n// assets/i18n/fr.json\n// {\n//   \"NAV\": { \"HOME\": \"Accueil\", \"PRODUCTS\": \"Produits\", \"CART\": \"Panier\" },\n//   \"PRODUCT\": {\n//     \"ADD_TO_CART\": \"Ajouter au panier\",\n//     \"IN_STOCK\": \"En stock\",\n//     \"OUT_OF_STOCK\": \"Rupture de stock\"\n//   },\n//   \"WELCOME\": \"Bienvenue, {{name}} !\"\n// }\n\n// ---- 4. Component: language switcher ----\nimport { Component, inject, OnInit } from '@angular/core';\nimport { TranslateService, TranslateModule } from '@ngx-translate/core';\nimport { NgFor } from '@angular/common';\n\n@Component({\n  selector: 'app-root',\n  imports: [TranslateModule, NgFor],\n  template: `\n    <!-- Pipe: translate a key from the active language file -->\n    <h1>{{ 'WELCOME' | translate:{ name: currentUser } }}</h1>\n    <nav>\n      <a>{{ 'NAV.HOME' | translate }}</a>\n      <a>{{ 'NAV.PRODUCTS' | translate }}</a>\n      <a>{{ 'NAV.CART' | translate }}</a>\n    </nav>\n\n    <!-- Language switcher -->\n    <select (change)=\"switchLang($event)\">\n      <option *ngFor=\"let lang of langs\" [value]=\"lang\">{{ lang.toUpperCase() }}</option>\n    </select>\n  `\n})\nexport class AppComponent implements OnInit {\n  private translate = inject(TranslateService);\n  currentUser = 'Siladitya';\n  langs = ['en', 'fr', 'de'];\n\n  ngOnInit(): void {\n    this.translate.setDefaultLang('en');\n    // Load the browser's preferred language or default to English\n    const browserLang = this.translate.getBrowserLang();\n    this.translate.use(browserLang?.match(/en|fr|de/) ? browserLang : 'en');\n  }\n\n  switchLang(event: Event): void {\n    const lang = (event.target as HTMLSelectElement).value;\n    // use() returns Observable — subscribe if you need to know when loading is done\n    this.translate.use(lang);\n  }\n}",
      "language": "typescript",
      "diagram": `<div class="diagram-wrap"><p class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Choosing a Strategy</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"><div class="bg-slate-50 border-2 border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">Built-in i18n (build-time)</p><div class="space-y-1.5"><div class="bg-indigo-50 border border-indigo-200 rounded px-2 py-1">Best SEO, indexable URLs</div><div class="bg-indigo-50 border border-indigo-200 rounded px-2 py-1">Zero runtime lookup cost</div><div class="bg-indigo-50 border border-indigo-200 rounded px-2 py-1">Needs a page nav to switch</div></div></div><div class="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-3"><p class="font-bold text-slate-700 text-center mb-2">ngx-translate (runtime)</p><div class="space-y-1.5"><div class="bg-purple-50 border border-purple-200 rounded px-2 py-1">Instant language switch</div><div class="bg-purple-50 border border-purple-200 rounded px-2 py-1">Single build artifact</div><div class="bg-purple-50 border border-purple-200 rounded px-2 py-1">Small runtime lookup cost</div></div></div></div></div>`
    }
  ]
});
