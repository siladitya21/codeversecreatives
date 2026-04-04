window.MODULES = window.MODULES || [];
window.MODULES.push({
  "id": "observables-rxjs",
  "title": "Observables & RxJS",
  "icon": "bi bi-broadcast",
  "questions": [
    {
      "id": "what-are-observables",
      "title": "What are observables?",
      "explanation": "<p>In <strong>Angular</strong>, an <strong>Observable</strong> is a stream of data that can emit values over time. Angular uses observables heavily for asynchronous work such as HTTP requests, form value changes, route events, and state streams.</p>",
      "code": "import { Observable } from 'rxjs';\nconst numbers$ = new Observable<number>(observer => {\n  observer.next(1);\n  observer.next(2);\n  observer.next(3);\n  observer.complete();\n});",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Observable Stream</p></div>"
    },
    {
      "id": "observable-vs-promise",
      "title": "Difference between observable and promise",
      "explanation": "<p>Both Observables and Promises handle asynchronous operations, but they are not the same.</p>",
      "code": "const promise = fetch('/api/users').then(res => res.json());\nconst users$ = this.http.get('/api/users');",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Observable vs Promise</p></div>"
    },
    {
      "id": "what-is-rxjs",
      "title": "What is RxJS?",
      "explanation": "<p><strong>RxJS</strong> stands for <strong>Reactive Extensions for JavaScript</strong>. It is the library Angular uses for working with Observables and reactive programming.</p>",
      "code": "import { of } from 'rxjs';\nimport { map } from 'rxjs/operators';",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">RxJS In Angular</p></div>"
    },
    {
      "id": "what-are-rxjs-operators",
      "title": "What are operators in RxJS?",
      "explanation": "<p><strong>Operators</strong> in RxJS are functions used to transform, filter, combine, or control observable streams.</p>",
      "code": "of(1,2,3).pipe(filter(x => x > 1), map(x => x * 10))",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">RxJS Operators</p></div>"
    },
    {
      "id": "what-is-subscribe-method",
      "title": "What is subscribe method?",
      "explanation": "<p>The <strong><code>subscribe()</code></strong> method is used to start listening to an observable.</p>",
      "code": "this.http.get('/api/users').subscribe({ next: data => console.log(data) });",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">subscribe()</p></div>"
    },
    {
      "id": "what-are-subjects",
      "title": "What are subjects?",
      "explanation": "<p>A <strong>Subject</strong> in RxJS is a special type of observable that can both <strong>emit values</strong> and <strong>be subscribed to</strong>.</p>",
      "code": "const subject = new Subject<string>();\nsubject.next('Hello');",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Subject</p></div>"
    },
    {
      "id": "types-of-subjects",
      "title": "Types of subjects (Subject, BehaviorSubject, ReplaySubject)",
      "explanation": "<p>RxJS provides multiple kinds of Subjects such as <strong>Subject</strong>, <strong>BehaviorSubject</strong>, and <strong>ReplaySubject</strong>.</p>",
      "code": "const subject = new Subject<number>();\nconst behavior = new BehaviorSubject<number>(0);\nconst replay = new ReplaySubject<number>(2);",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Types Of Subjects</p></div>"
    },
    {
      "id": "hot-vs-cold-observables",
      "title": "What is the difference between hot and cold observables?",
      "explanation": "<p>The difference between <strong>hot</strong> and <strong>cold</strong> observables is about how values are produced and shared.</p>",
      "code": "const cold$ = this.http.get('/api/users');\nconst hot$ = new Subject<string>();",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Hot vs Cold</p></div>"
    },
    {
      "id": "what-are-higher-order-observables",
      "title": "What are higher-order observables?",
      "explanation": "<p>A <strong>higher-order observable</strong> is an observable that emits other observables.</p>",
      "code": "searchTerms$.pipe(switchMap(term => this.http.get('/api/search?q=' + term)))",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Higher-Order Observable</p></div>"
    },
    {
      "id": "common-rxjs-operators",
      "title": "Common RxJS operators (map, filter, switchMap, mergeMap, etc.)",
      "explanation": "<p>RxJS provides many operators, but some appear very often in Angular applications.</p>",
      "code": "searchControl.valueChanges.pipe(\n  debounceTime(300),\n  filter(term => term.length > 2),\n  switchMap(term => this.http.get('/api/search?q=' + term)),\n  catchError(() => of([]))\n)",
      "language": "typescript",
      "diagram": "<div class=\"diagram-wrap\"><p class=\"text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-5\">Common RxJS Operators</p></div>"
    }
  ]
});
