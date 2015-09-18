var NwBuilder = require('nw-builder');
var nw = new NwBuilder({
    files: ['**',  '!cache/**', '!build/**'], // get everything except the nwbuild stuff
//    files: ['**'], // get everything
//    files: ['**', '!closure-library/**', '!_soy/**', '!node_modules/**', '!openscad-openjscad-translator/**', '!cache/**', '!build/**'], // use the glob format
//    files: ['blockly/*compressed.js', 'blockscad/*compressed.js', 'blockscad/style.css', 'bootstrap/**', 'docs/**', 'fonts/**', 'imgs/**', 'jquery/**', 'opentype/**', 'credits.html', 'favicon.ico', 'icons.png', 'index.html', 'package.json', 'privacy.html', 'TOS.html' ], // real way to do it
    platforms: ['osx', 'win', 'linux'],
//    version: '0.12.1'
    version: '0.12.3',
    winIco: 'icon128.ico'
});

//Log stuff you want

nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});
