// make a toolbox namespace?  Do I have to do this?
// To-do - see if I can load the xml into a variable (like in blockscadpagestart()), and break it up into "blocks", "imported blocks", and "end".
// then I could support simple and advanced block sets that keep any imported blocks across them.

var Blockscad = Blockscad || {};
Blockscad.Toolbox = {};
// Blockscad.Msg = Blockscad.Msg || {};
Blockly = Blockly || {};

// for switching toolboxes, I need to know the current html category ids.
Blockscad.Toolbox.catIDs = [];


// shall I set some hues?
// Blockscad.Toolbox.allcats = ['HEX_3D_PRIMITIVE','HEX_2D_PRIMITIVE','HEX_TRANSFORM',
//                 'HEX_SETOP', 'HEX_MATH','HEX_LOGIC','HEX_LOOP','HEX_ADVANCED',
//                 'HEX_VARIABLE','HEX_PROCEDURE'];
Blockscad.Toolbox.allcats = ['HEX_3D_PRIMITIVE','HEX_2D_PRIMITIVE','HEX_TRANSFORM',
                'HEX_SETOP', 'HEX_MATH','HEX_LOGIC','HEX_LOOP','HEX_TEXT',
                'HEX_VARIABLE','HEX_PROCEDURE'];

Blockscad.Toolbox.whichCatsInSimple = [0,2,3,4,8,9];


Blockscad.Toolbox.colorScheme = {};
Blockscad.Toolbox.colorScheme['one'] =  // classic
      [ '#006205',  // 3D
        '#209303',  // 2D
        '#26549E',  // Transform
        '#7450E2',  // Set Ops
        '#0185E1',  // Math
        '#BF6920',  // Logic
        '#612485',  // Loops
        '#727272',  // Advanced (or Text)
        '#8C7149',  // Variables
        '#900355']; // Modules

Blockscad.Toolbox.colorScheme['two'] =  // pale
      [ '#885ee3',  // 3D
        '#82af5a',  // 2D
        '#23901c',  // Transform
        '#377eb8',  // Set Ops
        '#ba9969',  // Math
        '#afaf13',  // Logic
        '#a66658',  // Loops
        '#d761bf',  // Advanced (or Text)
        '#999999',  // Variables
        '#b02375']; // Modules

Blockscad.Toolbox.catHex = [];
Blockscad.Toolbox.simpCatHex = [];

// set default color scheme
Blockscad.Toolbox.setColorScheme = function(color_scheme) {
  // console.log(color_scheme);
  for (var i = 0; i < Blockscad.Toolbox.allcats.length; i++) {
    Blockscad.Toolbox[Blockscad.Toolbox.allcats[i]] = color_scheme[i];
    Blockscad.Toolbox.catHex[i] = color_scheme[i];
  }

  // console.log(Blockscad.Toolbox);
}

Blockscad.Toolbox.setCatColors = function() {
  if (Blockscad.Toolbox.catIDs.length < Blockscad.Toolbox.allcats.length) {
    // using simple toolbox
    for (var i=0; i < Blockscad.Toolbox.catIDs.length; i++) {
      // console.log("trying to find element:  ",Blockscad.Toolbox.catIDs[i]);
      var element = document.getElementById(Blockscad.Toolbox.catIDs[i]);
      // console.log("toolbox element is:",element);
      element.style.background = Blockscad.Toolbox.catHex[Blockscad.Toolbox.whichCatsInSimple[i]];
    }

  } else {
    for (var i=0; i < Blockscad.Toolbox.catIDs.length; i++) {
      // console.log("trying to find element:  ",Blockscad.Toolbox.catIDs[i]);
      var element = document.getElementById(Blockscad.Toolbox.catIDs[i]);
      element.style.background = Blockscad.Toolbox.catHex[i];
      // console.log("toolbox element is:",element);
    }
  }
}

