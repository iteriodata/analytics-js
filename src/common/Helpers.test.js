import {describe, it} from 'mocha';
import {expect} from 'chai';

import {Helpers} from './Helpers';

describe('Helpers', () => {
    const TEST_CLASS_STRING = 't    t2  t3';
    let TEST_CLASS_STRING_RESULT = ['t', 't2', 't3'];

    it('getHostName', () => {
        const TEST_STRING = 'http://api.plos.org/search?q=title:DNA';
        expect(Helpers.getHostName(TEST_STRING)).to.be.equal('api.plos.org');
        expect(Helpers.getHostName('foo')).to.be.equal('foo');
    });

    describe('parseClassAttr', () => {
        it('Should return array of attributes', () => {
            expect(Helpers.parseClassAttr(TEST_CLASS_STRING))
                .to.be.deep.equal(TEST_CLASS_STRING_RESULT);
        });

        it('Should return empty array in case no attributes are present', () => {
            let a = Helpers.parseClassAttr('');
            expect(a).to.be.an('array');
            expect(a.length).to.be.equal(0);
        });
    });

    describe('getAttrs', () => {
        it('Should return empty dict when there are no attributes', () => {
            expect(Helpers.getAttrs({})).to.be.deep.equal({});
            expect(Helpers.getAttrs({attributes : ''})).to.be.deep.equal({});
            expect(Helpers.getAttrs({attributes : []})).to.be.deep.equal({});
        });

        it('Should parse all attributes', () => {
            let aInput = {
                attributes : [{
                    name  : 'class',
                    value : TEST_CLASS_STRING,
                }, {
                    name  : 'foo',
                    value : 'test',
                }],
            };
            let oOutput = {
                class : TEST_CLASS_STRING_RESULT,
                foo   : 'test',
            };
            expect(Helpers.getAttrs(aInput)).to.be.deep.equal(oOutput);
        });
    });

    describe('domain', () => {
        it('Should get domain', () => {
            expect(Helpers.domain()).to.equal('localhost');
        });
    });
});
