
/**
 * Mock to emulate storages for testing
 */
export class StorageMock {
    /**
     * Initiate basic dictionary as a storage
     */
    constructor() {
        this.oStorage = {};
    }

    /**
     * Store value in oStorage dictionary
     *
     * @param {string} _sKey
     * @param {string} _sValue
     */
    setItem(_sKey, _sValue) {
        this.oStorage[_sKey] = _sValue || '';
    }

    /**
     * Retrieve value from oStorage dictionary
     *
     * @param {string} _sKey
     * @return {string}
     */
    getItem(_sKey) {
        return _sKey in this.oStorage ? this.oStorage[_sKey] : null;
    }

    /**
     * Remove value from oStorage dictionary
     *
     * @param {string} _sKey
     */
    removeItem(_sKey) {
        delete this.oStorage[_sKey];
    }

    /**
     * Number of stored items in oStorage
     */
    get length() {
        return Object.keys(this.oStorage).length;
    }

    /**
     * Get key by index
     *
     * @param {number} _i
     * @return {string}
     */
    key(_i) {
        let keys = Object.keys(this.oStorage);
        return keys[_i] || null;
    }
}
