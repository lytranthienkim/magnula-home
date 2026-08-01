import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    items: [],
    totalQuantity: 0
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.items.find(item => item.id === newItem.id);

            if (!existingItem) {
                if (newItem.stock <= 0) {
                    return; 
                }
                state.items.push({ 
                    ...newItem,
                    quantity: 1, 
                });
                state.totalQuantity += 1; 
            } else {
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
                if (existingItem.quantity >= stock) {
                    return;
                }
                existingItem.quantity++;
                state.totalQuantity++;
            }
        },

        decreaseQuantity: (state, action) => {
            const id = action.payload;
            const existingItem = state.items.find(item => item.id === id);

            if (existingItem && existingItem.quantity > 1) {
                existingItem.quantity--;
                state.totalQuantity--;
            }
        }
    },
});

export const {addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart} = cartSlice.actions;
export default cartSlice.reducer;