import {describe, it} from 'mocha';
import {expect} from 'chai';
import sinon from 'sinon';

import {Visibility} from './Visibility';


describe('Visibility', () => {
    it('Should provide visibility time frame', (done) => {
        const DELAY = 500; // ms

        let oVisibleCB = sinon.spy();
        let oHideCB = sinon.spy();

        let oVisibility = new Visibility(oVisibleCB, oHideCB);

        setTimeout(() => {
            oVisibility._handleEvent('hidden');
            oVisibility._handleEvent('visible');

            expect(oVisibleCB.calledOnce).to.be.true;
            expect(oHideCB.calledOnce).to.be.true;
            expect(oHideCB.getCall(0).args[0]).to.be.within(DELAY, 2*DELAY);
            done();
        }, DELAY);
    });
});
