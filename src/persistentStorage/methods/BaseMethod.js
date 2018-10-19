/**
 * BaseMethod
 */
export class BaseMethod {
    /**
     * Set data to session
     * @param {string} _sKey
     * @param {string} _sValue
     */
    set(_sKey, _sValue) {}

    /**
     * Get data from Session
     * @param {string} _sKey
     */
    get(_sKey) {}

    /**
     * Remove data from Session
     * @param {string} _sKey
     */
    remove(_sKey) {}

    /**
     * Verifies if the method is supported by browser
     * @return {boolean}
     */
    static isAvaliable() {
        return true;
    }
}
