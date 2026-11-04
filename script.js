const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

const form = document.querySelector('.contact-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  form.querySelector('.form-feedback').textContent = 'Merci. Votre demande a bien été préparée (formulaire de démonstration).';
  form.reset();
});

document.querySelectorAll('.car-card').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (window.matchMedia('(hover: hover)').matches) {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      card.querySelector('.car-image').style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    }
  });
  card.addEventListener('pointerleave', () => card.querySelector('.car-image').style.transform = '');
});

/* ===== v2 ===== */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const header = document.querySelector('.header');
const onScroll = () => header.classList.toggle('scrolled', scrollY > 40);
onScroll(); addEventListener('scroll', onScroll, { passive: true });

const closeMenu = () => { nav.classList.remove('open'); toggle.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); };
toggle.addEventListener('click', () => {
  const open = !nav.classList.contains('open');
  nav.classList.toggle('open', open);
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

const counters = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  counters.unobserve(entry.target);
  const el = entry.target, end = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length;
  if (reduce) return;
  const start = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / 1800, 1);
    el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec).replace('.', ',');
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}), { threshold: .6 });
document.querySelectorAll('[data-count]').forEach(el => counters.observe(el));

document.querySelectorAll('.filters button').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.filters button').forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('aria-pressed', b === btn); });
  const f = btn.dataset.filter;
  document.querySelectorAll('.car-card').forEach(c => c.classList.toggle('hide', f !== 'all' && !c.dataset.cat.split(' ').includes(f)));
}));

if (fine && !reduce) {
  const hero = document.querySelector('.hero'), vis = document.querySelector('.hero-visual');
  hero.addEventListener('pointermove', e => {
    const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
    vis.style.transform = `translate3d(${x * -14}px, ${y * -8}px, 0) scale(1.03)`;
  });
  const ring = document.querySelector('.cursor-glow'); let tx = 0, ty = 0, x = 0, y = 0;
  addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; ring.style.opacity = 1; });
  (function loop() { x += (tx - x) * .18; y += (ty - y) * .18; ring.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`; requestAnimationFrame(loop); })();
  document.querySelectorAll('a, button, .car-card').forEach(el => {
    el.addEventListener('pointerenter', () => ring.classList.add('big'));
    el.addEventListener('pointerleave', () => ring.classList.remove('big'));
  });
  document.querySelectorAll('.button, .nav-cta').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`; });
    b.addEventListener('pointerleave', () => b.style.transform = '');
  });
}

