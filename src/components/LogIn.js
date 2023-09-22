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
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import VisibilityOffTwoToneIcon from '@mui/icons-material/VisibilityOffTwoTone';
import CardMedia from "@mui/material/CardMedia";
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { useState, useRef } from "react";
import Stack from '@mui/material/Stack';



export default function LogIn() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { login } = useAuth()
  const [error, setError] = useState("")
  const [hidePassword, setHidePassword] = useState(true);
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
  function showPassword() {
    setHidePassword(prevHidePassword => !prevHidePassword);
    };


  return (
    <Grid item container justifyContent="center">
      <Card sx={{ mt: 17 }}>
        <CardMedia
          component="img"
          image="./assets/images/chess.jpg"
          alt="vintage chess pieces on blue background"
        ></CardMedia>
      </Card>
      <Stack spacing={2}   justifyContent="center" alignItems="center">
        <Box>{error && <Alert variant="danger">{error}</Alert>}</Box>
      <Box component="form" onSubmit={handleSubmit} display="flex" alignItems="center" >
        <FormControl sx={{ mt: 1}} >
          <InputLabel htmlFor="email-address">Email address</InputLabel>
              <Input
                type="email"
                inputRef = {emailRef}
                required                                    
            />
        </FormControl>
          <FormControl  sx={{ mt: 1}}>
            <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                type={hidePassword ? "password" : "input"}
                inputRef = {passwordRef}
                required   
                endAdornment={
                  hidePassword ? (
                    <Button disableRipple  // Disable the button ripple effect
                    sx={{
                      minWidth: 'unset',  // Remove the minimum width
                      padding: '0px',  // Adjust padding as needed
                      '&:hover': {
                        backgroundColor: 'transparent', // Remove button background on hover
                      },
                      cursor: 'pointer',
                    }}>
                    <InputAdornment position="end">
                      <VisibilityOffTwoToneIcon
                        fontSize="default"
                        onClick={showPassword}
                      />
                    </InputAdornment>
                    </Button>
                  ) : (
                    
                    <InputAdornment position="end">
                      <VisibilityTwoToneIcon
                        fontSize="default"
                        onClick={showPassword}
                      />
                    </InputAdornment>
                  
                  )
                }                              
            />
          </FormControl>      
          <Button type="submit"  disabled={loading} size={"large"}  sx={{ mt: 2}} >
              Log in
            </Button>
        </Box>
        <Box display="flex" alignItems="center">
          Need an account? <Button component={Link} to="/signup">Sign up</Button>
        </Box>
        </Stack>
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

