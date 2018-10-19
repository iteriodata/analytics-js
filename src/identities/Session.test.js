import Cookies from 'js-cookie';
import {Base64} from 'js-base64';

import {describe, it} from 'mocha';
import {expect} from 'chai';

import config from './../config';
import {Session} from './Session';


describe('Session', () => {
    it('Should properly be initiated', () => {
        Cookies.set(config.sSessionCookieKey, undefined);

        let oSession = new Session();

        oSession.init();
        oSession.incrementPart();

        let oCookies = Cookies.get(config.sSessionCookieKey);

        expect(oCookies).to.be.not.undefined;

        let oData = JSON.parse(Base64.decode(oCookies));

        expect(oData).to.be.not.undefined;
        expect(oData.id).to.be.a('number');
        expect(oData.time).to.be.a('number');
        expect(oData.part).to.be.a('number');
    });

    it('Should properly be initiated (2 case)', () => {
        let oSession = new Session();

        oSession.init();
        oSession.incrementPart();

        let oCookies = Cookies.get(config.sSessionCookieKey);

        expect(oCookies).to.be.not.undefined;

        let oData = JSON.parse(Base64.decode(oCookies));

        expect(oData).to.be.not.undefined;
        expect(oData.id).to.be.a('number');
        expect(oData.time).to.be.a('number');
        expect(oData.part).to.be.a('number');
    });
});
