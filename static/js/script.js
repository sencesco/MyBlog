/* Toggle between showing and hiding the navigation menu links 
   when the user clicks on the hamburger menu / bar icon */
   function myFunction() {
    var sublist = document.getElementsByClassName("sublist");
    for (var idx = 0; idx < sublist.length; idx++) {
        if (window.getComputedStyle(sublist[idx]).display === "none") {
            sublist[idx].style.display = "block";
        } else {
            sublist[idx].style.display = "none";
        }
    }
}

function shareTwitter() {
    var url = window.location.href;
    var title = document.title;
    var shareUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title);
    window.open(shareUrl, 'Twitter');
}

function shareFacebook() {
    var url = window.location.href;
    var title = document.title;
    var shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url) + '&t=' + encodeURIComponent(title);
    window.open(shareUrl, 'Facebook');
}

function shareLinkedin() {
    var url = window.location.href;
    var title = document.title;
    var shareUrl = 'https://www.linkedin.com/shareArticle?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title);
    window.open(shareUrl, 'LinkedIn');
}

/* Current time */
function updateDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    
    document.getElementById('currentDateTime').innerHTML = 
        `Current time: ${formattedDateTime}<br><br>© ${year} 
        Somchai Kradingthong. All rights reserved.`;
}

window.onload = updateDateTime;
setInterval(updateDateTime, 1000);  // Update the time every second
