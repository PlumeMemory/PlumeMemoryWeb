document.addEventListener('DOMContentLoaded', () => {

  // 1. Language Support
  const langSwitch = document.getElementById('langSwitch');
  const userLang = navigator.language || navigator.userLanguage;
  let currentLang = 'en';

  if (userLang.startsWith('zh-TW') || userLang.startsWith('zh-HK')) currentLang = 'zh-TW';
  else if (userLang.startsWith('zh')) currentLang = 'zh-CN';
  else if (userLang.startsWith('ja')) currentLang = 'ja';
  else if (userLang.startsWith('ko')) currentLang = 'ko';

  const savedLang = localStorage.getItem('yuyi_lang');
  if (savedLang && translations[savedLang]) {
    currentLang = savedLang;
  }
  
  if(langSwitch) {
    langSwitch.value = currentLang;
    applyLanguage(currentLang);

    langSwitch.addEventListener('change', (e) => {
      currentLang = e.target.value;
      localStorage.setItem('yuyi_lang', currentLang);
      applyLanguage(currentLang);
    });
  }

  function applyLanguage(lang) {
    const dict = translations[lang];
    if (!dict) return;
    document.documentElement.lang = lang;
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        if (el.hasAttribute('data-i18n-html')) {
          el.innerHTML = dict[key];
        } else if (el.hasAttribute('data-i18n-md')) {
          // simple inline code replacement
          el.innerHTML = dict[key].replace(/`(.*?)`/g, '<code>$1</code>');
        } else {
          el.textContent = dict[key];
        }
      }
    });
  }

  // 2. Theme Support
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('yuyi_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('yuyi_theme', newTheme);
    });
  }

  // 3. Navbar scroll effect
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // 4. Mobile menu toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // 5. Scroll Reveal
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Optional: stop observing once revealed
        // revealObserver.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

  reveals.forEach(el => revealObserver.observe(el));

  // 6. Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      if (navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
      }
      const targetId = this.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetEl.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 7. API Tabs
  const tabs = document.querySelectorAll('.api-tab');
  const panels = document.querySelectorAll('.api-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs and panels
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      // Add active to clicked tab
      tab.classList.add('active');

      // Show corresponding panel
      const target = tab.getAttribute('data-tab');
      document.getElementById(`tab-${target}`).classList.add('active');
    });
  });

});
