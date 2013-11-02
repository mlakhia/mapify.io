(function(){

	/* 
		TODO:

		- multi-click disable fix
		- infinity-scroll
		- in-page map
		-- w/ geolocation
		--- http://leafletjs.com/examples/mobile.html
	*/

	// **OMNIBOX SEARCH** 
	chrome.omnibox.setDefaultSuggestion({"description" : "Search Kijiji for: %s"});

	// This event is fired on all changes to the text in the omnibox in keyword (mk) mode
	chrome.omnibox.onInputChanged.addListener(
		function(text, suggest) {
			//console.log('inputChanged: ' + text);

			// KIJIJI SUGGESTIONS URL
			//http://ac.classistatic.com/ac/201306010004/2/en_CA//t/h/e/20.js?callback=jsonp

			/* // Only 5 will show at a time
			suggest([
			  {content: text + " 1", description: "1"},
			  {content: text + " 2", description: "2"},
			  {content: text + " 3", description: "3"},
			  {content: text + " 4", description: "4"},
			  {content: text + " 5", description: "5"}
			]);*/
	  });

	chrome.omnibox.onInputEntered.addListener(
		function(text) {
			//var kijiji_search_url = "http://kijiji.ca/f-SearchAdRedirect?isSearchForm=true&Keyword="+text+"&CatId=0";
			var kijiji_search_url = "http://kijiji.ca/f-"+text+"-Classifieds-W0QQKeywordZ"+text+"QQisSearchFormZtrue";
			navigate(encodeURI(kijiji_search_url));
	});

	function navigate(url) {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.update(tabs[0].id, {url: url});
		});
	}

	/* // **BROWSER ACTION** (inactive)
	// Listens for the Kijiji Mapify icon click - browser
	chrome.browserAction.onClicked.addListener(browserActionCallback);
	function browserActionCallback(tab) {
    	// when button click, start process in content script
		chrome.tabs.sendMessage(tab.id, "startInitProcess", function(reponse){
			if(reponse.type == "success") {
		    	console.log("Init Process Started");
			}
			if(reponse.type == "fail") {
		    	console.log("Something went wrong! (probably not a listing page)");
			}
		});        
        return;
	}
	*/

	// **PAGE ACTION** (active)
	// Listens for the Kijiji Mapify icon click - page (in omnibar)
	chrome.pageAction.onClicked.addListener(pageActionCallback);
	function pageActionCallback(tab) {
    	// when button click, start process in content script
		chrome.tabs.sendMessage(tab.id, "startInitProcess", function(reponse){
			if(reponse.type == "success") {
		    	console.log("Init Process Started");
			}
			if(reponse.type == "fail") {
		    	console.log("Something went wrong! (probably not a listing page)");
			}
		});        
        return;
	}

	/* chrome.pageAction.setIcon
	 * 
	 * FIXME: Icon gets distorted even when using the higher res icon38
	 * 			Using pageAction.show with default icon as it's better looking
	 */
	function validListingPage(tab){
    	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
	    	//console.log(tabs);
	    	chrome.pageAction.show(tab.id);
		});
		/*
    	chrome.pageAction.setIcon({tabId: tab.id, path: "images/icon38.png"}, function(){
			chrome.pageAction.show(tab.id);
		});*/
    	console.log("MapifyKijiji: VALID Kijiji LISTING URL:", tab.url);
	}

	function checkForValidUrl(tab) {
	    //console.log("tab",tab);
	    //console.log("tab.url",tab.url);

	    var listing1 = /kijiji.ca\/f-/,
	    	listing2 = /kijiji.ca\/p\//;

	    if(listing1.test(tab.url)){
	    	// LISTING PAGE: /f-
	    	validListingPage(tab);
	    	console.log("MapifyKijiji: VALID Kijiji LISTING URL (/f-):", tab.url);

	    }else if(listing2.test(tab.url)){
	    	// LISTING PAGE: /p/
	    	validListingPage(tab);
	    	console.log("MapifyKijiji: VALID Kijiji LISTING URL (/p/):", tab.url);

		}else if(tab.url.indexOf('kijiji.ca') != -1){
			// ANY KIJIJI PAGE
			chrome.pageAction.setIcon({tabId: tab.id, path: "images/icon38_grey.png"}, function(){
				chrome.pageAction.show(tab.id);
			});
	    	console.log("MapifyKijiji: VALID ANY Kijiji URL:", tab.url);

		}else{
			// NOT A KIJIJI PAGE
		    chrome.pageAction.hide(tab.id);
	    	console.log("MapifyKijiji: INVALID URL:", tab.url);				
		}
	}

	// Listen for changes to the URL of any tab
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
		//console.log("changeInfo.status:",changeInfo.status);
		//console.log(tab);
	    if(changeInfo.status == "loading") {
		    checkForValidUrl(tab);
	    }
	});

	chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo){
	    chrome.tabs.getSelected(null, function(tab){
	        checkForValidUrl(tab);
	    });
	});

	console.log("Mapify Kijiji is Alive!");
})()
