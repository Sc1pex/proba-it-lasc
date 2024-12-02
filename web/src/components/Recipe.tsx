type RecipeProps = {
  name: string;
  vertical?: boolean;
  author: string;
  img_url?: string;
  on_click?: () => void;
};

export function RecipeComponent({
  name,
  vertical,
  author,
  img_url,
  on_click,
}: RecipeProps) {
  const border = vertical
    ? "border-t-green border-t-2"
    : "border-l-green border-l-2";
  const flex = vertical ? "flex-col flex" : "flex";

  const img = img_url || "tmp/pizza.png";

  return (
    <div
      className={flex + " bg-white shadow-[1px_1px_15px_-3px_rgba(0,0,0,0.25)]"}
      onClick={on_click}
    >
      <img src={img} className="w-[14vw] aspect-square object-contain" />

      <div
        className={
          border + " w-[14vw]  px-4 pb-6 pt-8 text-center bg-neutral-100"
        }
      >
        <p className="font-bold">{name}</p>

        <div className="mt-2 flex justify-center gap-1">
          <img src="tmp/star.svg" />
          <img src="tmp/star.svg" />
          <img src="tmp/star.svg" />
          <img src="tmp/star.svg" />
          <img src="tmp/star.svg" />
        </div>

        <p className="mt-2 text-[12px] font-light">Nr ratinguri</p>

        <p className="mt-8 font-light">Autor</p>
        <p className="">{author}</p>
      </div>
    </div>
  );
}
