# Recommendo Frontend

A modern React frontend for a movie recommendation system, similar to Netflix, featuring personalized recommendations, movie details, ratings, and search functionality.

## Table of Contents
- [Demo](#demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Folder Structure](#folder-structure)
- [Routing](#routing)
- [Components](#components)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Notes](#notes)

## Demo
A live demo link or screenshots can be added here.

## Features
- Browse movies with filters (genre, year) and pagination
- Search movies by title
- View movie details, similar movies, and personalized recommendations
- Rate and review movies (requires login)
- User authentication (JWT)
- Profile page for users
- Dark theme with modern UI/UX inspired by Netflix
- Route-level prefetching and caching for faster load times
- SEO optimization with dynamic page titles and meta descriptions using `react-helmet-async`

## Tech Stack
- React.js
- Redux Toolkit & Thunk for state management
- React Router v6 for routing
- Tailwind CSS for styling
- Axios for API requests
- `react-helmet-async` for SEO
- Optional: Framer Motion for animations

## Installation
1. Clone the repository:
```bash
  git clone https://github.com/YoussefMo-22/movies-app.git
  cd movies-app
```

## Installation

### Install dependencies:

```bash
npm install
```
### Environment Variables
```bash
Create a .env file in the root directory and add the following:
REACT_APP_API_BASE_URL=http://localhost:8000
```
### Running the App
Start the development server:
```bash
npm start
The app will be available at http://localhost:3000.
```
### Folder Structure
```bash
src/
├── api/               # API calls
├── app/               # Redux store setup
├── components/        # Reusable UI components
├── features/          # Redux slices
├── pages/             # Page components (Home, MovieDetails, ForYou, etc.)
├── routes/            # App routes configuration
├── assets/            # Images, icons, etc.
├── App.js             # Root component
└── index.js           # Entry point
```
### Routing
The app uses react-router-dom with nested routing:
```bash
/ → Home page

/search → Search page

/movies → Movies page

/movie/:id → Movie details (protected route)

/foryou → Personalized recommendations (protected route)

/profile → User profile (protected route)

/login → Login page

/register → Register page
```
### Components
```bash
MovieCard / PosterCard → Display movies in a grid

RowCarousel → Horizontal scrolling carousels for similar/recommended movies

Spinner → Loading indicator

ProtectedRoute → Protects pages that require authentication

StarRating → Interactive rating system
```
### State Management
Redux Toolkit handles global state:
```bash
authSlice → User authentication

moviesSlice → Movie data (trending, details, search, hybrid recommendations)

ratingsSlice → User ratings

recsSlice → Personalized recommendations
```
### API Integration
```bash
Axios is used to interact with the Django backend.
```
### Endpoints:
```bash
auth/register/, auth/login/, auth/me/

movies/, movies/:id/, movies/by-genre/:genre/

ratings/movie/:movie_id/

recommendations/, recommendations/movie/:movie_id/

recommend_movies/:user_id/, recommend_similar_movies/:movie_id/
```