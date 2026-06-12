(function () {
  function getConsentRoot(input) {
    return input.closest('.freilaender-go-express-consent');
  }

  function updateHint(input) {
    const root = getConsentRoot(input);
    if (!root) return;

    const hint = root.querySelector('.consent-inline-hint');
    if (hint) hint.hidden = input.checked;
    input.value = input.checked ? 'ja' : '';
  }

  function persistConsent(input) {
    if (typeof routes === 'undefined' || typeof fetchConfig !== 'function') return;

    const body = JSON.stringify({
      attributes: {
        go_express_zustimmung: input.checked ? 'ja' : '',
      },
    });

    fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body } });
  }

  function showToast(input, msg) {
    const root = getConsentRoot(input);
    if (!root) return;

    const toast = document.getElementById(root.dataset.toastId);
    if (!toast) return;

    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toast._freilaenderTimer);
    toast._freilaenderTimer = setTimeout(() => {
      toast.hidden = true;
    }, 3000);
  }

  function initAll() {
    document
      .querySelectorAll('.freilaender-go-express-consent input[name="attributes[go_express_zustimmung]"]')
      .forEach((input) => updateHint(input));
  }

  document.addEventListener('change', (event) => {
    if (!event.target.matches('input[name="attributes[go_express_zustimmung]"]')) return;

    event.stopPropagation();
    updateHint(event.target);
    persistConsent(event.target);
  });

  document.addEventListener(
    'submit',
    (event) => {
      const form = event.target;
      if (!form || (form.id !== 'cart' && form.id !== 'CartDrawer-Form')) return;

      const consent =
        form.querySelector('input[name="attributes[go_express_zustimmung]"]') ||
        document.querySelector(`input[name="attributes[go_express_zustimmung]"][form="${form.id}"]`);

      if (consent && !consent.checked) {
        showToast(consent, 'Ohne Zustimmung gibt es keine Sendungsverfolgung.');
      }
    },
    true
  );

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  document.addEventListener('cart-drawer:opened', initAll);
})();
