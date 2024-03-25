import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import VisibilityOffTwoToneIcon from "@mui/icons-material/VisibilityOffTwoTone";
import CardMedia from "@mui/material/CardMedia";
import TextField from "@mui/material/TextField";

import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { Paper } from "@mui/material";

export default function LogIn() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch (error) {
      console.error(`Login error: ${error.message}`);
      setError(
        "Failed to log in. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  }
  function showPassword() {
    setHidePassword((prevHidePassword) => !prevHidePassword);
  }
  return (
    <Grid container justifyContent="center">
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
            <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
              Log In
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <FormControl variant="outlined">
                <InputLabel htmlFor="email-address">Email address</InputLabel>
                <Input
                  id="email-address"
                  type="email"
                  inputRef={emailRef}
                  required
                />
              </FormControl>

              <FormControl variant="outlined">
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  id="password"
                  type={hidePassword ? "password" : "text"}
                  inputRef={passwordRef}
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
                size="large"
                sx={{ mt: 1, mb: 2 }}
              >
                Log in
              </Button>

              <Typography variant="body2" sx={{ textAlign: "center" }}>
                Need an account?{" "}
                <Button component={Link} to="/signup">
                  Sign up
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Grid>
  );
}
//   return (
//     <Grid container justifyContent="center">
//       <Box
//         sx={{
//           width: "100%",
//           height: "80vh",
//           backgroundImage: 'url("./assets/images/chess.jpg")',
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Paper
//           sx={{
//             width: 400,
//             height: "auto",
//             m: 2,
//             backgroundColor: "background.default",
//           }}
//         >
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               p: 2,
//             }}
//           >
//             <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
//               <LockOutlinedIcon />
//             </Avatar>
//             <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
//               Log In
//             </Typography>
//             {error && <Alert severity="error">{error}</Alert>}
//             <Box
//               component="form"
//               onSubmit={handleSubmit}
//               sx={{ display: "flex", flexDirection: "column", gap: 2 }}
//             >
//               <TextField
//                 id="email-address"
//                 label="Email address"
//                 type="email"
//                 inputRef={emailRef}
//                 required
//                 variant="outlined"
//               />

//               <TextField
//                 id="password"
//                 label="Password"
//                 type={hidePassword ? "password" : "text"}
//                 inputRef={passwordRef}
//                 required
//                 variant="outlined"
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <Button
//                         color="secondary"
//                         onClick={showPassword}
//                         sx={{
//                           minWidth: "unset",
//                           padding: "0px",
//                           "&:hover": { backgroundColor: "transparent" },
//                           cursor: "pointer",
//                         }}
//                       >
//                         {hidePassword ? (
//                           <VisibilityOffTwoToneIcon />
//                         ) : (
//                           <VisibilityTwoToneIcon />
//                         )}
//                       </Button>
//                     </InputAdornment>
//                   ),
//                 }}
//               />

//               <Button
//                 type="submit"
//                 disabled={loading}
//                 variant="contained"
//                 size="large"
//                 sx={{ mt: 1, mb: 2 }}
//               >
//                 Log in
//               </Button>

//               <Typography variant="body2" sx={{ textAlign: "center" }}>
//                 Need an account?{" "}
//                 <Button color="secondary" component={Link} to="/signup">
//                   Sign up
//                 </Button>
//               </Typography>
//             </Box>
//           </Box>
//         </Paper>
//       </Box>
//     </Grid>
//   );
// }
