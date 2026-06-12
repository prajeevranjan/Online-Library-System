import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const LoginPage = () => {
  const { loginAdmin, loginStudent, addNotification } = useApp();
  const [mode, setMode] = useState("student"); // 'student' | 'admin'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate slight delay for feel
    await new Promise((r) => setTimeout(r, 600));

    let success = false;
    if (mode === "admin") {
      success = loginAdmin(email, password);
    } else {
      success = loginStudent(email, password);
    }

    if (!success) {
      setError("Invalid email or password. Please try again.");
    } else {
      addNotification(`Welcome back! Logged in as ${mode}.`);
    }
    setLoading(false);
  };

  const fillDemo = () => {
    if (mode === "admin") {
      setEmail("admin@library.edu");
      setPassword("admin123");
    } else {
      setEmail("alice@university.edu");
      setPassword("student123");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "#0f0f1a" }}>
      {/* Background blobs */}
      <div className="blob w-96 h-96 opacity-20" style={{ background: "#4f46e5", top: "-100px", left: "-100px" }} />
      <div className="blob w-80 h-80 opacity-15" style={{ background: "#d946ef", bottom: "-80px", right: "-80px" }} />
      <div className="blob w-64 h-64 opacity-10" style={{ background: "#7c3aed", top: "50%", left: "50%" }} />

      <div className="relative z-10 w-full max-w-md px-4 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl items-center justify-center mb-4" style={{ background: "linear-gradient(135deg, #4f46e5, #d946ef)", boxShadow: "0 0 40px rgba(99,102,241,0.4)" }}>
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="font-display font-bold text-3xl text-white">LibraryOS</h1>
          <p className="text-gray-400 text-sm mt-1">Your Digital Library Portal</p>
        </div>

        {/* Toggle */}
        <div className="glass-card p-1 rounded-2xl flex mb-6">
          {["student", "admin"].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); setEmail(""); setPassword(""); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 capitalize ${
                mode === m
                  ? "text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
              style={mode === m ? { background: "linear-gradient(135deg, #4f46e5, #7c3aed)" } : {}}
            >
              {m === "student" ? "🎓" : "⚡"} {m.charAt(0).toUpperCase() + m.slice(1)} Login
            </button>
          ))}
        </div>

        {/* Form Card */}
        <div className="glass-card p-8 rounded-2xl animate-slide-up">
          <h2 className="font-display font-bold text-xl text-white mb-1">
            {mode === "admin" ? "Admin Access" : "Student Access"}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {mode === "admin"
              ? "Manage books, students, and issue requests."
              : "Browse and request books from the library."}
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-400 border border-red-500/30 bg-red-500/10 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder={mode === "admin" ? "admin@library.edu" : "your@university.edu"}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : null}
              {loading ? "Signing in..." : `Sign in as ${mode.charAt(0).toUpperCase() + mode.slice(1)}`}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-5 pt-5 border-t border-surface-border">
            <p className="text-xs text-gray-600 text-center mb-2">Demo Credentials</p>
            <button
              onClick={fillDemo}
              className="w-full text-xs text-primary-400 hover:text-primary-300 transition-colors py-2 rounded-lg hover:bg-primary-500/10"
            >
              {mode === "admin"
                ? "admin@library.edu / admin123"
                : "alice@university.edu / student123"}
              <span className="ml-2 text-gray-500">← Click to fill</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
