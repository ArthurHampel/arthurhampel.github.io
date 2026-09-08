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
