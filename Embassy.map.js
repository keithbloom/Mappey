if (!this.Embassy)
	{
		var Embassy = {};
	}
	

		(function (){

		var emptyMap = {
		lat: 0,
		lng: 0,
		name: 'Map',
		type: 'normal',
		markers: [{
					lat: 0, 
					lng: 0, 
					text: ""
					}],
		displayName: 'Lots of map markers',
		height: 400,
		width: 700
		}; 
	
		var maps = null;
	
		var htmlForMaps = {
			normal: '<div style="height: 0; overflow: hidden; margin-left: -4000px;"><div id="name" style="width:600px; height:450px;"></div></div>',
			streetView: '<div style="display: none;"><div id="name" style="width:700px; height:450px; overflow: hidden;"></div></div>',
			li: function(type, name, displayName) {

				return '<li id="icon" class="' + type + '"><a id="' + name + '" class="' + name + '" href="#' + name + '">' + displayName +'</a></li>'
			}
		};
	
		Embassy.CreateMap = function(setup) {
			if(maps === null)
			{
				maps = new Array();
			}
			
			var meta = $("meta");
			
			var metaMap = $.extend({}, emptyMap);
			metaMap.displayName = setup === undefined ? "School Streetview" : setup.normalmap;
			
			for (var i = 0; i < meta.length; i++)
			{
				if(meta[i].name === "geo.placename")
				{
					metaMap.markers[0].text = meta[i].content.replace(/,/gi, '<br />');
				}
				
				if(meta[i].name === "geo.position")
				{
					var tmp = meta[i].content.split(';')
					metaMap.lat = tmp[0];
					metaMap.lng = tmp[1];
					metaMap.markers[0].lat = tmp[0];
					metaMap.markers[0].lng = tmp[1];
				}
			}
			
			metaMap.name = 'schoolmap';
			Embassy.AddMap(metaMap);
			
			if (!setup.streetview || !setup.streetview.display) {
				return;
			}
			var metaStreetView = $.extend({}, metaMap);
			
			metaStreetView.origin = undefined;
			metaStreetView.type = 'streetView';
			metaStreetView.name = 'schoolstreet';
			

			metaStreetView.lat = setup.streetview.lat || metaMap.lat;
			metaStreetView.lng = setup.streetview.lng || metaMap.lng;
			metaStreetView.displayName = setup === undefined ? 'School Streetview' : setup.streetname;
			
			Embassy.AddMap(metaStreetView);
			
			
		};

		
		Embassy.AddMap = function (opt) {
			
			if(opt === null)
			{
				return;
			}
			
			opt.origin = Embassy.MapOrigin(opt);
			
			var newListItem = '<li id="icon" class="' + opt.type + '"><a id="' + opt.name + '" href="#' + opt.name + '">' + opt.displayName + '</a></li>';

			$("#mapDivs").append(htmlForMaps[opt.type].replace('name', opt.name));
			$("#mapLinks").append(htmlForMaps.li(opt.type, opt.name , opt.displayName));
			
			$("a." + opt.name).fancybox({
				'hideOnContentClick': false,
				'onStart': function () { Embassy.ShowMap(opt.name); },
				'overlayShow': false,
				'padding': 5
			});
			
			opt.div = document.getElementById(opt.name);
			maps.push(opt);	
			return opt;
		}
		

		
		Embassy.ShowMap = function(name) {
						
			for(var i = 0; i < maps.length; i++) 
			{
				if (maps[i].name === name) {

					if (maps[i].map !== undefined) {
						return;
					}
										
					if (maps[i].type === 'normal') {
						maps[i].map = Embassy.NormalMap(maps[i]);
					}
				
					if (maps[i].type === 'streetView') {
						maps[i].map = Embassy.StreetView(maps[i]);
					}
				}
			}
		}

		Embassy.NormalMap = function(target){
				
			if(target.div === null)
			{
				return;
			}
			
			var googlemaps = {
				zoom: 12,
				center: target.origin,
				size: new GSize(target.width,target.height)
				};

			// Create the map				
			target.map = new GMap2(target.div, googlemaps);
            target.map.addControl(new GSmallMapControl());
            target.map.addControl(new GMapTypeControl());
            target.map.setCenter(target.origin ,14);

			if (target.markers === undefined)
			{
				return target.map;
			}
			
			for (var i = 0; i < target.markers.length; i++) {
				Embassy.AddMarker(target.map, target.markers[i]);
			}
			
			return target.map;

		};
		
		Embassy.StreetView = function(target){
			
			
			if(target.div === undefined)
			{
				return;
			}

			var panomaps = {
				latlng: target.origin,
				features: {
					userPhotos: false
				}
			};
			
			target.map = new GStreetviewPanorama(target.div, panomaps);
			
			var handleNoFlash = function (errorCode) {
				if (errorCode == 603)  {
					alert("Error: Flash doesn't appear to be supported by your browser");
					return;
				  }
			};
			
			GEvent.addListener(target.map, "error", handleNoFlash);
			return target.map;
		  };

		Embassy.MakeLatLng = function(lat, lng){
			return new GLatLng(lat, lng);
		}		  
		
		Embassy.MapOrigin = function(opt){
			if (opt.origin === undefined)
			{
				return Embassy.MakeLatLng(opt.lat, opt.lng);
			}
			return opt.origin;
		};
		
		Embassy.AddMarker = function(map, data){
		
			var position = Embassy.MakeLatLng(data.lat, data.lng);
			map.openInfoWindow(position, data.text );
			
            var marker = new GMarker(position);  
			
			GEvent.addListener(marker,"click", function() {
				map.openInfoWindow(position, data.text );
              });
            map.addOverlay(marker);
		};
		
	}());
		

