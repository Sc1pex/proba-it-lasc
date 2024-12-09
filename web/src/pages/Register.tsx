import { useForm } from "react-hook-form";
import { Navbar } from "../components/Navbar";
import { NavLink, useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { register } from "../lib/server";
import { InputField } from "../components/InputField";

type RegisterFormData = {
  name: string;
  phone: string;
  email: string;
  password: string;
  password_confirm: string;
};

export function Register() {
  const {
    register: register_field,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>();
  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });

  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: register,
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
      <Navbar
        right_side={
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
        }
      />
      <div className="mt-[10vh] flex items-start justify-center">
        <form
          className="w-[38vw] rounded-[20px] bg-dark-blue px-24 pb-16 pt-12 text-white"
          onSubmit={onSubmit}
        >
          <p className="font-inter text-balance text-center text-[32px] font-bold leading-10 mb-16">
            Hai, fă foamea cu noi!
          </p>

          <InputField
            icon="person.png"
            placeholder="Full name"
            register_hook={register_field("name", { required: true })}
          />

          <InputField
            icon="phone.svg"
            placeholder="Telephone"
            register_hook={register_field("phone", { required: true })}
          />

          <InputField
            icon="mail.svg"
            placeholder="E-mail"
            register_hook={register_field("email", { required: true })}
            type="email"
            error={errors.email?.message}
          />

          <InputField
            icon="lock.svg"
            placeholder="Password"
            register_hook={register_field("password", { required: true })}
            type="password"
            error={errors.password?.message}
          />

          <InputField
            icon="lock.svg"
            placeholder="Confirm Password"
            register_hook={register_field("password_confirm", {
              required: true,
              validate: (value, form) =>
                value === form.password || "Passwords do not match",
            })}
            type="password"
            error={errors.password_confirm?.message}
          />

          <div className="mt-16 text-center">
            <button className="bg-green rounded-lg px-24 py-2 text-[32px] font-bold">
              Sign up
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
