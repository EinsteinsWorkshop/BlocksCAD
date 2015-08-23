goog.require('Blockly.Blocks');
//goog.require('Blockly.MutatorPlus');

Blockly.Blocks['sphere'] = {
  init: function() {
    this.category = 'PRIMITIVE_CSG'
    this.setHelpUrl('http://www.example.com/');
    this.setColourHex(Blockly.HEX_3D_PRIMITIVE);
    this.appendDummyInput()
        .appendField("Sphere   ");
    this.appendValueInput("RAD")
        .setCheck("Number")
        .appendField("radius")
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CSG');
    this.setTooltip('Creates a sphere with a specified radius.');
  }//,
  // onchange: function() {
  //   if (!this.workspace) {
  //     // Block has been deleted.
  //     return;
  //   }    
  //   // if one of the value fields is missing, I want to pop up a warning.
  //   var val = this.getInput("RAD").connection;
  //   if (!val.targetConnection)
  //     this.setWarningText("Sphere requires a radius to be set");
  //   else this.setWarningText(null);
  // }
};

Blockly.Blocks['cylinder'] = {
  init: function() {
    this.category = 'PRIMITIVE_CSG'
    this.setHelpUrl('http://www.example.com/');
    this.setColourHex(Blockly.HEX_3D_PRIMITIVE);
    this.appendDummyInput()
        .appendField('Cylinder   ');
    this.appendValueInput('RAD1')
        .setCheck('Number')    
        .appendField('radius1')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('RAD2')
        .setCheck('Number')
        .appendField('radius2')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('HEIGHT')
        .setCheck('Number')
        .appendField('height')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([['not centered', 'false'], ['centered', 'true']]), 'CENTERDROPDOWN');
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CSG');
    this.setTooltip('Creates a cylinder with a specified bottom radius, top radius, and height. Primitive may optionally be centered at the origin.');
  }//,
  // onchange: function() {
  //   if (!this.workspace) {
  //     // Block has been deleted.
  //     return;
  //   }
  //   // if one of the value fields is missing, I want to pop up a warning.
  //   var val1 = this.getInput("RAD1").connection;
  //   var val2 = this.getInput("RAD2").connection;
  //   var val3 = this.getInput("HEIGHT").connection;
  //   if (val1.targetConnection && val2.targetConnection && val3.targetConnection)
  //     this.setWarningText(null);
  //   else this.setWarningText("Cylinder needs all paramaters to have number values");
  // } 
};

Blockly.Blocks['cube'] = {
  init: function() {
    this.category = 'PRIMITIVE_CSG'
    this.setHelpUrl('http://www.example.com/');
    this.setColourHex(Blockly.HEX_3D_PRIMITIVE);
    this.appendDummyInput()
        .appendField('Cube   ');
    this.appendValueInput('XVAL')
        .setCheck('Number')
        .appendField('X')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('YVAL')
        .setCheck('Number')
        .appendField('Y')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('ZVAL')
        .setCheck('Number')
        .appendField('Z')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([['not centered', 'false'], ['centered', 'true']]), 'CENTERDROPDOWN');
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CSG');
    //this.setNextStatement(true, 'CSG');
    this.setTooltip('Creates a rectangular prism of specified dimensions x, y, and z. Primitive may optionally be centered around the origin.');
  }//,
  // onchange: function() {
  //   if (!this.workspace) {
  //     // Block has been deleted.
  //     return;
  //   }
  //   // if one of the value fields is missing, I want to pop up a warning.
  //   var val1 = this.getInput("XVAL").connection;
  //   var val2 = this.getInput("YVAL").connection;
  //   var val3 = this.getInput("ZVAL").connection;
  //   if (val1.targetConnection && val2.targetConnection && val3.targetConnection)
  //     this.setWarningText(null);
  //   else this.setWarningText("Cube needs all paramaters to have number values");
  // }  
};

Blockly.Blocks['torus'] = {
  init: function() {
    this.category = 'PRIMITIVE_CSG'
    this.setHelpUrl('http://www.example.com/');
    this.setColourHex(Blockly.HEX_3D_PRIMITIVE);
    this.appendDummyInput()
        .appendField('Torus  ');
    this.appendValueInput('RAD1')
        .setCheck('Number')    
        .appendField('radius1')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('RAD2')
        .setCheck('Number')
        .appendField('radius2')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('SIDES')
        .setCheck('Number')
        .appendField('sides')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('FACES')
        .setCheck('Number')
        .appendField('faces')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CSG');
    this.setTooltip('Creates a torus with a ring of specified distance on-center from the origin (radius1), with a specified radius (radius2), a specified number of sides and faces.');
  }//,
  // onchange: function() {
  //   if (!this.workspace) {
  //     // Block has been deleted.
  //     return;
  //   }
  //   // if one of the value fields is missing, I want to pop up a warning.
  //   var val1 = this.getInput("RAD1").connection;
  //   var val2 = this.getInput("RAD2").connection;
  //   var val3 = this.getInput("SIDES").connection;
  //   var val4 = this.getInput("FACES").connection;
  //   if (val1.targetConnection && val2.targetConnection && val3.targetConnection
  //       && val4.targetConnection)
  //     this.setWarningText(null);
  //   else this.setWarningText("Torus needs all paramaters to have number values");
  // } 
};

