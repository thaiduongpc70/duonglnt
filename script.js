function getProductsFromStorage() {
    const storedProducts = localStorage.getItem('products');
    if (!storedProducts && typeof allProducts !== 'undefined') {
        localStorage.setItem('products', JSON.stringify(allProducts));
        return allProducts;
    }
    try {
        return storedProducts ? JSON.parse(storedProducts) : [];
    } catch (e) {
        console.error("Lỗi khi phân tích cú pháp dữ liệu sản phẩm từ LocalStorage:", e);
        return [];
    }
}

function renderProducts(container, products) {
    if (!container) return;
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

function renderHomepageContent() {
    if (typeof allProducts === 'undefined') {
        console.error("Dữ liệu allProducts chưa được tải. Hãy đảm bảo tệp products-data.js đã được chèn vào HTML.");
        return;
    };

    const featuredGrid = document.getElementById('featured-products-grid');
    const promoGrid = document.getElementById('promo-products-grid');
    const todayDealGrid = document.getElementById('today-deal-grid');
    const superCheapGrid = document.getElementById('super-cheap-grid');
    
    const products = getProductsFromStorage();
    const shuffledProducts = [...products].sort(() => 0.5 - Math.random());

    if (featuredGrid) {
        const mandatoryProductId = 'p44'; // Ví dụ ID sản phẩm bắt buộc (nếu có)
        const mandatoryProduct = products.find(p => p.id === mandatoryProductId);
        const otherProducts = products.filter(p => p.id !== mandatoryProductId);
        // Lấy ngẫu nhiên 7 sản phẩm khác hoặc ít hơn nếu không đủ
        const randomOthers = otherProducts.sort(() => 0.5 - Math.random()).slice(0, 7);
        let featuredProducts = mandatoryProduct ? [mandatoryProduct, ...randomOthers] : shuffledProducts.slice(0, 8);
        renderProducts(featuredGrid, featuredProducts.sort(() => 0.5 - Math.random()));
    }

    if (promoGrid) { renderProducts(promoGrid, shuffledProducts.slice(0, 4)); }
    if (todayDealGrid) { renderProducts(todayDealGrid, shuffledProducts.slice(4, 8)); }
    if (superCheapGrid) {
        const cheapestProducts = [...products].sort((a, b) => a.price - b.price).slice(0, 4);
        renderProducts(superCheapGrid, cheapestProducts);
    }
}
function scrollFunctionForBackToTop() {
    const backToTopButton = document.getElementById("backToTop");
    if (!backToTopButton) return;
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopButton.style.display = "flex"; 
    } else {
        backToTopButton.style.display = "none"; 
    }
}

document.addEventListener("DOMContentLoaded", function() {

    const slides = document.querySelectorAll(".slide-image");
    if (slides.length > 1) {
        let currentSlide = 0;
        slides[currentSlide].classList.add('active');
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 4000);
    }
    renderHomepageContent();
    const backToTopButton = document.getElementById("backToTop");

    if (backToTopButton) { 
        window.onscroll = scrollFunctionForBackToTop;
        backToTopButton.addEventListener("click", function() {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
});
window.addEventListener('storage', (event) => {
    if (event.key === 'products') {
        console.log("Phát hiện thay đổi sản phẩm từ tab khác, đang tự động cập nhật...");
        renderHomepageContent();
    }
});