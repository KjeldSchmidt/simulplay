"use strict";

var startButton = document.getElementById( 'startButton' );
var pauseButton = document.getElementById( 'pauseButton' );
var urlInput = document.getElementById( 'urlInput' );
var maxResultsInput = document.getElementById( 'maxResultsInput' );
var playerArea = document.getElementById( 'playerArea' );

startButton.onclick = doTheThing;
pauseButton.onclick = pauseVideos;


/*
*	The following functions are automatically executed and handle loading of the youtube API
*/
function onClientLoad() {
	gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

function onYouTubeApiLoad() {
	gapi.client.setApiKey('AIzaSyDEC1XbDsDgy4bOthILo21Z_IQjCCIEqfc');
}



/*
*	These functions are custom.
*/

function getVideos(playlistId, maxResults) {
	// Use the JavaScript client library to create a search.list() API call.

	console.log(playlistId + "  " + maxResults);

	var request = gapi.client.youtube.playlistItems.list({
		playlistId: playlistId,
		maxResults: maxResults,
		part: 'snippet'
	});
	
	// Send the request to the API server,
	// and invoke onSearchRepsonse() with the response.
	request.execute(onSearchResponse);
}

// Called automatically with the response of the YouTube API request.
function onSearchResponse(response) {
	var videos = response.items;
	var videoCount = videos.length;

	for (var i = 0; i < videoCount; i++) {
		var video = videos[i];
		var videoId = video.snippet.resourceId.videoId;
		var frame = generateIframe( videoId );

		playerArea.innerHTML += frame;
	}
}

function doTheThing() {
	var url = urlInput.value;
	var maxResults = maxResultsInput.value;
	var playlistId = idFromUrl( url );

	getVideos(playlistId, maxResults);
}

function idFromUrl( url ) {
	return "PLaWFsJLVVTDN59DBRXzGFSVy70cy30dtt";
}

function generateIframe( id ) {
	return '<iframe class="ytplayer" type="text/html" width="640" height="390"'
		+ 'src="http://www.youtube.com/embed/' + id + '?autoplay=1&enablejsapi=1"'
		+ 'frameborder="0" />';
}

function pauseVideos() {
	var pauseArgs = '{ "event": "command", "func": "pauseVideo", "args": ""}'

	var iframes = document.getElementsByTagName( "iframe" );
	var framesCount = iframes.length;
	for (var i = 0; i < framesCount; i++) {
		var iframe = iframes[i].contentWindow;;
		iframe.postMessage( pauseArgs, '*' );
	};
}