import React from 'react';
import { useAuth } from "../contexts/AuthContext"
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Grid, Button, Typography, Box } from '@mui/material';
import { Link } from "react-router-dom"


function Home (){
    const { currentUser } = useAuth()
    
    return (
        <Grid container pt={18}>
            <Card color="background" elevation={0}>
                <CardMedia
                    component="img"
                    image="./assets/images/chess.jpg"
                    alt="vintage chess pieces on blue background"
                />
            {currentUser ? (
            <Box align="center" marginTop={1}>
                <Typography style={{
                fontSize: "3.5em",
                fontFamily: "Evangelina",
                }} >
                    Hi, {currentUser.displayName && currentUser.displayName.charAt(0).toUpperCase() + currentUser.displayName.slice(1)}!
                </Typography>
                
            </Box>
            ) : (
            <Box align="center" marginTop={1}>
                <Typography variant="h6">
                Please <Link to="/login" style={{color: 'rgb(52, 108, 140)'}}>log in</Link> or{" "}
                <Link to="/signup" style={{color: 'rgb(52, 108, 140)'}}>make an account</Link>!
            </Typography>
            </Box>
)}    </Card>
        </Grid>
    );
}

export default Home;