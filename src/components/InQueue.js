import _ from 'lodash';

/**
 * Initialization trackers
 */
export class InQueue {
    /**
     * @param {Tracker} _oTracker
     */
    constructor(_oTracker) {
        this.oTracker = _oTracker;

        // We need to manually apply any events collected before this initialization
        for (let i = 0; i < window.iterio.q.length; i++) {
            this.applyTrackerMethod(window.iterio.q[i]);
        }
    }

    /**
     * Push function to replace the Array method after our script loads
     *
     * @param {Array} _aArgs
     */
    push(_aArgs) {
        this.applyTrackerMethod(_aArgs);
    }

    /**
     * apply wrapper
     *
     * @param {Array} _aParameters : An array comprising of ['methodName', optional_parameters]
     */
    applyTrackerMethod(_aParameters) {
        let sMethod = Array.prototype.shift.call(_aParameters);

        if (_.isFunction(this.oTracker[sMethod])) {
            this.oTracker[sMethod].apply(this.oTracker, _aParameters);
        }
    }
}
