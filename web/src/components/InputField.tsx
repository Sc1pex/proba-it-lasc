import { HTMLInputTypeAttribute } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type InputFieldProps = {
  icon: string;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
  error?: string;
  register_hook: UseFormRegisterReturn;
};

export function InputField({
  icon,
  placeholder,
  type,
  error,
  register_hook,
}: InputFieldProps) {
  return (
    <>
      <div className="mt-8 flex border-b px-2 pb-3">
        <img src={icon} className="mr-3 w-[30px]" />
        <input
          type={type}
          className="bg-dark-blue placeholder-white focus:outline-none"
          placeholder={placeholder}
          {...register_hook}
        />
      </div>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </>
  );
}
