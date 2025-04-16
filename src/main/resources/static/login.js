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
