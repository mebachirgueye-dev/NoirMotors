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
