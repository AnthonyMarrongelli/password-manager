import React from "react";
import BaseEntry from "./BaseEntry.js";

const LoginEntry = ({loginInfo}) => {
  return <BaseEntry key={loginInfo.key} heading={loginInfo.name} className="login">{JSON.stringify(loginInfo)}</BaseEntry>;
};

export default LoginEntry;
