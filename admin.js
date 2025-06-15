const PRODUCTS_STORAGE_KEY = 'products';
const CATEGORIES_STORAGE_KEY = 'categories';
const STOCK_IN_SLIPS_STORAGE_KEY = 'stockInSlips';
// const DASHBOARD_STATS_KEY = 'dashboardStats'; // Không cần nếu Dashboard là hardcode

const mockOrders = [
    {id: 'HD001', customer: 'Nguyễn Văn Cường', date: '2025-06-12', total: 185000, status: 'Hoàn thành'},
    {id: 'HD002', customer: 'Trần Thị Lan', date: '2025-06-12', total: 320000, status: 'Hoàn thành'},
    {id: 'HD003', customer: 'Lê Văn Nam', date: '2025-06-11', total: 95000, status: 'Đã hủy'},
    {id: 'HD004', customer: 'Phạm Thị Tú', date: '2025-06-11', total: 540000, status: 'Hoàn thành'},
    {id: 'HD005', customer: 'Vũ Văn Xương', date: '2025-06-10', total: 72000, status: 'Hoàn thành'},
	{id: 'HD006', customer: 'Nguyễn Văn Huy', date: '2025-06-12', total: 25000, status: 'Hoàn thành'},
    {id: 'HD007', customer: 'Trần Quốc Đạt', date: '2025-06-12', total: 380000, status: 'Hoàn thành'},
    {id: 'HD008', customer: 'Lê Văn Minh', date: '2025-06-11', total: 950000, status: 'Đã hủy'},
    {id: 'HD009', customer: 'Trần Mai Lan', date: '2025-06-11', total: 120000, status: 'Hoàn thành'},
    {id: 'HD010', customer: 'Mai Quốc Khánh', date: '2025-06-10', total: 70000, status: 'Hoàn thành'},
];

const mockSuppliers = [
    { id: 'NCC001', name: 'Công ty CP Sữa Việt Nam (Vinamilk)' },
    { id: 'NCC002', name: 'Công ty TNHH Unilever Việt Nam' },
    { id: 'NCC003', name: 'Tập đoàn Masan' },
    { id: 'NCC004', name: 'Tổng công ty Bia - Rượu - Nước giải khát Sài Gòn (Sabeco)' },
    { id: 'NCC005', name: 'Công ty TNHH Nestlé Việt Nam' }
];

let mockStockInSlips = JSON.parse(localStorage.getItem(STOCK_IN_SLIPS_STORAGE_KEY)) || [];

// Dữ liệu doanh thu hardcode cho biểu đồ
const fixedMonthlyRevenueData = {
    labels: ['T1/24', 'T2/24', 'T3/24', 'T4/24', 'T5/24', 'T6/24', 'T7/24', 'T8/24', 'T9/24', 'T10/24', 'T11/24', 'T12/24', 'T1/25', 'T2/25', 'T3/25', 'T4/25', 'T5/25'],
    data: [75000000, 82000000, 90000000, 95000000, 105000000, 110000000, 120000000, 130000000, 140000000, 185000000, 150000000, 90000000, 70000000, 50000000, 60000000, 75000000, 88000000]
};


function showFormFeedback(message, type = 'info') {
    const feedbackElement = document.getElementById('form-feedback');
    if (feedbackElement) {
        feedbackElement.textContent = message;
        feedbackElement.className = 'form-feedback';
        feedbackElement.classList.add(type, 'active');
        setTimeout(() => {
            feedbackElement.classList.remove('active');
        }, 3000);
    }
}

function getProducts() {
    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!storedProducts && typeof allProducts !== 'undefined') {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(allProducts));
        return allProducts;
    }
    try {
        return storedProducts ? JSON.parse(storedProducts) : [];
    } catch (e) {
        console.error("Lỗi khi đọc sản phẩm từ localStorage:", e);
        return [];
    }
}

