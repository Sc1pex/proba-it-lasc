import { useMutation } from "@tanstack/react-query";
import { login } from "../lib/server";

export function Login() {
  const { mutate } = useMutation({ mutationFn: login });

  return (
    <div className="mt-[10vh] flex items-start justify-center">
      <form className="w-[38vw] rounded-[20px] bg-dark-blue px-24 pb-[6rem] pt-12 text-white">
        <p className="font-inter text-balance text-center text-[32px] font-bold leading-10">
          Loghează-te, <br /> chiorăie mațele!
        </p>

        <div className="mt-16 flex border-b px-2 pb-3">
          <img src="mail.svg" className="mr-3 w-[30px]" />
          <input
            type="email"
            className="bg-dark-blue placeholder-white focus:outline-none"
            placeholder="E-mail"
          />
        </div>

        <div className="mt-12 flex border-b px-2 pb-3">
          <img src="lock.svg" className="mr-3 w-[30px]" />
          <input
            type="password"
            className="bg-dark-blue placeholder-white focus:outline-none"
            placeholder="Password"
          />
        </div>

        <div className="mt-16 text-center">
          <button
            className="bg-green rounded-lg px-24 py-2 text-[32px] font-bold"
            onClick={(e) => {
              mutate({ email: "adsds", password: "ads123asd" });
              e.preventDefault();
            }}
          >
            Log in
          </button>
        </div>
        <div className="mt-8 text-center">
          <div className="text-[16px] font-bold underline">Forgot password</div>
        </div>
      </form>
    </div>
  );
}
