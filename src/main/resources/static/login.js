document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const messageDiv = document.createElement('div');
    messageDiv.id = 'message';
    document.querySelector('.login-form').appendChild(messageDiv);

    try {
        const response = await fetch('http://localhost:8090/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const result = await response.json();
        if (response.ok) {
            messageDiv.textContent = 'Login successful!';
            messageDiv.style.color = 'green';
            localStorage.setItem('user', JSON.stringify({ loggedIn: true, username, role: result.role })); // Store role
            if (rememberMe) {
                localStorage.setItem('rememberedUsername', username);
            } else {
                localStorage.removeItem('rememberedUsername');
            }
            if(result.role === 'ADMIN'){
                setTimeout(() => window.location.href = 'http://localhost:8090/admin.html', 1000);
                localStorage.removeItem('role');


            }
            else{
            const redirectUrl = localStorage.getItem('redirectAfterLogin') || 'index.html';
                                    localStorage.removeItem('redirectAfterLogin');
                                    setTimeout(() => window.location.href = redirectUrl, 1000);
            }




        } else {
            messageDiv.textContent = result.error || 'Invalid username or password';
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Login Error:', error);
        messageDiv.textContent = `Error: Could not connect to server (${error.message})`;
        messageDiv.style.color = 'red';
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
        document.getElementById('username').value = rememberedUsername;
        document.getElementById('rememberMe').checked = true;
    }

    document.querySelector('.forgot-password').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Forgot Password functionality is not implemented yet. Please contact support.');
    });
});