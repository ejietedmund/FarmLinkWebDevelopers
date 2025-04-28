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

    // Handle contact form submission
    const contactForm = document.querySelector('.contact-form');
    const sendButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

    if (contactForm && sendButton) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fullName = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            if (!fullName || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }

            // Show "Sending email..." and disable the button
            const originalButtonText = sendButton.textContent;
            sendButton.textContent = 'Sending email...';
            sendButton.disabled = true;

            try {
                const response = await fetch('http://localhost:8090/support/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fullName,
                        email,
                        message
                    })
                });

                // Read the response body as text (only once)
                const responseText = await response.text();

                // Check if the response is OK
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status} - ${responseText}`);
                }

                // Try to parse the response text as JSON
                let result;
                try {
                    result = JSON.parse(responseText);
                } catch (jsonError) {
                    // If JSON parsing fails, use the raw text to check for success
                    if (responseText.includes("Message sent successfully")) {
                        alert('Thank you! Your message has been sent successfully.');
                        contactForm.reset();
                        return;
                    }
                    throw new Error('Invalid response format from server: ' + responseText);
                }

                // If JSON parsing succeeded, check the result
                if (result === "Message sent successfully") {
                    alert('Thank you! Your message has been sent successfully.');
                    contactForm.reset();
                } else {
                    throw new Error('Unexpected response: ' + responseText);
                }
            } catch (error) {
                alert('Error: ' + error.message);
            } finally {
                // Restore the button state
                sendButton.textContent = originalButtonText;
                sendButton.disabled = false;
            }
        });
    }
});