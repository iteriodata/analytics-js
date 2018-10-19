import _ from 'lodash';
import {onDomChange} from '../crossBrowsers';

/**
 * Base interface for listening the dom.
 * It uses onDomChange implementation that tracks dom changes
 * and initializes listeners every time it happens.
 */
export class BaseDom {
    /**
     * Watches on dom changes and runs listeners
     *
     * @constructor
     */
    constructor() {
        _.bindAll(this, '_handleEvent');

        onDomChange(() => {
            if (document.readyState === 'loading') return;
            this._addListeners();
        });
    }

    /**
     * Initialize your listeners here for child class
     *
     * @private
     */
    _addListeners() {
    }

    /**
     * Handler event
     *
     * @param {event} _oEvent : Dom element event
     *
     * @private
     */
    _handleEvent(_oEvent) {
        let target;

        _oEvent = _oEvent || window.event;
        target = _oEvent.target || _oEvent.srcElement;

        this._handleElement(_oEvent, target);
    }

    /**
     * Initialize your event handlers here for child class
     *
     * @param {event} _oEvent : Dom element event
     * @param {object} _oEl   : Dom element from which the event was dispatched of
     * @private
     */
    _handleElement(_oEvent, _oEl) {
    }
}
