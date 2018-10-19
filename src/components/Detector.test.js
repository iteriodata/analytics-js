import {describe, it} from 'mocha';
import {expect} from 'chai';

import {Detector} from './Detector';

describe('Detector', () => {
    it('Testing session storage in browser', () => {
        expect(typeof(window.sessionStorage) === 'object')
            .to.equal(Detector.hasSessionStorage());
    });

    it('Testing local storage in browser', () => {
        expect(typeof(window.localStorage) === 'object')
            .to.equal(Detector.hasLocalStorage());
    });

    it('Testing global storage in browser', () => {
        expect(typeof(window.globalStorage) === 'object')
            .to.equal(Detector.hasGlobalStorage());
    });

    it('Testing cookies in browser enable or no', () => {
        expect(navigator.cookieEnabled === true)
            .to.equal(Detector.hasCookies());
    });

    it('Testing cookies in browser enable or no with parameter', () => {
        expect(navigator.cookieEnabled === true)
            .to.equal(Detector.hasCookies('sdhjfkjsdfhsiuhgsd'));
    });

    it('Testing timezone', () => {
        expect(new Date().getTimezoneOffset() / 60 * -1)
            .to.equal(Detector.detectTimezone());
    });

    it('Testing viewport', () => {
        const viewport = Detector.detectViewportSize().split('x');
        expect(`${viewport[0]}x${viewport[1]}`).to.equal(Detector.detectViewportSize());
    });

    it('Testing document size', () => {
        const size = Detector.detectDocumentSize();
        const view = size.split('x');
        expect(view.length === 0 || typeof(+view[0] && +view[1]) === 'number').to.equal(true);
    });
});
