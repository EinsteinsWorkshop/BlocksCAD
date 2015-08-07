'use strict';

goog.provide('Blockly.OpenSCAD.math');

goog.require('Blockly.OpenSCAD');

Blockly.OpenSCAD['math_number'] = function(block) {
  // Numeric value.
  var code = parseFloat(block.getFieldValue('NUM'));
  return [code, Blockly.OpenSCAD.ORDER_ATOMIC];
};

Blockly.OpenSCAD['math_angle'] = function(block) {
  // Numeric value.
  var code = parseFloat(block.getFieldValue('NUM'));
  return [code, Blockly.OpenSCAD.ORDER_ATOMIC];
};

Blockly.OpenSCAD['math_arithmetic'] = function(block) {
  // Basic arithmetic operators and power.
  var OPERATORS = {
    ADD: [' + ', Blockly.OpenSCAD.ORDER_ADDITION],
    MINUS: [' - ', Blockly.OpenSCAD.ORDER_SUBTRACTION],
    MULTIPLY: [' * ', Blockly.OpenSCAD.ORDER_MULTIPLICATION],
    DIVIDE: [' / ', Blockly.OpenSCAD.ORDER_DIVISION],
    POWER: [null, Blockly.OpenSCAD.ORDER_COMMA]
  };
  var tuple = OPERATORS[block.getFieldValue('OP')];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.OpenSCAD.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.OpenSCAD.valueToCode(block, 'B', order) || '0';
  var code;
  //Power in OpenSCAD uses a special case since it has no operator.
  if (!operator) {
    code = 'pow(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.OpenSCAD.ORDER_FUNCTION_CALL];
  }
  code = argument0 + operator + argument1;
  return [code, order];
};


Blockly.OpenSCAD['math_single'] = function(block) {
  // Math operators with single operand.
  var operator = block.getFieldValue('OP');
  var code;
  var arg;
  if (operator == 'NEG') {
    // Negation is a special case given its different operator precedence.
    arg = Blockly.OpenSCAD.valueToCode(block, 'NUM',
        Blockly.OpenSCAD.ORDER_UNARY_NEGATION) || '0';
    if (arg[0] == '-') {
      // --3 is not legal in JS.
      arg = ' ' + arg;
    }
    code = '-' + arg;
    return [code, Blockly.OpenSCAD.ORDER_UNARY_NEGATION];
  }
  if (operator == 'SIN' || operator == 'COS' || operator == 'TAN') {
    arg = Blockly.OpenSCAD.valueToCode(block, 'NUM',
        Blockly.OpenSCAD.ORDER_DIVISION) || '0';
  } else {
    arg = Blockly.OpenSCAD.valueToCode(block, 'NUM',
        Blockly.OpenSCAD.ORDER_NONE) || '0';
  }
  // First, handle cases which generate values that don't need parentheses
  // wrapping the code.
  switch (operator) {
    case 'ABS':
      code = 'abs(' + arg + ')';
      break;
    case 'ROOT':
      code = 'sqrt(' + arg + ')';
      break;
    case 'LN':
      code = 'ln(' + arg + ')';
      break;
    case 'EXP':
      code = 'exp(' + arg + ')';
      break;
    case 'POW10':
      code = 'pow(10,' + arg + ')';
      break;
    case 'ROUND':
      code = 'round(' + arg + ')';
      break;
    case 'ROUNDUP':
      code = 'ceil(' + arg + ')';
      break;
    case 'ROUNDDOWN':
      code = 'floor(' + arg + ')';
      break;
    case 'SIN':
      code = 'sin(' + arg + ')';
      break;
    case 'COS':
      code = 'cos(' + arg + ')';
      break;
    case 'TAN':
      code = 'tan(' + arg + ')';
      break;
  }
  if (code) {
    return [code, Blockly.OpenSCAD.ORDER_FUNCTION_CALL];
  }
  // Second, handle cases which generate values that may need parentheses
  // wrapping the code.
  switch (operator) {
    case 'LOG10':
      code = 'log(' + arg + ')';
      break;
    case 'ASIN':
      code = 'asin(' + arg + ')';
      break;
    case 'ACOS':
      code = 'acos(' + arg + ')';
      break;
    case 'ATAN':
      code = 'atan(' + arg + ')';
      break;
    default:
      throw 'Unknown math operator: ' + operator;
  }
  return [code, Blockly.OpenSCAD.ORDER_DIVISION];
};