Blockly.Blocks['twistytorus'] = {
  init: function() {
    this.category = 'PRIMITIVE_CSG'
    this.setHelpUrl('http://www.example.com/');
    this.setColourHex(Blockly.HEX_3D_PRIMITIVE);
    this.appendDummyInput()
        .appendField('Twisty Torus  ');
    this.appendValueInput('RAD1')
        .setCheck('Number')    
        .appendField('ring radius')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('RAD2')
        .setCheck('Number')
        .appendField('cross-section radius')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('SIDES')
        .setCheck('Number')
        .appendField('ring sides')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('FACES')
        .setCheck('Number')
        .appendField('cross section faces')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('TWIST')
        .setCheck('Number')
        .appendField('twist (degrees)')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CSG');
    this.setTooltip('Creates a torus with a ring of specified distance on-center from the origin (radius1), with a specified radius (radius2), a specified number of sides and faces. The "twist" is in degrees, and should be used with caution');
  }//,
  // onchange: function() {
  //   if (!this.workspace) {
  //     // Block has been deleted.
  //     return;
  //   }
  //   // if one of the value fields is missing, I want to pop up a warning.
  //   var val1 = this.getInput("RAD1").connection;
  //   var val2 = this.getInput("RAD2").connection;
  //   var val3 = this.getInput("SIDES").connection;
  //   var val4 = this.getInput("FACES").connection;
  //   if (val1.targetConnection && val2.targetConnection && val3.targetConnection
  //       && val4.targetConnection)
  //     this.setWarningText(null);
  //   else this.setWarningText("Torus needs all paramaters to have number values");
  // } 
};

Blockly.Blocks['circle'] = {
  init: function() {
    this.category = 'PRIMITIVE_CAG'
    this.setHelpUrl('http://www.example.com/');
    this.setColourHex(Blockly.HEX_2D_PRIMITIVE);
    this.appendDummyInput()
        .appendField('Circle   ');
    this.appendValueInput('RAD')
        .setCheck('Number')
        .appendField('radius')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CAG');
    this.setTooltip('Creates a circle with a specified radius.');
  }//,
  // onchange: function() {
  //   if (!this.workspace) {
  //     // Block has been deleted.
  //     return;
  //   }    
  //   // if one of the value fields is missing, I want to pop up a warning.
  //   var val = this.getInput("RAD").connection;
  //   if (!val.targetConnection)
  //     this.setWarningText("Circle requires a radius to be set");
  //   else this.setWarningText(null);
  // }  
};

Blockly.Blocks['square'] = {
  init: function() {
    this.category = 'PRIMITIVE_CAG'
    this.setHelpUrl('http://www.example.com/');
    this.setColourHex(Blockly.HEX_2D_PRIMITIVE);
    this.appendDummyInput()
        .appendField('Square   ');
    this.appendValueInput('XVAL')
        .setCheck('Number')
        .appendField('X')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('YVAL')
        .setCheck('Number')
        .appendField('Y')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([['not centered', 'false'], ['centered', 'true']]), 'CENTERDROPDOWN');
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CAG');
    this.setTooltip('Creates a square of specified dimensions x and y. Primitive may optionally be centered around the origin.');
  }//,
  // onchange: function() {
  //   if (!this.workspace) {
  //     // Block has been deleted.
  //     return;
  //   }
  //   // if one of the value fields is missing, I want to pop up a warning.
  //   var val1 = this.getInput("XVAL").connection;
  //   var val2 = this.getInput("YVAL").connection;
  //   if (val1.targetConnection && val2.targetConnection)
  //     this.setWarningText(null);
  //   else this.setWarningText("Square needs all paramaters to have number values");
  // }
};
Blockly.Blocks['translate'] = {
  init: function() {
    this.category = 'TRANSFORM';
    this.setHelpUrl('http://www.example.com/');
    this.setColourHex(Blockly.HEX_TRANSFORM);
    this.appendDummyInput()
        .appendField('Translate');
    this.appendValueInput('XVAL')
        .setCheck('Number')
        .appendField('X')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('YVAL')
        .setCheck('Number')
        .appendField('Y')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('ZVAL')
        .setCheck('Number')
        .appendField('Z')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendStatementInput('A')
        .setCheck(['CSG','CAG']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['CSG','CAG']);
    this.setTooltip('Translates (moves) one or more objects in specified dimensions x, y, and z.');
    // try to set up a mutator - Jennie
    this.setMutatorPlus(new Blockly.MutatorPlus(this));    
    this.plusCount_ = 0;
  },
  mutationToDom: function() {
    if (!this.plusCount_) {
        return null;
    }
    var container = document.createElement('mutation');
    if (this.plusCount_) {
        container.setAttribute('plus',this.plusCount_);
    }
    return container;
  },
  domToMutation: function(xmlElement) {
    this.plusCount_ = parseInt(xmlElement.getAttribute('plus'), 10);
    var mytype = this.getInput('A').connection.check_;
    for (var x = 1; x <= this.plusCount_; x++) {
        this.appendStatementInput('PLUS' + x)
            .setCheck(mytype);
    }
    if (this.plusCount_ >= 1) {
        this.setMutatorMinus(new Blockly.MutatorMinus(this));
    }
  }, 
  updateShape_ : function(num) {
    if (num == 1) {
      this.plusCount_++;
      var mytype = this.getInput('A').connection.check_;
      var plusInput = this.appendStatementInput('PLUS' + this.plusCount_)
          .setCheck(mytype); 
    } else if (num == -1) {
      this.removeInput('PLUS' + this.plusCount_); 
      this.plusCount_--;
    }
    if (this.plusCount_ >= 1) {
      if (this.plusCount_ == 1) {
        this.setMutatorMinus(new Blockly.MutatorMinus(this));
        this.render();
      }
    } else {
      this.mutatorMinus.dispose();
      this.mutatorMinus = null;
      this.render();
    }
  },  
   /**
   * If our parent or child is CSG or CAG, that sets our output type
   * and whether ZVAL field exists.
   * @this Blockly.Block
   */
  setType: function(type,drawMe) {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    var zval = this.getInput('ZVAL');
    var next = this.getInput('A');

    if (type == 'CAG') {      // parent wants a 2D shape
      hideMyInput(zval,drawMe);
      if (drawMe) this.render();
    }
    else {                    // parent wants 3D or doesn't care
      showMyInput(zval,drawMe);
      if (drawMe) this.render();
    } 
    this.previousConnection.setCheck(type);
    next.connection.setCheck(type);
    for (var i = 1; i <= this.plusCount_; i++) {
      this.getInput('PLUS' + i).connection.setCheck(type);
    } 
    // console.log("translate type has become",this.previousConnection.check_);
    //console.log(this.getInput('A').connection.check_);
  }
};

