/* ==========================================================================
   Lógica da página — menu, carrossel, pacotes, estante e leitor de livros.
   Os textos e valores vêm de data.js.
   ========================================================================== */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  document.documentElement.classList.add('js');

  /* ---------- scroll lock (menu e leitor) ---------- */
  let locks = 0;
  const lockScroll = () => { if (locks++ === 0) document.documentElement.style.overflow = 'hidden'; };
  const unlockScroll = () => { if (--locks <= 0) { locks = 0; document.documentElement.style.overflow = ''; } };

  /* ---------- sobre mim: lista ---------- */
  $('#about-list').innerHTML = ABOUT_ITEMS.map((t, i) => `<li data-reveal style="--d:${0.15 + i * 0.1}s">${esc(t)}</li>`).join('');
  $('#year').textContent = new Date().getFullYear();

  /* ---------- menu hambúrguer ---------- */
  const drawer = $('#drawer');
  const burger = $('#burger');
  const drawerClose = $('.drawer__close');

  function openMenu() {
    drawer.removeAttribute('inert');
    drawer.setAttribute('aria-hidden', 'false');
    drawer.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Fechar menu');
    lockScroll();
    setTimeout(() => drawerClose.focus({ preventScroll: true }), 80);
  }
  function closeMenu(returnFocus = true) {
    if (!drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.setAttribute('inert', '');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
    unlockScroll();
    if (returnFocus) burger.focus({ preventScroll: true });
  }
  burger.addEventListener('click', () => (drawer.classList.contains('is-open') ? closeMenu() : openMenu()));
  $$('[data-close]', drawer).forEach((el) => el.addEventListener('click', () => closeMenu()));

  /* scroll suave para as seções */
  function goTo(hash) {
    const target = hash === '#home' ? null : document.querySelector(hash);
    const behavior = reduceMotion.matches ? 'auto' : 'smooth';
    if (!target) window.scrollTo({ top: 0, behavior });
    else target.scrollIntoView({ behavior, block: 'start' });
  }
  $$('[data-nav]').forEach((a) =>
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const hash = a.getAttribute('href');
      const wasOpen = drawer.classList.contains('is-open');
      closeMenu(false);
      if (wasOpen) requestAnimationFrame(() => goTo(hash));
      else goTo(hash);
    })
  );

  /* destaque da seção atual no menu (gaveta e pílulas do desktop) */
  const navLinks = new Map();
  $$('.drawer__nav a, .nav-pills a').forEach((a) => {
    const id = a.getAttribute('href').slice(1);
    navLinks.set(id, [...(navLinks.get(id) || []), a]);
  });
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((links, id) => links.forEach((a) => (id === en.target.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'))));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['sobre', 'aulas', 'metodologia', 'contato'].forEach((id) => spy.observe(document.getElementById(id)));

  /* cabeçalho: sombra ao rolar + leve paralaxe da foto de névoa no topo */
  const header = $('#site-header');
  const heroBg = $('.hero .bg');
  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    if (!reduceMotion.matches && y < window.innerHeight * 1.2) heroBg.style.setProperty('--py', (y * 0.18).toFixed(1) + 'px');
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- aparecer ao rolar ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    const observeReveals = (root = document) => $$('[data-reveal]:not(.is-in)', root).forEach((el) => io.observe(el));
    observeReveals();
    window.__reveal = observeReveals;
  } else {
    $$('[data-reveal]').forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- carrossel de fotos ---------- */
  (function carousel() {
    const viewport = $('#carousel-viewport');
    const track = $('#carousel-track');
    const dotsBox = $('#carousel-dots');
    const prev = $('#car-prev');
    const next = $('#car-next');
    const count = $('#carousel-count');
    const N = PHOTOS.length;
    let i = 0;

    track.innerHTML = PHOTOS.map((p, k) => `
      <figure class="slide" role="group" aria-roledescription="slide" aria-label="Foto ${k + 1} de ${N}">
        <img class="slide__bg" src="${p.src}" alt="" aria-hidden="true" draggable="false"><img class="slide__img" src="${p.src}" alt="${esc(p.alt)}" draggable="false" decoding="async">
      </figure>`).join('');
    dotsBox.innerHTML = PHOTOS.map((_, k) => `<button type="button" aria-label="Ir para a foto ${k + 1}"></button>`).join('');
    const dots = $$('button', dotsBox);
    const slides = $$('.slide', track);

    function go(n) {
      i = clamp(n, 0, N - 1);
      track.style.transform = `translate3d(${-i * 100}%,0,0)`;
      dots.forEach((d, k) => (k === i ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
      slides.forEach((s, k) => s.setAttribute('aria-hidden', k === i ? 'false' : 'true'));
      prev.disabled = i === 0;
      next.disabled = i === N - 1;
      count.textContent = `${i + 1}/${N}`;
    }
    prev.addEventListener('click', () => go(i - 1));
    next.addEventListener('click', () => go(i + 1));
    dots.forEach((d, k) => d.addEventListener('click', () => go(k)));
    viewport.tabIndex = 0;
    viewport.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
    });

    /* arrastar / deslizar */
    let startX = 0, startY = 0, dx = 0, dragging = false, locked = false, t0 = 0, width = 1;
    viewport.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button') || (e.pointerType === 'mouse' && e.button !== 0)) return;
      dragging = true; locked = false; startX = e.clientX; startY = e.clientY; dx = 0; t0 = performance.now();
      width = viewport.clientWidth;
    });
    viewport.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const mx = e.clientX - startX, my = e.clientY - startY;
      if (!locked) {
        if (Math.abs(mx) < 6 && Math.abs(my) < 6) return;
        if (Math.abs(my) > Math.abs(mx) && e.pointerType !== 'mouse') { dragging = false; return; }
        locked = true;
        viewport.setPointerCapture(e.pointerId);
        track.classList.add('is-dragging'); viewport.classList.add('is-dragging');
      }
      dx = mx;
      if ((i === 0 && dx > 0) || (i === N - 1 && dx < 0)) dx *= 0.3; /* resistência nas pontas */
      track.style.transform = `translate3d(calc(${-i * 100}% + ${dx}px),0,0)`;
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      track.classList.remove('is-dragging'); viewport.classList.remove('is-dragging');
      if (!locked) return;
      const v = dx / Math.max(1, performance.now() - t0);
      if (dx < -Math.max(50, width * 0.15) || v < -0.5) go(i + 1);
      else if (dx > Math.max(50, width * 0.15) || v > 0.5) go(i - 1);
      else go(i);
    };
    viewport.addEventListener('pointerup', end);
    viewport.addEventListener('pointercancel', end);
    go(0);
  })();

  /* ---------- pacotes ---------- */
  const ICONS = {
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17.5" cy="9" r="2.5"/><path d="M17 14.2c2.4.2 4.2 2.2 4.2 4.8"/></svg>',
    level: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 20v-4M10 20v-8M15 20V8M20 20V4"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H10l-4.5 4v-4H4z"/><path d="M8 9.5h8M8 12.5h5"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  };
  const ctaHTML = (label) => `<a class="btn-cta" href="${SITE.whatsapp}" target="_blank" rel="noopener noreferrer"><span class="ico ico--phone" aria-hidden="true"></span>${esc(label)}<span class="sr-only"> (abre o WhatsApp em uma nova aba)</span></a>`;

  const planHTML = (p) => `
    <article class="card">
      <div class="plan">
        <ul class="plan__list">${p.items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        <div class="plan__side">
          <h3 class="plan__name">${esc(p.label)}</h3>
          <span class="plan__label">valor:</span>
          <span class="plan__price">${esc(p.price)}<small>${esc(p.period)}</small></span>
        </div>
      </div>
      <div class="card__cta">${ctaHTML(GROUP_CLASSES.cta)}</div>
    </article>`;

  const pricesHTML = (tab) => tab.prices.map((p, k) => `
    <li class="price" style="--i:${k}">
      <span class="price__who">${p.people} pessoas</span>
      <span class="price__val">${esc(p.value)}</span>
      <span class="price__per">por pessoa</span>
    </li>`).join('');

  const groupHTML = () => {
    const g = GROUP_CLASSES;
    return `
    <article class="card group">
      <div class="group__head">
        <h3 class="group__name">${esc(g.title)}</h3>
        <p class="group__sub">${esc(g.subtitle)}</p>
        <span class="group__time">${ICONS.clock}${esc(g.duration)}</span>
      </div>
      <ul class="perks">${g.highlights.map((h) => `<li class="perk${h.hot ? ' perk--hot' : ''}">${ICONS[h.icon]}<span>${esc(h.text)}</span></li>`).join('')}</ul>
      <div class="prices">
        <p class="prices__title">${esc(g.pricesTitle)}</p>
        <div class="segmented" role="tablist" aria-label="Dias de aula por semana">
          ${g.tabs.map((t, k) => `<button type="button" role="tab" id="gtab-${t.id}" aria-selected="${k === 0}" aria-controls="gpanel" tabindex="${k === 0 ? 0 : -1}" data-tab="${k}">${esc(t.label)}</button>`).join('')}
        </div>
        <ul class="price-grid" id="gpanel" role="tabpanel" aria-labelledby="gtab-${g.tabs[0].id}">${pricesHTML(g.tabs[0])}</ul>
      </div>
      <div class="card__cta">${ctaHTML(g.cta)}</div>
    </article>`;
  };

  (function packages() {
    const tabsBox = $('#pkg-tabs');
    const stage = $('#pkg-stage');
    const metaOf = (p) => (p.type === 'group' ? p.meta || '' : `${p.price}${p.period}`);
    tabsBox.innerHTML = PLANS.map((p, k) => `<button class="pkg-tab" type="button" role="tab" id="tab-${p.id}" aria-selected="${k === 0}" aria-controls="pkg-stage" tabindex="${k === 0 ? 0 : -1}" data-i="${k}"><span class="pkg-tab__no" aria-hidden="true"><span>${String(k + 1).padStart(2, '0')}</span><em>pacote</em></span><svg class="pkg-tab__blob" viewBox="0 0 120 120" aria-hidden="true"><use href="#d-flowerfill"/></svg><span class="pkg-tab__name">${esc(p.label)}</span><span class="pkg-tab__meta">${esc(metaOf(p))}</span></button>`).join('');
    const tabs = $$('.pkg-tab', tabsBox);
    let current = -1;

    function paint(k) {
      const p = PLANS[k];
      stage.innerHTML = p.type === 'group' ? groupHTML() : planHTML(p);
      stage.setAttribute('aria-labelledby', `tab-${p.id}`);
      if (p.type === 'group') bindGroup();
    }
    async function select(k, focus = false) {
      if (k === current) return;
      const first = current === -1;
      current = k;
      tabs.forEach((t, j) => { t.setAttribute('aria-selected', j === k); t.tabIndex = j === k ? 0 : -1; });
      if (focus) tabs[k].focus();
      if (first || reduceMotion.matches || !stage.firstElementChild) { paint(k); return; }
      const out = stage.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(10px) scale(.985)' }], { duration: 150, easing: 'ease-in' });
      await out.finished.catch(() => {});
      if (current !== k) return;
      paint(k);
      stage.animate([{ opacity: 0, transform: 'translateY(-10px) scale(.985)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.22,.8,.24,1)' });
    }
    tabs.forEach((t, k) => t.addEventListener('click', () => select(k)));
    tabsBox.addEventListener('keydown', (e) => {
      const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (e.key === 'Home') { e.preventDefault(); select(0, true); }
      else if (e.key === 'End') { e.preventDefault(); select(tabs.length - 1, true); }
      else if (keys[e.key]) { e.preventDefault(); select((current + keys[e.key] + tabs.length) % tabs.length, true); }
    });

    function bindGroup() {
      const seg = $('.segmented', stage);
      const btns = $$('button', seg);
      const grid = $('#gpanel', stage);
      const pick = (k, focus) => {
        btns.forEach((b, j) => { b.setAttribute('aria-selected', j === k); b.tabIndex = j === k ? 0 : -1; });
        grid.innerHTML = pricesHTML(GROUP_CLASSES.tabs[k]);
        grid.setAttribute('aria-labelledby', `gtab-${GROUP_CLASSES.tabs[k].id}`);
        if (focus) btns[k].focus();
      };
      btns.forEach((b, k) => b.addEventListener('click', () => pick(k)));
      seg.addEventListener('keydown', (e) => {
        const cur = btns.findIndex((b) => b.getAttribute('aria-selected') === 'true');
        if (e.key === 'ArrowRight') { e.preventDefault(); pick((cur + 1) % btns.length, true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); pick((cur - 1 + btns.length) % btns.length, true); }
      });
    }
    select(0);
  })();

  /* ---------- estante ---------- */
  const bookcase = $('#bookcase');
  const cavity = $('#cavity');
  const bookById = Object.fromEntries(BOOKS.map((b) => [b.id, b]));

  function spineInner(def, i) {
    const lines = def.title ? `<span class="book__title ${def.title.some((t) => t.length > 8) ? '' : 'book__title--lg'}">${def.title.map((t) => `<span>${esc(t)}</span>`).join('')}</span>` : '';
    const tag = !def.title && i % 2 ? '<span class="book__tag" style="position:absolute;left:18%;right:18%;top:36%;height:20%;background:currentColor;opacity:.22;border-radius:2px"></span>' : '';
    return `<span class="band band--t1"></span><span class="band band--t2"></span><span class="band band--b1"></span><span class="band band--b2"></span>${lines}${tag}${def.title ? '<span class="book__emblem"></span>' : ''}`;
  }

  function bookNode(it, i) {
    const slot = document.createElement('div');
    const data = it.book ? bookById[it.book] : null;
    slot.className = 'slot' + (it.lean ? ' slot--lean' : '') + (it.sm === false ? ' sm-hide' : '');
    slot.style.setProperty('--wl', it.w);
    slot.style.setProperty('--ws', it.ws || it.w);
    slot.style.setProperty('--h', it.h);
    slot.style.setProperty('--c', data ? data.color : it.c);
    slot.style.setProperty('--ink', data ? data.ink : it.ink || '#FFFFFF');
    if (it.lean) slot.style.setProperty('--lean', it.lean + 'deg');
    slot.innerHTML = `<div class="book"><span class="book__shadow"></span><span class="book__side book__side--l"></span><span class="book__side book__side--r"></span><span class="book__top"></span><span class="book__face">${spineInner(data || {}, i)}</span></div>`;
    if (data) slot.dataset.book = data.id;
    slot.setAttribute('aria-hidden', 'true');
    return slot;
  }

  function buildShelf() {
    const parts = [
      '<div class="wall wall--back"></div>', '<div class="wall wall--l"></div>', '<div class="wall wall--r"></div>', '<div class="wall wall--top"></div>',
    ];
    SHELVES.forEach((_, s) => {
      parts.push(`<div class="plank" style="--y:calc(var(--cmp)*${s + 1} + var(--pl)*${s})"><div class="plank__top"></div><div class="plank__front"></div></div>`);
    });
    cavity.innerHTML = parts.join('');
    SHELVES.forEach((items, s) => {
      const row = document.createElement('div');
      row.className = 'row';
      row.style.setProperty('--bot', `calc(${2 - s}*var(--cmp) + ${3 - s}*var(--pl))`);
      items.forEach((it, i) => {
        if (it.stack) {
          const st = document.createElement('div');
          st.className = 'slab-stack' + (it.sm === false ? ' sm-hide' : '');
          const total = it.stack.reduce((a, b) => a + b.sh, 0);
          st.style.setProperty('--wl', it.w); st.style.setProperty('--ws', it.ws || it.w); st.style.setProperty('--h', total);
          st.innerHTML = it.stack.map((b) => `<span class="slab" style="--sh:${b.sh};--c:${b.c};--off:${b.off || 0}"></span>`).join('');
          st.setAttribute('aria-hidden', 'true');
          row.appendChild(st);
        } else if (it.cup) {
          row.insertAdjacentHTML('beforeend', `<div class="deco-cup${it.sm === false ? ' sm-hide' : ''}" aria-hidden="true"><i></i><i></i><i></i></div>`);
        } else if (it.box) {
          row.insertAdjacentHTML('beforeend', `<div class="deco-box${it.sm === false ? ' sm-hide' : ''}" aria-hidden="true"></div>`);
        } else {
          row.appendChild(bookNode(it, i));
        }
      });
      cavity.appendChild(row);
    });
  }
  buildShelf();

  /* botões transparentes por cima da estante: hit-test estável e acessível */
  const hotBox = document.createElement('div');
  hotBox.className = 'hotspots';
  $('.cabinet', bookcase).appendChild(hotBox);
  const hotspots = [];
  $$('.slot[data-book]', cavity).forEach((slot) => {
    const data = bookById[slot.dataset.book];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hotspot';
    btn.setAttribute('aria-label', `Abrir o livro ${data.title.join(' ')}`);
    btn.innerHTML = `<span class="hotspot__tip" aria-hidden="true">${esc(data.title.join(' '))}</span>`;
    const hot = (on) => { slot.classList.toggle('is-hot', on); btn.classList.toggle('is-hot', on); };
    btn.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') hot(true); });
    btn.addEventListener('pointerleave', () => { if (!btn.matches(':focus-visible')) hot(false); });
    btn.addEventListener('focus', () => { if (btn.matches(':focus-visible')) hot(true); });
    btn.addEventListener('blur', () => hot(false));
    btn.addEventListener('click', () => openBook(data, slot));
    hotBox.appendChild(btn);
    hotspots.push({ btn, slot });
  });
  function placeHotspots() {
    const view = $('.cabinet', bookcase);
    const vr = view.getBoundingClientRect();
    const k = vr.width / view.offsetWidth || 1; /* desfaz escala de animações dos ancestrais */
    hotspots.forEach(({ btn, slot }) => {
      const r = slot.getBoundingClientRect();
      btn.style.left = (r.left - vr.left) / k + 'px';
      btn.style.top = (r.top - vr.top) / k + 'px';
      btn.style.width = r.width / k + 'px';
      btn.style.height = r.height / k + 'px';
    });
  }
  placeHotspots();
  new ResizeObserver(placeHotspots).observe(bookcase);
  bookcase.addEventListener('transitionend', placeHotspots);
  window.addEventListener('load', placeHotspots);
  setTimeout(placeHotspots, 1200);

  /* ---------- leitor: livro que sai da estante e abre ---------- */
  const reader = $('#reader');
  const stage = $('#reader-stage');
  const closeBtn = $('#reader-close');
  const vertical = () => window.matchMedia('(max-width: 720px)').matches;
  let active = null; /* { def, el, anim, flight, tome } */
  let busy = false;

  function readerSize() {
    const vw = window.innerWidth, vh = window.innerHeight;
    if (!vertical()) {
      let pw = Math.min(vw * 0.43, 470), ph = pw / 0.74;
      if (ph > vh * 0.8) { ph = vh * 0.8; pw = ph * 0.74; }
      return { pw, ph };
    }
    const pw = Math.min(vw * 0.9, 470);
    return { pw, ph: Math.min(vh * 0.4, pw * 1.12) };
  }
  function applySize(pw, ph) {
    reader.style.setProperty('--pw', pw + 'px');
    reader.style.setProperty('--ph', ph + 'px');
  }

  function tomeMarkup(def) {
    const topics = def.topics.map((t) => `<li>${esc(t)}</li>`).join('');
    return `
    <div class="flight">
      <div class="tome" style="--c:${def.color};--ink:${def.ink}">
        <div class="tome__spine"></div>
        <div class="tome__back"></div>
        <i class="tome__edge tome__edge--r"></i><i class="tome__edge tome__edge--t"></i><i class="tome__edge tome__edge--b"></i>
        <section class="page page--r" aria-label="Conteúdos">
          <h4 class="page__h" style="--k:2">Conteúdos</h4>
          <ul class="page__list" style="--k:3">${topics}</ul>
          <span class="page__num" style="--k:5">— 2 —</span>
        </section>
        <div class="shade" style="transform:translateZ(1px)"></div>
        <div class="cover">
          <div class="cover__front" aria-hidden="true">
            <div class="cover__frame"></div>
            <p class="cover__brand">EnglishbyVitoria</p>
            <h3 class="cover__title">${def.title.map((t) => `<span>${esc(t)}</span>`).join('')}</h3>
            <span class="cover__rule"></span>
          </div>
          <div class="cover__back">
            <section class="page page--l">
              <h3 class="page__title" style="--k:0">${esc(def.title.join(' '))}</h3>
              <span class="page__rule" style="--k:1"></span>
              <p class="page__aud" style="--k:2">${esc(def.audience)}</p>
              <p class="page__desc" style="--k:3">${esc(def.description)}</p>
              <span class="page__num" style="--k:5">— 1 —</span>
            </section>
          </div>
        </div>
      </div>
    </div>`;
  }

  async function openBook(def, el) {
    if (busy || active) return;
    busy = true;
    const orient = vertical() ? 'v' : 'h';
    reader.dataset.orient = orient;
    const { pw, ph } = readerSize();
    applySize(pw, ph);
    reader.setAttribute('aria-label', `Livro ${def.title.join(' ')}`);
    stage.innerHTML = tomeMarkup(def);
    const flight = $('.flight', stage);
    const tome = $('.tome', stage);

    /* lombada igual à da estante, em escala */
    const face = $('.book__face', el);
    const rect = face.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const uTome = ph / parseFloat(cs.getPropertyValue('--h'));
    const T = parseFloat(cs.getPropertyValue('--w')) * uTome;
    reader.style.setProperty('--t', T + 'px');
    const spine = $('.tome__spine', tome);
    spine.style.setProperty('--u', uTome + 'px');
    spine.appendChild(face.cloneNode(true));

    active = { def, el, flight, tome, orient };
    lockScroll();
    reader.removeAttribute('inert');
    reader.setAttribute('aria-hidden', 'false');
    reader.classList.add('is-open');
    el.classList.add('is-away');
    closeBtn.focus({ preventScroll: true });

    if (reduceMotion.matches) {
      tome.classList.add('is-open', 'is-read');
      busy = false;
      return;
    }

    const s0 = rect.height / ph;
    const dx = rect.left + rect.width / 2 - (window.innerWidth / 2 - pw / 2);
    const dy = rect.top + rect.height / 2 - window.innerHeight / 2;
    flight.style.transformOrigin = '0 50%';
    const anim = flight.animate([
      { transform: `translate(${dx}px,${dy}px) scale(${s0}) rotateY(90deg) translateZ(0px)`, offset: 0 },
      { transform: `translate(${dx * 0.35}px,${dy * 0.35 - 40}px) scale(${s0 + (1 - s0) * 0.5}) rotateY(52deg) translateZ(160px)`, offset: 0.45 },
      { transform: 'translate(0px,0px) scale(1) rotateY(0deg) translateZ(0px)', offset: 1 },
    ], { duration: 1050, easing: 'cubic-bezier(.45,.05,.25,1)', fill: 'both' });
    active.anim = anim;
    await anim.finished.catch(() => {});
    if (!active) return;
    tome.classList.add('is-open');
    await wait(650);
    if (active) tome.classList.add('is-read');
    busy = false;
  }

  async function closeBook() {
    if (!active || busy) return;
    busy = true;
    const { el, tome, anim } = active;
    tome.classList.remove('is-read');
    if (!reduceMotion.matches && anim) {
      tome.classList.remove('is-open');
      await wait(1150);
      /* a posição da lombada pode ter mudado se a janela foi redimensionada */
      anim.reverse();
      await anim.finished.catch(() => {});
    } else {
      tome.classList.remove('is-open');
    }
    reader.classList.remove('is-open');
    el.classList.remove('is-away');
    reader.setAttribute('aria-hidden', 'true');
    reader.setAttribute('inert', '');
    unlockScroll();
    (hotspots.find((h) => h.slot === el)?.btn || el).focus({ preventScroll: true });
    active = null;
    await wait(520);
    if (!active) stage.innerHTML = '';
    busy = false;
  }

  closeBtn.addEventListener('click', closeBook);
  $('#reader-scrim').addEventListener('click', closeBook);
  stage.addEventListener('click', (e) => { if (!e.target.closest('.flight')) closeBook(); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (active) closeBook();
    else if (drawer.classList.contains('is-open')) closeMenu();
  });
  window.addEventListener('resize', () => {
    if (!active) return;
    if ((reader.dataset.orient === 'v') !== vertical()) { active.tome.classList.remove('is-open', 'is-read'); busy = false; closeBook(); return; }
    const { pw, ph } = readerSize();
    applySize(pw, ph);
  });
})();
