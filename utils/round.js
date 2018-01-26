// https://github.com/sindresorhus/round-to/issues/7#issuecomment-287640103
// so it handles all numbers always
export default function round(n, precision) {
  if (precision < 0) {
    const length = String(n).split('.')[0].length;
    return parseFloat(n.toLocaleString('en', { maximumSignificantDigits: length + precision, useGrouping: false }));
  }
  return parseFloat(n.toLocaleString('en', { maximumFractionDigits: precision, useGrouping: false }));
}