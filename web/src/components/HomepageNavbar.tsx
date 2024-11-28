import { useQuery } from "@tanstack/react-query";
import { get_user } from "../lib/server";
import { NavLink } from "react-router";
import { Navbar } from "./Navbar";

export function HomepageNavbar() {
  const { data, isFetching } = useQuery({
    queryKey: ["get_user"],
    queryFn: get_user,
  });

  let right_side = undefined;
  if (isFetching) {
    right_side = <div>loading...</div>;
  } else if (data == undefined) {
    right_side = <div>error fetching</div>;
  } else if ("name" in data) {
    right_side = <NavLink to="/profile">Profile</NavLink>;
  } else {
    right_side = (
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

  return <Navbar right_side={right_side} />;
}
