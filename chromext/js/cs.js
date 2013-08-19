(function(){

	// only run if top level window/tab
	if(top !== self) return false;

	/*
		$('head').append("<script type='text/javascript' src='https://maps.google.com/maps/api/js?sensor=true'>");
		console.log(chrome.extension.getURL("js/gmaps.js"));
		$('head').append("<script type='text/javascript' src='"+chrome.extension.getURL("js/gmaps.js")+"'>");
	*/

	function injectModal(){
		$('body').prepend('<div id="mapify-popup"><div id="map-canvas" style="width:400px;height:400px;"></div></div>');
	}

	var spinner;

	function buildModal(){
		$("#mapify-popup").easyModal({
			top: 100,
			autoOpen: true,
			overlayOpacity: 0.3,
			overlayColor: "#333",
			overlayClose: false,
			closeOnEscape: false
		});

		spinner = new Spinner().spin();
		$("#mapify-popup").append(spinner.el);
		$("#mapify-popup").trigger('openModal');
		//spinner.stop();
		//$("#mapify-popup").trigger('closeModal');	
	}


	var listingLinks = [];
	var listingAddresses = [];
	var listingCoords = [];

	function startPageInspection(){

		$('a.adLinkSB').each(function(){
			listingLinks.push($(this).attr('href'));
		});
		//console.log(listingLinks);

		// start processing
		processLinks();
	}

	function processLinks(){

		var listLength = listingLinks.length;
		var processedLinksCount = 0;
		listingLinks.forEach(function(element, index, array){

			var $tempHtml = $('<div>');

			$tempHtml.load(element + ' #attributeTable', function(response, status, xhr) {
				
				console.log("Scraping",index);

				if (status == "error") {
					var msg = "Sorry but there was an error: ";
					console.log(msg + xhr.status + " " + xhr.statusText);
				}else{

					// listing page loaded

					// grab the map anchor elements parent (tr)
					var alterHtml = $('a.viewmap-link', this).parent();
					// remove the anchor
					$("a", alterHtml).remove();

					// we now have just the address, save in array
					listingAddresses.push(alterHtml.text());
					//console.log(alterHtml.text());
				}

				processedLinksCount++;

				//console.log(index);
				if(processedLinksCount == listLength){
					processAddresses();
				}

			});
		});
	}

	function processAddresses(){
		//console.log(listingAddresses);

		var processedAddressCount = 0;
		for(var i=0; i<listingAddresses.length; i++){

			console.log("Geocoding",i);

			//ex: http://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&sensor=true

			var encoded_address = encodeURIComponent(listingAddresses[i]);
			var compiled_url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + encoded_address + "&sensor=false"

			$.getJSON( compiled_url, {
				tagmode: "any",
				format: "json"
			})
			.done(function( data ) {

				processedAddressCount++;

				console.log(processedAddressCount, listingAddresses.length);

				if(!data.results[0]) return;

				var tempCoord = [data.results[0].geometry.location.lat, 
								data.results[0].geometry.location.lng,
								data.results[0].formatted_address]

				listingCoords.push(tempCoord);

				

				if(processedAddressCount == listingAddresses.length){
					console.log("geocoords length",listingAddresses.length);

					//google.maps.event.trigger(map, "resize");

					initialize_map();
					spinner.stop();
				}

				//console.log(tempCoord);

				//console.log(data.results[0].formatted_address);
				//console.log("lat:",data.results[0].geometry.location.lat);
				//console.log("lng:",data.results[0].geometry.location.lng);

				/*
				$.each(result, function(key, value){
				    $.each(value, function(key, value){
						console.log(key, value);
				    });
				});*/

			});

		}
		
	}

	var kijiji_search_table_id = $('#SNB_Results');
	//var kijiji_attribute_table_id = $('#attributeTable');

	window.onload = function(){
		chrome.extension.onMessage.addListener(function(message,sender,sendResponse){

			//alert("test")
			//console.log(message, sender, sendResponse);
			//console.log(message);

			

				if(message == "startInitProcess"){
					console.log("startInitProcess");

					if(kijiji_search_table_id.length > 0){

						sendResponse({type:"success"});

						

						injectModal();
						buildModal();
						startPageInspection();

						
						
					} else {
						sendResponse({type:"fail"});
					}
				}

/*
			var map_script = document.createElement('script');
			map_script.onload = function() {
			};
			map_script.src = "http://maps.google.com/maps/api/js?key=AIzaSyBagrZT1y6s1h7djEO5MU_bdkm-6p3OnyY&sensor=true&callback=initialize_map";
			document.getElementsByTagName('head')[0].appendChild(map_script);
			*/
		});		
	}


		var marker;
		var map;

	

	function initialize_map() {

		L.Icon.Default.imagePath = chrome.extension.getURL("images");

		var map = L.map('map-canvas').setView( [ listingCoords[5][0], listingCoords[5][1] ], 10);



		L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
			maxZoom: 12,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
		}).addTo(map);

		listingCoords.forEach(function(element, index, array){
			var marker = L.marker( 
				[ element[0], element[1] ])
			.bindPopup(element[2] + '<p><a href="'+listingLinks[index]+'">View</a>')
			.addTo(map);
		});

	}

/*
		L.marker([51.5, -0.09]).addTo(map)
			.bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

		L.circle([51.508, -0.11], 500, {
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.5
		}).addTo(map).bindPopup("I am a circle.");

		L.polygon([
			[51.509, -0.08],
			[51.503, -0.06],
			[51.51, -0.047]
		]).addTo(map).bindPopup("I am a polygon.");


		var popup = L.popup();

		function onMapClick(e) {
			popup
				.setLatLng(e.latlng)
				.setContent("You clicked the map at " + e.latlng.toString())
				.openOn(map);
		}
*/
/*
		var stockholm = new google.maps.LatLng(59.32522, 18.07002);
		var parliament = new google.maps.LatLng(59.327383, 18.06747);

		var mapOptions = {
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: stockholm
		};

		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		marker = new google.maps.Marker({
			map:map,
			draggable:true,
			animation: google.maps.Animation.DROP,
			position: parliament
		});
		google.maps.event.addListener(marker, 'click', toggleBounce);
	}
*/



})()




