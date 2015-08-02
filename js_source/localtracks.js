//------------------------------------------------------------------------------
//	$Id: localtracks.js,v 1.6 2014/08/21 15:48:34 wolf Exp wolf $
//------------------------------------------------------------------------------
//	Erklaerung:	http://www.netzwolf.info/kartografie/openlayers/
//------------------------------------------------------------------------------
//	Fragen, Wuensche, Bedenken, Anregungen?
//	<openlayers(%40)netzwolf.info>
//------------------------------------------------------------------------------
//	CHANGED CONTENT MtM
//------------------------------------------------------------------------------
OpenLayers.Control.LocalTracks=OpenLayers.Class(OpenLayers.Control,{

	//----------------------------------------------------------------------
	//	config
	//----------------------------------------------------------------------

	displayClass: 'olControlLocalTracks',

	fileSizeLimit: (1<<20),	// 1Mb

	textButtonLabel: 'Load GPX',
	textButtonTitle: 'Load local GPX-file',
	textFileSizeWarning: 'The file "${name}" is ${size} Bytes big' +
		String.fromCharCode(223) + '.\nLaden fortsetzen?',

	trackLayerGroup: 'local',

	trackStyle: {

		strokeColor: '#000000',
		strokeWidth: 6,
		strokeOpacity: 0.7,
		pointRadius: 6,
		fillColor:'#eeff00',
		fillOpacity: 0.9,
	},

	zoomToTracks: true,
	useTrackName: true,

	uploadURL: null,

	trackProjection: new OpenLayers.Projection('EPSG:4326'),

	//----------------------------------------------------------------------
	//	variables
	//----------------------------------------------------------------------

	reader: null,
	filesToLoad: [],
	nextFile: null,

	//----------------------------------------------------------------------
	//	init
	//----------------------------------------------------------------------

	initialize: function(){

		OpenLayers.Control.prototype.initialize.apply(this,arguments);

		var control = this;

		try {
			this.reader = new FileReader();
			this.reader.onload = function(evt) {

				return control.readerOnLoad.apply(control, arguments);
			};

		} catch (e) {

			//alert ("Browser doesn't support FileReader-objects.");
		}
	},

	//----------------------------------------------------------------------
	//	destroy
	//----------------------------------------------------------------------

	destroy:function() {

		this.buttonElement = null;
		this.inputElement  = null;
		this.reader        = null;

		OpenLayers.Control.prototype.destroy.apply(this,arguments);
	},

	//----------------------------------------------------------------------
	//	create html and make control visible
	//----------------------------------------------------------------------

	draw:function(px) {

		OpenLayers.Control.prototype.draw.apply(this,arguments);

		var control = this;

		this.inputElement=document.createElement('input');
		this.inputElement.type='file';
		this.inputElement.multiple=true;
		this.inputElement.accept='.gpx';
		this.inputElement.style.display='none';
		this.inputElement.onchange=function(){control.inputOnChange(this);};

		this.buttonElement=document.createElement('button');
		this.buttonElement.disabled=this.reader==null;
		this.buttonElement.title=this.textButtonTitle;
		this.buttonElement.appendChild(document.createTextNode(this.textButtonLabel));
		this.buttonElement.onclick=function(evt){
			OpenLayers.Event.stop(evt, true);
			control.inputElement.click();

		};
		this.buttonElement.onmousedown=function(evt){
			OpenLayers.Event.stop(evt, true);
		};

		OpenLayers.Element.addClass(this.div, this.reader!=null?'enabled':'disabled');
		this.div.appendChild(this.buttonElement);
		this.div.appendChild(this.inputElement);

		return this.div;
	},

	//----------------------------------------------------------------------
	//	interface to LayerChanger
	//----------------------------------------------------------------------

	setValue: function(on) {

		if (on) this.inputElement.click();
	},

	getValue: function() {

		return false;
	},

	//----------------------------------------------------------------------
	//	files selected ind file selector box:
	//	push to file list and start loading
	//----------------------------------------------------------------------

	inputOnChange: function(inputElement) {

		var files = inputElement.files;

		if (files != null) {

			for (var i=0; i<files.length; i++) {

				this.filesToLoad.push(files[i]);
			}
		}

		inputElement.value='';

		this.loadFile ();
		return false;
	},

	//----------------------------------------------------------------------
	//	get file from file list, check size and start loading
	//----------------------------------------------------------------------

	loadFile: function() {

		for (;;) {

			this.nextFile = this.filesToLoad.pop();

			if (!this.nextFile) return;

			if (!this.fileSizeLimit) break;
			if (this.nextFile.size <= this.fileSizeLimit) break;

			var msg = OpenLayers.String.format(this.textFileSizeWarning,{
				name: this.nextFile.name,
				size: this.nextFile.size});

			if (confirm(msg)) break;
		}

		this.reader.readAsText(this.nextFile);
	},

	//----------------------------------------------------------------------
	//	file loaded: call layer creater an load next file
	//----------------------------------------------------------------------

	readerOnLoad: function (event) {

		this.createLayer (this.nextFile.name, event.target.result);
		if (this.uploadURL) {
			OpenLayers.Request.POST({
				async:	true,
	                	url:	this.uploadURL + this.nextFile.name,
				data:	event.target.result
	        	});
		}
		this.loadFile ();
	},

	//----------------------------------------------------------------------
	//	create layer
	//----------------------------------------------------------------------

	createLayer: function (filename, text) {

		//--------------------------------------------------------------
		//	parse text
		//--------------------------------------------------------------

		var features = new OpenLayers.Format.GPX().read (text);
		if (!features || !features.length) return;

		//--------------------------------------------------------------
		//	name
		//--------------------------------------------------------------

		var gpxname = features[0].attributes && features[0].attributes.name;

		//--------------------------------------------------------------
		//	reproject
		//--------------------------------------------------------------

		var remote=this.trackProjection;
		var local=this.map.getProjectionObject();

		if(!local.equals(remote)) {

			for (var i=0,len=features.length;i<len;++i) {

				var geom=features[i].geometry;
				if(geom) geom.transform(remote,local);
			}
		}

		//--------------------------------------------------------------
		//	create layer and add features
		//--------------------------------------------------------------

		var name = this.useTrackName && gpxname || filename;
		var title = this.useTrackName ?
			(gpxname ? gpxname + '\n(' + filename + ')' : filename) :
			(gpxname ? filename + '\n(' + gpxname + ')' : filename);

		var style = OpenLayers.Util.extend(this.trackStyle, null);
		style.graphicTitle = title;
		style.cursor       = 'help';

		var layer = new OpenLayers.Layer.Vector (name, {

			style: style,
			layerGroup: this.trackLayerGroup,
			ephemeral: true
		});

		this.map.addLayer (layer);
		this.map.setLayerIndex (layer, 0);

		layer.addFeatures(features);

		//--------------------------------------------------------------
		//	zoom to track
		//--------------------------------------------------------------

		if (this.zoomToTracks) {

			var bounds = layer.getDataExtent();
			if (bounds) this.map.zoomToExtent(bounds);
		}
	},

	//----------------------------------------------------------------------
	//	class name
	//----------------------------------------------------------------------

	CLASS_NAME: 'OpenLayers.Control.LocalTracks'
});

//------------------------------------------------------------------------------
//	$Id: localtracks.js,v 1.6 2014/08/21 15:48:34 wolf Exp wolf $
//------------------------------------------------------------------------------
