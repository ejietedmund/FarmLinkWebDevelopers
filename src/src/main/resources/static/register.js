document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const userName = document.getElementById('userName').value;
    const emailAddress = document.getElementById('emailAddress').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const location = document.getElementById('location').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsCheckbox = document.getElementById('termsCheckbox').checked;

    // Create a message div dynamically
    const messageDiv = document.createElement('div');
    messageDiv.id = 'message';
    document.querySelector('.register-form').appendChild(messageDiv);

    // Validate password confirmation
    if (password !== confirmPassword) {
        messageDiv.textContent = 'Passwords do not match';
        messageDiv.style.color = 'red';
        return;
    }

    // Validate terms checkbox
    if (!termsCheckbox) {
        messageDiv.textContent = 'You must agree to the Terms of Service and Privacy Policy';
        messageDiv.style.color = 'red';
        return;
    }

    try {
        const response = await fetch('http://localhost:8090/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                fullName, 
                username: userName, 
                email: emailAddress, 
                phoneNumber, 
                location, 
                password 
            })
        });
        const result = await response.text(); // Use text() since the response is plain text
        messageDiv.textContent = result;
        if (response.ok) {
            messageDiv.style.color = 'green';
            setTimeout(() => window.location.href = 'http://localhost:8090/login.html', 1000);
        } else {
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        messageDiv.textContent = 'Error: Could not connect to server';
        messageDiv.style.color = 'red';
    }
});

// Real-time password match validation
document.getElementById('confirmPassword').addEventListener('input', () => {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageDiv = document.getElementById('message') || document.createElement('div');
    if (!messageDiv.id) {
        messageDiv.id = 'message';
        document.querySelector('.register-form').appendChild(messageDiv);
    }

    if (password !== confirmPassword) {
        messageDiv.textContent = 'Passwords do not match';
        messageDiv.style.color = 'red';
    } else {
        messageDiv.textContent = '';
    }
});