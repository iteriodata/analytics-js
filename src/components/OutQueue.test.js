import _ from 'lodash';
import config from '../config';

import {beforeEach, afterEach, describe, it} from 'mocha';
import {expect} from 'chai';
import sinon from 'sinon';

import {OutQueue} from './OutQueue';

describe('OutQueue', () => {
    let clock;
    let oServer;
    let oOutQueue;
    let oExecuteQueueSpy;
    let oFlushQueue;

    beforeEach(() => {
        oOutQueue = new OutQueue({captureMessage : _.noop, captureException : _.noop});
        oExecuteQueueSpy = sinon.spy(oOutQueue, 'executeQueue');
        oFlushQueue = sinon.spy(oOutQueue, 'flushQueue');

        clock = sinon.useFakeTimers();
        oServer = sinon.createFakeServer();
        oServer.respondWith(config.sEndpoint, [200, {'Content-Type' : 'application/json'}, '']);
    });

    afterEach(() => {
        clock.restore();
        oServer.restore();
        oExecuteQueueSpy.restore();
        oFlushQueue.restore();
        oOutQueue = undefined;
    });

    it('Events should be collected in the queue and to be sent after timeout', () => {
        oOutQueue.sendEventPayload({}, {});
        oOutQueue.sendEventPayload({}, {});

        clock.tick(config.delayNextRequest);
        oServer.respond();

        expect(oServer.requests.length).to.be.equal(1);
        expect(oExecuteQueueSpy.calledTwice).to.be.true;
        expect(oFlushQueue.calledOnce).to.be.true;
    });

    it('Events should be collected in the queue and to be sent with force flush', () => {
        oOutQueue.sendEventPayload({}, {});
        oOutQueue.sendEventPayload({}, {});
        oOutQueue.flushQueue({}, true);

        oServer.respond();

        expect(oServer.requests.length).to.be.equal(1);
        expect(oExecuteQueueSpy.calledTwice).to.be.true;
        expect(oFlushQueue.calledOnce).to.be.true;
    });

    it('Events should be collected in the queue and to be sent with error response', () => {
        oOutQueue.sendEventPayload({}, {});
        oOutQueue.sendEventPayload({}, {});
        oOutQueue.flushQueue({}, true);

        oServer.requests[0].error();

        expect(oServer.requests.length).to.be.equal(1);
        expect(oExecuteQueueSpy.calledThrice).to.be.true;
        expect(oFlushQueue.calledOnce).to.be.true;
    });

    it('Request should not be sent if there are no events in a queue', () => {
        oOutQueue.flushQueue({});
        oServer.respond();

        expect(oServer.requests.length).to.be.equal(0);
    });
});
