import {describe, it} from 'mocha';
import {expect} from 'chai';

import {WebSql} from './WebSql';


describe('WebSql', () => {
    it('Should set and then return stored value', async () => {
        if (!WebSql.isAvaliable()) return;

        let oWebSql = new WebSql();
        let sKey = 'test';
        let sValue = 'value';

        await oWebSql.set(sKey, sValue);

        let sResult = await oWebSql.get(sKey);
        expect(sResult).to.equal(sValue);
    });

    it('Should remove value', async () => {
        if (!WebSql.isAvaliable()) return;

        let oWebSql = new WebSql();
        let sKey = 'test';
        let sValue = 'value';

        await oWebSql.set(sKey, sValue);

        let sResult = await oWebSql.get(sKey);
        expect(sResult).to.equal(sValue);
        await oWebSql.remove(sKey);
        sResult = await oWebSql.get(sKey);
        expect(sResult).to.be.null;
    });

    it('Should return null on not existing key', async () => {
        if (!WebSql.isAvaliable()) return;

        let oWebSql = new WebSql();
        expect(await oWebSql.get('foo')).to.be.null;
    });

    it('Should verify avaliability', () => {
        expect(typeof(window.openDatabase) === 'function')
            .to.equal(WebSql.isAvaliable());
    });
});
