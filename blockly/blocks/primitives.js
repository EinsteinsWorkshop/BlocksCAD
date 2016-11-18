goog.require('Blockly.Blocks');
//goog.require('Blockly.MutatorPlus');

Blockly.Blocks['sphere'] = {
  init: function() {
    this.category = 'PRIMITIVE_CSG'
    this.setHelpUrl('http://www.example.com/');
    this.setColour(Blockscad.Toolbox.HEX_3D_PRIMITIVE);
    this.appendDummyInput()
        .appendField(Blockscad.Msg.SPHERE + "  ");
    this.appendValueInput("RAD")
        .setCheck("Number")
        .appendField(Blockscad.Msg.RADIUS)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CSG');
    this.setTooltip(Blockscad.Msg.SPHERE_TOOLTIP);
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
// Blockly.Blocks['sphere'] = {
//   init: function() {
//     this.category = 'PRIMITIVE_CSG'
//     this.setHelpUrl('http://www.example.com/');
//     this.setColourHex(Blockscad.Toolbox.HEX_3D_PRIMITIVE);
//     this.appendDummyInput()
//         .appendField(Blockscad.Msg.SPHERE + "  ");
//     this.appendValueInput("RAD")
//         .setCheck("Number")
//         .appendField(Blockscad.Msg.RADIUS)
//         .setAlign(Blockly.ALIGN_RIGHT);
//     this.setInputsInline(true);
//     this.setPreviousStatement(true, 'CSG');
//     this.setTooltip(Blockscad.Msg.SPHERE_TOOLTIP);
//   }//,
// };


Blockly.Blocks['cylinder'] = {
  init: function() {
    this.category = 'PRIMITIVE_CSG';
    this.prevR1 = null;
    this.prevR2 = null;
    this.pR1id = null;
    this.pR2id = null;
    this.setHelpUrl('http://www.example.com/');
    this.setColour(Blockscad.Toolbox.HEX_3D_PRIMITIVE);
    this.appendDummyInput()
        .appendField(Blockscad.Msg.CYLINDER + '  ');
    this.appendValueInput('RAD1')
        .setCheck('Number')    
        .appendField(Blockscad.Msg.RADIUS + '1')
        .setAlign(Blockly.ALIGN_RIGHT);
    // handle backwards compatibility for cylinders created before locking.
    if (Blockscad.inputVersion == null || Blockscad.inputVersion == "1.0.0"
        || Blockscad.inputVersion == "1.0.1" || Blockscad.inputVersion == "1.1.0") {
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField(new Blockly.FieldCheckbox("FALSE", null,
            "imgs/lock_icon.png","imgs/unlock_icon.png"), "LOCKED");
    }
    else {
      this.appendDummyInput()
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField(new Blockly.FieldCheckbox("TRUE", null,
            "imgs/lock_icon.png","imgs/unlock_icon.png"), "LOCKED") ;    
    }
    // this.appendDummyInput()
    //     .setAlign(Blockly.ALIGN_RIGHT)
    //     .appendField(new Blockly.FieldCheckbox("TRUE", null), "CHECK") ; 
    this.appendValueInput('RAD2')
        .setCheck('Number')
        .appendField(Blockscad.Msg.RADIUS + '2')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('HEIGHT')
        .setCheck('Number')
        .appendField(Blockscad.Msg.HEIGHT)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([[Blockscad.Msg.NOT_CENTERED, 'false'], [Blockscad.Msg.CENTERED, 'true']]), 'CENTERDROPDOWN');
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CSG');
    this.setTooltip(Blockscad.Msg.CYLINDER_TOOLTIP);
  },
  updateRadii: function() {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    // console.log('in updateRadii');
    var locked = this.getField("LOCKED").getValue();

    if (locked == 'FALSE') {
      return;
    }

    var R1 = null;
    var R2 = null;
    // get the values (if any) attached to the two radius inputs.
    if (this.getInput('RAD1').connection.targetConnection &&
        this.getInput('RAD1').connection.targetConnection.sourceBlock_.type == "math_number") { 
      R1 = this.getInput('RAD1').connection.targetConnection.sourceBlock_.getField('NUM').getValue();
    }
    if (this.getInput('RAD2').connection.targetConnection &&
        this.getInput('RAD2').connection.targetConnection.sourceBlock_.type == "math_number") {
      R2 = this.getInput('RAD2').connection.targetConnection.sourceBlock_.getField('NUM').getValue();
    }
    if (locked == 'TRUE' && R1 && R2 && R1 != R2) {
      if (R1 != this.prevR1) { 
        this.getInput('RAD2').connection.targetConnection.sourceBlock_.getField('NUM').setValue(R1,true);
      }
      else if (R2 != this.prevR2) { 
        this.getInput('RAD1').connection.targetConnection.sourceBlock_.getField('NUM').setValue(R2,true);
      }
      // if you set locking on two different radii, do you want them to both take the value of R1?
      // else if (R1 != R2) this.getInput('RAD2').connection.targetConnection.sourceBlock_.getField('NUM').setValue(R1);
    }

    this.prevR1 = R1;
    this.prevR2 = R2;
    // console.log("in cylinder onchange.  R1  R2  pR1  pR2", R1, R2, this.prevR1, this.prevR2);

  }
};

// planning not to use this.
Blockly.Blocks['simple_cylinder'] = {
  init: function() {
    this.category = 'PRIMITIVE_CSG'
    this.setHelpUrl('http://www.example.com/');
    this.setColour(Blockscad.Toolbox.HEX_3D_PRIMITIVE);
    this.appendDummyInput()
        .appendField(Blockscad.Msg.CYLINDER + '  ');
    this.appendValueInput('RAD1')
        .setCheck('Number')    
        .appendField(Blockscad.Msg.RADIUS)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('HEIGHT')
        .setCheck('Number')
        .appendField(Blockscad.Msg.HEIGHT)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([[Blockscad.Msg.NOT_CENTERED, 'false'], [Blockscad.Msg.CENTERED, 'true']]), 'CENTERDROPDOWN');
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CSG');
    this.setTooltip('Creates a cylinder with a specified radius and height.  It may optionally be centered at the origin.');
  }//,
};

