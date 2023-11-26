import React, {useState} from "react";
import {debugFetch} from "../auth.js";
import {DirtyableInput, ValidatingForm} from "./CopyableInput.js";


export const PasswordRequestResetForm = ({devMode}) => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const [emailDirty, setEmailDirty] = useState(false);

  return <ValidatingForm validate={() => {setError(""); if (!email) return "Missing email."}} onSubmit={() => {
    debugFetch("/server/auth/sendPassEmail", {body: {email}}, devMode, {success: true}, 1000)
    .then(response => {
      setEmailSent(true);
    }, error => {
      setError(error.message);
    });
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
          <DirtyableInput type={emailSent ? "hidden" : "email"} value={email} onChange={e => setEmail(e.currentTarget.value)} required dirty={emailDirty} setDirty={setEmailDirty} />
        </label>
        <button type="submit">Send password reset email</button>
        {error && <p className="error-message">{error}</p>}
      </>}
  </ValidatingForm>;
};

export default PasswordRequestResetForm;
