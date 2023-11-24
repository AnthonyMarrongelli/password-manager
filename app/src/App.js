import './App.css';
import React, {useState} from "react";
import {Link, Navigate, Route, RouterProvider, createBrowserRouter, createRoutesFromElements, defer, redirect} from "react-router-dom";
import {CookiesProvider, useCookies} from "react-cookie";
import Entries from "./pages/Entries.js";
import Index from "./pages/Index.js";
import Landing from "./pages/Landing.js";
import Logout from "./pages/Logout.js";
import {authFetch} from "./auth.js";
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";
import PasswordReset from "./pages/PasswordReset.js";
import SecureNoteEntry from "./components/SecureNoteEntry.js";
import LoginEntry from "./components/LoginEntry.js";
import CardEntry from "./components/CardEntry.js";

const doAuthFetch = (token, ...args) => async () => token ? defer({items: authFetch(token, ...args)}) : null;

const Router = () => {
  const [cookies] = useCookies(["token"]);
  const [devMode, setDevMode] = useState(false);
  const isDevelopment = window.location.hostname === "localhost" && process.env.NODE_ENV === "development";

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index loader={() => redirect(cookies.token ? "/landing" : "/sign-in")} />
        <Route element={cookies.token ? <Navigate to="/landing" /> : <Index devMode={devMode} setDevMode={setDevMode} />}>
          <Route path="/sign-in" element={<Login devMode={devMode} />} />
          <Route path="/verify" element={<Signup devMode={devMode} />} />
          <Route path="/pw-reset" element={<PasswordReset devMode={devMode} />} />
        </Route>
        <Route element={cookies.token ? <Landing devMode={devMode} onLeaveDevMode={() => setDevMode(false)} /> : undefined}>
          <Route path="/landing" element={<>TODO</>} />
          <Route path="/logins"
            loader={doAuthFetch(cookies.token, "/api/logins", {},
              devMode, [
                {id: "1", application: "an item!", username: "user1", password: "password1"},
                {id: "2", application: "another item!", username: "user2", password: "pass2"},
              ], 1000)}
            element={<Entries DefaultEntryKind={LoginEntry} devMode={devMode} onEnterDevMode={isDevelopment && (() => setDevMode(true))} />}
          />
          <Route path="/notes"
            loader={doAuthFetch(cookies.token, "/api/secure-notes", {},
              devMode, [
                {id: "1", type: "secureNote", title: "A secure note! Not really.", text: "Lorem ipsum dolor sit amet, or whatever."},
                {id: "2", type: "secureNote", title: "Another fake secure note!", text: "Lorem ipsum dolor sit amet II, or whatever."},
              ], 1000)}
            element={<Entries DefaultEntryKind={SecureNoteEntry} devMode={devMode} onEnterDevMode={isDevelopment && (() => setDevMode(true))} />}
          />
          <Route path="/cards"
            loader={doAuthFetch(cookies.token, "/api/cards", {},
              devMode, [
                {id: "1", type: "card", cardNumber: "1234567890123456", firstName: "Cardholder", lastName: "One", cvv: "111", expiration: "2025-01", bank: "Bank of Cardholding"},
                {id: "2", type: "card", cardNumber: "2345678901234561", firstName: "Cardholder", lastName: "Two", cvv: "222", expiration: "2025-02", bank: "Cardholders Inc"},
              ], 1000)}
            element={<Entries DefaultEntryKind={CardEntry} devMode={devMode} onEnterDevMode={isDevelopment && (() => setDevMode(true))} />}
          />
          <Route path="/logout" element={<Logout />} />
        </Route>
        <Route path="/*" element={<div className="error-page">Page not found. <Link to="/">Go back home</Link>?</div>} />
      </Route>
    )
  );

  return <RouterProvider router={router} />
}

const App = () => {
  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <Router />
    </CookiesProvider>
  );
};

export default App;