Blockly.Blocks['scale'] = {
  init: function() {
    this.category = 'TRANSFORM';
    this.setHelpUrl('http://www.example.com/');
    this.setColourHex(Blockly.HEX_TRANSFORM);
    this.appendDummyInput()
        .appendField('Scale');
    this.appendValueInput('XVAL')
        .setCheck('Number')
        .appendField('X')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('YVAL')
        .setCheck('Number')
        .appendField('Y')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('ZVAL')
        .setCheck('Number')
        .appendField('Z')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendStatementInput('A')
        .setCheck(['CSG','CAG']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['CSG','CAG']);
    this.setTooltip('Scales one or more objects by specified amount in dimensions x, y, and z.');
    // try to set up a mutator - Jennie
    this.setMutatorPlus(new Blockly.MutatorPlus(this));    
    this.plusCount_ = 0;
  },
   mutationToDom: function() {
    if (!this.plusCount_) {
        return null;
    }
    var container = document.createElement('mutation');
    if (this.plusCount_) {
        container.setAttribute('plus',this.plusCount_);
    }
    return container;
  },
  domToMutation: function(xmlElement) {
    this.plusCount_ = parseInt(xmlElement.getAttribute('plus'), 10);
    var mytype = this.getInput('A').connection.check_;
    for (var x = 1; x <= this.plusCount_; x++) {
        this.appendStatementInput('PLUS' + x)
            .setCheck(mytype);
    }
    if (this.plusCount_ >= 1) {
        this.setMutatorMinus(new Blockly.MutatorMinus(this));
    }
  }, 
  updateShape_ : function(num) {
    if (num == 1) {
      this.plusCount_++;
      var mytype = this.getInput('A').connection.check_;
      var plusInput = this.appendStatementInput('PLUS' + this.plusCount_)
          .setCheck(mytype); 
    } else if (num == -1) {
      this.removeInput('PLUS' + this.plusCount_); 
      this.plusCount_--;
    }
    if (this.plusCount_ >= 1) {
      if (this.plusCount_ == 1) {
        this.setMutatorMinus(new Blockly.MutatorMinus(this));
        this.render();
      }
    } else {
      this.mutatorMinus.dispose();
      this.mutatorMinus = null;
      this.render();
    }
  },   
    /**
   * If our parent or child is CSG or CAG, that sets our output type
   * and whether ZVAL field exists.
   * @this Blockly.Block
   */
  setType: function(type,drawMe) {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    var zval = this.getInput('ZVAL');
    var next = this.getInput('A');

    if (type == 'CAG') {      // parent wants a 2D shape
      hideMyInput(zval,drawMe);
      if (drawMe) this.render();
    }
    else {                    // parent wants 3D or doesn't care
      showMyInput(zval,drawMe);
      if (drawMe) this.render();
    } 
    this.previousConnection.setCheck(type);
    next.connection.setCheck(type);
    for (var i = 1; i <= this.plusCount_; i++) {
      this.getInput('PLUS' + i).connection.setCheck(type);
    }  
  } 
};

// Blockly.Blocks['resize'] = {
//   init: function() {
//     this.category = 'TRANSFORM';
//     this.setHelpUrl('http://www.example.com/');
//     this.setColourHex(Blockly.HEX_TRANSFORM);
//     this.appendDummyInput()
//         .appendField('Resize');
//     this.appendDummyInput()
//         .appendField('X');
//     this.appendValueInput('XVAL')
//         .setCheck('Number');
//     this.appendDummyInput()
//         .appendField('Y');
//     this.appendValueInput('YVAL')
//         .setCheck('Number');
//     this.appendDummyInput()
//         .appendField('Z');
//     this.appendValueInput('ZVAL')
//         .setCheck('Number');
//     this.appendStatementInput('A')
//         .setCheck('CSG');
//     this.setInputsInline(true);
//     this.setPreviousStatement(true, 'CSG');
//     this.setTooltip('');
//   }
// };

Blockly.Blocks['fancymirror'] = {
  init: function() {
    this.category = 'TRANSFORM';
    this.setHelpUrl('http://www.example.com/');
    this.setColourHex(Blockly.HEX_TRANSFORM);
    this.appendDummyInput()
        .appendField('Fancy Mirror');
    this.appendValueInput('XVAL')
        .setCheck('Number')
        .appendField('X')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('YVAL')
        .setCheck('Number')
        .appendField('Y')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('ZVAL')
        .setCheck('Number')
        .appendField('Z')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendStatementInput('A')
        .setCheck(['CSG','CAG']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['CSG','CAG']);
    this.setTooltip('Mirrors one or more objects across specified plane defined by the provided normal vector.');
       // try to set up a mutator - Jennie
    this.setMutatorPlus(new Blockly.MutatorPlus(this));    
    this.plusCount_ = 0; 
  },
  mutationToDom: function() {
    if (!this.plusCount_) {
        return null;
    }
    var container = document.createElement('mutation');
    if (this.plusCount_) {
        container.setAttribute('plus',this.plusCount_);
    }
    return container;
  },
  domToMutation: function(xmlElement) {
    this.plusCount_ = parseInt(xmlElement.getAttribute('plus'), 10);
    var mytype = this.getInput('A').connection.check_;
    for (var x = 1; x <= this.plusCount_; x++) {
        this.appendStatementInput('PLUS' + x)
            .setCheck(mytype);
    }
    if (this.plusCount_ >= 1) {
        this.setMutatorMinus(new Blockly.MutatorMinus(this));
    }
  }, 
  updateShape_ : function(num) {
    if (num == 1) {
      this.plusCount_++;
      var mytype = this.getInput('A').connection.check_;
      var plusInput = this.appendStatementInput('PLUS' + this.plusCount_)
          .setCheck(mytype); 
    } else if (num == -1) {
      this.removeInput('PLUS' + this.plusCount_); 
      this.plusCount_--;
    }
    if (this.plusCount_ >= 1) {
      if (this.plusCount_ == 1) {
        this.setMutatorMinus(new Blockly.MutatorMinus(this));
        this.render();
      }
    } else {
      this.mutatorMinus.dispose();
      this.mutatorMinus = null;
      this.render();
    }
  },   
  setType: function(type,drawMe) {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    var zval = this.getInput('ZVAL');

    // if (type == 'CAG') {      // parent wants a 2D shape
    //   hideMyInput(zval,drawMe);
    //   if (drawMe) this.render();
    // }
    // else {                    // parent wants 3D or doesn't care
    //   showMyInput(zval,drawMe);
    //   if (drawMe) this.render();
    // }  
    //console.log("setting union type to",type);
    this.previousConnection.setCheck(type);
    this.getInput('A').connection.setCheck(type);
    for (var i = 1; i <= this.plusCount_; i++) {
      this.getInput('PLUS' + i).connection.setCheck(type);
    }  
  }   
};

