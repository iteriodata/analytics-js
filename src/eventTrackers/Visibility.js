import _ from 'lodash';


/**
 * Class for watching on page visibility.
 */
export class Visibility {
    /**
     * @constructor
     *
     * @param {function} _fOnVisible : callback function on visible
     *
     * @param {function} _fOnHidden : callback function on hidden
     */
    constructor(_fOnVisible, _fOnHidden) {
        this.fOnVisible = _fOnVisible;
        this.fOnHidden = _fOnHidden;

        // time in milliseconds from which visibility period starts
        this.iTimeStart = new Date().getTime();

        this._addListeners();

        _.bindAll(this, ['_handleEvent']);
    }

    /**
     * Trigger hidden event manually
     */
    triggerHidden() {
        this._handleEvent('hidden');
    }

    /**
     * Add listener for visibility change
     */
    _addListeners() {
        document.addEventListener('visibilitychange',
            () => this._handleEvent(document.visibilityState), false);
    }

    /**
     * Handle visibility change
     *
     * @param {boolean} _bVisibilityState : visibility state
     * @private
     */
    _handleEvent(_bVisibilityState) {
        switch (_bVisibilityState) {
            case 'visible':
                this.iTimeStart = new Date().getTime();
                this.fOnVisible();
                break;
            case 'hidden':
                this.fOnHidden(new Date().getTime() - this.iTimeStart);
                break;
        }
    }
}
