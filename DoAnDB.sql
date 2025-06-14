CREATE TABLE nguoidung (
    MaNguoiDung INT IDENTITY(1,1) PRIMARY KEY,
    TaiKhoan VARCHAR(50) UNIQUE NOT NULL,
    MatKhau VARCHAR(255) NOT NULL,
    Quyen NVARCHAR(20) CHECK (Quyen IN ('admin','staff','member')) DEFAULT 'member',
    TrangThai VARCHAR(20) CHECK (TrangThai IN ('Active', 'Locked')) DEFAULT 'Active'
);
CREATE TABLE khachhang (
    MaKhachHang INT IDENTITY(1,1) PRIMARY KEY,
    MaNguoiDung INT,
    HoTen NVARCHAR(100),
    NgaySinh DATE,
    DiaChi NVARCHAR(MAX),
    TichDiem INT DEFAULT 0,
	TongTienTieuDung DECIMAL(12, 2) DEFAULT 0,
    MocHoiVien VARCHAR(20) CHECK (MocHoiVien IN ('Bronze', 'Silver', 'Gold', 'Platinum')) DEFAULT 'Bronze',
    FOREIGN KEY (MaNguoiDung) REFERENCES nguoidung(MaNguoiDung) ON DELETE CASCADE
);
CREATE TABLE nhacungcap (
    MaNhaCungCap INT IDENTITY(1,1) PRIMARY KEY,
    TenNhaCungCap NVARCHAR(100) NOT NULL,
    MaHopDong VARCHAR(50),
    SDT VARCHAR(20),
    Email VARCHAR(100),
    DiaChi NVARCHAR(255)
);
ALTER TABLE nhacungcap
ADD CONSTRAINT FK_NhaCungCap_HopDong
FOREIGN KEY (MaHopDong) REFERENCES hopdong(MaHopDong)
ON DELETE SET NULL;
CREATE TABLE hopdong (
    MaHopDong VARCHAR(50) PRIMARY KEY,
    NgayKy DATE NOT NULL,
    NgayHetHan DATE,
    DieuKhoan NVARCHAR(500),
    GiaTriHopDong DECIMAL(18, 2)
);
SELECT * FROM khachhang ORDER BY MaKhachHang DESC;
INSERT INTO hopdong (MaHopDong, NgayKy, NgayHetHan, DieuKhoan, GiaTriHopDong)
VALUES 
('HD001', '2024-01-01', '2025-01-10', N'Hợp đồng cung cấp sữa', 50000000),
('HD002', '2024-02-01', '2025-02-10', N'Hợp đồng rau củ sạch', 30000000),
('HD003', '2024-03-01', '2025-03-10', N'Hợp đồng nước giải khát', 40000000),
('HD004', '2024-04-01', '2025-04-10', N'Hợp đồng bia rượu NGK', 60000000),
('HD005', '2024-05-01', '2025-05-10', N'Hợp đồng mì ăn liền', 35000000),
('HD006', '2024-06-01', '2025-06-10', N'Hợp đồng dầu ăn cao cấp', 25000000),
('HD007', '2024-07-01', '2025-07-10', N'Hợp đồng hàng tiêu dùng Nhật', 28000000),
('HD008', '2024-08-01', '2025-08-10', N'Hợp đồng thiết bị điện tử', 45000000),
('HD009', '2024-09-01', '2025-09-10', N'Hợp đồng tb vệ sinh cá nhân', 99999999),
('HD0010', '2024-01-10', '2025-10-10', N'Hợp đồng kem đánh răng', 10000000);
CREATE TABLE phieunhap (
    MaPhieuNhap INT IDENTITY(1,1) PRIMARY KEY,
    NgayNhap DATE NOT NULL,
    MaNhaCungCap INT,
    TongTien DECIMAL(18, 2),
    GhiChu NVARCHAR(255),
    CONSTRAINT FK_PhieuNhap_NhaCungCap FOREIGN KEY (MaNhaCungCap)
    REFERENCES nhacungcap(MaNhaCungCap)
    ON DELETE SET NULL
);
INSERT INTO phieunhap (NgayNhap, MaNhaCungCap, TongTien, GhiChu)
VALUES
('2025-01-02', 1, 15000000, N'Nhập sữa đợt đầu năm'),
('2025-02-05', 2, 10000000, N'Nhập rau củ sạch Tết'),
('2025-03-10', 3, 12000000, N'Nhập Coca-Cola chương trình khuyến mãi'),
('2025-04-01', 4, 18000000, N'Nhập bia cho lễ 30/4'),
('2025-05-15', 5, 11000000, N'Nhập mì ăn liền cho siêu thị mới'),
('2025-06-01', 6, 9000000,  N'Nhập dầu ăn chuẩn bị hè'),
('2025-07-20', 7, 9500000,  N'Nhập hàng tiêu dùng nhập khẩu'),
('2025-08-05', 8, 20000000, N'Nhập thiết bị điện tử đợt 1'),
('2025-09-12', 9, 8500000,  N'Nhập sản phẩm vệ sinh cá nhân'),
('2025-10-10', 10, 5000000,  N'Nhập kem đánh răng khuyến mãi');
INSERT INTO nguoidung (TaiKhoan, MatKhau, Quyen, TrangThai) 
VALUES
('0852076750', 'admin',  'admin', 'Active');
INSERT INTO nhacungcap (TenNhaCungCap, MaHopDong, SDT, Email, DiaChi)
VALUES 
(N'Công ty VinaMilk', 'HD001', '0123456789', 'Vinamilk@gmail.com', N'Hà Nội'),
(N'Công ty Rau Củ Foody', 'HD002', '0123456789', 'HomeFoody@gmail.com', N'Hà Nội'),
(N'Công ty CocaCoLa', 'HD003', '0123456789', 'Cocacola@gmail.com', N'Hà Nội'),
(N'Công ty Bia Rượu NGK', 'HD004', '0123456789', 'NGKgroup@gmail.com', N'Hà Nội'),
(N'Công ty Acecook', 'HD005', '0123456789', 'AceCook@gmail.com', N'Hà Nội'),
(N'Công ty DiddyOil', 'HD006', '0123456789', 'JustinBeiBer@gmail.com', N'Hà Nội'),
(N'Công ty Gintama', 'HD007', '0123456789', 'Gintoki@gmail.com', N'Hà Nội'),
(N'Công ty Điện Máy Xanh', 'HD008', '0123456789', 'DMX@gmail.com', N'Hà Nội'),
(N'Công ty Bat Mobile', 'HD009', '0123456789', 'Batcave@gmail.com', N'Hà Nội'),
(N'Công ty P/S', 'HD0010', '0123456789', 'Psvn@gmail.com', N'Hà Nội');
INSERT INTO kho (TenKho, LoaiKho, SucChua)
VALUES (N'Kho Tổng', 'LuuTru', 10000);
INSERT INTO kehang 
(MaKho, MaNhaCungCap, TenHangHoa, LoaiHangHoa, GiaBan, SoLuong, NgayHetHan, LoaiKeHang)
VALUES 
(1, 1, N'Sữa Chua Dâu', N'Sữa Tươi', 15000, 10000, '2025-12-31', 'Ban'),
(1, 1, N'Sữa Tươi Tiệt Trùng', N'Sữa Tươi', 12000, 20000, '2025-12-31', 'Ban'),
(1, 1, N'Sữa Tươi Không Đường', N'Sữa Tươi', 11000, 15000, '2025-12-31', 'Ban'),
(1, 1, N'Sữa Chua Men Probi', N'Sữa Tươi', 17000, 12000,  '2025-12-31', 'Ban'),
(1, 1, N'Sữa Chua', N'Sữa Tươi', 18000, 90000 ,  '2025-12-31', 'Ban'),
(1, 1, N'Sữa Chua Nếp Cẩm', N'Sữa Tươi', 20000, 11000,  '2025-12-31', 'Ban'),
(1, 1, N'Sữa Tươi Fami', N'Sữa Tươi', 16000, 13000,  '2025-12-31', 'Ban'),
(1, 1, N'Phô Mai', N'Sữa Tươi', 25000, 80000,  '2025-12-31', 'Ban'),
(1, 1, N'Sữa Milo', N'Sữa Tươi', 22000, 70000,  '2025-12-31', 'Ban'),
(1, 2, N'Xoài Keo Vàng', N'Rau, Củ, Trái Cây', 15000, 20000, '2025-12-31','Ban'),
(1, 2, N'Táo Rockit', N'Rau, Củ, Trái Cây', 30000, 18000, '2025-12-31', 'Ban'),
(1, 2, N'Dưa Hấu Giống Nhật', N'Rau, Củ, Trái Cây', 35000, 220000, '2025-12-31', 'Ban'),
(1, 2, N'Bắp Cải', N'Rau, Củ, Trái Cây', 12000, 500000,  '2025-12-31', 'Ban'),
(1, 2, N'Rau Muống', N'Rau, Củ, Trái Cây', 8000, 600000,  '2025-12-31', 'Ban'),
(1, 2, N'Cải Thảo', N'Rau, Củ, Trái Cây', 10000, 400000,  '2025-12-31', 'Ban'),
(1, 2, N'Cà Rốt', N'Rau, Củ, Trái Cây', 12000, 350000, '2025-12-31', 'Ban'),
(1, 2, N'Khoai Tây', N'Rau, Củ, Trái Cây', 18000, 3000000,  '2025-12-31', 'Ban'),
(1, 2, N'Hành Lý Sơn', N'Rau, Củ, Trái Cây', 25000, 250000,  '2025-12-31', 'Ban'),
(1, 3, N'Nước Ngọt Coca Cola', N'Đồ Uống Giải Khát', 15000, 500000,  '2025-12-31', 'Ban'),
(1, 3, N'Nước Ngọt Pepsi', N'Đồ Uống Giải Khát', 15000, 500000,  '2025-12-31', 'Ban'),
(1, 3, N'Nước Ngọt Fanta', N'Đồ Uống Giải Khát', 14000, 450000,  '2025-12-31', 'Ban'),
(1, 3, N'Nước Ngọt Sprite', N'Đồ Uống Giải Khát', 16000, 300000,  '2025-12-31', 'Ban'),
(1, 3, N'Nước Ngọt 7up', N'Đồ Uống Giải Khát', 15000, 3500000,  '2025-12-31', 'Ban'),
(1, 3, N'Nước Ngọt Tea+', N'Đồ Uống Giải Khát', 17000, 200000,  '2025-12-31', 'Ban'),
(1, 3, N'Cà Phê', N'Đồ Uống Giải Khát', 25000, 100000,  '2025-12-31', 'Ban'),
(1, 3, N'Aquafina', N'Đồ Uống Giải Khát', 10000, 400000,  '2025-12-31', 'Ban'),
(1, 3, N'Nước Ngọt Sting', N'Đồ Uống Giải Khát', 18000, 300000,  '2025-12-31', 'Ban'),
(1, 4, N'Bia Ruby', N'Đồ Uống Có Cồn', 40000, 150000, '2025-12-31', 'Ban'),
(1, 4, N'Bia Chai', N'Đồ Uống Có Cồn', 35000, 200000, '2025-12-31', 'Ban'),
(1, 4, N'Bia 333', N'Đồ Uống Có Cồn', 38000, 180000,  '2025-12-31', 'Ban'),
(1, 4, N'Bia Sapporo', N'Đồ Uống Có Cồn', 50000, 130000, '2025-12-31', 'Ban'),
(1, 4, N'Bia Hà Nội', N'Đồ Uống Có Cồn', 22000, 30000,  '2025-12-31', 'Ban'),
(1, 4, N'Bia Heiniken', N'Đồ Uống Có Cồn', 45000, 250000,  '2025-12-31', 'Ban'),
(1, 4, N'Bia Budweiser', N'Đồ Uống Có Cồn', 40000, 150000, '2025-12-31', 'Ban'),
(1, 4, N'Bia Leffe', N'Đồ Uống Có Cồn', 60000, 80000, '2025-12-31', 'Ban'),
(1, 4, N'Bia Tiger', N'Đồ Uống Có Cồn', 25000, 350000, '2025-12-31', 'Ban'),
(1, 5, N'Tobbokki Miwon', N'Thực Phẩm Ăn Liền', 25000, 200000, '2025-12-31', 'Ban'),
(1, 5, N'Cháo Thịt Bằm', N'Thực Phẩm Ăn Liền', 15000, 300000, '2025-12-31', 'Ban'),
(1, 5, N'Mì Lẩu Thái', N'Thực Phẩm Ăn Liền', 18000, 250000, '2025-12-31', 'Ban'),
(1, 5, N'Mì Kokomi', N'Thực Phẩm Ăn Liền', 16000, 400000,  '2025-12-31', 'Ban'),
(1, 5, N'Mì Cung Đình', N'Thực Phẩm Ăn Liền', 17000, 350000,  '2025-12-31', 'Ban'),
(1, 5, N'Mì Xào Koreno', N'Thực Phẩm Ăn Liền', 14000, 500000,  '2025-12-31', 'Ban'),
(1, 5, N'Bún Ốc Tươi', N'Thực Phẩm Ăn Liền', 20000, 100000,  '2025-12-31', 'Ban'),
(1, 5, N'Mì Hảo Hảo', N'Thực Phẩm Ăn Liền', 12000, 600000,  '2025-12-31', 'Ban'),
(1, 5, N'Phở Thịt Gà', N'Thực Phẩm Ăn Liền', 25000, 100000,  '2025-06-30', 'Ban'),
(1, 6, N'Dầu Ăn Neptune', N'Gia Vị', 45000, 200000, '2025-06-25', 'Ban'),
(1, 6, N'Nước Mắm', N'Gia Vị', 22000, 150000, '2025-07-01', 'Ban'),
(1, 6, N'Hạt Nêm', N'Gia Vị', 18000, 25000,  '2025-07-05', 'Ban'),
(1, 6, N'Mayonaise', N'Gia Vị', 35000, 100000,  '2025-06-28', 'Ban'),
(1, 6, N'Nước Tương', N'Gia Vị', 15000, 300000,  '2025-08-01', 'Ban'),
(1, 6, N'Mì Chính', N'Gia Vị', 15000, 220000, '2025-07-10', 'Ban'),
(1, 6, N'Sa Tế', N'Gia Vị', 12000, 300000,  '2025-07-15', 'Ban'),
(1, 6, N'Gói Lẩu Thái', N'Gia Vị', 60000, 130000,  '2025-07-12', 'Ban'),
(1, 6, N'Bột Canh', N'Gia Vị', 14000, 200000, '2025-07-18', 'Ban'),
(1, 7, N'Tàu Hũ Trứng', N'Trứng - Đậu Hũ', 8000, 400000,  '2025-06-22', 'Ban'),
(1, 7, N'Trứng Gà Quê', N'Trứng - Đậu Hũ', 15000, 150000,  '2025-06-25', 'Ban'),
(1, 7, N'Tàu Hũ Thanh', N'Trứng - Đậu Hũ', 10000, 250000,  '2025-06-28', 'Ban'),
(1, 7, N'Tàu Hũ Ky', N'Trứng - Đậu Hũ', 9000, 350000, '2025-07-01', 'Ban'),
(1, 7, N'Tàu Hũ Mềm', N'Trứng - Đậu Hũ', 11000, 300000,  '2025-07-05', 'Ban'),
(1, 7, N'Trứng Gà Ác', N'Trứng - Đậu Hũ', 20000, 180000,  '2025-07-10', 'Ban'),
(1, 7, N'Trứng Cút', N'Trứng - Đậu Hũ', 10000, 500000,  '2025-07-12', 'Ban'),
(1, 7, N'Đậu Hũ Rong Biển', N'Trứng - Đậu Hũ', 13000, 220000,  '2025-06-30', 'Ban'),
(1, 7, N'Đậu hũ thối', N'Trứng - Đậu Hũ', 8000, 400000,  '2025-07-15', 'Ban'),
(1, 8, N'Khay Đá', N'Đồ Gia Dụng', 12000, 300000, '2025-07-20', 'Ban'),
(1, 8, N'Chảo Đáy Nông', N'Đồ Gia Dụng', 35000, 150000,  '2025-07-25', 'Ban'),
(1, 8, N'Màng Bọc Thực Phẩm', N'Đồ Gia Dụng', 7000, 500000,  '2025-07-30', 'Ban'),
(1, 8, N'Bình Giữ Nhiệt', N'Đồ Gia Dụng', 20000, 100000, '2025-06-28', 'Ban'),
(1, 8, N'Khăn Sợi Mềm', N'Đồ Gia Dụng', 15000, 200000,  '2025-07-05', 'Ban'),
(1, 8, N'Nồi Một Tay', N'Đồ Gia Dụng', 40000, 120000,  '2025-07-12', 'Ban'),
(1, 8, N'Móc Quần Áo', N'Đồ Gia Dụng', 5000, 600000,  '2025-07-15', 'Ban'),
(1, 8, N'Găng Tay', N'Đồ Gia Dụng', 7000, 350000,  '2025-06-22', 'Ban'),
(1, 8, N'Ổ Điện', N'Đồ Gia Dụng', 25000, 200000,  '2025-07-01', 'Ban'),
(1, 9, N'Bút Bi Thiên Long', N'Văn Phòng Phẩm', 8000, 300000, '2025-06-30', 'Ban'),
(1, 9, N'Bút Dạ', N'Văn Phòng Phẩm', 5000, 400000,  '2025-07-05', 'Ban'),
(1, 9, N'Bút Chì', N'Văn Phòng Phẩm', 6000, 500000,  '2025-07-10', 'Ban'),
(1, 9, N'Tẩy', N'Văn Phòng Phẩm', 2000, 600000,  '2025-06-25', 'Ban'),
(1, 9, N'Băng Keo', N'Văn Phòng Phẩm', 10000, 350000,  '2025-07-01', 'Ban'),
(1, 9, N'Bút Xóa Kéo', N'Văn Phòng Phẩm', 15000, 200000,  '2025-07-15', 'Ban'),
(1, 9, N'Đồng Hồ', N'Văn Phòng Phẩm', 25000, 100000,  '2025-07-20', 'Ban'),
(1, 9, N'Bàn Xếp', N'Văn Phòng Phẩm', 30000, 150000,  '2025-07-25', 'Ban'),
(1, 9, N'Keo Dán', N'Văn Phòng Phẩm', 4000, 400000,  '2025-06-28', 'Ban'),
(1, 10, N'Nước Súc Miệng', N'Vệ Sinh Cá Nhân', 25000, 50000, '2025-12-31', 'Ban'),
(1, 10, N'Dầu Gội', N'Vệ Sinh Cá Nhân', 45000, 30000, '2025-12-31', 'Ban'),
(1, 10, N'Kem Đánh Răng', N'Vệ Sinh Cá Nhân', 25000, 50000, '2025-12-31', 'Ban'),
(1, 10, N'Giấy Ăn', N'Gia Dụng', 15000, 60000, '2025-12-31', 'Ban'),
(1, 10, N'Kem Rửa Mặt', N'Vệ Sinh Cá Nhân', 55000, 20000, '2025-12-31', 'Ban'),
(1, 10, N'Sữa Rửa Tay', N'Vệ Sinh Cá Nhân', 30000, 40000, '2025-12-31', 'Ban'),
(1, 10, N'Xịt Khử Mùi', N'Vệ Sinh Cá Nhân', 60000, 25000, '2025-12-31', 'Ban'),
(1, 10, N'Mặt Nạ', N'Mỹ Phẩm', 10000, 70000, '2025-12-31', 'Ban'),
(1, 10, N'Bàn Chải', N'Vệ Sinh Cá Nhân', 12000, 80000, '2025-12-31', 'Ban');
CREATE TRIGGER trg_UpdateMocHoiVien
ON hoadon
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE khachhang
    SET 
        TichDiem = FLOOR(tong.TongChiTieu / 10000),
        MocHoiVien = 
            CASE 
                WHEN tong.TongChiTieu >= 10000000 THEN 'Platinum'
                WHEN tong.TongChiTieu >= 5000000 THEN 'Gold'
                WHEN tong.TongChiTieu >= 2000000 THEN 'Silver'
                ELSE 'Bronze'
            END
    FROM khachhang kh
    INNER JOIN (
        SELECT MaKhachHang, SUM(TongTien) AS TongChiTieu
        FROM hoadon
        WHERE TrangThai = 'Hoan Thanh'
        GROUP BY MaKhachHang
    ) tong ON kh.MaKhachHang = tong.MaKhachHang
