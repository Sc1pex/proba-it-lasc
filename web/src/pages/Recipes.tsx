import { useQuery } from "@tanstack/react-query";
import { HomepageNavbar } from "../components/HomepageNavbar";
import { get_recipes } from "../lib/server";
import { Recipe } from "../components/Recipe";

export function Recipes() {
  const { data, isFetching } = useQuery({
    queryFn: get_recipes,
    queryKey: ["get_recipes"],
  });

  let recipes = undefined;
  if (isFetching) {
    recipes = <div>Loading...</div>;
  } else if (data === undefined) {
    recipes = <div>Error fetching</div>;
  } else {
    console.log(data);

    recipes = (
      <div className="grid grid-cols-5">
        {data.map((r) => (
          <div key={r.id}>
            <Recipe name={r.name} />
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
          Search
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