Blockly.Blocks['simplemirror'] = {
  init: function() {
    this.category = 'TRANSFORM';
    this.setHelpUrl('http://www.example.com/');
    this.setColourHex(Blockly.HEX_TRANSFORM);
    this.appendDummyInput()
        .appendField('Simple Mirror');
    this.appendDummyInput()
        .appendField('across')
        .appendField(new Blockly.FieldDropdown([['+', 'pos'], ['-', 'neg']]), 'sign')
        .appendField(new Blockly.FieldDropdown([['XY', 'XY'], ['YZ', 'YZ'], ['XZ', 'XZ']]), 'mirrorplane');
    this.appendStatementInput('A')
        .setCheck('CSG');
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CSG');
    this.setTooltip('Mirrors one or more objects across a specified plane.');
  },
    /**
   * If our parent or child is CSG or CAG, that sets our output type
   * @this Blockly.Block
   */
  setType: function(type,drawMe) {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    var next = this.getInput('A');

    this.previousConnection.setCheck(type);
    next.connection.setCheck(type);
  }  
};
Blockly.Blocks['simplemirror_new'] = {
  init: function() {
    this.category = 'TRANSFORM';
    this.setHelpUrl('http://www.example.com/');
    this.setColourHex(Blockly.HEX_TRANSFORM);
    this.appendDummyInput()
        .appendField('Mirror');
    this.appendDummyInput('3D')
        .appendField('across')
        .appendField(new Blockly.FieldDropdown([['XY', 'XY'], ['YZ', 'YZ'], ['XZ', 'XZ']]), 'mirrorplane');
    this.appendDummyInput('2D')
        .appendField('across')
        .appendField(new Blockly.FieldDropdown([['YZ', 'YZ'], ['XZ', 'XZ']]), 'mirrorplane_cag')
        .setVisible(false);
    this.appendStatementInput('A')
        .setCheck(['CSG','CAG']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['CSG','CAG']);
    this.setTooltip('Mirrors one or more objects across a specified plane.');
    // try to set up a mutator - Jennie
    this.setMutatorPlus(new Blockly.MutatorPlus(this));    
    this.plusCount_ = 0;
  },
  mutationToDom: function() {
    if (!this.plusCount_) {
        return null;
    }
    var container = document.createElement('mutation');
    if (this.plusCount_) {
        container.setAttribute('plus',this.plusCount_);
    }
    return container;
  },
  domToMutation: function(xmlElement) {
    this.plusCount_ = parseInt(xmlElement.getAttribute('plus'), 10);
    var mytype = this.getInput('A').connection.check_;
    for (var x = 1; x <= this.plusCount_; x++) {
        this.appendStatementInput('PLUS' + x)
            .setCheck(mytype);
    }
    if (this.plusCount_ >= 1) {
        this.setMutatorMinus(new Blockly.MutatorMinus(this));
    }
  }, 
  updateShape_ : function(num) {
    if (num == 1) {
      this.plusCount_++;
      var mytype = this.getInput('A').connection.check_;
      var plusInput = this.appendStatementInput('PLUS' + this.plusCount_)
          .setCheck(mytype); 
    } else if (num == -1) {
      this.removeInput('PLUS' + this.plusCount_); 
      this.plusCount_--;
    }
    if (this.plusCount_ >= 1) {
      if (this.plusCount_ == 1) {
        this.setMutatorMinus(new Blockly.MutatorMinus(this));
        this.render();
      }
    } else {
      this.mutatorMinus.dispose();
      this.mutatorMinus = null;
      this.render();
    }
  },   
   /**
   * If our parent or child is CSG or CAG, that sets our output type
   * and whether ZVAL field exists.
   * @this Blockly.Block
   */
  setType: function(type,drawMe) {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    // var csg = this.getField_('mirrorplane');
    // var cag = this.getField_('mirrorplane_cag');

    var csg = this.getInput('3D');
    var cag = this.getInput('2D');
    var next = this.getInput('A');

    if (type == 'CAG') {      // parent wants a 2D shape
      // csg.setVisible(false);
      // cag.setVisible(true);
      hideMyInput(csg,drawMe);
      showMyInput(cag,drawMe);
      if (drawMe) this.render();
    }
    else {                    // parent wants 3D or doesn't care
      // csg.setVisible(true);
      // cag.setVisible(false);
      hideMyInput(cag,drawMe);
      showMyInput(csg,drawMe);
      if (drawMe) this.render();
    } 
    this.previousConnection.setCheck(type);
    next.connection.setCheck(type);
    for (var i = 1; i <= this.plusCount_; i++) {
      this.getInput('PLUS' + i).connection.setCheck(type);
    }   
  } 
};

