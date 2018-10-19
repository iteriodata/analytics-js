import _ from 'lodash';


/**
 * Class for watching on scroll event.
 * Tracks max y offset.
 */
export class Scroll {
    /**
     * @constructor
     */
    constructor() {
        this.iMaxYOffset = 0;

        this._addListeners();

        _.bindAll(this, ['_handleEvent']);
    }

    /**
     * Get max y offset
     * @return {number}
     */
    maxYOffset() {
        return this.iMaxYOffset;
    }

    /**
     * Reset offsets
     */
    reset() {
        this.iMaxYOffset = 0;
    }

    /**
     * Add listener for scroll change
     */
    _addListeners() {
        window.addEventListener('scroll', () => {
            this._handleEvent(window.scrollY + window.outerHeight);
        }, false);
    }

    /**
     * Handle scroll offset change
     *
     * @param {event} _iYOffset : window y offset
     * @private
     */
    _handleEvent(_iYOffset) {
        if (this.iMaxYOffset < _iYOffset) {
            this.iMaxYOffset = _iYOffset;
        }
    }
}
