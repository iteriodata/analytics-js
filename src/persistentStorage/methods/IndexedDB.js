import {BaseMethod} from './BaseMethod';

let ACCESS = {
    R  : 'readonly',
    RW : 'readwrite',
};
const NAME = 'PERSISTENT_STORAGE';
const VERSION = 1;
const STORE_NAME = 'PERSISTENT_STORAGE';

/**
 * IndexedDB
 */
export class IndexedDB extends BaseMethod {
    /**
    * Initialize web indexed db
    */
    constructor() {
        super();
        this.indexedDB = window.indexedDB || window.mozIndexedDB ||
            window.webkitIndexedDB || window.msIndexedDB;
    }

    /**
     * Set data to indexed db
     * @param {string} _sKey
     * @param {string} _sValue
     * @return {object} - Promise
     */
    set(_sKey, _sValue) {
        return this._operation((_oStore) => {
            return _oStore.put({
                key   : _sKey,
                value : _sValue,
            });
        }, ACCESS.RW);
    }

    /**
     * Get data from indexed db
     * @param {string} _sKey
     * @return {object} - Promise
     */
    get(_sKey) {
        return this._operation((_oStore) => {
            return _oStore.get(_sKey);
        });
    }

    /**
     * Remove data from indexed db
     * @param {string} _sKey
     * @return {object} - Promise
     */
    remove(_sKey) {
        return this._operation((_oStore) => {
            return _oStore.delete(_sKey);
        }, ACCESS.RW);
    }

    /**
     * Performs operation on indexedDB
     * @param {function} _cb
     * @param {string} _sAccessRight
     * @return {object} - Promise
     */
    _operation(_cb, _sAccessRight) {
        _sAccessRight = _sAccessRight || ACCESS.R;
        return new Promise((_resolve, _reject) => {
            this._connect((_oDb) => {
                let oTx = _oDb.transaction(STORE_NAME, _sAccessRight);
                let oStore = oTx.objectStore(STORE_NAME);
                let oOp = _cb(oStore);

                oOp.onsuccess = () => {
                    _resolve(oOp.result && oOp.result.value ? oOp.result.value : null);
                };

                oOp.onerror = () => _reject();

                oTx.onerror = () => _reject();

                oTx.oncomplete = () => _oDb.close();
            });
        });
    }

    /**
     * Creates connection to indexedDB
     * @param {function} _cb
     */
    _connect(_cb) {
        let request = this.indexedDB.open(NAME, VERSION);

        request.onsuccess = () => {
            _cb(request.result);
        };

        request.onupgradeneeded = (_oEvent) => {
            _oEvent.currentTarget.result.createObjectStore(STORE_NAME, {keyPath : 'key'});
            this._connect(_cb);
        };
    }

    /**
     * Verifies if the method is supported by browser
     * @return {boolean}
     */
    static isAvaliable() {
        return !!(window.indexedDB || window.mozIndexedDB ||
            window.webkitIndexedDB || window.msIndexedDB);
    }
}