function saveProducts(products) {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

function getCategories() {
    const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!storedCategories && typeof categorySlugs !== 'undefined') {
        localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categorySlugs));
        return categorySlugs;
    }
    try {
        return storedCategories ? JSON.parse(storedCategories) : {};
    } catch (e) {
        console.error("Lỗi khi đọc danh mục từ localStorage:", e);
        return {};
    }
}

function renderProductsTable() {
    const products = getProducts();
    const tableBody = document.querySelector('#products-table tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    products.forEach(product => {
        const row = tableBody.insertRow();
        row.insertCell().textContent = product.id;
        const imgCell = row.insertCell();
        const img = document.createElement('img');
        img.src = product.img || 'images/placeholder.png';
        img.alt = product.name;
        img.style.width = '50px';
        img.style.height = '50px';
        img.style.objectFit = 'contain';
        imgCell.appendChild(img);
        row.insertCell().textContent = product.name;
        row.insertCell().textContent = product.category;
        row.insertCell().textContent = product.quantity;
        row.insertCell().textContent = product.price.toLocaleString('vi-VN') + '₫';

        const actionsCell = row.insertCell();
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Sửa';
        editBtn.className = 'btn btn-secondary edit-btn';
        editBtn.dataset.id = product.id;
        actionsCell.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Xóa';
        deleteBtn.className = 'btn btn-danger delete-btn';
        deleteBtn.dataset.id = product.id;
        actionsCell.appendChild(deleteBtn);
    });
}

function populateCategoryDropdowns() {
    const categories = getCategories();
    const productCategorySelect = document.getElementById('product-category');
    const editProductCategorySelect = document.getElementById('edit-product-category');

    if (productCategorySelect) productCategorySelect.innerHTML = '';
    if (editProductCategorySelect) editProductCategorySelect.innerHTML = '';

    for (const categoryName in categories) {
        const option1 = document.createElement('option');
        option1.value = categoryName;
        option1.textContent = categoryName;
        if (productCategorySelect) productCategorySelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = categoryName;
        option2.textContent = categoryName;
        if (editProductCategorySelect) editProductCategorySelect.appendChild(option2);
    }
}

function showEditProductModal(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('edit-product-id').value = product.id;
    document.getElementById('edit-product-name').value = product.name;
    document.getElementById('edit-product-price').value = product.price;
    document.getElementById('edit-product-category').value = product.category;
    document.getElementById('edit-product-quantity').value = product.quantity;

    document.getElementById('edit-product-modal').classList.remove('hidden');
}

function deleteProduct(productId) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        let products = getProducts();
        products = products.filter(p => p.id !== productId);
        saveProducts(products);
        renderProductsTable();
        showFormFeedback('Đã xóa sản phẩm thành công.', 'success');
    }
}

function renderStockInHistory() {
    const historyTableBody = document.querySelector('#stock-in-history-table tbody');
    if (!historyTableBody) return;

    mockStockInSlips = JSON.parse(localStorage.getItem(STOCK_IN_SLIPS_STORAGE_KEY)) || [];

    historyTableBody.innerHTML = '';

    if (mockStockInSlips.length === 0) {
        historyTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Chưa có phiếu nhập nào.</td></tr>';
        return;
    }

    mockStockInSlips.forEach(slip => {
        const row = historyTableBody.insertRow();
        row.insertCell().textContent = slip.id;
        row.insertCell().textContent = slip.supplier;
        row.insertCell().textContent = slip.date;
        row.insertCell().textContent = slip.total.toLocaleString('vi-VN') + ' ₫';
    });
}

function populateSuppliersForStockIn() {
    const supplierSelect = document.getElementById('supplier-select');
    if (supplierSelect) {
        supplierSelect.innerHTML = mockSuppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
    }
}

function populateProductsSelectForStockIn() {
    const productSelect = document.getElementById('stock-in-product-select');
    if (productSelect) {
        productSelect.innerHTML = getProducts().map(p => `<option value="${p.id}">${p.name}</option>`).join('');
    }
}

