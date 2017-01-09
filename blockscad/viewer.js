// viewer.js
// was openjscad.js, originally written by Joost Nieuwenhuijse (MIT License)
//   few adjustments by Rene K. Mueller <spiritdude@gmail.com> for OpenJSCAD.org
// more adjustments by J. Yoder for BlocksCAD
//


var Blockscad =  Blockscad || {};
var CSG = CSG || {};
var CAG = CAG || {};

// A viewer is a WebGL canvas that lets the user view a mesh. The user can
// tumble it around by dragging the mouse.
Blockscad.Viewer = function(containerelement, width, height, initialdepth) {
  var gl = GL.create();
  this.gl = gl;
  this.angleX = -60;
  this.angleY = 0;
  this.angleZ = -45;
  this.viewpointX = 0;
  this.viewpointY = -5;
  this.viewpointZ = initialdepth;
  this.defaultColor = [1,0.5,1,1];
  // Blockscad.defaultColor = this.defaultColor.toString();

  this.touch = {
    lastX: 0,
    lastY: 0,
    scale: 0,
    ctrl: 0,
    shiftTimer: null,
    shiftControl: null,
    cur: null //current state
  };


  // Draw triangle lines:
  this.drawLines = false;
  // Set to true so lines don't use the depth buffer
  this.lineOverlay = false;

  // Set up the viewport
  gl.canvas.width = width;
  gl.canvas.height = height;
  gl.viewport(0, 0, width, height);
  gl.matrixMode(gl.PROJECTION);
  gl.loadIdentity();
  // console.log("am I getting this new code?");
  gl.perspective(45, width / height, 1, 3000);
  gl.matrixMode(gl.MODELVIEW);

  // Set up WebGL state
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(1,1,1, 1);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.polygonOffset(1, 1);

  // Black shader for wireframe
  this.blackShader = new GL.Shader('' +
    'void main() {' +
      'gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;' +
    '}', '' +
    'void main() {' +
      'gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' +
    '}');

  // Shader with diffuse and specular lighting
  this.lightingShader = new GL.Shader('' +
      'varying vec3 color;' +
      'varying float alpha;' +
      'varying vec3 normal;' +
      'varying vec3 light;' +
      'void main() {' +
        'const vec3 lightDir = vec3(1.0, 2.0, 3.0) / 3.741657386773941;' +
        'light = lightDir;' +
        'color = gl_Color.rgb;' +
        'alpha = gl_Color.a;' +
        'normal = gl_NormalMatrix * gl_Normal;' +
        'gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;' +
      '}',
      'varying vec3 color;' +
      'varying float alpha;' +
      'varying vec3 normal;' +
      'varying vec3 light;' +
      'void main() {' +
        'vec3 n = normalize(normal);' +
        'float diffuse = max(0.0, dot(light, n));' +
        'float specular = pow(max(0.0, -reflect(light, n).z), 18.0) * sqrt(diffuse);' +
        'gl_FragColor = vec4(mix(color * (0.3 + 0.7 * diffuse), vec3(1.0), specular), alpha);' +
      '}');

  var _this=this;

  var shiftControl = $('<div class="shift-scene"><div class="arrow arrow-left" />' +
    '<div class="arrow arrow-right" />' +
    '<div class="arrow arrow-top" />' +
    '<div class="arrow arrow-bottom" /></div>' );
  this.touch.shiftControl = shiftControl;

  $(containerelement).append(gl.canvas)
    .append(shiftControl)
    .hammer({//touch screen control
      drag_lock_to_axis: true
    }).on("transform", function(e){
      if (e.gesture.touches.length >= 2) {
          _this.clearShift();
          _this.onTransform(e);
          e.preventDefault();
      }
    }).on("touch", function(e) {
      if (e.gesture.pointerType != 'touch'){
        e.preventDefault();
        return;
      }

      if (e.gesture.touches.length == 1) {
          var point = e.gesture.center;
          _this.touch.shiftTimer = setTimeout(function(){
              shiftControl.addClass('active').css({
                  left: point.pageX + 'px',
                  top: point.pageY + 'px'
              });
              _this.touch.shiftTimer = null;
              _this.touch.cur = 'shifting';
        }, 500);
      } else {
        _this.clearShift();
      }
    }).on("drag", function(e) {
      if (e.gesture.pointerType != 'touch') {
        e.preventDefault();
        return;
      }

      if (!_this.touch.cur || _this.touch.cur == 'dragging') {
          _this.clearShift();
          _this.onPanTilt(e);
      } else if (_this.touch.cur == 'shifting') {
          _this.onShift(e);
      }
    }).on("touchend", function(e) {
        _this.clearShift();
        if (_this.touch.cur) {
            shiftControl.removeClass('active shift-horizontal shift-vertical');
        }
    }).on("transformend dragstart dragend", function(e) {
      if ((e.type == 'transformend' && _this.touch.cur == 'transforming') || 
          (e.type == 'dragend' && _this.touch.cur == 'shifting') ||
          (e.type == 'dragend' && _this.touch.cur == 'dragging'))
        _this.touch.cur = null;
      _this.touch.lastX = 0;
      _this.touch.lastY = 0;
      _this.touch.scale = 0;
    });

  gl.onmousemove = function(e) {
    _this.onMouseMove(e);
  };
  gl.ondraw = function() {
    _this.onDraw();
  };
  gl.onmousewheel = function(e) {
    var wheelDelta = 0;    
    if (e.wheelDelta) {
      wheelDelta = e.wheelDelta;
    } else if (e.detail) {
      // for firefox, see http://stackoverflow.com/questions/8886281/event-wheeldelta-returns-undefined
      wheelDelta = e.detail * -40;     
    }
    if(wheelDelta) {
      wheelDelta /= 2;
      var factor = Math.pow(1.003, -wheelDelta);
      var coeff = _this.getZoom();
      coeff *= factor;
      _this.setZoom(coeff);
    }
  };

  this.clear();
};

