(function(){

	// disables loading in iframes (only run if top level window/tab)
	if(top !== self) return false;

	// ** CONSOLE LOGGING **
	var DEBUG = true;
	function csLog(message){
		if(DEBUG) console.log("MapifyKijiji:", message);
	}

	// ** Modal + Loading Spiner **
	var spinner;

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
	}

	// ** PAGINATION **
	var currentPage;
	var nextPage;
	var nextPageUrl;
	var lastPage = false;

	// updates pagination variables, checks for current, next and set last page bool
	// only run at the beginning, similar code in processNextPage
	function initPagination(){
		currentPage = $('.paginationBottomBg .currentPage').text().trim();
		nextPage = $('.paginationBottomBg .currentPage').next().text().trim();
		nextPageUrl = $(".paginationBottomBg .prevNextLink:contains('Next')").attr('href');

		csLog("initPagination: current page:"+currentPage);
		csLog("initPagination: next page:"+nextPage);
		csLog("initPagination: next page url:"+nextPageUrl);

		if(nextPage == "" || nextPageUrl == undefined){
			lastPage = true;
			csLog("initPagination: Last Page: true");
		}else{
			lastPage = false;
			csLog("initPagination: Last Page: false");
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

					runCleanup();

					processAllowed = true;

					//csLog(listingRows);
					
					//listingRows.forEach(function(element, index, array){
						//csLog("Appending: " + element);
						//$('#SNB_Results tr:last').append(element);
					//});
				}
			});
		}
	}

	// ** LISTINGS **

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
				
				//console.log("Scrapping",index);

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

			//console.log("Geocoding",i);

			//ex: http://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&sensor=true

			var encoded_address = encodeURIComponent(listingAddresses[i]);
			var compiled_url = "http://maps.googleapis.com/maps/api/geocode/json?address=" + encoded_address + "&sensor=false"

			$.getJSON( compiled_url, {
				tagmode: "any",
				format: "json"
			})
			.done(function( data ) {

				processedAddressCount++;

				//console.log(processedAddressCount, listingAddresses.length);

				if(!data.results[0]) return;

				var tempCoord = [data.results[0].geometry.location.lat, 
								data.results[0].geometry.location.lng,
								data.results[0].formatted_address]

				listingCoords.push(tempCoord);				

				if(processedAddressCount == listingAddresses.length){
					//console.log("geocoords length",listingAddresses.length);

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

	// ** PAGE CLEANUP **
	function runCleanup(){
		// cleanup ads
		$('#topAdSense, #bottomAdSense, .GoogleActiveViewClass, .sbTopadWrapper').remove();
		$('#lmDIYads, #inlineBanner').parent().remove();

		// change paid ads background color
		$('tr[id*=resultFeat]').css('background','#ED4337');
	}

	// ** MAP **
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
			var marker = L.marker( [ element[0], element[1] ] )
							.bindPopup(element[2] + '<p><a href="'+listingLinks[index]+'">View Listing</a>')
							.addTo(map);
		});

	}

	// ** INIT **

	runCleanup();

	var processAllowed = true;
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
    //#sbResultsListing

	window.onload = function(){

		setTimeout(function (){
             initPagination();
         }, 300);

		chrome.extension.onMessage.addListener(function(message,sender,sendResponse){
			csLog("Received message:" + message);
			//csLog("Received from:" + sender);

			if(message == "iconClicked"){
				csLog("Known Message: iconClicked");

				if($('#SNB_Results').length > 0){
					csLog("Listing Table Found");
					sendResponse({type:"success"});

					// Go
					injectModal();
					buildModal();
					startPageInspection();					
					
				} else {
					csLog("Listing Table NOT Found");
					sendResponse({type:"fail"});
				}
			}else{
				csLog("Unknown Message: " + message);
				sendResponse({type:"fail"});
			}
			
		});		
	}

	csLog("(end of cs)");
})()
