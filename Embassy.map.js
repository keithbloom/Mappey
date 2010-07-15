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
					LatLng = new GLatLng(options.lat, options.lng);
				}
				return LatLng;
		};

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
			Embassy.AddMarker(normalMap);

		};
		
		Embassy.AddMarker = function(map){
			map.openInfoWindow(map.getCenter(), options.infoText );
            var marker = new GMarker(Embassy.MapOrigin());          
			GEvent.addListener(marker,"click", function() {
				map.openInfoWindow(Embassy.MapOrigin(), options.infoText );
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
		

