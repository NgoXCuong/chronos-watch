export const brands = [
    { name: 'Casio', slug: 'casio', country: 'Nhật Bản', description: 'Thương hiệu Nhật Bản với đồng hồ quartz, điện tử và các bộ sưu tập phục vụ nhu cầu hàng ngày.' },
    { name: 'Seiko', slug: 'seiko', country: 'Nhật Bản', description: 'Nhà sản xuất đồng hồ Nhật Bản. Seiko 5 Sports kết hợp bộ máy tự động với phong cách thể thao và field watch.' },
    { name: 'Tissot', slug: 'tissot', country: 'Thụy Sĩ', description: 'Thương hiệu đồng hồ Thụy Sĩ thành lập năm 1853, với các bộ sưu tập PRX, Le Locle và Gentleman.' },
    { name: 'G-SHOCK', slug: 'g-shock', country: 'Nhật Bản', description: 'Thương hiệu đồng hồ chống sốc thuộc Casio, tập trung vào độ bền và thiết kế thể thao.' },
    { name: 'EDIFICE', slug: 'edifice', country: 'Nhật Bản', description: 'Thương hiệu đồng hồ thuộc Casio, kết hợp thiết kế thể thao với kiểu dáng kim truyền thống.' },
    { name: 'BABY-G', slug: 'baby-g', country: 'Nhật Bản', description: 'Thương hiệu thuộc Casio dành cho phong cách năng động, nổi bật với đồng hồ chống sốc có kích thước gọn.' },
];

export const categories = [
    ['dong-ho-nam', 'Đồng hồ Nam', 'Đồng hồ dành cho nam với nhiều kích thước và phong cách.', 'MTP-V001D-1B'],
    ['dong-ho-nu', 'Đồng hồ Nữ', 'Đồng hồ nữ và các mẫu unisex phù hợp cổ tay nhỏ.', 'BGD-565-7'],
    ['dong-ho-co', 'Đồng hồ Cơ', 'Đồng hồ máy cơ tự động, tích trữ năng lượng qua chuyển động cổ tay.', 'T1374071104100'],
    ['pin-quartz', 'Đồng hồ Quartz (Pin)', 'Đồng hồ sử dụng bộ máy quartz chạy pin.', 'MTP-V002D-1B'],
    ['dong-ho-the-thao', 'Đồng hồ Thể thao', 'Các mẫu đồng hồ có phong cách thể thao.', 'DW-5600UE-1'],
    ['dong-ho-quan-doi', 'Đồng hồ quân đội', 'Đồng hồ phong cách field watch với mặt số dễ đọc.', 'SRPG35'],
    ['dong-ho-dien-tu', 'Đồng hồ điện tử', 'Đồng hồ hiển thị số, có các tiện ích báo thức và bấm giờ tùy mẫu.', 'AE-1200WHD-1AV'],
    ['dong-ho-vintage', 'Đồng hồ Vintage', 'Thiết kế cổ điển, gọn nhẹ và phong cách retro.', 'A700W-1A'],
    ['dong-ho-gio-the-gioi', 'Đồng hồ giờ thế giới', 'Các mẫu có chức năng tra cứu giờ nhiều múi giờ.', 'AE-1200WHD-1AV'],
    ['dong-ho-cong-so', 'Đồng hồ công sở', 'Đồng hồ kiểu dáng thanh lịch, phù hợp trang phục công sở.', 'T0064071103300'],
    ['dong-ho-gmt', 'Đồng hồ GMT', 'Đồng hồ có kim 24 giờ để theo dõi múi giờ thứ hai.', 'SSK003'],
    ['dong-ho-thuy-si', 'Đồng hồ Thụy Sĩ', 'Đồng hồ có xuất xứ sản xuất Thụy Sĩ theo thông tin hãng.', 'T1274071104100'],
].map(([slug, name, description, image], index) => ({
    slug, name, description, image_url: `/products/catalog/${image}.png`, sort_order: index + 1,
}));
