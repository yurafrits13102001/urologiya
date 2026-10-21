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

// iOS вмикає :active лише якщо на сторінці є обробник дотику
document.addEventListener('touchstart', function () { document.documentElement.classList.add('is-touch'); }, { passive: true });

// Дотик пальцем вимикає ефекти наведення (деякі Android, напр. Samsung, помилково «мають мишку»).
// Рух справжньої мишки повертає їх (ноутбуки з сенсорним екраном).
document.addEventListener('pointerdown', function (e) { if (e.pointerType === 'touch') document.documentElement.classList.add('is-touch'); }, { passive: true });
document.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') document.documentElement.classList.remove('is-touch'); }, { passive: true });

// Відео про клініку: YouTube у вікні, iframe створюється лише на клік і прибирається при закритті
(function () {
  var vm = document.getElementById('video');
  if (!vm) return;
  var frame = vm.querySelector('.video-frame');
  var close = function () { vm.classList.remove('is-open'); frame.innerHTML = ''; document.body.style.overflow = ''; };
  document.querySelectorAll('[data-open-video]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + a.getAttribute('data-open-video') + '?autoplay=1&rel=0" title="Відео про клініку" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
      vm.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });
  vm.querySelector('[data-close-video]').addEventListener('click', close);
  vm.addEventListener('click', function (e) { if (e.target === vm) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && vm.classList.contains('is-open')) close(); });
})();

// ---------- Відеокружечок лікаря ----------
// Без звуку грає фрагмент [start, end] по колу. Натискання — звук і ролик з початку.
// Якщо браузер не дає ввімкнути звук у вбудованому плеєрі, ролик відкривається у вікні.
(function () {
  var note = document.querySelector('.note[data-yt]');
  if (!note) return;
  var circle = note.querySelector('.note__circle');
  var host = note.querySelector('.note__video');
  var prog = note.querySelector('.note__prog');
  var id = note.getAttribute('data-yt');
  var A = Number(note.getAttribute('data-start') || 0);
  var B = Number(note.getAttribute('data-end') || 0);
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saveData = navigator.connection && navigator.connection.saveData;
  var player = null, ready = false, loading = false, pending = null, sound = false, timer = null;

  function fit() {
    var D = circle.clientWidth, Hs = D * 1.35, Ws = Hs * 16 / 9;
    host.style.width = Math.ceil(Ws) + 'px';
    host.style.height = Math.ceil(Hs) + 'px';
    host.style.top = Math.min(0, Math.round(D - Hs * 0.76)) + 'px';
  }
  fit();
  window.addEventListener('resize', fit);

  function tick() {
    if (!ready) return;
    var t = player.getCurrentTime() || 0, d = player.getDuration() || 69, pct;
    if (sound) pct = t / d * 100;
    else {
      if (B && t >= B) { player.seekTo(A, true); t = A; }
      pct = (t - A) / ((B || d) - A) * 100;
    }
    prog.style.strokeDashoffset = String(100 - Math.max(0, Math.min(100, pct)));
  }
  function toMuted() {
    sound = false; note.classList.remove('is-sound');
    player.mute(); player.seekTo(A, true); player.playVideo();
  }
  function openModal() {
    var vm = document.getElementById('video');
    if (!vm) return;
    vm.querySelector('.video-frame').innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0" title="Відео від лікаря" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    vm.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function toSound() {
    sound = true; note.classList.add('is-sound');
    player.unMute(); player.setVolume(100); player.seekTo(0, true); player.playVideo();
    setTimeout(function () { if (sound && player.isMuted && player.isMuted()) { toMuted(); openModal(); } }, 900);
  }
  function load(cb) {
    if (ready) { if (cb) cb(); return; }
    if (cb) pending = cb;
    if (loading) return;
    loading = true;
    window.onYouTubeIframeAPIReady = function () {
      var mount = document.createElement('div');
      host.appendChild(mount);
      player = new YT.Player(mount, {
        videoId: id, width: '100%', height: '100%', host: 'https://www.youtube-nocookie.com',
        playerVars: { autoplay: 1, mute: 1, controls: 0, playsinline: 1, rel: 0, modestbranding: 1, disablekb: 1, fs: 0, iv_load_policy: 3, start: A },
        events: {
          onReady: function (e) {
            ready = true; e.target.mute(); e.target.playVideo();
            if (pending) { var p = pending; pending = null; p(); }
          },
          onStateChange: function (e) {
            if (e.data === YT.PlayerState.PLAYING) {
              setTimeout(function () { host.classList.add('is-playing'); }, 500);
              if (!timer) timer = setInterval(tick, 250);
            }
            if (e.data === YT.PlayerState.ENDED) toMuted();
          }
        }
      });
    };
    var s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.async = true;
    document.head.appendChild(s);
  }
  circle.addEventListener('click', function () {
    if (!ready) { load(toSound); return; }
    if (!sound) { toSound(); return; }
    if (player.getPlayerState() === 1) player.pauseVideo(); else player.playVideo();
  });
  if (!reduce && !saveData) load();
})();