let currentSlipItems = [];
function renderCurrentSlipItems() {
    const slipItemsTableBody = document.querySelector('#slip-items-table tbody');
    const slipTotalAmount = document.getElementById('slip-total-amount');
    if (!slipItemsTableBody || !slipTotalAmount) return;

    let total = 0;
    slipItemsTableBody.innerHTML = currentSlipItems.map((item, index) => {
        const subtotal = item.costPrice * item.quantity;
        total += subtotal;
        return `<tr>
            <td><img src="${item.img || 'images/placeholder.png'}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: contain; margin-right: 10px;">${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.costPrice.toLocaleString('vi-VN')} ₫</td>
            <td>${subtotal.toLocaleString('vi-VN')} ₫</td>
            <td><button type="button" class="remove-slip-item btn-danger" data-index="${index}">×</button></td>
        </tr>`;
    }).join('');
    slipTotalAmount.textContent = total.toLocaleString('vi-VN') + ' ₫';
}

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('isAdminLoggedIn');
            window.location.href = 'admin-login.html';
        });
    }

    // Logic cho Trang Dashboard (sử dụng dữ liệu hardcode)
    if (document.getElementById('monthly-revenue-stat')) {
        // Các số liệu sẽ được lấy trực tiếp từ HTML (đã hardcode)
        // renderHardcodedDashboardStats(); // Không cần gọi hàm này nữa vì giá trị đã có sẵn trong HTML

        const revenueChartCanvas = document.getElementById('revenueChart');
        // Dữ liệu cho biểu đồ cũng sẽ được hardcode trực tiếp ở đây
        const fixedMonthlyRevenueData = {
            labels: ['T1/24', 'T2/24', 'T3/24', 'T4/24', 'T5/24', 'T6/24', 'T7/24', 'T8/24', 'T9/24', 'T10/24', 'T11/24', 'T12/24', 'T1/25', 'T2/25', 'T3/25', 'T4/25', 'T5/25'],
            data: [75000000, 82000000, 90000000, 95000000, 105000000, 110000000, 120000000, 130000000, 140000000, 185000000, 150000000, 90000000, 70000000, 50000000, 60000000, 75000000, 88000000]
        };

        if (revenueChartCanvas && typeof Chart !== 'undefined') {
            new Chart(revenueChartCanvas.getContext('2d'), {
                type: 'line',
                data: {
                    labels: fixedMonthlyRevenueData.labels,
                    datasets: [{
                        label: 'Doanh thu (VND)',
                        data: fixedMonthlyRevenueData.data,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        tension: 0.1
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
        const recentOrdersTable = document.querySelector('#recent-orders-table tbody');
        if (recentOrdersTable && typeof mockOrders !== 'undefined') {
            recentOrdersTable.innerHTML = mockOrders.map(order => `
                <tr>
                    <td>${order.id}</td><td>${order.customer}</td><td>${order.total.toLocaleString('vi-VN')} ₫</td>
                    <td><span class="status ${order.status === 'Hoàn thành' ? 'completed' : 'cancelled'}">${order.status}</span></td>
                </tr>`).join('');
        }
    }

    if (document.getElementById('products-table')) {
        const productsTableBody = document.querySelector('#products-table tbody');
        const addProductFormContainer = document.getElementById('add-product-form-container');
        const showAddFormBtn = document.getElementById('show-add-form-btn');
        const addProductForm = document.getElementById('add-product-form');
        const editModal = document.getElementById('edit-product-modal');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const cancelEditBtn = document.getElementById('cancel-edit-btn');
        const editForm = document.getElementById('edit-product-form');

        if(showAddFormBtn) {
            showAddFormBtn.addEventListener('click', () => {
                addProductFormContainer.style.display = addProductFormContainer.style.display === 'none' ? 'block' : 'none';
            });
        }

        if(addProductForm) {
            addProductForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const products = getProducts();
                const newIdNumber = products.length > 0 ? Math.max(...products.map(p => parseInt(p.id.substring(1)))) + 1 : 1;
                const newId = 'p' + newIdNumber;
                const selectedCategory = document.getElementById('product-category').value;
                const productQuantityInput = document.getElementById('product-quantity');
                const productQuantity = productQuantityInput ? parseInt(productQuantityInput.value) : 0;

                const newProduct = {
                    id: newId,
                    name: document.getElementById('product-name').value,
                    category: selectedCategory,
                    price: parseInt(document.getElementById('product-price').value),
                    quantity: productQuantity,
                    img: `images/${newId}.jpg`,
                    categorySlug: getCategories()[selectedCategory]
                };

                const productImageInput = document.getElementById('product-image');
                if (productImageInput && productImageInput.files.length > 0) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        newProduct.img = event.target.result;
                        products.push(newProduct);
                        saveProducts(products);
                        renderProductsTable();
                        addProductForm.reset();
                        addProductFormContainer.style.display = 'none';
                        showFormFeedback('Đã thêm sản phẩm thành công!', 'success');
                    };
                    reader.readAsDataURL(productImageInput.files[0]);
                } else {
                    products.push(newProduct);
                    saveProducts(products);
                    renderProductsTable();
                    addProductForm.reset();
                    addProductFormContainer.style.display = 'none';
                    showFormFeedback('Đã thêm sản phẩm thành công!', 'success');
                }
            });
        }

        if(productsTableBody) {
            productsTableBody.addEventListener('click', (e) => {
                const button = e.target.closest('button');
                if (!button) return;
                if (button.classList.contains('edit-btn')) showEditProductModal(button.dataset.id);
                if (button.classList.contains('delete-btn')) deleteProduct(button.dataset.id);
            });
        }
        
        if(closeModalBtn) closeModalBtn.addEventListener('click', () => editModal.classList.add('hidden'));
        if(cancelEditBtn) cancelEditBtn.addEventListener('click', () => editModal.classList.add('hidden'));
        if(editModal) editModal.addEventListener('click', (e) => { if (e.target === editModal) editModal.classList.add('hidden'); });

        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const idToUpdate = document.getElementById('edit-product-id').value;
                let products = getProducts();
                const productIndex = products.findIndex(p => p.id === idToUpdate);
                if (productIndex > -1) {
                    products[productIndex].name = document.getElementById('edit-product-name').value;
                    products[productIndex].price = parseInt(document.getElementById('edit-product-price').value);
                    products[productIndex].category = document.getElementById('edit-product-category').value;
                    products[productIndex].categorySlug = getCategories()[products[productIndex].category];
                    products[productIndex].quantity = parseInt(document.getElementById('edit-product-quantity').value);
                    const newImageInput = document.getElementById('edit-product-image');
                    if (newImageInput && newImageInput.files.length > 0) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            products[productIndex].img = event.target.result;
                            saveProducts(products);
                            renderProductsTable();
                            editModal.classList.add('hidden');
                            showFormFeedback('Cập nhật sản phẩm thành công!', 'success');
                        };
                        reader.readAsDataURL(newImageInput.files[0]);
                    } else {
                        saveProducts(products);
                        renderProductsTable();
                        editModal.classList.add('hidden');
                        showFormFeedback('Đã cập nhật sản phẩm thành công!', 'success');
                    }
                }
            });
        }
        
        populateCategoryDropdowns();
        renderProductsTable();
    }

    if (document.getElementById('promotion-form')) {
        const productSelect = document.getElementById('promo-product-select');
        const newPriceInput = document.getElementById('promo-new-price');
        const promotionForm = document.getElementById('promotion-form');
        const removePromoBtn = document.getElementById('remove-promo-btn');
        
        function populatePromoSelect() {
            const products = getProducts();
            productSelect.innerHTML = products.map(p => {
                const displayPrice = p.originalPrice ? p.originalPrice : p.price;
                return `<option value="${p.id}">${p.name} (Gốc: ${displayPrice.toLocaleString('vi-VN')}₫)</option>`;
            }).join('');
        }

        promotionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let products = getProducts();
            const selectedProductId = productSelect.value;
            const newPrice = parseInt(newPriceInput.value);
            const productIndex = products.findIndex(p => p.id === selectedProductId);

            if (productIndex > -1) {
                const originalPrice = products[productIndex].originalPrice || products[productIndex].price;
                if (newPrice >= originalPrice) {
                    showFormFeedback('Lỗi: Giá khuyến mãi phải nhỏ hơn giá gốc!', 'error');
                    return;
                }
                products[productIndex].originalPrice = originalPrice;
                products[productIndex].price = newPrice;
                saveProducts(products);
                showFormFeedback(`Đã cập nhật giá mới cho "${products[productIndex].name}" thành công!`, 'success');
                newPriceInput.value = '';
                populatePromoSelect();
            }
        });
        
        removePromoBtn.addEventListener('click', () => {
             let products = getProducts();
             const selectedProductId = productSelect.value;
             const productIndex = products.findIndex(p => p.id === selectedProductId);
             if (productIndex > -1 && products[productIndex].originalPrice) {
                 products[productIndex].price = products[productIndex].originalPrice;
                 delete products[productIndex].originalPrice;
                 saveProducts(products);
                 showFormFeedback(`Đã xóa giảm giá cho "${products[productIndex].name}".`, 'info');
                 populatePromoSelect();
             } else {
                 showFormFeedback('Sản phẩm này không có giảm giá để xóa.', 'error');
             }
        });
        
        populatePromoSelect();
    }

    if (document.getElementById('all-orders-table')) {
        const allOrdersTable = document.querySelector('#all-orders-table tbody');
        if(allOrdersTable && typeof mockOrders !== 'undefined') {
            allOrdersTable.innerHTML = mockOrders.map(order => `
                <tr>
                    <td>${order.id}</td><td>${order.customer}</td><td>${order.total.toLocaleString('vi-VN')} ₫</td>
                    <td><span class="status ${order.status === 'Hoàn thành' ? 'completed' : 'cancelled'}">${order.status}</span></td>
                </tr>
            `).join('');
        }
    }

    if (document.getElementById('stock-in-history-table')) {
        const historyTableBody = document.querySelector('#stock-in-history-table tbody');
        const modal = document.getElementById('stock-in-modal');
        const showModalBtn = document.getElementById('show-stock-in-modal-btn');
        const closeModalBtn = document.getElementById('close-stock-in-modal-btn');
        const addItemBtn = document.getElementById('add-item-to-slip-btn');
        const slipItemsTableBody = document.querySelector('#slip-items-table tbody');
        const slipTotalAmount = document.getElementById('slip-total-amount');
        const stockInForm = document.getElementById('stock-in-form');

        let currentSlipItems = [];
        
        function renderHistory() {
            if (!historyTableBody || typeof mockStockInSlips === 'undefined') return;
            historyTableBody.innerHTML = mockStockInSlips.map(slip => `
                <tr><td>${slip.id}</td><td>${slip.supplier}</td><td>${slip.date}</td><td>${slip.total.toLocaleString('vi-VN')} ₫</td></tr>
            `).join('');
            localStorage.setItem(STOCK_IN_SLIPS_STORAGE_KEY, JSON.stringify(mockStockInSlips));
        }

        showModalBtn.addEventListener('click', () => {
            currentSlipItems = [];
            stockInForm.reset();
            populateSuppliers();
            populateProductsSelectForStockIn();
            renderSlipItems();
            modal.classList.remove('hidden');
        });

        closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
        
        function populateSuppliers() {
            document.getElementById('supplier-select').innerHTML = mockSuppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
        }
        function populateProductsSelectForStockIn() {
            document.getElementById('stock-in-product-select').innerHTML = getProducts().map(p => `<option value="${p.id}">${p.name}</option>`).join('');
        }

        addItemBtn.addEventListener('click', () => {
            const productId = document.getElementById('stock-in-product-select').value;
            const quantityInput = document.getElementById('stock-in-quantity');
            const quantity = parseInt(quantityInput.value);

            if (!productId || isNaN(quantity) || quantity <= 0) {
                showFormFeedback('Vui lòng chọn sản phẩm và nhập số lượng hợp lệ.', 'error');
                return;
            }

            const product = getProducts().find(p => p.id === productId);
            if (!product) {
                showFormFeedback('Sản phẩm không tìm thấy.', 'error');
                return;
            }

            const costPrice = product.price * 0.7;

            const existingItem = currentSlipItems.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                currentSlipItems.push({ ...product, quantity, costPrice });
            }
            renderSlipItems();
            quantityInput.value = '';
            showFormFeedback(`Đã thêm ${quantity} sản phẩm "${product.name}" vào phiếu.`, 'success');
        });

        function renderSlipItems() {
            let total = 0;
            slipItemsTableBody.innerHTML = currentSlipItems.map((item, index) => {
                const subtotal = item.costPrice * item.quantity;
                total += subtotal;
                return `<tr>
                    <td><img src="${item.img || 'images/placeholder.png'}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: contain; margin-right: 10px;">${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.costPrice.toLocaleString('vi-VN')} ₫</td>
                    <td>${subtotal.toLocaleString('vi-VN')} ₫</td>
                    <td><button type="button" class="remove-slip-item btn-danger" data-index="${index}">&times;</button></td>
                </tr>`;
            }).join('');
            slipTotalAmount.textContent = total.toLocaleString('vi-VN') + ' ₫';
        }

        slipItemsTableBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-slip-item')) {
                const index = parseInt(e.target.dataset.index);
                const removedItem = currentSlipItems.splice(index, 1);
                renderSlipItems();
                showFormFeedback(`Đã xóa sản phẩm "${removedItem[0].name}" khỏi phiếu.`, 'info');
            }
        });

        stockInForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (currentSlipItems.length === 0) {
                showFormFeedback('Phiếu nhập phải có ít nhất một sản phẩm.', 'error');
                return;
            }

            let products = getProducts();
            currentSlipItems.forEach(slipItem => {
                const productIndex = products.findIndex(p => p.id === slipItem.id);
                if (productIndex > -1) {
                    products[productIndex].quantity = (products[productIndex].quantity || 0) + slipItem.quantity;
                    console.log(`Đã nhập thêm ${slipItem.quantity} sản phẩm '${slipItem.name}'. Tồn kho mới: ${products[productIndex].quantity}`);
                }
            });
            saveProducts(products);

            const newSlipId = 'PN' + ('00' + (mockStockInSlips.length + 1)).slice(-3);
            const total = currentSlipItems.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0);
            mockStockInSlips.push({
                id: newSlipId,
                supplier: document.getElementById('supplier-select').selectedOptions[0].text,
                date: document.getElementById('stock-in-date').value || new Date().toISOString().slice(0,10),
                total: total
            });
            localStorage.setItem(STOCK_IN_SLIPS_STORAGE_KEY, JSON.stringify(mockStockInSlips));
            
            showFormFeedback('Tạo phiếu nhập thành công!', 'success');
            modal.classList.add('hidden');
            renderHistory();
        });

        renderHistory();
    }

    // Xóa listener sự kiện 'storage' nếu không muốn đồng bộ tự động cho Dashboard
    // window.addEventListener('storage', (event) => {
    //     // if (event.key === PRODUCTS_STORAGE_KEY && document.getElementById('products-table')) {
    //     //     console.log("Phát hiện thay đổi sản phẩm từ tab khác, đang tự động cập nhật bảng sản phẩm...");
    //     //     renderProductsTable();
    //     // }
    //     // if (event.key === STOCK_IN_SLIPS_STORAGE_KEY && document.getElementById('stock-in-history-table')) {
    //     //     console.log("Phát hiện thay đổi phiếu nhập từ tab khác, đang tự động cập nhật lịch sử phiếu nhập...");
    //     //     renderStockInHistory();
    //     // }
    //     // if (event.key === DASHBOARD_STATS_KEY && document.getElementById('monthly-revenue-stat')) {
    //     //     console.log("Phát hiện thay đổi số liệu Dashboard từ tab khác, đang tự động cập nhật Dashboard...");
    //     //     renderDashboardStats();
    //     // }
    // });
});