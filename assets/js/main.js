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
        '<a href="#" class="btn btn--cyan" data-open-booking>Записатись на консультацію</a>';
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
