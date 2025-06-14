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
    let cart = getCart();
    const existingProductIndex = cart.findIndex(item => item.id === productId);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity++;
    } else {
        const newCartItem = { ...productData, quantity: 1 };
        cart.push(newCartItem);
    }

    saveCart(cart);
    showInlineFeedback(buttonElement, '✔ Đã thêm vào giỏ!');
}

function rebindAddToCartButtons() {
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
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
    const searchInput = document.getElementById('search-input');
    const suggestionsContainer = document.getElementById('search-suggestions');

    if (searchInput && suggestionsContainer) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            if (query.length < 2) {
                suggestionsContainer.classList.remove('active');
                return;
            }
            const currentProducts = getProductsFromStorage();
            const matchedProducts = currentProducts.filter(product =>
                product.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(query)
            ).slice(0, 7);

            if (matchedProducts.length > 0) {
                suggestionsContainer.innerHTML = matchedProducts.map(product => {
                    const priceHTML = product.originalPrice
                        ? `<span class="original-price">${product.originalPrice.toLocaleString('vi-VN')} ₫</span> ${product.price.toLocaleString('vi-VN')} ₫`
                        : `${product.price.toLocaleString('vi-VN')} ₫`;

                    return `
                        <a href="products.html?category=${product.categorySlug}" class="suggestion-item" data-product-id="${product.id}">
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
            }
        });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-bar')) {
                suggestionsContainer.classList.remove('active');
            }
        });
    }
});