"use strict";

var options = {
	maxResults: 9,
	defaultPlaylists: [
		{
			name: "Well known classical tunes",
			id: "PLaWFsJLVVTDN59DBRXzGFSVy70cy30dtt"
		},
	]
}

var startButton = document.getElementById( 'startButton' );
var pauseButton = document.getElementById( 'pauseButton' );
var urlInput = document.getElementById( 'urlInput' );
var playerArea = document.getElementById( 'playerArea' );



startButton.onclick = doTheThing;
pauseButton.onclick = togglePauseButton;


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

function getVideos( playlistId ) {
	var request = gapi.client.youtube.playlistItems.list({
		playlistId: playlistId,
		maxResults: options.maxResults,
		part: 'snippet'
	});
	
	request.execute(onSearchResponse);
}

// Called automatically with the response of the YouTube API request.
function onSearchResponse(response) {
	var videos = response.items;

	if ( videos == undefined ) {
		noVideosFound();
	}

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
	var playlistId = idFromUrl( url );

	playerArea.innerHTML = "";

	getVideos( playlistId );
}

function idFromUrl( url ) {
	
	var query = url.split( "?" )[1];
	if ( query == undefined ) {
		return url;
	}

	var vars = query.split( "&" );
	for ( var i=0; i<vars.length; i++ ) 
	{
		var pair = vars[ i ].split( "=" );
		if(pair[0] == "list")
		{
			return pair[1];
		}
	}
	return false;
}

function generateIframe( id ) {
	return '<iframe class="ytplayer" type="text/html" width="640" height="390"'
		+ 'src="http://www.youtube.com/embed/' + id + '?autoplay=1&enablejsapi=1"'
		+ 'frameborder="0" />';
}

function toggleVideoPlayState( instruction ) {
	var pauseArgs = '{ "event": "command", "func": "' + instruction + '", "args": ""}';

	var iframes = document.getElementsByTagName( "iframe" );
	var framesCount = iframes.length;
	for (var i = 0; i < framesCount; i++) {
		var iframe = iframes[i].contentWindow;;
		iframe.postMessage( pauseArgs, '*' );
	};
}

function togglePauseButton() {
	toggleVideoPlayState( pauseButton.dataset.state );

	if ( pauseButton.dataset.state == "pauseVideo" ) 
	{
		pauseButton.dataset.state = "playVideo";
		pauseButton.innerHTML = "Play";
	} 
	else 
	{
		pauseButton.dataset.state = "pauseVideo";
		pauseButton.innerHTML = "Pause";
	}
	
}

function noVideosFound() {
	// TODO: User-friendly implementation
	alert( "No videos could be found. Try with another URL" );
}