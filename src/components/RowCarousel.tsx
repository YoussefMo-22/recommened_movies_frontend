import type { Movie } from "../utils/types";
import PosterCard from "./PosterCard";
import { useRef, useState, useEffect } from "react";

export default function RowCarousel({ title, items }: { title: string; items: Movie[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(5); // default 5 per page

  // Adjust visible items based on screen width
  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth < 640) setVisibleCount(2);
      else if (window.innerWidth < 1024) setVisibleCount(3);
      else setVisibleCount(5);
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  const scrollByPage = (dir: "left" | "right") => {
    if (!ref.current) return;
    const cardWidth = (ref.current.firstChild as HTMLElement | null)?.clientWidth || 0;
    const gap = 16;
    const scrollAmount = (cardWidth + gap) * visibleCount;
    ref.current.scrollBy({ left: dir === "right" ? scrollAmount : -scrollAmount, behavior: "smooth" });
  };

  if (!items?.length) return null;

  const showArrows = items.length > visibleCount;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold">{title}</h2>
        {showArrows && (
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scrollByPage("left")}
              className="px-3 py-1 rounded-xl bg-brand-card text-brand-sky hover:bg-brand-card/70"
            >
              {"<"}
            </button>
            <button
              onClick={() => scrollByPage("right")}
              className="px-3 py-1 rounded-xl bg-brand-card text-brand-sky hover:bg-brand-card/70"
            >
              {">"}
            </button>
          </div>
        )}
      </div>
      <div
        ref={ref}
        className="flex gap-4 overflow-y-hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {items.map((m) => (
          <div
            key={m.id}
            className="flex-shrink-0 snap-start flex flex-col items-center"
            style={{ width: `calc((100% - ${(visibleCount - 1) * 16}px)/${visibleCount})` }} // 16px gap
          >
            <PosterCard m={m} />
          </div>
        ))}
      </div>
    </section>
  );
}
