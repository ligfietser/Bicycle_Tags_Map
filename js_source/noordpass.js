	OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
		genericUrl : "", tolerance : 0.0, map : "", defaultHandlerOptions : {
			'single' : true, 'double' : false, 'pixelTolerance' : 0, 'stopSingle' : false, 'stopDouble' : false
			}
				,  initialize : function (url, tolerance, map) {
					this.genericUrl = url;
					this.tolerance = tolerance;
					this.map = map;
					this.handlerOptions = OpenLayers.Util.extend( {
					}
					, this.defaultHandlerOptions);
					OpenLayers.Control.prototype.initialize.apply(this, arguments);
					this.handler =  new OpenLayers.Handler.Click(this, {
						'click' : this.trigger
					}
					, this.handlerOptions);
				}
		, trigger : function (evt) {
			//	map.removePopup(popup);
			var lonlat = map.getLonLatFromPixel(evt.xy).transform(new OpenLayers.Projection("EPSG:900913"),  new OpenLayers.Projection("EPSG:4326"));
			var popup =  new OpenLayers.Popup("location_info",  new OpenLayers.LonLat(lonlat.lon, lonlat.lat).transform(new OpenLayers.Projection("EPSG:4326"),  new OpenLayers.Projection("EPSG:900913")), null, lonlat, true );
			popup.setBackgroundColor("#FFFFFF");
			popup.closeOnMove = false;
			popup.autoSize = true;
			popup.maxSize =  new OpenLayers.Size(250, 300);
			popup.panMapIfOutOfView = true;
			popup.opacity = 1.0;
			if (browser == "ie9") {
				var marge =  new OpenLayers.Bounds(0, 0, 0, 0);
			}
			else {
				var marge =  new OpenLayers.Bounds(0, 4, 4, 0);
			}
			popup.padding = marge;
			var link = popuplinks(lonlat);
			popup.contentHTML = link + "<br><img src='img/zuurstok.gif'>";
			map.addPopup(popup,true);
			var rel_tolerance = this.tolerance * map.getScale();
			if (rel_tolerance > 0.00008)rel_tolerance = 0.00008;

			if (map.getZoom() > 13) {
				var oRequest =  new XMLHttpRequest();
				var oURL = this.genericUrl + "&bbox=" + (lonlat.lon - rel_tolerance) + "," + (lonlat.lat - rel_tolerance) + "," + (lonlat.lon + rel_tolerance) + "," + (lonlat.lat + rel_tolerance);
				//alert(oURL);
				oRequest.open("GET", oURL, false);
				// oRequest.setRequestHeader("User-Agent", navigator.userAgent);
				oRequest.send(null);

				if (oRequest.status == 200) {
					//alert(oRequest.responseText); //check of er wat terug komt
					text = oRequest.responseText;
					// strip de html body tags
					t = text.search("<body>") + 6;
					t_end = text.search("</body>");
					text = text.slice(t, t_end);
					// strip de wegentag
					t = text.search("</h2>") + 5;
					if (t<5){ // geen wegen gevonden
					text = "<br><font color=\"red\"> <b>no ways found</b><br>";
					}
					else{
					text = text.slice(t, t_end);
					}					
					// zoek naar nummers met meer dan 5 cijfers ( de ref's )
					// functie die weg id's vervangt door een link naar osm
					function addlink(match) {
						s = "<a href=\"https://www.openstreetmap.org/browse/" + match.match(/node|way|relation/i) + "\/" + match.match(/[0-9]{2,}/) + "\" target=\"_blank\">" + match + "</a>";
						return s.toLowerCase();
					}
					var zoek = /Way [0-9]{5,}/g;
					text = text.replace(zoek, addlink);
					var zoek = /Node [0-9]{5,}/g;
					text = text.replace(zoek, addlink);
					var zoek = /Relation [0-9]{4,}/g;
					text = text.replace(zoek, addlink);
					// de id's zijn nu links
					link = link + "<span STYLE=\"font-size: 8pt;\">" + text + "</span>";
					map.removePopup(popup);
					popup.contentHTML = link;
					map.addPopup(popup);
				}
				else {
					alert("Error executing XMLHttpRequest call!");
				}
			}
			else {
				link = link + "<span STYLE=\"font-size: 8pt; color: red;\">" + "(Zoom in for tag info)" + "</span>";
				map.removePopup(popup);
				popup.contentHTML = link;
				map.addPopup(popup);
			}
		}
	}
	);
	// ----------------------------------------------------------------------------
	function setStatusText(text) {
		var html_node = document.getElementById("statusline");
		if (html_node != null) {
			//var div = html_node.firstChild;
			//div.deleteData(0, div.nodeValue.length);
			//div.appendData(text);
			html_node.innerHTML = text;
			if (text != "") {
				html_node.style.visibility = "visible";
			}
			else {
				html_node.style.visibility = "hidden";
			}
		}
	}
	var zoom_valid = true;
	var load_counter = 0;
	function make_features_added_closure() {
	return function (evt) {
		setStatusText("");
		if (zoom_valid) {
			--load_counter;
			if (load_counter <= 0)setStatusText("");
		}
	};
	}

	ZoomLimitedBBOXStrategy = OpenLayers.Class(OpenLayers.Strategy.BBOX, {
	zoom_data_limit : 13,  initialize : function (zoom_data_limit) {
		this.zoom_data_limit = zoom_data_limit;
		//alert(zoom_data_limit);
	}
	, update : function (options) {
		var mapBounds = this.getMapBounds();
		if (this.layer && this.layer.map && this.layer.map.getZoom() < this.zoom_data_limit) {
			if (this.layer.visibility == true) {
				setStatusText(" Please zoom in to view data! ");
				zoom_valid = false;
				this.bounds = null;
			}
		}
		else if (mapBounds !== null  && ((options && options.force) || this.invalidBounds(mapBounds))) {
			if (this.layer.visibility == true) {
				++load_counter;
				setStatusText("<img src='img/zuurstok.gif'>");
				zoom_valid = true;
				this.calculateBounds(mapBounds);
				this.resolution = this.layer.map.getResolution();
				this.triggerRead(options);
			}
		}
	}
	, CLASS_NAME : "ZoomLimitedBBOXStrategy"
	}
	);
	// ------------------------- originele layer -----------------------------------------------------------------------
	function make_large_layer(data_url, color, name, zoom, size, visible, dash, opacity, radius, radopacity) {
	var styleMap =  new OpenLayers.StyleMap( {
		strokeColor : color, strokeOpacity : opacity, strokeWidth : size, strokeLinecap : "square", strokeDashstyle : dash, pointRadius : radius, fillColor : "white", fillOpacity : radopacity
	}
	);
	var layer =  new OpenLayers.Layer.Vector(name, {
		strategies : [new ZoomLimitedBBOXStrategy(13)], protocol :  new OpenLayers.Protocol.HTTP( {
			url : data_url, format :  new OpenLayers.Format.OSM( {
				'checkTags' : true
			}
			)
		}
		), styleMap : styleMap, visibility : visible, projection :  new OpenLayers.Projection("EPSG:4326")
	}
	);
	layer.events.register("loadend", layer, make_features_added_closure());
	return layer;
	}
	
	function make_layer(data_url, color, name, size, visible, dash) {
	// ----- opacity catch in dash, if dash = "4 3@1.0" 1.0 is used as opacity
	if (dash != undefined) {
		dashalfa = dash.split("@");
		dash = dashalfa[0];
		if (dashalfa[1] == undefined) {
			opacity = 0.75;
		}
		else {
			opacity = parseFloat(dashalfa[1]);
		}
	}
	else {
		dash = "solid";
		opacity = 0.75;
	}
	//calculate seperate radius if given	
	var radius = (size - Math.floor(size)) * 10;
	if (radius <= 0) {
		radius = size;
		radopacity = 0.0;
	}
	else {
		radopacity = opacity;
	}
	//---- add an image if specified by  placehoder in name, placeholders are #l# > single line, #dl#>line line,#d#>dotted 
	//	alert(name);
	name = name.replace("#l#", "<img style='vertical-align: middle;background-color: " + color + ";' src='img/line.gif'>&nbsp");
	name = name.replace("#dl#", "<img style='vertical-align: middle;background-color: " + color + ";' src='img/lineline.gif'>&nbsp");
	name = name.replace("#d#", "<img style='vertical-align: middle;background-color: " + color + ";' src='img/dots.gif'>&nbsp");
	name = name.replace("#c#", "<img style='vertical-align: middle;background-color: " + color + ";' src='img/tcircle.gif'>&nbsp");
	return make_large_layer(data_url, color, name, 13, size, visible, dash, opacity, radius, radopacity);
	}
	
