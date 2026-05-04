"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";

type Theme = "light" | "dark";

type AppNavbarProps = {
  theme: Theme;
  active: "dashboard" | "contacts";
  onToggleTheme: () => void;
  onAddContact?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

export function AppNavbar({
  theme,
  active,
  onToggleTheme,
  onAddContact,
  searchValue = "",
  onSearchChange,
}: AppNavbarProps) {
  const { data: session } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  return (
    <nav
      className={`sticky top-0 z-20 w-full border-b backdrop-blur-xl ${
        theme === "light"
          ? "bg-white/85 border-slate-200/80 shadow-[0_1px_0_rgba(15,23,42,0.03)]"
          : "bg-slate-950/82 border-slate-800/80 shadow-[0_1px_0_rgba(255,255,255,0.04)]"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-2.5 md:gap-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-1 py-1 text-xl font-semibold tracking-tight"
        >
          <Image
            src="/networkia-logo.png"
            alt="Networkia logo"
            width={34}
            height={34}
            className="h-8 w-8 rounded-md"
            priority
          />
          <span
            className={`hidden sm:inline ${
              theme === "light" ? "text-slate-950" : "text-slate-50"
            }`}
          >
            Networkia
          </span>
        </Link>
        <div className="min-w-0 flex-1 overflow-x-auto">
          <div
            className={`ml-auto flex w-fit items-center gap-1 whitespace-nowrap rounded-lg border p-1 text-sm font-medium ${
              theme === "light"
                ? "border-slate-200 bg-slate-100/80 text-slate-600"
                : "border-slate-800 bg-slate-900/80 text-slate-300"
            }`}
          >
          <Link
            href="/"
            className={`rounded-md px-3 py-1.5 transition-colors ${
              active === "dashboard"
                ? theme === "light"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "bg-slate-800 text-white shadow-sm"
                : theme === "light"
                ? "hover:bg-white/70 hover:text-slate-950"
                : "hover:bg-slate-800/70 hover:text-white"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/contacts"
            className={`rounded-md px-3 py-1.5 transition-colors ${
              active === "contacts"
                ? theme === "light"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "bg-slate-800 text-white shadow-sm"
                : theme === "light"
                ? "hover:bg-white/70 hover:text-slate-950"
                : "hover:bg-slate-800/70 hover:text-white"
            }`}
          >
            Contacts
          </Link>
          {onAddContact && (
            <button
              onClick={onAddContact}
              className={`rounded-md px-3 py-1.5 transition-colors ${
                theme === "light"
                  ? "hover:bg-white/70 hover:text-slate-950"
                  : "hover:bg-slate-800/70 hover:text-white"
              }`}
            >
              Add new
            </button>
          )}
        </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {isSearchOpen ? (
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(event) => onSearchChange?.(event.target.value)}
              onBlur={() => {
                if (!searchValue) {
                  setIsSearchOpen(false);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setIsSearchOpen(false);
                  onSearchChange?.("");
                }
              }}
              className={`h-9 w-[min(46vw,260px)] rounded-lg border px-3 text-sm transition-all duration-200 ${
                theme === "light"
                  ? "border-slate-300 bg-white text-slate-950 placeholder-slate-400 focus:border-[#00a4bd] focus:ring-4 focus:ring-cyan-500/10"
                  : "border-slate-700 bg-slate-900 text-slate-100 placeholder-slate-500 focus:border-[#00a4bd] focus:ring-4 focus:ring-cyan-500/10"
              } focus:outline-none`}
            />
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`grid h-9 w-9 place-items-center rounded-lg border transition-all duration-200 text-base ${
                theme === "light"
                  ? "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950"
                  : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white"
              }`}
              aria-label="Open search"
            >
              🔍
            </button>
          )}
          <button
            onClick={onToggleTheme}
            className={`grid h-9 w-9 place-items-center rounded-lg border transition-all duration-200 text-base ${
              theme === "light"
                ? "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950"
                : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white"
            }`}
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          {!session && (
            <button
              onClick={() => signIn("google")}
              className={`hidden h-9 items-center rounded-lg px-3 text-sm font-semibold transition-all duration-200 sm:inline-flex ${
                theme === "light"
                  ? "bg-slate-950 text-white hover:bg-slate-800"
                  : "bg-white text-slate-950 hover:bg-slate-200"
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
