/* Skill-Lite — Theme Switcher
   Applies saved theme on load and injects a picker into .main-nav */

(function () {
  const THEMES = [
    { id: 'default',  name: 'Purple',   color: '#6c63ff' },
    { id: 'ocean',    name: 'Ocean',    color: '#0ea5e9' },
    { id: 'emerald',  name: 'Emerald',  color: '#10b981' },
    { id: 'amber',    name: 'Amber',    color: '#f59e0b' },
    { id: 'rose',     name: 'Rose',     color: '#f43f5e' },
    { id: 'midnight', name: 'Midnight', color: '#818cf8' },
    { id: 'nord',     name: 'Nord',     color: '#88c0d0' },
  ];

  const KEY = 'devtoolkit-theme';

  function applyTheme(id) {
    const html = document.documentElement;
    html.className = id === 'default' ? '' : 'theme-' + id;
    localStorage.setItem(KEY, id);
  }

  function currentTheme() {
    return localStorage.getItem(KEY) || 'default';
  }

  /* Apply immediately to avoid flash of default theme */
  applyTheme(currentTheme());

  document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;

    const active = currentTheme();
    const activeTheme = THEMES.find(t => t.id === active) || THEMES[0];

    /* ── Build picker HTML ── */
    const picker = document.createElement('div');
    picker.className = 'theme-picker';

    const trigger = document.createElement('button');
    trigger.className = 'theme-trigger';
    trigger.setAttribute('title', 'Switch theme');
    trigger.setAttribute('aria-label', 'Switch theme');
    trigger.innerHTML =
      '<span class="theme-trigger-dot" id="triggerDot" style="background:' + activeTheme.color + '"></span>' +
      '<span>Theme</span>';

    const panel = document.createElement('div');
    panel.className = 'theme-panel';
    panel.setAttribute('role', 'menu');

    const title = document.createElement('div');
    title.className = 'theme-panel-title';
    title.textContent = 'Color Theme';

    const grid = document.createElement('div');
    grid.className = 'theme-options';

    THEMES.forEach(function (t) {
      const opt = document.createElement('button');
      opt.className = 'theme-opt' + (t.id === active ? ' active' : '');
      opt.dataset.themeId = t.id;
      opt.setAttribute('title', t.name);
      opt.innerHTML =
        '<span class="theme-swatch" style="--c:' + t.color + '"></span>' +
        '<span class="theme-opt-name">' + t.name + '</span>';
      grid.appendChild(opt);
    });

    panel.appendChild(title);
    panel.appendChild(grid);
    picker.appendChild(trigger);
    picker.appendChild(panel);
    nav.appendChild(picker);

    /* ── Panel positioning ── */
    function openPanel() {
      panel.classList.add('open');
      const rect = trigger.getBoundingClientRect();
      panel.style.top  = (rect.bottom + 6) + 'px';
      panel.style.right = Math.max(8, window.innerWidth - rect.right) + 'px';
    }

    function closePanel() {
      panel.classList.remove('open');
    }

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      panel.classList.contains('open') ? closePanel() : openPanel();
    });

    document.addEventListener('click', closePanel);
    panel.addEventListener('click', function (e) { e.stopPropagation(); });

    /* ── Swatch selection ── */
    grid.addEventListener('click', function (e) {
      const opt = e.target.closest('.theme-opt');
      if (!opt) return;

      const id = opt.dataset.themeId;
      applyTheme(id);

      /* Update active state */
      grid.querySelectorAll('.theme-opt').forEach(function (o) {
        o.classList.toggle('active', o.dataset.themeId === id);
      });

      /* Update trigger dot */
      const theme = THEMES.find(function (t) { return t.id === id; }) || THEMES[0];
      const dot = trigger.querySelector('#triggerDot');
      if (dot) dot.style.background = theme.color;

      closePanel();
    });

    /* ── Dropdown menus ── */
    var menus = document.querySelectorAll('.nav-menu');

    function positionDropdown(menuTrigger, dropdown) {
      var rect = menuTrigger.getBoundingClientRect();
      dropdown.style.top  = (rect.bottom + 4) + 'px';
      dropdown.style.left = rect.left + 'px';
    }

    menus.forEach(function (menu) {
      var menuTrigger = menu.querySelector('.nav-menu-trigger');
      if (!menuTrigger) return;
      menuTrigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = menu.classList.contains('open');
        menus.forEach(function (m) { m.classList.remove('open'); });
        if (!isOpen) {
          menu.classList.add('open');
          var dropdown = menu.querySelector('.nav-dropdown');
          if (dropdown) positionDropdown(menuTrigger, dropdown);
        }
      });
    });
    document.addEventListener('click', function () {
      menus.forEach(function (m) { m.classList.remove('open'); });
    });

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closePanel();
        menus.forEach(function (m) { m.classList.remove('open'); });
      }
    });

    /* Reposition on scroll/resize */
    window.addEventListener('resize', function () {
      if (panel.classList.contains('open')) openPanel();
      var openMenu = document.querySelector('.nav-menu.open');
      if (openMenu) {
        var t = openMenu.querySelector('.nav-menu-trigger');
        var d = openMenu.querySelector('.nav-dropdown');
        if (t && d) positionDropdown(t, d);
      }
    });
  });
})();
