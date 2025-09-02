import { useAppSelector } from "../app/hooks";

export default function Profile() {
  // Example: getting user data from Redux auth slice
  const user = useAppSelector((s) => s.auth.user);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-sky-400">Your Profile</h1>
      <div className="bg-gray-900 shadow-lg rounded-2xl p-6 mb-6 border border-gray-700">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-sky-500 flex items-center justify-center text-white text-2xl font-bold">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{user?.username || "Guest User"}</h2>
            <p className="text-gray-400">{user?.email || "No email available"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
