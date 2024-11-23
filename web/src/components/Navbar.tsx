import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { get_user } from "../lib/server";

export function Navbar() {
  let location = useLocation();

  let [on_register_page, set_on_register_page] = useState(false);
  useEffect(() => {
    set_on_register_page(location.pathname.endsWith("/register"));
  }, [location]);

  const { data, isFetching } = useQuery({
    queryKey: ["users"],
    queryFn: get_user,
  });

  const auth_links = (circle_register: boolean) => {
    if (circle_register) {
      return (
        <>
          <NavLink to="/login" className="px-5 border-2 border-dark-blue">
            Login
          </NavLink>
          <NavLink
            to="/register"
            className="rounded-[21px] border-2 border-white px-5 py-1.5"
          >
            Register
          </NavLink>
        </>
      );
    } else {
      return (
        <>
          <NavLink
            to="/login"
            className="rounded-[21px] border-2 border-white px-5 py-1.5"
          >
            Login
          </NavLink>
          <NavLink to="/register" className="px-5 border-2 border-dark-blue">
            Register
          </NavLink>
        </>
      );
    }
  };

  const right_side = () => {
    if (isFetching) {
      return <div>loading...</div>;
    } else if (data == undefined) {
      return <div>error fetching</div>;
    } else if ("name" in data) {
      return <div>{data.name}</div>;
    } else {
      console.log(data);
      return auth_links(on_register_page);
    }
  };

  return (
    <nav className="flex items-center justify-between rounded-b-[25px] bg-dark-blue p-4 px-10 text-[22px] font-semibold text-white shadow-md shadow-black/50">
      <div className="flex items-center gap-4">
        <NavLink to="/">
          <img src="logo-white.svg" className="mr-[100px] h-[60px]" />
        </NavLink>

        <div>Recipes</div>
        <div>Add recipe</div>
      </div>

      <div className="mr-8 flex items-center gap-8">{right_side()}</div>
    </nav>
  );
}
