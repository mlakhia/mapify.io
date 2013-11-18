(function(){

	/* 
		** CONTENT SCRIPT **
	*/

	// disables loading in iframes (only run if top level window/tab)
	if(top !== self) return false;

	// ** CONSOLE LOGGING **
	var DEBUG = true;
	function csLog(message){
		if(DEBUG) console.log("MapifyKijiji:", message);
	}

	// ** Modal + Loading Spiner **
	/*var spinner;

	function injectModal(){
		$('body').prepend('<div id="mapify-popup"><div id="map-canvas" style="width:400px;height:400px;"></div></div>');
	}

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
	}*/

	// ** PAGINATION **
	var currentPage;
	var nextPage;
	var nextPageUrl;
	var lastPage = false;

	// updates pagination variables, checks for current, next and set last page bool
	// only run at the beginning, similar code in processNextPage
	function updatePagination(){
		csLog("updatePagination");

		currentPage = $('.paginationBottomBg .currentPage').text().trim();
		nextPage = $('.paginationBottomBg .currentPage').next().text().trim();
		nextPageUrl = $(".paginationBottomBg .prevNextLink:contains('Next')").attr('href');

		csLog("updatePagination: current page:"+currentPage);
		csLog("updatePagination: next page:"+nextPage);
		csLog("updatePagination: next page url:"+nextPageUrl);

		if(nextPage == "" || nextPageUrl == undefined){
			lastPage = true;
			csLog("updatePagination: Last Page: true");
		}else{
			lastPage = false;
			csLog("updatePagination: Last Page: false");
		}
	}

	// @Deprecated
	// Grabs the link after current and verifies text links
	/*function getNextPageUrl(){
		var nextLink = $('.paginationBottomBg .currentPage').next().find('a');
		if(nextLink.hasClass('prevNextLink')){
			alert("Last Page");
		}
		return $('.paginationBottomBg .currentPage').next().attr('href');
	}*/

	// ** NEXT PAGE PROCESSING **
	function processNextPage(){
		csLog("processNextPage");

		if(nextPageUrl != "" && nextPageUrl != undefined){
		var $tempHtml = $('<div>');
			$tempHtml.load(nextPageUrl, function(response, status, xhr) {
				csLog("Pagination: Processing: " + nextPageUrl);

				if (status == "error") {
					var msg = "Pagination: Processing: Sorry but there was an error: ";
					console.log(msg + xhr.status + " " + xhr.statusText);
				}else{
					csLog("Pagination: Processing: LOADED");

					// visible line break
					//$('#SNB_Results tr:last').after('<tr><td><div style="height:5px;width:100%;background:red;"><hr/></div></td></tr>');
					/*
					// update pagination stuff
					currentPage = $('.paginationBottomBg .currentPage', this).text().trim();
					nextPage = $('.paginationBottomBg .currentPage', this).next().text().trim();
					nextPageUrl = $(".paginationBottomBg .prevNextLink:contains('Next')", this).attr('href');

					csLog("processNextPage: current page:"+currentPage);
					csLog("processNextPage: next page:"+nextPage);
					csLog("processNextPage: next page url:"+nextPageUrl);

					if(nextPage == "" || nextPageUrl == undefined){
						lastPage = true;
						csLog("processNextPage: Last Page: true");
					}else{
						lastPage = false;
						csLog("processNextPage: Last Page: false");
					}
					*/

					//moveMap();
					$('#map-canvas-row').appendTo("#SNB_Results tbody:last");

					csLog("==== About to Process Page " + currentPage + " ====");

					var listingRows = [];

					$('tr.resultsTableSB', this).each(function(index) {
						csLog("Found " +  index + ": " + $(this).find('.adLinkSB').text());

						//var rowHtml = $(this)[0]];
						//$(this).parent().html()
						//csLog("Appending: ");
						//console.log($(this)[0]);

						$('#SNB_Results tbody:last')[0].appendChild($(this)[0]);

						//listingRows.push($(this)[0]);
					});

					csLog("==== Finished Processing Page " + currentPage + " ====");

					// Update Pagination..
					$('.paginationBottomBg').replaceWith($('.paginationBottomBg', this));
					updatePagination();

					runCleanup();

					// unlock auto-load
					setTimeout(function (){
						processAllowed = true;
					}, 300);
				}
			});
		}
	}

	// ** LISTINGS **
	// Finds all the listing links on the page and triggers processing of those links processLinks()
	function startPageInspection(){
		csLog("startPageInspection");

		var listingLinks = [];
		$('a.adLinkSB').each(function(){
			listingLinks.push($(this).attr('href'));
		});
		csLog("=== startPageInspection : listingLinks : ===");
		csLog(listingLinks);

		// start processing
		processLinks(listingLinks);
	}

	/* 
	 * Takes an array of links, visits each and builds listingDetails 
	 *  when all links have been visited, make call to processAddresses()
	 */
	var listingDetails = [];
	var scrappingLoop = 0;
	var listLength = 0;
	function processLinks(links){
		csLog("processLinks");

		listingDetails = [];

		console.log("**Links**");
		console.log(links);

		links.forEach(function(element, index, array){
		//for(scrappingLoop = 0; scrappingLoop < listLength; scrappingLoop++){

			console.log("Scrapping1: ",index);

			var $tempHtml = $('<div>');
			$tempHtml.load(element + ' #attributeTable', function(response, status, xhr) {

				console.log("Scrapping2: ",index);
				console.log("Scrapping2: ",element);

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

				console.log("Scrapping2: ",alterHtml.text().trim());

					listingDetails.push([element, alterHtml.text().trim()]);
					//console.log(alterHtml.text());

					verifyAndRunProcessAddresses(links);
				}
			});
		});
	}

	function verifyAndRunProcessAddresses(links){
		if(listingDetails.length == links.length){
			processAddresses(listingDetails);
		}
	}

	function processAddresses(listingLinksAddresses){
		csLog("processAddresses");
		console.log(listingLinksAddresses);
		
		var listingCoords = [];
		var processedAddressCount = 0;
		for(var i=0; i<listingLinksAddresses.length; i++){

			

			console.log("Geocoding",i);

			//ex: http://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&sensor=true

			//csLog("listingLinksAddresses"+listingLinksAddresses);
			//csLog("listingLinksAddresses[1][i]"+listingLinksAddresses[1][i]);

			var encoded_address = encodeURIComponent(listingLinksAddresses[i][1]);
			var compiled_url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + encoded_address + "&sensor=false"
			console.log(compiled_url);

			$.getJSON( compiled_url, {
				tagmode: "any",
				format: "json"
			})
			.done(function( data ) {

				console.log(processedAddressCount, listingLinksAddresses.length);

				if(!data.results[0]) return;

				console.log(data.results[0]);

				var tempCoord = [data.results[0].geometry.location.lat, 
								data.results[0].geometry.location.lng,
								data.results[0].formatted_address]

				listingCoords.push(tempCoord);
				console.log(tempCoord);

				csLog("processedAddressCount:"+processedAddressCount);
				csLog("listingLinksAddresses.length:"+listingLinksAddresses.length);
				

				//console.log(data.results[0].formatted_address);
				//console.log("lat:",data.results[0].geometry.location.lat);
				//console.log("lng:",data.results[0].geometry.location.lng);

				/*
				$.each(result, function(key, value){
				    $.each(value, function(key, value){
						console.log(key, value);
				    });
				});*/
			})
			.error(function() {

			})
			.complete(function() { 

				processedAddressCount++;

				if(processedAddressCount == listingLinksAddresses.length){
					console.log("geocoords length",listingLinksAddresses.length);
					updateMap(listingCoords);
				}
			});
		}


	}

	// ** PAGE CLEANUP **
	function runCleanup(){
		csLog("runCleanup");
		// cleanup ads
		$('#topAdSense, #bottomAdSense, .GoogleActiveViewClass, .sbTopadWrapper').remove();
		$('#lmDIYads, #inlineBanner').parent().remove();

		// change paid ads background color
		$('tr[id*=resultFeat]').css('background','#ED4337');
	}

	// ** MAP **
	var marker;
	var map;
	var lat = 45.5000;
	var lng = -73.5667;

	function injectMap(){
		csLog("injectMap");
		$('tr.resultsTableSB:first').before('<tr id="map-canvas-row"><td colspan="100%"><div id="map-canvas" style="width:'+$('#SNB_Results').width()+'px;height:400px;"></div></td></tr>');
	}

	function initializeMap() {
		csLog("initializeMap");
		L.Icon.Default.imagePath = chrome.extension.getURL("images");

		if(map){
			map.remove();
		}

		csLog("lat:"+lat);
		csLog("lng:"+lng);
		map = L.map('map-canvas').setView([lat, lng], 10);

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			center: [lat, lng],
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
		}).addTo(map);
	}

	function updateMap(listOfMarkers){
		csLog("updateMap");
		console.log("listOfMarkers.length:"+listOfMarkers.length);
		console.log(listOfMarkers);
		for(var i = 0; i < listOfMarkers.length; i++){
			console.log("listOfMarkers:"+i);
			console.log(listOfMarkers[i]);
			var marker = L.marker( [ listOfMarkers[i][0], listOfMarkers[i][1] ] )
							.bindPopup(listOfMarkers[i][2] + '<p><a href="'+listOfMarkers[i][2]+'">View Listing</a>')
							.addTo(map);
		}
	}

	// ** INIT **
	var processAllowed = true;
	function initInfiniteScroll(){
		csLog("initInfiniteScroll");

	    $(window).scroll(function(){
	        var wintop = $(window).scrollTop(), 
	        	docheight = $(document).height(), 
	        	winheight = $(window).height();
	        var  scrolltrigger = 0.95;

	        if  ((wintop/(docheight-winheight)) > scrolltrigger && 
	        		processAllowed == true) {
	        	
	        	if(lastPage == false){
	        		processAllowed = false;
					processNextPage();
				}
	        	csLog("scrolling active");
	        }
	    });
	}

    function updateGeolocation(){
		csLog("updateGeolocation");

	    // Get Geolocation
		if (navigator.geolocation) {
			csLog('Geolocation is supported!');
			navigator.geolocation.getCurrentPosition(
				// success
				function(position) {
					lat = position.coords.latitude;
					lng = position.coords.longitude;

					if(map){
						map.panTo([lat, lng], {
							animate: true, // If true, panning will always be animated if possible. If false, it will not animate panning.
							duration: 0.25, // Duration of animated panning.
							easeLinearity: 0.25, // The curvature factor of panning animation easing (third parameter of the Cubic Bezier curve). 1.0 means linear animation, the less the more bowed the curve.
							noMoveStart: false // If true, panning won't fire movestart event on start (used internally for panning inertia).
						});
					}

					csLog("position.coords:"+position.coords);
					csLog("position.coords.latitude:"+position.coords.latitude);
					csLog("position.coords.longitude:"+position.coords.longitude);
					csLog("position.coords.accuracy(meters):"+position.coords.accuracy); // in meters
				},
				// error
				function(positionError) {
					console.log(positionError);
					csLog("Geolocation: Error occurred. Error code: " + positionError.code);
					// error.code can be:
					//   0: unknown error
					//   1: permission denied
					//   2: position unavailable (error response from locaton provider)
					//   3: timed out
				}
			);
		}else{
			csLog('Geolocation is not supported for this Browser/OS version yet.');
		}
    }

	runCleanup();
	updateGeolocation();
    injectMap();
    initializeMap();
	

	/*
	if($('#SNB_Results').length > 0){
		csLog("Listing Table Found");
	} else {
		csLog("Listing Table NOT Found");
	}
	*/

	window.onload = function(){
		setTimeout(function (){
			updatePagination();
			initInfiniteScroll();
			startPageInspection();
		}, 300);
	}

	/* 
	 * Communicate with the Background Script
	 *
	 */
	chrome.extension.onMessage.addListener(function(message,sender,sendResponse){
		csLog("Received message:" + message);
		//csLog("Received from:" + sender);

		if(message == "iconClicked"){
			csLog("Known Message: iconClicked");
			
			updateGeolocation();

		}else{
			csLog("Unknown Message: " + message);
			sendResponse({type:"fail"});
		}
	});

	csLog("(end of cs)");
})()
