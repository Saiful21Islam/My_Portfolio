const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

gsap.registerPlugin(ScrollTrigger);

/* Hero entrance */
gsap.to('.hero-eyebrow', { opacity: 1, y: 0, duration: .9, delay: .2, ease: 'power3.out' });
gsap.fromTo('.hero-title .line span', { yPercent: 115 }, { yPercent: 0, duration: 1.1, stagger: .12, delay: .35, ease: 'power4.out' });
gsap.from('.hero-bottom', { opacity: 0, y: 20, duration: .9, delay: .9, ease: 'power3.out' });

/* Hero parallax on scroll */
if (!reduceMotion) {
  gsap.to('#heroImg', {
    yPercent: 12,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });
}

/* Generic scroll reveals */
const revealTargets = document.querySelectorAll(
  '.about-copy, .side-panel, .interlude h2, .interlude .sub, .tl-row, .stack-item, .cap-card, .lead-row, .lang-cell, .sec-head'
);
revealTargets.forEach(el => {
  gsap.fromTo(el, { opacity: 0, y: 34 }, {
    opacity: 1, y: 0, duration: .9, ease: 'power3.out',
    scrollTrigger: { trigger: el, start: 'top 88%' }
  });
});

/* Stagger children where useful */
gsap.utils.toArray('.about-facts .fact-block').forEach((el, i) => {
  gsap.fromTo(el, { opacity: 0, y: 20 }, {
    opacity: 1, y: 0, duration: .7, delay: i * 0.08, ease: 'power2.out',
    scrollTrigger: { trigger: '.about-facts', start: 'top 90%' }
  });
});

/* Language bars */
document.querySelectorAll('.lang-cell').forEach(cell => {
  ScrollTrigger.create({
    trigger: cell, start: 'top 90%',
    onEnter: () => {
      const fill = cell.querySelector('.lbar-fill');
      if (fill) {
        fill.style.width = fill.getAttribute('data-w') + '%';
      }
    }
  });
});

/* Ambient light-dust canvas in hero */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function init() {
    resize();
    const count = w < 700 ? 40 : 90;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: 0.6 + Math.random() * 1.8,
      s: 0.15 + Math.random() * 0.35,
      o: 0.15 + Math.random() * 0.35
    }));
  }
  init();
  window.addEventListener('resize', init);

  function draw() {
    if (reduceMotion) return;
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,162,39,${p.o})`;
      ctx.fill();
      p.y -= p.s;
      p.x += Math.sin(p.y * 0.01) * 0.15;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// --- Gallery Lightbox & Animation JS ---
document.addEventListener("DOMContentLoaded", () => {
  const galleryItems = document.querySelectorAll(".gallery-item");

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const imgSrc = item.querySelector("img").src;
      const title = item.querySelector("h4")?.innerText || "";
      const desc = item.querySelector("p")?.innerText || "";

      const lightbox = document.createElement("div");
      lightbox.id = "gallery-lightbox";
      lightbox.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
        padding: 20px;
        cursor: pointer;
      `;

      lightbox.innerHTML = `
        <div style="max-width: 800px; width: 100%; text-align: center; color: #fff; position: relative;" onclick="event.stopPropagation()">
          <span id="close-lightbox" style="position: absolute; top: -40px; right: 0; font-size: 30px; cursor: pointer; color: #fff;">&times;</span>
          <img src="${imgSrc}" style="max-width: 100%; max-height: 75vh; border-radius: 8px; object-fit: contain;">
          <h3 style="margin-top: 15px; font-size: 1.5rem;">${title}</h3>
          <p style="color: #ccc; margin-top: 5px;">${desc}</p>
        </div>
      `;

      document.body.appendChild(lightbox);
      setTimeout(() => (lightbox.style.opacity = "1"), 10);

      const closeBtn = lightbox.querySelector("#close-lightbox");
      const closeLightbox = () => {
        lightbox.style.opacity = "0";
        setTimeout(() => lightbox.remove(), 300);
      };

      closeBtn.addEventListener("click", closeLightbox);
      lightbox.addEventListener("click", closeLightbox);
    });
  });

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.from(".gallery-item", {
      scrollTrigger: {
        trigger: "#gallery",
        start: "top 80%",
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out",
    });
  }
});

/* Smooth Scroll handling */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    }
  });
});