Blockscad.Viewer.prototype = {
  setCsg: function(csg) {
    // if(0&&csg.length) {                            // preparing multiple CSG's (not union-ed), not yet working
    //    for(var i=0; i<csg.length; i++)
    //       this.meshes.concat(OpenJsCad.Viewer.csgToMeshes(csg[i]));
    // } else {
    //    this.meshes = OpenJsCad.Viewer.csgToMeshes(csg);
    // }
      this.gl.makeCurrent();
      this.meshes = Blockscad.Viewer.csgToMeshes(csg,this.defaultColor);
      this.onDraw();
  },

  rendered_resize: function(width, height) {

    this.gl.canvas.width = width;
    this.gl.canvas.height = height;

    this.gl.viewport(0, 0, width, height);
    this.gl.matrixMode(this.gl.PROJECTION);
    this.gl.loadIdentity();
    this.gl.perspective(45, width / height, 1, 3000);
    this.gl.matrixMode(this.gl.MODELVIEW);

    this.onDraw();
//    console.log("end of rendered_resize");

  },

  // str is an optional string input that can be used to override the viewMenu position.
  viewReset: function(str) {
    if (str) {
      var whichView = str;
    }
    else
      var whichView = document.getElementById("viewMenu").value;
    if (whichView == "diagonal") {
      // diagonal
      this.angleX = -60;
      this.angleY = 0;
      this.angleZ = -45;
      this.viewpointX = 0;
      this.viewpointY = -5;
      this.viewpointZ = 100;
    }
    else if (whichView == "top") {
      // top
      this.angleX = 0;
      this.angleY = 0;
      this.angleZ = 0;
      this.viewpointX = 0;
      this.viewpointY = 0;
      this.viewpointZ = 100;
    }
    else if (whichView == "bottom") {
      // bottom
      this.angleX = 180;
      this.angleY = 0;
      this.angleZ = 0;
      this.viewpointX = 0;
      this.viewpointY = 0;
      this.viewpointZ = 100;
    }
    else if (whichView == "right") {
      // front
      this.angleX = -90;
      this.angleY = 0;
      this.angleZ = 0;
      this.viewpointX = 0;
      this.viewpointY = 0;
      this.viewpointZ = 100;
    }
    else if (whichView == "front") {
      // right??
      this.angleX = -90;
      this.angleY = 0;
      this.angleZ = -90;
      this.viewpointX = 0;
      this.viewpointY = 0;
      this.viewpointZ = 100;
    }
    else if (whichView == "left") {    
      // back
      this.angleX = -90;
      this.angleY = 0;
      this.angleZ = 180;
      this.viewpointX = 0;
      this.viewpointY = 0;
      this.viewpointZ = 100;
    }
    else if (whichView == "back") {    
      // left??
      this.angleX = -90;
      this.angleY = 0;
      this.angleZ = 90;
      this.viewpointX = 0;
      this.viewpointY = 0;
      this.viewpointZ = 100;
    }



    this.onDraw();
  },

  clear: function() {
    // empty mesh list:
    this.meshes = []; 
    this.onDraw();    
  },

  supported: function() {
    return !!this.gl;
  },

  ZOOM_MAX: 1500,
  ZOOM_MIN: 5,
  onZoomChanged: null,
  plate: true,                   // render plate

  setZoom: function(coeff) { //0...1
    coeff=Math.max(coeff, 0);
    coeff=Math.min(coeff, 1);
    this.viewpointZ = this.ZOOM_MIN + coeff * (this.ZOOM_MAX - this.ZOOM_MIN);
    if(this.onZoomChanged) {
      this.onZoomChanged();
    }
    this.onDraw();
  },

  getZoom: function() {
    var coeff = (this.viewpointZ-this.ZOOM_MIN) / (this.ZOOM_MAX - this.ZOOM_MIN);
    //console.log("zoom is: ",this.viewpointZ);
    return coeff;
  },

  zoomOut: function() {
    var coeff = this.getZoom();
    coeff *= 1.15;
    this.setZoom(coeff);
  },
  zoomIn: function() {
    var coeff = this.getZoom();
    coeff *= 0.85;
    this.setZoom(coeff);
  },
  
  onMouseMove: function(e) {
    if (e.dragging) {
      //console.log(e.which,e.button);
      var b = e.button;
      if(e.which) {                            // RANT: not even the mouse buttons are coherent among the brand (chrome,firefox,etc)
         b = e.which;
      }
      e.preventDefault();
      if(e.altKey||b==3) {                     // ROTATE X,Y (ALT or right mouse button)
        this.angleY += e.deltaX;
        this.angleX += e.deltaY;
        //this.angleX = Math.max(-180, Math.min(180, this.angleX));
      } else if(e.shiftKey||b==2) {            // PAN  (SHIFT or middle mouse button)
        var factor = 5e-3;
        this.viewpointX += factor * e.deltaX * this.viewpointZ;
        this.viewpointY -= factor * e.deltaY * this.viewpointZ;
      } else if(e.ctrlKey) {                   // ZOOM IN/OU
         var factor = Math.pow(1.006, e.deltaX+e.deltaY);
         var coeff = this.getZoom();
         coeff *= factor;
         this.setZoom(coeff);
      } else {                                 // ROTATE X,Z  left mouse button
        this.angleZ += e.deltaX;
        this.angleX += e.deltaY;
      }
      this.onDraw();
    }
  },
  clearShift: function() {
      if(this.touch.shiftTimer) {
          clearTimeout(this.touch.shiftTimer);
          this.touch.shiftTimer = null;
      }
      return this;
  },
  //pan & tilt with one finger
  onPanTilt: function(e) {
    this.touch.cur = 'dragging';
    var delta = 0;
    if (this.touch.lastY && (e.gesture.direction == 'up' || e.gesture.direction == 'down')) {
        //tilt
        delta = e.gesture.deltaY - this.touch.lastY;
        this.angleX += delta;
    } else if (this.touch.lastX && (e.gesture.direction == 'left' || e.gesture.direction == 'right')) {
        //pan
        delta = e.gesture.deltaX - this.touch.lastX;
        this.angleZ += delta;
    }
    if (delta)
      this.onDraw();
    this.touch.lastX = e.gesture.deltaX;
    this.touch.lastY = e.gesture.deltaY;
  },
  //shift after 0.5s touch&hold
  onShift: function(e) {
    this.touch.cur = 'shifting';
    var factor = 5e-3;
    var delta = 0;

    if (this.touch.lastY && (e.gesture.direction == 'up' || e.gesture.direction == 'down')) {
        this.touch.shiftControl
          .removeClass('shift-horizontal')
          .addClass('shift-vertical')
          .css('top', e.gesture.center.pageY + 'px');
        delta = e.gesture.deltaY - this.touch.lastY;
        this.viewpointY -= factor * delta * this.viewpointZ;
        this.angleX += delta;
    } 
    if (this.touch.lastX && (e.gesture.direction == 'left' || e.gesture.direction == 'right')) {
        this.touch.shiftControl
          .removeClass('shift-vertical')
          .addClass('shift-horizontal')
          .css('left', e.gesture.center.pageX + 'px');
        delta = e.gesture.deltaX - this.touch.lastX;
        this.viewpointX += factor * delta * this.viewpointZ;
        this.angleZ += delta;
    }
    if (delta)
      this.onDraw();
    this.touch.lastX = e.gesture.deltaX;
    this.touch.lastY = e.gesture.deltaY;
  },
  //zooming
  onTransform: function(e) {
      this.touch.cur = 'transforming';
      if (this.touch.scale) {
        var factor = 1 / (1 + e.gesture.scale - this.touch.scale);
        var coeff = this.getZoom();
        coeff *= factor;
        this.setZoom( coeff);
      }
      this.touch.scale = e.gesture.scale;
      return this;
  },
  onDraw: function(takePic,angle,camera) {
    var gl = this.gl;
    gl.makeCurrent();



    if (takePic)
      gl.clearColor(1,1,1, 1);

    if (takePic && this.meshes[0]) {
    // I need to find out size and position of the object and position the camera accordingly.

    // angle (in radians) of how far I've rotated around my object.
    // console.log("this",this);

    angle += 3*Math.PI/4;
    var bsph = this.bsph;
    var bbox = this.bbox;   // use bbox to see if this is a flat project or a tall one.

    // console.log(bbox);
    // var tallness = 1.2 ;
    var tallness = 1.3 - (bbox[1].z - bbox[0].z)/(2*bsph.radius);

    var r = 2.6 * bsph.radius;
    gl.matrixMode(gl.PROJECTION);
    gl.loadIdentity();
    gl.perspective(45,gl.canvas.width / gl.canvas.height,1,3000);
    gl.matrixMode(gl.MODELVIEW);
    gl.loadIdentity();
    gl.lookAt(bsph.center.x + r * Math.sin(angle), bsph.center.y + r * Math.cos(angle), bsph.center.z + tallness*r/2, 
              bsph.center.x, bsph.center.y, bsph.center.z, 0,0,1);
    }

    else {
      // console.log("setting normal camera position and angle");
    // these values were getting corrupted in the picDiv.  Don't know why.
      gl.matrixMode(gl.PROJECTION);
      gl.loadIdentity();
      gl.perspective(45, gl.canvas.width / gl.canvas.height, 1, 3000);
      gl.matrixMode(gl.MODELVIEW);
      gl.loadIdentity();
      gl.translate(this.viewpointX, this.viewpointY, -this.viewpointZ);
      gl.rotate(this.angleX, 1, 0, 0);
      gl.rotate(this.angleY, 0, 1, 0);
      gl.rotate(this.angleZ, 0, 0, 1);
    }



    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.BLEND);
    //gl.disable(gl.DEPTH_TEST);
    if (!this.lineOverlay) gl.enable(gl.POLYGON_OFFSET_FILL);

    // don't send empty meshes to WebGL - check for length of vertices array - JY
    for (var i = 0; i < this.meshes.length; i++) {
      var mesh = this.meshes[i];
      if (mesh.vertices.length > 0) {
        this.lightingShader.draw(mesh, gl.TRIANGLES);
      }
    }
    if (!this.lineOverlay) gl.disable(gl.POLYGON_OFFSET_FILL);
    gl.disable(gl.BLEND);
    //gl.enable(gl.DEPTH_TEST);

    if(this.drawLines) {
      if (this.lineOverlay) gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      for (var i = 0; i < this.meshes.length; i++) {
        var mesh = this.meshes[i];
        if (mesh.vertices.length > 0) {
          this.blackShader.draw(mesh, gl.LINES);
        }
      }
      gl.disable(gl.BLEND);
      if (this.lineOverlay) gl.enable(gl.DEPTH_TEST);
    }
    //EDW: axes
    // Jennie - I don't draw major or minor gridlines on X or Y axis, because they
    // cover up the colored axis lines drawn later.  That's the x!=0 part.
    // if (Blockscad.drawAxes) {
    if (Blockscad.drawAxes && !takePic) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.begin(gl.LINES);
      // can I have the plate change size based on your zoom level?
      // var plate = Math.ceil(this.viewpointZ * 1.1);
      // if (plate%2) plate++;
      //console.log("plate is:",plate);
      var plate = 200;
      if(this.plate) {
         gl.color(0.8,0.8,0.8,0.5); // -- minor grid
         for(var x=-plate/2; x<=plate/2; x++) {
            if(x%10 && x!==0) {
               gl.vertex(-plate/2, x, 0);
               gl.vertex(plate/2, x, 0);
               gl.vertex(x, -plate/2, 0);
               gl.vertex(x, plate/2, 0);

               // hashmarks on z-axis
               if (x < plate/2.8 && x > -plate/2.8) {
                 gl.vertex(-0.5, 0, x);
                 gl.vertex(0.5, 0, x);
                 gl.vertex(0, -0.50, x);
                 gl.vertex(0, 0.50, x); 
               }
            }
         }
         gl.color(0.5,0.5,0.5,0.5); // -- major grid
         for(var x=10; x<=plate/2; x+=10) {
            if(x!==0) {
              gl.vertex(-plate/2, x, 0);
              gl.vertex(plate/2, x, 0);
              gl.vertex(x, -plate/2, 0);
              gl.vertex(x, plate/2, 0);
              gl.vertex(-plate/2, -x, 0);
              gl.vertex(plate/2, -x, 0);
              gl.vertex(-x, -plate/2, 0);
              gl.vertex(-x, plate/2, 0);

              // hashmarks on z-axis
              if (x < plate/2.8 ) {
                gl.vertex(-1, 0, x);
                gl.vertex(1, 0, x);
                gl.vertex(0, -1, x);
                gl.vertex(0, 1, x);
                gl.vertex(-1, 0, -x);
                gl.vertex(1, 0, -x);
                gl.vertex(0, -1, -x);
                gl.vertex(0, 1, -x);
              }
          }
         }
      }

      // JY - set alpha for axes color to 1 to make the colors more obvious, and changed colors.
      if(1) {
         //X - red

   
        gl.color(1, 0, 0, 1); //positive direction
        gl.vertex(0, 0, 0);
        gl.vertex(plate/2, 0, 0);

         // I'd like to try making the negative direction dashed
        for (var i=-plate/2; i < 0; i++) {
          if (i%2) {
            gl.vertex(i,0,0);
            gl.vertex(i+1,0,0);
          }
        }

         //Y - green

        gl.color(0, 0.7, 0, 1); //positive direction
        gl.vertex(0, 0, 0);
        gl.vertex(0, plate/2, 0);

        for (var i=-plate/2; i < 0; i++) { // negative direction is dashed
          if (i%2) {
            gl.vertex(0,i,0);
            gl.vertex(0,i+1,0);
          }
        }
  
        gl.color(0.1, 0.1, 0.4, 1); //positive direction
        gl.vertex(0, 0, 0);
        gl.vertex(0, 0, plate/2.8);

        for (var i=Math.floor(-plate/2.8); i < 0; i++) { // negative direction is dashed
          if (i%2) {
            gl.vertex(0,0,i);
            gl.vertex(0,0,i+1);
          }
        }        
      }

      if(1) {
        //can I draw in an x just by drawing lines?  Text is hard.  - JY

        // sf is a size factor (inverse).  The smaller this number, the larger
        // the x,y,z labels will be.
        var sf = 80;
        gl.color(0,0,0,1);  // black?
        gl.vertex(plate/2 + 1*plate/sf,-1*plate/sf,0);
        gl.vertex(plate/2 + 3*plate/sf,1*plate/sf,0);
        
        gl.vertex(plate/2+1*plate/sf,1*plate/sf,0);
        gl.vertex(plate/2+3*plate/sf,-1*plate/sf,0);

        // drawing in a "y" - JY
        gl.vertex(-1*plate/sf,plate/2 + 4*plate/sf,0);
        gl.vertex(0,plate/2+3*plate/sf,0);
        
        gl.vertex(0,plate/2+3*plate/sf,0);
        gl.vertex(1*plate/sf,plate/2+4*plate/sf,0);
        
        gl.vertex(0,plate/2+1*plate/sf,0);
        gl.vertex(0,plate/2+3*plate/sf,0);

        // why not a "z" - JY
        gl.vertex(-1*plate/sf,0,plate/2.8+3*plate/sf);
        gl.vertex(1*plate/sf,0,plate/2.8+3*plate/sf);

        gl.vertex(-1*plate/sf,0,plate/2.8+1*plate/sf);
        gl.vertex(1*plate/sf,0,plate/2.8+1*plate/sf);

        gl.vertex(-1*plate/sf,0,plate/2.8+1*plate/sf);
        gl.vertex(1*plate/sf,0,plate/2.8+3*plate/sf);

      }
      gl.end();
      gl.disable(gl.BLEND);
      // GL.Mesh.plane({ detailX: 20, detailY: 40 });
    }

    // take a thumbnail and large pic if needed
    if (takePic) {

      var images = [];
      images[0] = this.gl.canvas.toDataURL('image/jpeg', takePic);

      var canv1 = document.createElement("canvas");
      var ctx1 = canv1.getContext("2d");

      canv1.height = this.gl.canvas.height * 0.5;
      canv1.width = this.gl.canvas.height  * 0.5;

      ctx1.drawImage(this.gl.canvas, 0, 0, canv1.width, canv1.height);

      var canv2 = document.createElement("canvas");
      var ctx2 = canv2.getContext("2d");
      canv2.height = canv1.height * 0.5;
      canv2.width = canv1.width * 0.5;

      ctx2.drawImage(canv1, 0, 0, canv1.width * 0.5, canv1.height * 0.5);
      images[1] = canv2.toDataURL('image/jpeg', takePic);

      return images;

    }
    // take a screenshot pic if needed
    if (camera) {

      var image = this.gl.canvas.toDataURL('image/jpeg', camera);
      return image;
    }

    
  },
  // quality is the jpeg quality level (between 0 and 1).  Note that a value of 0
  // won't take a pic at all, because it is used as a true/false to take the pic.
  takePic: function(quality, angle) {
      return this.onDraw(quality, angle);
  },
  
  // new function for taking a screen shot
  takeCameraPic: function(quality) {
      return this.onDraw(0,0,quality);
  }


};