END;
CREATE TABLE magiamgia (
    MaGiamGia NVARCHAR(50) PRIMARY KEY,
    MoTa NVARCHAR(255),
    DieuKienRank NVARCHAR(20) NOT NULL,
    Kieu NVARCHAR(50) NOT NULL,
    GiaTri DECIMAL(10,2) NOT NULL
);
CREATE TRIGGER trg_InsertUpdate_MaGiamGia
ON magiamgia
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE m
    SET Kieu = 
        CASE 
            WHEN i.Kieu LIKE N'%giảm phần trăm%' THEN 'GiamPhanTram'
            WHEN i.Kieu LIKE N'%miễn phí vận chuyển%' THEN 'MienPhiVanChuyen'
            WHEN i.Kieu LIKE N'%ưu đãi hội viên%' THEN 'UuDaiHoiVien'
            WHEN i.Kieu LIKE N'%siêu sale%' THEN 'SieuSaleNgayLe'
            WHEN i.Kieu LIKE N'%giảm tiền mặt%' THEN 'GiamTienMat'
            ELSE i.Kieu
        END
    FROM magiamgia m
    INNER JOIN inserted i ON m.MaGiamGia = i.MaGiamGia;
END
GO
INSERT INTO magiamgia (MaGiamGia, Kieu, GiaTri, DieuKienRank) VALUES
('sale10', 'GiamPhanTram', 0.10, 'Bronze'),
('freeship', 'MienPhiVanChuyen', 0, 'Silver'),
('giam50k', 'GiamTienMat', 50000, 'Gold'),
('le2025', 'SieuSaleNgayLe', 0.20, 'Bronze');
CREATE TABLE thongkedoanhthu (
    MaThongKe INT IDENTITY(1,1) PRIMARY KEY,
    ThangNam CHAR(7), 
    TongHoaDon INT,
    TongTien DECIMAL(18, 2),
    SoKhachHang INT
);
CREATE OR ALTER PROCEDURE TinhDoanhThuThang
    @ThangNam CHAR(7)
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM thongkedoanhthu WHERE ThangNam = @ThangNam;
    INSERT INTO thongkedoanhthu (ThangNam, TongHoaDon, TongTien, SoKhachHang)
    SELECT
        @ThangNam,
        COUNT(*) AS TongHoaDon,
        SUM(TongTien) AS TongTien,
        COUNT(DISTINCT MaKhachHang) AS SoKhachHang
    FROM hoadon
    WHERE TrangThai = 'Hoan Thanh'
        AND FORMAT(NgayThanhToan, 'yyyy-MM') = @ThangNam;
