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
    const githubLink = document.getElementById('notebook-content').innerHTML;

    // Initialize cellsToSkip with values extracted from the <script> tag
    let cellsToSkip = {
        markdown: [],  // Will be filled from the <script>
        code: []       // Will be filled from the <script>
    };

    let addTag = {
        markdown: [],  // Will be filled from the <script>
        code: []       // Will be filled from the <script>
    }

    // Function to extract identifiers from the <script> tag
    function extractCellsToSkip() {
        const filtersElement = document.getElementById('notebook-filters-ignore');
        if (filtersElement) {
            const filtersData = JSON.parse(filtersElement.textContent);

            // Populate cellsToSkip from the parsed JSON
            if (filtersData.markdown && Array.isArray(filtersData.markdown.id)) {
                cellsToSkip.markdown = filtersData.markdown.id;  // Directly set array
            }
            
            if (filtersData.code && Array.isArray(filtersData.code.timestamp)) {
                cellsToSkip.code = filtersData.code.timestamp;  // Directly set array
            }
        }
    }

    function extractAddTag() {
        const filtersElement = document.getElementById('notebook-filters-add_tag');
        if (filtersElement) {
            const filtersData = JSON.parse(filtersElement.textContent);

            // Populate addTag from the parsed JSON
            if (filtersData.markdown && Array.isArray(filtersData.markdown.id_pair)) {
                addTag.markdown = filtersData.markdown.id_pair;  // Store the id_pair array
            }

            if (filtersData.code && Array.isArray(filtersData.code.timestamp)) {
                addTag.code = filtersData.code.timestamp;  // Store the timestamps for code cells
            }
        }
    }

    async function fetchAndRenderNotebook() {
        extractCellsToSkip(); // Extract cell identifiers before fetching the notebook
        extractAddTag(); // Extract tags to add

        try {
            const response = await fetch(githubLink);
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
    
        notebookJson.cells.forEach((cell) => {
            // Skip markdown cells based on their IDs
            if (cell.cell_type === 'markdown' && cellsToSkip.markdown.includes(cell.metadata.id)) {
                return; // Skip this markdown cell
            }
    
            // Check for code cell and its timestamp
            if (cell.cell_type === 'code') {
                // Use cell.metadata.executionInfo.timestamp to check against cellsToSkip
                if (cell.metadata.executionInfo && cellsToSkip.code.includes(cell.metadata.executionInfo.timestamp)) {
                    return; // Skip this code cell
                }
            }
    
            // Render markdown cells
            if (cell.cell_type === 'markdown') {
                let markdownOutput = '';
    
                // Check if the current cell's ID matches any in addTag
                const matchedTag = addTag.markdown.find(tag => tag.id === cell.metadata.id);
                if (matchedTag) {
                    markdownOutput += matchedTag.tag; // Prepend the corresponding tag
                }
    
                markdownOutput += marked.parse(cell.source.join('')); // Parse the markdown content
                notebookContent += '<div class="markdown-cell">' + markdownOutput + '</div>';
            }
    
            // Render code cells
            if (cell.cell_type === 'code') {
                let codeOutput = '';
    
                // Check if the current cell's timestamp matches any in addTag
                if (cell.metadata.executionInfo && cell.metadata.executionInfo.timestamp) {
                    const matchedTag = addTag.code.find(tag => tag.timestamp === cell.metadata.executionInfo.timestamp);
                    if (matchedTag) {
                        codeOutput += matchedTag.tag; // Prepend the corresponding tag
                    }
                }
    
                if (cell.source.join('').trim() === '') return; // Skip empty code cells
    
                codeOutput += '<pre><code class="language-python">' +
                    cell.source.join('').replace(/</g, '&lt;').replace(/>/g, '&gt;') +
                    '</code></pre>';
    
                notebookContent += codeOutput;
    
                // Render code outputs if they exist
                if (cell.outputs.length) {
                    cell.outputs.forEach(output => {
                        // Debugging for output data
                        console.log('Output data:', output.data);
    
                        if (output.output_type === 'stream') {
                            if (output.name === 'stderr') return; // Skip stderr
                            notebookContent += '<div class="output"><pre>' + output.text.join('').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre></div>';
                        } else if (output.output_type === 'execute_result' || output.output_type === 'display_data') {
                            if (output.data['text/html']) {
                                // Improved logic for handling HTML content
                                const htmlContent = Array.isArray(output.data['text/html'])
                                    ? output.data['text/html'].join('')
                                    : output.data['text/html'];
                                notebookContent += `<div class="dataframe-wrapper">${htmlContent}</div>`;
                            } else if (output.data['text/plain']) {
                                const plainTextOutput = output.data['text/plain'].join('');
                                const formattedOutput = plainTextOutput
                                    .replace(/</g, '&lt;')
                                    .replace(/>/g, '&gt;')
                                    .replace(/\n/g, '<br>')
                                    .replace(/ /g, '&nbsp;');
                                notebookContent += `<div class="output"><pre>${formattedOutput}</pre></div>`;
                            }
    
                            if (output.data['image/png']) {
                                notebookContent += `<div class="visualization">
                                    <img src="data:image/png;base64,${output.data['image/png']}" alt="Matplotlib plot">
                                </div>`;
                            }
                        }
                    });
                }
            }
        });
    
        document.getElementById('notebook-content').innerHTML = notebookContent;
        Prism.highlightAll();
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
