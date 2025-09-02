import { Link } from "react-router-dom";
import type { Movie } from "../utils/types";

export default function PosterCard({ m }: { m: Movie }) {
  return (
    <Link
      to={`/movie/${m.id}`}
      className="group relative block w-40 sm:w-44 md:w-44 lg:w-44 transition-transform"
    >
      <img
        src={m.poster_url || m.backdrop_url}
        alt={m.title}
        className="w-full h-auto rounded-2xl shadow-lg object-cover"
        loading="lazy"
      />
      {/* Overlay */}
      <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/50 transition-opacity duration-300" />

      {/* Info on hover */}
      <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm md:text-base font-semibold truncate">{m.title}</h3>
          {m.year && <span className="text-xs text-white/70">{m.year}</span>}
          {m.genres?.length ? (
            <span className="text-xs text-white/70 truncate">{m.genres.map(g => g.name).join(", ")}</span>
          ) : null}
          {m.avg_rating ? (
            <span className="inline-block w-fit mt-1 px-2 py-0.5 text-xs font-medium rounded-lg bg-brand-sky/50">
              ★ {m.avg_rating.toFixed(1)}
            </span>
          ) : null}
        </div>
      </div>

      {/* Shadow effect */}
      <div className="absolute inset-0 rounded-2xl shadow-inner pointer-events-none"></div>
    </Link>
  );
}
