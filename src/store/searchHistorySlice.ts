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

// ✅ Function to build params with 12 if conditions - Fixed for Datamuse API
function buildSearchParams(searchType: string, query: string) {
    const trimmedQuery = query.trim();
    let params: any = {};

    if (searchType === "ml") {
        // Words with meaning similar to query
        params.ml = trimmedQuery;
    }
    else if (searchType === "ml_sp") {
        // Words related to query that start with specific letter
        const parts = trimmedQuery.split(" ");
        if (parts.length !== 2) throw new Error("Please enter two parts: word and letter (e.g., 'duck b')");
        params.ml = parts[0];
        params.sp = `${parts[1]}*`;
    }
    else if (searchType === "ml_sp_end") {
        // Words related to query that end with specific letter
        const parts = trimmedQuery.split(" ");
        if (parts.length !== 2) throw new Error("Please enter two parts: word and letter (e.g., 'spoon a')");
        params.ml = parts[0];
        params.sp = `*${parts[1]}`;
    }
    else if (searchType === "sl") {
        // Words that sound like query
        params.sl = trimmedQuery;
    }
    else if (searchType === "sp_pattern") {
        // Words with specific pattern
        const parts = trimmedQuery.split(" ");
        if (parts.length !== 3) throw new Error("Please enter three parts: start letter, end letter, number (e.g., 't k 2')");
        const middleCount = parseInt(parts[2]);
        if (isNaN(middleCount)) throw new Error("Third part must be a valid number");
        params.sp = `${parts[0]}${"?".repeat(middleCount)}${parts[1]}`;
    }
    else if (searchType === "sp") {
        // Words spelled similarly to query
        params.sp = trimmedQuery;
    }
    else if (searchType === "rel_jjb") {
        // Adjectives that describe query
        params.rel_jjb = trimmedQuery;
    }
    else if (searchType === "rel_jjb_topic") {
        // Adjectives describing query, sorted by topic
        const parts = trimmedQuery.split(" ");
        if (parts.length < 2) throw new Error("Please enter word and topic (e.g., 'ocean temperature')");
        params.rel_jjb = parts[0];
        // Note: topic parameter might not work well, so we'll use rel_jjb only
        // params.topic = parts.slice(1).join(" ");
    }
    else if (searchType === "rel_jja") {
        // Nouns that are described by query adjective
        params.rel_jja = trimmedQuery;
    }
    else if (searchType === "lc_sp") {
        // Words that often follow query in a sentence, starting with specific letter
        const parts = trimmedQuery.split(" ");
        if (parts.length !== 2) throw new Error("Please enter two parts: word and letter (e.g., 'drink w')");
        params.lc = parts[0];
        params.sp = `${parts[1]}*`;
    }
    else if (searchType === "rel_trg") {
        // Words triggered by (strongly associated with) query
        params.rel_trg = trimmedQuery;
    }
    else {
        // Default fallback to ml
        params.ml = trimmedQuery;
    }

    // Add common parameters for better results
    params.max = 100;

    return params;
}

// Async thunk for API call
export const fetchSearchResults = createAsyncThunk(
    'searchHistory/fetchSearchResults',
    async ({ query, searchType }: { query: string; searchType: string }, { rejectWithValue }) => {
        try {
            const trimmedQuery = query.trim();

            // Special case for /sug
            if (searchType === 'sug') {
                try {
                    const sugResponse = await axios.get(`https://api.datamuse.com/sug`, {
                        params: { s: trimmedQuery },
                        timeout: 10000,
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });
                    return sugResponse.data;
                } catch (sugError) {
                    return rejectWithValue("Failed to get word suggestions");
                }
            }

            // ✅ Use function to build params
            let params;
            try {
                params = buildSearchParams(searchType, trimmedQuery);
            } catch (error) {
                if (error instanceof Error) {
                    return rejectWithValue(error.message);
                }
                return rejectWithValue("Invalid search parameters");
            }

            console.log('🔍 API Request Details:');
            console.log('  Search Type:', searchType);
            console.log('  Query:', trimmedQuery);
            console.log('  Parameters:', params);
            console.log('  Full URL:', `https://api.datamuse.com/words?${new URLSearchParams(params).toString()}`);

            const response = await axios.get(`https://api.datamuse.com/words`, {
                params,
                timeout: 10000,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            console.log('📡 API Response received:', response.status, response.data.length, 'results');

            if (Array.isArray(response.data)) {
                if (response.data.length > 0) {
                    // Sanitize the data to ensure all results have valid tags
                    response.data.forEach((item: any) => {
                        if (!item.tags || !Array.isArray(item.tags)) {
                            item.tags = [];
                        }
                        // Ensure other required fields exist
                        if (!item.word) item.word = 'Unknown';
                        if (typeof item.score !== 'number') item.score = 0;
                    });
                }
            }

            return response.data;

        } catch (error) {
            console.error(`API Error for ${searchType}:`, error);

            if (axios.isAxiosError(error)) {
                console.error('Response status:', error.response?.status);
                console.error('Response data:', error.response?.data);
                console.error('Request URL:', error.config?.url);
                console.error('Request params:', error.config?.params);

                // Try fallback with ml parameter for non-suggestion searches
                if (searchType !== 'sug' && searchType !== 'ml') {
                    console.log(`Trying fallback with 'ml' parameter for ${searchType}...`);
                    try {
                        const fallbackResponse = await axios.get(`https://api.datamuse.com/words`, {
                            params: { ml: query.trim(), max: 100 },
                            timeout: 10000,
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            }
                        });
                        console.log('🔄 Fallback API Response received:', fallbackResponse.status, fallbackResponse.data.length, 'results');

                        if (Array.isArray(fallbackResponse.data)) {
                            if (fallbackResponse.data.length > 0) {
                                // Sanitize fallback data to ensure all results have valid tags
                                fallbackResponse.data.forEach((item: any) => {
                                    if (!item.tags || !Array.isArray(item.tags)) {
                                        item.tags = [];
                                    }
                                    // Ensure other required fields exist
                                    if (!item.word) item.word = 'Unknown';
                                    if (typeof item.score !== 'number') item.score = 0;
                                    // Add fallback tag
                                    item.tags.push('fallback_search');
                                });
                            }
                        }

                        return fallbackResponse.data;
                    } catch (fallbackError) {
                        console.error('Fallback also failed:', fallbackError);
                    }
                }
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

                // Automatically add successful search to history
                if (action.payload && Array.isArray(action.payload) && action.payload.length > 0) {
                    // Get the original query from the action meta
                    const originalQuery = action.meta.arg?.query || 'Unknown query';
                    const searchType = action.meta.arg?.searchType || 'Unknown type';

                    const newSearch: SearchHistoryItem = {
                        id: Date.now().toString(),
                        query: `${searchType}: ${originalQuery}`,
                        results: action.payload,
                        timestamp: Date.now()
                    };

                    state.searches.unshift(newSearch);
                    if (state.searches.length > 20) {
                        state.searches = state.searches.slice(0, 20);
                    }
                }
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
