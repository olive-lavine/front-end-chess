import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Alert from '@mui/material/Alert';
import Card from "@mui/material/Card";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { useState, useRef } from "react";
import axios from "axios";


export default function LogIn() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  async function handleSubmit(e) {
    e.preventDefault();
  
    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch (error) {
      console.error(`Login error: ${error.message}`);
      setError("Failed to log in. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <Grid item container justifyContent="center">
      <Card sx={{ mt: 17 }}>
        <CardMedia
          component="img"
          image="./assets/images/chess.jpg"
          alt="vintage chess pieces on blue background"
        ></CardMedia>
      </Card>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      {error && <Alert variant="danger">{error}</Alert>}
        <FormControl>
          <InputLabel htmlFor="email-address">Email address</InputLabel>
              <Input
                type="email"
                inputRef = {emailRef}
                required                                    
                // placeholder="Email address"                                
            />
        </FormControl>
          <FormControl>
            <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                type="password"
                inputRef = {passwordRef}
                required                                 
                // placeholder="Password"              
            />
            <Button type="submit"  disabled={loading}>
              Log in
            </Button>
          </FormControl>
          Need an account? <Link to="/signup">Sign up</Link>
        </Box>
    </Grid>
  );
}


  // const [name, setName] = useState("");
  // const [status, setStatus] = useState("");

  // const handleInput = (event) => {
  //   setName(event.target.value);
  // };

  // const handleSubmit = (event) => {
  //   event.preventDefault();
  //   return axios
  //     .get(`http://localhost:8080/players/?name=${name}`)
  //     .then((player) => {
  //       if (!player.data) {
  //         setStatus(`welcome ${name}, please sign in`);
  //         addPlayer(name);
  //       } else {
  //         setPlayer(player.data);
  //         console.log(player.data)
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // const addPlayer = (name) => {
  //   const requestBody = { name: name };
  //   return axios
  //     .post(`http://localhost:8080/players`, requestBody)
  //     .then((response) => {
  //       console.log(response.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // return (
  //   <Grid item container justifyContent="center">
  //     <AppBar
  //       sx={{
  //         boxShadow: "none",
  //         backgroundColor: "rgb(232, 229, 222)",
  //       }}
  //     >
  //       <Typography variant="h5">
  //         <Button
  //           style={{
  //             fontSize: "3em",
  //             fontFamily: "Evangelina",
  //             textTransform: "none",
  //             color: "rgb(52, 108, 140)",
  //           }}
  //         >
  //           Opening Knight
  //         </Button>
  //       </Typography>
  //     </AppBar>
  //     <Card sx={{ mt: 17 }}>
  //       <CardMedia
  //         component="img"
  //         image="./assets/images/chess.jpg"
  //         alt="vintage chess pieces on blue background"
  //       ></CardMedia>
  //     </Card>
  //     <Box sx={{ mt: 1.5 }}>
  //       <FormControl>
  //         <InputLabel htmlFor="username">username</InputLabel>
  //         <Input id="username" onChange={handleInput} />
  //         <Button type="submit" onClick={handleSubmit}>
  //           log in
  //         </Button>
  //       </FormControl>
  //       <Box>{status}</Box>
  //     </Box>
  //   </Grid>
  // );

