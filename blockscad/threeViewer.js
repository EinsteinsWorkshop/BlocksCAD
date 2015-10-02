// threeViewer.js
// based on openjscad.js, (written by Joost Nieuwenhuijse (MIT License) with adjustments by Rene K. Mueller <spiritdude@gmail.com> for OpenJSCAD.org) and  viewer.js  by J. Yoder for BlocksCAD
// ThreeViewer.js is viewer that uses three.js as WebGL library, adapted  for BlocksCAD by Juan Blanco Segleau under MIT License 
var Blockscad =  Blockscad || {};
var CSG = CSG || {};
var CAG = CAG || {};

// A viewer is a WebGL canvas that lets the user view a mesh. The user can
// tumble it around by dragging the mouse.

Blockscad.Viewer = function(containerelement, width, height, initialdepth) {
  var scene = new THREE.Scene();
  this.scene=scene;
  var camera = new THREE.PerspectiveCamera( 45, width/height, 1, 10000 );
  this.camera=camera;
  this.camera.position.set( 50, -50, 50 );
  this.camera.up.set( 0, 0, 1 );
  this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
  var renderer = new THREE.WebGLRenderer({ antialias: true });
  this.renderer=renderer;
  this.renderer.setClearColor( 0xEDEDED, 1.0 );
  this.renderer.shadowMap.enabled = true;
  this.renderer.shadowMapSoft = false;
  this.renderer.shadowCameraNear = 1;
  this.renderer.shadowCameraFar = this.camera.far;
  this.renderer.shadowCameraFov = 45;
  this.renderer.shadowMapBias = 0.0039;
  this.renderer.shadowMapDarkness = 0.5;
  this.renderer.shadowMapWidth = 1024;
  this.renderer.shadowMapHeight = 1024;
  this.renderer.setSize( width, height );
  var controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
  this.controls=controls;
  this.controls.enableDamping = true;
  this.controls.dampingFactor = 0.5;
  this.controls.enableZoom = true;
  this.controls.zoomSpeed = 3;
  var light = new THREE.DirectionalLight(0xffffff, 1);
  this.light=light;
  this.light.castShadow = true;
  this.light.position.copy( this.camera.position );
  this.scene.add(this.light);
  this.axes = this.buildAxes( 200 );
  this.GridPlane = this.buildGridPlane(200);
  this.scene.add(this.axes);
  this.scene.add(this.GridPlane);
  $(containerelement).append(this.renderer.domElement);
  var this_viewer =this;
  //render loop
  var render = function () {
    requestAnimationFrame( render );
    this_viewer.controls.update();
    this_viewer.light.position.copy(this_viewer.camera.position );
    this_viewer.renderer.render(this_viewer.scene, this_viewer.camera);
  };
  render();
  
};

