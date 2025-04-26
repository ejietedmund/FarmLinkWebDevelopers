document.addEventListener('DOMContentLoaded', function() {
    // Fetch livestock listings from the backend
    async function fetchLivestockListings() {
        try {
            const response = await fetch("http://localhost:8090/livestock/all", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const livestockList = await response.json();
            displayLivestockListings(livestockList);
        } catch (error) {
            console.error("Error fetching listings:", error);
            const container = document.getElementById("livestockContainer");
            container.innerHTML = "<p>Failed to load listings. Please try again later.</p>";
        }
    }

    // Display the listings on the page
    function displayLivestockListings(livestockList) {
        const container = document.getElementById("livestockContainer");
        container.innerHTML = ""; // Clear existing content

        if (!livestockList || livestockList.length === 0) {
            container.innerHTML = "<p>No listings available.</p>";
            return;
        }

        livestockList.forEach(item => {
            const card = document.createElement("div");
            card.className = "livestock-card";
            const imageName = item.imagePath ? item.imagePath.split("/").pop() : 'placeholder.jpg';
            const description = item.description || 'No description available';
            card.innerHTML = `
                <img src="http://localhost:8090/api/images/${imageName}" alt="${item.type}"
                     onerror="this.src='https://via.placeholder.com/150?text=No+Image'; console.log('Image failed to load: ${imageName}')">
                <h3>${description}</h3>
                <p class = "quantity">Quantity: ${item.quantity.toLocaleString()}<p/>
                <p class="price">UGX ${item.price.toLocaleString()}</p>

                <p class="location">${item.location}</p>
                <p class="contact">📞 ${item.contact}</p>
            `;
            const link = document.createElement("a");
            link.href = `buyer.html?id=${item.id}`;
            link.className = "card-link";
            link.appendChild(card);
            container.appendChild(link);
        });
    }

    // Fetch listings when the page loads
    fetchLivestockListings();


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
