import React, {useEffect, useState} from "react";
import { debugFetch } from "../auth.js";
import {useNavigate, useSearchParams} from "react-router-dom";

const PasswordResetForm = ({devMode}) => {
  const [params] = useSearchParams();

  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (password1 === password2) setPassword(password1);
    else setPassword("");
  }, [password1, password2]);

  if (!params.has("user") || !params.has("resetKey"))
    return (
      <div className="error-page">
        Looks like you're missing part of the password reset link.
        Try the link in the email you received again.
      </div>
    );

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      debugFetch("/server/auth/resetPassword", {body: {userID: params.get("user"), newPassword: password, resetKey: params.get("resetKey")}},
        devMode, {success: true}, 1000)
      .then(response => {
        navigate("/");
      }, error => {
        setError(error);
      })
    }}>
      <h1>Let's get you a new password.</h1>

      <label>
        Password
        <input type="password" value={password1} onChange={e => setPassword1(e.currentTarget.value)} required />
      </label>
      <label>
        Reenter password
        <input type="password" value={password2} onChange={e => setPassword2(e.currentTarget.value)} required />
      </label>
      <button>Reset password</button>
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

export default PasswordResetForm;
