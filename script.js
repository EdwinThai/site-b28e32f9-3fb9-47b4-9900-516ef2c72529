// =========================================
// MATCHA HOUSE — Vanilla JS
// - Mobile nav toggle
// - Fade-in-on-scroll via IntersectionObserver
// - LIVE "öppet nu" / "stängt just nu" status, beräknad från de riktiga
//   öppettiderna (samma data som öppettider-tabellen).
// =========================================

(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var navList = document.querySelector('.nav-list');

  if (toggle && navList) {
    toggle.addEventListener('click', function () {
      var isOpen = navList.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navList.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navList.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---- LIVE ÖPPETTIDER-STATUS ---- 0 = söndag ... 6 = lördag */
  var schedule = {
    1: ['10:00', '20:00'],
    2: ['10:00', '20:00'],
    3: ['10:00', '20:00'],
    4: ['10:00', '20:00'],
    5: ['10:00', '20:00'],
    6: ['10:00', '18:00'],
    0: ['10:00', '18:00']
  };

  var statusText = document.getElementById('statusText');
  var statusDot = document.querySelector('.status-dot');

  if (statusText && statusDot) {
    var now = new Date();
    var today = schedule[now.getDay()];
    var minutesNow = now.getHours() * 60 + now.getMinutes();

    function toMinutes(hhmm) {
      var parts = hhmm.split(':');
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }

    var isOpen = today && minutesNow >= toMinutes(today[0]) && minutesNow < toMinutes(today[1]);

    if (isOpen) {
      statusText.textContent = 'Öppet nu, till ' + today[1];
      statusDot.classList.remove('is-closed');
    } else {
      statusText.textContent = 'Stängt just nu';
      statusDot.classList.add('is-closed');
    }
  }

})();
