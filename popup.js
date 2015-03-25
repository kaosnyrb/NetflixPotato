var TestArray = []
var re = /(\d+)/; 

function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
	if ( url.indexOf("http://www.netflix.com/WiMovie/") > -1 )
	{
		callback(tab);
		var m = re.exec(url)
		TestArray.push(m[0]);
		getStorage();
		setStorage(TestArray);
		getStorage();
	}
  });
}

function getStorage() {
	chrome.storage.sync.get(['secretMessage'], function(data) {
		console.log("The secret message:", data.secretMessage);
		if ( data.secretMessage === undefined) {
			TestArray = [];
			setStorage(TestArray);
			getStorage();
		}
		TestArray = data.secretMessage;
		renderStatus();
	});
}

function setStorage(value){
	chrome.storage.sync.set({secretMessage: value}, function() {
		console.log("Secret message saved");
	}); 
}

function renderStatus(statusText) {
	document.getElementById('status').textContent = "";
	for	(index = 0; index < TestArray.length; index++) 
	{
		document.getElementById('status').textContent += TestArray[index] + " \n";
	}
}

//Play ID.
//http://www.netflix.com/WiPlayer?movieid=80023687

function playRandom()
{
	var item = TestArray[Math.floor(Math.random()*TestArray.length)];
	var id = item;
	chrome.tabs.create({"url":"http://www.netflix.com/WiPlayer?movieid=" + id,"selected":true}, function(tab){
        makeRequest(tab.id);
    });
}

function makeRequest(tabId) {
    chrome.tabs.sendRequest(tabId, {greeting: "hello"}, function(response) {
        console.log(response.farewell); 
    });
}

document.addEventListener('DOMContentLoaded', function() {
	//Add current.
	document.getElementById("button").addEventListener("click", function(){
		 getCurrentTabUrl(function(tab) {
	  });
	});
	
	document.getElementById("clearbutton").addEventListener("click", function(){
		TestArray = [];
		setStorage(TestArray);
		getStorage();
	});
	
	document.getElementById("play").addEventListener("click", function(){
		playRandom();
	});
	getStorage();
});