document.addEventListener('DOMContentLoaded', function() {
    const livestockType = document.body.getAttribute('data-livestock-type');
    const resultsSection = document.getElementById('results');
    const resultsContainer = document.getElementById('resultsContainer');

    if (!livestockType) {
        console.error('Livestock type not specified in data-livestock-type');
        resultsContainer.innerHTML = '<p>Error: Livestock type not specified.</p>';
        resultsSection.style.display = 'block';
        return;
    }

    console.log('Fetching livestock for type:', livestockType);

    async function fetchLivestockByType() {
        try {
            const response = await fetch(`http://localhost:8090/livestock/type?type=${encodeURIComponent(livestockType)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const livestock = await response.json();
            console.log('Received livestock data:', livestock);

            displayLivestock(livestock, livestockType);
        } catch (error) {
            console.error('Error fetching livestock:', error);
            resultsContainer.innerHTML = '<p>Error loading livestock. Please try again later.</p>';
            resultsSection.style.display = 'block';
        }
    }

    function displayLivestock(livestock, type) {
        console.log('Displaying livestock:', livestock);
        resultsContainer.innerHTML = '';

        if (!livestock || livestock.length === 0) {
            console.log('No livestock to display');
            resultsContainer.innerHTML = '<p>No listings uploaded yet</p>';
            resultsSection.style.display = 'block';
            return;
        }

        livestock.forEach(item => {
            console.log('Rendering livestock item:', item);
            const card = document.createElement('div');
            card.className = 'livestock-card';
            const imageName = item.imagePath ? item.imagePath.split('/').pop() : 'placeholder.jpg';
            const description = item.description || 'No description available';
            card.innerHTML = `
                <img src="http://localhost:8090/livestock/images/${imageName}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
                <h3>${item.name}</h3>
                <p class="price">UGX ${item.price.toLocaleString()}</p>
                <p class="location">${item.location}</p>
                <p class="contact">📞 ${item.contact}</p>
                <p class="description">${description}</p>
            `;
            const link = document.createElement('a');
            link.href = `buyer.html?id=${item.id}`;
            link.className = 'card-link';
            link.appendChild(card);
            resultsContainer.appendChild(link);
        });

        console.log('Setting results section to visible');
        resultsSection.style.display = 'block';
    }

    fetchLivestockByType();
});