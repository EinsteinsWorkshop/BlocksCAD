// make a toolbox namespace?  Do I have to do this?
// To-do - see if I can load the xml into a variable (like in blockscadpagestart()), and break it up into "blocks", "imported blocks", and "end".
// then I could support simple and advanced block sets that keep any imported blocks across them.

var Blockscad = Blockscad || {};
Blockscad.Toolbox = {};
Blockly = Blockly || {};

// for switching toolboxes, I need to know the current html category ids.
Blockscad.Toolbox.catIDs = [];


// shall I set some hues?
Blockscad.Toolbox.allcats = ['HEX_3D_PRIMITIVE','HEX_2D_PRIMITIVE','HEX_TRANSFORM',
                'HEX_SETOP', 'HEX_MATH','HEX_LOGIC','HEX_LOOP','HEX_ADVANCED',
                'HEX_VARIABLE','HEX_PROCEDURE'];

//Blockly.catHues = [0,36,72,108,144,180,216,252,288,324];
// Blockly.catHex = ["#005CB8","#47B5FF","#509B50","#53CF29","#C3782D","#A089D1","#E6813E","#FFB445","#D147FF","#5C00B8"]; // HIDEOUS!!!
Blockscad.Toolbox.catHex = ['#006205',  // 3D
                            '#209303',  // 2D
                            '#26549E',  // Transform
                            '#7450E2',  // Set Ops
                            '#0186E2',  // Math
                            '#BF6920',  // Logic
                            '#612485',  // Loops
                            '#727272',  // Advanced
                            '#8C7149',  // Variables
                            '#900355']; // Modules

Blockscad.Toolbox.simpCatHex = ['#006205',  // 3D
                            // '#209303',  // 2D
                            '#26549E',  // Transform
                            '#7450E2',  // Set Ops
                            '#0186E2',  // Math
                            '#BF6920',  // Logic
                            '#612485',  // Loops
                            '#727272',  // Advanced
                            '#8C7149',  // Variables
                            '#900355']; // Modules


