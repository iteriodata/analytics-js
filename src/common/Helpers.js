
/**
 * These are helper functions
 **/
export class Helpers {
    /**
     * Extract hostname from URL
     *
     * @param {string} _sUrl: path from which you need to get hostname
     * @return {*}
     */
    static getHostName(_sUrl) {
        // scheme : // [username [: password] @] hostname [: port] [/ [path] [? query] [# fragment]]
        const oRegExp = new RegExp('^(?:(?:https?|ftp):)/*(?:[^@]+@)?([^:/#]+)');
        const aMatches = oRegExp.exec(_sUrl);

        return aMatches ? aMatches[1] : _sUrl;
    }

    /**
     * Parses array of classes from class attribute string
     *
     * @param {string} _sClassAttr: attribute of a DOM el
     * @return {Array}
     */
    static parseClassAttr(_sClassAttr) {
        if (!_sClassAttr) return [];
        return _sClassAttr.match(/\S+/g) || [];
    }

    /**
     * List the attributes of a DOM element
     *
     * @param {object} _oEl
     * @return {object}
     */
    static getAttrs(_oEl) {
        let oAttributes = {};

        if (!_oEl.attributes) return oAttributes;

        Array.prototype.slice.call(_oEl.attributes).forEach(function(item) {
            if (item.name === 'class') {
                oAttributes[item.name] = Helpers.parseClassAttr(item.value);
            } else {
                oAttributes[item.name] = item.value;
            }
        });
        return oAttributes;
    }

    /**
     * Get domain name.
     *
     * @return {string}
     */
    static domain() {
        try {
            return document.domain;
        } catch (e) {/* empty */}
    }
}
