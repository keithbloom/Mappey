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
		displayName: 'Lots of map markers',
		height: 700,
		width: 400
		}; 
	
		var maps = null;

		Embassy.CreateMap = function(setup) {
			
			if(maps === null)
			{
				maps = new Array();
			}
			
			var meta = $("meta");
			
			var metaMap = $.extend({}, emptyMap);
			
			for (var i = 0; i < meta.length; i++)
			{
				if(meta[i].name === "geo.placename")
				{
					metaMap.displayName = setup === undefined ? normalmeta[i].content : setup.normalmap;
				}
				
				if(meta[i].name === "geo.position")
				{
					
					var tmp = meta[i].content.split(';')
					metaMap.lat = tmp[0];
					metaMap.lng = tmp[1];
				}
			}
			
			metaMap.name = 'schoolmap';
			Embassy.AddMap(metaMap);
			
			if (!setup.streetview) {
				return;
			}
			var metaStreetView = $.extend({}, metaMap);
			
			metaStreetView.type = 'streetView';
			metaStreetView.name = 'schoolstreet';
			metaStreetView.displayName = 'Meta Street';
			
			
			Embassy.AddMap(metaStreetView);
			
			
		};

		
		Embassy.AddMap = function (opt) {
		
			if(opt === null)
			{
				return;
			}
			maps.push(opt);	
			opt.origin = Embassy.MapOrigin(opt);
			
			var newDiv = '<div style="height: 0; overflow: hidden;"><div id="' + opt.name + '" style="width:550px; height:400px;"></div></div>'
			var newListItem = '<li id="icon" class="' + opt.type + '"><a id="' + opt.name + '" href="#' + opt.name + '">' + opt.displayName + '</a></li>';
			
			$("#mapDivs").append(newDiv);
			$("#mapLinks").append(newListItem);
			
			$("a#" + opt.name).fancybox({
				'hideOnContentClick': false,
				'onStart': function () { Embassy.ShowMap(opt.name); },
				'overlayShow': false,
				'padding': 5
			});
			
			opt.div = document.getElementById(opt.name);
			
			return opt;
		}
		

		
		Embassy.ShowMap = function(name) {
						
			for(var i = 0; i < maps.length; i++) 
			{
				if (maps[i].name === name) {
					console.log(maps[i].map);
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
				if (errorCode == FLASH_UNAVAILABLE)  {
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
		

