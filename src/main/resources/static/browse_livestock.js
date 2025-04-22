document.addEventListener('DOMContentLoaded', function() {
    // Fetch livestock listings from the backend
    async function fetchLivestockListings() {
        try {
            const response = await fetch("http://localhost:8090/livestock/all", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` // Include JWT if available
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