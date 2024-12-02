import { useQuery } from "@tanstack/react-query";
import { HomepageNavbar } from "../components/HomepageNavbar";
import { get_recipes } from "../lib/server";
import { Recipe } from "../components/Recipe";
import { useRef, useState } from "react";

export function Recipes() {
  const { data, isFetching } = useQuery({
    queryFn: get_recipes,
    queryKey: ["get_recipes"],
  });

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
          .map((r) => (
            <div key={r.id} className="bg-transparent">
              <Recipe author={r.author} vertical={true} name={r.name} />
            </div>
          ))}
      </div>
    );
  }

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
    </>
  );
}