Blockly.Blocks['cube'] = {
  init: function() {
    this.category = 'PRIMITIVE_CSG'
    this.setHelpUrl('http://www.example.com/');
    this.setColour(Blockscad.Toolbox.HEX_3D_PRIMITIVE);
    this.appendDummyInput()
        .appendField(Blockscad.Msg.CUBE + '   ');
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
        .appendField(new Blockly.FieldDropdown([[Blockscad.Msg.NOT_CENTERED, 'false'], [Blockscad.Msg.CENTERED, 'true']]), 'CENTERDROPDOWN');
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CSG');
    //this.setNextStatement(true, 'CSG');
    this.setTooltip(Blockscad.Msg.CUBE_TOOLTIP);
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
    this.setColour(Blockscad.Toolbox.HEX_3D_PRIMITIVE);
    this.appendDummyInput()
        .appendField(Blockscad.Msg.TORUS + '  ');
    this.appendValueInput('RAD1')
        .setCheck('Number')    
        .appendField( Blockscad.Msg.RADIUS + '1')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('RAD2')
        .setCheck('Number')
        .appendField(Blockscad.Msg.RADIUS + '2')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('SIDES')
        .setCheck('Number')
        .appendField(Blockscad.Msg.SIDES)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('FACES')
        .setCheck('Number')
        .appendField(Blockscad.Msg.FACES)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CSG');
    this.setTooltip(Blockscad.Msg.TORUS_TOOLTIP);
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
    this.setColour(Blockscad.Toolbox.HEX_3D_PRIMITIVE);
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
    this.setColour(Blockscad.Toolbox.HEX_2D_PRIMITIVE);
    this.appendDummyInput()
        .appendField(Blockscad.Msg.CIRCLE + '   ');
    this.appendValueInput('RAD')
        .setCheck('Number')
        .appendField(Blockscad.Msg.RADIUS)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CAG');
    this.setTooltip(Blockscad.Msg.CIRCLE_TOOLTIP);
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
    this.setColour(Blockscad.Toolbox.HEX_2D_PRIMITIVE);
    this.appendDummyInput()
        .appendField(Blockscad.Msg.SQUARE + '   ');
    this.appendValueInput('XVAL')
        .setCheck('Number')
        .appendField('X')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('YVAL')
        .setCheck('Number')
        .appendField('Y')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([[Blockscad.Msg.NOT_CENTERED, 'false'], [Blockscad.Msg.CENTERED, 'true']]), 'CENTERDROPDOWN');
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CAG');
    this.setTooltip(Blockscad.Msg.SQUARE_TOOLTIP);
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
    this.setColour(Blockscad.Toolbox.HEX_TRANSFORM);
    this.appendDummyInput()
        .appendField(Blockscad.Msg.TRANSLATE);
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
    this.setTooltip(Blockscad.Msg.TRANSLATE_TOOLTIP);
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
   * only call the drawing routines if the type is actually changing.
   * @this Blockly.Block
   */
  setType: function(type,drawMe) {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    if (!goog.isArray(type))
      type = [type];

    var zval = this.getInput('ZVAL');
    var next = this.getInput('A');
    var myType = this.previousConnection.check_;

    this.previousConnection.setCheck(type);
    next.connection.setCheck(type);
    for (var i = 1; i <= this.plusCount_; i++) {
      this.getInput('PLUS' + i).connection.setCheck(type);
    } 

    if (type[0] == 'CAG' && myType[0] == 'CSG') {      
        hideMyInput(zval,drawMe);
    }
    else if (type[0] == 'CSG' && myType[0] == 'CAG') {                    
        showMyInput(zval,drawMe);
    } 

    // console.log("translate type has become",this.previousConnection.check_);
    //console.log(this.getInput('A').connection.check_);
  }
};

