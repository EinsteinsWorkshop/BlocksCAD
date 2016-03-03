var NwBuilder = require('nw-builder');
var nw = new NwBuilder({
   // files: ['**',  '!cache/**', '!build/**'], // get everything except the nwbuild stuff
//    files: ['**'], // get everything
   // files: ['**', '!closure-library/**', '!_soy/**', '!node_modules/**', '!openscad-openjscad-translator/**', '!cache/**', '!build/**'], // use the glob format
    files: ['fonts/**', 'lie/lie.polyfill.min.js', 'bootbox/bootbox.min.js', 'auth.js', 'blockly/blockly_compressed.js','blockly/blocks_compressed.js','jquery/jquery-1.11.3.min.js', 'jquery/jquery-ui.min.js','jquery/jquery.hammer.js', 'jquery/jquery.ui.touch-punch.min.js', 'bootstrap/bootstrap-3.3.4-dist/css/bootstrap.min.css', 'bootstrap/bootstrap-3.3.4-dist/css/bootstrap-theme.min.css', 'bootstrap/bootstrap-3.3.4-dist/js/bootstrap.min.js', 'blockly/openscad_compressed.js', 'blockscad/viewer_compressed.js', 'blockscad/blockscad_compressed.js', 'blockscad/underscore.js', 'blockscad/openscad-openjscad-translator.js', 'blockscad/style.css', 'favicon.ico', 'ewicon.png', 'imgs/**', 'docs/**', 'icon128.ico', 'icon128.png', 'blockly/media/**', 'index.html', 'package.json', 'blockly/msg/messages.js', 'blockly/msg/js/en.js', 'blockly/msg/json/en.json', 'TOS.html', 'privacy.html', 'gpl-3.0-standalone.html', 'examples/**', 'opentype/dist/opentype.js'],
    platforms: ['win64'],
    // platforms: ['win64', 'linux'],
   // version: '0.12.1',
    version: '0.12.3',
    winIco: 'favicon.ico',
   //  window: {
   //    icon: 'favicon.ico'
   // }
});

//Log stuff you want

nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});
