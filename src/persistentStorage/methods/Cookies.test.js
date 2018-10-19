import {describe, it} from 'mocha';
import {expect} from 'chai';

import {Cookies} from './Cookies';

describe('Cookies', () => {
    it('Should set and then return stored value', () => {
        let oCookies = new Cookies();
        let sKey = 'test';
        let sValue = 'value';

        oCookies.set(sKey, sValue);
        expect(oCookies.get(sKey)).to.equal(sValue);
    });

    it('Should remove value', () => {
        let oCookies = new Cookies();
        let sKey = 'test';
        let sValue = 'value';

        oCookies.set(sKey, sValue);
        expect(oCookies.get(sKey)).to.equal(sValue);
        oCookies.remove(sKey);
        expect(oCookies.get(sKey)).to.be.null;
    });
});