Blockly.Blocks['scale'] = {
  init: function() {
    this.category = 'TRANSFORM';
    this.setHelpUrl('http://www.example.com/');
    this.setColour(Blockscad.Toolbox.HEX_TRANSFORM);
    this.appendDummyInput()
        .appendField(Blockscad.Msg.SCALE);
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
    this.setTooltip(Blockscad.Msg.SCALE_TOOLTIP);
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
    if (!goog.isArray(type))
      type = [type];

    var zval = this.getInput('ZVAL');
    var next = this.getInput('A');
    var myType = this.previousConnection.check_;
    
    this.previousConnection.setCheck(type);
    next.connection.setCheck(type);
    for (var i = 1; i <= this.plusCount_; i++) {
      this.getInput('PLUS' + i).connection.setCheck(type);
    } 

    if (type[0] == 'CAG' && myType[0] == 'CSG') {      
        hideMyInput(zval,drawMe);
    }
    else if (type[0] == 'CSG' && myType[0] == 'CAG') {                    
        showMyInput(zval,drawMe);
    } 
  } 
};

// Blockly.Blocks['resize'] = {
//   init: function() {
//     this.category = 'TRANSFORM';
//     this.setHelpUrl('http://www.example.com/');
//     this.setColour(Blockscad.Toolbox.HEX_TRANSFORM);
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
    this.setColour(Blockscad.Toolbox.HEX_TRANSFORM);
    this.appendDummyInput()
        .appendField(Blockscad.Msg.MIRROR_ADVANCED);
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
    this.setTooltip(Blockscad.Msg.FANCYMIRROR_TOOLTIP);
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
    this.setColour(Blockscad.Toolbox.HEX_TRANSFORM);
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
    this.setTooltip(Blockscad.Msg.SIMPLEMIRROR_TOOLTIP);
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
    this.setColour(Blockscad.Toolbox.HEX_TRANSFORM);
    this.appendDummyInput()
        .appendField(Blockscad.Msg.MIRROR);
    this.appendDummyInput('3D')
        .appendField(Blockscad.Msg.ACROSS)
        .appendField(new Blockly.FieldDropdown([['XY', 'XY'], ['YZ', 'YZ'], ['XZ', 'XZ']]), 'mirrorplane');
    this.appendDummyInput('2D')
        .appendField(Blockscad.Msg.ACROSS)
        .appendField(new Blockly.FieldDropdown([['YZ', 'YZ'], ['XZ', 'XZ']]), 'mirrorplane_cag')
        .setVisible(false);
    this.appendStatementInput('A')
        .setCheck(['CSG','CAG']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['CSG','CAG']);
    this.setTooltip(Blockscad.Msg.SIMPLEMIRROR_TOOLTIP);
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
    if (!goog.isArray(type))
      type = [type];
    // var csg = this.getField_('mirrorplane');
    // var cag = this.getField_('mirrorplane_cag');

    var csg = this.getInput('3D');
    var cag = this.getInput('2D');
    var next = this.getInput('A');
    var myType = this.previousConnection.check_;

    this.previousConnection.setCheck(type);
    next.connection.setCheck(type);
    for (var i = 1; i <= this.plusCount_; i++) {
      this.getInput('PLUS' + i).connection.setCheck(type);
    }   

    if (type[0] == 'CAG' && myType[0] == 'CSG') {
      hideMyInput(csg,drawMe);
      showMyInput(cag,drawMe);
    }
    else if (type[0] == 'CSG' && myType[0] == 'CAG') { 
      hideMyInput(cag,drawMe);
      showMyInput(csg,drawMe);
    } 
  } 
};