/* ===== v7 : vraies voitures, fiches, lumières par modèle ===== */
const CARS = window.NOIR_MOTORS_CARS;
const grid = document.querySelector('.cars-grid');
grid.innerHTML = CARS.map((c, i) => `<article class="car-card reveal" data-cat="${c.cat}"><div class="car-image" style="--lc:${c.lc}" role="button" tabindex="0" aria-pressed="false" aria-label="Allumer les phares : ${c.name}"><span class="car-number">${String(i + 1).padStart(2, '0')}</span><span class="car-tag">${c.tag}</span><div class="car-ph"><img class="car-photo" src="assets/${c.img}-1200.jpg" srcset="assets/${c.img}-800.jpg 800w, assets/${c.img}-1200.jpg 1200w, assets/${c.img}-1800.jpg ${c.w3}w" sizes="(min-width: 851px) 31vw, 94vw" width="1200" height="900" loading="lazy" decoding="async" alt="${c.name}">${c.fl.map(f => `<i class="flare" style="left:${f[0]}%;top:${f[1]}%;--s:${f[2]}%"></i>`).join('')}</div><i class="pool"></i><i class="sheen"></i></div><div class="car-info"><div><h3>${c.name.toUpperCase()}</h3><p>${c.desc.toUpperCase()}</p></div><a href="#fiche" aria-label="Voir la fiche technique : ${c.name}">↗</a></div><ul class="car-specs"><li><b>${c.eng}</b>Moteur</li><li><b>${c.pw}</b>Puissance</li><li><b>${c.ac}</b>0–100 km/h</li><li><b>${c.vm}</b>Vitesse maxi</li></ul></article>`).join('');
const dlg = document.getElementById('fiche'), fbody = dlg.querySelector('.fiche-body');
const openFiche = i => {
  const c = CARS[i];
  fbody.innerHTML = `<div class="fiche-grid"><div class="fiche-img"><img src="assets/${c.img}-1200.jpg" srcset="assets/${c.img}-1200.jpg 1200w, assets/${c.img}-1800.jpg ${c.w3}w" sizes="(min-width: 851px) 55vw, 94vw" alt="${c.name}"></div><div class="fiche-txt"><p class="eyebrow"><i></i> ${c.tag} · ${c.yr}</p><h3 id="fiche-title">${c.name}</h3><p class="fiche-about">${c.about}</p><dl>${[['Moteur', c.eng], ['Puissance', c.pw], ['Couple', c.tq], ['Transmission', c.tr], ['0–100 km/h', c.ac], ['Vitesse maxi', c.vm], ['Poids', c.wt], ['Production', c.yr]].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl><p class="fiche-sub">Points forts</p><ul>${c.hi.map(t => `<li>${t}</li>`).join('')}</ul><button class="button button-red" data-ask="${i}">Demander des renseignements <span>↗</span></button><p class="fiche-note">Valeurs constructeur, indicatives : elles varient selon la version et les options. n.c. = non communiqué.</p></div></div>`;
  dlg.showModal();
};
fbody.addEventListener('click', e => {
  const b = e.target.closest('[data-ask]'); if (!b) return;
  const f = document.querySelector('.contact-form');
  f.querySelector('select').value = 'Renseignements';
  f.querySelector('textarea').value = `Bonjour, je souhaite recevoir la documentation et les disponibilités concernant : ${CARS[b.dataset.ask].name}.`;
  dlg.close(); location.hash = '#contact';
});
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
const cards = [...document.querySelectorAll('.car-card')];
cards.forEach((card, i) => {
  observer.observe(card);
  const stage = card.querySelector('.car-image');
  card.querySelector('.car-info a').addEventListener('click', e => { e.preventDefault(); openFiche(i); });
  const select = () => {
    const was = card.classList.contains('on');
    cards.forEach(c => { c.classList.remove('on', 'boot'); c.querySelector('.car-image').setAttribute('aria-pressed', 'false'); });
    if (!was) { card.classList.add('on'); stage.setAttribute('aria-pressed', 'true'); }
  };
  stage.addEventListener('click', select);
  stage.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); } });
  card.addEventListener('pointermove', e => {
    if (!matchMedia('(hover: hover)').matches) return;
    const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    stage.style.transform = `perspective(900px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`;
  });
  card.addEventListener('pointerleave', () => stage.style.transform = '');
});
/* Au chargement : les phares s'allument puis s'éteignent, voiture après voiture */
const boot = new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting) return;
  boot.disconnect();
  cards.slice(0, 6).forEach((c, i) => setTimeout(() => { c.classList.add('boot', 'on'); setTimeout(() => { if (c.classList.contains('boot')) c.classList.remove('boot', 'on'); }, 1900); }, i * 280));
}, { threshold: .2 });
boot.observe(grid);
const mCar = document.querySelector('.manifesto-car');
new IntersectionObserver(([e]) => mCar.classList.toggle('on', e.isIntersecting), { threshold: .3 }).observe(mCar);
/* Thème clair / sombre avec révélation circulaire */
const themeBtn = document.querySelector('.theme-toggle');
const setTheme = t => { document.documentElement.dataset.theme = t; try { localStorage.setItem('nm-theme', t); } catch (e) {} };
themeBtn.addEventListener('click', e => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  if (!document.startViewTransition || reduce) return setTheme(next);
  const x = e.clientX, y = e.clientY, r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.startViewTransition(() => setTheme(next)).ready.then(() => document.documentElement.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] }, { duration: 700, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }));
});
