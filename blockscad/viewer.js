// viewer.js
// was openjscad.js, originally written by Joost Nieuwenhuijse (MIT License)
//   few adjustments by Rene K. Mueller <spiritdude@gmail.com> for OpenJSCAD.org
// more adjustments by J. Yoder for BlocksCAD
//


var Blockscad =  Blockscad || {};
var CSG = CSG || {};
var CAG = CAG || {};
// Blockscad.Viewer = function(containerelement, width, height, initialdepth) {
//   var scene = new THREE.Scene();
//   this.scene=scene;
//   var camera = new THREE.PerspectiveCamera( 45, width/height, 1, 1000 );
//   this.camera=camera;
//   this.camera.position.set( 50, -50, 50 );
//   this.camera.up.set( 0, 0, 1 );
//   this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
//   var renderer = new THREE.WebGLRenderer({ antialias: true });
//   this.renderer=renderer;
//   this.renderer.setClearColor( 0xEDEDED, 1.0 );
//   this.renderer.setSize( width, height );
//   var controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
//   this.controls=controls;
//   this.controls.enableDamping = false;
//   this.controls.enableZoom = true;
//   this.controls.zoomSpeed = 3;
//   var light = new THREE.DirectionalLight(0xffffff, 1);
//   this.light=light;
//   this.light.castShadow = false;
//   this.light.position.copy( this.camera.position );
//   this.scene.add(this.light);
//   this.axes = this.buildAxes( 200 );
//   this.GridPlane = this.buildGridPlane(200);
//   this.scene.add(this.axes);
//   this.scene.add(this.GridPlane);
//   $(containerelement).append(this.renderer.domElement);
//   this.renderer.render(this.scene, this.camera);
//   var this_viewer=this;
//   //render function
//   var render = function(){
//     this_viewer.light.position.copy( this_viewer.camera.position );
//     this_viewer.renderer.render( this_viewer.scene,  this_viewer.camera);
//   }
//   this.render=render;
//   this.controls.addEventListener( 'change', render);
// };

Blockscad.threeViewer = function(containerelement, width, height, initialdepth) {
  // init global variables
  _this = this;
  this.initScene();
  this.initRenderer(width, height);
  // console.log(this.renderer);
  this.initCamera();
  var controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
  // controls.target.set(0,0,0); 
  this.controls=controls;
  // this.controls.enableDamping = false;
  this.controls.enableZoom = true;
  this.controls.zoomSpeed = 3;
  this.initLights();

  $(containerelement).append(this.renderer.domElement);

  render = function() {
      if (_this.directionalLight) {
        _this.directionalLight.position.copy(_this.camera.position);
        _this.renderer.render(_this.scene, _this.camera);
      }
  };
  this.render = render;
  this.controls.addEventListener( 'change', render);

  this.render();
}

Blockscad.threeViewer.prototype = {
  setCsg: function(csg) {
      this.scene.remove(  this.scene.getObjectByName("threeMesh"));//remove old Mesh if exist.
      this.threeMesh = Blockscad.threeViewer.csgToThreeMesh(csg);
      this.threeMesh.name="threeMesh";
      this.scene.add(this.threeMesh);
      // console.log("going to render from setCsg");
      this.render();
  },

  rendered_resize: function(width, height) { 
      this.renderer.setSize( width, height );
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      // console.log("going to runder from rendered_resize");
      this.render();
  },

  // viewReset: function() {
  //   var whichView = document.getElementById("viewMenu");

  //   if (whichView.value == "top") {
  //     this.controls.reset();
  //     this.camera.position.set( 0, 0, 50 );
  //     this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

  //   }
  //   else if (whichView.value == "front") {
  //     this.controls.reset();
  //     this.camera.position.set( 0, -50, 0 );
  //     this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
  //   }
  //   else if (whichView.value == "left") {    
  //     this.controls.reset();
  //     this.camera.position.set( -50, 0, 0 );
  //     this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

   
  //   }
  //   else if (whichView.value == "right") {
  //     this.controls.reset();
  //     this.camera.position.set( 50, 0, 0 );
  //     this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
   
  //   }
  //   else if (whichView.value == "bottom") {
  //     this.controls.reset();
  //     this.camera.position.set( 0, 0, -50 );
  //     this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );


  //   }
  //   else if (whichView.value == "back") {   
  //     this.controls.reset(); 
  //     this.camera.position.set( 0, 50, 0 );
  //     this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
 
  //   }
  //   else if (whichView.value == "diagonal") {
  //     this.controls.reset();
  //     this.camera.position.set( 50, -50, 50 );
  //     this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
  //   }
  //     this.render();
  // },

  toggleAxes:function(e) {
    if (this.scene.getObjectByName("axes")&&this.scene.getObjectByName("GridPlane")) {
      this.scene.remove(  this.scene.getObjectByName("axes"));//remove axes
      this.scene.remove(  this.scene.getObjectByName("GridPlane"));//remove grid plane
    }else{
      this.scene.add(this.axes);
      this.scene.add(this.GridPlane);
    }
    // console.log("going to render from toggleAxes");
    this.render();
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
    axes.add( this.buildLine( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00DD00, false,1)); // +Y
    axes.add( this.buildLine( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00DD00, true,1)); // -Y
    axes.add( this.buildLine( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000DD, false,1)); // +Z
    axes.add( this.buildLine( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000DD, true,1)); // -Z

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
      if (x%10 != 0) {
        GridPlane.add(this.buildLine( new THREE.Vector3( x, -size, 0 ), new THREE.Vector3( x, size, 0 ), 0xDDDDDD, false,1 ));
        GridPlane.add(this.buildLine( new THREE.Vector3( -size, x, 0 ), new THREE.Vector3( size, x, 0 ), 0xDDDDDD, false,1 ));
      }
    }
    for(var x=1; x<=size; x++) {
      if (x%10 != 0) {
        GridPlane.add(this.buildLine( new THREE.Vector3( x, -size, 0 ), new THREE.Vector3( x, size, 0 ), 0xDDDDDD, false,1 ));
        GridPlane.add(this.buildLine( new THREE.Vector3( -size, x, 0 ), new THREE.Vector3( size, x, 0 ), 0xDDDDDD, false,1 ));
        //draw hashmarks on z axis
        GridPlane.add(this.buildLine( new THREE.Vector3( -0.5, -0.5, x ), new THREE.Vector3( 0.5, 0.5, x ), 0xDDDDDD, false,1 ));
        GridPlane.add(this.buildLine( new THREE.Vector3(  0.5, -0.5, x ), new THREE.Vector3( -0.5, 0.5, x ), 0xDDDDDD, false,1 ));
      }
    }
    for(var x=-size; x<0; x+=10) {
      GridPlane.add(this.buildLine( new THREE.Vector3( x, -size, 0 ), new THREE.Vector3( x, size, 0 ), 0xAAAAAA, false,1 ));
      GridPlane.add(this.buildLine( new THREE.Vector3( -size, x, 0 ), new THREE.Vector3( size, x, 0 ), 0xAAAAAA, false,1 ));
      //draw mayor hashmarks on -z axis
      GridPlane.add(this.buildLine( new THREE.Vector3( -1, -1, x ), new THREE.Vector3( 1, 1, x ), 0xAAAAAA, false,1 ));
      GridPlane.add(this.buildLine( new THREE.Vector3(  1, -1, x ), new THREE.Vector3( -1, 1, x ), 0xAAAAAA, false,1 ));

    }
    for(var x=10; x<=size; x+=10) {
      GridPlane.add(this.buildLine( new THREE.Vector3( x, -size, 0 ), new THREE.Vector3( x, size, 0 ), 0xAAAAAA, false,1 ));
      GridPlane.add(this.buildLine( new THREE.Vector3( -size, x, 0 ), new THREE.Vector3( size, x, 0 ), 0xAAAAAA, false,1 ));
      //draw mayor hashmarks on z axis
      GridPlane.add(this.buildLine( new THREE.Vector3( -1, -1, x ), new THREE.Vector3( 1, 1, x ), 0xAAAAAA, false,1 ));
      GridPlane.add(this.buildLine( new THREE.Vector3(  1, -1, x ), new THREE.Vector3( -1, 1, x ), 0xAAAAAA, false,1 ));

    }
    return GridPlane;
  }
};