Blockly.Blocks['taper'] = {
  init: function() {
    this.category = 'TRANSFORM';
    this.setHelpUrl('http://www.example.com/');
    this.setColour(Blockscad.Toolbox.HEX_TRANSFORM);
    this.appendDummyInput()
        .appendField(Blockscad.Msg.TAPER);
    this.appendDummyInput('3D')
        .appendField(Blockscad.Msg.ALONG + ' ')
        .appendField(new Blockly.FieldDropdown([['X', 'X'], ['Y', 'Y'], ['Z', 'Z']]), 'taperaxis')
        .appendField(Blockscad.Msg.AXIS);
    this.appendDummyInput('2D')
        .appendField(Blockscad.Msg.ALONG + ' ')
        .appendField(new Blockly.FieldDropdown([['X', 'X'], ['Y', 'Y']]), 'taperaxis_cag')
        .appendField(Blockscad.Msg.AXIS)
        .setVisible(false);
    this.appendValueInput('FACTOR')
        .setCheck('Number')
        .appendField(Blockscad.Msg.SCALE)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendStatementInput('A')
        .setCheck(['CSG','CAG']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['CSG','CAG']);
    this.setTooltip(Blockscad.Msg.TAPER_TOOLTIP);
    this.setWarningText(Blockscad.Msg.NOT_COMPATIBLE_WITH_OPENSCAD);
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
    if (!goog.isArray(type))
      type = [type];

    var csg = this.getInput('3D');
    var cag = this.getInput('2D');
    var next = this.getInput('A');
    var myType = this.previousConnection.check_;

    this.previousConnection.setCheck(type);
    next.connection.setCheck(type);
    for (var i = 1; i <= this.plusCount_; i++) {
      this.getInput('PLUS' + i).connection.setCheck(type);
    }  

    if (type[0] == 'CAG' && myType[0] == 'CSG') {  
      hideMyInput(csg,drawMe);
      showMyInput(cag,drawMe);
    }
    else if (type[0] == 'CSG' && myType[0] == 'CAG') { 
      hideMyInput(cag,drawMe);
      showMyInput(csg,drawMe);
      if (drawMe) this.render();
    } 
  } 
};

