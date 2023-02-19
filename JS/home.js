const API_KEY = "AIzaSyDFD23XDK9bi_IB_IsO8B592MPRarWMvX4";

async function searchLink() {
    document.getElementById("stats-card").style.display= 'none' ;
    var searchLink = document.getElementById("search-bar").value; //extract search link
    var videoID = getVideoIDFromLink(searchLink);

    document.getElementById("search-bar").value = ""; //clear search bar

    var channelID = await getChannelID(videoID);
    console.log("Channel ID: " + channelID);
    var channelName = await getChannelName(videoID);
    var channelSubs = await getChannelSubs(channelID);
    var channelTotalViews = await getChannelTotalViews(channelID);
    var videoTitle = await getVideoTitle(videoID);
    var videoPublishDate = await getVideoPublishDate(videoID)
    videoPublishDate=videoPublishDate.substring(0, 10);
    var videoDuration = await getVideoDuration(videoID);
    videoDuration = videoDuration.substring(2);
    videoDuration = getVideoDurationSpaced(videoDuration);
    var viewCount = await getVideoViews(videoID);
    var likeCount = await getVideoLikes(videoID);
    var commentCount = await getVideoComments(videoID);
    
    
    document.getElementById("Channel-Name").innerHTML = channelName;
    document.getElementById("Channel-Subs").innerHTML = channelSubs;
    document.getElementById("Channel-Views").innerHTML = channelTotalViews;    
    document.getElementById("Title").innerHTML = videoTitle;
    document.getElementById("Publish-Date").innerHTML = videoPublishDate;
    document.getElementById("Duration").innerHTML = videoDuration;
    document.getElementById("Views").innerHTML = viewCount;
    document.getElementById("Likes").innerHTML = likeCount;
    document.getElementById("Comments").innerHTML = commentCount;

    document.getElementById('video-info-card').style.display = 'block';
}

function getStats() {
    document.getElementById("video-info-card").style.display= 'none' ;
    document.getElementById("stats-card").style.display= 'block' ;
}



function getVideoIDFromLink(url) { //return video ID from valid youtube video link used in search bar
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}

async function getChannelID(videoID) { //returns channel ID using video ID
    const api_url = "https://www.googleapis.com/youtube/v3/videos?id=" + videoID + "&key=" + API_KEY + "&part=snippet,contentDetails,statistics,status";
    const response = await fetch(api_url);
    const data = await response.json();
    var channelID = data.items[0].snippet.channelId;
    return channelID;
}


async function getChannelName(videoID) { //returns channel name
    const api_url = "https://www.googleapis.com/youtube/v3/videos?id=" + videoID + "&key=" + API_KEY + "&part=snippet,contentDetails,statistics,status";
    const response = await fetch(api_url);
    const data = await response.json();
    var channelName = data.items[0].snippet.channelTitle;
    return channelName;
}

async function getChannelSubs(channelID) { //returns channel subscribers count
    const api_url = "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=" + channelID + "&key=" + API_KEY;
    const response = await fetch(api_url);
    const data = await response.json();
    var channelSubs = data.items[0].statistics.subscriberCount;
    return channelSubs;
}

async function getChannelTotalViews(channelID) { //returns channel total views count
    const api_url = "https://www.googleapis.com/youtube/v3/channels?part=statistics&id=" + channelID + "&key=" + API_KEY;
    const response = await fetch(api_url);
    const data = await response.json();
    var channelTotalViews = data.items[0].statistics.viewCount;
    return channelTotalViews;
}


async function getVideoTitle(videoID) { //return video title
    const api_url = "https://www.googleapis.com/youtube/v3/videos?id=" + videoID+ "&key=" + API_KEY + "&part=snippet,contentDetails,statistics,status";
    const response = await fetch(api_url);
    const data = await response.json();
    var videoTitle = data.items[0].snippet.localized.title;
    return videoTitle;
}

async function getVideoPublishDate(videoID) { //return video publish date
    const api_url = "https://www.googleapis.com/youtube/v3/videos?id=" + videoID + "&key=" + API_KEY + "&part=snippet,contentDetails,statistics,status";
    const response = await fetch(api_url);
    const data = await response.json();
    var videoPublishDate = data.items[0].snippet.publishedAt;
    console.log(data);
    return videoPublishDate;
}

async function getVideoDuration(videoID) { //return video duration
    const api_url = "https://www.googleapis.com/youtube/v3/videos?id=" + videoID + "&key=" + API_KEY + "&part=snippet,contentDetails,statistics,status";
    const response = await fetch(api_url);
    const data = await response.json();
    var duration = data.items[0].contentDetails.duration;
    console.log("Video Duration: " + duration);
    return duration;
}

function getVideoDurationSpaced(durationString) { //format for duration string 0D0H0M0S. Returns like this 0D 0H 0M 0S
    var videoDurationSpaced = "";
    for(let i = 0; i < durationString.length; i++) {
        if(isLetter(durationString.charAt(i)) && i != durationString.length-1) {
            videoDurationSpaced += durationString.charAt(i) + " ";
        } else {
            videoDurationSpaced += durationString.charAt(i)
        }
    }

    return videoDurationSpaced;
}

async function getVideoLikes(videoID) {//return video likes count
    var api_stats_url = "https://www.googleapis.com/youtube/v3/videos?part=statistics&id=" + videoID + "&key=" + API_KEY;
    const response = await fetch(api_stats_url);
    const data = await response.json();
    var likeCount = data.items[0].statistics.likeCount;
    return likeCount;
}

async function getVideoComments(videoID) { //return video comment count
    var api_stats_url = "https://www.googleapis.com/youtube/v3/videos?part=statistics&id=" + videoID + "&key=" + API_KEY;
    const response = await fetch(api_stats_url);
    const data = await response.json();
    var commentCount = data.items[0].statistics.commentCount;

    return commentCount;
}

async function getVideoViews(videoID) { //return video view count
    var api_stats_url = "https://www.googleapis.com/youtube/v3/videos?part=statistics&id=" + videoID + "&key=" + API_KEY;
    const response = await fetch(api_stats_url);
    const data = await response.json();
    var viewCount = data.items[0].statistics.viewCount;

    return viewCount;
}

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}