// Handle image preview and Base64 conversion
    document.getElementById("imageFile").addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const base64String = e.target.result;

                // Show the image preview
                const preview = document.getElementById("previewImage");
                preview.src = base64String;
                preview.style.display = "block";

                // Store the Base64 string in the imageUrl input
                document.getElementById("imageUrl").value = base64String;
            };
            reader.readAsDataURL(file);
        } else {
            showToast("No file selected!");
        }
    });

    // Toast notification function
    function showToast(message) {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.style.display = "block";
        setTimeout(() => {
            toast.style.display = "none";
        }, 3000);
    }

    // Submit the form data to the backend
    async function passDataToSpring() {
        const type = document.getElementById("type").value;
        const phone = document.getElementById("contact").value;
        const description = document.getElementById("description").value;
        const price = document.getElementById("price").value;
        const location = document.getElementById("location").value;
        const imageUrl = document.getElementById("imageUrl").value;
        const name = document.getElementById("name").value;
        const quantity = document.getElementById("quantity").value;
        const email = document.getElementById("email").value;
        const imageFile = document.getElementById("imageFile");

        if (!imageFile.files.length) {
            showToast("Please upload an image!");
            return;
        }

        const requestData = {
            type: type,
            name: name,
            imageUrl: imageUrl,
            location: location,
            price: price,
            quantity: quantity,
            contact: phone,
            email: email,
            description: description
        };

        try {
            const response = await fetch("http://localhost:8090/livestock/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestData)
            });

            if (response.ok) {
                showToast("Livestock uploaded successfully!");
//                document.getElementById("livestockForm").reset();
//                document.getElementById("previewImage").style.display = "none";
                  setTimeout(() => window.location.href = 'http://localhost:8090/browse_livestock.html', 1000);

            } else {
                throw new Error("Failed to save data");
            }
        } catch (error) {
            console.error("Error:", error);
            showToast("Failed to upload livestock data!");
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a, .nav-actions a');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath) {
                link.classList.add('active');
                // If the link is inside a dropdown, add active-parent to the dropbtn
                const dropdown = link.closest('.dropdown');
                if (dropdown) {
                    const dropbtn = dropdown.querySelector('.dropbtn');
                    if (dropbtn) {
                        dropbtn.classList.add('active-parent');
                    }
                }
            }
        });
    });
