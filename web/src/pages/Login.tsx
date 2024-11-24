import { useMutation } from "@tanstack/react-query";
import { login } from "../lib/server";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { useForm } from "react-hook-form";
import { InputField } from "../components/InputField";

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
          <p className="font-inter text-balance text-center text-[32px] font-bold leading-10 mb-16">
            Loghează-te, <br /> chiorăie mațele!
          </p>

          <InputField
            icon="mail.svg"
            placeholder="E-mail"
            register_hook={register("email", { required: true })}
            type="email"
            error={errors.email?.message}
          />

          <InputField
            icon="lock.svg"
            placeholder="Password"
            register_hook={register("password", { required: true })}
            type="password"
            error={errors.password?.message}
          />

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
