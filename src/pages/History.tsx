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
    Chip,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import HistoryIcon from '@mui/icons-material/History';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { clearHistory, removeSearch } from '../store/searchHistorySlice';
import { useNavigate } from 'react-router-dom';

const History: React.FC = () => {
    const searches = useAppSelector(state => state.searchHistory.searches);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [expandedSearches, setExpandedSearches] = useState<Set<string>>(new Set());
    const [carouselIndices, setCarouselIndices] = useState<{ [key: string]: number }>({});
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [searchToDelete, setSearchToDelete] = useState<{ id: string; query: string } | null>(null);

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleClearHistory = () => {
        dispatch(clearHistory());
    };

    const handleRemoveSearch = (id: string) => {
        dispatch(removeSearch(id));
    };

    const openDeleteDialog = (search: { id: string; query: string }) => {
        setSearchToDelete(search);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setSearchToDelete(null);
    };

    const confirmDelete = () => {
        if (searchToDelete) {
            handleRemoveSearch(searchToDelete.id);
            closeDeleteDialog();
        }
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

    const nextSlide = (searchId: string, totalResults: number) => {
        setCarouselIndices(prev => ({
            ...prev,
            [searchId]: Math.min((prev[searchId] || 0) + 1, Math.max(0, totalResults - 1))
        }));
    };

    const prevSlide = (searchId: string) => {
        setCarouselIndices(prev => ({
            ...prev,
            [searchId]: Math.max((prev[searchId] || 0) - 1, 0)
        }));
    };

    const getCurrentIndex = (searchId: string) => carouselIndices[searchId] || 0;

    const chunkArray = (arr: any[], size: number) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };

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
                                <HistoryIcon sx={{ fontSize: 40, color: 'rgba(255, 255, 255, 0.9)' }} />
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
                                        Search History
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            color: "rgba(255, 255, 255, 0.8)",
                                            fontWeight: 400,
                                            marginTop: 0.5
                                        }}
                                    >
                                        Track and manage your previous searches
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/home')}
                                    startIcon={<HomeIcon />}
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
                                    Back to Home
                                </Button>
                                {searches.length > 0 && (
                                    <Button
                                        variant="contained"
                                        onClick={handleClearHistory}
                                        startIcon={<ClearAllIcon />}
                                        sx={{
                                            background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
                                            color: 'white',
                                            borderRadius: 2,
                                            padding: '10px 20px',
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            fontSize: '0.95rem',
                                            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #ee5a24, #ff6b6b)',
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)',
                                            },
                                            transition: 'all 0.2s ease-in-out'
                                        }}
                                    >
                                        Clear All
                                    </Button>
                                )}
                            </Box>
                        </Box>

                        {/* Statistics Section */}
                        {searches.length > 0 ? (
                            <Box sx={{
                                display: 'flex',
                                gap: 3,
                                flexWrap: 'wrap',
                                justifyContent: 'center'
                            }}>
                                <Box sx={{
                                    textAlign: 'center',
                                    padding: 2,
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: 2,
                                    minWidth: 120
                                }}>
                                    <Typography variant="h4" fontWeight="700" sx={{ color: 'white' }}>
                                        {searches.length}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                        Total Searches
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    textAlign: 'center',
                                    padding: 2,
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: 2,
                                    minWidth: 120
                                }}>
                                    <Typography variant="h4" fontWeight="700" sx={{ color: 'white' }}>
                                        {searches.reduce((total, search) => total + search.results.length, 0)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                        Total Results
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    textAlign: 'center',
                                    padding: 2,
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: 2,
                                    minWidth: 120
                                }}>
                                    <Typography variant="h4" fontWeight="700" sx={{ color: 'white' }}>
                                        {searches.length > 0 ? Math.round(searches.reduce((total, search) => total + search.results.length, 0) / searches.length) : 0}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                        Avg Results
                                    </Typography>
                                </Box>
                            </Box>
                        ) : (
                            <Box sx={{
                                textAlign: 'center',
                                padding: 4,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: 2,
                                marginTop: 2
                            }}>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: "rgba(255, 255, 255, 0.9)",
                                        fontWeight: 500,
                                        marginBottom: 1
                                    }}
                                >
                                    No search history yet
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: "rgba(255, 255, 255, 0.7)",
                                    }}
                                >
                                    Start searching to see your history here!
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Paper>

                {/* History Items */}
                {searches.length > 0 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {searches.map((search, searchIndex) => (
                            <Box key={search.id}>
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
                                            transform: "translateY(-2px)",
                                        },
                                    }}
                                >
                                    {/* Search Header */}
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: 3,
                                        flexWrap: 'wrap',
                                        gap: 2
                                    }}>
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
                                                <Typography
                                                    variant="h5"
                                                    fontWeight="600"
                                                    sx={{
                                                        color: "#2c3e50",
                                                        fontSize: { xs: '1.25rem', sm: '1.5rem' }
                                                    }}
                                                >
                                                    {search.query.includes(': ') ? (
                                                        <>
                                                            <span style={{ color: '#667eea', fontWeight: '700' }}>
                                                                {search.query.split(': ')[0]}
                                                            </span>
                                                            <span style={{ marginLeft: '8px' }}>
                                                                "{search.query.split(': ')[1]}"
                                                            </span>
                                                        </>
                                                    ) : (
                                                        `"${search.query}"`
                                                    )}
                                                </Typography>
                                                <Chip
                                                    label={`${search.results.length} results`}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: '#e3f2fd',
                                                        color: '#1976d2',
                                                        fontWeight: 600,
                                                        fontSize: '0.75rem',
                                                        height: '24px'
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
                                                <AccessTimeIcon sx={{
                                                    fontSize: 18,
                                                    color: '#7f8c8d',
                                                    opacity: 0.7
                                                }} />
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: "#7f8c8d",
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    {formatDate(search.timestamp)}
                                                </Typography>
                                            </Box>

                                            {/* Search Type Display */}
                                            {search.query.includes(': ') && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chip
                                                        label={search.query.split(': ')[0]}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                                            color: '#667eea',
                                                            fontWeight: 600,
                                                            fontSize: '0.7rem',
                                                            height: '20px',
                                                            '& .MuiChip-label': {
                                                                padding: '0 6px',
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                            )}
                                        </Box>
                                        <IconButton
                                            onClick={() => openDeleteDialog({ id: search.id, query: search.query })}
                                            sx={{
                                                color: '#e74c3c',
                                                backgroundColor: 'rgba(231, 76, 60, 0.1)',
                                                borderRadius: 2,
                                                padding: 1,
                                                '&:hover': {
                                                    backgroundColor: 'rgba(231, 76, 60, 0.2)',
                                                    transform: 'scale(1.05)',
                                                },
                                                transition: 'all 0.2s ease-in-out'
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>

                                    <Divider sx={{ marginBottom: 3, opacity: 0.3 }} />

                                    {/* Carousel Results */}
                                    <Box sx={{
                                        position: 'relative',
                                        marginBottom: 3
                                    }}>
                                        {/* Carousel Container */}
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minHeight: 200,
                                            position: 'relative'
                                        }}>
                                            {/* Navigation Arrows */}
                                            {(() => {
                                                const groupedResults = chunkArray(search.results, 6);
                                                return groupedResults.length > 1 && (
                                                    <>
                                                        <IconButton
                                                            onClick={() => prevSlide(search.id)}
                                                            disabled={getCurrentIndex(search.id) === 0}
                                                            sx={{
                                                                position: 'absolute',
                                                                left: -20,
                                                                zIndex: 2,
                                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(255, 255, 255, 1)',
                                                                    transform: 'scale(1.1)',
                                                                },
                                                                '&:disabled': {
                                                                    opacity: 0.3,
                                                                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                                                },
                                                                transition: 'all 0.2s ease-in-out'
                                                            }}
                                                        >
                                                            <ChevronLeftIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            onClick={() => nextSlide(search.id, groupedResults.length)}
                                                            disabled={getCurrentIndex(search.id) >= groupedResults.length - 1}
                                                            sx={{
                                                                position: 'absolute',
                                                                right: -20,
                                                                zIndex: 2,
                                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                                                '&:hover': {
                                                                    backgroundColor: 'rgba(255, 255, 255, 1)',
                                                                    transform: 'scale(1.1)',
                                                                },
                                                                '&:disabled': {
                                                                    opacity: 0.3,
                                                                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                                                },
                                                                transition: 'all 0.2s ease-in-out'
                                                            }}
                                                        >
                                                            <ChevronRightIcon />
                                                        </IconButton>
                                                    </>
                                                );
                                            })()}

                                            {/* Results Grid (6 results at a time) */}
                                            {(() => {
                                                const groupedResults = chunkArray(search.results, 6);
                                                const currentGroup = groupedResults[getCurrentIndex(search.id)] || [];

                                                return (
                                                    <Box sx={{
                                                        display: 'grid',
                                                        gridTemplateColumns: {
                                                            xs: 'repeat(2, 1fr)',
                                                            sm: 'repeat(3, 1fr)',
                                                            md: 'repeat(3, 1fr)',
                                                            lg: 'repeat(3, 1fr)'
                                                        },
                                                        gap: 2,
                                                        width: '100%',
                                                        maxWidth: 800
                                                    }}>
                                                        {currentGroup.map((result, index) => (
                                                            <Card
                                                                key={`${result.word || 'unknown'}-${getCurrentIndex(search.id) * 6 + index}`}
                                                                elevation={0}
                                                                sx={{
                                                                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                                                    border: '1px solid rgba(0, 0, 0, 0.06)',
                                                                    borderRadius: 2,
                                                                    transition: 'all 0.2s ease-in-out',
                                                                    '&:hover': {
                                                                        transform: 'translateY(-2px)',
                                                                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                                                        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                                                    },
                                                                }}
                                                            >
                                                                <CardContent sx={{
                                                                    padding: 2,
                                                                    textAlign: 'center'
                                                                }}>
                                                                    <Typography
                                                                        variant="h6"
                                                                        component="div"
                                                                        sx={{
                                                                            color: '#2c3e50',
                                                                            fontWeight: '600',
                                                                            marginBottom: 1,
                                                                            overflow: 'hidden',
                                                                            textOverflow: 'ellipsis',
                                                                            whiteSpace: 'nowrap',
                                                                            fontSize: '0.9rem'
                                                                        }}
                                                                    >
                                                                        {result.word || 'Unknown'}
                                                                    </Typography>
                                                                    <Typography
                                                                        variant="body2"
                                                                        sx={{
                                                                            color: '#34495e',
                                                                            fontWeight: '500',
                                                                            marginBottom: 1,
                                                                            fontSize: '0.8rem'
                                                                        }}
                                                                    >
                                                                        Score: {typeof result.score === 'number'
                                                                            ? result.score.toLocaleString()
                                                                            : 'N/A'}
                                                                    </Typography>
                                                                    <Box sx={{
                                                                        display: 'flex',
                                                                        flexWrap: 'wrap',
                                                                        gap: 0.5,
                                                                        justifyContent: 'center'
                                                                    }}>
                                                                        {result.tags && Array.isArray(result.tags) && result.tags.length > 0 ? (
                                                                            result.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                                                                                <Chip
                                                                                    key={tagIndex}
                                                                                    label={tag}
                                                                                    size="small"
                                                                                    sx={{
                                                                                        backgroundColor: '#ecf0f1',
                                                                                        color: '#2c3e50',
                                                                                        fontSize: '0.65rem',
                                                                                        height: '20px',
                                                                                        fontWeight: 500,
                                                                                        '& .MuiChip-label': {
                                                                                            padding: '0 6px',
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            ))
                                                                        ) : (
                                                                            <Chip
                                                                                label="No tags"
                                                                                size="small"
                                                                                sx={{
                                                                                    backgroundColor: '#ecf0f1',
                                                                                    color: '#7f8c8d',
                                                                                    fontSize: '0.65rem',
                                                                                    height: '20px',
                                                                                    fontWeight: 500,
                                                                                    '& .MuiChip-label': {
                                                                                        padding: '0 6px',
                                                                                    }
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Box>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </Box>
                                                );
                                            })()}
                                        </Box>

                                        {/* Carousel Indicators */}
                                        {(() => {
                                            const groupedResults = chunkArray(search.results, 6);
                                            return groupedResults.length > 1 && (
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    gap: 1,
                                                    marginTop: 3
                                                }}>
                                                    {groupedResults.map((_, index) => (
                                                        <Box
                                                            key={index}
                                                            onClick={() => setCarouselIndices(prev => ({
                                                                ...prev,
                                                                [search.id]: index
                                                            }))}
                                                            sx={{
                                                                width: 12,
                                                                height: 12,
                                                                borderRadius: '50%',
                                                                backgroundColor: index === getCurrentIndex(search.id)
                                                                    ? '#667eea'
                                                                    : 'rgba(102, 126, 234, 0.3)',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.2s ease-in-out',
                                                                '&:hover': {
                                                                    backgroundColor: index === getCurrentIndex(search.id)
                                                                        ? '#5a6fd8'
                                                                        : 'rgba(102, 126, 234, 0.5)',
                                                                    transform: 'scale(1.2)',
                                                                }
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            );
                                        })()}

                                        {/* Result Counter */}
                                        <Box sx={{
                                            textAlign: 'center',
                                            marginTop: 2
                                        }}>
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: '#7f8c8d',
                                                    fontWeight: 500,
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                {(() => {
                                                    const groupedResults = chunkArray(search.results, 6);
                                                    const currentGroup = groupedResults[getCurrentIndex(search.id)] || [];
                                                    const startIndex = getCurrentIndex(search.id) * 6 + 1;
                                                    const endIndex = startIndex + currentGroup.length - 1;
                                                    return `Showing ${startIndex}-${endIndex} of ${search.results.length} results`;
                                                })()}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Expand/Collapse Button */}
                                    {search.results.length > 1 && (
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Button
                                                onClick={() => toggleSearchExpansion(search.id)}
                                                sx={{
                                                    color: "#3498db",
                                                    textTransform: 'none',
                                                    fontWeight: 600,
                                                    fontSize: '0.95rem',
                                                    padding: '8px 24px',
                                                    borderRadius: 2,
                                                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(52, 152, 219, 0.2)',
                                                        transform: 'translateY(-1px)',
                                                    },
                                                    transition: 'all 0.2s ease-in-out'
                                                }}
                                                startIcon={expandedSearches.has(search.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            >
                                                {expandedSearches.has(search.id)
                                                    ? 'Hide All Results'
                                                    : 'View All Results in Grid'
                                                }
                                            </Button>
                                        </Box>
                                    )}

                                    {/* Expanded Grid View */}
                                    {expandedSearches.has(search.id) && (
                                        <Box sx={{
                                            display: 'grid',
                                            gridTemplateColumns: {
                                                xs: '1fr',
                                                sm: 'repeat(2, 1fr)',
                                                md: 'repeat(3, 1fr)',
                                                lg: 'repeat(4, 1fr)'
                                            },
                                            gap: 2.5,
                                            marginTop: 3
                                        }}>
                                            {search.results.map((result, index) => (
                                                <Card
                                                    key={`${result.word || 'unknown'}-${index}`}
                                                    elevation={0}
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                                        border: '1px solid rgba(0, 0, 0, 0.06)',
                                                        borderRadius: 2,
                                                        transition: 'all 0.2s ease-in-out',
                                                        '&:hover': {
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                                            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                                                        },
                                                    }}
                                                >
                                                    <CardContent sx={{ padding: 2.5 }}>
                                                        <Typography
                                                            variant="h6"
                                                            component="div"
                                                            sx={{
                                                                color: '#2c3e50',
                                                                fontWeight: '600',
                                                                marginBottom: 1,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                fontSize: '1rem'
                                                            }}
                                                        >
                                                            {result.word || 'Unknown'}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: '#34495e',
                                                                fontWeight: '500',
                                                                marginBottom: 1.5,
                                                                fontSize: '0.875rem'
                                                            }}
                                                        >
                                                            Score: {typeof result.score === 'number' ? result.score.toLocaleString() : 'N/A'}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                            {result.tags && Array.isArray(result.tags) && result.tags.length > 0 ? (
                                                                result.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                                                                    <Chip
                                                                        key={tagIndex}
                                                                        label={tag}
                                                                        size="small"
                                                                        sx={{
                                                                            backgroundColor: '#ecf0f1',
                                                                            color: '#2c3e50',
                                                                            fontSize: '0.7rem',
                                                                            height: '22px',
                                                                            fontWeight: 500,
                                                                            '& .MuiChip-label': {
                                                                                padding: '0 8px',
                                                                            }
                                                                        }}
                                                                    />
                                                                ))
                                                            ) : (
                                                                <Chip
                                                                    label="No tags"
                                                                    size="small"
                                                                    sx={{
                                                                        backgroundColor: '#ecf0f1',
                                                                        color: '#7f8c8d',
                                                                        fontSize: '0.7rem',
                                                                        height: '22px',
                                                                        fontWeight: 500,
                                                                        '& .MuiChip-label': {
                                                                            padding: '0 8px',
                                                                        }
                                                                    }}
                                                                />
                                                            )}
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Box>
                                    )}
                                </Paper>
                            </Box>
                        ))}
                    </Box>
                )}
            </Container>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={closeDeleteDialog}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        minWidth: 300
                    }
                }}
            >
                <DialogTitle
                    id="delete-dialog-title"
                    sx={{
                        color: '#2c3e50',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        textAlign: 'center'
                    }}
                >
                    Delete Search?
                </DialogTitle>
                <DialogContent sx={{ padding: 2 }}>
                    <Typography
                        id="delete-dialog-description"
                        sx={{
                            fontSize: '0.95rem',
                            color: '#7f8c8d',
                            textAlign: 'center'
                        }}
                    >
                        Are you sure you want to delete this search?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ padding: 2, gap: 1, justifyContent: 'center' }}>
                    <Button
                        onClick={closeDeleteDialog}
                        variant="outlined"
                        size="small"
                        sx={{
                            borderRadius: 1.5,
                            padding: '6px 16px',
                            textTransform: 'none'
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={confirmDelete}
                        variant="contained"
                        size="small"
                        color="error"
                        sx={{
                            borderRadius: 1.5,
                            padding: '6px 16px',
                            textTransform: 'none'
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default History;
