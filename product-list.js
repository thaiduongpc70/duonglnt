function getProductsFromStorage() {
    const storedProducts = localStorage.getItem('products');
    if (!storedProducts && typeof allProducts !== 'undefined') {
        localStorage.setItem('products', JSON.stringify(allProducts));
        return allProducts;
    }
    try {
        return storedProducts ? JSON.parse(storedProducts) : [];
    } catch (e) { return []; }
}
function renderProducts(container, products) {
    if (!container) return;
    if (products.length === 0) {
        container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Không có sản phẩm trong danh mục này.</p>';
        return;
    }
    container.innerHTML = products.map(product => {
        const priceHTML = product.originalPrice 
            ? `<div class="price-container"><span class="original-price">${product.originalPrice.toLocaleString('vi-VN')}₫</span><span class="sale-price blinking">${product.price.toLocaleString('vi-VN')}₫</span></div>` 
            : `<p class="price">${product.price.toLocaleString('vi-VN')}₫</p>`;
        return `<div class="product-item">
                    <img src="${product.img}" alt="${product.name}" onerror="this.src='images/placeholder.png';">
                    <h3>${product.name}</h3>
                    ${priceHTML}
                    <button class="add-to-cart-btn" data-id="${product.id}">Thêm vào giỏ</button>
                    <div class="add-to-cart-feedback"></div>
                </div>`;
    }).join('');
    if (typeof rebindAddToCartButtons === 'function') {
        rebindAddToCartButtons();
    }
}
function renderCategoryPageContent() {
    const grid = document.getElementById('product-list-grid');
    const title = document.getElementById('category-title');
    const params = new URLSearchParams(window.location.search);
    const categorySlug = params.get('category');

    const products = getProductsFromStorage();
    let productsToShow = [];
    let categoryName = "Tất cả sản phẩm";

    if (categorySlug) {
        productsToShow = products.filter(p => p.categorySlug === categorySlug);
        if (typeof categorySlugs !== 'undefined') {
            const foundCategory = Object.keys(categorySlugs).find(key => categorySlugs[key] === categorySlug);
            if (foundCategory) categoryName = foundCategory;
        }
    } else {
        productsToShow = products;
    }
    
    title.textContent = categoryName;
    document.title = categoryName;
    renderProducts(grid, productsToShow);
}

document.addEventListener('DOMContentLoaded', () => {
    renderCategoryPageContent();
});

window.addEventListener('storage', (event) => {
    if (event.key === 'products') {
        console.log("Phát hiện thay đổi sản phẩm từ tab khác, đang tự động cập nhật...");
        renderCategoryPageContent();
    }
});