import {describe, it} from 'mocha';
import {expect} from 'chai';

import {StorageMethodFactory} from './StorageMethodFactory';
import {Cookies} from './methods';

describe('StorageMethodFactory', () => {
    it('Should not create anything on empty input', () => {
        expect(StorageMethodFactory.create()).to.be.null;
    });

    it('Should not create storage based on falsy input', () => {
        expect(StorageMethodFactory.create('cookies')).to.be.null;
    });

    it('Should create storage based on input', () => {
        expect(StorageMethodFactory.create('COOKIES')).to.be.an.instanceof(Cookies);
        expect(StorageMethodFactory.create('COOKIES', [Infinity])).to.be.an.instanceof(Cookies);
    });
});
