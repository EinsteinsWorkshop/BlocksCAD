/*
    Copyright (C) 2014-2015  H3XL, Inc

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * @fileoverview JavaScript for BlocksCAD.
 * @author  jennie@einsteinsworkshop.com (jayod)
 */
'use strict';

// create Blockscad namespace
var Blockscad = Blockscad || {};
Blockscad.Toolbox = Blockscad.Toolbox || {};
Blockscad.Auth = Blockscad.Auth || {};    // cloud accounts plugin
BlocklyStorage = BlocklyStorage || {};
var Blockly = Blockly || {};
var BSUtils = BSUtils || {};

Blockscad.version = "1.5.1";
Blockscad.releaseDate = "2016/08/28";

Blockscad.offline = false;  // if true, won't attempt to contact the Blockscad cloud backend.

Blockscad.standalone = false; // if true, run code needed for the standalone version
Blockscad.gProcessor = null;      // hold the graphics processor, including the mesh generator and viewer.
var _includePath = './';
Blockscad.drawAxes = 1;       // start with axes drawn

// resolution - this value will control the default returned by $fn in the parser. 
// In theory I could just have the parser poll the value directly. Overwritten by the sides block.
Blockscad.resolution = 1;



// Initialize Blockscad.  Called on page load.
 
Blockscad.init = function() {
  Blockscad.initLanguage();

  // version of input files/projects
  Blockscad.inputVersion = Blockscad.version;

  var rtl = BSUtils.isRtl();
  Blockscad.missingFields = [];  // variable to see if any blocks are missing fields
  Blockscad.csg_commands = {}; // holds any converted stl file contents
  Blockscad.csg_filename = {}; // holds any converted stl file names
  Blockscad.csg_center = [0,0,0];

  Blockscad.renderActions = [];


  var container = document.getElementById('main');
  var onresize = function(e) {
    var bBox = BSUtils.getBBox_(container);
    var el = document.getElementById('blocklyDiv');
    el.style.top = bBox.y + 'px';
    el.style.left = bBox.x + 'px';
    // Height and width need to be set, read back, then set again to
    // compensate for scrollbars.
    el.style.height = bBox.height - 88 + 'px';
    el.style.width = bBox.width + 'px';

    // resize the viewer  
    if (Blockscad.gProcessor != null && Blockscad.gProcessor.viewer) {
      var h = Blockscad.gProcessor.viewerdiv.offsetHeight;
      var w = Blockscad.gProcessor.viewerdiv.offsetWidth;
      Blockscad.gProcessor.viewer.rendered_resize(w,h);
    }
    // position the div using left and top (that's all I get!)
    if ($( '#main' ).height() - $( '.resizableDiv' ).height() < 70)
      $( '.resizableDiv' ).height($( '#main' ).height() - 70);
    if ($( '#main' ).width() - $( '.resizableDiv' ).width() < 20)
      $( '.resizableDiv' ).width($( '#main' ).width() - 20);

    // reposition the resizable div.
    $(".resizableDiv").position({
      of: $('#main'),
      my: 'right top',
      at: 'right top',
      offset: '-12 -55'
    });
  };
  window.addEventListener('resize', onresize, false);

  Blockscad.Toolbox.createToolbox();

  Blockscad.workspace = Blockly.inject(document.getElementById('blocklyDiv'),
      {
       media: 'blockly/media/',
       zoom:
         {controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2},
       trashcan: false,
       toolbox: Blockscad.Toolbox.adv});

  // Listen to events on blocksCAD workspace.
  Blockscad.workspace.addChangeListener(Blockscad.handleWorkspaceEvents);

  // set the initial color scheme
  Blockscad.Toolbox.setColorScheme(Blockscad.Toolbox.colorScheme['one']);
  // color the initial toolbox
  Blockscad.Toolbox.setCatColors();
  // hide "switch to advanced toolbox" because that's where we'll start
  $('#advancedToolbox').addClass('hidden');



  if ('BlocklyStorage' in window) {
    // Hook a save function onto unload.
    BlocklyStorage.backupOnUnload();
  }

  // how about putting in the viewer?

  $(".resizableDiv").resizable({
      handles: "s,w,sw",
      resize: function(event, ui) {
          var h = $( window ).height();
          // resize the viewer
          if (Blockscad.gProcessor != null) {
            h = Blockscad.gProcessor.viewerdiv.offsetHeight;
            var w = Blockscad.gProcessor.viewerdiv.offsetWidth;
            Blockscad.gProcessor.viewer.rendered_resize(w,h);
          }
          // position the div using left and top (that's all I get!)
          if ($( '#main' ).width() - ui.size.width < 20)
            ui.size.width = $( '#main' ).width() - 20;
          if ($( '#main' ).height() - ui.size.height < 70)
            ui.size.height = $( '#main' ).height() - 70;

          ui.position.left = $( window ).width() - (ui.size.width + 12);
          ui.position.top = 55;
      }
  });




  Blockly.svgResize(Blockscad.workspace);
  window.dispatchEvent(new Event('resize'));

  if (!Blockscad.offline) {
    // init the user auth stuff
    Blockscad.Auth.init();
  }

  BSUtils.bindClick('trashButton',
     function() {Blockscad.discard(); });

  // render button should render geometry, draw axes, etc.
  BSUtils.bindClick('renderButton', Blockscad.doRender);



  // undo/redo buttons should undo/redo changes
  BSUtils.bindClick('undoButton', 
    function() {
      Blockscad.workspace.undo(false)
    });
  BSUtils.bindClick('redoButton', 
    function() {
      Blockscad.workspace.undo(true)
    });

  $( '#axesButton' ).click(function() {
    // toggle whether or not we draw the axes, then redraw
    Blockscad.drawAxes = (Blockscad.drawAxes + 1) % 2;
    $( '#axesButton' ).toggleClass("btn-pushed");
    Blockscad.gProcessor.viewer.onDraw();
  });


  $( '#zInButton' ).click(function() {
    Blockscad.gProcessor.viewer.zoomIn();
  });
  $( '#zOutButton' ).click(function() {
    Blockscad.gProcessor.viewer.zoomOut();
  });
  $( '#zResetButton' ).click(function() {
    Blockscad.gProcessor.viewer.viewReset();
  });


  $( '#cameraButton' ).click(function() {
    // toggle whether or not we draw the axes, then redraw
    // console.log("cameraButton clicked");
    Blockscad.cameraPic();
    
  });
  

  // can I bind a click to a tab?
  $( '#displayCode' ).click(  function() {
    var content = document.getElementById('openScadPre');
    var code = Blockly.OpenSCAD.workspaceToCode(Blockscad.workspace);
    content.textContent = code;
    if (typeof prettyPrintOne == 'function') {
      code = content.innerHTML;
      code = prettyPrintOne(code, 'js');
      content.innerHTML = code; 
    }
    Blockly.svgResize(Blockscad.workspace);
  });


  // I think the render button should start out disabled.
  // $('#renderButton').prop('disabled', true); 

  // handle the project->new menu option
  $('#main').on('click', '.new-project', Blockscad.newProject);

  // handle the project->load (blocks, stl, import blocks)  options
  $('#file-menu').on('change', '#loadLocal', function(e) { Blockscad.loadLocalBlocks(e);});
  $('#file-menu').on('change', '#importLocal', function(e) { readSingleFile(e, false);});
  $('#file-menu').on('change', '#importStl', function(e) { Blockscad.readStlFile(e);});

  // what size should pics be taken at?
  Blockscad.picSize = [450,450];
  Blockscad.rpicSize = [250,250];
  Blockscad.picQuality = 0.85;    // JPEG quality level - must be between 0 and 1
  Blockscad.numRotPics = 13;
  // hook up the pic-taking button
  $("#picButton").click(Blockscad.takePic);
  $("#rPicButton").click(Blockscad.takeRPic);

  //Create the openjscad processing object instance
  Blockscad.gProcessor = new Blockscad.Processor(document.getElementById("renderDiv"));

  //render view reset button - JY
  // BSUtils.bindClick('viewReset', Blockscad.resetView); 
  // $( '#viewMenu' ).change(function() {
  //   Blockscad.gProcessor.viewer.viewReset();
  // });

  // a bunch of stuff to support Undo/Redo
  Blockscad.undo = {};
  Blockscad.undo.needToSave = 1;

  // undo stack length doesn't really show when the user needs to save (after a save, for example).  
  // this should fix that.
  // starts at 0 ("do not need to save") because the user hasn't done anything yet.
  Blockscad.setNoSaveNeeded();

  // Set up an event listener to see when the Blockly workspace gets a change
  // TODO: Set up some "Undo_events" in Blockly that only trigger on the good stuff
  // Blockscad.workspace.addUndoListener(Blockscad.workspaceChanged);

    // test to see if a user is logged in - use this to populate the login-area.
  if (!Blockscad.offline) {
    Blockscad.Auth.checkForUser();
  }

  // pop up about popup
  $('#help-menu').on('click', '#about', function() {
    $('#about-modal').modal('show');
  });

  // set up handler for saving blocks locally
  $('#file-menu').on('click', '#saveLocal', Blockscad.saveBlocksLocal);

  // set up handler for exporting openscad code locally
  $('#file-menu').on('click', '#saveOpenscad', Blockscad.saveOpenscadLocal);

  // toolbox toggle handlers
  $('#simpleToolbox').on('click', function() {
    // console.log("switching to simple toolbox");
    $('#simpleToolbox').addClass('hidden');
    $('#advancedToolbox').removeClass('hidden');
    if (Blockscad.workspace) {
      Blockscad.Toolbox.catIDs = [];
      Blockscad.workspace.updateToolbox(Blockscad.Toolbox.sim);
      Blockscad.Toolbox.setCatColors();
    }
  });
  $('#advancedToolbox').on('click', function() {
    // console.log("switching to advanced toolbox");
    $('#advancedToolbox').addClass('hidden');
    $('#simpleToolbox').removeClass('hidden');
    if (Blockscad.workspace) {
      Blockscad.Toolbox.catIDs = [];
      Blockscad.workspace.updateToolbox(Blockscad.Toolbox.adv);
      Blockscad.Toolbox.setCatColors();
    }

  });
  $('#colors_one').on('click', function() {
    // console.log("switching block color scheme");
    if (Blockscad.workspace) {
      Blockscad.Toolbox.setColorScheme(Blockscad.Toolbox.colorScheme['one']);
      Blockscad.Toolbox.setCatColors();

      var current_xml = Blockly.Xml.workspaceToDom(Blockscad.workspace);
      Blockscad.workspace.clear();
      Blockly.Xml.domToWorkspace(current_xml,Blockscad.workspace);
    }

  });
  $('#colors_two').on('click', function() {
    // console.log("switching block color scheme");
    if (Blockscad.workspace) {
      Blockscad.Toolbox.setColorScheme(Blockscad.Toolbox.colorScheme['two']);
      Blockscad.Toolbox.setCatColors();
      var current_xml = Blockly.Xml.workspaceToDom(Blockscad.workspace);
      Blockscad.workspace.clear();
      Blockly.Xml.domToWorkspace(current_xml,Blockscad.workspace);
    }
  });

  // add "default color" picker to viewer
  // r,g,b is expecting to get color values between 0 and 255 for r,g,b

  Blockscad.setColor = function(r,g,b) {
    // console.log("in setColor.  rgb:" + r + ";" + g + ';' + b);
    if (Blockscad.gProcessor != null && Blockscad.gProcessor.viewer){
      Blockscad.gProcessor.viewer.defaultColor = [r/255,g/255,b/255,1];
      Blockscad.gProcessor.picviewer.defaultColor = [r/255,g/255,b/255,1];
      Blockscad.gProcessor.rpicviewer.defaultColor = [r/255,g/255,b/255,1];
      if (Blockscad.gProcessor.hasSolid()) {
        // I have a solid already rendered - change its color!
        Blockscad.gProcessor.viewer.setCsg(Blockscad.gProcessor.currentObject); 
        Blockscad.gProcessor.picviewer.setCsg(Blockscad.gProcessor.currentObject); 
        Blockscad.gProcessor.rpicviewer.setCsg(Blockscad.gProcessor.currentObject); 
        // update the display image, thumbnail, and picture strip for rotating views
        var images = Blockscad.gProcessor.picviewer.takePic(Blockscad.picQuality,0);
        Blockscad.gProcessor.img = images[0];
        Blockscad.gProcessor.imgStrip = Blockscad.gProcessor.takeRotatingPic(0.9,Blockscad.numRotPics);
        Blockscad.gProcessor.thumbnail = images[1];
      }
      Blockscad.defaultColor = Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b);
      $("#defColor").spectrum("set", 'rgb(' + Blockscad.defaultColor + ')');
    }
  }

  $("#defColor").spectrum({
    color: 'rgb(255,128,255)',    
    showPalette: true,
    className: "defaultColor btn btn-default",
    appendTo: "#viewerButtons",
    hideAfterPaletteSelect:true,
    showPaletteOnly: true,
    change: function(color) {
      Blockscad.setColor(color._r,color._g,color._b);

    },
      palette: [
          ['rgb(255,128,255);', 'rgb(153,153,153);','rgb(238,60,60);', 'rgb(250,150,0);'],
          ['rgb(250,214,0);'  , 'rgb(50,220,50);'    ,'rgb(20,150,255);' , 'rgb(180,85,254);']
      ]
  });

  // the color picker has a downward triangle that I don't like.  Remove it.
  $('.sp-dd').remove();

  // // add color picker to help menu (for use with color rgb block)
  // $("#colorPicker").spectrum({
  //   color: 'rgb(255,128,255)',
  //   showPalette: false,
  //   className: "colSelect",
  //   hideAfterPaletteSelect:false,
  //   preferredFormat:'hsl',
  //   showInput:true
  // });

  // example handlers
  // to add an example, add a list item in index.html, add a click handler below, 
  // and be sure to put the name of the example file in the msg field.  The xml
  // file should be saved in the "examples" folder.

  $("#examples_torus").click({msg: "torus.xml"}, Blockscad.showExample);
  $("#examples_box").click({msg: "box.xml"}, Blockscad.showExample);
  $("#examples_linear_extrude").click({msg: "linear_extrude.xml"}, Blockscad.showExample);
  $("#examples_rotate_extrude").click({msg: "rotate_extrude.xml"}, Blockscad.showExample);
  $("#examples_cube_with_cutouts").click({msg: "cube_with_cutouts.xml"}, Blockscad.showExample);
  $("#examples_anthias_fish").click({msg: "anthias_fish.xml"}, Blockscad.showExample);
  $("#examples_hulled_loop_sun").click({msg: "hulled_loop_sun.xml"}, Blockscad.showExample);
  $("#examples_sine_function_with_loop").click({msg: "sine_function_with_loop.xml"}, Blockscad.showExample);
  $("#examples_trefoil_knot_param_eq").click({msg: "trefoil_knot_param_eq.xml"}, Blockscad.showExample);

  // to get sub-menus to work with bootstrap 3 navbar
  $(function(){
    $(".dropdown-menu > li > a.trigger").on("click",function(e){
      var current=$(this).next();
      var grandparent=$(this).parent().parent();
      if($(this).hasClass('left-caret')||$(this).hasClass('right-caret'))
        $(this).toggleClass('right-caret left-caret');
      grandparent.find('.left-caret').not(this).toggleClass('right-caret left-caret');
      grandparent.find(".sub-menu:visible").not(current).hide();
      current.toggle();
      e.stopPropagation();
    });
    $(".dropdown-menu > li > a:not(.trigger)").on("click",function(){
      var root=$(this).closest('.dropdown');
      root.find('.left-caret').toggleClass('right-caret left-caret');
      root.find('.sub-menu:visible').hide();
    });
  });
  $('#stl_buttons').hide();

  if (!Blockscad.standalone) {
    BSUtils.loadBlocks('');
  }
  else {
    // for standalone, just call restoreBlocks directly
    // console.log("calling standalone restore");
    BlocklyStorage.standaloneRestoreBlocks();
  }
  // we've just initiated BlocksCAD (page was loaded).  Run block typing on all blocks.
  // I'll do three passes - first variable setters (does that type variable getters?)
  // then procedures, then the rest.
  // I'm running it in a timeout to make sure any events have had time to fire.  What a pain.


  setTimeout(Blockscad.typeWorkspace, 10);


}; // end Blockscad.init()

