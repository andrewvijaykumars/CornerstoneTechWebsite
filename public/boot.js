(function (d) {
  var h = d.documentElement;
  var c = h.classList;
  var rm = false;
  try { rm = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  c.add('js');
  if (rm) c.add('rm');
  try {
    var save = navigator.connection && navigator.connection.saveData;
    if (!rm && !save && location.pathname === '/' && !sessionStorage.getItem('cs-seen')) c.add('preload');
  } catch (e) {}
  // If the main bundle never boots, reveal everything rather than leaving a blank page.
  setTimeout(function () {
    if (!c.contains('ready')) {
      c.add('failsafe');
      c.remove('preload');
    }
  }, 6000);
})(document);
