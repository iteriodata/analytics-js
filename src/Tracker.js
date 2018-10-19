import _ from 'lodash';
import {Base64} from 'js-base64';
import cryptohat from 'cryptohat';
import Fingerprint2 from 'fingerprintjs2';

import config from './config';
import {
    OutQueue,
    Detector,
} from './components';

import {
    Clicks,
    FormInteractions,
    FormSubmit,
    Scroll,
    Visibility,
    UrlChange,
} from './eventTrackers';

import {
    User,
    Session,
    PageView,
} from './identities';


/**
 * Main class
 */
export class Tracker {
    /**
     * @constructor
     * @param {Object} _oRaven : instance of sentry client to track errors
     */
    constructor(_oRaven) {
        this.oRaven = _oRaven;
        /**
         * This object contains data from our cookies and browser information.
         * The properties are sent to the server with each tracking request.
         */
        try {
            this.oBrowserData = {};

            this.oUser = new User();
            this.oSession = new Session();
            this.oPageView = new PageView();
            this.oOutQueue = new OutQueue(this.oRaven);

            this.oScroll = new Scroll();

            this.oVisibility = new Visibility(
                () => this.trackPageView('visiblity'),
                (...args) => this.trackVisibility(...args)
            );

            new Clicks((...args) => this.trackClick(...args),
                config.contentSizeLimit, config.ignoredDomElements);

            new FormInteractions((...args) => this.trackFormInteraction(...args));

            new FormSubmit((...args) => this.trackFormSubmit(...args));

            new UrlChange((...args) => this.trackUrlChange(...args));
        } catch (e) {
            this.oRaven.captureException(e, {
                tags : {
                    sessionId : _.get(this.oSession, 'id', undefined),
                    userId    : _.get(this.oUser, 'id', undefined),
                    method    : 'constructor',
                },
            });
        }
    }

    /**
     * Initiate user and session ids
     */
    async init() {
        try {
            this.oPageView.init();
            this.oSession.init();
            await this.oUser.init();
            await this._initBrowserData();

            if (this.oSession.isNew) {
                if (config.sentryDebug) {
                    this.oRaven.captureMessage('New session', {
                        tags : {
                            sessionId : this.oSession.id,
                            userId    : this.oUser.id,
                        },
                        level : 'info',
                    });
                }

                this.trackSession();
                this.oSession.isNew = false;
            }
            if (this.oUser.isNew) {
                if (config.sentryDebug) {
                    this.oRaven.captureMessage('New user', {
                        tags : {
                            sessionId : this.oSession.id,
                            userId    : this.oUser.id,
                        },
                        level : 'info',
                    });
                }

                this.trackUserId();
                this.oUser.isNew = false;
            }
        } catch (e) {
            this.oRaven.captureException(e, {
                tags : {
                    sessionId : this.oSession.id,
                    userId    : this.oUser.id,
                    method    : 'init',
                },
            });
        }
    }

    /**
     * Initiates common fields for every request (resolution, url, referrer, etc.)
     */
    async _initBrowserData() {
        let sFingerprint = await new Promise((_fResolve) => {
            new Fingerprint2(config.oFingerprintOptions).get((_sResult) => _fResolve(_sResult));
        });

        if (_.isNil(this.oUser.id)) {
            this.oRaven.captureMessage('uid is nill', {
                level : 'error',
            });
        }

        this.oBrowserData = {
            pid : this.oPageView.id,
            pt  : this.oPageView.time,
            sid : this.oSession.id,
            st  : this.oSession.time,
            uid : this.oUser.id,
            ut  : this.oUser.time,
            fp  : sFingerprint,
            r   : document.referrer,
            la  : navigator.language,
            cs  : document.characterSet || document.charset,
            tz  : Detector.detectTimezone(),
            ds  : Detector.detectDocumentSize(),
            vs  : Detector.detectViewportSize(),
            ua  : navigator.userAgent,
        };
    }