Blockscad.typeWorkspace = function() {
  // I'll do three passes - first variable setters (does that type variable getters?)
  // then procedures, then the rest. 
  // console.log("running typeWorkspace");
  var blocks = Blockscad.workspace.getAllBlocks();
  for (var i = 0; i < blocks.length; i++) {
    if (blocks[i].type == 'variables_set')
      Blockscad.assignVarTypes(blocks[i]);
  }

  var topBlocks = Blockscad.workspace.getTopBlocks();

  for (var i = 0; i < topBlocks.length; i++) {
    if (topBlocks[i].category && topBlocks[i].category == 'PROCEDURE') {
      // console.log("found a procedure to type");
      Blockscad.assignBlockTypes([topBlocks[i]]);
    }
  }
  for (var k = 0; k < blocks.length; k++) {
    if (blocks[k].type != 'variables_set' && blocks[k].category != 'PROCEDURE') {
      Blockscad.assignBlockTypes(blocks[k]);
    }
  }
  Blockscad.assignBlockTypes(Blockscad.workspace.getTopBlocks());
}

// type a new block stack.  block is not guaranteed to be the top block in the stack.
Blockscad.typeNewStack = function(block) {
  // three passes - variables, procedures, then the rest.
  // this is called when blocks are created (think duplicated block stacks with callers in it)
  console.log("in typeNewStack");
  var topBlock = block.getRootBlock();
  var blockStack = topBlock.getDescendants();
  for (var i = 0; blockStack && i < blockStack.length; i++) {
    if (blockStack[i].type == 'variables_set' || blockStack[i].type == 'variables_get')
      Blockscad.assignVarTypes(blockStack[i]);
  }
  for (var i = 0; blockStack && i < blockStack.length; i++) {
    if (blockStack[i].category == 'PROCEDURE') {
      Blockscad.assignBlockTypes([blockStack[i]]);
    } 
  }
  for (var i = 0; blockStack && i < blockStack.length; i++) {
    if (blockStack[i].category == 'SET_OP' ||
        blockStack[i].category == 'TRANSFORM' ||
        blockStack[i].category == 'LOOP') {
      Blockscad.assignBlockTypes([blockStack[i]]);
    } 
  }
}

