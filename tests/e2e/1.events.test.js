import _ from 'lodash';
import {Base64} from 'js-base64';


function commonEventTest (client, _oEvent) {
    client.assert.equal(typeof _oEvent.t, 'number', `${_oEvent.et}: t`);
    client.assert.equal(typeof _oEvent.eid, 'number', `${_oEvent.et}: eid`);
    client.assert.equal(typeof _oEvent.pp, 'number', `${_oEvent.et}: pp`);
    client.assert.equal(typeof _oEvent.sp, 'number', `${_oEvent.et}: sp`);
    client.assert.equal(typeof _oEvent.url, 'string', `${_oEvent.et}: url`);
}

function browserDataTest (client, _oData) {
    client.assert.equal(_oData.bd.aid, 9, 'aid');
    client.assert.equal(typeof _oData.bd.pid, 'number', 'pid');
    client.assert.equal(typeof _oData.bd.pt, 'number', 'pt');
    client.assert.equal(typeof _oData.bd.sid, 'number', 'sid');
    client.assert.equal(typeof _oData.bd.st, 'number', 'st');
    client.assert.equal(typeof _oData.bd.uid, 'number', 'uid');
    client.assert.equal(typeof _oData.bd.ut, 'number', 'ut');
    client.assert.equal(typeof _oData.bd.tz, 'number', 'tz');

    client.assert.equal(typeof _oData.bd.fp, 'string', 'fp');
    client.assert.equal(typeof _oData.bd.r, 'string', 'r');
    client.assert.equal(typeof _oData.bd.la, 'string', 'la');
    client.assert.equal(typeof _oData.bd.cs, 'string', 'cs');
    client.assert.equal(typeof _oData.bd.ds, 'string', 'ds');
    client.assert.equal(typeof _oData.bd.vs, 'string', 'vs');
    client.assert.equal(typeof _oData.bd.ua, 'string', 'ua');
}