Blockscad.Viewer.prototype = {
  setCsg: function(csg) {
    // if(0&&csg.length) {                            // preparing multiple CSG's (not union-ed), not yet working
    //    for(var i=0; i<csg.length; i++)
    //       this.meshes.concat(OpenJsCad.Viewer.csgToMeshes(csg[i]));
    // } else {
    //    this.meshes = OpenJsCad.Viewer.csgToMeshes(csg);
    // }
      this.scene.remove(  this.scene.getObjectByName("threeMesh"));//remove old Mesh if exist.
      this.threeMesh = Blockscad.Viewer.csgToThreeMesh(csg);
      this.threeMesh.name="threeMesh";
      this.scene.add(this.threeMesh);
  },

  rendered_resize: function(width, height) { 
      this.renderer.setSize( width, height );
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

  },

  viewReset: function() {
    var whichView = document.getElementById("viewMenu");

    if (whichView.value == "top") {
      this.controls.reset();
      this.camera.position.set( 0, 0, 50 );
      this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

    }
    else if (whichView.value == "front") {
      this.controls.reset();
      this.camera.position.set( 0, -50, 0 );
      this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
    }
    else if (whichView.value == "left") {    
      this.controls.reset();
      this.camera.position.set( -50, 0, 0 );
      this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

   
    }
    else if (whichView.value == "right") {
      this.controls.reset();
      this.camera.position.set( 50, 0, 0 );
      this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
   
    }
    else if (whichView.value == "bottom") {
      this.controls.reset();
      this.camera.position.set( 0, 0, -50 );
      this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );


    }
    else if (whichView.value == "back") {   
      this.controls.reset(); 
      this.camera.position.set( 0, 50, 0 );
      this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
 
    }
    else if (whichView.value == "diagonal") {
      this.controls.reset();
      this.camera.position.set( 50, -50, 50 );
      this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
    }
 
  },
  supported: function() {
    return !!this.gl;
  },


 
  toggleAxes:function(e) {
  if (this.scene.getObjectByName("axes")&&this.scene.getObjectByName("GridPlane")) {
      this.scene.remove(  this.scene.getObjectByName("axes"));//remove axes
      this.scene.remove(  this.scene.getObjectByName("GridPlane"));//remove grid plane
    }else{
      this.scene.add(this.axes);
      this.scene.add(this.GridPlane);
    }
  },
  buildLine: function( src, dst, colorHex, dashed, lineWidth  ){
    var geom = new THREE.Geometry(),mat;
    if(dashed) {
      mat = new THREE.LineDashedMaterial({ linewidth: lineWidth, color: colorHex, dashSize: 1, gapSize: 1 });
    }else {
      mat = new THREE.LineBasicMaterial({ linewidth: lineWidth, color: colorHex });
    }
    geom.vertices.push( src.clone() );
    geom.vertices.push( dst.clone() );
    geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines
    var axis = new THREE.Line( geom, mat, THREE.LineSegments );
    return axis;
  },
  buildAxes: function( length ){
    length=length/2;
    var axes = new THREE.Object3D();
    axes.name ="axes";
    axes.add( this.buildLine( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false,1)); // +X
    axes.add( this.buildLine( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true,1)); // -X
    axes.add( this.buildLine( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false,1)); // +Y
    axes.add( this.buildLine( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true,1)); // -Y
    axes.add( this.buildLine( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false,1)); // +Z
    axes.add( this.buildLine( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true,1)); // -Z

    //draw X character
     axes.add(this.buildLine( new THREE.Vector3( -5+length+5, -5, 0 ), new THREE.Vector3(5+length+5, 5, 0 ), 0x000000, false,1));
     axes.add(this.buildLine( new THREE.Vector3( 5+length+5, -5, 0 ), new THREE.Vector3(-5+length+5, 5, 0 ), 0x000000, false,1));

    //draw Y character
    axes.add(this.buildLine( new THREE.Vector3( 0, 0+length, 0 ), new THREE.Vector3(0, 5+length, 0 ), 0x000000, false,1));
    axes.add(this.buildLine( new THREE.Vector3( 0, 5+length, 0 ), new THREE.Vector3(5, 10+length, 0 ), 0x000000, false,1));
    axes.add(this.buildLine( new THREE.Vector3( 0, 5+length, 0 ), new THREE.Vector3(-5, 10+length, 0 ), 0x000000, false,1));
    //draw Z character
    axes.add(this.buildLine( new THREE.Vector3( -5, 0, 0+length+5), new THREE.Vector3(5, 0, 0 +length+5), 0x000000, false,1));
    axes.add(this.buildLine( new THREE.Vector3( -5, 0, 0+length +5), new THREE.Vector3(5, 0,10 +length+5), 0x000000, false,1));
    axes.add(this.buildLine( new THREE.Vector3( 5, 0, 10+length +5), new THREE.Vector3(-5, 0, 10+length+5), 0x000000, false,1));
 
    return axes;
  },
  buildGridPlane: function(size){
    var GridPlane = new THREE.Object3D();
    GridPlane.name="GridPlane";
    size=size/2;
    for(var x=-size; x<0; x++) {
      GridPlane.add(this.buildLine( new THREE.Vector3( x, -size, 0 ), new THREE.Vector3( x, size, 0 ), 0xDDDDDD, false,1 ));
      GridPlane.add(this.buildLine( new THREE.Vector3( -size, x, 0 ), new THREE.Vector3( size, x, 0 ), 0xDDDDDD, false,1 ));
    }
    for(var x=1; x<=size; x++) {
      GridPlane.add(this.buildLine( new THREE.Vector3( x, -size, 0 ), new THREE.Vector3( x, size, 0 ), 0xDDDDDD, false,1 ));
      GridPlane.add(this.buildLine( new THREE.Vector3( -size, x, 0 ), new THREE.Vector3( size, x, 0 ), 0xDDDDDD, false,1 ));
      //draw hashmarks on z axis
      GridPlane.add(this.buildLine( new THREE.Vector3( -0.5, -0.5, x ), new THREE.Vector3( 0.5, 0.5, x ), 0xDDDDDD, false,1 ));
      GridPlane.add(this.buildLine( new THREE.Vector3(  0.5, -0.5, x ), new THREE.Vector3( -0.5, 0.5, x ), 0xDDDDDD, false,1 ));
    }
    for(var x=-size; x<0; x+=10) {
      GridPlane.add(this.buildLine( new THREE.Vector3( x, -size, 0 ), new THREE.Vector3( x, size, 0 ), 0xC4C4C4, false,1 ));
      GridPlane.add(this.buildLine( new THREE.Vector3( -size, x, 0 ), new THREE.Vector3( size, x, 0 ), 0xC4C4C4, false,1 ));
      //draw mayor hashmarks on -z axis
      GridPlane.add(this.buildLine( new THREE.Vector3( -1, -1, x ), new THREE.Vector3( 1, 1, x ), 0xC4C4C4, false,1 ));
      GridPlane.add(this.buildLine( new THREE.Vector3(  1, -1, x ), new THREE.Vector3( -1, 1, x ), 0xC4C4C4, false,1 ));

    }
    for(var x=10; x<=size; x+=10) {
      GridPlane.add(this.buildLine( new THREE.Vector3( x, -size, 0 ), new THREE.Vector3( x, size, 0 ), 0xC4C4C4, false,1 ));
      GridPlane.add(this.buildLine( new THREE.Vector3( -size, x, 0 ), new THREE.Vector3( size, x, 0 ), 0xC4C4C4, false,1 ));
      //draw mayor hashmarks on z axis
      GridPlane.add(this.buildLine( new THREE.Vector3( -1, -1, x ), new THREE.Vector3( 1, 1, x ), 0xC4C4C4, false,1 ));
      GridPlane.add(this.buildLine( new THREE.Vector3(  1, -1, x ), new THREE.Vector3( -1, 1, x ), 0xC4C4C4, false,1 ));

    }
    return GridPlane;
  }
};


