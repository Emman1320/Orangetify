import { Box, Button, Paper, TextField } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  return (
    <Box display="flex" mt="7rem" justifyContent="center">
      <Box width="50%" p={1}>
        <Paper sx={{ p: 4, pt: 3 }}>
          <h2 style={{ textAlign: "center" }}>Login</h2>
          <TextField label="User Name" fullWidth sx={{ my: 2 }} />
          <TextField label="Password" fullWidth sx={{ my: 2 }} />
          <Box display="flex" justifyContent="center" gap={2} mt={5}>
            <Button
              variant="contained"
              onClick={() => {
                navigate("/signup");
              }}
            >
              Go to Sign Up
            </Button>
            <Button variant="contained">Login</Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
