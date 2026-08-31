(() => {
  const buttons = [...document.querySelectorAll('.card-thumb[data-card-src]')];
  if (!buttons.length) return;
  const overlay = document.createElement('div');
  overlay.className = 'card-lightbox';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label','Agrandissement de carte');
  overlay.innerHTML = '<button class="card-lightbox-close" type="button" aria-label="Fermer">×</button><div class="card-lightbox-dialog"><img alt=""><div class="card-lightbox-title"></div></div>';
  document.body.appendChild(overlay);
  const img = overlay.querySelector('img');
  const title = overlay.querySelector('.card-lightbox-title');
  const close = overlay.querySelector('.card-lightbox-close');
  let lastFocus = null;
  function open(btn){
    lastFocus = btn;
    img.src = btn.dataset.cardSrc;
    img.alt = 'Carte ' + (btn.dataset.cardTitle || 'Jolly Roger');
    title.textContent = btn.dataset.cardTitle || '';
    overlay.classList.add('is-open');
    document.body.classList.add('card-lightbox-open');
    close.focus();
  }
  function shut(){
    overlay.classList.remove('is-open');
    document.body.classList.remove('card-lightbox-open');
    img.removeAttribute('src');
    if(lastFocus) lastFocus.focus();
  }
  buttons.forEach(btn => btn.addEventListener('click', () => open(btn)));
  close.addEventListener('click', shut);
  overlay.addEventListener('click', e => { if(e.target === overlay) shut(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape' && overlay.classList.contains('is-open')) shut(); });
})();
