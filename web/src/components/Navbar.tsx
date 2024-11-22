import { NavLink } from "react-router";

export function Navbar() {
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
        <NavLink to="/login" className="rounded-[21px] border-2 border-white px-5 py-1.5"
        >
          Login</NavLink>
        <NavLink to="/register">Register</NavLink>
      </div>
    </nav>

  )
}
