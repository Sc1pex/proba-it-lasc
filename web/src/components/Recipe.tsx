type RecipeProps = {
  name: string;
  vertical?: boolean;
  author: string;
};

export function Recipe({ name, vertical, author }: RecipeProps) {
  const border = vertical
    ? "border-t-green border-t-2"
    : "border-l-green border-l-2";

  return (
    <div className={vertical ? "flex-col flex bg-white" : "flex bg-white"}>
      <img src="tmp/pizza.png" className="w-[14vw] object-contain" />

      <div className={border + " w-[14vw]  px-4 pb-6 pt-8 text-center"}>
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
