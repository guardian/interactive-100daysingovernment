
const shareURL = encodeURIComponent(window.guardian.config.page.shortUrl); // short url will only work in a guardian page
const hashTag = '#GuardianReviewOfYear';

const twitterBaseUrl = 'https://twitter.com/intent/tweet?text=';
const facebookBaseUrl = 'https://www.facebook.com/sharer/sharer.php?ref=responsive&u=';
const googleBaseUrl = 'https://plus.google.com/share?url=';

export default function share(network, extra='') {
    
    var title = document.getElementById("gv-pageHeading").innerHTML;

    if(extra){
        var extraStr=(" - Number "+extra.displayNumber+". "+extra.title);
        extra=extraStr;

    }
    
    
    var twitterMessage = `${title} ${extra} ${hashTag}`;
    var shareWindow;

    if (network === 'twitter') {
        shareWindow = twitterBaseUrl + encodeURIComponent(twitterMessage + ' ') + shareURL;
    } else if (network === 'facebook') {
        shareWindow = facebookBaseUrl + shareURL;
    } else if (network === 'email') {
        shareWindow = 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + shareURL;
    } else if (network === 'google') {
        shareWindow = googleBaseUrl + shareURL;
    }

    window.open(shareWindow, network + 'share', 'width=640,height=320');
}
