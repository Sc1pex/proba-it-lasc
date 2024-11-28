import React from "react";
import { NavLink } from "react-router";

export function Navbar({ right_side }: { right_side: React.ReactNode }) {
  return (
    <nav className="flex items-center justify-between rounded-b-[25px] bg-dark-blue p-4 px-10 text-[22px] font-semibold text-white shadow-md shadow-black/50">
      <div className="flex items-center gap-4">
        <NavLink to="/">
          <img src="logo-white.svg" className="mr-[100px] h-[60px]" />
        </NavLink>

        <div>Recipes</div>
        <NavLink to="/new-recipe">Add recipe</NavLink>
      </div>

      <div className="mr-8 flex items-center gap-8">{right_side}</div>
    </nav>
  );
}
