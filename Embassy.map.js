if (!this.Embassy)
	{
		var Embassy = {};
	}
		
	(function (){

		var normalMap = null;
		var maps = null;
		var streetMap = null;
		var options = null;
		var LatLng = null;

		Embassy.Map = function(mapOptions){
			
			if(mapOptions === null)
			{
				return;
			}
			
			if(options === null)
			{
				options = new Array();
			}
		
			options.push(mapOptions);
			
			console.log(options.length);
			
		};
		
		
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
					options[i].origin = Embassy.MapOrigin(options[i]);
					
					if (options[i].type === 'normal') {
						options[i].map = Embassy.NormalMap(options[i]);
					}
					if (options.type === 'streetView') {
						options[i].map = Embassy.StreetView(options[i]);
					}
				}
			}
		}

		Embassy.NormalMap = function(target){
			console.log(target);
			var div = document.getElementById(target.name);
			
			if(div === null)
			{
				return;
			}
			
			var googleOptions = {
				zoom: 12,
				center: target.origin,
				size: new GSize(target.width,target.height)
				};

			// Create the map				
			target.map = new GMap2(div, googleOptions);
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
		
		Embassy.StreetView = function(){
			console.log("Hello");
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
		

