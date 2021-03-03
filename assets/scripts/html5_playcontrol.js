window.dkr = window.dkr || {};
if (typeof(window.dkr.speedChange) != "undefined"){
    alert("Play control has already been loaded.");    
}
else{
    window.dkr.speedChange = 0.25;
    window.dkr.pausedVideos = null 
    window.dkr.playingVideos = [];
    window.dkr.videos = document.querySelectorAll('video');
    if (window.dkr.videos == null){
        alert("No videos found; if there are videos here, they aren't html5 videos or they have been embedded. In the later case go to to original website hosting the video.");
    }
    else{
        alert("Play control loaded:\r\n w: normal speed \r\n a: slower \r\n s: toggle play/pause\r\n d: faster \r\n y/z: paused video 5 seconds backward, normal speed\r\n x: pause, 5 seconds backward, normal speed\r\n c: paused video, normal speed");
        document.addEventListener ('keydown', function (event) {

            if ((new URLSearchParams(document.location.search)).get("debug") == 1) {
                debugger;
            }

            window.dkr.playingVideos = [];
            window.dkr.videos.forEach(v=> {if(v.paused == false){window.dkr.playingVideos.push(v)}});
            
            //a: slower
            if (event.key == "a") {    
                window.dkr.playingVideos.forEach(v => {if (v.playbackRate - window.dkr.speedChange>0) { v.playbackRate -= window.dkr.speedChange}});
                return false; 
            }

            //d: faster
            if (event.key == "d") {            
                window.dkr.playingVideos.forEach(v => v.playbackRate += window.dkr.speedChange);
                return false; 
            }

            // s: toggle pause/play
            if (event.key == "s") {
                if (window.dkr.playingVideos.length > 0)      {
                    //Stops and five seconds backward
                    window.dkr.pausedVideos = window.dkr.playingVideos;
                    window.dkr.playingVideos.forEach(v => v.pause());                
                }
                else{
                    window.dkr.pausedVideos.forEach(v => v.play());
                    window.dkr.pausedVideos = null;
                }
                return false; 
            }

            // y: 5 seconds backwards for last paused videos
            if (event.key == "y" || event.key == "z" ) {            
                window.dkr.pausedVideos.forEach( v=> {
                    v.currentTime -= 5;  
                    v.playbackRate = 1;                      
                });            
                return false;
            }

            // x: stop and 5 seconds backwards
            if (event.key == "x") {
                window.dkr.pausedVideos = window.dkr.playingVideos;                
                window.dkr.playingVideos.forEach( v=> {
                    v.pause();
                    v.currentTime -= 5;  
                    v.playbackRate = 1;                      
                });            
                return false;
            }

            // c: 5 seconds forward for last paused videos
            if (event.key == "c") {              
                window.dkr.pausedVideos.forEach( v=> {
                    v.currentTime += 5;  
                    v.playbackRate = 1;                      
                });            
            }

            // w: normal speed
            if (event.key == "w") {
                window.dkr.playingVideos.forEach( v=> v.playbackRate = 1);                    
                return false;
            }
        });
    }
}