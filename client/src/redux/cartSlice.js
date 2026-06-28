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
                // Only add if stock > 0
                if (newItem.stock <= 0) {
                    return;
                }
                state.items.push({
                    ...newItem,
                    quantity: 1,
                });
                state.totalQuantity += 1;
            } else {
                // Check stock before increasing quantity
                if (existingItem.quantity >= newItem.stock) {
                    return;
                }
                existingItem.quantity++;
                state.totalQuantity += 1;
            }
        },
        removeFromCart: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);

            if (existingItem) {
                state.totalQuantity -= existingItem.quantity;
                state.items = state.items.filter(item => item.id !== id);
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.totalQuantity = 0;
        },
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
            // Nếu quantity = 1, không giảm được nữa (prevent decrease)
        }
    },
});

export const {addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart} = cartSlice.actions; //xuat action de hanh dong, dinh nghi addtocart ben trong reducer la de sinh ra mot action creator co cung ten
//tra ve object co cau truc la { type: "cart/addToCart", payload: product }
//cap phat 1 hanh dong
export default cartSlice.reducer;
//nhan va xu ly hanh dong do
