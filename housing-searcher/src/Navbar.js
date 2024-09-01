import React from 'react';
import { NavLink } from 'react-router-dom';

export function Navbar({}) {
    return (
      <div class="navbar bg-base-100" style={{"backgroundColor": "#096B72", "color": "#FFEAEE"}}>
        <div class="flex-1">
          <a class="btn btn-ghost text-xl">LocaLife</a>
        </div>
        <div class="flex-none">
          <ul class="menu menu-horizontal px-1 gap-2">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/searchresults">Search</NavLink>
            <NavLink to='/profile'> My Profile </NavLink>
            <NavLink to='/login'> Log Out </NavLink>
          </ul>
        </div>
      </div>
    )
}