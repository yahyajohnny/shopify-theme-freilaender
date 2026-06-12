if (!customElements.get('go-express-consent')) {
  customElements.define(
    'go-express-consent',
    class GoExpressConsent extends HTMLElement {
      connectedCallback() {
        this.consent = this.querySelector('input[name="attributes[go_express_zustimmung]"]');
        if (!this.consent) return;

        this.hint = this.querySelector('.consent-inline-hint');
        this.toast = document.getElementById(this.dataset.toastId);
        this.form = document.getElementById(this.dataset.formId);

        if (this.consent.dataset.bound === 'true') return;
        this.consent.dataset.bound = 'true';

        this.consent.addEventListener('change', this.onChange.bind(this));

        if (this.form) {
          this.form.addEventListener('submit', this.onSubmit.bind(this));
        }

        this.updateHint();
      }

      onChange(event) {
        event.stopPropagation();
        this.updateHint();
        this.persistConsent();
      }

      onSubmit() {
        if (!this.consent.checked) {
          this.showToast('Ohne Zustimmung gibt es keine Sendungsverfolgung.');
        }
      }

      updateHint() {
        if (this.hint) this.hint.hidden = this.consent.checked;
        this.consent.value = this.consent.checked ? 'ja' : '';
      }

      persistConsent() {
        if (typeof routes === 'undefined' || typeof fetchConfig !== 'function') return;

        const body = JSON.stringify({
          attributes: {
            go_express_zustimmung: this.consent.checked ? 'ja' : '',
          },
        });

        fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body } });
      }

      showToast(msg) {
        if (!this.toast) return;
        this.toast.textContent = msg;
        this.toast.hidden = false;
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
          this.toast.hidden = true;
        }, 3000);
      }
    }
  );
}