Blockly.OpenSCAD['math_constant_bs'] = function(block) {
  // Constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2).
  var CONSTANTS = {
    PI: ['3.14159', Blockly.OpenSCAD.ORDER_MEMBER],
    E: ['2.71828', Blockly.OpenSCAD.ORDER_MEMBER],
    GOLDEN_RATIO: ['(1 + sqrt(5)) / 2', Blockly.OpenSCAD.ORDER_DIVISION],
    SQRT2: ['sqrt(2)', Blockly.OpenSCAD.ORDER_MEMBER],
    SQRT1_2: ['sqrt(1/2)', Blockly.OpenSCAD.ORDER_MEMBER]
  };
  return CONSTANTS[block.getFieldValue('CONSTANT')];
};

// This is just for backwards compatibility!
Blockly.OpenSCAD['math_constant'] = function(block) {
  // Constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2).
  var CONSTANTS = {
    PI: ['3.14159', Blockly.OpenSCAD.ORDER_MEMBER],
    E: ['2.71828', Blockly.OpenSCAD.ORDER_MEMBER],
    GOLDEN_RATIO: ['(1 + sqrt(5)) / 2', Blockly.OpenSCAD.ORDER_DIVISION],
    SQRT2: ['sqrt(2)', Blockly.OpenSCAD.ORDER_MEMBER],
    SQRT1_2: ['sqrt(1/2)', Blockly.OpenSCAD.ORDER_MEMBER]
  };
  return CONSTANTS[block.getFieldValue('CONSTANT')];
};

Blockly.OpenSCAD['math_number_property'] = function(block) {
  // Check if a number is even, odd, prime, whole, positive, or negative
  // or if it is divisible by certain number. Returns true or false.
  var number_to_check = Blockly.OpenSCAD.valueToCode(block, 'NUMBER_TO_CHECK',
      Blockly.OpenSCAD.ORDER_MODULUS) || '0';
  var dropdown_property = block.getFieldValue('PROPERTY');
  var code;
  if (dropdown_property == 'PRIME') {
    // Prime is a special case as it is not a one-liner test.
    var functionName = Blockly.OpenSCAD.provideFunction_(
        'math_isPrime',
        [ 'function ' + Blockly.OpenSCAD.FUNCTION_NAME_PLACEHOLDER_ + '(n) =',
          '  // https://en.wikipedia.org/wiki/Primality_test#Naive_methods',
          '  if (n == 2 || n == 3) {',
          '    1;',
          '  }',
          '  // False if n is NaN, negative, is 1, or not whole.',
          '  // And false if n is divisible by 2 or 3.',
          '  // Cant check for NaN in openscad.',
          '  if ( n <= 1 || n % 1 != 0 || n % 2 == 0 ||' +
            ' n % 3 == 0) {',
          '    0',
          '  }',
          '  // Check all the numbers of form 6k +/- 1, up to sqrt(n).',
          '  for (x = [6:6:sqrt(n)]) {',
          '    if (n % (x - 1) == 0 || n % (x + 1) == 0) {',
          '      0;',
          '    }',
          '  }',
          '  1;',
          '}']);
    code = functionName + '(' + number_to_check + ')';
    return [code, Blockly.OpenSCAD.ORDER_FUNCTION_CALL];
  }
  switch (dropdown_property) {
    case 'EVEN':
      code = number_to_check + ' % 2 == 0';
      break;
    case 'ODD':
      code = number_to_check + ' % 2 == 1';
      break;
    case 'WHOLE':
      code = number_to_check + ' % 1 == 0';
      break;
    case 'POSITIVE':
      code = number_to_check + ' > 0';
      break;
    case 'NEGATIVE':
      code = number_to_check + ' < 0';
      break;
    case 'DIVISIBLE_BY':
      var divisor = Blockly.OpenSCAD.valueToCode(block, 'DIVISOR',
          Blockly.OpenSCAD.ORDER_MODULUS) || '0';
      code = number_to_check + ' % ' + divisor + ' == 0';
      break;
  }
  return [code, Blockly.OpenSCAD.ORDER_EQUALITY];
};

Blockly.OpenSCAD['math_change'] = function(block) {
  // Add to a variable in place.
  //TODO fix this for OpenSCAD. Possibly using the assign() function.
  var argument0 = Blockly.OpenSCAD.valueToCode(block, 'DELTA',
      Blockly.OpenSCAD.ORDER_ADDITION) || '0';
  var varName = Blockly.OpenSCAD.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return varName + ' = (typeof ' + varName + ' == \'number\' ? ' + varName +
      ' : 0) + ' + argument0 + ';\n';
};

