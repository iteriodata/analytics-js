const config = {

    /**
     * This number identifies the schema version to indicate which model
     * the server should use to parse event payloads.
     * Commit hash from github
     *
     * @type {string}
     */
    fSchemaVersion : process.env.COMMIT_HASH,


    /**
     * Endpoint we POST event data to
     *
     * @type {string}
     */
    sEndpoint : 'https://api.iteriodata.com/events',


    /**
     * Key for our cross-domain cookie.  The value of this cookie contains
     * the identity token.
     *
     * @type {string}
     */
    sIdentityTokenCookieKey : 'iterio_it',


    /**
     * Key for our session cookie.  The value of this cookie contains
     * the session id.
     *
     * @type {string}
     */
    sUserCookieKey    : 'iterio_u',
    sSessionCookieKey : 'iterio_s',


    /**
     * Options object used as argument for Fingerprint2 constructor function.
     *
     * https://github.com/Valve/fingerprintjs2
     *
     * @type {{excludeWebGL: boolean}}
     */
    oFingerprintOptions : {
        excludeWebGL : true,
    },


    /**
     * Delay next request to server for events by click
     */
    delayNextRequest : 5000,

    /**
     * Size limit for element attribute fields in characters
     */
    contentSizeLimit : 256,

    /**
     * Array of dome elements that should be ignored for click event
     */
    ignoredDomElements : ['html', 'head', 'body'],

    linkedSubDomain : 'i',

    keyStr : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

    ravenUrl : 'https://9c0c718d36c4452a8dfb8cb26acf5efd@sentry.io/1209876',

    /**
     * Enable flag, if you need such informational events such as '
     * New session', 'New User', and 'Adblock is Active'.
     */
    sentryDebug : false,
};


export default config;
