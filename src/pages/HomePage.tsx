import React, { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Alert,
    Container
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import { useAppDispatch } from '../store/hooks';
import { addSearch } from '../store/searchHistorySlice';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
    word: string;
    score: number;
    tags: string[];
}

const HomePage: React.FC = () => {
    const [input, setInput] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!input.trim()) {
            setError("Please fill in the search field");
            return;
        }

        setLoading(true);
        setError("");
        setResults([]);

        try {
            // Call Datamuse API with ml parameter using axios
            const response = await axios.get(`https://api.datamuse.com/words`, {
                params: {
                    ml: input.trim()
                }
            });

            const searchResults = Array.isArray(response.data) ? response.data : [response.data];
            setResults(searchResults);

            // Save to Redux store
            dispatch(addSearch({
                query: input.trim(),
                results: searchResults
            }));
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || err.message || "An error occurred while fetching data");
            } else {
                setError("An error occurred while fetching data");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Box
            sx={{
                height: "100vh",
                width: "100vw",
                background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: 2,
                overflow: "hidden",
                boxSizing: "border-box",
                "&::-webkit-scrollbar": {
                    display: "none",
                },
                "-ms-overflow-style": "none",
                "scrollbarWidth": "none",
            }}
        >
            <Container maxWidth="lg" sx={{ height: '100%', overflow: 'hidden', "&::-webkit-scrollbar": { display: "none" }, "-ms-overflow-style": "none", "scrollbarWidth": "none", display: 'flex', flexDirection: 'column', padding: 0, boxSizing: "border-box" }}>
                <Paper
                    elevation={24}
                    sx={{
                        backdropFilter: "blur(10px)",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        padding: 3,
                        borderRadius: 4,
                        width: "100%",
                        color: "white",
                        textAlign: "center",
                        marginBottom: 2,
                        flexShrink: 0,
                        boxSizing: "border-box",
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ color: "white" }}
                        >
                            📚 Word Search Dashboard
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/history')}
                                startIcon={<HistoryIcon />}
                                sx={{
                                    color: 'white',
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    '&:hover': {
                                        borderColor: 'rgba(255, 255, 255, 0.8)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                }}
                            >
                                History
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/')}
                                startIcon={<LogoutIcon />}
                                sx={{
                                    color: 'white',
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    '&:hover': {
                                        borderColor: 'rgba(255, 255, 255, 0.8)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                }}
                            >
                                Logout
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, alignItems: 'center', justifyContent: 'center' }}>
                        <TextField
                            fullWidth
                            label="Enter words or phrases to find similar words"
                            variant="outlined"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            sx={{
                                maxWidth: { sm: '400px' },
                                '& .MuiOutlinedInput-root': {
                                    color: 'white',
                                    '& fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.3)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.5)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'rgba(255, 255, 255, 0.8)',
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    '&.Mui-focused': {
                                        color: 'rgba(255, 255, 255, 0.9)',
                                    },
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSearch}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                            sx={{
                                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                                color: 'white',
                                fontWeight: 'bold',
                                padding: '12px 24px',
                                minWidth: '120px',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 90%)',
                                },
                                '&:disabled': {
                                    background: 'rgba(255, 255, 255, 0.3)',
                                },
                            }}
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </Button>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ marginTop: 3, backgroundColor: 'rgba(244, 67, 54, 0.1)' }}>
                            {error}
                        </Alert>
                    )}
                </Paper>

                {/* Results Section */}
                {results.length > 0 && (
                    <Paper
                        elevation={24}
                        sx={{
                            backdropFilter: "blur(10px)",
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            padding: 1.5,
                            borderRadius: 4,
                            width: "100%",
                            color: "white",
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            boxSizing: "border-box",
                        }}
                    >
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            gutterBottom
                            sx={{ color: "white", marginBottom: 3, textAlign: "center" }}
                        >
                            📊 Search Results ({results.length})
                        </Typography>

                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                md: 'repeat(2, 1fr)',
                                lg: 'repeat(3, 1fr)',
                                xl: 'repeat(3, 1fr)'
                            },
                            gap: 2,
                            width: '100%',
                            alignContent: 'start',
                            overflow: 'auto',
                            "&::-webkit-scrollbar": { display: "none" },
                            "-ms-overflow-style": "none",
                            "scrollbarWidth": "none",
                        }}>
                            {results.map((result, index) => (
                                <Card
                                    key={`${result.word}-${index}`}
                                    sx={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        transition: 'transform 0.2s ease-in-out',
                                        height: 'auto',
                                        minHeight: '120px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ display: 'flex', flexDirection: 'column', padding: 2 }}>
                                        <Typography
                                            variant="h6"
                                            component="div"
                                            sx={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                marginBottom: 1,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                fontSize: '1.1rem'
                                            }}
                                        >
                                            {result.word}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.8)',
                                                lineHeight: 1.4,
                                                marginBottom: 1,
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Score: {result.score.toLocaleString()}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.6)',
                                                display: 'block',
                                                marginTop: 1,
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            Tags: {result.tags.join(', ')}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Paper>
                )}
            </Container>
        </Box>
    );
};

export default HomePage;
