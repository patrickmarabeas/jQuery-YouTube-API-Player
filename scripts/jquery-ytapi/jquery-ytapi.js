(function($) {

	$.youTubeAPI = function(element, config) {	
		
		var $this = $(element);
		var $thisParent = $this.parent();
		var plugin = this;
	
		var defaults = {
			playerSettings: {
				height: '540',
				width: '960',
				playerVars: { // https://developers.google.com/youtube/player_parameters?playerVersion=HTML5#Parameters
					//these are just some of the more useful parameters
					'autohide': 2,
					'autoplay': 0,
					'controls': 1,
					'fs': 1,
					'iv_load_policy': 1,
					'loop': 0,
					'modestbranding': 1,
					'rel': 1,
					'showinfo': 1,
					'theme': 'dark'
				},
				events: { // https://developers.google.com/youtube/iframe_api_reference#Events
					'onReady': onPlayerReady,
					'onError': onPlayerError,
					'onStateChange': onPlayerStateChange
				}
			},
			apiReturn: { //objects to display the data
				title: '',
				description: '',
				viewCount: '',
				author: '',
				published: '',
				likes: '',
				dislikes: ''
			},
			videoArray: '',
			build: { 
				dropdown: false,
				controls: false
			},
			hash: 'video-', //prefix before videoID in the hash
			pluginDir: 'http://mydomain.com/scrips/ytapi/', //path to the plugin
			aspectImg: '', //image object that deals with aspect ratio
			selectDD: '' //select drop down that holds the other videos in the series
		};
		
		//true is used for deep recursive merge
		var config = $.extend(true, defaults, config);

	
	
	
	
		var init = function() {

			var build = function(dropdown, controls) {
				
				if (dropdown == true) {
			
					var errorArr = [];
					
					(function() {
						var index = 0;

						function sanatise() {
						
							if (index < config.videoArray.length) {
								var url = "http://gdata.youtube.com/feeds/api/videos/"+config.videoArray[index].id+"?v=2&alt=json&callback=?";
								$.jsonp({
									url: url,
									success: function(data) {
										//set title
										config.videoArray[index].title = data.entry.title.$t;
									},
									error:function (){
										//collect failed indexes
										errorArr.push(index);
									},
									complete: function() {
										++index;
										sanatise();
									}
								});
							}
							else { //once all videos are checked
								//empty array indexes whose videos didn't resolve
								for(var i = 0; i < errorArr.length; i++) {
									config.videoArray[errorArr[i]] = "";
								}
								//remove empty indexes
								config.videoArray = $.grep(config.videoArray,function(n){
									return(n);
								});
						
						
								$thisParent.after("<select id='series'><option selected disabled>Select a video from the series</option></select>");

								for(var i = 0; i < config.videoArray.length; i++) {
									$('#series option').eq(i).after("<option value=" + config.videoArray[i].id + " id=" + config.videoArray[i].id + " class='video'>" + config.videoArray[i].title +"</option>");
								}

								//basic functionality for select dropdown of videos
								$("#series").change(function(){
									var videoID = $(this).val();
									plugin.loadVideo(videoID);
								});
								
							}
							
						}
						sanatise();

					})();
				
				} /** if dropdown true **/
				
				
				if (controls == true) {
				
					/***************************
				
					code for controls
					
					***************************/
					
					
					$thisParent.after("<div id='controls'><div id='playpause'></div><div id='stop'></div></div>");
					
					//player.playVideo();
					//player.pauseVideo();
					//player.stopVideo();

					
				} /** if constrols true **/
				
				
			}
			build(config.build.dropdown, config.build.controls);
			
			

			
					
			//set initial video to be defaultly the first in the array incase the hash is incorect
			var initialVideo = config.videoArray[0].id;
			imageAspect(config.videoArray[0].aspect);	
			
			//take into account the '#'
			var hl = config.hash.length + 1;

			if(window.location.hash.substring(0,hl) === '#'+config.hash){
				
				var s = location.hash.substr(hl);
				var foundVid = false;
				for (var i = 0; i < config.videoArray.length; i++) {
					if (config.videoArray[i].id == s) {
						initialVideo = s;
						foundVid = true;
						imageAspect(config.videoArray[i].aspect);
						break;
					}
				}
				if(foundVid == false) {
					window.location.hash = config.hash + config.videoArray[0].id;
					console.log("hash couldn't be matched to array item - playing the first video instead");
				}	
			}
			
			player = new YT.Player($this.attr("id"), {
				height: 		config.playerSettings.height,
				width: 			config.playerSettings.width,
				playerVars: 	config.playerSettings.playerVars,
				events: 		config.playerSettings.events,
				videoId: 		initialVideo
			});
			
			loadData(initialVideo);
		
		} /** init function() **/
		

		
		
		var imageAspect = function(aspect) {
			//regex used incase user ends pluginURL with a '/' or not
			config.aspectImg.attr("src", config.pluginDir.replace(/\/$/, '') + "/img/" + aspect + ".png");
		}
		
		var loadData = function(video) {
			var url = "http://gdata.youtube.com/feeds/api/videos/"+video+"?v=2&alt=json&callback=?";
			$.getJSON(url, function(data){
				var title 			= data.entry.title.$t;
				var description 	= data.entry.media$group.media$description.$t;
				var viewCount 		= data.entry.yt$statistics.viewCount;
				var author 			= data.entry.author[0].name.$t;
				var published 		= data.entry.published.$t;
				var likes 			= data.entry.yt$rating.numLikes;
				var dislikes 		= data.entry.yt$rating.numDislikes;

				if(config.apiReturn.title) 			{	config.apiReturn.title.text(title);													}
				if(config.apiReturn.description)	{	config.apiReturn.description.html(description.replace(/\n/g, '<br/>')); 			}
				if(config.apiReturn.viewCount) 		{	config.apiReturn.viewCount.text(viewCount.replace(/\B(?=(\d{3})+(?!\d))/g, ",")); 	}
				if(config.apiReturn.author) 		{	config.apiReturn.author.text(author); 												}
				if(config.apiReturn.published) 		{	config.apiReturn.published.text(published); 										}
				if(config.apiReturn.likes) 			{	config.apiReturn.likes.text(likes.replace(/\B(?=(\d{3})+(?!\d))/g, ",")); 			}
				if(config.apiReturn.dislikes) 		{	config.apiReturn.dislikes.text(dislikes.replace(/\B(?=(\d{3})+(?!\d))/g, ","));		}
			});
		}

		plugin.loadVideo = function(videoID) {
			if (player) {
				var theIndex = -1;
				//inspect array to find the index of the current video
				for (var i = 0; i < config.videoArray.length; i++) {
					if (config.videoArray[i].id == videoID) {
						theIndex = i;
						break;
					}
				}
				
				player.loadVideoById(videoID); //load the video
				window.location.hash = config.hash + videoID; //update the hash
				imageAspect(config.videoArray[theIndex].aspect); //update the aspect image
				loadData(videoID); //load the video data
			}
		}
		
		function onPlayerReady(event) {

		}
		
		function onPlayerStateChange(event) {
			if(config.build.controls == true) {
				console.log(event);
				/***************************
				
				code for controls
				
				***************************/
			}
		}
		
		function onPlayerError(errorCode) {

		}
		
		init(); //initialize
		
		
		//IF NOT USING THE BUILDER:
		//this should be able to be done outside the plugin via:
		// $(".video").data('youTubeAPI').loadVideo( $(this).data('id') );
		//but currently not working
		$(".video").click(function(){
			var videoID = $(this).data('id');
			plugin.loadVideo(videoID);
		});
		
		
	}
	
	$.fn.youTubeAPI = function(config) {

        return this.each(function() {
            if (undefined == $(this).data('youTubeAPI')) {
                var plugin = new $.youTubeAPI(this, config);
                $(this).data('youTubeAPI', plugin);
            }
        });

    }
	
})(jQuery)