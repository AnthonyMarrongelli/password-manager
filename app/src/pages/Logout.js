import React from "react";
import {useCookies} from "react-cookie"
import {Navigate} from "react-router-dom";

const Logout = () => {
  const [,, deleteCookie] = useCookies(["token"]);

  deleteCookie("token");

  return <Navigate to="/" replace />
}

export default Logout;
