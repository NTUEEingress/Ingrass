if (!Detector.webgl) Detector.addGetWebGLMessage();
//environment setting
var container;

var camera, controls, scene, renderer;
//mouse setting
var raycaster;

var mouse_click = new THREE.Vector2(),
INTERSECTED_M,
INTERSECTED_C;
var mouse_move = new THREE.Vector2();
//portal setting
var num = 10;
var nodeList = [];
var x = [ 0 , 88 , 344 , -489 , -77 , 433 , -226 , 11 , 331 , -293 ],
y = [ 0 , 184 , -152 , 115 , 278 , 375 , -73 , -259 , -452 , -234 ],
z = 75;
var portalColor = [];
var radius = 40,
sections = 180;
var ball_basic_color = 0xffffff;
//uid setting { 0 , 1 }
var uid = 0 ;
/*
//buffs setting
var activated = [];
*/
var counter = [];
//helicopter setting
var helicopter = [],
velocity = [],
destination = [],
move_or_not = [false, false];
var initialposition = [];
var closeToPortal = [false, false],
portalId = [];
var helicopter_radius = 35;
var hori_sections = 20;
var vert_sections = 20;
var helicopter_color = [0xff0000, 0x00ff00];
var time_init = [];
var Time;
//scores setting
var tower = [0, 0];
var score = [0, 0];
var timeOrigin = [];
var controlled = [];
var controlSpeedUp = [];
var ableToControl = [];

var gameStartTime;
//buff variables
var PortalEffect = []; //-1: random, 0: speed buff, 1: score buff, 2: 100 points, 3: speed up control
var buffStartTime = [];
var buffDuration = [];
var buffResetTime = [];
var buffExist = [];
var buffActivated = [];
var isRandom = [];
// BL building
var bl = new THREE.Object3D();

//for score
var SCORES = 0;
var tower = [0, 0];
var score = [0, 0];
var scoreStartTime;
var scoreRatio = [1, 1];
// outline
var circleSegment = new Array(5);
var pieces = 60;

// animate count
var animate_count = 0 ;

// windows size
var wWidth = 0.45 ;
var wHeight = 0.8 ;

start();
init();
animate();

//when player uid=0 enter the website
function start() {
}

