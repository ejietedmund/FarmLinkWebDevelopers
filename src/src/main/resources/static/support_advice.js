document.addEventListener('DOMContentLoaded', () => {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  // Handle tab switching
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Remove 'active' from all buttons
      tabButtons.forEach((b) => b.classList.remove('active'));
      // Hide all tab contents
      tabContents.forEach((content) => content.classList.remove('active'));

      // Add 'active' to clicked button
      btn.classList.add('active');
      // Show related tab content
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Example: You could add form submission logic for the contact form
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! We will contact you soon.');
      // Reset form or any other logic
      contactForm.reset();
    });
  }
});
