/* =============================================================
   Frontend Tutorial – app.js
   Dual-framework: Angular + React
   State · Rendering · Navigation · Framework Switching
================================================================ */

// -- State --------------------------------------------------
let state = {
  framework:  localStorage.getItem('at_framework') || 'angular',
  moduleId:   null,
  questionId: null,
};

// -- Framework helpers --------------------------------------
function getModules() {
  return state.framework === 'react'
    ? (window.REACT_MODULES || [])
    : (window.MODULES || []);
}

function getDone() {
  return JSON.parse(localStorage.getItem('at_done_' + state.framework) || '{}');
}

function saveDone(doneObj) {
  localStorage.setItem('at_done_' + state.framework, JSON.stringify(doneObj));
}

// -- Flat question index for prev/next ----------------------
function buildIndex() {
  const idx = [];
  getModules().forEach(m => m.questions.forEach(q => idx.push({ moduleId: m.id, questionId: q.id })));
  return idx;
}

// -- Helpers ------------------------------------------------
function getModule(id)      { return getModules().find(m => m.id === id); }
function getQuestion(m, id) { return m.questions.find(q => q.id === id); }
function doneKey(mId, qId)  { return mId + '::' + qId; }

function renderModuleIcon(mod, sizeClass) {
  sizeClass = sizeClass || 'text-base';
  const iconClass = (mod.icon || 'bi bi-file-earmark-text').replace(/^bi\s+/, '');
  return '<i class="bi ' + iconClass + ' ' + sizeClass + '" aria-hidden="true"></i>';
}

function markDone(mId, qId) {
  const done = getDone();
  done[doneKey(mId, qId)] = true;
  saveDone(done);
  updateProgress();
  const btn = document.querySelector('[data-qid="' + qId + '"]');
  if (btn) { btn.classList.add('done'); btn.classList.remove('active'); }
}

// -- Framework Switching ------------------------------------
function switchFramework(fw) {
  if (state.framework === fw) return;
  state.framework = fw;
  localStorage.setItem('at_framework', fw);
  updateFrameworkTabs();
  renderSidebar();
  updateProgress();

  const last = JSON.parse(localStorage.getItem('at_last_' + fw) || 'null');
  const mods = getModules();
  if (last && mods.find(m => m.id === last.moduleId)) {
    loadQuestion(last.moduleId, last.questionId);
  } else {
    renderWelcome();
  }
}

function updateFrameworkTabs() {
  ['angular', 'react'].forEach(function(fw) {
    const tab = document.getElementById('tab-' + fw);
    if (tab) tab.classList.toggle('active', fw === state.framework);
  });
}

// -- Sidebar Rendering --------------------------------------
function renderSidebar() {
  const nav = document.getElementById('module-nav');
  nav.innerHTML = '';
  const done = getDone();

  getModules().forEach(function(mod) {
    const wrap = document.createElement('div');

    const btn = document.createElement('button');
    btn.className = 'module-btn';
    btn.innerHTML =
      '<span class="w-5 flex items-center justify-center">' + renderModuleIcon(mod) + '</span>' +
      '<span class="flex-1 truncate">' + mod.title + '</span>' +
      '<span class="chevron">&#9654;</span>';
    btn.onclick = function() { toggleModule(mod.id); };
    btn.id = 'mod-btn-' + mod.id;

    const list = document.createElement('div');
    list.className = 'question-list mt-1 space-y-0.5';
    list.id = 'mod-list-' + mod.id;

    mod.questions.forEach(function(q) {
      const qb = document.createElement('button');
      qb.className = 'q-btn';
      qb.dataset.qid = q.id;
      if (done[doneKey(mod.id, q.id)]) qb.classList.add('done');
      qb.innerHTML = '<span class="q-dot"></span><span class="flex-1 text-left">' + q.title + '</span>';
      qb.onclick = function() { loadQuestion(mod.id, q.id); };
      list.appendChild(qb);
    });

    wrap.appendChild(btn);
    wrap.appendChild(list);
    nav.appendChild(wrap);
  });
}

