import { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const authed = useAppSelector(s => s.auth.isAuthed);
  return authed ? children : <Navigate to="/login" replace />;
}