Blockscad.Viewer.getGeometryVertice= function( threeGeometry, vertice_position ){
  threeGeometry.vertices.push( new THREE.Vector3( vertice_position.x, vertice_position.y, vertice_position.z ) );
  return threeGeometry.vertices.length - 1;
}

Blockscad.Viewer.csgToThreeMesh = function( csg_model ) {
  var csg = csg_model.canonicalized();
  var i, j, vertices, face,
  three_geometry = new THREE.Geometry( ),
  polygons = csg.toPolygons( );
  if ( !CSG ) {
    throw 'CSG library not loaded. Please get a copy from https://github.com/evanw/csg.js';
  }
  for ( i = 0; i < polygons.length; i++ ) {
    vertices = []; 
    for ( j = 0; j < polygons[i].vertices.length; j++ ) {
      vertices.push( Blockscad.Viewer.getGeometryVertice( three_geometry, polygons[i].vertices[j].pos ) );
    }
    if ( vertices[0] === vertices[vertices.length - 1] ) {
      vertices.pop( );//si el ultimo es igual que el primero borra el ultimo
    }		
    for (var j = 2; j < vertices.length; j++) {
      face = new THREE.Face3( vertices[0], vertices[j-1], vertices[j], new THREE.Vector3( ).copy( polygons[i].plane.normal ) );
      three_geometry.faces.push( face );
      three_geometry.faceVertexUvs[0].push( [new THREE.Vector2(0, 0),new THREE.Vector2(0, 1),new THREE.Vector2(1, 0)]);
    }
  }
  three_geometry.computeBoundingBox();
  var material = new THREE.MeshPhongMaterial( { color: 0xF880F8, 
    //specular: 0x0f0f0f,
    shininess: 50}  );
  var three_mesh = new THREE.Mesh( three_geometry, material );
  return three_mesh;
}
Blockscad.makeAbsoluteUrl = function(url, baseurl) {
  // console.log("in makeAbsoluteUrl: ",url + "    " + baseurl);
  if(!url.match(/^[a-z]+\:/i)) {
    var basecomps = baseurl.split("/");
    if(basecomps.length > 0) {
      basecomps.splice(basecomps.length - 1, 1);
    }
    var urlcomps = url.split("/");
    var comps = basecomps.concat(urlcomps);
    var comps2 = [];
    comps.map(function(c) {
      if(c == "..") {
        if(comps2.length > 0) {
          comps2.splice(comps2.length - 1, 1);
        }
      } else {
        comps2.push(c);
      }
    });  
    url = "";
    for(var i = 0; i < comps2.length; i++) {
      if(i > 0) url += "/";
      url += comps2[i];
    }
  }
  return url;
};


