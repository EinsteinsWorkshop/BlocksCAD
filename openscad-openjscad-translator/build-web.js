{
    "baseUrl": "src",
    "paths": {
        "openscadOpenJscadParser": "../web",
        "lib": "../lib"
    },

    "include": ["../tools/almond", "openscadOpenJscadParser"],
    "exclude": ["../lib/underscore"],
    "out": "../openscad-openjscad-translator-new.js",
    "wrap": {
        "startFile": "tools/start.frag",
        "endFile": "tools/end.frag"
    }
}