// Blockscad.takeRPic
// this takes and stores a strip of jpegs showing a rotating model
// for display with a blockscad project (either on our website or on a
// model page, etc.)
Blockscad.takeRPic = function() {
  if (Blockscad.gProcessor != null) {
    // takeRotatingPic(quality, numFrames)
    // leave quality at 1! 
    // thing holds the frames from the canvas.

    var strip = Blockscad.gProcessor.imgStrip;
    if (strip)
      Blockscad.savePic(strip, $('#project-name').val() + '.jpg');

    // var imageObj1 = new Image();
    // var imageObj2 = new Image();
    // imageObj1.src = "1.png"
    // imageObj1.onload = function() {
    //    ctx.drawImage(imageObj1, 0, 0, 328, 526);
    //    imageObj2.src = "2.png";
    //    imageObj2.onload = function() {
    //       ctx.drawImage(imageObj2, 15, 85, 300, 300);
    //       var img = c.toDataURL("image/png");
    //       document.write('<img src="' + img + '" width="328" height="526"/>');
    //    }
    // };
    // console.log("got rotating pic");

    // console.log(thing);
    // var gif = gifshot.createGIF({
    //   'images': thing,
    //   'interval': 0.4,
    //   'gifWidth': Blockscad.picSize[0],
    //   'gifHeight': Blockscad.picSize[1],
    //   'sampleInterval': 1,
    // }, function(obj) {
    //   if (!obj.error) {
    //     var image = obj.image;
    //     Blockscad.savePic(image, $('#project-name').val() + '.gif');
    //   }
    // });
  }
}
Blockscad.savePic = function(image, name) {
  if (image) {
    var bytestream = atob(image.split(',')[1]);
    var mimestring = image.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer

    var ab = new ArrayBuffer(bytestream.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytestream.length; i++) {
      ia[i] = bytestream.charCodeAt(i);
    }
    // console.log("jpeg size: ", bytestream.length);

    var blob = new Blob([ab], {type: "img/jpeg"});
    saveAs(blob, name);
  }
}
Blockscad.takePic = function() {
  if (Blockscad.gProcessor) {

    // console.log("image",image);
    if (Blockscad.gProcessor.img && Blockscad.gProcessor.img != "null")
    Blockscad.savePic(Blockscad.gProcessor.img, $('#project-name').val() + '.jpg');
  }
}

Blockscad.cameraPic = function() {
  if (Blockscad.gProcessor.viewer) {
    // the parameter here is the jpeg quality - between 0 and 1.
    //var image = Blockscad.gProcessor.viewer.takePic(.95,0);
    var image = Blockscad.gProcessor.viewer.takeCameraPic(.95);

    // Blockscad.gProcessor.img = image;

    // console.log("image",image);
    if (image)
    Blockscad.savePic(image, $('#project-name').val() + '.jpg');
  }
}

Blockscad.loadLocalBlocks = function(e) {
  var evt = e;
  if (evt.target.files.length) {
    if (Blockscad.undo.needToSave) {
      promptForSave().then(function(wantToSave) {
        if (wantToSave=="cancel") { 
          return;
        }
        if (wantToSave=="nosave")
          Blockscad.setNoSaveNeeded();
        else if (wantToSave=="save")
          Blockscad.saveBlocks();

        // console.log("time to load the local blocks!");
        Blockscad.createNewProject();
        readSingleFile(evt,true);
          
      }).catch(function(result) {
        console.log("caught an error in new project.  result is:" + result);

      });
    }
    else {
      // console.log("no need to save old project.  Just load the new blocks.");
      Blockscad.createNewProject();
      readSingleFile(evt,true);  
    }
  }
}

//FileSaver.js stuff
// Loading a blocks xml file
// if replaceOld is true, any current blocks are ditched, a new project is started
// and the filename loaded is used as the project filename.
// if replaceOld is false, the blocks are inserted in the current project,
// adding to the blocks that are there already and not changing the filename.

function readSingleFile(evt, replaceOld) {

  //Retrieve the first (and only!) File from the FileList object
  var f = evt.target.files[0]; 
  //console.log("in readSingleFile.  f is ", f);

  if (f) {
    var proj_name;

    if (replaceOld) {
      // use the name of the loaded file to fill the "file loading" and "project name" boxes.
      proj_name = f.name.substr(0,f.name.lastIndexOf('(')) || f.name;
      proj_name = proj_name.substr(0,f.name.lastIndexOf('.')) || proj_name;

      // trim any whitespace from the beginning or end of the project name
      proj_name = proj_name.replace(/^\s+|\s+$/g,'');
    }

    if (replaceOld) {
      // first, autosave anything new.  Is there anything on the undo stack?  If so, save the changes.
      // if (Blockscad.undo.needToSave) {
      //   // Blockscad.Auth.saveBlocksToAccount();
      // }
      // if we had a current project before, we just changed to something else!
      Blockscad.Auth.currentProject = '';
      // clear the workspace to fit the new file contents.

    }

    if (replaceOld)
      Blockly.getMainWorkspace().clear();

    var contents = {};
    var stuff = {};
    var r = new FileReader();
    // all the file processing has to go inside the onload function. -JY
    r.onload = function(e) { 

      contents = e.target.result;  
      var xml = Blockly.Xml.textToDom(contents);
      Blockly.Xml.domToWorkspace(xml, Blockscad.workspace); 
      Blockly.svgResize(Blockscad.workspace);

      Blockscad.clearStlBlocks();
    };
    r.readAsText(f);

    // in order that we can read this filename again, I'll clear out the current filename
    $("#importLocal")[0].value = '';
    $("#loadLocal")[0].value = '';

    if (replaceOld)
      $('#project-name').val(proj_name);

    // I should hide the projectView
    // , and show the editView.
    $('#projectView').addClass('hidden');
    $('#editView').removeClass('hidden');
    // turn the big save button back on.

    if (!Blockscad.offline) $('#bigsavebutton').removeClass('hidden');

    // switch us back to the blocks tab in case we were on the code tabe.
    $('#displayBlocks').click();

    // clear the render window
    Blockscad.gProcessor.clearViewer();

  } else { 
    // alert("Failed to load file");
  }
}
Blockscad.readStlFile = function(evt) {

  // this can be called from an existing importSTL block.  If so, 
  // don't create a new block - instead, update the fields on the existing block.

  //Retrieve the first (and only!) File from the FileList object
  var f = evt.target.files[0]; 

  if (f) {
    var contents = {};
    var stuff = {};
    var r = new FileReader();

    // all the file processing has to go inside the onload function. -JY
    r.onload = function(e) { 

      var contents = e.target.result;  
      var result = importSTL(contents);
      // console.log("result is:",result);
      var src = result[0];
      var center = result[1];
      if (!center) center = 'blah';
      // console.log(center);
      var proj_name = f.name.substr(0,f.name.lastIndexOf('(')) || f.name;
      proj_name = proj_name.substr(0,f.name.lastIndexOf('.')) || proj_name;

      // trim any whitespace from the beginning or end of the project name
      proj_name = proj_name.replace(/^\s+|\s+$/g,'');
      var proj_name_use = proj_name;
      var add = 1;
      var found_file = 0;
      while (Blockscad.csg_commands[proj_name_use] && !found_file) {
        if (src != Blockscad.csg_commands[proj_name_use]) {
          proj_name_use = proj_name + '_' + add;
          add++;
        }
        else found_file = 1;
      }
      //console.log("stl file parsed is",src);
      // save these CSG commands so I never have to run this conversion again.
      Blockscad.csg_commands[proj_name_use] = src;
      if (!found_file)
        Blockscad.csg_filename[proj_name_use] = f.name + ':::';
      else Blockscad.csg_filename[proj_name_use] += f.name + ':::';

      Blockscad.csg_center[proj_name_use] = center;
      // I've got a file here.  What should I do with it?
      var bt_input;
      if (Blockscad.currentInterestingBlock) {
        // console.log('the current block is:', Blockscad.currentInterestingBlock);
        var fn_input = Blockscad.currentInterestingBlock.getField('STL_FILENAME');
        bt_input = Blockscad.currentInterestingBlock.getField('STL_BUTTON');
        var ct_input = Blockscad.currentInterestingBlock.getField('STL_CONTENTS');
        fn_input.setText(f.name);
        fn_input.setVisible(true);
        bt_input.setVisible(false);
        ct_input.setText(proj_name_use);
        Blockscad.currentInterestingBlock.setCommentText(f.name + '\ncenter:(' + center + ')');

        Blockscad.currentInterestingBlock = null;

      }
      else {
        // lets make some xml and load a block into the workspace.
        // console.log("making block from xml");
        var xml = '<xml xmlns="http://blockscad.einsteinsworkshop.com"><block type="stl_import" id="1" x="0" y="0"><field name="STL_FILENAME">' +
        f.name + '</field>' + '<field name="STL_BUTTON">' + Blockscad.Msg.BROWSE + '</field>' + 
        '<field name="STL_CONTENTS">'+ proj_name_use + '</field></block></xml>';
        //console.log("xml is:",xml);
        var stuff = Blockly.Xml.textToDom(xml);
        var newblock = Blockly.Xml.domToBlock(Blockscad.workspace, stuff.firstChild);
        newblock.moveBy(20 + Blockscad.workspace.getMetrics().viewLeft / Blockscad.workspace.scale, 
          20 + Blockscad.workspace.getMetrics().viewTop / Blockscad.workspace.scale);
        bt_input = newblock.getField('STL_BUTTON');
        bt_input.setVisible(false);
        newblock.setCommentText(f.name + '\ncenter:(' + center + ')');
        newblock.render();
      }

    };
    r.readAsBinaryString(f);
    // in order that we can read this filename again, I'll clear out the current filename
    $("#importStl")[0].value = '';

    // switch us back to the blocks tab in case we were on the code tab.
    $('#displayBlocks').click();
    // enable the render button.
    // $('#renderButton').prop('disabled', false);       

  } else { 
    alert("Failed to load file");
  }
};

// Load Blockly's (and Blockscad's) language strings.
// console.log("trying to include message strings");
document.write('<script src="blockly/msg/js/' + BSUtils.LANG + '.js"></script>\n');
document.write('<script src="blockscad/msg/js/' + BSUtils.LANG + '.js"></script>\n');

// on page load, call blockscad init function.
window.addEventListener('load', Blockscad.init);

