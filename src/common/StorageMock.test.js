import {beforeEach, afterEach, describe, it} from 'mocha';
import {expect} from 'chai';

import {StorageMock} from './StorageMock';


describe('StorageMock', () => {
    let oStorage;

    beforeEach(() => {
        oStorage = new StorageMock();
    });

    afterEach(() => {
        oStorage = undefined;
    });

    it('Should set and then return stored value then undefined while removed', () => {
        let sKey = 'test';
        let sValue = 'value';

        oStorage.setItem(sKey, sValue);
        expect(oStorage.getItem(sKey)).to.equal(sValue);
        oStorage.removeItem(sKey);
        expect(oStorage.getItem(sKey)).to.be.null;
    });

    it('Should give number of elements in the store', () => {
        let sKey = 'test';
        let sValue = 'value';

        oStorage.setItem(sKey, sValue);
        oStorage.setItem(`${sKey}1`, sValue);
        oStorage.setItem(`${sKey}2`, sValue);
        expect(oStorage.length).to.equal(3);
        expect(oStorage.length).to.equal(3);
    });

    it('Should return key by index', () => {
        let sKey = 'test';
        let sValue = 'value';

        oStorage.setItem(sKey, sValue);
        oStorage.setItem(`${sKey}1`, sValue);
        oStorage.setItem(`${sKey}2`, sValue);
        expect(oStorage.key(0)).to.equal(sKey);
        expect(oStorage.key(5)).to.equal(null);
    });
});
