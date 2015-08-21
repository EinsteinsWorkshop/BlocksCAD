{
    "baseUrl": "src",
    "paths": {
        "openscadOpenJscadParser": "../web",
        "lib": "../lib"
    },

    "include": ["../tools/almond", "openscadOpenJscadParser"],
    "exclude": ["../lib/underscore"],
    "out": "../blockscad/openscad-openjscad-translator.js",
    "wrap": {
        "startFile": "tools/start.frag",
        "endFile": "tools/end.frag"
    }
}