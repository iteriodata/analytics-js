import $ from 'jquery';
import {describe, it} from 'mocha';
import {expect} from 'chai';
import sinon from 'sinon';

import {FormSubmit} from './FormSubmit';

describe('FormSubmit', () => {
    it('Callback passed through FormSubmit processor should be called', () => {
        $('body').empty();
        $('body').append($('<form id="fs_form" name="form">' +
                '<input id="fs_test_text" type="text" value="test" />' +
                '<input id="fs_test_text2" type="password" value="password" />' +
                '<input id="fs_test_checkbox" type="checkbox" />' +
                '<input id="fs_test_radio1" type="radio" name="test" value="test1" />' +
                '<input id="fs_test_radio2" type="radio" name="test" value="test2" />' +
            '</form>'
        ));

        let oCallback = sinon.spy();
        let oFormSubmit = new FormSubmit(oCallback);
        oFormSubmit._addListeners();
        oFormSubmit._handleElement(null, $('#fs_form')[0]);

        expect(oCallback.calledOnce).to.be.true;
        expect(oCallback.getCall(0).args[0]).to.deep.equal({
            id   : 'fs_form',
            name : 'form',
        });
        expect(oCallback.getCall(0).args[1]).to.deep.equal([
            {
                ev  : 'test',
                eat : {
                    id    : 'fs_test_text',
                    type  : 'text',
                    value : 'test',
                },
            },
            {
                ev  : false,
                eat : {
                    id   : 'fs_test_checkbox',
                    type : 'checkbox',
                },
            },
            {
                ev  : false,
                eat : {
                    id    : 'fs_test_radio1',
                    type  : 'radio',
                    name  : 'test',
                    value : 'test1',
                },
            },
            {
                ev  : false,
                eat : {
                    id    : 'fs_test_radio2',
                    type  : 'radio',
                    name  : 'test',
                    value : 'test2',
                },
            },
        ]);
    });
});
