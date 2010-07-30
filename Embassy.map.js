if (!this.Embassy)
	{
		var Embassy = {};
	}
		
	(function (){

		var options = null;

		Embassy.Map = function(mapOptions){
			
			if(mapOptions === null)
			{
				return;
			}
			
<<<<<<< HEAD
			if(options === null)
			{
				options = new Array();
			}
=======
			options = mapOptions;
			
		};
>>>>>>> d46080e6f29bb2588812efa975ea78cf883e1ec5
		
			mapOptions = Embassy.Init(mapOptions);
		
			options.push(mapOptions);
				
		};
		
		Embassy.Init = function (opt) {
			opt.origin = Embassy.MapOrigin(opt);
			
			
			var newDiv = '<div style="height: 0; overflow: hidden;"><div id="' + opt.name + '" style="width:550px; height:400px;"></div></div>'
			var newListItem = '<li id="icon" class="' + opt.type + '"><a id="' + opt.name + '" href="#' + opt.name + '">' + opt.name + '</a></li>';
			
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
		
		Embassy.MakeLatLng = function(lat, lng){
			return new GLatLng(lat, lng);
		}
		
		Embassy.ShowMap = function(name) {
						
			for(var i = 0; i < options.length; i++) 
			{
				if (options[i].name === name) {
				
					if (options[i].map !== undefined) {
						return;
					}
										
					if (options[i].type === 'normal') {
						options[i].map = Embassy.NormalMap(options[i]);
					}
				
					if (options[i].type === 'streetView') {
							options[i].map = Embassy.StreetView(options[i]);
						}
				}
			}
		}

		Embassy.NormalMap = function(target){
				
			if(target.div === null)
			{
				return;
			}
			
			var googleOptions = {
				zoom: 12,
				center: target.origin,
				size: new GSize(target.width,target.height)
				};

			// Create the map				
			target.map = new GMap2(target.div, googleOptions);
            target.map.addControl(new GSmallMapControl());
            target.map.addControl(new GMapTypeControl());
            target.map.setCenter(target.origin ,14);
			
	
			if (target.markers === undefined)
			{
				return;
			}
			
			for (var i = 0; i < target.markers.length; i++) {
				Embassy.AddMarker(target.map, target.markers[i]);
			}

		};
		
		Embassy.StreetView = function(target){
			
			if(target.div === undefined)
			{
				return;
			}

			var panoOptions = {
				latlng: target.origin,
				features: {
					userPhotos: false
				}
			};
			
			target.map = new GStreetviewPanorama(target.div, panoOptions);
			
			var handleNoFlash = function (errorCode) {
				if (errorCode == FLASH_UNAVAILABLE)  {
					alert("Error: Flash doesn't appear to be supported by your browser");
					return;
				  }
			};
			
			GEvent.addListener(target.map, "error", handleNoFlash);

		  };
		
		
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
		

