import './App.css';
import React, {useState} from "react";
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements, defer} from "react-router-dom";
import {CookiesProvider, useCookies} from "react-cookie";
import Entries from "./pages/Entries.js";
import Index from "./pages/Index.js";
import Landing from "./pages/Landing.js";
import Logout from "./pages/Logout.js";
import {authFetch} from "./auth.js";
import Login from "./pages/Login.js";
import Signup from "./pages/Signup.js";

const doAuthFetch = (token, ...args) => async () => token ? defer({items: authFetch(token, ...args)}) : null;

const Router = () => {
  const [cookies] = useCookies(["token"]);
  const [devMode, setDevMode] = useState(false);
  const isDevelopment = window.location.hostname === "localhost" && process.env.NODE_ENV === "development";

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route element={cookies.token ? <Landing devMode={devMode} onLeaveDevMode={() => setDevMode(false)} /> : undefined}>
          <Route element={cookies.token ? <>TODO</> : <Index devMode={devMode} setDevMode={setDevMode} />}>
            <Route index element={<Login devMode={devMode} />} />
            <Route path="/verify" element={<Signup devMode={devMode} />} />
          </Route>
          <Route path="/logins"
            loader={doAuthFetch(cookies.token, "/api/logins", {},
              devMode, [
                {key: "1", application: "an item!", username: "user1", password: "password1"},
                {key: "2", application: "another item!", username: "user2", password: "pass2"},
              ], 1000)}
            element={<Entries onEnterDevMode={isDevelopment && (() => setDevMode(true))} />}
          />
          <Route path="/notes"
            loader={doAuthFetch(cookies.token, "/api/secure-notes", {},
              devMode, [
                {key: "1", type: "secureNote", title: "A secure note! Not really.", text: "Lorem ipsum dolor sit amet, or whatever."},
                {key: "2", type: "secureNote", title: "Another fake secure note!", text: "Lorem ipsum dolor sit amet II, or whatever."},
              ], 1000)}
            element={<Entries onEnterDevMode={isDevelopment && (() => setDevMode(true))} />}
          />
          <Route path="/cards"
            loader={doAuthFetch(cookies.token, "/api/cards", {},
              devMode, [
                {key: "1", type: "card", cardNumber: "1234567890123456", firstName: "Cardholder", lastName: "One", cvv: "111", expiration: "2025-01", bank: "Bank of Cardholding"},
                {key: "2", type: "card", cardNumber: "2345678901234561", firstName: "Cardholder", lastName: "Two", cvv: "222", expiration: "2025-02", bank: "Cardholders Inc"},
              ], 1000)}
            element={<Entries onEnterDevMode={isDevelopment && (() => setDevMode(true))} />}
          />
          <Route path="/logout" element={<Logout />} />
        </Route>
        <Route path="/*" element={<>Whoops! Page not found.</>} />
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
