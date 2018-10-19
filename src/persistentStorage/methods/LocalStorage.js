import {Detector} from '../../components';
import {BaseMethod} from './BaseMethod';

/**
 * LocalStorage
 */
export class LocalStorage extends BaseMethod {
    /**
     * Set data to local storage
     * @param {string} _sKey
     * @param {string} _sValue
     */
    set(_sKey, _sValue) {
        window.localStorage.setItem(_sKey, _sValue);
    }

    /**
     * Get data from local storage
     * @param {string} _sKey
     * @return {string}
     */
    get(_sKey) {
        return window.localStorage.getItem(_sKey);
    }

    /**
     * Remove data from local storage
     * @param {string} _sKey
     */
    remove(_sKey) {
        window.localStorage.removeItem(_sKey);
    }

    /**
     * Verifies if the method is supported by browser
     * @return {boolean}
     */
    static isAvaliable() {
        return Detector.hasLocalStorage();
    }
}
