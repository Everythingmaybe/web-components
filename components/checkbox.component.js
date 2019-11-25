(function() {
    const template = document.createElement('template');

    template.innerHTML = `
        <style>
          :host {
            display: inline-block;
            background-size: contain;
            background-repeat: no-repeat;
            border: 2px solid #37aca2;
            width: 24px;
            height: 24px;
          }
          :host([hidden]) {
            display: none;
          }
          :host([checked]) {
            background-image: url('./images/check.svg');
          }
          :host([disabled]) {
          background-color: ghostwhite;
          
          }
          :host([checked][disabled]) {
            background-image: url('./images/check.svg');
          }
        </style>
    `;

    class CheckboxComponent extends HTMLElement {
        // Список атрибутов для "прослушки"
        static get observedAttributes() {
            return ['checked', 'disabled'];
        }

        constructor() {
            super();
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        // Колбэк при подключении компонента (аналог OnInit)
        connectedCallback() {
            if (!this.hasAttribute('role'))
                this.setAttribute('role', 'checkbox');
            if (!this.hasAttribute('tabindex'))
                this.setAttribute('tabindex', 0);

            this._upgradeProperty('checked');
            this._upgradeProperty('disabled');

            this.addEventListener('click', this._onClick);
        }

        // Переопределение свойств, которые были заданы до инита компонента
        _upgradeProperty(prop) {
            if (this.hasOwnProperty(prop)) {
                let value = this[prop];
                delete this[prop];
                this[prop] = value;
            }
        }

        // Колбэк при уничтожении компонента (аналог OnDestroy)
        disconnectedCallback() {
            this.removeEventListener('click', this._onClick);
        }

        set checked(value) {
            const isChecked = Boolean(value);
            if (isChecked)
                this.setAttribute('checked', '');
            else
                this.removeAttribute('checked');
        }

        get checked() {
            return this.hasAttribute('checked');
        }

        set disabled(value) {
            const isDisabled = Boolean(value);
            if (isDisabled)
                this.setAttribute('disabled', '');
            else
                this.removeAttribute('disabled');
        }

        get disabled() {
            return this.hasAttribute('disabled');
        }

        // Колбэк при каждом изменении атрибута
        attributeChangedCallback(name, oldValue, newValue) {
            const hasValue = newValue !== null;
            switch (name) {
                case 'checked':
                    this.setAttribute('aria-checked', hasValue);
                    break;
                case 'disabled':
                    this.setAttribute('aria-disabled', hasValue);
                    if (hasValue) {
                        this.removeAttribute('tabindex');
                        this.blur();
                    } else {
                        this.setAttribute('tabindex', '0');
                    }
                    break;
            }
        }

        _onClick(event) {
            this._toggleChecked();
        }

        _toggleChecked() {
            if (this.disabled)
                return;
            this.checked = !this.checked;
            this.dispatchEvent(new CustomEvent('change', {
                detail: {
                    checked: this.checked,
                },
                bubbles: true,
            }));
        }

    }
    window.customElements.define('checkbox-component', CheckboxComponent);
})();
