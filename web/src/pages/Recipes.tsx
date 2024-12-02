import { useQuery } from "@tanstack/react-query";
import { HomepageNavbar } from "../components/HomepageNavbar";
import { get_recipes, Recipe } from "../lib/server";
import { RecipeComponent } from "../components/Recipe";
import { useEffect, useState } from "react";

export function Recipes() {
  const { data, isFetching } = useQuery({
    queryFn: get_recipes,
    queryKey: ["get_recipes"],
  });

  const [selected_recipe, set_selected_recipe] = useState<undefined | Recipe>(
    undefined,
  );

  const [search_filter, set_search_filter] = useState<undefined | string>(
    undefined,
  );
  const handle_search = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.length != 0) {
      set_search_filter(e.currentTarget.value);
    } else {
      set_search_filter(undefined);
    }
  };

  let recipes = undefined;
  if (isFetching) {
    recipes = <div>Loading...</div>;
  } else if (data === undefined) {
    recipes = <div>Error fetching</div>;
  } else {
    recipes = (
      <div className="flex flex-wrap gap-12 justify-center w-[90vw] mx-auto bg-none my-12 bg-transparent">
        {data
          .filter((r) => {
            return search_filter == undefined || r.name.includes(search_filter);
          })
          .map((r, i) => (
            <div key={i} className="bg-transparent">
              <RecipeComponent
                author={r.author}
                vertical={true}
                name={r.name}
                img_url={r.image_url}
                on_click={() => {
                  set_selected_recipe(r);
                }}
              />
            </div>
          ))}
      </div>
    );
  }

  const reciepe_popup = (
    <div
      className="fixed top-0 left-0 w-full h-full bg-opacity-90 bg-neutral-500 flex items-center justify-center"
      onClick={() => {
        set_selected_recipe(undefined);
      }}
    >
      <div
        className="w-[60vw] bg-neutral-50 rounded-xl p-20 relative"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex">
            <img
              src={selected_recipe?.image_url}
              className="w-[14vw] aspect-square object-contain"
            />

            <div className="ml-8 py-4">
              <p className="text-[18px] font-bold">{selected_recipe?.name}</p>

              <div className="mt-4 flex justify-center gap-1">
                <img className="w-5" src="tmp/star.svg" />
                <img className="w-5" src="tmp/star.svg" />
                <img className="w-5" src="tmp/star.svg" />
                <img className="w-5" src="tmp/star.svg" />
                <img className="w-5" src="tmp/star.svg" />
              </div>

              <p className="mt-2 text-[12px] font-light">Nr ratinguri</p>

              <p className="mt-12">Autor:</p>
              <p>{selected_recipe?.author}</p>
            </div>
          </div>
        </div>
        <p className="border-b border-b-green text-green mt-4">Description</p>
        <p>{selected_recipe?.description}</p>

        <img
          src="close.svg"
          className="absolute top-8 right-8 hover:cursor-pointer"
          onClick={() => {
            set_selected_recipe(undefined);
          }}
        />
      </div>
    </div>
  );

  const close_popup = (e: KeyboardEvent) => {
    if (e.key == "Escape") {
      set_selected_recipe(undefined);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", close_popup);
    return () => window.removeEventListener("keydown", close_popup);
  }, []);

  return (
    <>
      <HomepageNavbar />

      <div className="flex flex-col items-center mt-14 text-gray gap-4">
        <div className="border-2 border-gray w-[35vw] text-[28px] px-4 py-1 rounded-xl font-medium flex justify-between">
          <input
            onChange={handle_search}
            placeholder="Search"
            className="focus:outline-none placeholder:text-gray"
          />
          <img src="search.svg" className="w-8" />
        </div>

        <div className="flex justify-around w-[35vw] font-semibold">
          <div className="shadow-[1px_1px_15px_-3px_rgba(0,0,0,0.25)] px-8 rounded-xl h-12 w-[13vw] text-[22px] flex justify-between items-center">
            Filter
            <img src="arrow_down.svg" className="w-6" />
          </div>

          <div className="shadow-[1px_1px_15px_-3px_rgba(0,0,0,0.25)] px-8 rounded-xl h-12 w-[13vw] text-[22px] flex justify-between items-center">
            Sort
            <img src="arrow_down.svg" className="w-6" />
          </div>
        </div>
      </div>

      {recipes}

      {selected_recipe !== undefined && reciepe_popup}
    </>
  );
}