END;
EXEC TinhDoanhThuThang @ThangNam = '2025-06';
SELECT * FROM thongkedoanhthu ORDER BY ThangNam DESC;
CREATE TABLE kho (
    MaKho INT IDENTITY(1,1) PRIMARY KEY,
    TenKho NVARCHAR(100) NOT NULL,
    LoaiKho VARCHAR(20) CHECK (LoaiKho IN ('DongLanh', 'LuuTru')) DEFAULT 'LuuTru',
    SucChua INT DEFAULT 0,
    ThoiGianCapNhatCuoi DATETIME2 DEFAULT GETDATE()
);
CREATE TABLE kehang (
    MaKeHang INT IDENTITY(1,1) PRIMARY KEY,
    MaKho INT NOT NULL,
    MaNhaCungCap INT NOT NULL,
    TenHangHoa NVARCHAR(100) NOT NULL,
    LoaiHangHoa NVARCHAR(100),
    GiaBan DECIMAL(10,2) NOT NULL,
    SoLuong INT NOT NULL,
    NgayHetHan DATE,
    LoaiKeHang VARCHAR(20) CHECK (LoaiKeHang IN ('TrungBay', 'Ban')) DEFAULT 'Ban',
    FOREIGN KEY (MaKho) REFERENCES kho(MaKho) ON DELETE CASCADE,
    FOREIGN KEY (MaNhaCungCap) REFERENCES nhacungcap(MaNhaCungCap) ON DELETE CASCADE
);
CREATE TABLE giohang (
    MaGioHang INT IDENTITY(1,1) PRIMARY KEY,
    MaKhachHang INT NOT NULL,
    MaKeHang INT NOT NULL,
    TenHangHoa NVARCHAR(100),
    SoLuong INT NOT NULL CHECK (SoLuong > 0),
    DonGia DECIMAL(10,2) NOT NULL,
    CONSTRAINT FK_GioHang_KeHang FOREIGN KEY (MaKeHang) REFERENCES kehang(MaKeHang) ON DELETE CASCADE,
    CONSTRAINT FK_GioHang_KhachHang FOREIGN KEY (MaKhachHang) REFERENCES khachhang(MaKhachHang) ON DELETE CASCADE
);
CREATE TABLE hoadon (
    MaHoaDon INT IDENTITY(1,1) PRIMARY KEY,
    MaKhachHang INT,
    NgayThanhToan DATETIME2 DEFAULT GETDATE(),
    TongTien DECIMAL(12,2),
    TrangThai VARCHAR(20) CHECK (TrangThai IN ('Dang Cho', 'Hoan Thanh', 'Da Huy')) DEFAULT 'Dang Cho',
    FOREIGN KEY (MaKhachHang) REFERENCES khachhang(MaKhachHang)
);
CREATE TABLE thongke_banhang (
    MaThongKe INT IDENTITY(1,1) PRIMARY KEY,
    NgayBan DATE NOT NULL,
    TongSoHoaDon INT NOT NULL,
    TongSoLuongBan INT NOT NULL,
    TongDoanhThu DECIMAL(18,2) NOT NULL
);
CREATE FUNCTION dbo.ThongKeTheoThang
(
    @Thang INT,
    @Nam INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        SUM(TongSoHoaDon) AS TongHoaDonThang,
        SUM(TongSoLuongBan) AS TongSoLuongBanThang,
        SUM(TongDoanhThu) AS TongDoanhThuThang
    FROM
        thongke_banhang
    WHERE
        MONTH(NgayBan) = @Thang AND YEAR(NgayBan) = @Nam
);
GO 
CREATE FUNCTION dbo.ThongKeTheoNam
(
    @Nam INT
)
RETURNS TABLE
AS
RETURN
(
    SELECT
        SUM(TongSoHoaDon) AS TongHoaDonNam,
        SUM(TongSoLuongBan) AS TongSoLuongBanNam,
        SUM(TongDoanhThu) AS TongDoanhThuNam
    FROM
        thongke_banhang
    WHERE
        YEAR(NgayBan) = @Nam
);
GO
PRINT N'--- Thống kê tháng 06 năm 2025 ---';
SELECT * FROM dbo.ThongKeTheoThang(6, 2025);
GO
PRINT N'--- Thống kê cả năm 2025 ---';
SELECT * FROM dbo.ThongKeTheoNam(2025);
GO
CREATE PROCEDURE dbo.CapNhatThongKeNgay
    @NgayCanThongKe DATE
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @TongSoHoaDon INT;
    DECLARE @TongSoLuongBan INT;
    DECLARE @TongDoanhThu DECIMAL(18,2);
    SELECT @TongSoHoaDon = COUNT(MaHoaDon)
    FROM hoadon
    WHERE CONVERT(DATE, NgayThanhToan) = @NgayCanThongKe AND TrangThai = 'Hoan Thanh';
    SELECT @TongSoLuongBan = SUM(ISNULL(ct.SoLuong, 0))
    FROM chitiethoadon ct
    JOIN hoadon hd ON ct.MaHoaDon = hd.MaHoaDon
    WHERE CONVERT(DATE, hd.NgayThanhToan) = @NgayCanThongKe AND hd.TrangThai = 'Hoan Thanh';
    SELECT @TongDoanhThu = SUM(ISNULL(TongTien, 0))
    FROM hoadon
    WHERE CONVERT(DATE, NgayThanhToan) = @NgayCanThongKe AND TrangThai = 'Hoan Thanh';
    SET @TongSoHoaDon = ISNULL(@TongSoHoaDon, 0);
    SET @TongSoLuongBan = ISNULL(@TongSoLuongBan, 0);
    SET @TongDoanhThu = ISNULL(@TongDoanhThu, 0);
    MERGE INTO thongke_banhang AS Target
    USING (VALUES (@NgayCanThongKe, @TongSoHoaDon, @TongSoLuongBan, @TongDoanhThu))
        AS Source (NgayBan, TongSoHoaDon, TongSoLuongBan, TongDoanhThu)
    ON Target.NgayBan = Source.NgayBan
    WHEN MATCHED THEN
        UPDATE SET
            TongSoHoaDon = Source.TongSoHoaDon,
            TongSoLuongBan = Source.TongSoLuongBan,
            TongDoanhThu = Source.TongDoanhThu
    WHEN NOT MATCHED BY TARGET THEN
        INSERT (NgayBan, TongSoHoaDon, TongSoLuongBan, TongDoanhThu)
        VALUES (Source.NgayBan, Source.TongSoHoaDon, Source.TongSoLuongBan, Source.TongDoanhThu);
