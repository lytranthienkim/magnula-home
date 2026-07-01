import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    items: [], //Chua danh sach san pham
    totalQuantity: 0
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        //type
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);

            if (!existingItem) {
                // Kiểm tra còn hàng không
                if (newItem.stock <= 0) {
                    return; // Nếu hết hàng, không thêm vào giỏ
                }
                state.items.push({ // Thêm sản phẩm mới vào giỏ hàng
                    ...newItem,
                    quantity: 1, // Mặc định số lượng là 1 vì mỗi lần thêm vào giỏ hàng là 1 sản phẩm
                });
                state.totalQuantity += 1; // Cập nhật tổng số lượng sản phẩm 
            } else {
                // Kiểm tra số lượng hiện tại với stock trước khi tăng quantity
                if (existingItem.quantity >= newItem.stock) {
                    return; // Nếu số lượng hiện tại đã bằng stock, không tăng quantity nữa
                }
                existingItem.quantity++; // Tăng số lượng sản phẩm trong giỏ hàng
                state.totalQuantity += 1; // Cập nhật tổng số lượng sản phẩm trong giỏ hàng
            }
        },
        // Xoá sản phẩm khỏi giỏ hàng
        removeFromCart: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);

            if (existingItem) { 
                state.totalQuantity -= existingItem.quantity;
                state.items = state.items.filter(item => item.id !== id); // Lọc ra các sản phẩm không có id trùng với id cần xoá, tức là xoá sản phẩm khỏi giỏ hàng
            }
        },

        // Xoá toàn bộ giỏ hàng
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
        },

        // Tăng số lượng sản phẩm trong giỏ hàng
        increaseQuantity: (state, action) => {
            const { id, stock } = action.payload;
            const existingItem = state.items.find(item => item.id === id);

            if (existingItem) {
                // Check stock before increasing quantity
                if (existingItem.quantity >= stock) {
                    return;
                }
                existingItem.quantity++;
                state.totalQuantity++;
            }
        },
        //decreaseItems
        decreaseQuantity: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);

            if (existingItem && existingItem.quantity > 1) {
                existingItem.quantity--;
                state.totalQuantity--;
            }
            // Nếu quantity = 1, không giảm được nữa 
        }
    },
});

export const {addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart} = cartSlice.actions; //xuat action de hanh dong, dinh nghi addtocart ben trong reducer la de sinh ra mot action creator co cung ten
//tra ve object co cau truc la { type: "cart/addToCart", payload: product }
//cap phat 1 hanh dong
export default cartSlice.reducer;
//nhan va xu ly hanh dong do