Blockly.Blocks['simplerotate'] = {
  init: function() {
    this.category = 'TRANSFORM';
    this.setHelpUrl('http://www.example.com/');
    this.setColourHex(Blockly.HEX_TRANSFORM);
    this.appendDummyInput()
        .appendField('Rotate');
    this.appendValueInput('XVAL')
        .setCheck('Number')
        .appendField('X')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('YVAL')
        .setCheck('Number')
        .appendField('Y')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('ZVAL')
        .setCheck('Number')
        .appendField('Z')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendStatementInput('A')
        .setCheck(['CSG','CAG']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['CSG','CAG']);
    this.setTooltip('Rotates one or more objects around specified axes x, y, and z.');
    // try to set up a mutator - Jennie
    this.setMutatorPlus(new Blockly.MutatorPlus(this));    
    this.plusCount_ = 0;
  },
  mutationToDom: function() {
    if (!this.plusCount_) {
        return null;
    }
    var container = document.createElement('mutation');
    if (this.plusCount_) {
        container.setAttribute('plus',this.plusCount_);
    }
    return container;
  },
  domToMutation: function(xmlElement) {
    this.plusCount_ = parseInt(xmlElement.getAttribute('plus'), 10);
    var mytype = this.getInput('A').connection.check_;
    for (var x = 1; x <= this.plusCount_; x++) {
        this.appendStatementInput('PLUS' + x)
            .setCheck(mytype);
    }
    if (this.plusCount_ >= 1) {
        this.setMutatorMinus(new Blockly.MutatorMinus(this));
    }
  }, 
  updateShape_ : function(num) {
    if (num == 1) {
      this.plusCount_++;
      var mytype = this.getInput('A').connection.check_;
      var plusInput = this.appendStatementInput('PLUS' + this.plusCount_)
          .setCheck(mytype); 
    } else if (num == -1) {
      this.removeInput('PLUS' + this.plusCount_); 
      this.plusCount_--;
    }
    if (this.plusCount_ >= 1) {
      if (this.plusCount_ == 1) {
        this.setMutatorMinus(new Blockly.MutatorMinus(this));
        this.render();
      }
    } else {
      this.mutatorMinus.dispose();
      this.mutatorMinus = null;
      this.render();
    }
  },   
   /**
   * If our parent or child is CSG or CAG, that sets our output type
   * and whether ZVAL field exists.
   * @this Blockly.Block
   */
  setType: function(type,drawMe) {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    // don't hide x and y axes for rotation - openscad creates a projection.
    // var xval = this.getInput('XVAL');
    // var yval = this.getInput('YVAL');
    var next = this.getInput('A');

    // if (type == 'CAG') {      // parent wants a 2D shape
    //   hideMyInput(xval,drawMe);
    //   hideMyInput(yval,drawMe);
    //   if (drawMe) this.render();
    // }
    // else {                    // parent wants 3D or doesn't care
    //   showMyInput(xval,drawMe);
    //   showMyInput(yval,drawMe);
    //   if (drawMe) this.render();
    // } 
    this.previousConnection.setCheck(type);
    next.connection.setCheck(type);
    for (var i = 1; i <= this.plusCount_; i++) {
      this.getInput('PLUS' + i).connection.setCheck(type);
    }   
  }   
};

Blockly.Blocks['fancyrotate'] = {
  init: function() {
    this.category = 'TRANSFORM';
    this.setHelpUrl('http://www.example.com/');
    this.setColourHex(Blockly.HEX_TRANSFORM);
    this.appendDummyInput()
        .appendField('Fancy Rotate');
    this.appendValueInput('AVAL')
        .setCheck('Number'); 
    this.appendValueInput('XVAL')
        .setCheck('Number')
        .appendField('around X')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('YVAL')
        .setCheck('Number')
        .appendField('Y')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('ZVAL')
        .setCheck('Number')
        .appendField('Z')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendStatementInput('A')
        .setCheck(['CSG','CAG']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['CSG','CAG']);
    this.setTooltip('Rotates one or more objects around a specified angle, scaled by x, y, and z.');
    // try to set up a mutator - Jennie
    this.setMutatorPlus(new Blockly.MutatorPlus(this));    
    this.plusCount_ = 0;
  },
  mutationToDom: function() {
    if (!this.plusCount_) {
        return null;
    }
    var container = document.createElement('mutation');
    if (this.plusCount_) {
        container.setAttribute('plus',this.plusCount_);
    }
    return container;
  },
  domToMutation: function(xmlElement) {
    this.plusCount_ = parseInt(xmlElement.getAttribute('plus'), 10);
    var mytype = this.getInput('A').connection.check_;
    for (var x = 1; x <= this.plusCount_; x++) {
        this.appendStatementInput('PLUS' + x)
            .setCheck(mytype);
    }
    if (this.plusCount_ >= 1) {
        this.setMutatorMinus(new Blockly.MutatorMinus(this));
    }
  }, 
  updateShape_ : function(num) {
    if (num == 1) {
      this.plusCount_++;
      var mytype = this.getInput('A').connection.check_;
      var plusInput = this.appendStatementInput('PLUS' + this.plusCount_)
          .setCheck(mytype); 
    } else if (num == -1) {
      this.removeInput('PLUS' + this.plusCount_); 
      this.plusCount_--;
    }
    if (this.plusCount_ >= 1) {
      if (this.plusCount_ == 1) {
        this.setMutatorMinus(new Blockly.MutatorMinus(this));
        this.render();
      }
    } else {
      this.mutatorMinus.dispose();
      this.mutatorMinus = null;
      this.render();
    }
  },  
     /**
   * If our parent or child is CSG or CAG, that sets our output type
   * and whether ZVAL field exists.
   * @this Blockly.Block
   */
  setType: function(type,drawMe) {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    var zval = this.getInput('ZVAL');
    var xval = this.getInput('XVAL');
    var yval = this.getInput('YVAL');
    var next = this.getInput('A');

    if (type == 'CAG') {      // parent wants a 2D shape
      hideMyInput(xval,drawMe);
      hideMyInput(yval,drawMe);
      hideMyInput(zval,drawMe);
      if (drawMe) this.render();
    }
    else {                    // parent wants 3D or doesn't care
      showMyInput(xval,drawMe);
      showMyInput(yval,drawMe);
      showMyInput(zval,drawMe);
      if (drawMe) this.render();
    } 
    this.previousConnection.setCheck(type);
    next.connection.setCheck(type);
    for (var i = 1; i <= this.plusCount_; i++) {
      this.getInput('PLUS' + i).connection.setCheck(type);
    }   
  } 
};

