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

  var varCode = Blockly.OpenSCAD.returnVarCode(block);
  var aC = varCode[0];
  var aP = varCode[1];

  var code = 'group(){\n' + aC + statements_a;
  for (n = 0; n<= block.plusCount_; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'PLUS' + n); 
    if (statements_b != '') code += statements_b + '\n';
  }
  code += aP + '}';
  return code;
};

// order matters.  That makes the variable assignment more of a pain here.

// also, I want to insert a easily/removed union around the stuff in the first bay, since 
// I don't implicitly union anymore.  Hopefully that's fast if it has a single object.

Blockly.OpenSCAD['difference'] = function(block) {
  var n = 0;
  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');
  if (statements_a != '') statements_a += '\n';

  var varCode = Blockly.OpenSCAD.returnVarCode(block);
  var aC = varCode[0];
  var aP = varCode[1];

  // var code = 'difference(){\n' + aC + statements_a + aP; 

  // without implicit unions in the parser, I want to explicitly union everything in the first
  // bay of the difference block.  However, since openscad DOES implicit unions, I don't
  // want the union in the code exported to openScad (redundant, plus confusing because
  // the user didn't request it).
  // So, I put the union in, and have my postprocessing strip it out before making the openscad
  // downloadable code.  So my parser sees the union.
  // the comment //end assign 
  // indicates that the line will be stripped for openscad code.  I should change that 
  // comment to better indicate what is going on.

  var code = 'difference() {\n';
  code += 'union() {  //end assign\n';
  code += aC + statements_a + aP;
  code += '\n }  //end assign\n'; 

  var takeAway = '';
  for (n = 0; n<= block.minusCount_; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'MINUS' + n); 
    if (statements_b != '') takeAway += statements_b + '\n';
  }
  var newAC = aC.slice(0, -1) + '//end assign\n';
  code += newAC + takeAway + aP + '}';
  return code;
};

// without implicit unions in the parser, I will explicitly union EVERY bay of intersection.
// with intersection, each object needs to be separate for variable assignment.  What a pain.
Blockly.OpenSCAD['intersection'] = function(block) {
  var n = 0;
  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');
  if (statements_a != '') statements_a += '\n';

  var varCode = Blockly.OpenSCAD.returnVarCode(block);
  var aC = varCode[0];
  var aP = varCode[1];
  var newAC = aC.slice(0, -1) + '//end assign\n';

  var code = 'intersection() {\n';
  code += 'union() {  //end assign\n';
  code += aC + statements_a + aP;
  code += '\n }  //end assign\n'; 

  // var code = 'intersection(){\n' + aC + statements_a + aP;
  for (n = 0; n<= block.withCount_; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'WITH' + n); 
    if (statements_b != '') {
      code += 'union() {  //end assign\n';
      code += newAC + statements_b + '\n' + aP;
      code += '\n }  //end assign\n'; 
    } 
  }
  code += '}';
  return code;
};

Blockly.OpenSCAD['hull'] = function(block) {
  var n = 0;
  var code = '';
  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');
  if (statements_a != '') statements_a += '\n';

  var varCode = Blockly.OpenSCAD.returnVarCode(block);
  var aC = varCode[0];
  var aP = varCode[1];

  code += 'hull(){\n' + aC + statements_a;
  for (n = 0; n<= block.withCount_; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'WITH' + n); 
    if (statements_b != '') code += statements_b + '\n';
  }
  code += aP + '}';
  return code;
};

Blockly.OpenSCAD['chull'] = function(block) {
  var n = 0;
  var code = '';

  var varCode = Blockly.OpenSCAD.returnVarCode(block);
  var aC = varCode[0];
  var aP = varCode[1];

  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');
  code += '// chain hull\n';
  code += 'union() {\n';
  code += '  hull(){\n  ' + aC + statements_a + '\n';
  for (n = 0; n<= block.withCount_ - 1; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'WITH' + n); 
    code += '  ' + statements_b + '\n';
    code += '  }\n';
    code += '  hull() {\n  ' + statements_b + '\n';
  }
  var last = Blockly.OpenSCAD.statementToCode(block, 'WITH' + block.withCount_);
  code += '  ' + last + '\n';
  code += aP + '  }\n}\n';
  return code;
};


