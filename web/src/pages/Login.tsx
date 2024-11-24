import { useMutation } from "@tanstack/react-query";
import { login } from "../lib/server";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { useForm } from "react-hook-form";

type LoginFormData = {
  email: string;
  password: string;
};

export function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>();
  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });

  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: login,
    onSuccess: (errors) => {
      console.log(errors);

      if (errors === undefined) {
        navigate("/");
      } else {
        if (errors.email !== undefined) {
          setError("email", {
            message: errors.email,
          });
        }

        if (errors.password !== undefined) {
          setError("password", {
            message: errors.password,
          });
        }
      }
    },
  });

  return (
    <>
      <Navbar />
      <div className="mt-[10vh] flex items-start justify-center">
        <form
          className="w-[38vw] rounded-[20px] bg-dark-blue px-24 pb-[6rem] pt-12 text-white"
          onSubmit={onSubmit}
        >
          <p className="font-inter text-balance text-center text-[32px] font-bold leading-10">
            Loghează-te, <br /> chiorăie mațele!
          </p>

          <div className="mt-16 flex border-b px-2 pb-3">
            <img src="mail.svg" className="mr-3 w-[30px]" />
            <input
              type="email"
              className="bg-dark-blue placeholder-white focus:outline-none"
              placeholder="E-mail"
              {...register("email", { required: true })}
            />
          </div>
          {errors.email && (
            <span className="text-sm text-red-600">{errors.email.message}</span>
          )}

          <div className="mt-12 flex border-b px-2 pb-3">
            <img src="lock.svg" className="mr-3 w-[30px]" />
            <input
              type="password"
              className="bg-dark-blue placeholder-white focus:outline-none"
              placeholder="Password"
              {...register("password", { required: true })}
            />
          </div>
          {errors.password && (
            <span className="text-sm text-red-600">
              {errors.password.message}
            </span>
          )}

          <div className="mt-16 text-center">
            <button className="bg-green rounded-lg px-24 py-2 text-[32px] font-bold">
              Log in
            </button>
          </div>
          <div className="mt-8 text-center">
            <div className="text-[16px] font-bold underline">
              Forgot password
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
