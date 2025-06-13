import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { isSafariOrWebKit, _clearBrowserDetectionCache } from '../../../../src/core/utils/browser.js';

describe('Browser Detection', () => {
  let originalUserAgent: PropertyDescriptor | undefined;
  let originalVendor: PropertyDescriptor | undefined;
  let originalPlatform: PropertyDescriptor | undefined;
  let originalMaxTouchPoints: PropertyDescriptor | undefined;

  beforeEach(() => {
    // Clear the cache before each test
    _clearBrowserDetectionCache();
    
    originalUserAgent = Object.getOwnPropertyDescriptor(navigator, 'userAgent');
    originalVendor = Object.getOwnPropertyDescriptor(navigator, 'vendor');
    originalPlatform = Object.getOwnPropertyDescriptor(navigator, 'platform');
    originalMaxTouchPoints = Object.getOwnPropertyDescriptor(
      navigator,
      'maxTouchPoints',
    );
  });

  afterEach(() => {
    if (originalUserAgent) {
      Object.defineProperty(navigator, 'userAgent', originalUserAgent);
    }
    if (originalVendor) {
      Object.defineProperty(navigator, 'vendor', originalVendor);
    }
    if (originalPlatform) {
      Object.defineProperty(navigator, 'platform', originalPlatform);
    }
    if (originalMaxTouchPoints) {
      Object.defineProperty(
        navigator,
        'maxTouchPoints',
        originalMaxTouchPoints,
      );
    }
  });

  const mockNavigator = (
    userAgent: string,
    vendor = '',
    platform = 'MacIntel',
    maxTouchPoints = 0,
  ) => {
    Object.defineProperty(navigator, 'userAgent', {
      value: userAgent,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, 'vendor', {
      value: vendor,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, 'platform', {
      value: platform,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: maxTouchPoints,
      writable: true,
      configurable: true,
    });
  };

  describe('isSafariOrWebKit', () => {
    it('detects Safari on macOS', () => {
      mockNavigator(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
        'Apple Computer, Inc.',
      );
      expect(isSafariOrWebKit()).toBe(true);
    });

    it('detects Safari on iOS', () => {
      mockNavigator(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
        'Apple Computer, Inc.',
        'iPhone',
      );
      expect(isSafariOrWebKit()).toBe(true);
    });

    it('detects Safari on iPad', () => {
      mockNavigator(
        'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
        'Apple Computer, Inc.',
        'iPad',
      );
      expect(isSafariOrWebKit()).toBe(true);
    });

    it('detects iPad with desktop mode (iPadOS 13+)', () => {
      mockNavigator(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
        'Apple Computer, Inc.',
        'MacIntel',
        5, // iPad has multiple touch points
      );
      expect(isSafariOrWebKit()).toBe(true);
    });

    it('does not detect Chrome on macOS', () => {
      mockNavigator(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Google Inc.',
      );
      expect(isSafariOrWebKit()).toBe(false);
    });

    it('does not detect Firefox', () => {
      mockNavigator(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15) Gecko/20100101 Firefox/119.0',
        '',
      );
      expect(isSafariOrWebKit()).toBe(false);
    });

    it('does not detect Chrome on Android', () => {
      mockNavigator(
        'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
        'Google Inc.',
        'Linux armv8l',
      );
      expect(isSafariOrWebKit()).toBe(false);
    });

    it('returns consistent results when called multiple times', () => {
      mockNavigator(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
        'Apple Computer, Inc.',
      );
      const firstCall = isSafariOrWebKit();
      mockNavigator(
        'different user agent',
        'different vendor',
        'different platform',
        1,
      );
      const secondCall = isSafariOrWebKit();
      mockNavigator(
        'another user agent',
        'another vendor',
        'another platform',
        2,
      );
      const thirdCall = isSafariOrWebKit();

      expect(firstCall).toBe(true);
      expect(secondCall).toBe(true);
      expect(thirdCall).toBe(true);
    });
  });
});
