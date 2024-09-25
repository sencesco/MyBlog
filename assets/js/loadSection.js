document.addEventListener("DOMContentLoaded", function() {
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
        const savedDarkMode = localStorage.getItem('darkMode');

        if (savedDarkMode === 'true') {
            applyDarkMode();
        } else {
            applyLightMode();
        }
    }

    // Event listener for the dark mode toggle button
    document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);

    // Initialize dark mode based on saved preference
    initializeDarkMode();
});
