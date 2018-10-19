import {BaseMethod} from './BaseMethod';


// Web SQL is limited in some browsers by 5mb (safari)
// 512 * 1024 ~ 512 kb
const DB_SIZE = 512 * 1024;

/**
 * WebSql
 */
export class WebSql extends BaseMethod {
    /**
    * Initialize web sql db
    */
    constructor() {
        super();
        this.oDB = window.openDatabase('websql_persistent_storage', '',
            'persistent storage', DB_SIZE);
    }

    /**
     * Set data to web sql
     * @param {string} _sKey
     * @param {string} _sValue
     * @return {object} - Promise
     */
    set(_sKey, _sValue) {
        return this.oDB.transaction((tx) => {
            tx.executeSql('CREATE TABLE IF NOT EXISTS cache(' +
                'id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
                'key TEXT NOT NULL, ' +
                'value TEXT NOT NULL, ' +
                'UNIQUE (key)' +
                ')');

            tx.executeSql('INSERT OR REPLACE INTO cache(key, value) VALUES(?, ?)',
                [_sKey, _sValue]);
        });
    }

    /**
     * Get data from web sql
     * @param {string} _sKey
     * @return {object} - Promise
     */
    get(_sKey) {
        return new Promise((fResolve, fReject) => {
            this.oDB.transaction((tx) => {
                tx.executeSql('SELECT value FROM cache WHERE key=?', [_sKey],
                    (tx, oResult) => {
                        if (oResult.rows.length >= 1) {
                            fResolve(oResult.rows.item(0).value);
                        } else {
                            fResolve(null);
                        }
                    },
                    () => fResolve(null)
                );
            });
        });
    }

    /**
     * Remove data from web sql
     * @param {string} _sKey
     * @return {object} - Promise
     */
    remove(_sKey) {
        return this.oDB.transaction((tx) => {
            tx.executeSql('DELETE FROM cache WHERE key=?', [_sKey]);
        });
    }

    /**
     * Verifies if the method is supported by browser
     * @return {boolean}
     */
    static isAvaliable() {
        return !!window.openDatabase && !!window.openDatabase('test', '', 'test', DB_SIZE);
    }
}
