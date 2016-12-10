/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// Browser distribution of the A-Frame component.
	(function () {
	  if (typeof AFRAME === 'undefined') {
	    console.error('Component attempted to register before AFRAME was available.');
	    return;
	  }

	  // Register all components here.
	  var components = {
	    example: __webpack_require__(1).component
	  };

	  Object.keys(components).forEach(function (name) {
	    if (AFRAME.aframeCore) {
	      AFRAME.aframeCore.registerComponent(name, components[name]);
	    } else {
	      AFRAME.registerComponent(name, components[name]);
	    }
	  });
	})();


/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Capture Mouse component.
	 *
	 * Control entity rotation directly with captured mouse.
	 *
	 * @namespace capture-mouse
	 * @param {bool} [enabled=true] - To completely enable or disable the controls
	 * @param {number} [sensitivity=1] - How fast the object rotates in response to mouse
	 */

	 // To avoid recalculation at every mouse movement tick
	 var PI_2 = Math.PI / 2;


	module.exports.component = {
	  dependencies: ['position','rotation'],

	  schema: {
	    enabled: { default: true },
	    sensitivity: { default: 1 },
	  },

	  /**
	   * Called once when component is attached. Generally for initial setup.
	   */
	  init: function () {
	    // The canvas where the scene is painted
	    this.sceneEl = document.querySelector('a-scene');
	    this.data.enabled = false;
	    this.sceneEl.addEventListener("loaded", function() {
	    	this.data.enabled = true;
		    this.canvasEl = this.sceneEl.canvas;
	
		    this.setupMouseControls();
		    this.setupHMDControls();
		    this.attachEventListeners();
		    this.bindFunctions();
		    this.sceneEl.addBehavior(this);
		    this.previousPosition = new THREE.Vector3();
		    this.deltaPosition = new THREE.Vector3();
	    }.bind(this));
	  },

	  setupMouseControls: function () {

	    this.pitchObject = new THREE.Object3D();
	    this.yawObject = new THREE.Object3D();
	    this.yawObject.position.y = 10;
	    this.yawObject.add(this.pitchObject);
	    this.lockIsSupported = 'pointerLockElement' in document ||
	       'mozPointerLockElement' in document ||
	       'webkitPointerLockElement' in document;
	  },

	  setupHMDControls: function () {
	    this.dolly = new THREE.Object3D();
	    this.euler = new THREE.Euler();
	    this.controls = new THREE.VRControls(this.dolly);
	    this.zeroQuaternion = new THREE.Quaternion();
	  },

	  attachEventListeners: function () {
	    if (this.lockIsSupported) {
	      document.addEventListener('pointerlockchange', this.onLockChange.bind(this), false);
	      document.addEventListener('mozpointerlockchange', this.onLockChange.bind(this), false);
	      document.addEventListener('webkitpointerlockchange', this.onLockChange.bind(this), false);

	      document.addEventListener('pointerlockerror', this.onLockError, false);
	      document.addEventListener('mozpointerlockerror', this.onLockError, false);
	      document.addEventListener('webkitpointerlockerror', this.onLockError, false);
	      this.canvasEl.onclick = this.captureMouse.bind(this);
	    }
	  },

	  bindFunctions: function () {
	    this.onMouseMoveL = this.onMouseMove.bind(this);
	  },

	  remove: function () {
	    this.releaseMouse();
	    this.sceneEl.removeBehavior(this);
	  },

	  captureMouse: function () {
	    this.sceneEl.requestPointerLock = this.sceneEl.canvas.requestPointerLock ||
	      this.sceneEl.canvas.mozRequestPointerLock ||
	      this.sceneEl.canvas.webkitRequestPointerLock;
	    // Ask the browser to lock the pointer
	    this.sceneEl.requestPointerLock();
	  },

	  releaseMouse: function () {
	    document.exitPointerLock = document.exitPointerLock ||
	      document.mozExitPointerLock ||
	      document.webkitExitPointerLock;
	    document.exitPointerLock();
	  },

	  onLockChange: function (e) {
	    var scene = this.el.sceneEl;
	    if (document.pointerLockElement === scene ||
	      document.mozPointerLockElement === scene ||
	      document.webkitPointerLockElement === scene) {
	      // Pointer was just locked
	      // Enable the mousemove listener
	      document.addEventListener('mousemove', this.onMouseMoveL, false);
	    } else {
	      // Pointer was just unlocked
	      // Disable the mousemove listener
	      console.log("pointer unlock");
	      document.removeEventListener('mousemove', this.onMouseMoveL, false);
	    }
	  },

	  onLockError: function (e) {
	    console.trace(e);
	  },
	  update: function() {
	  	
	  },
	  tick: function () {
	    if (!this.data.enabled) { return; }
	    this.controls.update();
	    this.updateOrientation();
	    this.updatePosition();
	  },

	  updateOrientation: (function () {
	    var hmdEuler = new THREE.Euler();
	    hmdEuler.order = 'YXZ';
	    return function () {
	      var pitchObject = this.pitchObject;
	      var yawObject = this.yawObject;
	      var hmdQuaternion = this.calculateHMDQuaternion();
	      hmdEuler.setFromQuaternion(hmdQuaternion);
	      this.el.setAttribute('rotation', {
	        x: THREE.Math.radToDeg(hmdEuler.x) + THREE.Math.radToDeg(pitchObject.rotation.x),
	        y: THREE.Math.radToDeg(hmdEuler.y) + THREE.Math.radToDeg(yawObject.rotation.y),
	        z: THREE.Math.radToDeg(hmdEuler.z)
	      });
	    };
	  })(),

	  calculateHMDQuaternion: (function () {
	    var hmdQuaternion = new THREE.Quaternion();
	    return function () {
	      var dolly = this.dolly;
	      if (!this.zeroed && !dolly.quaternion.equals(this.zeroQuaternion)) {
	        this.zeroOrientation();
	        this.zeroed = true;
	      }
	      hmdQuaternion.copy(this.zeroQuaternion).multiply(dolly.quaternion);
	      return hmdQuaternion;
	    };
	  })(),

	  updatePosition: (function () {
	    var position = new THREE.Vector3();
	    var quaternion = new THREE.Quaternion();
	    var scale = new THREE.Vector3();
	    return function () {
	      var el = this.el;
	      var deltaPosition = this.calculateDeltaPosition();
	      var currentPosition = el.getAttribute('position');
	      this.el.object3D.matrixWorld.decompose(position, quaternion, scale);
	      deltaPosition.applyQuaternion(quaternion);
	      el.setAttribute('position', {
	        x: currentPosition.x + deltaPosition.x,
	        y: currentPosition.y + deltaPosition.y,
	        z: currentPosition.z + deltaPosition.z
	      });
	    };
	  })(),

	  calculateDeltaPosition: function () {
	    var dolly = this.dolly;
	    var deltaPosition = this.deltaPosition;
	    var previousPosition = this.previousPosition;
	    deltaPosition.copy(dolly.position);
	    deltaPosition.sub(previousPosition);
	    previousPosition.copy(dolly.position);
	    return deltaPosition;
	  },

	  updateHMDQuaternion: (function () {
	    var hmdQuaternion = new THREE.Quaternion();
	    return function () {
	      var dolly = this.dolly;
	      this.controls.update();
	      if (!this.zeroed && !dolly.quaternion.equals(this.zeroQuaternion)) {
	        this.zeroOrientation();
	        this.zeroed = true;
	      }
	      hmdQuaternion.copy(this.zeroQuaternion).multiply(dolly.quaternion);
	      return hmdQuaternion;
	    };
	  })(),

	  zeroOrientation: function () {
	    var euler = new THREE.Euler();
	    euler.setFromQuaternion(this.dolly.quaternion.clone().inverse());
	    // Cancel out roll and pitch. We want to only reset yaw
	    euler.z = 0;
	    euler.x = 0;
	    this.zeroQuaternion.setFromEuler(euler);
	  },

	  onMouseMove: function (e) {
	    if (!this.data.enabled) {return;}
	    var movementX = e.movementX ||
	      e.mozMovementX ||
	      e.webkitMovementX ||
	      0;
	    var movementY = e.movementY ||
	      e.mozMovementY ||
	      e.webkitMovementY ||
	      0;
	    this.yawObject.rotation.y -= movementX * 0.002 * this.data.sensitivity;
	    this.pitchObject.rotation.x -= movementY * 0.002 * this.data.sensitivity;
	    this.pitchObject.rotation.x = Math.max(-PI_2, Math.min(PI_2, this.pitchObject.rotation.x));
	  }
	};


/***/ }
/******/ ]);