//clear out stl blocks that have lost their original file.
Blockscad.clearStlBlocks = function() { 
  // clear out any stl blocks.
  var blocks = Blockscad.workspace.getAllBlocks();
  var num_to_load = 0;
  for (var i = 0; i < blocks.length; i++){
    if (blocks[i].type == 'stl_import') {
      // var csg_key = blocks[i].getField('STL_CONTENTS').getText();
      // var csg_filename = blocks[i].getField('STL_FILENAME').getText();
      var browse_button = blocks[i].getField('STL_BUTTON');
      blocks[i].getField('STL_CONTENTS').setText('');
      blocks[i].getField('STL_FILENAME').setText('');
      var cText = blocks[i].getCommentText();
      if (!cText.match(/^RELOAD/)) cText = 'RELOAD: ' + cText;
      blocks[i].setCommentText(cText);
      browse_button.setText('Reload');

      blocks[i].backlight();
      // if block is in a collapsed parent, highlight collapsed parent too
      var others = blocks[i].collapsedParents();
      if (others)
        for (var j=0; j < others.length; j++) 
          others[j].backlight();

      // make browse button visible if not collapsed
      if (!blocks[i].isCollapsed()) {
        browse_button.setVisible(true);
      }

      // Bubble up to re-collapsed top collapsed block
      var parent = blocks[i];
      var collapsedParent = null;
      while (parent) {
        if (parent.isCollapsed()) {
          collapsedParent = parent;
        }
        parent = parent.getSurroundParent();
      }
      if (collapsedParent) {
        collapsedParent.setCollapsed(true,true);
      } 
      blocks[i].render();

      // Add warning to render pane: Hey, you have a file import block that needs reloading!
      $( '#error-message' ).html(Blockscad.Msg.WARNING_RELOAD_STL);
    }
  }
};

// Start a new project (save old project to account if logged in, clear blocks, clear rendered view)

Blockscad.newProject = function() {
  // if the user was on the code tab, switch them to the blocks tab.
  $('#displayBlocks').click();
  // should I prompt a save here?  If I have a current project, I should just save it?  Or not?
  // if the user is logged in, I should auto-save to the backend.
  // console.log("in Blockscad.newProject");
  // console.log("undo stack length is: ", Blockscad.undo.undoStack.length);
  // console.log("needToSave is: ", Blockscad.undo.needToSave);
  if (Blockscad.undo.needToSave) {
    promptForSave().then(function(wantToSave) {
      if (wantToSave=="cancel") {
        return;
      }
      if (wantToSave=="nosave")
        Blockscad.setNoSaveNeeded();      
      else if (wantToSave=="save")
        Blockscad.saveBlocks();

      // console.log("time to get a new project!");
      Blockscad.createNewProject();
        
    }).catch(function(result) {
      console.log("caught an error in new project.  result is:" + result);

    });
  }
  else {
    // console.log("no need to save old project.  Just make a new one..");
    Blockscad.createNewProject();  
  }
};
Blockscad.createNewProject = function() {
  Blockscad.clearProject();
  // Blockscad.workspaceChanged();
  Blockscad.workspace.clearUndo();
  // disable undo buttons
  // $('#undoButton').prop('disabled', true);
  // $('#redoButton').prop('disabled', true);  
  setTimeout(Blockscad.setNoSaveNeeded, 300);
  $('#displayBlocks').click();
  if (!Blockscad.offline)
        $('#bigsavebutton').removeClass('hidden'); 
}
// first attempt to use promises for async stuff!
function promptForSave() {
  // console.log("in promptForSave()");
  var message = '<h4>' + Blockscad.Msg.SAVE_PROMPT + '</h4>';
  return new Promise(function(resolve, reject) {
    bootbox.dialog({
      message: message,
      backdrop: true,
      size: "small",
      buttons: {
        save: {
          label: Blockscad.Msg.SAVE_PROMPT_YES,
          className: "btn-default btn-lg primary pull-right giant-yes",
          callback: function(result) {
            // console.log("save clicked.  Result was: ", result);
            resolve("save");
          }
        },
        dont_save: {
          label: Blockscad.Msg.SAVE_PROMPT_NO,
          className: "btn-default btn-lg primary pull-left giant-yes",
          callback: function(result) {
            // console.log("don't save clicked.  Result was: ", result);
            resolve("nosave");
          }
        }
      },
      onEscape: function() {
        // console.log("bootbox dialog escaped.");
        resolve("cancel");
      }
    });
  });
}

Blockscad.saveBlocks = function() {
  // save to cloud storage if available and logged in
  if (!Blockscad.offline && Blockscad.Auth.isLoggedIn) { 
      Blockscad.Auth.saveBlocksToAccount();
  }
  else {
    // i'm not logged into an account.  Save blocks locally.
    Blockscad.saveBlocksLocal();
  }
}

Blockscad.showExample = function(e) {
  var example = "examples/" + e.data.msg;
  var name = e.data.msg.split('.')[0];

  // console.log("in showExample");
  if (Blockscad.undo.needToSave) {
    promptForSave().then(function(wantToSave) {
        if (wantToSave=="cancel") {
          return;
        }
        if (wantToSave=="nosave")
          Blockscad.setNoSaveNeeded();
        else if (wantToSave=="save")
          Blockscad.saveBlocks();

        // console.log("i would try to show the example now!");
        Blockscad.getExample(example, name);
    }).catch(function(result) {
      console.log("caught an error in show example 1.  result is:" + result);

    });
  }
  else {
    // console.log("no need to save old project.  Just go get example.");
    Blockscad.getExample(example, name);
  }
}

