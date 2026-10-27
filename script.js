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

    // Evite le saut en haut de page et rappelle ou renseigner le chemin du fichier manquant.
    event.preventDefault();
    downloadToast.textContent = 'Le lien de téléchargement n’est pas encore configuré. Ajoutez le chemin de votre fichier Android ou Windows dans index.html.';
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
const mobileDownloadCta = document.querySelector('.mobile-download-cta');

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
