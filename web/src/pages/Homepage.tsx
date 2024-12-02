import { HomepageNavbar } from "../components/HomepageNavbar";
import { RecipeComponent } from "../components/Recipe";

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

        <div className="mt-12 flex justify-around">
          <RecipeComponent author="Popescu" name="Reteta 1" />
          <RecipeComponent author="Popescu" name="Reteta 2" />
          <RecipeComponent author="Popescu" name="Reteta 3" />
        </div>
      </div>

      <form className="grid grid-cols-5 gap-x-28 px-[15vw] py-8">
        <h1 className="text-green col-span-5 mb-10 text-[44px] font-bold">
          Contact us
        </h1>
        <div className="col-span-2">
          <input
            className="border-green placeholder-green block w-full border-2 p-2 text-[20px]"
            placeholder="First Name"
          />
          <input
            className="border-green placeholder-green mt-8 block w-full border-2 p-2 text-[20px]"
            placeholder="Last Name"
          />
          <input
            className="border-green placeholder-green mt-8 block w-full border-2 p-2 text-[20px]"
            placeholder="Email"
          />
        </div>

        <textarea
          className="border-green placeholder-green col-span-3 border-2 p-2 text-[20px] resize-none"
          placeholder="Message"
        ></textarea>

        <button className="bg-green col-start-5 mt-4 rounded-[15px] py-2 text-[20px] font-semibold text-white">
          Submit
        </button>
      </form>

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
