import React, {useState} from "react";
import SignupForm from "../components/SignupForm.js";
import LoginForm from "../components/LoginForm.js";

const Login = ({devMode, setDevMode}) => {
  const [isSignup, setSignup] = useState(false);

  return (
    <div className="login-page">
      <div className="side-image">
        <img alt="(Placeholder for future use.)" /></div>
      <div className="form-container">
        <div className={"form " + (isSignup ? "signup" : "login")}>
          {
            isSignup
            ? <>
              <SignupForm />
              <p>Already have an account? <button type="button" onClick={e => {e.preventDefault(); setSignup(false)}}>Log in</button>.</p>
              </>
            : <>
              <LoginForm devMode={devMode} />
              <p>Need an account? <button type="button" onClick={e => {e.preventDefault(); setSignup(true)}}>Sign up</button>.</p>
              </>
          }
          {
            setDevMode && <p style={{color: "#400", backgroundColor: "#fdd"}}>Dev mode is currently {devMode ? <><b>on</b>, meaning requests will not be sent.</> : <b>off</b>}. <button onClick={() => setDevMode(!devMode)}>Toggle dev mode</button></p>
          }
        </div>
      </div>
    </div>

  );
};

export default Login;

