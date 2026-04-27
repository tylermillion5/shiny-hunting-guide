// ============================================================
// The Shiny Hunting Guide — main.js
// Tyler Million — ITEC 2380 Final Project
// ============================================================

// ---------- Sparkle Particles ----------
(function () {
  const container = document.getElementById('sparkles');
  if (!container) return;

  const colors = ['#FFD700', '#00E5FF', '#ffffff', '#c084fc'];

  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const dur = (2 + Math.random() * 4).toFixed(2) + 's';
    const delay = (Math.random() * 5).toFixed(2) + 's';
    const left = (Math.random() * 100).toFixed(2) + '%';
    const top  = (Math.random() * 100).toFixed(2) + '%';

    el.className = 'sparkle';
    el.setAttribute('style',
      '--dur:' + dur + ';' +
      '--delay:' + delay + ';' +
      '--size:' + size.toFixed(2) + 'px;' +
      '--left:' + left + ';' +
      '--top:' + top + ';' +
      '--color:' + color + ';'
    );

    container.appendChild(el);
  }
}());
