import React, {useState} from "react";
import SignupForm from "../components/SignupForm.js";
import LoginForm from "../components/LoginForm.js";

const Login = () => {
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
              <p>Already have an account? {<a href="#" onClick={e => {e.preventDefault(); setSignup(false)}}>Log in</a>}.</p>
              </>
            : <>
              <LoginForm />
              <p>Need an account? {<a href="#" onClick={e => {e.preventDefault(); setSignup(true)}}>Sign up</a>}.</p>
              </>
          }
        </div>
      </div>
    </div>

  );
};

export default Login;

