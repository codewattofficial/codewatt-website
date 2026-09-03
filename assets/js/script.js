    (function(){
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Nav scroll state
      const navbar = document.getElementById('navbar');
      window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 20));

      // Mobile menu
      const burger = document.getElementById('burgerBtn');
      const mobilePanel = document.getElementById('mobilePanel');
      const closeMenu = () => { burger.classList.remove('open'); mobilePanel.classList.remove('open'); burger.setAttribute('aria-expanded','false'); };
      burger.addEventListener('click', () => {
        const open = mobilePanel.classList.toggle('open');
        burger.classList.toggle('open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      document.querySelectorAll('#mobilePanel a').forEach(a => a.addEventListener('click', closeMenu));
      document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMenu(); });

      // Back to top
      const backTop = document.getElementById('backTop');
      window.addEventListener('scroll', () => backTop.classList.toggle('visible', window.scrollY > 500));
      backTop.addEventListener('click', () => window.scrollTo({ top:0, behavior: reduceMotion ? 'auto' : 'smooth' }));

      // Reveal on scroll
      const reveals = document.querySelectorAll('.reveal');
      if (reduceMotion) {
        reveals.forEach(el => el.classList.add('in'));
      } else {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => { if(entry.isIntersecting) entry.target.classList.add('in'); });
        }, { threshold: 0.12 });
        reveals.forEach(el => observer.observe(el));
      }

      // Counter animation
      const counters = document.querySelectorAll('.counter');
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const suffix = el.dataset.suffix || '';
            if(reduceMotion) { el.textContent = target + suffix; counterObserver.unobserve(el); return; }
            let current = 0;
            const totalSteps = Math.min(target, 50) || 1;
            const step = target / totalSteps;
            const intervalMs = Math.max(1400 / totalSteps, 20);
            const tick = setInterval(() => {
              current += step;
              if(current >= target) { el.textContent = target + suffix; clearInterval(tick); }
              else el.textContent = Math.floor(current) + suffix;
            }, intervalMs);
            counterObserver.unobserve(el);
          }
        });
      }, { threshold: 0.5 });
      counters.forEach(c => counterObserver.observe(c));

      // Audience split hover
      const panelBiz = document.getElementById('panelBusiness');
      const panelStu = document.getElementById('panelStudents');
      if(panelBiz && panelStu) {
        panelBiz.addEventListener('mouseenter', () => { panelBiz.classList.add('expand'); panelStu.classList.add('compress'); });
        panelBiz.addEventListener('mouseleave', () => { panelBiz.classList.remove('expand'); panelStu.classList.remove('compress'); });
        panelStu.addEventListener('mouseenter', () => { panelStu.classList.add('expand'); panelBiz.classList.add('compress'); });
        panelStu.addEventListener('mouseleave', () => { panelStu.classList.remove('expand'); panelBiz.classList.remove('compress'); });
      }

      // Testimonial touch pause
      const testMarquee = document.getElementById('testMarquee');
      if(testMarquee) testMarquee.addEventListener('touchstart', () => testMarquee.classList.add('paused'), { passive: true });

      // About Read More toggle
      const readBtn = document.getElementById('readMoreBtn');
      const aboutExtra = document.querySelector('.about-extra');
      if(readBtn && aboutExtra) {
        readBtn.addEventListener('click', () => {
          const isOpen = aboutExtra.classList.toggle('show');
          readBtn.innerHTML = isOpen ? 'Read Less <i class="bi bi-chevron-up"></i>' : 'Read More <i class="bi bi-chevron-down"></i>';
        });
      }

      // FAQ Accordion (Services page)
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
        const firstBtn = faqBtns[0];
        const firstPanel = firstBtn.nextElementSibling;
        firstBtn.setAttribute('aria-expanded', 'true');
        firstPanel.classList.add('open');
        firstPanel.style.maxHeight = firstPanel.scrollHeight + 'px';
        const firstIcon = firstBtn.querySelector('.faq-icon');
        if (firstIcon) firstIcon.style.transform = 'rotate(180deg)';

        faqBtns.forEach((btn) => {
          btn.addEventListener('click', function () {
            const isCurrentlyOpen = this.getAttribute('aria-expanded') === 'true';
            faqBtns.forEach((b) => setFaq(b, false));
            if (!isCurrentlyOpen) setFaq(this, true);
          });
        });

        window.addEventListener('resize', function () {
          document.querySelectorAll('.faq-btn[aria-expanded="true"]').forEach((btn) => {
            const panel = btn.nextElementSibling;
            if (panel.classList.contains('open')) panel.style.maxHeight = panel.scrollHeight + 'px';
          });
        });
      }

      // Contact form validation (Contact page)
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
          status.textContent = 'Thanks — your inquiry has been received. We will get back to you soon.';
          status.className = 'form-status show ok';
          form.reset();
          document.querySelectorAll('.is-invalid').forEach(f => f.classList.remove('is-invalid'));
        });
      }

      // Project filter (Projects page)
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
    })();
