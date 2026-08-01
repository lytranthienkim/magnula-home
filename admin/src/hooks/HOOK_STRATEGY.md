# Hook Architecture Strategy

##Khi nào sử dụng Generic Hook vs Custom Wrapper Hook?

### 1️⃣ DÙNG TRỰC TIẾP GENERIC HOOK (`useItemForm`, `useListManagement`, etc.)

**Khi nào:**
- Feature có logic cơ bản (CRUD đơn giản)
- Không có state phụ thuộc phức tạp
- Validation đơn giản (1-2 check)
- Dùng ngay tại component file

**Ví dụ: PaymentMethods**
```javascript
// KHÔNG NÊN: payment-methods/page.jsx
import usePaymentMethodsForm from '@/hooks/usePaymentMethodsForm'; // Thừa!

// NÊN: payment-methods/page.jsx
import { useItemForm } from '@/hooks/useItemForm';
import { createPaymentMethod } from '@/api/paymentMethod';

const paymentForm = useItemForm({
  initialValues: { name: '', isActive: true },
  createFn: createPaymentMethod,
  onSuccess: (res) => setItems(prev => [res.data, ...prev]),
});

// Inline validation in button
onClick={() => {
  if (!formData.name) { paymentForm.setFormError('Name required'); return; }
  paymentForm.handleSubmit();
}}
```

---

### 2️⃣ TẠO CUSTOM WRAPPER HOOK (khi quá phức tạp)

**Khi nào:**
- Logic phức tạp/nhiều state (5+ useState)
- Validation phức tạp (3+ rules)
- Có dependencies lẫn nhau (country → state → city)
- Dùng lại ở nhiều components
- Business logic cụ thể không tái sử dụng

**Ví dụ: OrderForm (giữ lại)**
```javascript
// NÊN TẠO: useOrderForm.js
// Vì:
// - 7 extended states (selectedProducts, states, variants, etc.)
// - Phức tạp: country → fetch states → fetch variants
// - Custom logic: stock validation, product add/remove
// - Sử dụng ở 1 chỗ nhưng logic quá nặng để put in component

const form = useItemForm({ /* skeleton */ });
const [selectedProducts, setSelectedProducts] = useState([]);
const [states, setStates] = useState([]);
// ... extended logic ...
```

---

## 📊 Hook Architecture Pattern

```
┌─────────────────────────────────────────────┐
│          Generic Hooks (Reusable)           │
├─────────────────────────────────────────────┤
│ useItemForm        → Form state skeleton    │
│ useItemModal       → Modal state skeleton   │
│ useListManagement  → List + Filter + Sort   │
└─────────────────────────────────────────────┘
                         ↓
                    [Choose Path]
                    /            \
                   /              \
          [Simple]              [Complex]
           /                        \
          ↓                          ↓
    Use Direct              Create Wrapper
   in Component            Custom Hook
        ↓                        ↓
  PaymentMethods         OrderForm, ProductForm
  (20 lines form)        (150+ lines form)
```

---

## 🗂️ Hiện tại có nên giữ `usePaymentMethodsForm`?

**ĐÁP: KHÔNG**

- File hiện tại chỉ 32 dòng, toàn boilerplate
- Chỉ có 1 validation (name required)
- Dùng tại 1 component
- Không có state phụ thuộc

**➜ Giải pháp:** Xoá file, dùng `useItemForm` trực tiếp tại `payment-methods/page.jsx` (đã thực hiện ✓)

---

## Checklist tạo Custom Hook

Chỉ tạo custom hook khi **ÍT NHẤT 2 điều đúng**:

- [ ] Logic phức tạp (5+ state, 3+ handler, dependencies phức tạp)
- [ ] Reusable ở 2+ components
- [ ] Business logic cụ thể của feature
- [ ] Validation phức tạp (3+ rules)
- [ ] State phụ thuộc lẫn nhau

---

## 📋 Hook Inventory

### Để Giữ
- `useItemForm` - Generic form skeleton
- `useItemModal` - Generic modal skeleton
- `useListManagement` - Generic list management
- `useOrderForm` - Complex order form (7+ state)
- `useOrdersAPI` - API wrapper + metadata
- `useOrdersModal` - Order modal wrapper

### Để Xoá 🗑️
- ~~`usePaymentMethodsForm`~~ - Quá đơn giản, dùng `useItemForm` trực tiếp

### Để Đánh giá 🔍
- `usePaymentMethodsAPI` - Chỉ 8 dòng, có thể xoá, dùng `useListManagement` trực tiếp?
- `usePaymentMethodsModal` - Chỉ wrap `useItemModal`, có cần không?

---

## 🎓 Rule of Thumb

```
Generic Hook + Simple Validation in Component
< Custom Wrapper Hook
< All logic in Component
```

**Tốt nhất:** Generic Hook được dùng trực tiếp ở component
**Tốt:** Custom Hook cho logic phức tạp
**Tệ nhất:** Toàn bộ logic ở component
