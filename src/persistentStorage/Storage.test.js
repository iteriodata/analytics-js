import {beforeEach, afterEach, describe, it} from 'mocha';
import {expect} from 'chai';

import {Storage} from './Storage';
import {Cookies} from './methods';

describe('Storage', () => {
    let oStorage;

    beforeEach(() => {
        oStorage = new Storage();
    });

    afterEach(async () => {
        oStorage = undefined;
    });

    describe('constructor', () => {
        it('Should be created with COOKIES storage methods', () => {
            let oStorage = new Storage(['COOKIES', 'NOT_EXISTING_STORAGE_METHOD']);
            expect(oStorage.aStorageMethods)
                .to.deep.include(new Cookies());
        });

        it('Should be created without COOKIES storage methods', () => {
            let oStorage = new Storage([
                {
                    name     : 'COOKIES',
                    disabled : true,
                },
            ]);
            expect(oStorage.aStorageMethods)
                .to.be.an('array')
                .that.does.not.include(new Cookies());
        });
    });

    describe('get', () => {
        it('Should return null if the key is not found in any storage', async () => {
            let sKey = 'NOT_EXISTING_KEY';

            let sResult = await oStorage.get(sKey);
            expect(sResult).to.be.null;
        });
    });

    describe('set/get', () => {
        it('Should set and then return stored value', async () => {
            let sKey = 'it';
            let sValue = 'value';

            await oStorage.set(sKey, sValue);

            let sResult = await oStorage.get(sKey);
            expect(sResult).to.equal(sValue);
        });
    });

    describe('remove', () => {
        it('Should remove value', async () => {
            let sKey = 'it';
            let sValue = 'value';

            await oStorage.set(sKey, sValue);

            let sResult = await oStorage.get(sKey);
            expect(sResult).to.equal(sValue);
            await oStorage.remove(sKey);
            sResult = await oStorage.get(sKey);
            expect(sResult).to.be.null;
        });
    });

    describe('_setDefaults', () => {
        it('Should be empty for no input', () => {
            expect(oStorage._setDefaults()).to.deep.equal([]);
        });

        it('Should return defaults for first empty input', () => {
            let aDefaults = ['t'];
            expect(oStorage._setDefaults(undefined, aDefaults)).to.equal(aDefaults);
        });

        it('Should return first input on empty defaults', () => {
            let aInput = ['t'];
            expect(oStorage._setDefaults(aInput)).to.deep.equal(aInput);
        });

        it('Should fill first input with defaults without duplication', () => {
            let aInput = ['t', 't2', 't3'];
            let aDefaults = ['t3', 't4'];
            let aResult = ['t', 't2', 't3', 't4'];
            expect(oStorage._setDefaults(aInput, aDefaults)).to.deep.equal(aResult);
        });

        it('Should fill first input with defaults without duplication - objects', () => {
            let aInput = ['t', 't2', {name : 't3'}];
            let aDefaults = [
                {name : 't2', params : ['t']},
                {name : 't3', params : ['t']},
                't4',
                {name : 't5', params : ['t']},
            ];
            let aResult = ['t', 't2', {name : 't3'}, 't4', {name : 't5', params : ['t']}];
            expect(oStorage._setDefaults(aInput, aDefaults)).to.deep.equal(aResult);
        });
    });

    describe('_getConfigName', () => {
        it('Should be empty on empty input', () => {
            expect(oStorage._getConfigName()).to.equal('');
        });

        it('Should be empty on wrong input', () => {
            expect(oStorage._getConfigName(null)).to.equal('');
            expect(oStorage._getConfigName({})).to.equal('');
        });

        it('Should return name for an input string', () => {
            let sName = 'it';
            expect(oStorage._getConfigName(sName)).to.equal(sName);
        });

        it('Should return name for an object that includes the property', () => {
            let sName = 'it';
            expect(oStorage._getConfigName({name : sName})).to.equal(sName);
        });
    });

    describe('_getConfigParams', () => {
        it('Should be undefined result on empty input', () => {
            expect(oStorage._getConfigParams()).to.be.undefined;
        });

        it('Should be undefined result on wrong input', () => {
            expect(oStorage._getConfigParams('foo')).to.be.undefined;
            expect(oStorage._getConfigParams(null)).to.be.undefined;
            expect(oStorage._getConfigParams({})).to.be.undefined;
        });

        it('Should return params for an object that includes the property', () => {
            let aParams = ['t', 't2'];
            expect(oStorage._getConfigParams({params : aParams})).to.equal(aParams);
        });
    });

    describe('_getBestCandidate', () => {
        it('Without input shoud be no candidate', () => {
            expect(oStorage._getBestCandidate()).to.be.undefined;
        });

        it('In case of single input it should be the best candidate', () => {
            let aInput = ['t'];
            expect(oStorage._getBestCandidate(aInput)).to.equal('t');
        });

        it('In case of multiple input the best candidate should be the most frequent', () => {
            let aInput = ['t', 't', 't2', 't3', 't2', 't2'];
            expect(oStorage._getBestCandidate(aInput)).to.equal('t2');
        });

        it('Not defined values should be ignored', () => {
            let aInput = [undefined, undefined, null, null, null, 't'];
            expect(oStorage._getBestCandidate(aInput)).to.equal('t');
        });
    });
});