function toggleModule(id) {
  const btn  = document.getElementById('mod-btn-' + id);
  const list = document.getElementById('mod-list-' + id);
  const open = list.classList.contains('open');

  document.querySelectorAll('.question-list').forEach(function(el) { el.classList.remove('open'); });
  document.querySelectorAll('.module-btn').forEach(function(el)    { el.classList.remove('open'); });

  if (!open) {
    list.classList.add('open');
    btn.classList.add('open');
  }
}

// -- Progress -----------------------------------------------
function updateProgress() {
  const mods      = getModules();
  const done      = getDone();
  const total     = mods.reduce(function(s, m) { return s + m.questions.length; }, 0);
  const doneCount = Object.keys(done).filter(function(k) { return done[k]; }).length;
  const pct       = total ? Math.round((doneCount / total) * 100) : 0;

  const countEl = document.getElementById('progress-count');
  const barEl   = document.getElementById('progress-bar');
  if (countEl) countEl.textContent = doneCount + ' / ' + total;
  if (barEl)   barEl.style.width   = pct + '%';
}

// -- Load Question ------------------------------------------
function loadQuestion(moduleId, questionId) {
  state.moduleId   = moduleId;
  state.questionId = questionId;

  const mod = getModule(moduleId);
  const q   = getQuestion(mod, questionId);
  if (!q) return;

  // Expand sidebar module
  document.querySelectorAll('.question-list').forEach(function(el) { el.classList.remove('open'); });
  document.querySelectorAll('.module-btn').forEach(function(el)    { el.classList.remove('open'); });
  const list = document.getElementById('mod-list-' + moduleId);
  const mBtn = document.getElementById('mod-btn-' + moduleId);
  if (list) list.classList.add('open');
  if (mBtn) mBtn.classList.add('open');

  // Highlight active question
  document.querySelectorAll('.q-btn').forEach(function(b) { b.classList.remove('active'); });
  const activeBtn = document.querySelector('[data-qid="' + questionId + '"]');
  if (activeBtn) { activeBtn.classList.add('active'); activeBtn.classList.remove('done'); }

  // Breadcrumb
  const fwLabel = state.framework === 'react' ? 'React' : 'Angular';
  const bc = document.getElementById('breadcrumb');
  bc.innerHTML =
    '<span class="text-slate-400">' + fwLabel + '</span>' +
    '<svg class="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>' +
    '<span class="text-slate-500 font-medium">' + mod.title + '</span>' +
    '<svg class="w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>' +
    '<span class="text-slate-700 font-semibold truncate max-w-xs">' + q.title + '</span>';

  // Prev / Next
  const idx  = buildIndex();
  const pos  = idx.findIndex(function(i) { return i.moduleId === moduleId && i.questionId === questionId; });
  const prev = idx[pos - 1] || null;
  const next = idx[pos + 1] || null;

  // Render content
  const area = document.getElementById('content-area');
  area.innerHTML =
    '<div class="max-w-3xl mx-auto px-5 lg:px-8 py-8 space-y-6">' +

      '<!-- Title -->' +
      '<div>' +
        '<span class="text-xs font-bold text-indigo-500 uppercase tracking-widest">' + mod.title + '</span>' +
        '<h2 class="text-2xl font-bold text-slate-800 mt-1 leading-snug">' + q.title + '</h2>' +
      '</div>' +

      '<!-- Explanation -->' +
      '<div class="content-card p-6">' +
        '<div class="section-label">' +
          '<svg class="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' +
          'Explanation' +
        '</div>' +
        '<div class="prose text-sm">' + q.explanation + '</div>' +
      '</div>' +

      '<!-- Code -->' +
      '<div class="content-card overflow-hidden">' +
        '<div class="px-6 pt-5 pb-2">' +
          '<div class="section-label">' +
            '<svg class="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>' +
            'Code Example' +
          '</div>' +
        '</div>' +
        '<div class="code-wrapper px-4 pb-5">' +
          '<button class="copy-btn" onclick="copyCode(this)">Copy</button>' +
          '<pre><code class="language-typescript">' + escapeHtml(q.code) + '</code></pre>' +
        '</div>' +
      '</div>' +

      // Diagram
      (q.diagram ?
        '<div class="content-card p-6">' +
          '<div class="section-label">' +
            '<svg class="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/></svg>' +
            'Visual / Diagram' +
          '</div>' +
          q.diagram +
        '</div>'
      : '') +

      '<!-- Nav -->' +
      '<div class="flex items-center justify-between pt-2 pb-4">' +
        '<button class="nav-btn nav-btn-prev" ' + (!prev ? 'disabled' : '') + ' ' +
          'onclick="' + (prev ? "loadQuestion('" + prev.moduleId + "','" + prev.questionId + "')" : '') + '">' +
          '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>' +
          'Previous' +
        '</button>' +

        '<button class="nav-btn text-xs px-4 py-2 rounded-full border border-emerald-300 text-emerald-600 hover:bg-emerald-50 transition-colors" ' +
          'onclick="markDone(\'' + moduleId + '\',\'' + questionId + '\')">' +
          '&#10003; Mark as done' +
        '</button>' +

        '<button class="nav-btn nav-btn-next" ' + (!next ? 'disabled' : '') + ' ' +
          'onclick="' + (next ? "loadQuestion('" + next.moduleId + "','" + next.questionId + "')" : '') + '">' +
          'Next' +
          '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>' +
        '</button>' +
      '</div>' +

    '</div>';

  area.scrollTo({ top: 0, behavior: 'smooth' });
  area.querySelectorAll('pre code').forEach(function(el) { hljs.highlightElement(el); });
  localStorage.setItem('at_last_' + state.framework, JSON.stringify({ moduleId: moduleId, questionId: questionId }));
}

