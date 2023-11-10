import React from "react";
import {useCookies} from "react-cookie";
import Landing from "./Landing.js";
import Login from "./Login.js";
import {useLocation} from "react-router-dom";

const Index = () => {
  const [cookies] = useCookies(["token"])
  const location = useLocation();

  return (
    cookies.token ? <Landing /> : location.pathname === "/" ? <Login /> : <div className="error-page">Not found!</div>
  );
};

export default Index;