// Convert from CSG solid to an array of GL.Mesh objects
// limiting the number of vertices per mesh to less than 2^16
Blockscad.Viewer.csgToMeshes = function(initial_csg, defaultColor) {
  var csg = initial_csg.canonicalized();
  var mesh = new GL.Mesh({ normals: true, colors: true });
  var meshes = [ mesh ];
  var vertexTag2Index = {};
  var vertices = [];
  var colors = [];
  var triangles = [];
  // set to true if we want to use interpolated vertex normals
  // this creates nice round spheres but does not represent the shape of
  // the actual model
  var smoothlighting = false;
  var polygons = csg.toPolygons();
  var numpolygons = polygons.length;
  for(var j = 0; j < numpolygons; j++) {
    var polygon = polygons[j];
    var color = defaultColor;      // -- default color

    if(polygon.shared && polygon.shared.color) {
      color = polygon.shared.color;
    }
    if(polygon.color) {
      color = polygon.color;
    }

	if (color.length < 4)
		color.push(1.0); //opaque

    var indices = polygon.vertices.map(function(vertex) {
      var vertextag = vertex.getTag();
      var vertexindex;
      if(smoothlighting && (vertextag in vertexTag2Index)) {
        vertexindex = vertexTag2Index[vertextag];
      } else {
        vertexindex = vertices.length;
        vertexTag2Index[vertextag] = vertexindex;
        vertices.push([vertex.pos.x, vertex.pos.y, vertex.pos.z]);
        colors.push(color);
      }
      return vertexindex;
    });
    for (var i = 2; i < indices.length; i++) {
      triangles.push([indices[0], indices[i - 1], indices[i]]);
    }
    // if too many vertices, start a new mesh;
    if (vertices.length > 65000) {
      // finalize the old mesh	
      mesh.triangles = triangles;
      mesh.vertices = vertices;
      mesh.colors = colors;
      mesh.computeWireframe();
      mesh.computeNormals();
      // start a new mesh
      mesh = new GL.Mesh({ normals: true, colors: true });
      triangles = [];
      colors = [];
      vertices = [];
      meshes.push(mesh);	
    }
  }
  // finalize last mesh
  mesh.triangles = triangles;
  mesh.vertices = vertices;
  mesh.colors = colors;
  mesh.computeWireframe();
  mesh.computeNormals();
  return meshes;
};

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

