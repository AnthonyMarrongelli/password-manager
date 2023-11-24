import React, {useState} from "react";
import {debugFetch} from "../auth.js";


const SignupForm = ({devMode}) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  return <form onSubmit={async (e) => {
    e.preventDefault();
    const response = await debugFetch("/server/auth/signup", {body: {username, email, password}}, devMode, {success: true, user: {username, email, password}, message: "User created! Returned information on the new user."}, 1000);
    setEmailSent(true);
    // uhhh do something.
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
          <input type="password" value={password} onChange={e => setPassword(e.currentTarget.value)} required />
        </label>
        <button type="submit">Send confirmation email</button>
      </>}
  </form>;
};

export default SignupForm;
