"use client";

import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useContacts } from "@/hooks/use-contacts";

type Theme = "light" | "dark";

export default function Home() {
  const { data: session, status } = useSession();
  const [theme, setTheme] = useState<Theme>("light");
  const [newContactName, setNewContactName] = useState("");

  // This hook automatically switches between demo and live data
  const { contacts, isLoading, addContact, deleteContact, isDemo } = useContacts();

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document and save to localStorage
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim()) return;

    await addContact({ name: newContactName });
    setNewContactName("");
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="flex flex-col gap-8 items-center max-w-3xl w-full">
        {/* Theme toggle in top right */}
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-lg transition-colors text-xl ${
              theme === "light"
                ? "bg-gray-200 hover:bg-gray-300"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>

        <h1 className="text-4xl font-bold text-center">
          Welcome to Networkia
        </h1>

        {/* Demo/Live indicator */}
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isDemo
              ? theme === "light"
                ? "bg-amber-100 text-amber-800"
                : "bg-amber-900 text-amber-200"
              : theme === "light"
              ? "bg-green-100 text-green-800"
              : "bg-green-900 text-green-200"
          }`}
        >
          {isDemo ? "Demo Mode (localStorage)" : "Live Mode (server data)"}
        </div>

        {session ? (
          // Logged in view
          <div className="flex flex-col gap-6 items-center w-full">
            <div
              className={`flex items-center gap-4 p-6 rounded-lg w-full ${
                theme === "light" ? "bg-gray-100" : "bg-gray-800"
              }`}
            >
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div className="flex-1">
                <p className="text-xl font-semibold">{session.user?.name}</p>
                <p
                  className={
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  }
                >
                  {session.user?.email}
                </p>
              </div>
            </div>

            <button
              onClick={() => signOut()}
              className="px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          // Logged out view
          <div className="flex flex-col gap-6 items-center">
            <p className="text-center text-lg">
              Your personal CRM for managing relationships and networks.
            </p>
            <p
              className={`text-center text-sm ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Try the demo below, then sign in to save your real data!
            </p>

            <button
              onClick={() => signIn("google")}
              className={`flex items-center justify-center gap-3 px-6 py-3 border rounded-lg transition-colors ${
                theme === "light"
                  ? "border-gray-300 hover:bg-gray-50 text-black"
                  : "border-gray-700 hover:bg-gray-800 text-white"
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
          </div>
        )}

        {/* Contacts demo section */}
        <div className="w-full space-y-4">
          <h2 className="text-2xl font-semibold">Your Contacts</h2>

          {/* Add contact form */}
          <form onSubmit={handleAddContact} className="flex gap-2">
            <input
              type="text"
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
              placeholder="Add a contact..."
              className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === "light"
                  ? "border-gray-300 bg-white text-black placeholder:text-gray-400"
                  : "border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
              }`}
            />
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              Add
            </button>
          </form>

          {/* Contacts list */}
          <div className="space-y-2">
            {contacts.length === 0 ? (
              <p
                className={`text-center py-8 ${
                  theme === "light" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                No contacts yet. Add one above!
              </p>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    theme === "light" ? "bg-gray-100" : "bg-gray-800"
                  }`}
                >
                  <div className="flex-1">
                    <p className="font-semibold">{contact.name}</p>
                    {contact.email && (
                      <p
                        className={`text-sm ${
                          theme === "light" ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {contact.email}
                      </p>
                    )}
                    {contact.company && (
                      <p
                        className={`text-sm ${
                          theme === "light" ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {contact.company}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
