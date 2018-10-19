export const config = {
    'Cross domain cookies' : (client) => {
        const DOMAIN1 = 'https://shopfans.io';
        const DOMAIN2 = 'https://do.shopfans.com';
        const INTERMEDIATE_FAKE_DOMAIN = 'https://www.facebook.com';
        const KEY = 'iterio_u';

        let value1 = undefined;

        client
            .url(DOMAIN1)
            .getCookie(KEY, (cookie) => {
                value1 = cookie.value;
                client.assert.notEqual(cookie.value, undefined, `${KEY} = ${cookie.value} key should be defined for ${DOMAIN1}`);
            })
            .url(INTERMEDIATE_FAKE_DOMAIN)
            .url(DOMAIN2)
            .getCookie(KEY, (cookie) => {
                client.assert.notEqual(cookie.value, undefined, `${KEY} = ${cookie.value} key should be defined for ${DOMAIN2}`);
                client.assert.equal(value1.replace(/"/g, ''), cookie.value.replace(/"/g, ''),
                    `${KEY} keys should be the same for different domain cookie`);
            })
            .end();
    }
};
