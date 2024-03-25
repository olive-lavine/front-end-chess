import React from "react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CardMedia from "@mui/material/CardMedia";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";

import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import VisibilityOffTwoToneIcon from "@mui/icons-material/VisibilityOffTwoTone";
import InputAdornment from "@mui/material/InputAdornment";

import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const [name, setName] = useState("");
  const { signup, updateDisplayName } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addPlayer = (name, uid) => {
    const requestBody = { name: name, player_id: uid };
    return axios
      .post(`http://localhost:8080/players`, requestBody)
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function showPassword() {
    setHidePassword((prevHidePassword) => !prevHidePassword);
  }

  async function onSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      const { user } = await signup(email, password);

      // Update the user's display name with the provided username
      await updateDisplayName(name);

      // Call the addPlayer function with the username and user's UID
      addPlayer(name, user.uid);

      console.log("Sign-up successful");
      navigate("/");
    } catch (err) {
      console.error("Sign-up error:", err.message);
      setError("Failed to create an account. " + err.message);
    }

    setLoading(false);
  }

  useEffect(() => {
    if (error) {
      const timerId = setTimeout(() => {
        setError(false);
      }, 10000);

      return () => {
        clearTimeout(timerId); // Clear the timeout if the component unmounts or pgnInput changes
      };
    }
  }, [error]);

  return (
    <Grid container>
      <Box
        sx={{
          width: "100%",
          height: "80vh",
          backgroundImage: 'url("./assets/images/chess.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          sx={{
            width: 400,
            height: "auto",
            m: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 2,
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Sign Up
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Box
              component="form"
              onSubmit={onSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <FormControl>
                <InputLabel htmlFor="user-name">Username</InputLabel>
                <Input
                  id="user-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="email-address">Email Address</InputLabel>
                <Input
                  id="email-address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </FormControl>
              <FormControl>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  type="password"
                  label="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  endAdornment={
                    <InputAdornment position="end">
                      <Button
                        onClick={showPassword}
                        sx={{
                          minWidth: "unset",
                          padding: "0px",
                          "&:hover": { backgroundColor: "transparent" },
                          cursor: "pointer",
                        }}
                      >
                        {hidePassword ? (
                          <VisibilityOffTwoToneIcon />
                        ) : (
                          <VisibilityTwoToneIcon />
                        )}
                      </Button>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <Button
                type="submit"
                disabled={loading}
                variant="contained"
                sx={{ mt: 2 }}
              >
                Sign Up
              </Button>
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Already have an account?{" "}
              <Button component={Link} to="/login">
                Log In
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Grid>
  );
}
