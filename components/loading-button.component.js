(function() {
    const template = document.createElement('template');

    template.innerHTML = `
        <style>
            :host {
                cursor: pointer;
                display: inline-block;
                padding: 10px 20px;
                border-radius: 5px;
                color: #20252a;
                background-color: ghostwhite;
                transition: .3s;
            }
            
            :host(.loading) {
                position: relative;
                margin-top: 10px;
                padding: 0;
                border-radius: 50%;
                cursor: progress;
                background-color: transparent;
            }
            
            :host(.loading):after {
              content: "";
              display: block;
              width: 25px;
              height: 25px;
              border-radius: 50%;
              border: 4px solid #000;
              border-color: #000 transparent #000 transparent;
              animation: loader 1.2s linear infinite;
            }
            
            :host(.complete) {
                background-color: limegreen;
                color: #fff;
            }
            
            :host ::slotted([slot="complete-message"]) {
                display: none;
            }
            
            :host(.complete) ::slotted(:not([slot="complete-message"])) {
                display: none;
            }
            
            :host(.complete) ::slotted([slot="complete-message"]) {
                display: inline-block;
            }
            
            
            :host(.loading) ::slotted(*) {
                display: none;
            }
            
            
            :host(:hover) {
                opacity: 0.8;
            }
            
            ::slotted(label) {
                cursor: pointer;
            }
        </style>
        <slot></slot>
        <slot name="complete-message"></slot>
    `;

    class LoadingButtonComponent extends HTMLElement {
        static get observedAttributes() {
            return ['disabled'];
        }

        #shadowRoot;
        loading;

        constructor() {
            super();
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        connectedCallback() {
            this._upgradeProperty('disabled');

            this.addEventListener('click', this._onClick);
        }

        _upgradeProperty(prop) {
            if (this.hasOwnProperty(prop)) {
                let value = this[prop];
                delete this[prop];
                this[prop] = value;
            }
        }

        disconnectedCallback() {
            this.removeEventListener('click', this._onClick);
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

        attributeChangedCallback(name, oldValue, newValue) {
            const hasValue = newValue !== null;
        }

        _onClick(event) {
            if (!this.loading) {
                this.loading = true;
                this.classList.remove('complete');
                this.classList.add('loading');
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.classList.add('complete');
                    this.loading = false;
                }, 1000)
            }
        }

    }
    window.customElements.define('loading-button-component', LoadingButtonComponent);
})();
