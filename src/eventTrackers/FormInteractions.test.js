import $ from 'jquery';
import {describe, it} from 'mocha';
import {expect} from 'chai';
import sinon from 'sinon';

import {FormInteractions} from './FormInteractions';

describe('FormInteractions', () => {
    it('Callback passed through FormInteractions processor should be called', (done) => {
        let oCallback = sinon.spy();
        new FormInteractions(oCallback);

        $('body').empty();
        $('body').append($('<form name="test_form">' +
                '<input id="fi_test_text" type="text" value="test" />' +
                '<input id="fi_test_checkbox" type="checkbox" />' +
                '<input id="fi_test_radio" type="radio" name="test" value="test" />' +
            '</form>'
        ));

        setTimeout(() => {
            let oFocusEvent = document.createEvent('HTMLEvents');
            let oBlurEvent = document.createEvent('HTMLEvents');
            let oChangeEvent = document.createEvent('HTMLEvents');

            oFocusEvent.initEvent('focus', false, true);
            oBlurEvent.initEvent('blur', false, true);
            oChangeEvent.initEvent('change', false, true);

            $('#fi_test_text')[0].dispatchEvent(oFocusEvent);
            $('#fi_test_text')[0].dispatchEvent(oBlurEvent);

            $('#fi_test_checkbox')[0].dispatchEvent(oChangeEvent);
            $('#fi_test_radio')[0].dispatchEvent(oChangeEvent);

            expect(oCallback.callCount).to.equal(4);

            let aExpectedResults = [
                [
                    'test',
                    {id : 'fi_test_text', type : 'text', value : 'test'},
                    'focus',
                    {name : 'test_form'},
                ],
                [
                    'test',
                    {id : 'fi_test_text', type : 'text', value : 'test'},
                    'blur',
                    {name : 'test_form'},
                ],
                [
                    false,
                    {id : 'fi_test_checkbox', type : 'checkbox'},
                    'change',
                    {name : 'test_form'},
                ],
                [
                    false,
                    {id : 'fi_test_radio', type : 'radio', name : 'test', value : 'test'},
                    'change',
                    {name : 'test_form'},
                ],
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
});
