import React, { useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Card,
    CardContent,
    Container,
    Button,
    IconButton,
    Chip
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { clearHistory, removeSearch } from '../store/searchHistorySlice';
import { useNavigate } from 'react-router-dom';

const History: React.FC = () => {
    const searches = useAppSelector(state => state.searchHistory.searches);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [expandedSearches, setExpandedSearches] = useState<Set<string>>(new Set());

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const handleClearHistory = () => {
        dispatch(clearHistory());
    };

    const handleRemoveSearch = (id: string) => {
        dispatch(removeSearch(id));
    };

    const toggleSearchExpansion = (searchId: string) => {
        const newExpanded = new Set(expandedSearches);
        if (newExpanded.has(searchId)) {
            newExpanded.delete(searchId);
        } else {
            newExpanded.add(searchId);
        }
        setExpandedSearches(newExpanded);
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
                padding: 4,
                overflow: "hidden",
                "&::-webkit-scrollbar": {
                    display: "none",
                },
                "-ms-overflow-style": "none",
                "scrollbarWidth": "none",
            }}
        >
            <Container maxWidth="lg" sx={{ height: '100%', overflow: 'auto', "&::-webkit-scrollbar": { display: "none" }, "-ms-overflow-style": "none", "scrollbarWidth": "none" }}>
                <Paper
                    elevation={24}
                    sx={{
                        backdropFilter: "blur(10px)",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        padding: 5,
                        borderRadius: 4,
                        width: "100%",
                        color: "white",
                        textAlign: "center",
                        marginBottom: 4,
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            sx={{ color: "white" }}
                        >
                            📚 Search History
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                onClick={() => navigate('/home')}
                                startIcon={<HomeIcon />}
                                sx={{
                                    color: 'white',
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    '&:hover': {
                                        borderColor: 'rgba(255, 255, 255, 0.8)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                }}
                            >
                                Home
                            </Button>
                            {searches.length > 0 && (
                                <Button
                                    variant="outlined"
                                    onClick={handleClearHistory}
                                    startIcon={<ClearAllIcon />}
                                    sx={{
                                        color: 'white',
                                        borderColor: 'rgba(255, 255, 255, 0.3)',
                                        '&:hover': {
                                            borderColor: 'rgba(255, 255, 255, 0.8)',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        },
                                    }}
                                >
                                    Clear All
                                </Button>
                            )}
                        </Box>
                    </Box>

                    {searches.length === 0 ? (
                        <Typography
                            variant="h6"
                            sx={{
                                color: "rgba(255, 255, 255, 0.7)",
                                textAlign: "center",
                                marginTop: 4,
                                marginBottom: 4,
                            }}
                        >
                            No search history yet. Start searching to see your history here!
                        </Typography>
                    ) : (
                        <Typography
                            variant="body1"
                            sx={{
                                color: "rgba(255, 255, 255, 0.8)",
                                marginBottom: 3,
                            }}
                        >
                            Total searches: {searches.length}
                        </Typography>
                    )}
                </Paper>

                {/* History Items */}
                {searches.map((search) => (
                    <Paper
                        key={search.id}
                        elevation={24}
                        sx={{
                            backdropFilter: "blur(10px)",
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            padding: 4,
                            borderRadius: 4,
                            width: "100%",
                            color: "white",
                            marginBottom: 3,
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                            <Box>
                                <Typography
                                    variant="h5"
                                    fontWeight="bold"
                                    sx={{ color: "white", marginBottom: 1 }}
                                >
                                    🔍 "{search.query}"
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AccessTimeIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.6)' }} />
                                    <Typography
                                        variant="caption"
                                        sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                                    >
                                        {formatDate(search.timestamp)}
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton
                                onClick={() => handleRemoveSearch(search.id)}
                                sx={{
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    '&:hover': {
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>

                        <Typography
                            variant="body2"
                            sx={{
                                color: "rgba(255, 255, 255, 0.8)",
                                marginBottom: 2,
                            }}
                        >
                            Found {search.results.length} similar words
                        </Typography>

                        {/* Results Grid */}
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: 'repeat(2, 1fr)',
                                lg: 'repeat(3, 1fr)'
                            },
                            gap: 2,
                            transition: 'all 0.3s ease-in-out'
                        }}>
                            {search.results.slice(0, expandedSearches.has(search.id) ? search.results.length : 6).map((result, index) => (
                                <Card
                                    key={`${result.word}-${index}`}
                                    sx={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        transition: 'transform 0.2s ease-in-out',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ padding: 2 }}>
                                        <Typography
                                            variant="h6"
                                            component="div"
                                            sx={{
                                                color: 'white',
                                                fontWeight: 'bold',
                                                marginBottom: 0.5,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            {result.word}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                display: 'block',
                                                marginBottom: 0.5
                                            }}
                                        >
                                            Score: {result.score.toLocaleString()}
                                        </Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {result.tags.slice(0, 2).map((tag, tagIndex) => (
                                                <Chip
                                                    key={tagIndex}
                                                    label={tag}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                        color: 'rgba(255, 255, 255, 0.8)',
                                                        fontSize: '0.6rem',
                                                        height: '20px',
                                                        '& .MuiChip-label': {
                                                            padding: '0 6px',
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>

                        {search.results.length > 6 && (
                            <Button
                                onClick={() => toggleSearchExpansion(search.id)}
                                sx={{
                                    color: "rgba(255, 255, 255, 0.6)",
                                    textTransform: 'none',
                                    marginTop: 2,
                                    '&:hover': {
                                        color: "rgba(255, 255, 255, 0.9)",
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                }}
                                startIcon={expandedSearches.has(search.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            >
                                {expandedSearches.has(search.id)
                                    ? 'Show Less'
                                    : `+${search.results.length - 6} more results`
                                }
                            </Button>
                        )}
                    </Paper>
                ))}
            </Container>
        </Box>
    );
};

export default History;
