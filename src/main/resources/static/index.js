document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links > li > a:not(.dropbtn), .nav-actions a, .logo');
    
    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      const linkPage = linkPath.split('/').pop();
      
      if (currentPage === linkPage || 
          (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
      }
    });
  
    // Special handling for dropdown items
    const dropdownItems = document.querySelectorAll('.dropdown-content a');
    dropdownItems.forEach(item => {
      if (currentPage === item.getAttribute('href').split('/').pop()) {
        item.classList.add('active');
        // Also highlight parent "Browse Livestock"
        document.querySelector('.dropbtn').classList.add('active-parent');
      }
    });
  });
document.addEventListener("DOMContentLoaded", function () {
    console.log("FarmLink website loaded");

    // Navigation Toggle (if needed in mobile view)
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector("nav ul");

    if (navToggle) {
        navToggle.addEventListener("click", function () {
            navMenu.classList.toggle("active");
        });
    }

    // Buttons click event
    const browseBtn = document.querySelector(".browse");
    const sellBtn = document.querySelector(".sell");

    if (browseBtn) {
        browseBtn.addEventListener("click", function () {
            window.location.href = "browse.html";
        });
    }

    if (sellBtn) {
        sellBtn.addEventListener("click", function () {
            window.location.href = "sell.html";
        });
    }

    // Registration buttons
    const registerSellerBtn = document.querySelector(".register-seller");
    const registerBuyerBtn = document.querySelector(".register-buyer");

    if (registerSellerBtn) {
        registerSellerBtn.addEventListener("click", function () {
            window.location.href = "register_seller.html";
        });
    }

    if (registerBuyerBtn) {
        registerBuyerBtn.addEventListener("click", function () {
            window.location.href = "register_buyer.html";
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("uploadForm");
    const imageUpload = document.getElementById("imageUpload");
    const imagePreview = document.getElementById("imagePreview");

    // Image Preview Function
    imageUpload.addEventListener("change", function () {
        const file = imageUpload.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview" style="width:100%; height:100%; border-radius:5px;">`;
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.innerHTML = "No image selected";
        }
    });

    // Form Submission & Validation
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const price = document.getElementById("price").value;
        const description = document.getElementById("description").value;
        const location = document.getElementById("location").value;
        const phone = document.getElementById("phone").value;

        if (!price || !description || !location || !phone) {
            alert("Please fill in all fields.");
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }

        alert("Livestock uploaded successfully!");
        form.reset();
        imagePreview.innerHTML = "No image selected";
    });
    function showCategory(category) {
        document.querySelectorAll('.livestock-section').forEach(section => {
            section.style.display = 'none';
        });
        document.getElementById(category).style.display = 'block';
    }

    function showDetails(id) {
        const livestockData = {
            cattle1: {title: "Dairy Cow", image: "cattle.jpg", price: "UGX 2,500,000", desc: "Healthy dairy cow", location: "Mbarara", contact: "+256 700 123 456"},
            goat1: {title: "Boer Goat", image: "goat.jpg", price: "UGX 300,000", desc: "Pure breed Boer goat", location: "Kampala", contact: "+256 789 654 321"},
            sheep1: {title: "Fat-tailed Sheep", image: "sheep.jpg", price: "UGX 400,000", desc: "Fat-tailed sheep", location: "Jinja", contact: "+256 701 456 789"}
        };

        let item = livestockData[id];

        document.getElementById('details-title').innerText = item.title;
        document.getElementById('details-image').src = item.image;
        document.getElementById('details-price').innerText = item.price;
        document.getElementById('details-desc').innerText = item.desc;
        document.getElementById('details-location').innerText = "Location: " + item.location;
        document.getElementById('details-contact').innerText = "Contact: " + item.contact;

        document.getElementById('livestock-details').style.display = 'block';
    }

    function closeDetails() {
        document.getElementById('livestock-details').style.display = 'none';
    }



});


// Get elements
const openModalBtn = document.getElementById('openModalBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalContainer = document.getElementById('modalContainer');
const closeModalBtn = document.getElementById('closeModalBtn');
const loginForm = document.getElementById('loginForm');

// Open Modal
openModalBtn.addEventListener('click', () => {
  modalOverlay.style.display = 'block';
  modalContainer.classList.add('active');
});

// Close Modal
closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

function closeModal() {
  modalOverlay.style.display = 'none';
  modalContainer.classList.remove('active');
}

// Form Submission (example)
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Validate credentials, send data to server, etc.
  alert('Login successful!');
  closeModal();
});

