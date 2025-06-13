/**
 * Browser detection utilities for Quill
 */

/**
 * Clear the browser detection cache - for testing purposes only
 * @internal
 */
export function _clearBrowserDetectionCache(): void {
  isSafariOrWebKitCache = undefined;
}

// Cache results to avoid repeated calculations during typing
let isSafariOrWebKitCache: boolean | undefined;

/**
 * Detects if the browser is Safari or WebKit-based on iOS/iPadOS
 * This is used to handle Safari-specific bugs with composition events
 */
export function isSafariOrWebKit(): boolean {
  // Return cached result if available
  if (isSafariOrWebKitCache !== undefined) {
    return isSafariOrWebKitCache;
  }

  const userAgent = navigator.userAgent.toLowerCase();

  // Check for Safari on macOS (not Chrome)
  const isSafari =
    userAgent.includes('safari') && !userAgent.includes('chrome');

  // Check for iOS/iPadOS (all browsers on iOS use WebKit)
  const isIOS =
    /iphone|ipad|ipod/.test(userAgent) ||
    (userAgent.includes('mac') && navigator.maxTouchPoints > 1);

  // Cache and return result
  isSafariOrWebKitCache = isSafari || isIOS;
  return isSafariOrWebKitCache;
}

