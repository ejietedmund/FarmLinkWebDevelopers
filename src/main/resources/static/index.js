document.addEventListener('DOMContentLoaded', function() {
    // Get the current page filename (e.g., "index.html", "browse_livestock.html")
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Select all navigation links (including logo, top-level nav links, and dropdown items)
    const logoLink = document.querySelector('.logo');
    const navLinks = document.querySelectorAll('.nav-links > li > a');
    const dropdownItems = document.querySelectorAll('.dropdown-content a');
    const navActionsLinks = document.querySelectorAll('.nav-actions a');

    // Function to remove 'active' class from all links
    function clearActiveClasses() {
        logoLink.classList.remove('active');
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.classList.remove('active-parent');
        });
        dropdownItems.forEach(item => item.classList.remove('active'));
        navActionsLinks.forEach(link => link.classList.remove('active'));
    }

    // Function to set the active link
    function setActiveLink(link, isDropdownParent = false) {
        clearActiveClasses();
        if (isDropdownParent) {
            link.classList.add('active-parent');
        } else {
            link.classList.add('active');
        }
    }

    // Highlight the logo if on the homepage
    if (currentPage === 'index.html' || currentPage === '') {
        setActiveLink(logoLink);
    }

    // Highlight top-level nav links (e.g., "Sell Livestock", "Partners", "Support & Advice")
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (currentPage === linkPage) {
            const isDropdown = link.classList.contains('dropbtn');
            setActiveLink(link, isDropdown);
        }
    });

    // Highlight dropdown items under "Browse Livestock"
    dropdownItems.forEach(item => {
        const itemPage = item.getAttribute('href').split('/').pop();
        if (currentPage === itemPage) {
            item.classList.add('active');
            const dropbtn = document.querySelector('.dropbtn');
            setActiveLink(dropbtn, true);
        }
    });

    // Highlight nav-actions links (e.g., "About Us", "Login", "Register")
    navActionsLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (currentPage === linkPage) {
            setActiveLink(link);
        }
    });
});