Blockscad.threeViewer.getGeometryVertice= function( threeGeometry, vertice_position ){
  threeGeometry.vertices.push( new THREE.Vector3( vertice_position.x, vertice_position.y, vertice_position.z ) );
  return threeGeometry.vertices.length - 1;
}

Blockscad.threeViewer.csgToThreeMesh = function( csg_model ) {
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
      vertices.push( Blockscad.threeViewer.getGeometryVertice( three_geometry, polygons[i].vertices[j].pos ) );
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
Blockscad.threeViewer.prototype.initScene = function() {
  console.log("starting initScene");
  var myself = this;
  this.scene = new THREE.Scene();
  // console.log("created scene");

  this.axes = this.buildAxes( 200 );
  this.GridPlane = this.buildGridPlane(200);
  this.scene.add(this.axes);
  this.scene.add(this.GridPlane);
}

Blockscad.threeViewer.prototype.initRenderer = function(width, height) {
    var myself = this;

    console.log("in initRenderer()");

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor( 0xFFFFFF, 1.0 );
    this.renderer.setSize( width, height );


    this.renderer.changed = false;
    this.renderer.isWireframeMode = false;
    this.renderer.showingAxes = true;
    this.renderer.isParallelProjection = false;

    this.renderer.toggleParallelProjection = function() {
        this.isParallelProjection = !this.isParallelProjection;
        myself.initCamera();
    }
}



// Blockscad.threeViewer.prototype.renderCycle = function() {
//     if (this.renderer.changed) {
//         this.render();
//         this.changed();
//         // this.parentThatIsA(IDE_Morph).statusDisplay.refresh();
//         this.renderer.changed = false;
//     }
// }

// Blockscad.threeViewer.prototype.reRender = function() {
//     this.renderer.changed = true;
// }

Blockscad.threeViewer.prototype.initCamera = function(width,height) {
    var myself = this;

    console.log("in initCamera");

    if (this.scene.camera) { this.scene.remove(this.camera) };

    var createCamera = function() {
      console.log("in CreateCamera()");
        if (myself.renderer.isParallelProjection) { 
            var zoom = myself.camera ? myself.camera.zoomFactor : 82,
                width = Math.max(myself.width(), 50),
                height = Math.max(myself.height(), 50);

            myself.camera = new THREE.OrthographicCamera(
                    width / - zoom,
                    width / zoom,
                    height / zoom,
                    height / - zoom,
                    0.1, 
                    10000);
        } else {
            myself.camera = new THREE.PerspectiveCamera(45, width/height, 1, 1000);
            myself.camera.position.set( 50, -50, 50 );
            myself.camera.up.set( 0, 0, 1 );
            myself.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
        }

        // We need to implement zooming ourselves for parallel projection

        myself.camera.zoomIn = function() {
            this.zoomFactor /= 1.1;
            this.applyZoom();
        }
        myself.camera.zoomOut = function() {
            this.zoomFactor *= 1.1;
            this.applyZoom();
        }

        myself.camera.applyZoom = function() {
            var zoom = myself.camera ? myself.camera.zoomFactor : 82,
                width = Math.max(myself.width(), 50),
                height = Math.max(myself.height(), 50);
            this.left = width / - zoom;
            this.right = width / zoom;
            this.top = height / zoom;
            this.bottom = height / - zoom;
            this.updateProjectionMatrix();  
        }

        myself.camera.fitScene = function() {

            var boundingBox = new THREE.Box3().setFromObject(myself.myObjects),
                boundingSphere = boundingBox.getBoundingSphere(),
                center = boundingSphere.center,
                distance = boundingSphere.radius;

            this.reset();

            this.position.set(center.x, center.y, center.z);
            this.translateZ(distance * 1.2);

            myself.controls.center.set(center.x, center.y, center.z);
            myself.controls.dollyOut(1.2);
            myself.controls.update();
            console.log("going to render from fitScene");
            myself.render();
        }
    }

    createCamera();
    this.scene.add(this.camera);
}

Blockscad.threeViewer.prototype.viewReset = function() {

  var whichView = document.getElementById("viewMenu");

  // this.controls.reset();

  if (whichView.value == "top") {
    this.camera.position.set( 0, 0, 50 );
    // this.lookAt( new THREE.Vector3( 0, 0, 0 ) );
  }
  else if (whichView.value == "front") {
    this.camera.position.set( 0, -50, 0 );
    // this.lookAt( new THREE.Vector3( 0, 0, 0 ) );
  }
  else if (whichView.value == "left") {    
    this.camera.position.set( -50, 0, 0 );
    // this.lookAt( new THREE.Vector3( 0, 0, 0 ) );
  }
  else if (whichView.value == "right") {
    this.camera.position.set( 50, 0, 0 );
    // this.lookAt( new THREE.Vector3( 0, 0, 0 ) );
  }
  else if (whichView.value == "bottom") {
    this.camera.position.set( 0, 0, -50 );
    // this.lookAt( new THREE.Vector3( 0, 0, 0 ) );
  }
  else if (whichView.value == "back") {   
    this.camera.position.set( 0, 50, 0 );
    // this.lookAt( new THREE.Vector3( 0, 0, 0 ) );
  }
  else {    // default view reset is to diagonal
    this.camera.position.set( 50, -50, 50 );
    // this.lookAt( new THREE.Vector3( 0, 0, 0 ) );
  }
  this.camera.lookAt( new THREE.Vector3(0,0,0) );

  // myself.controls.update();
  // console.log("going to render from viewReset");
  this.render();
}
Blockscad.threeViewer.prototype.initLights = function() {
    console.log("in initlights");
    this.directionalLight = new THREE.DirectionalLight(0x4c4c4c, 1);
    this.directionalLight.position.set(this.camera.position);
    this.scene.add(this.directionalLight);

    // this.pointLight = new THREE.PointLight(0xffffff, 1, 2000);
    // this.pointLight.position.set(this.camera.position);
    // this.scene.add(this.pointLight);
}

// A viewer is a WebGL canvas that lets the user view a mesh. The user can
// tumble it around by dragging the mouse.
// Blockscad.Viewer = function(containerelement, width, height, initialdepth) {
//   var gl = GL.create();
//   this.gl = gl;
//   this.angleX = -60;
//   this.angleY = 0;
//   this.angleZ = -45;
//   this.viewpointX = 0;
//   this.viewpointY = -5;
//   this.viewpointZ = initialdepth;
//   this.defaultColor = [1,0.5,1,1];
//   // Blockscad.defaultColor = this.defaultColor.toString();

//   this.touch = {
//     lastX: 0,
//     lastY: 0,
//     scale: 0,
//     ctrl: 0,
//     shiftTimer: null,
//     shiftControl: null,
//     cur: null //current state
//   };


//   // Draw triangle lines:
//   this.drawLines = false;
//   // Set to true so lines don't use the depth buffer
//   this.lineOverlay = false;

//   // Set up the viewport
//   gl.canvas.width = width;
//   gl.canvas.height = height;
//   gl.viewport(0, 0, width, height);
//   gl.matrixMode(gl.PROJECTION);
//   gl.loadIdentity();
//   // console.log("am I getting this new code?");
//   gl.perspective(45, width / height, 0.5, 3000);
//   gl.matrixMode(gl.MODELVIEW);

//   // Set up WebGL state
//   gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
//   gl.clearColor(0.93, 0.93, 0.93, 1);
//   gl.enable(gl.DEPTH_TEST);
//   gl.enable(gl.CULL_FACE);
//   gl.polygonOffset(1, 1);

//   // Black shader for wireframe
//   this.blackShader = new GL.Shader('' +
//     'void main() {' +
//       'gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;' +
//     '}', '' +
//     'void main() {' +
//       'gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' +
//     '}');

//   // Shader with diffuse and specular lighting
//   this.lightingShader = new GL.Shader('' +
//       'varying vec3 color;' +
//       'varying float alpha;' +
//       'varying vec3 normal;' +
//       'varying vec3 light;' +
//       'void main() {' +
//         'const vec3 lightDir = vec3(1.0, 2.0, 3.0) / 3.741657386773941;' +
//         'light = lightDir;' +
//         'color = gl_Color.rgb;' +
//         'alpha = gl_Color.a;' +
//         'normal = gl_NormalMatrix * gl_Normal;' +
//         'gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;' +
//       '}',
//       'varying vec3 color;' +
//       'varying float alpha;' +
//       'varying vec3 normal;' +
//       'varying vec3 light;' +
//       'void main() {' +
//         'vec3 n = normalize(normal);' +
//         'float diffuse = max(0.0, dot(light, n));' +
//         'float specular = pow(max(0.0, -reflect(light, n).z), 10.0) * sqrt(diffuse);' +
//         'gl_FragColor = vec4(mix(color * (0.3 + 0.7 * diffuse), vec3(1.0), specular), alpha);' +
//       '}');

//   var _this=this;

//   var shiftControl = $('<div class="shift-scene"><div class="arrow arrow-left" />' +
//     '<div class="arrow arrow-right" />' +
//     '<div class="arrow arrow-top" />' +
//     '<div class="arrow arrow-bottom" /></div>' );
//   this.touch.shiftControl = shiftControl;

//   $(containerelement).append(gl.canvas)
//     .append(shiftControl)
//     .hammer({//touch screen control
//       drag_lock_to_axis: true
//     }).on("transform", function(e){
//       if (e.gesture.touches.length >= 2) {
//           _this.clearShift();
//           _this.onTransform(e);
//           e.preventDefault();
//       }
//     }).on("touch", function(e) {
//       if (e.gesture.pointerType != 'touch'){
//         e.preventDefault();
//         return;
//       }

//       if (e.gesture.touches.length == 1) {
//           var point = e.gesture.center;
//           _this.touch.shiftTimer = setTimeout(function(){
//               shiftControl.addClass('active').css({
//                   left: point.pageX + 'px',
//                   top: point.pageY + 'px'
//               });
//               _this.touch.shiftTimer = null;
//               _this.touch.cur = 'shifting';
//         }, 500);
//       } else {
//         _this.clearShift();
//       }
//     }).on("drag", function(e) {
//       if (e.gesture.pointerType != 'touch') {
//         e.preventDefault();
//         return;
//       }

//       if (!_this.touch.cur || _this.touch.cur == 'dragging') {
//           _this.clearShift();
//           _this.onPanTilt(e);
//       } else if (_this.touch.cur == 'shifting') {
//           _this.onShift(e);
//       }
//     }).on("touchend", function(e) {
//         _this.clearShift();
//         if (_this.touch.cur) {
//             shiftControl.removeClass('active shift-horizontal shift-vertical');
//         }
//     }).on("transformend dragstart dragend", function(e) {
//       if ((e.type == 'transformend' && _this.touch.cur == 'transforming') || 
//           (e.type == 'dragend' && _this.touch.cur == 'shifting') ||
//           (e.type == 'dragend' && _this.touch.cur == 'dragging'))
//         _this.touch.cur = null;
//       _this.touch.lastX = 0;
//       _this.touch.lastY = 0;
//       _this.touch.scale = 0;
//     });

//   gl.onmousemove = function(e) {
//     _this.onMouseMove(e);
//   };
//   gl.ondraw = function() {
//     _this.onDraw();
//   };
//   gl.onmousewheel = function(e) {
//     var wheelDelta = 0;    
//     if (e.wheelDelta) {
//       wheelDelta = e.wheelDelta;
//     } else if (e.detail) {
//       // for firefox, see http://stackoverflow.com/questions/8886281/event-wheeldelta-returns-undefined
//       wheelDelta = e.detail * -40;     
//     }
//     if(wheelDelta) {
//       wheelDelta /= 2;
//       var factor = Math.pow(1.003, -wheelDelta);
//       var coeff = _this.getZoom();
//       coeff *= factor;
//       _this.setZoom(coeff);
//     }
//   };

//   this.clear();
// };

// Blockscad.Viewer.prototype = {
//   setCsg: function(csg) {
//     // if(0&&csg.length) {                            // preparing multiple CSG's (not union-ed), not yet working
//     //    for(var i=0; i<csg.length; i++)
//     //       this.meshes.concat(OpenJsCad.Viewer.csgToMeshes(csg[i]));
//     // } else {
//     //    this.meshes = OpenJsCad.Viewer.csgToMeshes(csg);
//     // }
//       this.meshes = Blockscad.Viewer.csgToMeshes(csg,this.defaultColor);
//       this.onDraw();
//   },

//   rendered_resize: function(width, height) {

//     this.gl.canvas.width = width;
//     this.gl.canvas.height = height;

//     this.gl.viewport(0, 0, width, height);
//     this.gl.matrixMode(this.gl.PROJECTION);
//     this.gl.loadIdentity();
//     this.gl.perspective(45, width / height, 0.1, 3000);
//     this.gl.matrixMode(this.gl.MODELVIEW);

//     this.onDraw();
// //    console.log("end of rendered_resize");

//   },

//   viewReset: function() {
//     var whichView = document.getElementById("viewMenu");

//     if (whichView.value == "top") {
//       // top
//       this.angleX = 0;
//       this.angleY = 0;
//       this.angleZ = 0;
//       this.viewpointX = 0;
//       this.viewpointY = 0;
//       this.viewpointZ = 100;
//     }
//     else if (whichView.value == "front") {
//       // front
//       this.angleX = -90;
//       this.angleY = 0;
//       this.angleZ = 0;
//       this.viewpointX = 0;
//       this.viewpointY = 0;
//       this.viewpointZ = 100;
//     }
//     else if (whichView.value == "left") {    
//       // left??
//       this.angleX = -90;
//       this.angleY = 0;
//       this.angleZ = 90;
//       this.viewpointX = 0;
//       this.viewpointY = 0;
//       this.viewpointZ = 100;
//     }
//     else if (whichView.value == "right") {
//       // right??
//       this.angleX = -90;
//       this.angleY = 0;
//       this.angleZ = -90;
//       this.viewpointX = 0;
//       this.viewpointY = 0;
//       this.viewpointZ = 100;
//     }
//     else if (whichView.value == "bottom") {
//       // bottom
//       this.angleX = 180;
//       this.angleY = 0;
//       this.angleZ = 0;
//       this.viewpointX = 0;
//       this.viewpointY = 0;
//       this.viewpointZ = 100;
//     }
//     else if (whichView.value == "back") {    
//       // back
//       this.angleX = -90;
//       this.angleY = 0;
//       this.angleZ = 180;
//       this.viewpointX = 0;
//       this.viewpointY = 0;
//       this.viewpointZ = 100;
//     }
//     else if (whichView.value == "diagonal") {
//       // diagonal
//       this.angleX = -60;
//       this.angleY = 0;
//       this.angleZ = -45;
//       this.viewpointX = 0;
//       this.viewpointY = -5;
//       this.viewpointZ = 100;
//     }

//     this.onDraw();
//   },

//   clear: function() {
//     // empty mesh list:
//     this.meshes = []; 
//     this.onDraw();    
//   },

//   supported: function() {
//     return !!this.gl;
//   },

//   ZOOM_MAX: 1500,
//   ZOOM_MIN: 5,
//   onZoomChanged: null,
//   plate: true,                   // render plate

//   setZoom: function(coeff) { //0...1
//     coeff=Math.max(coeff, 0);
//     coeff=Math.min(coeff, 1);
//     this.viewpointZ = this.ZOOM_MIN + coeff * (this.ZOOM_MAX - this.ZOOM_MIN);
//     if(this.onZoomChanged) {
//       this.onZoomChanged();
//     }
//     this.onDraw();
//   },

//   getZoom: function() {
//     var coeff = (this.viewpointZ-this.ZOOM_MIN) / (this.ZOOM_MAX - this.ZOOM_MIN);
//     //console.log("zoom is: ",this.viewpointZ);
//     return coeff;
//   },
  
//   onMouseMove: function(e) {
//     if (e.dragging) {
//       //console.log(e.which,e.button);
//       var b = e.button;
//       if(e.which) {                            // RANT: not even the mouse buttons are coherent among the brand (chrome,firefox,etc)
//          b = e.which;
//       }
//       e.preventDefault();
//       if(e.altKey||b==3) {                     // ROTATE X,Y (ALT or right mouse button)
//         this.angleY += e.deltaX;
//         this.angleX += e.deltaY;
//         //this.angleX = Math.max(-180, Math.min(180, this.angleX));
//       } else if(e.shiftKey||b==2) {            // PAN  (SHIFT or middle mouse button)
//         var factor = 5e-3;
//         this.viewpointX += factor * e.deltaX * this.viewpointZ;
//         this.viewpointY -= factor * e.deltaY * this.viewpointZ;
//       } else if(e.ctrlKey) {                   // ZOOM IN/OU
//          var factor = Math.pow(1.006, e.deltaX+e.deltaY);
//          var coeff = this.getZoom();
//          coeff *= factor;
//          this.setZoom(coeff);
//       } else {                                 // ROTATE X,Z  left mouse button
//         this.angleZ += e.deltaX;
//         this.angleX += e.deltaY;
//       }
//       this.onDraw();
//     }
//   },
//   clearShift: function() {
//       if(this.touch.shiftTimer) {
//           clearTimeout(this.touch.shiftTimer);
//           this.touch.shiftTimer = null;
//       }
//       return this;
//   },
//   //pan & tilt with one finger
//   onPanTilt: function(e) {
//     this.touch.cur = 'dragging';
//     var delta = 0;
//     if (this.touch.lastY && (e.gesture.direction == 'up' || e.gesture.direction == 'down')) {
//         //tilt
//         delta = e.gesture.deltaY - this.touch.lastY;
//         this.angleX += delta;
//     } else if (this.touch.lastX && (e.gesture.direction == 'left' || e.gesture.direction == 'right')) {
//         //pan
//         delta = e.gesture.deltaX - this.touch.lastX;
//         this.angleZ += delta;
//     }
//     if (delta)
//       this.onDraw();
//     this.touch.lastX = e.gesture.deltaX;
//     this.touch.lastY = e.gesture.deltaY;
//   },
//   //shift after 0.5s touch&hold
//   onShift: function(e) {
//     this.touch.cur = 'shifting';
//     var factor = 5e-3;
//     var delta = 0;

//     if (this.touch.lastY && (e.gesture.direction == 'up' || e.gesture.direction == 'down')) {
//         this.touch.shiftControl
//           .removeClass('shift-horizontal')
//           .addClass('shift-vertical')
//           .css('top', e.gesture.center.pageY + 'px');
//         delta = e.gesture.deltaY - this.touch.lastY;
//         this.viewpointY -= factor * delta * this.viewpointZ;
//         this.angleX += delta;
//     } 
//     if (this.touch.lastX && (e.gesture.direction == 'left' || e.gesture.direction == 'right')) {
//         this.touch.shiftControl
//           .removeClass('shift-vertical')
//           .addClass('shift-horizontal')
//           .css('left', e.gesture.center.pageX + 'px');
//         delta = e.gesture.deltaX - this.touch.lastX;
//         this.viewpointX += factor * delta * this.viewpointZ;
//         this.angleZ += delta;
//     }
//     if (delta)
//       this.onDraw();
//     this.touch.lastX = e.gesture.deltaX;
//     this.touch.lastY = e.gesture.deltaY;
//   },
//   //zooming
//   onTransform: function(e) {
//       this.touch.cur = 'transforming';
//       if (this.touch.scale) {
//         var factor = 1 / (1 + e.gesture.scale - this.touch.scale);
//         var coeff = this.getZoom();
//         coeff *= factor;
//         this.setZoom( coeff);
//       }
//       this.touch.scale = e.gesture.scale;
//       return this;
//   },
//   onDraw: function(takePic) {
//     var gl = this.gl;
//     gl.makeCurrent();

//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//     gl.loadIdentity();
//     gl.translate(this.viewpointX, this.viewpointY, -this.viewpointZ);
//     gl.rotate(this.angleX, 1, 0, 0);
//     gl.rotate(this.angleY, 0, 1, 0);
//     gl.rotate(this.angleZ, 0, 0, 1);

//     gl.enable(gl.BLEND);
//     //gl.disable(gl.DEPTH_TEST);
//     if (!this.lineOverlay) gl.enable(gl.POLYGON_OFFSET_FILL);

//     // don't send empty meshes to WebGL - check for length of vertices array - JY
//     for (var i = 0; i < this.meshes.length; i++) {
//       var mesh = this.meshes[i];
//       if (mesh.vertices.length > 0) {
//         this.lightingShader.draw(mesh, gl.TRIANGLES);
//       }
//     }
//     if (!this.lineOverlay) gl.disable(gl.POLYGON_OFFSET_FILL);
//     gl.disable(gl.BLEND);
//     //gl.enable(gl.DEPTH_TEST);

//     if(this.drawLines) {
//       if (this.lineOverlay) gl.disable(gl.DEPTH_TEST);
//       gl.enable(gl.BLEND);
//       for (var i = 0; i < this.meshes.length; i++) {
//         var mesh = this.meshes[i];
//         if (mesh.vertices.length > 0) {
//           this.blackShader.draw(mesh, gl.LINES);
//         }
//       }
//       gl.disable(gl.BLEND);
//       if (this.lineOverlay) gl.enable(gl.DEPTH_TEST);
//     }
//     //EDW: axes
//     // Jennie - I don't draw major or minor gridlines on X or Y axis, because they
//     // cover up the colored axis lines drawn later.  That's the x!=0 part.
//     if (Blockscad.drawAxes) {
//       gl.enable(gl.BLEND);
//       gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
//       gl.begin(gl.LINES);
//       // can I have the plate change size based on your zoom level?
//       // var plate = Math.ceil(this.viewpointZ * 1.1);
//       // if (plate%2) plate++;
//       //console.log("plate is:",plate);
//       var plate = 200;
//       if(this.plate) {
//          gl.color(0.8,0.8,0.8,0.5); // -- minor grid
//          for(var x=-plate/2; x<=plate/2; x++) {
//             if(x%10 && x!==0) {
//                gl.vertex(-plate/2, x, 0);
//                gl.vertex(plate/2, x, 0);
//                gl.vertex(x, -plate/2, 0);
//                gl.vertex(x, plate/2, 0);

//                // hashmarks on z-axis
//                if (x < plate/2.8 && x > -plate/2.8) {
//                  gl.vertex(-0.5, 0, x);
//                  gl.vertex(0.5, 0, x);
//                  gl.vertex(0, -0.50, x);
//                  gl.vertex(0, 0.50, x); 
//                }
//             }
//          }
//          gl.color(0.5,0.5,0.5,0.5); // -- major grid
//          for(var x=10; x<=plate/2; x+=10) {
//             if(x!==0) {
//               gl.vertex(-plate/2, x, 0);
//               gl.vertex(plate/2, x, 0);
//               gl.vertex(x, -plate/2, 0);
//               gl.vertex(x, plate/2, 0);
//               gl.vertex(-plate/2, -x, 0);
//               gl.vertex(plate/2, -x, 0);
//               gl.vertex(-x, -plate/2, 0);
//               gl.vertex(-x, plate/2, 0);

//               // hashmarks on z-axis
//               if (x < plate/2.8 ) {
//                 gl.vertex(-1, 0, x);
//                 gl.vertex(1, 0, x);
//                 gl.vertex(0, -1, x);
//                 gl.vertex(0, 1, x);
//                 gl.vertex(-1, 0, -x);
//                 gl.vertex(1, 0, -x);
//                 gl.vertex(0, -1, -x);
//                 gl.vertex(0, 1, -x);
//               }
//           }
//          }
//       }

//       // JY - set alpha for axes color to 1 to make the colors more obvious, and changed colors.
//       if(1) {
//          //X - red

   
//         gl.color(1, 0, 0, 1); //positive direction
//         gl.vertex(0, 0, 0);
//         gl.vertex(plate/2, 0, 0);

//          // I'd like to try making the negative direction dashed
//         for (var i=-plate/2; i < 0; i++) {
//           if (i%2) {
//             gl.vertex(i,0,0);
//             gl.vertex(i+1,0,0);
//           }
//         }

//          //Y - green

//         gl.color(0, 0.7, 0, 1); //positive direction
//         gl.vertex(0, 0, 0);
//         gl.vertex(0, plate/2, 0);

//         for (var i=-plate/2; i < 0; i++) { // negative direction is dashed
//           if (i%2) {
//             gl.vertex(0,i,0);
//             gl.vertex(0,i+1,0);
//           }
//         }
  
//         gl.color(0.1, 0.1, 0.4, 1); //positive direction
//         gl.vertex(0, 0, 0);
//         gl.vertex(0, 0, plate/2.8);

//         for (var i=Math.floor(-plate/2.8); i < 0; i++) { // negative direction is dashed
//           if (i%2) {
//             gl.vertex(0,0,i);
//             gl.vertex(0,0,i+1);
//           }
//         }        
//       }

//       if(1) {
//         //can I draw in an x just by drawing lines?  Text is hard.  - JY

//         // sf is a size factor (inverse).  The smaller this number, the larger
//         // the x,y,z labels will be.
//         var sf = 80;
//         gl.color(0,0,0,1);  // black?
//         gl.vertex(plate/2 + 1*plate/sf,-1*plate/sf,0);
//         gl.vertex(plate/2 + 3*plate/sf,1*plate/sf,0);
        
//         gl.vertex(plate/2+1*plate/sf,1*plate/sf,0);
//         gl.vertex(plate/2+3*plate/sf,-1*plate/sf,0);

//         // drawing in a "y" - JY
//         gl.vertex(-1*plate/sf,plate/2 + 4*plate/sf,0);
//         gl.vertex(0,plate/2+3*plate/sf,0);
        
//         gl.vertex(0,plate/2+3*plate/sf,0);
//         gl.vertex(1*plate/sf,plate/2+4*plate/sf,0);
        
//         gl.vertex(0,plate/2+1*plate/sf,0);
//         gl.vertex(0,plate/2+3*plate/sf,0);

//         // why not a "z" - JY
//         gl.vertex(-1*plate/sf,0,plate/2.8+3*plate/sf);
//         gl.vertex(1*plate/sf,0,plate/2.8+3*plate/sf);

//         gl.vertex(-1*plate/sf,0,plate/2.8+1*plate/sf);
//         gl.vertex(1*plate/sf,0,plate/2.8+1*plate/sf);

//         gl.vertex(-1*plate/sf,0,plate/2.8+1*plate/sf);
//         gl.vertex(1*plate/sf,0,plate/2.8+3*plate/sf);

//       }
//       gl.end();
//       gl.disable(gl.BLEND);
//       // GL.Mesh.plane({ detailX: 20, detailY: 40 });
//     }

//     // take a pic if needed
//     if (takePic) {
//       var resizedCanvas = document.createElement("canvas");
//       var resizedContext = resizedCanvas.getContext("2d");

//       resizedCanvas.height = "200";
//       resizedCanvas.width = "200";

//       var canvas = this.gl.canvas;

//       resizedContext.drawImage(canvas, 0, 0, 200, 200);
//       var image = resizedCanvas.toDataURL('image/jpeg', takePic);
//       return image;
//     }
//   },
//   // quality is the jpeg quality level (between 0 and 1).  Note that a value of 0
//   // won't take a pic at all, because it is used as a true/false to take the pic.
//   takePic: function(quality) {
//     return this.onDraw(quality);
//   }

// };

// Convert from CSG solid to an array of GL.Mesh objects
// limiting the number of vertices per mesh to less than 2^16
// Blockscad.Viewer.csgToMeshes = function(initial_csg, defaultColor) {
//   var csg = initial_csg.canonicalized();
//   var mesh = new GL.Mesh({ normals: true, colors: true });
//   var meshes = [ mesh ];
//   var vertexTag2Index = {};
//   var vertices = [];
//   var colors = [];
//   var triangles = [];
//   // set to true if we want to use interpolated vertex normals
//   // this creates nice round spheres but does not represent the shape of
//   // the actual model
//   var smoothlighting = false;
//   var polygons = csg.toPolygons();
//   var numpolygons = polygons.length;
//   for(var j = 0; j < numpolygons; j++) {
//     var polygon = polygons[j];
//     var color = defaultColor;      // -- default color

//     if(polygon.shared && polygon.shared.color) {
//       color = polygon.shared.color;
//     }
//     if(polygon.color) {
//       color = polygon.color;
//     }

// 	if (color.length < 4)
// 		color.push(1.0); //opaque

//     var indices = polygon.vertices.map(function(vertex) {
//       var vertextag = vertex.getTag();
//       var vertexindex;
//       if(smoothlighting && (vertextag in vertexTag2Index)) {
//         vertexindex = vertexTag2Index[vertextag];
//       } else {
//         vertexindex = vertices.length;
//         vertexTag2Index[vertextag] = vertexindex;
//         vertices.push([vertex.pos.x, vertex.pos.y, vertex.pos.z]);
//         colors.push(color);
//       }
//       return vertexindex;
//     });
//     for (var i = 2; i < indices.length; i++) {
//       triangles.push([indices[0], indices[i - 1], indices[i]]);
//     }
//     // if too many vertices, start a new mesh;
//     if (vertices.length > 65000) {
//       // finalize the old mesh	
//       mesh.triangles = triangles;
//       mesh.vertices = vertices;
//       mesh.colors = colors;
//       mesh.computeWireframe();
//       mesh.computeNormals();
//       // start a new mesh
//       mesh = new GL.Mesh({ normals: true, colors: true });
//       triangles = [];
//       colors = [];
//       vertices = [];
//       meshes.push(mesh);	
//     }
//   }
//   // finalize last mesh
//   mesh.triangles = triangles;
//   mesh.vertices = vertices;
//   mesh.colors = colors;
//   mesh.computeWireframe();
//   mesh.computeNormals();
//   return meshes;
// };

// this is a bit of a hack; doesn't properly supports urls that start with '/'
// but does handle relative urls containing ../
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

Blockscad.isChrome = function() {
  return (navigator.userAgent.search("Chrome") >= 0);
};

// This is called from within the web worker. Execute the main() function of the supplied script
// and post a message to the calling thread when finished
Blockscad.runMainInWorker = function() {
  try {
    if(typeof(main) != 'function') throw new Error('Your file should contain a function main() which returns a CSG solid or a CAG area.');
  
    var result = main();
    if( (typeof(result) != "object") || ((!(result instanceof CSG)) && (!(result instanceof CAG)))) {
      throw new Error("Nothing to Render!");
    }
    else if(result.length) {                   // main() return an array, we consider it a bunch of CSG not intersecting
       var o = result[0];
       if(o instanceof CAG) {
          o = o.extrude({offset: [0,0,0.1]});
       }
       for(var i=1; i<result.length; i++) {
          var c = result[i];
          if(c instanceof CAG) {
             c = c.extrude({offset: [0,0,0.1]});
          }
          o = o.unionForNonIntersecting(c);
       }
       result = o;
    } 
    var result_compact = result.toCompactBinary();   
    result = null; // not needed anymore
    self.postMessage({cmd: 'rendered', result: result_compact});
  }
  catch(e) {
    var errtxt = e.toString();
    self.postMessage({cmd: 'error', err: errtxt});
  }
};

Blockscad.parseBlockscadScriptSync = function(script, debugging) {
  var workerscript = "//SYNC\n";
  workerscript += "_includePath = "+JSON.stringify(_includePath)+";\n";
  workerscript += script;
  // workerscript += "var me = " + JSON.stringify(me) + ";\n";
  workerscript += "return main();";  
// trying to get include() somewhere:
// 1) XHR works for SYNC <---
// 2) importScripts() does not work in SYNC
// 3) _csg_libraries.push(fn) provides only 1 level include()

  workerscript += "function include(fn) {" +
  "if(0) {" +
    "_csg_libraries.push(fn);" +
  "} else if(0) {" +
    "var url = _includePath!=='undefined'?_includePath:'./';" +
    "var index = url.indexOf('index.html');" +
    "if(index!=-1) {" +
       "url = url.substring(0,index);" +
    "}" +
  	 "importScripts(url+fn);" +
  "} else {" +
   // "console.log('SYNC checking gMemFs for '+fn);" +
   // "if(gMemFs[fn]) {" +
   //    "console.log('found locally & eval:',gMemFs[fn].name);" +
   //    "eval(gMemFs[fn].source); return;" +
   // "}" +
   "var xhr = new XMLHttpRequest();" +
   "xhr.open('GET',_includePath+fn,false);" +
   "console.log('include:'+_includePath+fn);" +
   "xhr.onload = function() {" +
      "var src = this.responseText;" +
      "eval(src);" +
   "};" +
   "xhr.onerror = function() {" +
   "};" +
   "xhr.send();" +
  "}" +
"}";

  var f = new Function(workerscript);
  
  return f();                     // execute the actual code

};

// callback: should be function(error, csg)
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

  // for(var i in gMemFs) {            // let's test all files and check syntax before we do anything
  //   var src = gMemFs[i].source+"\nfunction include() { }\n";
  //   var f;
  //   try {
  //      f = new Function(src);
  //   } catch(e) {
  //     this.setError(i+": "+e.message);
  //     console.log(e.message);
  //   }
  // }
  var workerscript = "//ASYNC\n";
  // workerscript += "var me = " + JSON.stringify(me) + ";\n";
  workerscript += "var _csg_baseurl=" + JSON.stringify(baseurl)+";\n";        // -- we need it early for include()
  // workerscript += "var _includePath=" + JSON.stringify(_includePath)+";\n";    //        ''            ''
  // workerscript += "var gMemFs = [];\n";
  var ignoreInclude = false;
  var mainFile;
  // for(var fn in gMemFs) {
  //    workerscript += "// "+gMemFs[fn].name+":\n";
  //    //workerscript += gMemFs[i].source+"\n";
  //    if(!mainFile) 
  //       mainFile = fn;
  //    if(fn=='main.jscad'||fn.match(/\/main.jscad$/)) 
  //       mainFile = fn;
  //    workerscript += "gMemFs[\""+gMemFs[fn].name+"\"] = "+JSON.stringify(gMemFs[fn].source)+";\n";
  //    ignoreInclude = true;
  // }
  // if(ignoreInclude) {
  //    // workerscript += "eval(gMemFs['"+mainFile+"']);\n";
  // } else {
     workerscript += script;
  // }
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
  this.picdiv = null;
  this.viewer = null;
  this.picViewer = null;
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
  this.createElements();
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
    console.log("creating processor elements:",this.containerdiv);

   // JY - I added a "reset view" button.  
   // now, the container (content-render) HAS A CHILD FROM THE REST OF THE HTML (my reset view button)
   // this code throws an error if I try to throw that child away. SO, I always leave the first
   // child.
   // JY - now there are lots of children - these are the resizable div's handles and such.  Argh! Leave 5.
    // while(this.containerdiv.children.length > 9)
    //   {
    //     this.containerdiv.removeChild(9);
    //   }

    var viewerdiv = document.createElement("div");
    viewerdiv.className = "viewer";
    viewerdiv.style.width = '100%'; 
    viewerdiv.style.height = '100%'; 
    viewerdiv.style.top = '0px';
    viewerdiv.style.position = 'absolute';
    viewerdiv.style.zIndex = '9';
    viewerdiv.style.backgroundColor = "rgb(255,255,255)";
    this.containerdiv.appendChild(viewerdiv);
    this.viewerdiv = viewerdiv;
    try {
      this.viewer = new Blockscad.threeViewer(this.viewerdiv, viewerdiv.offsetWidth, viewerdiv.offsetHeight, this.initialViewerDistance);
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
    // console.log("calling clearViewer from createElements");
    this.clearViewer();
  },

  setCurrentObject: function(obj) {
    this.currentObject = obj;                                  // CAG or CSG
    if(this.viewer) {
      var csg = Blockscad.Processor.convertToSolid(obj);       // enfore CSG to display
      // console.log("calling setCsg from setCurrentObj");
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
    // console.log("calling setCurrentObj from clearViewer");
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
   console.log("in setError with text", txt, "this.hasError is", this.hasError); 
    this.enableItems();
  },
  
  setDebugging: function(debugging) {
    this.debugging = debugging;
  },
  
  // script: javascript code
  setBlockscad: function(script) {
    this.abort();
    // viewer is already cleared
    // console.log("calling clearViewer from setBlockscad");
    // this.clearViewer();
    this.script = script;
    this.rebuildSolid();
  },
  

  rebuildSolid: function()
  {
    this.abort();
    this.setError("");
    // viewer was already cleared by Blockscad.doRender
    // console.log("calling clearViewer from rebuildSolid");
    // this.clearViewer();
    this.processing = true;
    $( '#renderButton' ).html("Render");
    $( '#renderButton' ).prop('disabled', false);
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
            // console.log("calling setCurrentObj from rebuildSolid");
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
        // console.log("calling setCurrentObj from rebuildSolid (useSync)");
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
  },
  takeRotatingPic: function(quality) {
    // console.log("taking an animated gif!", this);
    // here is what I want to do.  make a new canvas of the correct size.
    // picViewer has a size set in createPicViewer.

    var turnAxesOn = false;
    if (Blockscad.drawAxes) {
      Blockscad.drawAxes = 0;
      turnAxesOn = true;
    }
    var frames = [];
    var origAngle = this.viewer.angleZ;
    
    for (var i = 0; i < 9; i += 1) {
      frames[i] = this.viewer.takePic(quality);
      // change angle?
      this.viewer.angleZ += 40;
    }
    if (turnAxesOn) {
      Blockscad.drawAxes = 1;
    }
      this.viewer.angleZ = origAngle;
      this.viewer.onDraw();
    return frames;
  }
};
