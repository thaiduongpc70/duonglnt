document.addEventListener('DOMContentLoaded', () => {
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const showRegisterBtn = document.getElementById('show-register-btn');
    const showLoginBtn = document.getElementById('show-login-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const passwordToggles = document.querySelectorAll('.toggle-password');
    const alertOverlay = document.getElementById('custom-alert-overlay');
    const alertBox = alertOverlay.querySelector('.alert-box');
    const alertIcon = document.getElementById('alert-icon');
    const alertMessage = document.getElementById('alert-message');
    const alertCloseBtn = document.getElementById('alert-close-btn');
    let afterAlertCallback = null; 

    function showCustomAlert(message, type = 'error', callback = null) {
        alertMessage.textContent = message;
        if (type === 'success') {
            alertIcon.className = 'fa-solid fa-circle-check';
            alertBox.className = 'alert-box success';
        } else {
            alertIcon.className = 'fa-solid fa-circle-xmark';
            alertBox.className = 'alert-box error';
        }    
        afterAlertCallback = callback; 
        alertOverlay.classList.remove('hidden');
    }
    alertCloseBtn.addEventListener('click', () => {
        alertOverlay.classList.add('hidden');
        if (typeof afterAlertCallback === 'function') {
            afterAlertCallback();
        }
    });
    if(showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginView.style.display = 'none';
            registerView.style.display = 'block';
        });
    }
    if(showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerView.style.display = 'none';
            loginView.style.display = 'block';
        });
    }
    passwordToggles.forEach(toggle => { /* ... */ });
    if(registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = document.getElementById('register-phone').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;

            if (password !== confirmPassword) {
                showCustomAlert('Mật khẩu xác nhận không khớp!');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users')) || [];

            if (users.some(user => user.phone === phone)) {
                showCustomAlert('Số điện thoại này đã được đăng ký!');
                return;
            }

            users.push({ phone, password });
            localStorage.setItem('users', JSON.stringify(users));
            
            showCustomAlert('Đăng ký thành công! Vui lòng đăng nhập.', 'success', () => {
                registerView.style.display = 'none';
                loginView.style.display = 'block';
                registerForm.reset();
            });
        });
    }
    if(loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = document.getElementById('login-phone').value;
            const password = document.getElementById('login-password').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.phone === phone && u.password === password);

            if (user) {
                localStorage.setItem('isLoggedIn', 'true');
                const returnUrl = localStorage.getItem('checkoutRedirect') || 'index.html';
                localStorage.removeItem('checkoutRedirect');
                
                showCustomAlert('Đăng nhập thành công!', 'success', () => {
                    window.location.href = returnUrl;
                });
            } else {
                showCustomAlert('Số điện thoại hoặc mật khẩu không chính xác!');
            }
        });
    }
});