/* eslint-disable spaced-comment */
/*!
	devtools-detect
	Detect if DevTools is open
	https://github.com/sindresorhus/devtools-detect
	by Sindre Sorhus
	MIT License
*/
function getDevTools() {
  'use strict';
  var devtools = {
    open: false
  };
  var threshold = 160;
  Object.defineProperty(devtools, 'open', {
    get() {
      // Starcounter DevTools
      if (
        typeof starcounterDebugAidListener !== 'undefined' &&
        starcounterDebugAidListener.updateListeners &&
        starcounterDebugAidListener.updateListeners.length > 0
      ) {
        return true;
      }
      // Browser DevTools
      var widthThreshold = window.outerWidth - window.innerWidth > threshold;
      var heightThreshold = window.outerHeight - window.innerHeight > threshold;
      var orientation = widthThreshold ? 'vertical' : 'horizontal';

      if (
        !(heightThreshold && widthThreshold) &&
        ((window.Firebug &&
          window.Firebug.chrome &&
          window.Firebug.chrome.isInitialized) ||
          widthThreshold ||
          heightThreshold)
      ) {
        return true;
      } else {
        return false;
      }
    }
  });

  return devtools;
}
