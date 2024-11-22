import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";

export function Navbar() {
  let location = useLocation();

  let [on_register_page, set_on_register_page] = useState(false);
  useEffect(() => {
    set_on_register_page(location.pathname.endsWith("/register"));
  }, [location])

  const auth_links = (circle_register: boolean) => {
    if (circle_register) {
      return <>
        <NavLink to="/login" className="px-5 border-2 border-dark-blue">
          Login
        </NavLink>
        <NavLink to="/register" className="rounded-[21px] border-2 border-white px-5 py-1.5">
          Register
        </NavLink>
      </>
    } else {
      return <>
        <NavLink to="/login" className="rounded-[21px] border-2 border-white px-5 py-1.5">
          Login
        </NavLink>
        <NavLink to="/register" className="px-5 border-2 border-dark-blue">
          Register
        </NavLink>
      </>
    }
  }

  return (
    <nav
      className="flex items-center justify-between rounded-b-[25px] bg-dark-blue p-4 px-10 text-[22px] font-semibold text-white shadow-md shadow-black/50"
    >
      <div className="flex items-center gap-4">
        <NavLink to="/">
          <img src="logo-white.svg" className="mr-[100px] h-[60px]" />
        </NavLink>

        <div>Recipes</div>
        <div>Add recipe</div>
      </div>

      <div className="mr-8 flex items-center gap-8">
        {auth_links(on_register_page)}
      </div >
    </nav >
  )
}

