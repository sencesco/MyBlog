document.addEventListener("DOMContentLoaded", function() {
    function loadHTML(sectionId, url) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById(sectionId).innerHTML = data;
                if (sectionId === 'sidebar') {
                    initializeDarkModeToggle(); // Reinitialize dark mode script
                }
            })
            .catch(error => console.error(`Error loading ${url}:`, error));
    }

    // Function to toggle dark mode
    function toggleDarkMode() {
        const body = document.body;
        const sidebar = document.querySelector('.sidebar');
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const darkModeIcon = document.getElementById('dark-mode-icon');

        body.classList.toggle('dark-mode');
        sidebar.classList.toggle('dark-mode');

        // Update tooltip text and icon
        if (body.classList.contains('dark-mode')) {
            darkModeToggle.setAttribute('data-tooltip', 'Switch to light mode');
            darkModeIcon.textContent = 'light_mode';
        } else {
            darkModeToggle.setAttribute('data-tooltip', 'Switch to dark mode');
            darkModeIcon.textContent = 'dark_mode';
        }

        // Save the current mode to localStorage
        localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    }

    // Function to apply dark mode
    function applyDarkMode() {
        const body = document.body;
        const sidebar = document.querySelector('.sidebar');
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const darkModeIcon = document.getElementById('dark-mode-icon');

        body.classList.add('dark-mode');
        sidebar.classList.add('dark-mode');
        darkModeToggle.setAttribute('data-tooltip', 'Switch to light mode');
        darkModeIcon.textContent = 'light_mode';
    }

    // Function to apply light mode
    function applyLightMode() {
        const body = document.body;
        const sidebar = document.querySelector('.sidebar');
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const darkModeIcon = document.getElementById('dark-mode-icon');

        body.classList.remove('dark-mode');
        sidebar.classList.remove('dark-mode');
        darkModeToggle.setAttribute('data-tooltip', 'Switch to dark mode');
        darkModeIcon.textContent = 'dark_mode';
    }

    // Function to initialize dark mode
    function initializeDarkMode() {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        const savedDarkMode = localStorage.getItem('darkMode');

        if (savedDarkMode === 'true') {
            applyDarkMode();
        } else {
            applyLightMode();
        }

        darkModeToggle.addEventListener('click', toggleDarkMode);
    }

    // Initialize dark mode as soon as possible
    (function() {
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
            document.body.classList.add('dark-mode');
        }
    })();

    // Initialize dark mode when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', initializeDarkMode);

    // Re-initialize dark mode when the sidebar is loaded
    function initializeDarkModeToggle() {
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('click', toggleDarkMode);
        }
        
        // Apply the correct mode based on saved preference
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode === 'true') {
            applyDarkMode();
        } else {
            applyLightMode();
        }
    }

    // Load sidebar and pwd_man content with corrected paths
    loadHTML('sidebar', '/templates/sidebar.html');
    loadHTML('footer', '/templates/footer.html');
});
