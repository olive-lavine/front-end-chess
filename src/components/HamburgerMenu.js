import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";

const HamburgerMenu = ({ isAuthenticated, handleLogin, handleLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Button
        aria-label="menu"
        aria-controls="menu"
        aria-haspopup="true"
        onClick={handleMenuOpen}
        color="secondary"
      >
        <MenuIcon />
      </Button>
      <Menu id="menu" anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
        <MenuItem component={Link} to="/about" onClick={handleMenuClose}>
          <ListItemText>About</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/settings" onClick={handleMenuClose}>
          <ListItemIcon>
            <SettingsOutlinedIcon />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <MenuItem
          component={Link}
          to="/login"
          onClick={() => {
            isAuthenticated ? handleLogout() : handleLogin();
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            {isAuthenticated ? <LockOutlinedIcon /> : <LockOpenOutlinedIcon />}
          </ListItemIcon>
          <ListItemText>{isAuthenticated ? "Log out" : "Log in"}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

HamburgerMenu.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired, // Define prop type for currentUser
  handleLogout: PropTypes.func.isRequired,
  handleLogin: PropTypes.func.isRequired,
};

export default HamburgerMenu;
