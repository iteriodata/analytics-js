import Cookies from 'js-cookie';
import {Base64} from 'js-base64';

import config from '../config';
import {Helpers} from '../common';
import {BaseSyncIdentity} from './BaseIdentities';


/**
 * Session class identity
 */
export class Session extends BaseSyncIdentity {
    /**
     * Initiate current session if there is one in progress.
     * Otherwise generates a new one and stores it in a cookie.
     */
    init() {
        let sCookie = Cookies.get(config.sSessionCookieKey);
        let oSession = undefined;
        try {
            oSession = sCookie ? JSON.parse(Base64.decode(sCookie)) : undefined;
        } catch (e) {
            oSession = undefined;
        }

        if (!oSession) {
            this.resetToNew();
            this.sync();
        } else {
            this.id = oSession.id;
            this.time = oSession.time;
            this.part = oSession.part;
        }
    }

    /**
     * Set session cookies
     *
     * @private
     * @param {object} _oSession
     */
    _set(_oSession) {
        // Get a formatted timestamp for 30 minutes from now
        let oThirtyMinutes = new Date();
        oThirtyMinutes.setTime(oThirtyMinutes.getTime() + 1000 * 60 * 30);

        let sTopLevelDomain = Helpers.domain();

        // Set the session to expire 30 minutes from now
        Cookies.set(config.sSessionCookieKey, Base64.encode(JSON.stringify(_oSession)), {
            expires : oThirtyMinutes,
            domain  : sTopLevelDomain,
        });
    }
}
