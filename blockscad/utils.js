/* BlocksCAD utilities for languages and dialogs */

'use strict';

var BSUtils = BSUtils || {};

/**
 * Lookup for names of supported languages.  Keys should be in ISO 639 format.
 */
BSUtils.LANGUAGE_NAME = {
  'en': 'English',
  'es': 'Español'
};
// BSUtils.LANGUAGE_NAME = {
//   'ar': 'العربية',
//   'be-tarask': 'Taraškievica',
//   'br': 'Brezhoneg',
//   'ca': 'Català',
//   'cs': 'Česky',
//   'da': 'Dansk',
//   'de': 'Deutsch',
//   'el': 'Ελληνικά',
//   'en': 'English',
//   'es': 'Español',
//   'fa': 'فارسی',
//   'fr': 'Français',
//   'he': 'עברית',
//   'hrx': 'Hunsrik',
//   'hu': 'Magyar',
//   'ia': 'Interlingua',
//   'is': 'Íslenska',
//   'it': 'Italiano',
//   'ja': '日本語',
//   'ko': '한국어',
//   'mk': 'Македонски',
//   'ms': 'Bahasa Melayu',
//   'nb': 'Norsk Bokmål',
//   'nl': 'Nederlands, Vlaams',
//   'oc': 'Lenga d\'òc',
//   'pl': 'Polski',
//   'pms': 'Piemontèis',
//   'pt-br': 'Português Brasileiro',
//   'ro': 'Română',
//   'ru': 'Русский',
//   'sc': 'Sardu',
//   'sk': 'Slovenčina',
//   'sr': 'Српски',
//   'sv': 'Svenska',
//   'th': 'ภาษาไทย',
//   'tlh': 'tlhIngan Hol',
//   'tr': 'Türkçe',
//   'uk': 'Українська',
//   'vi': 'Tiếng Việt',
//   'zh-hans': '簡體中文',
//   'zh-hant': '正體中文'
// };
/**
 * List of RTL languages.
 */
BSUtils.LANGUAGE_RTL = ['ar', 'fa', 'he'];




/**
 * List of languages supported by this app.  Values should be in ISO 639 format.
 * @type !Array.<string>=
 */
BSUtils.LANGUAGES = undefined;

/**
 * Extracts a parameter from the URL.
 * If the parameter is absent default_value is returned.
 * @param {string} name The name of the parameter.
 * @param {string} defaultValue Value to return if paramater not found.
 * @return {string} The parameter value or the default value if not found.
 */
BSUtils.getStringParamFromUrl = function(name, defaultValue) {
  var val =
      window.location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
  return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
};

/**
 * Get the language of this user from the URL.
 * @return {string} User's language.
 */
BSUtils.getLang = function() {
  var lang = BSUtils.getStringParamFromUrl('lang', '');
  if (BSUtils.LANGUAGE_NAME[lang] === undefined) {
    // Default to English.
    lang = 'en';
  }
  return lang;
};

/**
 * User's language (e.g. "en").
 * @type string=
 */
BSUtils.LANG = BSUtils.getLang();

/**
 * Is the current language (BSUtils.LANG) an RTL language?
 * @return {boolean} True if RTL, false if LTR.
 */
BSUtils.isRtl = function() {
  return BSUtils.LANGUAGE_RTL.indexOf(BSUtils.LANG) != -1;
};

/**
 * Common startup tasks for all apps.
 */
