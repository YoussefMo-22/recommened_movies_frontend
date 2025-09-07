import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { loginThunk } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.auth.status);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await dispatch(loginThunk(form));

      if ((res as any).meta.requestStatus === "fulfilled") {
        toast.success("Logged in successfully!");
        navigate("/");
      } else {
        const errors = (res as any).payload;
        if (errors) {
          Object.values(errors).forEach((errArray: any) => {
            if (Array.isArray(errArray)) {
              errArray.forEach((msg) => toast.error(msg));
            } else {
              toast.error(errArray);
            }
          });
        } else {
          toast.error("Login failed. Please check your credentials.");
        }
      }
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="p-4">
        <Link to="/" className="text-2xl font-bold text-brand-sky hover:text-brand-sky-600">
          🎬 Recommendo
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md bg-brand-card rounded-2xl shadow-soft p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

          <form onSubmit={submit} className="space-y-4">
            <input
              className="w-full bg-black/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-sky"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <input
              className="w-full bg-black/30 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-sky"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              disabled={status === "loading"}
              className="w-full px-4 py-2 rounded-xl bg-brand-sky hover:bg-brand-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="text-sm mt-4 text-center text-white/70">
            No account?{" "}
            <Link className="text-brand-sky hover:underline" to="/register">
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