function init() {
	// camera
	camera = new THREE.PerspectiveCamera(60, (window.innerWidth * wWidth) / (window.innerHeight * wHeight), 1, 20000);
	camera.position.set(0, - 900, 900);
	camera.rotation.set(1500, 0, 0);
	//console.log(camera);

	//score
	scoreStartTime = Date.now();
	gameStartTime = Date.now();

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0xcccccc, 0);

	//Circles
	var geometry_circle = new THREE.CircleGeometry(radius, sections);

	colorCountTime = Date.now();

	//put circles into the screen
	for (var i = 0; i < num; i++) {
		var mesh_circle = new THREE.Mesh(geometry_circle, new THREE.MeshBasicMaterial({
			color: ball_basic_color,
			side: THREE.DoubleSide
		}));
		//x[i] = Math.cos(2 * Math.PI * i / num) * 200;
		//y[i] = Math.sin(2 * Math.PI * i / num) * 200;
		mesh_circle.position.x = x[i];
		mesh_circle.position.y = y[i];
		mesh_circle.position.z = 0;
		//console.log(mesh_circle.position);
		controlled[i] = 100;
		portalColor[i] = 0;
		scene.add(mesh_circle);
		nodeList.push(mesh_circle);
	}

	//SetPortalEffect();
	raycaster = new THREE.Raycaster();

	// helicopter
	for (var i = 0; i < 1; i++) {
		/*var geometry_helicopter = new THREE.SphereGeometry( helicopter_radius , hori_sections , vert_sections ) ;
		  var material_helicopter ;
		  if ( i == 1 ) material_helicopter = new THREE.MeshLambertMaterial( { color: helicopter_color[1] } ) ;
		  else material_helicopter = new THREE.MeshLambertMaterial( { color: helicopter_color[0] } ) ;
		  var sss = new THREE.Mesh( geometry_helicopter , material_helicopter ) ;*/
		velocity[i] = 150;

		helicopter[i] = new THREE.Object3D();
		//helicopter[i].add(sss);
		helicopter[i].position.x = x[0];
		helicopter[i].position.y = y[0];
		helicopter[i].position.z = z ;

		scene.add(helicopter[i]);
	}
	var loader = new THREE.ColladaLoader();
	loader.load('/ar-drone-2.dae', function(result) {
		result.scene.scale.divideScalar(2);
		//console.log("=DDD");
		helicopter.forEach(function(h) {
			var s = result.scene.clone();
			h.add(s);
			console.log("=))))");
		});
		render();
	});

	destination[0] = new THREE.Vector2(x[0], y[0]);
	initialposition[0] = new THREE.Vector2(x[0], y[0]);
	for (var i = 0; i < 1; i++) {
		destination[i].x = x[0];
		destination[i].y = y[0];
		initialposition[i].x = x[0];
		initialposition[i].y = y[0];
	}
	//Timer(outline) init
	for (var i = 0; i < num; i++) {
		circleSegment[i] = new Array(pieces);
		for (var j = 0; j < pieces; j++) {
			var outline_geometry = new THREE.RingGeometry(40, 50, 3, 3, j * 2 * Math.PI / pieces, 2 * Math.PI / pieces);
			var outline_material = new THREE.MeshBasicMaterial({
				color: 0xffff00,
				side: THREE.DoubleSide
			});
			circleSegment[i][j] = new THREE.Mesh(outline_geometry, outline_material);
			circleSegment[i][j].position.x = x[i];
			circleSegment[i][j].position.y = y[i];
			circleSegment[i][j].position.z = 0;
			circleSegment[i][j].material.visible = false;

			scene.add(circleSegment[i][j]);
		}
	}
	/*
	//Buffs
	for(var i=0;i<num;i++){
	buffActivated[i] = false;
	counter[i] = 0;
	}
	*/
	//SetPortalEffect();

	// lights
	light = new THREE.AmbientLight(0xaaaaaa);
	scene.add(light);
	//Grid Plane
	var size = 600,
	step = 50;
	var geometry_plane = new THREE.Geometry();
	var material_plane = new THREE.LineBasicMaterial({
		color: 'white'
	});

	for (var i = - size; i <= size; i += step) {
		geometry_plane.vertices.push(new THREE.Vector3( - size, i, - 1));
		geometry_plane.vertices.push(new THREE.Vector3(size, i, - 1));

		geometry_plane.vertices.push(new THREE.Vector3(i, - size, - 1));
		geometry_plane.vertices.push(new THREE.Vector3(i, size, - 1));
	}
	var line = new THREE.Line(geometry_plane, material_plane, THREE.LinePieces);
	scene.add(line);

	//BL building
	/*
	loader = new THREE.ColladaLoader();
	loader.load('/blmodel.dae', function(result) {
		result.scene.scale.divideScalar(0.01);
		bl = result.scene;
		scene.add(bl);
		bl.position.set( - 1500, 0, 0);
		render();
	}

	);
	*/
	// renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(scene.fog.color);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth * wWidth, window.innerHeight * wHeight);

	renderer.domElement.setAttribute("id", "main-canvas");
	container = document.getElementById('canvas-wrapper');
	container.appendChild(renderer.domElement);

	var renderDOM = document.getElementById('main-canvas');
	renderDOM.addEventListener('mousedown', onDocumentMouseDown, false);

	controls = new THREE.TrackballControls(camera, renderDOM);

	controls.rotateSpeed = 1.2;
	controls.zoomSpeed = 1.0;
	controls.panSpeed = 0.8;

	controls.noZoom = false;
	controls.noPan = false;

	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;

	controls.keys = [65, 83, 68];

	controls.addEventListener('change', render);

	window.addEventListener('resize', onWindowResize, false);

	render();

	console.log("initialized");

}
function reinit() {
	//BuffDetector(Date.now() + 200000);
	//BuffResetDetector(Date.now() + 200000);
	//SetPortalEffect();
	scoreStartTime = Date.now();
	gameStartTime = Date.now();
	camera.position.set(0, - 900, 900);
	for (var i = 0; i < 1; i++) {
		helicopter[i].position.x = x[0];
		helicopter[i].position.y = y[0];
		destination[i].x = x[0];
		destination[i].y = y[0];
		velocity[i] = 150;

	}
	score = [0, 0];
	colorCountTime = Date.now();
	for (var i = 0; i < num; i++) {
		portalColor[i] = 0;
		controlled[i] = 100;
	}
}

