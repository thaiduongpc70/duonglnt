const firstNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Võ", "Đặng", "Bùi", "Đỗ"];
const lastNames = ["Văn An", "Thị Bình", "Hữu Cường", "Thị Dung", "Văn Em", "Thị Giang", "Hữu Hùng", "Thị Hương", "Văn Kiên", "Thị Lan"];
const statuses = ['Hoàn thành', 'Hoàn thành', 'Hoàn thành', 'Hoàn thành', 'Hoàn thành', 'Hoàn thành', 'Hoàn thành', 'Hoàn thành', 'Đã hủy', 'Hoàn thành']; // Tỉ lệ hủy 1/10
let generatedOrders = [];
const startDate = new Date('2025-01-01');
const endDate = new Date();
for (let i = 1; i <= 100; i++) {
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
    const randomDate = new Date(randomTime);
    
    generatedOrders.push({
        id: 'HD' + String(i).padStart(3, '0'),
        customer: `${randomFirstName} ${randomLastName}`,
        date: randomDate.toISOString().slice(0, 10),
        total: Math.floor(Math.random() * (1500000 - 50000 + 1)) + 50000,
        status: statuses[Math.floor(Math.random() * statuses.length)]
    });
}
generatedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
const mockOrders = generatedOrders;