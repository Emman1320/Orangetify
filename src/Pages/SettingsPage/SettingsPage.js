import React from "react";
import "./SettingsPage.css";
import {
  Box,
  Divider,
  ListItemIcon,
  MenuItem,
  MenuList,
  Paper,
  Typography,
} from "@mui/material";
import { ExitToApp, Person } from "@mui/icons-material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { Outlet, Route, Router, Routes, useNavigate } from "react-router-dom";
import AccountSettings from "./AccountSettings";
import TodoSettings from "./TodoSettings";

const SettingsPage = (props) => {
  const navigate = useNavigate();
  return (
    <div className="settings-container">
      <Paper sx={{ display: "flex", height: "100%" }}>
        <div className="settings-sidemenu">
          <MenuList>
            <MenuItem onClick={() => {navigate("/settings")}} sx={{ py: 1 }}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">Account</Typography>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                navigate("/settings/todo");
              }}
              sx={{ py: 1 }}
            >
              <ListItemIcon>
                <FormatListBulletedIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="inherit">Todo Settings</Typography>
            </MenuItem>
            <Divider />
            <MenuItem sx={{ py: 1 }}>
              <ListItemIcon>
                <ExitToApp fontSize="small" color="error" />
              </ListItemIcon>
              <Typography color="#d32f2f" variant="inherit">
                Logout
              </Typography>
            </MenuItem>
          </MenuList>
        </div>
        <div className="settings-main">
          <Outlet />
        </div>
      </Paper>
    </div>
  );
};

export default SettingsPage;