Blockscad.getExample = function(example, name) {
  $.get(example, function( data ) {

    Blockscad.clearProject();
    // Blockscad.workspaceChanged();
    // turn xml data object into a string that Blockly can use
    var xmlString;
    //IE
    if (window.ActiveXObject){
        xmlString = data.xml;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else{
        xmlString = (new XMLSerializer()).serializeToString(data);
    }
    // console.log(xmlString);
    // load xml blocks
    var xml = Blockly.Xml.textToDom(xmlString);
    Blockly.Xml.domToWorkspace(xml, Blockscad.workspace); 
    Blockly.svgResize(Blockscad.workspace);
    // update project name
    $('#project-name').val(name + ' example');
    // we just got a new project.  It doesn't need saving yet.
    setTimeout(Blockscad.setNoSaveNeeded, 300);
  });
}

Blockscad.setNoSaveNeeded = function() {
  // console.log("setting needToSave to 0 (on delay?)");
  Blockscad.undo.needToSave = 0;
}

Blockscad.clearProject = function() {

  if (!Blockscad.offline) {
    // now I should make the new project.
    Blockscad.Auth.currentProject = '';
    Blockscad.Auth.currentProjectKey = '';
  }
  Blockscad.workspace.clear();
  Blockscad.gProcessor.clearViewer();  

  $('#project-name').val(Blockscad.Msg.PROJECT_NAME_DEFAULT);
  $('#projectView').addClass('hidden');
  $('#editView').removeClass('hidden');
  // turn the big save button back on.
  $('#bigsavebutton').removeClass('hidden');
};

// Blockscad.clearUndo = function() {
//   // clear the undo and redo stacks
//   while(Blockscad.undo.undoStack.length) {
//     Blockscad.undo.undoStack.pop();
//   }
//   while(Blockscad.undo.redoStack.length){
//     Blockscad.undo.redoStack.pop();
//   }
// }

/**
 * Discard all blocks from the workspace.
 */
Blockscad.discard = function() {
  var count = Blockly.mainWorkspace.getAllBlocks().length;
  if (count < 2) {
    Blockly.mainWorkspace.clear();
    window.location.hash = '';
  }
  else {
    var message = Blockscad.Msg.DISCARD_ALL.replace("%1", count);
    bootbox.confirm({
      size: "small",
      message: message, 
      buttons: {
        confirm: {
          label: Blockscad.Msg.CONFIRM_DIALOG_YES,
          className: "btn-default confirm-yes"
        },
        cancel: {
            label: Blockscad.Msg.CONFIRM_DIALOG_NO,
            className: "btn-default confirm-yes"
        },
      },
      callback: function(result) { 
        if (result) {
          Blockly.mainWorkspace.clear();
          window.location.hash = '';
        }
      }
    });
  }
};

/* reset the rendering view */

Blockscad.resetView = function() {
  if (Blockscad.gProcessor != null) {
    if (Blockscad.gProcessor.viewer) {
      Blockscad.gProcessor.viewer.viewReset();
    }
    // if (Blockscad.gProcessor.picviewer) {
    //   Blockscad.gProcessor.picviewer.viewReset();
    // }
  } 
};

// check for if there are both 2D and 3D shapes to be rendered
Blockscad.mixes2and3D = function() {
  var topBlocks = [];
  topBlocks = Blockly.mainWorkspace.getTopBlocks(); 
  var hasCSG = 0;
  var hasCAG = 0;
  var hasUnknown = 0;
  var hasShape = 0;   // assignTypes isn't firing after page load

  for (var i = 0; i < topBlocks.length; i++) {
    if (Blockscad.stackIsShape(topBlocks[i])) { 
      hasShape = 1;
      var cat = topBlocks[i].category;
      var mytype;
      if (cat == 'PRIMITIVE_CSG') hasCSG++;
      if (cat == 'PRIMITIVE_CAG') hasCAG++;
      if (cat == 'TRANSFORM' || cat == 'SET_OP') {
        mytype = topBlocks[i].getInput('A').connection.check_;
        if (mytype.length == 1 && mytype[0] == 'CSG') hasCSG++;
        if (mytype.length == 1 && mytype[0] == 'CAG') hasCAG++;
      }  
      if (cat == 'LOOP') {
        mytype = topBlocks[i].getInput('DO').connection.check_;
        if (mytype.length == 1 && mytype[0] == 'CSG') hasCSG++;
        if (mytype.length == 1 && mytype[0] == 'CAG') hasCAG++;
      }
      // I don't want a procedure definition to be counted as a shape.
      // only the calling block is actually a shape.
      // if (cat == 'PROCEDURE') {
      //   mytype = topBlocks[i].myType_;
      //   if (mytype && mytype == 'CSG') hasCSG++;
      //   if (mytype && mytype == 'CAG') hasCAG++;
      // }
      if (cat == 'COLOR') hasCSG++;
      if (cat == 'EXTRUDE') hasCSG++;
      if (topBlocks[i].type == 'controls_if') hasUnknown++;
    }
  }
  if (hasShape && !(hasCSG + hasCAG + hasUnknown)) {
    // assign types needs to be called here.  
    // console.log("assignTypes needed - why?");
    Blockscad.assignBlockTypes(Blockly.mainWorkspace.getTopBlocks());
  }
  return [(hasCSG && hasCAG), hasShape];
};

Blockscad.doRender = function() {
  // First, lets clear any old error messages.
  $( '#error-message' ).html("");
  $( '#error-message' ).removeClass("has-error");

  // if there are objects to render, I'm going to want to disable the render button!
  $('#renderButton').prop('disabled', true); 

  // Clear the previously rendered model
  Blockscad.gProcessor.clearViewer();

  // check to see if the code mixes 2D and 3D shapes to give a good error message
  var mixes = Blockscad.mixes2and3D();

  if (mixes[1] === 0) { // doesn't have any CSG or CAG shapes at all!
    $( '#error-message' ).html(Blockscad.Msg.ERROR_MESSAGE + ": " + Blockscad.Msg.RENDER_ERROR_EMPTY);
    $( '#error-message' ).addClass("has-error");
    // enable the render button.
    $('#renderButton').prop('disabled', false);
    // HACK: file load is too slow - if user tries to render during file load
    // they get the "no objects to render" message.  Enable the render button.
    //$('#renderButton').prop('disabled', false); 
    return;
  }

  if (mixes[0]) {    // has both 2D and 3D shapes
    $( '#error-message' ).html(Blockscad.Msg.ERROR_MESSAGE + ": " + Blockscad.Msg.RENDER_ERROR_MIXED);
    $( '#error-message' ).addClass("has-error");
    // enable the render button.
    $('#renderButton').prop('disabled', false);
    return;
  }

  // check for missing fields and illegal values in blocks.  Highlight them for the user
  // and give an error message.
  Blockscad.missingFields = [];
  Blockscad.illegalValue = [];
  var code = Blockly.OpenSCAD.workspaceToCode(Blockscad.workspace);
  var gotErr = false;
  var others, blk;

  if (Blockscad.missingFields.length > 0) {
    // highlight the missing blocks, set up/display the correct error message
    for (var i = 0; i < Blockscad.missingFields.length; i++) {
      blk = Blockly.mainWorkspace.getBlockById(Blockscad.missingFields[i]);
      blk.unselect();
      blk.backlight();
      // if block is in a collapsed parent, highlight collapsed parent too
      others = blk.collapsedParents();
      if (others)
        for (var j=0; j < others.length; j++) { 
          others[j].unselect();
          others[j].backlight();  
        }
        gotErr = true;
    }
  }
  if (Blockscad.illegalValue.length > 0) {
    // highlight the missing blocks, set up/display the correct error message
    for (var i = 0; i < Blockscad.illegalValue.length; i++) {
      blk = Blockly.mainWorkspace.getBlockById(Blockscad.illegalValue[i]);
      blk.unselect();
      blk.backlight();
      // if block is in a collapsed parent, highlight collapsed parent too
      others = blk.collapsedParents();
      if (others)
        for (var j=0; j < others.length; j++) { 
          others[j].unselect();
          others[j].backlight();  
        }
    }
    gotErr = true;


  }
  if (gotErr) {
    var errText = '';
    var error = '';
      if (Blockscad.missingFields.length) { 
        error = Blockscad.Msg.ERROR_MESSAGE + ": " + Blockscad.Msg.PARSING_ERROR_MISSING_FIELDS;
        errText = error.replace("%1", Blockscad.missingFields.length + " ");
      }
      if (Blockscad.missingFields.length && Blockscad.illegalValue.length) 
        errText += "<br>";
      if (Blockscad.illegalValue.length) {
        error = Blockscad.Msg.ERROR_MESSAGE + ": " + Blockscad.Msg.PARSING_ERROR_ILLEGAL_VALUE;
        errText += error.replace("%1", Blockscad.illegalValue.length + " ");
      }

    $( '#error-message' ).html(errText);
    $( '#error-message' ).addClass("has-error");
    // enable the render button.
    $('#renderButton').prop('disabled', false);
    return;
  }

  // we haven't detected an error in the code.  On to rendering!

  // detect default resolution
  Blockscad.resolution = $('input[name="resolution"]:checked').val(); 

  // load any needed fonts
  Blockscad.loadTheseFonts = Blockscad.whichFonts(code);
  // console.log(loadThese);
  $('#renderButton').html('working'); 

  if (Blockscad.loadTheseFonts.length > 0) {
    // console.log("I need to load " + Blockscad.loadTheseFonts.length + " fonts.");
    Blockscad.numloaded = 0;
    for (var i = 0; i < Blockscad.loadTheseFonts.length; i++) {
      Blockscad.loadFontThenRender(i,code);
    }

  }
  else {
    Blockscad.renderCode(code);
  }
};
 
Blockscad.renderCode = function(code) {
  var csgcode = '';
  var code_good = true;
    try {
   // console.log("code was: ",code);
   window.setTimeout(function (){ csgcode = openscadOpenJscadParser.parse(code); 
                                  // console.log(csgcode);
                                }, 0);


   //code = openscadOpenJscadParser.parse(code);
   //console.log("code is now:",code);
  }
  catch(err) {
    // console.log("caught parsing error");
    $( '#error-message' ).html(err);
    $( '#error-message' ).addClass("has-error");
    code_good = false;
  }
  if (code_good) {
    window.setTimeout(function () 
      { Blockscad.gProcessor.setBlockscad(csgcode); 
        // console.log("code is now",code); 
      }, 0);
    // unbacklight all here
    Blockscad.workspace.clearBacklight();
  }
  else {
    $('#renderButton').html(Blockscad.Msg.RENDER_BUTTON); 

  }
};

// Blockscad.isRealChange is called from Blockscad.workspaceChanged to see if
// the changes should count as "undoable" or should be ignored.
// return == true means that it is a real change.
// return == false means it is ignorable.
// it checks for block deletion, block insertion, block connecting,
// block disconnecting, and collects field changes.
// each possible "is_real" condition is separate (like block insert vs. delete)
// to make it easier to configure the undo - what events trigger a real undo?

// Blockscad.isRealChange = function() {
//   // set up the info we need to determine a change
//   //time to parse block info.  Get ID's, parent ID's, and field values.
//   Blockscad.undo.blockIds = [];
//   Blockscad.undo.parentIds = [];
//   Blockscad.undo.fieldValues = [];
//   Blockscad.undo.isDisabled = [];
//   Blockscad.undo.varNames = [];
//   Blockscad.undo.comment = [];
//   Blockscad.undo.projectName = $('#project-name').val();

//   Blockscad.undo.triggerRender = false;   // should the change trigger a re-render?

//   var deletedBlockPos = null;
//   var addedBlockPos = null;
//   var deletedBlockParent = null;
//   var addedBlockParent = null;
//   var real_change = false;

//   // I'm not going to make a project name change an undoable change, but it will trigger needing to save.
//   if (Blockscad.undo.projectName != Blockscad.undo.oldProjectName) {
//     // console.log("projname: setting needToSave to 1");
//     Blockscad.undo.needToSave = 1;
//   }


//   // console.log("in realChange()");
//   // console.log("in isRealChange with current",Blockscad.undo.blockList);
//   // console.log("old at RealChange",Blockscad.undo.oldBlockList);

//   // save field values, ids, and parent ids, and disabled state for all blocks in workspace.

//   // if a procedure call block has been added, it will have an UNKNOWN type.
//   // populate its type.
//   for (var i = 0; i < Blockscad.undo.blockList.length; i++) {
//     Blockscad.undo.fieldValues[i] = Blockscad.undo.blockList[i].getAllFieldValues();
//     Blockscad.undo.blockIds[i] = Blockscad.undo.blockList[i].id;
//     Blockscad.undo.isDisabled[i] = Blockscad.undo.blockList[i].disabled;
//     Blockscad.undo.comment[i] = Blockscad.undo.blockList[i].getCommentText();
//     if (Blockscad.undo.blockList[i].type == "variables_set" || Blockscad.undo.blockList[i].type == "variables_get")
//       Blockscad.undo.varNames[i] = Blockscad.undo.blockList[i].getFieldValue('VAR');
//     else
//       Blockscad.undo.varNames[i] = null;
//     if (Blockscad.undo.blockList[i].getParent()) {
//       Blockscad.undo.parentIds[i] = Blockscad.undo.blockList[i].getParent().id;
//     }
//     else Blockscad.undo.parentIds[i] = null;
//     if (Blockscad.undo.blockList[i].category) {
//       if (Blockscad.undo.blockList[i].category == 'UNKNOWN') {
//         Blockscad.undo.blockList[i].getType();
//       }
//     }
//   }

//   // has the number of blocks decreased, or increased?
//   if (Blockscad.undo.blockCount > Blockscad.undo.blockList.length) {
//     // this is the "block deleted" condition
//     Blockscad.undo.fieldChanging = 0;
//     // were all the blocks deleted?
//     if (Blockscad.undo.blockList.length === 0) {
//       // All blocks were deleted.  An undo would have to restore current.xml here.
//     }
//     else {
//       deletedBlockPos = Blockscad.getExtraRootBlock(Blockscad.undo.oldBlockList, Blockscad.undo.blockList);
//       //console.log("got the deleted block postion at",deletedBlockPos);
//       var oldParentID = Blockscad.undo.oldParentIds[deletedBlockPos]; 
//       deletedBlockParent = Blockscad.getBlockFromId(oldParentID,Blockscad.undo.blockList);
//       if (deletedBlockParent) {
//         Blockscad.assignBlockTypes([deletedBlockParent]);
//         if (deletedBlockParent.type == 'variables_set')
//           Blockscad.assignVarTypes(deletedBlockParent);
//       }
//       // if the block that was deleted was a variable_set block, and the only one for that variable name, 
//       // I want to set all the instances to null.  I think I can just send all the instances to 
//       // the variable typing code.
//       if (Blockscad.undo.oldVarNames[deletedBlockPos] != null) {
//         // the deleted block had a variable name associated with it
//         // get all instances with that name? or just send the name?
//         var instances = Blockly.Variables.getInstances(Blockscad.undo.oldVarNames[deletedBlockPos],Blockscad.workspace);
//         for (var k = 0; instances && k < instances.length; k++) {
//           if (instances[k].type == 'variables_get')
//             Blockscad.assignVarTypes(instances[k]);
//         }
//       }
//     }
//     // console.log("setting needToSave to 1");
//     Blockscad.undo.needToSave = 1;
//     Blockscad.undo.triggerRender = true;
//     return true;
//   }
//   if (Blockscad.undo.blockCount < Blockscad.undo.blockList.length) {
//     // A block has been added here.  Get the new block.  If it has a category,
//     // send it to assignBlockTypes.  (might want to get parent too for undo?)
//     Blockscad.undo.fieldChanging = 0;
//     if (Blockscad.undo.oldBlockList.length === 0) {
//       // We just refreshed, loaded
//       Blockscad.assignBlockTypes(Blockly.mainWorkspace.getTopBlocks());
//       var allBlocks = Blockly.mainWorkspace.getAllBlocks();
//       for (var i = 0; i < allBlocks.length; i++) {
//         if (allBlocks[i].type == 'variables_set')
//           Blockscad.assignVarTypes(allBlocks[i]);
//       }
//       // console.log("whole workspace refreshed");
//     }
//     else {
//       addedBlockPos = Blockscad.getExtraRootBlock(Blockscad.undo.oldBlockList, Blockscad.undo.blockList);
//       Blockscad.assignBlockTypes([Blockscad.undo.blockList[addedBlockPos]]);
//       // if new block's or its parent is a variables_set block, do variable typing.
//       addedBlockParent = Blockscad.undo.blockList[addedBlockPos].getParent();
//       if (addedBlockParent && addedBlockParent.type == 'variables_set') {
//         // console.log("added block parent was a variables_set block, must do typing");
//         Blockscad.assignVarTypes(addedBlockParent);
//       }
//       if (Blockscad.undo.blockList[addedBlockPos].type == 'variables_set') {
//         // console.log("added block was a variables_set - type it")
//         Blockscad.assignVarTypes(Blockscad.undo.blockList[addedBlockPos]);
//       }
//     }
//     // console.log("setting needToSave to 1");
//     Blockscad.undo.needToSave = 1;
//     Blockscad.undo.triggerRender = true;
//     return true;
//   }

//   // I need to go through the blocks.  First, I'll check for blocks having different parents.
//   // I speculate that these are mainly plug/unplug events.  Is that true?
//   // on a plug/unplug event I run enableMathBlocks in case a math block was 
//   // plugged into something and needs to be enabled again. NOTE: I wasn't catching all
//   // the cases of math blocks needing to be enabled/disabled, so I do that on all changes,
//   // instead of here.

//   // after checking parents I check for field values changing.
//   // console.log("blockIds",Blockscad.undo.blockIds);
//   // console.log("oldBlockIds",Blockscad.undo.oldBlockIds);
//   // console.log("parentIds",Blockscad.undo.parentIds);
//   // console.log("oldParentIds",Blockscad.undo.oldParentIds);

//   // I'm also going to check if any variables have changed names.  That will trigger a type change.
//   for (var i = 0; i < Blockscad.undo.blockIds.length; i++) {
//     var myid = Blockscad.undo.blockIds[i];
//     var found_it = 0;
//     var disable_change = false;
//     for (var j = 0; j < Blockscad.undo.blockIds.length; j++) {
//       if (myid == Blockscad.undo.oldBlockIds[j]) {
//         found_it = 1;

//         if (Blockscad.undo.parentIds[i] != Blockscad.undo.oldParentIds[j]) {

//           // console.log("setting needToSave to 1");
//           Blockscad.undo.needToSave = 1;
//           Blockscad.undo.triggerRender = true;
//           // Blockscad.enableMathBlocks(Blockscad.undo.blockList[i]);

//           // determine if we had a "plug" or an "unplug" event, and 
//           // send either one or two stacks to get types evaluated.
//           // Note:  one event can be both a "plug" and an "unplug" event.
//           // console.log("plug or unplug - send block myid",myid);
//           Blockscad.assignBlockTypes([Blockscad.undo.blockList[i]]);
//           var plugParent = Blockscad.undo.blockList[i].getParent();
//           if (plugParent && plugParent.type == "variables_set") {
//             // console.log("something was plugged into a variables_set block, type it");
//             Blockscad.assignVarTypes(plugParent);
//           }
//           for (var k = 0, blk; blk = Blockscad.undo.blockList[k]; k++) {
//             if (blk.id == Blockscad.undo.oldParentIds[j]) {
//               // console.log("unplugged parent exists with id",blk.id);
//               Blockscad.assignBlockTypes([Blockscad.undo.blockList[k]]);
//               // Blockscad.enableMathBlocks(Blockscad.undo.blockList[k]);
//               if (Blockscad.undo.blockList[k].type == "variables_set") {
//                 // console.log("something was unplugged from var_set #" + blk.id + " ,type it");
//                 Blockscad.assignVarTypes(Blockscad.undo.blockList[k]);
//               }
//               break;
//             }
//           }
//           return true; // found a real change - a plug/unplug event!
//         }
//         if (Blockscad.undo.varNames[i] != Blockscad.undo.oldVarNames[j]) {
//           Blockscad.undo.fieldChanging = 0;
//           // console.log("found a var changing name from (old): " + 
//                         // Blockscad.undo.oldVarNames[j] + " to: " + Blockscad.undo.varNames[i]);
//           Blockscad.assignVarTypes(Blockscad.undo.blockList[i]);

//           // console.log("setting needToSave to 1");
//           Blockscad.undo.needToSave = 1;
//           Blockscad.undo.triggerRender = true;
//         }
//         if (Blockscad.undo.fieldValues[i] != Blockscad.undo.oldFieldValues[j]) {
//           // A field is changing.  I won't trigger undo yet to aggregate
//           // the keypresses, but I do want to enable the renderButton already.
//           $('#renderButton').prop('disabled', false); 
//           // console.log("found a field changing");
//           Blockscad.undo.fieldChanging = 1;



//           // console.log("setting needToSave to 1");
//           Blockscad.undo.needToSave = 1;
//           // if (Blockscad.undo.fieldChanging != myid) {
//           //   Blockscad.undo.fieldChanging = myid;
//           //   console.log("triggering field-change addition to undo stack");
//           //   //return true; // found a real change - a field is changing!
//           // }
//           // if (Blockscad.undo.editorClosed) {
//           //   console.log("in isRealChange.  editor was closed.");
//           //   return true;
//           // }
//           // else return false; // this event should be ignored by undo.
//         }
//         if (Blockscad.undo.fieldChanging) {
//           // console.log("currently, blockscad thinks a field is changing");
//           if (Blockscad.undo.editorClosed) {
//             // console.log("editor was closed.  Field no longer changing.");
//             Blockscad.undo.fieldChanging = 0;
//             Blockscad.undo.triggerRender = true;
//             return true;
//           }
//           // else
//           //   console.log("editor was not closed, so the field is still changing.");
//         }
//         if (Blockscad.undo.isDisabled[i] != Blockscad.undo.oldDisabled[j]) {
//           // some block has changed from disabled to enabled, or vice-versa.  Mark this
//           // as an undoable change.
//           // don't return from here though - I might need to enable/disable more math blocks.
//           real_change = true;
//           Blockscad.undo.triggerRender = true;
//         }
//         if (Blockscad.undo.comment[i] != Blockscad.undo.oldComment[j]) {
//           // a comment has been changed.  Note that this won't trigger if the comment icon is added.
//           // detecting when a comment is finished being entered is hard.  I'll
//           // only set a need to save here, not bother to make the change undoable.
//           // console.log("setting needToSave to 1");
//           Blockscad.undo.needToSave = 1;
//         }
//       }

//     }
//     if (!found_it) {
//       // this only happens after an undo when all block ids change
//       // I'm not even sure I need to have this here - I think it's redundant
//       //console.log("couldn't find a block id");
//       //console.log(Blockscad.undo.blockIds,Blockscad.undo.oldBlockIds);
//       return true;
//     }
//   }
//   if (real_change) {
//     // console.log("setting needToSave to 1");
//     Blockscad.undo.needToSave = 1;
//     return true;
//   } 
//   return false;
// };// end Blockscad.isRealChange()


// Blockscad.workspaceChanged = function () {




//   Blockscad.undo.yesthis = 0;  // don't know if this is a change to add to the undo stack yet.
//   //console.log("workspace has changed\n");
//   // important - check to see if the change is one we want to make undoable!
//   Blockscad.undo.blockList = Blockly.mainWorkspace.getAllBlocks();
//   //console.log("here's the current blocks in the workspace:",Blockscad.undo.blockList); 

//   Blockscad.undo.yesthis = Blockscad.isRealChange();

//   // console.log("ids:",Blockscad.undo.blockIds);
//   // console.log("oldids:",Blockscad.undo.oldBlockIds);
//   // console.log("pars:",Blockscad.undo.parentIds);
//   // console.log("oldp:",Blockscad.undo.oldParentIds);

//   //   Update all the change compare vars. for the next go round.
//   Blockscad.undo.blockCount = Blockscad.undo.blockList.length;
//   Blockscad.undo.oldBlockIds = Blockscad.undo.blockIds;
//   Blockscad.undo.oldParentIds = Blockscad.undo.parentIds;
//   Blockscad.undo.oldFieldValues = Blockscad.undo.fieldValues;
//   Blockscad.undo.oldDisabled = Blockscad.undo.isDisabled;
//   Blockscad.undo.oldComment = Blockscad.undo.comment;
//   Blockscad.undo.oldProjectName = Blockscad.undo.projectName;
//   Blockscad.undo.oldVarNames = Blockscad.undo.varNames;


// //  Blockscad.undo.oldBlockList = Blockscad.undo.blockList;
//  // console.log("do I have children?",Blockscad.undo.oldBlockList);

//   //Blockscad.checkMathOrphans();

//   if (Blockscad.undo.yesthis) {
//     //console.log("yesthis");
//     // there has been a substantive change.  I need to update the
//     // undo/redo stacks, and enable the render button, and check save status.

//     // if no blocks in workspace, don't prompt for saves.
//     if (Blockscad.undo.needToSave && Blockscad.undo.blockCount == 0)
//       Blockscad.setNoSaveNeeded();

//     $('#renderButton').prop('disabled', false); 

//     if (Blockscad.undo.just_did_undo) {
//       // because the current undo/redo method can change all the block ids
//       // I need to reassign block types to ALL BLOCKS afterwards (grr)
//       Blockscad.assignBlockTypes(Blockly.mainWorkspace.getTopBlocks());
//     }
//     if (Blockscad.undo.just_did_undo === 0) {
//       // push Blockscad.current_xml onto undo stack
//       if (Blockscad.undo.current_xml !== null) {
//         Blockscad.undo.undoStack.push(Blockscad.undo.current_xml);
//       }
//       // refill current_xml with the new, changed, xml state
//       Blockscad.undo.current_xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());

//       // clear redo list
//       while(Blockscad.undo.redoStack.length > 0) {
//         Blockscad.undo.redoStack.pop();
//       }
//       // if undo.length > (some number - 50?), shift off the first element
//       if (Blockscad.undo.undoStack.length > 50) {
//         Blockscad.undo.undoStack.shift();
//       }
//     }


//     // to turn on real-time render, run this command:
//     // Blockscad.doRender();
//   }
//   // even though this isn't a real change, I want to accumulate moves
//   // and field changes in the current state, which will then be pushed
//   // to the undo stack after a "real" change.
//   // refill current_xml with the new, changed, xml state
//   Blockscad.undo.current_xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
//   // copy all the blocks from blockList into oldBlockList (DOM format)
//   Blockscad.undo.oldBlockList = [];
//   for (var i = 0; i < Blockscad.undo.blockList.length; i++) {
//     Blockscad.undo.oldBlockList.push(Blockly.Xml.blockToDom_(Blockscad.undo.blockList[i]));
//   }
//   //console.log("old blocklist as dom at the end of workspace_changed", Blockscad.undo.oldBlockList);
//   //console.log("just_did_undo = 0");
//   Blockscad.undo.just_did_undo = 0;


// }; // end workspaceChanged()
Blockscad.getExtraRootBlock = function(old,current) {
  //console.log("starting getExtraRootBlock");
  var gotOne = 0;
  var foundIt = [];
  //console.log("old",old);
  //console.log("current",current);

  // go through the longer list, whichever it is.  
  // for each element of the longer list, go through
  // all elements of the shorter array.  At each position,
  // compare block ids.  

  if (old.length > current.length) {
    for (var i=0; i < old.length; i++) {
      gotOne = 0;
      for (var j = 0; j < current.length; j++) {
        // compare block ids.  Have we found a match for the first list?
        if (old[i].getAttribute('id') == current[j].id) {
          // found a match.  Save the id, and break out.
          gotOne = 1;
          break;
        }
      }
      if (!gotOne)
        return i;
    }
  }
  else {
    for (var i=0; i < current.length; i++) {
      gotOne = 0;
      for (var j = 0; j < old.length; j++) {
        // compare block ids.  Have we found a match for the first list?
        if (current[i].id == old[j].getAttribute('id')) {
          // found a match.  Save the id, and break out.
          gotOne = 1;
          break;
        }
      }
      if (!gotOne)
        return i;
    }
  }
  // console.log("getExtraRootBlock failed!");
  return 0;  // this should never happen
};

// this get block from id function searches a given list of blocks, 
// instead of the blocks in the main workspace.  Needed for typing.
Blockscad.getBlockFromId = function(id, blocks) {
  for (var i = 0, block; block = blocks[i]; i++) {
    if (block.id == id) {
      return block;
    }
  }
  return null;
};

Blockscad.aCallerBlock = function(block, callers) {
  for (var i = 0; i < callers.length; i++)
    if (block == callers[i]) return true;
  return false;
}; // end Blockscad.aCallerBlock

// have a single block, and want to find out what type it's stack makes it?
// This is for procedure caller block typing.

Blockscad.findBlockType = function(block, callers) {
  var topBlock = block.getRootBlock();
  var blockStack = topBlock.getDescendants();
  var foundCSG = 0;
  var foundCAG = 0;

  // when I check the types of the surrounding blocks,
  // I DON'T want to count procedure calling blocks 
  // that are from the same procedure definition as "block".
  for (var j = 0; j < blockStack.length; j++) {
    if (!Blockscad.aCallerBlock(blockStack[j],callers) && blockStack[j].category) {
      var cat = blockStack[j].category;
      if (cat == 'PRIMITIVE_CSG' || cat == 'EXTRUDE' || cat == 'COLOR') {
        foundCSG = 1;
        break;
      }
      if (cat == 'PRIMITIVE_CAG') foundCAG = 1;
    }
  }
  //console.log("in findBlockAreaType with", blockStack);
  if (foundCSG) {
    if (Blockscad.hasExtrudeParent(block)) 
      return 'CAG';
    else return 'CSG';
  }
  else if (foundCAG) {
    return('CAG');
  }
  return('EITHER');
};

// this takes a block.  It checks each parent in its stack to see if it has
// a parent of the specified block_type (like variable_set)
// returns the parent block if it exists, otherwise null.
Blockscad.hasParentOfType = function(block, type) {
  if (!block)
    return null;
  var parent = block.getParent();
  while (parent) {
    // console.log("found a parent of type ", type);
    if (parent.type == type)
      return parent;
    parent = parent.getParent();
  }
  return null;
}

// is this block attached to an actual primitive (2D or 3D)?  Needed for missing fields calc.
// if the block has a disabled parent, it won't be rendered and doesn't count.
Blockscad.stackIsShape = function(block) {
  var blockStack = block.getDescendants();
  for (var i = 0; i < blockStack.length; i++) {
    var blk = blockStack[i];
    // console.log(blk);
    // console.log(blk.disabled);
    if ((blk.category == 'PRIMITIVE_CSG' || blk.category == 'PRIMITIVE_CAG') && !blk.hasDisabledParent())
      return true;
  }
  return false;
};

// Blockscad.assignVarTypes
// input: single block of type variables_set
// or a block of variables_get type whose name has just been changed
// and needs to pick up its new variable's type.
// on a refresh I will be sent an array of all blocks and need to pick
// out the variables_set blocks.
// I need to type the variable instances of the variables_set blocks.
// name_change indicates if a variable setter has had its name changed
// in that case, set the current type to a non-sensical value
// to force the variable set_type to give it a new value.
Blockscad.assignVarTypes = function(blk, name_change) {
  // console.log("in assignVarTypes with ", blk.type);
  // I need to go through the children of the variables_set block.
  // I am only interested in children that have an output connection.
  //does this block have any children?  If not, change type to null.

  setTimeout(function() {
    if (blk && blk.type == "variables_get") {
      // this variables_get just had its name changed.  Find out the type of this
      // variable name and assign it only to this particular instance of the get.
      // console.log(blk.id + " just changed name to " + blk.getFieldValue("VAR"));
      var instances = Blockly.Variables.getInstances(blk.getFieldValue('VAR'), Blockscad.workspace);
      var found_it = 0;
      for (var i = 0; i < instances.length; i++) {
        if (instances[i].type == "variables_set") {
          blk.outputConnection.setCheck(instances[i].myType_);
          found_it = 1;
          break;
        }
        if (instances[i].type == "controls_for" || instances[i].type == "controls_for_chainhull") {
          blk.outputConnection.setCheck(null);
          found_it = 1;
          break;
        }
      }
      if (!found_it) {
        // this came out of a procedure - no set_variable block to go with it.  
        // a procedure could have any type associated, so set type to null.
        // console.log("setting a variables_get block to type null");
        blk.outputConnection.setCheck(null);
      }
      // now, if this variables_get was inside a variables_set, that variables_set needs to be retyped.
      var parent = blk.getParent();
      if (parent && parent.type == "variables_set") {
        Blockscad.assignVarTypes(parent);
      }
    }
    else if (blk && blk.type == "variables_set") {
      // console.log("in assignVarTypes with var_set named: ", blk.getFieldValue('VAR'));
      var children = blk.getChildren();
      if (children.length == 0)
        blk.setType(null);
      else {
        var found_one = 0;
        var type = null;

        for (var i = 0; i < children.length; i++) {
          // console.log("child " + i + " has type " + children[i].type);
          if (children[i].outputConnection) {
            var childType = children[i].outputConnection.check_;
            // console.log("child " + i + "has an output connection of type " + childType);
            // console.log(childType + " is this type an array?: " + goog.isArray(childType));
            if (name_change)
              blk.myType_ = "FALSE";
            blk.setType(childType);
            found_one = 1;
            // break;
          }
        }
        if (found_one == 0)
          blk.setType(null);
      }
    }
  },0);
}
Blockscad.handleWorkspaceEvents = function(event) {
  if (event.type == Blockly.Events.UI) {
    return;  // Don't care about UI events
  }
  if (event.type == Blockly.Events.CREATE || 
      event.type == Blockly.Events.DELETE) {
    // this should trigger needing to save and a type change!  I could duplicate a stack 
    // that needs typing, or delete a setter that would set its getters to null type.
    // console.log("create or delete event:",event);
    Blockscad.undo.needToSave = 1; 

    // set the type of newly created procedure call blocks.  

    var block = Blockscad.workspace.getBlockById(event.ids[0]);
    if (block && block.workspace && !block.workspace.isFlyout) {
      if (block.type == 'procedures_callnoreturn' || block.type == 'procedures_callreturn')
        block.setType();
      // Blockscad.typeNewStack(block);
    }
  }
  else if (event.type == Blockly.Events.CHANGE) {
    // trigger a need to save
    Blockscad.undo.needToSave = 1;

    // This could be variable name changes (getter or setter), which trigger typing.
    // console.log(event);
    if (event.element == 'field' && event.name == 'VAR') {
      // a variable has changed name.
      var oldName = event.oldValue;
      // console.log("old variable name was:", oldName);
      // var newName = event.newValue;

      var block = Blockscad.workspace.getBlockById(event.blockId);

      if (block && block.type == 'variables_set') {
        // variables_set has changed name.  Go through instances of the old name.  If there is a 
        // variables_set, use that to type the rest.  Otherwise, type the getters individually.
        var instances = Blockly.Variables.getInstances(oldName,Blockscad.workspace);
        // console.log("instances:", instances);
        var found_it = 0;
        for (var k = 0; instances && k < instances.length; k++) {
          if (instances[k].type == 'variables_set')
            Blockscad.assignVarTypes(instances[k],true);
          found_it = 1;
        }
        if (!found_it) {
          for (var k = 0; instances && k < instances.length; k++) {
            if (instances[k].type == 'variables_get')
              Blockscad.assignVarTypes(instances[k],true);

          }  
        }
      }
      // also type the block associated with the new name.  If this is a getter, it gets typed.
      // if it is a setter, it needs to be typed and have all its new getters typed.
      Blockscad.assignVarTypes(block, true);
    }
    if (event.element == 'field' && event.name == 'NUM')  {
      var block = Blockscad.workspace.getBlockById(event.blockId);
      var parent = block.getParent();
      if (parent && parent.type == 'cylinder')
        parent.updateRadii();
    }

  }
  else if (event.type == Blockly.Events.MOVE) {
    // this holds plug/unplug events.  
    // plug event: has newParentID.  trigger type change on new parents block stack.
    // unplug event: has oldParentID.  trigger type change on current block and old parent's stack.
    if (event.oldParentId) {
      // unplug event.  call typing on old parent stack and current stack.
      // console.log("unplug event");

      var block = Blockscad.workspace.getBlockById(event.blockId);
      var oldParent = Blockscad.workspace.getBlockById(event.oldParentId);
      Blockscad.assignBlockTypes([block]);
      Blockscad.assignBlockTypes([oldParent]);

      if (block && block.type == 'variables_set')
        Blockscad.assignVarTypes(block);
      else if (oldParent && oldParent.type == 'variables_set')
        Blockscad.assignVarTypes(oldParent);
 
    }
    else if (event.newParentId) {
      // plug event.  call typing on the stack.
      // console.log("plug event");
      var block = Blockscad.workspace.getBlockById(event.blockId);
      var newParent = Blockscad.workspace.getBlockById(event.newParentId);
      Blockscad.assignBlockTypes([block]);
      if (newParent && newParent.type == 'variables_set')
        Blockscad.assignVarTypes(newParent);

    }

    if (event.oldParentId || event.newParentId) {
      // either a plug or an unplug
      console.log("setting needToSave to 1");
      Blockscad.undo.needToSave = 1;
    }

  }
}
// Blockscad.assignBlockTypes
// input: array of blocks whose trees need typing
// schedule typing to be done so that scheduled events have
// already been fired by the time typing is done.
Blockscad.assignBlockTypes = function(blocks) {
  // console.log("in assignBlockTypes");
  if (!goog.isArray(blocks))
    blocks = [blocks];
  setTimeout(function() {
    // console.log(blocks);
    for (var i=0; blocks && blocks[i] && i < blocks.length; i++) {
      var topBlock = blocks[i].getRootBlock();
      var blockStack = topBlock.getDescendants();
      var foundCSG = 0;
      var foundCAG = 0;

      for (var j = 0; j < blockStack.length; j++) {
        if (blockStack[j].category) {
          var cat = blockStack[j].category;
          if (cat == 'PRIMITIVE_CSG' || cat == 'EXTRUDE' || cat == 'COLOR') {
            foundCSG = 1;
            break;
          }
          if (cat == 'PRIMITIVE_CAG') foundCAG = 1;
        }
      }
      // For assigning types, use the following algorithm:
      // Go down the list of blocks.  if foundCSG:
      //    if block has an EXTRUDE parent, set to CAG, otherwise CSG
      //    else if found CAG, set to CAG
      //    else set to EITHER.
      for(j = 0; j < blockStack.length; j++) {
        if (blockStack[j].category)
          if (blockStack[j].category == 'TRANSFORM' || 
              blockStack[j].category == 'SET_OP' ||
              blockStack[j].category == 'PROCEDURE' ||
              blockStack[j].category == 'LOOP')  {
            var drawMe = !blockStack[j].collapsedParents();
            // var drawMe = 0;
            // console.log(blockStack[j].type,"drawMe is", drawMe);
            if (foundCSG) {
              if (Blockscad.hasExtrudeParent(blockStack[j])) 
                blockStack[j].setType(['CAG'],drawMe);
              else blockStack[j].setType(['CSG'],drawMe);
            }
            else if (foundCAG) {
              blockStack[j].setType(['CAG'],drawMe);
            }
            else blockStack[j].setType(['CSG','CAG'],drawMe);
          }
      }
      // console.log("in assignBlockTypes(foundCSG,foundCAG)",foundCSG,foundCAG);
      //console.log("blockStack",blockStack);
    }
  }, 0);
};
Blockscad.hasExtrudeParent = function(block) {
  do {
    if (block.category == 'EXTRUDE')
      return true;
    block = block.parentBlock_;
  } while (block);
  return false;
};

/**
 * Initialize the page language.
 */
Blockscad.initLanguage = function() {
  // Set the HTML's language and direction.
  // document.dir fails in Mozilla, use document.body.parentNode.dir instead.
  // https://bugzilla.mozilla.org/show_bug.cgi?id=151407
  var rtl = BSUtils.isRtl();
  document.head.parentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
  document.head.parentElement.setAttribute('lang', BSUtils.LANG);

  // console.log("lang is:",BSUtils.LANG);

  // Sort languages alphabetically.
  var languages = [];
  var lang;
  for (lang in BSUtils.LANGUAGE_NAME) {
    languages.push([BSUtils.LANGUAGE_NAME[lang], lang]);
  }
  var comp = function(a, b) {
    // Sort based on first argument ('English', 'Русский', '简体字', etc).
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    return 0;
  };
  languages.sort(comp);
  // Populate the language selection menu.
  // languageMenu is a <ul>, populate it with <li>s

  var items = [];

  for (var i = 0; i < languages.length; i++) {
    items.push('<li><a href="#" class="lang-option" data-lang="' + languages[i][1] + '"</a>' + languages[i][0] + '</li>');
  }
  $('#languageMenu').append( items.join('') );

  $('.lang-option').on("click", BSUtils.changeLanguage);
};
/**
 * Save the workspace to an XML file.
 */
Blockscad.saveBlocksLocal = function() {
  var xmlDom = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
  var xmlText = Blockly.Xml.domToText(xmlDom);
  // console.log(xmlText);
  var blob = new Blob([xmlText], {type: "text/plain;charset=utf-8"});


  // pull a filename entered by the user
  var blocks_filename = $('#project-name').val();
  // don't save without a filename.  Name isn't checked for quality.
  // console.log("in SaveBlocksLocal with: ", blocks_filename);
  if (blocks_filename) {
    saveAs(blob, blocks_filename + ".xml");
    console.log("SAVED locally: setting needToSave to 0");
    Blockscad.setNoSaveNeeded();
  }
  else {
    alert(Blockscad.Msg.SAVE_FAILED + '!\n' + Blockscad.Msg.SAVE_FAILED_PROJECT_NAME);
  }
};

Blockscad.savePicLocal = function(pic) {
  var blob = new Blob([pic], {type: "img/jpeg"});

  saveAs(blob, "tryThis.jpg");

}

/**
 * Save the openScad code for the current workspace to the local machine.
 */
Blockscad.saveOpenscadLocal = function() {
  var code = Blockly.OpenSCAD.workspaceToCode(Blockscad.workspace); 
  var blob = new Blob([code], {type: "text/plain;charset=utf-8"});

  // pull a filename entered by the user
  var blocks_filename = $('#project-name').val();
  // don't save without a filename.  Name isn't checked for quality.
  if (blocks_filename) {
    saveAs(blob, blocks_filename + ".scad");
  }
  else {
    alert("SAVE FAILED.  Please give your project a name, then try again.");
  }
};


// execute_ will delay a given action until Blockly is no longer in drag mode.
// code courtesy of miguel.ceriani@gmail.com (Miguel Ceriani)
// released under the Apache 2.0 license

Blockscad.executeAfterDrag_ = function(action, thisArg) {
  Blockscad.renderActions.push( { action: action, thisArg: thisArg } );
  if (Blockscad.renderActions.length === 1) {
    var functId = window.setInterval(function() {
      if (!Blockly.dragMode_) {
        while (Blockscad.renderActions.length > 0) {
          var actionItem = Blockscad.renderActions.shift();
          actionItem.action.call(Blockscad.renderActions.thisArg);
        }
        window.clearInterval(functId);
      }
    }, 10);
  }
};

// helper function used in typing to compare type arrays and see if they are equal.

Blockscad.arraysEqual = function(arr1, arr2) {
  if (arr1 == null && arr2 == null)
    return true;
  if (!arr1 || !arr2)
    return false;

    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

