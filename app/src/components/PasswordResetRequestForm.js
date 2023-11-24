import React, {useState} from "react";
import {debugFetch} from "../auth.js";


export const PasswordRequestResetForm = ({devMode}) => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  return <form onSubmit={async (e) => {
    e.preventDefault();
    const response = await debugFetch("/server/auth/sendPassEmail", {body: {email}}, devMode, {success: true}, 1000);
    setEmailSent(true);
  }}>
    <h1>Forgot your password?</h1>
    {emailSent
      ? <>
        <p>A password reset email has been sent to&nbsp;<b>{email}</b>.</p>
        <button type="submit">Resend</button><button type="button" onClick={e => {e.preventDefault(); setEmailSent(false);}}>Change email</button>
      </>
      : <>
        <p>Let's get you a new one.</p>
        <label>
          {emailSent ? "" : "Email"}
          <input type={emailSent ? "hidden" : "email"} value={email} onChange={e => setEmail(e.currentTarget.value)} required />
        </label>
        <button type="submit">Send password reset email</button>
      </>}
  </form>;
};

export default PasswordRequestResetForm;
