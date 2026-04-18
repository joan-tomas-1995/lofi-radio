import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav aria-label="Main navigation">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/blog">Blog</Link>
        </li>
        <li>
          <Link to="/stations/lofi">Lofi</Link>
        </li>
        <li>
          <Link to="/stations/jazz">Jazz</Link>
        </li>
        <li>
          <Link to="/stations/synthwave">Synthwave</Link>
        </li>
        <li>
          <Link to="/stations/nature">Nature</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
