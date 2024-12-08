import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HomepageNavbar } from "../components/HomepageNavbar";
import {
  get_recipes,
  get_user,
  get_user_rating,
  rate_recipe,
  Recipe,
} from "../lib/server";
import { RecipeComponent } from "../components/Recipe";
import { useEffect, useState } from "react";
import { InteractiveStarRating, StarRating } from "../components/StarRating";
import { useNavigate } from "react-router";
import { Dropdown } from "../components/Dropdown";

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

  const { data: user } = useQuery({
    queryKey: ["get_user"],
    queryFn: get_user,
  });

  const [rating_filter, set_rating_filter] = useState<number[]>([]);
  const toggle_rating = (rating: number) => {
    if (rating_filter.includes(rating)) {
      set_rating_filter((arr) => arr.filter((r) => r != rating));
    } else {
      set_rating_filter([rating, ...rating_filter]);
    }
  };

  const filter_rating = (rating: number) => {
    for (const r of rating_filter) {
      if (r <= rating && rating < r + 2) {
        return true;
      }
    }
    return false;
  };

  const [sort_by, set_sort_by] = useState<"top" | "worst" | "most" | "least">(
    "top",
  );

  let recipes = undefined;
  if (isFetching) {
    recipes = <div>Loading...</div>;
  } else if (data === undefined) {
    recipes = <div>Error fetching</div>;
  } else {
    data.sort((a, b) => {
      if (sort_by === "top") {
        return b.avg_rating - a.avg_rating;
      } else if (sort_by === "worst") {
        return a.avg_rating - b.avg_rating;
      } else if (sort_by == "most") {
        return b.num_ratings - a.num_ratings;
      }
      return a.num_ratings - b.num_ratings;
    });

    recipes = (
      <div className="flex flex-wrap gap-12 justify-center w-[90vw] mx-auto bg-none my-12 bg-transparent">
        {data
          .filter(
            (r) => rating_filter.length === 0 || filter_rating(r.avg_rating),
          )
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
          <Dropdown
            label={
              <div className="shadow-[1px_1px_15px_-3px_rgba(0,0,0,0.25)] px-8 rounded-xl h-12 w-[13vw] text-[22px] flex justify-between items-center bg-white">
                Filter
                <img src="arrow_down.svg" className="w-6" />
              </div>
            }
            dropdown={
              <div className="bg-zinc-200 mt-8 pt-4 w-[13vw] rounded-xl">
                <div className="flex justify-around py-2 mx-2 border-b border-b-gray">
                  <StarRating rating={10} img_cls="h-7" />
                  <input
                    type="checkbox"
                    className="w-5"
                    onChange={() => toggle_rating(10)}
                  />
                </div>
                <div className="flex justify-around py-2 mx-2 border-b border-b-gray">
                  <StarRating rating={8} img_cls="h-7" />
                  <input
                    type="checkbox"
                    className="w-5"
                    onChange={() => toggle_rating(8)}
                  />
                </div>
                <div className="flex justify-around py-2 mx-2 border-b border-b-gray">
                  <StarRating rating={6} img_cls="h-7" />
                  <input
                    type="checkbox"
                    className="w-5"
                    onChange={() => toggle_rating(6)}
                  />
                </div>
                <div className="flex justify-around py-2 mx-2 border-b border-b-gray">
                  <StarRating rating={4} img_cls="h-7" />
                  <input
                    type="checkbox"
                    className="w-5"
                    onChange={() => toggle_rating(4)}
                  />
                </div>
                <div className="flex justify-around pt-2 pb-4 mx-2">
                  <StarRating rating={2} img_cls="h-7" />
                  <input
                    type="checkbox"
                    className="w-5"
                    onChange={() => toggle_rating(2)}
                  />
                </div>
              </div>
            }
          />

          <Dropdown
            label={
              <div className="shadow-[1px_1px_15px_-3px_rgba(0,0,0,0.25)] px-8 rounded-xl h-12 w-[13vw] text-[22px] flex justify-between items-center bg-white">
                Sort
                <img src="arrow_down.svg" className="w-6" />
              </div>
            }
            dropdown={
              <div className="bg-zinc-200 mt-8 pt-4 w-[13vw] rounded-xl flex flex-col font-bold text-xl">
                <button
                  className="flex justify-around py-2 mx-2 border-b border-b-gray text-center"
                  onClick={() => set_sort_by("top")}
                >
                  Top rated
                </button>
                <button
                  className="flex justify-around py-2 mx-2 border-b border-b-gray text-center"
                  onClick={() => set_sort_by("worst")}
                >
                  Worst rated
                </button>
                <button
                  className="flex justify-around py-2 mx-2 border-b border-b-gray text-center"
                  onClick={() => set_sort_by("most")}
                >
                  Most rated
                </button>
                <button
                  className="flex justify-around pt-2 pb-4 mx-2"
                  onClick={() => set_sort_by("least")}
                >
                  Least rated
                </button>
              </div>
            }
          />
        </div>
      </div>

      {recipes}

      {selected_recipe_idx !== undefined && (
        <RecipePopup
          recipe={data[selected_recipe_idx]}
          hide={() => {
            set_selected_recipe_idx(undefined);
          }}
          logged_in={user !== undefined && "name" in user}
        />
      )}
    </>
  );
}

function RecipePopup({
  recipe,
  hide,
  logged_in,
}: {
  recipe: Recipe;
  hide: () => void;
  logged_in: boolean;
}) {
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

  const navigate = useNavigate();

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
            {logged_in ? (
              <button
                className="bg-green text-white px-6 py-1 rounded-full mt-4"
                onClick={() => submit_rating({ recipe_id: recipe.id, rating })}
              >
                Submit
              </button>
            ) : (
              <button
                className="bg-green text-white px-6 py-1 rounded-full mt-4"
                onClick={() => navigate("/register")}
              >
                Register to rate
              </button>
            )}
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
