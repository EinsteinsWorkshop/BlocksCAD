'use strict'

goog.provide('Blockly.OpenJSCAD.primitives');
goog.require('Blockly.OpenJSCAD');

Blockly.OpenJSCAD['sphere'] = function(block) {
  var value_rad = Blockly.OpenJSCAD.valueToCode(block, 'RAD', Blockly.OpenJSCAD.ORDER_ATOMIC);
//  var code = 'sphere(' + 'r=' + value_rad + ');';
  var code = 'sphere({r:' + value_rad + ', center: true});';
  return code;
};


Blockly.OpenJSCAD['cylinder'] = function(block) {
  var value_rad1 = Blockly.OpenSCAD.valueToCode(block, 'RAD1', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_rad2 = Blockly.OpenSCAD.valueToCode(block, 'RAD2', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_height = Blockly.OpenSCAD.valueToCode(block, 'HEIGHT', Blockly.OpenSCAD.ORDER_ATOMIC);
  var dropdown_center = block.getFieldValue('CENTERDROPDOWN');
  var code = 'cylinder(' + 'r1=' + value_rad1 + ', r2=' + value_rad2 + ', h=' + value_height +', center=' + dropdown_center + ');';
  return code;
};

Blockly.OpenJSCAD['cube'] = function(block) {
  var value_xval = Blockly.OpenJSCAD.valueToCode(block, 'XVAL', Blockly.OpenJSCAD.ORDER_ATOMIC);
  var value_yval = Blockly.OpenJSCAD.valueToCode(block, 'YVAL', Blockly.OpenJSCAD.ORDER_ATOMIC);
  var value_zval = Blockly.OpenJSCAD.valueToCode(block, 'ZVAL', Blockly.OpenJSCAD.ORDER_ATOMIC);
  var dropdown_center = block.getFieldValue('CENTERDROPDOWN');
  var code = 'cube([' + value_xval + ', ' + value_yval + ', ' + value_zval + '], center=' + dropdown_center + ');';
  return code;
};

Blockly.OpenJSCAD['union'] = function(block) {
  var statements_a = Blockly.OpenJSCAD.statementToCode(block, 'A');
  var statements_b = Blockly.OpenJSCAD.statementToCode(block, 'B'); 
  var code = 'union(){\n\t' + statements_a + '\n\t' + statements_b + '\n}\n';
  return code;
};

Blockly.OpenJSCAD['difference'] = function(block) {
  var statements_a = Blockly.OpenJSCAD.statementToCode(block, 'A');
  var statements_b = Blockly.OpenJSCAD.statementToCode(block, 'B');
  var code = 'difference(){\n\t' + statements_a + '\n\t' + statements_b + '\n}\n';
  return code;
};

Blockly.OpenJSCAD['intersection'] = function(block) {
  var statements_a = Blockly.OpenJSCAD.statementToCode(block, 'A');
  var statements_b = Blockly.OpenJSCAD.statementToCode(block, 'B');
  var code = 'intersection(){\n\t' + statements_a + '\n\t' + statements_b + '\n}\n';
  return code;
};

Blockly.OpenJSCAD['hull'] = function(block) {
  var statements_a = Blockly.OpenJSCAD.statementToCode(block, 'A');
  var statements_b = Blockly.OpenJSCAD.statementToCode(block, 'B');
  var code = 'hull(){\n\t' + statements_a + '\n\t' + statements_b + '\n}\n';
  return code;
};

Blockly.OpenJSCAD['scale'] = function(block) {
  var value_xval = Blockly.OpenJSCAD.valueToCode(block, 'XVAL', Blockly.OpenJSCAD.ORDER_ATOMIC);
  var value_yval = Blockly.OpenJSCAD.valueToCode(block, 'YVAL', Blockly.OpenJSCAD.ORDER_ATOMIC);
  var value_zval = Blockly.OpenJSCAD.valueToCode(block, 'ZVAL', Blockly.OpenJSCAD.ORDER_ATOMIC);
  var statements_a = Blockly.OpenJSCAD.statementToCode(block, 'A');
  var code = 'scale([' + value_xval + ', ' + value_yval + ', ' + value_zval + ']){\n\t' + statements_a + '\n}\n';
  return code;
};

Blockly.OpenJSCAD['resize'] = function(block) {
  var value_xval = Blockly.OpenJSCAD.valueToCode(block, 'XVAL', Blockly.OpenJSCAD.ORDER_ATOMIC);
  var value_yval = Blockly.OpenJSCAD.valueToCode(block, 'YVAL', Blockly.OpenJSCAD.ORDER_ATOMIC);
  var value_zval = Blockly.OpenJSCAD.valueToCode(block, 'ZVAL', Blockly.OpenJSCAD.ORDER_ATOMIC);
  var statements_a = Blockly.OpenJSCAD.statementToCode(block, 'A');
  var code = 'resize([' + value_xval + ', ' + value_yval + ', ' + value_zval + ']){\n\t' + statements_a + '\n}\n';
  return code;
};

Blockly.OpenJSCAD['translate'] = function(block) {
  var value_xval = Blockly.OpenJSCAD.valueToCode(block, 'XVAL', Blockly.OpenJSCAD.ORDER_ATOMIC);
  var value_yval = Blockly.OpenJSCAD.valueToCode(block, 'YVAL', Blockly.OpenJSCAD.ORDER_ATOMIC);
  var value_zval = Blockly.OpenJSCAD.valueToCode(block, 'ZVAL', Blockly.OpenJSCAD.ORDER_ATOMIC);
  var statements_a = Blockly.OpenJSCAD.statementToCode(block, 'A');
  var code = 'translate([' + value_xval + ', ' + value_yval + ', ' + value_zval + ']){\n\t' + statements_a + '\n}\n';
  return code;
};

Blockly.OpenJSCAD['fancymirror'] = function(block) {
  var value_xval = Blockly.OpenJSCAD.valueToCode(block, 'XVAL', Blockly.OpenJSCAD.ORDER_ATOMIC);
  var value_yval = Blockly.OpenJSCAD.valueToCode(block, 'YVAL', Blockly.OpenJSCAD.ORDER_ATOMIC);
  var value_zval = Blockly.OpenJSCAD.valueToCode(block, 'ZVAL', Blockly.OpenJSCAD.ORDER_ATOMIC);
  var statements_a = Blockly.OpenJSCAD.statementToCode(block, 'A');
  var code = 'translate([' + value_xval + ', ' + value_yval + ', ' + value_zval + ']){\n\t' + statements_a + '\n}\n';
  return code;
};

Blockly.OpenJSCAD['simplerotate'] = function(block) {
  var angle_xval = block.getFieldValue('XVAL');
  var angle_yval = block.getFieldValue('YVAL');
  var angle_zval = block.getFieldValue('ZVAL');
  var statements_a = Blockly.OpenJSCAD.statementToCode(block, 'A');
  var code = 'rotate([' + angle_xval + ', ' + angle_yval + ', ' + angle_zval + ']){\n\t' + statements_a + '\n}\n';
  return code;
};

Blockly.OpenJSCAD['fancyrotate'] = function(block) {
  var angle_aval = block.getFieldValue('AVAL');
  var value_xval = Blockly.OpenJSCAD.valueToCode(block, 'XVAL', Blockly.OpenJSCAD.ORDER_ATOMIC);
  var value_yval = Blockly.OpenJSCAD.valueToCode(block, 'YVAL', Blockly.OpenJSCAD.ORDER_ATOMIC);
  var value_zval = Blockly.OpenJSCAD.valueToCode(block, 'ZVAL', Blockly.OpenJSCAD.ORDER_ATOMIC);
  var statements_a = Blockly.OpenJSCAD.statementToCode(block, 'A');
  var code = 'rotate(a=' + angle_aval + ',[' + value_xval + ', ' + value_yval + ', ' + value_zval + ']){\n\t' + statements_a + '\n}\n';
  return code;
};

Blockly.OpenJSCAD['simplemirror'] = function(block) {
  var statements_a = Blockly.OpenJSCAD.statementToCode(block, 'A');
  var dropdown_sign = block.getFieldValue('sign');
  var dropdown_mirrorplane = block.getFieldValue('mirrorplane');
  var vec;
  if (dropdown_mirrorplane == "XY") {
    if (dropdown_sign == "pos") {
      vec = "[0,0,1]";
    } else {
      vec = "[0,0,-1]";
    }
  } else if (dropdown_mirrorplane == "YZ") {
    if (dropdown_sign == "pos") {
      vec = "[1,0,0]";
    } else {
      vec = "[-1,0,0]";
    }
  } else if (dropdown_mirrorplane == "XZ") {
    if (dropdown_sign == "pos") {
      vec = "[0,1,0]";
    } else {
      vec = "[0,-1,0]";
    }
  }

  var code = 'mirror(' + vec + '){\n\t' + statements_a + '\n}\n';
  return code;
};


Blockly.OpenJSCAD['shape'] = function(block) {
  var statements_name = Blockly.OpenJSCAD.statementToCode(block, 'NAME');
  var code = 'function main() {\n' + statements_a + '\n}';
  return code;
};



