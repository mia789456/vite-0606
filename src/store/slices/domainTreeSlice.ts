import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getDomainTree } from '../../services/api';

interface DomainNode {
  title: string;
  list: string[];
}

interface DomainTreeState {
  root: DomainNode | null;
  children: DomainNode[];
  loading: boolean;
  error: string | null;
}

const initialState: DomainTreeState = {
  root: null,
  children: [],
  loading: false,
  error: null,
};

export const fetchDomainTree = createAsyncThunk(
  'domainTree/fetchDomainTree',
  async (_, thunkAPI) => {
    try {
      return await getDomainTree();
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
);

const domainTreeSlice = createSlice({
  name: 'domainTree',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDomainTree.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDomainTree.fulfilled, (state, action) => {
        state.loading = false;
        state.root = action.payload.root;
        state.children = action.payload.children;
      })
      .addCase(fetchDomainTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default domainTreeSlice.reducer; 