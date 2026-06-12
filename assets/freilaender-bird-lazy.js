(function () {
  const BIRD_ID = 'birdchime-slots-box';
  const MOUNT_SELECTOR = '[data-freilaender-bird-mount]';

  function mountBirdWidget(mount) {
    if (!mount || mount.querySelector(`#${BIRD_ID}`)) return;

    const box = document.createElement('div');
    box.id = BIRD_ID;

    const watchAjax = mount.dataset.watchAjax;
    if (watchAjax) {
      box.setAttribute('data-watch-ajax', watchAjax);
    }

    mount.appendChild(box);
    document.dispatchEvent(new CustomEvent('freilaender:bird-mounted'));
  }

  function initAccordion(details) {
    const mount = details.querySelector(MOUNT_SELECTOR);
    if (!mount || details.dataset.birdLazyInit === 'true') return;

    details.dataset.birdLazyInit = 'true';

    details.addEventListener('toggle', () => {
      if (details.open) mountBirdWidget(mount);
    });

    if (details.open) mountBirdWidget(mount);
  }

  function initBirdLazyMounts(root = document) {
    root.querySelectorAll('.freilaender-delivery-accordion').forEach(initAccordion);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initBirdLazyMounts();

    const drawer = document.querySelector('cart-drawer');
    if (!drawer) return;

    const observer = new MutationObserver(() => initBirdLazyMounts(drawer));
    observer.observe(drawer, { childList: true, subtree: true });
  });

  document.addEventListener('cart-drawer:opened', () => {
    const drawer = document.querySelector('cart-drawer');
    if (drawer) initBirdLazyMounts(drawer);
  });
})();
