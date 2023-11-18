import React, {useState} from "react";
import {EmailForm} from "../components/EmailForm.js";
import LoginForm from "../components/LoginForm.js";

const Login = ({devMode}) => {
  const [isSignup, setSignup] = useState(false);

  return (
    <div className={"form " + (isSignup ? "signup" : "login")}>
      {
        isSignup
        ? <>
          <EmailForm devMode={devMode} />
          <p>Already have an account? <button type="button" onClick={e => {e.preventDefault(); setSignup(false)}}>Log in</button>.</p>
          </>
        : <>
          <LoginForm devMode={devMode} />
          <p>Need an account? <button type="button" onClick={e => {e.preventDefault(); setSignup(true)}}>Sign up</button>.</p>
          </>
      }
    </div>
  );
}

export default Login
