import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert"
import Form from "../../Components/Form";

import { useCallback, useState, useRef } from "react";
import { supabase } from '../../supabaseClient';

function PasswordReset() {
  const style = {sx: {mt: 2}};
  const [message, setMessage] = useState(null);
  const passwordRef = useRef(null);
  const rePasswordRef = useRef(null);

  const resetPassword = useCallback(async () => {
    setMessage(["info", "Resetting Password"]);
    const password = passwordRef.current.value;
    const rePassword = rePasswordRef.current.value;

    if (password !== rePassword) {
      setMessage(["error", "Passwords do not match."]); 
      return;
    }

    const { error } = await supabase.auth.update({
      password: password,
    });

    if (error) {
      setMessage(["error", error.message]); 
      return;
    }
    setMessage(["success", "Password reset!"]);
  }, []);

  const handleEnter = useCallback(event => {
    if (event.key === "Enter") resetPassword();
  }, [resetPassword]);

  const isError = Boolean(message && message[0] === "error");

  return (
    <Form>
      <Typography color="primary" variant="h3">Password Reset</Typography>
      <TextField error={isError} {...style} fullWidth variant="outlined" label="Password" type="password" inputRef={passwordRef} onKeyUp={handleEnter} />
      <TextField error={isError} {...style} fullWidth variant="outlined" label="Password Check" type="password" inputRef={rePasswordRef} onKeyUp={handleEnter} />

      { message && <Alert {...style} severity={message[0]}>{message[1]}</Alert>}
      <Button {...style} aria-label="log in" variant="contained" onClick={resetPassword}>Change Password</Button>
    </Form>
  )
}

export default PasswordReset;