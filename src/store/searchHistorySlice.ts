import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface SearchResult {
    word: string;
    score: number;
    tags: string[];
}

export interface SearchHistoryItem {
    id: string;
    query: string;
    results: SearchResult[];
    timestamp: number;
}

interface SearchHistoryState {
    searches: SearchHistoryItem[];
    currentSearch: {
        results: SearchResult[];
        loading: boolean;
        error: string | null;
    };
}

const initialState: SearchHistoryState = {
    searches: [],
    currentSearch: {
        results: [],
        loading: false,
        error: null
    }
};

// Async thunk for API call
export const fetchSearchResults = createAsyncThunk(
    'searchHistory/fetchSearchResults',
    async (query: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://api.datamuse.com/words`, {
                params: { ml: query.trim() }
            });
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data?.message || error.message || "An error occurred while fetching data");
            }
            return rejectWithValue("An error occurred while fetching data");
        }
    }
);

const searchHistorySlice = createSlice({
    name: 'searchHistory',
    initialState,
    reducers: {
        addSearch: (state, action: PayloadAction<{ query: string; results: SearchResult[] }>) => {
            const newSearch: SearchHistoryItem = {
                id: Date.now().toString(),
                query: action.payload.query,
                results: action.payload.results,
                timestamp: Date.now()
            };
            state.searches.unshift(newSearch);
            // Keep only the last 20 searches
            if (state.searches.length > 20) {
                state.searches = state.searches.slice(0, 20);
            }
        },
        removeSearch: (state, action: PayloadAction<string>) => {
            state.searches = state.searches.filter(search => search.id !== action.payload);
        },
        clearHistory: (state) => {
            state.searches = [];
        },
        clearCurrentSearch: (state) => {
            state.currentSearch = {
                results: [],
                loading: false,
                error: null
            };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSearchResults.pending, (state) => {
                state.currentSearch.loading = true;
                state.currentSearch.error = null;
            })
            .addCase(fetchSearchResults.fulfilled, (state, action) => {
                state.currentSearch.loading = false;
                state.currentSearch.results = action.payload;
                state.currentSearch.error = null;
            })
            .addCase(fetchSearchResults.rejected, (state, action) => {
                state.currentSearch.loading = false;
                state.currentSearch.error = action.payload as string;
                state.currentSearch.results = [];
            });
    }
});

export const { addSearch, removeSearch, clearHistory, clearCurrentSearch } = searchHistorySlice.actions;
export default searchHistorySlice.reducer;
