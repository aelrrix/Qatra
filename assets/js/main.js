/* =========================================================
   QATRA × AELTRIX — Main Script
   ========================================================= */
(function () {
  'use strict';

  const cfg = window.QATRA_CONFIG || {};
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ---------------- Current year ---------------- */
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---------------- Mobile drawer ---------------- */
  const drawer = $('[data-drawer]');
  const openBtn = $('[data-menu-open]');
  const closeBtn = $('[data-menu-close]');
  if (drawer && openBtn && closeBtn) {
    const setOpen = (open) => {
      drawer.dataset.open = String(open);
      drawer.setAttribute('aria-hidden', String(!open));
      openBtn.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) closeBtn.focus();
      else openBtn.focus();
    };
    openBtn.addEventListener('click', () => setOpen(true));
    closeBtn.addEventListener('click', () => setOpen(false));
    drawer.addEventListener('click', (e) => { if (e.target === drawer) setOpen(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.dataset.open === 'true') setOpen(false);
    });
    $$('a', drawer).forEach(a => a.addEventListener('click', () => setOpen(false)));
  }

  /* ---------------- Magnification Dock ---------------- */
  function initDock() {
    const dock = $('[data-dock]');
    if (!dock) return;
    const items = $$('.dock__item', dock);
    const MAX_SCALE = 1.55;
    const DIST = 170;
    let raf = null;
    let targetX = null;

    function update() {
      raf = null;
      if (targetX === null) return;
      const rect = dock.getBoundingClientRect();
      const mouseLocal = targetX - rect.left;
      items.forEach(item => {
        const ir = item.getBoundingClientRect();
        const center = ir.left - rect.left + ir.width / 2;
        const d = Math.abs(mouseLocal - center);
        const t = Math.max(0, 1 - d / DIST);
        const scale = 1 + (MAX_SCALE - 1) * t;
        item.style.transform = `scale(${scale.toFixed(3)})`;
      });
    }

    function onMove(e) {
      if (e.pointerType === 'touch') return;
      targetX = e.clientX;
      if (raf === null) raf = requestAnimationFrame(update);
    }
    function reset() {
      targetX = null;
      items.forEach(it => { it.style.transform = ''; });
    }

    dock.addEventListener('pointermove', onMove);
    dock.addEventListener('pointerleave', reset);
    dock.addEventListener('focusin', () => { targetX = null; items.forEach(it => { it.style.transform = ''; }); });
    dock.addEventListener('blur', (e) => {
      if (!dock.contains(e.relatedTarget)) reset();
    }, true);
  }

  /* ---------------- Reveal on scroll ---------------- */
  function initReveal() {
    const els = $$('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(el => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    els.forEach(el => io.observe(el));
  }

  /* ---------------- Download button handling ---------------- */
  async function handleDownloadButtons() {
    const btns = $$('[data-download-apk]');
    if (!btns.length) return;
    const localUrl = cfg.apk?.localUrl || 'apk/qatra-1.0.0.apk';
    const releasesUrl = cfg.repo?.releasesUrl || '#';
    const directAvailable = !!cfg.apk?.directAvailable;

    // Probe the local APK (HEAD) — GitHub Pages returns 200 if present, 404 if not.
    let available = directAvailable;
    if (!available) {
      try {
        const res = await fetch(localUrl, { method: 'HEAD', cache: 'no-store' });
        available = res.ok;
      } catch { available = false; }
    }

    btns.forEach(btn => {
      const label = $('[data-download-label]', btn) || btn;
      if (available) {
        btn.setAttribute('href', localUrl);
        btn.setAttribute('download', '');
        btn.removeAttribute('data-fallback');
      } else {
        btn.setAttribute('href', releasesUrl);
        btn.setAttribute('target', '_blank');
        btn.setAttribute('rel', 'noopener');
        btn.setAttribute('data-fallback', 'true');
        // Inform user visually
        if (label && !label.dataset.originalText) {
          label.dataset.originalText = label.textContent.trim();
        }
      }
    });

    // Status panel (on download page only)
    const status = $('[data-download-status]');
    if (status) {
      if (available) {
        status.textContent = 'الملف متاح للتحميل المباشر من هذا الموقع.';
        status.dataset.state = 'ok';
      } else {
        status.textContent = 'الملف المباشر غير مُرفوع بعد. سيتم توجيهك إلى صفحة الإصدارات على GitHub.';
        status.dataset.state = 'warn';
      }
    }
  }

  /* ---------------- Inject config values into DOM ---------------- */
  function hydrateConfig() {
    if (!cfg) return;
    const v = cfg.product?.version || '1.0.0';
    const pk = cfg.product?.packageName || '';
    const mn = cfg.product?.minAndroid || '';
    const rel = cfg.repo?.releasesUrl || '#';
    const gh  = cfg.repo?.githubUrl || '#';

    $$('[data-cfg="version"]').forEach(el => el.textContent = v);
    $$('[data-cfg="package"]').forEach(el => el.textContent = pk);
    $$('[data-cfg="minAndroid"]').forEach(el => el.textContent = mn);
    $$('[data-cfg="releasesUrl"]').forEach(el => { el.href = rel; });
    $$('[data-cfg="githubUrl"]').forEach(el => { el.href = gh; });
    $$('[data-cfg="teamImage"]').forEach(el => {
      if (cfg.assets?.teamImage) el.src = cfg.assets.teamImage;
    });
  }

  /* ---------------- Copy buttons (checksums etc.) ---------------- */
  function initCopyButtons() {
    $$('[data-copy]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const text = btn.dataset.copy;
        try {
          await navigator.clipboard.writeText(text);
          const original = btn.textContent;
          btn.textContent = 'تم النسخ';
          setTimeout(() => { btn.textContent = original; }, 1500);
        } catch { /* noop */ }
      });
    });
  }

  /* ---------------- Boot ---------------- */
  document.addEventListener('DOMContentLoaded', () => {
    hydrateConfig();
    initDock();
    initReveal();
    initCopyButtons();
    handleDownloadButtons();
  });
})();
