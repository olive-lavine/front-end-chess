import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Alert from '@mui/material/Alert';
import Card from "@mui/material/Card";
import axios from "axios";
import { useState } from "react";
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

  return (
    <Card sx={{minHeight: "50vh", maxWidth: "400px"}}>
      <Box component="form" onSubmit={onSubmit} sx={{ mt: 1.5 }}>
        {error && <Alert variant="danger">{error}</Alert>}
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
          <Button type="submit" disabled={loading}>
            Sign Up
          </Button>
        </FormControl>
      </Box>
      Already have an account? <Link to="/login">Log In</Link>
    </Card>
  );
}