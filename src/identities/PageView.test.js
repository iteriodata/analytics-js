import {describe, it} from 'mocha';
import {expect} from 'chai';
import sinon from 'sinon';

import {PageView} from './PageView';

describe('PageView', () => {
    it('Should properly be initiated with resetToNew', () => {
        let pageView = new PageView();
        sinon.spy(pageView, 'resetToNew');
        pageView.init();
        expect(pageView.resetToNew.calledOnce);
    });
});
