# MAGNULAR Backend API Documentation

Tài liệu hướng dẫn chi tiết về các API endpoints cho hệ thống backend cửa hàng sofa MAGNULAR.

**Base URL:** `http://localhost:3000/api`

---

## 1. PRODUCT ENDPOINTS (Sản Phẩm)

### 1.1 Lấy tất cả sản phẩm
```
GET /api/products
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sofa Minimalist Classic",
      "slug": "sofa-minimalist-classic",
      "price": 5000000,
      "images": "https://example.com/image1.jpg,https://example.com/image2.jpg",
      "stock": 10,
      "overallInfo": "W: 200cm, H: 80cm, D: 90cm",
      "seatInfo": "Seat height: 45cm",
      "collectionId": 1,
      "collection": { ... }
    }
  ]
}
```

### 1.2 Lấy sản phẩm theo ID
```
GET /api/products/:id
```
**Example:** `GET /api/products/1`

### 1.3 Lấy sản phẩm theo Collection
```
GET /api/collection/:collectionId/products
```
**Example:** `GET /api/collection/1/products`

### 1.4 Tạo sản phẩm mới
```
POST /api/products
```
**Request Body:**
```json
{
  "name": "Sofa Minimalist Classic",
  "slug": "sofa-minimalist-classic",
  "price": 5000000,
  "images": "https://example.com/image1.jpg,https://example.com/image2.jpg",
  "stock": 10,
  "collectionId": 1,
  "overallInfo": "W: 200cm, H: 80cm, D: 90cm",
  "seatInfo": "Seat height: 45cm"
}
```

### 1.5 Cập nhật sản phẩm
```
PUT /api/products/:id
```
**Example:** `PUT /api/products/1`
**Request Body:** (Có thể cập nhật bất kỳ trường nào)
```json
{
  "price": 4500000,
  "stock": 8
}
```

### 1.6 Xóa sản phẩm
```
DELETE /api/products/:id
```
**Example:** `DELETE /api/products/1`

---

## 2. COLLECTION ENDPOINTS (Bộ Sưu Tập)

### 2.1 Lấy tất cả bộ sưu tập
```
GET /api/collections
```

### 2.2 Lấy bộ sưu tập theo ID
```
GET /api/collections/:id
```
**Example:** `GET /api/collections/1`

### 2.3 Lấy bộ sưu tập theo Slug
```
GET /api/collections/slug/:slug
```
**Example:** `GET /api/collections/slug/classic-collection`

### 2.4 Tạo bộ sưu tập mới
```
POST /api/collections
```
**Request Body:**
```json
{
  "name": "Classic Collection",
  "slug": "classic-collection",
  "images": "https://example.com/collection1.jpg,https://example.com/collection2.jpg"
}
```

### 2.5 Cập nhật bộ sưu tập
```
PUT /api/collections/:id
```

### 2.6 Xóa bộ sưu tập
```
DELETE /api/collections/:id
```

---

## 3. CUSTOMER ENDPOINTS (Khách Hàng)

### 3.1 Lấy tất cả khách hàng
```
GET /api/customers
```

### 3.2 Lấy khách hàng theo ID
```
GET /api/customers/:id
```
**Example:** `GET /api/customers/1`

### 3.3 Lấy khách hàng theo Email
```
GET /api/customers/email/:email
```
**Example:** `GET /api/customers/email/customer@example.com`

### 3.4 Tìm kiếm khách hàng
```
GET /api/customers/search?query=Nguyễn
```

### 3.5 Cập nhật khách hàng
```
PUT /api/customers/:id
```
**Request Body:**
```json
{
  "firstname": "Nguyễn",
  "lastname": "Văn A",
  "email": "nguyenvana@example.com",
  "phone": "0987654321",
  "address": "123 Đường ABC",
  "city": "Hà Nội",
  "country": "Việt Nam",
  "apartment": "Apt 201",
  "postalCode": "100000"
}
```

### 3.6 Xóa khách hàng
```
DELETE /api/customers/:id
```

---

## 4. ORDER ENDPOINTS (Đơn Hàng)

### 4.1 Lấy tất cả đơn hàng
```
GET /api/orders
```

### 4.2 Lấy đơn hàng theo ID
```
GET /api/orders/:id
```
**Example:** `GET /api/orders/1`

### 4.3 Lấy đơn hàng của khách hàng
```
GET /api/customers/:customerId/orders
```
**Example:** `GET /api/customers/1/orders`

