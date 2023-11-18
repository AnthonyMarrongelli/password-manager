import React, {useState} from "react";
import {Link, Outlet, useLocation} from "react-router-dom";

const NavLink = ({to, children, className=""}) => {
  const location = useLocation();
  const current = to === location.pathname;
  return <Link to={to} className={className + (current ? " current" : "")}>{children}</Link>
}

const Landing = ({devMode, onLeaveDevMode}) => {
  const [navDrawerOpen, setNavDrawerOpen] = useState(false)

  return (
    <div className="main">
      <header><button onClick={() => {setNavDrawerOpen(!navDrawerOpen)}}>Hamburger menu</button>[A header. Only visible on mobile.]</header>
      <nav className={navDrawerOpen ? "open" : ""}>
        <NavLink to="/logins">Logins</NavLink>
        <NavLink to="/notes">Secure Notes</NavLink>
        <NavLink to="/cards">Cards</NavLink>
        <div className="separator" />
        <NavLink to="/logout">Sign out</NavLink>
      </nav>
      <main>
        {devMode && <p style={{color: "#400", backgroundColor: "#fdd"}}><b>You're currently in dev mode.</b> No requests will be sent; dummy data will be used instead. <button onClick={onLeaveDevMode}>Leave dev mode</button></p>}
        <Outlet />
      </main>
    </div>
  );
};

export default Landing;