Blockly.Blocks['simplerotate'] = {
  init: function() {
    this.category = 'TRANSFORM';
    this.setHelpUrl('http://www.example.com/');
    this.setColour(Blockscad.Toolbox.HEX_TRANSFORM);
    this.appendDummyInput()
        .appendField(Blockscad.Msg.ROTATE);
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
    this.setTooltip(Blockscad.Msg.SIMPLEROTATE_TOOLTIP);
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
    this.setColour(Blockscad.Toolbox.HEX_TRANSFORM);
    this.appendDummyInput()
        .appendField(Blockscad.Msg.ROTATE_ADVANCED);
    this.appendValueInput('AVAL')
        .setCheck('Number'); 
    this.appendValueInput('XVAL')
        .setCheck('Number')
        .appendField(Blockscad.Msg.AROUND + ' X')
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
    this.setTooltip(Blockscad.Msg.FANCYROTATE_TOOLTIP);
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
    if (!goog.isArray(type))
      type = [type];

    var zval = this.getInput('ZVAL');
    var xval = this.getInput('XVAL');
    var yval = this.getInput('YVAL');
    var next = this.getInput('A');
    var myType = this.previousConnection.check_;

    this.previousConnection.setCheck(type);
    next.connection.setCheck(type);
    for (var i = 1; i <= this.plusCount_; i++) {
      this.getInput('PLUS' + i).connection.setCheck(type);
    } 

    if (type[0] == 'CAG' && myType[0] == 'CSG') {  
      hideMyInput(xval,drawMe);
      hideMyInput(yval,drawMe);
      hideMyInput(zval,drawMe);
    }
    else if (type[0] == 'CSG' && myType[0] == 'CAG') {  
      showMyInput(xval,drawMe);
      showMyInput(yval,drawMe);
      showMyInput(zval,drawMe);
    }   
  } 
};

