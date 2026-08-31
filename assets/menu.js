(function () {
  'use strict';

  var script = document.currentScript;
  if (!script) return;

  var rootUrl = new URL('../', script.src);
  var href = function (path) { return new URL(path, rootUrl).href; };

  var nav = document.createElement('div');
  nav.className = 'jr-floating-nav';
  nav.innerHTML = [
    '<button class="jr-menu-toggle" type="button" aria-expanded="false" aria-controls="jr-site-menu">',
      '<span class="jr-menu-icon" aria-hidden="true"><i></i><i></i><i></i></span>',
      '<span class="jr-menu-label">MENU</span>',
    '</button>',
    '<nav class="jr-menu-panel" id="jr-site-menu" aria-label="Navigation rapide">',
      '<a href="' + href('') + '"><strong>ACCUEIL</strong><small>Retour au menu principal</small></a>',
      '<div class="jr-menu-group">',
        '<a href="' + href('regles/') + '"><strong>RÈGLES DU JEU</strong><small>Choisissez votre partie</small></a>',
        '<div class="jr-menu-sub">',
          '<a href="' + href('regles/solo/') + '">PARTIE SOLO</a>',
          '<a href="' + href('regles/duo/') + '">PARTIE EN DUO</a>',
        '</div>',
      '</div>',
      '<a href="' + href('bataille/') + '"><strong>BATAILLE NAVALE</strong><small>Bientôt disponible</small></a>',
      '<div class="jr-menu-group">',
        '<a href="' + href('legendes/') + '"><strong>LÉGENDES JOLLY ROGER</strong><small>Les cinq légendes</small></a>',
        '<div class="jr-menu-sub jr-menu-sub-legends">',
          '<a href="' + href('wako/') + '">LE WAKŌ</a>',
          '<a href="' + href('diable/') + '">LE DIABLE</a>',
          '<a href="' + href('calypso/') + '">CALYPSO</a>',
          '<a href="' + href('sirenes/') + '">LES SIRÈNES</a>',
          '<a href="' + href('kraken/') + '">LE KRAKEN</a>',
        '</div>',
      '</div>',
    '</nav>'
  ].join('');

  document.body.appendChild(nav);

  var button = nav.querySelector('.jr-menu-toggle');
  var panel = nav.querySelector('.jr-menu-panel');

  function setOpen(open) {
    nav.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  button.addEventListener('click', function (event) {
    event.stopPropagation();
    setOpen(!nav.classList.contains('is-open'));
  });

  panel.addEventListener('click', function (event) {
    event.stopPropagation();
  });

  document.addEventListener('click', function () { setOpen(false); });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      setOpen(false);
      button.focus();
    }
  });
})();
