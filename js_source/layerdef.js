
// ====================
// bevat de query strings voor de verschillende lagen
//
// formaat make_layer variabelen:
//
//<URL> string 'url',<color>: string '#RGB', <name>: string '[imagetype]tekst', <lijnbreedte>[.cirkelradius]: int/float, <zichtbaarheid> : boolean, [lijntpye][transparantie] :string '[aan uit (aan uit ( ...))][@transparantie]'
//
// imagetype: #l# = lijn, #dl#=dubbele lijn, #d# = stippellijn, #c#= transparant, #co# = cirkel opaque met cijfers
// aan/uit = pixellengte van de lijn, zichtbare lijn-open gedeelte
// transparantie = 0-1 transparantie van de lijn
//
//=====================
	function layerdef(type){
	
		if (type == "cycleways"){
		//	dit maakt de layers voor de cycleway tags
			map.addLayers([
			//highway=cycleway
			make_layer(QURL + "?data=(way[highway=cycleway](bbox);node(w);way[highway~'path$|^footway$'][bicycle=designated](bbox);node(w););out+skel;", "red",name="#l#highway=cycleway", 3, false,"@1.0"),
			  
			//Bromfiets/Fietpaden/Onverpl.fietspaden
            make_layer(QURL + "?data=(way[highway=cycleway][moped~'^designated$|^yes$'](bbox);node(w);way[highway=cycleway]['moped:forward'~'^designated$|^yes$'](bbox);node(w);way[highway=cycleway]['moped:backward'~'^designated$|^yes$'](bbox);node(w););out+skel;", "#7b006a",name="#l#cycleway, moped=yes", 4, false),
			  
            make_layer(QURL + "?data=(way[highway=cycleway][moped=no](bbox);node(w););out+skel;", "#00FFFF",name="#dl#cycleway moped=no", 3, false,"6 10"),
			
            make_layer(QURL + "?data=(way[highway=cycleway][mofa=no](bbox);node(w););out+skel;", "#00FFFF",name="#l#cycleway mofa=no", 3, false),
			
			// kenmerken met cycleway
			  
			make_layer(QURL + "?data=(way[cycleway=cyclestreet](bbox);node(w);way[bicycle_road=yes](bbox);node(w);way[cyclestreet=yes](bbox);node(w););out+skel;","#ff65d5",name="#l#cyclestreet", 8, false),
			
			make_layer(QURL + "?data=(way[cycleway~'track'][highway!=cycleway](bbox);node(w);way['cycleway:right'~'track'](bbox);node(w);way['cycleway:left'~'track'](bbox);node(w););out+skel;", "#ff6541",name="#l#cycleway=track", 6, false,"@0.9"),
			
			make_layer(
				QURL + "?data=" + 
				`(
					way['cycleway:right'=opposite_lane](bbox);
					node(w);

					way['cycleway:left'=opposite_lane](bbox);
					node(w);

					way['cycleway:both'=opposite_lane](bbox);
					node(w);
					way[cycleway=opposite_lane](bbox);
					node(w);


					way['cycleway:left'=lane](bbox);
					node(w);

					way['cycleway:right'=lane](bbox);
					node(w);

					way['cycleway:both'=lane](bbox);
					node(w);
					way[cycleway=lane](bbox);
					node(w);


					way['cycleway:left'=shoulder](bbox);
					node(w);

					way['cycleway:right'=shoulder](bbox);
					node(w);

					way['cycleway:both'=shoulder](bbox);
					node(w);
					way[cycleway=shoulder](bbox);
					node(w);
				);
				out+skel;`,
				"#ff6541",name="#dl#cycleway=lane", 6, false,"6 10@0.9"
			),

			make_layer(
				QURL + "?data=" +
				`(
					way[cycleway='shared_lane'](bbox);
					node(w);

					way[cycleway=share_busway](bbox);
					node(w);

					way[cycleway=opposite_share_busway](bbox);
					node(w);

					way['cycleway:left'='shared_lane'](bbox);
					node(w);

					way['cycleway:right'='shared_lane'](bbox);
					node(w);

					way['cycleway:both'='shared_lane'](bbox);
					node(w);
				);
				out+skel;`,
				"red",name="#d#cycleway=shared_lane", 2, false,"6 10"
			),
          	
		
			//kenmerken met oneway
			make_layer(QURL + "?data=(way[highway~'^unclas|^living|^resid|road|cycleway'][oneway~'yes|true|1|-1'][cycleway!~'.'][bicycle!=no]['bicycle:oneway'!=no]['oneway:bicycle'!=no](bbox);node(w);way['bicycle:oneway'~'yes|true|1|-1'](bbox);node(w);way['oneway:bicycle'~'yes|true|1|-1'](bbox);node(w););out+skel;", "blue",name="#dl#oneway street", 3, false,"6 10"),
			
			
            make_layer(QURL + "?data=(way['oneway:bicycle'=no](bbox);node(w);way[cycleway~'opposite'](bbox);node(w);way['bicycle:oneway'= no](bbox);node(w););out+skel;", "green",name="#dl#cycleway=opposite or<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsponeway:bicyle=no", 3, false,"6 10"),


			  
			make_layer(QURL + "?data=(way[bicycle~'^designated$|^yes$'][highway~'^footway$|^pedestrian$|^path$|^track$|^steps$'](bbox);node(w);way['ramp:bicycle'=yes](bbox);node(w);node[bicycle=yes][barrier!=bollard](bbox););out+skel;", "#39ff20",name="#l#bicycle=yes & footway,<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsppath, track, steps", 5, false),

			//pois
			make_a_layer(QURL + "?data=(node[shop=bicycle](bbox);node[amenity=bicycle_repair_station](bbox);way[shop=bicycle](bbox);node(w););out;", "#0000a0", name="#c#shop=bicycle/repair station", 0.7, false),
			make_layer(QURL + "?data=node[amenity~'bicycle'][amenity!=bicycle_repair_station](bbox);out+skel;(way[amenity~'bicycle'](bbox);node(w););out+skel;", "#39ffd5",name="#c#&nbspbicycle_parking/rental", 4, false),
			make_layer(QURL + "?data=node[barrier=bollard](bbox);out+skel;", "red", name="#c#&nbspbollard", 3, false),			  
			make_layer(QURL + "?data=node[barrier][barrier!=bollard](bbox);out+skel;", "#bd9541", name="#c#&nbspother barrier<hr>", 3, false),
			

			

			// non cyclable ways
			make_layer(QURL + "?data=(way[bicycle=dismount](bbox);node(w);node[bicycle=dismount](bbox);node(w););out+skel;","yellow",name="#dl#bicycle=dismount", 4, false,"6 10"),
			
			make_layer(QURL + "?data=(way[bicycle~'no|use_sidepath'](bbox);node(w);way[highway][access~'^no|^priv'][vehicle!~'yes'][bicycle!~'^no|^yes|^desig|^offic|^destin|^permis'][mtb!~'^yes|^desig|^offic|^destin|^permis']['mtb:scale'!~'^'](bbox);node(w);way[highway~'^foot|^path|^pedes|^platform|^steps|^bridleway|^prop|^constr'][access! ~'^no|^priv'][bicycle!~'^no|^yes|^desig|^offic|^destin|^permis'][mtb!~'^yes|^desig|^offic|^destin|^permis']['ramp:bicycle'!~'yes'](bbox);node(w);way[highway=track][horse=designated][access! ~'^no|^priv'][bicycle!~'^no|^yes|^desig|^offic|^destin|^permis'][mtb!~'^yes|^desig|^offic|^destin|^permis']['mtb:scale'!~'^'][route!=mtb](bbox);node(w););out+skel;", "#393020",name="<img style='vertical-align: middle;background-color:#393020;' src='img/line.gif'> 'non cycleable' ways", 7, false,"@0.5"),

            make_layer(QURL + "?data=(way[bicycle=use_sidepath](bbox);node(w););out+skel;","#bd65d5",name="#dl#bicycle=use_sidepath", 4, false,"6 10"),
			
			make_layer(QURL + "?data=(way[bicycle=no](bbox);node(w););out+skel;","black",name="#dl#bicycle=no", 4, false,"6 10")

			]);
			
		}


		if (type == "surface"){
		//	dit maakt de layers voor de surfacelaag	
			map.addLayers([
	  		//highways
            make_layer(QURL + "?data=(way[highway=cycleway](bbox);node(w);way[highway=path][bicycle=designated](bbox);node(w););out+skel;", "red",name="#l#highway=cycleway", 5, false),
			  
			make_layer(QURL + "?data=(way[highway=footway](bbox);node(w););out+skel;","#bd958b",name="#l#highway=footway", 5, false,"@0.8"),
			
			make_layer(QURL + "?data=(way[highway=path][bicycle!~'^designated'](bbox);node(w););out+skel;","#7b9541",name="#l#highway=path", 5, false,"@0.8"),
			
			make_layer(QURL + "?data=(way[highway=pedestrian](bbox);node(w););out+skel;", "#ff6500",name="#l#highway=pedestrian",5, false),
			  
			// tracks & tracktype
			make_layer(QURL + "?data=(way[highway=track](bbox);node(w););out+skel;","#bd9520",
			name="#l#highway=track", 5, false,"@0.8"),
			
            make_layer(QURL + "?data=(way[tracktype=grade1](bbox);node(w););out+skel;","#330000",name="#l#tracktype=grade1", 2, false),
			
			make_layer(QURL + "?data=(way[tracktype=grade2](bbox);node(w););out+skel;","#330000",name="#dl#tracktype=grade2", 3, false,"4 8"),
			
			make_layer(QURL + "?data=(way[tracktype=grade3](bbox);node(w););out+skel;","#A52A2A",name="#dl#tracktype=grade3", 2, false,"4 8"),
			
			make_layer(QURL + "?data=(way[tracktype=grade4](bbox);node(w););out+skel;","#A52A2A",name="#d#tracktype=grade4", 2, false,"1 6"),
			
			make_layer(QURL + "?data=(way[tracktype=grade5](bbox);node(w););out+skel;","black",name="#d#tracktype=grade5", 1, false,"1 3"),
			
			make_layer(QURL + "?data=(way[highway=track][tracktype!~'^grade'](bbox);node(w););out+skel;","white",name="#dl#tracktype unknown", 2, false,"4 8"),
			
			make_layer(QURL + "?data=(way[highway=track][cycleway](bbox);node(w););out+skel;","#ff008b",name="#dl#highway=track &<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspcycleway=*",5, false,"4 8"),

			// surface on paths & tracks
			make_layer(QURL + "?data=(way[highway~'^cycle|^foot|^path|^pedestrian|^track'][surface~'^asphalt|^pav|^concrete'](bbox);node(w););out+skel;","#000080",name="#l#surface = paved", 2, false,"@0.8"),
			 
			make_layer(QURL + "?data=(way[surface~'^cob'](bbox);node(w););out+skel;","#000080",name="#dl#surface=cobblestone", 4, false,"4 8@0.8"),
			
			make_layer(QURL + "?data=(way[surface~'^fine_gravel|.shell.'](bbox);node(w););out+skel;","#3965d5",name="#dl#surface=fine_gravel/shells", 3, false,"4 8@0.8"),
			
			// semi paved
			make_layer(QURL + "?data=(way[surface~'^gravel|^compact|^loam'](bbox);node(w););out+skel;","yellow",name="#dl#surface = semi-paved", 3, false,"4 8@0.8"),
			
			// unpaved
			make_layer(QURL + "?data=(way[surface~'^grass|^ground|^unpaved|^dirt|^earth|^sand|^woodchips|^pebble'](bbox);node(w););out+skel;","yellow",name="#d#surface = unpaved", 2, false,"1 3@0.8"),

			 // smoothness
			 make_layer(QURL + "?data=(way[smoothness=bad](bbox);node(w););out+skel;","#00FFFF", 
			 name="#dl#smoothness=bad", 3, false,"4 8"),
			 
			 make_layer(QURL + "?data=(way[smoothness~'^very_bad|^horrible|^very_horrible|^impassable'](bbox);node(w););out+skel;","#00FFFF", 
			 name="#l#smoothness very bad", 4, false)
			 
			]);
	}			
		if (type == "route"){

			map.addLayers([
			
			//highway=cycleway
			make_layer(QURL + "?data=(way[highway=cycleway](bbox);node(w);way[highway=path][bicycle=designated](bbox);node(w););out+skel;", "red",name="#l#highway=cycleway<hr>Route relations:", 3, false),

			//LF-routes
			make_layer(QURL + "?data=(relation[route=bicycle][network=ncn](bbox);way(r)(bbox);node(w););out+skel;", "blue",name="#l#NCN route <i>(LF route)</i>", 12, false,"@0.6"),

			// knooppuntenroutes
			make_a_layer(QURL + "?data=relation(bbox)[network=rcn];(way(r)(bbox);node(w););out+skel;node(bbox)[rcn_ref];out;", "#00FFFF",name="#l#RCN route <i>(knooppuntroute)</i>", 8, false),

			make_layer(QURL + "?data=(relation[route=bicycle][network=lcn](bbox);way(r)(bbox);node(w););out+skel;", "#7CFC00",name="#dl#LCN route <i>(lokale route)</i>", 5, false,"4 8"),
			
			make_layer(QURL + "?data=(relation[network=icn](bbox);way(r)(bbox);node(w););out+skel;relation[network=icn];rel(r)(bbox);(way(r)(bbox);node(w););out skel;", "yellow",name="#dl#ICN route <i>(Int.route)</i>", 3, false,"4 8"),
			
			//route=mtb
            make_layer(QURL + "?data=(relation[route=mtb](bbox);way(r)(bbox);node(w););out+skel;", "#bd008b",name="#dl#MTB route", 4, false,"4 8"),
			
			//route=hiking, horse
            make_a_layer(QURL + "?data=(relation[route~'hik|foot|walk'](bbox);way(r)(bbox);node(w););out+skel;node[rwn_ref][rcn_ref!~'.'](bbox);out;", "#390000",name="#l#hiking route", 5, false),
			
			make_a_layer(QURL + "?data=(relation[route=horse](bbox);way(r)(bbox);node(w););out+skel;node(bbox)[rhn_ref];out;", "#7b9520",name="#l#horse route", 4, false),
			
			make_layer(QURL + "?data=(way[railway~'^abandoned|^disused|^dismantled'](bbox);node(w););out+skel;", "#7b3000",name="#dl#former railway lines", 4, false,"4 8"),
			
			make_a_layer(QURL + "?data=node[tourism=information](bbox);out;", "red", name="#co#info<hr>Cyclability (indicative):", 2, false),
			
			
			
			// non cyclable ways
			make_layer(QURL + "?data=(way[bicycle~'no|use_sidepath'](bbox);node(w);way[highway][access~'^no|^priv'][vehicle!~'yes'][bicycle!~'^no|^yes|^desig|^offic|^destin|^permis'][mtb!~'^yes|^desig|^offic|^destin|^permis']['mtb:scale'!~'^'](bbox);node(w);way[highway~'^foot|^path|^pedes|^platform|^steps|^bridleway|^prop|^constr'][access! ~'^no|^priv'][bicycle!~'^no|^yes|^desig|^offic|^destin|^permis'][mtb!~'^yes|^desig|^offic|^destin|^permis']['ramp:bicycle'!~'yes'](bbox);node(w);way[highway=track][horse=designated][access! ~'^no|^priv'][bicycle!~'^no|^yes|^desig|^offic|^destin|^permis'][mtb!~'^yes|^desig|^offic|^destin|^permis']['mtb:scale'!~'^'][route!=mtb](bbox);node(w););out+skel;", "#393020",name="<img style='vertical-align: middle;background-color:#393020;' src='img/line.gif'> 'non cycleable' ways", 4, false,"@0.5"),
						
 			// cyclable ways
			make_layer(QURL + "?data=(way[highway][highway!~'^motorway|^trunk|^foot|^path|^pedes|^platform|^steps|^bridleway|^prop|^constr'][access!~'^no|^priv'][bicycle!=no][horse!=designated][tracktype!~'grade4|grade5'](bbox);node(w);way[highway][access~'^no|^priv'][bicycle~'^yes|^desig|^offic|^destin|^permis'](bbox);node(w);way[highway~'^foot|^path|^pedes|^platform|^steps|^bridleway|^prop|^constr|^trunk|^motor'][bicycle~'^yes|^desig|^offic|^destin|^permis'](bbox);node(w);way[highway~'^foot|^path|^pedes|^platform|^steps|^bridleway|^prop|^constr'][mtb~'^yes|^desig|^offic|^destin|^permis'](bbox);node(w);way[highway=steps]['ramp:bicycle'=yes](bbox);node(w);way[route=ferry][bicycle!=no](bbox);node(w););out+skel;", "#39ff00",name="<img style='vertical-align: middle;background-color:#39ff00;' src='img/line.gif'> 'cycleable' ways<hr>", 4, false,"@0.6")
			

			]);
	
			// Officiële LF routes van het Fietsplatform
			var LFRoutes = new OpenLayers.Layer.WMS("<img style='vertical-align: middle;background-color: green;' src='img/line.gif'>&nbspOfficial LF routes (routedatabank.nl)",

                                       "https://www.routedatabank.nl/geoserver/wms",
                                       {layers: "routedatabank:lf_routes",
										transparent: true,
										format: "image/gif"
										},{
										visibility: false
										});
			map.addLayer(LFRoutes);		
			
			var fietsnetwerk1 = new OpenLayers.Layer.WMS("<img style='vertical-align: middle;background-color: green;' src='img/line.gif'>&nbspOfficial cycle node network (routedatabank.nl)",
                                       "https://www.routedatabank.nl/geoserver/wms",
                                       {layers: "routedatabank:fietsnetwerken_vrij",
										transparent: true,
										format: "image/gif"
										},{
										visibility: false
										});
			map.addLayer(fietsnetwerk1);	
			
			var fietsknoop1 = new OpenLayers.Layer.WMS("<img style='vertical-align: middle;background-color: white;' src='img/tocircle.gif'>&nbspOfficial cycle nodes (routedatabank.nl)",
                                       "https://www.routedatabank.nl/geoserver/wms",
                                       {layers: "routedatabank:fietsknooppunten_vrij",
										transparent: true,
										format: "image/gif"
										},{
										visibility: false
										});
			map.addLayer(fietsknoop1);
			
			var fietsnetwerk = new OpenLayers.Layer.WMS("<img style='vertical-align: middle;background-color: #39ff00;' src='img/line.gif'>&nbspOfficial cycle node network (pdok.nl)",
                                       "http://geodata.nationaalgeoregister.nl/fietsknooppuntennetwerk/wms",
                                       {layers: "netwerken",
										transparent: true,
										format: "image/gif"
										},{
										visibility: false
										});
			map.addLayer(fietsnetwerk);	
			
			var fietsknoop = new OpenLayers.Layer.WMS("<img style='vertical-align: middle;background-color: white;' src='img/tocircle.gif'>&nbspOfficial cycle nodes (pdok.nl)",
                                       "http://geodata.nationaalgeoregister.nl/fietsknooppuntennetwerk/wms",
                                       {layers: "knooppunten",
										transparent: true,
										format: "image/gif"
										},{
										visibility: false
										});
			map.addLayer(fietsknoop);
	
	}	

	if (type == "bugs"){
		//	dit maakt de layers voor de bugslaag
			map.addLayers([
			
			make_layer(QURL + "?data=(relation[route=bicycle](bbox);way[bicycle~'no|use_sidepath'](r);node(w););out+skel;", "#39ff00",name="#l#cycle routes & bicycle=no|use_sidepath",8, true,"5 10"),
	
			make_layer(QURL + "?data=(way[highway=cycleway][bicycle=no][moped!~'^yes|^designated'](bbox);node(w););out+skel;", "#ff00d5",name="#l#cycleway/bicycle=no<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbspNote: temporarily blocked ways?",10, true),
			
			make_layer(QURL + "?data=(way[cycleway][bicycle~'no|use_sidepath'][cycleway!=no](bbox);node(w);way['cycleway:right'][bicycle=no](bbox);node(w);way['cycleway:left'][bicycle=no](bbox);node(w););out+skel;", "purple",name="#l#cycleway lane, track,<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspopposite & bicycle=no|use_sidepath",8, true,"5 10"),
			
			make_layer(QURL + "?data=(way[highway=crossing](bbox);node(w););out+skel;", "red",name="#l#highway=crossing<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp(should be a node, not a way)",8, true),
			
			make_layer(QURL + "?data=(way[highway=road](bbox);node(w);way[highway=cycleway][fixme](bbox);node(w);way[highway=cycleway][FIXME](bbox);node(w);way[cycleway][fixme](bbox);node(w);way[cycleway][FIXME](bbox);node(w););out+skel;", "green",name="#l#highway=road or cycleway<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspfixme (better tagging needed)",8, true),
			
			make_layer(QURL + "?data=(way[highway~'Pad|pad|Rad|rad|unknown'](bbox);node(w););out+skel;", "#ff6520",name="#l#highway=nonsense",8, true,"5 10@0.5"),
			
			make_layer(QURL + "?data=(relation[route=bicycle](bbox););way(r:\"\")(bbox)->.b;(way.b[oneway=yes];)->.c;(way.c[\"oneway:bicycle\"=no];way.c[cycleway=opposite];way.c[oneway=\"-1\"];way.c[oneway=\"bicycle:backward\"];way.c[oneway=\"bicycle:forward\"];way.c[cycleway=\"opposite_lane\"];)->.d;(.c;- .d;);(._;>;);out+skel;","#17202a",name="#l#oneway cycle route without b/f role",8, true,"5 10"),
			
			// overbodige tags?
			make_layer(QURL + "?data=(way[highway=cycleway][cycleway][cycleway!=shared][cycleway!=segregated](bbox);node(w););out+skel;", "#39ffd5",name="#l#highway=cycleway & cycleway=*",8, false),
      
			make_layer(QURL + "?data=(way[highway=cycleway][bicycle~'yes|designated'](bbox);node(w););out+skel;", "blue",name="#l#cycleway &<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspbicycle=yes/designated<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp(needless tagging?)", 3, false,"5 10"),
			
			make_layer(QURL + "?data=(way[name~'^Fietspad|^fietspad|^pad$|^Pad$|cycleway|^path$|^Path$'](bbox);node(w);way[highway=cycleway][name!~'.'](bbox);node(w););out+skel;", "#ffff00",name="#l#cycleway/path without<br>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspstreetname (address search)",4, false),

			]);
	}
	


}
	

