import { Link } from "react-router-dom";

const DEFAULT_BG =
  "https://cdn.pixabay.com/photo/2023/01/17/19/49/tv-7725366_1280.jpg";

export default function Hero() {
  const isLoggedIn = !!localStorage.getItem("access");

  return (
    <section className="relative h-[60vh] md:h-[70vh] mb-6">
      {/* Background */}
      <img
        src={DEFAULT_BG}
        alt="Cinema background"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl px-6 md:px-10 pt-24">
        <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow">
          🎬<span className="text-brand-sky">Recommendo</span>
        </h1>
        <p className="mt-5 max-w-2xl text-lg md:text-xl text-white/80">
          Discover trending movies, get personalized recommendations, and build
          your own watchlist. All in one place.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            to="/movies"
            className="px-6 py-3 rounded-2xl bg-brand-sky hover:bg-brand-sky-600 text-lg font-semibold"
          >
            Browse Movies
          </Link>

          {/* Only show Join Now button if the user is NOT logged in */}
          {!isLoggedIn && (
            <Link
              to="/register"
              className="px-6 py-3 rounded-2xl bg-white text-black text-lg font-semibold hover:bg-gray-200"
            >
              Join Now
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
