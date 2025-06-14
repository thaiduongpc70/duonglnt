document.addEventListener('DOMContentLoaded', () => {
    // Đảm bảo updateCartCounter có sẵn từ cart.js
    if (typeof updateCartCounter === 'function') {
        updateCartCounter();
    }
    const container = document.querySelector('.cart-page-container');
    if (!container) return; 

    // Các hàm getCart và saveCart được định nghĩa trong cart.js và có thể được sử dụng
    // Bạn cần đảm bảo cart.js được load trước cart-logic.js
    const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];
    const saveCart = (cart) => {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter(); 
        renderInitialPage(); // Gọi lại để render lại giỏ hàng
    };

    function calculateTotals(cart) {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const vat = subtotal * 0.05;
        const shipping = (subtotal >= 300000 || subtotal === 0) ? 0 : 30000;
        let promotionValue = 0;    
        const appliedPromoCode = sessionStorage.getItem('appliedDiscount');
        if (appliedPromoCode && typeof discountCodes !== 'undefined') {
            const promo = discountCodes.find(p => p.code.toLowerCase() === appliedPromoCode.toLowerCase());
            if (promo) {
                if (promo.type === 'GiamPhanTram' || promo.type === 'SieuSaleNgayLe') promotionValue = subtotal * promo.value;
                else if (promo.type === 'GiamTienMat') promotionValue = promo.value;
                else if (promo.type === 'MienPhiVanChuyen') promotionValue = 30000; // Miễn phí vận chuyển
            }
        }
        
        const finalTotal = subtotal + vat + shipping - promotionValue;
        return { subtotal, vat, shipping, promotionValue, finalTotal: Math.max(0, finalTotal) };
    }

    function renderInitialPage() {
        const cart = getCart();

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart-view">
                    <img src="images/empty-cart.png" alt="Giỏ hàng trống" onerror="this.style.display='none'">
                    <p>Giỏ hàng chưa có sản phẩm</p>
                    <a href="index.html" class="back-to-shop-btn">QUAY LẠI MUA HÀNG</a>
                </div>`;
            return;
        } 
        
        const totals = calculateTotals(cart);
        
        let itemsHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}" onerror="this.src='images/placeholder.png';">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p class="item-price">${item.price.toLocaleString('vi-VN')} ₫</p>
                </div>
                <div class="quantity-control">
                    <button class="cart-action-btn" data-action="decrease" data-id="${item.id}">-</button>
                    <input type="text" value="${item.quantity}" readonly>
                    <button class="cart-action-btn" data-action="increase" data-id="${item.id}">+</button>
                </div>
                <button class="cart-action-btn remove-item-btn" data-action="remove" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button>
            </div>
        `).join('');

        container.innerHTML = `
            <h1>Giỏ Hàng Của Bạn</h1>
            <div class="cart-layout">
                <div class="cart-items-panel">${itemsHTML}</div>
                <div class="cart-summary-panel">
                    <h3>Tóm tắt đơn hàng</h3>
                    <div class="summary-details">
                        <div class="summary-line"><span>Tạm tính giỏ hàng</span><span>${totals.subtotal.toLocaleString('vi-VN')} ₫</span></div>
                        <div class="summary-line"><span>Thuế VAT (5%)</span><span>${totals.vat.toLocaleString('vi-VN')} ₫</span></div>
                        <div class="summary-line"><span>Phí vận chuyển</span><span>${totals.shipping.toLocaleString('vi-VN')} ₫</span></div>
                        <div class="summary-line"><span>Khuyến mại</span><span>-${totals.promotionValue.toLocaleString('vi-VN')} ₫</span></div>
                        <hr>
                        <div class="summary-line total-line"><span>Thành tiền</span><span>${totals.finalTotal.toLocaleString('vi-VN')} ₫</span></div>
                        <p class="vat-notice">(Giá đã bao gồm VAT)</p>
                    </div>
                    <p class="free-ship-notice" id="free-ship-notice"></p>
                    <div class="summary-actions">
                        <button class="promo-code-btn"><i class="fa-solid fa-ticket"></i> Mã Giảm Giá</button>
                        <div class="promo-input-container"><input type="text" id="promo-code-input" placeholder="Nhập mã giảm giá"><button id="apply-promo-btn">Áp dụng</button></div>
                        <div id="promo-feedback"></div>
                        <a href="thanh-toan.html" id="checkout-link" class="checkout-btn">
                            <span>THANH TOÁN</span>
                            <span class="total-in-btn">${totals.finalTotal.toLocaleString('vi-VN')} ₫</span>
                        </a>
                    </div>
                </div>
            </div>`;
        
        updateDynamicElements(totals);
        addEventListeners();
    }

    function addEventListeners() {
        const cartItemsPanel = document.querySelector('.cart-items-panel');
        if (cartItemsPanel) {
            cartItemsPanel.addEventListener('click', (e) => {
                const button = e.target.closest('.cart-action-btn');
                if (button) {
                    const productId = button.dataset.id;
                    const action = button.dataset.action;
                    handleCartAction(productId, action);
                }
            });
        }
        const promoBtn = document.querySelector('.promo-code-btn');
        if(promoBtn) promoBtn.addEventListener('click', () => {
            document.querySelector('.promo-input-container').classList.toggle('active');
        });

        const applyBtn = document.getElementById('apply-promo-btn');
        if(applyBtn) applyBtn.addEventListener('click', applyPromoCode);
    }

    function handleCartAction(productId, action) {
        let cart = getCart();
        const productIndex = cart.findIndex(item => item.id === productId);

        if (productIndex === -1) return;

        // Cần lấy thông tin tồn kho mới nhất để kiểm tra
        const productsFromStorage = JSON.parse(localStorage.getItem('products')) || [];
        const productInStock = productsFromStorage.find(p => p.id === productId);

        if (action === 'increase') {
            // Chỉ tăng nếu còn hàng trong kho
            if (productInStock && (cart[productIndex].quantity + 1) > productInStock.quantity) {
                alert(`Không đủ hàng trong kho cho sản phẩm ${productInStock.name}. Tối đa ${productInStock.quantity} sản phẩm.`);
                return;
            }
            cart[productIndex].quantity++;
        } else if (action === 'decrease') {
            cart[productIndex].quantity--;
            if (cart[productIndex].quantity <= 0) {
                cart.splice(productIndex, 1);
            }
        } else if (action === 'remove') {
            cart.splice(productIndex, 1);
        }
        
        saveCart(cart); // saveCart sẽ gọi renderInitialPage()
    }

    function applyPromoCode() {
        const codeInput = document.getElementById('promo-code-input');
        const code = codeInput.value.trim();
        const promoFeedback = document.getElementById('promo-feedback');

        if (typeof discountCodes === 'undefined' || discountCodes.length === 0) {
            promoFeedback.textContent = 'Chưa có mã giảm giá nào.';
            promoFeedback.className = 'error';
            return;
        }

        const promo = discountCodes.find(p => p.code.toLowerCase() === code.toLowerCase());

        if (promo) {
            sessionStorage.setItem('appliedDiscount', code);
            promoFeedback.textContent = 'Mã giảm giá đã được áp dụng!';
            promoFeedback.className = 'success';
        } else {
            sessionStorage.removeItem('appliedDiscount');
            promoFeedback.textContent = 'Mã giảm giá không hợp lệ.';
            promoFeedback.className = 'error';
        }
        renderInitialPage(); // Render lại trang để cập nhật tổng tiền
    }

    function updateDynamicElements(totals) {
        const freeShipNotice = document.getElementById('free-ship-notice');
        if (!freeShipNotice) return;

        const remainingForFreeShip = 300000 - totals.subtotal;
        if (remainingForFreeShip > 0) {
            freeShipNotice.innerHTML = `Mua thêm <b>${remainingForFreeShip.toLocaleString('vi-VN')} ₫</b> để miễn phí giao hàng`;
            freeShipNotice.style.display = 'block';
        } else {
            freeShipNotice.style.display = 'none';
        }

        // Cập nhật tổng tiền trên nút THANH TOÁN
        const checkoutTotalInBtn = document.querySelector('#checkout-link .total-in-btn');
        if (checkoutTotalInBtn) {
            checkoutTotalInBtn.textContent = totals.finalTotal.toLocaleString('vi-VN') + ' ₫';
        }
    }

    // Lắng nghe sự kiện storage để cập nhật giỏ hàng khi có thay đổi sản phẩm/tồn kho từ tab khác
    window.addEventListener('storage', (event) => {
        if (event.key === 'products' || event.key === 'cart') { // Nếu products hoặc cart thay đổi
            console.log("Phát hiện thay đổi sản phẩm/giỏ hàng từ tab khác, đang tự động cập nhật giỏ hàng...");
            renderInitialPage(); // Gọi render chính để cập nhật cả giỏ hàng và tổng tiền
        }
    });

    // Chạy hàm render chính khi trang được tải
    renderInitialPage();
});