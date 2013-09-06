(function(){

	/* 
		Need to implement:

		- multi-click disable fix
		- only show icon on valid kijiji listing pages
		- omnibox "km" kijiji quick search and map load
		- notifications
		- geolocation
		-- http://leafletjs.com/examples/mobile.html
	*/

	// Add Default Listener provided by chrome.api.*
	// This listens for the Kijiji Mapify icon click
	/*
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

	// Called when page action icon in omnibar is clicked
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

	// Listen for page action icon click
	chrome.pageAction.onClicked.addListener(pageActionCallback);



/*
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	    console.info("This is the url of the tab = " + changeInfo.url);
	    // do stuff with that url here....
	});

	
	chrome.tabs.onUpdated.addListener(// Called when the url of a tab changes
	function (tabId, changeInfo, tab) {
		
		console.log(tabId);
		console.log(changeInfo);
		console.log(tab);
		console.log(changeInfo.url);

		if (tab && tab.url && tab.url.indexOf('kijiji.ca') > -1) {
			// Show page action icon in omnibar
			chrome.pageAction.show(tabId);
		}else{
			// Hide
			chrome.pageAction.hide(tabId);			
		}
	});
*/

	function checkForValidUrl(tab) {
	    //console.log("tab",tab);

		if(tab.url.indexOf('kijiji.ca') != -1){			

	    	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		    	//console.log(tabs);
		    	chrome.pageAction.show(tab.id);
			});			
	    	console.log("Mapify", "on kijiji!", tab.url);	

		}else{

		    chrome.pageAction.hide(tab.id);
	    	console.log("Mapify", "not a kijiji url", tab.url);				
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

	console.log("Mapify Kijiji Alive!");

})()
