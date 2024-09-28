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

// Function to fetch and display all code block from a URL
document.addEventListener('DOMContentLoaded', () => {
    // Get all code blocks that contain URLs
    const codeBlocks = document.querySelectorAll('.code-wrapper pre code');

    // Iterate through each code block
    codeBlocks.forEach((codeBlock) => {
        // Extract the URL from the code block's text content
        const codeUrl = codeBlock.textContent.trim();
        
        // Fetch and display code from the URL
        fetch(codeUrl)
            .then(response => response.text())
            .then(text => {
                // Set the fetched code as the content of the code block
                codeBlock.textContent = text;
                // Highlight the code using Prism.js or any other syntax highlighter
                Prism.highlightElement(codeBlock);
            })
            .catch(error => {
                // Display an error message if fetching fails
                codeBlock.textContent = 'Error fetching code.';
                console.error('Error:', error);
            });
    });
});


// Function to copy code to clipboard
document.addEventListener('DOMContentLoaded', () => {
    // Select all copy buttons
    const copyButtons = document.querySelectorAll('.code-wrapper button');

    copyButtons.forEach((copyButton) => {
        copyButton.addEventListener('click', () => {
            // Get the code block element relative to the clicked button
            const codeBlock = copyButton.previousElementSibling.querySelector('code');

            // Copy the content of the code block to the clipboard
            navigator.clipboard.writeText(codeBlock.textContent)
                .then(() => {
                    // Display success message
                    copyButton.textContent = 'Copied!';

                    // Reset button after 2 seconds
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                });
        });
    });
});


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
