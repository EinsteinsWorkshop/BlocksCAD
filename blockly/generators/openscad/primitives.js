'use strict'

goog.provide('Blockly.OpenSCAD.primitives');

goog.require('Blockly.OpenSCAD');


Blockly.OpenSCAD['sphere'] = function(block) {
  var value_rad = Blockly.OpenSCAD.valueToCode(block, 'RAD', Blockly.OpenSCAD.ORDER_ATOMIC);

    // missing fields?
  if (!value_rad)
    Blockscad.missingFields.push(block.id);
  // illegal field value?
  if (value_rad && value_rad <= 0) {
    Blockscad.illegalValue.push(block.inputList[1].connection.targetBlock().id);
  }

  var code = 'sphere(' + 'r=' + value_rad + ');';
  return code;
};

Blockly.OpenSCAD['cylinder'] = function(block) {
  var value_rad1 = Blockly.OpenSCAD.valueToCode(block, 'RAD1', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_rad2 = Blockly.OpenSCAD.valueToCode(block, 'RAD2', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_height = Blockly.OpenSCAD.valueToCode(block, 'HEIGHT', Blockly.OpenSCAD.ORDER_ATOMIC);
  var dropdown_center = block.getFieldValue('CENTERDROPDOWN');
    // missing fields?
  if (!value_rad1 || !value_rad2 || !value_height)
    Blockscad.missingFields.push(block.id);
    // illegal field value?
    // console.log(block);

  // m1 and m2 will keep me from double-counting errors on blocks
  var m1 = false;
  var m2 = false;


  if (value_rad1 && value_rad1 < 0) {
    Blockscad.illegalValue.push(block.inputList[1].connection.targetBlock().id);
    m1 = true;
  }
  if (value_rad2 && value_rad2 < 0) {
    Blockscad.illegalValue.push(block.inputList[3].connection.targetBlock().id);
    m2 = true;
  }
  if ((!m1 && !m2) && value_rad1 && value_rad1 == 0) {
    if (value_rad2 && value_rad2 == 0) {
      Blockscad.illegalValue.push(block.inputList[1].connection.targetBlock().id);
      Blockscad.illegalValue.push(block.inputList[3].connection.targetBlock().id);
    }
  }
  if (value_height && value_height <= 0) 
    Blockscad.illegalValue.push(block.inputList[4].connection.targetBlock().id);

  var code = 'cylinder(' + 'r1=' + value_rad1 + ', r2=' + value_rad2 + ', h=' + value_height +', center=' + dropdown_center + ');';
  return code;
};

Blockly.OpenSCAD['simple_cylinder'] = function(block) {
  var value_rad1 = Blockly.OpenSCAD.valueToCode(block, 'RAD1', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_height = Blockly.OpenSCAD.valueToCode(block, 'HEIGHT', Blockly.OpenSCAD.ORDER_ATOMIC);
  var dropdown_center = block.getFieldValue('CENTERDROPDOWN');
    // missing fields?
  if (!value_rad1 || !value_height)
    Blockscad.missingFields.push(block.id);
    // illegal field value?
    // console.log(block);
  if (value_rad1 && value_rad1 <= 0) 
    Blockscad.illegalValue.push(block.inputList[1].connection.targetBlock().id);
  if (value_height && value_height <= 0) 
    Blockscad.illegalValue.push(block.inputList[3].connection.targetBlock().id);

  var code = 'cylinder(' + 'r=' + value_rad1 + ', h=' + value_height +', center=' + dropdown_center + ');';
  return code;
};

Blockly.OpenSCAD['cube'] = function(block) {
  var value_xval = Blockly.OpenSCAD.valueToCode(block, 'XVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_yval = Blockly.OpenSCAD.valueToCode(block, 'YVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_zval = Blockly.OpenSCAD.valueToCode(block, 'ZVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
  var dropdown_center = block.getFieldValue('CENTERDROPDOWN');
   // missing fields?
  if (!value_xval || !value_yval || !value_zval)
    Blockscad.missingFields.push(block.id); 
    // illegal field value?
     // console.log(block);
  if (value_xval && value_xval <= 0) 
    Blockscad.illegalValue.push(block.inputList[1].connection.targetBlock().id);
  if (value_yval && value_yval <= 0) 
    Blockscad.illegalValue.push(block.inputList[2].connection.targetBlock().id);
  if (value_zval && value_zval <= 0) 
    Blockscad.illegalValue.push(block.inputList[3].connection.targetBlock().id);

  var code = 'cube([' + value_xval + ', ' + value_yval + ', ' + value_zval + '], center=' + dropdown_center + ');';
  return code;
};

Blockly.OpenSCAD['torus'] = function(block) {
  var value_rad1 = Blockly.OpenSCAD.valueToCode(block, 'RAD1', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_rad2 = Blockly.OpenSCAD.valueToCode(block, 'RAD2', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_sides = Blockly.OpenSCAD.valueToCode(block, 'SIDES', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_faces = Blockly.OpenSCAD.valueToCode(block, 'FACES', Blockly.OpenSCAD.ORDER_ATOMIC);

  // missing fields?
  if (!value_rad1 || !value_rad2 || !value_sides || !value_faces)
    Blockscad.missingFields.push(block.id);
    // illegal field value?
     // console.log(block);
  if (value_rad1 && value_rad1 <= 0) 
    Blockscad.illegalValue.push(block.inputList[1].connection.targetBlock().id);
  if (value_rad2 && value_rad2 <= 0) 
    Blockscad.illegalValue.push(block.inputList[2].connection.targetBlock().id);
  // minimum number of sides and faces that makes sense is 3 (triangle!)
  if (value_sides<3) value_sides = 3;
  if (value_faces<3) value_faces = 3;

  var code = '// torus \nrotate_extrude($fn=' + value_sides + ') {\n  translate([' + value_rad1;
  code += ', 0, 0]) {\n    circle(r=' + value_rad2 + ', $fn=' + value_faces + ');\n  }\n}';
  return code;
};
Blockly.OpenSCAD['twistytorus'] = function(block) {
  console.log("in generator for twistytorus");
  var value_rad1 = Blockly.OpenSCAD.valueToCode(block, 'RAD1', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_rad2 = Blockly.OpenSCAD.valueToCode(block, 'RAD2', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_sides = Blockly.OpenSCAD.valueToCode(block, 'SIDES', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_faces = Blockly.OpenSCAD.valueToCode(block, 'FACES', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_twist = Blockly.OpenSCAD.valueToCode(block, 'TWIST', Blockly.OpenSCAD.ORDER_ATOMIC);

  console.log("value_twist is : ", value_twist);
  // missing fields?
  // missing twist is okay - it will just have 0 twist.
  if (!value_rad1 || !value_rad2 || !value_sides || !value_faces)
    Blockscad.missingFields.push(block.id);
      // illegal field value?
     // console.log(block);
  if (value_rad1 && value_rad1 <= 0) 
    Blockscad.illegalValue.push(block.inputList[1].connection.targetBlock().id);
  if (value_rad2 && value_rad2 <= 0) 
    Blockscad.illegalValue.push(block.inputList[2].connection.targetBlock().id);

  // minimum number of sides and faces that makes sense is 3 (triangle!)
  if (value_sides<3) value_sides = 3;
  if (value_faces<3) value_faces = 3;

  var code = '// torus \n'
  code += 'rotate_extrude($fn=' + value_sides + ',twist=' + value_twist + ') {\n  translate([' + value_rad1;
  code += ', 0, 0]) {\n    circle(r=' + value_rad2 + ', $fn=' + value_faces + ');\n  }\n}';
  return code;
};

Blockly.OpenSCAD['scale'] = function(block) {
  var value_xval = Blockly.OpenSCAD.valueToCode(block, 'XVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_yval = Blockly.OpenSCAD.valueToCode(block, 'YVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
  //console.log("in generator for scale",block.previousConnection.check_);
  var type = block.previousConnection.check_[0]; 
  var value_zval = Blockly.OpenSCAD.valueToCode(block, 'ZVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');

    // missing fields?

    if (!value_xval || !value_yval || (!value_zval && type == 'CSG'))
      Blockscad.missingFields.push(block.id);

  if (statements_a != '') statements_a += '\n';
  for (var n = 0; n<= block.plusCount_; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'PLUS' + n); 
    if (statements_b != '') statements_a += statements_b + '\n';
  } 
  if (type != 'CAG')
    var code = 'scale([' + value_xval + ', ' + value_yval + ', ' + value_zval + ']){\n' + statements_a + '}';
  else var code = 'scale([' + value_xval + ', ' + value_yval + ', 1]){\n' + statements_a + '}';
  return code;
};

// Blockly.OpenSCAD['resize'] = function(block) {
//   var value_xval = Blockly.OpenSCAD.valueToCode(block, 'XVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
//   var value_yval = Blockly.OpenSCAD.valueToCode(block, 'YVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
//   var value_zval = Blockly.OpenSCAD.valueToCode(block, 'ZVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
//   var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');
//   var code = 'resize([' + value_xval + ', ' + value_yval + ', ' + value_zval + ']){\n' + statements_a + '\n}\n';
//   return code;
// };

Blockly.OpenSCAD['translate'] = function(block) {
  var value_xval = Blockly.OpenSCAD.valueToCode(block, 'XVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_yval = Blockly.OpenSCAD.valueToCode(block, 'YVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_zval = Blockly.OpenSCAD.valueToCode(block, 'ZVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
  var type = block.previousConnection.check_[0]; 
  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');

  // missing fields?
    if (!value_xval || !value_yval || (!value_zval && type == 'CSG'))
      Blockscad.missingFields.push(block.id);  

  if (statements_a != '') statements_a += '\n';
  for (var n = 0; n<= block.plusCount_; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'PLUS' + n); 
    if (statements_b != '') statements_a += statements_b + '\n';
  } 
  if (type != 'CAG')
    var code = 'translate([' + value_xval + ', ' + value_yval + ', ' + value_zval + ']){\n' + statements_a + '}';
  else var code = 'translate([' + value_xval + ', ' + value_yval + ', 0]){\n' + statements_a + '}';
  return code;
};

Blockly.OpenSCAD['color'] = function(block) {
  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');

  if (statements_a != '') statements_a += '\n';
  for (var n = 0; n<= block.plusCount_; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'PLUS' + n); 
    if (statements_b != '') statements_a += statements_b + '\n';
  }  
  var value_color = Blockly.OpenSCAD.valueToCode(block, 'COLOR',Blockly.OpenSCAD.ORDER_ATOMIC);
  // missing fields?
  if (!value_color && Blockscad.stackIsShape(block))
    Blockscad.missingFields.push(block.id);

  var code = '';
    if (value_color) {
    var R = hexToR(value_color);
    var G = hexToG(value_color);
    var B = hexToB(value_color);
    code += 'color([' + R +',' + G + ',' + B + ']) ';
  }
  code += '{\n' + statements_a + '}';
  return code;
};

Blockly.OpenSCAD['color_rgb'] = function(block) {
  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');
  var scheme = block.getFieldValue('SCHEME');
  var red = Blockly.OpenSCAD.valueToCode(block, 'RED',
      Blockly.OpenSCAD.ORDER_COMMA) || 0;
  var green = Blockly.OpenSCAD.valueToCode(block, 'GREEN',
      Blockly.OpenSCAD.ORDER_COMMA) || 0;
  var blue = Blockly.OpenSCAD.valueToCode(block, 'BLUE',
      Blockly.OpenSCAD.ORDER_COMMA) || 0;

  if (statements_a != '') statements_a += '\n';
  for (var n = 0; n<= block.plusCount_; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'PLUS' + n); 
    if (statements_b != '') statements_a += statements_b + '\n';
  }  

  var code = '';
  if ($.isNumeric(red)) {
    if (red < 0) red = 0;   
    if (red > 100) red = 100;
  }
  if ($.isNumeric(blue)) {
    if (blue < 0) blue = 0;   
    if (blue > 100) blue = 100;
  }
  if ($.isNumeric(green)) {
    if (green < 0) green = 0;   
    if (green > 100) green = 100;
  }

  if (scheme == 'RGB') {
    code += 'color([ .01 * (' + red + '), .01 * (' + green +'), .01 * (' + blue  +')]) ';
    code += '{\n' + statements_a + '}';
  }
  
  // Thanks to Hypher for the implementation of hsv to rgb in openscad!
  // http://forum.openscad.org/An-HSV-HSB-to-RGB-Color-function-in-OpenSCAD-td9835.html

  else if (scheme == 'HSV') {
    var hsvHelper = Blockly.OpenSCAD.provideFunction_(
      'doHsvMatrix',
      [ 'function ' + Blockly.OpenSCAD.FUNCTION_NAME_PLACEHOLDER_ +
          '(h,s,v,p,q,t,a=1)=[h<1?v:h<2?q:h<3?p:h<4?p:h<5?t:v,h<1?t:h<2?v:h<3?v:h<4?q:h<5?p:p,h<1?p:h<2?p:h<3?t:h<4?v:h<5?v:q,a];']);

    var hsvFunction = Blockly.OpenSCAD.provideFunction_(
      'hsv',
      ['function ' + Blockly.OpenSCAD.FUNCTION_NAME_PLACEHOLDER_ +
        '(h, s=1, v=1,a=1)=doHsvMatrix((h%1)*6,s<0?0:s>1?1:s,v<0?0:v>1?1:v,v*(1-s),v*(1-s*((h%1)*6-floor((h%1)*6))),v*(1-s*(1-((h%1)*6-floor((h%1)*6)))),a);']);

    code += 'color(hsv(.01 * (' + red + '), .01 * (' + green +'), .01 * (' + blue  +')))';
    code += '{\n' + statements_a + '}';

  }
  else console.log("got weirdo color scheme?");
  return code;
};
Blockly.OpenSCAD['$fn'] = function(block) {
  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');
  var type = block.previousConnection.check_[0]; 
  if (statements_a != '') statements_a += '\n';
  for (var n = 0; n<= block.plusCount_; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'PLUS' + n); 
    if (statements_b != '') statements_a += statements_b + '\n';
  }  

  var value_sides = Blockly.OpenSCAD.valueToCode(block, 'SIDES',Blockly.OpenSCAD.ORDER_ATOMIC);
  // missing fields?
  if (!value_sides) {
    Blockscad.missingFields.push(block.id); 
  }
  
  // if this is a number, make sure it is a reasonable number.
  // variables right now are on their own.
  else if (!isNaN(value_sides)) {
    value_sides = Math.floor(value_sides);
    if (value_sides < 3) value_sides = 3;
  }

  var code = 'assign($fn=' + value_sides + '){\n' + statements_a + '}';
  return code;
};

Blockly.OpenSCAD['fancymirror'] = function(block) {
  var value_xval = Blockly.OpenSCAD.valueToCode(block, 'XVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_yval = Blockly.OpenSCAD.valueToCode(block, 'YVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_zval = Blockly.OpenSCAD.valueToCode(block, 'ZVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');
  if (statements_a != '') statements_a += '\n';
  for (var n = 0; n<= block.plusCount_; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'PLUS' + n); 
    if (statements_b != '') statements_a += statements_b + '\n';
  }  

  // missing fields?
    if (!value_xval || !value_yval || (!value_zval))
      Blockscad.missingFields.push(block.id); 

  var type = block.previousConnection.check_[0]; 
  //if (type != 'CAG')
    var code = 'mirror([' + value_xval + ', ' + value_yval + ', ' + value_zval + ']){\n' + statements_a + '}';
  //else var code = 'mirror([' + value_xval + ', ' + value_yval + ']){\n' + statements_a + '}';
  return code;
};

Blockly.OpenSCAD['simplerotate'] = function(block) {
  //var angle_xval = block.getFieldValue('XVAL');
  var value_xval = Blockly.OpenSCAD.valueToCode(block, 'XVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_yval = Blockly.OpenSCAD.valueToCode(block, 'YVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_zval = Blockly.OpenSCAD.valueToCode(block, 'ZVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
  var type = block.previousConnection.check_[0]; 
  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');
  if (statements_a != '') statements_a += '\n';
  for (var n = 0; n<= block.plusCount_; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'PLUS' + n); 
    if (statements_b != '') statements_a += statements_b + '\n';
  }   
  // 2D shapes get to keep all their fields.
  // if (type != 'CAG')
  // missing fields?
    if (!value_xval || !value_yval || (!value_zval))
      Blockscad.missingFields.push(block.id);  
  var code = 'rotate([' + value_xval + ', ' + value_yval + ', ' + value_zval + ']){\n' + statements_a + '}';
  // else var code = 'rotate([0, 0, ' + value_zval + ']){\n' + statements_a + '}';
  return code;
};

Blockly.OpenSCAD['fancyrotate'] = function(block) {
  var value_aval = Blockly.OpenSCAD.valueToCode(block, 'AVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_xval = Blockly.OpenSCAD.valueToCode(block, 'XVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_yval = Blockly.OpenSCAD.valueToCode(block, 'YVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_zval = Blockly.OpenSCAD.valueToCode(block, 'ZVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
  var type = block.previousConnection.check_[0]; 
  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');
  if (statements_a != '') statements_a += '\n';
  for (var n = 0; n<= block.plusCount_; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'PLUS' + n); 
    if (statements_b != '') statements_a += statements_b + '\n';
  }  
  // missing fields?
    if (!value_aval || ((!value_xval || !value_yval || !value_zval) && type == 'CSG'))
      Blockscad.missingFields.push(block.id);  

  if (type != 'CAG')
    var code = 'rotate(a=' + value_aval + ', v=[' + value_xval + ', ' + value_yval + ', ' + value_zval + ']){\n' + statements_a + '}';
  else var code = 'rotate([0, 0, '+ value_aval + ']){\n' + statements_a + '}';
  return code;
};

Blockly.OpenSCAD['simplemirror_new'] = function(block) {
  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');
  if (statements_a != '') statements_a += '\n';
  for (var n = 0; n<= block.plusCount_; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'PLUS' + n); 
    if (statements_b != '') statements_a += statements_b + '\n';
  } 
  var dropdown_mirrorplane = block.getFieldValue('mirrorplane');
  var dropdown_mirrorplane_cag = block.getFieldValue('mirrorplane_cag');
  var vec;
  var type = block.previousConnection.check_[0]; 
  if (type != 'CAG') {
    if (dropdown_mirrorplane == "XY") {
        vec = "[0,0,1]";
    }
    else if (dropdown_mirrorplane == "YZ") {
        vec = "[1,0,0]";
    }
    else if (dropdown_mirrorplane == "XZ") {
        vec = "[0,1,0]";
    }
    var code = 'mirror(' + vec + '){\n' + statements_a + '}';
  }
  else {
    if (dropdown_mirrorplane_cag == "YZ") {
        vec = "[1,0,0]";
    }
    else if (dropdown_mirrorplane_cag == "XZ") {
        vec = "[0,1,0]";
    }
    var code = 'mirror(' + vec + '){\n' + statements_a + '}'; 
  }
  return code;
};

Blockly.OpenSCAD['taper'] = function(block) {
  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');
  if (statements_a != '') statements_a += '\n';
  for (var n = 0; n<= block.plusCount_; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'PLUS' + n); 
    if (statements_b != '') statements_a += statements_b + '\n';
  } 
  var dropdown_axis = block.getFieldValue('taperaxis');
  var dropdown_axis_cag = block.getFieldValue('taperaxis_cag');
  var vec;
  var factor = Blockly.OpenSCAD.valueToCode(block, 'FACTOR', Blockly.OpenSCAD.ORDER_ATOMIC);
  var type = block.previousConnection.check_[0]; 

  // missing the factor field?  just set it to one.
  if (!factor) factor = 1;

  if (type != 'CAG') {
    if (dropdown_axis == "Z") {
        vec = "[0,0,1]";
    }
    else if (dropdown_axis == "X") {
        vec = "[1,0,0]";
    }
    else if (dropdown_axis == "Y") {
        vec = "[0,1,0]";
    }
    var code = 'taper(' + vec + ', ' + factor + '){\n' + statements_a + '}';
  }
  else {
    if (dropdown_axis_cag == "X") {
        vec = "[1,0,0]";
    }
    else if (dropdown_axis_cag == "Y") {
        vec = "[0,1,0]";
    }
    var code = 'taper(' + vec + ', ' + factor + '){\n' + statements_a + '}'; 
  }
  return code;
};

Blockly.OpenSCAD['simplemirror'] = function(block) {
  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');
  if (statements_a != '') statements_a += '\n';
  var dropdown_sign = block.getFieldValue('sign');
  var dropdown_mirrorplane = block.getFieldValue('mirrorplane');
  var vec;
  var type = block.previousConnection.check_[0]; 
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

  var code = 'mirror(' + vec + '){\n' + statements_a + '}';
  return code;
};

// Blockly.OpenSCAD['shape'] = function(block) {
//   var statements_a = Blockly.OpenSCAD.statementToCode(block, 'NAME');
//   var code = statements_a;
//   return code;
// };

Blockly.OpenSCAD['circle'] = function(block) {
  var value_rad = Blockly.OpenSCAD.valueToCode(block, 'RAD', Blockly.OpenSCAD.ORDER_ATOMIC);
  // missing fields?
  if (!value_rad)
    Blockscad.missingFields.push(block.id);  
  // illegal field value?
  if (value_rad && value_rad <= 0) {
    Blockscad.illegalValue.push(block.inputList[1].connection.targetBlock().id);
  }
  var code = 'circle(' + 'r=' + value_rad + ');';
  return code;
};

Blockly.OpenSCAD['square'] = function(block) {
  var value_xval = Blockly.OpenSCAD.valueToCode(block, 'XVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_yval = Blockly.OpenSCAD.valueToCode(block, 'YVAL', Blockly.OpenSCAD.ORDER_ATOMIC);
  var dropdown_center = block.getFieldValue('CENTERDROPDOWN');
  // missing fields?
  if (!value_xval || !value_yval)
    Blockscad.missingFields.push(block.id); 
  // illegal field value?
  if (value_xval && value_xval <= 0) {
    Blockscad.illegalValue.push(block.inputList[1].connection.targetBlock().id);
  }
  if (value_yval && value_yval <= 0) {
    Blockscad.illegalValue.push(block.inputList[2].connection.targetBlock().id);
  }
  var code = 'square([' + value_xval + ', ' + value_yval + '], center=' + dropdown_center + ');';
  return code;
};

// Blockly.OpenSCAD['colourShape'] = function(block) {
//   var value_color = Blockly.OpenSCAD.valueToCode(block, 'C', Blockly.OpenSCAD.ORDER_ATOMIC) || '\'#ff0000\'';
//   var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');
//   //value_color is a hex string, '#ff0000' by default, quotes included.
//   var red = (value_color.slice(2,4),16);
//   var grn = (value_color.slice(4,6),16);
//   var blu = (value_color.slice(6,8),16);
//   var code = 'color([' + red +'/255, '+ grn +'/255, '+ blu + '/255]){\n' + statements_a + '\n}\n';
//   return code;
// };

Blockly.OpenSCAD['linearextrude'] = function(block) {
  var value_height = Blockly.OpenSCAD.valueToCode(block, 'HEIGHT', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_twist = Blockly.OpenSCAD.valueToCode(block, 'TWIST', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_xscale = Blockly.OpenSCAD.valueToCode(block, 'XSCALE', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_yscale = Blockly.OpenSCAD.valueToCode(block, 'YSCALE', Blockly.OpenSCAD.ORDER_ATOMIC);
  var dropdown_center = block.getFieldValue('CENTERDROPDOWN');
  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');
  if (statements_a != '') statements_a += '\n';
  for (var n = 0; n<= block.plusCount_; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'PLUS' + n); 
    if (statements_b != '') statements_a += statements_b + '\n';
  } 
  // missing fields?
  if ((!value_height || !value_twist))
    Blockscad.missingFields.push(block.id); 
  // illegal field value?
  if (value_height && value_height <= 0) {
    Blockscad.illegalValue.push(block.inputList[1].connection.targetBlock().id);
  }

  // let empty scale fields default to one
  if (!value_xscale) value_xscale = 1;
  if (!value_yscale) value_yscale = 1;
  
  var code = 'linear_extrude( height=' + value_height + ', twist=' + value_twist + 
             ', scale=[' + value_xscale + ', ' + value_yscale + '], center=' + dropdown_center + '){\n' + statements_a + '}';
  return code;
};

Blockly.OpenSCAD['rotateextrude'] = function(block) {
  var value_faces = Blockly.OpenSCAD.valueToCode(block, 'FACES', Blockly.OpenSCAD.ORDER_ATOMIC);
  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');
  if (statements_a != '') statements_a += '\n';
  for (var n = 0; n<= block.plusCount_; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'PLUS' + n); 
    if (statements_b != '') statements_a += statements_b + '\n';
  } 
  // missing fields?
  if (!value_faces)
    Blockscad.missingFields.push(block.id); 

  var code = 'rotate_extrude($fn=' + value_faces + '){\n' + statements_a + '}';
  return code;
};

Blockly.OpenSCAD['rotateextrudetwist'] = function(block) {
  var value_faces = Blockly.OpenSCAD.valueToCode(block, 'FACES', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_r = Blockly.OpenSCAD.valueToCode(block,'RAD',Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_twist = Blockly.OpenSCAD.valueToCode(block,'TWIST',Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_tsteps = Blockly.OpenSCAD.valueToCode(block,'TSTEPS',Blockly.OpenSCAD.ORDER_ATOMIC);
  var statements_a = Blockly.OpenSCAD.statementToCode(block, 'A');
  if (statements_a != '') statements_a += '\n';
  for (var n = 0; n<= block.plusCount_; n++) {
    var statements_b = Blockly.OpenSCAD.statementToCode(block, 'PLUS' + n); 
    if (statements_b != '') statements_a += statements_b + '\n';
  } 
  // missing fields?
  // console.log(block);
  if (!value_faces || !value_r)
    Blockscad.missingFields.push(block.id); 
  // illegal field value?
  if (value_r && value_r < 0) {
       // console.log(block.inputList[1].connection.targetBlock());
    Blockscad.illegalValue.push(block.inputList[1].connection.targetBlock().id);
  }
  if (value_faces && value_faces < 3) value_faces = 3;
  
  var code = 'rotate_extrude($fn=' + value_faces + ',radius=' + value_r + ',twist=' + 
             value_twist + ',tsteps=' + value_tsteps + '){\n' + statements_a + '}';
  return code;
};

Blockly.OpenSCAD['stl_import'] = function(block) {
  var text_filename = block.getFieldValue('STL_FILENAME');
  var code = 'import("' + text_filename + '");\n';
  return code;
};

// 2d text block.  Named before I knew we would be adding a 3D text block.

Blockly.OpenSCAD['bs_text'] = function(block) {
  // var this_text = block.getFieldValue('TEXT');
  var this_text = Blockly.OpenSCAD.valueToCode(block,'TEXT', Blockly.OpenSCAD.ORDER_ATOMIC);
  var this_font = Blockscad.fontName[parseInt(block.getFieldValue('FONT'))];
  var value_size = Blockly.OpenSCAD.valueToCode(block,'SIZE', Blockly.OpenSCAD.ORDER_ATOMIC);

  // missing fields?
  if (!value_size || !this_text)
    Blockscad.missingFields.push(block.id); 
  // illegal field value?
  if (value_size && value_size <= 0) {
    Blockscad.illegalValue.push(block.inputList[2].connection.targetBlock().id);
  }

  if (this_text && (this_text[0] != '"' || this_text[this_text.length - 1] != '"'))
    this_text = 'str(' + this_text + ')';
  var code = 'text(' + this_text + ', font = "' + this_font +
             '", size = ' + value_size + ');\n';
  return code;
}

Blockly.OpenSCAD['bs_3dtext'] = function(block) {
  // var this_text = block.getFieldValue('TEXT');
  var this_text = Blockly.OpenSCAD.valueToCode(block,'TEXT', Blockly.OpenSCAD.ORDER_ATOMIC);
  var this_font = Blockscad.fontName[parseInt(block.getFieldValue('FONT'))];
  var value_size = Blockly.OpenSCAD.valueToCode(block,'SIZE', Blockly.OpenSCAD.ORDER_ATOMIC);
  var value_thickness = Blockly.OpenSCAD.valueToCode(block, 'THICKNESS', Blockly.OpenSCAD.ORDER_ATOMIC);

  // escape any quote characters in this_text before passing it to the openscad parser
  // this_text = this_text.replace(/\"/g,"\\\"");
  // this_text = this_text.replace(/\\/g,"\\\\");
  // missing fields?
  if (!value_size || !value_thickness || !this_text)
    Blockscad.missingFields.push(block.id); 
  // illegal field value?
  if (value_size && value_size <= 0) {
    Blockscad.illegalValue.push(block.inputList[2].connection.targetBlock().id);
  }
  if (value_thickness && value_thickness <= 0) {
    Blockscad.illegalValue.push(block.inputList[4].connection.targetBlock().id);
  }

  if (this_text && (this_text[0] != '"' || this_text[this_text.length - 1] != '"'))
    this_text = 'str(' + this_text + ')';
  var code = 'linear_extrude( height=' + value_thickness + ', twist=0, center=false){\n' + 
             '  text(' + this_text + ', font = "' + this_font +
             '", size = ' + value_size + ');\n}\n';
  return code;
}

Blockly.OpenSCAD['text'] = function(block) {

  // Text value.
  var code = Blockly.OpenSCAD.quote_(block.getFieldValue('TEXT'));

  // var code = '"' + block.getFieldValue('TEXT') + '"';
  if (!block.getParent())
    return ['//' + code, Blockly.OpenSCAD.ORDER_ATOMIC];
  else
    return [code,Blockly.OpenSCAD.ORDER_ATOMIC];
}

// OpenSCAD does not implement a text length function.  This isn't a problem
// for BlocksCAD, because we can just compute the actual length of the string in
// the code and use that number directly.  
// However, it is a problem for someone who is exporting the openscad code to
// run in openscad.  What is the best way to accomplish this?  A warning at the 
// top of the openscad file?  A popup warning when you export the openscad code?
// both?  Adding a string length function to openscad? (heh)
Blockly.OpenSCAD['bs_text_length'] = function(block) {
  // String length.
  var argument0 = Blockly.OpenSCAD.valueToCode(block, 'VALUE',
      Blockly.OpenSCAD.ORDER_FUNCTION_CALL) || '\'\'';
  var code = 'len(' + argument0 + ')';

  if (!block.getParent())
    return ['//' + code, Blockly.OpenSCAD.ORDER_ATOMIC];
  else
    return [code,Blockly.OpenSCAD.ORDER_ATOMIC];
}

// hexTo(RGB) take a blockly color string '#00ff88' for example, including the quotes
// and returns RGB values.  

function hexToR(h) {
    return Math.round(100 * parseInt(h.substring(2,4),16) / 255) / 100;
}
function hexToG(h) {
    return Math.round(100 * parseInt(h.substring(4,6),16) / 255) / 100;
}
function hexToB(h) {
    return Math.round(100 * parseInt(h.substring(6,8),16) / 255) / 100;
}

