import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

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
}

const initialState: SearchHistoryState = {
    searches: []
};

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
        }
    }
});

export const { addSearch, removeSearch, clearHistory } = searchHistorySlice.actions;
export default searchHistorySlice.reducer;
