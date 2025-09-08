import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-dark mt-14 py-6 text-center rounded-t-3xl">
      <h1 className="text-xl font-bold mb-2">ChatGPT Travel Planner</h1>
      <p className="text-sm mb-4 text-gray-600 dark:text-gray-300">
        © {new Date().getFullYear()} All rights reserved.
      </p>
      <div className="flex justify-center gap-4">
        <a href="#"><FaInstagram className="text-2xl hover:text-primary" /></a>
        <a href="#"><FaFacebook className="text-2xl hover:text-primary" /></a>
        <a href="#"><FaLinkedin className="text-2xl hover:text-primary" /></a>
      </div>
    </footer>
  );
};

export default Footer;
