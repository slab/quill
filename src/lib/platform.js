export function isIE(target = [10, 11]) {
  if (!Array.isArray(target)) {
    target = [target];
  }
  return target.indexOf(document.documentMode) > -1;
}

export function isIOS() {
  return /iPhone|iPad/i.test(navigator.userAgent);
}

export function isMac() {
  return /Mac/i.test(navigator.platform);
}
