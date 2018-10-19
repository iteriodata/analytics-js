import {Detector} from '../../components';
import {BaseMethod} from './BaseMethod';

/**
 * GlobalStorage
 */
export class GlobalStorage extends BaseMethod {
    /**
     * Initialize global storage by current domain
     */
    constructor() {
        super();
        this.oGlobalStorage = window.globalStorage[document.domain];
    }

    /**
     * Set data to global storage
     * @param {string} _sKey
     * @param {string} _sValue
     */
    set(_sKey, _sValue) {
        this.oGlobalStorage.setItem(_sKey, _sValue);
    }

    /**
     * Get data from global storage
     * @param {string} _sKey
     * @return {string}
     */
    get(_sKey) {
        return this.oGlobalStorage.getItem(_sKey);
    }

    /**
     * Remove data from global storage
     * @param {string} _sKey
     */
    remove(_sKey) {
        this.oGlobalStorage.removeItem(_sKey);
    }

    /**
     * Verifies if the method is supported by browser
     * @return {boolean}
     */
    static isAvaliable() {
        return Detector.hasGlobalStorage();
    }
}
