import _ from 'lodash';
import {Helpers} from '../common';

import {BaseDom} from './BaseDom';

const regexpProtocol =
  '^(javascript|vbscript|jscript|mocha|livescript|ecmascript|mailto):';

/**
 * Class for initializing listeners for click events
 */
export class Clicks extends BaseDom {
    /**
     * @constructor
     * @param {function} _fOnClick       : callback function on click event
     *
     * @param {?int} _iContentSizeLimit  : based on limit innerHtml is ignored if exceeds
     *
     * @param {?array} _aFilters         : array of element names that should be ignored
     */
    constructor(
        _fOnClick,
        _iContentSizeLimit,
        _aFilters = []
    ) {
        super();

        this.fOnClick = _fOnClick;
        this.aFilters = _aFilters;
        this.iContentSizeLimit = _iContentSizeLimit;
    }

    /**
     * Add listener for links
     */
    _addListeners() {
        document.addEventListener('click', this._handleEvent, false);
    }

    /**
     * Process click for getting link
     *
     * @param {event} _oEvent    : Event caused by click
     *
     * @param {HTMLElement} _oEl : Dom element tha was clicked
     *
     * @private
     */
    _handleElement(_oEvent, _oEl) {
        // do not process dom elements specified in filters like: ['html', 'body']
        if (_.indexOf(this.aFilters, _oEl.tagName.toLowerCase()) !== -1) return;

        let sHref = undefined;
        let sElementName = _oEl.tagName.toLowerCase();
        let sElementAttrs = Helpers.getAttrs(_oEl);
        let sElementContent = undefined;

        // verify innerHtml size
        if (_oEl.innerHTML &&
            this.iContentSizeLimit !== undefined) {
            sElementContent = _oEl.innerHTML.substr(0, this.iContentSizeLimit);
        }

        if (_oEl.href) {
            // browsers, such as Safari, don't downcase hostname and href
            const hostName = _oEl.hostname || Helpers.getHostName(_oEl.href);
            const sourceHref = _oEl.href.replace(hostName, hostName.toLowerCase());
            const scriptProtocol = new RegExp(regexpProtocol, 'i');

            // test that url is not contains malisheus scripts
            if (!scriptProtocol.test(sourceHref)) {
                // decodeUrl %xx
                sHref = unescape ? unescape(sourceHref) : decodeURI(sourceHref);
            }
        }

        // call onClick function
        this.fOnClick(
            sHref,
            sElementName,
            sElementAttrs,
            sElementContent
        );
    }
}
