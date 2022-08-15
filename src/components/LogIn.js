import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import axios from "axios";
import { useState } from "react";

export default function LogIn({ setPlayer }) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const handleInput = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    return axios
      .get(`https://back-end-chess.herokuapp.com/players/?name=${name}`)
      .then((player) => {
        if (!player.data) {
          setStatus("welcome new user, please sign in");
          addPlayer(name);
        } else {
          setPlayer(player.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addPlayer = (name) => {
    const requestBody = { name: name };
    return axios
      .post(`https://back-end-chess.herokuapp.com/players`, requestBody)
      .then((response) => {
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Grid item container justifyContent="center">
      <Card>
        <CardMedia
          component="img"
          image="./assets/images/chess.jpg"
          alt="vintage chess pieces on blue background"
        ></CardMedia>
      </Card>
      <Box sx={{ mt: 1.5 }}>
        <FormControl>
          <InputLabel htmlFor="username">username</InputLabel>
          <Input id="username" onChange={handleInput} />
          <Button type="submit" onClick={handleSubmit}>
            log in
          </Button>
        </FormControl>
        <Box>{status}</Box>
      </Box>
    </Grid>
  );
}
// <Card component="form" id="login" noValidate onSubmit={handleSubmit}>
//   <CardContent>
//     <TextField id="username" label="User Name" onChange={handleInput} />
//     <CardActions>
//       <Button size="small" type="submit">
//         Submit
//       </Button>
//     </CardActions>
//   </CardContent>
// </Card>
