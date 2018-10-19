import _ from 'lodash';

import {
    Cookies,
    LocalStorage,
    SessionStorage,
    WindowName,
    GlobalStorage,
    WebSql,
    IndexedDB,
} from './methods';


let METHODS = {
    'COOKIES'         : Cookies,
    'LOCAL_STORAGE'   : LocalStorage,
    'SESSION_STORAGE' : SessionStorage,
    'WINDOW_NAME'     : WindowName,
    'GLOBAL_STORAGE'  : GlobalStorage,
    'WEB_SQL'         : WebSql,
    'INDEXED_DB'      : IndexedDB,
};

/**
 * Storage method factory
 */
export class StorageMethodFactory {
    /**
     * Initiate an instance of specified storage method
     * @param {string}  _sMethodName
     * @param {array}   _aParams
     * @return {object} Storage method instance
     */
    static create(_sMethodName, _aParams) {
        try {
            let MethodClass = METHODS[_sMethodName];

            if (!MethodClass || !MethodClass.isAvaliable()) return null;

            if (_.isArray(_aParams) && _aParams.length) {
                return new MethodClass(..._aParams);
            }
            return new MethodClass();
        } catch (e) {
            return null;
        }
    }
}
