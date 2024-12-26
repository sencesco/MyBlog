/* Toggle between showing and hiding the navigation menu links 
   when the user clicks on the hamburger menu / bar icon */
document.addEventListener('DOMContentLoaded', function() {
    const toggleElements = document.querySelectorAll('.has-sublist');

    toggleElements.forEach((toggle) => {
        toggle.addEventListener('click', function() {
            const sublist = this.querySelector('.sublist');
            // Toggle display of the sublist
            if (sublist.style.display === 'block') {
                sublist.style.display = 'none';
            } else {
                sublist.style.display = 'block';
            }
        });
    });
});


/* Toggle between showing and hiding the content */
function toggleContent(button) {
    var content = button.nextElementSibling.nextElementSibling; // Update to skip over the link
    if (content.style.display === "none") {
        content.style.display = "block";
        button.textContent = "Hide";
    } else {
        content.style.display = "none";
        button.textContent = "Summary";
    }
}


/* Fetch and display code .py from the specified URL and load descriptions */
document.addEventListener('DOMContentLoaded', function() {
    const codeWrapper = document.querySelector('.code-wrapper');
    const codeBlocks = codeWrapper.querySelectorAll('button[data-url]');
    const codeDisplay = document.getElementById('code-display');
    const copyButton = document.querySelector('.code-wrapper #copy-button');

    // Function to fetch and display code
    function fetchAndDisplayCode(url) {
        fetch(url)
            .then(response => response.text())
            .then(text => {
                codeDisplay.textContent = text;
                Prism.highlightElement(codeDisplay);
            })
            .catch(error => {
                codeDisplay.textContent = 'Error fetching code.';
                console.error('Error:', error);
            });
    }
    
    // Function to show only the matching content and hide others
    function showMatchingContent(buttonText) {
        const codeDescElements = document.getElementsByClassName("code-description");

        for (let i = 0; i < codeDescElements.length; i++) {
            let selector = codeDescElements[i].querySelector("ul li strong:first-child").innerText;
            selector = selector.replace(/:$/, "").trim(); // Removes colon at the end and trims whitespace

            // Check if selector matches the button text
            if (selector === buttonText) {
                codeDescElements[i].style.display = "block";  // Show matching content
            } else {
                codeDescElements[i].style.display = "none";  // Hide non-matching content
            }
        }
    }

    // Event listener for buttons that activate when clicked
    codeBlocks.forEach(button => {
        button.addEventListener('click', () => {
            const url = button.getAttribute('data-url');
            codeBlocks.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Fetch and display the code
            fetchAndDisplayCode(url);
            // Show matching content based on button text
            showMatchingContent(button.innerText);
        });
    });

    // Auto load the first file and show the first description when the page loads
    if (codeBlocks.length > 0) {
        const firstButton = codeBlocks[0];
        const firstUrl = firstButton.getAttribute('data-url');
        fetchAndDisplayCode(firstUrl);
        firstButton.classList.add('active');
        showMatchingContent(firstButton.innerText); // Show matching description
    }

    if (copyButton) {
        copyButton.addEventListener('click', () => {
            if (codeDisplay && codeDisplay.textContent) {
                const tempTextArea = document.createElement('textarea');    // Create a temporary text area
                tempTextArea.value = codeDisplay.textContent;   // Set the value of the text area to the code
                document.body.appendChild(tempTextArea);    // Append the text area to the body
                tempTextArea.select();                      // Select the text area
                document.execCommand('copy');               // Copy the selected text
                document.body.removeChild(tempTextArea);
                
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);       // Revert back to "Copy" after 2 seconds
            } else {
                console.error('No code to copy');
                copyButton.textContent = 'No Code';
            }
        });
    } else {
        console.error('Copy button not found');
    }
});