// Rounding functions have a single operand.
Blockly.OpenSCAD['math_round'] = Blockly.OpenSCAD['math_single'];
// Trigonometry functions have a single operand.
Blockly.OpenSCAD['math_trig'] = Blockly.OpenSCAD['math_single'];

Blockly.OpenSCAD['math_on_list'] = function(block) {
  // Math functions for lists.
  // TODO fix this for OpenSCAD. min and max are 2-operand in openscad, there is no avg, median, etc.
  var func = block.getFieldValue('OP');
  var list, code;
  switch (func) {
    case 'SUM':
      list = Blockly.OpenSCAD.valueToCode(block, 'LIST',
          Blockly.OpenSCAD.ORDER_MEMBER) || '[]';
      code = list + '.reduce(function(x, y) {return x + y;})';
      break;
    case 'MIN':
      list = Blockly.OpenSCAD.valueToCode(block, 'LIST',
          Blockly.OpenSCAD.ORDER_COMMA) || '[]';
      code = 'Math.min.apply(null, ' + list + ')';
      break;
    case 'MAX':
      list = Blockly.OpenSCAD.valueToCode(block, 'LIST',
          Blockly.OpenSCAD.ORDER_COMMA) || '[]';
      code = 'Math.max.apply(null, ' + list + ')';
      break;
    case 'AVERAGE':
      // math_median([null,null,1,3]) == 2.0.
      var functionName = Blockly.OpenSCAD.provideFunction_(
          'math_mean',
          [ 'function ' + Blockly.OpenSCAD.FUNCTION_NAME_PLACEHOLDER_ +
              '(myList) {',
            '  return myList.reduce(function(x, y) {return x + y;}) / ' +
                  'myList.length;',
            '}']);
      list = Blockly.OpenSCAD.valueToCode(block, 'LIST',
          Blockly.OpenSCAD.ORDER_NONE) || '[]';
      code = functionName + '(' + list + ')';
      break;
    case 'MEDIAN':
      // math_median([null,null,1,3]) == 2.0.
      var functionName = Blockly.OpenSCAD.provideFunction_(
          'math_median',
          [ 'function ' + Blockly.OpenSCAD.FUNCTION_NAME_PLACEHOLDER_ +
              '(myList) {',
            '  var localList = myList.filter(function (x) ' +
              '{return typeof x == \'number\';});',
            '  if (!localList.length) return null;',
            '  localList.sort(function(a, b) {return b - a;});',
            '  if (localList.length % 2 == 0) {',
            '    return (localList[localList.length / 2 - 1] + ' +
              'localList[localList.length / 2]) / 2;',
            '  } else {',
            '    return localList[(localList.length - 1) / 2];',
            '  }',
            '}']);
      list = Blockly.OpenSCAD.valueToCode(block, 'LIST',
          Blockly.OpenSCAD.ORDER_NONE) || '[]';
      code = functionName + '(' + list + ')';
      break;
    case 'MODE':
      // As a list of numbers can contain more than one mode,
      // the returned result is provided as an array.
      // Mode of [3, 'x', 'x', 1, 1, 2, '3'] -> ['x', 1].
      var functionName = Blockly.OpenSCAD.provideFunction_(
          'math_modes',
          [ 'function ' + Blockly.OpenSCAD.FUNCTION_NAME_PLACEHOLDER_ +
              '(values) {',
            '  var modes = [];',
            '  var counts = [];',
            '  var maxCount = 0;',
            '  for (var i = 0; i < values.length; i++) {',
            '    var value = values[i];',
            '    var found = false;',
            '    var thisCount;',
            '    for (var j = 0; j < counts.length; j++) {',
            '      if (counts[j][0] === value) {',
            '        thisCount = ++counts[j][1];',
            '        found = true;',
            '        break;',
            '      }',
            '    }',
            '    if (!found) {',
            '      counts.push([value, 1]);',
            '      thisCount = 1;',
            '    }',
            '    maxCount = Math.max(thisCount, maxCount);',
            '  }',
            '  for (var j = 0; j < counts.length; j++) {',
            '    if (counts[j][1] == maxCount) {',
            '        modes.push(counts[j][0]);',
            '    }',
            '  }',
            '  return modes;',
            '}']);
      list = Blockly.OpenSCAD.valueToCode(block, 'LIST',
          Blockly.OpenSCAD.ORDER_NONE) || '[]';
      code = functionName + '(' + list + ')';
      break;
    case 'STD_DEV':
      var functionName = Blockly.OpenSCAD.provideFunction_(
          'math_standard_deviation',
          [ 'function ' + Blockly.OpenSCAD.FUNCTION_NAME_PLACEHOLDER_ +
              '(numbers) {',
            '  var n = numbers.length;',
            '  if (!n) return null;',
            '  var mean = numbers.reduce(function(x, y) {return x + y;}) / n;',
            '  var variance = 0;',
            '  for (var j = 0; j < n; j++) {',
            '    variance += Math.pow(numbers[j] - mean, 2);',
            '  }',
            '  variance = variance / n;',
            '  return Math.sqrt(variance);',
            '}']);
      list = Blockly.OpenSCAD.valueToCode(block, 'LIST',
          Blockly.OpenSCAD.ORDER_NONE) || '[]';
      code = functionName + '(' + list + ')';
      break;
    case 'RANDOM':
      var functionName = Blockly.OpenSCAD.provideFunction_(
          'math_random_list',
          [ 'function ' + Blockly.OpenSCAD.FUNCTION_NAME_PLACEHOLDER_ +
              '(list) {',
            '  var x = Math.floor(Math.random() * list.length);',
            '  return list[x];',
            '}']);
      list = Blockly.OpenSCAD.valueToCode(block, 'LIST',
          Blockly.OpenSCAD.ORDER_NONE) || '[]';
      code = functionName + '(' + list + ')';
      break;
    default:
      throw 'Unknown operator: ' + func;
  }
  return [code, Blockly.OpenSCAD.ORDER_FUNCTION_CALL];
};