Blockly.Blocks['color'] = {
  init: function() {
    this.category = 'COLOR';
    this.setHelpUrl('http://www.example.com/');
    this.setColourHex(Blockly.HEX_TRANSFORM);
    this.appendDummyInput()
        .appendField('Color');
    this.appendValueInput('COLOR')
        .setCheck('Colour');
    this.appendStatementInput('A')
        .setCheck('CSG');
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CSG');
    this.setTooltip('Applies the color to the child object, which must be 3D.');
    // try to set up a mutator - Jennie
    this.setMutatorPlus(new Blockly.MutatorPlus(this));    
    this.plusCount_ = 0;
  },
   mutationToDom: function() {
    if (!this.plusCount_) {
        return null;
    }
    var container = document.createElement('mutation');
    if (this.plusCount_) {
        container.setAttribute('plus',this.plusCount_);
    }
    return container;
  },
  domToMutation: function(xmlElement) {
    this.plusCount_ = parseInt(xmlElement.getAttribute('plus'), 10);
    var mytype = this.getInput('A').connection.check_;
    for (var x = 1; x <= this.plusCount_; x++) {
        this.appendStatementInput('PLUS' + x)
            .setCheck(mytype);
    }
    if (this.plusCount_ >= 1) {
        this.setMutatorMinus(new Blockly.MutatorMinus(this));
    }
  }, 
  updateShape_ : function(num) {
    if (num == 1) {
      this.plusCount_++;
      var mytype = this.getInput('A').connection.check_;
      var plusInput = this.appendStatementInput('PLUS' + this.plusCount_)
          .setCheck(mytype); 
    } else if (num == -1) {
      this.removeInput('PLUS' + this.plusCount_); 
      this.plusCount_--;
    }
    if (this.plusCount_ >= 1) {
      if (this.plusCount_ == 1) {
        this.setMutatorMinus(new Blockly.MutatorMinus(this));
        this.render();
      }
    } else {
      this.mutatorMinus.dispose();
      this.mutatorMinus = null;
      this.render();
    }
  }   
};

Blockly.Blocks['$fn'] = {
  init: function() {
    this.category = 'TRANSFORM';
    this.setHelpUrl('http://www.example.com/');
    this.setColourHex(Blockly.HEX_TRANSFORM);
    this.appendValueInput('SIDES')
        .setCheck('Number')
        .appendField('Sides');
    this.appendStatementInput('A')
        .setCheck(['CSG','CAG']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['CSG','CAG']);
    this.setTooltip('Sets the number of sides for one or more objects using approximated arcs (sphere, cylinder, circle, torus).');
    // try to set up a mutator - Jennie
    this.setMutatorPlus(new Blockly.MutatorPlus(this));    
    this.plusCount_ = 0;
  },
  mutationToDom: function() {
    if (!this.plusCount_) {
        return null;
    }
    var container = document.createElement('mutation');
    if (this.plusCount_) {
        container.setAttribute('plus',this.plusCount_);
    }
    return container;
  },
  domToMutation: function(xmlElement) {
    this.plusCount_ = parseInt(xmlElement.getAttribute('plus'), 10);
    var mytype = this.getInput('A').connection.check_;
    for (var x = 1; x <= this.plusCount_; x++) {
        this.appendStatementInput('PLUS' + x)
            .setCheck(mytype);
    }
    if (this.plusCount_ >= 1) {
        this.setMutatorMinus(new Blockly.MutatorMinus(this));
    }
  }, 
  updateShape_ : function(num) {
    if (num == 1) {
      this.plusCount_++;
      var mytype = this.getInput('A').connection.check_;
      var plusInput = this.appendStatementInput('PLUS' + this.plusCount_)
          .setCheck(mytype); 
    } else if (num == -1) {
      this.removeInput('PLUS' + this.plusCount_); 
      this.plusCount_--;
    }
    if (this.plusCount_ >= 1) {
      if (this.plusCount_ == 1) {
        this.setMutatorMinus(new Blockly.MutatorMinus(this));
        this.render();
      }
    } else {
      this.mutatorMinus.dispose();
      this.mutatorMinus = null;
      this.render();
    }
  },   
  setType: function(type) {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    //console.log("setting union type to",type);
    this.previousConnection.setCheck(type);
    this.getInput('A').connection.setCheck(type);
    for (var i = 1; i <= this.plusCount_; i++) {
      this.getInput('PLUS' + i).connection.setCheck(type);
    }   
  }   
};

