import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HomepageNavbar } from "../components/HomepageNavbar";
import {
  get_recipes,
  get_user_rating,
  rate_recipe,
  Recipe,
} from "../lib/server";
import { RecipeComponent } from "../components/Recipe";
import { useEffect, useState } from "react";
import { InteractiveStarRating, StarRating } from "../components/StarRating";

export function Recipes() {
  const { data, isFetching } = useQuery({
    queryFn: get_recipes,
    queryKey: ["get_recipes"],
  });

  const [selected_recipe_idx, set_selected_recipe_idx] = useState<
    undefined | number
  >(undefined);

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
    data.sort((a, b) => a.name.localeCompare(b.name));

    recipes = (
      <div className="flex flex-wrap gap-12 justify-center w-[90vw] mx-auto bg-none my-12 bg-transparent">
        {data
          .filter(
            (r) => search_filter == undefined || r.name.includes(search_filter),
          )
          .map((r, i) => (
            <div key={i} className="bg-transparent">
              <RecipeComponent
                author={r.author}
                vertical={true}
                name={r.name}
                img_url={r.image_url}
                rating={r.avg_rating}
                num_ratings={r.num_ratings}
                on_click={() => {
                  set_selected_recipe_idx(i);
                }}
              />
            </div>
          ))}
      </div>
    );
  }

  const close_popup = (e: KeyboardEvent) => {
    if (e.key == "Escape") {
      set_selected_recipe_idx(undefined);
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

      {selected_recipe_idx !== undefined && (
        <RecipePopup
          recipe={data[selected_recipe_idx]}
          hide={() => {
            set_selected_recipe_idx(undefined);
          }}
        />
      )}
    </>
  );
}

function RecipePopup({ recipe, hide }: { recipe: Recipe; hide: () => void }) {
  const [rating, set_rating] = useState(0);

  const { data } = useQuery({
    queryKey: ["get_user_rating", recipe.id],
    queryFn: () => get_user_rating(recipe.id),
  });
  useEffect(() => {
    set_rating(Number(data));
  }, [data]);

  const queryClient = useQueryClient();
  const { mutate: submit_rating } = useMutation({
    mutationFn: rate_recipe,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get_user_rating", recipe.id],
      });
      queryClient.invalidateQueries({ queryKey: ["get_recipes"] });
    },
  });

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-opacity-90 bg-neutral-500 flex items-center justify-center"
      onClick={hide}
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
              src={recipe.image_url}
              className="w-[14vw] aspect-square object-contain"
            />

            <div className="ml-8 py-4">
              <p className="text-[18px] font-bold">{recipe.name}</p>

              <StarRating rating={recipe.avg_rating} img_cls="w-5" />

              <p className="mt-2 text-[12px] font-light">
                {recipe.num_ratings} ratinguri
              </p>

              <p className="mt-12">Autor:</p>
              <p>{recipe.author}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <p>Rate this recipe</p>
            <InteractiveStarRating rating={rating} set_rating={set_rating} />
            <button
              className="bg-green text-white px-6 py-1 rounded-full mt-4"
              onClick={() => submit_rating({ recipe_id: recipe.id, rating })}
            >
              Submit
            </button>
          </div>
        </div>
        <p className="border-b border-b-green text-green mt-4">Description</p>
        <p>{recipe.description}</p>

        <img
          src="close.svg"
          className="absolute top-8 right-8 hover:cursor-pointer"
          onClick={hide}
        />
      </div>
    </div>
  );
}
