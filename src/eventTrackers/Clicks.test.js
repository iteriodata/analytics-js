import $ from 'jquery';
import {describe, it} from 'mocha';
import {expect} from 'chai';
import sinon from 'sinon';

import config from '../config';

import {Clicks} from './Clicks';

describe('Clicks', () => {
    it('Callback passed to through click processor should be called', (done) => {
        let oCallback = sinon.spy();
        new Clicks(oCallback, 6, config.ignoredDomElements.concat(['span']));

        $('body').empty();
        $('body')
            .append($('<div>' +
                '<span class="c_test">file</span>' +
                '<div id="c_test2">short</div>' +
                '<div id="c_test3">veryverylong</div>' +
            '</div>'));

        setTimeout(() => {
            $('.c_test').click();
            $('#c_test2').click();
            $('#c_test3').click();
            expect(oCallback.calledTwice).to.be.true;

            let aExpectedResults = [
                [undefined, 'div', {id : 'c_test2'}, 'short'],
                [undefined, 'div', {id : 'c_test3'}, 'veryve'],
            ];

            for (let i = 0; i < oCallback.callCount; ++i) {
                for (let j = 0; j < aExpectedResults[i].length; ++j) {
                    expect(oCallback.getCall(i).args[j])
                        .to.deep.equal(aExpectedResults[i][j]);
                }
            }

            done();
        });
    });

    it('Should handle link click event', () => {
        let oCallback = sinon.spy();
        let oClicks = new Clicks(oCallback, 20, []);
        let oClickEvent = document.createEvent('HTMLEvents');
        oClickEvent.initEvent('focus', false, true);

        oClicks._handleElement(
            oClickEvent,
            $('<a id="c_test4" href="https://www.facebook.com/">somlink</a>')[0]
        );

        expect(oCallback.calledOnce).to.be.true;
        expect(oCallback.getCall(0).args[0]).to.equal('https://www.facebook.com/');
    });
});