function onWindowResize() {
	camera.aspect = (window.innerWidth * wWidth) / (window.innerHeight * wHeight);
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth * wWidth, window.innerHeight * wHeight);

	controls.handleResize();

	render();
}
//Origin
function onDocumentMouseDown(event) {
	event.preventDefault();

	var button = event.button;
	console.log("Click.");
	// console.log(velocity[0],velocity[1]);
	var wDOM = document.getElementById( 'main-canvas' ) ;
	mouse_click.x = ((event.clientX - wDOM.offsetLeft ) / (wDOM.offsetWidth) * 2 - 1);
	mouse_click.y = ( - 1 * (event.clientY - wDOM.offsetTop) / (wDOM.offsetHeight) * 2 + 1);
	//console.log(event.clientX);
	//console.log(event.clientY);
	//console.log(mouse_click.x);
	//console.log(mouse_click.y);

	//move helicopter
	raycaster.setFromCamera(mouse_click, camera);
	var intersect_click = raycaster.intersectObjects(nodeList);

	if (intersect_click.length > 0) {
		var timeInit = Math.floor( Date.now() ) ;
		for (var i = 0; i < num; i++) {
			if (x[i] == intersect_click[0].object.position.x && y[i] == intersect_click[0].object.position.y) {
				var mouseclick = new CustomEvent('mouseclick', {
					'detail': timeInit * 100 + uid * 10 + i
				});
				console.log(mouseclick);
				window.dispatchEvent(mouseclick);
				break;
			}
		}
	}
	console.log(destination[uid].x, destination[uid].y);
}

function receiveMouseEvent(uid, portalid, timeInit) {
	//helicopter move or not
	console.log(portalid);
	initialposition[uid].x = helicopter[uid].position.x;
	initialposition[uid].y = helicopter[uid].position.y;
	destination[uid].x = scene.children[portalid].position.x;
	destination[uid].y = scene.children[portalid].position.y;
	time_init[ uid ] = timeInit ;
	move_or_not[uid] = true;
}

