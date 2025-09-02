import { Link } from "react-router-dom";
import type { Movie } from "../utils/types";
import PosterCard from "./PosterCard";
import { useRef, useState, useEffect } from "react";

export default function HomeRowCarousel({ title, items, genre }: { title: string; items: Movie[]; genre?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth < 640) setVisibleCount(2);
      else if (window.innerWidth < 1024) setVisibleCount(4);
      else setVisibleCount(8);
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

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <Link to={genre ? `/movies?genre=${encodeURIComponent(genre)}` : "/movies"}>
          <h2 className="text-xl font-bold hover:underline">{title}</h2>
        </Link>
        {items.length > visibleCount && (
          <div className="hidden md:flex gap-2">
            <button onClick={() => scrollByPage("left")} className="px-3 py-1 rounded-xl text-brand-sky bg-brand-card hover:bg-brand-card/70">{'<'}</button>
            <button onClick={() => scrollByPage("right")} className="px-3 py-1 rounded-xl text-brand-sky bg-brand-card hover:bg-brand-card/70">{'>'}</button>
          </div>
        )}
      </div>
      <div ref={ref} className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
        {items.map(m => (
          <div
            key={m.id}
            className="flex-shrink-0 snap-start"
            style={{ width: `calc((100% - ${(visibleCount - 1) * 16}px)/${visibleCount})` }}
          >
            <PosterCard m={m} />
          </div>
        ))}
      </div>
    </section>
  );
}