// -- Welcome Screen -----------------------------------------
function renderWelcome() {
  const area    = document.getElementById('content-area');
  const mods    = getModules();
  const done    = getDone();
  const total   = mods.reduce(function(s, m) { return s + m.questions.length; }, 0);
  const isReact = state.framework === 'react';

  const fwName  = isReact ? 'React' : 'Angular';
  const fwSub   = isReact ? 'v18 / 19 Interview Guide' : 'v21 Interview Guide';
  const heroBg  = isReact ? 'from-slate-900 to-cyan-950' : 'from-slate-900 to-indigo-900';
  const iconBg  = isReact ? 'bg-cyan-500' : 'bg-red-500';
  const fwDesc  = isReact
    ? 'A comprehensive guide covering React concepts from hooks and state management to performance, testing, and the latest React 19 features. Pick a topic to begin.'
    : 'A complete, module-wise guide covering Angular concepts with explanations, code examples, and visual diagrams. Pick a topic from the sidebar to get started.';

  const fwIcon = isReact
    ? '<svg class="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="2.2" fill="white" stroke="none"/><ellipse cx="12" cy="12" rx="10" ry="3.8"/><ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(120 12 12)"/></svg>'
    : '<svg class="w-7 h-7 text-white" viewBox="0 0 250 250" fill="currentColor"><path d="M125 30L31.9 63.2l14.2 123.1L125 230l78.9-43.7 14.2-123.1z"/><path fill="rgba(255,255,255,0.3)" d="M125 30v200l78.9-43.7 14.2-123.1L125 30z"/><path fill="white" d="M125 52.1L66.8 182.6h21.7l11.7-29.2h49.4l11.7 29.2H183L125 52.1zm17 83.3h-34l17-40.9 17 40.9z"/></svg>';

  const doneCount = Object.values(done).filter(Boolean).length;

  area.innerHTML =
    '<div class="max-w-3xl mx-auto px-5 lg:px-8 py-10">' +

      '<div class="content-card p-8 mb-6 bg-gradient-to-br ' + heroBg + ' text-white border-0">' +
        '<div class="flex items-center gap-4 mb-4">' +
          '<div class="w-12 h-12 ' + iconBg + ' rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">' +
            fwIcon +
          '</div>' +
          '<div>' +
            '<h1 class="text-2xl font-bold">' + fwName + ' Tutorial</h1>' +
            '<p class="text-slate-300 text-sm mt-0.5">' + fwSub + '</p>' +
          '</div>' +
        '</div>' +
        '<p class="text-slate-300 text-sm leading-relaxed">' + fwDesc + '</p>' +
        '<div class="flex gap-6 mt-5">' +
          '<div class="text-center"><p class="text-2xl font-bold text-white">' + mods.length + '</p><p class="text-xs text-slate-400">Modules</p></div>' +
          '<div class="text-center"><p class="text-2xl font-bold text-white">' + total + '</p><p class="text-xs text-slate-400">Questions</p></div>' +
          '<div class="text-center"><p class="text-2xl font-bold text-indigo-300">' + doneCount + '</p><p class="text-xs text-slate-400">Completed</p></div>' +
        '</div>' +
      '</div>' +

      '<p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Modules</p>' +
      '<div class="grid grid-cols-1 gap-3">' +
        mods.map(function(mod) {
          const modDone = mod.questions.filter(function(q) { return done[doneKey(mod.id, q.id)]; }).length;
          const pct = mod.questions.length ? Math.round((modDone / mod.questions.length) * 100) : 0;
          return '<div class="welcome-module-card" onclick="loadQuestion(\'' + mod.id + '\',\'' + mod.questions[0].id + '\')">' +
            '<div class="flex items-center gap-3">' +
              '<span class="w-6 flex items-center justify-center text-xl">' + renderModuleIcon(mod, 'text-xl') + '</span>' +
              '<div class="flex-1 min-w-0">' +
                '<p class="text-sm font-semibold text-slate-700">' + mod.title + '</p>' +
                '<p class="text-xs text-slate-400">' + mod.questions.length + ' questions &middot; ' + modDone + ' done</p>' +
              '</div>' +
              '<div class="flex items-center gap-3 flex-shrink-0">' +
                '<div class="w-24 bg-slate-100 rounded-full h-1.5">' +
                  '<div class="bg-indigo-400 h-1.5 rounded-full" style="width:' + pct + '%"></div>' +
                '</div>' +
                '<svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>' +
              '</div>' +
            '</div>' +
          '</div>';
        }).join('') +
      '</div>' +

    '</div>';
}

