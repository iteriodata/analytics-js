import {describe, it} from 'mocha';
import {expect} from 'chai';

import {Storage} from './../persistentStorage';
import config from './../config';
import {User} from './User';


describe('User', () => {
    it('Should properly be initiated', async () => {
        let oUser = new User();
        let oStorage = new Storage();

        await oStorage.set(config.sUserCookieKey, undefined);
        await oUser.init();
        await oUser.incrementPart();

        let oStorageData = await oStorage.get(config.sUserCookieKey);

        expect(oStorageData).to.be.not.undefined;

        let oData = JSON.parse(oStorageData);

        expect(oData).to.be.not.undefined;
        expect(oData.id).to.be.a('number');
        expect(oData.time).to.be.a('number');
    });

    it('Should properly be initiated (2 case)', async () => {
        let oUser = new User();
        let oStorage = new Storage();

        await oUser.init();
        await oUser.incrementPart();

        let oStorageData = await oStorage.get(config.sUserCookieKey);

        expect(oStorageData).to.be.not.undefined;

        let oData = JSON.parse(oStorageData);

        expect(oData).to.be.not.undefined;
        expect(oData.id).to.be.a('number');
        expect(oData.time).to.be.a('number');
    });
});
