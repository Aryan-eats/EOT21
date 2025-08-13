import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // {id, name, price, quantity, image, restaurant}
  orderHistory: [], // Store completed orders
  currentOrder: null, // Current active order for tracking
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const item = action.payload;
      const existing = state.items.find(i => i.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      // Move current cart to order history before clearing
      if (state.items.length > 0) {
        const order = {
          id: `ORD${Date.now()}`,
          items: [...state.items],
          total: state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
          orderTime: new Date().toISOString(),
          status: 'confirmed',
          restaurant: state.items[0]?.restaurant || '',
        };
        state.orderHistory.push(order);
        state.currentOrder = order;
      }
      state.items = [];
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status, time } = action.payload;
      if (state.currentOrder?.id === orderId) {
        state.currentOrder.status = status;
        if (time) state.currentOrder.lastUpdate = time;
      }
      const orderIndex = state.orderHistory.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        state.orderHistory[orderIndex].status = status;
        if (time) state.orderHistory[orderIndex].lastUpdate = time;
      }
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, updateOrderStatus } = cartSlice.actions;
export default cartSlice.reducer; 