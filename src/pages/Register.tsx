import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { registerThunk } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const status = useAppSelector((s) => s.auth.status);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.password2) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      const res = await dispatch(registerThunk(form));
      if ((res as any).meta.requestStatus === "fulfilled") {
        toast.success("Account created successfully!");
        navigate("/login");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="p-4">
        <Link
          to="/"
          className="text-2xl font-bold text-brand-sky hover:text-brand-sky-600"
        >
          🎬 Recommendo
        </Link>
      </header>

      {/* Centered register form */}
      <main className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md bg-brand-card rounded-2xl shadow-soft p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

          <form onSubmit={submit} className="space-y-4">
            <input
              className="w-full bg-black/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-sky"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <input
              className="w-full bg-black/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-sky"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="w-full bg-black/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-sky"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <input
              className="w-full bg-black/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-sky"
              type="password"
              placeholder="Confirm Password"
              value={form.password2}
              onChange={(e) => setForm({ ...form, password2: e.target.value })}
            />

            <button
              disabled={status === "loading"}
              className="w-full px-4 py-2 rounded-xl bg-brand-sky hover:bg-brand-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Registering…" : "Register"}
            </button>
          </form>

          <p className="text-sm mt-4 text-center text-white/70">
            Already have an account?{" "}
            <Link className="text-brand-sky hover:underline" to="/login">
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
