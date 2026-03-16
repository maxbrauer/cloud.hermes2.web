/* ===== HERMES — Main JS ===== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Header scroll effect --- */
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });

  /* --- Mobile menu --- */
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });

  /* --- Active nav link on scroll --- */
  const sections = document.querySelectorAll('section[id]');
  const navLinksList = document.querySelectorAll('.nav-links a');
  const onScroll = () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinksList.forEach(a => {
          a.classList.remove('active');
          if (a.getAttribute('href') === '#' + id) a.classList.add('active');
        });
      }
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* --- FAQ accordion --- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  /* --- Service tabs --- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const serviceGroups = document.querySelectorAll('.service-group');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.tab;
      serviceGroups.forEach(g => {
        g.style.display = (target === 'all' || g.dataset.category === target) ? 'block' : 'none';
      });
    });
  });

  /* --- Scroll animations with stagger --- */
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger children if they have .stagger class
        const staggerItems = entry.target.querySelectorAll('.stagger-item');
        if (staggerItems.length) {
          staggerItems.forEach((item, i) => {
            setTimeout(() => item.classList.add('visible'), i * 100);
          });
        }
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

  /* --- Counter animation with easing --- */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 1500;
        const startTime = performance.now();

        const easeOut = t => 1 - Math.pow(1 - t, 3);

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easeOut(progress);
          const current = Math.round(easedProgress * target);
          el.textContent = prefix + current + suffix;
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  /* --- Parallax on hero photos --- */
  const heroPhotos = document.querySelectorAll('.hero-photo');
  if (heroPhotos.length && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroPhotos.forEach((photo, i) => {
          const speed = 0.02 + (i * 0.015);
          photo.style.transform = `translateY(${scrollY * speed}px)`;
        });
      }
    }, { passive: true });
  }

  /* --- Tilt effect on service cards --- */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* --- Magnetic effect on CTA buttons --- */
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* --- Form validation with animation --- */
  const form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn');
      // Success animation
      btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="9" stroke="white" stroke-width="2">
            <animate attributeName="stroke-dasharray" from="0 57" to="57 0" dur=".5s" fill="freeze"/>
          </circle>
          <path d="M6 10l3 3 5-6" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <animate attributeName="stroke-dasharray" from="0 20" to="20 0" dur=".4s" begin=".3s" fill="freeze"/>
          </path>
        </svg>
        ¡Mensaje Enviado!
      `;
      btn.style.background = '#27AE60';
      btn.style.pointerEvents = 'none';
      setTimeout(() => {
        btn.innerHTML = `Enviar Mensaje <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9h12M11 5l4 4-4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        btn.style.background = '';
        btn.style.pointerEvents = '';
        form.reset();
      }, 3000);
    });
  }

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = header.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* --- Typing effect on hero h1 highlight --- */
  const highlight = document.querySelector('.hero-text h1 .highlight');
  if (highlight) {
    const text = highlight.textContent;
    highlight.textContent = '';
    highlight.style.borderRight = '2px solid var(--accent)';
    let i = 0;
    const typeInterval = setInterval(() => {
      highlight.textContent = text.slice(0, ++i);
      if (i >= text.length) {
        clearInterval(typeInterval);
        setTimeout(() => { highlight.style.borderRight = 'none'; }, 600);
      }
    }, 50);
  }

  /* --- Hide scroll indicator on scroll --- */
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    window.addEventListener('scroll', () => {
      scrollIndicator.style.opacity = window.scrollY > 100 ? '0' : '1';
      scrollIndicator.style.transition = 'opacity .5s ease';
    }, { passive: true });
  }

});

/* --- CSS for animate-on-scroll --- */
const style = document.createElement('style');
style.textContent = `
  .animate-on-scroll {
    opacity: 0; transform: translateY(30px);
    transition: opacity .6s ease, transform .6s ease;
  }
  .animate-on-scroll.visible {
    opacity: 1; transform: translateY(0);
  }
  .stagger-item {
    opacity: 0; transform: translateY(20px);
    transition: opacity .5s ease, transform .5s ease;
  }
  .stagger-item.visible {
    opacity: 1; transform: translateY(0);
  }
`;
document.head.appendChild(style);
