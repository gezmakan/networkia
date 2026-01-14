"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";

type Theme = "light" | "dark";

type AppNavbarProps = {
  theme: Theme;
  active: "dashboard" | "contacts";
  isSearchOpen: boolean;
  searchValue: string;
  setIsSearchOpen: (open: boolean) => void;
  setSearchValue: (value: string) => void;
  onToggleTheme: () => void;
  session: Session | null;
};

export function AppNavbar({
  theme,
  active,
  isSearchOpen,
  searchValue,
  setIsSearchOpen,
  setSearchValue,
  onToggleTheme,
  session,
}: AppNavbarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  return (
    <nav
      className={`sticky top-0 z-20 w-full border-b ${
        theme === "light"
          ? "bg-white/90 border-gray-200 shadow-sm"
          : "bg-gray-900/90 border-gray-800 shadow-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-3 py-3 pl-2 pr-4 md:pl-4 md:pr-6">
        <Link
          href="/"
          className={`text-2xl font-bold tracking-tight ${
            theme === "light" ? "text-gray-900" : "text-gray-100"
          }`}
        >
          Networkia
        </Link>
        <div className="hidden md:flex flex-1 items-center justify-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className={`transition-colors ${
              active === "dashboard"
                ? theme === "light"
                  ? "text-gray-900"
                  : "text-gray-100"
                : theme === "light"
                ? "text-gray-600 hover:text-blue-600"
                : "text-gray-300 hover:text-cyan-400"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/contacts"
            className={`transition-colors ${
              active === "contacts"
                ? theme === "light"
                  ? "text-gray-900"
                  : "text-gray-100"
                : theme === "light"
                ? "text-gray-600 hover:text-blue-600"
                : "text-gray-300 hover:text-cyan-400"
            }`}
          >
            Contacts
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {isSearchOpen ? (
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              onBlur={() => {
                if (!searchValue) {
                  setIsSearchOpen(false);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setIsSearchOpen(false);
                  setSearchValue("");
                }
              }}
              className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                theme === "light"
                  ? "border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500"
                  : "border-gray-600 bg-gray-800 text-gray-100 placeholder-gray-400 focus:border-cyan-500"
              } focus:outline-none`}
            />
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`px-3 py-2 rounded-lg transition-all duration-200 text-lg ${
                theme === "light"
                  ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  : "bg-gray-800 hover:bg-gray-700 text-gray-200"
              }`}
              aria-label="Open search"
            >
              🔍
            </button>
          )}
          <button
            onClick={onToggleTheme}
            className={`px-4 py-2 rounded-lg transition-all duration-200 text-xl ${
              theme === "light"
                ? "bg-gray-100 hover:bg-gray-200 hover:scale-105"
                : "bg-gray-800 hover:bg-gray-700 hover:scale-105"
            }`}
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          {!session && (
            <button
              onClick={() => signIn("google")}
              className={`hidden sm:inline-flex px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                theme === "light"
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-gray-800 text-gray-200 hover:bg-gray-700"
              }`}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
