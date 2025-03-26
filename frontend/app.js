const API_URL = 'http://localhost:3000';

let token = localStorage.getItem('token');

// Обработчики форм
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    };

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        showResult(response.ok ? 'Registration successful' : 'Registration failed');
    } catch (error) {
        showResult('Error: ' + error.message);
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const credentials = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        
        if (response.ok) {
            const data = await response.json();
            token = data.accessToken;
            localStorage.setItem('token', token);
            document.getElementById('getDataBtn').disabled = false;
            showResult('Login successful');
        } else {
            showResult('Login failed');
        }
    } catch (error) {
        showResult('Error: ' + error.message);
    }
});

document.getElementById('getDataBtn').addEventListener('click', async () => {
    try {
        const response = await fetch(`${API_URL}/protected`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            showResult(`Protected data: ${JSON.stringify(data)}`);
        } else {
            showResult('Access denied');
        }
    } catch (error) {
        showResult('Error: ' + error.message);
    }
});

function showResult(message) {
    document.getElementById('result').textContent = message;
}

// Проверка сохраненного токена при загрузке
if (token) {
    document.getElementById('getDataBtn').disabled = false;
}