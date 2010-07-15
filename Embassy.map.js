if (!this.Embassy)
	{
		var Embassy = {};
	}
		
	(function (){

		var normalMap = null;
		var streetMap = null;
		var options = null;
		var LatLng = null;

		Embassy.Map = function(mapOptions){
			
			if(mapOptions === null)
			{
				return;
			}
			
			if(mapOptions.markers !== undefined)
			{
				console.log(mapOptions.markers);
			}
			
			options = mapOptions;
			
		};
		
		Embassy.MapOrigin = function(){
		
				if (LatLng === null)
				{
					LatLng = Embassy.MakeLatLng(options.lat, options.lng);
				}
				return LatLng;
		};
		
		Embassy.MakeLatLng = function(lat, lng){
			return new GLatLng(lat, lng);
		}

		Embassy.NormalMap = function(){

			if (normalMap !== null || options.normalMapDiv === null)
			{
				return;
			}
			
			var div = document.getElementById(options.normalMapDiv);
			
			if(div === null)
			{
				return;
			}
			
			var googleOptions = {
				zoom: 12,
				center: Embassy.MapOrigin(),
				size: new GSize(div.offsetHeight, div.offsetWidth)
				};

			// Create the map				
			normalMap = new GMap2(div, googleOptions);
            normalMap.addControl(new GSmallMapControl());
            normalMap.addControl(new GMapTypeControl());
            normalMap.setCenter(Embassy.MapOrigin() ,14);
			
			// Add the marker
			var markerSettings = [{
				lat: options.lat,
				lng: options.lng,
				text: options.infoText
			},
			{
				lat: options.lat - .005,
				lng: options.lng + .005,
				text: "Hello"
			}];
			
			for (var i = 0; i < markerSettings.length; i++) {
				Embassy.AddMarker(normalMap, markerSettings[i]);
			}

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
		
		Embassy.StreetView = function(){
		

			if (streetMap !== null || options.streetViewMapDiv === undefined) {
				return;
			}
						
			var panoOptions = {
				latlng: Embassy.MapOrigin(),
				features: {
					userPhotos: false
				}
			};
			
			var div = document.getElementById(options.streetViewMapDiv);
			
			if(div === null)
			{
				return;
			}
			
			streetMap = new GStreetviewPanorama(div, panoOptions);
			
			var handleNoFlash = function (errorCode) {
				if (errorCode == FLASH_UNAVAILABLE)  {
					alert("Error: Flash doesn't appear to be supported by your browser");
					return;
				  }
			};
			
			GEvent.addListener(streetMap, "error", handleNoFlash);

		  };
		}());
		

