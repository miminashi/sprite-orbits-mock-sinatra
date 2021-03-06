// settings
var updateInterval = 100;
var spritesNum = 12;

var ge;
var dates = [];
var kicksatPositions;
var Kicksat;
var Sprites = [];
var camera;
var index;
var datas;

//google.load("earth", "1", {"other_params":"sensor=false"});



function updateOrbits(){
  $.getJSON("/js/orbits.json", function(data){
    console.log("data counts: " + data.length);
    // get Orbits //////////////////////// 
    //dates = new Array();
    //kicksatPositions = new Array();
    //sprites = new Array(spritesNum);
    //for(var i = 0; i < sprites.length; i++){
    //  sprites[i] = new Array();
    //}

    datas = data;

    initCamera();
    Kicksat = initKicksat();
    for(var i = 0; i < data[0].sprites.length; i++) {
      Sprites.push(initSprite());
    }

    //kicksatPosition = data[0].kicksat;
    //Kicksat.updatePosition(kicksatPosition.lat, kicksatPosition.lng, kicksatPosition.alt);

    index = 0;
    timeoutHandler();

    // Draw Kick Sat's Orbit
    //console.log(kicksatPositions);
    //drawKicksat();

    // Draw Sprites
    //for(var i = 0; i < sprites.length; i++) {     
    //  drawSprite(sprites[i]);
    //}
  });
}

function timeoutHandler() {
  if(index < datas.length) {
    var data = datas[index];

    // update KickSat position
    kicksatPosition = data.kicksat;
    Kicksat.updatePosition(kicksatPosition.lat, kicksatPosition.lng, kicksatPosition.alt);

    for(var i = 0; i < data.sprites.length; i++) {
      spritePosition = data.sprites[i];
      Sprites[i].updatePosition(spritePosition.lat, spritePosition.lng, spritePosition.alt);
      //console.log(spritePosition);
    }
    //spritePosition = data.sprites[0];
    //Sprites[0].updatePosition(spritePosition.lat, spritePosition.lng, spritePosition.alt);

    // update offset time
    var time = data.offset;
    $('p#time').text("After Sprites launched: " + time + "sec");
    
    index = index + 1;
    setTimeout(timeoutHandler, updateInterval);
  }
}

function updateKicksatOrbit(kicksat, newLocation) {

}

function draw(prev, current) {
  
}

function drawLine(location1, location2) {

}



function initCamera() {
  camera = ge.getView().copyAsCamera(ge.ALTITUDE_ABSOLUTE);
  camera.setTilt(camera.getTilt() + 30.0);
  camera.setRoll(camera.getRoll() - 30.0);
}

function setCameraPosition(lat, lng, alt) {
  camera.setLatitude(lat - 10.0);
  camera.setLongitude(lng);
  camera.setAltitude(alt + 2000000);
  //camera.setAltitude(alt + 4000000);
  ge.getView().setAbstractView(camera);
}

//function updateCameraPosition(lat, lng, alt) {
//  camera.setLatitude(lat - 10.0);
//  camera.setLongitude(lng);
//  camera.setAltitude(alt + 2000000);
//  ge.getView().setAbstractView(camera);
//}

//function setCameraPositionByKicksatPosition(kicksatPosition) {
//  //camera.setLatitude(kicksatPosition[0] - 10.0);
//  //camera.setLongitude(kicksatPosition[1]);
//  //camera.setAltitude(kicksatPosition[2] + 2000000);
//  camera.setLatitude(kicksatPosition.lat - 10.0);
//  camera.setLongitude(kicksatPosition.lng);
//  camera.setAltitude(kicksatPosition.alt + 2000000);
//  camera.setTilt(camera.getTilt() + 30.0);
//  camera.setRoll(camera.getRoll() - 30.0);
//  ge.getView().setAbstractView(camera);
//}