### 4.4 Lấy đơn hàng theo trạng thái
```
GET /api/orders/status/:status
```
**Status Values:** `pending`, `processing`, `shipped`, `completed`, `cancelled`
**Example:** `GET /api/orders/status/pending`

### 4.5 Cập nhật trạng thái đơn hàng
```
PUT /api/orders/:id/status
```
**Request Body:**
```json
{
  "status": "processing"
}
```
**Allowed Status:** `pending`, `processing`, `shipped`, `completed`, `cancelled`

### 4.6 Xóa đơn hàng
```
DELETE /api/orders/:id
```

---

## 5. CHECKOUT ENDPOINT (Thanh Toán)

### 5.1 Tạo đơn hàng mới (Guest Checkout)
```
POST /api/checkout
```
**Request Body:**
```json
{
  "customerInfo": {
    "firstname": "Nguyễn",
    "lastname": "Văn A",
    "email": "customer@example.com",
    "phone": "0987654321",
    "country": "Việt Nam",
    "address": "123 Đường ABC",
    "city": "Hà Nội",
    "apartment": "Apt 201",
    "postalCode": "100000"
  },
  "cartItems": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 5000000,
      "selectedOverall": "W: 200cm, H: 80cm, D: 90cm",
      "selectedSeat": "Seat height: 45cm"
    },
    {
      "productId": 2,
      "quantity": 1,
      "price": 3000000,
      "selectedOverall": "W: 180cm, H: 75cm, D: 85cm",
      "selectedSeat": "Seat height: 42cm"
    }
  ],
  "shippingFee": 200000,
  "totalPrice": 13200000,
  "paymentMethod": "credit_card"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully!",
  "data": {
    "id": 1,
    "firstname": "Nguyễn",
    "lastname": "Văn A",
    "email": "customer@example.com",
    "phone": "0987654321",
    "country": "Việt Nam",
    "address": "123 Đường ABC",
    "city": "Hà Nội",
    "orders": [
      {
        "id": 1,
        "customerId": 1,
        "shippingFee": 200000,
        "totalPrice": 13200000,
        "status": "pending",
        "paymentMethod": "credit_card",
        "createdAt": "2026-05-21T10:30:00Z",
        "orderItems": [
          {
            "id": 1,
            "orderId": 1,
            "productId": 1,
            "quantity": 2,
            "price": 5000000,
            "selectedOverall": "W: 200cm, H: 80cm, D: 90cm",
            "selectedSeat": "Seat height: 45cm"
          }
        ]
      }
    ]
  }
}
```

---

## 6. HEALTH CHECK

### 6.1 Kiểm tra trạng thái server
```
GET /api/health
```
**Response:**
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## Error Responses

Tất cả lỗi sẽ trả về format như sau:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common Error Codes:
- **400:** Bad Request - Dữ liệu không hợp lệ
- **404:** Not Found - Tài nguyên không tìm thấy
- **409:** Conflict - Dữ liệu bị trùng lặp
- **500:** Internal Server Error - Lỗi server

---

## Important Notes

1. **Images Format**: Hình ảnh lưu dưới dạng chuỗi URL phân tách bằng dấu phẩy
   - Example: `https://example.com/img1.jpg,https://example.com/img2.jpg`

2. **Price Format**: Giá tiền lưu dưới dạng số nguyên (VND)
   - Example: 5000000 (5 triệu đồng)

3. **Order Status**: Luôn luôn mới tạo order có status là `pending`
   - Có thể chuyển: `pending` → `processing` → `shipped` → `completed`
   - Hoặc: Bất kỳ status → `cancelled`

4. **Historical Immutability**: Khi xóa sản phẩm, các order items liên quan vẫn giữ lại lịch sử mua hàng (productId = NULL)

5. **Guest Checkout**: Khách hàng không cần đăng ký tài khoản, thông tin khách hàng sẽ tự động được tạo khi checkout

---

## Testing with cURL

```bash
# Lấy tất cả sản phẩm
curl http://localhost:3000/api/products

# Lấy sản phẩm theo ID
curl http://localhost:3000/api/products/1

# Tạo sản phẩm
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sofa Test",
    "slug": "sofa-test",
    "price": 5000000,
    "images": "https://example.com/img.jpg",
    "stock": 10,
    "collectionId": 1
  }'

# Cập nhật trạng thái đơn hàng
curl -X PUT http://localhost:3000/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "processing"}'
```
