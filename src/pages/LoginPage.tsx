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
} from "@mui/material";
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
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={24}
        sx={{
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          padding: 5,
          borderRadius: 4,
          width: "100%",
          maxWidth: 400,
          color: "white",
        }}
      >
        <Typography
          variant="h4"
          mb={3}
          align="center"
          fontWeight="bold"
          sx={{ color: "white" }}
        >
          Welcome!
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="filled"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              sx: {
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 1,
                color: "white",
              },
            }}
            InputLabelProps={{ style: { color: "#ccc" } }}
          />

          <TextField
            label="Password"
            variant="filled"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              sx: {
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 1,
                color: "white",
              },
            }}
            InputLabelProps={{ style: { color: "#ccc" } }}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  size="small"
                  sx={{ color: "#ccc", "&.Mui-checked": { color: "white" } }}
                />
              }
              label={<Typography sx={{ fontSize: 14, color: "#ccc" }}>Remember me</Typography>}
            />
            <Typography sx={{ fontSize: 13, color: "#aaa", cursor: "pointer" }}>Forgot Password?</Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: "bold",
              borderRadius: 2,
              background: "linear-gradient(90deg, #1CB5E0 0%, #000851 100%)",
            }}
          >
            LOGIN
          </Button>
        </form>

        {message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
    </Box>
  );
};

export default LoginPage;
