# MAGNULAR — Tài Liệu Đặc Tả Tổng Quan Dự Án (Project Overview)

## 1. Giới Thiệu Dự Án (Project Description)
**MAGNULAR** là một nền tảng cửa hàng trực tuyến (E-commerce Platform) cao cấp chuyên phân phối các sản phẩm ghế sofa mang phong cách thiết kế tối giản (Minimalist). Dự án hướng tới một trải nghiệm mua sắm mượt mà, giao diện tối giản tinh tế, tập trung sâu vào chi tiết sản phẩm và tối ưu hóa quy trình đặt hàng nhanh gọn cho người dùng.

Hệ thống được thiết kế theo mô hình **Decoupled Architecture** (Kiến trúc tách biệt hoàn toàn giữa Frontend Client và Backend Server) giúp tối ưu hóa hiệu năng và khả năng mở rộng độc lập.

---

## 2. Công Nghệ & Ngôn Ngữ Sử Dụng (Tech Stack)

Hệ thống ứng dụng những công nghệ hiện đại và phổ biến nhất trong phát triển web hiện nay:

### 2.1. Phân Hệ Giao Diện (Client Side / Frontend)
* **Ngôn ngữ chính:** JavaScript / HTML5 / CSS3
* **Framework:** **React (Next.js)** * *Lý do sử dụng:* Next.js giúp tối ưu hóa hiệu năng hiển thị hình ảnh, hỗ trợ Render phía Server để tối ưu SEO sản phẩm, và cung cấp cơ chế chuyển trang mượt mà đáp ứng tiêu chuẩn trải nghiệm UI/UX cao cấp.
* **Styling:** **Tailwind CSS** (Giúp xây dựng giao diện Minimalist nhanh chóng, nhất quang về typographic và layout hệ thống).

### 2.2. Phân Hệ Xử Lý & Điều Hướng (Server Side / Backend)
* **Môi trường chạy:** **Node.js**
* **Framework:** **Express.js** (Framework mã nguồn mở gọn nhẹ, tối ưu để xây dựng các RESTful API phân lớp chuyên nghiệp).
* **Giao tiếp Database:** **Prisma ORM** (Công cụ quản trị dữ liệu mạnh mẽ, giúp đồng bộ cấu trúc từ code Server thẳng lên cơ sở dữ liệu mà không cần thao tác thủ công).

### 2.3. Hệ Quản Trị Cơ Sở Dữ Liệu (Database & Hosting)
* **Hệ cơ sở dữ liệu:** **MySQL 8.4** (Hệ quản trị cơ sở dữ liệu quan hệ mạnh mẽ, đảm bảo tính toàn vẹn và chính xác tuyệt đối cho các dữ liệu tài chính, đơn hàng).
* **Nền tảng Hosting Database:** **Aiven.io Cloud**
  * **Dịch vụ quản trị:** `mysql-305401e9` (Nằm trong project `magnular-furniture`).
  * **Bảng điều khiển Cloud:** [Aiven Console Service Overview](https://console.aiven.io/account/a5b5b116cd81/project/magnular-furniture/services/mysql-305401e9/overview)
  * **Vị trí địa lý Host:** Trung tâm dữ liệu đặt tại **Ấn Độ (India)**.
  * **Phương thức kết nối:** Kết nối an toàn từ xa thông qua chuỗi kết nối bảo mật mã hóa đường truyền bắt buộc (**SSL Mode: REQUIRED**).

### 2.4. Giải Pháp Lưu Trữ Hình Ảnh (Image Assets Management)
* **Phương thức triển khai:** Hệ thống sử dụng giải pháp **Lưu trữ CDN bên thứ ba (Cloudfront / External URL Hosting)** bằng cách quản lý các đường dẫn tuyệt đối (Absolute URLs).
* **Cơ chế lưu trữ DB:** Trong cơ sở dữ liệu MySQL chạy trên Cloud Aiven, cột `images` thuộc bảng `Product` hoặc `Collection` sẽ lưu chuỗi chứa các URL ảnh trực tuyến tuyệt đối (ví dụ: `https://d1yei2z3i6k35z.cloudfront.net/14433334/68ee9a06a9b0b_untitled134.png`), hỗ trợ cấu trúc nhiều ảnh phân tách bằng dấu phẩy.
* **Cơ chế render UI:** Phân hệ Client (Next.js) đọc trực tiếp các chuỗi URL tĩnh này từ API Server trả về để hiển thị hình ảnh sản phẩm lên giao diện người dùng mà không cần tiêu tốn tài nguyên lưu trữ cục bộ trên máy chủ chứa mã nguồn, giúp cấu trúc database luôn linh hoạt và gọn nhẹ.

---

## 3. Kiến Trúc Luồng Dữ Liệu Hệ Thống (Data Flow & Fetch API Execution)

Hệ thống vận hành nhịp nhàng qua 3 lớp tách biệt bảo mật, ứng dụng cơ chế giao tiếp bất đồng bộ hiện đại:

```text
[ Giao diện Client: Next.js ]
              │
              │ (1) Gửi dữ liệu JSON bằng cú pháp [async/await fetch]
              ▼
[ Máy chủ Server: Node.js / Express ]  <─── Read/Write ───> [ Cấu hình Prisma ORM ]
              │                                                     │
              │ (2) Kiểm tra & Xử lý logic nghiệp vụ                  │ (Đẩy cấu trúc bảng SQL)
              ▼                                                     ▼
[ Hệ Cơ Sở Dữ Liệu: Cloud MySQL ] ──────────────────────────────────┘
    (Hosted in India via Aiven)