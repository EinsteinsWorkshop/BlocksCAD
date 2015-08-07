// geom_set_ops.js
// contains the code generation functions for the Geometric Set operations
// union, difference, intersection, and hull
// These blocks are mutators that can have a variable number of statements
// hence the loops.

'use strict'

goog.provide('Blockly.OpenSCAD.geom_set_ops');

goog.require('Blockly.OpenSCAD');


Blockly.OpenSCAD['union'] = function(block) {
  var n = 0;
  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');
  if (statements_a != '') statements_a += '\n';
  var code = 'union(){\n' + statements_a;
  for (n = 0; n<= block.plusCount_; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'PLUS' + n); 
    if (statements_b != '') code += statements_b + '\n';
  }
  code += '}';
  return code;
};

Blockly.OpenSCAD['difference'] = function(block) {
  var n = 0;
  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');
  if (statements_a != '') statements_a += '\n';
  var code = 'difference(){\n' + statements_a;
  for (n = 0; n<= block.minusCount_; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'MINUS' + n); 
    if (statements_b != '') code += statements_b + '\n';
  }
  code += '}';
  return code;
};

Blockly.OpenSCAD['intersection'] = function(block) {
  var n = 0;
  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');
  if (statements_a != '') statements_a += '\n';
  var code = 'intersection(){\n' + statements_a;
  for (n = 0; n<= block.withCount_; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'WITH' + n); 
    if (statements_b != '') code += statements_b + '\n';
  }
  code += '}';
  return code;
};

Blockly.OpenSCAD['hull'] = function(block) {
  var n = 0;
  var code = '';
  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');
  if (statements_a != '') statements_a += '\n';
  code += 'hull(){\n' + statements_a;
  for (n = 0; n<= block.withCount_; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'WITH' + n); 
    if (statements_b != '') code += statements_b + '\n';
  }
  code += '}';
  return code;
};

Blockly.OpenSCAD['chull'] = function(block) {
  var n = 0;
  var code = '';
  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');
  code += '// chain hull\n';
  code += 'union() {\n';
  code += '  hull(){\n  ' + statements_a + '\n';
  for (n = 0; n<= block.withCount_ - 1; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'WITH' + n); 
    code += '  ' + statements_b + '\n';
    code += '  }\n';
    code += '  hull() {\n  ' + statements_b + '\n';
  }
  var last = Blockly.OpenSCAD.statementToCode(block, 'WITH' + block.withCount_);
  code += '  ' + last + '\n';
  code += '  }\n}\n';
  return code;
};


