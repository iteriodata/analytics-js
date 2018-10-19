import {beforeEach, describe, it} from 'mocha';
import {expect} from 'chai';

import {LocalStorage} from './LocalStorage';
import {StorageMock} from '../../common/StorageMock';


describe('LocalStorage', () => {
    beforeEach(() => {
        if (!LocalStorage.isAvaliable()) {
            window.localStorage = new StorageMock();
        }
    });

    it('Should set and then return stored value', () => {
        let oLocalStorage = new LocalStorage();
        let sKey = 'test';
        let sValue = 'value';

        oLocalStorage.set(sKey, sValue);
        expect(oLocalStorage.get(sKey)).to.equal(sValue);
    });

    it('Should remove value', () => {
        let oLocalStorage = new LocalStorage();
        let sKey = 'test';
        let sValue = 'value';

        oLocalStorage.set(sKey, sValue);
        expect(oLocalStorage.get(sKey)).to.equal(sValue);
        oLocalStorage.remove(sKey);
        expect(oLocalStorage.get(sKey)).to.be.null;
    });

    it('Should verify avaliability', () => {
        expect(typeof(window.localStorage) === 'object')
            .to.equal(LocalStorage.isAvaliable());
    });
});