BSUtils.init = function() {

  // Set the HTML's language and direction.
  // document.dir fails in Mozilla, use document.body.parentNode.dir instead.
  // https://bugzilla.mozilla.org/show_bug.cgi?id=151407
  var rtl = BSUtils.isRtl();
  document.head.parentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
  document.head.parentElement.setAttribute('lang', BSUtils.LANG);

  // Sort languages alphabetically.
  var languages = [];
  for (var i = 0; i < BSUtils.LANGUAGES.length; i++) {
    var lang = BSUtils.LANGUAGES[i];
    languages.push([BSUtils.LANGUAGE_NAME[lang], lang]);
  }
  var comp = function(a, b) {
    // Sort based on first argument ('English', 'Русский', '简体字', etc).
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    return 0;
  };
  languages.sort(comp);
  // Populate the language selection menu.
  var languageMenu = document.getElementById('languageMenu');
  languageMenu.options.length = 0;
  for (var i = 0; i < languages.length; i++) {
    var tuple = languages[i];
    var lang = tuple[tuple.length - 1];
    var option = new Option(tuple[0], lang);
    if (lang == BSUtils.LANG) {
      option.selected = true;
    }
    languageMenu.options.add(option);
  }
  languageMenu.addEventListener('change', BSUtils.changeLanguage, true);



  if (document.getElementById('codeButton')) {
    BSUtils.bindClick('codeButton', BSUtils.showCode);
  }

  // Fixes viewport for small screens.
  var viewport = document.querySelector('meta[name="viewport"]');
  if (viewport && screen.availWidth < 725) {
    viewport.setAttribute('content',
        'width=725, initial-scale=.35, user-scalable=no');
  }
};

/**
 * Initialize Blockly for a readonly iframe.  Called on page load.
 * XML argument may be generated from the console with:
 * encodeURIComponent(Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace)).slice(5, -6))
 */
BSUtils.initReadonly = function() {
  Blockly.inject(document.getElementById('blockly'),
      {path: './',
       readOnly: true,
       rtl: BSUtils.isRtl(),
       scrollbars: false});

  // Add the blocks.
  var xml = BSUtils.getStringParamFromUrl('xml', '');
  xml = Blockly.Xml.textToDom('<xml>' + xml + '</xml>');
  Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
};

/**
 * Load blocks saved on App Engine Storage or in session/local storage.
 * @param {string} defaultXml Text representation of default blocks.
 */
BSUtils.loadBlocks = function(defaultXml) {
  try {
    var loadOnce = window.sessionStorage.loadOnceBlocks;
  } catch(e) {
    // Firefox sometimes throws a SecurityError when accessing sessionStorage.
    // Restarting Firefox fixes this, so it looks like a bug.
    var loadOnce = null;
  }
  if ('BlocklyStorage' in window && window.location.hash.length > 1) {
    // An href with #key trigers an AJAX call to retrieve saved blocks.
    BlocklyStorage.retrieveXml(window.location.hash.substring(1));
  } else if (loadOnce) {
    // Language switching stores the blocks during the reload.
    delete window.sessionStorage.loadOnceBlocks;
    var xml = Blockly.Xml.textToDom(loadOnce);
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
  } else if (defaultXml) {
    // Load the editor with default starting blocks.
    var xml = Blockly.Xml.textToDom(defaultXml);
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
  } else if ('BlocklyStorage' in window) {
    // Restore saved blocks in a separate thread so that subsequent
    // initialization is not affected from a failed load.
    window.setTimeout(BlocklyStorage.restoreBlocks, 0);
  }
};

/**
 * Save the blocks and reload with a different language.
 */
BSUtils.changeLanguage = function() {
  // Store the blocks for the duration of the reload.
  // This should be skipped for the index page, which has no blocks and does
  // not load Blockly.
  // MSIE 11 does not support sessionStorage on file:// URLs.
  if (typeof Blockly != 'undefined' && window.sessionStorage) {
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    var text = Blockly.Xml.domToText(xml);
    window.sessionStorage.loadOnceBlocks = text;
  }

  var languageMenu = document.getElementById('languageMenu');
  var newLang = encodeURIComponent(
      languageMenu.options[languageMenu.selectedIndex].value);
  var search = window.location.search;
  if (search.length <= 1) {
    search = '?lang=' + newLang;
  } else if (search.match(/[?&]lang=[^&]*/)) {
    search = search.replace(/([?&]lang=)[^&]*/, '$1' + newLang);
  } else {
    search = search.replace(/\?/, '?lang=' + newLang + '&');
  }

  window.location = window.location.protocol + '//' +
      window.location.host + window.location.pathname + search;
};