Blockly.Blocks['linearextrude'] = {
  init: function() {
    this.category = 'EXTRUDE';
    this.setHelpUrl('http://www.example.com/');
    this.setColourHex(Blockly.HEX_TRANSFORM);
    this.appendDummyInput()
        .appendField('Linear Extrude   ');
    this.appendValueInput('HEIGHT')
        .setCheck('Number')
        .appendField('Height')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('TWIST')
        .setCheck('Number')
        .appendField('Twist')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([['is not centered', 'false'], ['is centered', 'true']]), 'CENTERDROPDOWN')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendStatementInput('A')
        .setCheck('CAG');
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CSG');
    this.setTooltip('Extrudes one or more 2-dimensional objects by a specified height with a specified twist. Resulting extrusion may optionally be centered around the origin.');
    // try to set up a mutator - Jennie
    this.setMutatorPlus(new Blockly.MutatorPlus(this));    
    this.plusCount_ = 0;
  },
   mutationToDom: function() {
    if (!this.plusCount_) {
        return null;
    }
    var container = document.createElement('mutation');
    if (this.plusCount_) {
        container.setAttribute('plus',this.plusCount_);
    }
    return container;
  },
  domToMutation: function(xmlElement) {
    this.plusCount_ = parseInt(xmlElement.getAttribute('plus'), 10);
    var mytype = this.getInput('A').connection.check_;
    for (var x = 1; x <= this.plusCount_; x++) {
        this.appendStatementInput('PLUS' + x)
            .setCheck(mytype);
    }
    if (this.plusCount_ >= 1) {
        this.setMutatorMinus(new Blockly.MutatorMinus(this));
    }
  }, 
  updateShape_ : function(num) {
    if (num == 1) {
      this.plusCount_++;
      var mytype = this.getInput('A').connection.check_;
      var plusInput = this.appendStatementInput('PLUS' + this.plusCount_)
          .setCheck(mytype); 
    } else if (num == -1) {
      this.removeInput('PLUS' + this.plusCount_); 
      this.plusCount_--;
    }
    if (this.plusCount_ >= 1) {
      if (this.plusCount_ == 1) {
        this.setMutatorMinus(new Blockly.MutatorMinus(this));
        this.render();
      }
    } else {
      this.mutatorMinus.dispose();
      this.mutatorMinus = null;
      this.render();
    }
  }   
};

Blockly.Blocks['rotateextrude'] = {
  init: function() {
    this.category = 'EXTRUDE';
    this.setHelpUrl('http://www.example.com/');
    this.setColourHex(Blockly.HEX_TRANSFORM);
    this.appendDummyInput()
        .appendField('Rotate Extrude   ');
    this.appendValueInput('FACES')
        .setCheck('Number')
        .appendField('Sides')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendStatementInput('A')
        .setCheck('CAG');
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CSG');
    this.setTooltip('Rotate extrudes one or more 2-dimensional objects around the Z axis with a specified number of sides.');
    // try to set up a mutator - Jennie
    this.setMutatorPlus(new Blockly.MutatorPlus(this));    
    this.plusCount_ = 0;
  },
   mutationToDom: function() {
    if (!this.plusCount_) {
        return null;
    }
    var container = document.createElement('mutation');
    if (this.plusCount_) {
        container.setAttribute('plus',this.plusCount_);
    }
    return container;
  },
  domToMutation: function(xmlElement) {
    this.plusCount_ = parseInt(xmlElement.getAttribute('plus'), 10);
    var mytype = this.getInput('A').connection.check_;
    for (var x = 1; x <= this.plusCount_; x++) {
        this.appendStatementInput('PLUS' + x)
            .setCheck(mytype);
    }
    if (this.plusCount_ >= 1) {
        this.setMutatorMinus(new Blockly.MutatorMinus(this));
    }
  }, 
  updateShape_ : function(num) {
    if (num == 1) {
      this.plusCount_++;
      var mytype = this.getInput('A').connection.check_;
      var plusInput = this.appendStatementInput('PLUS' + this.plusCount_)
          .setCheck(mytype); 
    } else if (num == -1) {
      this.removeInput('PLUS' + this.plusCount_); 
      this.plusCount_--;
    }
    if (this.plusCount_ >= 1) {
      if (this.plusCount_ == 1) {
        this.setMutatorMinus(new Blockly.MutatorMinus(this));
        this.render();
      }
    } else {
      this.mutatorMinus.dispose();
      this.mutatorMinus = null;
      this.render();
    }
  }   
};