for (var i = 0; i < Blockscad.Toolbox.allcats.length; i++) {
  Blockscad.Toolbox[Blockscad.Toolbox.allcats[i]] = Blockscad.Toolbox.catHex[i];
}
//Blockscad.Toolbox.all_stuff ='<xml id="toolbox" style="display: none"><category name="3D Shapes"><block type="sphere"><value name="RAD"><block type="math_number"><field name="NUM">10</field></block></value></block><block type="cylinder"><value name="RAD1"><block type="math_number"><field name="NUM">10</field></block></value><value name="RAD2"><block type="math_number"><field name="NUM">10</field></block></value><value name="HEIGHT"><block type="math_number"><field name="NUM">10</field></block></value></block><block type="cube"><value name="XVAL"><block type="math_number"><field name="NUM">10</field></block></value><value name="YVAL"><block type="math_number"><field name="NUM">10</field></block></value><value name="ZVAL"><block type="math_number"><field name="NUM">10</field></block></value></block></category><category name="2D Shapes"><block type="circle"><value name="RAD"><block type="math_number"><field name="NUM">10</field></block></value></block><block type="square"><value name="XVAL"><block type="math_number"><field name="NUM">10</field></block></value><value name="YVAL"><block type="math_number"><field name="NUM">10</field></block></value></block></category><category name="Transforms"><block type="translate"><value name="XVAL"><block type="math_number"><field name="NUM">0</field></block></value><value name="YVAL"><block type="math_number"><field name="NUM">0</field></block></value><value name="ZVAL"><block type="math_number"><field name="NUM">0</field></block></value></block><block type="simplerotate"><value name="XVAL"><block type="math_angle"><field name="NUM">0</field></block></value><value name="YVAL"><block type="math_angle"><field name="NUM">0</field></block></value><value name="ZVAL"><block type="math_angle"><field name="NUM">0</field></block></value></block><block type="simplemirror_new"></block><block type="scale"><value name="XVAL"><block type="math_number"><field name="NUM">1</field></block></value><value name="YVAL"><block type="math_number"><field name="NUM">1</field></block></value><value name="ZVAL"><block type="math_number"><field name="NUM">1</field></block></value></block><block type="color"><value name="COLOR"><block type="colour_picker"><field name="COLOUR">#ffcc00</field></block></value></block><block type="$fn"><value name="SIDES"><block type="math_number"><field name="NUM">8</field></block></value></block><block type="linearextrude"><value name="HEIGHT"><block type="math_number"><field name="NUM">10</field></block></value><value name="TWIST"><block type="math_number"><field name="NUM">0</field></block></value></block><block type="rotateextrude"><value name="FACES"><block type="math_number"><field name="NUM">5</field></block></value></block></category><category name="Set Ops"><block type="union"></block><block type="difference"></block><block type="intersection"></block><block type="hull"></block></category><category name="Math"><block type="math_number"></block><block type="math_angle"></block><block type="math_arithmetic"></block><block type="math_single"></block><block type="math_trig"></block><block type="math_constant_bs"></block><block type="math_number_property"></block><block type="math_round"></block><block type="math_modulo"></block><block type="math_constrain"><value name="LOW"><block type="math_number"><field name="NUM">1</field></block></value><value name="HIGH"><block type="math_number"><field name="NUM">100</field></block></value></block><block type="math_random_int"><value name="FROM"><block type="math_number"><field name="NUM">1</field></block></value><value name="TO"><block type="math_number"><field name="NUM">100</field></block></value></block><block type="math_random_float"></block></category><category name="Logic"><block type="controls_if"></block><block type="logic_compare"></block><block type="logic_operation"></block><block type="logic_negate"></block><block type="logic_boolean"></block><block type="logic_ternary"></block></category><category name="Loops"><block type="controls_for"><value name="FROM"><block type="math_number"><field name="NUM">1</field></block></value><value name="TO"><block type="math_number"><field name="NUM">10</field></block></value><value name="BY"><block type="math_number"><field name="NUM">1</field></block></value></block></category><category name="Advanced"><block type="torus"><value name="RAD1"><block type="math_number"><field name="NUM">4</field></block></value><value name="RAD2"><block type="math_number"><field name="NUM">1</field></block></value><value name="SIDES"><block type="math_number"><field name="NUM">8</field></block></value><value name="FACES"><block type="math_number"><field name="NUM">3</field></block></value></block><block type="fancyrotate"><value name="AVAL"><block type="math_angle"><field name="NUM">0</field></block></value><value name="XVAL"><block type="math_number"><field name="NUM">0</field></block></value><value name="YVAL"><block type="math_number"><field name="NUM">0</field></block></value><value name="ZVAL"><block type="math_number"><field name="NUM">0</field></block></value></block><block type="fancymirror"><value name="XVAL"><block type="math_number"><field name="NUM">1</field></block></value><value name="YVAL"><block type="math_number"><field name="NUM">1</field></block></value><value name="ZVAL"><block type="math_number"><field name="NUM">1</field></block></value></block></category><category name="Variables" custom="VARIABLE"></category><category name="Modules" custom="PROCEDURE"></category></xml>'; 
Blockscad.Toolbox.setCatColors = function() {
  for (var i=0; i < Blockscad.Toolbox.catIDs.length; i++) {
    // console.log("trying to find element:  ",Blockscad.Toolbox.catIDs[i]);
    var element = document.getElementById(Blockscad.Toolbox.catIDs[i]);
    // console.log("toolbox element is:",element);
    element.style.background = Blockscad.Toolbox.catHex[i];
  }
}
Blockscad.Toolbox.setCatColorsSimp = function() {
  for (var i=0; i < Blockscad.Toolbox.catIDs.length; i++) {
    // console.log("trying to find element:  ",Blockscad.Toolbox.catIDs[i]);
    var element = document.getElementById(Blockscad.Toolbox.catIDs[i]);
    // console.log("toolbox element is:",element);
    element.style.background = Blockscad.Toolbox.simpCatHex[i];
  }
}

Blockscad.Toolbox.cat_3D = '<category name="3D Shapes">' +
      '<block type="sphere">' +
        '<value name="RAD">' +
          '<block type="math_number">' +
            '<field name="NUM">10</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="cylinder">' +
        '<value name="RAD1">' +
          '<block type="math_number">' +
            '<field name="NUM">10</field>' +
          '</block>' +
        '</value>' +
        '<value name="RAD2">' +
          '<block type="math_number">' +
            '<field name="NUM">10</field>' +
          '</block>' +
       '</value>' +
         '<value name="HEIGHT">' +
          '<block type="math_number">' +
            '<field name="NUM">10</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="cube">' +
        '<value name="XVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">10</field>' +
          '</block>' +
        '</value>' +
        '<value name="YVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">10</field>' +
          '</block>' +
        '</value>' +
        '<value name="ZVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">10</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
    '</category>';

Blockscad.Toolbox.cat2D = '<category name="2D Shapes">' +
      '<block type="circle">' +
        '<value name="RAD">' +
          '<block type="math_number">' +
            '<field name="NUM">10</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="square">' +
        '<value name="XVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">10</field>' +
          '</block>' +
        '</value>' +
        '<value name="YVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">10</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
    '</category>';


