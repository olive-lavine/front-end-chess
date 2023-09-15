import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CardMedia from "@mui/material/CardMedia";
import Alert from '@mui/material/Alert';
import Card from "@mui/material/Card";
import Stack from '@mui/material/Stack';
import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"


export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      console.log('Sign-up successful');
      navigate('/');
    } catch (err) {
      console.error('Sign-up error:', err.message);
      setError('Failed to create an account. ' + err.message);
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
      <Box component="form" onSubmit={onSubmit} display="flex" alignItems="center">
        <FormControl sx={{ mt: 1}} >
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
        <FormControl sx={{ mt: 1}} >
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
        <FormControl sx={{ mt: 1}} >
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            type="password"
            label="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </FormControl>
        <Button type="submit" disabled={loading} sx={{ mt: 2}}>
            Sign Up
          </Button>
      </Box>
      <Box display="flex" alignItems="center" >
      Already have an account? <Button component={Link} to="/login">Log In</Button>
      </Box>
      </Stack>
    </Grid>
  );
}