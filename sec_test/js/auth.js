document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const userInfo = document.getElementById('userInfo');

    // Обработка формы входа
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            authenticateUser(username, password);
        });
    }

    // Обработка формы регистрации
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            registerUser(username, password);
        });
    }

    // Проверка токена и загрузка информации о пользователе
    if (userInfo) {
        const token = localStorage.getItem('jwt');
        if (token) {
            fetchUserInfo(token);
        } else {
            window.location.href = 'login.html'; // Если токена нет, перенаправляем на страницу входа
        }
    }
});

// Функция для аутентификации пользователя
function authenticateUser(username, password) {
    fetch('https://98db08d005dd9d44a99a42a9ca52d2d0.serveo.net/api/auth/login', { // Убедитесь, что URL правильный
        method: 'POST', // Метод должен быть POST
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка аутентификации: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data.token) {
            localStorage.setItem('jwt', data.token); // Сохраняем токен в localStorage
            window.location.href = 'profile.html'; // Перенаправляем на страницу профиля
        } else {
            alert('Ошибка: токен не получен');
        }
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert(error.message);
    });
}

// Функция для регистрации пользователя
function registerUser(username, password) {
    fetch('https://98db08d005dd9d44a99a42a9ca52d2d0.serveo.net/api/auth/register', { // Убедитесь, что URL правильный
        method: 'POST', // Метод должен быть POST
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка регистрации: ' + response.statusText);
        }
        return response.text();
    })
    .then(data => {
        alert(data); // Показываем сообщение об успешной регистрации
        window.location.href = 'login.html'; // Перенаправляем на страницу входа
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert(error.message);
    });
}

// Функция для получения информации о пользователе
function fetchUserInfo(token) {
    fetch('https://98db08d005dd9d44a99a42a9ca52d2d0.serveo.net/api/users/me', { // Убедитесь, что URL правильный
        method: 'GET', // Метод должен быть GET
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Ошибка при получении информации о пользователе: ' + response.statusText);
        }
        return response.text();
    })
    .then(data => {
        document.getElementById('userInfo').textContent = data; // Отображаем информацию о пользователе
    })
    .catch(error => {
        console.error('Ошибка:', error);
        alert(error.message);
        window.location.href = 'login.html'; // Перенаправляем на страницу входа при ошибке
    });
}