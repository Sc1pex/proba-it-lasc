export function Recipe({ name }: { name: string }) {
  return (
    <div className="flex bg-white">
      <img src="tmp/pizza.png" className="w-[14vw] object-contain" />

      <div className="border-l-green w-[14vw] border-l-2 px-4 pb-6 pt-8 text-center">
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
        <p className="">Prenume Nume</p>
      </div>
    </div>

  )
}
