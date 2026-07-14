(function () {
  'use strict';

  /* Elements where selection/copy must remain allowed */
  function isEditable(el) {
    if (!el) return false;
    var tag = el.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    if (el.isContentEditable) return true;
    /* walk up — the cron-generator copy btn calls clipboard API directly
       so we only need to guard the event-based path here */
    return false;
  }

  /* ── Block right-click context menu ── */
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    showToast();
  });

  /* ── Block copy/cut keyboard events on non-editable targets ── */
  document.addEventListener('copy', function (e) {
    if (isEditable(document.activeElement)) return;
    e.preventDefault();
    e.clipboardData && e.clipboardData.setData('text/plain', '');
    showToast();
  });

  document.addEventListener('cut', function (e) {
    if (isEditable(document.activeElement)) return;
    e.preventDefault();
  });

  /* ── Block Ctrl/Cmd + A (select all) outside inputs ── */
  document.addEventListener('keydown', function (e) {
    var mod = e.ctrlKey || e.metaKey;
    if (!mod) return;
    var k = e.key.toLowerCase();
    if (k === 'a' && !isEditable(document.activeElement)) {
      e.preventDefault();
    }
    /* Ctrl+C / Ctrl+X: let the copy event handler deal with them,
       but also prevent the Print Screen shortcut sequence is not blocked
       because we cannot intercept OS-level screenshot keys. */
  });

  /* ── Block drag-to-copy ── */
  document.addEventListener('dragstart', function (e) {
    if (isEditable(e.target)) return;
    e.preventDefault();
  });

  /* ── Toast notification ── */
  var toastTimer;
  function showToast() {
    var t = document.getElementById('protect-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'protect-toast';
      document.body.appendChild(t);
    }
    t.textContent = '🔒 Content is protected — copying is not allowed.';
    t.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('visible'); }, 2800);
  }
})();
