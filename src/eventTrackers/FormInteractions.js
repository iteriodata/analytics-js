import _ from 'lodash';
import {Helpers} from '../common';

import {BaseDom} from './BaseDom';

/**
 * Class for initializing listeners for form input change events
 */
export class FormInteractions extends BaseDom {
    /**
     * @constructor
     *
     * @param {function} _fOnFormInteraction : callback function on input change event
     */
    constructor(_fOnFormInteraction) {
        super();

        this.onFormInteraction = _fOnFormInteraction;
    }

    /**
     * Add listener for form inputs
     */
    _addListeners() {
        let aInputs = document.getElementsByTagName('input');
        _.forEach(aInputs, (oInput) => {
            switch (oInput.type) {
                case 'text':
                    oInput.addEventListener('focus', this._handleEvent, false);
                    oInput.addEventListener('blur', this._handleEvent, false);
                    return;
                case 'checkbox':
                case 'radio':
                    oInput.addEventListener('change', this._handleEvent, false);
                    return;
            }
        });
    }

    /**
     * Handle form interaction change
     *
     * @param {event} _oEvent    : Event caused by input change
     *
     * @param {HTMLElement} _oEl : Dom element tha was changed
     *
     * @private
     */
    _handleElement(_oEvent, _oEl) {
        let value;
        let oFormAttrs = _oEl.form ? Helpers.getAttrs(_oEl.form) : undefined;

        switch (_oEl.type) {
            case 'text':
                value = _oEl.value;
                break;
            case 'radio':
            case 'checkbox':
                value = _oEl.checked;
                break;
        }

        this.onFormInteraction(value, Helpers.getAttrs(_oEl), _oEvent.type, oFormAttrs);
    }
}