Blockscad.parseBlockscadScriptASync = function(script, callback) {
  var baselibraries = [
    //"blockscad/viewer_compressed.js"
      "blockscad/csg.js",
      "blockscad/viewer.js"
  ];

  // console.log("in parseBlockscadScriptASync");
  var baseurl = document.location.href.replace(/\?.*$/, '');
  baseurl = baseurl.replace(/#.*$/,'');        // remove remote URL 
  var blockscadurl = baseurl;

  var libraries = [];

  for(var i in gMemFs) {            // let's test all files and check syntax before we do anything
    var src = gMemFs[i].source+"\nfunction include() { }\n";
    var f;
    try {
       f = new Function(src);
    } catch(e) {
      this.setError(i+": "+e.message);
      console.log(e.message);
    }
  }
  var workerscript = "//ASYNC\n";
  // workerscript += "var me = " + JSON.stringify(me) + ";\n";
  workerscript += "var _csg_baseurl=" + JSON.stringify(baseurl)+";\n";        // -- we need it early for include()
  workerscript += "var _includePath=" + JSON.stringify(_includePath)+";\n";    //        ''            ''
  workerscript += "var gMemFs = [];\n";
  var ignoreInclude = false;
  var mainFile;
  for(var fn in gMemFs) {
     workerscript += "// "+gMemFs[fn].name+":\n";
     //workerscript += gMemFs[i].source+"\n";
     if(!mainFile) 
        mainFile = fn;
     if(fn=='main.jscad'||fn.match(/\/main.jscad$/)) 
        mainFile = fn;
     workerscript += "gMemFs[\""+gMemFs[fn].name+"\"] = "+JSON.stringify(gMemFs[fn].source)+";\n";
     ignoreInclude = true;
  }
  if(ignoreInclude) {
     workerscript += "eval(gMemFs['"+mainFile+"']);\n";
  } else {
     workerscript += script;
  }
  workerscript += "\n\n\n\n//// The following code was added by OpenJsCad + OpenJSCAD.org:\n";


  workerscript += "var _csg_baselibraries=" + JSON.stringify(baselibraries)+";\n";
  workerscript += "var _csg_libraries=" + JSON.stringify(libraries)+";\n";
  workerscript += "var _csg_blockscadurl=" + JSON.stringify(blockscadurl)+";\n";
  workerscript += "var _csg_makeAbsoluteURL=" + Blockscad.makeAbsoluteUrl.toString()+";\n";
//  workerscript += "if(typeof(libs) == 'function') _csg_libraries = _csg_libraries.concat(libs());\n";
  workerscript += "_csg_baselibraries = _csg_baselibraries.map(function(l){return _csg_makeAbsoluteURL(l,_csg_blockscadurl);});\n";
  workerscript += "_csg_libraries = _csg_libraries.map(function(l){return _csg_makeAbsoluteURL(l,_csg_baseurl);});\n";
  workerscript += "_csg_baselibraries.map(function(l){importScripts(l)});\n";
  workerscript += "_csg_libraries.map(function(l){importScripts(l)});\n";
  workerscript += "self.addEventListener('message', function(e) {if(e.data && e.data.cmd == 'render'){";
  workerscript += "  Blockscad.runMainInWorker();";
  workerscript += "}},false);\n";


// trying to get include() somewhere: 
// 1) XHR fails: not allowed in blobs
// 2) importScripts() works for ASYNC <----
// 3) _csg_libraries.push(fn) provides only 1 level include()

  if(!ignoreInclude) {
     workerscript += "function include(fn) {" +
  "if(0) {" +
    "_csg_libraries.push(fn);" +
  "} else if(1) {" +
   "if(gMemFs[fn]) {" +
      "eval(gMemFs[fn]); return;" +
   "}" +
    "var url = _csg_baseurl+_includePath;" +
    "var index = url.indexOf('index.html');" +
    "if(index!=-1) {" +
       "url = url.substring(0,index);" +
    "}" +
  	 "importScripts(url+fn);" +
  "} else {" +
   "var xhr = new XMLHttpRequest();" +
   "xhr.open('GET', _includePath+fn, true);" +
   "xhr.onload = function() {" +
      "return eval(this.responseText);" +
   "};" +
   "xhr.onerror = function() {" +
   "};" +
   "xhr.send();" +
  "}" +
"}";
  } else {
     //workerscript += "function include() {}\n";
     workerscript += "function include(fn) { eval(gMemFs[fn]); }\n";
  }
  //workerscript += "function includePath(p) { _includePath = p; }\n";
  var blobURL = Blockscad.textToBlobUrl(workerscript);
  // console.log("blobURL",blobURL);
   // console.log("workerscript",workerscript);
  
  if(!window.Worker) throw new Error("Your browser doesn't support Web Workers. Please try the Chrome or Firefox browser instead.");
  var worker = new Worker(blobURL);
  worker.onmessage = function(e) {
    if(e.data)
    { 
      if(e.data.cmd == 'rendered')
      {
        var resulttype = e.data.result.class;
        var result;
        if(resulttype == "CSG")
        {
          result = CSG.fromCompactBinary(e.data.result);
        }
        else if(resulttype == "CAG")
        {
          result = CAG.fromCompactBinary(e.data.result);
        }
        else
        {
          throw new Error("Cannot parse result");
        }
        callback(null, result);
      }
      else if(e.data.cmd == "error")
      {
        callback(e.data.err, null);
      }
      else if(e.data.cmd == "log")
      {
        console.log(e.data.txt);
      }
    }
  };
  worker.onerror = function(e) {
    var errtxt = "Error in line "+e.lineno+": "+e.message;
    callback(errtxt, null);
  };
  worker.postMessage({
    cmd: "render"
  }); // Start the worker.
  return worker;
};

Blockscad.getWindowURL = function() {
  if(window.URL) return window.URL;
  else if(window.webkitURL) return window.webkitURL;
  else throw new Error("Your browser doesn't support window.URL");
};

Blockscad.textToBlobUrl = function(txt) {
  var windowURL=Blockscad.getWindowURL();
  var blob = new Blob([txt]);
  var blobURL = windowURL.createObjectURL(blob);
  if(!blobURL) throw new Error("createObjectURL() failed"); 
  return blobURL;
};

Blockscad.revokeBlobUrl = function(url) {
  if(window.URL) window.URL.revokeObjectURL(url);
  else if(window.webkitURL) window.webkitURL.revokeObjectURL(url);
  else throw new Error("Your browser doesn't support window.URL");
};

Blockscad.AlertUserOfUncaughtExceptions = function() {
  window.onerror = function(message, url, line) {
    message = message.replace(/^Uncaught /i, "");
    alert(message+"\n\n("+url+" line "+line+")");
  };
};

Blockscad.Processor = function(containerdiv, onchange) {
  this.containerdiv = containerdiv;
  this.onchange = onchange;
  this.viewerdiv = null;
  this.viewer = null;
  this.zoomControl = null;
  this.initialViewerDistance = 100;
  this.processing = false;
  this.currentObject = null;
  this.hasValidCurrentObject = false;
  this.hasOutputFile = false;
  this.worker = null;
  this.paramDefinitions = [];
  this.paramControls = [];
  this.script = null;
  this.hasError = false;
  this.debugging = false;
  this.createElements(); //crear esta funcion
};


Blockscad.Processor.convertToSolid = function(obj) {

  if( (typeof(obj) == "object") && ((obj instanceof CAG)) ) {
    // convert a 2D shape to a thin solid:
    obj = obj.extrude({offset: [0,0,0.1]});

  } else if( (typeof(obj) == "object") && ((obj instanceof CSG)) ) {
    // obj already is a solid, nothing to do
    ;
    
  } else if(obj.length) {                   // main() return an array, we consider it a bunch of CSG not intersecting
    console.log("putting them together");
    var o = obj[0];
    for(var i=1; i<obj.length; i++) {
       o = o.unionForNonIntersecting(obj[i]);
    }
    obj = o;
    
  } else {
    throw new Error("Cannot convert to solid");
  }
  return obj;
};

Blockscad.Processor.prototype = {
  createElements: function() {
    var that = this;   // for event handlers

   // JY - I added a "reset view" button.  
   // now, the container (content-render) HAS A CHILD FROM THE REST OF THE HTML (my reset view button)
   // this code throws an error if I try to throw that child away. SO, I always leave the first
   // child.
   // JY - now there are lots of children - these are the resizable div's handles and such.  Argh! Leave 5.
    while(this.containerdiv.children.length > 5)
      {
        this.containerdiv.removeChild(5);
      }

    var viewerdiv = document.createElement("div");
    viewerdiv.className = "viewer";
    viewerdiv.style.width = '100%'; 
    viewerdiv.style.height = '100%'; 
    viewerdiv.style.top = '0px';
    viewerdiv.style.position = 'absolute';
    viewerdiv.style.zIndex = '1';
    viewerdiv.style.backgroundColor = "rgb(255,255,255)";
    this.containerdiv.appendChild(viewerdiv);
    this.viewerdiv = viewerdiv;
    try {
      this.viewer = new Blockscad.Viewer(this.viewerdiv, viewerdiv.offsetWidth, viewerdiv.offsetHeight, this.initialViewerDistance);
    } catch(e) {
      this.viewerdiv.innerHTML = "<b><br><br>Error: " + e.toString() + "</b><br><br>BlocksCAD currently requires Google Chrome or Firefox with WebGL enabled";
    }

    this.abortbutton = document.getElementById("abortButton");
    this.renderbutton = document.getElementById("renderButton");
    this.ongoingrender = document.getElementById("render-ongoing");

    this.abortbutton.onclick = function(e) {
      that.abort();
      // I want to turn the render button back on!
      $('#renderButton').prop('disabled', false); 

    };

    this.formatDropdown = document.getElementById("render-type");
    this.formatDropdown.onchange = function(e) {
      that.currentFormat = that.formatDropdown.options[that.formatDropdown.selectedIndex].value;
      that.updateDownloadLink();
    };
    this.generateOutputFileButton = document.getElementById("stlButton");
    this.generateOutputFileButton.onclick = function(e) {
      that.generateOutputFile();
    };

    this.enableItems();    
    this.clearViewer();
  },

  setCurrentObject: function(obj) {
    this.currentObject = obj;                                  // CAG or CSG
    if(this.viewer) {
      var csg = Blockscad.Processor.convertToSolid(obj);       // enfore CSG to display
      this.viewer.setCsg(csg);
      if(obj.length)             // if it was an array (multiple CSG is now one CSG), we have to reassign currentObject
         this.currentObject = csg;
    }
    this.hasValidCurrentObject = true;
    // console.log("trying to turn on stl_buttons");
    $('#stl_buttons').show();
    
    while(this.formatDropdown.options.length > 0)
      this.formatDropdown.options.remove(0);
    
    var that = this;
    this.supportedFormatsForCurrentObject().forEach(function(format) {
      var option = document.createElement("option");
      option.setAttribute("value", format);
      option.appendChild(document.createTextNode(that.formatInfo(format).displayName));
      that.formatDropdown.options.add(option);
    });
    
    this.updateDownloadLink();
  },
  
  selectedFormat: function() {
    return this.formatDropdown.options[this.formatDropdown.selectedIndex].value;
  },

  selectedFormatInfo: function() {
    return this.formatInfo(this.selectedFormat());
  },
  
  updateDownloadLink: function() {
    var ext = this.selectedFormatInfo().extension;
    this.generateOutputFileButton.innerHTML = "Generate "+ext.toUpperCase();
  },
  
  clearViewer: function() {
    this.clearOutputFile();
    this.setCurrentObject(new CSG());
    this.hasValidCurrentObject = false;
    // console.log('trying to hid stl_buttons');
    $('#stl_buttons').hide();
    this.enableItems();
  },
  
  abort: function() {
    if(this.processing)
    {
      //todo: abort
      this.processing=false;
      //this.statusspan.innerHTML = "Aborted.";
      this.worker.terminate();
      this.enableItems();
      if(this.onchange) this.onchange();
    }
  },
  
  enableItems: function() {
    this.abortbutton.style.display = this.processing? "block":"none";
    this.renderbutton.style.display = this.processing? "none":"block";
    this.ongoingrender.style.display = this.processing? "block":"none";
  },

 
  setError: function(txt) {
    this.hasError = (txt != "");
    $( "#error-message" ).text(txt);
//    console.log("in setError with text", txt, "this.hasError is", this.hasError); 
    this.enableItems();
  },
  
  setDebugging: function(debugging) {
    this.debugging = debugging;
  },
  
  // script: javascript code
  setBlockscad: function(script) {
    this.abort();
    this.clearViewer();
    this.script = script;
    this.rebuildSolid();
  },
  

  rebuildSolid: function()
  {
    this.abort();
    this.setError("");
    this.clearViewer();
    this.processing = true;
    $( '#renderButton' ).html("Render");
    //this.statusspan.innerHTML = "Rendering code <img id=busy src='imgs/busy.gif'>";
    this.enableItems();
    var that = this;
    var useSync = this.debugging;

    //useSync = true;
    if(!useSync)
    {
      try
      {
//          console.log("trying async compute");
          this.worker = Blockscad.parseBlockscadScriptASync(this.script, function(err, obj) {
          that.processing = false;
          that.worker = null;
          if(err)
          {
          console.log("error in proc" + err);
          // alert(err);
          // console.log("script was:",this.script;
            that.setError(err);
          }
          else
          {
//            console.log("no error in proc");
            that.setCurrentObject(obj);
          }

          if(that.onchange) that.onchange();
          that.enableItems();
        });
      }
      catch(e)
      {
        console.log("async failed, try sync compute, error: "+e.message);
        // console.log("script was:",this.script);
        useSync = true;
      }
    }
    
    if(useSync)
    {
      try
      {
        var obj = Blockscad.parseBlockscadScriptSync(this.script, this.debugging);
        that.setCurrentObject(obj);
        that.processing = false;
      }
      catch(e)
      {
        that.processing = false;
        var errtxt = e.stack;
        if(!errtxt)
        {
          errtxt = e.toString();
        }
        that.setError(errtxt);
      }
      that.enableItems();
      if(that.onchange) that.onchange();
    }
  },
  
  hasSolid: function() {
    return this.hasValidCurrentObject;
  },

  isProcessing: function() {
    return this.processing;
  },
   
  clearOutputFile: function() {
    if(this.hasOutputFile)
    {
      if(this.outputFileBlobUrl)
      {
        Blockscad.revokeBlobUrl(this.outputFileBlobUrl);
        this.outputFileBlobUrl = null;
      }
      this.enableItems();
      if(this.onchange) this.onchange();
    }
  },

  generateOutputFile: function() {
    this.clearOutputFile();
    if(this.hasValidCurrentObject)
    {
      this.generateAndSaveRenderedFile();
    }
  },

  currentObjectToBlob: function() {
    var format = this.selectedFormat();

    // console.log("in currentObjectToBlob. format is:",format);
    // console.log(this);

    var blob;
    if(format == "stla") {      
      blob = this.currentObject.toStlString();        
      blob = new Blob([blob],{ type: this.formatInfo(format).mimetype });
    }
    else if(format == "stlb") {      
      blob = this.currentObject.toStlBinary({webBlob: true});     

      // -- binary string -> blob gives bad data, so we request cgs.js already blobbing the binary
      //blob = new Blob([blob],{ type: this.formatInfo(format).mimetype+"/charset=UTF-8" }); 
    }
    else if(format == "amf") {
      blob = this.currentObject.toAMFString({
        producer: "OpenJSCAD.org "+version,
        date: new Date()
      });
      blob = new Blob([blob],{ type: this.formatInfo(format).mimetype });
    }  
    else if(format == "x3d") {
      blob = this.currentObject.fixTJunctions().toX3D();
    }
    else if(format == "dxf") {
      blob = this.currentObject.toDxf();
    }
    else {
      throw new Error("Not supported");
    }    
    return blob;
  },
  
  supportedFormatsForCurrentObject: function() {
    if (this.currentObject instanceof CSG) {
      return ["stlb", "stla", "amf", "x3d"];
    } else if (this.currentObject instanceof CAG) {
      return ["dxf"];
    } else {
      throw new Error("Not supported");
    }
  },
  
  formatInfo: function(format) {
    return {
      stla: {
        displayName: "STL (ASCII)",
        extension: "stl",
        mimetype: "application/sla",
        },
      stlb: {
        displayName: "STL (Binary)",
        extension: "stl",
        mimetype: "application/sla",
        },
      amf: {
        displayName: "AMF",
        extension: "amf",
        mimetype: "application/amf+xml",
        },
      x3d: {
        displayName: "X3D",
        extension: "x3d",
        mimetype: "model/x3d+xml",
        },
      dxf: {
        displayName: "DXF",
        extension: "dxf",
        mimetype: "application/dxf",
        }
    }[format];
  },

  generateAndSaveRenderedFile: function() {
    var blob = this.currentObjectToBlob();
    var ext = this.selectedFormatInfo().extension;

   // I want the user to be able to enter a filename for the stl download - JY
   // pull a filename entered by the user
   var filename = $('#project-name').val();
   // don't save without a filename.  Name isn't checked for quality.
   if (filename) {
     saveAs(blob, filename + "." + ext);
   }
   else {
     alert("Could not save" , this.selectedFormatInfo().displayName ," file.  Please give your project a name, then try again.");
   }
  }
};