END;
GO
CREATE TABLE chitiethoadon (
    MaChiTiet INT IDENTITY(1,1) PRIMARY KEY,
    MaHoaDon INT NOT NULL,
    MaKeHang INT NOT NULL,
    SoLuong INT NOT NULL,
    DonGia DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (MaHoaDon) REFERENCES hoadon(MaHoaDon) ON DELETE CASCADE,
    FOREIGN KEY (MaKeHang) REFERENCES kehang(MaKeHang)
);
DECLARE @StartDate DATE = '2025-03-01';
DECLARE @EndDate DATE = '2025-06-12'; 
DECLARE @CurrentDate DATE = @StartDate;
DECLARE @MaKhachHang INT;
DECLARE @MaHoaDon INT;
DECLARE @MaKeHang INT;
DECLARE @SoLuongMua INT;
DECLARE @GiaBan DECIMAL(10,2);
DECLARE @TongTienHoaDon DECIMAL(12,2);
DECLARE @SoHoaDonMoiNgay INT;
DECLARE @SoSanPhamMoiHoaDon INT;
DECLARE @MaxMaKeHang INT;
DECLARE @MaxMaKhachHang INT;
SELECT @MaxMaKeHang = MAX(MaKeHang) FROM kehang;
SELECT @MaxMaKhachHang = MAX(MaKhachHang) FROM khachhang;
IF @MaxMaKhachHang IS NULL
BEGIN
    PRINT N'Lỗi: Không tìm thấy khách hàng nào trong bảng khachhang. Vui lòng thêm dữ liệu khách hàng trước.';
    RETURN;