export const config = {
    'On page events tracking' : (client) => {
        client
            .url('http://localhost:3000')
            .useXpath()
            .waitForFirstXHR(
                '\/events',
                10000,
                () => {},
                (xhr) => {
                    let rData = JSON.parse(Base64.decode(xhr.requestData));
                    client.assert.equal(xhr.responseData, '200: OK');

                    browserDataTest(client, rData);

                    _.forEach(rData.e, (_oEvent) => {
                        commonEventTest(client, _oEvent);

                        if (_oEvent.et === 'pageview') {
                            client.assert.equal(_oEvent.dt, 'Tracker demo', `${_oEvent.et}: dt`);
                            client.assert.equal(_oEvent.pe, 'onload', `${_oEvent.pe}: pe`);
                        }
                    });
                }
            )
            .waitForFirstXHR(
                '\/events',
                10000,
                () => {
                    client.click('//a[text()="Page2"]');
                    client.setValue('//input[@id="name"]', 'test');
                },
                (xhr) => {
                    let rData = JSON.parse(Base64.decode(xhr.requestData));
                    let oEvents = {};
                    client.assert.equal(xhr.responseData, '200: OK');
                    
                    browserDataTest(client, rData);

                    let bClickExist = false;
                    
                    _.forEach(rData.e, (_oEvent) => {
                        commonEventTest(client, _oEvent);

                        oEvents[_oEvent.et] = true;

                        if (_oEvent.et === 'form_interaction') {
                            client.assert.equal(_oEvent.ev, '', `${_oEvent.et}: ev`);
                            client.assert.equal(_oEvent.ee, 'focus', `${_oEvent.et}: ee`);
                            client.assert.equal(
                                JSON.stringify(_oEvent.eat),
                                '{"id":"name","type":"text","size":"40"}',
                                `${_oEvent.et}: eat`
                            );
                        }

                        if (_oEvent.et === 'click') {
                            bClickExist = true;
                            client.assert.equal(_oEvent.eco, 'Page2', `${_oEvent.et}: eco`);
                            client.assert.equal(_oEvent.ena, 'a', `${_oEvent.et}: ena`);
                            client.assert.equal(_oEvent.turl, 'http://localhost:3000/page2', `${_oEvent.et}: turl`);
                            client.assert.equal(
                                JSON.stringify(_oEvent.eat),
                                '{"aria-current":"true","href":"/page2","class":["active"]}',
                                `${_oEvent.et}: eat`
                            );
                        }

                        if (_oEvent.et === 'identify') {
                            client.assert.equal(_oEvent.i, 1337, `${_oEvent.et}: i`);
                        }

                        if (_oEvent.et === 'pageview') {
                            client.assert.equal(_oEvent.dt, 'Tracker demo', `${_oEvent.et}: dt`);
                            client.assert.equal(_oEvent.pe, 'url_change', `${_oEvent.pe}: pe`);
                            client.assert.equal(_oEvent.url, 'http://localhost:3000/page2', `${_oEvent.et}: url`);
                            client.assert.equal(_oEvent.purl, 'http://localhost:3000/', `${_oEvent.et}: purl`);
                        }
                    });

                    client.assert.equal(oEvents.form_interaction, true, 'form_interaction is triggered');
                    client.assert.equal(oEvents.click, true, 'click is triggered');
                    client.assert.equal(oEvents.identify, true, 'identify is triggered');
                    client.assert.equal(oEvents.pageview, true, 'pageview is triggered');

                    client.assert.equal(bClickExist, true, 'Page link should be clicked');
                }
            )
            .waitForFirstXHR(
                '\/events',
                10000,
                () => client.setValue('//input[@id="password"]', 'test2'),
                (xhr) => {
                    let oEvents = {};
                    let rData = JSON.parse(Base64.decode(xhr.requestData));
                    client.assert.equal(xhr.responseData, '200: OK');
                    
                    browserDataTest(client, rData);
                    
                    _.forEach(rData.e, (_oEvent) => {
                        commonEventTest(client, _oEvent);

                        oEvents[_oEvent.et] = true;

                        if (_oEvent.et === 'form_interaction') {
                            client.assert.equal(_oEvent.ev, 'test', `${_oEvent.et}: ev`);
                            client.assert.equal(_oEvent.ee, 'blur', `${_oEvent.et}: ee`);
                            client.assert.equal(
                                JSON.stringify(_oEvent.eat),
                                '{"id":"name","type":"text","size":"40"}',
                                `${_oEvent.et}: eat`
                            );
                        }
                    });

                    client.assert.equal(oEvents.form_interaction, true, 'form_interaction is triggered');
                }
            )
            .waitForFirstXHR(
                '\/events',
                10000,
                () => client.click('//input[@id="checkbox"]'),
                (xhr) => {
                    let oEvents = {};
                    let rData = JSON.parse(Base64.decode(xhr.requestData));
                    client.assert.equal(xhr.responseData, '200: OK');
                    
                    browserDataTest(client, rData);
                    
                    _.forEach(rData.e, (_oEvent) => {
                        commonEventTest(client, _oEvent);

                        oEvents[_oEvent.et] = true;

                        if (_oEvent.et === 'form_interaction') {
                            client.assert.equal(_oEvent.ev, true, `${_oEvent.et}: ev`);
                            client.assert.equal(_oEvent.ee, 'change', `${_oEvent.et}: ee`);
                            client.assert.equal(
                                JSON.stringify(_oEvent.fat),
                                '{"name":"test"}',
                                `${_oEvent.et}: fat`
                            );
                            client.assert.equal(
                                JSON.stringify(_oEvent.eat),
                                '{"id":"checkbox","type":"checkbox"}',
                                `${_oEvent.et}: eat`
                            );
                        }
                    });

                    client.assert.equal(oEvents.form_interaction, true, 'form_interaction is triggered');
                }
            )
            .end();
    }
};