/**
 * Is the dialog currently onscreen?
 * @private
 */
BSUtils.isDialogVisible_ = false;

/**
 * A closing dialog should animate towards this element.
 * @type Element
 * @private
 */
BSUtils.dialogOrigin_ = null;

/**
 * A function to call when a dialog closes.
 * @type Function
 * @private
 */
BSUtils.dialogDispose_ = null;

/**
 * Show the dialog pop-up.
 * @param {!Element} content DOM element to display in the dialog.
 * @param {Element} origin Animate the dialog opening/closing from/to this
 *     DOM element.  If null, don't show any animations for opening or closing.
 * @param {boolean} animate Animate the dialog opening (if origin not null).
 * @param {boolean} modal If true, grey out background and prevent interaction.
 * @param {!Object} style A dictionary of style rules for the dialog.
 * @param {Function} disposeFunc An optional function to call when the dialog
 *     closes.  Normally used for unhooking events.
 */
BSUtils.showDialog = function(content, origin, animate, modal, style,
                                  disposeFunc) {
  if (BSUtils.isDialogVisible_) {
    BSUtils.hideDialog(false);
  }
  BSUtils.isDialogVisible_ = true;
  BSUtils.dialogOrigin_ = origin;
  BSUtils.dialogDispose_ = disposeFunc;
  var dialog = document.getElementById('dialog');
  var shadow = document.getElementById('dialogShadow');
  var border = document.getElementById('dialogBorder');

  // Copy all the specified styles to the dialog.
  for (var name in style) {
    dialog.style[name] = style[name];
  }
  if (modal) {
    shadow.style.visibility = 'visible';
    shadow.style.opacity = 0.3;
    var header = document.createElement('div');
    header.id = 'dialogHeader';
    dialog.appendChild(header);
    BSUtils.dialogMouseDownWrapper_ =
        Blockly.bindEvent_(header, 'mousedown', null,
                           BSUtils.dialogMouseDown_);
  }
  dialog.appendChild(content);
  content.className = content.className.replace('dialogHiddenContent', '');

  function endResult() {
    // Check that the dialog wasn't closed during opening.
    if (BSUtils.isDialogVisible_) {
      dialog.style.visibility = 'visible';
      dialog.style.zIndex = 1;
      border.style.visibility = 'hidden';
    }
  }
  if (animate && origin) {
    BSUtils.matchBorder_(origin, false, 0.2);
    BSUtils.matchBorder_(dialog, true, 0.8);
    // In 175ms show the dialog and hide the animated border.
    window.setTimeout(endResult, 175);
  } else {
    // No animation.  Just set the final state.
    endResult();
  }
};

/**
 * Horizontal start coordinate of dialog drag.
 */
BSUtils.dialogStartX_ = 0;

/**
 * Vertical start coordinate of dialog drag.
 */
BSUtils.dialogStartY_ = 0;

/**
 * Handle start of drag of dialog.
 * @param {!Event} e Mouse down event.
 * @private
 */
BSUtils.dialogMouseDown_ = function(e) {
  BSUtils.dialogUnbindDragEvents_();
  if (Blockly.isRightButton(e)) {
    // Right-click.
    return;
  }
  // Left click (or middle click).
  // Record the starting offset between the current location and the mouse.
  var dialog = document.getElementById('dialog');
  BSUtils.dialogStartX_ = dialog.offsetLeft - e.clientX;
  BSUtils.dialogStartY_ = dialog.offsetTop - e.clientY;

  BSUtils.dialogMouseUpWrapper_ = Blockly.bindEvent_(document,
      'mouseup', null, BSUtils.dialogUnbindDragEvents_);
  BSUtils.dialogMouseMoveWrapper_ = Blockly.bindEvent_(document,
      'mousemove', null, BSUtils.dialogMouseMove_);
  // This event has been handled.  No need to bubble up to the document.
  e.stopPropagation();
};

/**
 * Drag the dialog to follow the mouse.
 * @param {!Event} e Mouse move event.
 * @private
 */
