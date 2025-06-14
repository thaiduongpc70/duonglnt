function getProductsFromStorage() {
    const storedProducts = localStorage.getItem('products');
    if (!storedProducts && typeof allProducts !== 'undefined') {
        localStorage.setItem('products', JSON.stringify(allProducts));
        return allProducts;
    }
    try {
        return storedProducts ? JSON.parse(storedProducts) : [];
    } catch (e) {
        console.error("Lỗi đọc sản phẩm từ localStorage:", e);
        return [];
    }
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
}

function updateCartCounter() {
    const totalQuantity = getCart().reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-counter').forEach(el => {
        if (el) el.textContent = totalQuantity;
    });
}

function showInlineFeedback(buttonElement, message) {
    const feedbackElement = buttonElement.nextElementSibling;
    if (feedbackElement && feedbackElement.classList.contains('add-to-cart-feedback')) {
        feedbackElement.textContent = message;
        feedbackElement.classList.add('active');
        setTimeout(() => {
            feedbackElement.classList.remove('active');
        }, 2000);
    }
}

function addToCart(productId, buttonElement) {
    const currentProducts = getProductsFromStorage();
    const productData = currentProducts.find(p => p.id === productId);
    if (!productData) {
        console.error(`Lỗi: Không tìm thấy sản phẩm với ID: ${productId} trong storage.`);
        return;
    }

    // Kiểm tra số lượng tồn kho trước khi thêm vào giỏ hàng
    if (productData.quantity !== undefined && productData.quantity <= 0) {
        showInlineFeedback(buttonElement, 'Hết hàng!');
        return;
    }

    let cart = getCart();
    const existingProductIndex = cart.findIndex(item => item.id === productId);

    if (existingProductIndex > -1) {
        // Nếu sản phẩm đã có trong giỏ, kiểm tra xem có vượt quá số lượng tồn kho không
        if (productData.quantity !== undefined && (cart[existingProductIndex].quantity + 1) > productData.quantity) {
            showInlineFeedback(buttonElement, 'Không đủ hàng trong kho!');
            return;
        }
        cart[existingProductIndex].quantity++;
    } else {
        // Nếu sản phẩm chưa có trong giỏ, thêm mới (với số lượng 1)
        const newCartItem = { ...productData, quantity: 1 };
        cart.push(newCartItem);
    }

    saveCart(cart);
    showInlineFeedback(buttonElement, '✔ Đã thêm vào giỏ!');
}


function rebindAddToCartButtons() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        // Clone và thay thế nút để loại bỏ các event listener cũ
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.addEventListener('click', (e) => {
            const productId = e.target.dataset.id;
            addToCart(productId, e.target);
        });
    });
}
document.addEventListener('DOMContentLoaded', () => {
    updateCartCounter();
    const searchInput = document.querySelector('.search-bar input[type="text"]'); // Sửa selector
    const suggestionsContainer = document.getElementById('search-suggestions'); // Đảm bảo element này tồn tại

    if (searchInput && suggestionsContainer) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            if (query.length < 2) {
                suggestionsContainer.classList.remove('active');
                suggestionsContainer.innerHTML = ''; // Clear suggestions
                return;
            }
            const currentProducts = getProductsFromStorage();
            const matchedProducts = currentProducts.filter(product =>
                product.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(query)
            ).slice(0, 7); // Giới hạn số lượng gợi ý

            if (matchedProducts.length > 0) {
                suggestionsContainer.innerHTML = matchedProducts.map(product => {
                    const priceHTML = product.originalPrice
                        ? `<span class="original-price">${product.originalPrice.toLocaleString('vi-VN')} ₫</span> ${product.price.toLocaleString('vi-VN')} ₫`
                        : `${product.price.toLocaleString('vi-VN')} ₫`;

                    return `
                        <a href="products.html?category=${product.categorySlug}&product=${product.id}" class="suggestion-item" data-product-id="${product.id}">
                            <img src="${product.img}" alt="${product.name}" onerror="this.style.display='none'">
                            <div class="info">
                                <div class="name">${product.name}</div>
                                <div class="price">${priceHTML}</div>
                            </div>
                        </a>
                    `;
                }).join('');
                suggestionsContainer.classList.add('active');
            } else {
                suggestionsContainer.classList.remove('active');
                suggestionsContainer.innerHTML = '';
            }
        });

        // Đóng gợi ý khi click ra ngoài search bar
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-bar')) {
                suggestionsContainer.classList.remove('active');
            }
        });
    }

    // Lắng nghe sự kiện storage để cập nhật giỏ hàng khi có thay đổi từ tab khác
    window.addEventListener('storage', (event) => {
        if (event.key === 'cart') {
            console.log("Phát hiện thay đổi giỏ hàng từ tab khác, đang tự động cập nhật...");
            updateCartCounter();
            // Nếu đây là trang giỏ hàng, có thể gọi renderInitialPage() từ cart-logic.js nếu nó được include
        }
        // Nếu sản phẩm thay đổi (tồn kho), bạn có thể cần cập nhật các nút "Thêm vào giỏ"
        if (event.key === 'products') {
             console.log("Phát hiện thay đổi sản phẩm từ tab khác, đang cập nhật nút giỏ hàng...");
             // rebindAddToCartButtons(); // Cần đảm bảo hàm này hoạt động tốt và không gây lỗi trùng lặp
        }
    });
});