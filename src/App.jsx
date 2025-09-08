// App.jsx (skraćeno)
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "./components/Navbar/Navbar";
import About from "./components/About/About";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import AdminPanel from "./components/AdminPanel/AdminPanel";
import Dashboard from "./components/Dashboard/Dashboard";
import ProtectedRoute from "./components/Protected/ProtectedRoute";
import AdminRoute from "./components/Protected/AdminRoute";
import APIPage from "./components/APIPage/APIPage"; 

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const element = document.documentElement;

  useEffect(() => {
    if (theme === "dark") { element.classList.add("dark"); localStorage.setItem("theme","dark"); }
    else { element.classList.remove("dark"); localStorage.setItem("theme","light"); }
  }, [theme]);

  useEffect(() => {
    AOS.init({ offset: 100, duration: 800, easing: "ease-in-sine", delay: 100 });
    AOS.refresh();
  }, []);

  return (
    <Router>
      <div className="bg-white dark:bg-black dark:text-white text-black overflow-x-hidden">
        <Navbar theme={theme} setTheme={setTheme} />
        <Routes>
          <Route path="/" element={<><About theme={theme}/></>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/api" element={<ProtectedRoute />}>
            <Route path="" element={<APIPage />} />
          </Route>
          <Route path="/dashboard" element={<ProtectedRoute />}>
  <Route path="" element={<Dashboard />} />
</Route>
          <Route path="/admin-panel" element={<AdminRoute />}>
            <Route path="" element={<AdminPanel />} />
          </Route>
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};
export default App;
