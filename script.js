/*
 * Interactions de la landing page.
 * Liens a personnaliser dans index.html : telechargements, WhatsApp et logo.
 * La maquette ci-dessous est illustrative : seul le calcul d'aire est reellement effectue.
 */

// Référence à la notification de secours si un bouton n'a pas encore reçu son lien.
const downloadToast = document.querySelector('#download-toast');
let toastTimeout;

// Les liens de telechargement sont definis dans index.html, sur les boutons du hero et de la barre flottante.
// Si un lien est encore "#", afficher une explication au lieu de renvoyer en haut de page.
document.querySelectorAll('[data-download]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (link.getAttribute('href') !== '#') return;

    // Evite le saut en haut de page et rappelle d'ajouter le lien public de release GitHub.
    event.preventDefault();
    downloadToast.textContent = 'Le lien de téléchargement GitHub n’est pas encore configuré. Ajoutez l’URL publique de votre release Android ou Windows dans index.html.';
    downloadToast.classList.add('is-visible');
    window.clearTimeout(toastTimeout);
    // Masque automatiquement la notification apres 4,5 secondes.
    toastTimeout = window.setTimeout(() => {
      downloadToast.classList.remove('is-visible');
    }, 4500);
  });
});

// Garde les boutons de telechargement a portee de pouce apres la section d'accueil.
const heroSection = document.querySelector('#accueil');
let mobileDownloadCta = document.querySelector('.mobile-download-cta');

if (!mobileDownloadCta) {
  mobileDownloadCta = document.createElement('nav');
  mobileDownloadCta.className = 'download-dock mobile-download-cta is-visible';
  mobileDownloadCta.setAttribute('aria-label', 'Téléchargements Taodaluminium');
  mobileDownloadCta.innerHTML = '<a class="download-dock-link download-dock-android" href="Taod%20aluminium/version%20Android/taod.apk" download="taod.apk"><span class="dock-icon">↓</span><span><strong>Android</strong><small>APK</small></span></a><a class="download-dock-link download-dock-windows" href="Taod%20aluminium/version%20Windows/Taod_Setup.exe" download="Taod_Setup.exe"><span class="dock-icon dock-windows-icon">⊞</span><span><strong>Windows</strong><small>Ordinateur</small></span></a>';
  document.body.appendChild(mobileDownloadCta);
}

if (heroSection && mobileDownloadCta && 'IntersectionObserver' in window) {
  // Le dock apparait quand le hero sort de la zone visible puis disparait au retour en haut.
  const heroObserver = new IntersectionObserver(([entry]) => {
    mobileDownloadCta.classList.toggle('is-visible', !entry.isIntersecting);
  }, { threshold: 0.12 });

  heroObserver.observe(heroSection);
}

// GESTION DES ONGLETS : affiche le panneau choisi et synchronise l'etat accessible aria-selected.
const demoTabs = document.querySelectorAll('[data-demo-tab]');
const demoPanels = document.querySelectorAll('[data-demo-panel]');

demoTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const selectedDemo = tab.dataset.demoTab;

    demoTabs.forEach((item) => {
      const isSelected = item === tab;
      item.classList.toggle('is-active', isSelected);
      item.setAttribute('aria-selected', String(isSelected));
      item.tabIndex = isSelected ? 0 : -1;
    });

    demoPanels.forEach((panel) => {
      const isSelected = panel.dataset.demoPanel === selectedDemo;
      panel.hidden = !isSelected;
      panel.classList.toggle('is-active', isSelected);
    });
  });

  // Les fleches gauche/droite et les touches Debut/Fin permettent de parcourir les onglets au clavier.
  tab.addEventListener('keydown', (event) => {
    const currentIndex = Array.from(demoTabs).indexOf(tab);
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % demoTabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + demoTabs.length) % demoTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = demoTabs.length - 1;
    if (nextIndex === currentIndex) return;

    event.preventDefault();
    demoTabs[nextIndex].focus();
    demoTabs[nextIndex].click();
  });
});

// CALCUL DE DEMONSTRATION : les valeurs sont saisies en centimetres et converties en metres carres.
// Cette formule ne calcule ni les profils, ni les retraits, ni les regles de coupe de l'application.
const dimensionForm = document.querySelector('#dimension-form');
const surfaceResult = document.querySelector('#surface-result');

if (dimensionForm && surfaceResult) {
  dimensionForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const width = Number(document.querySelector('#dimension-width').value);
    const height = Number(document.querySelector('#dimension-height').value);
    // 1 m² correspond a 10 000 cm².
    const surface = (width * height) / 10_000;

    // Formate le resultat selon les conventions numeriques francaises.
    surfaceResult.innerHTML = `${surface.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} <small>m²</small>`;
    surfaceResult.closest('.demo-result').classList.remove('result-updated');
    requestAnimationFrame(() => surfaceResult.closest('.demo-result').classList.add('result-updated'));
  });
}

// CHOIX DU VITRAGE : met en evidence l'option selectionnee et actualise son libelle.
const glassTypeResult = document.querySelector('.glass-type-result');
document.querySelectorAll('.glass-option').forEach((option) => {
  option.addEventListener('click', () => {
    document.querySelectorAll('.glass-option').forEach((item) => {
      const isSelected = item === option;
      item.classList.toggle('is-selected', isSelected);
      item.setAttribute('aria-pressed', String(isSelected));
    });

    if (glassTypeResult) {
      glassTypeResult.textContent = `Verre ${option.firstChild.textContent.trim().toLowerCase()}`;
    }
  });
});

// APERCU DE DEVIS : confirme l'action de demonstration sans creer de fichier ou de faux devis.
const quoteAction = document.querySelector('#quote-action');
const quoteFeedback = document.querySelector('#quote-feedback');

