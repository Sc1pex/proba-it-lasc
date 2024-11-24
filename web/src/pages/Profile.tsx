import { useMutation, useQuery } from "@tanstack/react-query";
import { Navbar } from "../components/Navbar";
import { get_user, logout } from "../lib/server";
import { useNavigate } from "react-router";

function ProfileNavbar() {
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate("/");
    },
  });

  return (
    <button
      className="rounded-[21px] border border-white px-5 py-1.5"
      onClick={() => {
        mutate();
      }}
    >
      Log out
    </button>
  );
}

export function Profile() {
  const { data, isFetching } = useQuery({
    queryKey: ["get_user"],
    queryFn: get_user,
  });

  const navigate = useNavigate();
  if (data != undefined && !("name" in data)) {
    navigate("/login");
    return;
  }

  if (isFetching) {
    return <div className="mt-[40vh] text-center">Loading...</div>;
  }
  if (data === undefined) {
    return <div className="mt-[40vh] text-center">Something went wrong</div>;
  }

  return (
    <>
      <Navbar right_side={<ProfileNavbar />} />

      <div className="flex justify-evenly items-stretch mt-[18vh]">
        <div className="bg-dark-blue text-white w-[25vw] flex flex-col items-center p-14 rounded-[20px]">
          <img src="bucatar.svg" />
          <div className="w-full border-b mt-8 text-[22px]">{data.name}</div>
        </div>
        <div className="bg-dark-blue text-white w-[35vw] flex flex-col justify-evenly py-14 px-8 rounded-[20px]">
          <p className="w-full border-b-2 text-[28px] font-medium">{`Email: ${data.email}`}</p>
          <p className="w-full border-b-2 text-[28px] font-medium">{`Telephone: ${data.phone}`}</p>
        </div>
      </div>

      <div className="mt-24 text-center text-white">
        <button className="bg-green rounded-xl px-12 py-2 text-[32px] font-semibold">
          Add a recipe
        </button>
      </div>
    </>
  );
}