//--- dit blok is nieuw -----------------------------
	function make_label(feature) {
		if (feature != undefined) {
			feature.attributes.display = "";
			//knooppunten
			if (feature.attributes.name != undefined) {
			feature.attributes.display = feature.attributes.name;
			}
			if (feature.attributes.rhn_ref != undefined) {
				feature.attributes.display = feature.attributes.rhn_ref;
			}
			if (feature.attributes.rwn_ref != undefined) {
				feature.attributes.display = feature.attributes.rwn_ref;
			}
			if (feature.attributes.rcn_ref != undefined) {
				feature.attributes.display = feature.attributes.rcn_ref;
			}
			//fietswinkels cafes etc
			else if (feature.attributes.ref != undefined) {
				feature.attributes.display = feature.attributes.ref;
			}
		}
	}
	function make_a_large_layer(data_url, color, name, zoom, size, visible, dash, opacity, radius, radopacity) {
	var localstyle =  new OpenLayers.Style( {
		strokeColor : color,
		strokeOpacity : opacity,
		strokeWidth : size,
		strokeLinecap : "square",
		strokeDashstyle : dash,
		pointRadius : radius + 2,
		fillColor : color,
		fillOpacity : 1,
		fontColor : "white",
		fontSize : "10px",
		fontFamily : "Arial",
		fontWeight : "bold",
		labelOutlineColor : "black",
		labelOutlineWidth : 3,
		label : "${display}"
	})
	if (browser == "ie10") {
		var localstyle =  new OpenLayers.Style( {
			strokeColor : color,
			strokeOpacity : opacity,
			strokeWidth : size,
			strokeLinecap : "square",
			strokeDashstyle : dash,
			pointRadius : radius + 2,
			fillColor : color, fillOpacity : 1,
			fontColor : "black", fontSize : "10px",
			fontFamily : "Arial",
			fontWeight : "bold",
			labelOutlineColor : "black",
			labelOutlineWidth : 3,
			label : "${display}",
			labelYOffset :  - 5
		}
		);
	}
	if (browser == "ie9") {
		var localstyle =  new OpenLayers.Style( {
			strokeColor : color,
			strokeOpacity : opacity,
			strokeWidth : size,
			strokeLinecap : "square",
			strokeDashstyle : dash,
			pointRadius : radius + 2,
			fillColor : color,
			fillOpacity : 1,
			fontColor : "black",
			fontSize : "10px",
			fontFamily : "Arial",
			fontWeight : "bold",
			labelOutlineColor : "black",
			labelOutlineWidth : 3,
			label : "${display}",
			labelXOffset :  - 1
		}
		);
	}
	var layer =  new OpenLayers.Layer.Vector(name, {
		strategies : [new ZoomLimitedBBOXStrategy(13)], protocol :  new OpenLayers.Protocol.HTTP( {
			url : data_url, format :  new OpenLayers.Format.OSM( {
				checkTags : true
			}
			)
		}
		), 
		styleMap :  new OpenLayers.StyleMap(localstyle),
		visibility : visible,
		projection :  new OpenLayers.Projection("EPSG:4326")
	}
	);
	layer.events.register("featuresadded", layer, make_features_added_closure());
	layer.preFeatureInsert = make_label;
	//alert(layer.name);
	return layer;
	}
	
	function make_a_layer(data_url, color, name, size, visible, dash) {
	// ----- opacity catch in dash, if dash = "4 3@1.0" 1.0 is used as opacity
	if (dash != undefined) {
		dashalfa = dash.split("@");
		dash = dashalfa[0];
		if (dashalfa[1] == undefined) {
			opacity = 0.75;
		}
		else {
			opacity = parseFloat(dashalfa[1]);
		}
	}
	else {
		dash = "solid";
		opacity = 0.75;
	}
	//calculate seperate radius if given	
	var radius = (size - Math.floor(size)) * 10;
	if (radius <= 0) {
		radius = size;
		radopacity = 0.0;
	}
	else {
		radopacity = opacity;
	}
	//---- add an image if specified by  placehoder in name, placeholders are #l# > single line, #dl#>line line,#d#>dotted 
	//	alert(name);
	name = name.replace("#l#", "<img style='vertical-align: middle;background-color: " + color + ";' src='img/line.gif'>&nbsp");
	name = name.replace("#dl#", "<img style='vertical-align: middle;background-color: " + color + ";' src='img/lineline.gif'>&nbsp");
	name = name.replace("#d#", "<img style='vertical-align: middle;background-color: " + color + ";' src='img/dots.gif'>&nbsp");
	name = name.replace("#c#", "<img style='vertical-align: middle;background-color: " + color + ";' src='img/tcircle.gif'>&nbsp");
	name = name.replace("#co#", "<img style='vertical-align: middle;background-color: " + color + ";' src='img/tocircle.gif'>&nbsp");
	return make_a_large_layer(data_url, color, name, 13, size, visible, dash, opacity, radius, radopacity);
	}
	
