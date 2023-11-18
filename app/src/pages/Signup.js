import React from "react";
import {LoginInfoForm} from "../components/LoginInfoForm.js";

const Login = ({devMode}) => {
  return (
    <div className="form signup">
      <LoginInfoForm devMode={devMode} />
    </div>
  );
};

export default Login;