Blockscad.Toolbox.catTransform = '<category name="Transforms">' +
      '<block type="translate">' +
        '<value name="XVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">0</field>' +
          '</block>' +
        '</value>' +
        '<value name="YVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">0</field>' +
          '</block>' +
        '</value>' +
        '<value name="ZVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">0</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="simplerotate">' +
        '<value name="XVAL">' +
          '<block type="math_angle">' +
            '<field name="NUM">0</field>' +
          '</block>' +
        '</value>' +
        '<value name="YVAL">' +
          '<block type="math_angle">' +
            '<field name="NUM">0</field>' +
          '</block>' +
        '</value>' +
        '<value name="ZVAL">' +
          '<block type="math_angle">' +
            '<field name="NUM">0</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="simplemirror_new"></block>' +
      '<block type="scale">' +
        '<value name="XVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">1</field>' +
          '</block>' +
        '</value>' +
        '<value name="YVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">1</field>' +
          '</block>' +
        '</value>' +
        '<value name="ZVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">1</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="color">' +
        '<value name="COLOR">' +
          '<block type="colour_picker">' +
            '<field name="COLOUR">#ffcc00</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="$fn">' +
        '<value name="SIDES">' +
          '<block type="math_number">' +
            '<field name="NUM">8</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="linearextrude">' +
        '<value name="HEIGHT">' +
          '<block type="math_number">' +
            '<field name="NUM">10</field>' +
          '</block>' +
        '</value>' +
        '<value name="TWIST">' +
          '<block type="math_angle">' +
            '<field name="NUM">0</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="rotateextrude">' +
        '<value name="FACES">' +
          '<block type="math_number">' +
            '<field name="NUM">5</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
    '</category>';

Blockscad.Toolbox.catTransform_sim = '<category name="Transforms">' +
      '<block type="translate">' +
        '<value name="XVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">0</field>' +
          '</block>' +
        '</value>' +
        '<value name="YVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">0</field>' +
          '</block>' +
        '</value>' +
        '<value name="ZVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">0</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="simplerotate">' +
        '<value name="XVAL">' +
          '<block type="math_angle">' +
            '<field name="NUM">0</field>' +
          '</block>' +
        '</value>' +
        '<value name="YVAL">' +
          '<block type="math_angle">' +
            '<field name="NUM">0</field>' +
          '</block>' +
        '</value>' +
        '<value name="ZVAL">' +
          '<block type="math_angle">' +
            '<field name="NUM">0</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="scale">' +
        '<value name="XVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">1</field>' +
          '</block>' +
        '</value>' +
        '<value name="YVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">1</field>' +
          '</block>' +
        '</value>' +
        '<value name="ZVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">1</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="color">' +
        '<value name="COLOR">' +
          '<block type="colour_picker">' +
            '<field name="COLOUR">#ffcc00</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="$fn">' +
        '<value name="SIDES">' +
          '<block type="math_number">' +
            '<field name="NUM">8</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
    '</category>';

Blockscad.Toolbox.catSetOps=   '<category name="Set Ops">' +
      '<block type="union"></block>' +
      '<block type="difference"></block>' +
      '<block type="intersection"></block>' +
      '<block type="hull"></block>' +
    '</category>';

Blockscad.Toolbox.catSetOps_sim = '<category name="Set Ops">' +
      '<block type="union"></block>' +
      '<block type="difference"></block>' +
      '<block type="intersection"></block>' +
    '</category>';

Blockscad.Toolbox.catMathLogic= '<category name="Math">' +
      '<block type="math_number"></block>' +
      '<block type="math_angle"></block>' +
      '<block type="math_arithmetic"></block>' +
      '<block type="math_single"></block>' +
      '<block type="math_trig"></block>' +
      '<block type="math_constant_bs"></block>' +
      '<block type="math_number_property"></block>' +
      '<block type="math_round"></block>' +
      '<block type="math_modulo"></block>' +
      '<block type="math_constrain">' +
        '<value name="LOW">' +
          '<block type="math_number">' +
            '<field name="NUM">1</field>' +
          '</block>' +
        '</value>' +
        '<value name="HIGH">' +
          '<block type="math_number">' +
            '<field name="NUM">100</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="math_random_int">' +
        '<value name="FROM">' +
          '<block type="math_number">' +
            '<field name="NUM">1</field>' +
          '</block>' +
        '</value>' +
        '<value name="TO">' +
          '<block type="math_number">' +
            '<field name="NUM">100</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="math_random_float"></block>' +
    '</category>' +
    '<category name="Logic">' +
      '<block type="controls_if"></block>' +
      '<block type="logic_compare"></block>' +
      '<block type="logic_operation"></block>' +
      '<block type="logic_negate"></block>' +
      '<block type="logic_boolean"></block>' +
      '<block type="logic_ternary"></block>' +
    '</category>';