    /**
     * Create cross domain pixels
     *
     * @param {object} _oUser
     * @private
     */
    _linkDomains(_oUser) {
        let regex = RegExp(document.domain + '$');
        let sQuery = 'u=' + Base64.encode(JSON.stringify(_oUser));

        let insertCrossDomainPixel = (sDomain) => {
            let oImg = document.createElement('img');
            oImg.style.display = 'none';
            oImg.setAttribute('height', 1);
            oImg.setAttribute('width', 1);
            oImg.setAttribute(
                'src', `https://${config.linkedSubDomain}.${sDomain}/i.gif?${sQuery}`
            );
            oImg.addEventListener('error', () => {
                this.oRaven.captureMessage('Pixel is not served', {
                    extra : {
                        src : oImg.src,
                    },
                    level : 'error',
                });
            }, false);
            document.body.appendChild(oImg);
        };

        if (this.aLinkedDomains && _.isArray(this.aLinkedDomains)) {
            _(this.aLinkedDomains)
                .filter((sDomain) => !regex.test(sDomain))
                .forEach(insertCrossDomainPixel);
        }
    }

    /**
     * Common function for sending our data via AJAX request
     *
     * @param {string} _sEventType
     * @param {Object} _oEventData
     */
    trackEvent(_sEventType, _oEventData = {}) {
        _oEventData = _.assign({
            t   : new Date().getTime(),
            et  : _sEventType,
            eid : cryptohat(53, 0),
            pp  : this.oPageView.incrementPart(),
            sp  : this.oSession.incrementPart(),
            url : document.URL,
        }, _oEventData);

        this.oOutQueue.sendEventPayload(_oEventData, this.oBrowserData);
    }

    /**
     * Track the creation of a new user id
     */
    trackUserId() {
        this.trackEvent('user', {});
    }

    /**
     * Track the beginning of a new session
     */
    trackSession() {
        this.trackEvent('session', {});
    }

    /**
     * Log that a user is still viewing a given page by sending a page ping.
     */
    trackPagePing() {
        this.trackEvent('page_ping', {});
    }

    /**
     * Log the link or click with the server
     *
     * @param {string} _sTargetUrl (optional)  : Only avaliable if clicked
     *                                           element is a link
     *
     * @param {string} _sElementName           : Dom element name (div, span...)
     *
     * @param {object} _oElementAttrs          : Clicked element attributes
     *
     * @param {string} _sElementContent        : InnerHTML of an element
     */
    trackClick(_sTargetUrl, _sElementName, _oElementAttrs, _sElementContent) {
        this.trackEvent('click', {
            turl : _sTargetUrl,
            ena  : _sElementName,
            eat  : _oElementAttrs,
            eco  : _sElementContent,
        });
    }

    /**
     * Log the form interaction with the server
     *
     * @param {string|bool} _sElementValue     : Dependes on input type
     *
     * @param {object} _oElementAttrs          : Input attributes
     *
     * @param {string} _sElementEvent          : Event type (focus, blur, change...)
     *
     * @param {object} _oFormAttrs (optional)  : Object will be only avaliable
     *                                           if input is located inside form
     */
    trackFormInteraction(_sElementValue, _oElementAttrs, _sElementEvent, _oFormAttrs) {
        this.trackEvent('form_interaction', {
            ev  : _sElementValue,
            eat : _oElementAttrs,
            ee  : _sElementEvent,
            fat : _oFormAttrs,
        });
    }

    /**
     * Log the form submit with the server
     *
     * @param {object} _oFormAttrs  : Form attributes
     *
     * @param {array} _aFormInputs  : All inputs inside a form with values
     *                                and attributes at a time of submit
     */
    trackFormSubmit(_oFormAttrs, _aFormInputs) {
        this.trackEvent('form_submit', {
            fat : _oFormAttrs,
            fi  : _aFormInputs,
        });
    }

