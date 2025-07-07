import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("https://localhost:7235/api/Product");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // Map data to match the structure used in the frontend
      return data.map(p => ({
        id: p.id,
        name: p.title,
        shortName: p.title,
        description: p.descriptions,
        price: p.price,
        img: p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls[0] : '',
        category: p.categoryName, // Add category from API
        addedDate: p.createdAt,
        discount: 0,
        rate: 4,
        votes: 0,
        colors: [],
        quantity: 1,
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productsDataLocal = localStorage.getItem("productsSliceData");

const initialState = productsDataLocal
  ? JSON.parse(productsDataLocal)
  : {
      allProducts: [],
      loading: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
      error: null,
      saveBillingInfoToLocal: false,
      favoritesProducts: [],
      searchProducts: [],
      orderProducts: [],
      cartProducts: [],
      wishList: [],
      productQuantity: 1,
      selectedProduct: null,
      removeOrderProduct: "",
    };

const productsSlice = createSlice({
  initialState,
  name: "productsSlice",
  reducers: {
    updateProductsState: (state, { payload: { key, value } }) => {
      state[key] = value;
    },
    addToArray: (state, { payload: { key, value } }) => {
      state[key].push(value);
    },
    removeById: (state, { payload: { key, id } }) => {
      const updatedState = state[key].filter((item) => item.id !== id);
      state[key] = updatedState;
    },
    removeByKeyName: (state, { payload: { dataKey, itemKey, keyValue } }) => {
      const updatedState = state[dataKey].filter(
        (item) => item[itemKey] !== keyValue
      );
      state[dataKey] = updatedState;
    },
    setEmptyArrays: (state, { payload: { keys } }) => {
      for (let i = 0; i < keys.length; i++) state[keys[i]] = [];
    },
    transferProducts: (state, { payload: { from, to } }) => {
      state[to] = state[to].concat(state[from]);
      state[from] = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.allProducts = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  updateProductsState,
  addToArray,
  removeById,
  removeByKeyName,
  setEmptyArrays,
  transferProducts,
} = productsSlice.actions;
export default productsSlice.reducer;
