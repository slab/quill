export function isIE(target = [10, 11]) {
  return document.documentMode != null;
}

export function isIOS() {
  return /iPhone|iPad/i.test(navigator.userAgent);
}

export function isMac() {
  return /Mac/i.test(navigator.platform);
}
