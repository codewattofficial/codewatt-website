/* ============================================================
   CodeWatt — Common Script
   Shared across all pages: index, about, services, projects,
   blog, contact. Each feature block checks that its elements
   exist before wiring up, so this one file is safe to include
   on every page even though not every page has every element.
   ============================================================ */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky navbar shrink/blur on scroll ---------- */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  /* ---------- Mobile burger menu ---------- */
  const burger = document.getElementById('burgerBtn');
  const mobilePanel = document.getElementById('mobilePanel');
  if (burger && mobilePanel) {
    const closeMenu = () => {
      burger.classList.remove('open');
      mobilePanel.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    };
    burger.addEventListener('click', () => {
      const open = mobilePanel.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('#mobilePanel a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Back-to-top button ---------- */
  const backTop = document.getElementById('backTop');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 500);
    });
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Reveal-on-scroll animations ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (reduceMotion) {
      reveals.forEach(el => el.classList.add('in'));
    } else {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('in');
        });
      }, { threshold: 0.12 });
      reveals.forEach(el => revealObserver.observe(el));
    }
  }

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const suffix = el.dataset.suffix || '';
          if (reduceMotion) {
            el.textContent = target + suffix;
            counterObserver.unobserve(el);
            return;
          }
          let current = 0;
          const totalSteps = Math.min(target, 50) || 1;
          const step = target / totalSteps;
          const intervalMs = Math.max(1400 / totalSteps, 20);
          const tick = setInterval(() => {
            current += step;
            if (current >= target) { el.textContent = target + suffix; clearInterval(tick); }
            else el.textContent = Math.floor(current) + suffix;
          }, intervalMs);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* ---------- Homepage: audience split hover (business / students) ---------- */
  const panelBiz = document.getElementById('panelBusiness');
  const panelStu = document.getElementById('panelStudents');
  if (panelBiz && panelStu) {
    panelBiz.addEventListener('mouseenter', () => { panelBiz.classList.add('expand'); panelStu.classList.add('compress'); });
    panelBiz.addEventListener('mouseleave', () => { panelBiz.classList.remove('expand'); panelStu.classList.remove('compress'); });
    panelStu.addEventListener('mouseenter', () => { panelStu.classList.add('expand'); panelBiz.classList.add('compress'); });
    panelStu.addEventListener('mouseleave', () => { panelStu.classList.remove('expand'); panelBiz.classList.remove('compress'); });
  }

  /* ---------- Homepage: testimonial marquee pause on touch ---------- */
  const testMarquee = document.getElementById('testMarquee');
  if (testMarquee) {
    testMarquee.addEventListener('touchstart', () => testMarquee.classList.add('paused'), { passive: true });
  }

  /* ---------- Homepage: About "Read more" toggle ---------- */
  const readBtn = document.getElementById('readMoreBtn');
  const aboutExtra = document.querySelector('.about-extra');
  if (readBtn && aboutExtra) {
    readBtn.addEventListener('click', () => {
      const isOpen = aboutExtra.classList.toggle('show');
      readBtn.innerHTML = isOpen ? 'Read Less <i class="bi bi-chevron-up"></i>' : 'Read More <i class="bi bi-chevron-down"></i>';
    });
    aboutExtra.classList.add('show');
    readBtn.innerHTML = 'Read Less <i class="bi bi-chevron-up"></i>';
  }

  /* ---------- Services page: FAQ accordion ---------- */
  const faqBtns = document.querySelectorAll('.faq-btn');
  if (faqBtns.length) {
    function setFaq(btn, isOpen) {
      const panel = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      btn.setAttribute('aria-expanded', isOpen);
      if (isOpen) {
        panel.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        if (icon) icon.style.transform = 'rotate(180deg)';
      } else {
        panel.classList.remove('open');
        panel.style.maxHeight = '0px';
        if (icon) icon.style.transform = 'rotate(0deg)';
      }
    }
    faqBtns.forEach((btn, idx) => {
      if (idx === 0) {
        const panel = btn.nextElementSibling;
        btn.setAttribute('aria-expanded', 'true');
        panel.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        const icon = btn.querySelector('.faq-icon');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
      btn.addEventListener('click', function () {
        const isOpen = this.getAttribute('aria-expanded') === 'true';
        faqBtns.forEach(b => setFaq(b, false));
        if (!isOpen) setFaq(this, true);
      });
    });
  }

  /* ---------- Projects page: category filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
          card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'block' : 'none';
        });
      });
    });
  }

  /* ---------- Contact page: form validation & Netlify AJAX Submission ---------- */
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    ['fName', 'fEmail', 'fPhone', 'fDetails'].forEach(id => {
      const field = document.getElementById(id);
      if (!field) return;
      let ok = field.value.trim().length > 0;
      if (id === 'fEmail' && ok) ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      field.classList.toggle('is-invalid', !ok);
      if (!ok) valid = false;
    });

    const interests = document.querySelectorAll('#interestRow input:checked');
    const interestErr = document.getElementById('interestErr');
    if (interestErr) {
      if (interests.length === 0) { interestErr.style.display = 'block'; valid = false; }
      else { interestErr.style.display = 'none'; }
    }

    if (!valid) {
      status.textContent = 'Please fix the highlighted fields above.';
      status.className = 'form-status show';
      return;
    }

    // Netlify Fetch Request (AJAX)
    const formData = new FormData(form);

    fetch('/', {
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString()
    })
    .then(() => {
      status.textContent = 'Thanks — your inquiry has been received. We will get back to you soon.';
      status.className = 'form-status show ok';
      form.reset();
      document.querySelectorAll('.is-invalid').forEach(f => f.classList.remove('is-invalid'));
    })
    .catch((error) => {
      status.textContent = 'Something went wrong. Please try again.';
      status.className = 'form-status show';
    });
  });
}
})();
