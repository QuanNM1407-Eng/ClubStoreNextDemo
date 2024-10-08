export function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    var context = this,
      args = arguments;
    clearTimeout(timeout);
    if (immediate && !timeout) func.apply(context, args);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
  };
}
