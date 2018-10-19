import Raven from 'raven-js';
import adblockDetect from 'adblock-detect';

import {Tracker} from './Tracker';
import {InQueue} from './components';

import config from './config';
import {Helpers} from './common';

// Isolate Raven from global scope
let oRaven = new Raven.Client();

// https://github.com/getsentry/raven-js/issues/519
// refer to link above for a non conflict wrapping
oRaven.config(config.ravenUrl, {
    captureUnhandledRejections : false,
    collectWindowErrors        : false,
    autoBreadcrumbs            : {
        console : false,
    },
}).install();


oRaven.setTagsContext({
    domain      : Helpers.domain(),
    environment : process.env.NODE_ENV,
});


adblockDetect((adblockDetected) => {
    oRaven.setTagsContext({
        adblock : adblockDetected,
    });

    if (adblockDetected && config.sentryDebug) {
        oRaven.captureMessage('Adblock is active', {level : 'info'});
    }
});

try {
    let oTracker = new Tracker(oRaven);

    oTracker.init().then(() => {
        window.addEventListener('beforeunload', () => oTracker.finish(), false);
        window.iterio.q = new InQueue(oTracker);
    });
} catch (e) {
    oRaven.captureException(e);
}
