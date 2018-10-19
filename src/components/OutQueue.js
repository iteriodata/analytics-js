import _ from 'lodash';
import {Base64} from 'js-base64';

import config from '../config';


/**
 * Send event to server
 * */
export class OutQueue {
    /**
     * @constructor
     * @param {Object} _oRaven : instance of sentry client to track errors
     */
    constructor(_oRaven) {
        this.oRaven = _oRaven;
        this.iTimer = undefined;
        this.aEvents = [];
    }

    /**
     * Adding data to outQueue array for pushing to server
     *
     * @param {object} _oOventData: event from tracker callback
     * @param {object} _oBrowserData: information about user's browser
     */
    sendEventPayload(_oOventData, _oBrowserData) {
        this.aEvents.push(_oOventData);
        this.executeQueue(_oBrowserData);
    }

    /**
     * Trying to send data to server with timeout times.
     *
     * @param {object} _oBrowserData
     */
    executeQueue(_oBrowserData) {
        if (this.iTimer) return;

        this.iTimer = setTimeout(() => {
            this.flushQueue(_oBrowserData);
            this.iTimer = undefined;
        }, config.delayNextRequest);
    }

    /**
     * Trying to send data to server.
     *
     * @param {object} _oBrowserData
     * @param {boolean} _bAsync
     */
    flushQueue(_oBrowserData, _bAsync = true) {
        if (this.aEvents.length === 0) {
            return;
        }

        let oPayload = {
            v  : config.fSchemaVersion,
            e  : this.aEvents,
            bd : _.assign(_oBrowserData, {
                t : new Date().getTime(),
            }),
        };

        this.aEvents = [];

        let oXhr = new XMLHttpRequest();
        if (_bAsync) {
            oXhr.onerror = (e) => {
                this.oRaven.captureMessage('Failed sending /events request', {
                    extra : {
                        responseText : e.responseText,
                    },
                    tags : {
                        method : 'OutQueue.flushQueue',
                    },
                    level : 'error',
                });
                this.aEvents = this.aEvents.concat(oPayload.e);
                this.executeQueue(_oBrowserData);
            };
        }
        oXhr.open('POST', config.sEndpoint, _bAsync);
        oXhr.send(Base64.encode(JSON.stringify(oPayload)));
    }
}
