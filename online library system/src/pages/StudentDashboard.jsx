import React from "react";
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
    approved: "✅ Active",
    rejected: "❌ Rejected",
    returned: "🔄 Returned",
  };
  return <span className={map[status] || "badge-pending"}>{labels[status] || status}</span>;
};

const DaysLeft = ({ dueDate }) => {
  if (!dueDate) return null;
  const today = new Date();
  const due = new Date(dueDate);
  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  if (diff < 0) return <span className="text-xs text-red-400 font-semibold">⚠️ {Math.abs(diff)} days overdue</span>;
  if (diff <= 3) return <span className="text-xs text-yellow-400 font-semibold">⏰ {diff} days left</span>;
  return <span className="text-xs text-emerald-400">{diff} days remaining</span>;
};

const StudentDashboard = () => {
  const { currentUser, getRequestsForStudent, getBookById } = useApp();

  const myRequests = getRequestsForStudent(currentUser.id);
  const activeBooks = myRequests.filter((r) => r.status === "approved");
  const pendingRequests = myRequests.filter((r) => r.status === "pending");
  const historyRequests = myRequests.filter((r) => r.status === "rejected" || r.status === "returned");

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="blob w-80 h-80 opacity-10 pointer-events-none" style={{ background: "#4f46e5", top: "5%", right: "-80px" }} />
      <div className="blob w-56 h-56 opacity-8 pointer-events-none" style={{ background: "#d946ef", bottom: "10%", left: "-40px" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white" style={{ background: "linear-gradient(135deg, #4f46e5, #d946ef)" }}>
              {currentUser.avatar}
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl text-white">Hello, {currentUser.name.split(" ")[0]}! 👋</h1>
              <p className="text-gray-400 mt-0.5">{currentUser.rollNumber} · {currentUser.department}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 animate-slide-up">
          {[
            { label: "Books Issued", value: activeBooks.length, icon: "📚", color: "#6366f1" },
            { label: "Pending Requests", value: pendingRequests.length, icon: "⏳", color: "#f59e0b" },
            { label: "Total Borrowed", value: myRequests.filter(r => r.status !== 'rejected').length, icon: "🏆", color: "#10b981" },
          ].map((s) => (
            <div key={s.label} className="glass-card p-4 sm:p-6 rounded-2xl text-center transition-transform duration-300 hover:-translate-y-1">
              <div className="text-2xl sm:text-3xl mb-2">{s.icon}</div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-white">{s.value}</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Currently Issued */}
        <div className="glass-card p-6 rounded-2xl mb-6 animate-slide-up">
          <h2 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-2">
            <span>📖</span> Currently Issued Books
            <span className="badge-available ml-1">{activeBooks.length}</span>
          </h2>

          {activeBooks.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-gray-400">No books currently issued.</p>
              <p className="text-gray-600 text-sm mt-1">Browse the catalog to request books!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeBooks.map((req) => {
                const book = getBookById(req.bookId);
                if (!book) return null;
                const isOverdue = req.dueDate && new Date(req.dueDate) < new Date();
                return (
                  <div
                    key={req.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl transition-all duration-300 hover:scale-[1.01]"
                    style={{
                      background: isOverdue ? "rgba(239,68,68,0.06)" : "rgba(99,102,241,0.06)",
                      border: `1px solid ${isOverdue ? "rgba(239,68,68,0.25)" : "rgba(99,102,241,0.2)"}`,
                    }}
                  >
                    <div className="w-16 h-24 rounded-xl overflow-hidden flex-shrink-0" style={{ background: "rgba(99,102,241,0.15)" }}>
                      {book.cover ? (
                        <img src={book.cover} alt={book.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">📖</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-lg">{book.title}</h3>
                      <p className="text-gray-400 text-sm">{book.author}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <StatusBadge status={req.status} />
                        <span className="text-xs text-gray-500">Issued: {req.issueDate}</span>
                        <span className="text-xs text-gray-500">Due: {req.dueDate}</span>
                        <DaysLeft dueDate={req.dueDate} />
                      </div>
                    </div>
                    {isOverdue && (
                      <div className="self-start sm:self-center px-3 py-1.5 rounded-lg text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20">
                        ⚠️ Overdue
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pending Requests */}
        <div className="glass-card p-6 rounded-2xl mb-6 animate-slide-up">
          <h2 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-2">
            <span>⏳</span> Pending Requests
            {pendingRequests.length > 0 && <span className="badge-pending ml-1">{pendingRequests.length}</span>}
          </h2>

          {pendingRequests.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-gray-400 text-sm">No pending requests.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => {
                const book = getBookById(req.bookId);
                return (
                  <div key={req.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}>
                    <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0" style={{ background: "rgba(245,158,11,0.15)" }}>
                      {book?.cover ? (
                        <img src={book.cover} alt={book.title} className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">📖</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white text-sm">{book?.title}</p>
                      <p className="text-xs text-gray-400">{book?.author}</p>
                      <p className="text-xs text-gray-600 mt-1">Requested on {req.requestDate}</p>
                    </div>
                    <StatusBadge status="pending" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* History */}
        {historyRequests.length > 0 && (
          <div className="glass-card p-6 rounded-2xl animate-slide-up">
            <h2 className="font-display font-bold text-xl text-white mb-4 flex items-center gap-2">
              <span>📜</span> Request History
            </h2>
            <div className="space-y-2">
              {historyRequests.map((req) => {
                const book = getBookById(req.bookId);
                return (
                  <div key={req.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/2 transition-colors">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={req.status} />
                      <span className="text-sm text-gray-400">{book?.title}</span>
                    </div>
                    <span className="text-xs text-gray-600">{req.returnDate || req.requestDate}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
