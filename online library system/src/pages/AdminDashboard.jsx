import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const StatusBadge = ({ status }) => {
  const map = {
    pending: "badge-pending",
    approved: "badge-available",
    rejected: "badge-rejected",
    returned: "badge-returned",
  };
  const labels = {
    pending: "⏳ Pending",
    approved: "✅ Issued",
    rejected: "❌ Rejected",
    returned: "🔄 Returned",
  };
  return <span className={map[status] || "badge-pending"}>{labels[status] || status}</span>;
};

const StatCard = ({ icon, label, value, color, sub }) => (
  <div className="stat-card group">
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} style={{ background: `radial-gradient(circle at 20% 50%, ${color}15, transparent 70%)` }} />
    <div className="relative">
      <div className="flex items-start justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
          <div className="w-2 h-2 rounded-full animate-pulse-slow" style={{ background: color }} />
        </div>
      </div>
      <div className="text-3xl font-display font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
      {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
    </div>
  </div>
);

const AddBookModal = ({ onClose, onAdd }) => {
  const [form, setForm] = useState({
    title: "", author: "", genre: "", isbn: "", publishedYear: "", totalCopies: "1", description: "", cover: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    onClose();
  };

  const genres = ["Fiction", "Non-Fiction", "Fantasy", "Mystery", "Thriller", "Romance", "Science Fiction", "Dystopian", "Classic", "Biography", "History", "Science", "Technology", "Other"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div className="glass-card rounded-2xl w-full max-w-2xl animate-slide-up overflow-y-auto max-h-[90vh]">
        <div className="p-6 border-b border-surface-border flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-white">Add New Book</h2>
            <p className="text-gray-500 text-sm">Fill in the book details below</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Book Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required className="form-input" placeholder="The Great Gatsby" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Author *</label>
              <input name="author" value={form.author} onChange={handleChange} required className="form-input" placeholder="F. Scott Fitzgerald" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Genre *</label>
              <select name="genre" value={form.genre} onChange={handleChange} required className="form-input">
                <option value="">Select genre</option>
                {genres.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">ISBN</label>
              <input name="isbn" value={form.isbn} onChange={handleChange} className="form-input" placeholder="978-0-xxx-xxxxx-x" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Published Year</label>
              <input name="publishedYear" value={form.publishedYear} onChange={handleChange} type="number" min="1000" max="2099" className="form-input" placeholder="2024" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Total Copies *</label>
              <input name="totalCopies" value={form.totalCopies} onChange={handleChange} required type="number" min="1" className="form-input" placeholder="3" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Cover Image URL</label>
              <input name="cover" value={form.cover} onChange={handleChange} className="form-input" placeholder="https://example.com/cover.jpg" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="form-input resize-none" placeholder="Brief description of the book..." />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Add Book</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { books, issueRequests, stats, addBook, removeBook, approveRequest, rejectRequest, markReturned, getBookById, getStudentById } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [bookSearch, setBookSearch] = useState("");

  const pendingRequests = issueRequests.filter((r) => r.status === "pending");
  const activeIssues = issueRequests.filter((r) => r.status === "approved");
  const allRequests = issueRequests.filter((r) => r.status !== "pending");

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
      b.author.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "books", label: "Manage Books", icon: "📚" },
    { id: "requests", label: "Issue Management", icon: "📋" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="blob w-96 h-96 opacity-10 pointer-events-none" style={{ background: "#4f46e5", top: "10%", right: "-100px" }} />
      <div className="blob w-64 h-64 opacity-8 pointer-events-none" style={{ background: "#d946ef", bottom: "20%", left: "-60px" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display font-bold text-3xl text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage your library resources and student requests</p>
        </div>

        {/* Tabs */}
        <div className="glass-card p-1 rounded-2xl flex gap-1 mb-8 w-fit animate-fade-in">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab.id
                  ? "text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
              style={activeTab === tab.id ? { background: "linear-gradient(135deg, #4f46e5, #7c3aed)" } : {}}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon="📚" label="Total Books" value={stats.totalBooks} color="#6366f1" sub={`${stats.totalCopies} total copies`} />
              <StatCard icon="📤" label="Books Issued" value={stats.issuedBooks} color="#d946ef" sub="Currently out" />
              <StatCard icon="⏳" label="Pending Requests" value={stats.pendingRequests} color="#f59e0b" sub="Need attention" />
              <StatCard icon="🎓" label="Students" value={stats.totalStudents} color="#10b981" sub="Registered" />
            </div>

            {/* Pending quick-actions */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
                <span>⏳</span> Pending Requests
                {pendingRequests.length > 0 && <span className="badge-pending ml-2">{pendingRequests.length}</span>}
              </h3>
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">✅</div>
                  <p>All caught up! No pending requests.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.slice(0, 5).map((req) => {
                    const book = getBookById(req.bookId);
                    const student = getStudentById(req.studentId);
                    return (
                      <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white" style={{ background: "linear-gradient(135deg, #4f46e5, #d946ef)" }}>
                            {student?.avatar || "?"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{student?.name}</p>
                            <p className="text-xs text-gray-400">Requested: <span className="text-primary-400">{book?.title}</span></p>
                            <p className="text-xs text-gray-600">{req.requestDate}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => approveRequest(req.id)} className="btn-success text-xs">✅ Approve</button>
                          <button onClick={() => rejectRequest(req.id)} className="btn-danger text-xs">❌ Reject</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Active Issues */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
                <span>📤</span> Currently Issued Books
              </h3>
              {activeIssues.length === 0 ? (
                <div className="text-center py-6 text-gray-500">No books currently issued.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-surface-border">
                        <th className="pb-3 pr-4">Book</th>
                        <th className="pb-3 pr-4">Student</th>
                        <th className="pb-3 pr-4">Due Date</th>
                        <th className="pb-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border/50">
                      {activeIssues.map((req) => {
                        const book = getBookById(req.bookId);
                        const student = getStudentById(req.studentId);
                        const isOverdue = req.dueDate && new Date(req.dueDate) < new Date();
                        return (
                          <tr key={req.id} className="group hover:bg-white/2 transition-colors">
                            <td className="py-3 pr-4 font-medium text-white">{book?.title}</td>
                            <td className="py-3 pr-4 text-gray-300">{student?.name}</td>
                            <td className="py-3 pr-4">
                              <span className={isOverdue ? "text-red-400 font-semibold" : "text-gray-400"}>
                                {req.dueDate} {isOverdue && "⚠️ Overdue"}
                              </span>
                            </td>
                            <td className="py-3">
                              <button onClick={() => markReturned(req.id)} className="btn-secondary text-xs px-3 py-1.5">
                                🔄 Mark Returned
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BOOKS TAB */}
        {activeTab === "books" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  className="form-input pl-9"
                  placeholder="Search books..."
                />
              </div>
              <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Add New Book
              </button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead style={{ background: "rgba(99,102,241,0.08)" }}>
                    <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-4">Book</th>
                      <th className="px-6 py-4">Genre</th>
                      <th className="px-6 py-4">Copies</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border/50">
                    {filteredBooks.map((book) => (
                      <tr key={book.id} className="group hover:bg-white/2 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0" style={{ background: "rgba(99,102,241,0.15)" }}>
                              {book.cover ? (
                                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-lg">📖</div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{book.title}</p>
                              <p className="text-xs text-gray-500">{book.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400">{book.genre}</td>
                        <td className="px-6 py-4">
                          <span className="text-white font-semibold">{book.availableCopies}</span>
                          <span className="text-gray-500">/{book.totalCopies}</span>
                        </td>
                        <td className="px-6 py-4">
                          {book.availableCopies === 0
                            ? <span className="badge-issued">Fully Issued</span>
                            : <span className="badge-available">Available</span>}
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => removeBook(book.id)} className="btn-danger text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                            🗑 Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredBooks.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-2">🔍</div>
                    <p>No books found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* REQUESTS TAB */}
        {activeTab === "requests" && (
          <div className="space-y-6 animate-fade-in">
            {/* Pending */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="font-display font-bold text-lg text-white mb-4">⏳ Pending Requests</h3>
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">✅</div>
                  <p>No pending requests!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((req) => {
                    const book = getBookById(req.bookId);
                    const student = getStudentById(req.studentId);
                    return (
                      <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-semibold">{student?.name}</span>
                            <span className="text-gray-500 text-xs">({student?.rollNumber})</span>
                          </div>
                          <p className="text-sm text-gray-400">Requested: <span className="text-primary-400 font-medium">{book?.title}</span></p>
                          <p className="text-xs text-gray-600">Date: {req.requestDate}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => approveRequest(req.id)} className="btn-success">✅ Approve</button>
                          <button onClick={() => rejectRequest(req.id)} className="btn-danger">❌ Reject</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Active Issues with Return */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="font-display font-bold text-lg text-white mb-4">📤 Issued Books</h3>
              {activeIssues.length === 0 ? (
                <div className="text-center py-6 text-gray-500">No books currently issued.</div>
              ) : (
                <div className="space-y-3">
                  {activeIssues.map((req) => {
                    const book = getBookById(req.bookId);
                    const student = getStudentById(req.studentId);
                    const isOverdue = req.dueDate && new Date(req.dueDate) < new Date();
                    return (
                      <div key={req.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl ${isOverdue ? "border-red-500/30 bg-red-500/5" : ""}`} style={!isOverdue ? { background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" } : { border: "1px solid rgba(239,68,68,0.3)" }}>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-semibold">{student?.name}</span>
                            {isOverdue && <span className="badge-issued text-xs">Overdue</span>}
                          </div>
                          <p className="text-sm text-gray-400">Book: <span className="text-primary-400 font-medium">{book?.title}</span></p>
                          <p className="text-xs text-gray-500">Due: {req.dueDate} · Issued: {req.issueDate}</p>
                        </div>
                        <button onClick={() => markReturned(req.id)} className="btn-secondary text-xs">🔄 Mark Returned</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* History */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="font-display font-bold text-lg text-white mb-4">📜 Request History</h3>
              <div className="space-y-2">
                {allRequests.map((req) => {
                  const book = getBookById(req.bookId);
                  const student = getStudentById(req.studentId);
                  return (
                    <div key={req.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/2 transition-colors">
                      <div className="flex items-center gap-3">
                        <StatusBadge status={req.status} />
                        <div>
                          <span className="text-sm text-white">{student?.name}</span>
                          <span className="text-gray-600 mx-2">→</span>
                          <span className="text-sm text-gray-400">{book?.title}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600">{req.returnDate || req.dueDate || req.requestDate}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {showAddModal && <AddBookModal onClose={() => setShowAddModal(false)} onAdd={addBook} />}
    </div>
  );
};

export default AdminDashboard;
