import _ from 'lodash';

import JSCookies from 'js-cookie';
import {Helpers} from '../../common';
import {Detector} from '../../components';
import {BaseMethod} from './BaseMethod';

/**
 * Cookies
 */
export class Cookies extends BaseMethod {
    /**
     * @param {object} _oExpires
     */
    constructor(_oExpires = Infinity) {
        super();

        this.sTopLevelDomain = Helpers.domain();
        this.oExpires = _oExpires;
    }

    /**
     * Set the cookie
     * @param {string} _sKey
     * @param {string} _sValue
     */
    set(_sKey, _sValue) {
        JSCookies.set(_sKey, _sValue, {
            expires : this.oExpires,
            domain  : this.sTopLevelDomain,
        });
    }

    /**
     * Get the cookie
     * @param {string} _sKey
     * @return {string}
     */
    get(_sKey) {
        let sResult = JSCookies.get(_sKey);
        if (_.isUndefined(sResult)) return null;
        return sResult;
    }

    /**
     * Remove the cookie
     * @param {string} _sKey
     */
    remove(_sKey) {
        JSCookies.remove(_sKey, {
            path   : '',
            domain : this.sTopLevelDomain,
        });
    }

    /**
     * Verifies if the method is supported by browser
     * @return {boolean}
     */
    static isAvaliable() {
        return Detector.hasCookies();
    }
}
