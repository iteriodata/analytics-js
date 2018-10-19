import _ from 'lodash';

import {beforeEach, afterEach, describe, it} from 'mocha';
import {expect} from 'chai';
import sinon from 'sinon';

import {InQueue} from './InQueue';

describe('InQueue', () => {
    let TEST_METHOD_NAME = 'testEventProcessor';
    let Tracker = {
        [TEST_METHOD_NAME] : _.noop,
    };
    let oTestEventProcessorSpy;

    beforeEach(() => {
        oTestEventProcessorSpy = sinon.spy(Tracker, TEST_METHOD_NAME);
    });

    afterEach(() => {
        oTestEventProcessorSpy.restore();
    });

    it('applyTrackerMethod', () => {
        window.iterio = {
            q : [[TEST_METHOD_NAME], [TEST_METHOD_NAME], [TEST_METHOD_NAME], ['foo']],
        };

        let inQueue = new InQueue(Tracker);
        inQueue.push([TEST_METHOD_NAME]);

        expect(oTestEventProcessorSpy.callCount).to.be.equal(4);
    });
});
