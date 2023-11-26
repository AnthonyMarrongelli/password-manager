import React, {useEffect, useState} from "react";
import {debugFetch} from "../auth.js";


const SignupForm = ({devMode}) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [password, setPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    if (password1 === password2) setPassword(password1);
    else setPassword("");
  }, [password1, password2]);

  return <form onSubmit={async (e) => {
    e.preventDefault();
    debugFetch("/server/auth/signup", {body: {username, email, password}}, devMode, {success: true, user: {username, email, password}, message: "User created! Returned information on the new user."}, 1000)
    .then(response => setEmailSent(true),
      error => setError(error.message));
  }}>
    <h1>Hi there.</h1>
    {emailSent
      ? <>
        <p>Great! We've sent a confirmation email to&nbsp;<b>{email}</b>. You can close this tab now.</p>
        <button type="submit">Resend</button><button type="button" onClick={e => {e.preventDefault(); setEmailSent(false);}}>Return</button>
      </>
      : <>
        <p>Let's get you signed up.</p>
        <label>
          Email
          <input type="email" value={email} onChange={e => setEmail(e.currentTarget.value)} required />
        </label>
        <label>
          Username
          <input type="text" value={username} onChange={e => setUsername(e.currentTarget.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password1} onChange={e => setPassword1(e.currentTarget.value)} required />
        </label>
        <label>
          Confirm password
          <input type="password" value={password2} onChange={e => setPassword2(e.currentTarget.value)} required />
        </label>
        <button type="submit">Send confirmation email</button>
        {error && <p className="error-message">{error}</p>}
      </>}
  </form>;
};

export default SignupForm;