function initKicksat() {
  var _kicksat = {
    placemark: null,
    locations: [],
    lineString: null,
    orbit: null
  };

  _kicksat.updatePosition = function(lat, lng, alt) {
    var point = ge.createPoint('');
    point.setLatitude(lat);
    point.setLongitude(lng);
    point.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);
    point.setAltitude(alt);
    this.placemark.setGeometry(point);
    this.updateOrbit(lat, lng, alt);
    setCameraPosition(lat, lng, alt);
  };

  _kicksat.updateOrbit = function(lat, lng, alt) {
    this.lineString.getCoordinates().pushLatLngAlt(lat, lng, alt);
  };

  // KickSat icon
  var placemark = ge.createPlacemark('');
  placemark.setName("Kick Sat");
  var icon = ge.createIcon('');
  icon.setHref("http://sprite-orbits-mock-sinatra.herokuapp.com/img/ks.png");
  //icon.setHref("/img/ks.png");
  var style = ge.createStyle('');
  style.getIconStyle().setIcon(icon);
  style.getIconStyle().setScale(2.0);
  placemark.setStyleSelector(style);
  ge.getFeatures().appendChild(placemark);
  _kicksat.placemark = placemark;

  // orbit
  var lineStringPlacemark = ge.createPlacemark('');
  var lineString = ge.createLineString('');
  lineStringPlacemark.setGeometry(lineString);
  lineString.setTessellate(true);
  lineString.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);
  ge.getFeatures().appendChild(lineStringPlacemark);

  lineStringPlacemark.setStyleSelector(ge.createStyle(''));
  var lineStyle = lineStringPlacemark.getStyleSelector().getLineStyle();
  lineStyle.setWidth(5);
  lineStyle.getColor().set('990000ff');  // aabbggrr format

  _kicksat.orbit = lineStringPlacemark;
  _kicksat.lineString = lineString;
  
  return _kicksat;
}

function initSprite() {
  _sprite = {};
  _sprite.updatePosition = function(lat, lng, alt) {
    this.updateIcon(lat, lng, alt);
    this.updateOrbit(lat, lng, alt);
  };
  _sprite.updateIcon = function(lat, lng, alt) {
    var point = ge.createPoint('');
    point.setLatitude(lat);
    point.setLongitude(lng);
    point.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);
    point.setAltitude(alt);
    this.iconPlacemark.setGeometry(point);
  }
  _sprite.updateOrbit = function(lat, lng, alt) {
    this.lineString.getCoordinates().pushLatLngAlt(lat, lng, alt);
  };

  // Sprite icon
  var iconPlacemark = ge.createPlacemark('');
  //placemark.setName("Kick Sat");
  var icon = ge.createIcon('');
  icon.setHref("http://sprite-orbits-mock-sinatra.herokuapp.com/img/sp.png");
  //icon.setHref("/img/ks.png");
  var style = ge.createStyle('');
  style.getIconStyle().setIcon(icon);
  style.getIconStyle().setScale(1.0);
  iconPlacemark.setStyleSelector(style);
  ge.getFeatures().appendChild(iconPlacemark);
  _sprite.iconPlacemark = iconPlacemark;

  // Sprite orbit
  var lineStringPlacemark = ge.createPlacemark('');
  var lineString = ge.createLineString('');
  lineStringPlacemark.setGeometry(lineString);
  lineString.setTessellate(true);
  lineString.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);
  ge.getFeatures().appendChild(lineStringPlacemark);
  _sprite.orbitPlacemark = lineStringPlacemark;
  _sprite.lineString = lineString;

  return _sprite;
}



function drawKicksat2(kicksatPosition) {
  var point = ge.createPoint('');
  point.setLatitude(kicksatPosition.lat);
  point.setLongitude(kicksatPosition.lng);
  point.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);
  point.setAltitude(kicksatPosition.alt);
  Kicksat.placemark.setGeometry(point);
  setCameraPositionByKicksatPosition(kicksatPosition);
}

