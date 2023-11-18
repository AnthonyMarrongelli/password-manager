import React, {useState} from "react";
import {debugFetch} from "../auth.js";


export const EmailForm = ({devMode}) => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  return <form onSubmit={async (e) => {
    e.preventDefault();
    const response = await debugFetch("/api/signup-email", {body: {email}}, devMode, {success: true}, 1000);
    setEmailSent(true);
    // uhhh do something.
  }}>
    <h1>Hi there.</h1>
    {emailSent
      ? <>
        <p>A confirmation email has been sent to&nbsp;<b>{email}</b>.</p>
        <button type="submit">Resend</button><button type="button" onClick={e => {e.preventDefault(); setEmailSent(false);}}>Change email</button>
      </>
      : <>
        <p>First, we need to make sure you have a valid email...</p>
        <label>
          {emailSent ? "" : "Email"}
          <input type={emailSent ? "hidden" : "email"} value={email} onChange={e => setEmail(e.currentTarget.value)} required />
        </label>
        <button type="submit">Send confirmation email</button>
      </>}
  </form>;
};
