const delay = 100; // default delay
const el = document.documentElement;

// Manage event queue
const stack = [];

/**
 *
 */
function callback() {
    for (let func of stack) func();
}

/**
 * Naive approach for compatibility
 */
function naive() {
    let last = document.getElementsByTagName('*');
    let lastLen = last.length;
    setTimeout(function check() {
        // get current state of the document
        const current = document.getElementsByTagName('*');
        const len = current.length;

        // if the length is different
        // it's fairly obvious
        if (len !== lastLen) {
            // just make sure the loop finishes early
            last = [];
        }

        // go check every element in order
        for (let i = 0; i < len; i++) {
            if (current[i] !== last[i]) {
                callback();
                last = current;
                lastLen = len;
                break;
            }
        }

        // over, and over, and over again
        setTimeout(check, delay);
    }, delay);
}

/**
 *
 */
function newStandards() {
    const MutationObserver = window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver;

    if (MutationObserver) {
        const obs = new MutationObserver((mutations) => {
            if (mutations[0].addedNodes.length ||
              mutations[0].removedNodes.length
            ) {
                callback();
            }
        });
        // have the observer observe foo for changes in children
        obs.observe(el, {childList : true, subtree : true});
    } else {
        el.addEventListener('DOMNodeInserted', callback, false);
        el.addEventListener('DOMNodeRemoved', callback, false);
    }

    const dummy = document.createElement('div');
    el.appendChild(dummy);
    el.removeChild(dummy);
}

// callback for the tests
if (window.addEventListener) {
    if (document.readyState !== 'complete') {
        window.addEventListener('load', newStandards, false);
    } else {
        newStandards();
    }
} else if (document.onpropertychange) { // for IE 5.5+
    document.onpropertychange = callback;
} else { // fallback
    naive();
}

/**
 * Public interface
 *
 * @param {Function} fn
 */
export const onDomChange = (fn) => {
    stack.push(fn);
};