Blockly.Blocks['color'] = {
  init: function() {
    this.category = 'COLOR';
    this.setHelpUrl('http://www.example.com/');
    this.setColour(Blockscad.Toolbox.HEX_TRANSFORM);
    this.appendDummyInput()
        .appendField(Blockscad.Msg.COLOR);
    this.appendValueInput('COLOR')
        .setCheck('Colour');
    this.appendStatementInput('A')
        .setCheck('CSG');
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CSG');
    this.setTooltip(Blockscad.Msg.COLOR_TOOLTIP);
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

Blockly.Blocks['color_rgb'] = {
  init: function() {
    this.category = 'COLOR';
    this.setHelpUrl('http://www.example.com/');
    this.setColour(Blockscad.Toolbox.HEX_TRANSFORM);
    this.appendDummyInput()
        .appendField(Blockscad.Msg.COLOR + '  ');
    var dropdown = new Blockly.FieldDropdown([[Blockscad.Msg.HSV_COLOR_MODEL, 'HSV'],[Blockscad.Msg.RGB_COLOR_MODEL, 'RGB']], function(option) {
      var isRGB = (option == 'RGB');
      this.sourceBlock_.optUpdateShape_(isRGB);
    });
    this.appendDummyInput()
        .appendField(dropdown, 'SCHEME')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('RED')
        .setCheck('Number')
        .appendField(Blockscad.Msg.COLOR_HUE, '1')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('GREEN')
        .setCheck('Number')
        .appendField(Blockscad.Msg.COLOR_SATURATION, '2')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('BLUE')
        .setCheck('Number')
        .appendField(Blockscad.Msg.COLOR_VALUE,'3')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendStatementInput('A')
        .setCheck('CSG');
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CSG');
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('SCHEME');
      var TOOLTIPS = {
        'RGB': Blockscad.Msg.COLOR_RGB_TOOLTIP,
        'HSV': Blockscad.Msg.COLOR_HSV_TOOLTIP
      }; 
      return TOOLTIPS[mode];
    });  

    // try to set up a mutator - Jennie
    this.setMutatorPlus(new Blockly.MutatorPlus(this));    
    this.plusCount_ = 0;
  },
   mutationToDom: function() {
    // if (!this.plusCount_) {
    //     return null;
    // }
    var container = document.createElement('mutation');
    if (this.plusCount_) {
        container.setAttribute('plus',this.plusCount_);
    }
    else container.setAttribute('plus', 0);
    var isRGB = (this.getFieldValue('SCHEME') == 'RGB');
    container.setAttribute('isrgb', isRGB);
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
    var isRGB = (xmlElement.getAttribute('isrgb') == 'true');
    this.optUpdateShape_(isRGB);
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
      if (this.mutatorMinus) this.mutatorMinus.dispose();
      this.mutatorMinus = null;
      this.render();
    }
  }  ,

  // if change the labels on the value inputs based on if this is RGB or HSV
  optUpdateShape_: function(isRGB) {
    // make labels match the color schema (RGB or HSV)
    var one = this.getField('1');
    var two = this.getField('2');
    var three = this.getField('3');
    if (isRGB) {
      one.setText(Blockly.Msg.COLOUR_RGB_RED);
      two.setText(Blockly.Msg.COLOUR_RGB_GREEN);
      three.setText(Blockly.Msg.COLOUR_RGB_BLUE);
    }
    else {
      one.setText(Blockscad.Msg.COLOR_HUE);
      two.setText(Blockscad.Msg.COLOR_SATURATION);
      three.setText(Blockscad.Msg.COLOR_VALUE);
    }


  } 
};
Blockly.Blocks['$fn'] = {
  init: function() {
    this.category = 'TRANSFORM';
    this.setHelpUrl('http://www.example.com/');
    this.setColour(Blockscad.Toolbox.HEX_TRANSFORM);
    this.appendValueInput('SIDES')
        .setCheck('Number')
        .appendField(Blockscad.Msg.SIDES);
    this.appendStatementInput('A')
        .setCheck(['CSG','CAG']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['CSG','CAG']);
    this.setTooltip(Blockscad.Msg.FN_TOOLTIP);
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
Blockly.Blocks['assign'] = {
  init: function() {
    this.category = 'TRANSFORM';
    this.setHelpUrl('http://www.example.com/');
    this.setColour(Blockscad.Toolbox.HEX_TRANSFORM);
    this.appendValueInput('NAME')
        .appendField("set ")
        // .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('VALUE')
        .setCheck('Number')
        .appendField(' = ');
    this.appendStatementInput('A')
        .setCheck(['CSG','CAG']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, ['CSG','CAG']);
    this.setTooltip(Blockscad.Msg.FN_TOOLTIP);
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
    this.setColour(Blockscad.Toolbox.HEX_TRANSFORM);
    this.appendDummyInput()
        .appendField(Blockscad.Msg.LINEAR_EXTRUDE + '  ');
    this.appendValueInput('HEIGHT')
        .setCheck('Number')
        .appendField(Blockscad.Msg.HEIGHT)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('TWIST')
        .setCheck('Number')
        .appendField(Blockscad.Msg.TWIST)
        .setAlign(Blockly.ALIGN_RIGHT);
    // this.appendDummyInput()
    //     .appendField('scale: ')
    //     .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('XSCALE')
        .setCheck('Number')
        .appendField(Blockscad.Msg.SCALE + ': x')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendValueInput('YSCALE')
        .setCheck('Number')
        .appendField('y')
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([[Blockscad.Msg.NOT_CENTERED, 'false'], [Blockscad.Msg.CENTERED, 'true']]), 'CENTERDROPDOWN')
        .setAlign(Blockly.ALIGN_RIGHT);

    this.appendStatementInput('A')
        .setCheck('CAG');
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CSG');
    this.setTooltip(Blockscad.Msg.LINEAREXTRUDE_TOOLTIP);
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
    this.setColour(Blockscad.Toolbox.HEX_TRANSFORM);
    this.appendDummyInput()
        .appendField(Blockscad.Msg.ROTATE_EXTRUDE + '  ');
    this.appendValueInput('FACES')
        .setCheck('Number')
        .appendField(Blockscad.Msg.SIDES)
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendStatementInput('A')
        .setCheck('CAG');
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CSG');
    this.setTooltip(Blockscad.Msg.ROTATEEXTRUDE_TOOLTIP);
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
    this.setColour(Blockscad.Toolbox.HEX_TRANSFORM);
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
    this.setColour(Blockscad.Toolbox.HEX_MATH);
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
    this.setColour(Blockscad.Toolbox.HEX_MATH);
    this.setOutput(true, 'Number');
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(CONSTANTS), 'CONSTANT');
    this.setTooltip(Blockly.Msg.MATH_CONSTANT_TOOLTIP);
  }
};

