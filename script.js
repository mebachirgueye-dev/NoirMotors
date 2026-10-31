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
toggle.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

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
  const open = nav.classList.contains('open');
  toggle.classList.toggle('open', open); toggle.setAttribute('aria-expanded', open); document.body.classList.toggle('menu-open', open);
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
const CARS = [{"name": "McLaren 650S", "desc": "Supercar · V8 biturbo", "tag": "ICÔNE", "cat": "super", "yr": "2014 – 2017", "eng": "V8 3,8 L biturbo", "pw": "650 ch", "tq": "678 Nm", "tr": "Double embrayage 7 rapports · propulsion", "ac": "3,0 s", "vm": "333 km/h", "wt": "1 330 kg (à sec)", "lc": "#ff8a2a", "about": "Évolution de la 12C, la 650S reçoit un V8 3,8 L biturbo porté à 650 ch, une aérodynamique révisée et une suspension hydraulique plus incisive. Légère grâce à sa cellule carbone MonoCell, elle reste l'une des supercars les plus précises de sa génération.", "hi": ["Cellule carbone MonoCell", "Suspension hydraulique ProActive", "Freins carbone-céramique"], "img": "c1", "w3": 1800, "fl": [[13.8, 58.0, 16], [63.1, 57.4, 14]]}, {"name": "McLaren 720S", "desc": "Supercar · V8 biturbo", "tag": "RÉFÉRENCE", "cat": "super", "yr": "2017 – 2023", "eng": "V8 4,0 L biturbo", "pw": "720 ch", "tq": "770 Nm", "tr": "Double embrayage 7 rapports · propulsion", "ac": "2,9 s", "vm": "341 km/h", "wt": "1 283 kg (à sec)", "lc": "#cfe6ff", "about": "Deuxième génération de la gamme Super Series, la 720S adopte un V8 4,0 L biturbo, une cellule carbone MonoCage II et des portes papillon. Elle associe performances de premier plan et confort de conduite remarquable.", "hi": ["Cellule carbone MonoCage II", "Portes papillon", "Aileron arrière actif"], "img": "c13", "w3": 1800, "fl": [[47.8, 59.0, 13], [89.9, 59.3, 9]]}, {"name": "McLaren 12C", "desc": "Supercar · V8 biturbo", "tag": "LA GENÈSE", "cat": "super", "yr": "2011 – 2014", "eng": "V8 3,8 L biturbo", "pw": "600 ch", "tq": "600 Nm", "tr": "Double embrayage 7 rapports · propulsion", "ac": "3,3 s", "vm": "333 km/h", "wt": "1 336 kg (à sec)", "lc": "#ff9a2e", "about": "Premier modèle conçu et produit par McLaren Automotive, la 12C introduit la cellule carbone MonoCell, un V8 3,8 L biturbo et une suspension hydraulique ProActive qui relie les quatre roues.", "hi": ["Cellule carbone MonoCell", "Suspension ProActive", "Portes papillon"], "img": "c3", "w3": 1800, "fl": [[88.9, 64.4, 10]]}, {"name": "Lamborghini Aventador LP 700-4", "desc": "Supercar · V12 atmosphérique", "tag": "V12 ATMO", "cat": "super", "yr": "2011 – 2016", "eng": "V12 6,5 L atmosphérique", "pw": "700 ch", "tq": "690 Nm", "tr": "Robotisée 7 rapports · 4 roues motrices", "ac": "2,9 s", "vm": "350 km/h", "wt": "1 575 kg (à sec)", "lc": "#ff2b2b", "about": "Héritière de la Murciélago, l'Aventador inaugure un monocoque en fibre de carbone, une suspension à tirants (push-rod) et un V12 atmosphérique de 6,5 L. Ses portes à ouverture en ciseaux restent sa signature.", "hi": ["Monocoque en carbone", "Suspension à tirants (push-rod)", "Portes à ouverture en ciseaux"], "img": "c10", "w3": 1800, "fl": [[18.5, 36.0, 13]]}, {"name": "McLaren 750S", "desc": "Supercar · V8 biturbo", "tag": "DERNIÈRE-NÉE", "cat": "super", "yr": "Depuis 2023", "eng": "V8 4,0 L biturbo", "pw": "750 ch", "tq": "800 Nm", "tr": "Double embrayage 7 rapports · propulsion", "ac": "2,8 s", "vm": "332 km/h", "wt": "1 277 kg (à sec)", "lc": "#ff8a2a", "about": "Évolution de la 720S, la 750S gagne en puissance, en légèreté et en précision de conduite. Son V8 4,0 L biturbo développe 750 ch et sa suspension a été entièrement revue.", "hi": ["Cellule carbone MonoCage", "Aileron arrière actif", "Suspension Proactive Chassis Control"], "img": "c7", "w3": 1762, "fl": []}, {"name": "Audi R8 V8", "desc": "Sportive · V8 atmosphérique", "tag": "QUATTRO", "cat": "sport gt", "yr": "2007 – 2015", "eng": "V8 4,2 L atmosphérique", "pw": "420 ch", "tq": "430 Nm", "tr": "Manuelle 6 rapports ou R tronic · quattro", "ac": "4,6 s", "vm": "301 km/h", "wt": "1 560 kg", "lc": "#ffe7bd", "about": "Première génération de l'Audi R8, à moteur central et transmission intégrale quattro. Son V8 4,2 L atmosphérique, sa structure en aluminium et ses feux à LED ont marqué son époque.", "hi": ["V8 atmosphérique à moteur central", "Transmission intégrale quattro", "Structure aluminium Audi Space Frame"], "img": "c11", "w3": 1800, "fl": [[33.5, 50.0, 9], [76.9, 48.2, 9]]}, {"name": "Ford Mustang Shelby GT350", "desc": "Sportive · V8 atmosphérique", "tag": "V8 ATMO", "cat": "sport", "yr": "2016 – 2020", "eng": "V8 5,2 L atmosphérique", "pw": "533 ch", "tq": "582 Nm", "tr": "Manuelle 6 rapports · propulsion", "ac": "≈ 4,0 s", "vm": "≈ 290 km/h", "wt": "≈ 1 700 kg", "lc": "#e3f1ff", "about": "Variante la plus radicale de la Mustang de sixième génération, la Shelby GT350 reçoit un V8 5,2 L à vilebrequin à plan plat qui monte à 8 250 tr/min, une boîte manuelle à 6 rapports et un châssis affûté pour la piste.", "hi": ["V8 à vilebrequin à plan plat", "Amortissement piloté MagneRide", "Boîte manuelle 6 rapports"], "img": "c8", "w3": 1800, "fl": [[56.0, 51.2, 11], [16.0, 49.4, 9]]}, {"name": "Dallara Stradale", "desc": "Barchetta · 4 cylindres turbo", "tag": "POIDS PLUME", "cat": "limited sport", "yr": "Depuis 2019", "eng": "4 cylindres 2,3 L turbo", "pw": "400 ch", "tq": "500 Nm", "tr": "Manuelle 6 rapports · propulsion", "ac": "3,25 s", "vm": "280 km/h", "wt": "855 kg (à sec)", "lc": "#ffd36b", "about": "Conçue par Dallara, spécialiste italien des châssis de compétition, la Stradale est une barchetta de route d'à peine 855 kg. Sa cellule carbone et son aérodynamique lui procurent un appui rare pour un modèle homologué.", "hi": ["Cellule carbone", "Poids à sec de 855 kg", "Aérodynamique à fort appui"], "img": "c12", "w3": 1800, "fl": [[21.7, 50.9, 9], [78.9, 50.0, 9]]}, {"name": "Porsche 911 GT2 RS Clubsport", "desc": "Course-client · flat-6 biturbo", "tag": "CIRCUIT", "cat": "limited sport", "yr": "2018", "eng": "Flat-6 3,8 L biturbo", "pw": "700 ch", "tq": "750 Nm", "tr": "PDK 7 rapports · propulsion", "ac": "n.c.", "vm": "n.c.", "wt": "1 390 kg", "lc": "#ff3b30", "about": "Déclinaison course-client de la 911 GT2 RS, la Clubsport reprend le flat-6 3,8 L biturbo de 700 ch dans une configuration dédiée au circuit, avec arceau, baquet et aérodynamique de compétition. Elle n'est pas homologuée pour la route.", "hi": ["Flat-6 biturbo de 700 ch", "Boîte PDK à 7 rapports", "Équipement course : arceau et baquet"], "img": "c9", "w3": 1800, "fl": [[68.7, 44.2, 8]]}];
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
/* Hero : diaporama, nom du modèle et compteur synchronisés */
const HERO_NAMES = ['McLaren 650S', 'Lamborghini Aventador', 'McLaren 600LT · Mercedes-AMG GT R'];
const slides = [...document.querySelectorAll('.hero-car')], idx = document.querySelector('.hero-index'), endLabel = document.querySelector('.hero-bottom span:last-child');
let cur = 0;
const label = () => { const n = String(cur + 1).padStart(2, '0'), t = String(slides.length).padStart(2, '0'); idx.innerHTML = `${n} <span>/ ${t}</span><small class="hero-name">${HERO_NAMES[cur]}</small>`; endLabel.textContent = `${n} — ${t}`; };
label();
if (!reduce) setInterval(() => { if (document.hidden) return; slides[cur].classList.remove('is-on'); cur = (cur + 1) % slides.length; slides[cur].classList.add('is-on'); label(); }, 7000);
