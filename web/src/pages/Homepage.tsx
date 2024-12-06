import { useForm } from "react-hook-form";
import { HomepageNavbar } from "../components/HomepageNavbar";
import { RecipeComponent } from "../components/Recipe";
import { useMutation, useQuery } from "@tanstack/react-query";
import { get_top_recipes, new_contact_form } from "../lib/server";

export function Homepage() {
  return (
    <>
      <HomepageNavbar />

      <div className="h-[85vh] p-2 pl-[37vw] pt-[24vh]">
        <img src="logo-black.svg" className="h-[290px]" />
      </div>

      <div className="bg-dark-blue pb-10 pt-4">
        <p className="text-center text-[44px] font-bold text-white">
          Top rated recipes
        </p>

        <TopRated count={3} />
      </div>

      <ContactForm />

      <div className="relative h-[10vh]">
        <div className="absolute inset-0 -z-10">
          <img src="wave.svg" className="min-h-full w-full object-cover" />
        </div>

        <div className="clas z-10 flex h-[10vh] items-center justify-center gap-12 py-8">
          <img className="ml-10 h-[4vh]" src="instagram.svg" />
          <img className="h-[4vh]" src="facebook.svg" />
          <img className="h-[4vh]" src="youtube.svg" />
          <img className="h-[4vh]" src="twitch.svg" />
        </div>
      </div>
    </>
  );
}

function TopRated({ count }: { count: number }) {
  const { data, isFetching } = useQuery({
    queryKey: ["get_recipes", count],
    queryFn: () => get_top_recipes(count),
  });

  if (isFetching) {
    return <div>Loading...</div>;
  } else if (data === undefined) {
    return <div>Error fetching</div>;
  } else {
    return (
      <div className="mt-12 flex justify-around">
        {data.map((r, i) => (
          <div key={i} className="bg-transparent">
            <RecipeComponent
              author={r.author}
              name={r.name}
              img_url={r.image_url}
              rating={r.avg_rating}
              num_ratings={r.num_ratings}
            />
          </div>
        ))}
      </div>
    );
  }
}

export type ContactFormData = {
  first_name: string;
  last_name: string;
  email: string;
  message: string;
};

function ContactForm() {
  const { register, handleSubmit, reset } = useForm<ContactFormData>();

  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });
  const { mutate } = useMutation({
    mutationFn: new_contact_form,
    onSuccess: () => {
      reset();
    },
  });

  return (
    <form
      className="grid grid-cols-5 gap-x-28 px-[15vw] py-8"
      onSubmit={onSubmit}
    >
      <h1 className="text-green col-span-5 mb-10 text-[44px] font-bold">
        Contact us
      </h1>
      <div className="col-span-2">
        <input
          className="border-green placeholder-green block w-full border-2 p-2 text-[20px] focus:outline-none"
          placeholder="First Name"
          {...register("first_name", { required: true })}
        />
        <input
          className="border-green placeholder-green mt-8 block w-full border-2 p-2 text-[20px] focus:outline-none"
          placeholder="Last Name"
          {...register("last_name", { required: true })}
        />
        <input
          className="border-green placeholder-green mt-8 block w-full border-2 p-2 text-[20px] focus:outline-none"
          placeholder="Email"
          {...register("email", { required: true })}
        />
      </div>

      <textarea
        className="border-green placeholder-green col-span-3 border-2 p-2 text-[20px] resize-none focus:outline-none"
        placeholder="Message"
        {...register("message", { required: true })}
      ></textarea>

      <button className="bg-green col-start-5 mt-4 rounded-[15px] py-2 text-[20px] font-semibold text-white">
        Submit
      </button>
    </form>
  );
}