// I want a block for stl import (file). 
Blockly.Blocks['stl_import'] = {
  init: function() {
    this.category = 'PRIMITIVE_CSG'
    this.appendDummyInput()
        .appendField(Blockscad.Msg.IMPORT_STL);
    this.appendDummyInput('')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(new Blockly.FieldLabel(""),'STL_FILENAME');
    this.appendDummyInput('')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(new Blockly.FieldButton(Blockscad.Msg.BROWSE),'STL_BUTTON');
    this.appendDummyInput('C')
        .appendField(new Blockly.FieldLabel(""),'STL_CONTENTS')
        .setVisible(false);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setColour(Blockscad.Toolbox.HEX_3D_PRIMITIVE);
    this.setTooltip('');
    this.setWarningText(Blockscad.Msg.STL_IMPORT_WARNING);
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

// the original text block, in amazing 2D (CAG)

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
    this.setHelpUrl(Blockly.Msg.TEXT_TEXT_HELPURL);
    this.appendValueInput('TEXT')
        .appendField(Blockscad.Msg.BLOCK_TEXT_2D)
        // .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT);

    this.appendValueInput("SIZE")
        .setCheck("Number")
        .appendField(" " + Blockscad.Msg.FONT_SIZE)
        .setAlign(Blockly.ALIGN_RIGHT);

    this.appendDummyInput()
        .appendField(" " + Blockscad.Msg.FONT_NAME)
        .appendField(new Blockly.FieldDropdown(CONSTANTS), 'FONT');
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CAG');
    this.setColour(Blockscad.Toolbox.HEX_2D_PRIMITIVE);
    this.setTooltip(Blockscad.Msg.BS_TEXT_TOOLTIP);
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

// a 3D text block.

Blockly.Blocks['bs_3dtext'] = {
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
    this.category = 'PRIMITIVE_CSG'
    this.setHelpUrl(Blockly.Msg.TEXT_TEXT_HELPURL);
    this.appendValueInput('TEXT')
        .appendField(Blockscad.Msg.BLOCK_TEXT_3D)
        // .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT);

    this.appendValueInput("SIZE")
        .setCheck("Number")
        .appendField(" " + Blockscad.Msg.FONT_SIZE)
        .setAlign(Blockly.ALIGN_RIGHT);

    this.appendDummyInput()
        .appendField(" " + Blockscad.Msg.FONT_NAME)
        .appendField(new Blockly.FieldDropdown(CONSTANTS), 'FONT');

    this.appendValueInput('THICKNESS')
        .appendField(" " + Blockscad.Msg.TEXT_THICKNESS)
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT);

    this.setInputsInline(true);
    this.setPreviousStatement(true, 'CSG');
    this.setColour(Blockscad.Toolbox.HEX_3D_PRIMITIVE);
    this.setTooltip(Blockscad.Msg.BS_3DTEXT_TOOLTIP);
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
  if (drawMe) {
    Blockscad.executeAfterDrag_(function() {
      if (value.isVisible()) {
        //console.log("trying to hide input",value);
        value.setVisible(false);
      }
       value.sourceBlock_.render();
    }, value);
  }
}
function showMyInput(value,drawMe) {
  if (!value.isVisible() && drawMe) {
    Blockscad.executeAfterDrag_(function() {
      // console.log(value);
      var blocks_to_render = value.setVisible(true);
      if (blocks_to_render.length > 0)
        blocks_to_render[0].render();
    }, value);
  }
}

Blockly.Blocks['bs_text_length'] = {
  /**
   * Block for string length.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_LENGTH_HELPURL);
    this.setColour(Blockscad.Toolbox.HEX_TEXT);
    this.interpolateMsg(Blockly.Msg.TEXT_LENGTH_TITLE,
                        ['VALUE', ['String', 'Array'], Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT);
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.TEXT_LENGTH_TOOLTIP);
  }
};