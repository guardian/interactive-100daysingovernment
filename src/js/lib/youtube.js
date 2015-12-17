
export default function youtube() {
var i, c, y, v, s, n;
var $$ = (el, s) => [].slice.apply(el.querySelectorAll(s));


var onPlayerStateChange = function(event) {
    console.log(event)

}

var stopVideo = function (  ) {
                
    var vids = document.getElementsByClassName("yt_players") 
    //document.getElementsByClassName("yt_players video") 
    //document.getElementsByTagName('video') 
     if (vids.length > 0){
        for (n = 0; n < vids.length; n++){
            console.log(vids[n])
        }
     }
     
      
}

    v = document.getElementsByClassName("youtube");
        
        if (v.length > 0) {
            
            s = document.createElement("style");
            s.type = "text/css";
            s.innerHTML = '.youtube{background-color:#000;max-width:100%;overflow:hidden;position:relative;cursor:hand;cursor:pointer}.youtube .thumb{bottom:0;display:block;left:0;margin:auto;max-width:100%;position:absolute;right:0;top:0;width:100%;height:auto}.youtube .play{filter:alpha(opacity=80);opacity:.8;height:77px;left:50%;margin-left:-38px;margin-top:-38px;position:absolute;top:50%;width:77px;background:url("https://interactive.guim.co.uk/2015/animated_gifs/vid-sprite.png") no-repeat}';
            document.body.appendChild(s)
        }

    var videoEls = document.getElementsByClassName( "gv-you-tube-iframe" );

        if (videoEls.length > 0){
            console.log("checking")
            videoEls.forEach(videoEl => {
                console.log(videoEl)
            })
        } 

        for (n = 0; n < v.length; n++) {
        y = v[n];
        i = document.createElement("img");
        i.setAttribute("src", "http://i.ytimg.com/vi/" + y.id + "/hqdefault.jpg");
        i.setAttribute("class", "thumb");
        c = document.createElement("div");
        c.setAttribute("class", "play");
        y.appendChild(i);
        y.appendChild(c);
        y.onclick = function() {

            stopVideo();
            var a = document.createElement("iframe");
            a.setAttribute("src", "https://www.youtube.com/embed/" + this.id + "?autoplay=1&autohide=1&border=0&wmode=opaque&enablejsapi=1");
            a.setAttribute("id","ifm_"+this.id);
            a.style.width = this.style.width;
            a.style.height = this.style.height;
            a.style.border = 0;
            //a.setAttribute("id", "ytPlayer_"+this.id);
         //    a.setAttribute( "events", 
         //     "onStateChange: onPlayerStateChange"
         // )
            this.parentNode.replaceChild(a, this)

            
        }
    }   

}

/**
 * Stop an iframe or HTML5 <video> from playing
 * @param  {Element} element The element that contains the video
 */


    // var iframe = element.querySelector( 'iframe');
    // var video = element.querySelector( 'video' );
    // if ( iframe ) {
    //     var iframeSrc = iframe.src;
    //     iframe.src = iframeSrc;
    // }
    // if ( video ) {
    //     video.pause();
    // }


