# MAGNULAR — Tài Liệu Đặc Tả Hệ Thống Backend Server

Tài liệu này cung cấp cái nhìn tổng quan về kiến trúc hệ thống và đặc tả kỹ thuật cho nền tảng backend thương mại điện tử **MAGNULAR**, chuyên về các bộ sưu tập ghế sofa tối giản. Server được xây dựng độc lập dưới dạng một REST API bằng Node.js (Express) và Prisma ORM để quản trị cơ sở dữ liệu quan hệ hiệu năng cao trên Cloud MySQL (Aiven).

---

## 1. Kiến Trúc Hệ Thống & Triết Lý Thiết Kế

Nền tảng Backend được thiết kế theo mô hình kiến trúc phân lớp (**MVC / Layered Architecture**), tách biệt rõ ràng các thành phần: định tuyến dữ liệu (Routes), điều hướng logic nghiệp vụ (Controllers), cấu hình hệ thống (Config) và tầng truy cập dữ liệu (Prisma Client).

### Chiến Lược Đảm Bảo Toàn Vẹn Dữ Liệu Lịch Sử
Một yêu cầu cốt lõi của hệ thống bán hàng là **việc chỉnh sửa hoặc xóa các sản phẩm trong danh mục không bao giờ được làm thay đổi hoặc sai lệch lịch sử giao dịch hóa đơn cũ**.
* **Nguyên tắc bất biến (Historical Immutability):** Ngay khi một đơn hàng được tạo thành công, toàn bộ thông tin chi tiết về kích thước ghế (`selectedOverall`, `selectedSeat`) và giá trị giao dịch thực tế (`price`) tại thời điểm đó sẽ được **sao chép và đóng băng cố định** vào một dòng mới trong bảng `OrderItem`.
* **Ràng buộc khóa ngoại linh hoạt:** Nếu một sản phẩm bị xóa hoàn toàn khỏi danh mục catalog, mối quan hệ trong bảng `OrderItem` sẽ tự động chuyển trường `productId` về giá trị `NULL` (`onDelete: SetNull`). Điều này giúp giữ lại trọn vẹn dòng lịch sử mua sắm mà không làm hỏng dữ liệu báo cáo doanh thu của hệ thống.

---

## 2. Các Tính Năng Nghiệp Vụ Cốt Lõi

### 2.1. Luồng Đặt Hàng Cho Khách (Guest Checkout Lifecycle)
* **Mua hàng không cần tài khoản:** Người mua hoàn toàn có thể tiến hành lựa chọn mặt hàng, thêm vào giỏ và thanh toán mà không bắt buộc phải đăng ký tài khoản hay đăng nhập hệ thống.
* **Tự động khởi tạo hồ sơ khách:** Mỗi lượt giao dịch checkout, hệ thống tiếp nhận các thông số động từ form điền của khách (`firstname`, `lastname`, `email`, `phone`, `address`, `city`).
* **Đóng gói giao dịch an toàn:** Hệ thống tự động ghi nhận thông tin khách vãng lai này vào bảng `Customer`, liên kết trực tiếp bằng mã ID với hóa đơn trong một phiên xử lý giao dịch (Transaction Block) an toàn, chống lỗi dữ liệu nửa chừng.

### 2.2. Các Tính Năng Cho Trang Quản Trị (Admin Panel Capabilities)
* **Quản lý Đơn hàng (Orders Management):** Admin có toàn quyền duyệt danh sách, tra cứu chi tiết hóa đơn, cập nhật trạng thái xử lý vận chuyển (`pending`, `processing`, `shipped`, `completed`, `cancelled`) hoặc hủy/xóa đơn hàng khi cần thiết.
* **Quản lý Sản phẩm (Catalog CRUD):** Cho phép Admin Thêm, Sửa, Xóa các mặt hàng sofa, cấu trúc thông tin chi tiết và danh sách liên kết bộ sưu tập (`Collection`).
* **Cập nhật Trạng thái Kho (Inventory Monitoring):** Kiểm soát số lượng hàng tồn kho thông qua trường `stock`. Hệ thống tự động điều chỉnh hiển thị trạng thái khả dụng ra giao diện: hiển thị **In Stock** (Còn hàng) nếu `stock > 0` và tự động chuyển thành **Out of Stock** (Hết hàng) ngay khi `stock = 0`.
* **Quản trị Người dùng (User Management):** Admin có quyền tra cứu, cập nhật dữ liệu liên hệ, phân quyền hoặc xóa hồ sơ khách hàng/nhân viên quản trị ra khỏi danh sách quản lý.

---

## 3. Cấu Trúc Mô Hình Dữ Liệu (Prisma Schema Blueprint)

Cấu hình chuẩn hóa quan hệ thực thể được thiết lập trong file `prisma/schema.prisma` để tự động ánh xạ cấu trúc lên Cloud MySQL:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Collection {
  id        Int       @id @default(autoincrement())
  name      String
  slug      String    @unique
  images    String    @db.Text // Lưu danh sách các link ảnh cách nhau bằng dấu phẩy
  products  Product[]
}

model Product {
  id            Int         @id @default(autoincrement())
  collectionId  Int?
  name          String
  slug          String      @unique
  overallInfo   String?     @db.Text
  seatInfo      String?     @db.Text
  price         Int
  images        String      @db.Text // Chuỗi chứa nhiều link ảnh sản phẩm
  stock         Int         @default(10) // Số lượng sản phẩm có sẵn trong kho
  collection    Collection? @relation(fields: [collectionId], references: [id], onDelete: SetNull)
  orderItems    OrderItem[]
}

model Customer {
  id          Int     @id @default(autoincrement())
  firstname   String
  lastname    String
  email       String
  phone       String
  country     String
  address     String  @db.Text
  apartment   String?
  city        String
  postalCode  String?
  orders      Order[]
}

model Order {
  id            Int         @id @default(autoincrement())
  customerId    Int
  shippingFee   Int         @default(0)
  totalPrice    Int
  status        String      @default("pending") // Các trạng thái: pending, processing, shipped, completed, cancelled
  paymentMethod String
  createdAt     DateTime    @default(now())
  customer      Customer    @relation(fields: [customerId], references: [id], onDelete: Cascade)
  orderItems    OrderItem[]
}

model OrderItem {
  id              Int     @id @default(autoincrement())
  orderId         Int
  productId       Int?    // Cho phép gán Null để giữ lại lịch sử mua sắm khi sản phẩm bị xoá khỏi danh mục
  quantity        Int
  price           Int     // Giá thực tế tại thời điểm mua hàng (Bất biến)
  selectedOverall String? @db.Text // Ảnh chụp thông tin kích thước tổng thể lúc mua
  selectedSeat    String? @db.Text // Ảnh chụp thông tin kích thước lòng ghế lúc mua
  order           Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product         Product? @relation(fields: [productId], references: [id], onDelete: SetNull)
}