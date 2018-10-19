import {beforeEach, describe, it} from 'mocha';
import {expect} from 'chai';

import {SessionStorage} from './SessionStorage';
import {StorageMock} from '../../common/StorageMock';


describe('SessionStorage', () => {
    beforeEach(() => {
        if (!SessionStorage.isAvaliable()) {
            window.sessionStorage = new StorageMock();
        }
    });

    it('Should set and then return stored value', () => {
        let oSessionStorage = new SessionStorage();
        let sKey = 'test';
        let sValue = 'value';

        oSessionStorage.set(sKey, sValue);
        expect(oSessionStorage.get(sKey)).to.equal(sValue);
    });

    it('Should remove value', () => {
        let oSessionStorage = new SessionStorage();
        let sKey = 'test';
        let sValue = 'value';

        oSessionStorage.set(sKey, sValue);
        expect(oSessionStorage.get(sKey)).to.equal(sValue);
        oSessionStorage.remove(sKey);
        expect(oSessionStorage.get(sKey)).to.be.null;
    });

    it('Should verify avaliability', () => {
        expect(typeof(window.sessionStorage) === 'object')
            .to.equal(SessionStorage.isAvaliable());
    });
});