Blockscad.Toolbox.catMathLogic_sim= '<category name="Math">' +
      '<block type="math_number"></block>' +
      '<block type="math_angle"></block>' +
      '<block type="math_arithmetic"></block>' +
    '</category>';

Blockscad.Toolbox.catLoops = '<category name="Loops">' +
      '<block type="controls_for">' +
        '<value name="FROM">' +
          '<block type="math_number">' +
            '<field name="NUM">1</field>' +
          '</block> ' +
        '</value>' +
        '<value name="TO">' +
          '<block type="math_number">' +
            '<field name="NUM">10</field>' +
          '</block>' +
        '</value>' +
        '<value name="BY">' +
          '<block type="math_number">' +
            '<field name="NUM">1</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="controls_for_chainhull">' +
        '<value name="FROM">' +
          '<block type="math_number">' +
            '<field name="NUM">1</field>' +
          '</block> ' +
        '</value>' +
        '<value name="TO">' +
          '<block type="math_number">' +
            '<field name="NUM">10</field>' +
          '</block>' +
        '</value>' +
        '<value name="BY">' +
          '<block type="math_number">' +
            '<field name="NUM">1</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
    '</category>';

Blockscad.Toolbox.catOther = '<category name="Advanced">' +
      '<block type="torus">' +
        '<value name="RAD1">' +
          '<block type="math_number">' +
            '<field name="NUM">4</field>' +
          '</block>' +
        '</value>' +
        '<value name="RAD2">' +
          '<block type="math_number">' +
            '<field name="NUM">1</field>' +
          '</block>' +
        '</value>' +
        '<value name="SIDES">' +
          '<block type="math_number">' +
            '<field name="NUM">8</field>' +
          '</block>' +
        '</value>' +
        '<value name="FACES">' +
          '<block type="math_number">' +
            '<field name="NUM">3</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="bs_text">' + 
        '<value name="SIZE">' +
          '<block type="math_number">' +
            '<field name="NUM">10</field>' +
          '</block>' +
        '</value>' + 
      '</block>' +
      '<block type="rotateextrudetwist">' +
        '<value name="RAD">' +
          '<block type="math_number">' +
            '<field name="NUM">10</field>' +
          '</block>' +
        '</value>' +
        '<value name="FACES">' +
          '<block type="math_number">' +
            '<field name="NUM">5</field>' +
          '</block>' +
        '</value>' +
        '<value name="TWIST">' +
          '<block type="math_number">' +
            '<field name="NUM">360</field>' +
          '</block>' +
        '</value>' +
        '<value name="TSTEPS">' +
          '<block type="math_number">' +
            '<field name="NUM">180</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
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
      '<block type="fancyrotate">' +
        '<value name="AVAL">' +
          '<block type="math_angle">' +
            '<field name="NUM">0</field>' +
          '</block>' +
        '</value>' +
        '<value name="XVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">0</field>' +
          '</block>' +
        '</value>' +
        '<value name="YVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">0</field>' +
          '</block>' +
        '</value>' +
        '<value name="ZVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">0</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="fancymirror">' +
        '<value name="XVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">1</field>' +
          '</block>' +
        '</value>' +
        '<value name="YVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">1</field>' +
          '</block>' +
        '</value>' +
        '<value name="ZVAL">' +
          '<block type="math_number">' +
            '<field name="NUM">1</field>' +
          '</block>' +
        '</value>' +
      '</block>' +
      '<block type="stl_import"></block>' +
    '</category>' +
    '<category name="Variables" custom="VARIABLE"></category>' +
    '<category name="Modules" custom="PROCEDURE"></category>' +
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
Blockscad.Toolbox.sim += Blockscad.Toolbox.cat_3D;
// Blockscad.Toolbox.sim += Blockscad.Toolbox.cat2D;
Blockscad.Toolbox.sim += Blockscad.Toolbox.catTransform_sim;
Blockscad.Toolbox.sim += Blockscad.Toolbox.catSetOps_sim;
Blockscad.Toolbox.sim += Blockscad.Toolbox.catMathLogic_sim;
//Blockscad.Toolbox.sim += Blockscad.Toolbox.catLoops_sim;
//Blockscad.Toolbox.sim += Blockscad.Toolbox.catOther_sim;