END
PRINT N'Bắt đầu quá trình tạo dữ liệu hóa đơn...';
WHILE @CurrentDate <= @EndDate
BEGIN
    SET @SoHoaDonMoiNgay = CAST(RAND() * 20 AS INT) + 5;   
    DECLARE @i INT = 0;
    WHILE @i < @SoHoaDonMoiNgay
    BEGIN
        SET @MaKhachHang = CAST(RAND() * @MaxMaKhachHang AS INT) + 1;
        INSERT INTO hoadon (MaKhachHang, NgayThanhToan, TongTien, TrangThai)
        VALUES (@MaKhachHang, @CurrentDate, 0, 'Hoan Thanh');
        SET @MaHoaDon = SCOPE_IDENTITY();
        SET @TongTienHoaDon = 0;
        SET @SoSanPhamMoiHoaDon = CAST(RAND() * 7 AS INT) + 1;
        
        DECLARE @j INT = 0;
        WHILE @j < @SoSanPhamMoiHoaDon
        BEGIN
            SET @MaKeHang = CAST(RAND() * @MaxMaKeHang AS INT) + 1;
            SELECT @GiaBan = GiaBan FROM kehang WHERE MaKeHang = @MaKeHang;
            SET @SoLuongMua = CAST(RAND() * 4 AS INT) + 1;
            INSERT INTO chitiethoadon(MaHoaDon, MaKeHang, SoLuong, DonGia)
            VALUES(@MaHoaDon, @MaKeHang, @SoLuongMua, @GiaBan);
            SET @TongTienHoaDon = @TongTienHoaDon + (@SoLuongMua * @GiaBan);

            SET @j = @j + 1;
        END
        UPDATE hoadon
        SET TongTien = @TongTienHoaDon
        WHERE MaHoaDon = @MaHoaDon;

        SET @i = @i + 1;
    END
    SET @CurrentDate = DATEADD(DAY, 1, @CurrentDate);
