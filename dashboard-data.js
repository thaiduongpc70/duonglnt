// dashboard-data.js

// Khóa Local Storage cho dữ liệu Dashboard
const DASHBOARD_STATS_KEY = 'dashboardStats';

// Dữ liệu thống kê mặc định cho Dashboard
// LƯU Ý: Đây là dữ liệu ban đầu, sẽ được cập nhật và lưu vào Local Storage.
const defaultDashboardStats = {
    monthlyRevenue: 150900000, // Ví dụ: 150.9 triệu
    newOrders: 35,
    newMembers: 56,
    // Bạn có thể thêm các số liệu khác ở đây nếu cần
};

// Dữ liệu doanh thu hàng tháng cho biểu đồ (được sử dụng bởi admin.js)
const monthlyRevenueData = {
    labels: ['T1/24', 'T2/24', 'T3/24', 'T4/24', 'T5/24', 'T6/24', 'T7/24', 'T8/24', 'T9/24', 'T10/24', 'T11/24', 'T12/24', 'T1/25', 'T2/25', 'T3/25', 'T4/25', 'T5/25'],
    data: [75000000, 82000000, 90000000, 95000000, 105000000, 110000000, 120000000, 130000000, 140000000, 185000000, 150000000, 90000000, 70000000, 50000000, 60000000, 75000000, 88000000]
};