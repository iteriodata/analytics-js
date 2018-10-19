import {describe, it} from 'mocha';
import {expect} from 'chai';

import {BaseIdentity} from './BaseIdentity';

describe('BaseIdentity', () => {
    it('Should properly be initiated', () => {
        let baseIdentity = new BaseIdentity();

        expect(baseIdentity.json()).to.deep.equal({
            id   : null,
            time : null,
            part : null,
        });
        expect(baseIdentity.isNew).to.be.false;

        let iCurrentTime = new Date().getTime();
        baseIdentity.resetToNew();

        expect(baseIdentity.id).to.be.a('number');
        expect(baseIdentity.time).to.be.within(iCurrentTime - 50, iCurrentTime + 50);
        expect(baseIdentity.part).to.equal(0);
        expect(baseIdentity.isNew).to.be.true;

        expect(baseIdentity.incrementPart()).to.equal(1);
        expect(baseIdentity.part).to.equal(1);
    });
});
