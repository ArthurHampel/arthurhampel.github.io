// The target: each hover moves the dot to the next color,
// and the color follows you from page to page.
const target = document.getElementById('target');
const hues = ['#3E6B5A', '#7A4A24', '#A6803A', '#8B3A3A', '#3A5A8B', '#6B4A8B'];

function saveDot(color) {
  try { localStorage.setItem('dot-color', color); } catch (e) {}
}
try {
  const saved = localStorage.getItem('dot-color');
  if (saved && hues.includes(saved)) {
    document.documentElement.style.setProperty('--dot', saved);
  }
} catch (e) {}

if (target) target.addEventListener('mouseenter', () => {
  const cur = document.documentElement.style.getPropertyValue('--dot').trim();
  const next = hues[(hues.indexOf(cur) + 1) % hues.length];
  document.documentElement.style.setProperty('--dot', next);
  saveDot(next);
});

// Outbound links open in a new tab; this site stays where it is.
document.addEventListener('click', e => {
  const a = e.target.closest('a[href]');
  if (a && /^https?:/i.test(a.getAttribute('href'))) {
    a.target = '_blank';
    a.rel = 'noopener';
  }
});

// A quiet slider in the margin: the dot rides along as you scroll the years.
(function () {
  let entries = [];
  let rail, dot, yearEl;
  function visibleEntries() {
    return Array.from(document.querySelectorAll('.content .entry h3'))
      .filter(h => h.offsetParent !== null);
  }
  function label(h) {
    const w = h.querySelector('.when');
    if (w) return w.textContent.trim();
    const parts = h.textContent.split(',');
    return parts.length > 1 ? parts.slice(1).join(',').trim() : '';
  }
  function update() {
    if (!rail || entries.length < 5) return;
    const first = entries[0].closest('.entry');
    const last = entries[entries.length - 1].closest('.entry');
    const start = first.getBoundingClientRect().top + scrollY;
    const end = last.getBoundingClientRect().top + scrollY + last.offsetHeight;
    const p = Math.min(1, Math.max(0, (scrollY + innerHeight / 2 - start) / (end - start)));
    document.documentElement.style.setProperty('--era', p.toFixed(3));
    dot.style.top = (p * 100) + '%';
    yearEl.style.top = (p * 100) + '%';
    let best = null, bd = Infinity;
    for (const h of entries) {
      const r = h.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - innerHeight / 2);
      if (d < bd) { bd = d; best = h; }
    }
    if (best) yearEl.textContent = label(best);
  }
  function refresh() {
    entries = visibleEntries();
    const want = entries.length >= 5;
    if (want && !rail) {
      rail = document.createElement('div');
      rail.className = 'timescroll';
      rail.setAttribute('aria-hidden', 'true');
      rail.innerHTML = '<div class="ts-dot"></div><span class="ts-year"></span>';
      document.body.appendChild(rail);
      dot = rail.querySelector('.ts-dot');
      yearEl = rail.querySelector('.ts-year');
    }
    if (rail) rail.style.display = want ? '' : 'none';
    document.body.classList.toggle('era-scroll', want);
    if (!want) document.documentElement.style.setProperty('--era', 1);
    update();
  }
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  addEventListener('hashchange', () => setTimeout(refresh, 50));
  refresh();
  setTimeout(refresh, 150); // the artifact preview renders pages a beat after load
})();
