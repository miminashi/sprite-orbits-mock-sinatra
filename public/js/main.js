var ge;
var dates;
var kicksat;
var spritesNum = 12;
var sprites;

google.load("earth", "1", {"other_params":"sensor=false"});

function updateOrbits(){
  $.getJSON("/js/orbits.json", function(data){
    console.log(data[0].sprites);
    // get Orbits //////////////////////// 
    dates = new Array();
    kicksat = new Array();
    sprites = new Array(spritesNum);
    for(var i = 0; i < sprites.length; i++){
      sprites[i] = new Array();
    }

    // parse Orbits data //////////////////////
    var latestOffset = undefined;
    for (var i = data.length - 1; i >= 0; i--){
      if(latestOffset == undefined){
        latestOffset = data[i].offset;
      }
      if(latestOffset - data[i].offset > 30 * 60){ // Its're skipped over 30min ago.
        break;
      }
      dates.push([data[i].date, data[i].offset]);
      var ks = data[i].kicksat;
      kicksat.push([ks.lat, ks.lng, ks.alt]);
      var sp = data[i].sprites;
      for(var j = 0; j < sp.length; j++){
        sprites[j].push([sp[j].lat, sp[j].lng, sp[j].alt]);
      }
    }

    // Draw Kick Sat's Orbit ///////////////////
    var lineStringPlacemark = ge.createPlacemark('');
    var lineString = ge.createLineString('');
    lineStringPlacemark.setGeometry(lineString);
    lineString.setTessellate(true);
    lineString.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);
    for(var i = 0; i < kicksat.length; i++){
      var ks = kicksat[i];
      if(i == 0){
        // set view position
        var camera = ge.getView().copyAsCamera(ge.ALTITUDE_ABSOLUTE);
        //var lookAt = ge.createLookAt('');
        camera.setLatitude(ks[0]-10.0);
        camera.setLongitude(ks[1]);
        camera.setAltitude(ks[2] + 2000000);

        camera.setTilt(camera.getTilt() + 30.0);
        camera.setRoll(camera.getRoll() - 30.0);
        ge.getView().setAbstractView(camera);

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
        icon.setHref("http://tc1078.metawerx.com.au/ks.png");
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

    // Draw Sprites //////////////
    for(var i = 0; i < sprites.length; i++) {     
      drawSprite(sprites[i]);
    }
  });
}

function drawSprite(sprite) {
  var lineStringPlacemark = ge.createPlacemark('');
  var lineString = ge.createLineString('');
  lineStringPlacemark.setGeometry(lineString);
  lineString.setTessellate(true);
  lineString.setAltitudeMode(ge.ALTITUDE_ABSOLUTE);

  // Draw line from KickSat to Sprite.
  var sp = sprite[0];
  console.log(sp);
  var ks = kicksat[0];
  //$("#sprites").append("kicksat[" + j + "]:" + ks + "<br>\n");
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

  updateOrbits();
}

function failureCB(errorCode) {
}

google.setOnLoadCallback(init);

