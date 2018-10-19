import {BaseIdentity} from './BaseIdentity';

/**
 * BaseSyncIdentity interface
 * Implements interfaces for syncing data with storages.
 * Requres to implement _set method.
 */
export class BaseSyncIdentity extends BaseIdentity {
    /**
     * Increments part and returns new value
     *
     * @return {integer}
     */
    incrementPart() {
        this.part += 1;
        this.sync();
        return this.part;
    }

    /**
     * Sync identity state with some storage
     * implemented by child class as _set method
     *
     * @return {Object}
     */
    sync() {
        return this._set(this.json());
    }

    /**
     * Sets identity state
     *
     * @private
     */
    _set() {
        /* to be implemented by child class */
    }
}
