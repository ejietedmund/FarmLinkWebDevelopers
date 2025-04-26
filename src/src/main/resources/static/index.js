document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResultsSection = document.getElementById('searchResults');
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const livestockContainer = document.querySelector('.featured .livestock-container'); // Updated selector
    const navActions = document.getElementById('navActions');

    console.log('Livestock Container:', livestockContainer);
    if (!livestockContainer) {
        console.error('Error: .featured .livestock-container element not found in the DOM');
        return;
    }

    console.log('Nav Actions:', navActions);
    if (!navActions) {
        console.error('Error: #navActions element not found in the DOM');
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.loggedIn) {
        const logoutButton = document.createElement('a');
        logoutButton.href = '#';
        logoutButton.className = 'nav-button';
        logoutButton.textContent = 'Logout';
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('user');
            localStorage.removeItem('rememberedUsername');
            window.location.href = 'index.html';
        });
        navActions.appendChild(logoutButton);
    } else {
        const loginButton = document.createElement('a');
        loginButton.href = 'login.html';
        loginButton.className = 'nav-button';
        loginButton.textContent = 'Login';
        navActions.appendChild(loginButton);

        const registerButton = document.createElement('a');
        registerButton.href = 'register.html';
        registerButton.className = 'nav-button';
        registerButton.textContent = 'Register';
        navActions.appendChild(registerButton);
    }

    searchButton.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
            searchLivestock(query);
        }
    });

    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                searchLivestock(query);
            }
        }
    });

    async function searchLivestock(query) {
        try {
            const response = await fetch(`/livestock/search?query=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const livestock = await response.json();
            console.log('Search Results:', livestock);
            displaySearchResults(livestock, query);
        } catch (error) {
            console.error('Error fetching search results:', error);
            searchResultsContainer.innerHTML = '<p>Error loading search results. Please try again later.</p>';
            searchResultsSection.style.display = 'block';
        }
    }

    function displaySearchResults(livestock, query) {
        searchResultsContainer.innerHTML = '';

        const summary = document.createElement('p');
        summary.className = 'search-summary';
        summary.textContent = livestock && livestock.length > 0
            ? `Found ${livestock.length} result${livestock.length === 1 ? '' : 's'} for "${query}"`
            : `No search results found for "${query}"`;
        searchResultsContainer.appendChild(summary);

        if (!livestock || livestock.length === 0) {
            searchResultsSection.style.display = 'block';
            return;
        }

        livestock.forEach(item => {
            const card = document.createElement('div');
            card.className = 'livestock-card';
            const imageName = item.imagePath ? item.imagePath.split('/').pop() : 'placeholder.jpg';
            const description = item.description || 'No description available';
            const displayName = item.description ? item.description.split(',')[0] : item.name;
            card.innerHTML = `
                <img src="/livestock/images/${imageName}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
                <h3>${displayName}</h3>
                <p class = "quantity">Quantity: ${item.quantity.toLocaleString()}</p>
                <p class="price">UGX ${item.price.toLocaleString()}</p>
                <p class="location">${item.location}</p>
                <p class="contact">📞 ${item.contact}</p>
                <p class="description">${description}</p>
            `;
            const link = document.createElement('a');
            link.href = `buyer.html?id=${item.id}`;
            link.className = 'card-link';
            link.appendChild(card);
            searchResultsContainer.appendChild(link);
        });

        searchResultsSection.style.display = 'block';
        searchResultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    async function fetchFeaturedLivestock() {
        console.log('Fetching featured livestock...');
        livestockContainer.innerHTML = '<p>Loading featured livestock...</p>';

        try {
            const response = await fetch('/livestock/all', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const livestockList = await response.json();
            console.log('Fetched Livestock:', livestockList);

            if (!Array.isArray(livestockList) || livestockList.length === 0) {
                console.log('No livestock data to display');
                livestockContainer.innerHTML = '<p>No featured livestock available at the moment.</p>';
                return;
            }

            console.log('Sorting and slicing livestock list...');
            const sortedList = livestockList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const featuredList = sortedList.slice(0, 3);
            console.log('Featured List:', featuredList);

            livestockContainer.innerHTML = '';

            featuredList.forEach(item => {
                console.log('Rendering card for:', item);
                const cardLink = document.createElement('a');
                cardLink.href = `buyer.html?id=${item.id}`;
                cardLink.className = 'card-link';

                const card = document.createElement('div');
                card.className = 'livestock-card';

                const imageName = item.imagePath ? item.imagePath.split('/').pop() : 'placeholder.jpg';
                const imageUrl = `/livestock/images/${imageName}`;
                const displayName = item.description ? item.description.split(',')[0] : item.name;

                card.innerHTML = `
                    <img src="${imageUrl}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
                    <h3>${displayName}</h3>
                    <p class = "quantity">Quantity: ${item.quantity.toLocaleString()}</p>
                    <p class="price">UGX ${item.price.toLocaleString()}</p>
                    <p class="location">${item.location}</p>
                    <p class="contact">📞 ${item.contact}</p>
                `;

                cardLink.appendChild(card);
                livestockContainer.appendChild(cardLink);
            });

            if (sortedList.length > 3) {
                console.log('Adding View More link...');
                const viewMoreLink = document.createElement('a');
                viewMoreLink.href = 'browse_livestock.html';
                viewMoreLink.className = 'view-more';
                viewMoreLink.textContent = 'View More Listings';
                viewMoreLink.style.display = 'block';
                viewMoreLink.style.textAlign = 'center';
                viewMoreLink.style.marginTop = '20px';
                viewMoreLink.style.color = '#007bff';
                viewMoreLink.style.textDecoration = 'none';
                livestockContainer.appendChild(viewMoreLink);
            }
        } catch (error) {
            console.error('Error fetching featured livestock:', error);
            livestockContainer.innerHTML = '<p>Error loading featured livestock. Please try again later.</p>';
        }
    }

    fetchFeaturedLivestock();
});