function drawKicksat() {
  // Draw Kick Sat's Orbit ///////////////////
  var lineStringPlacemark = ge.createPlacemark('');
  var lineString = ge.createLineString('');
  lineStringPlacemark.setGeometry(lineString);
  lineString.setTessellate(true);
  lineString.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);
  for(var i = 0; i < kicksatPositions.length; i++){
    var ks = kicksatPositions[i];
    if(i == 0){
      // set view position
      //var camera = ge.getView().copyAsCamera(ge.ALTITUDE_ABSOLUTE);
      //camera = ge.getView().copyAsCamera(ge.ALTITUDE_ABSOLUTE);
      //initCamera();
      setCameraPositionByKicksatPosition(camera, ks);

      /*
         var lookAt = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
         lookAt.setLatitude(ks[0]);
         lookAt.setLongitude(ks[1]);
         lookAt.setRange(lookAt.getRange() * 0.2);
         ge.getView().setAbstractView(lookAt);
         */

      // Draw Pin
      var placemark = ge.createPlacemark('');
      placemark.setName("Kick Sat\nPos:" + ks);
      var icon = ge.createIcon('');
      icon.setHref("http://localhost:9292/img/ks.png");
      //icon.setHref("/img/ks.png");
      var style = ge.createStyle('');
      style.getIconStyle().setIcon(icon);
      style.getIconStyle().setScale(2.0);
      placemark.setStyleSelector(style);

      var point = ge.createPoint('');
      point.setLatitude(ks[0]);
      point.setLongitude(ks[1]);
      point.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);
      point.setAltitude(ks[2]);
      placemark.setGeometry(point);
      ge.getFeatures().appendChild(placemark);
    }
    // Draw Line
    lineString.getCoordinates().pushLatLngAlt(ks[0], ks[1], ks[2]);
  }
  lineStringPlacemark.setStyleSelector(ge.createStyle(''));
  var lineStyle = lineStringPlacemark.getStyleSelector().getLineStyle();
  lineStyle.setWidth(5);
  lineStyle.getColor().set('990000ff');  // aabbggrr format
  ge.getFeatures().appendChild(lineStringPlacemark);
  // Draw Kick Sat's Orbit End ///////////////////
}

function drawSprite(sprite) {
  var lineStringPlacemark = ge.createPlacemark('');
  var lineString = ge.createLineString('');
  lineStringPlacemark.setGeometry(lineString);
  lineString.setTessellate(true);
  lineString.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);

  // Draw line from KickSat to Sprite.
  var sp = sprite[0];
  //console.log(sp);
  var ks = kicksatPositions[0];
  //$("#sprites").append("kicksatPositions[" + j + "]:" + ks + "<br>\n");
  //$("#sprites").append("sprites[" + i + "][" + j + "]:" + sp + "<br>\n");
  lineString.getCoordinates().pushLatLngAlt(ks[0], ks[1], ks[2]);
  lineString.getCoordinates().pushLatLngAlt(sp[0], sp[1], sp[2]);

  lineStringPlacemark.setStyleSelector(ge.createStyle(''));
  var lineStyle = lineStringPlacemark.getStyleSelector().getLineStyle();
  lineStyle.setWidth(3);
  lineStyle.getColor().set('9900ffff');  // aabbggrr format
  ge.getFeatures().appendChild(lineStringPlacemark);

  // Draw Pin
  var placemark = ge.createPlacemark('');
  //placemark.setName("Sprites[" + i + "]");
  placemark.setName("Sprite");
  var icon = ge.createIcon('');
  icon.setHref("http://tc1078.metawerx.com.au/sp.png");
  var style = ge.createStyle('');
  style.getIconStyle().setIcon(icon);
  style.getIconStyle().setScale(1.0);
  placemark.setStyleSelector(style);

  var point = ge.createPoint('');
  point.setLatitude(sp[0]);
  point.setLongitude(sp[1]);
  point.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);
  point.setAltitude(sp[2]);
  placemark.setGeometry(point);
  ge.getFeatures().appendChild(placemark);
}

function init() {
  google.earth.createInstance('map3d', initCB, failureCB);
}

function initCB(instance) {
  ge = instance;
  ge.getWindow().setVisibility(true);
  //ge.getNavigationControl().setVisibility(ge.VISIBILITY_SHOW);
  ge.getOptions().setFlyToSpeed(ge.SPEED_TELEPORT);

  updateOrbits();
}

function failureCB(errorCode) {
}

google.load("earth", "1", {"other_params":"sensor=false"});
google.setOnLoadCallback(init);

