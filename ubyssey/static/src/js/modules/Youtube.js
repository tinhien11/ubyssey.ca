export function YoutubePlayer(element) {
    const node = $(element);
    let playerReady = false;
    let userReady = false;

    const player = new YT.Player(`video-${node.data('id')}`, {
        height: node.width() * 0.5625, // 16:9
        width: node.width(),
        videoId: node.data('id'),
        playerVars: {
            showinfo: 0,
            modestbranding: 1,
        },
        events: {
            onReady: onPlayerReady
        }
    });

    function onPlayerReady(event) {
        if(userReady){
            player.playVideo();
        } else {
            playerReady = true;
        }
    }

    $(element).find('.js-video-launch').click(function(){
        $(this).hide();
        $(`#video-${node.data('id')}`).show();
        if(playerReady){
            player.playVideo();
        } else {
            userReady = true;
        }
    });
}

// 2. This code loads the IFrame Player API code asynchronously.
let tag = document.createElement('script');
tag.src = 'https://www.youtube.com/iframe_api';

let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
window.onYouTubeIframeAPIReady = function() {
    $('.js-video-youtube').each(function(){
        YoutubePlayer(this);
    });
}

export function YoutubeLoader(success, error) {
    const KEY = 'AIzaSyAbp6M75Dj1AR6LBHhhM74DJcey7W6hBYw';
    const CHANNEL = 'UCC2NYIKsQwDJkYH0zXC_MbA'; // TheUbyssey
    const URL = 'https://www.googleapis.com/youtube/v3/search?key={0}&channelId={1}&part=snippet,id&order=date&maxResults=20'
                    .replace('{0}', KEY)
                    .replace('{1}', CHANNEL);
    $.ajax({
        url: URL,
        success: function(data) {
            let videos = [];
            data.items.forEach(function (video) {
                videos.push({
                    id: video.id.videoId,
                    thumbnails: video.snippet.thumbnails,
                    title: video.snippet.title,
                    description: video.snippet.description,
                    publishedAt: video.snippet.publishedAt,
                    url: 'https://www.youtube.com/watch?v=' + video.id.videoId
                });
            })
            success(videos);
        },
        error: error
    });
}
