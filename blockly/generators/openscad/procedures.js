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
 * @fileoverview Generating OpenSCAD for procedure blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.OpenSCAD.procedures');

goog.require('Blockly.OpenSCAD');


Blockly.OpenSCAD['procedures_defreturn'] = function(block) {
  // Define a procedure with a return value.
  var funcName = Blockly.OpenSCAD.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var returnValue = Blockly.OpenSCAD.valueToCode(block, 'RETURN',
      Blockly.OpenSCAD.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = returnValue + ';\n';
  }
  else returnValue = '0;\n';
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.OpenSCAD.variableDB_.getName(block.arguments_[x],
        Blockly.Variables.NAME_TYPE);
  }
  var code = 'function ' + funcName + '(' + args.join(', ') + ') = ' + returnValue;
  code = Blockly.OpenSCAD.scrub_(block, code);
  Blockly.OpenSCAD.definitions_[funcName] = code;
  return null;
};

Blockly.OpenSCAD['procedures_defnoreturn'] = function(block) {
  // Define a module with statements, but no return value.
  var funcName = Blockly.OpenSCAD.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.OpenSCAD.statementToCode(block, 'STACK');
  if (Blockly.OpenSCAD.INFINITE_LOOP_TRAP) {
    branch = Blockly.OpenSCAD.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.OpenSCAD.variableDB_.getName(block.arguments_[x],
        Blockly.Variables.NAME_TYPE);
  }
  var code = 'module ' + funcName + '(' + args.join(', ') + ') {\n';
  code += 'union() { //end assign\n';

  code += branch + '\n}';
  code += '} //end assign\n';
  code = Blockly.OpenSCAD.scrub_(block, code);
  Blockly.OpenSCAD.definitions_[funcName] = code;
  return null;
};



Blockly.OpenSCAD['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  var funcName = Blockly.OpenSCAD.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.OpenSCAD.valueToCode(block, 'ARG' + x,
        Blockly.OpenSCAD.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.OpenSCAD.ORDER_FUNCTION_CALL];
};

Blockly.OpenSCAD['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  var funcName = Blockly.OpenSCAD.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.OpenSCAD.valueToCode(block, 'ARG' + x,
        Blockly.OpenSCAD.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ');';
  return code;
};

Blockly.OpenSCAD['procedures_ifreturn'] = function(block) {
  // Conditionally return value from a procedure.
  var condition = Blockly.OpenSCAD.valueToCode(block, 'CONDITION',
      Blockly.OpenSCAD.ORDER_NONE) || 'false';
  var code = 'if (' + condition + ') {\n';
  if (block.hasReturnValue_) {
    var value = Blockly.OpenSCAD.valueToCode(block, 'VALUE',
        Blockly.OpenSCAD.ORDER_NONE) || 'null';
    code += '  return ' + value + ';\n';
  } else {
    code += '  return;\n';
  }
  code += '}\n';
  return code;
};