// -- Sidebar Toggle (mobile) --------------------------------
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const isOpen  = !sidebar.classList.contains('-translate-x-full');
  if (isOpen) {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  } else {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
  }
}

// -- Copy Code ----------------------------------------------
function copyCode(btn) {
  const code = btn.closest('.code-wrapper').querySelector('code').innerText;
  navigator.clipboard.writeText(code).then(function() {
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(function() { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
  });
}

// -- Escape HTML for code blocks ----------------------------
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// -- Init ---------------------------------------------------
function init() {
  // Migrate old single-framework progress data to new keys
  const oldDone = localStorage.getItem('at_done');
  if (oldDone && !localStorage.getItem('at_done_angular')) {
    localStorage.setItem('at_done_angular', oldDone);
  }
  const oldLast = localStorage.getItem('at_last');
  if (oldLast && !localStorage.getItem('at_last_angular')) {
    localStorage.setItem('at_last_angular', oldLast);
  }

  updateFrameworkTabs();
  renderSidebar();
  updateProgress();

  const last = JSON.parse(localStorage.getItem('at_last_' + state.framework) || 'null');
  const mods = getModules();
  if (last && mods.find(function(m) { return m.id === last.moduleId; })) {
    loadQuestion(last.moduleId, last.questionId);
  } else {
    renderWelcome();
  }
}

document.addEventListener('DOMContentLoaded', init);