Blockly.OpenSCAD['math_modulo'] = function(block) {
  // Remainder computation.
  var argument0 = Blockly.OpenSCAD.valueToCode(block, 'DIVIDEND',
      Blockly.OpenSCAD.ORDER_MODULUS) || '0';
  var argument1 = Blockly.OpenSCAD.valueToCode(block, 'DIVISOR',
      Blockly.OpenSCAD.ORDER_MODULUS) || '0';
  var code = argument0 + ' % ' + argument1;
  return [code, Blockly.OpenSCAD.ORDER_MODULUS];
};

Blockly.OpenSCAD['math_constrain'] = function(block) {
  // Constrain a number between two limits.
  // TODO fix for OpenSCAD
  var argument0 = Blockly.OpenSCAD.valueToCode(block, 'VALUE',
      Blockly.OpenSCAD.ORDER_COMMA) || '0';
  var argument1 = Blockly.OpenSCAD.valueToCode(block, 'LOW',
      Blockly.OpenSCAD.ORDER_COMMA) || '0';
  var argument2 = Blockly.OpenSCAD.valueToCode(block, 'HIGH',
      Blockly.OpenSCAD.ORDER_COMMA) || 'Infinity';
  var code = 'min(max(' + argument0 + ', ' + argument1 + '), ' +
      argument2 + ')';
  return [code, Blockly.OpenSCAD.ORDER_FUNCTION_CALL];
};

Blockly.OpenSCAD['math_random_int'] = function(block) {
  // Random integer between [X] and [Y].
  var argument0 = Blockly.OpenSCAD.valueToCode(block, 'FROM',
      Blockly.OpenSCAD.ORDER_COMMA) || '0';
  var argument1 = Blockly.OpenSCAD.valueToCode(block, 'TO',
      Blockly.OpenSCAD.ORDER_COMMA) || '0';
/*  var functionName = Blockly.OpenSCAD.provideFunction_(
      'math_random_int',
      [ 'function ' + Blockly.OpenSCAD.FUNCTION_NAME_PLACEHOLDER_ +
          '(a, b) {',
        '  if (a > b) {',
        '    // Swap a and b to ensure a is smaller.',
        '    var c = a;',
        '    a = b;',
        '    b = c;',
        '  }',
        '  return Math.floor(Math.random() * (b - a + 1) + a);',
        '}']);
  var code = functionName + '(' + argument0 + ', ' + argument1 + ')';
*/
  var code = 'round(rands(' + argument0 + ',' + argument1 + ',1)[0])';
  return [code, Blockly.OpenSCAD.ORDER_FUNCTION_CALL];
};

Blockly.OpenSCAD['math_random_float'] = function(block) {
  // Random fraction between 0 and 1.
  var code = 'rands(0,1,1)[0]';
  return [code, Blockly.OpenSCAD.ORDER_FUNCTION_CALL];
};


