"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Theme = "light" | "dark";

export default function CharacterDemo2() {
  const [theme, setTheme] = useState<Theme>("light");
  const [isEditing, setIsEditing] = useState<string | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-300">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              theme === "light"
                ? "hover:bg-gray-100 text-gray-700"
                : "hover:bg-gray-800 text-gray-300"
            }`}
          >
            <span className="text-lg">←</span>
            <span className="font-medium">Back to Contacts</span>
          </Link>
          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-lg transition-all duration-200 text-xl ${
              theme === "light"
                ? "bg-gray-100 hover:bg-gray-200 hover:scale-105"
                : "bg-gray-800 hover:bg-gray-700 hover:scale-105"
            }`}
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
          {/* Left Sidebar - Profile & Contact */}
          <div className="space-y-8">
            {/* Profile Card */}
            <div
              className={`rounded-2xl py-6 pl-6 pr-4 border transition-all duration-300 ${
                theme === "light"
                  ? "bg-white border-gray-200 shadow-sm hover:shadow-md"
                  : "bg-gray-800 border-gray-700 shadow-xl"
              }`}
            >
              <div className="flex flex-col items-center text-center mb-6">
                {/* Character Photo */}
                <div className="relative group mb-4">
                  <div
                    className={`w-32 h-32 rounded-full border-4 transition-all duration-300 ${
                      theme === "light"
                        ? "border-blue-400 group-hover:border-blue-500"
                        : "border-cyan-400 group-hover:border-cyan-300"
                    } overflow-hidden bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 shadow-lg group-hover:shadow-xl group-hover:scale-105`}
                  >
                    <div className="w-full h-full flex items-center justify-center text-white text-5xl font-bold">
                      EN
                    </div>
                  </div>
                  {/* Photo upload hint on hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-black bg-opacity-50 text-white text-xs px-3 py-1 rounded-full">
                      Change photo
                    </div>
                  </div>
                </div>

                {/* Name and Title */}
                <div className="mb-4 space-y-1">
                  <h1 className="text-2xl font-bold tracking-tight">Edward Norton</h1>
                  <p
                    className={`text-base ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    Film Director & Producer
                  </p>
                  <p
                    className={`text-sm flex items-center justify-center gap-1 ${
                      theme === "light" ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    <span>📍</span>
                    <span>Los Angeles, CA</span>
                  </p>
                </div>

                {/* Circles */}
                <div className="flex flex-wrap gap-2 justify-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${
                      theme === "light"
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                        : "bg-blue-900 text-blue-200 hover:bg-blue-800"
                    }`}
                  >
                    Close Friend
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${
                      theme === "light"
                        ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        : "bg-purple-900 text-purple-200 hover:bg-purple-800"
                    }`}
                  >
                    Film
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${
                      theme === "light"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-green-900 text-green-200 hover:bg-green-800"
                    }`}
                  >
                    Environment
                  </span>
                </div>
              </div>

              {/* Contact Info Section */}
              <div className={`pt-6 border-t ${theme === "light" ? "border-gray-200" : "border-gray-700"}`}>
                <div className="space-y-3">
                <div className="grid grid-cols-[80px_1fr] gap-2 items-start group">
                  <div
                    className={`text-xs font-semibold ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Email
                  </div>
                  <div
                    className={`text-sm font-medium transition-colors ${
                      theme === "light"
                        ? "text-gray-900 group-hover:text-blue-600"
                        : "text-gray-100 group-hover:text-cyan-400"
                    }`}
                  >
                    ed.norton@gmail.com
                  </div>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 items-start group">
                  <div
                    className={`text-xs font-semibold ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Phone
                  </div>
                  <div
                    className={`text-sm font-medium transition-colors ${
                      theme === "light"
                        ? "text-gray-900 group-hover:text-blue-600"
                        : "text-gray-100 group-hover:text-cyan-400"
                    }`}
                  >
                    +1 (310) 555-8834
                  </div>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 items-start group">
                  <div
                    className={`text-xs font-semibold ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Work
                  </div>
                  <div>
                    <div
                      className={`text-sm font-medium ${
                        theme === "light" ? "text-gray-900" : "text-gray-100"
                      }`}
                    >
                      Class 5 Films
                    </div>
                    <div
                      className={`text-xs ${
                        theme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Co-founder & Director
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 items-start group">
                  <div
                    className={`text-xs font-semibold ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Website
                  </div>
                  <a
                    href="#"
                    className={`text-sm font-medium transition-colors ${
                      theme === "light"
                        ? "text-blue-600 hover:text-blue-700"
                        : "text-cyan-400 hover:text-cyan-300"
                    }`}
                  >
                    edwardnorton.com
                  </a>
                </div>

                <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                  <div
                    className={`text-xs font-semibold ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Status
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      theme === "light" ? "text-gray-900" : "text-gray-100"
                    }`}
                  >
                    Married
                  </div>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                  <div
                    className={`text-xs font-semibold ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Spouse
                  </div>
                  <div>
                    <div
                      className={`text-sm font-medium ${
                        theme === "light" ? "text-gray-900" : "text-gray-100"
                      }`}
                    >
                      Shauna Robertson
                    </div>
                    <div
                      className={`text-xs ${
                        theme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Producer
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                  <div
                    className={`text-xs font-semibold ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Kids
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      theme === "light" ? "text-gray-900" : "text-gray-100"
                    }`}
                  >
                    Atlas, 11
                  </div>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                  <div
                    className={`text-xs font-semibold ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Nationality
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      theme === "light" ? "text-gray-900" : "text-gray-100"
                    }`}
                  >
                    American
                  </div>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                  <div
                    className={`text-xs font-semibold ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Education
                  </div>
                  <div>
                    <div
                      className={`text-sm font-medium ${
                        theme === "light" ? "text-gray-900" : "text-gray-100"
                      }`}
                    >
                      Yale University
                    </div>
                    <div
                      className={`text-xs ${
                        theme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      History major, Japanese studies
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                  <div
                    className={`text-xs font-semibold ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Birthday
                  </div>
                  <div>
                    <div
                      className={`text-sm font-medium ${
                        theme === "light" ? "text-gray-900" : "text-gray-100"
                      }`}
                    >
                      August 18
                    </div>
                    <div
                      className={`text-xs ${
                        theme === "light" ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      Age 54
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                  <div
                    className={`text-xs font-semibold ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Circle
                  </div>
                  <div
                    className={`text-sm space-y-1 ${
                      theme === "light" ? "text-gray-900" : "text-gray-100"
                    }`}
                  >
                    <div>Wes Anderson</div>
                    <div>Brad Pitt</div>
                    <div>Aaron Sorkin</div>
                  </div>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                  <div
                    className={`text-xs font-semibold ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    How We Met
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      theme === "light" ? "text-gray-900" : "text-gray-100"
                    }`}
                  >
                    Met through mutual friend at Sundance 2019, bonded over documentary filmmaking
                  </div>
                </div>
                <div className="grid grid-cols-[80px_1fr] gap-2 items-start">
                  <div
                    className={`text-xs font-semibold ${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    Interests
                  </div>
                  <div
                    className={`text-sm space-y-1 ${
                      theme === "light" ? "text-gray-900" : "text-gray-100"
                    }`}
                  >
                    <div>Environmental conservation</div>
                    <div>Japanese culture & language</div>
                    <div>Meditation & mindfulness</div>
                    <div>Architecture</div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>

          {/* Right Main Area - Character Bio */}
          <div className="space-y-8">
            {/* Activity Summary */}
            <div
              className={`rounded-2xl px-6 py-4 border transition-all duration-300 ${
                theme === "light"
                  ? "bg-white border-gray-200 shadow-sm"
                  : "bg-gray-800 border-gray-700 shadow-xl"
              }`}
            >
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <span
                  className={`text-xs font-semibold ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Last Contacted:
                </span>
                <button
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 ${
                    theme === "light"
                      ? "border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-900"
                      : "border-gray-700 hover:border-cyan-500 hover:bg-gray-800 text-gray-100"
                  }`}
                >
                  Jan 10 (3d ago)
                </button>
                <button
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                    theme === "light"
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-cyan-600 hover:bg-cyan-500 text-white"
                  }`}
                >
                  Set to Now
                </button>
                <div
                  className={`h-4 w-px ${
                    theme === "light" ? "bg-gray-300" : "bg-gray-600"
                  }`}
                ></div>
                <span
                  className={`text-xs font-semibold ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Contact Every:
                </span>
                <button
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 ${
                    theme === "light"
                      ? "border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-900"
                      : "border-gray-700 hover:border-cyan-500 hover:bg-gray-800 text-gray-100"
                  }`}
                >
                  2 weeks
                </button>
                <span
                  className={`text-xs ${
                    theme === "light" ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  (Next: Jan 24)
                </span>
              </div>
            </div>

            {/* Profile Overview - Combined impression, context & background */}
            <div
              className={`rounded-2xl p-8 border transition-all duration-300 ${
                theme === "light"
                  ? "bg-white border-gray-200 shadow-sm hover:shadow-md"
                  : "bg-gray-800 border-gray-700 shadow-xl"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-xs font-bold uppercase tracking-wider ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  What I Think
                </h2>
                <button
                  className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                    theme === "light"
                      ? "text-blue-600 hover:bg-blue-50"
                      : "text-cyan-400 hover:bg-gray-700"
                  }`}
                >
                  Edit
                </button>
              </div>

              {/* Personal impression */}
              <div
                className={`text-base leading-relaxed space-y-4 ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                }`}
              >
                <p>
                  Incredibly thoughtful and deliberate in everything he does. Doesn't just act or direct - he thinks deeply about the meaning and impact of stories.
                </p>
                <p>
                  Really cares about environmental issues, not just as talking points but genuinely invested. Started a solar company and does real work in conservation. Appreciates when you engage on those topics.
                </p>
                <p>
                  Not someone who likes small talk. Prefers deep conversations about ideas, philosophy, or specific projects. Once you get him talking about film technique or adaptation, he's fascinating.
                </p>
              </div>
            </div>

            {/* Updates Panel - Journal entries */}
            <div
              className={`rounded-2xl p-8 border transition-all duration-300 ${
                theme === "light"
                  ? "bg-white border-gray-200 shadow-sm hover:shadow-md"
                  : "bg-gray-800 border-gray-700 shadow-xl"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-xs font-bold uppercase tracking-wider ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Updates
                </h2>
                <button
                  className={`text-sm px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow ${
                    theme === "light"
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-cyan-600 hover:bg-cyan-500 text-white"
                  }`}
                >
                  + Add New
                </button>
              </div>

              <div className="space-y-6">
                {/* Interaction Entry 1 - Journal style */}
                <div
                  className={`p-6 rounded-xl border transition-all duration-200 ${
                    theme === "light"
                      ? "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                      : "bg-gray-900 border-gray-700 hover:bg-gray-850 hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div
                        className={`font-semibold text-base mb-1 ${
                          theme === "light" ? "text-gray-900" : "text-gray-100"
                        }`}
                      >
                        Coffee Meeting
                      </div>
                      <div
                        className={`text-xs font-medium ${
                          theme === "light" ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        January 10, 2024 · 3 days ago
                      </div>
                    </div>
                    <button
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                        theme === "light"
                          ? "text-blue-600 hover:bg-blue-50"
                          : "text-cyan-400 hover:bg-gray-800"
                      }`}
                    >
                      Edit
                    </button>
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Caught up on her new role at Tesla. She's leading the
                    charging infrastructure project and is <strong>super excited</strong> about
                    it. Discussed potential collaboration on a climate tech side
                    project.
                  </p>
                </div>

                {/* Interaction Entry 2 */}
                <div
                  className={`p-6 rounded-xl border transition-all duration-200 ${
                    theme === "light"
                      ? "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                      : "bg-gray-900 border-gray-700 hover:bg-gray-850 hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div
                        className={`font-semibold text-base mb-1 ${
                          theme === "light" ? "text-gray-900" : "text-gray-100"
                        }`}
                      >
                        Dinner at Mission Chinese
                      </div>
                      <div
                        className={`text-xs font-medium ${
                          theme === "light" ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        December 5, 2023 · 1 month ago
                      </div>
                    </div>
                    <button
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                        theme === "light"
                          ? "text-blue-600 hover:bg-blue-50"
                          : "text-cyan-400 hover:bg-gray-800"
                      }`}
                    >
                      Edit
                    </button>
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Celebrated her promotion! She recommended{" "}
                    <em>"The Ministry for the Future"</em> book. Had a long
                    conversation about AI ethics and climate models.
                  </p>
                </div>

                {/* Interaction Entry 3 */}
                <div
                  className={`p-6 rounded-xl border transition-all duration-200 ${
                    theme === "light"
                      ? "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                      : "bg-gray-900 border-gray-700 hover:bg-gray-850 hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div
                        className={`font-semibold text-base mb-1 ${
                          theme === "light" ? "text-gray-900" : "text-gray-100"
                        }`}
                      >
                        Quick phone call
                      </div>
                      <div
                        className={`text-xs font-medium ${
                          theme === "light" ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        November 2, 2023 · 2 months ago
                      </div>
                    </div>
                    <button
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                        theme === "light"
                          ? "text-blue-600 hover:bg-blue-50"
                          : "text-cyan-400 hover:bg-gray-800"
                      }`}
                    >
                      Edit
                    </button>
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    She asked for feedback on her Tesla offer. Discussed
                    pros/cons of moving from Google. I recommended taking it -
                    seemed like a great opportunity for her.
                  </p>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      theme === "light"
                        ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    }`}
                  >
                    ← Previous
                  </button>
                  <span
                    className={`text-sm ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    Page 1 of 8
                  </span>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      theme === "light"
                        ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Quick Add Button */}
      <button
        className={`fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center text-2xl ${
          theme === "light"
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-cyan-600 hover:bg-cyan-500 text-white"
        }`}
        aria-label="Quick add interaction"
      >
        ✨
      </button>
    </div>
  );
}
