(() => {
  'use strict';

  const STORE_KEY = 'surestay-checklist';
  const SCROLL_KEY = 'surestay-checklist-scroll';
  const HOLD_MS = 2000;
  const UNDO_MS = 8000;

  // ---- storage: { [itemKey]: checkedAtMillis } ----
  // localStorage survives screen locks, app switching, and the phone killing the app.
  // It is only emptied by the Hold to clear button (or by deleting the app).
  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch { return {}; }
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(checked)); } catch {}
  }
  let checked = load();

  const $ = (id) => document.getElementById(id);
  const list = $('list');
  const checkSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  // ---- render ----
  const timeFmt = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
  function updateWhen(key, whenEl) {
    whenEl.textContent = key in checked ? `Done at ${timeFmt.format(checked[key])}` : '';
  }

  const items = [];    // { key, input, label, when, record }
  const sections = []; // { el, tally, inputs }

  function el(tag, attrs = {}, text) {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    if (text != null) n.textContent = text;
    return n;
  }

  const infoSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M12 11v6M12 7.5v.5"/></svg>';
  const tallyCheck = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

  for (const entry of window.CHECKLIST) {
    if (entry.divider) {
      const d = el('div', { class: 'divider', role: 'separator' });
      d.append(el('span', {}, entry.divider));
      list.append(d);
      continue;
    }
    const sec = el('section', { class: 'area', 'aria-labelledby': `h-${entry.id}` });
    const head = el('div', { class: 'area-head' });
    const tally = el('span', { class: 'tally' });
    const tallyText = el('span');
    tally.innerHTML = tallyCheck;
    tally.append(tallyText);
    head.append(el('h2', { id: `h-${entry.id}` }, entry.title), tally);
    sec.append(head);
    if (entry.note) {
      const note = el('p', { class: 'area-note' });
      note.innerHTML = infoSvg;
      note.append(el('span', {}, entry.note));
      sec.append(note);
    }

    const stack = el('div', { class: 'items' });
    const record = { el: sec, tallyText, inputs: [] };
    entry.items.forEach((raw) => {
      const item = typeof raw === 'string' ? { text: raw } : raw;
      const key = `${entry.id}|${item.text}`;
      const label = el('label', { class: 'item' });
      const input = el('input', { type: 'checkbox' });
      input.checked = key in checked;
      label.classList.toggle('is-done', input.checked);
      const box = el('span', { class: 'box' });
      box.innerHTML = checkSvg;
      const text = el('span', { class: 'text' }, item.text);
      if (item.note) text.append(el('span', { class: 'note' }, item.note));
      const when = el('span', { class: 'when' });
      text.append(when);
      label.append(input, box, text);
      stack.append(label);

      input.addEventListener('change', () => {
        if (input.checked) checked[key] = Date.now(); else delete checked[key];
        save();
        updateWhen(key, when);
        refresh();
        label.classList.toggle('is-done', input.checked);
        label.classList.toggle('pop', input.checked);
        if (input.checked && navigator.vibrate) navigator.vibrate(20);
      });
      label.addEventListener('animationend', () => label.classList.remove('pop', 'target'));
      updateWhen(key, when);
      items.push({ key, input, label, when, record });
      record.inputs.push(input);
    });
    sec.append(stack);
    list.append(sec);
    sections.push(record);
  }

  const total = items.length;
  function refresh() {
    let done = 0;
    for (const s of sections) {
      const n = s.inputs.filter((i) => i.checked).length;
      done += n;
      const full = n === s.inputs.length;
      s.tallyText.textContent = full ? 'Done' : `${n} of ${s.inputs.length}`;
      s.el.classList.toggle('done', full);
    }
    $('done-count').textContent = done;
    $('done-label').textContent = `of ${total} done`;
    $('progress').style.width = `${(done / total) * 100}%`;
    $('next').hidden = done === total;
    document.body.classList.toggle('complete', done === total);
    $('clear').disabled = done === 0;
    if (done === 0) $('hint').textContent = '';
  }

  // Sync checkboxes from `checked` (after clear / undo / another tab).
  function syncAll() {
    for (const it of items) {
      it.input.checked = it.key in checked;
      it.label.classList.toggle('is-done', it.input.checked);
      updateWhen(it.key, it.when);
    }
    refresh();
  }

  // ---- jump to next unchecked item ----
  $('next').addEventListener('click', () => {
    const it = items.find((i) => !i.input.checked);
    if (!it) return;
    it.label.scrollIntoView({ behavior: 'smooth', block: 'center' });
    it.label.classList.remove('target');
    void it.label.offsetWidth; // restart animation
    it.label.classList.add('target');
  });

  // ---- light / dark switch (light is the default) ----
  const THEME_KEY = 'checklist-theme';
  const moon = '<path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z"/>';
  const sun = '<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>';
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  function applyTheme(dark) {
    if (dark) document.documentElement.dataset.theme = 'dark';
    else delete document.documentElement.dataset.theme;
    $('theme-icon').innerHTML = dark ? sun : moon;
    $('theme').setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    themeMeta.content = dark ? '#0d151a' : '#2a4657';
  }
  applyTheme(document.documentElement.dataset.theme === 'dark');
  $('theme').addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme !== 'dark';
    applyTheme(dark);
    try { localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light'); } catch {}
  });

  // ---- hold to clear ----
  const clearBtn = $('clear');
  const clearLabel = $('clear-label');
  const hint = $('hint');
  clearBtn.style.setProperty('--hold', `${HOLD_MS}ms`);
  let holdTimer = null;

  function startHold() {
    if (clearBtn.disabled || holdTimer) return;
    clearBtn.classList.add('holding');
    clearLabel.textContent = 'Keep holding…';
    hint.textContent = '';
    holdTimer = setTimeout(() => {
      holdTimer = null;
      clearBtn.classList.remove('holding');
      clearLabel.textContent = 'Hold to clear all';
      clearAll();
    }, HOLD_MS);
  }
  function cancelHold() {
    if (!holdTimer) return;
    clearTimeout(holdTimer);
    holdTimer = null;
    clearBtn.classList.remove('holding');
    clearLabel.textContent = 'Hold to clear all';
    hint.textContent = `Press and hold for ${HOLD_MS / 1000} seconds to clear.`;
  }

  clearBtn.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    try { clearBtn.setPointerCapture(e.pointerId); } catch {}
    startHold();
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((t) => clearBtn.addEventListener(t, cancelHold));
  clearBtn.addEventListener('contextmenu', (e) => e.preventDefault());
  clearBtn.addEventListener('keydown', (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); startHold(); }
  });
  clearBtn.addEventListener('keyup', (e) => {
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); cancelHold(); }
  });
  clearBtn.addEventListener('blur', cancelHold);
  // A plain click never clears; the hold timer is the only path.
  clearBtn.addEventListener('click', (e) => e.preventDefault());

  let undoSnapshot = null;
  let toastTimer = null;
  const toast = $('toast');

  function clearAll() {
    undoSnapshot = checked;
    checked = {};
    save();
    syncAll();
    try { localStorage.removeItem(SCROLL_KEY); } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (navigator.vibrate) navigator.vibrate([30, 60, 30]);
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, UNDO_MS);
  }
  function hideToast() {
    toast.classList.remove('show');
    undoSnapshot = null;
  }
  $('undo').addEventListener('click', () => {
    if (!undoSnapshot) return;
    checked = undoSnapshot;
    save();
    syncAll();
    clearTimeout(toastTimer);
    hideToast();
  });

  // ---- keep in sync if the app is open in two tabs ----
  window.addEventListener('storage', (e) => {
    if (e.key === STORE_KEY) { checked = load(); syncAll(); }
  });

  // ---- remember scroll position in case the phone reloads the app after a lock ----
  function saveScroll() {
    try { localStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY))); } catch {}
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) saveScroll(); });
  window.addEventListener('pagehide', saveScroll);
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  try {
    const y = Number(localStorage.getItem(SCROLL_KEY));
    if (y > 0) requestAnimationFrame(() => window.scrollTo(0, y));
  } catch {}

  refresh();

  // ---- offline support ----
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    // When an updated version installs, reload once so the new list shows (checks are kept).
    const hadController = !!navigator.serviceWorker.controller;
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadController && !reloaded) { reloaded = true; location.reload(); }
    });
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