BSUtils.dialogMouseMove_ = function(e) {
  var dialog = document.getElementById('dialog');
  var dialogLeft = BSUtils.dialogStartX_ + e.clientX;
  var dialogTop = BSUtils.dialogStartY_ + e.clientY;
  dialogTop = Math.max(dialogTop, 0);
  dialogTop = Math.min(dialogTop, window.innerHeight - dialog.offsetHeight);
  dialogLeft = Math.max(dialogLeft, 0);
  dialogLeft = Math.min(dialogLeft, window.innerWidth - dialog.offsetWidth);
  dialog.style.left = dialogLeft + 'px';
  dialog.style.top = dialogTop + 'px';
};

/**
 * Stop binding to the global mouseup and mousemove events.
 * @private
 */
BSUtils.dialogUnbindDragEvents_ = function() {
  if (BSUtils.dialogMouseUpWrapper_) {
    Blockly.unbindEvent_(BSUtils.dialogMouseUpWrapper_);
    BSUtils.dialogMouseUpWrapper_ = null;
  }
  if (BSUtils.dialogMouseMoveWrapper_) {
    Blockly.unbindEvent_(BSUtils.dialogMouseMoveWrapper_);
    BSUtils.dialogMouseMoveWrapper_ = null;
  }
};

/**
 * Hide the dialog pop-up.
 * @param {boolean} opt_animate Animate the dialog closing.  Defaults to true.
 *     Requires that origin was not null when dialog was opened.
 */
BSUtils.hideDialog = function(opt_animate) {
  if (!BSUtils.isDialogVisible_) {
    return;
  }
  BSUtils.dialogUnbindDragEvents_();
  if (BSUtils.dialogMouseDownWrapper_) {
    Blockly.unbindEvent_(BSUtils.dialogMouseDownWrapper_);
    BSUtils.dialogMouseDownWrapper_ = null;
  }

  BSUtils.isDialogVisible_ = false;
  BSUtils.dialogDispose_ && BSUtils.dialogDispose_();
  BSUtils.dialogDispose_ = null;
  var origin = (opt_animate === false) ? null : BSUtils.dialogOrigin_;
  var dialog = document.getElementById('dialog');
  var shadow = document.getElementById('dialogShadow');
  var border = document.getElementById('dialogBorder');

  shadow.style.opacity = 0;

  function endResult() {
    shadow.style.visibility = 'hidden';
    border.style.visibility = 'hidden';
  }
  if (origin) {
    BSUtils.matchBorder_(dialog, false, 0.8);
    BSUtils.matchBorder_(origin, true, 0.2);
    // In 175ms hide both the shadow and the animated border.
    window.setTimeout(endResult, 175);
  } else {
    // No animation.  Just set the final state.
    endResult();
  }
  dialog.style.visibility = 'hidden';
  dialog.style.zIndex = -1;
  var header = document.getElementById('dialogHeader');
  if (header) {
    header.parentNode.removeChild(header);
  }
  while (dialog.firstChild) {
    var content = dialog.firstChild;
    content.className += ' dialogHiddenContent';
    document.body.appendChild(content);
  }
};

/**
 * Match the animated border to the a element's size and location.
 * @param {!Element} element Element to match.
 * @param {boolean} animate Animate to the new location.
 * @param {number} opacity Opacity of border.
 * @private
 */
BSUtils.matchBorder_ = function(element, animate, opacity) {
  if (!element) {
    return;
  }
  var border = document.getElementById('dialogBorder');
  var bBox = BSUtils.getBBox_(element);
  function change() {
    border.style.width = bBox.width + 'px';
    border.style.height = bBox.height + 'px';
    border.style.left = bBox.x + 'px';
    border.style.top = bBox.y + 'px';
    border.style.opacity = opacity;
  }
  if (animate) {
    border.className = 'dialogAnimate';
    window.setTimeout(change, 1);
  } else {
    border.className = '';
    change();
  }
  border.style.visibility = 'visible';
};

