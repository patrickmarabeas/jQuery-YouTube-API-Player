jQuery-YouTube-API-Plugin
=========================

jQuery plugin to insert a YouTube player on the page

- YouTube API to load videos
- Returns video data for display
- Adds hash to URL for direct linking of videos
- Builds select dropdown of videos in array and sanatises
- controls to be added shortly


	<div id="videoContainer">

		<div class="video">
		
			<img id="aspect" alt="Aspect Ratio" src=""/>
			
			<div id="player"></div>
			
		</div>
	
	</div>
	<div id="youtubeCount"></div>
	<div id="youtubeTitle"></div>
	<div id="youtubeDescription"></div>
	

Example video array

	var testarr = [
		{
			"id": "kqdBD6MMciA", 
			"aspect": "4x3", 
			"title": "video 1"
		},
		{
			"id": "UrS9AVPUMFQ", 
			"aspect": "16x9", 
			"title": "video 2"
		},
		{
			"id": "al2DFQEZl4M", 
			"aspect": "16x10", 
			"title": "video 3"
		},
		{
			"id": "xxxxxx", //Bad video ID
			"aspect": "16x10",
			"title": "video 4"
		},
		{
			"id": "aaaa", //Bad video ID
			"aspect": "16x10",
			"title": "video 5"
		},
		{
			"id": "YFSCftwdpF8",
			"aspect": "16x10",
			"title": "video 6"
		}
	]
	
	
Put the following in your footer (Don't place within $(document).ready)
	
	var tag = document.createElement('script');
	tag.src = "//www.youtube.com/iframe_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
	var player;
	
	function onYouTubeIframeAPIReady() {
	
		$("#player").youTubeAPI({
			playerSettings: {
				playerVars: {
					//see plugin for list of more parameters
					'rel': 0 //hiding recomended videos at video completion
				}
			},
			apiReturn: {
				title: $(".youtubeTitle"),
				description: $(".youtubeDescription"),
				viewCount: $(".youtubeCount")
			},
			build: {
				dropdown: true //the plugin will sanatise and build a select drop down of the array of videos
			},
			videoArray: testarr,
			hash: 'video-', //this is the hash prefix the plugin will look for to play a video from a direct link
			pluginDir: 'http://mydomain.com/scripts/jquery-ytapi/', //the plugin dir
			aspectImg: $("#aspect"),
			selectDD: $("#series")
		});
		
	}