    /**
     * Log page view change
     * @param {string} _sEventType : Event type (onload, visiblity, url_change ...)
     * @param {object} _oParams    : Any additional paramters
     */
    trackPageView(_sEventType, _oParams = {}) {
        this.oPageView.resetToNew();
        this.oBrowserData.pid = this.oPageView.id;
        this.oBrowserData.pt = this.oPageView.time;

        this.trackEvent('pageview', _.assign({
            dt : document.title,
            pe : _sEventType,
        }, _oParams));
    }

    /**
     * Log visibility change
     *
     * @param {number} _iVisibilityTimePreiod : Elapsed time period in milliseconds
     *                                          before user lost focus on the page
     */
    trackVisibility(_iVisibilityTimePreiod) {
        this.trackEvent('visibility', {
            vtp : _iVisibilityTimePreiod,
            myo : this.oScroll.maxYOffset(),
        });
    }

    /**
     * Log the url change
     *
     * @param {string} _sPreviousUrl
     * @param {string} _sNextUrl
     */
    trackUrlChange(_sPreviousUrl, _sNextUrl) {
        this.trackPageView('url_change', {
            purl : _sPreviousUrl,
            url  : _sNextUrl,
        });
    }

    /**
     * Set the application id and log the pageview
     *
     * @param {string} _sAppId         : Application identifier
     *
     * @param {array} _aLinkedDomains  : List of urls to request pixel
     */
    load(_sAppId, _aLinkedDomains = []) {
        if (_.isNil(_sAppId)) {
            this.oRaven.captureMessage(`Application Identity is ${_sAppId}`, {
                level : 'error',
            });
        }

        this.oBrowserData.aid = _sAppId;
        this.aLinkedDomains = _aLinkedDomains;

        this.oRaven.setUserContext({
            appId     : _sAppId,
            userId    : this.oUser.id,
            sessionId : this.oSession.id,
        });

        this._linkDomains(_.pick(this.oUser.json(), 'id', 'time'));

        this.trackPageView('onload');
    }

    /**
     * Associate a unique identifier with a user.
     *
     * @param {string} _sIdentity  : Identification of a user at a customer side
     */
    identify(_sIdentity) {
        if (_.isNil(_sIdentity)) {
            this.oRaven.captureMessage(`User Identity is ${_sIdentity}`, {
                level : 'error',
            });
        }

        this.trackEvent('identify', {
            i : _sIdentity,
        });
    }

    /**
     * Send a custom event
     *
     * @param {string} _sEventName
     * @param {Object} _oEventProperties
     */
    track(_sEventName, _oEventProperties) {
        this.trackEvent(_sEventName, _oEventProperties);
    }

    /**
     * Track a structured event happening on this page.  This is analogous to the
     * event tracking in Google Analytics.
     *
     * @param {string} _sCategory                : The name you supply for the group of objects
     *                                            you want to track (e.g. Button, Form,
     *                                            FormInput, Video)
     *
     * @param {string} _sAction                  : Type of interaction with the category (e.g.
     *                                            'Event', ''Submit', 'Play').  These are paired
     *                                            with each category.
     *
     * @param {string} _sLabel (optional)        : Used for identifying specific objects (e.g.
     *                                            'WP Header Signup Button')
     *
     * @param {number|string} _value (optional)  : An integer that you can use to provide
     *                                            numerical data about the user event
     */
    trackStructEvent(_sCategory, _sAction, _sLabel, _value) {
        this.trackEvent('struct_event', {
            c : _sCategory,
            a : _sAction,
            l : _sLabel,
            v : _value,
        });
    }

    /**
     * Prepare page to be closed by sending all collected and other
     * required data / events.
     * OutQueue is forced to send all collected events synchronously.
     */
    finish() {
        if (this.oVisibility) {
            this.oVisibility.triggerHidden();
        }

        if (this.oOutQueue) {
            this.oOutQueue.flushQueue(this.oBrowserData, false);
        }
    }
}
