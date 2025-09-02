import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAppDispatch } from "./app/hooks";
import { useEffect } from "react";
import { meThunk } from "./features/auth/authSlice";

export default function App() {
    const dispatch = useAppDispatch();

  useEffect(() => {
    if (localStorage.getItem("access")) {
      dispatch(meThunk());
    }
  }, [dispatch]);
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />
      <main className="px-4 md:px-8">{/* spacing below nav */}
        <Outlet />
      </main>
    </div>
  );
}
