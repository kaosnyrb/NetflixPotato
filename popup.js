var IDArray = []
var SeriesNameArray = []
var re = /(\d+)/; 
var titlere = /^Watch+(.*)+(Online)/;

function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
	var title = tab.title;
	if ( url.indexOf("http://www.netflix.com/WiMovie/") > -1 )
	{
		callback(tab);
		var m = re.exec(url)
		var t = titlere.exec(title);
		IDArray.push(m[0]);
		SeriesNameArray.push(t[1]);
		setStorage();
		getStorage();
	}
  });
}

function getStorage() {
	chrome.storage.sync.get(['ids','names'], function(data) {
		console.log("Episode Array:", data.ids);
		if ( data.ids === undefined ||  data.names === undefined) {
			IDArray = [];
			SeriesNameArray = [];
			setStorage();
		}
		else
		{
			IDArray = data.ids;
			SeriesNameArray = data.names;
			renderStatus();
		}
	});
	
}

function setStorage(){
	chrome.storage.sync.set({ids: IDArray, names: SeriesNameArray}, function() {
		console.log("Episode List saved");
	}); 
}

function renderStatus() {
	document.getElementById('status').innerHTML = "";
	for	(index = 0; index < IDArray.length; index++) 
	{
		document.getElementById('status').innerHTML += formattedId(index)//IDArray[index] + " \n";
	}
	for	(clickindex = 0; clickindex < IDArray.length; clickindex++) 
	{
		document.getElementById("RemoveButtonIndex" + clickindex).addEventListener("click", (function(index){
				return function() { 
						var id = "RemoveButtonIndex" + index;
						console.log("RemoveClick:", id);
						IDArray.splice(index, 1);
						SeriesNameArray.splice(index, 1);
						setStorage(IDArray);		
						getStorage();
					}
				})(clickindex));
	}
}

function formattedId(index)
{
	return "<div class=\"well well-sm\">" + SeriesNameArray[index] 
	+ "<button type=\"button\" class=\"btn btn-danger btn-xs pull-right\" id=\"RemoveButtonIndex" 
	+ index 
	+ "\"><span class=\"glyphicon glyphicon-minus \" aria-hidden=\"true\"></span></button></div>";
}

//Play ID.
//http://www.netflix.com/WiPlayer?movieid=80023687

function playRandom()
{
	var item = IDArray[Math.floor(Math.random()*IDArray.length)];
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
		IDArray = [];
		SeriesNameArray = [];
		setStorage();
		getStorage();
	});
	
	document.getElementById("play").addEventListener("click", function(){
		playRandom();
	});
	getStorage();
});