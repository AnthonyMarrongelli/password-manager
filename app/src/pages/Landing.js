import React, {useState} from "react";
import {useCookies} from "react-cookie";
import {Link, Outlet, useLocation} from "react-router-dom";

const NavLink = ({to, children, className=""}) => {
  const location = useLocation();
  const current = to === location.pathname;
  return <Link to={to} className={className + (current ? " current" : "")}>{children}</Link>
}

const Landing = () => {
  const [cookies] = useCookies(["token"])

  return (
    <div className="main">
      <header>[A header. This only needs to be visible on mobile, and should include a hamburger button, to reveal the sidebar by pushing it over the main content.]</header>
      <nav><NavLink to="/logins">Logins</NavLink><NavLink to="/notes">Secure Notes</NavLink><NavLink to="/cards">Cards</NavLink></nav>
      <main><Outlet /></main>
    </div>
  );
};

export default Landing;
