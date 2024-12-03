import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function StarRating({
  rating,
  img_cls,
}: {
  rating: number;
  img_cls?: string;
}) {
  const { fill, half, empty } = rating_stars(rating);

  return (
    <div className="flex justify-center gap-1">
      {fill !== 0 &&
        Array.from({ length: fill }, (_, i) => (
          <img className={img_cls} key={i} src="full_star.svg" />
        ))}

      {half !== 0 && <img className={img_cls} src="half_star.svg" />}

      {empty !== 0 &&
        Array.from({ length: empty }, (_, i) => (
          <img className={img_cls} key={i} src="empty_star.svg" />
        ))}
    </div>
  );
}

export function InteractiveStarRating({
  rating,
  set_rating,
}: {
  rating: number;
  set_rating: Dispatch<SetStateAction<number>>;
}) {
  const [stars, set_stars] = useState(rating_stars(rating));
  const [changing, set_chaging] = useState(true);

  useEffect(() => {
    set_stars(rating_stars(rating));
  }, [rating]);

  return (
    <div
      className="flex justify-center gap-1"
      onMouseMove={(e) => {
        if (!changing) {
          return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const elWidth = rect.width;
        const cursorX = e.clientX - rect.left;
        const percent = (cursorX / elWidth) * 100;

        if (percent < 5) {
          set_rating(0);
        } else {
          set_rating(Math.ceil(percent / 10));
        }
      }}
      onClick={() => {
        set_chaging((c) => !c);
      }}
    >
      {stars.fill !== 0 &&
        Array.from({ length: stars.fill }, (_, i) => (
          <img key={i} src="full_star.svg" />
        ))}

      {stars.half !== 0 && <img src="half_star.svg" />}

      {stars.empty !== 0 &&
        Array.from({ length: stars.empty }, (_, i) => (
          <img key={i} src="empty_star.svg" />
        ))}
    </div>
  );
}

function rating_stars(rating: number) {
  const fill = Math.floor(rating / 2);
  const half = rating % 2;
  return {
    fill,
    half,
    empty: 5 - fill - half,
  };
}
