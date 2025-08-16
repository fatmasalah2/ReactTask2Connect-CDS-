import React from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
  FormControlLabel,
  Checkbox,
  Container,
  Divider
} from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { useLogin } from "../hooks/uesLogin";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { username, setUsername, password, setPassword, error, message, handleLogin } = useLogin();
  const [rememberMe, setRememberMe] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(() => {
      navigate("/home");
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: { xs: 2, sm: 3, md: 4 },
        boxSizing: "border-box",
      }}
    >
      <Container maxWidth="sm" sx={{ py: 2 }}>
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
            textAlign: "center",
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 2 }}>
              <LockIcon sx={{ fontSize: 50, color: 'rgba(255, 255, 255, 0.9)', marginRight: 2 }} />
              <Box>
                <Typography
                  variant="h2"
                  fontWeight="600"
                  sx={{
                    color: "white",
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    lineHeight: 1.2
                  }}
                >
                  Welcome 
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontWeight: 400,
                    marginTop: 0.5
                  }}
                >
                  Sign in to access your word search dashboard
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Login Form */}
        <Paper
          elevation={0}
          sx={{
            background: "white",
            borderRadius: 3,
            padding: { xs: 3, sm: 4, md: 5 },
            border: "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: "0 2px 20px rgba(0, 0, 0, 0.08)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.12)",
            },
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Username Field */}
            <Box sx={{ marginBottom: 3 }}>
              <Typography variant="body1" sx={{ color: '#2c3e50', fontWeight: 600, marginBottom: 1 }}>
                Username
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                InputProps={{
                  startAdornment: <PersonIcon sx={{ color: '#7f8c8d', marginRight: 1 }} />,
                  sx: {
                    backgroundColor: '#f8f9fa',
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(102, 126, 234, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                }}
                InputLabelProps={{ style: { display: 'none' } }}
              />
            </Box>

            {/* Password Field */}
            <Box sx={{ marginBottom: 3 }}>
              <Typography variant="body1" sx={{ color: '#2c3e50', fontWeight: 600, marginBottom: 1 }}>
                Password
              </Typography>
              <TextField
                variant="outlined"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                InputProps={{
                  startAdornment: <LockIcon sx={{ color: '#7f8c8d', marginRight: 1 }} />,
                  sx: {
                    backgroundColor: '#f8f9fa',
                    borderRadius: 2,
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(102, 126, 234, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                }}
                InputLabelProps={{ style: { display: 'none' } }}
              />
            </Box>

            {/* Remember Me & Forgot Password */}
            <Box sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 3
            }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    size="small"
                    sx={{
                      color: '#667eea',
                      '&.Mui-checked': {
                        color: '#667eea'
                      }
                    }}
                  />
                }
                label={
                  <Typography sx={{
                    fontSize: 14,
                    color: '#2c3e50',
                    fontWeight: 500
                  }}>
                    Remember me
                  </Typography>
                }
              />
              <Typography
                sx={{
                  fontSize: 13,
                  color: '#667eea',
                  cursor: "pointer",
                  fontWeight: 500,
                  '&:hover': {
                    color: '#5a6fd8',
                    textDecoration: 'underline'
                  },
                  transition: 'color 0.2s ease-in-out'
                }}
              >
                Forgot Password?
              </Typography>
            </Box>

            <Divider sx={{ marginBottom: 3, opacity: 0.3 }} />

            {/* Login Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                py: 2,
                fontWeight: "600",
                borderRadius: 2,
                fontSize: '1.1rem',
                textTransform: 'none',
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4c93 90%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              Sign In
            </Button>
          </form>

          {/* Alerts */}
          {message && (
            <Alert
              severity="success"
              sx={{
                mt: 3,
                borderRadius: 2,
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                color: '#2e7d32'
              }}
            >
              {message}
            </Alert>
          )}
          {error && (
            <Alert
              severity="error"
              sx={{
                mt: 3,
                borderRadius: 2,
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                border: '1px solid rgba(244, 67, 54, 0.3)',
                color: '#d32f2f'
              }}
            >
              {error}
            </Alert>
          )}

          {/* Additional Info */}
          <Box sx={{ textAlign: 'center', marginTop: 4, padding: 3, backgroundColor: 'rgba(102, 126, 234, 0.05)', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 500 }}>
              💡 <strong>Demo Credentials:</strong> Use any username and password to test the application
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
