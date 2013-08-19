(function(){

	/* 
		Need to implement:

		- multi-click disable fix
		- only show icon on valid kijiji listing pages
		- omnibox "km" kijiji quick search and map load
	*/

	// Add Default Listener provided by chrome.api.*
	// This listens for the Kijiji Mapify icon click
	chrome.browserAction.onClicked.addListener(function (tab) {
		
		//Check for previous click
	    //if (!alreadyClicked) {

	    	// when button click, start process in content script
			chrome.tabs.sendMessage(tab.id, "startInitProcess", function(reponse){

				if(reponse.type == "success") {
			    	console.log("Init Process Started");
			    	alreadyClicked = false;
				}

				if(reponse.type == "fail") {
			    	console.log("Something went wrong! (probably not a listing page)");
			    	alreadyClicked = false;
				}

			});
	        
	        //alreadyClicked = true;
	        return;
//	    }

	});

})()

