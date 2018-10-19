import _ from 'lodash';
import {StorageMock} from '../common';

/**
 * Base interface for listening the url changes.
 * It based on history API.
 * https://developer.mozilla.org/en-US/docs/Web/API/History_API
 */
export class UrlChange {
    /**
     * Watches on url changes and runs listeners
     *
     * @constructor
     *
     * @param {function} _fOnUrlChange : callback function on url change
     */
    constructor(_fOnUrlChange) {
        _.bindAll(this, '_handleUrlChange');

        try {
            this.storage = window.localStorage || window.sessionStorage || new StorageMock();
        } catch (e) {
            this.storage = new StorageMock();
        }

        this.storage.setItem('prevHref', window.location.href);

        this.onUrlChange = _fOnUrlChange;

        this._addListeners();
    }

    /**
     * Add listeners for url change.
     * In particular tracks for popstate and pushstate
     * on browser history.
     *
     * @private
     */
    _addListeners() {
        window.addEventListener('popstate', () => {
            this._handleUrlChange(window.location.href);
        });

        let pushState = window.history.pushState;
        window.history.pushState = (...args) => {
            if (_.isFunction(window.history.onpushstate)) {
                window.history.onpushstate({state : args[0]});
            }

            this._handleUrlChange(window.location.origin + args[2]);
            return pushState.apply(window.history, args);
        };
    }

    /**
     * Handler for url change
     *
     * @param {event} _sNextHref : Next page url
     *
     * @private
     */
    _handleUrlChange(_sNextHref) {
        let sPrevHref = this.storage.getItem('prevHref');
        this.storage.setItem('prevHref', _sNextHref);

        if (sPrevHref !== _sNextHref) {
            this.onUrlChange(sPrevHref, _sNextHref);
        }
    }
}