/**
 * Compute the absolute coordinates and dimensions of an HTML or SVG element.
 * @param {!Element} element Element to match.
 * @return {!Object} Contains height, width, x, and y properties.
 * @private
 */
BSUtils.getBBox_ = function(element) {
  var height = element.offsetHeight;
  var width = element.offsetWidth;
  var x = 0;
  var y = 0;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent;
  } while (element);
  return {
    height: height,
    width: width,
    x: x,
    y: y
  };
};

/**
 * Display a storage-related modal dialog.
 * @param {string} message Text to alert.
 */
BSUtils.storageAlert = function(message) {
  var container = document.getElementById('containerStorage');
  container.textContent = '';
  var lines = message.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var p = document.createElement('p');
    p.appendChild(document.createTextNode(lines[i]));
    container.appendChild(p);
  }

  var content = document.getElementById('dialogStorage');
  var origin = document.getElementById('linkButton');
  var style = {
    width: '50%',
    left: '25%',
    top: '5em'
  };
  BSUtils.showDialog(content, origin, true, true, style,
      BSUtils.stopDialogKeyDown());
  BSUtils.startDialogKeyDown();
};

/**
 * If the user preses enter, escape, or space, hide the dialog.
 * @param {!Event} e Keyboard event.
 * @private
 */
BSUtils.dialogKeyDown_ = function(e) {
  if (BSUtils.isDialogVisible_) {
    if (e.keyCode == 13 ||
        e.keyCode == 27 ||
        e.keyCode == 32) {
      BSUtils.hideDialog(true);
      e.stopPropagation();
      e.preventDefault();
    }
  }
};

/**
 * Start listening for BSUtils.dialogKeyDown_.
 */
BSUtils.startDialogKeyDown = function() {
  document.body.addEventListener('keydown',
      BSUtils.dialogKeyDown_, true);
};

/**
 * Stop listening for BSUtils.dialogKeyDown_.
 */
BSUtils.stopDialogKeyDown = function() {
  document.body.removeEventListener('keydown',
      BSUtils.dialogKeyDown_, true);
};

/**
 * Gets the message with the given key from the document.
 * @param {string} key The key of the document element.
 * @return {string} The textContent of the specified element,
 *     or an error message if the element was not found.
 */
BSUtils.getMsg = function(key) {
  var msg = BSUtils.getMsgOrNull(key);
  return msg === null ? '[Unknown message: ' + key + ']' : msg;
};

/**
 * Gets the message with the given key from the document.
 * @param {string} key The key of the document element.
 * @return {string} The textContent of the specified element,
 *     or null if the element was not found.
 */
BSUtils.getMsgOrNull = function(key) {
  var element = document.getElementById(key);
  if (element) {
    var text = element.textContent;
    // Convert newline sequences.
    text = text.replace(/\\n/g, '\n');
    return text;
  } else {
    return null;
  }
};

/**
 * On touch enabled browsers, add touch-friendly variants of event handlers
 * for elements such as buttons whose event handlers are specified in the
 * markup. For example, ontouchend is treated as equivalent to onclick.
 */
BSUtils.addTouchEvents = function() {
  // Do nothing if the browser doesn't support touch.
  if (!('ontouchstart' in document.documentElement)) {
    return;
  }
  // Treat ontouchend as equivalent to onclick for buttons.
  var buttons = document.getElementsByTagName('button');
  for (var i = 0, button; button = buttons[i]; i++) {
    if (!button.ontouchend) {
      button.ontouchend = button.onclick;
    }
  }
};

// Add events for touch devices when the window is done loading.
window.addEventListener('load', BSUtils.addTouchEvents, false);

/**
 * Bind a function to a button's click event.
 * On touch enabled browsers, ontouchend is treated as equivalent to onclick.
 * @param {string} id ID of button element.
 * @param {!Function} func Event handler to bind.
 */
BSUtils.bindClick = function(el, func) {
  if (typeof el == 'string') {
    el = document.getElementById(el);
  }
  el.addEventListener('click', func, true);
  el.addEventListener('touchend', func, true);
};
