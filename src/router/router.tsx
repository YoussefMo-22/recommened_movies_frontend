import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ProtectedRoute from "../components/ProtectedRoute";
import { Suspense, lazy } from "react";
import Spinner from "../components/Spinner";

const Home = lazy(() => import("../pages/Home"));
const Search = lazy(() => import("../pages/Search"));
const MoviesPage = lazy(() => import("../pages/MoviesPage"));
const MovieDetails = lazy(() => import("../pages/MovieDetails"));
const ForYou = lazy(() => import("../pages/ForYou"));
const Profile = lazy(() => import("../pages/Profile"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Suspense fallback={<Spinner/>}><Home /></Suspense> },
      { path: "search", element: <Suspense fallback={<Spinner/>}><Search /></Suspense> },
      { path: "movies", element: <Suspense fallback={<Spinner/>}><MoviesPage /></Suspense> },
      { path: "movie/:id", element: <ProtectedRoute><Suspense fallback={<Spinner/>}><MovieDetails /></Suspense></ProtectedRoute> },
      { path: "foryou", element: <ProtectedRoute><Suspense fallback={<Spinner/>}><ForYou /></Suspense></ProtectedRoute> },
      { path: "profile", element: <ProtectedRoute><Suspense fallback={<Spinner/>}><Profile /></Suspense></ProtectedRoute> },
    ],
  },
  { path: "/login", element: <Suspense fallback={<Spinner/>}><Login /></Suspense> },
  { path: "/register", element: <Suspense fallback={<Spinner/>}><Register /></Suspense> },
]);
