import config from './../config';
import {Storage} from './../persistentStorage';

import {BaseSyncIdentity} from './BaseIdentities';


/**
 * User class identity
 */
export class User extends BaseSyncIdentity {
    /**
     * Initiate persistent storage to keep user data in the browser
     * for as long as possible
     */
    constructor() {
        super();
        this.oStorage = new Storage();
    }

    /**
     * Gets user data from storage if there is one.
     * Otherwise generates a new one and stores it in a storage.
     */
    async init() {
        let oUser = undefined;
        let sValue = await this.oStorage.get(config.sUserCookieKey);

        try {
            sValue = sValue ? JSON.parse(sValue) : undefined;

            if (sValue.id && sValue.time) {
                oUser = sValue;
            }
        } catch (e) {
            oUser = undefined;
        }

        if (!oUser) {
            this.resetToNew();
            await this.sync();
        } else {
            this.id = oUser.id;
            this.time = oUser.time;
        }
    }

    /**
     * Sync identity state with some storage
     * implemented by parent class as _set method
     *
     * @return {Object}
     */
    sync() {
        return this._set({
            id   : this.id,
            time : this.time,
        });
    }

    /**
     * Set user data to storage
     *
     * @private
     * @param {object} _oUser
     */
    async _set(_oUser) {
        await this.oStorage.set(config.sUserCookieKey, JSON.stringify(_oUser));
    }
}
