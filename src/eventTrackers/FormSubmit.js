import _ from 'lodash';
import {Helpers} from '../common';

import {BaseDom} from './BaseDom';


/**
 * Class for initializing listeners for form submit events
 */
export class FormSubmit extends BaseDom {
    /**
     * @constructor
     *
     * @param {function} _fOnFormSubmit : callback function on form submit
     */
    constructor(_fOnFormSubmit) {
        super();

        this.onFormSubmit = _fOnFormSubmit;
    }

    /**
     * Add listener for form inputs
     */
    _addListeners() {
        let aForms = document.getElementsByTagName('form');
        _.forEach(aForms, (oForm) => {
            oForm.addEventListener('submit', this._handleEvent, false);
        });
    }

    /**
     * Handle form interaction change
     *
     * @param {event} _oEvent    : Submit event
     *
     * @param {HTMLElement} _oEl : Form element that was submitted
     *
     * @private
     */
    _handleElement(_oEvent, _oEl) {
        let aFormInputes = _oEl.getElementsByTagName('input');
        let aOutFormInputes = [];

        _.forEach(aFormInputes, (oInput) => {
            let value;

            switch (oInput.type) {
                case 'text':
                    value = oInput.value;
                    break;
                case 'radio':
                case 'checkbox':
                    value = oInput.checked;
                    break;
                default: break;
            }

            if (_.isUndefined(value)) return;

            aOutFormInputes.push({
                ev  : value,
                eat : Helpers.getAttrs(oInput),
            });
        });

        this.onFormSubmit(Helpers.getAttrs(_oEl), aOutFormInputes);
    }
}
