import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Card,
    CardContent,
    Container,
    Button,
    TextField,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    CircularProgress,
    Alert,
    Chip
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchSearchResults, clearCurrentSearch } from '../store/searchHistorySlice';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const [input, setInput] = useState("");
    const [selectedSearchType, setSelectedSearchType] = useState<string>("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [validationError, setValidationError] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentSearch } = useAppSelector(state => state.searchHistory);
    const loading = currentSearch?.loading || false;
    const error = currentSearch?.error || null;

    const searchOptions = [
        {
            label: "Words with similar meaning",
            description: "Find words that have a meaning similar to your input",
            example: "ringing in the ears",
            type: "ml"
        },
        {
            label: "Words related to X starting with Y",
            description: "Find words related to your first input that start with your second input",
            example: "duck b",
            type: "ml_sp"
        },
        {
            label: "Words related to X ending with Y",
            description: "Find words related to your first input that end with your second input",
            example: "spoon a",
            type: "ml_sp_end"
        },
        {
            label: "Words that sound like",
            description: "Find words that sound similar to your input",
            example: "jirraf",
            type: "sl"
        },
        {
            label: "Words with specific pattern",
            description: "Find words with a specific letter pattern",
            example: "t k 2",
            type: "sp_pattern"
        },
        {
            label: "Words spelled like",
            description: "Find words that are spelled similarly to your input",
            example: "hipopatamus",
            type: "sp"
        },
        {
            label: "Adjectives describing",
            description: "Find adjectives that describe your input",
            example: "ocean",
            type: "rel_jjb"
        },
        {
            label: "Adjectives by topic",
            description: "Find adjectives describing your input, sorted by topic",
            example: "ocean by temperature",
            type: "rel_jjb_topic"
        },
        {
            label: "Nouns described by adjective",
            description: "Find nouns that are described by your input adjective",
            example: "yellow",
            type: "rel_jja"
        },
        {
            label: "Words following in sentence",
            description: "Find words that often follow your input in a sentence",
            example: "drink followed by words starting with 'w'",
            type: "lc_sp"
        },
        {
            label: "Words triggered by",
            description: "Find words strongly associated with your input",
            example: "cow",
            type: "rel_trg"
        },
        {
            label: "Word suggestions",
            description: "Get suggestions for partially typed words",
            example: "rawand",
            type: "sug"
        }
    ];

    // Clear current search when component unmounts
    useEffect(() => {
        return () => {
            dispatch(clearCurrentSearch());
        };
    }, [dispatch]);

    // Reset search state when input changes
    useEffect(() => {
        if (input.trim() !== "") {
            setHasSearched(false);
        }
    }, [input]);

    // Dropdown handlers
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSearchTypeSelect = (searchType: string) => {
        setSelectedSearchType(searchType);
        setInput(""); // Clear input when changing search type
        setValidationError(""); // Clear validation error when changing search type
        setHasSearched(false); // Reset search state when changing search type

        // Console log the search type and example API URL
        console.log(`🔍 Selected Search Type: ${searchType}`);

        // Get example query for this search type
        const searchOption = searchOptions.find(opt => opt.type === searchType);
        if (searchOption) {
            console.log(`📝 Example Query: "${searchOption.example}"`);

            // Generate the API URL that would be called
            let apiUrl = '';
            if (searchType === 'sug') {
                apiUrl = `https://api.datamuse.com/sug?s=${encodeURIComponent(searchOption.example)}`;
            } else {
                // For other search types, build the parameters
                let params: any = {};

                if (searchType === "ml") {
                    params.ml = searchOption.example;
                } else if (searchType === "ml_sp") {
                    const parts = searchOption.example.split(" ");
                    params.ml = parts[0];
                    params.sp = `${parts[1]}*`;
                } else if (searchType === "ml_sp_end") {
                    const parts = searchOption.example.split(" ");
                    params.ml = parts[0];
                    params.sp = `*${parts[1]}`;
                } else if (searchType === "sl") {
                    params.sl = searchOption.example;
                } else if (searchType === "sp_pattern") {
                    const parts = searchOption.example.split(" ");
                    const middleCount = parseInt(parts[2]);
                    params.sp = `${parts[0]}${"?".repeat(middleCount)}${parts[1]}`;
                } else if (searchType === "sp") {
                    params.sp = searchOption.example;
                } else if (searchType === "rel_jjb") {
                    params.rel_jjb = searchOption.example;
                } else if (searchType === "rel_jjb_topic") {
                    const parts = searchOption.example.split(" ");
                    params.rel_jjb = parts[0];
                } else if (searchType === "rel_jja") {
                    params.rel_jja = searchOption.example;
                } else if (searchType === "lc_sp") {
                    const parts = searchOption.example.split(" ");
                    params.lc = parts[0];
                    params.sp = `${parts[1]}*`;
                } else if (searchType === "rel_trg") {
                    params.rel_trg = searchOption.example;
                }

                params.max = 100;

                const queryString = new URLSearchParams(params).toString();
                apiUrl = `https://api.datamuse.com/words?${queryString}`;
            }

            console.log(`🔗 API URL that will be called:`);
            console.log(`   ${apiUrl}`);
            console.log(`📋 Description: ${searchOption.description}`);
        }

        handleMenuClose();
    };

    const handleTryAnotherSearch = () => {
        setHasSearched(false);
        setInput("");
        setValidationError("");
    };

    // Validate input based on search type
    const validateInput = (input: string, searchType: string): { isValid: boolean; message: string } => {
        if (!input.trim()) {
            return { isValid: false, message: "Please enter a search term" };
        }

        switch (searchType) {
            case 'ml_sp':
            case 'ml_sp_end':
            case 'lc_sp':
                const parts = input.trim().split(' ');
                if (parts.length !== 2) {
                    return {
                        isValid: false,
                        message: `Please enter two parts separated by space (e.g., "duck b" for ${searchType === 'ml_sp' ? 'words starting with' : searchType === 'ml_sp_end' ? 'words ending with' : 'words following'})`
                    };
                }
                if (parts[1].length !== 1) {
                    return {
                        isValid: false,
                        message: "Second part should be a single letter"
                    };
                }
                break;
            case 'sp_pattern':
                const patternParts = input.trim().split(' ');
                if (patternParts.length !== 3) {
                    return {
                        isValid: false,
                        message: "Please enter three parts: start letter, end letter, and number of middle letters (e.g., 't k 2')"
                    };
                }
                if (isNaN(parseInt(patternParts[2]))) {
                    return {
                        isValid: false,
                        message: "Third part should be a number"
                    };
                }
                break;
            case 'rel_jjb_topic':
                const topicParts = input.trim().split(' ');
                if (topicParts.length < 2) {
                    return {
                        isValid: false,
                        message: "Please enter word and topic separated by space (e.g., 'ocean temperature')"
                    };
                }
                break;
        }

        return { isValid: true, message: "" };
    };

    const handleSearch = async () => {
        if (!input.trim() || !selectedSearchType) {
            return;
        }

        // Validate input based on search type
        const validation = validateInput(input, selectedSearchType);
        if (!validation.isValid) {
            setValidationError(validation.message);
            return;
        }

        setValidationError(""); // Clear validation error if input is valid

        try {
            setHasSearched(true);
            console.log('🚀 Starting search...');
            console.log(`🔍 Search Type: ${selectedSearchType}`);
            console.log(`📝 Input Query: "${input.trim()}"`);
            console.log('⏳ Dispatching search action...');

            const result = await dispatch(fetchSearchResults({ query: input.trim(), searchType: selectedSearchType }));

            if (fetchSearchResults.fulfilled.match(result)) {
                console.log('✅ Search completed successfully');
                console.log('📊 Results received:', result.payload?.results?.length || 0, 'items');
            } else {
                console.log('❌ Search failed:', result.error);
            }
        } catch (error) {
            console.error('💥 Unexpected error during search:', error);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !loading && selectedSearchType) {
            handleSearch();
        }
    };

    const results = currentSearch?.results || [];

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: { xs: 2, sm: 3, md: 4 },
                boxSizing: "border-box",
            }}
        >
            <Container maxWidth="xl" sx={{ py: 2 }}>
                {/* Header Section */}
                <Paper
                    elevation={0}
                    sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: 3,
                        padding: { xs: 3, sm: 4, md: 5 },
                        marginBottom: 4,
                        color: "white",
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(255, 255, 255, 0.1)",
                            backdropFilter: "blur(10px)",
                        }
                    }}
                >
                    <Box sx={{ position: "relative", zIndex: 1 }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 3,
                            flexWrap: 'wrap',
                            gap: 2
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <SearchIcon sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.9)' }} />
                                <Box>
                                    <Typography
                                        variant="h3"
                                        fontWeight="600"
                                        sx={{
                                            color: "white",
                                            fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' },
                                            lineHeight: 1.2
                                        }}
                                    >
                                        Word Search Dashboard
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: "rgba(255, 255, 255, 0.8)",
                                            fontWeight: 400,
                                            marginTop: 0.5
                                        }}
                                    >
                                        Discover words with powerful search capabilities
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/history')}
                                    startIcon={<HistoryIcon />}
                                    sx={{
                                        color: 'white',
                                        borderColor: 'rgba(255, 255, 255, 0.4)',
                                        borderWidth: 2,
                                        borderRadius: 2,
                                        padding: '10px 20px',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        '&:hover': {
                                            borderColor: 'rgba(255, 255, 255, 0.8)',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            transform: 'translateY(-1px)',
                                        },
                                        transition: 'all 0.2s ease-in-out'
                                    }}
                                >
                                    View History
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        localStorage.removeItem("authToken");
                                        navigate('/');
                                    }}
                                    startIcon={<LogoutIcon />}
                                    sx={{
                                        color: 'white',
                                        borderColor: 'rgba(255, 255, 255, 0.4)',
                                        borderWidth: 2,
                                        borderRadius: 2,
                                        padding: '10px 20px',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        fontSize: '0.95rem',
                                        '&:hover': {
                                            borderColor: 'rgba(255, 255, 255, 0.8)',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            transform: 'translateY(-1px)',
                                        },
                                        transition: 'all 0.2s ease-in-out'
                                    }}
                                >
                                    Logout
                                </Button>
                            </Box>
                        </Box>

                        {/* Search Section */}
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 4,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 2
                        }}>
                            <TextField
                                fullWidth
                                label={selectedSearchType ?
                                    `Enter ${searchOptions.find(opt => opt.type === selectedSearchType)?.example || 'your search term'}` :
                                    "Choose a search type first"
                                }
                                variant="outlined"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={!selectedSearchType}
                                sx={{
                                    maxWidth: { sm: '400px' },
                                    '& .MuiOutlinedInput-root': {
                                        color: '#2c3e50',
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        borderRadius: 2,
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
                                        color: '#2c3e50',
                                        fontWeight: 500,
                                        '&.Mui-focused': {
                                            color: '#2c3e50',
                                        },
                                    },
                                }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleMenuOpen}
                                disabled={loading}
                                endIcon={<ExpandMoreIcon />}
                                sx={{
                                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    padding: '12px 24px',
                                    minWidth: '200px',
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '0.95rem',
                                    boxShadow: '0 4px 15px rgba(254, 107, 139, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 90%)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 6px 20px rgba(254, 107, 139, 0.4)',
                                    },
                                    '&:disabled': {
                                        background: 'rgba(255, 255, 255, 0.3)',
                                    },
                                    transition: 'all 0.2s ease-in-out'
                                }}
                            >
                                {selectedSearchType ? searchOptions.find(opt => opt.type === selectedSearchType)?.label : 'Choose Search Type'}
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSearch}
                                disabled={loading || !selectedSearchType}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                                sx={{
                                    background: selectedSearchType ? 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)' : 'rgba(255, 255, 255, 0.3)',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    padding: '12px 24px',
                                    minWidth: '120px',
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '0.95rem',
                                    boxShadow: selectedSearchType ? '0 4px 15px rgba(76, 175, 80, 0.3)' : 'none',
                                    '&:hover': {
                                        background: selectedSearchType ? 'linear-gradient(45deg, #4CAF50 60%, #45a049 90%)' : 'rgba(255, 255, 255, 0.3)',
                                        transform: selectedSearchType ? 'translateY(-1px)' : 'none',
                                        boxShadow: selectedSearchType ? '0 6px 20px rgba(76, 175, 80, 0.4)' : 'none',
                                    },
                                    '&:disabled': {
                                        background: 'rgba(255, 255, 255, 0.3)',
                                    },
                                    transition: 'all 0.2s ease-in-out'
                                }}
                            >
                                {loading ? 'Searching...' : 'Search'}
                            </Button>
                        </Box>

                        {/* Validation Error */}
                        {validationError && (
                            <Alert severity="warning" sx={{
                                marginTop: 3,
                                backgroundColor: 'rgba(255, 193, 7, 0.1)',
                                borderRadius: 2,
                                border: '1px solid rgba(255, 193, 7, 0.3)'
                            }}>
                                ⚠️ {validationError}
                            </Alert>
                        )}

                        {/* Dropdown Menu */}
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{
                                sx: {
                                    maxHeight: '400px',
                                    width: '400px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(0, 0, 0, 0.1)',
                                    borderRadius: 2,
                                }
                            }}
                        >
                            {searchOptions.map((option) => (
                                <MenuItem
                                    key={option.type}
                                    onClick={() => handleSearchTypeSelect(option.type)}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                        },
                                    }}
                                >
                                    <ListItemIcon>
                                        <SearchIcon color="primary" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={option.label}
                                        secondary={
                                            <Box>
                                                <Typography variant="body2" color="text.secondary">
                                                    {option.description}
                                                </Typography>
                                                <Typography variant="caption" color="primary" sx={{ fontStyle: 'italic' }}>
                                                    Example: {option.example}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Paper>

                {/* Helper Text - Above search results */}
                {selectedSearchType && (
                    <Box sx={{ textAlign: 'center', marginTop: 5, marginBottom: 5 }}>
                        <Typography variant="body2" color="rgba(44, 62, 80, 0.8)" sx={{ fontWeight: 500 }}>
                            💡 <strong>Tip:</strong> {searchOptions.find(opt => opt.type === selectedSearchType)?.description}
                        </Typography>
                        <Typography variant="caption" color="rgba(44, 62, 80, 0.6)" sx={{ display: 'block', marginTop: 1, fontSize: '0.9rem' }}>
                            Example: {searchOptions.find(opt => opt.type === selectedSearchType)?.example}
                        </Typography>
                    </Box>
                )}

                {/* Results Section */}
                {hasSearched && (
                    <Paper
                        elevation={0}
                        sx={{
                            background: "white",
                            borderRadius: 3,
                            padding: { xs: 3, sm: 4 },
                            border: "1px solid rgba(0, 0, 0, 0.08)",
                            boxShadow: "0 2px 20px rgba(0, 0, 0, 0.08)",
                            transition: "all 0.3s ease-in-out",
                            "&:hover": {
                                boxShadow: "0 4px 30px rgba(0, 0, 0, 0.12)",
                            },
                        }}
                    >
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 4 }}>
                                <CircularProgress size={60} sx={{ color: '#667eea' }} />
                            </Box>
                        ) : error ? (
                            <Alert severity="error" sx={{ marginBottom: 3, borderRadius: 2 }}>
                                ❌ {error}
                            </Alert>
                        ) : results.length === 0 ? (
                            <Box sx={{ textAlign: 'center', padding: 4 }}>
                                <Typography variant="h6" sx={{ color: '#7f8c8d', marginBottom: 2 }}>
                                    No results found
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#95a5a6', marginBottom: 3 }}>
                                    Try adjusting your search terms or try a different search type.
                                </Typography>
                                <Button
                                    variant="outlined"
                                    onClick={handleTryAnotherSearch}
                                    sx={{
                                        color: '#667eea',
                                        borderColor: '#667eea',
                                        borderRadius: 2,
                                        padding: '8px 24px',
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                            borderColor: '#5a6fd8',
                                        },
                                        transition: 'all 0.2s ease-in-out'
                                    }}
                                >
                                    Try Another Search
                                </Button>
                            </Box>
                        ) : (
                            <>
                                <Typography
                                    variant="h4"
                                    fontWeight="600"
                                    gutterBottom
                                    sx={{
                                        color: "#2c3e50",
                                        marginBottom: 4,
                                        textAlign: "center",
                                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                                    }}
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
                                    gap: 3,
                                    width: '100%',
                                    alignContent: 'start',
                                    overflow: 'auto',
                                    padding: 2,
                                    "&::-webkit-scrollbar": { display: "none" },
                                    "-ms-overflow-style": "none",
                                    "scrollbarWidth": "none",
                                }}>
                                    {results.map((result, index) => (
                                        <Card
                                            key={`${result.word || 'unknown'}-${index}`}
                                            elevation={0}
                                            sx={{
                                                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                                border: '1px solid rgba(0, 0, 0, 0.06)',
                                                borderRadius: 2,
                                                transition: 'all 0.2s ease-in-out',
                                                '&:hover': {
                                                    transform: 'translateY(-3px)',
                                                    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                                                    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                                },
                                            }}
                                        >
                                            <CardContent sx={{ padding: 3, flex: 1 }}>
                                                <Typography
                                                    variant="h5"
                                                    component="div"
                                                    sx={{
                                                        color: '#2c3e50',
                                                        fontWeight: '600',
                                                        marginBottom: 2,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        fontSize: '1.3rem'
                                                    }}
                                                >
                                                    {result.word || 'Unknown'}
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        color: '#34495e',
                                                        fontWeight: '500',
                                                        marginBottom: 2,
                                                        fontSize: '1.1rem'
                                                    }}
                                                >
                                                    Score: {typeof result.score === 'number' ? result.score.toLocaleString() : 'N/A'}
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        color: '#7f8c8d',
                                                        display: 'block',
                                                        marginTop: 'auto',
                                                        fontSize: '0.9rem'
                                                    }}
                                                >
                                                    Tags: {result.tags && Array.isArray(result.tags) ? result.tags.join(', ') : 'No tags'}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            </>
                        )}
                    </Paper>
                )}


            </Container>
        </Box>
    );
};

export default HomePage;

