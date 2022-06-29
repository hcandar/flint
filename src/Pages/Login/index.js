import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import { useCallback, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useRef } from 'react';
import { Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login() {
  let style = {sx: {mt: 2}};

  const mailRef = useRef(null);
  const passwordRef = useRef(null);

  const [message, setMessage] = useState(null);
  const [isRegister, setIsRegister] = useState(false);

  const navigate = useNavigate();

  const logIn = useCallback(async () => {
    const mail = mailRef.current.value;
    const password = passwordRef.current.value;


    setMessage(["info", "Logging In..."]);
    const { user, session, error } = await supabase.auth.signIn({
      email: mail,
      password: password
    });
    setMessage(null);

    if (error) setMessage(["error", error.message]);

    if (user) {
      setMessage(["success", "Successfully logged in!"]);
      setTimeout(() => navigate("/"), 1500);
    }
  }, [navigate]);

  const register = useCallback(async () => {
    const mail = mailRef.current.value;
    const password = passwordRef.current.value;

    setMessage(["info", "Registering..."]);
    const { user, session, error } = await supabase.auth.signUp({
      email: mail,
      password: password
    });
    setMessage(null);
    
    if (error) setMessage(["error", error.message]);

    if (user) {
      setMessage(["info", "Please check your email!"]);
    }
  }, []);

  const isError = Boolean(message && message[0] === "error");
  
  return (
    <Container maxWidth="sm" sx={{py: 4}}>
      <Paper sx={{p: 4, textAlign:"center", fontWeight: 600}}> 
        <Typography color="primary" variant="h3">Log In</Typography>
        <TextField error={isError} {...style} fullWidth variant="outlined" label="E-mail" inputRef={mailRef} />
        { /* <TextField fullWidth variant="outlined" label="E-mail" /> */ }
        <TextField error={isError} {...style} fullWidth variant="outlined" label="Password" type="password" inputRef={passwordRef} />
        { isRegister && <TextField error={isError} {...style} fullWidth variant="outlined" label="Password Check" type="password" /> }
        <Link {...style} display="block" onClick={() => {setIsRegister(!isRegister)}} href="#" underline="hover">
          { isRegister ? "Already registered? Sign In." : "No account? Register."}
        </Link>
        { message && <Alert {...style} severity={message[0]}>{message[1]}</Alert>}
        { !isRegister && <Button {...style} aria-label="log in" variant="contained" onClick={logIn}>Log In</Button> }
        { isRegister && <Button {...style} aria-label="register" variant="contained" onClick={register}>Register</Button> }
      </Paper>
    </Container>
  );
}

export default Login;