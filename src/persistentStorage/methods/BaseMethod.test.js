import {describe, it} from 'mocha';
import {expect} from 'chai';

import {BaseMethod} from './BaseMethod';

describe('BaseMethod', () => {
    it('Should be avaliable by default', () => {
        let oBaseMethod = new BaseMethod();
        oBaseMethod.set();
        oBaseMethod.get();
        oBaseMethod.remove();
        expect(BaseMethod.isAvaliable()).to.be.true;
    });
});