// Fetch and render the notebook from the specified URL
document.addEventListener('DOMContentLoaded', function () {
    let githubLink = document.getElementById('notebook-content').innerHTML.trim();

    // Initialize cellsToSkip with values extracted from the <script> tag
    let cellsToSkip = {
        markdown: [],
        code: []
    };

    let addTag = {
        markdown: [],
        code: []
    };

    // Function to strip ANSI escape codes from text
    function stripAnsiCodes(text) {
        // Remove ANSI escape sequences
        return text.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    }

    // Function to convert GitHub repository URL to raw content URL if needed
    function convertToRawUrl(url) {
        if (url.includes('github.com') && !url.includes('raw.githubusercontent.com')) {
            return url
                .replace('github.com', 'raw.githubusercontent.com')
                .replace('/blob/', '/');
        }
        return url;
    }

    // Function to extract identifiers from the <script> tag
    function extractCellsToSkip() {
        const filtersElement = document.getElementById('notebook-filters-ignore');
        if (filtersElement) {
            const filtersData = JSON.parse(filtersElement.textContent);
            if (filtersData.markdown && Array.isArray(filtersData.markdown.id)) {
                cellsToSkip.markdown = filtersData.markdown.id;
            }
            if (filtersData.code && Array.isArray(filtersData.code.timestamp)) {
                cellsToSkip.code = filtersData.code.timestamp;
            }
        }
    }

    function extractAddTag() {
        const filtersElement = document.getElementById('notebook-filters-add_tag');
        if (filtersElement) {
            const filtersData = JSON.parse(filtersElement.textContent);
            if (filtersData.markdown && Array.isArray(filtersData.markdown.id_pair)) {
                addTag.markdown = filtersData.markdown.id_pair;
            }
            if (filtersData.code && Array.isArray(filtersData.code.timestamp)) {
                addTag.code = filtersData.code.timestamp;
            }
        }
    }

    async function fetchAndRenderNotebook() {
        extractCellsToSkip();
        extractAddTag();

        try {
            // Convert URL to raw format if needed
            const rawUrl = convertToRawUrl(githubLink);
            const response = await fetch(rawUrl);
            if (!response.ok) throw new Error(`Failed to fetch notebook: ${response.status}`);

            const notebookJson = await response.json();
            renderNotebookContent(notebookJson);
        } catch (error) {
            console.error("Error fetching notebook:", error);
            document.getElementById('notebook-content').innerHTML = "Failed to load notebook. Please try again later.";
        }
    }

    function renderNotebookContent(notebookJson) {
        let notebookContent = '';
        
        // Handle different notebook formats
        const cells = notebookJson.cells || [];
        
        cells.forEach((cell) => {
            // Skip cells based on metadata
            if (shouldSkipCell(cell)) return;

            if (cell.cell_type === 'markdown') {
                notebookContent += renderMarkdownCell(cell);
            } else if (cell.cell_type === 'code') {
                notebookContent += renderCodeCell(cell);
            }
        });

        document.getElementById('notebook-content').innerHTML = notebookContent;
        Prism.highlightAll();
    }

    function shouldSkipCell(cell) {
        if (cell.cell_type === 'markdown' && cell.metadata && cell.metadata.id) {
            return cellsToSkip.markdown.includes(cell.metadata.id);
        }
        if (cell.cell_type === 'code' && cell.metadata && cell.metadata.executionInfo) {
            return cellsToSkip.code.includes(cell.metadata.executionInfo.timestamp);
        }
        return false;
    }

    function renderMarkdownCell(cell) {
        let markdownOutput = '';
        
        // Check for tags to add
        if (cell.metadata && cell.metadata.id) {
            const matchedTag = addTag.markdown.find(tag => tag.id === cell.metadata.id);
            if (matchedTag) {
                markdownOutput += matchedTag.tag;
            }
        }

        // Handle both array and string source formats
        const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
        markdownOutput += marked.parse(source);
        
        return '<div class="markdown-cell">' + markdownOutput + '</div>';
    }

    function renderCodeCell(cell) {
        if (!cell.source || (Array.isArray(cell.source) && cell.source.join('').trim() === '')) {
            return '';
        }

        let codeOutput = '';
        
        // Add any tags
        if (cell.metadata && cell.metadata.executionInfo && cell.metadata.executionInfo.timestamp) {
            const matchedTag = addTag.code.find(tag => 
                tag.timestamp === cell.metadata.executionInfo.timestamp
            );
            if (matchedTag) {
                codeOutput += matchedTag.tag;
            }
        }

        // Render code
        const source = Array.isArray(cell.source) ? cell.source.join('') : cell.source;
        codeOutput += '<pre><code class="language-python">' +
            source.replace(/</g, '&lt;').replace(/>/g, '&gt;') +
            '</code></pre>';

        // Render outputs
        if (cell.outputs && cell.outputs.length) {
            codeOutput += renderOutputs(cell.outputs);
        }

        return codeOutput;
    }

    function renderOutputs(outputs) {
        let outputContent = '';
        
        outputs.forEach(output => {
            if (output.output_type === 'stream' && output.name !== 'stderr') {
                const text = Array.isArray(output.text) ? output.text.join('') : output.text;
                // Strip ANSI codes before rendering
                const cleanText = stripAnsiCodes(text);
                outputContent += `<div class="output"><pre>${cleanText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre></div>`;
            } 
            else if (output.output_type === 'execute_result' || output.output_type === 'display_data') {
                if (output.data) {
                    if (output.data['text/html']) {
                        const html = Array.isArray(output.data['text/html']) 
                            ? output.data['text/html'].join('') 
                            : output.data['text/html'];
                        outputContent += `<div class="dataframe-wrapper">${html}</div>`;
                    }
                    else if (output.data['text/plain']) {
                        const text = Array.isArray(output.data['text/plain']) 
                            ? output.data['text/plain'].join('') 
                            : output.data['text/plain'];
                        // Strip ANSI codes before rendering
                        const cleanText = stripAnsiCodes(text);
                        outputContent += `<div class="output"><pre>${cleanText
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/\n/g, '<br>')
                            .replace(/ /g, '&nbsp;')}</pre></div>`;
                    }
                    if (output.data['image/png']) {
                        outputContent += `<div class="visualization">
                            <img src="data:image/png;base64,${output.data['image/png']}" alt="Matplotlib plot">
                        </div>`;
                    }
                }
            }
        });

        return outputContent;
    }

    fetchAndRenderNotebook();
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
