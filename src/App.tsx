import spinner from "./fidget-spinner.png";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router";

import logo from "./logo.png";
import { Icon, Toolbar } from "@activityeducation/component-library";
import "./App.css";

// pages
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <div className="App">
      <Router>
        <Toolbar
          style={{
            backgroundColor: "rgb(243, 239, 233)",
            height: "32px",
            padding: "6px 16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            style={{ maxHeight: "32px", maxWidth: "32px" }}
            src={logo}
            alt=""
          />
          <span style={{ fontWeight: "bold" }}>EduPub</span>
          <nav className="toolbarNav">
            <ul>
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Profile
                </NavLink>
              </li>
            </ul>
          </nav>
        </Toolbar>
        <div>
          {/* A <Routes> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Routes>
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
