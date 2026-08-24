const root = document.documentElement;
let language = 'ru';

function setLanguage(next) {
  language = next;
  root.lang = next;
  document.querySelectorAll('[data-ru][data-en]').forEach((element) => {
    element.innerHTML = element.dataset[next];
  });
  document.getElementById('langSwitch').textContent = next === 'ru' ? 'EN' : 'RU';
}

document.getElementById('langSwitch').addEventListener('click', () => setLanguage(language === 'ru' ? 'en' : 'ru'));
document.getElementById('themeSwitch').addEventListener('click', () => {
  const dark = root.dataset.theme === 'dark';
  root.dataset.theme = dark ? 'light' : 'dark';
  document.getElementById('themeSwitch').textContent = dark ? '◐' : '◑';
});

const carousel = document.getElementById('caseCarousel');
const track = carousel.querySelector('.case-track');
const cards = [...track.children];
const currentCase = document.getElementById('currentCase');
let index = 0;
let overview = false;
let dragStart = null;

function stepWidth() { return cards[0].getBoundingClientRect().width + (window.innerWidth <= 760 ? 12 : 18); }
function renderCarousel() {
  if (overview) {
    track.style.transform = 'translateX(0)';
    track.style.width = 'auto';
    carousel.classList.add('is-overview');
  } else {
    carousel.classList.remove('is-overview');
    track.style.width = 'max-content';
    track.style.transform = `translateX(${-index * stepWidth()}px)`;
  }
  currentCase.textContent = String(index + 1).padStart(2, '0');
}
function move(delta) { if (!overview) { index = Math.max(0, Math.min(cards.length - 1, index + delta)); renderCarousel(); } }

document.getElementById('prevCase').addEventListener('click', () => move(-1));
document.getElementById('nextCase').addEventListener('click', () => move(1));
carousel.addEventListener('keydown', (event) => { if (event.key === 'ArrowRight') move(1); if (event.key === 'ArrowLeft') move(-1); });
carousel.addEventListener('pointerdown', (event) => { dragStart = event.clientX; carousel.setPointerCapture(event.pointerId); });
carousel.addEventListener('pointerup', (event) => { if (dragStart === null) return; const distance = event.clientX - dragStart; if (Math.abs(distance) > 35) move(distance < 0 ? 1 : -1); dragStart = null; });
window.addEventListener('resize', renderCarousel);

document.querySelectorAll('[data-view]').forEach((button) => {
  button.addEventListener('click', () => {
    overview = button.dataset.view === 'overview';
    document.querySelectorAll('[data-view]').forEach((control) => { const active = control === button; control.classList.toggle('is-active', active); control.setAttribute('aria-pressed', String(active)); });
    document.querySelector('.view-label').textContent = overview ? (language === 'ru' ? 'Все проекты' : 'All projects') : (language === 'ru' ? 'Фокусный просмотр' : 'Focus view');
    renderCarousel();
  });
});

const priceToggle = document.getElementById('priceToggle');
const passiveConstraints = [...document.querySelectorAll('.constraint')];
const constraintMessage = document.getElementById('constraintMessage');
priceToggle.addEventListener('change', () => {
  passiveConstraints.forEach((item) => { item.checked = priceToggle.checked || item === passiveConstraints[1]; });
  constraintMessage.textContent = priceToggle.checked
    ? (language === 'ru' ? 'Есть ресурс на скорость, качество и результат.' : 'There is room for speed, quality and results.')
    : (language === 'ru' ? 'Быстро — значит быстро. Остальное требует ресурса.' : 'Fast means fast. The rest takes resources.');
});

const heatmap = document.getElementById('heatmap');
let heatmapTimer;
window.addEventListener('scroll', () => { heatmap.classList.add('is-visible'); clearTimeout(heatmapTimer); heatmapTimer = setTimeout(() => heatmap.classList.remove('is-visible'), 600); }, { passive: true });
renderCarousel();
