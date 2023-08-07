import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import axios from "axios";
import { useState } from "react";
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { SHA256 } from 'crypto-js';


export default function SignUp({ setPlayer }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault()
  
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          setUid(user.uid)
          addPlayer(name, user.uid)
          console.log(user);
          // navigate("/login")
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
          // ..
      });


  }

  const generateID = (uid) => {
    const hashObject = SHA256(uid);
    const hexDigest = hashObject.toString();
    const integerID = parseInt(hexDigest.slice(0, 8), 16);
    return integerID;
  };

  const addPlayer = (name, uid) => {
    const id = generateID(uid);
    const requestBody = { name: name, player_id: id };
    return axios
      .post(`http://localhost:8080/players`, requestBody)
      .then((response) => {
        console.log(response.data);
        setPlayer(requestBody)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPlayer = (uid) => {
    const id = generateID(uid);

    return axios
      .get(`http://localhost:8080/players/?id=${id}`)
      .then((player) => {
          setPlayer(player.data);
          console.log(player.data)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        getPlayer(user.uid);
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage)
    });

}

  return (
    <Grid item container justifyContent="center">
      <AppBar
        sx={{
          boxShadow: "none",
          backgroundColor: "rgb(232, 229, 222)",
        }}
      >
        <Typography variant="h5">
          <Button
            style={{
              fontSize: "3em",
              fontFamily: "Evangelina",
              textTransform: "none",
              color: "rgb(52, 108, 140)",
            }}
          >
            Opening Knight
          </Button>
        </Typography>
      </AppBar>
      <Card sx={{ mt: 17 }}>
        <CardMedia
          component="img"
          image="./assets/images/chess.jpg"
          alt="vintage chess pieces on blue background"
        ></CardMedia>
      </Card>
      <Box sx={{ mt: 1.5 }}>
        <FormControl>
          <InputLabel htmlFor="email-address">Email address</InputLabel>
          <Input
              type="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}  
              required                                    
              placeholder="Email address"                                
          />
          </FormControl>
          <FormControl>
          <InputLabel htmlFor="user-name">Username</InputLabel>
          <Input
              type="text"
              label="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}  
              required                                    
              placeholder="Username"                                
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
              placeholder="Password"              
          />
          <Button type="submit" onClick={onSubmit}>
            Sign Up
          </Button>
        </FormControl>
      </Box>
      <Box sx={{ mt: 1.5 }}>
      <FormControl>
      <InputLabel htmlFor="email-address">Email address</InputLabel>
          <Input
              type="email"
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}  
              required                                    
              placeholder="Email address"                                
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
              placeholder="Password"              
          />
          <Button type="submit" onClick={onLogin}>
            Log in 
          </Button>
        </FormControl>
      </Box>
    </Grid>
  );
}
