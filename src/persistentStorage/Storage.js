import _ from 'lodash';
import {Base64} from 'js-base64';

import {StorageMethodFactory} from './StorageMethodFactory';


let DEFAULT_STORAGE_METHODS = [
    'COOKIES',
    'LOCAL_STORAGE',
    'SESSION_STORAGE',
    'WINDOW_NAME',
    'GLOBAL_STORAGE',
    'WEB_SQL',
    'INDEXED_DB',
];

/**
 * Persistent storage uses all available methods trying to keep user data forever
 */
export class Storage {
    /**
     * @param {array} _aConfig array of {string|object}
     * e.g. {name: 'COOKIES', params: [new Date()], disabled: true}
     */
    constructor(_aConfig = []) {
        let aConfig = this._setDefaults(_aConfig, DEFAULT_STORAGE_METHODS);

        this.aStorageMethods = [];

        aConfig.forEach((_soConfig) => {
            if (_.isObject(_soConfig) && _soConfig.disabled) return;

            let sName = this._getConfigName(_soConfig);
            let aParams = this._getConfigParams(_soConfig);
            let oMethod = StorageMethodFactory.create(sName, aParams);

            if (!oMethod) return;

            this.aStorageMethods.push(oMethod);
        });
    }

    /**
     * Set key/value pair for all avaliable methods
     * @param {string} _sKey
     * @param {string} _sValue
     */
    async set(_sKey, _sValue) {
        _.forEach(this.aStorageMethods,
            async (oMethod) => {
                try {
                    return await oMethod.set(_sKey, _sValue ? Base64.encode(_sValue) : null);
                } catch (e) {/* empty */}
            });
    }

    /**
     * Reads value from all avaliable methods
     * Defines the best one
     * Updates value for all avaliable methods to persist the data
     *
     * @param {string} _sKey
     * @return {promise}
     */
    async get(_sKey) {
        let aValues = [];

        for (let oMethod of this.aStorageMethods) {
            try {
                aValues.push(await oMethod.get(_sKey));
            } catch (e) {/* empty */}
        }

        let sValue = this._getBestCandidate(aValues);

        if (!sValue) return null;

        try {
            sValue = Base64.decode(sValue);
        } catch (e) {/* empty */}

        this.set(_sKey, sValue);

        return sValue;
    }

    /**
     * Remove value from all avaliable methods
     * @param {string} _sKey
     */
    async remove(_sKey) {
        _.forEach(this.aStorageMethods, async (oMethod) => {
            try {
                return await oMethod.remove(_sKey);
            } catch (e) {/* empty */}
        });
    }

    /**
     * Returns array of methods as a config with defaults from _aConfigDefault
     * if it is not defined in _aConfig
     *
     * @param {array} _aConfig
     * @param {array} _aConfigDefault
     * @return {array}
     */
    _setDefaults(_aConfig, _aConfigDefault) {
        if (!_aConfig && !_aConfigDefault) return [];
        if (!_aConfig) return _aConfigDefault;

        let aConfig = _.concat([], _aConfig);

        _.forEach(_aConfigDefault, (_soConfigDefault) => {
            let saConfig = _.find(_aConfig, (_soConfig) => {
                return this._getConfigName(_soConfig) === this._getConfigName(_soConfigDefault);
            });

            if (!saConfig) {
                aConfig.push(_soConfigDefault);
            }
        });

        return aConfig;
    }


    /**
     * Returns a name of the method in case config is a string
     * or name field in case it is an object
     * like {name: 'COOKIES', params: [new Date()], disabled: true}
     *
     * @param {string|object} _soConfig
     * @return {string}
     */
    _getConfigName(_soConfig) {
        if (_.isString(_soConfig)) {
            return _soConfig;
        }

        if (_.isObject(_soConfig) && _soConfig.name) {
            return _soConfig.name;
        }

        return '';
    }

    /**
     * Returns a params array in case config is set as an object
     * like {name: 'COOKIES', params: [new Date()], disabled: true}
     *
     * @param {string|object} _soConfig
     * @return {array}
     */
    _getConfigParams(_soConfig) {
        return _.isObject(_soConfig) && _soConfig.params ? _soConfig.params : undefined;
    }

    /**
     * Calculates best candidate based on how many storage methods return the same value
     * @param {array} _aValues
     * @return {string}
     */
    _getBestCandidate(_aValues) {
        if (!_aValues || _aValues.length === 0) return;

        let oValueScores = {};
        let sBestScore = 0;
        let sBestValue = _aValues[0];

        _.forEach(_aValues, async (_sValue) => {
            if (!_.isString(_sValue)) return;

            if (!_.isUndefined(oValueScores[_sValue])) {
                oValueScores[_sValue] += 1;
            } else {
                oValueScores[_sValue] = 1;
            }

            if (oValueScores[_sValue] > sBestScore) {
                sBestScore = oValueScores[_sValue];
                sBestValue = _sValue;
            }
        });

        return sBestValue;
    }
}
