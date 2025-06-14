// auth.js (Chỉ phần liên quan đến đăng ký đã được chỉnh sửa)

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterBtn = document.getElementById('show-register-btn');
    const showLoginBtn = document.getElementById('show-login-btn');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const alertOverlay = document.getElementById('custom-alert-overlay');
    const alertIcon = document.getElementById('alert-icon');
    const alertMessage = document.getElementById('alert-message');
    const alertCloseBtn = document.getElementById('alert-close-btn');

    // Hàm để lấy và lưu Dashboard Stats
    const getDashboardStats = () => {
        // Sử dụng defaultDashboardStats từ dashboard-data.js nếu không có trong Local Storage
        const storedStats = localStorage.getItem('dashboardStats');
        if (!storedStats && typeof defaultDashboardStats !== 'undefined') {
            localStorage.setItem('dashboardStats', JSON.stringify(defaultDashboardStats));
            return defaultDashboardStats;
        }
        try {
            return storedStats ? JSON.parse(storedStats) : {};
        } catch (e) {
            console.error("Lỗi khi đọc dashboardStats từ localStorage:", e);
            return {};
        }
    };
    const saveDashboardStats = (stats) => localStorage.setItem('dashboardStats', JSON.stringify(stats));

    function showAlert(message, type) {
        alertIcon.className = 'fa-solid'; // Reset classes
        if (type === 'success') {
            alertIcon.classList.add('fa-circle-check');
            alertIcon.style.color = '#28a745';
        } else if (type === 'error') {
            alertIcon.classList.add('fa-circle-xmark');
            alertIcon.style.color = '#dc3545';
        } else {
            alertIcon.classList.add('fa-circle-info');
            alertIcon.style.color = '#007bff';
        }
        alertMessage.textContent = message;
        alertOverlay.classList.remove('hidden');
    }

    if (alertCloseBtn) {
        alertCloseBtn.addEventListener('click', () => {
            alertOverlay.classList.add('hidden');
        });
    }
    if (alertOverlay) {
        alertOverlay.addEventListener('click', (e) => {
            if (e.target === alertOverlay) {
                alertOverlay.classList.add('hidden');
            }
        });
    }

    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginView.style.display = 'none';
            registerView.style.display = 'block';
        });
    }
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            registerView.style.display = 'none';
            loginView.style.display = 'block';
        });
    }

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', () => {
            const targetId = icon.dataset.target;
            const passwordInput = document.getElementById(targetId);
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    });

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = document.getElementById('login-phone').value;
            const password = document.getElementById('login-password').value;
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.phone === phone && u.password === password);

            if (user) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify({ name: user.name, phone: user.phone, email: user.email }));
                showAlert('Đăng nhập thành công!', 'success');
                setTimeout(() => {
                    const redirectUrl = localStorage.getItem('checkoutRedirect') || 'index.html';
                    localStorage.removeItem('checkoutRedirect');
                    window.location.href = redirectUrl;
                }, 1500);
            } else {
                showAlert('Số điện thoại hoặc mật khẩu không đúng.', 'error');
            }
        });
    }

    // Register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phone = document.getElementById('register-phone').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            let users = JSON.parse(localStorage.getItem('users')) || [];

            if (password !== confirmPassword) {
                showAlert('Mật khẩu xác nhận không khớp.', 'error');
                return;
            }
            if (users.some(u => u.phone === phone)) {
                showAlert('Số điện thoại này đã được đăng ký.', 'error');
                return;
            }

            const newUser = { phone, password };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            // Cập nhật số liệu Dashboard: Tăng số lượng hội viên mới
            let dashboardStats = getDashboardStats();
            dashboardStats.newMembers = (dashboardStats.newMembers || 0) + 1;
            saveDashboardStats(dashboardStats); // Lưu lại stats đã cập nhật

            showAlert('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
            setTimeout(() => {
                registerForm.reset();
                loginView.style.display = 'block';
                registerView.style.display = 'none';
            }, 1500);
        });
    }
});