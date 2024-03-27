import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Grid, Button, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

function Home() {
  const { currentUser } = useAuth();

  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} sm={10}>
        <Card elevation={0}>
          <CardMedia
            component="img"
            image="./assets/images/chess.jpg"
            alt="vintage chess pieces on blue background"
          />
          <Box p={2} textAlign="center">
            {currentUser ? (
              <Typography variant="h4" gutterBottom>
                Welcome back, {currentUser.displayName}!
              </Typography>
            ) : (
              <Typography variant="h4" gutterBottom>
                Welcome to Opening Knight!
              </Typography>
            )}

            {currentUser ? (
              <Box>
                <Button
                  component={Link}
                  to="/play"
                  variant="contained"
                  sx={{ marginRight: 2 }}
                >
                  Go to Play Board
                </Button>
                <Button
                  component={Link}
                  to="/study"
                  variant="contained"
                  color="secondary"
                >
                  Go to Practice Board
                </Button>
              </Box>
            ) : (
              <Box mt={2}>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  color="primary"
                  sx={{ marginRight: 2 }}
                >
                  Log In
                </Button>
                <Button
                  component={Link}
                  color="secondary"
                  to="/signup"
                  variant="contained"
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Home;
