import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const [q, setQ] = useState("");
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthed } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?query=${encodeURIComponent(q.trim())}`);
  };

  const genres = [
    "Action", "Adventure", "Animation", "Children", "Comedy",
    "Crime", "Documentary", "Drama", "Fantasy", "Film-Noir",
    "Horror", "Musical", "Mystery", "Romance", "Sci-Fi",
    "Thriller", "War", "Western",
  ];

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-black/70 to-transparent backdrop-blur-md">
      <div className="flex items-center gap-6 py-3 px-4 md:px-8">
        {/* Brand */}
        <Link to="/" className="text-2xl font-extrabold tracking-tight">
          <span className="text-brand-sky">🎬 Recommendo</span>
        </Link>

        {/* Navigation links */}
        <nav className="flex items-center gap-4">
          <Link to="/movies" className="hover:underline">
            Movies
          </Link>

          {/* Dropdown for genres */}
          <div className="relative group">
            <button className="hover:underline">Genres ▾</button>
            <div className="absolute hidden group-hover:grid grid-cols-2 gap-1 bg-brand-card rounded-lg mt-0 shadow-lg p-2 min-w-[220px]">
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => navigate(`/movies?genre=${encodeURIComponent(g)}`)}
                  className="text-left px-3 py-2 rounded-md hover:bg-brand-card/70 transition"
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Search form */}
        <form
          onSubmit={onSubmit}
          className="ml-auto hidden md:flex border rounded-xl overflow-hidden"
        >
          <input
            className="bg-brand-card/60 px-4 py-2 focus:outline-none"
            placeholder="Search movies..."
            defaultValue={params.get("query") ?? ""}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="px-4 py-2 bg-brand-sky hover:bg-brand-sky-600 transition">
            Search
          </button>
        </form>

        {/* Auth links */}
        <div className="ml-2">
          {isAuthed ? (
            <div className="flex items-center gap-3">
              <Link to="/foryou" className="hover:underline">
                For You
              </Link>
              <Link to="/profile" className="hover:underline">
                Profile
              </Link>
              <button
                onClick={() => dispatch(logout())}
                className="px-3 py-1 rounded-xl bg-brand-card hover:bg-brand-card/70"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1 rounded-xl bg-brand-sky hover:bg-brand-sky-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 rounded-xl bg-brand-card hover:bg-brand-card/70"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