END
PRINT N'Hoàn thành tạo dữ liệu hóa đơn.';
PRINT N'Bắt đầu cập nhật bảng thống kê...';
SET @CurrentDate = @StartDate;
WHILE @CurrentDate <= @EndDate
BEGIN
    EXEC dbo.CapNhatThongKeNgay @NgayCanThongKe = @CurrentDate;
    SET @CurrentDate = DATEADD(DAY, 1, @CurrentDate);
END

PRINT N'Hoàn tất! Dữ liệu đã sẵn sàng để sử dụng.';
CREATE PROCEDURE dbo.ThongKeSanPhamBanChay
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        kh.TenHangHoa,
        kh.LoaiHangHoa,
        SUM(cthd.SoLuong) AS TongSoLuongBan
    FROM 
        chitiethoadon cthd
    JOIN 
        kehang kh ON cthd.MaKeHang = kh.MaKeHang
    JOIN 
        hoadon hd ON cthd.MaHoaDon = hd.MaHoaDon
    WHERE 
        hd.TrangThai = 'Hoan Thanh' AND
        CONVERT(DATE, hd.NgayThanhToan) BETWEEN @StartDate AND @EndDate
    GROUP BY 
        kh.TenHangHoa, kh.LoaiHangHoa
    ORDER BY 
        TongSoLuongBan DESC;
