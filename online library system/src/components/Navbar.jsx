import React from "react";
import { useApp } from "../context/AppContext";

const pages = {
  student: [
    { id: "catalog", label: "Library Catalog", icon: "📚" },
    { id: "studentDashboard", label: "My Dashboard", icon: "🎓" },
  ],
  admin: [
    { id: "adminDashboard", label: "Dashboard", icon: "⚡" },
    { id: "catalog", label: "Catalog View", icon: "📚" },
  ],
};

const Navbar = ({ currentPage, setCurrentPage }) => {
  const { currentUser, logout } = useApp();

  if (!currentUser) return null;

  const navLinks = pages[currentUser.type] || [];

  return (
    <header className="sticky top-0 z-50 border-b border-surface-border" style={{ background: "rgba(15,15,26,0.9)", backdropFilter: "blur(16px)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4f46e5, #d946ef)" }}>
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="font-display font-bold text-base text-white leading-none">LibraryOS</h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none mt-0.5">
                {currentUser.type === "admin" ? "Admin Portal" : "Student Portal"}
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setCurrentPage(link.id)}
                className={`nav-link flex items-center gap-2 ${currentPage === link.id ? "active" : ""}`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </button>
            ))}
          </nav>

          {/* User + Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #4f46e5, #d946ef)" }}>
                {currentUser.type === "admin"
                  ? "A"
                  : (currentUser.avatar || currentUser.name?.slice(0, 2).toUpperCase())}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white leading-none">{currentUser.name}</p>
                <p className="text-[11px] text-gray-500 leading-none mt-0.5">{currentUser.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="btn-secondary flex items-center gap-2 text-xs"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden gap-1 pb-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setCurrentPage(link.id)}
              className={`nav-link flex-1 text-center text-xs py-1.5 ${currentPage === link.id ? "active" : ""}`}
            >
              {link.icon} {link.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
