"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, PenSquare, LayoutDashboard, Home } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../wrapper/store/authStore";

export default function Navbar() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const authenticated = isAuthenticated();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition"
            >
              <PenSquare className="w-8 h-8" />
              <span>BlogHub</span>
            </Link>

            <Link
              href="/"
              className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {authenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>

                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-100 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                    {/* {user?.username.charAt(0).toUpperCase()} */}
                  </div>
                  <span className="text-gray-700 font-medium">
                    {user?.username}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