END
GO
PRINT N'--- Bắt đầu cập nhật cấu trúc bảng hoadon...';
IF NOT EXISTS (SELECT * FROM sys.columns WHERE Name = N'MaNhanVien' AND Object_ID = Object_ID(N'hoadon'))
BEGIN
    ALTER TABLE hoadon
    ADD MaNhanVien INT;

    ALTER TABLE hoadon
    ADD CONSTRAINT FK_HoaDon_NhanVien FOREIGN KEY (MaNhanVien) REFERENCES nhanvien(MaNhanVien);
    
    PRINT N'--- Cột MaNhanVien và khóa ngoại đã được thêm thành công.';
END
ELSE
BEGIN
    PRINT N'--- Cột MaNhanVien đã tồn tại trong bảng hoadon.';
END
GO
PRINT N'--- Bắt đầu tạo lại dữ liệu hóa đơn với MaNhanVien...';
DELETE FROM thongke_banhang;
DELETE FROM chitiethoadon;
DELETE FROM hoadon;
DBCC CHECKIDENT ('hoadon', RESEED, 0);
DBCC CHECKIDENT ('chitiethoadon', RESEED, 0);
DBCC CHECKIDENT ('thongke_banhang', RESEED, 0);
DECLARE @StartDate DATE = '2025-03-01';
DECLARE @EndDate DATE = '2025-06-12';
DECLARE @CurrentDate DATE = @StartDate;
DECLARE @MaKhachHang INT, @MaHoaDon INT, @MaKeHang INT, @SoLuongMua INT, @MaNhanVien INT;
DECLARE @GiaBan DECIMAL(10,2), @TongTienHoaDon DECIMAL(12,2);
DECLARE @SoHoaDonMoiNgay INT, @SoSanPhamMoiHoaDon INT;
DECLARE @MaxMaKeHang INT, @MaxMaKhachHang INT, @MaxMaNhanVien INT;
SELECT @MaxMaKeHang = MAX(MaKeHang) FROM kehang;
SELECT @MaxMaKhachHang = MAX(MaKhachHang) FROM khachhang;
SELECT @MaxMaNhanVien = MAX(MaNhanVien) FROM nhanvien;
IF @MaxMaKhachHang IS NULL OR @MaxMaNhanVien IS NULL
BEGIN
    PRINT N'Lỗi: Cần có dữ liệu trong bảng khachhang và nhanvien trước khi chạy.';
    RETURN;
