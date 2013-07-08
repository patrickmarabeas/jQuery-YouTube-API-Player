jQuery-YouTube-API-Plugin
=========================

Demo:
http://patrickmarabeas.github.io/jQuery-YouTube-API-Plugin/

Link to specific video in the series:
http://patrickmarabeas.github.io/jQuery-YouTube-API-Plugin/#video-UrS9AVPUMFQ

jQuery plugin to insert a YouTube player on the page

YouTube API to load videos

Returns video data for display

Adds hash to URL for direct linking of videos

Builds select dropdown of videos in array and sanatises (requires https://github.com/jaubourg/jquery-jsonp)

controls to be added shortly

HTML
----

	<div id="videoContainer">
		
		<div id="yt">
			<img id="aspect" alt="Aspect Ratio" src=""/>
			<div id="player"></div>
		</div>
		
	</div>
	
	<div id="youtubeCount"></div>
	<div id="youtubeTitle"></div>
	<div id="youtubeDescription"></div>
	
LESS
----
	
	#yt {
		position: relative;

		#aspect {
			display: block;
			width: 100%;
			height: auto;
			opacity: 0;
		}
		
		iframe {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%; 
			height: 100%;
			
			border: 0;
		}
		
	}
	

Example video array
-------------------

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
-----------------------------------------------------------------------
	
	<script type="text/javascript">

		function onYouTubeIframeAPIReady() {
			
			$("#yt").youTubeAPI({
				videoArray: testarr,
				hash: 'video-', //this is the hash prefix the plugin will look for to play a video from a direct link
				pluginDir: 'http://mydomain.com/scripts/jquery-ytapi/', //the plugin dir
				playerSettings: {
					playerVars: {
						//see plugin for list of more parameters
						'rel': 0 //hiding recomended videos at video completion
					}
				},
				apiReturn: {
					title: $("#youtubeTitle"),
					description: $("#youtubeDescription"),
					viewCount: $("#youtubeCount")
				},
				build: {
					dropdown: true //the plugin will sanatise and build a select drop down of the array of videos
				}
			});
			
		}
		
	</script>


Load videos manually
--------------------

If you wish to build your own list of videos from the array, you can access the loadVideo() function as such:
	
	$("#yt").data('youTubeAPI').loadVideo(videoID);
	
An example of usage:
	
	<div class="video" data-id="tHeV1d30Id">
	
	$(".video").on('click', function(){		
		var videoID = $(this).data('id');
		$("#yt").data('youTubeAPI').loadVideo(videoID);
	});
