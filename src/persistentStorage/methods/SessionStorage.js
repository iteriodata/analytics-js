import {Detector} from '../../components';
import {BaseMethod} from './BaseMethod';

/**
 * SessionStorage
 */
export class SessionStorage extends BaseMethod {
    /**
     * Set data to session
     * @param {string} _sKey
     * @param {string} _sValue
     */
    set(_sKey, _sValue) {
        window.sessionStorage.setItem(_sKey, _sValue);
    }

    /**
     * Get data from session
     * @param {string} _sKey
     * @return {string}
     */
    get(_sKey) {
        return window.sessionStorage.getItem(_sKey);
    }

    /**
     * Remove data from session
     * @param {string} _sKey
     */
    remove(_sKey) {
        window.sessionStorage.removeItem(_sKey);
    }

    /**
     * Verifies if the method is supported by browser
     * @return {boolean}
     */
    static isAvaliable() {
        return Detector.hasSessionStorage();
    }
}
