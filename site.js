// The target: each hover moves the dot to the next color.
const target = document.getElementById('target');
const hues = ['#3E6B5A', '#7A4A24', '#A6803A', '#8B3A3A', '#3A5A8B', '#6B4A8B'];
let hue = 0;
target.addEventListener('mouseenter', () => {
  hue = (hue + 1) % hues.length;
  document.documentElement.style.setProperty('--dot', hues[hue]);
});
