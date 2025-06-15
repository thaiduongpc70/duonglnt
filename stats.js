document.addEventListener('DOMContentLoaded', () => {
    // Data definitions (assuming these are defined elsewhere in your HTML or another script)
    // For demonstration, I'll include dummy data here.
    const monthlyRevenueData = {
        labels: ['T1/24', 'T2/24', 'T3/24', 'T4/24', 'T5/24', 'T6/24', 'T7/24', 'T8/24', 'T9/24', 'T10/24', 'T11/24', 'T12/24', 'T1/25', 'T2/25', 'T3/25', 'T4/25', 'T5/25'],
        data: [75000000, 82000000, 90000000, 95000000, 105000000, 110000000, 120000000, 130000000, 140000000, 185000000, 150000000, 90000000, 70000000, 50000000, 60000000, 75000000, 88000000]
    };

    const bestSellingProductsData = {
        labels: ['Mì Hảo Hảo', 'Sữa Tươi Tiệt Trùng', 'Bia Tiger', 'Nước Ngọt Coca Cola', 'Trứng Gà Quế', 'Dầu Ăn Neptune', 'Khăn Soi Mimosa', 'Nước Mắm', 'Bia Heineken', 'Giấy Ăn', 'Rau Củ', 'Nước Ngọt Pepsi', 'Kem Đánh Răng', 'Bột Giặt', 'Xà Phòng'],
        data: [200, 180, 150, 140, 130, 120, 110, 100, 90, 80, 70, 60, 50, 40, 30]
    };

    // Revenue Chart (Bar Chart)
    try {
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx && typeof monthlyRevenueData !== 'undefined') {
            new Chart(revenueCtx, {
                type: 'bar',
                data: {
                    labels: monthlyRevenueData.labels,
                    datasets: [{
                        label: 'Doanh thu (VND)',
                        data: monthlyRevenueData.data,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, // Allows the chart to fill its container
                    scales: {
                        x: {
                            ticks: {
                                maxRotation: 45,
                                minRotation: 45,
                                font: {
                                    size: 14 // Increased font size for X-axis labels
                                }
                            }
                        },
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: value => new Intl.NumberFormat('vi-VN').format(value) + ' ₫',
                                font: {
                                    size: 14 // Increased font size for Y-axis labels
                                }
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: context => `${context.dataset.label || ''}: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(context.parsed.y)}`
                            }
                        },
                        // Added padding to the chart's drawing area to ensure labels are not cut
                        layout: {
                            padding: {
                                left: 20,  // More space for Y-axis labels
                                right: 20,
                                top: 20,
                                bottom: 20 // More space for X-axis labels if they are long
                            }
                        }
                    }
                }
            });
        }
    } catch (e) {
        console.error("Lỗi khi vẽ biểu đồ doanh thu:", e);
    }

    // Best Selling Products Chart (Doughnut Chart)
    try {
    const bestSellingCtx = document.getElementById('bestSellingChart');
    if (bestSellingCtx && typeof bestSellingProductsData !== 'undefined') {
        new Chart(bestSellingCtx, {
            type: 'doughnut',
            data: {
                labels: bestSellingProductsData.labels,
                datasets: [{
                    label: 'Số lượng đã bán',
                    data: bestSellingProductsData.data,
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
                        '#F3A683', '#F7D794', '#778BEB', '#E77F67', '#CF6A87', '#F19066',
                        '#C4E538', '#A3CB38', '#EAF0F1', '#D4A5A5', '#B8BEDD'
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Vẫn giữ false
                plugins: {
                    legend: {
                        position: 'right', // Giữ vị trí bên phải
                        labels: {
                            font: {
                                size: 14 // Vẫn giữ 14px (hoặc 12px nếu bạn muốn nhỏ hơn chút)
                            },
                            // Điều chỉnh khoảng cách giữa các mục trong chú giải
                            padding: 15 // Tăng padding giữa các mục
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += context.parsed + ' sản phẩm';
                                }
                                return label;
                            }
                        }
                    },
                    layout: {
                        padding: {
                            left: 10,
                            right: 10,
                            top: 10,
                            bottom: 10
                        }
                    }
                },
                // THÊM HOẶC ĐIỀU CHỈNH CÁC THUỘC TÍNH NÀY ĐỂ ĐIỀU KHIỂN KÍCH THƯỚC DOUGHNUT
                cutout: '60%', // Khoảng trống bên trong biểu đồ (60% của bán kính)
                radius: '80%', // Kích thước tổng thể của biểu đồ (80% của không gian có sẵn)
                               // Giảm giá trị này để biểu đồ nhỏ lại và nhường chỗ cho legend
                               // Thử '70%' hoặc '60%' nếu '80%' vẫn quá lớn
                // Hoặc bạn có thể dùng một số cố định nếu muốn: radius: 100
                // circumference: 360, // Mặc định 360, không cần sửa nếu không muốn một phần biểu đồ
                // rotation: -90 // Mặc định 0, có thể xoay biểu đồ nếu muốn
            }
        });
    }
} catch (e) {
    console.error("Lỗi khi vẽ biểu đồ sản phẩm bán chạy:", e);
}
});

// IMPORTANT:
// Remember to also adjust the CSS for your .chart-container
// as discussed previously, to provide enough overall space.
// Example:
/*
.chart-container {
    padding: 25px 25px 40px 60px; // top right bottom left - adjust as needed
    height: 400px; // or whatever height you desire
    // ... other properties
}
*/