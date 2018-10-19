import {describe, it} from 'mocha';
import {expect} from 'chai';
import sinon from 'sinon';

import {BaseSyncIdentity} from './BaseSyncIdentity';

describe('BaseSyncIdentity', () => {
    it('Sync & _set method should be called', () => {
        let baseSyncIdentity = new BaseSyncIdentity();
        sinon.spy(baseSyncIdentity, 'sync');
        sinon.spy(baseSyncIdentity, '_set');

        let iCurrentTime = new Date().getTime();
        baseSyncIdentity.resetToNew();
        baseSyncIdentity.incrementPart();

        expect(baseSyncIdentity.sync.calledOnce).to.be.true;
        expect(baseSyncIdentity._set.calledOnce).to.be.true;

        let oOutArgs = baseSyncIdentity._set.getCall(0).args[0];
        expect(oOutArgs.id).to.be.a('number');
        expect(oOutArgs.time).to.be.within(iCurrentTime - 50, iCurrentTime + 50);
        expect(oOutArgs.part).to.equal(1);
    });
});