function popuplinks(lonlat){

	  var thelink = "<div STYLE=\"margin:0px 0px 0px 0px;font-size: 8pt;\"><b>View area:</b><br><a href=\"http://www.openstreetmap.org?lat=" + lonlat.lat + "&lon=" + lonlat.lon + "&zoom=17\" target=\"_blank\"><img src='img/osm.gif'>OSM</a>&nbsp&nbsp"
	  thelink = thelink + "<a href=\"https://maps.google.nl/maps?ll=" + lonlat.lat + "," + lonlat.lon + "&t=h&z=17\" target=\"_blank\"><img src='img/google.gif'>Google</a>&nbsp&nbsp";
	  thelink = thelink + "<a href=\"http://www.bing.com/maps/?v=2&cp=" + lonlat.lat + "~" + lonlat.lon + "&lvl=17&dir=0&sty=h&form=LMLTCC\" target=\"_blank\"><img src='img/bing.gif'>Bing</a><p>";
	  thelink = thelink + "<a href=\"https://www.mapillary.com/app/?focus=map&pKey=bbox&lat="  + (lonlat.lat) + "&lng=" + (lonlat.lon ) + "&z=15"  + "\" target=\"_blank\"><img src='img/mapillary.png'>Mapillary</a><hr>";
	  thelink = thelink + "<a href=\"http://cycling.waymarkedtrails.org/nl/?zoom=13" +  "&lat=" + lonlat.lat + "&lon=" + lonlat.lon + "\" target=\"_blank\"><img src='img/lonvia.gif'>Waymarked trails</a><hr>";
	  var area = 0.01
	  var ctop = lonlat.lat + area;
	  var cbottom = ctop - (2 * area);
	  var cleft = lonlat.lon - area;
	  var cright = cleft + (2 * area); 
	  
	  thelink = thelink + "<b>Edit area:</b><br><a href=\"http://localhost:8111/load_and_zoom?top=" + ctop + "&bottom=" + cbottom + "&left=" + cleft + "&right=" + cright + "\" target=\"josm_frame\">JOSM (plugin needed)</a><br>";
	  thelink = thelink + "<a href=\"http://www.openstreetmap.org/edit?editor=id&lat=" + lonlat.lat + "&lon=" + lonlat.lon + "&zoom=17\" target=\"_blank\">ID editor</a>&nbsp&nbsp";
	  thelink = thelink + "<a href=\"http://www.openstreetmap.org/edit?editor=potlatch2&lat=" + lonlat.lat + "&lon=" + lonlat.lon + "&zoom=17\" target=\"_blank\">Potlatch 2</a>&nbsp&nbsp";	
	  thelink = thelink + "<a href=\"http://www.openstreetmap.org/edit?&lat=" + lonlat.lat + "&lon=" + lonlat.lon + "&zoom=17\" target=\"_blank\">Potlatch 1</a><hr>";
	  
	  thelink = thelink + "<b>Show OSM errors </b><br><a href=\"http://www.openstreetmap.org/#map=12" + "/" + lonlat.lat + "/" + lonlat.lon + "&layers=N" + "\" target=_blank> Openstreetmap Notes</a><br \>";
	  thelink = thelink + "<a href=\"http://keepright.ipax.at/report_map.php?" + "&lat=" + lonlat.lat + "&lon=" + lonlat.lon + "&zoom=14&&layers=B0T&ch=0%2C50%2C191%2C195%2C201%2C205%2C206%2C311%2C312%2C313%2C402&show_ign=1&show_tmpign=1" + "\" target=_blank> Keepright</a><hr>"; 
	  thelink = thelink + "</b></div>";
	  return thelink;
	  
	}
