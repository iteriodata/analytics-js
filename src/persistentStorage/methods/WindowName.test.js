import _ from 'lodash';
import {beforeEach, describe, it} from 'mocha';
import {expect} from 'chai';

import {Base64} from 'js-base64';
import {WindowName} from './WindowName';

describe('WindowName', () => {
    let sKey = 'test';
    let sValue = 'value';
    let oWindowName;

    beforeEach(() => {
        oWindowName = new WindowName();
        window.name = '';
    });

    it('Encode/decode data to/from window', () => {
        let object = {
            [sKey]     : sValue,
            [sKey+'2'] : sValue+'2',
        };

        oWindowName._set(object);
        expect(oWindowName._get()).to.deep.equal(object);
    });

    it('Should set and then return stored value', () => {
        oWindowName.set(sKey, sValue);
        expect(oWindowName.get(sKey)).equal(sValue);
        expect(oWindowName.get('nonkey')).to.be.null;
        expect(JSON.parse(Base64.decode(window.name))).to.deep.equal({[sKey] : sValue});
    });

    it('Should remove value', () => {
        oWindowName.set(sKey, sValue);
        expect(oWindowName.get(sKey)).equal(sValue);
        oWindowName.remove(sKey);
        expect(oWindowName.get(sKey)).to.be.null;
    });

    it('Should set and get multiple values', () => {
        let oResult = {};
        _.forEach(_.range(3), (iKeyIndex) => {
            oWindowName.set(sKey + iKeyIndex, sValue + iKeyIndex);
            oResult[sKey + iKeyIndex] = sValue + iKeyIndex;
        });

        expect(JSON.parse(Base64.decode(window.name))).to.deep.equal(oResult);
    });
});