// this is called from within the web worker.  Run the parser, create the main() function, execute the main() function.
Blockscad.parseCodeInWorker = function(code, fontkeys, fontdata) {
  // this needs to call the parser, get the main string back.  Will it be a function?  I think it will be a string.  We'll see.
   // self.postMessage({cmd: 'log', txt: "code in paresCodeInWorker: " + code});



  try {

    // I want to convert a font buffer to an actual font file using opentype.

    var csgcode = openscadOpenJscadParser.parse(code); 
    // self.postMessage({cmd: 'log', txt: "csgcode in paresCodeInWorker: " + csgcode});


    // is the code any good? it should start with function main()

    if (!csgcode || !csgcode.length) {
        // I don't expect this to actually happen.  I think the catch method would get it.
      // self.postMessage({cmd: 'errorParse', err: "parser failed during execution"});
      throw new Error('parser produced no output at all');
    }
    // we think we have good code.  Try to run it in the worker now.
    self.postMessage({cmd: 'parsed', err: "haha"});
    Blockscad.runMainInWorker(csgcode);
  }
  catch(e) {
       // self.postMessage({cmd: 'log', txt: "in catch of parseCodeInWorker: "});

    var errtxt = e.toString();
    self.postMessage({cmd: 'errorParse', err: errtxt});
  }
}
// This is called from within the web worker. Execute the main() function of the supplied script
// and post a message to the calling thread when finished
Blockscad.runMainInWorker = function(csgcode) {
   // var code = csgcode.substring(csgcode.indexOf("{")+1, csgcode.lastIndexOf("}"));
   var main = new Function(csgcode);

  try {
    if(typeof(main) != 'function') throw new Error('Your code has an error somewhere.  Parsing your blocks failed.');
  
    var result = main();

    // self.postMessage({cmd: 'log', txt: result});

    // result will always return an array of objects. check the first object to make sure it is good.  empty stuff gets "undefined".



    if( (typeof(result[0]) != "object") || ((!(result[0] instanceof CSG)) && (!(result[0] instanceof CAG)))) {
      throw new Error("Nothing to Render!");
    }
    else {                  
      // just for fun, let's send a message with how many objects there were.
      // self.postMessage({cmd: 'log', txt: "number of objects: " + result.length});
      var numPolys = 0;

      // I have something to render.  If it was a single object, extrude and return it.

      var o = result[0];
      if(o instanceof CAG) {
        o = o.extrude({offset: [0,0,0.1]});
      }

      if (result.length == 1) { 
        // if (o.polygons) self.postMessage({cmd: 'log', txt: "number of polys final: " + o.polygons.length});
        var cp = o.toCompactBinary();
        self.postMessage({cmd: 'finalMesh', result: cp}); 
      }
      else { 
        // // I know I have more than one object.  First make a fake union for display only.
        // for(var i=1; i<result.length; i++) {
        //   var c = result[i];
        //   if(c instanceof CAG) {
        //      c = c.extrude({offset: [0,0,0.1]});
        //   }
        //   o = o.unionForNonIntersecting(c);
        //   numPolys += c.polygons.length;
        // }


        // var result_compact = o.toCompactBinary();
        // self.postMessage({cmd: 'log', txt: "number of polys: " + numPolys});
        // self.postMessage({cmd: 'rendered', result: result_compact});
       

        // now that I've returned the display obj, do a real union and return it.

        var a = result[0];
        var rest_of_objs = result.slice(1);
        a = a.union(rest_of_objs);


        if(a instanceof CAG) {
          a = a.extrude({offset: [0,0,0.1]});
        }
        self.postMessage({cmd: 'log', txt: "number of polys final: " + a.polygons.length});



        var result_compact = a.toCompactBinary();
        self.postMessage({cmd: 'finalMesh', result: result_compact});


        result = null; // not needed anymore
      } // end else (result.length > 1)
    } // end else (have something to render)
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
      // "opentype/dist/opentype.min.js",
      // "blockscad/viewer_compressed.js",
      // "blockscad/underscore.js",
      // "blockscad/openscad-openjscad-translator.js"
      "blockscad/csg.js",
      "blockscad/formats.js",
      "opentype/dist/opentype.min.js",
      "blockscad/viewer.js",
      "blockscad/underscore.js",
      "blockscad/openscad-openjscad-translator.js"
  ];

  // console.log("in parseBlockscadScriptASync");
  var baseurl = document.location.href.replace(/\?.*$/, '');
  baseurl = baseurl.replace(/#.*$/,'');        // remove remote URL 
  var blockscadurl = baseurl;

  var libraries = [];

  var workerscript = "//ASYNC\n";
  workerscript += "var _csg_baseurl=" + JSON.stringify(baseurl)+";\n";        // -- we need it early for include()
  var ignoreInclude = false;
  var mainFile;

     // workerscript += script;

  // workerscript += "var code = `" + script + '`;';

  workerscript += "\n\n\n\n//// The following code was added by BlocksCAD:\n";


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
  // workerscript += "  Blockscad.runMainInWorker();";
  workerscript += "Blockscad.resolution = " + Blockscad.resolution + ';';
  workerscript += "Blockscad.csg_filename = e.data.csg_filename;";
  workerscript += "Blockscad.csg_commands = e.data.csg_commands;";
  workerscript += "Blockscad.fonts = {};";
  workerscript += "var fontkeys = e.data.fontkeys;";
  workerscript += "var fontdata = e.data.fontdata;";
  // can I actually parse the font buffers here?

  workerscript += "for (var i = 0; i < fontkeys.length; i++) {";
  workerscript += "  Blockscad.fonts[fontkeys[i]] = opentype.parse(fontdata[i]); }";

  workerscript += "  Blockscad.parseCodeInWorker(e.data.data);";
  workerscript += "}},false);\n";


  var blobURL = Blockscad.textToBlobUrl(workerscript);
  
  if(!window.Worker) throw new Error("Your browser doesn't support Web Workers. Please try the Chrome or Firefox browser instead.");
  var worker = new Worker(blobURL);
  worker.onmessage = function(e) {
    if(e.data)
    { 
      if (e.data.cmd == 'rendered' || e.data.cmd == 'finalMesh') {
        // console.log("got the final, unioned mesh:", e.data.result);
        var resulttype = e.data.result.class;
        var result;
        if (resulttype == "CSG") {
          result = CSG.fromCompactBinary(e.data.result);
        }
        else if (resulttype == "CAG") {
          result = CAG.fromCompactBinary(e.data.result);
        }
        else {
          throw new Error("cannot parse final result");
        }

        callback(e.data.cmd, result);
      }
      else if(e.data.cmd == "error")
      {
        callback(e.data.err, null);
      }
      else if (e.data.cmd == "errorParse") {
        console.log("caught parsing error:", e.data.err);
        $( '#error-message' ).html(e.data.err);
        $( '#error-message' ).addClass("has-error");        
        callback(e.data.err, null);
      }
      else if (e.data.cmd == "parsed") {
        $( '#render-ongoing').html(Blockscad.Msg.RENDER_IN_PROGRESS + '<img id=busy src="imgs/busy2.gif">');

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
  var fontKeys = [];
  var fontData = [];
  for (buf in Blockscad.fonts) {
    fontKeys.push(buf);
    fontData.push(Blockscad.fonts[buf]);
  }

  worker.postMessage({
    cmd: "render",
    data: script,
    fontkeys: fontKeys,
    fontdata: fontData,
    csg_filename: Blockscad.csg_filename,
    csg_commands: Blockscad.csg_commands 
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
  this.picviewer = null;
  this.rpicviewer = null;
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
  this.thumbnail = "none";
  this.imgStrip = "none";
  this.img = "none";
  this.createElements();
};

Blockscad.Processor.convertToSolid = function(obj) {

  // obj is an array with one object in it.  It has already been extruded and unioned.
  // this function really has nothing to do.

  if (typeof(obj) != "object" || !(  ((obj) instanceof CAG) || ((obj) instanceof CSG) ) )
    throw new Error("Cannot convert to solid");

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
    while(this.containerdiv.children.length > 7)
      {
        this.containerdiv.removeChild(7);
      }

    var viewerdiv = document.createElement("div");
    viewerdiv.style.width = '100%'; 
    viewerdiv.style.height = '100%'; 
    viewerdiv.style.top = '0px';
    viewerdiv.style.position = 'absolute';
    viewerdiv.style.zIndex = '9';
    this.containerdiv.appendChild(viewerdiv);
    this.viewerdiv = viewerdiv;

    var picdiv = document.createElement("div");
    picdiv.setAttribute('id','picdiv');
    picdiv.style.width = Blockscad.picSize[0] + 'px'; 
    picdiv.style.height = Blockscad.picSize[1] + 'px'; 
    picdiv.style.top = '0px';
    picdiv.style.right = '10px';
    picdiv.style.position = 'absolute';
    picdiv.style.zIndex = '-1';
    document.getElementById("blocklyDiv").appendChild(picdiv);
    this.picdiv = picdiv;

    var rpicdiv = document.createElement("div");
    rpicdiv.setAttribute('id','picdiv');
    rpicdiv.style.width = Blockscad.rpicSize[0] + 'px'; 
    rpicdiv.style.height = Blockscad.rpicSize[1] + 'px'; 
    rpicdiv.style.top = '0px';
    rpicdiv.style.right = '10px';
    rpicdiv.style.position = 'absolute';
    rpicdiv.style.zIndex = '-1';
    document.getElementById("blocklyDiv").appendChild(rpicdiv);
    this.rpicdiv = rpicdiv;

    try {
      this.picviewer = new Blockscad.Viewer(this.picdiv, picdiv.offsetWidth, picdiv.offsetHeight, this.initialViewerDistance);
    } catch(e) {
      this.picdiv.innerHTML = "<b><br><br>Error: " + e.toString() + "</b><br><br>BlocksCAD currently requires Google Chrome or Firefox with WebGL enabled";
    }
    $("#picdiv").addClass('hidden');

    try {
      this.rpicviewer = new Blockscad.Viewer(this.rpicdiv, rpicdiv.offsetWidth, rpicdiv.offsetHeight, this.initialViewerDistance);
    } catch(e) {
      this.rpicdiv.innerHTML = "<b><br><br>Error: " + e.toString() + "</b><br><br>BlocksCAD currently requires Google Chrome or Firefox with WebGL enabled";
    }
    $("#rpicdiv").addClass('hidden');

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
    // this.clearViewer();
  },

  // // getSphere takes the axis-aligned bounding box of a csg object and returns a bounding sphere.
  // // this isn't the minimal bounding sphere, but it is a good approximation.
  // getBoundingSphere: function(aabb) {
  //   // console.log(aabb);
  //   // the sphere center is halfway between the min and max points for each coordinate
  //   // to get the radius, go through all vertices (yuck) and test their distance from the center
  //   // pick the biggest, and that's the radius.
  //   // I use lengthSquared for per-vertex calcualations to avoid doing a square root on each vertex.
  //   var sphere = {center: aabb[0].plus(aabb[1]).dividedBy(2), radius: 0 };
  //   for (var i = 0; i < this.currentObject.polygons.length; i++) {
  //     for (var j = 0; j < this.currentObject.polygons[i].vertices.length; j++) {
  //       var v = this.currentObject.polygons[i].vertices[j];
  //       sphere.radius = Math.max(sphere.radius, 
  //         new CSG.Vector3D(v.pos.x, v.pos.y, v.pos.z).minus(sphere.center).lengthSquared());
  //     }
  //   }
  //   sphere.radius = Math.sqrt(sphere.radius);
  //   return sphere;

  // },
  setCurrentObject: function(obj, forDownload) {
    var csg = Blockscad.Processor.convertToSolid(obj);       // enfore CSG to display

    this.currentObject = csg;
    this.hasValidCurrentObject = true;

    if (this.viewer) this.viewer.setCsg(csg);
    // for taking pics I also need the bounds and bounding sphere
    if (this.picviewer)  {
      this.picviewer.bbox = csg.getBounds();
      this.picviewer.bsph = csg.getBoundingSphere();
      this.picviewer.setCsg(csg);
    }
    if (this.rpicviewer)  {
      this.rpicviewer.bbox = csg.getBounds();
      this.rpicviewer.bsph = csg.getBoundingSphere();
      this.rpicviewer.setCsg(csg);
    }

    if (forDownload) {
      // console.log("trying to turn on stl_buttons");
      $('#stl_buttons').removeClass('hidden');
      
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
    }
  },
  
  selectedFormat: function() {
    return this.formatDropdown.options[this.formatDropdown.selectedIndex].value;
  },

  selectedFormatInfo: function() {
    return this.formatInfo(this.selectedFormat());
  },
  
  updateDownloadLink: function() {
    var ext = this.selectedFormatInfo().extension;
    this.generateOutputFileButton.innerHTML = Blockscad.Msg.GENERATE_STL + " "+ext.toUpperCase();
  },
  
  clearViewer: function() {
    this.clearOutputFile();
    this.setCurrentObject(new CSG());
    this.hasValidCurrentObject = false;
    this.thumbnail = "none";
    this.imgStrip = "none";
    this.img = "none";
    // console.log('trying to hid stl_buttons');
    $('#stl_buttons').addClass('hidden');
    this.enableItems();
  },
  
  abort: function() {
    if(this.processing)
    {
      //todo: abort

      // I want to turn the render button back on!
      $('#renderButton').prop('disabled', false); 

      // I might need to change the "in progress" message too.

      $( '#render-ongoing').html(Blockscad.Msg.PARSE_IN_PROGRESS + '<img id=busy src="imgs/busy2.gif">');

      this.processing=false;
      //this.statusspan.innerHTML = "Aborted.";
      this.worker.terminate();
      this.enableItems();
      if(this.onchange) this.onchange();
    }
  },
  
  enableItems: function() {
    this.abortbutton.style.display = this.processing? "inline-block":"none";
    this.renderbutton.style.display = this.processing? "none":"inline-block";
    this.ongoingrender.style.display = this.processing? "inline-block":"none";
  },

 
  setError: function(txt) {
    this.hasError = (txt != "");
    $( "#error-message" ).text(txt);
   // console.log("in setError with text", txt, "this.hasError is", this.hasError); 
    this.enableItems();
  },
  
  setDebugging: function(debugging) {
    this.debugging = debugging;
  },
  
  // build/display a mesh
  setBlockscad: function(script) {
    // this.abort();
    // this.clearViewer();
    this.script = script;
    // console.log("script for worker is:", this.script);
    this.rebuildSolid();
  },
  

  rebuildSolid: function()
  {
    this.abort();
    this.setError("");
    this.clearViewer();
    this.processing = true;
    $( '#renderButton' ).html(Blockscad.Msg.RENDER_BUTTON);
    $( '#renderButton' ).prop('disabled', false);
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

             if (err && err == "finalMesh") {
                // console.log("got back final mesh that can be downloaded");
                $( '#render-ongoing').html(Blockscad.Msg.PARSE_IN_PROGRESS + '<img id=busy src="imgs/busy2.gif">');
                // I got back the final mesh here.  get the "ready for download" stuff ready.
                that.processing = false;

                that.setCurrentObject(obj, true);
                // console.log(that);
                var images = that.picviewer.takePic(Blockscad.picQuality,0,1);
                that.img = images[0];
                that.thumbnail = images[1];
                that.imgStrip = that.takeRotatingPic(1,Blockscad.numRotPics);
                that.processing = false;
                that.worker = null;
              }
              else if (err && err == "rendered")
              {
               // console.log("got back rendered shapes for display");
                // change message to say "prep for final union"

                $( '#render-ongoing').html("Prepare for Download..." + '<img id=busy src="imgs/busy2.gif">');

                that.setCurrentObject(obj, false);
                // console.log(that);
                var images = that.picviewer.takePic(Blockscad.picQuality,0,1);
                that.img = images[0];
                that.thumbnail = images[1];
                that.imgStrip = that.takeRotatingPic(1,Blockscad.numRotPics);
              }

              else 
              {

                console.log("what is going on?");
                console.log("error in proc" + err);
                that.processing = false;
                that.worker = null;
              // alert(err);
              // console.log("script was:",this.script;
                that.setError(err);
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

    var blob;
    if(format == "stla") {      
      blob = this.currentObject.toStlString();      
      // console.log("this format mimetype is:", this.formatInfo(format).mimetype); 
      blob = new Blob([blob],{ type: "text/plain; charset=utf-8"});
    }
    else if(format == "stlb") {      
      blob = this.currentObject.toStlBinary({webBlob: true});     

      // -- binary string -> blob gives bad data, so we request cgs.js already blobbing the binary
      //blob = new Blob([blob],{ type: this.formatInfo(format).mimetype+"/charset=UTF-8" }); 
    }
    else if(format == "amf") {
      blob = this.currentObject.toAMFString({
        producer: "BlocksCAD "+Blockscad.version,
        date: new Date()
      });
      blob = new Blob([blob],{ type: "text/plain; charset=utf-8"});
    }  
    else if(format == "x3d") {
      blob = this.currentObject.toX3D();
      blob = new Blob([blob],{ type: "text/plain; charset=utf-8"});
    }
    else if(format == "dxf") {
      blob = this.currentObject.toDxf();
      blob = new Blob([blob],{ type: "text/plain; charset=utf-8"});
    }
    else if (format == "obj") {
      blob = this.currentObject.toObj();
      blob = new Blob([blob],{type: "text/plain; charset=utf-8"});
    }
    else {
      throw new Error("Not supported");
    }    
    return blob;
  },
  
  supportedFormatsForCurrentObject: function() {
    if (this.currentObject instanceof CSG) {
      // if safari, don't let them save stlb
      if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) 
        return ["stla", "amf", "x3d"];
      return ["stlb", "stla", "x3d", "obj", "amf"];
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
      obj: {
        displayName: "OBJ (ASCII)",
        extension: "obj",
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
      $('#message-text').html("<h4>" + Blockscad.Msg.SAVE_FAILED + ' ' + Blockscad.Msg.SAVE_FAILED_PROJECT_NAME + ".</h4>");
      $('#message-modal').modal();
    }
  },
  takeRotatingPic: function(quality, numframes) {

    var frames = [];
    var images = [];
    var c = document.createElement('canvas');
    c.width  = Blockscad.rpicSize[0] * numframes;
    c.height = Blockscad.rpicSize[0];
    var ctx = c.getContext("2d");
    
    for (var i = 0; i < numframes; i += 1) {
      var angle = -i * (2*Math.PI / numframes);
      frames[i] = this.rpicviewer.takePic(quality,angle)[0];
      images[i] = new Image();
      images[i].src = frames[i];
      ctx.drawImage(images[i],i * Blockscad.rpicSize[0],0);
      // change angle?
    }

    var strip = c.toDataURL("image/jpeg");
    // console.log("have a strip - returning it");
    return strip;
  }
};

// pathToPoints() takes a Path object created by opentype.js
// resolution is a number used for the number of points used
// to approximate a curve in the font path
// returns an array of points and an array of paths
// NOTE: web svg coordinates have flipped Y coordinates
// (increasing positive as you move down)
// so all Y coordinates are multiplied by -1
Blockscad.pathToPoints = function(path,resolution) {

  var points = [];
  var paths = [];
  var new_path = [];
  var fn = 2;   // default resolution in case resolution is not >= 2
  var to, c1,c2,nx,ny,a; //for curve approximation

  if (resolution > 2) fn = resolution; 

  if (fn > 10) fn = 10;  // cap the resolution for performance

  // console.log(path.commands);

  if (path && path.commands && path.commands.length > 0) {
    // hopefully got a legal path
    var point_index = 0;  
    var prev = [];  // save the previous point for curves
    for (var i = 0; i < path.commands.length; i++) {
      switch(path.commands[i].type) {
        case 'M':
          // save, then clear, the last path
          if (new_path.length>2) {
            paths.push(new_path);
          }
          new_path = [];
          // load up the new point
          points.push([path.commands[i].x, -1 * path.commands[i].y]);
          new_path.push(point_index++);
          prev = [path.commands[i].x, -1 * path.commands[i].y];
          break;
        case 'L':
          // load up the new point
          points.push([path.commands[i].x, -1 * path.commands[i].y]);
          new_path.push(point_index++);
          prev = [path.commands[i].x, -1 * path.commands[i].y];
          break;
        case 'C':

          // Cubic Bezier curve
          // uses two control points c1(x1,y1) and c2(x2,y2)
          // the previous point prev[x,y], and current point to[x,y]
          to = [path.commands[i].x, -1 * path.commands[i].y]; 
          c1 = [path.commands[i].x1, -1 * path.commands[i].y1];
          c2 = [path.commands[i].x2, -1 * path.commands[i].y2];

          // approximate the curve with fn points
          for (var k=1;k<=fn;k++) {
            a = k / fn;
            nx = prev[0] * Math.pow(1-a,3) + 
                     c1[0] * 3 * Math.pow(1-a,2) * a +
                     c2[0] * 3 * Math.pow(1-a,1) * a * a +
                     to[0] * Math.pow(a,3); 
            nx = prev[1] * Math.pow(1-a,3) + 
                     c1[1] * 3 * Math.pow(1-a,2) * a +
                     c2[1] * 3 * Math.pow(1-a,1) * a * a +
                     to[1] * Math.pow(a,3); 
            // load up this new point
            points.push([nx,ny]);
            new_path.push(point_index++);
          }

          prev = to;
          break;
        case 'Q':
          // Quadratic Bezier curve
          // uses one control point c1[x1,y1]
          // the previous point prev[x,y], and current point to[x,y]
          to = [path.commands[i].x, -1 * path.commands[i].y]; 
          c1 = [path.commands[i].x1, -1 * path.commands[i].y1];
          for (var k=1;k<=fn;k++) {
            a = k / fn; 
            nx = prev[0] * Math.pow(1-a,2) + 
                     c1[0] * 2 * Math.pow(1-a,1) * a +
                     to[0] * Math.pow(a,2); 
            ny = prev[1] * Math.pow(1-a,2) + 
                     c1[1] * 2 * Math.pow(1-a,1) * a +
                     to[1] * Math.pow(a,2); 
            // load up this new point
            points.push([nx,ny]);
            new_path.push(point_index++);
          }

          prev = to;
          break;
        case 'Z':
          // log the old path
          if (new_path.length>2) {
            paths.push(new_path);
            new_path = [];
          }
          break;
      }  // end switch commands
    }
  }
  // else console.log("no path found");
  // fix case with a Path with just an MZ
  if (points.length < 3) points = [];
  return [points,paths];

};