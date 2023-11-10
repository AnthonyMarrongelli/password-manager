import React, {useState} from "react";
import {useCookies} from "react-cookie";
import {Outlet} from "react-router-dom";

const Landing = () => {
  const [cookies] = useCookies(["token"])

  return (
    <div className="main">
      <header>[A header.]</header>
      <nav>[A navigation sidebar.]</nav>
      <main><Outlet /></main>
    </div>
  );
};

export default Landing;
