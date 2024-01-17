import { Box, Button, Paper, TextField, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [touched, setTouched] = useState({ username: false, password: false });
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
  const passwordPattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?#&-_])[A-Za-z\d@$#!%*?&-_]{8,}$/;

  const onEnterValue = (type, setValue, event) => {
    if (!touched[type])
      setTouched((prev) => {
        return { ...prev, [`${type}`]: true };
      });
    setValue(event.target.value);
  };

  const onSignup = () => {
    
  }

  return (
    <Box display="flex" mt="7rem" justifyContent="center">
      <Box width="50%" p={1}>
        <Paper sx={{ p: 4, pt: 3 }}>
          <h2 style={{ textAlign: "center" }}>Sign Up</h2>
          <Tooltip
            placement="left-start"
            title={
              <ul style={{ margin: "5px", padding: "0 5px" }}>
                <li>Minimum 3 characters</li>
                <li>Maximum 20 characters</li>
                <li>
                  Shouldn't contain special characters except underscore ( _ )
                </li>
              </ul>
            }
          >
            <TextField
              onChange={onEnterValue.bind(this, "username", setUsername)}
              label="User Name"
              fullWidth
              error={touched.username && !usernamePattern.test(username)}
              sx={{ my: 2 }}
            />
          </Tooltip>
          <Tooltip
            placement="left-start"
            title={
              <ul style={{ margin: "5px", padding: "0 10px" }}>
                <li>Minimum 8 characters</li>
                <li>
                  Must contain atleast a lowercase character, an uppercase
                  character, a number and a special character(@$!%*?#&-_)
                </li>
              </ul>
            }
          >
            <TextField
              onChange={onEnterValue.bind(this, "password", setPassword)}
              label="Password"
              fullWidth
              error={touched.password && !passwordPattern.test(password)}
              sx={{ my: 2 }}
            />
          </Tooltip>
          <Box display="flex" justifyContent="center" gap={2} mt={5}>
            <Button
              variant="contained"
              onClick={() => {
                navigate("/login");
              }}
            >
              Go to Login
            </Button>
            <Button variant="contained">Sign up</Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Signup;
