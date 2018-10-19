import _ from 'lodash';
import Cookies from 'js-cookie';

const TEST_KEY = 'test';

/**
 * Used to detect browser features
 */
export class Detector {
    /**
     * Support browsers global storage
     *
     * @return {boolean}
     */
    static hasGlobalStorage() {
        try {
            if (!window.globalStorage) return false;
            let sDomain = '127.0.0.1';
            if (document && document.domain) {
                sDomain = document.domain;
            }
            window.globalStorage[sDomain];
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Support browsers session storage
     *
     * @return {boolean}
     */
    static hasSessionStorage() {
        try {
            const oStorageImpl = window.sessionStorage;

            if (_.isObject(oStorageImpl)) {
                oStorageImpl.setItem(TEST_KEY, '1');
                oStorageImpl.removeItem(TEST_KEY);
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }

    /**
     * Support browsers local storage
     *
     * @return {boolean}
     */
    static hasLocalStorage() {
        try {
            let oStorageImpl = window.localStorage;

            if (_.isObject(oStorageImpl)) {
                oStorageImpl.setItem(TEST_KEY, '1');
                oStorageImpl.removeItem(TEST_KEY);
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }

    /**
     * Does browser have cookies enabled (for this site)
     *
     * @param {string} _sTestCookieName
     * @return {string}
     */
    static hasCookies(_sTestCookieName) {
        let sCookieName = _sTestCookieName || 'testcookie';

        if (!_.isUndefined(navigator.cookieEnabled)) {
            Cookies.set(sCookieName, '1');
            return Cookies.get(sCookieName) === '1';
        }

        return false;
    }

    /**
     * Returns visitor timezone difference, in hours, between UTC and local time.
     *
     * @return {number}
     */
    static detectTimezone() {
        return -((new Date().getTimezoneOffset()) / 60);
    }

    /**
     * Gets the current viewport.
     *
     * Code based on:
     * - http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
     * - http://responsejs.com/labs/dimensions/
     *
     * @return {string}
     */
    static detectViewportSize() {
        let e = window;
        let a = 'inner';

        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }

        return `${e[a+'Width']}x${e[a+'Height']}`;
    }

    /**
     * Gets the dimensions of the current
     * document.
     *
     * Code based on:
     * - http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
     *
     * @return {string}
     */
    static detectDocumentSize() {
        const de = document.documentElement; // Alias
        const w = Math.max(de.clientWidth, de.offsetWidth, de.scrollWidth);
        const h = Math.max(de.clientHeight, de.offsetHeight, de.scrollHeight);
        return isNaN(w) || isNaN(h) ? '' : w + 'x' + h;
    }
}