function animate() {
	animate_count = ( animate_count + 1 ) % 3 ;
	if ( animate_count == 0 ) {
		changeColor();
		updatescore();
		//BuffDetector(Date.now());
		//BuffResetDetector(Date.now());
		//AutoGetBuff();
		controls.update();
		move_helicopter();
	}
	requestAnimationFrame(animate);
}
function changeColor() {
	var TimeNow = Date.now();
	var delta = (TimeNow - colorCountTime) * 3 / 50;
	colorCountTime = TimeNow;
	for (var i = 0; i < num; i++) {
		var nearPortal = [false];
		for (var j = 0; j < 1; j++) {
			if (Math.hypot(helicopter[j].position.x - x[i], helicopter[j].position.y - y[i]) < radius) nearPortal[j] = true;
		}
		if (nearPortal[0] == true ) portalColor[i] += delta;
		else if (nearPortal[0] == false ) {
			if (controlled[i] == 0) portalColor[i] += delta;
			else if (controlled[i] == 1) portalColor[i] -= delta;
			else if (controlled[i] == 100) {
				if(Math.abs(portalColor[i]) < delta)	portalColor[i] = 0;
				else{
					if (portalColor[i] > 0) portalColor[i] -= delta;
					else if (portalColor[i] < 0) portalColor[i] += delta;
				}
			}
		}
		var tmpColor = Math.round(portalColor[i]);
		if (tmpColor == 0) controlled[i] = 100;
		else if (tmpColor >= 300) tmpColor = 300, portalColor[i] = 300, controlled[i] = 0;
		else if (tmpColor <= - 300) tmpColor = - 300, portalColor[i] = - 300, controlled[i] = 1;

		if (tmpColor == 0) {
			scene.children[i].material.color.setHex(0xffffff);
		} else if (tmpColor > 0) {
			scene.children[i].material.color.setHex(0xffffff - 0x000101 * Math.floor(tmpColor / 300 * 255));
		} else if (tmpColor < 0) {
			scene.children[i].material.color.setHex(0xffffff - 0x010001 * Math.floor( - tmpColor / 300 * 255));
		}
		setCircle(i, Math.round(tmpColor / 300 * pieces));
	}
}
function setCircle(i, numOfSegment) {
	if (numOfSegment > pieces) numOfSegment = pieces;
	else if (numOfSegment < - pieces) numOfSegment = - pieces;
	for (var j = 0; j < Math.abs(numOfSegment); j++) {
		if (numOfSegment > 0) {
			circleSegment[i][j].material.visible = true;
			circleSegment[i][j].material.color.setHex(0xff00ff);
		} else if (numOfSegment < 0) {
			circleSegment[i][pieces - j - 1].material.visible = true;
			circleSegment[i][pieces - j - 1].material.color.setHex(0xffff00);
		}
	}
	for (var j = Math.abs(numOfSegment); j < pieces; j++) {
		if (numOfSegment > 0) {
			circleSegment[i][j].material.visible = false;
		} else if (numOfSegment <= 0) {
			circleSegment[i][pieces - j - 1].material.visible = false;
		}
	}
}
function move_helicopter() {
	//move helicopter
	Time = Date.now();
	var distance_init_dest = [];
	var distance_init_heli = [];
	for (var i = 0; i < 1; i++) {
		distance_init_dest[i] = Math.hypot(destination[i].x - initialposition[i].x, destination[i].y - initialposition[i].y);
		distance_init_heli[i] = Math.hypot(helicopter[i].position.x - initialposition[i].x, helicopter[i].position.y - initialposition[i].y);
		if (distance_init_dest[i] <= distance_init_heli[i]) {
			helicopter[i].position.x = destination[i].x;
			helicopter[i].position.y = destination[i].y;
			move_or_not[i] = false;
		} else if (move_or_not[i] == true) {
			helicopter[i].position.x = initialposition[i].x + velocity[i] * (destination[i].x - initialposition[i].x) / distance_init_dest[i] * (Time - time_init[i]) / 1000;
			helicopter[i].position.y = initialposition[i].y + velocity[i] * (destination[i].y - initialposition[i].y) / distance_init_dest[i] * (Time - time_init[i]) / 1000;
		}
	}
	renderer.render(scene, camera);
	//console.log(destination[uid].x,destination[uid].y);
	//console.log(helicopter[uid].position.x,helicopter[uid].position.y);
}
function render() {
	renderer.render(scene, camera);
}

function updatetower() {

}
//update gametime
function updatescore() {
	var timeNow = Date.now();
	for (var i = 0; i < num; i++) {
		if (controlled[i] == 0) score[0] += scoreRatio[0] * (timeNow - scoreStartTime) / 1000;
		else if (controlled[i] == 1) score[1] += scoreRatio[1] * (timeNow - scoreStartTime) / 1000;
	}
	scoreStartTime = timeNow;
	document.getElementById("score1").innerHTML = Math.floor(score[0]);
	document.getElementById("score2").innerHTML = Math.floor(score[1]);
	var gameTimeMin = ((Date.now() - gameStartTime) / 1000) / 60;
	var gameTimeSec = ((Date.now() - gameStartTime) / 1000) % 60;
	var TIME ;
	if ( Math.floor( gameTimeMin ) == 0 ) TIME = "" ;
	else TIME = Math.floor(gameTimeMin) + "′" ;
	TIME += ( "0"+Math.floor( gameTimeSec ) ).slice(-2) + "″" ;
	document.getElementById("gametime").innerHTML = TIME ;
}

