/* Skill-Lite — Machine Learning Tutorial Navigation */

(function () {
  var SECTIONS = [
    { label: 'Getting Started', pages: [
      { file: 'introduction.html',      icon: '🧠', title: 'Introduction to ML' },
      { file: 'linear-regression.html', icon: '📈', title: 'Linear Regression' },
      { file: 'classification.html',    icon: '🏷️', title: 'Classification' },
    ]},
    { label: 'Neural Networks', pages: [
      { file: 'neural-networks.html',   icon: '🔮', title: 'Neural Networks' },
      { file: 'pytorch.html',           icon: '🔥', title: 'PyTorch' },
    ]},
    { label: 'Practical ML', pages: [
      { file: 'model-evaluation.html',    icon: '📊', title: 'Model Evaluation' },
      { file: 'feature-engineering.html', icon: '⚙️', title: 'Feature Engineering' },
    ]},
    { label: 'Reference', pages: [
      { file: 'cheatsheet.html', icon: '⌨️', title: 'Cheat Sheet' },
    ]},
  ];

  var PAGES = [];
  SECTIONS.forEach(function (s) { s.pages.forEach(function (p) { PAGES.push(p); }); });

  function currentFile() {
    var parts = window.location.pathname.split('/');
    return parts[parts.length - 1] || 'introduction.html';
  }
  function isTutorialPage() {
    var file = currentFile();
    return PAGES.some(function (p) { return p.file === file; });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var file = currentFile();
    var onTutorial = isTutorialPage();

    /* ── Dropdown ── */
    var dropdown = document.getElementById('mlDropdown');
    if (dropdown) {
      var root = dropdown.getAttribute('data-root') || '';
      var html = '';
      SECTIONS.forEach(function (sec, i) {
        if (i > 0) html += '<div class="nav-dropdown-divider"></div>';
        sec.pages.forEach(function (p) {
          var active = onTutorial && p.file === file ? ' active' : '';
          html += '<a href="' + root + p.file + '" class="nav-dropdown-item' + active + '">' + p.icon + ' ' + p.title + '</a>';
        });
      });
      dropdown.innerHTML = html;
    }

    /* ── Sidebar ── */
    var side = document.getElementById('sideNav');
    if (side && onTutorial) {
      var sHtml = '<div class="side-title"><span class="ml-logo">🧠</span>Machine Learning</div>';
      SECTIONS.forEach(function (sec) {
        sHtml += '<div class="side-section-label">' + sec.label + '</div>';
        sec.pages.forEach(function (p) {
          var active = p.file === file ? ' active' : '';
          sHtml += '<a href="' + p.file + '" class="side-link' + active + '"><span class="side-icon">' + p.icon + '</span>' + p.title + '</a>';
        });
      });
      side.innerHTML = sHtml;

      var toggle = document.createElement('button');
      toggle.className = 'side-toggle'; toggle.innerHTML = '☰ Contents';
      var backdrop = document.createElement('div');
      backdrop.className = 'side-backdrop';
      document.body.appendChild(toggle); document.body.appendChild(backdrop);
      function closeSide() { side.classList.remove('open'); backdrop.classList.remove('show'); }
      toggle.addEventListener('click', function () {
        side.classList.toggle('open');
        backdrop.classList.toggle('show', side.classList.contains('open'));
      });
      backdrop.addEventListener('click', closeSide);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSide(); });
    }

    /* ── Pager ── */
    var pager = document.getElementById('pager');
    if (pager && onTutorial) {
      var idx = -1;
      PAGES.forEach(function (p, i) { if (p.file === file) idx = i; });
      var pHtml = '';
      if (idx > 0) {
        var prev = PAGES[idx - 1];
        pHtml += '<a href="' + prev.file + '" class="prev"><span class="pager-label">&#8592; Previous</span><span class="pager-title">' + prev.title + '</span></a>';
      } else { pHtml += '<div class="pager-spacer"></div>'; }
      if (idx >= 0 && idx < PAGES.length - 1) {
        var next = PAGES[idx + 1];
        pHtml += '<a href="' + next.file + '" class="next"><span class="pager-label">Next &#8594;</span><span class="pager-title">' + next.title + '</span></a>';
      } else { pHtml += '<div class="pager-spacer"></div>'; }
      pager.innerHTML = pHtml;
    }

    /* ── Copy buttons ── */
    var blocks = document.querySelectorAll('pre.code');
    Array.prototype.forEach.call(blocks, function (pre) {
      var btn = document.createElement('button');
      btn.className = 'copy-code-btn'; btn.textContent = 'Copy';
      btn.addEventListener('click', function () {
        var code = pre.querySelector('code');
        var text = code ? code.textContent : pre.textContent;
        function done() { btn.textContent = 'Copied!'; setTimeout(function () { btn.textContent = 'Copy'; }, 1400); }
        if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done); }
        else {
          var ta = document.createElement('textarea'); ta.value = text;
          document.body.appendChild(ta); ta.select(); document.execCommand('copy');
          document.body.removeChild(ta); done();
        }
      });
      pre.appendChild(btn);
    });
  });
})();
