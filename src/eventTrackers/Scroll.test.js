import $ from 'jquery';
import {describe, it} from 'mocha';
import {expect} from 'chai';

import {Scroll} from './Scroll';


describe('Scroll', () => {
    it('Scroll should detect changes', (done) => {
        $('body').empty();
        $('body').append($('<div' +
                '<div style="height: 2000px; width: 100%;" />' +
            '</div>'
        ));
        let scroll = new Scroll();

        expect(scroll.maxYOffset()).to.equal(0);

        setTimeout(() => {
            let oScrollEvent = document.createEvent('HTMLEvents');
            oScrollEvent.initEvent('scroll', false, true);
            window.dispatchEvent(oScrollEvent);

            expect(scroll.maxYOffset()).to.not.equal(0);
            done();
        });
    });

    it('Scroll reset scrool offset', () => {
        let scroll = new Scroll();
        scroll.iMaxYOffset = 10;
        expect(scroll.maxYOffset()).to.equal(10);
        scroll.reset();
        expect(scroll.maxYOffset()).to.equal(0);
    });
});
