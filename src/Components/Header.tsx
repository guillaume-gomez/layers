import React, { useState } from 'react';

function Header() {
  return (
    <div className="navbar bg-base-200 ">
    <div className="navbar-start">
      <button className="btn btn-ghost normal-case text-xl">Layers</button>
    </div>
    <div className="navbar-end">
      <a className="btn">Github</a>
    </div>
  </div>
  );
}

export default Header;