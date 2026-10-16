/* Мінімум JS: меню, модалка запису, калькулятор, форма. */
(function () {
  // Мобільне меню
  var header = document.querySelector('.header');
  var burger = document.querySelector('.burger');
  if (burger && header) {
    burger.addEventListener('click', function () {
      header.classList.toggle('is-open');
      burger.classList.toggle('is-open');
    });
    header.querySelectorAll('.nav a').forEach(function (a) {
      a.addEventListener('click', function () {
        header.classList.remove('is-open');
        burger.classList.remove('is-open');
      });
    });
  }

  // Модалка "Записатись"
  var modal = document.getElementById('booking');
  if (modal) {
    var open = function (e) { e.preventDefault(); modal.classList.add('is-open'); document.body.style.overflow = 'hidden'; };
    var close = function () { modal.classList.remove('is-open'); document.body.style.overflow = ''; };
    document.querySelectorAll('[data-open-booking]').forEach(function (b) { b.addEventListener('click', open); });
    modal.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', close); });
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  // Форми: демо-відправка (на WordPress підключається Contact Form 7 / будь-який обробник)
  document.querySelectorAll('form[data-demo]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = form.querySelector('.form__ok');
      if (ok) ok.classList.add('is-visible');
      form.querySelectorAll('input, textarea, button').forEach(function (el) { el.disabled = true; });
    });
  });

  // Калькулятор ниркової коліки
  var calc = document.getElementById('calc');
  if (calc) {
    var btn = calc.querySelector('[data-calc-run]');
    var result = calc.querySelector('.calc__result');
    btn.addEventListener('click', function () {
      var checked = calc.querySelectorAll('input:checked');
      var score = 0;
      checked.forEach(function (c) { score += Number(c.dataset.weight || 1); });
      var level, title, text;
      if (score === 0) {
        level = 'low'; title = 'Ви не відмітили жодного симптому';
        text = 'Оберіть симптоми, які вас турбують, і натисніть «Оцінити ризик» ще раз.';
      } else if (score <= 3) {
        level = 'low'; title = 'Низька ймовірність ниркової коліки';
        text = 'Симптоми не є типовими для ниркової коліки. Якщо вони зберігаються або посилюються, запишіться на консультацію уролога та УЗД.';
      } else if (score <= 6) {
        level = 'mid'; title = 'Середня ймовірність ниркової коліки';
        text = 'Є кілька характерних ознак. Рекомендуємо консультацію уролога найближчим часом. Пийте достатньо води, уникайте самолікування.';
      } else {
        level = 'high'; title = 'Висока ймовірність ниркової коліки';
        text = 'Поєднання симптомів типове для ниркової коліки. Зверніться до уролога сьогодні. При нестерпному болю, високій температурі або блюванні — телефонуйте невідкладно.';
      }
      result.className = 'calc__result is-visible level-' + level;
      result.innerHTML = '<h3>' + title + '</h3><p>' + text + '</p>' +
        '<a href="#" class="btn btn--blue btn--plain" data-open-booking>Записатись на консультацію</a>';
      result.querySelector('[data-open-booking]').addEventListener('click', function (e) {
        e.preventDefault();
        if (modal) { modal.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
      });
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
})();

// Перемикач режиму фото (тільки для перегляду варіантів)
(function () {
  var sw = document.querySelector('.photo-switch');
  if (!sw) return;
  var mode = 'bw';
  try { mode = localStorage.getItem('photoMode') || 'bw'; } catch (e) {}
  var apply = function (m) {
    document.body.setAttribute('data-photo', m);
    sw.querySelectorAll('button').forEach(function (b) { b.classList.toggle('is-on', b.dataset.photo === m); });
    try { localStorage.setItem('photoMode', m); } catch (e) {}
  };
  sw.querySelectorAll('button').forEach(function (b) { b.addEventListener('click', function () { apply(b.dataset.photo); }); });
  apply(mode);
})();


// Поява секцій при прокручуванні
(function () {
  var els = document.querySelectorAll('.sec, .founder, .cta');
  els.forEach(function (el) { el.classList.add('reveal'); });
  if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px' });
  els.forEach(function (el) { io.observe(el); });
})();

// Фонове відео в хіро: YouTube без звуку, по колу, лише фрагмент [start, end].
// Поки ролик не почав грати, видно фото; потім відео плавно проявляється.
(function () {
  var host = document.querySelector('.hero__video');
  if (!host) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  if (reduce || saveData) return;
  var id = host.getAttribute('data-yt');
  var start = Number(host.getAttribute('data-start') || 0);
  var end = Number(host.getAttribute('data-end') || 0);
  var box = host.parentElement;
  function fit() {
    var w = box.clientWidth, h = box.clientHeight, W = w, H = w * 9 / 16;
    if (H < h) { H = h; W = h * 16 / 9; }
    // збільшуємо і притискаємо до верху так, щоб нижні 24% кадру (вшиті субтитри) були за межами блоку
    var Ws = W * 1.35, Hs = H * 1.35;
    host.style.width = Math.ceil(Ws) + 'px';
    host.style.height = Math.ceil(Hs) + 'px';
    host.style.top = Math.min(0, Math.round(h - Hs * 0.76)) + 'px';
  }
  fit();
  window.addEventListener('resize', fit);
  var mount = document.createElement('div');
  host.appendChild(mount);
  window.onYouTubeIframeAPIReady = function () {
    var vars = { autoplay: 1, mute: 1, controls: 0, playsinline: 1, rel: 0, modestbranding: 1, disablekb: 1, fs: 0, iv_load_policy: 3, start: start };
    if (end) vars.end = end;
    window.heroPlayer = new YT.Player(mount, {
      videoId: id, width: '100%', height: '100%', host: 'https://www.youtube-nocookie.com', playerVars: vars,
      events: {
        onReady: function (e) { e.target.mute(); e.target.playVideo(); },
        onStateChange: function (e) {
          if (e.data === YT.PlayerState.PLAYING) setTimeout(function () { host.classList.add('is-playing'); }, 700);
          if (e.data === YT.PlayerState.ENDED) { e.target.seekTo(start, true); e.target.playVideo(); }
        }
      }
    });
  };
  var s = document.createElement('script');
  s.src = 'https://www.youtube.com/iframe_api';
  s.async = true;
  document.head.appendChild(s);
})();

// «Дивитись відео»: повний ролик зі звуком у вікні; фонове відео на цей час стає на паузу
(function () {
  var vm = document.getElementById('video');
  if (!vm) return;
  var frame = vm.querySelector('.video-frame');
  var hero = function (fn) { try { if (window.heroPlayer && window.heroPlayer[fn]) window.heroPlayer[fn](); } catch (e) {} };
  var close = function () { vm.classList.remove('is-open'); frame.innerHTML = ''; document.body.style.overflow = ''; hero('playVideo'); };
  document.querySelectorAll('[data-open-video]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      hero('pauseVideo');
      frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + a.getAttribute('data-open-video') + '?autoplay=1&rel=0" title="Відео про клініку" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
      vm.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });
  vm.querySelector('[data-close-video]').addEventListener('click', close);
  vm.addEventListener('click', function (e) { if (e.target === vm) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && vm.classList.contains('is-open')) close(); });
})();