if (quoteAction && quoteFeedback) {
  quoteAction.addEventListener('click', () => {
    quoteFeedback.textContent = 'Aperçu prêt à personnaliser dans Taodaluminium.';
    quoteAction.innerHTML = 'Aperçu prêt <span aria-hidden="true">✓</span>';
    quoteAction.classList.add('is-complete');
  });
}

// APPARITION AU DEFILEMENT : anime les elements marques data-reveal dans index.html.
const revealElements = document.querySelectorAll('[data-reveal]');
// La preference systeme de mouvement reduit desactive l'animation dans la feuille CSS.
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  // N'observe plus un element apres sa premiere apparition pour limiter le travail du navigateur.
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  // Affiche les contenus directement si le navigateur ne prend pas en charge l'observateur.
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

// PROGRESSION DE LECTURE : une fine ligne indique la position dans la page.
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
scrollProgress.setAttribute('aria-hidden', 'true');
document.body.appendChild(scrollProgress);

const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  scrollProgress.style.setProperty('--scroll-progress', `${progress}%`);
  document.querySelector('.site-header')?.classList.toggle('is-scrolled', window.scrollY > 18);
};

window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();

// NAVIGATION ACTIVE : le lien de la section visible reste mis en avant.
const sectionLinks = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && observedSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => link.classList.toggle('is-current', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  observedSections.forEach((section) => sectionObserver.observe(section));
}

// TILT LÉGER : donne de la profondeur aux cartes sur ordinateur, sans gêner le toucher.
if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.benefit-card, .screen-card, .premium-panel').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.setProperty('--tilt-x', `${(y * -3).toFixed(2)}deg`);
      card.style.setProperty('--tilt-y', `${(x * 3).toFixed(2)}deg`);
      card.classList.add('is-tilting');
    });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('is-tilting');
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
    });
  });
}

// RIPPLE : retour tactile visuel sur les boutons et liens d'action.
document.querySelectorAll('.button, .download-dock-link, .text-link').forEach((control) => {
  control.addEventListener('click', (event) => {
    if (prefersReducedMotion) return;
    const bounds = control.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'interaction-ripple';
    ripple.style.left = `${event.clientX - bounds.left}px`;
    ripple.style.top = `${event.clientY - bounds.top}px`;
    control.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 550);
  });
});

// LIBELLÉS SIMPLES : on explique clairement le téléchargement, sans jargon technique.
document.querySelectorAll('a[href*="version%20Android"]').forEach((link) => {
  link.setAttribute('aria-label', 'Télécharger Taodaluminium pour Android');
  const label = link.querySelector('strong');
  if (label) label.textContent = 'Télécharger pour Android';
  else if (link.classList.contains('button-mobile-download')) link.innerHTML = '<span aria-hidden="true">↓</span> Télécharger pour Android <span aria-hidden="true">↗</span>';
});
document.querySelectorAll('a[href*="version%20Windows"]').forEach((link) => {
  link.setAttribute('aria-label', 'Télécharger Taodaluminium pour Windows');
  const label = link.querySelector('strong');
  if (label) label.textContent = 'Télécharger pour Windows';
});

// AIDE INSTALLATION WINDOWS : le mot de passe est visible juste sous les téléchargements.
if (document.querySelector('.page-download-actions') && /installation\.html$/i.test(window.location.pathname)) {
  const passwordNote = document.createElement('div');
  passwordNote.className = 'windows-password-note';
  passwordNote.setAttribute('role', 'note');
  passwordNote.innerHTML = '<span class="windows-password-icon">🔐</span><div><strong>Installation Windows</strong><p>Le mot de passe demandé pendant l\'installation est <code>OumarAOD</code>.</p></div>';
  document.querySelector('.page-download-actions').after(passwordNote);

  const installSection = document.querySelector('.install');
  if (installSection && !document.querySelector('.windows-install')) {
    const windowsSection = document.createElement('section');
    windowsSection.className = 'windows-install section-pad';
    windowsSection.innerHTML = `<div class="container install-layout"><div class="install-intro" data-reveal><p class="eyebrow eyebrow-dark">VERSION WINDOWS</p><h2>Installez TaodAluminium<br><span>sur votre ordinateur.</span></h2><p>Suivez ces quelques étapes pour installer la version Windows sans difficulté.</p></div><ol class="steps"><li class="step" data-reveal><span class="step-icon windows-step-icon">↓</span><div><span class="step-label">ÉTAPE 01</span><h3>Téléchargez pour Windows</h3><p>Cliquez sur le bouton « Télécharger pour Windows » pour récupérer le fichier d'installation.</p></div><span class="step-index">01</span></li><li class="step" data-reveal><span class="step-icon windows-step-icon">▣</span><div><span class="step-label">ÉTAPE 02</span><h3>Ouvrez le fichier d'installation</h3><p>Retrouvez <b>Taod_Setup.exe</b> dans vos téléchargements, puis lancez-le.</p></div><span class="step-index">02</span></li><li class="step" data-reveal><span class="step-icon windows-step-icon">🔐</span><div><span class="step-label">ÉTAPE 03</span><h3>Saisissez le mot de passe</h3><p>Lorsque Windows le demande, saisissez <b>OumarAOD</b>, puis validez.</p></div><span class="step-index">03</span></li><li class="step" data-reveal><span class="step-icon windows-step-icon">✓</span><div><span class="step-label">ÉTAPE 04</span><h3>Terminez l'installation</h3><p>Suivez l'assistant jusqu'à la fin, puis ouvrez TaodAluminium depuis le raccourci.</p></div><span class="step-index">04</span></li></ol></div>`;
    installSection.after(windowsSection);
    windowsSection.querySelectorAll('[data-reveal]').forEach((element) => element.classList.add('is-visible'));
  }
}
