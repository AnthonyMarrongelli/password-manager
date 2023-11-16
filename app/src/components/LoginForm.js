import React, {useState} from "react";
import { debugFetch } from "../auth.js";
import {useCookies} from "react-cookie";

const LoginForm = ({devMode}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [, setCookies] = useCookies(["token"]);

  return <form onSubmit={async (e) => {
    e.preventDefault();
    const response = await debugFetch("/auth", {body: {username, password}}, devMode, {success: true, token: 1}, 1000);
    setCookies("token", response.token);
  }}>
    <h1>Welcome back.</h1>

    <label>
      Username
      <input type="text" value={username} onChange={e => setUsername(e.currentTarget.value)} />
    </label>
    <label>
      Password
      <input type="password" value={password} onChange={e => setPassword(e.currentTarget.value)} />
    </label>
    <button>Log in</button>
  </form>;
};

export default LoginForm;
