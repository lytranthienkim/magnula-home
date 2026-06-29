import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: {
    data: [],
    loading: false,
    error: null,
    lastFetch: null,
    cacheExpiry: 5 * 60 * 1000, // 5 minutes
  },
  orders: {
    data: [],
    loading: false,
    error: null,
    lastFetch: null,
    cacheExpiry: 5 * 60 * 1000,
  },
  productRequests: {
    data: [],
    loading: false,
    error: null,
    lastFetch: null,
    cacheExpiry: 5 * 60 * 1000,
  },
  ordersCount: {
    data: 0,
    loading: false,
    error: null,
    lastFetch: null,
    cacheExpiry: 60 * 1000, // 1 minute for counts
  },
  requestsCount: {
    data: 0,
    loading: false,
    error: null,
    lastFetch: null,
    cacheExpiry: 60 * 1000,
  },
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    // Products
    setProductsLoading: (state) => {
      state.products.loading = true;
      state.products.error = null;
    },
    setProductsSuccess: (state, action) => {
      state.products.data = action.payload;
      state.products.loading = false;
      state.products.error = null;
      state.products.lastFetch = Date.now();
    },
    setProductsError: (state, action) => {
      state.products.loading = false;
      state.products.error = action.payload;
    },

    // Orders
    setOrdersLoading: (state) => {
      state.orders.loading = true;
      state.orders.error = null;
    },
    setOrdersSuccess: (state, action) => {
      state.orders.data = action.payload;
      state.orders.loading = false;
      state.orders.error = null;
      state.orders.lastFetch = Date.now();
    },
    setOrdersError: (state, action) => {
      state.orders.loading = false;
      state.orders.error = action.payload;
    },

    // Product Requests
    setProductRequestsLoading: (state) => {
      state.productRequests.loading = true;
      state.productRequests.error = null;
    },
    setProductRequestsSuccess: (state, action) => {
      state.productRequests.data = action.payload;
      state.productRequests.loading = false;
      state.productRequests.error = null;
      state.productRequests.lastFetch = Date.now();
    },
    setProductRequestsError: (state, action) => {
      state.productRequests.loading = false;
      state.productRequests.error = action.payload;
    },

    // Orders Count (lightweight)
    setOrdersCountLoading: (state) => {
      state.ordersCount.loading = true;
      state.ordersCount.error = null;
    },
    setOrdersCountSuccess: (state, action) => {
      state.ordersCount.data = action.payload;
      state.ordersCount.loading = false;
      state.ordersCount.error = null;
      state.ordersCount.lastFetch = Date.now();
    },
    setOrdersCountError: (state, action) => {
      state.ordersCount.loading = false;
      state.ordersCount.error = action.payload;
    },

    // Requests Count (lightweight)
    setRequestsCountLoading: (state) => {
      state.requestsCount.loading = true;
      state.requestsCount.error = null;
    },
    setRequestsCountSuccess: (state, action) => {
      state.requestsCount.data = action.payload;
      state.requestsCount.loading = false;
      state.requestsCount.error = null;
      state.requestsCount.lastFetch = Date.now();
    },
    setRequestsCountError: (state, action) => {
      state.requestsCount.loading = false;
      state.requestsCount.error = action.payload;
    },

    // Cache invalidation
    invalidateProductsCache: (state) => {
      state.products.lastFetch = null;
    },
    invalidateOrdersCache: (state) => {
      state.orders.lastFetch = null;
    },
    invalidateProductRequestsCache: (state) => {
      state.productRequests.lastFetch = null;
    },
  },
});

export const {
  setProductsLoading,
  setProductsSuccess,
  setProductsError,
  setOrdersLoading,
  setOrdersSuccess,
  setOrdersError,
  setProductRequestsLoading,
  setProductRequestsSuccess,
  setProductRequestsError,
  setOrdersCountLoading,
  setOrdersCountSuccess,
  setOrdersCountError,
  setRequestsCountLoading,
  setRequestsCountSuccess,
  setRequestsCountError,
  invalidateProductsCache,
  invalidateOrdersCache,
  invalidateProductRequestsCache,
} = dataSlice.actions;

// Selectors with cache validation
export const selectProducts = (state) => {
  const { data, lastFetch, cacheExpiry } = state.data.products;
  const isCacheValid = lastFetch && (Date.now() - lastFetch < cacheExpiry);
  return { data: isCacheValid ? data : [], isCached: isCacheValid, lastFetch };
};

export const selectOrders = (state) => {
  const { data, lastFetch, cacheExpiry } = state.data.orders;
  const isCacheValid = lastFetch && (Date.now() - lastFetch < cacheExpiry);
  return { data: isCacheValid ? data : [], isCached: isCacheValid, lastFetch };
};

export const selectProductRequests = (state) => {
  const { data, lastFetch, cacheExpiry } = state.data.productRequests;
  const isCacheValid = lastFetch && (Date.now() - lastFetch < cacheExpiry);
  return { data: isCacheValid ? data : [], isCached: isCacheValid, lastFetch };
};

export default dataSlice.reducer;
