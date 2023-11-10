import React from "react";

const LoginForm = () => {
  return <div>
    <h1>Welcome back.</h1>

    <label>
      Username
      <input type="text" />
    </label>
    <label>
      Password
      <input type="password" />
    </label>
    <button>Log in</button>
  </div>;
};

export default LoginForm;
