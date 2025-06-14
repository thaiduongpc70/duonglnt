document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkout-form');
    const qrModal = document.getElementById('qr-modal');
    const successOverlay = document.getElementById('success-overlay');

    // Thêm các biến cho alert tùy chỉnh
    const customAlertOverlay = document.getElementById('custom-alert-overlay');
    const alertIcon = document.getElementById('alert-icon');
    const alertMessage = document.getElementById('alert-message');
    const alertCloseBtn = document.getElementById('alert-close-btn');

    if (!checkoutForm) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => (sum + item.price * item.quantity), 0);
    const shipping = (subtotal >= 300000 || subtotal === 0) ? 0 : 30000;
    const total = subtotal + shipping;

    document.getElementById('checkout-subtotal').textContent = `${subtotal.toLocaleString('vi-VN')} ₫`;
    document.getElementById('checkout-shipping').textContent = `${shipping.toLocaleString('vi-VN')} ₫`;
    document.getElementById('checkout-total').textContent = `${total.toLocaleString('vi-VN')} ₫`;

    const getProductsFromStorage = () => JSON.parse(localStorage.getItem('products')) || [];
    const saveProductsToStorage = (products) => localStorage.setItem('products', JSON.stringify(products));

    // Hàm showAlert tùy chỉnh
    function showAlert(message, type = 'info', callback = null) { // Thêm callback để thực hiện hành động sau khi alert đóng
        if (!customAlertOverlay) {
            console.error('custom-alert-overlay not found. Falling back to native alert.');
            alert(message); // Fallback to native alert
            if (callback) callback();
            return;
        }

        alertIcon.className = 'fa-solid';
        if (type === 'success') {
            alertIcon.classList.add('fa-circle-check');
            alertIcon.style.color = '#28a745';
        } else if (type === 'error') {
            alertIcon.classList.add('fa-circle-xmark');
            alertIcon.style.color = '#dc3545';
        } else { // default to info
            alertIcon.classList.add('fa-circle-info');
            alertIcon.style.color = '#007bff';
        }
        alertMessage.textContent = message;
        customAlertOverlay.classList.remove('hidden');

        // Gán lại sự kiện click cho nút OK để đảm bảo chỉ thực hiện hành động một lần và đúng hành động
        if (alertCloseBtn) {
            alertCloseBtn.onclick = () => {
                customAlertOverlay.classList.add('hidden');
                if (callback) callback();
            };
        }
        // Đóng alert khi click ra ngoài hộp alert
        customAlertOverlay.onclick = (e) => {
            if (e.target === customAlertOverlay) {
                customAlertOverlay.classList.add('hidden');
                if (callback) callback();
            }
        };
    }

    function finalizeOrder() {
        // Cập nhật số lượng sản phẩm trong kho (Local Storage)
        let products = getProductsFromStorage();
        cart.forEach(cartItem => {
            const productIndex = products.findIndex(p => p.id === cartItem.id);
            if (productIndex > -1) {
                products[productIndex].quantity = Math.max(0, products[productIndex].quantity - cartItem.quantity);
            }
        });
        saveProductsToStorage(products);

        // Xóa giỏ hàng
        localStorage.removeItem('cart');
        if (typeof updateCartCounter === 'function') {
            updateCartCounter();
        }

        // Chuyển hướng về trang chủ sau một khoảng thời gian
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2500);
    }

    function showSuccessPopup() {
        if (successOverlay) {
            successOverlay.classList.remove('hidden');
        }
        finalizeOrder();
    }

    function handleOnlinePayment() {
        if (!checkoutForm.checkValidity()) {
            showAlert('Vui lòng điền đầy đủ các thông tin giao hàng bắt buộc (*).', 'error'); // Sử dụng showAlert
            checkoutForm.reportValidity(); // Vẫn gọi để trình duyệt hiển thị lỗi form validation
            return;
        }

        if (qrModal) qrModal.classList.remove('hidden');
        
        let countdown = 5;
        const countdownElement = document.getElementById('qr-countdown');
        if(!countdownElement) return;

        countdownElement.textContent = `Đang xử lý trong ${countdown} giây...`;
        const interval = setInterval(() => {
            countdown--;
            countdownElement.textContent = `Đang xử lý trong ${countdown} giây...`;
            if (countdown <= 0) {
                clearInterval(interval);
                if (qrModal) qrModal.classList.add('hidden');
                showSuccessPopup();
            }
        }, 1000);
    }

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (localStorage.getItem('isLoggedIn') !== 'true') {
            // Sử dụng showAlert với callback để chuyển hướng sau khi người dùng click OK
            showAlert('Vui lòng đăng nhập để hoàn tất đơn hàng.', 'error', () => {
                localStorage.setItem('checkoutRedirect', 'thanh-toan.html');
                window.location.href = 'login.html';
            });
            return;
        }

        if (cart.length === 0) {
            showAlert('Giỏ hàng của bạn đang trống!', 'error');
            return;
        }

        const selectedPayment = document.querySelector('input[name="payment"]:checked').value;

        if (selectedPayment === 'online') {
            handleOnlinePayment();
        } else { // Thanh toán khi nhận hàng (COD)
            if (checkoutForm.checkValidity()) {
                showSuccessPopup();
            } else {
                 showAlert('Vui lòng điền đầy đủ các thông tin giao hàng bắt buộc (*).', 'error');
                 checkoutForm.reportValidity();
            }
        }
    });
});