Blockscad.Toolbox.createToolbox = function() {

Blockscad.Toolbox.cat_3D = '<category name="' + Blockscad.Msg.CATEGORY_3D_SHAPES + '">' +
      '<block type="sphere">' +
        '<value name="RAD">' +
          '<shadow type="math_number">' +
            '<field name="NUM">10</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
      '<block type="cube">' +
        '<value name="XVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">10</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="YVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">10</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="ZVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">10</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
      '<block type="cylinder">' +
        '<value name="RAD1">' +
          '<shadow type="math_number">' +
            '<field name="NUM">10</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="RAD2">' +
          '<shadow type="math_number">' +
            '<field name="NUM">10</field>' +
          '</shadow>' +
       '</value>' +
         '<value name="HEIGHT">' +
          '<shadow type="math_number">' +
            '<field name="NUM">10</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
      '<block type="torus">' +
        '<value name="RAD1">' +
          '<shadow type="math_number">' +
            '<field name="NUM">4</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="RAD2">' +
          '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="SIDES">' +
          '<shadow type="math_number">' +
            '<field name="NUM">8</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="FACES">' +
          '<shadow type="math_number">' +
            '<field name="NUM">16</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
    '</category>';

Blockscad.Toolbox.cat_3D_sim = '<category name="' + Blockscad.Msg.CATEGORY_3D_SHAPES + '">' +
      '<block type="sphere">' +
        '<value name="RAD">' +
          '<shadow type="math_number">' +
            '<field name="NUM">10</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
      '<block type="cube">' +
        '<value name="XVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">10</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="YVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">10</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="ZVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">10</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
      '<block type="cylinder">' +
        '<value name="RAD1">' +
          '<shadow type="math_number">' +
            '<field name="NUM">10</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="RAD2">' +
          '<shadow type="math_number">' +
            '<field name="NUM">10</field>' +
          '</shadow>' +
       '</value>' +
         '<value name="HEIGHT">' +
          '<shadow type="math_number">' +
            '<field name="NUM">10</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
    '</category>';

Blockscad.Toolbox.cat2D = '<category name="' + Blockscad.Msg.CATEGORY_2D_SHAPES + '">' +
      '<block type="circle">' +
        '<value name="RAD">' +
          '<shadow type="math_number">' +
            '<field name="NUM">10</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
      '<block type="square">' +
        '<value name="XVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">10</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="YVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">10</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
    '</category>';


Blockscad.Toolbox.catTransform = '<category name="' + Blockscad.Msg.CATEGORY_TRANSFORMATIONS + '">' +
      '<block type="translate">' +
        '<value name="XVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">0</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="YVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">0</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="ZVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">0</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
      '<block type="simplerotate">' +
        '<value name="XVAL">' +
          '<shadow type="math_angle">' +
            '<field name="NUM">0</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="YVAL">' +
          '<shadow type="math_angle">' +
            '<field name="NUM">0</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="ZVAL">' +
          '<shadow type="math_angle">' +
            '<field name="NUM">0</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
      '<block type="simplemirror_new"></block>' +
      '<block type="scale">' +
        '<value name="XVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="YVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="ZVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
      '<block type="color">' +
        '<value name="COLOR">' +
          '<shadow type="colour_picker">' +
            '<field name="COLOUR">#ffcc00</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
      '<block type="color_rgb">' +
        '<value name="RED">' +
          '<shadow type="math_number">' +
            '<field name="NUM">100</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="GREEN">' +
          '<shadow type="math_number">' +
            '<field name="NUM">100</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="BLUE">' +
          '<shadow type="math_number">' +
            '<field name="NUM">100</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
      '<block type="$fn">' +
        '<value name="SIDES">' +
          '<shadow type="math_number">' +
            '<field name="NUM">8</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
      '<block type="taper">' +
        '<value name="FACTOR">' +
          '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
          '</shadow>' + 
        '</value>' +
      '</block>' +
      '<block type="linearextrude">' +
        '<value name="HEIGHT">' +
          '<shadow type="math_number">' +
            '<field name="NUM">10</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="TWIST">' +
          '<shadow type="math_angle">' +
            '<field name="NUM">0</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="XSCALE">' +
          '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="YSCALE">' +
          '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
      '<block type="rotateextrude">' +
        '<value name="FACES">' +
          '<shadow type="math_number">' +
            '<field name="NUM">5</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
      '<block type="fancyrotate">' +
        '<value name="AVAL">' +
          '<shadow type="math_angle">' +
            '<field name="NUM">0</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="XVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">0</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="YVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">0</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="ZVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">0</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
      '<block type="fancymirror">' +
        '<value name="XVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="YVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="ZVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
    '</category>';

Blockscad.Toolbox.catTransform_sim = '<category name="' + Blockscad.Msg.CATEGORY_TRANSFORMATIONS + '">' +
      '<block type="translate">' +
        '<value name="XVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">0</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="YVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">0</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="ZVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">0</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
      '<block type="simplerotate">' +
        '<value name="XVAL">' +
          '<shadow type="math_angle">' +
            '<field name="NUM">0</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="YVAL">' +
          '<shadow type="math_angle">' +
            '<field name="NUM">0</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="ZVAL">' +
          '<shadow type="math_angle">' +
            '<field name="NUM">0</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
      '<block type="scale">' +
        '<value name="XVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="YVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="ZVAL">' +
          '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
      '<block type="color">' +
        '<value name="COLOR">' +
          '<shadow type="colour_picker">' +
            '<field name="COLOUR">#ffcc00</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
      '<block type="$fn">' +
        '<value name="SIDES">' +
          '<shadow type="math_number">' +
            '<field name="NUM">8</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
    '</category>';

Blockscad.Toolbox.catSetOps=   '<category name="' + Blockscad.Msg.CATEGORY_SET_OPERATIONS + '">' +
      '<block type="union"></block>' +
      '<block type="difference"></block>' +
      '<block type="intersection"></block>' +
      '<block type="hull"></block>' +
    '</category>';

Blockscad.Toolbox.catSetOps_sim = '<category name="' + Blockscad.Msg.CATEGORY_SET_OPERATIONS + '">' +
      '<block type="union"></block>' +
      '<block type="difference"></block>' +
      '<block type="intersection"></block>' +
    '</category>';

Blockscad.Toolbox.catMathLogic= '<category name="' + Blockscad.Msg.CATEGORY_MATH + '">' +
      '<block type="math_number"></block>' +
      '<block type="math_angle"></block>' +
      '<block type="math_arithmetic">' +
        '<value name="A">' +
          '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="B">' +
          '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
          '</shadow>' + 
        '</value>' +
      '</block>' +
      '<block type="math_single">' +
        '<value name="NUM">' + 
          '<shadow type="math_number">' + 
            '<field name="NUM">9</field>' + 
          '</shadow>' + 
        '</value>' + 
      '</block>' +
      '<block type="math_trig">' +
        '<value name="NUM">' + 
          '<shadow type="math_number">' + 
            '<field name="NUM">45</field>' + 
          '</shadow>' + 
        '</value>' + 
      '</block>' +
      '<block type="math_constant_bs"></block>' +
      '<block type="math_number_property">' +
        '<value name="NUMBER_TO_CHECK">' + 
          '<shadow type="math_number">' + 
            '<field name="NUM">0</field>' + 
          '</shadow>' + 
        '</value>' + 
      '</block>' +
      '<block type="math_round">' +
        '<value name="NUM">' + 
          '<shadow type="math_number">' + 
            '<field name="NUM">3.1</field>' + 
          '</shadow>' + 
        '</value>' + 
      '</block>' +
      '<block type="math_modulo">' +
        '<value name="DIVIDEND">' + 
          '<shadow type="math_number">' + 
            '<field name="NUM">64</field>' + 
          '</shadow>' + 
        '</value>' + 
        '<value name="DIVISOR">' + 
          '<shadow type="math_number">' + 
            '<field name="NUM">10</field>' + 
          '</shadow>' + 
        '</value>' + 
      '</block>' +
      '<block type="math_constrain">' +
        '<value name="VALUE">' + 
          '<shadow type="math_number">' + 
            '<field name="NUM">50</field>' + 
          '</shadow>' + 
        '</value>' + 
        '<value name="LOW">' +
          '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="HIGH">' +
          '<shadow type="math_number">' +
            '<field name="NUM">100</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
      '<block type="math_random_int">' +
        '<value name="FROM">' +
          '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="TO">' +
          '<shadow type="math_number">' +
            '<field name="NUM">100</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
      '<block type="math_random_float"></block>' +
    '</category>' +
    '<category name="' + Blockscad.Msg.CATEGORY_LOGIC + '">' +
      '<block type="controls_if"></block>' +
      '<block type="logic_compare"></block>' +
      '<block type="logic_operation"></block>' +
      '<block type="logic_negate"></block>' +
      '<block type="logic_boolean"></block>' +
      '<block type="logic_ternary"></block>' +
    '</category>';

Blockscad.Toolbox.catMathLogic_sim= '<category name="' + Blockscad.Msg.CATEGORY_MATH + '">' +
      '<block type="math_number"></block>' +
      '<block type="math_angle"></block>' +
      '<block type="math_arithmetic"></block>' +
      '<block type="math_single"></block>' +
      '<block type="math_random_int">' +
        '<value name="FROM">' +
          '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="TO">' +
          '<shadow type="math_number">' +
            '<field name="NUM">100</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
    '</category>';

Blockscad.Toolbox.catLoops = '<category name="' + Blockscad.Msg.CATEGORY_LOOPS + '">' +
      '<block type="controls_for">' +
        '<value name="FROM">' +
          '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
          '</shadow> ' +
        '</value>' +
        '<value name="TO">' +
          '<shadow type="math_number">' +
            '<field name="NUM">10</field>' +
          '</shadow>' +
        '</value>' +
        '<value name="BY">' +
          '<shadow type="math_number">' +
            '<field name="NUM">1</field>' +
          '</shadow>' +
        '</value>' +
      '</block>' +
      // '<block type="controls_for_chainhull">' +
      //   '<value name="FROM">' +
      //     '<block type="math_number">' +
      //       '<field name="NUM">1</field>' +
      //     '</block> ' +
      //   '</value>' +
      //   '<value name="TO">' +
      //     '<block type="math_number">' +
      //       '<field name="NUM">10</field>' +
      //     '</block>' +
      //   '</value>' +
      //   '<value name="BY">' +
      //     '<block type="math_number">' +
      //       '<field name="NUM">1</field>' +
      //     '</block>' +
      //   '</value>' +
      // '</block>' +
    '</category>';

Blockscad.Toolbox.catOther = '<category name="' + Blockscad.Msg.CATEGORY_TEXT + '">' +
      '<block type="bs_text">' + 
        '<value name="TEXT">' + 
          '<shadow type="text">' +
          '</shadow>' +
        '</value>' +
        '<value name="SIZE">' +
          '<shadow type="math_number">' +
            '<field name="NUM">10</field>' +
          '</shadow>' +
        '</value>' + 
      '</block>' +
      '<block type="bs_3dtext">' + 
        '<value name="TEXT">' + 
          '<shadow type="text">' +
          '</shadow>' +
        '</value>' +
        '<value name="SIZE">' +
          '<shadow type="math_number">' +
            '<field name="NUM">10</field>' +
          '</shadow>' +
        '</value>' + 
        '<value name="THICKNESS">' + 
          '<shadow type="math_number">' +
            '<field name="NUM">2</field>' + 
          '</shadow>' +
        '</value>' +
      '</block>' +
      '<block type="text"></block>' +
      '<block type="bs_text_length">' +
        '<value name="VALUE">' + 
          '<shadow type="text">' + 
            '<field name="TEXT">abc</field>' + 
          '</shadow>' + 
        '</value>' + 
      '</block>' +
      // '<block type="rotateextrudetwist">' +
      //   '<value name="RAD">' +
      //     '<block type="math_number">' +
      //       '<field name="NUM">10</field>' +
      //     '</block>' +
      //   '</value>' +
      //   '<value name="FACES">' +
      //     '<block type="math_number">' +
      //       '<field name="NUM">5</field>' +
      //     '</block>' +
      //   '</value>' +
      //   '<value name="TWIST">' +
      //     '<block type="math_number">' +
      //       '<field name="NUM">360</field>' +
      //     '</block>' +
      //   '</value>' +
      //   '<value name="TSTEPS">' +
      //     '<block type="math_number">' +
      //       '<field name="NUM">180</field>' +
      //     '</block>' +
      //   '</value>' +
      // '</block>' +
      // '<block type="twistytorus">' +
      //   '<value name="RAD1">' +
      //     '<block type="math_number">' +
      //       '<field name="NUM">4</field>' +
      //     '</block>' +
      //   '</value>' +
      //   '<value name="RAD2">' +
      //     '<block type="math_number">' +
      //       '<field name="NUM">1</field>' +
      //     '</block>' +
      //   '</value>' +
      //   '<value name="SIDES">' +
      //     '<block type="math_number">' +
      //       '<field name="NUM">8</field>' +
      //     '</block>' +
      //   '</value>' +
      //   '<value name="FACES">' +
      //     '<block type="math_number">' +
      //       '<field name="NUM">3</field>' +
      //     '</block>' +
      //   '</value>' +
      //   '<value name="TWIST">' +
      //     '<block type="math_number">' +
      //       '<field name="NUM">360</field>' +
      //     '</block>' +
      //   '</value>' +
      // '</block>' +

      // '<block type="stl_import"></block>' +
    '</category>' +
    '<category name="' + Blockscad.Msg.CATEGORY_VARIBLES + '" custom="VARIABLE"></category>' +
    '<category name="' + Blockscad.Msg.CATEGORY_PROCEDURES + '" custom="PROCEDURE"></category>' +
  '</xml>'; 

Blockscad.Toolbox.catOther_sim = 
    '<category name="' + Blockscad.Msg.CATEGORY_VARIBLES + '" custom="VARIABLE"></category>' +
    '<category name="' + Blockscad.Msg.CATEGORY_PROCEDURES + '" custom="PROCEDURE"></category>' +
    '</xml>';

Blockscad.Toolbox.adv =  '<xml id="toolbox" style="display: none">';
Blockscad.Toolbox.adv += Blockscad.Toolbox.cat_3D;
Blockscad.Toolbox.adv += Blockscad.Toolbox.cat2D;
Blockscad.Toolbox.adv += Blockscad.Toolbox.catTransform;
Blockscad.Toolbox.adv += Blockscad.Toolbox.catSetOps;
Blockscad.Toolbox.adv += Blockscad.Toolbox.catMathLogic;
Blockscad.Toolbox.adv += Blockscad.Toolbox.catLoops;
Blockscad.Toolbox.adv += Blockscad.Toolbox.catOther;

Blockscad.Toolbox.sim = '<xml id="toolbox" style="display: none">';
Blockscad.Toolbox.sim += Blockscad.Toolbox.cat_3D_sim;
// Blockscad.Toolbox.sim += Blockscad.Toolbox.cat2D;
Blockscad.Toolbox.sim += Blockscad.Toolbox.catTransform_sim;
Blockscad.Toolbox.sim += Blockscad.Toolbox.catSetOps_sim;
Blockscad.Toolbox.sim += Blockscad.Toolbox.catMathLogic_sim;
//Blockscad.Toolbox.sim += Blockscad.Toolbox.catLoops_sim;
Blockscad.Toolbox.sim += Blockscad.Toolbox.catOther_sim;

}
