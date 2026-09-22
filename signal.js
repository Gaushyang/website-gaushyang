/* Sui-inspired disclosure navigation; keeps the existing contact workflow. */
document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.mega-toggle');
  const panel = document.querySelector('.mega-menu');
  if (!button || !panel) return;
  const close = (restore = false) => {
    panel.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    if (restore) button.focus();
  };
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-solutions')) close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) {
      event.preventDefault();
      event.stopImmediatePropagation();
      close(true);
    }
  }, true);
  document.addEventListener('focusin', event => {
    if (!event.target.closest('.nav-solutions')) close();
  });
  window.matchMedia('(max-width: 900px)').addEventListener('change', () => {
    close();
    document.querySelector('.site-nav')?.classList.remove('open');
    const toggle = document.querySelector('.menu-toggle');
    toggle?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', '開啟導覽選單');
    document.body.classList.remove('menu-open');
  });
  panel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => close()));
  document.querySelectorAll('.menu-toggle, .contact-modal-open').forEach(control => {
    control.addEventListener('click', () => close());
  });
});
