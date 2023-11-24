import React, {useEffect, useState} from "react";
import { debugFetch } from "../auth.js";
import {useNavigate} from "react-router-dom";

const PasswordResetForm = ({devMode}) => {
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (password1 === password2) setPassword(password1);
    else setPassword("");
  }, [password1, password2]);

  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      const response = await debugFetch("/api/pwreset", {body: {password}},
        devMode, {success: true}, 1000);
      navigate("/");
    }}>
      <h1>Let's get you a new password.</h1>

      <label>
        Password
        <input type="text" value={password1} onChange={e => setPassword1(e.currentTarget.value)} required />
      </label>
      <label>
        Reenter password
        <input type="password" value={password2} onChange={e => setPassword2(e.currentTarget.value)} required />
      </label>
      <button>Reset password</button>
    </form>
  );
};

export default PasswordResetForm;