// ------------ eind van het nieuwe blok

// ----------------------------- switchtab code-- 
function switchtab(newtab, activetab) { // was switchlayers(newlayer,active)

// this destroys all layers that are not baselayers 
// and construct a list of visable layers in the current view

tabtype[activetab] = "";

for (i = map.layers.length - 1; i > 1; i--) { // store visibility and than destroy layer
    if (map.layers[i].isBaseLayer == false) {
        if (map.layers[i].visibility == true){
            tabtype[activetab] = "1" + tabtype[activetab];  // tabtype[activetab] > "00101100001" where last character is last layer
        }
        else{
            tabtype[activetab] = "0" + tabtype[activetab];
        }
        map.layers[i].destroy();
    }
}

//set the new layer, retrieve mapvis if it exists and apply

layerdef(newtab);

if (tabtype[newtab] !== undefined){
    offset = map.layers.length - tabtype[newtab].length;
    for (i = offset ;  i < map.layers.length; i++) {
        if ( tabtype[newtab].charAt(i-offset) == "1"){
            map.layers[i].setVisibility(true);
        }
        else{
            map.layers[i].setVisibility(false);
        }
    }
}

//update layout and global vars and permalink
document.getElementById(activetab).className = "dorment";
document.getElementById(newtab).className = "choice";
tabtype.name =  newtab;
plink.base = "?" + "map=" +  newtab;
plink.updateLink();

// done!
}


	// update zoomindicatie
	function showZoom(zoom) {
	document.getElementById("zoom").innerHTML = map.Getzoom();
	}
	function showPosition(position){

			lat = position.coords.latitude;
			lon = position.coords.longitude;
			map.setCenter(new OpenLayers.LonLat(lon,lat).transform(map.displayProjection,map.projection), 16);
		};
			
	function getPos(){

		if (navigator.geolocation) {
			//var geo_options = {enableHighAccuracy: false, timeout: 5000, maximumAge: 0};
			var my_geo_options = {enableHighAccuracy: true};
			navigator.geolocation.getCurrentPosition(showPosition,noPos,my_geo_options);
			//navigator.geolocation.getCurrentPosition(showPosition, null, geo_options);
			};
		};
			
	function noPos(ercode) {
		alert("Unable to get location");
		//map.setCenter(new window.OpenLayers.LonLat(lon,lat).transform(map.displayProjection,map.projection), zoom);
		};