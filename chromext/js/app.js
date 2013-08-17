(function(){
	/*
	hj = {
		data :{
			name : 'toto',
			hash : 'hackmtl'
		}
	};
	// send (hj.data)
	*/

	//var alreadyClicked = false;

	//Add Default Listener provided by chrome.api.*
	chrome.browserAction.onClicked.addListener(function (tab) {

		//console.log(tab);
		
		//Check for previous click
	    //if (!alreadyClicked) {

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

			// external file in extension folder
			// chrome.extension.getURL("topbar.html")
	        
	        alreadyClicked = true;
	        return;
//	    }

	});

})()

