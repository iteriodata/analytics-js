import {describe, it} from 'mocha';
import {expect} from 'chai';

import {IndexedDB} from './IndexedDB';


describe('IndexedDB', () => {
    it('Should set and then return stored value', async () => {
        let oIndexedDB = new IndexedDB();
        let sKey = 'test';
        let sValue = 'value';

        await oIndexedDB.set(sKey, sValue);

        let sResult = await oIndexedDB.get(sKey);
        expect(sResult).to.equal(sValue);
    });

    it('Should remove value', async () => {
        let oIndexedDB = new IndexedDB();
        let sKey = 'test';
        let sValue = 'value';

        await oIndexedDB.set(sKey, sValue);

        let sResult = await oIndexedDB.get(sKey);
        expect(sResult).to.equal(sValue);
        await oIndexedDB.remove(sKey);
        sResult = await oIndexedDB.get(sKey);
        expect(sResult).to.be.null;
    });

    it('Should verify avaliability', () => {
        expect(typeof(window.indexedDB || window.mozIndexedDB ||
            window.webkitIndexedDB || window.msIndexedDB) === 'object')
                .to.equal(IndexedDB.isAvaliable());
    });
});