END
WHILE @CurrentDate <= @EndDate
BEGIN
    SET @SoHoaDonMoiNgay = CAST(RAND() * 20 AS INT) + 5;
    DECLARE @i INT = 0;
    WHILE @i < @SoHoaDonMoiNgay
    BEGIN
        SET @MaKhachHang = CAST(RAND() * @MaxMaKhachHang AS INT) + 1;
        SET @MaNhanVien = CAST(RAND() * @MaxMaNhanVien AS INT) + 1;

        INSERT INTO hoadon (MaKhachHang, MaNhanVien, NgayThanhToan, TongTien, TrangThai)
        VALUES (@MaKhachHang, @MaNhanVien, @CurrentDate, 0, 'Hoan Thanh');
        
        SET @MaHoaDon = SCOPE_IDENTITY();
        SET @TongTienHoaDon = 0;
        SET @SoSanPhamMoiHoaDon = CAST(RAND() * 7 AS INT) + 1;
        
        DECLARE @j INT = 0;
        WHILE @j < @SoSanPhamMoiHoaDon
        BEGIN
            SET @MaKeHang = CAST(RAND() * @MaxMaKeHang AS INT) + 1;
            SELECT @GiaBan = GiaBan FROM kehang WHERE MaKeHang = @MaKeHang;
            SET @SoLuongMua = CAST(RAND() * 4 AS INT) + 1;

            INSERT INTO chitiethoadon(MaHoaDon, MaKeHang, SoLuong, DonGia)
            VALUES(@MaHoaDon, @MaKeHang, @SoLuongMua, @GiaBan);

            SET @TongTienHoaDon = @TongTienHoaDon + (@SoLuongMua * @GiaBan);
            SET @j = @j + 1;
        END

        UPDATE hoadon SET TongTien = @TongTienHoaDon WHERE MaHoaDon = @MaHoaDon;
        SET @i = @i + 1;
    END
    SET @CurrentDate = DATEADD(DAY, 1, @CurrentDate);
END
SET @CurrentDate = @StartDate;
WHILE @CurrentDate <= @EndDate
BEGIN
    EXEC dbo.CapNhatThongKeNgay @NgayCanThongKe = @CurrentDate;
    SET @CurrentDate = DATEADD(DAY, 1, @CurrentDate);
END
PRINT N'--- Hoàn tất tạo dữ liệu và cập nhật thống kê doanh thu.';
GO
CREATE OR ALTER PROCEDURE dbo.ThongKeNhanVienKPI
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    SET NOCOUNT ON;
    SELECT 
        nv.HoTen,
        nv.ChucVu,
        COUNT(hd.MaHoaDon) AS TongSoHoaDon,
        SUM(ISNULL(hd.TongTien, 0)) AS TongDoanhThu
    FROM 
        nhanvien nv
    JOIN 
        hoadon hd ON nv.MaNhanVien = hd.MaNhanVien
    WHERE 
        hd.TrangThai = 'Hoan Thanh' AND
        CONVERT(DATE, hd.NgayThanhToan) BETWEEN @StartDate AND @EndDate
    GROUP BY 
        nv.MaNhanVien, nv.HoTen, nv.ChucVu
    ORDER BY 
        TongDoanhThu DESC;
END
GO
PRINT N'--- Hoàn tất! CSDL đã sẵn sàng cho form thống kê KPI nhân viên.';