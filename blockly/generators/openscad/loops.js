/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating OpenSCAD for loop blocks.
 * @author fraser@google.com (Neil Fraser) modified by Jayod
 * unimplemented blocks copied from OpenJSCAD are commented out
 */
'use strict';

goog.provide('Blockly.OpenSCAD.loops');

goog.require('Blockly.OpenSCAD');

/*
Blockly.OpenSCAD['controls_repeat'] = function(block) {
  // Repeat n times (internal number).
  var repeats = Number(block.getFieldValue('TIMES'));
  var branch = Blockly.OpenSCAD.statementToCode(block, 'DO');
  if (Blockly.OpenSCAD.INFINITE_LOOP_TRAP) {
    branch = Blockly.OpenSCAD.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }
  var loopVar = Blockly.OpenSCAD.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  var code = 'for (var ' + loopVar + ' = 0; ' +
      loopVar + ' < ' + repeats + '; ' +
      loopVar + '++) {\n' +
      branch + '}\n';
  return code;
};
*/

Blockly.OpenSCAD['controls_repeat_ext'] = function(block) {
  // Repeat n times (external number).
  var repeats = Blockly.OpenSCAD.valueToCode(block, 'TIMES',
      Blockly.OpenSCAD.ORDER_ASSIGNMENT) || '0';
  var branch = Blockly.OpenSCAD.statementToCode(block, 'DO');
  if (Blockly.OpenSCAD.INFINITE_LOOP_TRAP) {
    branch = Blockly.OpenSCAD.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }
  var code = '';
  var loopVar = Blockly.OpenSCAD.variableDB_.getDistinctName(
      'count', Blockly.Variables.NAME_TYPE);
  var endVar = repeats - 1;
  if (!repeats.match(/^\w+$/) && !Blockly.isNumber(repeats)) {
    var endVar = Blockly.OpenSCAD.variableDB_.getDistinctName(
        'repeat_end', Blockly.Variables.NAME_TYPE);
    code += 'var ' + endVar + ' = ' + repeats + ';\n';
  }
  code += 'for (' + loopVar + ' = [0 : ' + endVar + ']) ' + ' {\n' +
      branch + '}\n';
  return code;
};

/*
Blockly.OpenSCAD['controls_whileUntil'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.OpenSCAD.valueToCode(block, 'BOOL',
      until ? Blockly.OpenSCAD.ORDER_LOGICAL_NOT :
      Blockly.OpenSCAD.ORDER_NONE) || 'false';
  var branch = Blockly.OpenSCAD.statementToCode(block, 'DO');
  if (Blockly.OpenSCAD.INFINITE_LOOP_TRAP) {
    branch = Blockly.OpenSCAD.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }
  if (until) {
    argument0 = '!' + argument0;
  }
  return 'while (' + argument0 + ') {\n' + branch + '}\n';
};
*/

Blockly.OpenSCAD['controls_for'] = function(block) {
  // For loop.
  var variable0 = Blockly.OpenSCAD.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.OpenSCAD.valueToCode(block, 'FROM',
      Blockly.OpenSCAD.ORDER_ASSIGNMENT) || '0';
  var argument1 = Blockly.OpenSCAD.valueToCode(block, 'TO',
      Blockly.OpenSCAD.ORDER_ASSIGNMENT) || '0';
  var increment = Blockly.OpenSCAD.valueToCode(block, 'BY',
      Blockly.OpenSCAD.ORDER_ASSIGNMENT) || '1';
  var branch = Blockly.OpenSCAD.statementToCode(block, 'DO');

  if (Blockly.OpenSCAD.INFINITE_LOOP_TRAP) {
    branch = Blockly.OpenSCAD.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }

  var code;

    // Jennie - OpenSCAD is weird - increments can never be negative, even 
    // when you are counting down in a loop.  I'll absolute value the increment 
    // given to make it make sense

    //increment = abs(increment);
    code = 'for (' + variable0 + ' = [' + argument0 + ' : ' +
        'abs(' + increment + ') : ' + argument1 + ']';    
    code += ') {\n' + branch + '\n}';
   
  return code;
};

Blockly.OpenSCAD['controls_for_chainhull'] = function(block) {
  // For loop.
  var variable0 = Blockly.OpenSCAD.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.OpenSCAD.valueToCode(block, 'FROM',
      Blockly.OpenSCAD.ORDER_ASSIGNMENT) || '0';
  var argument1 = Blockly.OpenSCAD.valueToCode(block, 'TO',
      Blockly.OpenSCAD.ORDER_ASSIGNMENT) || '0';
  var increment = Blockly.OpenSCAD.valueToCode(block, 'BY',
      Blockly.OpenSCAD.ORDER_ASSIGNMENT) || '1';
  var branch = Blockly.OpenSCAD.statementToCode(block, 'DO');

  var query = "([^a-z|A-Z])" + variable0 + "(?![a-z|A-Z])"; 
  var re = new RegExp(query, 'g');
  // console.log("reg exp = ", re);
  var new_string = "("+ variable0 + " + " + increment + ")";

  var branch_next = branch.replace(re, "$1" + new_string); 
  //branch_next = branch_next.replace(re, new_string); 

  // console.log("branch = ", branch);

  if (Blockly.OpenSCAD.INFINITE_LOOP_TRAP) {
    branch = Blockly.OpenSCAD.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }

  var code;
  code = "// chain hull"

    // Jennie - OpenSCAD is weird - increments can never be negative, even 
    // when you are counting down in a loop.  I'll absolute value the increment 
    // given to make it make sense

    //increment = abs(increment);
    code = 'for (' + variable0 + ' = [' + argument0 + ' : ' +
        'abs(' + increment + ') : ' + argument1 + " - " + increment  + ']';    
    code += ') {\n' +  '  hull() {\n' + branch + '\n' + branch_next + '\n  }' + '\n}';
   
  return code;
};
/*
Blockly.OpenSCAD['controls_forEach'] = function(block) {
  // For each loop.
  var variable0 = Blockly.OpenSCAD.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.OpenSCAD.valueToCode(block, 'LIST',
      Blockly.OpenSCAD.ORDER_ASSIGNMENT) || '[]';
  var branch = Blockly.OpenSCAD.statementToCode(block, 'DO');
  if (Blockly.OpenSCAD.INFINITE_LOOP_TRAP) {
    branch = Blockly.OpenSCAD.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }
  var indexVar = Blockly.OpenSCAD.variableDB_.getDistinctName(
      variable0 + '_index', Blockly.Variables.NAME_TYPE);
  branch = '  ' + variable0 + ' = ' + argument0 + '[' + indexVar + '];\n' +
      branch;
  var code = 'for (var ' + indexVar + ' in  ' + argument0 + ') {\n' +
      branch + '}\n';
  return code;
};

Blockly.OpenSCAD['controls_flow_statements'] = function(block) {
  // Flow statements: continue, break.
  switch (block.getFieldValue('FLOW')) {
    case 'BREAK':
      return 'break;\n';
    case 'CONTINUE':
      return 'continue;\n';
  }
  throw 'Unknown flow statement.';
};
*/
