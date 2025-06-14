document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkout-form');
    const qrModal = document.getElementById('qr-modal');
    const successOverlay = document.getElementById('success-overlay'); // Element mới
    if (!checkoutForm) return;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((sum, item) => (sum + item.price * item.quantity), 0);
    const shipping = (subtotal >= 300000 || subtotal === 0) ? 0 : 30000;
    const total = subtotal + shipping; 
    document.getElementById('checkout-subtotal').textContent = `${subtotal.toLocaleString('vi-VN')} ₫`;
    document.getElementById('checkout-shipping').textContent = `${shipping.toLocaleString('vi-VN')} ₫`;
    document.getElementById('checkout-total').textContent = `${total.toLocaleString('vi-VN')} ₫`;
    function finalizeOrder() {
        localStorage.removeItem('cart');
        if (typeof updateCartCounter === 'function') {
            updateCartCounter();
        }
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
            alert('Vui lòng điền đầy đủ các thông tin giao hàng bắt buộc (*).');
            checkoutForm.reportValidity();
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
            alert('Vui lòng đăng nhập để hoàn tất đơn hàng.');
            localStorage.setItem('checkoutRedirect', 'thanh-toan.html');
            window.location.href = 'login.html';
            return;
        }
        if (cart.length === 0) {
            alert('Giỏ hàng của bạn đang trống!');
            return;
        }

        const selectedPayment = document.querySelector('input[name="payment"]:checked').value;

        if (selectedPayment === 'online') {
            handleOnlinePayment();
        } else { 
            if (checkoutForm.checkValidity()) {
                showSuccessPopup();
            } else {
                 alert('Vui lòng điền đầy đủ các thông tin giao hàng bắt buộc (*).');
                 checkoutForm.reportValidity();
            }
        }
    });
});