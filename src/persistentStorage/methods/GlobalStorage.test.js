import {beforeEach, describe, it} from 'mocha';
import {expect} from 'chai';

import {GlobalStorage} from './GlobalStorage';
import {StorageMock} from '../../common/StorageMock';


describe('GlobalStorage', () => {
    beforeEach(() => {
        if (!GlobalStorage.isAvaliable()) {
            window.globalStorage = {
                [document.domain] : new StorageMock(),
            };
        }
    });

    it('Should set and then return stored value', () => {
        let oGlobalStorage = new GlobalStorage();
        let sKey = 'test';
        let sValue = 'value';

        oGlobalStorage.set(sKey, sValue);
        expect(oGlobalStorage.get(sKey)).to.equal(sValue);
    });

    it('Should remove value', () => {
        let oGlobalStorage = new GlobalStorage();
        let sKey = 'test';
        let sValue = 'value';

        oGlobalStorage.set(sKey, sValue);
        expect(oGlobalStorage.get(sKey)).to.equal(sValue);
        oGlobalStorage.remove(sKey);
        expect(oGlobalStorage.get(sKey)).to.be.null;
    });

    it('Should verify avaliability', () => {
        expect(typeof(window.globalStorage) === 'object')
            .to.equal(GlobalStorage.isAvaliable());
    });
});