Blockly.Blocks['rotateextrudetwist'] = {
  init: function() {
    this.category = 'EXTRUDE';
    this.setHelpUrl('http://www.example.com/');
    this.setColourHex(Blockly.HEX_TRANSFORM);
    this.appendDummyInput()
        .appendField('Rotate Extrude Twist ');
    this.appendValueInput('RAD')
        .setCheck('Number')
        .appendField('R')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('FACES')
        .setCheck('Number')
        .appendField('Sides')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('TWIST')
        .setCheck('Number')
        .appendField('Twist')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('TSTEPS')
        .setCheck('Number')
        .appendField('Twist-steps')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendStatementInput('A')
        .setCheck('CAG');
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CSG');
    this.setTooltip('Rotate extrudes shape translated by radius around the Z axis with a specified number of sides. ');
    // try to set up a mutator - Jennie
    this.setMutatorPlus(new Blockly.MutatorPlus(this));    
    this.plusCount_ = 0;
  },

   mutationToDom: function() {
    if (!this.plusCount_) {
        return null;
    }
    var container = document.createElement('mutation');
    if (this.plusCount_) {
        container.setAttribute('plus',this.plusCount_);
    }
    return container;
  },
  domToMutation: function(xmlElement) {
    this.plusCount_ = parseInt(xmlElement.getAttribute('plus'), 10);
    var mytype = this.getInput('A').connection.check_;
    for (var x = 1; x <= this.plusCount_; x++) {
        this.appendStatementInput('PLUS' + x)
            .setCheck(mytype);
    }
    if (this.plusCount_ >= 1) {
        this.setMutatorMinus(new Blockly.MutatorMinus(this));
    }
  }, 
  updateShape_ : function(num) {
    if (num == 1) {
      this.plusCount_++;
      var mytype = this.getInput('A').connection.check_;
      var plusInput = this.appendStatementInput('PLUS' + this.plusCount_)
          .setCheck(mytype); 
    } else if (num == -1) {
      this.removeInput('PLUS' + this.plusCount_); 
      this.plusCount_--;
    }
    if (this.plusCount_ >= 1) {
      if (this.plusCount_ == 1) {
        this.setMutatorMinus(new Blockly.MutatorMinus(this));
        this.render();
      }
    } else {
      this.mutatorMinus.dispose();
      this.mutatorMinus = null;
      this.render();
    }
  }   
};
// math_angle block added for BlocksCAD - Jennie jayod
Blockly.Blocks['math_angle'] = {
  // Numeric value, but in an angle field.
  init: function() {
    //this.setHelpUrl(Blockly.Msg.MATH_NUMBER_HELPURL);
    this.setColourHex(Blockly.HEX_MATH);
    this.appendDummyInput()
        .appendField(new Blockly.FieldAngle('0'), 'NUM');
    this.setOutput(true, 'Number');
    //this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

// this is just like the blockly math constant block, but with no infinity constant.
// I moved it here and renamed it so we don't have to change it with every Blockly sync.
Blockly.Blocks['math_constant_bs'] = {
  /**
   * Block for constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2)
   * @this Blockly.Block
   */
  init: function() {
    var CONSTANTS =
        [['\u03c0', 'PI'],
         ['e', 'E'],
         ['\u03c6', 'GOLDEN_RATIO'],
         ['sqrt(2)', 'SQRT2'],
         ['sqrt(\u00bd)', 'SQRT1_2']];
    this.setHelpUrl(Blockly.Msg.MATH_CONSTANT_HELPURL);
    this.setColourHex(Blockly.HEX_MATH);
    this.setOutput(true, 'Number');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(CONSTANTS), 'CONSTANT');
    this.setTooltip(Blockly.Msg.MATH_CONSTANT_TOOLTIP);
  }
};

// I want a "primitive" block for stl import. 
Blockly.Blocks['stl_import'] = {
  init: function() {
    this.category = 'PRIMITIVE_CSG'
    this.appendDummyInput()
        .appendField("STL Import");
    this.appendDummyInput('')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(new Blockly.FieldLabel(""),'STL_FILENAME');
    this.appendDummyInput('')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(new Blockly.FieldButton("Browse"),'STL_BUTTON');
    this.appendDummyInput('C')
        .appendField(new Blockly.FieldLabel(""),'STL_CONTENTS')
        .setVisible(false);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setColourHex(Blockly.HEX_3D_PRIMITIVE);
    this.setTooltip('');
    this.setWarningText('STL files are not saved with your blocks.');
    this.setHelpUrl('http://www.example.com/');
  },
  onchange: function() {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }    
    // if one of the value fields is missing, I want to pop up a warning.
    var fn = this.getField('STL_FILENAME').getText();
    var contents = this.getField('STL_CONTENTS').getText();
    if (fn.length > 0) {
      this.getField('STL_BUTTON').setVisible(false);
      this.setCommentText(fn + '\ncenter: (' + Blockscad.csg_center[contents] + ')');
    }
    this.getField('STL_CONTENTS').setVisible(false);
    // this.render();
  }
};

// this text block for BlocksCAD is a CAG object?
// or a csg object with height?  I'll start CAG.
Blockly.Blocks['bs_text'] = {
  /**
   * Block for text value.
   * @this Blockly.Block
   */
  init: function() {
    // load up the font names and positions
    var CONSTANTS = [];
    for (var i=0; i<Blockscad.fontName.length; i++) {
        CONSTANTS.push([Blockscad.fontName[i],i.toString()]);
    }
    this.category = 'PRIMITIVE_CAG'
    // this.appendDummyInput()
    //     .appendField("Text");
    this.setHelpUrl(Blockly.Msg.TEXT_TEXT_HELPURL);
    this.appendDummyInput()
        .appendField(this.newQuote_(true))
        .appendField(new Blockly.FieldTextInput('hello'), 'TEXT')
        .appendField(this.newQuote_(false));
    this.appendDummyInput()
        .appendField("Size")
        .appendField(new Blockly.FieldTextInput('10',
          Blockly.FieldTextInput.numberValidator), 'SIZE'); 
    this.appendDummyInput()
        .appendField("Font:")
        .appendField(new Blockly.FieldDropdown(CONSTANTS), 'FONT');
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CAG');
    this.setColourHex(Blockly.HEX_2D_PRIMITIVE);
    this.setTooltip("This is not a tooltip.");
  },
  /**
   * Create an image of an open or closed quote.
   * @param {boolean} open True if open quote, false if closed.
   * @return {!Blockly.FieldImage} The field image of the quote.
   * @this Blockly.Block
   * @private
   */
  newQuote_: function(open) {
    if (open == this.RTL) {
      var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAAqUlEQVQI1z3KvUpCcRiA8ef9E4JNHhI0aFEacm1o0BsI0Slx8wa8gLauoDnoBhq7DcfWhggONDmJJgqCPA7neJ7p934EOOKOnM8Q7PDElo/4x4lFb2DmuUjcUzS3URnGib9qaPNbuXvBO3sGPHJDRG6fGVdMSeWDP2q99FQdFrz26Gu5Tq7dFMzUvbXy8KXeAj57cOklgA+u1B5AoslLtGIHQMaCVnwDnADZIFIrXsoXrgAAAABJRU5ErkJggg==';
    } else {
      var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAAn0lEQVQI1z3OMa5BURSF4f/cQhAKjUQhuQmFNwGJEUi0RKN5rU7FHKhpjEH3TEMtkdBSCY1EIv8r7nFX9e29V7EBAOvu7RPjwmWGH/VuF8CyN9/OAdvqIXYLvtRaNjx9mMTDyo+NjAN1HNcl9ZQ5oQMM3dgDUqDo1l8DzvwmtZN7mnD+PkmLa+4mhrxVA9fRowBWmVBhFy5gYEjKMfz9AylsaRRgGzvZAAAAAElFTkSuQmCC';
    }
    return new Blockly.FieldImage(file, 12, 12, '"');
  }
};

function hideMyInput(value,drawMe) {
  if (value.isVisible() && drawMe) {
    //console.log("trying to hide input",value);
    value.setVisible(false);
  }
}
function showMyInput(value,drawMe) {
  if (!value.isVisible() && drawMe) {
    //console.log("trying to show input",value);
    var blocks_to_render = value.setVisible(true);
    if (blocks_to_render.length > 0) {
      blocks_to_render[0].render();
    }
  }
}

