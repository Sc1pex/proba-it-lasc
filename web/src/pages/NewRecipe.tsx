import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { new_recipe } from "../lib/server";
import { HomepageNavbar } from "../components/HomepageNavbar";

type NewRecipeFormData = {
  name: string;
  description: string;
  image: FileList;
};

export function NewRecipe() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewRecipeFormData>();
  const onSubmit = handleSubmit(
    (data) => {
      console.log(data);
      mutate({
        ...data,
        image: data.image[0],
      });
    },
    (data) => {
      console.error(data);
    },
  );

  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: new_recipe,
    onSuccess: (ok) => {
      if (ok) {
        navigate("/");
      } else {
        console.error("skill issue");
      }
    },
  });

  return (
    <>
      <HomepageNavbar />
      <div className="mt-[10vh] flex items-center justify-center">
        <form
          className="w-[38vw] rounded-[20px] bg-dark-blue px-24 pb-[6rem] pt-12 text-white"
          onSubmit={onSubmit}
        >
          <div className="mt-8 flex border-b px-2 pb-3 text-[26px] font-semibold">
            <input
              className="bg-dark-blue placeholder-white focus:outline-none"
              placeholder="Recipe name:"
              {...register("name", { required: true })}
            />
            {errors.name?.message && (
              <span className="text-sm text-red-600">
                {errors.name?.message}
              </span>
            )}
          </div>

          <div className="mt-8 flex border-b px-2 pb-3 text-[26px] font-semibold">
            <input
              className="bg-dark-blue placeholder-white focus:outline-none"
              placeholder="Description:"
              {...register("description", { required: true })}
            />
            {errors.description?.message && (
              <span className="text-sm text-red-600">
                {errors.description?.message}
              </span>
            )}
          </div>

          <div className="mt-16">
            <label
              htmlFor="image"
              className="cursor-pointer px-2 py-1 text-[24px] justify-center border-white border flex outline-none rounded-xl w-max mx-auto gap-1"
            >
              <img src="clip.svg" />
              Upload photo
              <input
                id="image"
                type="file"
                className="hidden"
                {...register("image", { required: true })}
              />
            </label>
            {errors.image?.message && (
              <span className="text-sm text-red-600">
                {errors.image?.message as string}
              </span>
            )}
          </div>

          <div className="mt-16 text-center">
            <button className="bg-green rounded-lg px-12 py-2 text-[32px] font-bold">
              Add recipe
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
