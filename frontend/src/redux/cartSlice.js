import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* ================= FETCH CART ================= */
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId) => {
    const res = await axios.get(
      `http://localhost:8000/api/cart/${userId}`
    );
    return res.data.items || [];
  }
);

/* ================= SLICE ================= */
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
