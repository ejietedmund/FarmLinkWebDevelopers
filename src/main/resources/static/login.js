document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const messageDiv = document.createElement('div'); // Create a message div dynamically
    messageDiv.id = 'message';
    document.querySelector('.login-form').appendChild(messageDiv);

    try {
        const response = await fetch('http://localhost:8081/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const result = await response.text(); // Use text() since the response is plain text
        messageDiv.textContent = result;
        if (response.ok) {
            messageDiv.style.color = 'green';
            // Store username in localStorage if "Remember Me" is checked
            if (rememberMe) {
                localStorage.setItem('rememberedUsername', username);
            } else {
                localStorage.removeItem('rememberedUsername');
            }
            // Redirect to a dashboard or home page
            setTimeout(() => window.location.href = 'http://localhost:8081/index.html', 1000);
        } else {
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        messageDiv.textContent = 'Error: Could not connect to server';
        messageDiv.style.color = 'red';
    }
});

// Pre-fill username if "Remember Me" was previously checked
window.addEventListener('DOMContentLoaded', () => {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
        document.getElementById('username').value = rememberedUsername;
        document.getElementById('rememberMe').checked = true;
    }

    // Handle "Forgot Password" link (placeholder functionality)
    document.querySelector('.forgot-password').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Forgot Password functionality is not implemented yet. Please contact support.');
        // Future implementation: redirect to a password reset page or show a modal
    });
});