// ---------- Лінійка каменя: розмір і місце → метод ----------
(function () {
  var ui = document.querySelector('[data-stone]');
  if (!ui) return;
  var range = ui.querySelector('input[type=range]');
  var out = ui.querySelector('[data-size]');
  var peb = ui.querySelector('.stone__pebble');
  var view = ui.querySelector('.stone__view');
  var hint = ui.querySelector('.stone__readout small');
  var ticks = ui.querySelector('.stone__ticks');
  var MIN = 2, MAX = 70, L = Math.log(MAX / MIN);
  var toSize = function (v) { return Math.round(MIN * Math.exp(v / 1000 * L)); };
  var toVal = function (s) { return Math.log(s / MIN) / L * 1000; };
  [[2, '2 мм'], [5, '5 мм'], [10, '1 см'], [20, '2 см'], [40, '4 см'], [70, '7 см']].forEach(function (t) {
    var el = document.createElement('span');
    el.textContent = t[1];
    el.style.left = (toVal(t[0]) / 10) + '%';
    ticks.appendChild(el);
  });
  var STAY_URS = 'Одноденна госпіталізація · додому через годину після операції';
  var R = {
    kidney: function (s) {
      if (s <= 10) return ['ДЛТ або РІРС', 'Камінь до 1 см часто дроблять ззовні ударною хвилею, без операції. Якщо він щільний або не піддається — лазером через природні шляхи.', 'ДЛТ — 20 000 грн · якщо не допомогла, лазерна літотрипсія безкоштовно'];
      if (s <= 20) return ['РІРС — лазерна літотрипсія', 'Гнучкий ендоскоп заходить через природні шляхи, лазер дробить камінь до 2 см. Без розрізів і проколів.', 'У стаціонарі не більше доби · відновлення 1–2 дні'];
      return ['Міні-ПНЛ', 'Камінь понад 2 см, зокрема коралоподібний, видаляють через мініатюрний прокол на шкірі. Так прибирають камені до 7 см.', 'У стаціонарі 1–2 дні · відновлення 2–3 дні'];
    },
    ureter: function (s) {
      if (s <= 10) return ['ДЛТ або УРС', 'Невеликий камінь у нижній третині сечоводу можуть роздробити ззовні. Інакше — лазером через природні шляхи.', STAY_URS];
      return ['УРС — лазер у сечоводі', 'Ендоскоп заходить через природні шляхи до каменя в сечоводі, і лазер дробить його на місці.', STAY_URS];
    },
    bladder: function () {
      return ['Цистолітотрипсія', 'Камені сечового міхура дроблять лазером через природні шляхи, без розрізів.', 'Без розрізів · через природні шляхи'];
    }
  };
  var where = 'kidney';
  function render() {
    var s = toSize(Number(range.value));
    out.textContent = s;
    var px = s * 96 / 25.4, cap = view.clientWidth * 0.86;
    var shown = Math.min(px, cap);
    peb.style.width = shown + 'px';
    peb.style.height = (shown * 0.86) + 'px';
    hint.textContent = px > cap ? 'зменшено, щоб вмістилось' : 'приблизно в натуральну величину';
    var r = R[where](s);
    ui.querySelector('[data-r-name]').textContent = r[0];
    ui.querySelector('[data-r-text]').textContent = r[1];
    ui.querySelector('[data-r-meta]').textContent = r[2];
  }
  range.addEventListener('input', render);
  ui.querySelectorAll('.seg button').forEach(function (b) {
    b.addEventListener('click', function () {
      where = b.getAttribute('data-where');
      ui.querySelectorAll('.seg button').forEach(function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false'); });
      render();
    });
  });
  window.addEventListener('resize', render);
  render();
})();
