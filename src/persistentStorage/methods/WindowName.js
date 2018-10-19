import _ from 'lodash';

import {Base64} from 'js-base64';
import {BaseMethod} from './BaseMethod';

/**
 * WindowName
 */
export class WindowName extends BaseMethod {
    /**
     * Set data to window
     * @param {string} _sKey
     * @param {string} _sValue
     */
    set(_sKey, _sValue) {
        let oParams;

        try {
            oParams = this._get();
        } catch (e) {
            oParams = {};
        }

        oParams[_sKey] = _sValue;
        this._set(oParams);
    }

    /**
     * Get data from window
     * @param {string} _sKey
     * @return {string}
     */
    get(_sKey) {
        try {
            let oParams = this._get();
            let sValue = oParams[_sKey];
            if (_.isUndefined(sValue)) return null;
            return sValue;
        } catch (e) {
            this._set({});
            return null;
        }
    }

    /**
     * Remove data from window
     * @param {string} _sKey
     */
    remove(_sKey) {
        let oParams;
        try {
            oParams = this._get();
            delete oParams[_sKey];
        } catch (e) {
            oParams = {};
        }
        this._set(oParams);
    }

    /**
     * Encode object to store in window
     * @param {object} _oParams
     */
    _set(_oParams) {
        window.name = Base64.encode(JSON.stringify(_oParams));
    }

    /**
     * Decode object from window
     * @return {object}
     */
    _get() {
        return JSON.parse(Base64.decode(window.name));
    }
}
