"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, PenSquare, LayoutDashboard, Home } from "lucide-react";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useAuthStore } from "../../wrapper/store/authStore";
import { ThemeToggleButton } from "./ui/shadcn-io/theme-toggle-button";

export default function Navbar() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const authenticated = isAuthenticated();

  // Theme management
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = useCallback(() => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  }, [theme, setTheme]);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <nav className="dark:bg-black bg-white shadow-lg sticky top-0 z-50">
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
              className="flex items-center space-x-1 dark:text-white text-gray-700 hover:text-blue-600 transition"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            {mounted && (
              <ThemeToggleButton
                theme={theme === "dark" ? "dark" : "light"}
                onClick={handleThemeToggle}
                variant="polygon"
              />
            )}

            {authenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg dark:text-white text-gray-700 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-600 transition"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  href="/profile"
                  className="flex items-center space-x-3 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold overflow-hidden">
                    {user?.profileImage ? (
                      <img
                        src={`http://localhost:8080${user.profileImage}`}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="dark:text-white text-gray-700 font-medium">
                    {user?.username}
                  </span>
                </Link>

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
                  className="px-4 py-2 dark:text-white text-gray-700 hover:text-blue-600 transition font-medium"
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
